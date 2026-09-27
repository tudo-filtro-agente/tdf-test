/**
 * Auditoria CRM — Camada de banco
 * Idempotente: cria tabelas em qualquer boot.
 * Tabelas: crm_audit_logs, crm_audit_alerts
 */

const SCHEMA_LOGS = `
CREATE TABLE IF NOT EXISTS crm_audit_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  crm_module TEXT NOT NULL,
  crm_record_id TEXT,
  crm_record_name TEXT,
  action_type TEXT NOT NULL,
  action_origin TEXT NOT NULL,
  actor_id TEXT,
  actor_name TEXT,
  seller_responsible_before TEXT,
  seller_responsible_after TEXT,
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  reason TEXT,
  rule_triggered TEXT,
  confidence_score NUMERIC(5,2),
  related_channel TEXT,
  validation_status TEXT NOT NULL DEFAULT 'valid',
  impact_type TEXT NOT NULL DEFAULT 'unknown',
  commercial_impact TEXT,
  crm_record_url TEXT,
  metadata_json JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_occurred ON crm_audit_logs(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_origin ON crm_audit_logs(action_origin);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON crm_audit_logs(actor_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON crm_audit_logs(crm_module, crm_record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON crm_audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON crm_audit_logs(validation_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_seller_after ON crm_audit_logs(seller_responsible_after);
`;

const SCHEMA_ALERTS = `
CREATE TABLE IF NOT EXISTS crm_audit_alerts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  crm_module TEXT,
  crm_record_id TEXT,
  crm_record_name TEXT,
  seller_id TEXT,
  seller_name TEXT,
  description TEXT NOT NULL,
  detected_rule TEXT NOT NULL,
  recommended_action TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ,
  notes TEXT,
  source_log_id BIGINT REFERENCES crm_audit_logs(id) ON DELETE SET NULL,
  metadata_json JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_audit_alerts_status ON crm_audit_alerts(status);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_severity ON crm_audit_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_seller ON crm_audit_alerts(seller_name);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_created ON crm_audit_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_record ON crm_audit_alerts(crm_module, crm_record_id);
`;

async function ensureSchema(pool) {
  if (!pool) throw new Error('[auditoria-crm/db] pool ausente');
  await pool.query(SCHEMA_LOGS);
  await pool.query(SCHEMA_ALERTS);
  console.log('[auditoria-crm] schema OK (crm_audit_logs + crm_audit_alerts)');
}

/* ----------------- INSERTS ----------------- */

const VALID_ORIGINS = new Set([
  'claude_director_ia', 'nubia_sdr_ia', 'n8n_automation', 'zoho_flow',
  'zapi', 'wati', 'salesiq', 'goto', 'seller_manual', 'manager_manual', 'system'
]);

const VALID_STATUSES = new Set(['valid', 'suspicious', 'error', 'pending_review']);
const VALID_IMPACT = new Set(['positive', 'neutral', 'negative', 'unknown']);

function normalizeLog(payload) {
  const p = payload || {};
  if (!p.action_type) throw new Error('action_type obrigatório');
  if (!p.action_origin) throw new Error('action_origin obrigatório');
  if (!p.crm_module) throw new Error('crm_module obrigatório');
  if (!VALID_ORIGINS.has(p.action_origin)) {
    p.action_origin = 'system';
  }
  if (p.validation_status && !VALID_STATUSES.has(p.validation_status)) {
    p.validation_status = 'pending_review';
  }
  if (p.impact_type && !VALID_IMPACT.has(p.impact_type)) {
    p.impact_type = 'unknown';
  }
  return p;
}

