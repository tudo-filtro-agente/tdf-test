// lib/bi-rotas-custo.js — Custo logístico por rota e rateio por venda
//
// Fluxo:
// 1. Rota concluída chega do tdf-ops (lib/operacional.js getRoute).
// 2. Admin/financeiro finaliza a rota: escolhe veículo + lança km rodado.
// 3. custo_total = km_rodado × veiculo.custo_km
// 4. Rateio: custo_total / N (stops com sale_id != null)
// 5. Persiste em bi_rotas_finalizadas + bi_custo_logistico_venda
// 6. A ficha do produto/venda (bi-fichas.js) consulta bi_custo_logistico_venda
//    por sale_id e soma ao custo da venda.
//
// Reusa o pool do bi-estoque-db (mesmo padrão dos outros libs do BI).

const db = require('./bi-estoque-db');
const veiculos = require('./bi-veiculos');
const operacional = require('./operacional');

function _pool() { return db.getPool(); }

const uid = (p='rt_') => p + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

async function ensureTable() {
  const pool = _pool();
  if (!pool) return;
  const sqls = [
    `CREATE TABLE IF NOT EXISTS bi_rotas_finalizadas (
      id TEXT PRIMARY KEY,
      route_id_externo TEXT NOT NULL,       -- id no tdf-ops (numérico) ou auvo_route_id (string)
      route_date DATE,
      technician_name TEXT,
      veiculo_id TEXT REFERENCES bi_veiculos(id) ON DELETE SET NULL,
      km_rodado NUMERIC(10,2) NOT NULL,
      custo_km NUMERIC(10,4) NOT NULL,      -- snapshot do custo/km do veículo na hora da finalização
      custo_total NUMERIC(12,2) NOT NULL,
      stops_total INT NOT NULL,
      stops_com_venda INT NOT NULL,
      custo_por_entrega NUMERIC(12,2) NOT NULL,
      observacoes TEXT,
      finalizado_em TIMESTAMPTZ DEFAULT NOW(),
      finalizado_por TEXT
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_rotas_fin_route ON bi_rotas_finalizadas (route_id_externo)`,
    `CREATE INDEX IF NOT EXISTS idx_rotas_fin_data ON bi_rotas_finalizadas (route_date)`,

    `CREATE TABLE IF NOT EXISTS bi_custo_logistico_venda (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,                -- id numérico da venda no tdf-ops
      zoho_deal_id TEXT,                    -- id do Deal no Zoho (pra ligar com a ficha)
      rota_id TEXT NOT NULL REFERENCES bi_rotas_finalizadas(id) ON DELETE CASCADE,
      valor NUMERIC(12,2) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    // Migration idempotente caso tabela já exista sem a coluna
    `ALTER TABLE bi_custo_logistico_venda ADD COLUMN IF NOT EXISTS zoho_deal_id TEXT`,
    `CREATE INDEX IF NOT EXISTS idx_custo_log_sale ON bi_custo_logistico_venda (sale_id)`,
    `CREATE INDEX IF NOT EXISTS idx_custo_log_zoho ON bi_custo_logistico_venda (zoho_deal_id) WHERE zoho_deal_id IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_custo_log_rota ON bi_custo_logistico_venda (rota_id)`,
  ];
  for (const sql of sqls) {
    try { await pool.query(sql); }
    catch(e) { console.error('[bi-rotas-custo ensure]', e.message); throw e; }
  }
  console.log('[bi-rotas-custo] tabelas criadas/verificadas');
}

// Lista rotas que ainda NÃO foram finalizadas no BI (vindo do tdf-ops, com flag finalizada=false)
async function listarRotasParaFinalizar(opts = {}) {
  const pool = _pool();
  const dateFrom = opts.dateFrom || _isoDate(_daysAgo(60));
  const dateTo = opts.dateTo || _isoDate(new Date());
  // Busca todas as rotas do período no tdf-ops
  let rotas = [];
  try {
    rotas = await operacional.listRoutes({ date_from: dateFrom, date_to: dateTo, limit: 500 });
  } catch(e) {
    console.error('[bi-rotas-custo listar] tdf-ops falhou:', e.message);
    throw new Error('tdf-ops indisponível: ' + e.message);
  }
  // Se Postgres OK, marca quais já estão finalizadas
  let finalizadasIds = new Set();
  if (pool) {
    const ids = rotas.map(r => String(r.id));
    if (ids.length) {
      const r = await pool.query('SELECT route_id_externo FROM bi_rotas_finalizadas WHERE route_id_externo = ANY($1)', [ids]);
      finalizadasIds = new Set(r.rows.map(row => row.route_id_externo));
    }
  }
  return rotas.map(r => ({
    ...r,
    finalizada: finalizadasIds.has(String(r.id)),
  }));
}

async function listarHistorico(opts = {}) {
  const pool = _pool(); if (!pool) return [];
  const params = [];
  const conds = [];
  if (opts.dateFrom) { params.push(opts.dateFrom); conds.push(`route_date >= $${params.length}`); }
  if (opts.dateTo) { params.push(opts.dateTo); conds.push(`route_date <= $${params.length}`); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const r = await pool.query(`
    SELECT f.*, v.placa, v.modelo, v.marca
    FROM bi_rotas_finalizadas f
    LEFT JOIN bi_veiculos v ON v.id = f.veiculo_id
    ${where}
    ORDER BY route_date DESC, finalizado_em DESC
    LIMIT 200
  `, params);
  return r.rows;
}

// Finaliza uma rota: calcula custo, salva, distribui rateio entre stops com sale_id
async function finalizarRota({ routeIdExterno, veiculoId, kmRodado, observacoes }, who) {
  const pool = _pool();
  if (!pool) throw new Error('Postgres não conectado');
  if (!routeIdExterno) throw new Error('routeIdExterno obrigatório');
  if (!veiculoId) throw new Error('veiculoId obrigatório');
  const km = Number(kmRodado);
  if (!km || km <= 0) throw new Error('km_rodado precisa ser > 0');

  // Já finalizada?
  const existe = await pool.query('SELECT id FROM bi_rotas_finalizadas WHERE route_id_externo = $1', [String(routeIdExterno)]);
  if (existe.rows.length) throw new Error('rota já finalizada (use refazer pra recalcular)');

  // Veículo válido?
  const veic = await veiculos.get(veiculoId);
  if (!veic) throw new Error('veículo não encontrado');
  const custoKm = Number(veic.custo_km || 0);
  if (custoKm <= 0) throw new Error('veículo sem custo/km cadastrado');

  // Busca detalhes da rota no tdf-ops (precisa dos stops + sale_ids)
  let rota;
  try { rota = await operacional.getRoute(routeIdExterno); }
  catch(e) { throw new Error('tdf-ops getRoute falhou: ' + e.message); }
  const stops = rota.stops || [];
  const stopsComVenda = stops.filter(s => s.sale_id !== null && s.sale_id !== undefined && String(s.sale_id) !== '');

  const custoTotal = km * custoKm;
  const N = stopsComVenda.length;
  const custoPorEntrega = N > 0 ? +(custoTotal / N).toFixed(2) : 0;

  // Transação: insere rota + rateios
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const rotaId = uid();
    await client.query(`INSERT INTO bi_rotas_finalizadas
      (id, route_id_externo, route_date, technician_name, veiculo_id, km_rodado, custo_km, custo_total, stops_total, stops_com_venda, custo_por_entrega, observacoes, finalizado_por)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [rotaId, String(routeIdExterno), rota.route_date || null, rota.technician_name || null,
       veiculoId, km, custoKm, +custoTotal.toFixed(2), stops.length, N, custoPorEntrega,
       observacoes || null, who || null]);
    for (const s of stopsComVenda) {
      // Stop pode ou não ter sale embedded. Se não tiver, faz fetch pra pegar zoho_deal_id.
      let zohoDealId = s.sale?.zoho_deal_id || null;
      if (!zohoDealId && s.sale_id) {
        try {
          const saleDetail = await operacional.getSale(s.sale_id);
          zohoDealId = saleDetail?.zoho_deal_id || null;
        } catch(e) {
          console.warn('[finalizarRota] getSale falhou pra', s.sale_id, e.message);
        }
      }
      await client.query(`INSERT INTO bi_custo_logistico_venda (id, sale_id, zoho_deal_id, rota_id, valor) VALUES ($1,$2,$3,$4,$5)`,
        [uid('cl_'), String(s.sale_id), zohoDealId, rotaId, custoPorEntrega]);
    }
    await client.query('COMMIT');
    return {
      ok: true,
      rota: { id: rotaId, routeIdExterno: String(routeIdExterno), custoTotal:+custoTotal.toFixed(2), custoPorEntrega, stopsComVenda: N, stopsTotal: stops.length },
    };
  } catch(e) {
    await client.query('ROLLBACK');
    throw e;
  } finally { client.release(); }
}

