/**
 * Lead Score — Módulo plugável.
 *
 * Uso no server.js (1 linha):
 *   require('./lib/lead-score').mount(app, { pool: _pgPool });
 *
 * Helpers para outras partes do server / automações:
 *   const ls = require('./lib/lead-score');
 *   await ls.recalc({ deal_id, trigger_event, requested_by, push_zoho:true });
 *   await ls.recalc({ deal_id, lead_ctx: {...}, push_zoho:false });   // dry
 *   await ls.manualOverride({ deal_id, score_manual, tier_manual, reason, actor });
 *   const last = await ls.getLastBreakdown(dealId);
 *
 * Env vars:
 *   DATABASE_URL                connection string Postgres (se pool não passado)
 *   LEAD_SCORE_FORCE_RESEED=1   força reaplicar seed sobrescrevendo
 *   TDF_LEAD_SCORE_SVC_KEY      protege POST/PUT/DELETE quando sem session
 */

const db = require('./db');
const engine = require('./engine');
const seed = require('./seed');
const distance = require('./distance');
const zohoSync = require('./zoho-sync');
const cadence = require('./cadence');
const overdueDetector = require('./overdue-detector');
const { buildRouter } = require('./routes');

let _pool = null;
let _ownsPool = false;
let _booted = null;
let _cadenceCron = null;
let _stagePollCron = null;
let _overdueCron = null;
let _handoff = null;
let _notifier = null;

async function _getPool(opts) {
  if (_pool) return _pool;
  if (opts && opts.pool) { _pool = opts.pool; _ownsPool = false; return _pool; }
  if (process.env.DATABASE_URL) {
    const { Pool } = require('pg');
    const conn = process.env.DATABASE_URL;
    _pool = new Pool({
      connectionString: conn,
      ssl: conn.includes('railway.internal') ? false : { rejectUnauthorized: false },
      max: 5,
    });
    _ownsPool = true;
    return _pool;
  }
  throw new Error('[lead-score] sem pool nem DATABASE_URL');
}

/**
 * Recalcula score de um deal e (por default) escreve no Zoho.
 * @param {object} args
 * @param {string} args.deal_id
 * @param {string} [args.trigger_event]   identificador do gatilho
 * @param {string} [args.requested_by]
 * @param {boolean} [args.push_zoho=true]
 * @param {object} [args.lead_ctx]        se passado, NÃO busca no Zoho (modo dry/test)
 * @param {object} [args.extra_ctx]       campos adicionais que enriquecem o ctx do Zoho
 */
