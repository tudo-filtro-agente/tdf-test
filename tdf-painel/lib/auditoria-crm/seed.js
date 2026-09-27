/**
 * Auditoria CRM — Mock seed
 * Gera ~600 logs realistas usando vendedores reais TDF, distribuídos
 * nos últimos 14 dias, intercalando ações de Claude / Núbia / vendedores
 * / automações com casos suspeitos plantados de propósito (pra regras detectarem).
 *
 * Roda apenas se a tabela estiver vazia OU se forçar via flag.
 */

const VENDEDORES = [
  { name: 'Guilherme', team: 'filtro' },
  { name: 'Tiago', team: 'filtro' },
  { name: 'Julia', team: 'filtro' },
  { name: 'Italo', team: 'bebedouro' },
  { name: 'Gabriel F', team: 'bebedouro' },
  { name: 'Pedro', team: 'sdr' },
  { name: 'Cátia', team: 'bebedouro' },
  { name: 'Larissa', team: 'bebedouro' },
  { name: 'Fabiana', team: 'bebedouro' },
  { name: 'Núbia AI', team: 'sdr_ia' },
];

const PRODUTOS = [
  { name: 'Bebedouro Industrial 100L', amount: 4200 },
  { name: 'Filtro de Entrada Residencial', amount: 3500 },
  { name: 'Refil AcquaBios', amount: 380 },
  { name: 'Iron Free Poço', amount: 8900 },
  { name: 'Scale Stop Caldeira', amount: 12500 },
  { name: 'Bebedouro Comercial Inox', amount: 2900 },
  { name: 'Purificador Top Life', amount: 1200 },
  { name: 'Manutenção Filtro Industrial', amount: 1800 },
];

