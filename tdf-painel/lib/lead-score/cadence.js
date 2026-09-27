/**
 * Lead Score — Cadência por tier × produto.
 *
 * Cada (tier, produto) tem uma cadência configurável:
 *   - sla_first_call_minutes: SLA da primeira ação
 *   - max_attempts:            quantas tentativas no total
 *   - assignee_role:           'sdr' | 'closer' | 'both'
 *   - remind_default:          popup Zoho ativo por default em todos os passos
 *   - steps[]: lista ordenada de passos no formato:
 *       { day, hour, minute, channel, label, priority, with_reminder? }
 *
 * Lookup: busca primeiro a cadência específica (tier×produto). Se não houver,
 * cai pra cadência genérica do tier (product_type=NULL). Permite ter Diamante
 * geral + Diamante-Bebedouro especializado.
 *
 * Backward-compat: passos antigos com `offset_minutes` continuam funcionando —
 * o engine converte na hora.
 *
 * Quando o tier (re)calcula:
 *   1. Cancela run anterior (reason=tier_changed) se mudou tier ou produto
 *   2. Cria task no Zoho do passo 0 com Due_Date+horário + Remind_At popup
 *   3. Agenda next_action_at pro próximo passo
 *
 * Cron a cada 5min: pega runs vencidos e cria próxima task no Zoho.
 * WATI: cliente respondeu → cancelCadenceRun.
 */

const db = require('./db');
const validator = require('./owner-validator');
const businessHours = require('./business-hours');

let _zoho = null;
function zoho() {
  if (_zoho) return _zoho;
  try { _zoho = require('../zoho'); } catch (e) { _zoho = null; }
  return _zoho;
}

function isDryRun() { return process.env.LEAD_SCORE_CADENCE_DRY_RUN === '1'; }
function isCadenceDisabled() { return process.env.LEAD_SCORE_CADENCE_DISABLED === '1'; }

/* ============================== HELPERS ============================== */

/**
 * Calcula a data/hora absoluta de um passo a partir do início da cadência.
 *
 * Prioridade:
 *   1. step.offset_minutes  — minutos desde o início (PREFERENCIAL — modelo novo)
 *   2. step.day/hour/minute — D+N às HH:MM (legacy, mantido pra compat)
 *
 * Se step.business_hours_only !== false (default true), ajusta pra
 * próximo horário comercial seg-sex 09-18, sáb 09-13.
 */
function stepDueAt(step, startedAt) {
  let dueAt;
  if (step.offset_minutes != null) {
    dueAt = new Date(new Date(startedAt).getTime() + Number(step.offset_minutes) * 60000);
  } else if (step.day != null) {
    dueAt = new Date(startedAt);
    dueAt.setDate(dueAt.getDate() + Number(step.day || 0));
    dueAt.setHours(Number(step.hour || 9), Number(step.minute || 0), 0, 0);
  } else {
    dueAt = new Date(startedAt);
  }
  // Aplica regra de horário comercial (default ON)
  if (step.business_hours_only !== false) {
    dueAt = businessHours.bumpToBusinessHours(dueAt);
  }
  return dueAt;
}

/**
 * Formata datetime pra Zoho Remind_At (ISO 8601 com timezone).
 * Zoho aceita formato 2026-05-12T09:00:00-03:00.
 */
