/**
 * Auditoria CRM — Raio-X sistêmico das IAs (Claude + Núbia)
 *
 * Expõe CRU o que cada agente faz: critérios, taxa de execução,
 * latência, hit rate, recomendações ignoradas, fraquezas detectadas.
 *
 * Filosofia: o painel tem que conseguir reprovar a IA. Se a IA está
 * mandando lead pra vendedor errado, esse arquivo precisa mostrar.
 */

const AGENTS = {
  claude: { origin: 'claude_director_ia', label: 'Claude (Diretor IA)' },
  nubia: { origin: 'nubia_sdr_ia', label: 'Núbia (SDR IA)' }
};

/* ----------------- Resumo por agente ----------------- */

async function agentSummary(pool, origin, from, to) {
  const r = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(DISTINCT crm_record_id)::int AS leads_unicos,
      ROUND(AVG(confidence_score)::numeric, 1) AS confianca_media,
      COUNT(*) FILTER (WHERE confidence_score >= 80)::int AS alta_confianca,
      COUNT(*) FILTER (WHERE confidence_score < 60 AND confidence_score IS NOT NULL)::int AS baixa_confianca,
      COUNT(*) FILTER (WHERE impact_type='positive')::int AS positivos,
      COUNT(*) FILTER (WHERE impact_type='negative')::int AS negativos,
      COUNT(*) FILTER (WHERE impact_type='neutral')::int AS neutros,
      COUNT(*) FILTER (WHERE validation_status='error')::int AS erros,
      COUNT(*) FILTER (WHERE validation_status='suspicious')::int AS suspeitos
    FROM crm_audit_logs
    WHERE action_origin=$1 AND occurred_at BETWEEN $2 AND $3
  `, [origin, from, to]);
  return r.rows[0];
}

/* ----------------- Breakdown por action_type ----------------- */

async function agentActionBreakdown(pool, origin, from, to) {
  const r = await pool.query(`
    SELECT
      action_type,
      COUNT(*)::int AS n,
      ROUND(AVG(confidence_score)::numeric, 1) AS confianca_avg,
      COUNT(DISTINCT crm_record_id)::int AS leads,
      COUNT(*) FILTER (WHERE impact_type='positive')::int AS pos,
      COUNT(*) FILTER (WHERE impact_type='negative')::int AS neg,
      array_agg(DISTINCT rule_triggered) FILTER (WHERE rule_triggered IS NOT NULL) AS regras
    FROM crm_audit_logs
    WHERE action_origin=$1 AND occurred_at BETWEEN $2 AND $3
    GROUP BY action_type
    ORDER BY n DESC
  `, [origin, from, to]);
  return r.rows;
}

/* ----------------- Regras disparadas (rule_triggered) ----------------- */

async function agentRulesBreakdown(pool, origin, from, to) {
  const r = await pool.query(`
    SELECT
      rule_triggered AS regra,
      COUNT(*)::int AS disparos,
      ROUND(AVG(confidence_score)::numeric, 1) AS confianca_avg,
      COUNT(DISTINCT crm_record_id)::int AS leads_afetados,
      COUNT(*) FILTER (WHERE impact_type='positive')::int AS positivos,
      COUNT(*) FILTER (WHERE impact_type='negative')::int AS negativos
    FROM crm_audit_logs
    WHERE action_origin=$1
      AND rule_triggered IS NOT NULL
      AND occurred_at BETWEEN $2 AND $3
    GROUP BY rule_triggered
    ORDER BY disparos DESC
  `, [origin, from, to]);
  return r.rows;
}

/* ----------------- Critérios de distribuição (Claude) ----------------- */

async function distributionCriteria(pool, from, to) {
  // Para cada lead_assigned por Claude/n8n, mostra o critério usado e o resultado
  const r = await pool.query(`
    WITH dists AS (
      SELECT
        a.id,
        a.occurred_at,
        a.crm_record_id,
        a.crm_record_name,
        a.seller_responsible_after AS vendedor,
        a.action_origin,
        a.rule_triggered AS regra,
        a.reason,
        a.confidence_score,
        a.related_channel AS canal,
        COALESCE(a.metadata_json->>'tier', '') AS tier,
        COALESCE((a.metadata_json->>'amount')::numeric, 0) AS amount,
        COALESCE(a.metadata_json->>'cidade', '') AS cidade,
        COALESCE(a.metadata_json->>'product', '') AS produto
      FROM crm_audit_logs a
      WHERE a.action_type='lead_assigned'
        AND a.action_origin IN ('claude_director_ia','n8n_automation','manager_manual')
        AND a.occurred_at BETWEEN $1 AND $2
    ),
    follow AS (
      SELECT
        d.id,
        EXTRACT(EPOCH FROM (
          (SELECT MIN(occurred_at) FROM crm_audit_logs c
           WHERE c.crm_record_id=d.crm_record_id
             AND c.action_type IN ('whatsapp_message_sent','call_logged')
             AND c.action_origin='seller_manual'
             AND c.occurred_at > d.occurred_at)
          - d.occurred_at)) / 60.0 AS min_ate_contato,
        EXISTS(
          SELECT 1 FROM crm_audit_logs w
          WHERE w.crm_record_id=d.crm_record_id
            AND w.action_type='deal_won'
            AND w.occurred_at > d.occurred_at
        ) AS virou_venda,
        EXISTS(
          SELECT 1 FROM crm_audit_logs l
          WHERE l.crm_record_id=d.crm_record_id
            AND l.action_type='deal_lost'
            AND l.occurred_at > d.occurred_at
        ) AS perdeu
      FROM dists d
    )
    SELECT d.*, f.min_ate_contato, f.virou_venda, f.perdeu,
      CASE
        WHEN f.min_ate_contato IS NULL THEN 'sem_contato'
        WHEN f.virou_venda THEN 'venda'
        WHEN f.perdeu THEN 'perda'
        ELSE 'em_andamento'
      END AS desfecho
    FROM dists d
    LEFT JOIN follow f USING(id)
    ORDER BY d.occurred_at DESC
  `, [from, to]);
  return r.rows;
}

/* Agregação dos critérios por dimensão (regra, vendedor, tier) */
async function distributionByDimension(pool, from, to) {
  const r = await pool.query(`
    WITH dists AS (
      SELECT
        a.crm_record_id,
        a.occurred_at,
        a.seller_responsible_after AS vendedor,
        a.rule_triggered AS regra,
        COALESCE(a.metadata_json->>'tier','sem_tier') AS tier,
        COALESCE((a.metadata_json->>'amount')::numeric,0) AS amount,
        EXISTS(SELECT 1 FROM crm_audit_logs c
               WHERE c.crm_record_id=a.crm_record_id AND c.action_type IN ('whatsapp_message_sent','call_logged')
                 AND c.action_origin='seller_manual' AND c.occurred_at > a.occurred_at) AS contato,
        EXISTS(SELECT 1 FROM crm_audit_logs w
               WHERE w.crm_record_id=a.crm_record_id AND w.action_type='deal_won'
                 AND w.occurred_at > a.occurred_at) AS venda
      FROM crm_audit_logs a
      WHERE a.action_type='lead_assigned'
        AND a.action_origin IN ('claude_director_ia','n8n_automation','manager_manual')
        AND a.occurred_at BETWEEN $1 AND $2
    )
    SELECT
      'regra' AS dimensao, COALESCE(regra,'(sem regra)') AS valor,
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE contato)::int AS contatados,
      COUNT(*) FILTER (WHERE venda)::int AS vendas,
      ROUND(100.0 * COUNT(*) FILTER (WHERE contato)::numeric / NULLIF(COUNT(*),0), 1) AS pct_contato,
      ROUND(100.0 * COUNT(*) FILTER (WHERE venda)::numeric / NULLIF(COUNT(*),0), 1) AS pct_venda
    FROM dists GROUP BY regra
    UNION ALL
    SELECT 'tier' AS dimensao, tier, COUNT(*)::int,
      COUNT(*) FILTER (WHERE contato)::int,
      COUNT(*) FILTER (WHERE venda)::int,
      ROUND(100.0 * COUNT(*) FILTER (WHERE contato)::numeric / NULLIF(COUNT(*),0), 1),
      ROUND(100.0 * COUNT(*) FILTER (WHERE venda)::numeric / NULLIF(COUNT(*),0), 1)
    FROM dists GROUP BY tier
    UNION ALL
    SELECT 'vendedor' AS dimensao, COALESCE(vendedor,'(sem owner)'),
      COUNT(*)::int,
      COUNT(*) FILTER (WHERE contato)::int,
      COUNT(*) FILTER (WHERE venda)::int,
      ROUND(100.0 * COUNT(*) FILTER (WHERE contato)::numeric / NULLIF(COUNT(*),0), 1),
      ROUND(100.0 * COUNT(*) FILTER (WHERE venda)::numeric / NULLIF(COUNT(*),0), 1)
    FROM dists GROUP BY vendedor
    ORDER BY dimensao, total DESC
  `, [from, to]);
  return r.rows;
}

/* ----------------- Critérios de qualificação (Núbia) ----------------- */

async function qualificationCriteria(pool, from, to) {
  const r = await pool.query(`
    WITH q AS (
      SELECT
        a.id,
        a.occurred_at,
        a.crm_record_id,
        a.crm_record_name,
        a.reason,
        a.confidence_score,
        COALESCE(a.metadata_json->'sintomas', '[]'::jsonb) AS sintomas,
        COALESCE(a.metadata_json->>'decisor','?') AS decisor,
        COALESCE(a.metadata_json->>'timing','?') AS timing
      FROM crm_audit_logs a
      WHERE a.action_type='lead_qualified'
        AND a.action_origin='nubia_sdr_ia'
        AND a.occurred_at BETWEEN $1 AND $2
    )
    SELECT q.*,
      EXISTS(SELECT 1 FROM crm_audit_logs c
             WHERE c.crm_record_id=q.crm_record_id
               AND c.action_origin='seller_manual'
               AND c.action_type IN ('whatsapp_message_sent','call_logged','task_created','proposal_created')
               AND c.occurred_at > q.occurred_at) AS closer_atuou,
      EXISTS(SELECT 1 FROM crm_audit_logs w
             WHERE w.crm_record_id=q.crm_record_id AND w.action_type='deal_won'
               AND w.occurred_at > q.occurred_at) AS virou_venda
    FROM q
    ORDER BY q.occurred_at DESC
  `, [from, to]);
  return r.rows;
}

/* ----------------- Auditoria de recomendações Claude ----------------- */

async function recommendationsAudit(pool, from, to) {
  const r = await pool.query(`
    WITH recs AS (
      SELECT
        a.id, a.occurred_at, a.crm_record_id, a.crm_record_name,
        a.reason, a.rule_triggered, a.confidence_score,
        a.seller_responsible_after AS vendedor
      FROM crm_audit_logs a
      WHERE a.action_type='ia_recommendation_created'
        AND a.action_origin='claude_director_ia'
        AND a.occurred_at BETWEEN $1 AND $2
    )
    SELECT r.*,
      EXISTS(SELECT 1 FROM crm_audit_logs e
             WHERE e.crm_record_id=r.crm_record_id
               AND e.action_type='ia_action_executed'
               AND e.occurred_at > r.occurred_at) AS executada,
      (SELECT EXTRACT(EPOCH FROM (MIN(e.occurred_at) - r.occurred_at))/3600.0
       FROM crm_audit_logs e
       WHERE e.crm_record_id=r.crm_record_id
         AND e.action_type='ia_action_executed'
         AND e.occurred_at > r.occurred_at) AS horas_ate_execucao,
      EXISTS(SELECT 1 FROM crm_audit_logs w
             WHERE w.crm_record_id=r.crm_record_id AND w.action_type='deal_won'
               AND w.occurred_at > r.occurred_at) AS virou_venda
    FROM recs r
    ORDER BY r.occurred_at DESC
  `, [from, to]);
  return r.rows;
}

/* ----------------- Latência média ----------------- */

async function ageLatency(pool, from, to) {
  // Tempo entre lead_created e primeira ação Núbia (response time)
  const nubia = await pool.query(`
    SELECT ROUND(AVG(EXTRACT(EPOCH FROM (n.occurred_at - c.occurred_at))/60.0)::numeric, 1) AS min_avg,
           PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (n.occurred_at - c.occurred_at))/60.0) AS min_p50,
           PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (n.occurred_at - c.occurred_at))/60.0) AS min_p90,
           COUNT(*)::int AS n
    FROM crm_audit_logs c
    JOIN LATERAL (
      SELECT MIN(occurred_at) AS occurred_at FROM crm_audit_logs
      WHERE crm_record_id=c.crm_record_id
        AND action_origin='nubia_sdr_ia'
        AND action_type='whatsapp_message_sent'
        AND occurred_at > c.occurred_at
    ) n ON n.occurred_at IS NOT NULL
    WHERE c.action_type='lead_created'
      AND c.occurred_at BETWEEN $1 AND $2
  `, [from, to]);

  // Tempo entre lead_assigned por Claude e primeira ação do vendedor
  const claude = await pool.query(`
    SELECT ROUND(AVG(EXTRACT(EPOCH FROM (s.occurred_at - a.occurred_at))/60.0)::numeric, 1) AS min_avg,
           PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (s.occurred_at - a.occurred_at))/60.0) AS min_p50,
           PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (s.occurred_at - a.occurred_at))/60.0) AS min_p90,
           COUNT(*)::int AS n
    FROM crm_audit_logs a
    JOIN LATERAL (
      SELECT MIN(occurred_at) AS occurred_at FROM crm_audit_logs
      WHERE crm_record_id=a.crm_record_id
        AND action_origin='seller_manual'
        AND action_type IN ('whatsapp_message_sent','call_logged')
        AND occurred_at > a.occurred_at
    ) s ON s.occurred_at IS NOT NULL
    WHERE a.action_type='lead_assigned'
      AND a.action_origin='claude_director_ia'
      AND a.occurred_at BETWEEN $1 AND $2
  `, [from, to]);

  return { nubia_response: nubia.rows[0], claude_to_seller: claude.rows[0] };
}

/* ----------------- Casos recentes (últimas N decisões) ----------------- */

async function recentDecisions(pool, origin, limit = 15) {
  const r = await pool.query(`
    SELECT id, occurred_at, action_type, crm_record_id, crm_record_name,
           seller_responsible_after AS vendedor, reason, rule_triggered,
           confidence_score, impact_type, validation_status, metadata_json
    FROM crm_audit_logs
    WHERE action_origin=$1
    ORDER BY occurred_at DESC
    LIMIT $2
  `, [origin, limit]);
  return r.rows;
}

/* ----------------- Fraquezas auto-detectadas ----------------- */

async function detectWeaknesses(pool, from, to) {
  const weaknesses = [];

  // 1. Distribuições do Claude que NUNCA viraram contato
  const r1 = await pool.query(`
    SELECT COUNT(*)::int AS n,
           ROUND(100.0 * COUNT(*)::numeric / NULLIF(SUM(COUNT(*)) OVER (), 0), 1) AS pct
    FROM crm_audit_logs a
    WHERE a.action_type='lead_assigned'
      AND a.action_origin='claude_director_ia'
      AND a.occurred_at BETWEEN $1 AND $2
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id=a.crm_record_id
          AND c.action_type IN ('whatsapp_message_sent','call_logged')
          AND c.action_origin='seller_manual'
          AND c.occurred_at > a.occurred_at
      )
  `, [from, to]);

  const r1total = await pool.query(`
    SELECT COUNT(*)::int AS n FROM crm_audit_logs
    WHERE action_type='lead_assigned' AND action_origin='claude_director_ia'
      AND occurred_at BETWEEN $1 AND $2
  `, [from, to]);

  const dist_no_contact = r1.rows[0].n;
  const dist_total = r1total.rows[0].n;
  if (dist_total > 0) {
    const pct = +(100 * dist_no_contact / dist_total).toFixed(1);
    weaknesses.push({
      id: 'claude_dist_no_contact',
      severity: pct > 30 ? 'high' : 'medium',
      title: `Claude distribuiu ${dist_no_contact}/${dist_total} leads (${pct}%) que ninguém contatou`,
      description: 'A IA está mandando lead pra vendedor errado, ou o vendedor não está cumprindo o SLA. A IA não tem feedback loop pra ajustar.',
      fix: 'Adicionar regra de retry: se vendedor não tocar em 30min, redistribuir automaticamente. Treinar Claude com histórico de "match-quality" por vendedor.'
    });
  }

  // 2. Recomendações Claude com taxa de execução < 50%
  const r2 = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE NOT EXISTS (
        SELECT 1 FROM crm_audit_logs e
        WHERE e.crm_record_id=r.crm_record_id AND e.action_type='ia_action_executed'
          AND e.occurred_at > r.occurred_at AND e.occurred_at < r.occurred_at + INTERVAL '24 hours'
      ))::int AS ignoradas,
      COUNT(*)::int AS total
    FROM crm_audit_logs r
    WHERE r.action_type='ia_recommendation_created'
      AND r.action_origin='claude_director_ia'
      AND r.occurred_at BETWEEN $1 AND $2
      AND r.occurred_at < NOW() - INTERVAL '24 hours'
  `, [from, to]);

  const ign = r2.rows[0].ignoradas;
  const recTotal = r2.rows[0].total;
  if (recTotal > 0) {
    const pct = +(100 * ign / recTotal).toFixed(1);
    weaknesses.push({
      id: 'claude_recs_ignored',
      severity: pct > 50 ? 'high' : 'medium',
      title: `${ign}/${recTotal} (${pct}%) das recomendações Claude foram ignoradas em 24h`,
      description: 'Claude sugere mas o vendedor não executa. A IA não está medindo se a sugestão é boa nem ajustando o tom.',
      fix: 'Loop de feedback: marcar recomendações que viraram venda como "win" e treinar Claude. Se vendedor ignorou, escalar pro gestor automaticamente.'
    });
  }

  // 3. Núbia qualificou e closer ficou silencioso
  const r3 = await pool.query(`
    SELECT COUNT(*)::int AS n FROM crm_audit_logs q
    WHERE q.action_type='lead_qualified'
      AND q.action_origin='nubia_sdr_ia'
      AND q.occurred_at BETWEEN $1 AND $2
      AND q.occurred_at < NOW() - INTERVAL '2 hours'
      AND NOT EXISTS (
        SELECT 1 FROM crm_audit_logs c
        WHERE c.crm_record_id=q.crm_record_id
          AND c.action_origin='seller_manual'
          AND c.action_type IN ('whatsapp_message_sent','call_logged','task_created','proposal_created')
          AND c.occurred_at > q.occurred_at
      )
  `, [from, to]);

  const r3total = await pool.query(`
    SELECT COUNT(*)::int AS n FROM crm_audit_logs
    WHERE action_type='lead_qualified' AND action_origin='nubia_sdr_ia'
      AND occurred_at BETWEEN $1 AND $2
  `, [from, to]);

  const nubiaFail = r3.rows[0].n;
  const nubiaTotal = r3total.rows[0].n;
  if (nubiaTotal > 0) {
    const pct = +(100 * nubiaFail / nubiaTotal).toFixed(1);
    weaknesses.push({
      id: 'nubia_qualified_no_handoff',
      severity: pct > 30 ? 'high' : 'medium',
      title: `Núbia qualificou ${nubiaFail}/${nubiaTotal} (${pct}%) leads que closer não atuou`,
      description: 'Lead quente esfriando: Núbia faz o trabalho dela mas o handoff falha. Ou o closer está saturado, ou não recebe notificação clara.',
      fix: 'Núbia precisa cobrar o closer ativamente após 1h sem ação. Implementar "Sales Director" auto-pinging closer no Cliq + WhatsApp interno.'
    });
  }

  // 4. Confiança baixa em decisões críticas
  const r4 = await pool.query(`
    SELECT COUNT(*)::int AS n FROM crm_audit_logs
    WHERE action_origin IN ('claude_director_ia','nubia_sdr_ia')
      AND action_type IN ('lead_assigned','lead_qualified','stage_changed')
      AND confidence_score IS NOT NULL
      AND confidence_score < 60
      AND occurred_at BETWEEN $1 AND $2
  `, [from, to]);

  if (r4.rows[0].n > 0) {
    weaknesses.push({
      id: 'low_confidence_decisions',
      severity: 'medium',
      title: `${r4.rows[0].n} decisões críticas tomadas com confiança <60%`,
      description: 'IA está agindo com pouca evidência. Risco de erro de roteamento ou qualificação prematura.',
      fix: 'Threshold mínimo de confiança em decisões críticas: <60% deve mandar pra "pending_review" pro gestor avaliar antes de executar.'
    });
  }

  // 5. Erros em automação não tratados
  const r5 = await pool.query(`
    SELECT COUNT(*)::int AS n FROM crm_audit_logs
    WHERE validation_status='error'
      AND action_origin IN ('n8n_automation','zoho_flow','wati','zapi')
      AND occurred_at BETWEEN $1 AND $2
  `, [from, to]);

  if (r5.rows[0].n > 0) {
    weaknesses.push({
      id: 'automation_errors',
      severity: 'high',
      title: `${r5.rows[0].n} erros em automações no período`,
      description: 'Workflows falhando em silêncio. Cada erro é um lead que não foi tocado / um campo que não foi atualizado.',
      fix: 'Configurar alerta no Cliq #operacional pra cada erro novo. Tornar idempotência obrigatória nos n8n workflows.'
    });
  }

  // 6. Distribuição enviesada (vendedor recebendo demais ou de menos)
  const r6 = await pool.query(`
    WITH dist AS (
      SELECT seller_responsible_after AS v, COUNT(*)::int AS n
      FROM crm_audit_logs
      WHERE action_type='lead_assigned'
        AND action_origin IN ('claude_director_ia','n8n_automation','manager_manual')
        AND occurred_at BETWEEN $1 AND $2
        AND seller_responsible_after IS NOT NULL
      GROUP BY seller_responsible_after
    ),
    stats AS (SELECT AVG(n) AS media, STDDEV_POP(n) AS sd FROM dist)
    SELECT v, n, ROUND(((n - media) / NULLIF(sd, 0))::numeric, 2) AS z
    FROM dist, stats
    WHERE ABS((n - media) / NULLIF(sd, 0)) > 1.5
    ORDER BY ABS((n - media) / NULLIF(sd, 0)) DESC
  `, [from, to]);

  if (r6.rows.length > 0) {
    weaknesses.push({
      id: 'distribution_bias',
      severity: 'medium',
      title: `Distribuição enviesada: ${r6.rows.length} vendedor(es) fora de 1.5σ da média`,
      description: 'Alguns vendedores recebendo muito mais ou muito menos que a média. ' +
                   r6.rows.map(x => `${x.v}: ${x.n} leads (z=${x.z})`).join(', '),
      fix: 'Adicionar fator de "fairness" no algoritmo de distribuição: pesar carga atual + horário do vendedor.',
      data: r6.rows
    });
  }

  // 7. Núbia/Claude sem hit rate medido
  weaknesses.push({
    id: 'no_outcome_tracking',
    severity: 'high',
    title: 'IA não conhece o desfecho real das próprias ações',
    description: 'Claude e Núbia agem mas o sistema não fecha o loop: lead virou venda? Cliente ficou satisfeito? A IA continua com a mesma estratégia mesmo se ela não funciona.',
    fix: 'Implementar "outcome tracker": cada deal_won/lost gera evento que linka às ações da IA que tocaram esse lead. Treinar prompts com resultados.'
  });

  return weaknesses;
}