const CIDADES = ['São Paulo', 'Recife', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Salvador', 'Fortaleza', 'Porto Alegre'];

const CHANNELS = ['Meta Ads', 'Google Ads', 'WhatsApp Orgânico', 'Indicação', 'CTWA Bebedouro', 'Site', 'Loja Física'];

const STAGES = ['Novo', 'Qualificação', 'Discovery', 'Proposta', 'Negociação', 'Fechado Ganho', 'Fechado Perdido'];

const TIERS = ['Diamante', 'Ouro', 'Prata', 'Bronze'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function id() { return 'rec_' + Math.random().toString(36).slice(2, 10); }

function shiftMin(date, m) { return new Date(date.getTime() + m * 60000); }
function shiftHr(date, h) { return new Date(date.getTime() + h * 3600000); }

function buildLeadJourney(crmRecordId, leadName, product, channel, baseDate, plantSuspicious = false) {
  const events = [];
  const cidade = pick(CIDADES);
  const tier = pick(TIERS);
  const amount = product.amount;

  // 1. Lead criado
  events.push({
    occurred_at: baseDate,
    crm_module: 'Leads',
    crm_record_id: crmRecordId,
    crm_record_name: leadName,
    action_type: 'lead_created',
    action_origin: channel === 'Meta Ads' || channel === 'CTWA Bebedouro' ? 'wati' : (channel === 'Google Ads' ? 'n8n_automation' : 'system'),
    actor_name: 'Webhook',
    related_channel: channel,
    impact_type: 'positive',
    metadata_json: { cidade, tier, amount, product: product.name }
  });

  // 2. Núbia (SDR IA) toca em ~70% dos leads
  let qualifiedByNubia = false;
  let nubiaTouchAt = null;
  if (Math.random() < 0.7) {
    nubiaTouchAt = shiftMin(baseDate, randInt(1, 5));
    events.push({
      occurred_at: nubiaTouchAt,
      crm_module: 'Leads',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'whatsapp_message_sent',
      action_origin: 'nubia_sdr_ia',
      actor_name: 'Núbia AI',
      reason: 'Saudação inicial + pergunta de qualificação SPIN',
      related_channel: 'WhatsApp',
      impact_type: 'positive',
      confidence_score: 95,
      metadata_json: { template: 'nubia_saudacao_v3', tier }
    });
    if (Math.random() < 0.6) {
      const qAt = shiftMin(nubiaTouchAt, randInt(15, 90));
      qualifiedByNubia = true;
      events.push({
        occurred_at: qAt,
        crm_module: 'Leads',
        crm_record_id: crmRecordId,
        crm_record_name: leadName,
        action_type: 'lead_qualified',
        action_origin: 'nubia_sdr_ia',
        actor_name: 'Núbia AI',
        reason: 'SPIN concluído: dor identificada, decisor confirmado, compromisso pego',
        rule_triggered: 'nubia_spin_completo',
        confidence_score: 88,
        impact_type: 'positive',
        new_value: 'Qualificado',
        old_value: 'Novo',
        field_changed: 'Stage',
        metadata_json: { sintomas: ['água amarelada', 'cheiro de cloro'], decisor: 'sim', timing: '15 dias' }
      });
    }
  }

  // 3. Claude (Diretor IA) atribui ~50%
  let assignedAt = null;
  let owner = null;
  if (Math.random() < 0.85) {
    owner = pick(VENDEDORES.filter(v => v.team !== 'sdr_ia')).name;
    assignedAt = shiftMin(qualifiedByNubia ? nubiaTouchAt : baseDate, randInt(2, 30));
    events.push({
      occurred_at: assignedAt,
      crm_module: 'Leads',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'lead_assigned',
      action_origin: Math.random() < 0.7 ? 'claude_director_ia' : 'n8n_automation',
      actor_name: 'Claude Director',
      seller_responsible_after: owner,
      reason: `Roteamento por produto (${product.name}) + carga horária + score`,
      rule_triggered: 'distribuicao_inteligente_v2',
      confidence_score: 82,
      related_channel: channel,
      impact_type: 'positive',
      metadata_json: { tier, amount, regra: 'produto+carga+score', cidade }
    });
  }

  // 4. Vendedor toca o lead (75% dos atribuídos, com latência variável)
  const willContact = owner && Math.random() < 0.75;
  let firstContactAt = null;
  if (willContact && !plantSuspicious) {
    firstContactAt = shiftMin(assignedAt, randInt(5, 90));
    events.push({
      occurred_at: firstContactAt,
      crm_module: 'Leads',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'whatsapp_message_sent',
      action_origin: 'seller_manual',
      actor_name: owner,
      seller_responsible_after: owner,
      related_channel: 'WhatsApp',
      reason: 'Primeiro contato',
      impact_type: 'positive',
    });
    if (Math.random() < 0.5) {
      const callAt = shiftMin(firstContactAt, randInt(10, 240));
      events.push({
        occurred_at: callAt,
        crm_module: 'Leads',
        crm_record_id: crmRecordId,
        crm_record_name: leadName,
        action_type: 'call_logged',
        action_origin: 'goto',
        actor_name: owner,
        seller_responsible_after: owner,
        related_channel: 'GoTo',
        reason: 'Discovery call',
        impact_type: 'positive',
        metadata_json: { duracao_seg: randInt(120, 1200) }
      });
    }
  }

  // 5. Task criada/concluída (75%)
  if (owner && Math.random() < 0.75) {
    const taskCreatedAt = shiftMin(assignedAt || baseDate, randInt(10, 60));
    events.push({
      occurred_at: taskCreatedAt,
      crm_module: 'Tasks',
      crm_record_id: crmRecordId,
      crm_record_name: `Follow-up: ${leadName}`,
      action_type: 'task_created',
      action_origin: Math.random() < 0.6 ? 'claude_director_ia' : 'seller_manual',
      actor_name: Math.random() < 0.6 ? 'Claude Director' : owner,
      seller_responsible_after: owner,
      reason: 'Follow-up em 24h',
      impact_type: 'neutral',
    });
    // 80% das tasks concluem com prova, 20% sem (suspeitas)
    const taskDoneAt = shiftHr(taskCreatedAt, randInt(2, 48));
    const semProva = Math.random() < 0.2 || plantSuspicious;
    events.push({
      occurred_at: taskDoneAt,
      crm_module: 'Tasks',
      crm_record_id: crmRecordId,
      crm_record_name: `Follow-up: ${leadName}`,
      action_type: 'task_completed',
      action_origin: 'seller_manual',
      actor_name: owner,
      seller_responsible_after: owner,
      validation_status: semProva ? 'suspicious' : 'valid',
      impact_type: semProva ? 'negative' : 'positive',
      commercial_impact: semProva ? 'vendedor não cumpriu cadência' : 'vendedor cumpriu cadência',
      reason: semProva ? 'Concluída sem evidência de contato' : 'Cliente respondeu, interesse confirmado',
    });
  }

  // 6. Mudança de etapa
  if (owner && Math.random() < 0.6 && !plantSuspicious) {
    const stageAt = shiftHr(assignedAt || baseDate, randInt(2, 72));
    events.push({
      occurred_at: stageAt,
      crm_module: 'Deals',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'stage_changed',
      action_origin: 'seller_manual',
      actor_name: owner,
      seller_responsible_after: owner,
      field_changed: 'Stage',
      old_value: 'Novo',
      new_value: pick(['Discovery', 'Qualificação', 'Proposta']),
      reason: 'Cliente interessado, agendou visita técnica',
      impact_type: 'positive',
    });
  }

  // 7. Proposta + ganho/perda
  const r = Math.random();
  if (r < 0.18 && owner) {
    // Ganho
    const propAt = shiftHr(assignedAt || baseDate, randInt(24, 120));
    events.push({
      occurred_at: propAt,
      crm_module: 'Quotes',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'proposal_created',
      action_origin: 'seller_manual',
      actor_name: owner,
      seller_responsible_after: owner,
      reason: `Orçamento ${product.name} - R$${amount}`,
      impact_type: 'positive',
      metadata_json: { amount, product: product.name }
    });
    const wonAt = shiftHr(propAt, randInt(24, 96));
    events.push({
      occurred_at: wonAt,
      crm_module: 'Deals',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'deal_won',
      action_origin: 'seller_manual',
      actor_name: owner,
      seller_responsible_after: owner,
      reason: 'Cliente fechou via PIX',
      impact_type: 'positive',
      commercial_impact: 'gerou venda',
      metadata_json: { amount, product: product.name }
    });
  } else if (r < 0.38 && owner) {
    // Perda — alguns sem motivo (suspeitos)
    const lostAt = shiftHr(assignedAt || baseDate, randInt(2, 96));
    const semMotivo = Math.random() < 0.25 || plantSuspicious;
    events.push({
      occurred_at: lostAt,
      crm_module: 'Deals',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'deal_lost',
      action_origin: 'seller_manual',
      actor_name: owner,
      seller_responsible_after: owner,
      reason: semMotivo ? '' : pick(['Cliente sem orçamento agora', 'Comprou do concorrente', 'Mudou de ideia', 'Já tem produto similar', 'Vai postergar pra outro semestre']),
      validation_status: semMotivo ? 'suspicious' : 'valid',
      impact_type: 'negative',
      commercial_impact: semMotivo ? 'possível perda por falha de processo' : 'perda registrada',
      metadata_json: { amount, product: product.name }
    });
  }

  // 8. Plant: redistribuições múltiplas em alguns leads
  if (plantSuspicious && Math.random() < 0.4) {
    const reassign1 = shiftHr(assignedAt || baseDate, randInt(2, 24));
    events.push({
      occurred_at: reassign1,
      crm_module: 'Deals',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'owner_changed',
      action_origin: 'manager_manual',
      actor_name: 'Paulo',
      seller_responsible_before: owner,
      seller_responsible_after: pick(VENDEDORES.filter(v => v.team !== 'sdr_ia' && v.name !== owner)).name,
      field_changed: 'Owner',
      old_value: owner,
      new_value: pick(VENDEDORES).name,
      reason: 'Redistribuição manual',
      impact_type: 'neutral',
    });
    const reassign2 = shiftHr(reassign1, randInt(12, 48));
    events.push({
      occurred_at: reassign2,
      crm_module: 'Deals',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'owner_changed',
      action_origin: 'claude_director_ia',
      actor_name: 'Claude Director',
      seller_responsible_after: pick(VENDEDORES.filter(v => v.team !== 'sdr_ia')).name,
      old_value: 'X',
      new_value: 'Y',
      reason: 'Rebalanceamento de carga',
      impact_type: 'neutral',
    });
    const reassign3 = shiftHr(reassign2, randInt(6, 24));
    events.push({
      occurred_at: reassign3,
      crm_module: 'Deals',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'owner_changed',
      action_origin: 'manager_manual',
      actor_name: 'Paulo',
      seller_responsible_after: pick(VENDEDORES.filter(v => v.team !== 'sdr_ia')).name,
      old_value: 'Y',
      new_value: 'Z',
      reason: 'Última tentativa',
      impact_type: 'negative',
    });
  }

  // 9. Recomendação Claude que pode ou não ser executada
  if (Math.random() < 0.25 && owner) {
    const recAt = shiftHr(assignedAt || baseDate, randInt(6, 48));
    events.push({
      occurred_at: recAt,
      crm_module: 'Leads',
      crm_record_id: crmRecordId,
      crm_record_name: leadName,
      action_type: 'ia_recommendation_created',
      action_origin: 'claude_director_ia',
      actor_name: 'Claude Director',
      seller_responsible_after: owner,
      reason: 'Recomendo cobrar proposta hoje. Lead esfriando — última msg foi anteontem.',
      rule_triggered: 'cooldown_detector',
      confidence_score: 78,
      impact_type: 'neutral',
      metadata_json: { sugestao: 'send_followup_template_v2' }
    });
    if (Math.random() < 0.55 && !plantSuspicious) {
      events.push({
        occurred_at: shiftHr(recAt, randInt(1, 12)),
        crm_module: 'Leads',
        crm_record_id: crmRecordId,
        crm_record_name: leadName,
        action_type: 'ia_action_executed',
        action_origin: 'seller_manual',
        actor_name: owner,
        seller_responsible_after: owner,
        reason: 'Vendedor executou recomendação do Claude',
        impact_type: 'positive',
      });
    }
  }

  return events;
}

async function seedMockData(pool, { totalLeads = 60 } = {}) {
  const events = [];
  const now = new Date();
  for (let i = 0; i < totalLeads; i++) {
    const daysAgo = randInt(0, 13);
    const hoursOffset = randInt(8, 18);
    const minOffset = randInt(0, 59);
    const baseDate = new Date(now.getTime() - daysAgo * 86400000);
    baseDate.setHours(hoursOffset, minOffset, 0, 0);

    const product = pick(PRODUTOS);
    const channel = pick(CHANNELS);
    const leadName = `${pick(['João', 'Maria', 'Ana', 'Carlos', 'Roberto', 'Patricia', 'Fernando', 'Juliana', 'Marcos', 'Luana'])} ${pick(['Silva', 'Souza', 'Santos', 'Lima', 'Costa', 'Pereira', 'Almeida', 'Oliveira'])} - ${pick(CIDADES)}`;
    const recId = id();
    const plantSuspicious = i % 8 === 0; // 1 em 8 com problema plantado

    const journey = buildLeadJourney(recId, leadName, product, channel, baseDate, plantSuspicious);
    events.push(...journey);
  }

  // Plantar erros de automação
  for (let i = 0; i < 6; i++) {
    events.push({
      occurred_at: shiftHr(now, -randInt(1, 23)),
      crm_module: 'Tasks',
      crm_record_id: id(),
      crm_record_name: `n8n run ${i}`,
      action_type: 'automation_triggered',
      action_origin: pick(['n8n_automation', 'zoho_flow', 'wati']),
      actor_name: pick(['Workflow CTWA Polling', 'Workflow Núbia Score', 'Z-API webhook']),
      reason: pick([
        'ECONNREFUSED ao chamar Zoho API',
        'Timeout 30s no template WATI',
        'Token Meta CAPI expirado (29/Mai)',
        'Lead não encontrado no Zoho — criação falhou'
      ]),
      validation_status: 'error',
      impact_type: 'negative',
    });
  }

  // Plantar rajadas de tasks
  const burstSeller = pick(VENDEDORES.filter(v => v.team !== 'sdr_ia')).name;
  const burstHour = shiftHr(now, -randInt(2, 36));
  for (let k = 0; k < 7; k++) {
    events.push({
      occurred_at: shiftMin(burstHour, k * 4),
      crm_module: 'Tasks',
      crm_record_id: id(),
      crm_record_name: `Task rajada ${k}`,
      action_type: 'task_completed',
      action_origin: 'seller_manual',
      actor_name: burstSeller,
      seller_responsible_after: burstSeller,
      validation_status: 'suspicious',
      impact_type: 'negative',
      commercial_impact: 'concluído sem evidência',
      reason: '',
    });
  }

  // Inserir tudo em batch
  const { insertLog } = require('./db');
  let inserted = 0;
  for (const ev of events) {
    try { await insertLog(pool, ev); inserted++; }
    catch (e) { console.warn('[seed] erro insert', e.message); }
  }
  return { inserted, totalEvents: events.length, totalLeads };
}

async function maybeSeed(pool, { force = false } = {}) {
  const r = await pool.query('SELECT COUNT(*)::int AS n FROM crm_audit_logs');
  if (!force && r.rows[0].n > 0) {
    return { skipped: true, existing: r.rows[0].n };
  }
  if (force) {
    await pool.query('DELETE FROM crm_audit_alerts');
    await pool.query('DELETE FROM crm_audit_logs');
  }
  const result = await seedMockData(pool, { totalLeads: 60 });
  console.log(`[auditoria-crm/seed] ${result.inserted}/${result.totalEvents} eventos plantados (${result.totalLeads} leads)`);
  return result;
}

module.exports = { maybeSeed, seedMockData, VENDEDORES, PRODUTOS, CHANNELS };