async function insertLog(pool, payload) {
  const p = normalizeLog(payload);
  const occurredAt = p.occurred_at ? new Date(p.occurred_at) : new Date();
  const sql = `
    INSERT INTO crm_audit_logs (
      occurred_at, crm_module, crm_record_id, crm_record_name,
      action_type, action_origin, actor_id, actor_name,
      seller_responsible_before, seller_responsible_after,
      field_changed, old_value, new_value, reason, rule_triggered,
      confidence_score, related_channel, validation_status,
      impact_type, commercial_impact, crm_record_url, metadata_json
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
    ) RETURNING id, created_at
  `;
  const params = [
    occurredAt,
    p.crm_module,
    p.crm_record_id || null,
    p.crm_record_name || null,
    p.action_type,
    p.action_origin,
    p.actor_id || null,
    p.actor_name || null,
    p.seller_responsible_before || null,
    p.seller_responsible_after || null,
    p.field_changed || null,
    p.old_value !== undefined && p.old_value !== null ? String(p.old_value) : null,
    p.new_value !== undefined && p.new_value !== null ? String(p.new_value) : null,
    p.reason || null,
    p.rule_triggered || null,
    p.confidence_score != null ? Number(p.confidence_score) : null,
    p.related_channel || null,
    p.validation_status || 'valid',
    p.impact_type || 'unknown',
    p.commercial_impact || null,
    p.crm_record_url || null,
    JSON.stringify(p.metadata_json || p.metadata || {})
  ];
  const r = await pool.query(sql, params);
  return r.rows[0];
}

async function insertAlert(pool, payload) {
  const p = payload || {};
  if (!p.alert_type) throw new Error('alert_type obrigatório');
  if (!p.detected_rule) throw new Error('detected_rule obrigatório');
  if (!p.description) throw new Error('description obrigatório');
  const sql = `
    INSERT INTO crm_audit_alerts (
      alert_type, severity, crm_module, crm_record_id, crm_record_name,
      seller_id, seller_name, description, detected_rule, recommended_action,
      status, source_log_id, metadata_json
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    ) RETURNING id
  `;
  const params = [
    p.alert_type,
    p.severity || 'medium',
    p.crm_module || null,
    p.crm_record_id || null,
    p.crm_record_name || null,
    p.seller_id || null,
    p.seller_name || null,
    p.description,
    p.detected_rule,
    p.recommended_action || null,
    p.status || 'open',
    p.source_log_id || null,
    JSON.stringify(p.metadata_json || {})
  ];
  const r = await pool.query(sql, params);
  return r.rows[0];
}

/* ----------------- QUERIES ----------------- */

function buildLogsWhere(filters) {
  const where = [];
  const params = [];
  let i = 1;

  if (filters.from) { where.push(`occurred_at >= $${i++}`); params.push(filters.from); }
  if (filters.to) { where.push(`occurred_at <= $${i++}`); params.push(filters.to); }
  if (filters.action_origin) { where.push(`action_origin = $${i++}`); params.push(filters.action_origin); }
  if (filters.action_origin_in && filters.action_origin_in.length) {
    const placeholders = filters.action_origin_in.map(() => `$${i++}`).join(',');
    where.push(`action_origin IN (${placeholders})`);
    params.push(...filters.action_origin_in);
  }
  if (filters.action_type) { where.push(`action_type = $${i++}`); params.push(filters.action_type); }
  if (filters.crm_module) { where.push(`crm_module = $${i++}`); params.push(filters.crm_module); }
  if (filters.validation_status) { where.push(`validation_status = $${i++}`); params.push(filters.validation_status); }
  if (filters.impact_type) { where.push(`impact_type = $${i++}`); params.push(filters.impact_type); }
  if (filters.seller_after) { where.push(`seller_responsible_after = $${i++}`); params.push(filters.seller_after); }
  if (filters.actor_name) { where.push(`actor_name = $${i++}`); params.push(filters.actor_name); }
  if (filters.related_channel) { where.push(`related_channel = $${i++}`); params.push(filters.related_channel); }
  if (filters.crm_record_id) { where.push(`crm_record_id = $${i++}`); params.push(filters.crm_record_id); }
  if (filters.rule_triggered) { where.push(`rule_triggered = $${i++}`); params.push(filters.rule_triggered); }
  if (filters.q) {
    where.push(`(
      crm_record_name ILIKE $${i} OR
      reason ILIKE $${i} OR
      actor_name ILIKE $${i} OR
      seller_responsible_after ILIKE $${i}
    )`);
    params.push(`%${filters.q}%`);
    i++;
  }
  return { whereSQL: where.length ? 'WHERE ' + where.join(' AND ') : '', params };
}

