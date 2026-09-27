// lib/bi-os-materiais.js — Ordem de Serviço (materiais consumidos no atendimento)
//
// Fluxo:
// 1. Técnico abre a parada (route_stop) no /operacional/os-materiais (mobile)
// 2. Lança materiais usados (produto + qtd). Estado: 'pendente'
// 3. Clica "Fechar OS" → status='baixado': dispara saida-instalacao no estoque
//    do técnico (estoque_origem) + grava custo (qtd × custo_medio na hora) +
//    vincula a sale_id e zoho_deal_id (se vieram do tdf-ops)
// 4. Custo aparece na ficha da venda Zoho (campo custoMateriais) automático.
//
// Reusa bi-estoque.movimentar (tipo='saida-instalacao') que já checa saldo.

const db = require('./bi-estoque-db');
const biEstoque = require('./bi-estoque');
const operacional = require('./operacional');

function _pool() { return db.getPool(); }
const uid = (p='os_') => p + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

const STATUS = {
  PENDENTE: 'pendente',
  BAIXADO: 'baixado',
  CANCELADO: 'cancelado',
};

async function ensureTable() {
  const pool = _pool();
  if (!pool) return;
  const sqls = [
    `CREATE TABLE IF NOT EXISTS bi_os_materiais (
      id TEXT PRIMARY KEY,
      auvo_task_id TEXT,                    -- ID da OS no AUVO (se veio de stop)
      route_id_externo TEXT,                -- ID rota tdf-ops (numérico)
      route_stop_id TEXT,                   -- ID stop tdf-ops
      sale_id TEXT,                         -- ID venda tdf-ops (numérico)
      zoho_deal_id TEXT,                    -- ID Deal Zoho (pra ligar com ficha)
      empresa_id TEXT REFERENCES bi_empresas(id) ON DELETE SET NULL,
      estoque_origem_id TEXT REFERENCES bi_estoques(id) ON DELETE SET NULL,
      tecnico_username TEXT,
      tecnico_nome TEXT,
      cliente_nome TEXT,
      data_atendimento DATE,
      status TEXT NOT NULL DEFAULT 'pendente',
      observacoes TEXT,
      total_valor NUMERIC(14,2) DEFAULT 0,
      criada_em TIMESTAMPTZ DEFAULT NOW(),
      criada_por TEXT,
      baixada_em TIMESTAMPTZ,
      baixada_por TEXT,
      cancelada_em TIMESTAMPTZ,
      cancelada_por TEXT,
      motivo_cancelamento TEXT,
      updated_at TIMESTAMPTZ
    )`,
    `CREATE INDEX IF NOT EXISTS idx_osm_status ON bi_os_materiais (status)`,
    `CREATE INDEX IF NOT EXISTS idx_osm_zoho ON bi_os_materiais (zoho_deal_id) WHERE zoho_deal_id IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_osm_tecnico ON bi_os_materiais (tecnico_username)`,
    `CREATE INDEX IF NOT EXISTS idx_osm_auvo ON bi_os_materiais (auvo_task_id) WHERE auvo_task_id IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_osm_data ON bi_os_materiais (data_atendimento)`,

    `CREATE TABLE IF NOT EXISTS bi_os_material_item (
      id TEXT PRIMARY KEY,
      os_id TEXT NOT NULL REFERENCES bi_os_materiais(id) ON DELETE CASCADE,
      ordem INT NOT NULL DEFAULT 1,
      produto_id TEXT NOT NULL REFERENCES bi_produtos(id) ON DELETE RESTRICT,
      qtd NUMERIC(14,4) NOT NULL,
      custo_unit_snapshot NUMERIC(14,4) DEFAULT 0,    -- snapshot do custo_medio no momento da baixa
      valor NUMERIC(14,2) DEFAULT 0,
      observacoes TEXT,
      mov_estoque_id TEXT,                            -- ID da bi_mov_estoque gerada na baixa
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS idx_osmi_os ON bi_os_material_item (os_id)`,
  ];
  for (const sql of sqls) {
    try { await pool.query(sql); }
    catch(e) { console.error('[bi-os-materiais ensure]', e.message); throw e; }
  }
  console.log('[bi-os-materiais] tabelas criadas/verificadas');
}

