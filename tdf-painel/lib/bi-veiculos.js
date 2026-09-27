// lib/bi-veiculos.js — Cadastro de veículos da frota (Postgres)
//
// Tabela bi_veiculos: placa, marca, modelo, ano, tipo, custo_km, empresa_id,
// motorista_padrao, ativo, observações.
//
// custo_km = combustível + manutenção + depreciação por km (valor final em R$/km).
// Esse valor multiplica o km_rodado da rota pra gerar o custo total que é
// rateado entre as paradas com sale_id.

const db = require('./bi-estoque-db');

function _pool() { return db.getPool(); }

const uid = () => 'veic_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

async function ensureTable() {
  const pool = _pool();
  if (!pool) return;
  const sqls = [
    `CREATE TABLE IF NOT EXISTS bi_veiculos (
      id TEXT PRIMARY KEY,
      placa TEXT,
      marca TEXT,
      modelo TEXT,
      ano INT,
      tipo TEXT,                         -- van, carro, moto, caminhao
      custo_km NUMERIC(10,4) DEFAULT 0,  -- R$/km (combustível + manutenção + depreciação)
      empresa_id TEXT REFERENCES bi_empresas(id) ON DELETE SET NULL,
      motorista_padrao TEXT,
      motorista_padrao_username TEXT,
      ativo BOOLEAN DEFAULT TRUE,
      observacoes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      updated_by TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS idx_veiculos_ativo ON bi_veiculos (ativo)`,
    `CREATE INDEX IF NOT EXISTS idx_veiculos_empresa ON bi_veiculos (empresa_id)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_veiculos_placa ON bi_veiculos (upper(placa)) WHERE placa IS NOT NULL AND placa <> ''`,
  ];
  for (const sql of sqls) {
    try { await pool.query(sql); }
    catch(e) { console.error('[bi-veiculos ensure]', e.message); throw e; }
  }
  console.log('[bi-veiculos] tabela criada/verificada');
}

async function listAll(opts = {}) {
  const pool = _pool(); if (!pool) return [];
  const conds = []; const params = [];
  if (opts.ativo !== undefined) { params.push(!!opts.ativo); conds.push(`ativo = $${params.length}`); }
  if (opts.empresaId) { params.push(opts.empresaId); conds.push(`empresa_id = $${params.length}`); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const r = await pool.query(`SELECT * FROM bi_veiculos ${where} ORDER BY placa NULLS LAST, modelo LIMIT 500`, params);
  return r.rows;
}

async function get(id) {
  const pool = _pool(); if (!pool) return null;
  const r = await pool.query('SELECT * FROM bi_veiculos WHERE id = $1', [id]);
  return r.rows[0] || null;
}

async function upsert(patch, who) {
  const pool = _pool(); if (!pool) throw new Error('Postgres não conectado');
  const placa = String(patch.placa||'').toUpperCase().replace(/[^A-Z0-9]/g,'') || null;
  const modelo = String(patch.modelo||'').trim();
  if (!placa && !modelo) throw new Error('placa ou modelo obrigatório');
  const id = patch.id || uid();
  const cur = await get(id);
  const cols = {
    placa,
    marca: patch.marca || null,
    modelo: modelo || null,
    ano: patch.ano ? parseInt(patch.ano,10) : null,
    tipo: patch.tipo || null,
    custo_km: Number(patch.custoKm || patch.custo_km || 0),
    empresa_id: patch.empresaId || patch.empresa_id || null,
    motorista_padrao: patch.motoristaPadrao || patch.motorista_padrao || null,
    motorista_padrao_username: patch.motoristaPadraoUsername || patch.motorista_padrao_username || null,
    ativo: patch.ativo !== undefined ? !!patch.ativo : (cur?.ativo !== false),
    observacoes: patch.observacoes || null,
  };
  if (cur) {
    const setSql = Object.keys(cols).map((k,i) => `${k} = $${i+2}`).join(', ');
    const params = [id, ...Object.values(cols)];
    await pool.query(`UPDATE bi_veiculos SET ${setSql}, updated_at=NOW(), updated_by=$${params.length+1} WHERE id=$1`, [...params, who||null]);
  } else {
    const colNames = ['id', ...Object.keys(cols), 'updated_by'];
    const placeholders = colNames.map((_,i) => '$'+(i+1)).join(',');
    const params = [id, ...Object.values(cols), who || null];
    await pool.query(`INSERT INTO bi_veiculos (${colNames.join(',')}) VALUES (${placeholders})`, params);
  }
  return get(id);
}

async function remove(id) {
  const pool = _pool(); if (!pool) return false;
  const r = await pool.query('DELETE FROM bi_veiculos WHERE id = $1', [id]);
  return r.rowCount > 0;
}

module.exports = { ensureTable, listAll, get, upsert, remove };
