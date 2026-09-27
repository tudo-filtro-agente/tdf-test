// lib/pdv-ledger.js — livro-razão local da venda de balcão.
//
// Gravado ANTES de qualquer chamada externa. É ele que dá idempotência
// (chave `idem` vinda da tela) e é dele que o reconciliador come.
// Segue o padrão de lib/bi-estoque-db.js: pool injetado + ensureTables idempotente.

let _pool = null;
function setPool(pool) { _pool = pool; }

// 'sombra': venda validada mas NENHUMA chamada externa foi feita (Omie/Zoho) —
// usada no modo sombra (TDF_PDV_MODO_SOMBRA=1) pra evitar nota fiscal duplicada
// durante o dia de teste em paralelo com o sistema atual. Ver lib/bi-pdv.js.
//
// 'nf_pendente': o pedido nasceu no Omie, mas ValidarPedidoVenda avisou que
// falta algo pra Eloize conseguir emitir a nota depois (ex.: e-mail do
// cliente) — ver lib/bi-pdv.js e lib/omie-pdv.js#validarPedido. NÃO é uma
// falha: a venda aconteceu, o pedido existe; é só o sinal, gravado no
// livro-razão, de que este pedido específico precisa de atenção antes da
// nota sair. Distinto de 'nf_ok', mantido por compatibilidade com linhas
// antigas do banco — nunca mais gravado depois da mudança de 19/ago/2026
// (o PDV não fatura, então nenhuma linha nova chega a 'nf_ok').
const ESTADOS = ['aberta', 'omie_ok', 'nf_ok', 'nf_pendente', 'zoho_ok', 'completa', 'falhou', 'sombra'];

async function ensureTables() {
  if (!_pool) throw new Error('pdv-ledger: pool não inicializado');
  await _pool.query(`CREATE TABLE IF NOT EXISTS pdv_vendas (
    id TEXT PRIMARY KEY,
    idem TEXT UNIQUE NOT NULL,
    estado TEXT NOT NULL DEFAULT 'aberta',
    operador TEXT,
    empresa TEXT,
    total NUMERIC(12,2),
    payload JSONB,
    omie_pedido TEXT,
    omie_cliente TEXT,
    nf_chave TEXT,
    nf_pdf TEXT,
    zoho_deal_id TEXT,
    zoho_quote_id TEXT,
    erro TEXT,
    -- Autorização de desconto acima do teto do operador (5%, ver lib/bi-pdv.js
    -- DESCONTO_MAX_PCT_OPERADOR). Gravado NA ABERTURA da venda, junto com o
    -- payload — nunca a senha, só quem autorizou e o percentual/valor. É o
    -- que permite o dono auditar quem anda liberando desconto.
    desconto_autorizado_por TEXT,
    desconto_pct NUMERIC(5,2),
    desconto_valor NUMERIC(12,2),
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
  )`);
  // Migration idempotente: a tabela pode já existir em produção sem estas três
  // colunas (feature adicionada depois do CREATE TABLE original rodar lá).
  await _pool.query(`ALTER TABLE pdv_vendas ADD COLUMN IF NOT EXISTS desconto_autorizado_por TEXT`);
  await _pool.query(`ALTER TABLE pdv_vendas ADD COLUMN IF NOT EXISTS desconto_pct NUMERIC(5,2)`);
  await _pool.query(`ALTER TABLE pdv_vendas ADD COLUMN IF NOT EXISTS desconto_valor NUMERIC(12,2)`);
  await _pool.query(`CREATE INDEX IF NOT EXISTS pdv_vendas_estado_idx ON pdv_vendas (estado)`);
}

