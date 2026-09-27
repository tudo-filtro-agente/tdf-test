const test = require('node:test');
const assert = require('node:assert');
const ledger = require('../lib/pdv-ledger');

// Pool falso: captura TODO SQL recebido (para asserções sobre o texto real,
// não só sobre o comportamento em JS) e modela o comportamento das cláusulas
// que de fato aparecem no SQL — não hardcoda o resultado independente do texto.
function poolFake() {
  const linhas = [];
  const queries = [];
  return {
    linhas,
    queries,
    query: async (sql, params) => {
      queries.push({ sql, params });
      if (/CREATE TABLE/i.test(sql)) return { rows: [] };
      if (/CREATE INDEX/i.test(sql)) return { rows: [] };
      if (/^INSERT INTO pdv_vendas/i.test(sql.trim())) {
        // Modela o comportamento a partir do TEXTO real do SQL — se a
        // implementação voltar a DO NOTHING, o pool falso deixa de
        // atualizar também, e os testes de reenvio quebram (mesmo padrão
        // já usado abaixo pro filtro de pendentes()).
        const doUpdate = /ON CONFLICT\s*\([^)]*\)\s*DO UPDATE/i.test(sql);
        const guardaCompleta = /WHERE[\s\S]*estado\s*<>\s*'completa'/i.test(sql);
        const idem = params[0];
        const existente = linhas.find(l => l.idem === idem);
        if (existente) {
          const bloqueadoPelaGuarda = doUpdate && guardaCompleta && existente.estado === 'completa';
          if (!doUpdate || bloqueadoPelaGuarda) return { rows: [] }; // DO NOTHING, ou DO UPDATE barrado pelo WHERE
          existente.total = params[3];
          existente.payload = params[4];
          existente.desconto_autorizado_por = params[6] != null ? params[6] : null;
          existente.desconto_pct = params[7] != null ? params[7] : null;
          existente.desconto_valor = params[8] != null ? params[8] : null;
          return { rows: [{ ...existente, inserted: false }] };
        }
        const nova = { id: params[5], idem, estado: 'aberta',
                       operador: params[1], empresa: params[2], total: params[3],
                       payload: params[4],
                       omie_pedido: null, omie_cliente: null, nf_chave: null, nf_pdf: null,
                       zoho_deal_id: null, zoho_quote_id: null, erro: null,
                       desconto_autorizado_por: params[6] != null ? params[6] : null,
                       desconto_pct: params[7] != null ? params[7] : null,
                       desconto_valor: params[8] != null ? params[8] : null };
        linhas.push(nova);
        return { rows: [{ ...nova, inserted: true }] };
      }
      if (/^SELECT .* FROM pdv_vendas WHERE id\s*=/i.test(sql.trim())) {
        return { rows: linhas.filter(l => l.id === params[0]) };
      }
      if (/^SELECT .* FROM pdv_vendas WHERE idem/i.test(sql.trim())) {
        return { rows: linhas.filter(l => l.idem === params[0]) };
      }
      if (/^UPDATE pdv_vendas/i.test(sql.trim())) {
        const id = params[params.length - 1];
        const l = linhas.find(x => x.id === id);
        if (l) {
          l.estado = params[0];
          l.omie_pedido = params[1] != null ? params[1] : l.omie_pedido;
          l.omie_cliente = params[2] != null ? params[2] : l.omie_cliente;
          l.nf_chave = params[3] != null ? params[3] : l.nf_chave;
          l.nf_pdf = params[4] != null ? params[4] : l.nf_pdf;
          l.zoho_deal_id = params[5] != null ? params[5] : l.zoho_deal_id;
          l.zoho_quote_id = params[6] != null ? params[6] : l.zoho_quote_id;
          l.erro = params[7] != null ? params[7] : l.erro;
        }
        return { rows: [] };
      }
      if (/^SELECT .* FROM pdv_vendas WHERE estado/i.test(sql.trim())) {
        // Modela os filtros a partir do texto real do SQL recebido — se a
        // implementação parar de excluir 'falhou' (ou 'completa'), o pool
        // falso deixa de filtrar também, e o teste que depende disso quebra.
        const excluiCompleta = /estado\s*<>\s*'completa'/i.test(sql);
        const excluiFalhou = /estado\s*<>\s*'falhou'/i.test(sql);
        let rows = linhas;
        if (excluiCompleta) rows = rows.filter(l => l.estado !== 'completa');
        if (excluiFalhou) rows = rows.filter(l => l.estado !== 'falhou');
        return { rows };
      }
      return { rows: [] };
    },
  };
}