// Desfaz a finalização (apaga rateio + rota)
async function desfazer(routeIdExterno) {
  const pool = _pool(); if (!pool) return false;
  const r = await pool.query('DELETE FROM bi_rotas_finalizadas WHERE route_id_externo = $1', [String(routeIdExterno)]);
  return r.rowCount > 0;
}

// Consulta custo logístico por sale_id (pra ficha do produto/venda)
async function custoPorVenda(saleId) {
  const pool = _pool(); if (!pool || !saleId) return null;
  const r = await pool.query(`
    SELECT c.valor, c.rota_id, f.route_id_externo, f.route_date, f.km_rodado, f.custo_km,
           f.custo_total, f.custo_por_entrega, f.technician_name,
           v.placa, v.modelo
    FROM bi_custo_logistico_venda c
    JOIN bi_rotas_finalizadas f ON f.id = c.rota_id
    LEFT JOIN bi_veiculos v ON v.id = f.veiculo_id
    WHERE c.sale_id = $1
    ORDER BY c.created_at DESC
    LIMIT 1
  `, [String(saleId)]);
  return r.rows[0] || null;
}

// Versão batch: { saleId → valor } pra evitar N queries no loop de vendas
async function custoPorVendasBatch(saleIds) {
  const pool = _pool();
  if (!pool || !saleIds || !saleIds.length) return {};
  const ids = saleIds.map(String);
  const r = await pool.query(
    `SELECT sale_id, SUM(valor)::numeric(12,2) AS valor
     FROM bi_custo_logistico_venda
     WHERE sale_id = ANY($1)
     GROUP BY sale_id`,
    [ids]
  );
  const out = {};
  for (const row of r.rows) out[row.sale_id] = Number(row.valor) || 0;
  return out;
}