async function listLogs(pool, filters = {}, { limit = 100, offset = 0, order = 'occurred_at DESC' } = {}) {
  const { whereSQL, params } = buildLogsWhere(filters);
  const sql = `SELECT * FROM crm_audit_logs ${whereSQL} ORDER BY ${order} LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
  const r = await pool.query(sql, params);
  return r.rows;
}

async function countLogs(pool, filters = {}) {
  const { whereSQL, params } = buildLogsWhere(filters);
  const r = await pool.query(`SELECT COUNT(*)::int AS total FROM crm_audit_logs ${whereSQL}`, params);
  return r.rows[0].total;
}

async function getLogById(pool, id) {
  const r = await pool.query('SELECT * FROM crm_audit_logs WHERE id = $1', [id]);
  return r.rows[0] || null;
}

async function timelineForRecord(pool, crm_module, crm_record_id) {
  const r = await pool.query(
    `SELECT * FROM crm_audit_logs WHERE crm_module=$1 AND crm_record_id=$2 ORDER BY occurred_at ASC`,
    [crm_module, crm_record_id]
  );
  return r.rows;
}

async function listAlerts(pool, filters = {}, { limit = 200, offset = 0 } = {}) {
  const where = [];
  const params = [];
  let i = 1;
  if (filters.status) { where.push(`status = $${i++}`); params.push(filters.status); }
  if (filters.severity) { where.push(`severity = $${i++}`); params.push(filters.severity); }
  if (filters.seller_name) { where.push(`seller_name = $${i++}`); params.push(filters.seller_name); }
  if (filters.alert_type) { where.push(`alert_type = $${i++}`); params.push(filters.alert_type); }
  if (filters.from) { where.push(`created_at >= $${i++}`); params.push(filters.from); }
  if (filters.to) { where.push(`created_at <= $${i++}`); params.push(filters.to); }
  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const r = await pool.query(
    `SELECT * FROM crm_audit_alerts ${whereSQL} ORDER BY
     CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
     created_at DESC
     LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    params
  );
  return r.rows;
}

async function updateAlert(pool, id, fields) {
  const allowed = ['status', 'resolved_by', 'resolved_at', 'notes'];
  const sets = [];
  const params = [];
  let i = 1;
  for (const k of allowed) {
    if (fields[k] !== undefined) { sets.push(`${k} = $${i++}`); params.push(fields[k]); }
  }
  if (!sets.length) return null;
  params.push(id);
  const r = await pool.query(`UPDATE crm_audit_alerts SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`, params);
  return r.rows[0];
}

/* ----------------- AGGREGATIONS ----------------- */

async function overviewMetrics(pool, from, to) {
  const sql = `
    WITH base AS (
      SELECT * FROM crm_audit_logs WHERE occurred_at BETWEEN $1 AND $2
    )
    SELECT
      (SELECT COUNT(*)::int FROM base) AS total,
      (SELECT COUNT(*)::int FROM base WHERE action_origin='claude_director_ia') AS claude,
      (SELECT COUNT(*)::int FROM base WHERE action_origin='nubia_sdr_ia') AS nubia,
      (SELECT COUNT(*)::int FROM base WHERE action_origin IN ('n8n_automation','zoho_flow','system')) AS automacoes,
      (SELECT COUNT(*)::int FROM base WHERE action_origin IN ('seller_manual','manager_manual')) AS manuais,
      (SELECT COUNT(*)::int FROM base WHERE action_type='lead_assigned' AND action_origin IN ('claude_director_ia','nubia_sdr_ia','n8n_automation')) AS leads_distribuidos_ia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='owner_changed') AS leads_redistribuidos,
      (SELECT COUNT(*)::int FROM base WHERE action_type='task_created' AND action_origin IN ('claude_director_ia','nubia_sdr_ia')) AS tasks_ia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='task_completed' AND validation_status='suspicious') AS tasks_suspeitas,
      (SELECT COUNT(*)::int FROM base WHERE action_type='stage_changed' AND action_origin IN ('seller_manual','manager_manual')) AS stage_manual,
      (SELECT COUNT(*)::int FROM base WHERE action_type='proposal_created') AS propostas,
      (SELECT COUNT(*)::int FROM base WHERE action_type='proposal_created' AND validation_status='suspicious') AS propostas_paradas,
      (SELECT COUNT(*)::int FROM base WHERE action_type='deal_won' AND impact_type='positive' AND action_origin IN ('claude_director_ia','nubia_sdr_ia')) AS won_ia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='deal_lost' AND validation_status='suspicious') AS lost_falha,
      (SELECT COUNT(*)::int FROM crm_audit_alerts WHERE status='open' AND severity IN ('high','critical')) AS alertas_criticos,
      (SELECT
        ROUND(100.0 * COUNT(*) FILTER (WHERE validation_status='valid') / NULLIF(COUNT(*), 0), 1)
        FROM base WHERE action_origin IN ('seller_manual','manager_manual')
      ) AS taxa_cumprimento
  `;
  const r = await pool.query(sql, [from, to]);
  return r.rows[0];
}