test('abrir cria a venda e devolve novo=true', async () => {
  ledger.setPool(poolFake());
  const r = await ledger.abrir({ idem: 'abc', operador: 'edson', empresa: 'Tudo de Filtro', total: 100 });
  assert.equal(r.novo, true);
  assert.equal(r.estado, 'aberta');
  assert.ok(r.id.startsWith('pdv_'));
});

test('abrir duas vezes com a mesma chave NAO cria segunda venda', async () => {
  ledger.setPool(poolFake());
  const a = await ledger.abrir({ idem: 'xyz', operador: 'edson', empresa: 'Mococa', total: 50 });
  const b = await ledger.abrir({ idem: 'xyz', operador: 'edson', empresa: 'Mococa', total: 50 });
  assert.equal(a.novo, true);
  assert.equal(b.novo, false);
  assert.equal(a.id, b.id);
});

test('marcar rejeita estado invalido', async () => {
  ledger.setPool(poolFake());
  const v = await ledger.abrir({ idem: 'q', operador: 'e', empresa: 'Mococa', total: 1 });
  await assert.rejects(() => ledger.marcar(v.id, 'inventado', {}), /estado invalido/);
});

test('pendentes devolve o que nao esta completa', async () => {
  const p = poolFake();
  ledger.setPool(p);
  await ledger.abrir({ idem: 'p1', operador: 'e', empresa: 'Mococa', total: 1 });
  const lista = await ledger.pendentes();
  assert.equal(lista.length, 1);
});

// --- Contrato real com o Postgres: asserções sobre o TEXTO do SQL, não sobre
// o comportamento simulado em JS. Se alguém remover a cláusula do INSERT ou o
// UNIQUE do CREATE TABLE, estes testes têm que quebrar — verificado por
// mutação manual (ver relatório da Tarefa 2).

// MUTAÇÃO: trocar DO UPDATE de volta por DO NOTHING faz este teste (e os de
// reenvio mais abaixo) quebrarem — reenviar o mesmo idem com desconto e
// autorização NOVOS tem que atualizar a linha, não descartar silenciosamente.
test('INSERT em pdv_vendas usa ON CONFLICT (idem) DO UPDATE, nunca DO NOTHING', async () => {
  const p = poolFake();
  ledger.setPool(p);
  await ledger.abrir({ idem: 'contrato-1', operador: 'e', empresa: 'Mococa', total: 1 });
  const insertQuery = p.queries.find(q => /^INSERT INTO pdv_vendas/i.test(q.sql.trim()));
  assert.ok(insertQuery, 'esperava um INSERT INTO pdv_vendas capturado pelo pool falso');
  assert.match(insertQuery.sql, /ON CONFLICT\s*\(\s*idem\s*\)\s*DO UPDATE/i);
  assert.doesNotMatch(insertQuery.sql, /DO NOTHING/i);
});

// MUTAÇÃO: remover esta guarda (ou trocar por WHERE true) faz o teste de
// "reenvio quando ja completa" mais abaixo quebrar — uma venda que já
// fechou de verdade (nota emitida, Negócio confirmado) nunca pode ser
// reescrita por um reenvio tardio do mesmo idem.
test('ON CONFLICT DO UPDATE tem guarda WHERE estado <> completa — venda faturada nunca e reescrita', async () => {
  const p = poolFake();
  ledger.setPool(p);
  await ledger.abrir({ idem: 'contrato-2', operador: 'e', empresa: 'Mococa', total: 1 });
  const insertQuery = p.queries.find(q => /^INSERT INTO pdv_vendas/i.test(q.sql.trim()));
  assert.match(insertQuery.sql, /WHERE[\s\S]*estado\s*<>\s*'completa'/i);
});

test('CREATE TABLE declara idem como UNIQUE', async () => {
  const p = poolFake();
  ledger.setPool(p);
  await ledger.ensureTables();
  const createQuery = p.queries.find(q => /CREATE TABLE/i.test(q.sql));
  assert.ok(createQuery, 'esperava um CREATE TABLE capturado pelo pool falso');
  assert.match(createQuery.sql, /idem\s+TEXT\s+UNIQUE/i);
});

// --- marcar(): caminho feliz. O pool falso agora modela o UPDATE de verdade
// (aplica COALESCE por campo), então a asserção cobre estado E persistência
// do dado, não só a troca de estado.

test('marcar grava o novo estado e persiste o dado da etapa (omie_pedido)', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const v = await ledger.abrir({ idem: 'marcar-1', operador: 'e', empresa: 'Mococa', total: 10 });
  await ledger.marcar(v.id, 'omie_ok', { omie_pedido: '123' });
  const linha = p.linhas.find(l => l.id === v.id);
  assert.equal(linha.estado, 'omie_ok');
  assert.equal(linha.omie_pedido, '123');
});

