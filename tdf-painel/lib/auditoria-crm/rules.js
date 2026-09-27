/**
 * Auditoria CRM — Engine de regras suspeitas
 *
 * Cada regra recebe (pool, contexto) e:
 *   1. lê logs recentes
 *   2. detecta padrões suspeitos
 *   3. retorna lista de alertas a inserir
 *
 * Idempotência: cada regra usa um (alert_type, crm_record_id, source_log_id)
 * único. Antes de inserir, checa se já existe alerta aberto pra mesma chave.
 */

const SLA_PRIMEIRO_CONTATO_MIN = 30;     // lead pago
const SLA_PROPOSTA_HORAS = 24;
const SLA_LEAD_QUENTE_MIN = 60;
const TASKS_RAJADA_MIN = 5;              // 5+ tasks em <10min
const TASKS_RAJADA_JANELA_SEC = 600;
const PERDA_RAJADA_DIA = 5;              // 5+ perdas no mesmo dia

async function alertExists(pool, { alert_type, crm_record_id, source_log_id }) {
  const r = await pool.query(
    `SELECT 1 FROM crm_audit_alerts
     WHERE alert_type=$1 AND status='open'
       AND (
         (crm_record_id IS NOT NULL AND crm_record_id=$2)
         OR (source_log_id IS NOT NULL AND source_log_id=$3)
       )
     LIMIT 1`,
    [alert_type, crm_record_id || null, source_log_id || null]
  );
  return r.rowCount > 0;
}

async function emit(pool, alerts) {
  let n = 0;
  for (const a of alerts) {
    if (await alertExists(pool, a)) continue;
    await pool.query(
      `INSERT INTO crm_audit_alerts (
        alert_type, severity, crm_module, crm_record_id, crm_record_name,
        seller_id, seller_name, description, detected_rule, recommended_action,
        status, source_log_id, metadata_json
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'open',$11,$12)`,
      [
        a.alert_type, a.severity || 'medium', a.crm_module || null,
        a.crm_record_id || null, a.crm_record_name || null,
        a.seller_id || null, a.seller_name || null,
        a.description, a.detected_rule, a.recommended_action || null,
        a.source_log_id || null, JSON.stringify(a.metadata_json || {})
      ]
    );
    n++;
  }
  return n;
}

/* ------------------------------------------------------------ */
/* Regra 1: Tarefa concluída sem ligação/mensagem em ±30min     */
/* ------------------------------------------------------------ */
async function ruleTaskCompletedWithoutContact(pool) {
  const r = await pool.query(`
    SELECT t.id AS source_log_id, t.crm_module, t.crm_record_id, t.crm_record_name,
           t.seller_responsible_after AS seller_name, t.occurred_at
    FROM crm_audit_logs t
    WHERE t.action_type='task_completed'
      AND t.occurred_at >= NOW() - INTERVAL '7 days'
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id = t.crm_record_id
          AND c.action_type IN ('call_logged','whatsapp_message_sent')
          AND c.occurred_at BETWEEN t.occurred_at - INTERVAL '30 minutes'
                              AND t.occurred_at + INTERVAL '30 minutes'
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'task_no_contact',
    severity: 'high',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Tarefa concluída por ${row.seller_name || 'vendedor'} sem ligação no GoTo nem mensagem WATI/Z-API próximas.`,
    detected_rule: 'task_completed_without_contact',
    recommended_action: 'Auditar com vendedor e exigir prova de contato (gravação/print).',
    source_log_id: row.source_log_id,
    metadata_json: { ocorreu_em: row.occurred_at }
  }));
}