async function influenciaIaMetrics(pool, from, to) {
  const r = await pool.query(`
    WITH base AS (SELECT * FROM crm_audit_logs WHERE occurred_at BETWEEN $1 AND $2),
    leads_ia AS (
      SELECT DISTINCT crm_record_id FROM base
      WHERE action_origin IN ('claude_director_ia','nubia_sdr_ia') AND crm_record_id IS NOT NULL
    ),
    leads_total AS (
      SELECT DISTINCT crm_record_id FROM base WHERE crm_record_id IS NOT NULL
    )
    SELECT
      (SELECT COUNT(*)::int FROM leads_ia) AS leads_ia,
      (SELECT COUNT(*)::int FROM leads_total) AS leads_total,
      (SELECT COUNT(*)::int FROM base WHERE action_type='lead_qualified' AND action_origin='nubia_sdr_ia') AS qualificados_ia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='lead_assigned' AND action_origin IN ('claude_director_ia','n8n_automation')) AS distribuidos_ia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='whatsapp_message_sent' AND action_origin='nubia_sdr_ia') AS followups_nubia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='ia_recommendation_created') AS recomendacoes,
      (SELECT COUNT(*)::int FROM base WHERE action_type='ia_action_executed') AS acoes_ia_executadas,
      (SELECT COUNT(*)::int FROM base WHERE action_type='deal_won' AND
        crm_record_id IN (SELECT crm_record_id FROM leads_ia)) AS won_com_ia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='deal_lost' AND
        crm_record_id IN (SELECT crm_record_id FROM leads_ia)) AS lost_com_ia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='deal_won' AND
        crm_record_id NOT IN (SELECT crm_record_id FROM leads_ia)) AS won_sem_ia,
      (SELECT COUNT(*)::int FROM base WHERE action_type='deal_lost' AND
        crm_record_id NOT IN (SELECT crm_record_id FROM leads_ia)) AS lost_sem_ia,
      (SELECT COALESCE(SUM((metadata_json->>'amount')::numeric), 0) FROM base
        WHERE action_type='deal_won' AND crm_record_id IN (SELECT crm_record_id FROM leads_ia)) AS receita_ia,
      (SELECT COALESCE(SUM((metadata_json->>'amount')::numeric), 0) FROM base
        WHERE action_type='deal_won' AND crm_record_id NOT IN (SELECT crm_record_id FROM leads_ia)) AS receita_sem_ia
  `, [from, to]);
  return r.rows[0];
}

