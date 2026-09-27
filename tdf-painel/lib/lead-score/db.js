/**
 * Lead Score — Camada de banco.
 * Idempotente: cria tabelas em qualquer boot, suporta upgrade aditivo.
 *
 * Tabelas:
 *   lead_score_criteria          regras configuráveis (CRUD via UI)
 *   lead_score_distance_bands    faixas de distância por produto
 *   lead_score_settings          config geral (tier thresholds, regras especiais)
 *   lead_score_cities            cidade → km até SJC
 *   lead_score_history           snapshots de cálculo por deal
 *   lead_score_audit             auditoria de alterações em regras/settings
 *   lead_score_manual_overrides  ajustes manuais de gestor (score/tier)
 *   lead_score_recalc_log        trilha de gatilhos de recálculo
 */

const SCHEMAS = [
  /* ---------- 1. CRITÉRIOS ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_criteria (
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    product_type TEXT NOT NULL,
    condition_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    points INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    priority INTEGER NOT NULL DEFAULT 100,
    accumulable BOOLEAN NOT NULL DEFAULT TRUE,
    group_key TEXT,
    group_cap INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lsc_product ON lead_score_criteria(product_type)`,
  `CREATE INDEX IF NOT EXISTS idx_lsc_active ON lead_score_criteria(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_lsc_group ON lead_score_criteria(product_type, group_key)`,

  /* ---------- 2. FAIXAS DE DISTÂNCIA ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_distance_bands (
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL,
    product_type TEXT NOT NULL,
    label TEXT NOT NULL,
    min_km NUMERIC(7,2),
    max_km NUMERIC(7,2),
    points INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    priority INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT,
    UNIQUE (code, product_type)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lsdb_product ON lead_score_distance_bands(product_type)`,
  `CREATE INDEX IF NOT EXISTS idx_lsdb_active ON lead_score_distance_bands(is_active)`,

  /* ---------- 3. SETTINGS GERAIS (tiers, regras especiais) ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_settings (
    key TEXT PRIMARY KEY,
    value_json JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT
  )`,

  /* ---------- 4. CIDADES → KM ATÉ SJC ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_cities (
    id BIGSERIAL PRIMARY KEY,
    cidade_normalizada TEXT NOT NULL UNIQUE,
    cidade_display TEXT NOT NULL,
    uf TEXT,
    distance_km_sjc NUMERIC(7,2),
    aliases_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lsc_cities_norm ON lead_score_cities(cidade_normalizada)`,

  /* ---------- 5. HISTÓRICO DE SCORES ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_history (
    id BIGSERIAL PRIMARY KEY,
    deal_id TEXT NOT NULL,
    deal_name TEXT,
    product_type TEXT,
    score_auto INTEGER NOT NULL,
    tier_auto TEXT NOT NULL,
    score_manual INTEGER,
    tier_manual TEXT,
    score_final INTEGER NOT NULL,
    tier_final TEXT NOT NULL,
    breakdown_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    lead_ctx_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    trigger_reason TEXT,
    pushed_to_zoho BOOLEAN NOT NULL DEFAULT FALSE,
    zoho_push_error TEXT,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lsh_deal ON lead_score_history(deal_id, calculated_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_lsh_calc ON lead_score_history(calculated_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_lsh_tier ON lead_score_history(tier_final)`,

  /* ---------- 6. AUDITORIA DE ALTERAÇÕES ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_audit (
    id BIGSERIAL PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    target_label TEXT,
    field_changed TEXT,
    old_value TEXT,
    new_value TEXT,
    reason TEXT,
    metadata_json JSONB DEFAULT '{}'::jsonb
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lsa_occurred ON lead_score_audit(occurred_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_lsa_actor ON lead_score_audit(actor)`,
  `CREATE INDEX IF NOT EXISTS idx_lsa_target ON lead_score_audit(target_type, target_id)`,

  /* ---------- 7. OVERRIDES MANUAIS ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_manual_overrides (
    id BIGSERIAL PRIMARY KEY,
    deal_id TEXT NOT NULL,
    score_manual INTEGER,
    tier_manual TEXT,
    reason TEXT NOT NULL,
    actor TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lsmo_deal ON lead_score_manual_overrides(deal_id, is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_lsmo_actor ON lead_score_manual_overrides(actor)`,

  /* ---------- 8. RECALC LOG (gatilhos) ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_recalc_log (
    id BIGSERIAL PRIMARY KEY,
    deal_id TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    requested_by TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'queued',
    error_msg TEXT,
    history_id BIGINT REFERENCES lead_score_history(id) ON DELETE SET NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lsrl_deal ON lead_score_recalc_log(deal_id, requested_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_lsrl_status ON lead_score_recalc_log(status)`,

  /* ---------- 9. CADÊNCIA POR TIER × PRODUTO (config) ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_cadence (
    id BIGSERIAL PRIMARY KEY,
    tier TEXT NOT NULL,
    sla_first_call_minutes INTEGER NOT NULL DEFAULT 60,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    assignee_role TEXT NOT NULL DEFAULT 'sdr',
    steps_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT
  )`,
  // adiciona product_type/layout/pipeline (NULL = wildcard de fallback)
  `ALTER TABLE lead_score_cadence ADD COLUMN IF NOT EXISTS product_type TEXT`,
  `ALTER TABLE lead_score_cadence ADD COLUMN IF NOT EXISTS layout TEXT`,
  `ALTER TABLE lead_score_cadence ADD COLUMN IF NOT EXISTS pipeline TEXT`,
  `ALTER TABLE lead_score_cadence ADD COLUMN IF NOT EXISTS stage TEXT`,
  `ALTER TABLE lead_score_cadence ADD COLUMN IF NOT EXISTS remind_default BOOLEAN NOT NULL DEFAULT TRUE`,
  `ALTER TABLE lead_score_cadence ADD COLUMN IF NOT EXISTS assignee_pool_json JSONB DEFAULT NULL`,
  `ALTER TABLE lead_score_cadence DROP CONSTRAINT IF EXISTS lead_score_cadence_tier_key`,
  `DROP INDEX IF EXISTS uniq_lsc_tier_product`,
  `DROP INDEX IF EXISTS uniq_lsc_tier_product_layout_pipeline`,
  `CREATE UNIQUE INDEX IF NOT EXISTS uniq_lsc_tier_5filters
     ON lead_score_cadence (tier, COALESCE(product_type, ''), COALESCE(layout, ''), COALESCE(pipeline, ''), COALESCE(stage, ''))`,

  /* ---------- 10. RUNS DE CADÊNCIA POR DEAL ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_cadence_runs (
    id BIGSERIAL PRIMARY KEY,
    deal_id TEXT NOT NULL,
    cadence_tier TEXT NOT NULL,
    step_index_current INTEGER NOT NULL DEFAULT 0,
    next_action_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active',
    last_zoho_task_id TEXT,
    last_task_created_at TIMESTAMPTZ,
    cancelled_reason TEXT,
    history_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
  )`,
  `ALTER TABLE lead_score_cadence_runs ADD COLUMN IF NOT EXISTS cadence_product_type TEXT`,
  `ALTER TABLE lead_score_cadence_runs ADD COLUMN IF NOT EXISTS cadence_layout TEXT`,
  `ALTER TABLE lead_score_cadence_runs ADD COLUMN IF NOT EXISTS cadence_pipeline TEXT`,
  `ALTER TABLE lead_score_cadence_runs ADD COLUMN IF NOT EXISTS cadence_stage TEXT`,
  `CREATE INDEX IF NOT EXISTS idx_lscr_deal ON lead_score_cadence_runs(deal_id, status)`,
  `CREATE INDEX IF NOT EXISTS idx_lscr_next ON lead_score_cadence_runs(next_action_at) WHERE status='active'`,
  `CREATE INDEX IF NOT EXISTS idx_lscr_status ON lead_score_cadence_runs(status)`,

  /* ---------- 11. AUDITORIA DE ATIVIDADES (toda tentativa de criar Task/Call) ---------- */
  `CREATE TABLE IF NOT EXISTS lead_score_activity_audit (
    id BIGSERIAL PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deal_id TEXT NOT NULL,
    cadence_run_id BIGINT,
    cadence_tier TEXT,
    cadence_product_type TEXT,
    cadence_stage TEXT,
    step_index INTEGER,
    activity_kind TEXT,
    owner_zoho_name TEXT,
    owner_zoho_id TEXT,
    target_user TEXT,
    product_type TEXT,
    status TEXT NOT NULL,
    block_reason TEXT,
    zoho_id TEXT,
    requested_by TEXT,
    metadata_json JSONB DEFAULT '{}'::jsonb
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lsaa_deal ON lead_score_activity_audit(deal_id, occurred_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_lsaa_status ON lead_score_activity_audit(status)`,
  `CREATE INDEX IF NOT EXISTS idx_lsaa_occurred ON lead_score_activity_audit(occurred_at DESC)`,
];