async function recalc(args) {
  if (!args || !args.deal_id) throw new Error('deal_id obrigatório');
  const pool = await _getPool();
  const trigger = args.trigger_event || 'manual';
  const requestedBy = args.requested_by || 'system';

  const logRow = await db.logRecalc(pool, {
    deal_id: args.deal_id, trigger_event: trigger, requested_by: requestedBy,
  });

  try {
    // 1) construir lead_ctx
    let ctx;
    let dealName = null;
    if (args.lead_ctx) {
      ctx = { ...args.lead_ctx, ...(args.extra_ctx || {}) };
      dealName = args.lead_ctx.deal_name || null;
    } else {
      const deal = await zohoSync.fetchDealForScoring(args.deal_id);
      if (!deal) {
        await db.markRecalcDone(pool, logRow.id, { status: 'error', error_msg: 'deal_not_found_or_zoho_unavailable' });
        return { ok: false, error: 'deal_not_found_or_zoho_unavailable' };
      }
      ctx = { ...engine.buildCtxFromDeal(deal), ...(args.extra_ctx || {}) };
      dealName = deal.Deal_Name;
      var _currentZoho = { Score_Lead: deal.Score_Lead, Tier_Lead: deal.Tier_Lead };
    }

    // 2) override manual ativo?
    const override = await db.activeManualOverride(pool, args.deal_id);

    // 3) calcular
    const breakdown = await engine.calculate(pool, ctx, { traceMisses: false });

    let scoreFinal = breakdown.score_auto;
    let tierFinal = breakdown.tier_auto;
    if (override) {
      if (override.score_manual != null) scoreFinal = Number(override.score_manual);
      if (override.tier_manual) tierFinal = String(override.tier_manual).toUpperCase();
    }

    // 4) gravar histórico
    const hist = await db.insertHistory(pool, {
      deal_id: args.deal_id,
      deal_name: dealName,
      product_type: breakdown.product_type,
      score_auto: breakdown.score_auto,
      tier_auto: breakdown.tier_auto,
      score_manual: override ? override.score_manual : null,
      tier_manual: override ? override.tier_manual : null,
      score_final: scoreFinal,
      tier_final: tierFinal,
      breakdown,
      lead_ctx: ctx,
      trigger_reason: trigger,
      pushed_to_zoho: false,
    });

    // 5) push pro Zoho (opcional)
    let pushResult = { pushed: false, reason: 'not_attempted', updated_fields: [] };
    if (args.push_zoho !== false && !args.lead_ctx) {
      pushResult = await zohoSync.pushScoreToZoho({
        deal_id: args.deal_id,
        score: scoreFinal,
        tier: tierFinal,
        current: typeof _currentZoho !== 'undefined' ? _currentZoho : undefined,
      });
      if (pushResult.pushed) {
        await pool.query(
          `UPDATE lead_score_history SET pushed_to_zoho = TRUE WHERE id = $1`,
          [hist.id]
        );
      } else if (pushResult.reason === 'zoho_error') {
        await pool.query(
          `UPDATE lead_score_history SET zoho_push_error = $2 WHERE id = $1`,
          [hist.id, pushResult.error || pushResult.reason]
        );
      }
    }

    await db.markRecalcDone(pool, logRow.id, { status: 'done', history_id: hist.id });

    // === UPGRADE NOTIFY: Bronze/Pedra → Prata/Ouro/Diamante (Núbia qualificou) ===
    try {
      const r = await pool.query(
        `SELECT tier_final FROM lead_score_history WHERE deal_id = $1 AND id <> $2 ORDER BY calculated_at DESC LIMIT 1`,
        [String(args.deal_id), hist.id]
      );
      const prevTier = r.rows[0]?.tier_final || null;
      const lowTiers = ['BRONZE', 'PEDRA'];
      const highTiers = ['DIAMANTE', 'OURO', 'PRATA'];
      if (prevTier && lowTiers.includes(prevTier) && highTiers.includes(tierFinal)) {
        const upgradeMsgCloser = `🔥 *Lead qualificado pela Núbia!*\n\nDeal: ${dealName || args.deal_id}\nID: ${args.deal_id}\nMudou de *${prevTier}* → *${tierFinal}*\nProduto: ${breakdown.product_type}\n\nNúbia conseguiu gerar urgência. Agora é com você — atenda RÁPIDO.`;
        const upgradeMsgGestor = `🔥 Núbia upgraded: ${dealName||args.deal_id} ${prevTier}→${tierFinal} (produto ${breakdown.product_type}) — assign pro closer correto`;

        // Re-atribui closer correto via handoff
        let assignedCloser = null;
        if (_handoff?.assignCloser) {
          try {
            assignedCloser = await _handoff.assignCloser({
              deal_id: args.deal_id,
              product_type: breakdown.product_type,
              current_owner_name: ctx._owner_name,
            });
          } catch (_) {}
        }
        // Notifica closer e gestor
        if (_notifier) {
          if (assignedCloser && _notifier.zapiSend) {
            try { await _notifier.zapiSend({ ownerName: assignedCloser, message: upgradeMsgCloser }); } catch(_){}
          }
          if (_notifier.cliqAlert) {
            try { await _notifier.cliqAlert({ message: upgradeMsgGestor }); } catch(_){}
          }
          if (_notifier.createNote) {
            try {
              await _notifier.createNote({
                dealId: args.deal_id,
                title: `🔥 Tier upgraded by Núbia: ${prevTier}→${tierFinal}`,
                content: `Lead qualificado pela Núbia. Score subiu de ${prevTier} pra ${tierFinal}.\nProduto: ${breakdown.product_type}\nCloser atribuído: ${assignedCloser || '(round-robin pendente)'}\nDetectado em ${new Date().toLocaleString('pt-BR')}`,
              });
            } catch(_){}
          }
        }
        await db.insertAudit(pool, {
          actor: 'lead-score-upgrade-notify',
          target_type: 'tier_upgraded_by_nubia',
          target_id: args.deal_id,
          target_label: `${dealName||args.deal_id} ${prevTier} → ${tierFinal}`,
          field_changed: 'tier',
          old_value: prevTier, new_value: tierFinal,
          reason: 'Núbia conseguiu qualificar lead — passa pro closer',
          metadata: { product: breakdown.product_type, score_auto: breakdown.score_auto, assigned_closer: assignedCloser },
        });
      }
    } catch (e) {
      console.warn('[lead-score upgrade-notify]', e.message);
    }

    // 6) aplica cadência do tier × produto (cria task Zoho do passo 0 + handoff)
    let cadenceResult = { ok: false, reason: 'skipped' };
    if (args.apply_cadence !== false && !args.lead_ctx) {
      try {
        // contexto extra pra handoff (Núbia/closer)
        const dealForHandoff = typeof _currentZoho !== 'undefined' && _currentZoho ? {
          id: args.deal_id,
          Deal_Name: dealName,
          Telefone_contato: ctx.telefone_contato || null,
          Owner: ctx._owner_name || null,
        } : null;
        // Special rule: needs_qualif_before_closer → força Núbia atender mesmo em tier alto
        const needsQualif = (breakdown.special_rules_applied || []).some(r => r.rule === 'needs_qualif_before_closer');
        const forceRole = needsQualif ? 'sdr' : null;

        cadenceResult = await cadence.applyToDeal(pool, {
          deal_id: args.deal_id,
          tier: tierFinal,
          product_type: breakdown.product_type || null,
          layout: ctx._layout || null,
          pipeline: ctx._pipeline || null,
          stage: ctx._stage || null,
          force_assignee_role: forceRole,
          deal_name: dealName,
          requested_by: requestedBy,
          create_zoho_task: args.create_zoho_task !== false,
          reason: `recalc trigger=${trigger}`,
          // adapter de handoff (injetado no mount)
          handoff: _handoff,
          deal_context: dealForHandoff,
        });
      } catch (e) {
        cadenceResult = { ok: false, error: e.message };
      }
    }

    return {
      ok: true,
      deal_id: args.deal_id,
      score_final: scoreFinal,
      tier_final: tierFinal,
      score_auto: breakdown.score_auto,
      tier_auto: breakdown.tier_auto,
      manual_override_applied: !!override,
      pushed_to_zoho: pushResult.pushed,
      zoho_push: pushResult,
      cadence: cadenceResult,
      breakdown_summary: {
        product_type: breakdown.product_type,
        hits: breakdown.hits.length,
        special_rules_applied: breakdown.special_rules_applied.length,
        adjustments: breakdown.adjustments.length,
        distance_km: breakdown.distance?.km,
      },
      history_id: hist.id,
    };
  } catch (e) {
    await db.markRecalcDone(pool, logRow.id, { status: 'error', error_msg: e.message });
    throw e;
  }
}

