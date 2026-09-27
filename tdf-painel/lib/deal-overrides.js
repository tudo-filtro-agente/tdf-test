// === Deal Overrides ===
// Permite admin ajustar visualmente categoria e vendedor de um deal SEM mexer no Zoho.
// Persistência em Postgres. Aplicado em qualquer endpoint que renderiza listas de deals.

const VALID_CATEGORIES = [
  'filtro_entrada',
  'bebedouro',
  'refil',
  'elemento_filtrante',
  'iron_free',
  'scale_stop',
  'purificador',
  'condominio',
  'loja',
  'outros',
];

async function ensureTable(pool) {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deal_overrides (
      deal_id TEXT PRIMARY KEY,
      category_override TEXT,
      vendedor_override_id TEXT,
      vendedor_override_name TEXT,
      changed_by TEXT NOT NULL,
      changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reason TEXT
    )
  `);
}

async function setOverride(pool, dealId, { category, vendedorId, vendedorName, changedBy, reason }) {
  if (!pool) throw new Error('pg pool não disponível');
  if (!dealId) throw new Error('deal_id obrigatório');
  if (!changedBy) throw new Error('changed_by obrigatório');
  if (category && !VALID_CATEGORIES.includes(category)) {
    throw new Error(`categoria inválida: ${category}. Use: ${VALID_CATEGORIES.join(', ')}`);
  }
  await pool.query(
    `INSERT INTO deal_overrides (deal_id, category_override, vendedor_override_id, vendedor_override_name, changed_by, reason, changed_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (deal_id) DO UPDATE SET
       category_override = COALESCE(EXCLUDED.category_override, deal_overrides.category_override),
       vendedor_override_id = COALESCE(EXCLUDED.vendedor_override_id, deal_overrides.vendedor_override_id),
       vendedor_override_name = COALESCE(EXCLUDED.vendedor_override_name, deal_overrides.vendedor_override_name),
       changed_by = EXCLUDED.changed_by,
       reason = COALESCE(EXCLUDED.reason, deal_overrides.reason),
       changed_at = NOW()`,
    [dealId, category || null, vendedorId || null, vendedorName || null, changedBy, reason || null]
  );
  return { ok: true };
}

async function clearOverride(pool, dealId, field) {
  if (!pool) throw new Error('pg pool não disponível');
  if (field === 'category') {
    await pool.query(`UPDATE deal_overrides SET category_override = NULL, changed_at = NOW() WHERE deal_id = $1`, [dealId]);
  } else if (field === 'vendedor') {
    await pool.query(`UPDATE deal_overrides SET vendedor_override_id = NULL, vendedor_override_name = NULL, changed_at = NOW() WHERE deal_id = $1`, [dealId]);
  } else {
    await pool.query(`DELETE FROM deal_overrides WHERE deal_id = $1`, [dealId]);
  }
  return { ok: true };
}

async function getOverride(pool, dealId) {
  if (!pool) return null;
  const r = await pool.query('SELECT * FROM deal_overrides WHERE deal_id = $1', [dealId]);
  return r.rows[0] || null;
}

let _cache = { map: null, expiresAt: 0 };

async function getOverridesMap(pool, ttlMs = 30000) {
  if (!pool) return {};
  const now = Date.now();
  if (_cache.map && now < _cache.expiresAt) return _cache.map;
  const r = await pool.query('SELECT * FROM deal_overrides');
  const map = {};
  for (const row of r.rows) map[row.deal_id] = row;
  _cache = { map, expiresAt: now + ttlMs };
  return map;
}

function invalidateCache() {
  _cache = { map: null, expiresAt: 0 };
}

// Aplica override num deal individual. Não muta o original — retorna nova ref.
function applyOverride(deal, overrideMap) {
  if (!deal || !overrideMap) return deal;
  const ov = overrideMap[deal.id];
  if (!ov) return deal;
  const out = { ...deal };
  if (ov.category_override) {
    out._category_override = ov.category_override;
    out._override_changed_by = ov.changed_by;
    out._override_changed_at = ov.changed_at;
  }
  if (ov.vendedor_override_id || ov.vendedor_override_name) {
    out._owner_original = deal.Owner;
    out.Owner = {
      id: ov.vendedor_override_id || deal.Owner?.id,
      name: ov.vendedor_override_name || deal.Owner?.name,
      _override: true,
    };
  }
  return out;
}

// Aplica em lista. Retorna lista nova com refs novas só onde houve override.
function applyOverridesToList(deals, overrideMap) {
  if (!Array.isArray(deals) || !overrideMap) return deals;
  return deals.map(d => applyOverride(d, overrideMap));
}

module.exports = {
  VALID_CATEGORIES,
  ensureTable,
  setOverride,
  clearOverride,
  getOverride,
  getOverridesMap,
  invalidateCache,
  applyOverride,
  applyOverridesToList,
};