async function ensureSchema(pool) {
  if (!pool) throw new Error('[lead-score/db] pool ausente');
  for (const sql of SCHEMAS) {
    await pool.query(sql);
  }
  console.log('[lead-score] schema OK (8 tabelas)');
}

/* ============================== CRITÉRIOS ============================== */

async function listCriteria(pool, { productType, includeInactive } = {}) {
  const params = [];
  const where = [];
  if (productType) { params.push(productType); where.push(`product_type = $${params.length}`); }
  if (!includeInactive) where.push('is_active = TRUE');
  const sql = `
    SELECT * FROM lead_score_criteria
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY product_type, priority ASC, points DESC
  `;
  const r = await pool.query(sql, params);
  return r.rows;
}

async function getCriterion(pool, id) {
  const r = await pool.query('SELECT * FROM lead_score_criteria WHERE id = $1', [id]);
  return r.rows[0] || null;
}

async function upsertCriterion(pool, payload, actor) {
  const cols = [
    'code', 'name', 'description', 'product_type', 'condition_json',
    'points', 'is_active', 'priority', 'accumulable', 'group_key', 'group_cap'
  ];
  const vals = [
    payload.code, payload.name, payload.description || null, payload.product_type,
    JSON.stringify(payload.condition_json || {}),
    Number(payload.points || 0),
    payload.is_active !== false,
    Number(payload.priority || 100),
    payload.accumulable !== false,
    payload.group_key || null,
    payload.group_cap != null ? Number(payload.group_cap) : null,
  ];

  if (payload.id) {
    const placeholders = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
    vals.push(actor, payload.id);
    const sql = `
      UPDATE lead_score_criteria
      SET ${placeholders}, updated_at = NOW(), updated_by = $${cols.length + 1}
      WHERE id = $${cols.length + 2}
      RETURNING *
    `;
    const r = await pool.query(sql, vals);
    return r.rows[0];
  } else {
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    vals.push(actor);
    const sql = `
      INSERT INTO lead_score_criteria (${cols.join(', ')}, created_by, updated_by)
      VALUES (${placeholders}, $${cols.length + 1}, $${cols.length + 1})
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        product_type = EXCLUDED.product_type,
        condition_json = EXCLUDED.condition_json,
        points = EXCLUDED.points,
        is_active = EXCLUDED.is_active,
        priority = EXCLUDED.priority,
        accumulable = EXCLUDED.accumulable,
        group_key = EXCLUDED.group_key,
        group_cap = EXCLUDED.group_cap,
        updated_at = NOW(),
        updated_by = EXCLUDED.updated_by
      RETURNING *
    `;
    const r = await pool.query(sql, vals);
    return r.rows[0];
  }
}