function _novoId() {
  return 'pdv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// descontoAutorizadoPor/descontoPct/descontoValor: preenchidos SÓ quando a
// venda usou autorização de supervisor pra passar do teto do operador (ver
// lib/bi-pdv.js). Gravados junto com a abertura — antes de qualquer chamada
// externa — pra o registro de auditoria existir mesmo que Omie/Zoho falhem
// depois. NUNCA a senha: quem chama já verificou a credencial antes de
// montar este argumento.
//
// REENVIO DO MESMO `idem` — ON CONFLICT DO UPDATE, não DO NOTHING. Cenário
// real: 1ª tentativa abre a linha (estado 'aberta'), falha no Omie (estado
// vira 'falhou' via marcar()); o operador sobe o desconto, o supervisor
// autoriza, e o mesmo `idem` volta com desconto/autorização NOVOS. Com DO
// NOTHING a venda seguia pro Omie com o desconto grande, mas a linha do
// livro-razão ficava com o total ANTIGO e `desconto_autorizado_por` NULL —
// exatamente o registro que o dono ia consultar pra auditar quem autorizou.
// A guarda `WHERE pdv_vendas.estado <> 'completa'` é o que impede o inverso:
// uma venda que JÁ FECHOU (nota emitida, Negócio confirmado) nunca pode ser
// reescrita por um reenvio tardio — a trava contra reabrir venda faturada.
// `(xmax = 0) AS inserted` é o jeito padrão do Postgres de dizer, na mesma
// RETURNING, se a linha nasceu agora (INSERT de verdade) ou já existia e
// foi atualizada pelo conflito — é dali que vem `novo`.
async function abrir({ idem, operador, empresa, total, payload,
                        descontoAutorizadoPor, descontoPct, descontoValor }) {
  if (!idem) throw new Error('pdv-ledger: idem obrigatório');
  const id = _novoId();
  const r = await _pool.query(
    `INSERT INTO pdv_vendas (idem, operador, empresa, total, payload, id,
       desconto_autorizado_por, desconto_pct, desconto_valor)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (idem) DO UPDATE SET
       total = EXCLUDED.total,
       payload = EXCLUDED.payload,
       desconto_autorizado_por = EXCLUDED.desconto_autorizado_por,
       desconto_pct = EXCLUDED.desconto_pct,
       desconto_valor = EXCLUDED.desconto_valor,
       atualizado_em = now()
     WHERE pdv_vendas.estado <> 'completa'
     RETURNING *, (xmax = 0) AS inserted`,
    [idem, operador, empresa, total, payload || {}, id,
     descontoAutorizadoPor || null, descontoPct != null ? descontoPct : null, descontoValor != null ? descontoValor : null]
  );
  if (r.rows.length) return { id: r.rows[0].id, estado: r.rows[0].estado, novo: !!r.rows[0].inserted };
  // Conflito bloqueado pelo WHERE — a linha existente está 'completa' e não
  // foi tocada. Só lê de volta pra devolver id/estado corretos ao chamador.
  const ja = await _pool.query(`SELECT * FROM pdv_vendas WHERE idem = $1`, [idem]);
  return { id: ja.rows[0].id, estado: ja.rows[0].estado, novo: false };
}

async function marcar(id, estado, dados) {
  if (!ESTADOS.includes(estado)) throw new Error('pdv-ledger: estado invalido — ' + estado);
  const d = dados || {};
  await _pool.query(
    `UPDATE pdv_vendas SET estado=$1, omie_pedido=COALESCE($2,omie_pedido),
       omie_cliente=COALESCE($3,omie_cliente), nf_chave=COALESCE($4,nf_chave),
       nf_pdf=COALESCE($5,nf_pdf), zoho_deal_id=COALESCE($6,zoho_deal_id),
       zoho_quote_id=COALESCE($7,zoho_quote_id), erro=COALESCE($8,erro),
       atualizado_em=now()
     WHERE id=$9`,
    [estado, d.omie_pedido || null, d.omie_cliente || null, d.nf_chave || null,
     d.nf_pdf || null, d.zoho_deal_id || null, d.zoho_quote_id || null, d.erro || null, id]
  );
}

async function pendentes() {
  const r = await _pool.query(
    `SELECT * FROM pdv_vendas WHERE estado <> 'completa' AND estado <> 'falhou'
      ORDER BY criado_em ASC LIMIT 200`);
  return r.rows;
}

// buscar() — leitura simples pela chave `id` (a do livro-razão) ou pela
// chave `idem` (a que veio da tela). Usada pelo caminho de venda REPETIDA em
// bi-pdv.js: quando o mesmo `idem` volta depois que a venda já chegou a
// 'completa', o operador precisa ver qual pedido/negócio já fechou, e a
// linha inteira (omie_pedido, zoho_deal_id etc.) só existe aqui — o retorno
// enxuto de abrir()/marcar() não carrega esses campos.
async function buscar({ id, idem } = {}) {
  if (id) {
    const r = await _pool.query(`SELECT * FROM pdv_vendas WHERE id = $1`, [id]);
    return r.rows[0] || null;
  }
  if (idem) {
    const r = await _pool.query(`SELECT * FROM pdv_vendas WHERE idem = $1`, [idem]);
    return r.rows[0] || null;
  }
  return null;
}

module.exports = { setPool, ensureTables, abrir, marcar, pendentes, buscar, ESTADOS };