async function manualOverride(args) {
  const pool = await _getPool();
  if (!args.actor) throw new Error('actor obrigatório');
  if (!args.deal_id) throw new Error('deal_id obrigatório');
  if (!args.reason || String(args.reason).trim().length < 3) throw new Error('reason obrigatório');

  const saved = await db.insertManualOverride(pool, args);
  await db.insertAudit(pool, {
    actor: args.actor, target_type: 'manual_override', target_id: args.deal_id,
    target_label: 'override deal ' + args.deal_id,
    field_changed: 'score_or_tier_manual',
    new_value: JSON.stringify({ score: saved.score_manual, tier: saved.tier_manual }),
    reason: saved.reason,
  });

  // recalcula imediatamente pra refletir override
  if (args.recalc_now !== false) {
    try {
      await recalc({
        deal_id: args.deal_id,
        trigger_event: 'manual_override_applied',
        requested_by: args.actor,
        push_zoho: args.push_zoho !== false,
      });
    } catch (e) {
      console.warn('[lead-score] manualOverride recalc falhou:', e.message);
    }
  }
  return saved;
}

async function getLastBreakdown(dealId) {
  const pool = await _getPool();
  return db.lastHistoryForDeal(pool, dealId);
}

async function getCurrentTier(dealId) {
  const last = await getLastBreakdown(dealId);
  return last ? { score: last.score_final, tier: last.tier_final, calculated_at: last.calculated_at } : null;
}