// Cria uma OS de materiais (sem itens ainda)
// patch: { auvoTaskId, routeIdExterno, routeStopId, saleId, zohoDealId, empresaId,
//          estoqueOrigemId, tecnicoUsername, tecnicoNome, clienteNome, dataAtendimento, observacoes }
async function criar(patch, who) {
  const pool = _pool(); if (!pool) throw new Error('Postgres não conectado');
  const id = uid();
  await pool.query(`INSERT INTO bi_os_materiais
    (id, auvo_task_id, route_id_externo, route_stop_id, sale_id, zoho_deal_id,
     empresa_id, estoque_origem_id, tecnico_username, tecnico_nome, cliente_nome,
     data_atendimento, status, observacoes, criada_por)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pendente',$13,$14)`,
    [id, patch.auvoTaskId || null, patch.routeIdExterno || null, patch.routeStopId || null,
     patch.saleId || null, patch.zohoDealId || null,
     patch.empresaId || null, patch.estoqueOrigemId || null,
     patch.tecnicoUsername || who || null, patch.tecnicoNome || null,
     patch.clienteNome || null, patch.dataAtendimento || new Date().toISOString().slice(0,10),
     patch.observacoes || null, who || null]);
  return await get(id);
}

// Busca/cria OS pendente associada ao auvo_task_id ou route_stop_id (idempotente — usado pelo mobile)
async function getOrCreateByStop({ routeStopId, auvoTaskId, ...rest }, who) {
  const pool = _pool(); if (!pool) throw new Error('Postgres não conectado');
  if (!routeStopId && !auvoTaskId) throw new Error('routeStopId ou auvoTaskId obrigatório');
  const conds = []; const params = [];
  if (routeStopId) { params.push(routeStopId); conds.push(`route_stop_id = $${params.length}`); }
  if (auvoTaskId)  { params.push(auvoTaskId);  conds.push(`auvo_task_id = $${params.length}`); }
  const r = await pool.query(`SELECT id FROM bi_os_materiais WHERE status='pendente' AND (${conds.join(' OR ')}) ORDER BY criada_em DESC LIMIT 1`, params);
  if (r.rows[0]) return await get(r.rows[0].id);
  return await criar({ routeStopId, auvoTaskId, ...rest }, who);
}

async function get(id) {
  const pool = _pool(); if (!pool) return null;
  const cab = await pool.query(`
    SELECT o.*, e.nome AS empresa_nome, est.nome AS estoque_nome
    FROM bi_os_materiais o
    LEFT JOIN bi_empresas e ON e.id = o.empresa_id
    LEFT JOIN bi_estoques est ON est.id = o.estoque_origem_id
    WHERE o.id = $1
  `, [id]);
  if (!cab.rows[0]) return null;
  const itens = await pool.query(`
    SELECT i.*, p.nome AS produto_nome, p.sku AS produto_sku, p.unidade AS produto_unidade,
      COALESCE((SELECT SUM(qtd) FROM bi_saldo_estoque s WHERE s.produto_id = i.produto_id AND s.estoque_id = $2), 0) AS saldo_estoque_origem
    FROM bi_os_material_item i
    JOIN bi_produtos p ON p.id = i.produto_id
    WHERE i.os_id = $1
    ORDER BY i.ordem, i.created_at
  `, [id, cab.rows[0].estoque_origem_id]);
  return { ...cab.rows[0], itens: itens.rows };
}