async function deleteCriterion(pool, id) {
  await pool.query('DELETE FROM lead_score_criteria WHERE id = $1', [id]);
}

/* ============================== FAIXAS DE DISTÂNCIA ============================== */

async function listDistanceBands(pool, { productType, includeInactive } = {}) {
  const params = [];
  const where = [];
  if (productType) { params.push(productType); where.push(`product_type = $${params.length}`); }
  if (!includeInactive) where.push('is_active = TRUE');
  const sql = `
    SELECT * FROM lead_score_distance_bands
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY product_type, priority ASC
  `;
  const r = await pool.query(sql, params);
  return r.rows;
}

async function upsertDistanceBand(pool, payload, actor) {
  const sql = `
    INSERT INTO lead_score_distance_bands
      (code, product_type, label, min_km, max_km, points, is_active, priority, created_by, updated_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)
    ON CONFLICT (code, product_type) DO UPDATE SET
      label = EXCLUDED.label,
      min_km = EXCLUDED.min_km,
      max_km = EXCLUDED.max_km,
      points = EXCLUDED.points,
      is_active = EXCLUDED.is_active,
      priority = EXCLUDED.priority,
      updated_at = NOW(),
      updated_by = EXCLUDED.updated_by
    RETURNING *
  `;
  const r = await pool.query(sql, [
    payload.code,
    payload.product_type,
    payload.label,
    payload.min_km != null ? Number(payload.min_km) : null,
    payload.max_km != null ? Number(payload.max_km) : null,
    Number(payload.points || 0),
    payload.is_active !== false,
    Number(payload.priority || 100),
    actor,
  ]);
  return r.rows[0];
}