function formatRemindAt(date) {
  const tz = '-03:00'; // BRT (TDF opera em São Paulo)
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00${tz}`;
}

function formatDueDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
}

function shouldRemind(step, cadenceCfg) {
  if (step.with_reminder === false) return false;
  if (step.with_reminder === true) return true;
  return cadenceCfg.remind_default !== false;
}

/**
 * Se o horário programado já passou, reagenda pra now+60s pra garantir que
 * o Remind_At ainda dispare popup no Zoho (em vez de virar task atrasada silenciosa).
 * Marca wasInPast=true pra history.
 */
function effectiveDueAt(dueAt) {
  const now = new Date();
  if (dueAt.getTime() <= now.getTime()) {
    return { dueAt: new Date(now.getTime() + 60_000), wasInPast: true, originalDueAt: dueAt };
  }
  return { dueAt, wasInPast: false, originalDueAt: dueAt };
}

/**
 * V2 — Cria atividade no Zoho com validação rigorosa.
 *
 *   1. Pega Owner ATUAL do deal no Zoho (não confia em ctx)
 *   2. Valida se Owner pode receber o produto (owner-validator)
 *   3. Se inválido → NÃO cria, grava activity_audit status=OWNER_INVALIDO...
 *   4. Idempotência: checa se já existe task/call equivalente aberta
 *   5. Se DRY_RUN → grava audit status=DRY_RUN sem chamar Zoho
 *   6. Cria com Owner.id correto (sempre o do deal validado)
 *   7. Grava audit status=created + zoho_id
 *
 * @param {object} pool             postgres pool (pra audit)
 * @param {object} zohoLib
 * @param {object} step
 * @param {object} cadence
 * @param {object} ctx              { dealId, tier, productType, stepIdx, totalSteps, dueAt, runId? }
 */
async function createZohoActivity(pool, zohoLib, step, cadence, ctx) {
  const baseAudit = {
    deal_id: ctx.dealId,
    cadence_run_id: ctx.runId || null,
    cadence_tier: cadence.tier,
    cadence_product_type: cadence.product_type,
    cadence_stage: cadence.stage,
    step_index: ctx.stepIdx,
    activity_kind: step.channel === 'call' ? 'call' : (step.channel === 'wait' ? 'wait' : 'task'),
    product_type: ctx.productType,
    requested_by: ctx.requestedBy || 'cadence',
  };

  // 0. Wait step → não cria nada
  if (step.channel === 'wait') {
    await db.insertActivityAudit(pool, { ...baseAudit, status: 'WAIT_SKIPPED', block_reason: 'channel=wait' });
    return { ok: true, kind: 'wait', skipped: true, reason: 'wait_step_skipped' };
  }

  // 0b. Escalate step → cria task mas com Owner = gestor (não closer)
  if (step.channel === 'escalate') {
    await db.insertActivityAudit(pool, { ...baseAudit, status: 'ESCALATE_NOT_IMPLEMENTED', block_reason: 'channel=escalate ainda não roteado pra gestor' });
    return { ok: false, kind: 'escalate', error: 'escalate ainda não roteado' };
  }

  // 0c. Kill switch
  if (isCadenceDisabled()) {
    await db.insertActivityAudit(pool, { ...baseAudit, status: 'BLOCKED', block_reason: 'LEAD_SCORE_CADENCE_DISABLED=1' });
    return { ok: false, error: 'cadence disabled by env' };
  }

  // 1. Pega Owner real do Zoho — autoritativo
  let dealZoho = null;
  if (zohoLib && zohoLib.getDeal) {
    try {
      dealZoho = await zohoLib.getDeal(ctx.dealId, 'Owner,Stage,Pipeline,Layout,Deal_Name');
    } catch (e) { dealZoho = null; }
  }
  const ownerZohoName = dealZoho?.Owner?.name || dealZoho?.Owner?.email || null;
  const ownerZohoId   = dealZoho?.Owner?.id || null;

  // 2. Valida permissão
  const validation = validator.validateOwnerForProduct({
    owner_zoho_name: ownerZohoName,
    product_type: ctx.productType,
  });

  if (!validation.ok) {
    await db.insertActivityAudit(pool, {
      ...baseAudit,
      owner_zoho_name: ownerZohoName,
      owner_zoho_id: ownerZohoId,
      target_user: validation.user?.username || null,
      status: validation.block_code || 'BLOCKED',
      block_reason: validation.reason,
      metadata: { perms_seen: validation.perms_seen, deal_name: dealZoho?.Deal_Name },
    });
    return { ok: false, kind: null, error: validation.reason, block_code: validation.block_code };
  }

  const targetUser = validation.user;
  const dueAt = ctx.dueAt;
  const remindAtIso = shouldRemind(step, cadence) ? formatRemindAt(dueAt) : null;
  const subject = `[${ctx.tier}] ${step.label || step.channel}`;
  const description = ctx.description ||
    `Lead Score TDF — Cadência ${ctx.tier}${ctx.productType?' × '+ctx.productType:''}\nPasso ${ctx.stepIdx+1}/${ctx.totalSteps} · canal: ${step.channel}\nSLA primeira ação: ${cadence.sla_first_call_minutes}min · max tentativas: ${cadence.max_attempts}\nOwner validado: ${targetUser.username} (team=${targetUser.team})`;

  // 3. Idempotência: existe equivalente aberta?
  const duplicate = await _findExistingActivity(zohoLib, {
    dealId: ctx.dealId, subject, kind: step.channel === 'call' ? 'call' : 'task',
  });
  if (duplicate) {
    await db.insertActivityAudit(pool, {
      ...baseAudit,
      owner_zoho_name: ownerZohoName, owner_zoho_id: ownerZohoId,
      target_user: targetUser.username,
      status: 'DUPLICATED',
      block_reason: `já existe ${duplicate.kind} aberta no Zoho (id=${duplicate.id}, subject=${duplicate.subject})`,
      zoho_id: duplicate.id,
      metadata: { duplicate_subject: duplicate.subject },
    });
    return { ok: true, kind: duplicate.kind, id: duplicate.id, deduped: true };
  }

  // 4. DRY_RUN → loga sem criar no Zoho
  if (isDryRun()) {
    await db.insertActivityAudit(pool, {
      ...baseAudit,
      owner_zoho_name: ownerZohoName, owner_zoho_id: ownerZohoId,
      target_user: targetUser.username,
      status: 'DRY_RUN',
      block_reason: 'LEAD_SCORE_CADENCE_DRY_RUN=1 — não chamou Zoho',
      metadata: { subject, would_be_owner: ownerZohoId, remindAt: remindAtIso, dueAt: dueAt.toISOString() },
    });
    return { ok: true, kind: step.channel === 'call' ? 'call' : 'task', id: null, dry_run: true };
  }

  // 5. Cria no Zoho — sempre com Owner.id do deal (não null)
  let result;
  if (step.channel === 'call' && zohoLib.createCall) {
    result = await zohoLib.createCall({
      dealId: ctx.dealId,
      ownerId: ownerZohoId,  // Owner correto do deal
      subject, description,
      callStartTime: formatRemindAt(dueAt),
      durationMinutes: Number(step.duration_minutes || 15),
      remindAt: remindAtIso,
      callPurpose: step.label || null,
    });
    result.kind = 'call'; result.id = result.callId;
  } else {
    if (!zohoLib.createTask) {
      await db.insertActivityAudit(pool, { ...baseAudit, status: 'ERROR', block_reason: 'zoho.createTask indisponível' });
      return { ok: false, error: 'createTask indisponível', kind: 'task' };
    }
    result = await zohoLib.createTask({
      dealId: ctx.dealId,
      ownerId: ownerZohoId,
      subject, description,
      dueDate: formatDueDate(dueAt),
      remindAt: remindAtIso,
      priority: step.priority || 'Normal',
      status: 'Not Started',
    });
    result.kind = 'task'; result.id = result.taskId;
  }

  await db.insertActivityAudit(pool, {
    ...baseAudit,
    owner_zoho_name: ownerZohoName, owner_zoho_id: ownerZohoId,
    target_user: targetUser.username,
    status: result.ok ? 'CREATED' : 'ERROR',
    block_reason: result.ok ? null : (result.error || 'unknown'),
    zoho_id: result.id || null,
    metadata: { subject, remindAt: remindAtIso, dueAt: dueAt.toISOString() },
  });

  return result;
}

/**
 * Idempotência: procura no Zoho se já existe Task/Call aberta do deal com
 * subject parecido. Usa search por What_Id + Subject contains.
 * Retorna null se nada equivalente; retorna {kind,id,subject} se existe.
 */
async function _findExistingActivity(zohoLib, { dealId, subject, kind }) {
  if (!zohoLib || !zohoLib.fetch) return null;
  try {
    const token = await zohoLib.getToken();
    if (!token) return null;
    const module = kind === 'call' ? 'Calls' : 'Tasks';
    const subjPrefix = subject.split('—')[0].trim().slice(0, 30);
    const criteria = `(What_Id:equals:${dealId})and(Subject:starts_with:${subjPrefix})`;
    const fields = kind === 'call'
      ? 'Subject,Call_Status,Call_Start_Time'
      : 'Subject,Status,Due_Date';
    const url = `${zohoLib.BASE}/${module}/search?criteria=${encodeURIComponent(criteria)}&fields=${encodeURIComponent(fields)}`;
    const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
    if (r.status === 204) return null;
    if (!r.ok) return null;
    const j = await r.json().catch(() => ({}));
    const items = j.data || [];
    // filtra os abertos (status != Completed/Cancelled)
    const open = items.find(x => {
      if (kind === 'call') return x.Call_Status === 'Scheduled' || x.Call_Status === 'Planned';
      return x.Status !== 'Completed' && x.Status !== 'Cancelled' && x.Status !== 'Deferred';
    });
    if (!open) return null;
    return { kind, id: open.id, subject: open.Subject };
  } catch (e) {
    return null;
  }
}

/* ============================== DEFAULTS POR TIER ============================== */
// Estes são os defaults genéricos (product_type=NULL = fallback do tier).
// Cadências específicas (tier × produto) o gestor cria pela UI quando precisar.

const DEFAULT_CADENCES = [
  {
    tier: 'DIAMANTE',
    product_type: null,
    sla_first_call_minutes: 5,
    max_attempts: 7,
    assignee_role: 'closer',
    remind_default: true,
    notes: 'Tier máximo — closer direto, contato em <5min, follow-up agressivo até D+7',
    steps: [
      { day: 0, hour: 9,  minute: 0,  channel: 'call',     label: '🔥 LIGAÇÃO IMEDIATA — Diamante recém qualificado', priority: 'High' },
      { day: 0, hour: 14, minute: 0,  channel: 'whatsapp', label: 'WhatsApp follow-up tarde D+0', priority: 'High' },
      { day: 1, hour: 9,  minute: 30, channel: 'call',     label: 'Ligação D+1 manhã', priority: 'High' },
      { day: 1, hour: 16, minute: 0,  channel: 'whatsapp', label: 'WhatsApp D+1 tarde', priority: 'High' },
      { day: 3, hour: 10, minute: 0,  channel: 'call',     label: 'Terceira ligação D+3', priority: 'High' },
      { day: 5, hour: 11, minute: 0,  channel: 'whatsapp', label: 'WhatsApp final D+5', priority: 'Normal' },
      { day: 7, hour: 9,  minute: 0,  channel: 'escalate', label: 'Escalar pro gestor — Diamante frio D+7', priority: 'High' },
    ],
  },
  {
    tier: 'OURO',
    product_type: null,
    sla_first_call_minutes: 15,
    max_attempts: 5,
    assignee_role: 'closer',
    remind_default: true,
    notes: 'Closer direto, contato em <15min, escada até D+7',
    steps: [
      { day: 0, hour: 9,  minute: 0,  channel: 'call',     label: 'Ligação imediata — Ouro', priority: 'High' },
      { day: 0, hour: 15, minute: 0,  channel: 'whatsapp', label: 'WhatsApp follow-up D+0', priority: 'High' },
      { day: 1, hour: 10, minute: 0,  channel: 'call',     label: 'Ligação D+1', priority: 'High' },
      { day: 3, hour: 11, minute: 0,  channel: 'whatsapp', label: 'WhatsApp D+3', priority: 'Normal' },
      { day: 7, hour: 10, minute: 0,  channel: 'escalate', label: 'Escalar — Ouro frio D+7', priority: 'Normal' },
    ],
  },
  {
    tier: 'PRATA',
    product_type: null,
    sla_first_call_minutes: 60,
    max_attempts: 4,
    assignee_role: 'sdr',
    remind_default: true,
    notes: 'SDR qualifica antes de subir pra closer',
    steps: [
      { day: 0, hour: 10, minute: 0, channel: 'whatsapp', label: 'WhatsApp qualificação SDR — Prata', priority: 'Normal' },
      { day: 0, hour: 15, minute: 0, channel: 'call',     label: 'Ligação SDR fim do dia', priority: 'Normal' },
      { day: 1, hour: 11, minute: 0, channel: 'whatsapp', label: 'WhatsApp D+1', priority: 'Normal' },
      { day: 5, hour: 10, minute: 0, channel: 'whatsapp', label: 'WhatsApp D+5 — última tentativa SDR', priority: 'Normal' },
    ],
  },
  {
    tier: 'BRONZE',
    product_type: null,
    sla_first_call_minutes: 240,
    max_attempts: 3,
    assignee_role: 'sdr',
    remind_default: false, // bronze sem popup pra não poluir
    notes: 'Nutrição leve — Bronze ainda precisa qualificar',
    steps: [
      { day: 0, hour: 11, minute: 0, channel: 'whatsapp', label: 'WhatsApp leve SDR — Bronze', priority: 'Low' },
      { day: 2, hour: 10, minute: 0, channel: 'whatsapp', label: 'WhatsApp D+2', priority: 'Low' },
      { day: 7, hour: 10, minute: 0, channel: 'whatsapp', label: 'WhatsApp D+7 — última tentativa', priority: 'Low' },
    ],
  },
  {
    tier: 'PEDRA',
    product_type: null,
    sla_first_call_minutes: 1440,
    max_attempts: 2,
    assignee_role: 'sdr',
    remind_default: false,
    notes: 'Nutrição mínima (geralmente telefone inválido / curioso)',
    steps: [
      { day: 1,  hour: 10, minute: 0, channel: 'whatsapp', label: 'WhatsApp único — Pedra (verificar telefone)', priority: 'Low' },
      { day: 14, hour: 10, minute: 0, channel: 'whatsapp', label: 'Nutrição D+14', priority: 'Low' },
    ],
  },
];

async function seedDefaults(pool) {
  let inserted = 0;
  for (const c of DEFAULT_CADENCES) {
    // só insere/atualiza se nunca foi editado por humano
    const existing = await pool.query(
      `SELECT id, updated_by FROM lead_score_cadence WHERE tier = $1 AND product_type IS NULL`,
      [c.tier]
    );
    if (existing.rows[0] && existing.rows[0].updated_by && existing.rows[0].updated_by !== 'seed') continue;
    await db.upsertCadence(pool, c, 'seed');
    inserted++;
  }
  return inserted;
}

/* ============================== APPLY ============================== */

/**
 * Aplica a cadência do tier×produto ao deal.
 * @param {object} pool
 * @param {object} args
 * @param {string} args.deal_id
 * @param {string} args.tier         UPPERCASE
 * @param {string} [args.product_type]
 * @param {string} [args.deal_name]
 * @param {string} [args.owner_id]   Zoho user id pra atribuir a task
 * @param {string} [args.reason]
 * @param {boolean} [args.create_zoho_task=true]
 */
async function applyToDeal(pool, args) {
  if (!args || !args.deal_id || !args.tier) throw new Error('deal_id e tier obrigatórios');
  // PIVOT 2026-05-12: cadência desligada via env → não cria atividade, não chama handoff.
  // Zoho workflow+assignment rule cuidam de Owner + Tasks. Portal só calcula score.
  if (isCadenceDisabled()) {
    return { ok: true, skipped: true, reason: 'LEAD_SCORE_CADENCE_DISABLED=1' };
  }
  const tier = String(args.tier).toUpperCase();
  const productType = args.product_type || null;
  const layout = args.layout || null;
  const pipeline = args.pipeline || null;
  const stage = args.stage || null;

  const cadence = await db.getCadenceForTier(pool, tier, productType, layout, pipeline, stage);
  if (!cadence) return { ok: false, error: `sem cadência ativa pra tier ${tier}${productType?'/'+productType:''}${layout?'/'+layout:''}${pipeline?'/'+pipeline:''}${stage?'/'+stage:''}` };

  // Override de assignee_role por regra especial:
  // se o engine marcou que o lead precisa de qualificação SDR antes de subir
  // pro closer (ex: poço sem análise >300km), força a Núbia atender — mesmo que
  // o tier seja Diamante/Ouro/Prata.
  if (args.force_assignee_role) {
    cadence._original_assignee_role = cadence.assignee_role;
    cadence.assignee_role = args.force_assignee_role;
  }

  const steps = Array.isArray(cadence.steps_json) ? cadence.steps_json
              : (typeof cadence.steps_json === 'string' ? JSON.parse(cadence.steps_json) : []);
  if (!steps.length) return { ok: false, error: `cadência ${tier} sem steps` };

  // Cancela run ativo se for diferente cadência (key inclui 5 filtros)
  const existing = await db.activeCadenceRun(pool, args.deal_id);
  const newKey = `${tier}/${cadence.product_type||''}/${cadence.layout||''}/${cadence.pipeline||''}/${cadence.stage||''}`;
  if (existing) {
    const existingKey = `${existing.cadence_tier}/${existing.cadence_product_type||''}/${existing.cadence_layout||''}/${existing.cadence_pipeline||''}/${existing.cadence_stage||''}`;
    if (existingKey === newKey) {
      return { ok: true, action: 'unchanged', run_id: existing.id };
    }
    await db.cancelCadenceRun(pool, args.deal_id, `cadence_changed: ${existingKey} → ${newKey}`);
  }

  const step0 = steps[0];
  const startedAt = new Date();
  const due0Raw = stepDueAt(step0, startedAt);
  const eff0 = effectiveDueAt(due0Raw);

  // Cria atividade no Zoho (Call ou Task conforme canal) — com validação V2
  let taskResult = { ok: false, reason: 'not_attempted', kind: null };
  if (args.create_zoho_task !== false) {
    taskResult = await createZohoActivity(pool, zoho(), step0, cadence, {
      dealId: args.deal_id,
      tier, productType, stepIdx: 0, totalSteps: steps.length, dueAt: eff0.dueAt,
      requestedBy: args.requested_by,
      // runId injetado abaixo depois de insertCadenceRun
    });
  }

  const nextStep = steps[1] || null;
  const nextActionAt = nextStep ? stepDueAt(nextStep, startedAt) : null;

  const history = [{
    step: 0, channel: step0.channel, label: step0.label,
    due_at: eff0.dueAt.toISOString(),
    original_due_at: eff0.originalDueAt.toISOString(),
    rescheduled_from_past: eff0.wasInPast,
    executed_at: startedAt.toISOString(),
    zoho_kind: taskResult.kind || null,
    zoho_id: taskResult.id || null,
    zoho_status: taskResult.ok ? 'created' : `error: ${taskResult.error || taskResult.reason}`,
    reminded: shouldRemind(step0, cadence),
  }];

  const run = await db.insertCadenceRun(pool, {
    deal_id: args.deal_id,
    cadence_tier: tier,
    cadence_product_type: cadence.product_type || null,
    cadence_layout: cadence.layout || null,
    cadence_pipeline: cadence.pipeline || null,
    cadence_stage: cadence.stage || null,
    step_index_current: 0,
    next_action_at: nextActionAt,
    history,
  });

  if (taskResult.id) {
    await db.updateCadenceRun(pool, run.id, {
      last_zoho_task_id: taskResult.id,
      last_task_created_at: startedAt.toISOString(),
    });
  }

  // === HANDOFF: dispara Núbia / atribui closer conforme assignee_role ===
  cadence._handoff = args.handoff;  // injeta adapter pra dispatchHandoff()
  let handoffResult = { role: cadence.assignee_role, nubia: null, closer: null };
  if (args.dispatch_handoff !== false && args.handoff) {
    try {
      handoffResult = await dispatchHandoff(pool, {
        cadence,
        deal_id: args.deal_id,
        deal_context: args.deal_context || null,
        reason: args.reason || `cadence ${tier} applied`,
      });
    } catch (e) {
      handoffResult = { role: cadence.assignee_role, error: e.message };
    }
  }

  await db.insertAudit(pool, {
    actor: args.requested_by || 'system',
    target_type: 'cadence_run',
    target_id: run.id,
    target_label: `deal ${args.deal_id} · ${tier}${productType?'/'+productType:''}`,
    field_changed: 'started',
    new_value: JSON.stringify({
      tier, product: productType, step: 0,
      zoho_kind: taskResult.kind || null, zoho_id: taskResult.id || null,
      handoff: handoffResult,
    }),
    reason: args.reason || `tier=${tier} cadence applied`,
  });

  return {
    ok: true, action: existing ? 'replaced' : 'created',
    run_id: run.id, cadence_id: cadence.id,
    match_level: cadence._match_level || null,
    cadence_resolved: {
      tier,
      product_type: cadence.product_type, layout: cadence.layout,
      pipeline: cadence.pipeline, stage: cadence.stage,
    },
    zoho_task: taskResult,
    handoff: handoffResult,
    next_action_at: nextActionAt,
    total_steps: steps.length,
  };
}

/* ============================== PROGRESS (cron) ============================== */

async function progressDue(pool, { limit = 50 } = {}) {
  const due = await db.dueCadenceRuns(pool, { limit });
  const results = { processed: 0, advanced: 0, completed: 0, errors: 0, details: [] };

  for (const run of due) {
    results.processed++;
    try {
      const cadence = await db.getCadenceForTier(pool, run.cadence_tier,
        run.cadence_product_type, run.cadence_layout, run.cadence_pipeline, run.cadence_stage);
      if (!cadence) {
        await db.updateCadenceRun(pool, run.id, {
          status: 'completed', cancelled_reason: 'no_cadence_config', completed_at: new Date().toISOString()
        });
        results.completed++;
        continue;
      }
      const steps = Array.isArray(cadence.steps_json) ? cadence.steps_json
                  : (typeof cadence.steps_json === 'string' ? JSON.parse(cadence.steps_json) : []);

      const nextIdx = run.step_index_current + 1;
      if (nextIdx >= steps.length || nextIdx >= cadence.max_attempts) {
        await db.updateCadenceRun(pool, run.id, {
          status: 'completed', completed_at: new Date().toISOString(),
          step_index_current: run.step_index_current, next_action_at: null,
        });
        results.completed++;
        results.details.push({ run_id: run.id, deal_id: run.deal_id, action: 'completed' });
        continue;
      }

      const step = steps[nextIdx];
      const startedAt = run.started_at;
      const dueAtRaw = stepDueAt(step, startedAt);
      const eff = effectiveDueAt(dueAtRaw);
      const now = new Date();

      // Cria atividade no Zoho (Call ou Task conforme canal) — com validação V2
      let taskResult = { ok: false, kind: null };
      taskResult = await createZohoActivity(pool, zoho(), step, cadence, {
        dealId: run.deal_id,
        tier: run.cadence_tier, productType: run.cadence_product_type,
        stepIdx: nextIdx, totalSteps: steps.length, dueAt: eff.dueAt,
        runId: run.id,
        requestedBy: 'cadence-cron',
      });

      const nextStep = steps[nextIdx + 1] || null;
      const nextActionAt = nextStep ? stepDueAt(nextStep, startedAt) : null;

      const history = Array.isArray(run.history_json) ? run.history_json
                    : (typeof run.history_json === 'string' ? JSON.parse(run.history_json) : []);
      history.push({
        step: nextIdx, channel: step.channel, label: step.label,
        due_at: eff.dueAt.toISOString(),
        original_due_at: eff.originalDueAt.toISOString(),
        rescheduled_from_past: eff.wasInPast,
        executed_at: now.toISOString(),
        zoho_kind: taskResult.kind || null,
        zoho_id: taskResult.id || null,
        zoho_status: taskResult.ok ? 'created' : `error: ${taskResult.error || 'unknown'}`,
        reminded: shouldRemind(step, cadence),
      });

      await db.updateCadenceRun(pool, run.id, {
        step_index_current: nextIdx,
        next_action_at: nextActionAt,
        last_zoho_task_id: taskResult.id || run.last_zoho_task_id,
        last_task_created_at: taskResult.ok ? now.toISOString() : run.last_task_created_at,
        history_json: history,
        ...(nextActionAt ? {} : { status: 'completed', completed_at: now.toISOString() }),
      });

      results.advanced++;
      results.details.push({
        run_id: run.id, deal_id: run.deal_id, action: 'advanced',
        step: nextIdx, channel: step.channel, zoho_kind: taskResult.kind, zoho_ok: taskResult.ok
      });
    } catch (e) {
      results.errors++;
      results.details.push({ run_id: run.id, deal_id: run.deal_id, error: e.message });
    }
  }

  return results;
}

async function cancelForDeal(pool, dealId, reason) {
  await db.cancelCadenceRun(pool, dealId, reason || 'manual_cancel');
}

/* ============================== HANDOFF ============================== */

/**
 * Dispara handoff conforme assignee_role da cadência.
 * Recebe `handoff` adapter (injetado via mount) com:
 *   - fireSdr({deal, tier, product_type, motivo}) → resultado/erro
 *   - assignCloser({deal_id, product_type, current_owner_name}) → username|null
 *
 * Loga em audit e retorna resumo.
 */
async function dispatchHandoff(pool, { cadence, deal_id, deal_context, reason }) {
  const role = String(cadence.assignee_role || '').toLowerCase();
  const result = { role, nubia: null, closer: null };

  if (!_handoffFor(role)) return result;

  // SDR / both → Núbia
  if (role === 'sdr' || role === 'both') {
    if (cadence._handoff?.fireSdr) {
      try {
        const out = await cadence._handoff.fireSdr({
          deal: deal_context || { id: deal_id },
          tier: cadence.tier,
          product_type: cadence.product_type || null,
          motivo: `cadence_${cadence.tier}${cadence.product_type?'_'+cadence.product_type:''}`,
          reason,
        });
        result.nubia = { ok: true, raw: out };
      } catch (e) {
        result.nubia = { ok: false, error: e.message };
      }
    } else {
      result.nubia = { ok: false, error: 'fireSdr adapter ausente' };
    }
  }

  // Closer / both → round-robin atribuir (respeitando pool da cadência)
  if (role === 'closer' || role === 'both') {
    if (cadence._handoff?.assignCloser) {
      try {
        const pool = Array.isArray(cadence.assignee_pool_json) ? cadence.assignee_pool_json
                     : (typeof cadence.assignee_pool_json === 'string' ? JSON.parse(cadence.assignee_pool_json) : null);
        const username = await cadence._handoff.assignCloser({
          deal_id,
          product_type: cadence.product_type || null,
          current_owner_name: deal_context?.Owner || null,
          assignee_pool: pool,
        });
        result.closer = { ok: true, username, pool_used: pool };
      } catch (e) {
        result.closer = { ok: false, error: e.message };
      }
    } else {
      result.closer = { ok: false, error: 'assignCloser adapter ausente' };
    }
  }

  await db.insertAudit(pool, {
    actor: 'lead-score-cadence',
    target_type: 'cadence_handoff',
    target_id: deal_id,
    target_label: `deal ${deal_id} · ${cadence.tier} · role=${role}`,
    field_changed: 'dispatched',
    new_value: JSON.stringify(result),
    reason: reason || 'cadence applied',
  });

  return result;
}

function _handoffFor(role) {
  return ['sdr', 'closer', 'both'].includes(role);
}

/**
 * Reaplica cadência em todos os runs ativos da cadência informada.
 * Usado quando o gestor edita assignee_role e marca "reforçar".
 * Reseta steps_index pra 0, dispara handoff novamente, cria novo task/call do passo 0.
 */
async function reapplyToActiveRuns(pool, cadenceId, { handoff, requested_by } = {}) {
  const r = await pool.query(`SELECT * FROM lead_score_cadence WHERE id = $1`, [cadenceId]);
  const cadence = r.rows[0];
  if (!cadence) return { ok: false, error: 'cadence not found' };
  cadence._handoff = handoff;

  // pega runs ativos dessa cadência (match em 5 colunas)
  const runsR = await pool.query(
    `SELECT * FROM lead_score_cadence_runs
     WHERE status='active'
       AND cadence_tier=$1
       AND COALESCE(cadence_product_type,'')=COALESCE($2::text,'')
       AND COALESCE(cadence_layout,'')      =COALESCE($3::text,'')
       AND COALESCE(cadence_pipeline,'')    =COALESCE($4::text,'')
       AND COALESCE(cadence_stage,'')       =COALESCE($5::text,'')`,
    [cadence.tier, cadence.product_type, cadence.layout, cadence.pipeline, cadence.stage]
  );
  const runs = runsR.rows;

  const results = { total: runs.length, redispatched: 0, errors: 0, details: [] };
  for (const run of runs) {
    try {
      await dispatchHandoff(pool, {
        cadence,
        deal_id: run.deal_id,
        reason: `assignee_role changed → reforce by ${requested_by || 'system'}`,
      });
      results.redispatched++;
      results.details.push({ deal_id: run.deal_id, ok: true });
    } catch (e) {
      results.errors++;
      results.details.push({ deal_id: run.deal_id, error: e.message });
    }
  }
  return { ok: true, ...results };
}

/**
 * Preview da cadência: simula o que aconteceria SEM tocar no Zoho.
 *
 * @param {object} pool
 * @param {object} args
 * @param {string} args.deal_id     se informado, busca o deal real do Zoho
 * @param {object} args.lead_ctx    senão, usa ctx fake passado (testar)
 * @param {string} args.tier        UPPERCASE
 * @param {string} args.product_type
 * @param {string} args.layout, pipeline, stage  opcionais
 *
 * Retorna lista de passos com horário real + validação de Owner.
 */
async function previewCadence(pool, args) {
  const tier = String(args.tier || '').toUpperCase();
  if (!tier) return { ok: false, error: 'tier obrigatório' };

  const cadence = await db.getCadenceForTier(pool, tier,
    args.product_type, args.layout, args.pipeline, args.stage);
  if (!cadence) return { ok: false, error: 'sem cadência ativa pra ' + tier };

  // Override por regra especial (mesmo que applyToDeal faz)
  if (args.force_assignee_role) {
    cadence._original_assignee_role = cadence.assignee_role;
    cadence.assignee_role = args.force_assignee_role;
  }

  const steps = Array.isArray(cadence.steps_json) ? cadence.steps_json
              : (typeof cadence.steps_json === 'string' ? JSON.parse(cadence.steps_json) : []);

  // Pega deal real (se deal_id) pra extrair Owner real
  let dealZoho = null;
  if (args.deal_id) {
    try {
      const z = zoho();
      if (z?.getDeal) dealZoho = await z.getDeal(args.deal_id, 'Deal_Name,Owner,Stage,Pipeline,Layout');
    } catch (_) {}
  }
  const ownerName = dealZoho?.Owner?.name || args.owner_zoho_name || null;

  // Validação de owner (uma vez — vale pra todos passos)
  const ownerValidation = validator.validateOwnerForProduct({
    owner_zoho_name: ownerName,
    product_type: args.product_type,
  });

  const startedAt = new Date();
  const schedule = steps.map((s, i) => {
    const dueAtRaw = stepDueAt(s, startedAt);
    const eff = effectiveDueAt(dueAtRaw);
    const reminded = shouldRemind(s, cadence);
    return {
      step_index: i,
      channel: s.channel,
      label: s.label,
      priority: s.priority,
      is_farewell: !!s.is_farewell,
      due_at_raw: dueAtRaw.toISOString(),
      due_at_effective: eff.dueAt.toISOString(),
      rescheduled_from_past: eff.wasInPast,
      reminded,
      target_module: s.channel === 'call' ? 'Calls' : (s.channel === 'wait' ? '-' : 'Tasks'),
    };
  });

  return {
    ok: true,
    cadence: {
      tier, product_type: args.product_type,
      layout: args.layout, pipeline: args.pipeline, stage: args.stage,
      resolved: {
        tier: cadence.tier,
        product_type: cadence.product_type,
        layout: cadence.layout,
        pipeline: cadence.pipeline,
        stage: cadence.stage,
        match_level: cadence._match_level,
      },
      sla_first_call_minutes: cadence.sla_first_call_minutes,
      max_attempts: cadence.max_attempts,
      assignee_role: cadence.assignee_role,
      original_assignee_role: cadence._original_assignee_role || null,
      remind_default: cadence.remind_default,
      notes: cadence.notes,
    },
    deal: dealZoho ? {
      id: args.deal_id, name: dealZoho.Deal_Name,
      owner: { id: dealZoho.Owner?.id, name: dealZoho.Owner?.name },
      stage: dealZoho.Stage, pipeline: dealZoho.Pipeline, layout: dealZoho.Layout?.name || dealZoho.Layout,
    } : null,
    owner_validation: ownerValidation,
    will_create_in_zoho: ownerValidation.ok && process.env.LEAD_SCORE_CADENCE_DRY_RUN !== '1' && process.env.LEAD_SCORE_CADENCE_DISABLED !== '1',
    env_dry_run: process.env.LEAD_SCORE_CADENCE_DRY_RUN === '1',
    env_disabled: process.env.LEAD_SCORE_CADENCE_DISABLED === '1',
    schedule,
    total_steps: schedule.length,
  };
}

module.exports = {
  DEFAULT_CADENCES,
  seedDefaults,
  applyToDeal,
  progressDue,
  cancelForDeal,
  dispatchHandoff,
  reapplyToActiveRuns,
  previewCadence,
  // helpers (testes)
  _internal: { stepDueAt, effectiveDueAt, formatRemindAt, formatDueDate, shouldRemind },
};