// --- Contrato real do UPDATE de marcar(): igual ao que já existe para o
// INSERT e o CREATE TABLE — afirma sobre o TEXTO literal do SQL, não sobre
// o comportamento simulado em JS. Verificado por mutação manual (ver
// relatório da Tarefa 2): trocar `estado=$1` por um literal hardcoded, ou
// trocar `WHERE id=$9` por `WHERE id=$1` (o que faria o UPDATE real filtrar
// pelo valor de `estado` em vez do id, corrompendo a linha errada em
// produção), faz este par de testes quebrar.

test('UPDATE de marcar() grava estado por parametro, nao por literal', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const v = await ledger.abrir({ idem: 'marcar-contrato-1', operador: 'e', empresa: 'Mococa', total: 10 });
  await ledger.marcar(v.id, 'omie_ok', {});
  const updateQuery = p.queries.find(q => /^UPDATE pdv_vendas/i.test(q.sql.trim()));
  assert.ok(updateQuery, 'esperava um UPDATE pdv_vendas capturado pelo pool falso');
  assert.match(updateQuery.sql, /SET\s+estado\s*=\s*\$1/i);
});

test('UPDATE de marcar() filtra pelo id no ultimo parametro posicional (WHERE id=$9)', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const v = await ledger.abrir({ idem: 'marcar-contrato-2', operador: 'e', empresa: 'Mococa', total: 10 });
  await ledger.marcar(v.id, 'omie_ok', {});
  const updateQuery = p.queries.find(q => /^UPDATE pdv_vendas/i.test(q.sql.trim()));
  assert.ok(updateQuery, 'esperava um UPDATE pdv_vendas capturado pelo pool falso');
  assert.match(updateQuery.sql, /WHERE\s+id\s*=\s*\$9/i);
});

// --- pendentes(): o filtro de 'falhou' precisa ser exercitado, não só o de
// 'completa'.

test('pendentes exclui venda em estado falhou', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const v = await ledger.abrir({ idem: 'falhou-1', operador: 'e', empresa: 'Mococa', total: 1 });
  await ledger.marcar(v.id, 'falhou', {});
  const lista = await ledger.pendentes();
  assert.ok(!lista.some(l => l.id === v.id), 'venda em estado falhou nao deveria aparecer em pendentes()');
});

// --- buscar(): leitura simples pela chave `id` ou pela chave `idem`. É o que
// alimenta o caminho de venda REPETIDA em lib/bi-pdv.js — precisa devolver a
// linha inteira (omie_pedido, zoho_deal_id etc.), não só estado/id como
// abrir()/marcar() devolvem.

test('buscar por id devolve a linha inteira, com os campos gravados por marcar()', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const v = await ledger.abrir({ idem: 'buscar-1', operador: 'e', empresa: 'Mococa', total: 10 });
  await ledger.marcar(v.id, 'completa', { omie_pedido: '5281', zoho_deal_id: 'D1' });
  const linha = await ledger.buscar({ id: v.id });
  assert.ok(linha, 'esperava encontrar a linha pelo id');
  assert.equal(linha.id, v.id);
  assert.equal(linha.estado, 'completa');
  assert.equal(linha.omie_pedido, '5281');
  assert.equal(linha.zoho_deal_id, 'D1');
});

test('buscar por idem devolve a mesma linha que buscar por id', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const v = await ledger.abrir({ idem: 'buscar-2', operador: 'e', empresa: 'Mococa', total: 10 });
  const porId = await ledger.buscar({ id: v.id });
  const porIdem = await ledger.buscar({ idem: 'buscar-2' });
  assert.ok(porId && porIdem);
  assert.equal(porId.id, porIdem.id);
});

test('buscar sem id nem idem devolve null, sem consultar o banco', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const antesQueries = p.queries.length;
  const linha = await ledger.buscar({});
  assert.equal(linha, null);
  assert.equal(p.queries.length, antesQueries, 'nao deveria ter disparado query nenhuma');
});

// --- AUTORIZAÇÃO DE DESCONTO — gravada JUNTO da venda desde a abertura (ver
// lib/bi-pdv.js). É o registro que permite o dono auditar quem anda
// liberando desconto acima do teto do operador.