async function deleteDistanceBand(pool, id) {
  await pool.query('DELETE FROM lead_score_distance_bands WHERE id = $1', [id]);
}

/* ============================== SETTINGS ============================== */

async function getSetting(pool, key, fallback = null) {
  const r = await pool.query('SELECT value_json FROM lead_score_settings WHERE key = $1', [key]);
  if (!r.rows[0]) return fallback;
  return r.rows[0].value_json;
}

async function setSetting(pool, key, valueJson, description, actor) {
  const sql = `
    INSERT INTO lead_score_settings (key, value_json, description, updated_by)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (key) DO UPDATE SET
      value_json = EXCLUDED.value_json,
      description = COALESCE(EXCLUDED.description, lead_score_settings.description),
      updated_at = NOW(),
      updated_by = EXCLUDED.updated_by
    RETURNING *
  `;
  const r = await pool.query(sql, [key, JSON.stringify(valueJson), description || null, actor || 'system']);
  return r.rows[0];
}

async function listSettings(pool) {
  const r = await pool.query('SELECT * FROM lead_score_settings ORDER BY key');
  return r.rows;
}

/* ============================== CIDADES ============================== */

async function upsertCity(pool, { cidade_normalizada, cidade_display, uf, distance_km_sjc, aliases }) {
  const sql = `
    INSERT INTO lead_score_cities (cidade_normalizada, cidade_display, uf, distance_km_sjc, aliases_json)
    VALUES ($1,$2,$3,$4,$5::jsonb)
    ON CONFLICT (cidade_normalizada) DO UPDATE SET
      cidade_display = EXCLUDED.cidade_display,
      uf = EXCLUDED.uf,
      distance_km_sjc = EXCLUDED.distance_km_sjc,
      aliases_json = EXCLUDED.aliases_json,
      updated_at = NOW()
    RETURNING *
  `;
  const r = await pool.query(sql, [
    cidade_normalizada,
    cidade_display,
    uf || null,
    distance_km_sjc != null ? Number(distance_km_sjc) : null,
    JSON.stringify(aliases || []),
  ]);
  return r.rows[0];
}

async function findCityDistance(pool, normalized) {
  const sql = `
    SELECT cidade_display, distance_km_sjc
    FROM lead_score_cities
    WHERE cidade_normalizada = $1 OR aliases_json ? $1
    LIMIT 1
  `;
  const r = await pool.query(sql, [normalized]);
  if (!r.rows[0]) return null;
  return { display: r.rows[0].cidade_display, km: r.rows[0].distance_km_sjc != null ? Number(r.rows[0].distance_km_sjc) : null };
}

async function listCities(pool, { q, limit = 200 } = {}) {
  const params = [];
  let where = '';
  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    where = `WHERE cidade_normalizada ILIKE $1 OR cidade_display ILIKE $1`;
  }
  params.push(limit);
  const sql = `
    SELECT * FROM lead_score_cities
    ${where}
    ORDER BY cidade_display
    LIMIT $${params.length}
  `;
  const r = await pool.query(sql, params);
  return r.rows;
}

/* ============================== HISTÓRICO ============================== */

async function insertHistory(pool, payload) {
  const sql = `
    INSERT INTO lead_score_history (
      deal_id, deal_name, product_type, score_auto, tier_auto,
      score_manual, tier_manual, score_final, tier_final,
      breakdown_json, lead_ctx_json, trigger_reason, pushed_to_zoho, zoho_push_error
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12,$13,$14)
    RETURNING *
  `;
  const r = await pool.query(sql, [
    String(payload.deal_id),
    payload.deal_name || null,
    payload.product_type || null,
    Number(payload.score_auto || 0),
    payload.tier_auto || 'PEDRA',
    payload.score_manual != null ? Number(payload.score_manual) : null,
    payload.tier_manual || null,
    Number(payload.score_final || payload.score_auto || 0),
    payload.tier_final || payload.tier_auto || 'PEDRA',
    JSON.stringify(payload.breakdown || {}),
    JSON.stringify(payload.lead_ctx || {}),
    payload.trigger_reason || null,
    !!payload.pushed_to_zoho,
    payload.zoho_push_error || null,
  ]);
  return r.rows[0];
}