// Versão batch por Zoho Deal IDs (pra ficha de venda Zoho)
// Retorna { zohoDealId → { valor, rota: {...info} } }
async function custoPorZohoDealIdsBatch(zohoDealIds) {
  const pool = _pool();
  if (!pool || !zohoDealIds || !zohoDealIds.length) return {};
  const ids = zohoDealIds.map(String);
  const r = await pool.query(`
    SELECT c.zoho_deal_id, c.valor, c.rota_id,
           f.route_id_externo, f.route_date, f.km_rodado, f.custo_km,
           f.custo_total, f.custo_por_entrega, f.technician_name,
           v.placa, v.modelo
    FROM bi_custo_logistico_venda c
    JOIN bi_rotas_finalizadas f ON f.id = c.rota_id
    LEFT JOIN bi_veiculos v ON v.id = f.veiculo_id
    WHERE c.zoho_deal_id = ANY($1)
    ORDER BY c.created_at DESC
  `, [ids]);
  // Agrega: se mesma venda apareceu em mais de uma rota, soma valor mas mantém info da última
  const out = {};
  for (const row of r.rows) {
    if (!out[row.zoho_deal_id]) {
      out[row.zoho_deal_id] = {
        valor: 0,
        rotas: [],
      };
    }
    out[row.zoho_deal_id].valor += Number(row.valor) || 0;
    out[row.zoho_deal_id].rotas.push({
      routeIdExterno: row.route_id_externo,
      routeDate: row.route_date,
      kmRodado: row.km_rodado,
      custoKm: row.custo_km,
      custoTotal: row.custo_total,
      custoPorEntrega: row.custo_por_entrega,
      technicianName: row.technician_name,
      placa: row.placa,
      modelo: row.modelo,
    });
  }
  return out;
}

function _isoDate(d) { return d.toISOString().slice(0,10); }
function _daysAgo(n) { const d = new Date(); d.setDate(d.getDate()-n); return d; }

module.exports = {
  ensureTable,
  listarRotasParaFinalizar,
  listarHistorico,
  finalizarRota,
  desfazer,
  custoPorVenda,
  custoPorVendasBatch,
  custoPorZohoDealIdsBatch,
};