async function distribuicaoMetrics(pool, from, to) {
  const r = await pool.query(`
    SELECT
      seller_responsible_after AS vendedor,
      COUNT(*)::int AS recebidos,
      COUNT(*) FILTER (WHERE rule_triggered IS NOT NULL)::int AS por_regra,
      COUNT(DISTINCT crm_record_id)::int AS leads_unicos,
      COUNT(*) FILTER (WHERE action_origin='claude_director_ia')::int AS por_claude,
      COUNT(*) FILTER (WHERE action_origin='nubia_sdr_ia')::int AS por_nubia,
      COUNT(*) FILTER (WHERE action_origin='n8n_automation')::int AS por_n8n,
      COUNT(*) FILTER (WHERE action_origin IN ('seller_manual','manager_manual'))::int AS por_manual,
      COALESCE(SUM((metadata_json->>'amount')::numeric), 0) AS valor_total
    FROM crm_audit_logs
    WHERE action_type='lead_assigned'
      AND occurred_at BETWEEN $1 AND $2
      AND seller_responsible_after IS NOT NULL
    GROUP BY seller_responsible_after
    ORDER BY recebidos DESC
  `, [from, to]);
  return r.rows;
}

/**
 * Matriz vendedor × tier de TODAS as negociações que entraram no período.
 *
 * Anchor: cada `lead_created` = 1 negociação. Owner é o mais recente entre
 * lead_assigned/owner_changed (pode ser NULL = "(sem owner)"). Tier vem
 * do metadata, ou "Tier indisponível" se ausente.
 */
async function negotiationsByTier(pool, from, to) {
  const r = await pool.query(`
    WITH negotiations AS (
      SELECT
        crm_record_id,
        crm_record_name,
        occurred_at AS criado_em,
        COALESCE(NULLIF(metadata_json->>'tier',''), 'Tier indisponível') AS tier,
        COALESCE((metadata_json->>'amount')::numeric, 0) AS amount,
        COALESCE(NULLIF(related_channel,''), 'Sem canal') AS canal
      FROM crm_audit_logs
      WHERE action_type='lead_created'
        AND crm_record_id IS NOT NULL
        AND occurred_at BETWEEN $1 AND $2
    ),
    current_owner AS (
      SELECT DISTINCT ON (crm_record_id)
        crm_record_id, seller_responsible_after AS vendedor
      FROM crm_audit_logs
      WHERE action_type IN ('lead_assigned','owner_changed')
        AND seller_responsible_after IS NOT NULL
        AND crm_record_id IS NOT NULL
      ORDER BY crm_record_id, occurred_at DESC
    )
    SELECT
      COALESCE(o.vendedor, '(sem owner)') AS vendedor,
      n.tier AS tier,
      COUNT(*)::int AS n,
      COALESCE(SUM(n.amount), 0) AS valor
    FROM negotiations n
    LEFT JOIN current_owner o USING(crm_record_id)
    GROUP BY COALESCE(o.vendedor, '(sem owner)'), n.tier
    ORDER BY 1, 3 DESC
  `, [from, to]);
  return r.rows;
}

/**
 * Resumo agregado das negociações no período (cada lead_created = 1).
 */
async function negotiationsSummary(pool, from, to) {
  const r = await pool.query(`
    WITH negotiations AS (
      SELECT crm_record_id,
             COALESCE(NULLIF(metadata_json->>'tier',''), 'Tier indisponível') AS tier,
             COALESCE((metadata_json->>'amount')::numeric, 0) AS amount,
             related_channel
      FROM crm_audit_logs
      WHERE action_type='lead_created'
        AND occurred_at BETWEEN $1 AND $2
    ),
    current_owner AS (
      SELECT DISTINCT ON (crm_record_id) crm_record_id, seller_responsible_after AS v
      FROM crm_audit_logs
      WHERE action_type IN ('lead_assigned','owner_changed') AND seller_responsible_after IS NOT NULL
      ORDER BY crm_record_id, occurred_at DESC
    )
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE o.v IS NOT NULL)::int AS com_owner,
      COUNT(*) FILTER (WHERE o.v IS NULL)::int AS sem_owner,
      COUNT(*) FILTER (WHERE n.tier='Tier indisponível')::int AS sem_tier,
      COUNT(DISTINCT o.v)::int AS vendedores_unicos,
      COALESCE(SUM(n.amount), 0) AS valor_total
    FROM negotiations n
    LEFT JOIN current_owner o USING(crm_record_id)
  `, [from, to]);
  return r.rows[0];
}

/**
 * Matriz vendedor × tier — conta TODAS as atribuições (qualquer origem)
 * dentro do período. Tier é lido de metadata_json->>'tier'.
 */