test('CREATE TABLE declara as 3 colunas de autorizacao de desconto (instalacao nova)', async () => {
  const p = poolFake();
  ledger.setPool(p);
  await ledger.ensureTables();
  const createQuery = p.queries.find(q => /CREATE TABLE/i.test(q.sql));
  assert.ok(createQuery, 'esperava um CREATE TABLE capturado pelo pool falso');
  assert.match(createQuery.sql, /desconto_autorizado_por/i);
  assert.match(createQuery.sql, /desconto_pct/i);
  assert.match(createQuery.sql, /desconto_valor/i);
});

// Removendo um ALTER TABLE ADD COLUMN IF NOT EXISTS, o teste acima continua
// passando: o CREATE TABLE (que só roda numa instalação nova) já declara a
// coluna, e a suíte inteira usa sempre uma tabela nova (o pool falso não
// tem estado entre `ensureTables()` de testes diferentes). Em PRODUÇÃO, onde
// a tabela pdv_vendas já existe de antes desta feature, é o ALTER que
// migra — sem ele a coluna nunca nasce lá e TODA venda falha (INSERT
// citando coluna inexistente). Por isso os ALTER são verificados EM
// SEPARADO do CREATE TABLE, exigindo uma query com esse texto exato.
test('ensureTables roda um ALTER TABLE ADD COLUMN IF NOT EXISTS pra CADA uma das 3 colunas de desconto — migracao de producao', async () => {
  const p = poolFake();
  ledger.setPool(p);
  await ledger.ensureTables();
  const alters = p.queries.filter(q => /^ALTER TABLE pdv_vendas/i.test(q.sql.trim()));
  for (const coluna of ['desconto_autorizado_por', 'desconto_pct', 'desconto_valor']) {
    const q = alters.find(a => new RegExp(coluna, 'i').test(a.sql));
    assert.ok(q, `esperava um ALTER TABLE ADD COLUMN IF NOT EXISTS pra ${coluna} — sem ele a migracao de producao nao roda e toda venda falha`);
    assert.match(q.sql, /ADD COLUMN IF NOT EXISTS/i);
  }
});

test('abrir() grava quem autorizou o desconto, o percentual e o valor', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const v = await ledger.abrir({
    idem: 'autoriza-1', operador: 'edson', empresa: 'Tudo de Filtro', total: 180,
    descontoAutorizadoPor: 'paulo', descontoPct: 25, descontoValor: 50,
  });
  const linha = p.linhas.find(l => l.id === v.id);
  assert.equal(linha.desconto_autorizado_por, 'paulo');
  assert.equal(linha.desconto_pct, 25);
  assert.equal(linha.desconto_valor, 50);
});

test('abrir() sem autorizacao de desconto grava os 3 campos como null — venda dentro do teto nao pode parecer autorizada', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const v = await ledger.abrir({ idem: 'sem-autoriza-1', operador: 'edson', empresa: 'Tudo de Filtro', total: 100 });
  const linha = p.linhas.find(l => l.id === v.id);
  assert.equal(linha.desconto_autorizado_por, null);
  assert.equal(linha.desconto_pct, null);
  assert.equal(linha.desconto_valor, null);
});

// --- REENVIO DO MESMO idem — ATUALIZA a linha existente, nunca cria segunda
// venda nem descarta silenciosamente o desconto/autorização novos. Cenário
// real: 1ª tentativa fica 'aberta' (ou falha no Omie, 'falhou'); operador
// sobe o desconto, supervisor autoriza, reenvia com o MESMO idem — a linha
// do livro-razão, que é o que o dono vai consultar, precisa refletir a
// autorização e o total da tentativa que realmente foi pra frente.

test('reenvio do mesmo idem com desconto/autorizacao NOVOS atualiza a linha existente, nao fica com desconto_autorizado_por NULL', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const a = await ledger.abrir({ idem: 'retry-1', operador: 'edson', empresa: 'Tudo de Filtro', total: 200 });
  await ledger.marcar(a.id, 'falhou', { erro: 'omie fora do ar' }); // 1a tentativa: dentro do teto, falhou no Omie
  const b = await ledger.abrir({
    idem: 'retry-1', operador: 'edson', empresa: 'Tudo de Filtro', total: 100,
    descontoAutorizadoPor: 'paulo', descontoPct: 50, descontoValor: 100,
  });
  assert.equal(b.id, a.id, 'mesma linha do livro-razao, nao uma segunda venda');
  assert.equal(b.novo, false);
  const linha = p.linhas.find(l => l.id === a.id);
  assert.equal(linha.total, 100, 'total tem que ser o da tentativa que foi pra frente, nao o antigo');
  assert.equal(linha.desconto_autorizado_por, 'paulo', 'e exatamente este campo que ficava NULL antes da correcao');
  assert.equal(linha.desconto_pct, 50);
  assert.equal(linha.desconto_valor, 100);
});