/**
 * Trigger leve para chamar em hooks do server (não bloqueante).
 * Faz fire-and-forget — o caller não precisa aguardar.
 */
function triggerRecalc(dealId, triggerEvent, extra = {}) {
  if (!dealId) return;
  setImmediate(async () => {
    try {
      await recalc({
        deal_id: dealId,
        trigger_event: triggerEvent || 'auto',
        requested_by: extra.requested_by || 'auto',
        push_zoho: extra.push_zoho !== false,
        extra_ctx: extra.extra_ctx,
      });
    } catch (e) {
      console.warn(`[lead-score] triggerRecalc(${dealId},${triggerEvent}) erro:`, e.message);
    }
  });
}

/* ============================== MOUNT ============================== */

async function mount(app, opts = {}) {
  if (!app) throw new Error('[lead-score] app Express obrigatório');

  // Adapter de handoff: server.js injeta funções pra Núbia e closer round-robin
  // Sem adapter, cadência continua criando task/call mas não dispara handoff.
  _handoff = opts.handoff || null;

  // Adapter de notificação pra overdue-detector (Z-API, Cliq, Note Zoho)
  if (opts.notifier) {
    _notifier = opts.notifier;
    overdueDetector.setNotifier(opts.notifier);
  }

  _booted = (async () => {
    try {
      const pool = await _getPool(opts);
      await db.ensureSchema(pool);

      // applySeed sempre — idempotente, respeita edições manuais
      const r = await seed.applySeed(pool);
      console.log(`[lead-score] seed: critérios=${r.critUpserted} faixas=${r.bandUpserted} settings=${r.settingsUpserted} cidades=${r.citiesUpserted}`);

      // seed cadências default (idempotente)
      const cadCount = await cadence.seedDefaults(pool);
      if (cadCount > 0) console.log(`[lead-score] cadências seed: ${cadCount} tiers`);

      // cron de progresso de cadência a cada 1min (passos vencidos criam task no instante)
      const cadenceIntervalMs = Number(opts.cadenceIntervalMs || 60 * 1000);
      if (cadenceIntervalMs > 0 && !_cadenceCron) {
        _cadenceCron = setInterval(async () => {
          try {
            const out = await cadence.progressDue(pool, { limit: 50 });
            if (out.advanced > 0 || out.completed > 0 || out.errors > 0) {
              console.log(`[lead-score cadence] processed=${out.processed} advanced=${out.advanced} completed=${out.completed} errors=${out.errors}`);
            }
          } catch (e) { console.error('[lead-score cadence cron]', e.message); }
        }, cadenceIntervalMs);
        if (_cadenceCron.unref) _cadenceCron.unref();
      }

      // cron de polling de Stage no Zoho a cada 5min (default)
      const stagePollIntervalMs = Number(opts.stagePollIntervalMs || 5 * 60 * 1000);
      if (stagePollIntervalMs > 0 && !_stagePollCron) {
        _stagePollCron = setInterval(async () => {
          try {
            const out = await pollStageChanges();
            if (out.stage_changes_detected > 0) {
              console.log(`[lead-score stage-poll] deals=${out.deals_seen} changes=${out.stage_changes_detected} dispatched=${out.recalc_dispatched}`);
            }
          } catch (e) { console.error('[lead-score stage-poll cron]', e.message); }
        }, stagePollIntervalMs);
        if (_stagePollCron.unref) _stagePollCron.unref();
      }

      // cron de detecção de atrasos a cada 30min
      const overdueIntervalMs = Number(opts.overdueIntervalMs || 30 * 60 * 1000);
      if (overdueIntervalMs > 0 && !_overdueCron) {
        _overdueCron = setInterval(async () => {
          try {
            const out = await overdueDetector.detectAndAlert(pool);
            if (out.detected > 0) {
              console.log(`[lead-score overdue] detected=${out.detected} to_alert=${out.to_alert} owners=${out.owners} sent=${out.sent}`);
            }
          } catch (e) { console.error('[lead-score overdue cron]', e.message); }
        }, overdueIntervalMs);
        if (_overdueCron.unref) _overdueCron.unref();
      }
    } catch (e) {
      console.error('[lead-score] erro no boot:', e.message);
    }
  })();

  const getPool = async () => {
    await _booted;
    if (!_pool) throw new Error('[lead-score] pool não inicializado');
    return _pool;
  };

  const router = buildRouter(getPool, recalc);
  app.use(router);

  console.log('[lead-score] módulo montado em /admin/score-leads + /api/lead-score/*');
  return _booted;
}