async function listAll(opts = {}) {
  const pool = _pool(); if (!pool) return [];
  const conds = []; const params = [];
  if (opts.status) { params.push(opts.status); conds.push(`o.status = $${params.length}`); }
  if (opts.tecnicoUsername) { params.push(opts.tecnicoUsername); conds.push(`o.tecnico_username = $${params.length}`); }
  if (opts.dataFrom) { params.push(opts.dataFrom); conds.push(`o.data_atendimento >= $${params.length}`); }
  if (opts.dataTo) { params.push(opts.dataTo); conds.push(`o.data_atendimento <= $${params.length}`); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const r = await pool.query(`
    SELECT o.*, e.nome AS empresa_nome, est.nome AS estoque_nome,
      (SELECT COUNT(*) FROM bi_os_material_item i WHERE i.os_id = o.id) AS itens_count
    FROM bi_os_materiais o
    LEFT JOIN bi_empresas e ON e.id = o.empresa_id
    LEFT JOIN bi_estoques est ON est.id = o.estoque_origem_id
    ${where}
    ORDER BY o.data_atendimento DESC NULLS LAST, o.criada_em DESC
    LIMIT 500
  `, params);
  return r.rows;
}

async function atualizarCabecalho(id, patch) {
  const pool = _pool(); if (!pool) throw new Error('pool não conectada');
  const cur = await get(id);
  if (!cur) throw new Error('OS não encontrada');
  if (cur.status !== STATUS.PENDENTE) throw new Error('só pode editar OS pendente');
  const set = []; const params = [];
  ['estoqueOrigemId','tecnicoUsername','tecnicoNome','clienteNome','observacoes','zohoDealId','empresaId','saleId'].forEach(k => {
    const col = k.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (patch[k] !== undefined) { params.push(patch[k] || null); set.push(`${col} = $${params.length}`); }
  });
  if (!set.length) return cur;
  set.push(`updated_at = NOW()`);
  params.push(id);
  await pool.query(`UPDATE bi_os_materiais SET ${set.join(', ')} WHERE id = $${params.length}`, params);
  return await get(id);
}

// Adiciona/atualiza item. Se item.id vier, atualiza; senão, insere novo.
async function addItem(osId, item) {
  const pool = _pool(); if (!pool) throw new Error('pool não conectada');
  const cur = await get(osId);
  if (!cur) throw new Error('OS não encontrada');
  if (cur.status !== STATUS.PENDENTE) throw new Error('só pode mexer em OS pendente');
  if (!item.produtoId) throw new Error('produtoId obrigatório');
  const qtd = Number(item.qtd) || 0;
  if (qtd <= 0) throw new Error('qtd > 0');
  if (item.id) {
    await pool.query(`UPDATE bi_os_material_item SET qtd=$2, observacoes=$3 WHERE id=$1`,
      [item.id, qtd, item.observacoes || null]);
    return get(osId);
  }
  const nextOrdem = (cur.itens || []).length + 1;
  await pool.query(`INSERT INTO bi_os_material_item (id, os_id, ordem, produto_id, qtd, observacoes) VALUES ($1,$2,$3,$4,$5,$6)`,
    [uid('oi_'), osId, nextOrdem, item.produtoId, qtd, item.observacoes || null]);
  return get(osId);
}

async function removeItem(itemId) {
  const pool = _pool(); if (!pool) throw new Error('pool não conectada');
  const r = await pool.query(`SELECT os_id FROM bi_os_material_item WHERE id = $1`, [itemId]);
  if (!r.rows[0]) return null;
  const osId = r.rows[0].os_id;
  const cur = await get(osId);
  if (cur.status !== STATUS.PENDENTE) throw new Error('só pode mexer em OS pendente');
  await pool.query('DELETE FROM bi_os_material_item WHERE id = $1', [itemId]);
  return get(osId);
}

// Baixa a OS: dispara saida-instalacao no estoque pra cada item + persiste valor
async function baixar(osId, who) {
  const pool = _pool(); if (!pool) throw new Error('pool não conectada');
  const cur = await get(osId);
  if (!cur) throw new Error('OS não encontrada');
  if (cur.status !== STATUS.PENDENTE) throw new Error('OS não está pendente (status atual: ' + cur.status + ')');
  if (!cur.estoque_origem_id) throw new Error('OS sem estoque origem definido (define no cabeçalho antes de baixar)');
  if (!cur.itens || cur.itens.length === 0) throw new Error('OS sem itens');

  const erros = [];
  let total = 0;
  // Pra cada item, faz movimentação. bi-estoque.movimentar é transacional internamente
  // (faz BEGIN/COMMIT individual). Se um item falha, marcamos como erro mas continuamos.
  for (const it of cur.itens) {
    try {
      // Custo unit = custo_medio atual do estoque origem (puxa do saldo)
      const r = await pool.query(
        'SELECT custo_medio FROM bi_saldo_estoque WHERE produto_id = $1 AND estoque_id = $2',
        [it.produto_id, cur.estoque_origem_id]
      );
      const custoUnit = Number(r.rows[0]?.custo_medio || 0);
      const valor = +(Number(it.qtd) * custoUnit).toFixed(2);
      total += valor;
      // Movimenta
      const mov = await biEstoque.movimentar({
        tipo: 'saida-instalacao',
        produtoId: it.produto_id,
        estoqueOrigemId: cur.estoque_origem_id,
        qtd: Number(it.qtd),
        custoUnit,
        refTipo: 'os-materiais',
        refId: osId,
        obs: `OS #${osId} ${cur.cliente_nome ? '· ' + cur.cliente_nome : ''}`,
        metadata: { auvoTaskId: cur.auvo_task_id, saleId: cur.sale_id, zohoDealId: cur.zoho_deal_id, itemId: it.id },
      }, who || cur.tecnico_username);
      // Persiste snapshot
      await pool.query(`UPDATE bi_os_material_item SET custo_unit_snapshot=$2, valor=$3, mov_estoque_id=$4 WHERE id=$1`,
        [it.id, custoUnit, valor, mov?.id || null]);
    } catch(e) {
      erros.push({ itemId: it.id, produto: it.produto_nome, motivo: e.message });
    }
  }
  if (erros.length === cur.itens.length) {
    throw new Error('todos os itens falharam · primeiro: ' + erros[0]?.motivo);
  }
  await pool.query(`UPDATE bi_os_materiais SET status='baixado', baixada_em=NOW(), baixada_por=$2, total_valor=$3, updated_at=NOW() WHERE id=$1`,
    [osId, who || null, total]);
  return { ok:true, total, erros, os: await get(osId) };
}

async function cancelar(osId, who, motivo) {
  const pool = _pool(); if (!pool) throw new Error('pool não conectada');
  const cur = await get(osId);
  if (!cur) throw new Error('OS não encontrada');
  if (cur.status === STATUS.BAIXADO) throw new Error('OS já baixada — pra reverter, crie movimentação de devolução manual');
  await pool.query(`UPDATE bi_os_materiais SET status='cancelado', cancelada_em=NOW(), cancelada_por=$2, motivo_cancelamento=$3, updated_at=NOW() WHERE id=$1`,
    [osId, who || null, motivo || null]);
  return get(osId);
}

// Batch pra ficha de venda Zoho: { zohoDealId → { valor, ossN, itens[] } }
async function custoPorZohoDealIdsBatch(zohoDealIds) {
  const pool = _pool();
  if (!pool || !zohoDealIds || !zohoDealIds.length) return {};
  const ids = zohoDealIds.map(String);
  const r = await pool.query(`
    SELECT o.zoho_deal_id, o.id AS os_id, o.total_valor, o.data_atendimento, o.tecnico_username,
      o.cliente_nome, (SELECT COUNT(*) FROM bi_os_material_item i WHERE i.os_id = o.id) AS itens_count
    FROM bi_os_materiais o
    WHERE o.status = 'baixado' AND o.zoho_deal_id = ANY($1)
    ORDER BY o.baixada_em DESC
  `, [ids]);
  const out = {};
  for (const row of r.rows) {
    if (!out[row.zoho_deal_id]) out[row.zoho_deal_id] = { valor: 0, oss: [] };
    out[row.zoho_deal_id].valor += Number(row.total_valor) || 0;
    out[row.zoho_deal_id].oss.push({
      osId: row.os_id, valor: Number(row.total_valor||0), data: row.data_atendimento,
      tecnico: row.tecnico_username, cliente: row.cliente_nome, itensCount: Number(row.itens_count),
    });
  }
  return out;
}

// Pra mobile: lista as paradas (stops) do dia do técnico, vindas do tdf-ops,
// já marcando quais têm OS no portal (pendente ou baixada)
async function listarStopsDoTecnico(tecnicoUsername, dataISO) {
  const pool = _pool();
  const data = dataISO || new Date().toISOString().slice(0,10);
  // Busca rotas do dia (sem filtro por técnico — tdf-ops não vincula username, só nome livre)
  let rotas = [];
  try {
    rotas = await operacional.listRoutes({ date_from: data, date_to: data, limit: 100 });
  } catch(e) {
    throw new Error('tdf-ops indisponível: ' + e.message);
  }
  // Filtra por nome do técnico (case-insensitive substring) se passado
  const tecLower = (tecnicoUsername||'').toLowerCase();
  const rotasFiltradas = tecLower
    ? rotas.filter(r => (r.technician_name||'').toLowerCase().includes(tecLower))
    : rotas;
  // Pra cada rota, busca detalhes + paradas + status OS
  const result = [];
  for (const r of rotasFiltradas) {
    let detail;
    try { detail = await operacional.getRoute(r.id); }
    catch(_) { detail = { stops: [] }; }
    for (const stop of (detail.stops || [])) {
      // Verifica se já tem OS no portal pro stop
      let osStatus = null, osId = null;
      if (pool) {
        const q = await pool.query(`SELECT id, status FROM bi_os_materiais
          WHERE (route_stop_id = $1 OR auvo_task_id = $2) ORDER BY criada_em DESC LIMIT 1`,
          [String(stop.id), stop.auvo_task_id || '']);
        if (q.rows[0]) { osStatus = q.rows[0].status; osId = q.rows[0].id; }
      }
      result.push({
        rotaId: r.id,
        rotaData: r.route_date,
        tecnico: r.technician_name,
        stopId: String(stop.id),
        auvoTaskId: stop.auvo_task_id,
        scheduledStart: stop.scheduled_start,
        scheduledEnd: stop.scheduled_end,
        serviceType: stop.service_type,
        status: stop.status,
        saleId: stop.sale_id ? String(stop.sale_id) : null,
        cliente: stop.sale?.customer_name || null,
        zohoDealId: stop.sale?.zoho_deal_id || null,
        osPortal: osId ? { id: osId, status: osStatus } : null,
      });
    }
  }
  return result;
}

module.exports = {
  STATUS,
  ensureTable,
  criar, getOrCreateByStop, get, listAll,
  atualizarCabecalho, addItem, removeItem,
  baixar, cancelar,
  custoPorZohoDealIdsBatch,
  listarStopsDoTecnico,
};