/* ------------------------------------------------------------ */
/* Regra 2: Lead movido pra "sem interesse" muito rápido (<10min) */
/* ------------------------------------------------------------ */
async function ruleQuickLoss(pool) {
  const r = await pool.query(`
    SELECT lost.id AS source_log_id, lost.crm_module, lost.crm_record_id, lost.crm_record_name,
           lost.seller_responsible_after AS seller_name, lost.occurred_at,
           EXTRACT(EPOCH FROM (lost.occurred_at - assigned.occurred_at))/60 AS minutos
    FROM crm_audit_logs lost
    JOIN crm_audit_logs assigned
      ON assigned.crm_record_id = lost.crm_record_id
     AND assigned.action_type='lead_assigned'
     AND assigned.occurred_at < lost.occurred_at
    WHERE lost.action_type IN ('deal_lost','stage_changed')
      AND (lost.new_value ILIKE '%sem interesse%' OR lost.action_type='deal_lost')
      AND lost.occurred_at >= NOW() - INTERVAL '7 days'
      AND lost.occurred_at - assigned.occurred_at < INTERVAL '10 minutes'
  `);
  return r.rows.map(row => ({
    alert_type: 'quick_loss',
    severity: 'high',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Lead descartado em ${Math.round(row.minutos)} min após distribuição. Sem cadência mínima.`,
    detected_rule: 'lead_lost_too_fast',
    recommended_action: 'Reabrir lead, ouvir gravação se houver, exigir SPIN antes de descartar.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 3: Lead quente >X minutos sem contato                  */
/* ------------------------------------------------------------ */
async function ruleHotLeadNoContact(pool) {
  const r = await pool.query(`
    SELECT a.id AS source_log_id, a.crm_module, a.crm_record_id, a.crm_record_name,
           a.seller_responsible_after AS seller_name, a.occurred_at
    FROM crm_audit_logs a
    WHERE a.action_type='lead_assigned'
      AND a.occurred_at >= NOW() - INTERVAL '24 hours'
      AND a.occurred_at <= NOW() - INTERVAL '${SLA_LEAD_QUENTE_MIN} minutes'
      AND COALESCE((a.metadata_json->>'tier')::text, '') IN ('Diamante','Ouro','quente','quente_mqs')
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id = a.crm_record_id
          AND c.action_type IN ('call_logged','whatsapp_message_sent')
          AND c.occurred_at > a.occurred_at
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'hot_lead_no_contact',
    severity: 'critical',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Lead quente (Diamante/Ouro) sem contato há mais de ${SLA_LEAD_QUENTE_MIN} min com ${row.seller_name}.`,
    detected_rule: 'hot_lead_idle',
    recommended_action: 'Notificar closer agora ou redistribuir.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 4: Proposta sem follow-up por X horas                  */
/* ------------------------------------------------------------ */
async function ruleProposalIdle(pool) {
  const r = await pool.query(`
    SELECT p.id AS source_log_id, p.crm_module, p.crm_record_id, p.crm_record_name,
           p.seller_responsible_after AS seller_name, p.occurred_at
    FROM crm_audit_logs p
    WHERE p.action_type='proposal_created'
      AND p.occurred_at >= NOW() - INTERVAL '14 days'
      AND p.occurred_at <= NOW() - INTERVAL '${SLA_PROPOSTA_HORAS} hours'
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id = p.crm_record_id
          AND c.action_type IN ('call_logged','whatsapp_message_sent','proposal_sent','task_created')
          AND c.occurred_at > p.occurred_at
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'proposal_idle',
    severity: 'high',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Proposta criada há mais de ${SLA_PROPOSTA_HORAS}h sem follow-up nem envio.`,
    detected_rule: 'proposal_no_followup',
    recommended_action: 'Forçar tarefa de follow-up + cobrança no GoTo + WATI.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 5: Mudança de etapa sem nota explicativa               */
/* ------------------------------------------------------------ */
async function ruleStageChangeNoNote(pool) {
  const r = await pool.query(`
    SELECT s.id AS source_log_id, s.crm_module, s.crm_record_id, s.crm_record_name,
           s.seller_responsible_after AS seller_name, s.occurred_at,
           s.old_value, s.new_value
    FROM crm_audit_logs s
    WHERE s.action_type='stage_changed'
      AND s.action_origin IN ('seller_manual','manager_manual')
      AND s.occurred_at >= NOW() - INTERVAL '7 days'
      AND COALESCE(NULLIF(TRIM(s.reason), ''), '') = ''
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs n
        WHERE n.crm_record_id = s.crm_record_id
          AND n.action_type='note_created'
          AND n.occurred_at BETWEEN s.occurred_at - INTERVAL '15 minutes'
                              AND s.occurred_at + INTERVAL '15 minutes'
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'stage_change_no_note',
    severity: 'medium',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Etapa movida de "${row.old_value || '?'}" → "${row.new_value || '?'}" sem nota explicativa.`,
    detected_rule: 'stage_change_without_note',
    recommended_action: 'Pedir justificativa pro vendedor; possível burla de cadência.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 6: Perda sem motivo válido                             */
/* ------------------------------------------------------------ */
async function ruleLossWithoutReason(pool) {
  const r = await pool.query(`
    SELECT l.id AS source_log_id, l.crm_module, l.crm_record_id, l.crm_record_name,
           l.seller_responsible_after AS seller_name
    FROM crm_audit_logs l
    WHERE l.action_type='deal_lost'
      AND l.occurred_at >= NOW() - INTERVAL '7 days'
      AND (
        COALESCE(NULLIF(TRIM(l.reason), ''), '') = ''
        OR LENGTH(TRIM(l.reason)) < 12
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'loss_no_reason',
    severity: 'high',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Perda registrada sem motivo válido. Vendedor: ${row.seller_name || '—'}.`,
    detected_rule: 'loss_missing_reason',
    recommended_action: 'Reabrir deal, exigir motivo do CRM (não-vazio, >12 chars).',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 7: Lead redistribuído várias vezes                     */
/* ------------------------------------------------------------ */
async function ruleLeadReassignedTooMany(pool) {
  const r = await pool.query(`
    SELECT crm_record_id, crm_record_name, MAX(crm_module) AS crm_module,
           COUNT(*)::int AS reassigns,
           MAX(id) AS source_log_id,
           MAX(seller_responsible_after) AS seller_name
    FROM crm_audit_logs
    WHERE action_type='owner_changed'
      AND occurred_at >= NOW() - INTERVAL '14 days'
      AND crm_record_id IS NOT NULL
    GROUP BY crm_record_id, crm_record_name
    HAVING COUNT(*) >= 3
  `);
  return r.rows.map(row => ({
    alert_type: 'lead_reassigned_too_many',
    severity: 'medium',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Lead foi redistribuído ${row.reassigns}× em 14 dias.`,
    detected_rule: 'lead_too_many_reassigns',
    recommended_action: 'Investigar regra de distribuição e sobrecarga de vendedores.',
    source_log_id: row.source_log_id,
    metadata_json: { reassigns: row.reassigns }
  }));
}

/* ------------------------------------------------------------ */
/* Regra 8: Lead alto-ticket parado >48h                        */
/* ------------------------------------------------------------ */
async function ruleHighTicketIdle(pool) {
  const r = await pool.query(`
    SELECT a.id AS source_log_id, a.crm_module, a.crm_record_id, a.crm_record_name,
           a.seller_responsible_after AS seller_name,
           COALESCE((a.metadata_json->>'amount')::numeric,0) AS amount
    FROM crm_audit_logs a
    WHERE a.action_type='lead_assigned'
      AND a.occurred_at <= NOW() - INTERVAL '48 hours'
      AND COALESCE((a.metadata_json->>'amount')::numeric,0) >= 5000
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id = a.crm_record_id
          AND c.action_type IN ('call_logged','whatsapp_message_sent','proposal_created','stage_changed')
          AND c.occurred_at > a.occurred_at
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'high_ticket_idle',
    severity: 'critical',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Lead alto-ticket (R$${Number(row.amount).toLocaleString('pt-BR')}) parado >48h sem contato.`,
    detected_rule: 'high_value_lead_idle',
    recommended_action: 'Escalar pro gestor agora. Possível receita perdida.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 9: Recomendação Claude ignorada (>24h)                 */
/* ------------------------------------------------------------ */
async function ruleClaudeRecIgnored(pool) {
  const r = await pool.query(`
    SELECT rec.id AS source_log_id, rec.crm_module, rec.crm_record_id, rec.crm_record_name,
           rec.seller_responsible_after AS seller_name, rec.reason
    FROM crm_audit_logs rec
    WHERE rec.action_type='ia_recommendation_created'
      AND rec.action_origin='claude_director_ia'
      AND rec.occurred_at <= NOW() - INTERVAL '24 hours'
      AND rec.occurred_at >= NOW() - INTERVAL '14 days'
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs e
        WHERE e.crm_record_id = rec.crm_record_id
          AND e.action_type='ia_action_executed'
          AND e.occurred_at > rec.occurred_at
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'claude_recommendation_ignored',
    severity: 'medium',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Claude recomendou ação há >24h e ninguém executou. Recomendação: ${row.reason || '(ver log)'}.`,
    detected_rule: 'claude_rec_ignored',
    recommended_action: 'Cobrar execução do vendedor ou reatribuir.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 10: Núbia qualificou e closer não tocou                */
/* ------------------------------------------------------------ */
async function ruleNubiaQualifiedNoCloser(pool) {
  const r = await pool.query(`
    SELECT q.id AS source_log_id, q.crm_module, q.crm_record_id, q.crm_record_name,
           q.seller_responsible_after AS seller_name, q.occurred_at
    FROM crm_audit_logs q
    WHERE q.action_type='lead_qualified'
      AND q.action_origin='nubia_sdr_ia'
      AND q.occurred_at <= NOW() - INTERVAL '2 hours'
      AND q.occurred_at >= NOW() - INTERVAL '7 days'
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id = q.crm_record_id
          AND c.action_origin='seller_manual'
          AND c.action_type IN ('call_logged','whatsapp_message_sent','task_created','proposal_created')
          AND c.occurred_at > q.occurred_at
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'nubia_qualified_closer_silent',
    severity: 'high',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Núbia qualificou lead há +2h e closer (${row.seller_name || '?'}) não tocou.`,
    detected_rule: 'nubia_qualified_silent_closer',
    recommended_action: 'Notificar closer + gestor; lead quente esfriando.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 11: Vendedor concluiu rajada de tasks                  */
/* ------------------------------------------------------------ */
async function ruleTaskBurst(pool) {
  const r = await pool.query(`
    SELECT seller_responsible_after AS seller_name,
           COUNT(*)::int AS n,
           DATE_TRUNC('hour', occurred_at) AS hora,
           MIN(id) AS source_log_id
    FROM crm_audit_logs
    WHERE action_type='task_completed'
      AND occurred_at >= NOW() - INTERVAL '3 days'
      AND seller_responsible_after IS NOT NULL
    GROUP BY seller_responsible_after, DATE_TRUNC('hour', occurred_at)
    HAVING COUNT(*) >= ${TASKS_RAJADA_MIN}
  `);
  return r.rows.map(row => ({
    alert_type: 'task_burst',
    severity: 'medium',
    crm_module: 'Tasks',
    crm_record_id: null,
    crm_record_name: null,
    seller_name: row.seller_name,
    description: `${row.seller_name} concluiu ${row.n} tarefas em uma hora — possível "limpada" no CRM.`,
    detected_rule: 'task_completion_burst',
    recommended_action: 'Cruzar com GoTo/WATI; provável conclusão sem prova.',
    source_log_id: row.source_log_id,
    metadata_json: { hora: row.hora, n: row.n }
  }));
}

/* ------------------------------------------------------------ */
/* Regra 12: Várias perdas no mesmo dia                         */
/* ------------------------------------------------------------ */
async function ruleManyLossesSameDay(pool) {
  const r = await pool.query(`
    SELECT seller_responsible_after AS seller_name,
           DATE(occurred_at) AS dia,
           COUNT(*)::int AS n,
           MIN(id) AS source_log_id
    FROM crm_audit_logs
    WHERE action_type='deal_lost'
      AND occurred_at >= NOW() - INTERVAL '7 days'
      AND seller_responsible_after IS NOT NULL
    GROUP BY seller_responsible_after, DATE(occurred_at)
    HAVING COUNT(*) >= ${PERDA_RAJADA_DIA}
  `);
  return r.rows.map(row => ({
    alert_type: 'losses_burst_day',
    severity: 'high',
    crm_module: 'Deals',
    seller_name: row.seller_name,
    description: `${row.seller_name} marcou ${row.n} perdas em um único dia (${row.dia}).`,
    detected_rule: 'losses_same_day',
    recommended_action: 'Auditar amostragem dos motivos. Possível faxina pra zerar pipeline.',
    source_log_id: row.source_log_id,
    metadata_json: { dia: row.dia, n: row.n }
  }));
}

/* ------------------------------------------------------------ */
/* Regra 13: Lead pago sem contato dentro do SLA                */
/* ------------------------------------------------------------ */
async function rulePaidLeadSlaMissed(pool) {
  const r = await pool.query(`
    SELECT a.id AS source_log_id, a.crm_module, a.crm_record_id, a.crm_record_name,
           a.seller_responsible_after AS seller_name, a.related_channel
    FROM crm_audit_logs a
    WHERE a.action_type='lead_assigned'
      AND a.related_channel IN ('Meta Ads','Google Ads','Bing Ads','TikTok Ads','LinkedIn Ads')
      AND a.occurred_at <= NOW() - INTERVAL '${SLA_PRIMEIRO_CONTATO_MIN} minutes'
      AND a.occurred_at >= NOW() - INTERVAL '7 days'
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id = a.crm_record_id
          AND c.action_type IN ('call_logged','whatsapp_message_sent')
          AND c.occurred_at > a.occurred_at
      )
  `);
  return r.rows.map(row => ({
    alert_type: 'paid_lead_sla_missed',
    severity: 'critical',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Lead pago (${row.related_channel}) sem contato dentro do SLA de ${SLA_PRIMEIRO_CONTATO_MIN} min.`,
    detected_rule: 'paid_lead_first_contact_sla',
    recommended_action: 'Acionar Núbia ou redistribuir; cada minuto custa CAC.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 14: Lead atribuído que ninguém assumiu                 */
/* ------------------------------------------------------------ */
async function ruleAssignedNoOwnership(pool) {
  const r = await pool.query(`
    SELECT a.id AS source_log_id, a.crm_module, a.crm_record_id, a.crm_record_name,
           a.seller_responsible_after AS seller_name
    FROM crm_audit_logs a
    WHERE a.action_type='lead_assigned'
      AND a.occurred_at <= NOW() - INTERVAL '6 hours'
      AND a.occurred_at >= NOW() - INTERVAL '14 days'
      AND a.seller_responsible_after IS NULL
  `);
  return r.rows.map(row => ({
    alert_type: 'lead_no_owner',
    severity: 'high',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: null,
    description: `Lead distribuído mas sem owner atribuído (>6h).`,
    detected_rule: 'lead_assigned_no_owner',
    recommended_action: 'Forçar atribuição via round-robin ou alocar manualmente.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
/* Regra 15: Erro em automação                                  */
/* ------------------------------------------------------------ */
async function ruleAutomationError(pool) {
  const r = await pool.query(`
    SELECT id AS source_log_id, crm_module, crm_record_id, crm_record_name,
           actor_name AS seller_name, reason, action_origin
    FROM crm_audit_logs
    WHERE validation_status='error'
      AND action_origin IN ('n8n_automation','zoho_flow','wati','zapi','goto','salesiq','system')
      AND occurred_at >= NOW() - INTERVAL '24 hours'
  `);
  return r.rows.map(row => ({
    alert_type: 'automation_error',
    severity: 'high',
    crm_module: row.crm_module,
    crm_record_id: row.crm_record_id,
    crm_record_name: row.crm_record_name,
    seller_name: row.seller_name,
    description: `Automação ${row.action_origin} falhou: ${row.reason || 'sem detalhe'}.`,
    detected_rule: 'automation_failed',
    recommended_action: 'Olhar logs do workflow; pode estar quebrando há horas.',
    source_log_id: row.source_log_id
  }));
}

/* ------------------------------------------------------------ */
const ALL_RULES = [
  ruleTaskCompletedWithoutContact,
  ruleQuickLoss,
  ruleHotLeadNoContact,
  ruleProposalIdle,
  ruleStageChangeNoNote,
  ruleLossWithoutReason,
  ruleLeadReassignedTooMany,
  ruleHighTicketIdle,
  ruleClaudeRecIgnored,
  ruleNubiaQualifiedNoCloser,
  ruleTaskBurst,
  ruleManyLossesSameDay,
  rulePaidLeadSlaMissed,
  ruleAssignedNoOwnership,
  ruleAutomationError,
];

async function runAllRules(pool) {
  const summary = { rules_run: 0, alerts_emitted: 0, errors: [], by_rule: {} };
  for (const rule of ALL_RULES) {
    try {
      const alerts = await rule(pool);
      const n = await emit(pool, alerts);
      summary.rules_run++;
      summary.alerts_emitted += n;
      summary.by_rule[rule.name] = { found: alerts.length, emitted: n };
    } catch (e) {
      summary.errors.push({ rule: rule.name, error: e.message });
    }
  }
  return summary;
}

/* Marca logs como suspeitos onde regras se aplicarem (best-effort). */
async function tagSuspiciousLogs(pool) {
  // Tasks concluídas sem contato → suspicious
  await pool.query(`
    UPDATE crm_audit_logs t SET validation_status='suspicious'
    WHERE t.action_type='task_completed'
      AND t.validation_status='valid'
      AND t.occurred_at >= NOW() - INTERVAL '14 days'
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id=t.crm_record_id
          AND c.action_type IN ('call_logged','whatsapp_message_sent')
          AND c.occurred_at BETWEEN t.occurred_at - INTERVAL '30 minutes'
                              AND t.occurred_at + INTERVAL '30 minutes'
      )
  `);
  // Perda sem motivo → suspicious
  await pool.query(`
    UPDATE crm_audit_logs SET validation_status='suspicious'
    WHERE action_type='deal_lost' AND validation_status='valid'
      AND (COALESCE(NULLIF(TRIM(reason),''), '') = '' OR LENGTH(TRIM(reason)) < 12)
      AND occurred_at >= NOW() - INTERVAL '30 days'
  `);
  // Stage manual sem nota nem reason → suspicious
  await pool.query(`
    UPDATE crm_audit_logs SET validation_status='suspicious'
    WHERE action_type='stage_changed' AND validation_status='valid'
      AND action_origin IN ('seller_manual','manager_manual')
      AND COALESCE(NULLIF(TRIM(reason),''),'') = ''
      AND occurred_at >= NOW() - INTERVAL '14 days'
  `);
}

module.exports = {
  runAllRules,
  tagSuspiciousLogs,
  ALL_RULES,
  SLA_PRIMEIRO_CONTATO_MIN,
  SLA_PROPOSTA_HORAS,
  SLA_LEAD_QUENTE_MIN
};