async function lastHistoryForDeal(pool, dealId) {
  const r = await pool.query(
    `SELECT * FROM lead_score_history WHERE deal_id = $1 ORDER BY calculated_at DESC LIMIT 1`,
    [String(dealId)]
  );
  return r.rows[0] || null;
}

async function historyForDeal(pool, dealId, limit = 20) {
  const r = await pool.query(
    `SELECT * FROM lead_score_history WHERE deal_id = $1 ORDER BY calculated_at DESC LIMIT $2`,
    [String(dealId), limit]
  );
  return r.rows;
}

/* ============================== AUDITORIA ============================== */

async function insertAudit(pool, payload) {
  const sql = `
    INSERT INTO lead_score_audit
      (actor, target_type, target_id, target_label, field_changed, old_value, new_value, reason, metadata_json)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)
    RETURNING *
  `;
  const r = await pool.query(sql, [
    payload.actor || 'system',
    payload.target_type,
    payload.target_id != null ? String(payload.target_id) : null,
    payload.target_label || null,
    payload.field_changed || null,
    payload.old_value != null ? String(payload.old_value) : null,
    payload.new_value != null ? String(payload.new_value) : null,
    payload.reason || null,
    JSON.stringify(payload.metadata || {}),
  ]);
  return r.rows[0];
}

async function listAudit(pool, { limit = 100, actor, target_type } = {}) {
  const params = [];
  const where = [];
  if (actor) { params.push(actor); where.push(`actor = $${params.length}`); }
  if (target_type) { params.push(target_type); where.push(`target_type = $${params.length}`); }
  params.push(limit);
  const sql = `
    SELECT * FROM lead_score_audit
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY occurred_at DESC
    LIMIT $${params.length}
  `;
  const r = await pool.query(sql, params);
  return r.rows;
}

/* ============================== OVERRIDES MANUAIS ============================== */

async function insertManualOverride(pool, payload) {
  if (!payload.reason || String(payload.reason).trim().length < 3) {
    throw new Error('reason obrigatório (mínimo 3 chars)');
  }
  await pool.query(
    `UPDATE lead_score_manual_overrides SET is_active = FALSE WHERE deal_id = $1 AND is_active = TRUE`,
    [String(payload.deal_id)]
  );
  const sql = `
    INSERT INTO lead_score_manual_overrides
      (deal_id, score_manual, tier_manual, reason, actor, expires_at)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `;
  const r = await pool.query(sql, [
    String(payload.deal_id),
    payload.score_manual != null ? Number(payload.score_manual) : null,
    payload.tier_manual || null,
    payload.reason,
    payload.actor || 'system',
    payload.expires_at || null,
  ]);
  return r.rows[0];
}

async function activeManualOverride(pool, dealId) {
  const r = await pool.query(
    `SELECT * FROM lead_score_manual_overrides
     WHERE deal_id = $1 AND is_active = TRUE
       AND (expires_at IS NULL OR expires_at > NOW())
     ORDER BY created_at DESC LIMIT 1`,
    [String(dealId)]
  );
  return r.rows[0] || null;
}

async function clearManualOverride(pool, dealId, actor, reason) {
  await pool.query(
    `UPDATE lead_score_manual_overrides SET is_active = FALSE WHERE deal_id = $1 AND is_active = TRUE`,
    [String(dealId)]
  );
  await insertAudit(pool, {
    actor: actor || 'system',
    target_type: 'manual_override',
    target_id: dealId,
    field_changed: 'is_active',
    old_value: 'true',
    new_value: 'false',
    reason: reason || 'cleared',
  });
}