async function distribuicaoByTier(pool, from, to) {
  const r = await pool.query(`
    SELECT
      seller_responsible_after AS vendedor,
      COALESCE(NULLIF(metadata_json->>'tier', ''), 'Sem tier') AS tier,
      COUNT(*)::int AS n,
      COALESCE(SUM((metadata_json->>'amount')::numeric), 0) AS valor
    FROM crm_audit_logs
    WHERE action_type='lead_assigned'
      AND occurred_at BETWEEN $1 AND $2
      AND seller_responsible_after IS NOT NULL
    GROUP BY seller_responsible_after, COALESCE(NULLIF(metadata_json->>'tier', ''), 'Sem tier')
    ORDER BY seller_responsible_after, n DESC
  `, [from, to]);
  return r.rows;
}

async function vendedorMetrics(pool, from, to) {
  const r = await pool.query(`
    WITH per_seller AS (
      SELECT
        seller_responsible_after AS vendedor,
        COUNT(*) FILTER (WHERE action_type='lead_assigned')::int AS recebidos,
        COUNT(*) FILTER (WHERE action_type IN ('whatsapp_message_sent','call_logged'))::int AS contatos,
        COUNT(*) FILTER (WHERE action_type='task_created')::int AS tasks_criadas,
        COUNT(*) FILTER (WHERE action_type='task_completed')::int AS tasks_concluidas,
        COUNT(*) FILTER (WHERE action_type='task_completed' AND validation_status='suspicious')::int AS tasks_sem_log,
        COUNT(*) FILTER (WHERE action_type='stage_changed' AND action_origin IN ('seller_manual','manager_manual'))::int AS stage_manual,
        COUNT(*) FILTER (WHERE action_type='deal_lost' AND validation_status='suspicious')::int AS perdas_suspeitas,
        COUNT(*) FILTER (WHERE action_type='proposal_created')::int AS propostas,
        COUNT(*) FILTER (WHERE action_type='deal_won')::int AS won
      FROM crm_audit_logs
      WHERE occurred_at BETWEEN $1 AND $2
        AND seller_responsible_after IS NOT NULL
      GROUP BY seller_responsible_after
    )
    SELECT *,
      GREATEST(0, LEAST(100,
        20  -- baseline
        + CASE WHEN recebidos>0 THEN ROUND(15.0 * contatos / NULLIF(recebidos,0)) ELSE 0 END
        + CASE WHEN tasks_criadas>0 THEN ROUND(15.0 * (tasks_concluidas - tasks_sem_log) / NULLIF(tasks_criadas,0)) ELSE 0 END
        + CASE WHEN propostas>0 THEN 15 ELSE 0 END
        + CASE WHEN won>0 THEN 15 ELSE 0 END
        - tasks_sem_log * 5
        - perdas_suspeitas * 8
        - stage_manual * 2
      ))::int AS process_compliance_score
    FROM per_seller
    ORDER BY process_compliance_score DESC
  `, [from, to]);
  return r.rows;
}

async function alertsCount(pool, status = 'open') {
  const r = await pool.query(
    `SELECT severity, COUNT(*)::int AS n FROM crm_audit_alerts WHERE status=$1 GROUP BY severity`,
    [status]
  );
  const out = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
  for (const row of r.rows) { out[row.severity] = row.n; out.total += row.n; }
  return out;
}

async function isEmpty(pool) {
  const r = await pool.query('SELECT 1 FROM crm_audit_logs LIMIT 1');
  return r.rowCount === 0;
}

module.exports = {
  ensureSchema,
  insertLog,
  insertAlert,
  listLogs,
  countLogs,
  getLogById,
  timelineForRecord,
  listAlerts,
  updateAlert,
  overviewMetrics,
  influenciaIaMetrics,
  distribuicaoMetrics,
  distribuicaoByTier,
  negotiationsByTier,
  negotiationsSummary,
  vendedorMetrics,
  alertsCount,
  isEmpty,
  VALID_ORIGINS,
  VALID_STATUSES,
  VALID_IMPACT
};