function _getHandoff() { return _handoff; }

/**
 * Polling de mudanças de Stage no Zoho. Cron 5min:
 *   1. Busca deals com Modified_Time nos últimos 6min.
 *   2. Pra cada, compara Stage atual com último lead_score_history.
 *   3. Se mudou, dispara triggerRecalc('stage_changed').
 *
 * Não recalcula deals sem history (evita disparar em deals antigos
 * que nunca passaram pelo lead-score — esses só recalculam quando
 * outro trigger explícito acontece).
 */
async function pollStageChanges() {
  const pool = await _getPool();
  let zoho;
  try { zoho = require('../zoho'); } catch (e) { return { ok: false, error: 'zoho_lib_unavailable' }; }
  if (!zoho || !zoho.search) return { ok: false, error: 'zoho.search indisponível' };

  // janela: últimos 6 minutos (1 min a mais que o intervalo do cron pra cobrir overlap)
  const now = new Date();
  const from = new Date(now.getTime() - 6 * 60_000);
  const toIso = (d) => {
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}-03:00`;
  };
  const criteria = `(Modified_Time:between:${toIso(from)},${toIso(now)})`;

  let deals = [];
  try {
    deals = await zoho.search(criteria, 'Deal_Name,Stage,Pipeline,Layout', 50, 1);
  } catch (e) {
    return { ok: false, error: 'zoho_search_failed: ' + e.message };
  }

  let detected = 0, dispatched = 0, skipped = 0, no_history = 0;
  for (const d of deals) {
    if (!d.id || !d.Stage) { skipped++; continue; }
    const hist = await db.lastHistoryForDeal(pool, d.id);
    if (!hist) { no_history++; continue; }
    const ctx = typeof hist.lead_ctx_json === 'string' ? JSON.parse(hist.lead_ctx_json) : (hist.lead_ctx_json || {});
    const prevStage = ctx?._stage || null;
    if (prevStage !== d.Stage) {
      detected++;
      try {
        triggerRecalc(d.id, 'stage_changed', {
          requested_by: 'stage-poll',
          extra_ctx: { _stage: d.Stage },
        });
        dispatched++;
      } catch (_) {}
    }
  }
  return { ok: true, deals_seen: deals.length, stage_changes_detected: detected, recalc_dispatched: dispatched, skipped, no_history };
}

module.exports = {
  mount,
  recalc,
  manualOverride,
  triggerRecalc,
  getLastBreakdown,
  getCurrentTier,
  // cadência
  cadence,
  pollStageChanges,
  overdueDetector,
  _getHandoff,
  // re-exports pra testes/automações
  db, engine, seed, distance, zohoSync,
};