async function listManualOverrides(pool, { limit = 100 } = {}) {
  const r = await pool.query(
    `SELECT * FROM lead_score_manual_overrides
     WHERE is_active = TRUE
     ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return r.rows;
}

/* ============================== RECALC LOG ============================== */

async function logRecalc(pool, payload) {
  const sql = `
    INSERT INTO lead_score_recalc_log (deal_id, trigger_event, requested_by, status)
    VALUES ($1,$2,$3,'queued')
    RETURNING *
  `;
  const r = await pool.query(sql, [
    String(payload.deal_id),
    payload.trigger_event,
    payload.requested_by || 'system',
  ]);
  return r.rows[0];
}

async function markRecalcDone(pool, id, { status, error_msg, history_id }) {
  await pool.query(
    `UPDATE lead_score_recalc_log
     SET status = $2, error_msg = $3, history_id = $4, completed_at = NOW()
     WHERE id = $1`,
    [id, status || 'done', error_msg || null, history_id || null]
  );
}

/* ============================== CADÊNCIA POR TIER ============================== */

async function listCadences(pool, { productType, layout, pipeline, stage } = {}) {
  const params = [];
  const where = [];
  // Caso especial: tudo vazio/FALLBACK → só fallback puro (4 NULLs)
  const wantFallback = (productType === 'FALLBACK' || productType === '');
  if (wantFallback && layout == null && pipeline == null && stage == null) {
    where.push('product_type IS NULL', 'layout IS NULL', 'pipeline IS NULL', 'stage IS NULL');
  } else {
    if (productType) { params.push(productType); where.push(`product_type = $${params.length}`); }
    else if (productType === null) where.push('product_type IS NULL');
    if (layout) { params.push(layout); where.push(`layout = $${params.length}`); }
    else if (layout === null) where.push('layout IS NULL');
    if (pipeline) { params.push(pipeline); where.push(`pipeline = $${params.length}`); }
    else if (pipeline === null) where.push('pipeline IS NULL');
    if (stage) { params.push(stage); where.push(`stage = $${params.length}`); }
    else if (stage === null) where.push('stage IS NULL');
  }
  const sql = `
    SELECT * FROM lead_score_cadence
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY CASE tier
      WHEN 'DIAMANTE' THEN 1 WHEN 'OURO' THEN 2 WHEN 'PRATA' THEN 3
      WHEN 'BRONZE' THEN 4 WHEN 'PEDRA' THEN 5 ELSE 99
    END,
      product_type NULLS LAST, layout NULLS LAST, pipeline NULLS LAST, stage NULLS LAST
  `;
  const r = await pool.query(sql, params);
  return r.rows;
}

/**
 * Busca cadência em CASCATA (mais específica → menos), em UMA query.
 *
 * Cada cadência tem 4 filtros opcionais (product/layout/pipeline/stage).
 * NULL = wildcard (casa qualquer valor). Engine retorna a cadência ativa
 * que casa com o contexto do deal E tem maior specificity (mais filtros
 * preenchidos).
 *
 * 2^4 = 16 combinações possíveis; em vez de 16 queries seriais, faz UMA
 * com ORDER BY specificity DESC.
 *
 * Retorna a linha + _match_level indicando quais filtros casaram.
 */
async function getCadenceForTier(pool, tier, productType, layout, pipeline, stage) {
  if (!tier) return null;
  const tierU = String(tier).toUpperCase();
  const product = productType || null;
  const lay = layout || null;
  const pipe = pipeline || null;
  const stg = stage || null;

  const r = await pool.query(
    `SELECT *,
       (CASE WHEN product_type IS NULL THEN 0 ELSE 1 END +
        CASE WHEN layout       IS NULL THEN 0 ELSE 1 END +
        CASE WHEN pipeline     IS NULL THEN 0 ELSE 1 END +
        CASE WHEN stage        IS NULL THEN 0 ELSE 1 END) AS _specificity
     FROM lead_score_cadence
     WHERE tier = $1
       AND is_active = TRUE
       AND (product_type IS NULL OR product_type = $2)
       AND (layout       IS NULL OR layout       = $3)
       AND (pipeline     IS NULL OR pipeline     = $4)
       AND (stage        IS NULL OR stage        = $5)
     ORDER BY _specificity DESC, id ASC
     LIMIT 1`,
    [tierU, product, lay, pipe, stg]
  );
  const row = r.rows[0];
  if (!row) return null;
  row._match_level = {
    product: !!row.product_type,
    layout: !!row.layout,
    pipeline: !!row.pipeline,
    stage: !!row.stage,
  };
  return row;
}

async function upsertCadence(pool, payload, actor) {
  const tier = String(payload.tier).toUpperCase();
  const productType = payload.product_type || null;
  const layout = payload.layout || null;
  const pipeline = payload.pipeline || null;
  const stage = payload.stage || null;

  const updateSql = `
    UPDATE lead_score_cadence SET
      sla_first_call_minutes = $6,
      max_attempts = $7,
      assignee_role = $8,
      steps_json = $9::jsonb,
      is_active = $10,
      notes = $11,
      remind_default = $12,
      assignee_pool_json = $14::jsonb,
      updated_at = NOW(),
      updated_by = $13
    WHERE tier = $1
      AND COALESCE(product_type, '') = COALESCE($2::text, '')
      AND COALESCE(layout, '')       = COALESCE($3::text, '')
      AND COALESCE(pipeline, '')     = COALESCE($4::text, '')
      AND COALESCE(stage, '')        = COALESCE($5::text, '')
    RETURNING *
  `;
  const poolArr = Array.isArray(payload.assignee_pool) ? payload.assignee_pool
                  : (Array.isArray(payload.assignee_pool_json) ? payload.assignee_pool_json : null);
  const params = [
    tier, productType, layout, pipeline, stage,
    Number(payload.sla_first_call_minutes || 60),
    Number(payload.max_attempts || 3),
    payload.assignee_role || 'sdr',
    JSON.stringify(payload.steps || payload.steps_json || []),
    payload.is_active !== false,
    payload.notes || null,
    payload.remind_default !== false,
    actor,
    poolArr && poolArr.length ? JSON.stringify(poolArr) : null,
  ];
  const r = await pool.query(updateSql, params);
  if (r.rows[0]) return r.rows[0];

  const insertSql = `
    INSERT INTO lead_score_cadence (
      tier, product_type, layout, pipeline, stage,
      sla_first_call_minutes, max_attempts, assignee_role,
      steps_json, is_active, notes, remind_default, created_by, updated_by, assignee_pool_json
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$13,$14::jsonb)
    RETURNING *
  `;
  const r2 = await pool.query(insertSql, params);
  return r2.rows[0];
}

async function deleteCadence(pool, id) {
  await pool.query(`DELETE FROM lead_score_cadence WHERE id = $1`, [id]);
}

/* ============================== RUNS DE CADÊNCIA ============================== */

async function activeCadenceRun(pool, dealId) {
  const r = await pool.query(
    `SELECT * FROM lead_score_cadence_runs WHERE deal_id = $1 AND status = 'active' ORDER BY started_at DESC LIMIT 1`,
    [String(dealId)]
  );
  return r.rows[0] || null;
}

async function insertCadenceRun(pool, payload) {
  const sql = `
    INSERT INTO lead_score_cadence_runs
      (deal_id, cadence_tier, cadence_product_type, cadence_layout, cadence_pipeline, cadence_stage,
       step_index_current, next_action_at, status, history_json)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active',$9::jsonb)
    RETURNING *
  `;
  const r = await pool.query(sql, [
    String(payload.deal_id),
    String(payload.cadence_tier).toUpperCase(),
    payload.cadence_product_type || null,
    payload.cadence_layout || null,
    payload.cadence_pipeline || null,
    payload.cadence_stage || null,
    Number(payload.step_index_current || 0),
    payload.next_action_at || null,
    JSON.stringify(payload.history || []),
  ]);
  return r.rows[0];
}

async function updateCadenceRun(pool, id, fields) {
  const cols = [];
  const vals = [];
  let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (k === 'history_json' && typeof v !== 'string') {
      cols.push(`${k} = $${i}::jsonb`); vals.push(JSON.stringify(v));
    } else {
      cols.push(`${k} = $${i}`); vals.push(v);
    }
    i++;
  }
  vals.push(id);
  const sql = `UPDATE lead_score_cadence_runs SET ${cols.join(', ')} WHERE id = $${i} RETURNING *`;
  const r = await pool.query(sql, vals);
  return r.rows[0];
}

async function cancelCadenceRun(pool, dealId, reason) {
  await pool.query(
    `UPDATE lead_score_cadence_runs
     SET status = 'cancelled', cancelled_reason = $2, completed_at = NOW()
     WHERE deal_id = $1 AND status = 'active'`,
    [String(dealId), reason || 'cancelled']
  );
}

async function listCadenceRuns(pool, { status = 'active', limit = 200 } = {}) {
  const r = await pool.query(
    `SELECT * FROM lead_score_cadence_runs
     WHERE status = $1
     ORDER BY next_action_at NULLS LAST, started_at DESC
     LIMIT $2`,
    [status, limit]
  );
  return r.rows;
}

async function dueCadenceRuns(pool, { limit = 50 } = {}) {
  const r = await pool.query(
    `SELECT * FROM lead_score_cadence_runs
     WHERE status = 'active' AND next_action_at IS NOT NULL AND next_action_at <= NOW()
     ORDER BY next_action_at ASC
     LIMIT $1`,
    [limit]
  );
  return r.rows;
}

module.exports = {
  ensureSchema,
  // criteria
  listCriteria, getCriterion, upsertCriterion, deleteCriterion,
  // distance bands
  listDistanceBands, upsertDistanceBand, deleteDistanceBand,
  // settings
  getSetting, setSetting, listSettings,
  // cities
  upsertCity, findCityDistance, listCities,
  // history
  insertHistory, lastHistoryForDeal, historyForDeal,
  // audit
  insertAudit, listAudit,
  // manual
  insertManualOverride, activeManualOverride, clearManualOverride, listManualOverrides,
  // recalc
  logRecalc, markRecalcDone,
  // cadence config
  listCadences, getCadenceForTier, upsertCadence, deleteCadence,
  // cadence runs
  activeCadenceRun, insertCadenceRun, updateCadenceRun, cancelCadenceRun,
  listCadenceRuns, dueCadenceRuns,
  // activity audit
  insertActivityAudit, listActivityAudit, listWrongOwnerActivities,
};

/* ============================== ACTIVITY AUDIT ============================== */

async function insertActivityAudit(pool, payload) {
  const sql = `
    INSERT INTO lead_score_activity_audit (
      deal_id, cadence_run_id, cadence_tier, cadence_product_type, cadence_stage,
      step_index, activity_kind, owner_zoho_name, owner_zoho_id, target_user,
      product_type, status, block_reason, zoho_id, requested_by, metadata_json
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb)
    RETURNING *
  `;
  const r = await pool.query(sql, [
    String(payload.deal_id),
    payload.cadence_run_id != null ? Number(payload.cadence_run_id) : null,
    payload.cadence_tier || null,
    payload.cadence_product_type || null,
    payload.cadence_stage || null,
    payload.step_index != null ? Number(payload.step_index) : null,
    payload.activity_kind || null,
    payload.owner_zoho_name || null,
    payload.owner_zoho_id || null,
    payload.target_user || null,
    payload.product_type || null,
    payload.status,
    payload.block_reason || null,
    payload.zoho_id || null,
    payload.requested_by || 'system',
    JSON.stringify(payload.metadata || {}),
  ]);
  return r.rows[0];
}

async function listActivityAudit(pool, { limit = 200, status, deal_id, dryRunOnly } = {}) {
  const params = [];
  const where = [];
  if (status) { params.push(status); where.push(`status = $${params.length}`); }
  if (deal_id) { params.push(deal_id); where.push(`deal_id = $${params.length}`); }
  if (dryRunOnly) where.push(`status = 'DRY_RUN'`);
  params.push(limit);
  const sql = `
    SELECT * FROM lead_score_activity_audit
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY occurred_at DESC LIMIT $${params.length}
  `;
  const r = await pool.query(sql, params);
  return r.rows;
}

async function listWrongOwnerActivities(pool, { limit = 200 } = {}) {
  const r = await pool.query(`
    SELECT * FROM lead_score_activity_audit
    WHERE (status IN ('OWNER_INVALIDO_PARA_PRODUTO','OWNER_DIFFERENT_FROM_DEAL','OWNER_INACTIVE','PRODUCT_PERMISSION_DENIED')
       OR (target_user IS NOT NULL AND owner_zoho_name IS NOT NULL AND target_user <> owner_zoho_name))
    ORDER BY occurred_at DESC LIMIT $1
  `, [limit]);
  return r.rows;
}