/* ----------------- Função principal ----------------- */

async function buildSistemicAudit(pool, from, to) {
  const [claudeSummary, nubiaSummary] = await Promise.all([
    agentSummary(pool, AGENTS.claude.origin, from, to),
    agentSummary(pool, AGENTS.nubia.origin, from, to),
  ]);

  const [claudeActions, nubiaActions] = await Promise.all([
    agentActionBreakdown(pool, AGENTS.claude.origin, from, to),
    agentActionBreakdown(pool, AGENTS.nubia.origin, from, to),
  ]);

  const [claudeRules, nubiaRules] = await Promise.all([
    agentRulesBreakdown(pool, AGENTS.claude.origin, from, to),
    agentRulesBreakdown(pool, AGENTS.nubia.origin, from, to),
  ]);

  const [distCriteria, distDim, qualCriteria, recsAudit, latency] = await Promise.all([
    distributionCriteria(pool, from, to),
    distributionByDimension(pool, from, to),
    qualificationCriteria(pool, from, to),
    recommendationsAudit(pool, from, to),
    ageLatency(pool, from, to),
  ]);

  const [claudeRecent, nubiaRecent] = await Promise.all([
    recentDecisions(pool, AGENTS.claude.origin, 15),
    recentDecisions(pool, AGENTS.nubia.origin, 15),
  ]);

  const weaknesses = await detectWeaknesses(pool, from, to);

  // Hit rate calculations
  const claudeRecExec = recsAudit.filter(r => r.executada).length;
  const claudeRecTotal = recsAudit.length;
  const claudeRecRate = claudeRecTotal ? +(100 * claudeRecExec / claudeRecTotal).toFixed(1) : 0;

  const distContact = distCriteria.filter(d => d.min_ate_contato != null).length;
  const distSold = distCriteria.filter(d => d.virou_venda).length;
  const distContactRate = distCriteria.length ? +(100 * distContact / distCriteria.length).toFixed(1) : 0;
  const distSoldRate = distCriteria.length ? +(100 * distSold / distCriteria.length).toFixed(1) : 0;

  const qualHandoff = qualCriteria.filter(q => q.closer_atuou).length;
  const qualSold = qualCriteria.filter(q => q.virou_venda).length;
  const qualHandoffRate = qualCriteria.length ? +(100 * qualHandoff / qualCriteria.length).toFixed(1) : 0;
  const qualSoldRate = qualCriteria.length ? +(100 * qualSold / qualCriteria.length).toFixed(1) : 0;

  return {
    period: { from, to },
    agents: {
      claude: {
        ...AGENTS.claude,
        summary: claudeSummary,
        actions: claudeActions,
        rules: claudeRules,
        recent: claudeRecent,
        kpis: {
          recommendation_execution_rate: claudeRecRate,
          recommendations_total: claudeRecTotal,
          recommendations_executed: claudeRecExec,
          distribution_contact_rate: distContactRate,
          distribution_sold_rate: distSoldRate
        }
      },
      nubia: {
        ...AGENTS.nubia,
        summary: nubiaSummary,
        actions: nubiaActions,
        rules: nubiaRules,
        recent: nubiaRecent,
        kpis: {
          qualifications_total: qualCriteria.length,
          qualifications_handed_off: qualHandoff,
          qualifications_sold: qualSold,
          handoff_rate: qualHandoffRate,
          sold_rate: qualSoldRate
        }
      }
    },
    distribution: {
      criteria: distCriteria.slice(0, 100),
      by_dimension: distDim,
      total: distCriteria.length
    },
    qualification: {
      criteria: qualCriteria.slice(0, 100),
      total: qualCriteria.length
    },
    recommendations: recsAudit.slice(0, 30),
    latency,
    weaknesses
  };
}

module.exports = { buildSistemicAudit };