// MUTAÇÃO: voltar ON CONFLICT pra DO NOTHING faz este teste quebrar — b.novo
// continuaria false (linha ja existe), mas a linha nunca seria atualizada.
test('reenvio SEM autorizacao nova (idem repetido, mesmos dados) tambem passa pelo caminho de UPDATE, sem criar segunda linha', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const a = await ledger.abrir({ idem: 'retry-2', operador: 'edson', empresa: 'Mococa', total: 50 });
  const b = await ledger.abrir({ idem: 'retry-2', operador: 'edson', empresa: 'Mococa', total: 50 });
  assert.equal(a.novo, true);
  assert.equal(b.novo, false);
  assert.equal(a.id, b.id);
  assert.equal(p.linhas.filter(l => l.idem === 'retry-2').length, 1, 'so pode existir UMA linha pra este idem');
});

test('reenvio do mesmo idem quando a venda JA ESTA completa NAO altera a linha — trava contra reescrever venda faturada', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const a = await ledger.abrir({ idem: 'completa-1', operador: 'edson', empresa: 'Tudo de Filtro', total: 200 });
  await ledger.marcar(a.id, 'completa', { omie_pedido: '999', zoho_deal_id: 'D9' });
  const b = await ledger.abrir({
    idem: 'completa-1', operador: 'edson', empresa: 'Tudo de Filtro', total: 9999,
    descontoAutorizadoPor: 'paulo', descontoPct: 90, descontoValor: 9000,
  });
  assert.equal(b.novo, false);
  assert.equal(b.estado, 'completa');
  const linha = p.linhas.find(l => l.id === a.id);
  assert.equal(linha.total, 200, 'total da venda ja completa nao pode ser reescrito por um reenvio tardio');
  assert.equal(linha.desconto_autorizado_por, null, 'venda completa original nao tinha autorizacao — reenvio nao pode inventar uma');
});

test('buscar por id inexistente devolve null', async () => {
  const p = poolFake();
  ledger.setPool(p);
  const linha = await ledger.buscar({ id: 'pdv_nao_existe' });
  assert.equal(linha, null);
});

// --- Teste condicionado a ambiente: só roda com Postgres de verdade
// (DATABASE_URL definida). Usa um schema próprio de teste, criado e
// destruído dentro do próprio teste, para nunca tocar a tabela pdv_vendas
// real que possa existir no mesmo banco.

test('idempotencia contra Postgres real (requer DATABASE_URL)', async (t) => {
  if (!process.env.DATABASE_URL) {
    t.skip('DATABASE_URL nao definida — pulando teste contra Postgres real');
    return;
  }

  const { Client } = require('pg');
  const conn = process.env.DATABASE_URL;
  // Detecção de SSL: hosts internos/locais conhecidos não falam SSL (Railway
  // internal, localhost, 127.0.0.1, ou PGSSLMODE=disable explícito). Para
  // qualquer outro host — incluindo Postgres de CI acessível por nome de
  // serviço (ex.: "postgres", "db") — tenta com SSL primeiro e, se o servidor
  // recusar (`The server does not support SSL connections`), refaz a conexão
  // sem SSL. Isso evita que o teste falhe por erro de conexão em vez de
  // rodar em qualquer ambiente Postgres real, com ou sem SSL.
  const semSSLConhecido = /railway\.internal|localhost|127\.0\.0\.1/i.test(conn)
    || process.env.PGSSLMODE === 'disable';
  let client = new Client({
    connectionString: conn,
    ssl: semSSLConhecido ? false : { rejectUnauthorized: false },
  });
  try {
    await client.connect();
  } catch (err) {
    if (semSSLConhecido || !/does not support SSL/i.test(String(err && err.message))) throw err;
    client = new Client({ connectionString: conn, ssl: false });
    await client.connect();
  }
  const schema = 'pdv_ledger_test_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  try {
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET search_path TO "${schema}"`);

    ledger.setPool(client);
    await ledger.ensureTables();

    const a = await ledger.abrir({ idem: 'real-idem-1', operador: 'e', empresa: 'Mococa', total: 10 });
    const b = await ledger.abrir({ idem: 'real-idem-1', operador: 'e', empresa: 'Mococa', total: 10 });

    assert.equal(a.novo, true);
    assert.equal(b.novo, false);
    assert.equal(a.id, b.id);

    const conta = await client.query(`SELECT COUNT(*)::int AS n FROM pdv_vendas WHERE idem = $1`, ['real-idem-1']);
    assert.equal(conta.rows[0].n, 1);
  } finally {
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await client.end();
  }
});
