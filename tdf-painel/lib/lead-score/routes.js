/**
 * Lead Score — Rotas REST + EJS.
 * Monta tudo em um Router e devolve. O index.js injeta no app principal.
 */

const express = require('express');
const db = require('./db');
const engine = require('./engine');
const seed = require('./seed');
const distance = require('./distance');
const zohoSync = require('./zoho-sync');
const cadence = require('./cadence');
const tests = require('./tests');

function reqActor(req) {
  return (req.session && req.session.user && req.session.user.name) || 'system';
}

function reqAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  const svc = req.get('x-tdf-svc-key');
  if (svc && process.env.TDF_LEAD_SCORE_SVC_KEY && svc === process.env.TDF_LEAD_SCORE_SVC_KEY) return next();
  if (!process.env.TDF_LEAD_SCORE_SVC_KEY && req.method === 'GET') return next();
  return res.status(401).json({ error: 'unauthorized' });
}

function buildRouter(getPool, recalcFn) {
  const router = express.Router();
  router.use(express.json({ limit: '2mb' }));

  /* ============================== EJS Pages ============================== */

  const pages = [
    ['/admin/score-leads', 'admin-score-leads', 'Score de Leads — Critérios'],
    ['/admin/score-leads/distancia', 'admin-score-leads-distancia', 'Score de Leads — Distância'],
    ['/admin/score-leads/cadencia', 'admin-score-leads-cadencia', 'Score de Leads — Cadência por Tier'],
    ['/admin/score-leads/atrasos', 'admin-score-leads-atrasos', 'Score de Leads — Tarefas Atrasadas'],
    ['/admin/score-leads/redistribuir', 'admin-score-leads-redistribuir', 'Score de Leads — Redistribuir Leads Parados'],
    ['/admin/score-leads/distribuicao', 'admin-score-leads-distribuicao', 'Score de Leads — Painel de Distribuição'],
    ['/admin/score-leads/auditoria-atividades', 'admin-score-leads-auditoria-atividades', 'Score de Leads — Auditoria de Atividades Zoho'],
    ['/admin/score-leads/auditoria', 'admin-score-leads-auditoria', 'Score de Leads — Auditoria'],
    ['/admin/score-leads/teste', 'admin-score-leads-teste', 'Score de Leads — Testar Lead'],
    ['/admin/score-leads/overrides', 'admin-score-leads-overrides', 'Score de Leads — Overrides Manuais'],
  ];
  for (const [path, view, title] of pages) {
    router.get(path, (req, res) => {
      res.render(view, {
        user: req.session?.user || { name: 'guest', role: 'admin' },
        activePage: 'admin-score-leads',
        pageTitle: title,
      });
    });
  }

  /* ============================== CRITÉRIOS ============================== */

  router.get('/api/lead-score/criteria', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const rows = await db.listCriteria(pool, {
        productType: req.query.product_type,
        includeInactive: req.query.include_inactive === '1' || req.query.include_inactive === 'true'
      });
      res.json({ ok: true, items: rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/criteria', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const before = req.body.id ? await db.getCriterion(pool, req.body.id) : null;
      const saved = await db.upsertCriterion(pool, req.body, actor);
      await db.insertAudit(pool, {
        actor, target_type: 'criterion', target_id: saved.id,
        target_label: saved.name,
        field_changed: before ? 'multi' : 'created',
        old_value: before ? JSON.stringify({ points: before.points, is_active: before.is_active }) : null,
        new_value: JSON.stringify({ points: saved.points, is_active: saved.is_active }),
        reason: req.body.reason || null,
      });
      res.json({ ok: true, item: saved });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.put('/api/lead-score/criteria/:id', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const before = await db.getCriterion(pool, req.params.id);
      if (!before) return res.status(404).json({ ok: false, error: 'not_found' });
      const saved = await db.upsertCriterion(pool, { ...req.body, id: Number(req.params.id), code: req.body.code || before.code }, actor);
      const diff = {};
      for (const k of ['points', 'is_active', 'priority', 'accumulable', 'group_cap', 'name', 'description']) {
        if (String(before[k]) !== String(saved[k])) diff[k] = { from: before[k], to: saved[k] };
      }
      if (Object.keys(diff).length) {
        await db.insertAudit(pool, {
          actor, target_type: 'criterion', target_id: saved.id,
          target_label: saved.name, field_changed: Object.keys(diff).join(','),
          old_value: JSON.stringify(Object.fromEntries(Object.entries(diff).map(([k, v]) => [k, v.from]))),
          new_value: JSON.stringify(Object.fromEntries(Object.entries(diff).map(([k, v]) => [k, v.to]))),
          reason: req.body.reason || null,
        });
      }
      res.json({ ok: true, item: saved, diff });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.delete('/api/lead-score/criteria/:id', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const before = await db.getCriterion(pool, req.params.id);
      if (!before) return res.status(404).json({ ok: false, error: 'not_found' });
      await db.deleteCriterion(pool, req.params.id);
      await db.insertAudit(pool, {
        actor, target_type: 'criterion', target_id: req.params.id,
        target_label: before.name, field_changed: 'deleted',
        old_value: JSON.stringify({ code: before.code, points: before.points }),
        new_value: null, reason: req.query.reason || null,
      });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== FAIXAS DE DISTÂNCIA ============================== */

  router.get('/api/lead-score/distance-bands', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const rows = await db.listDistanceBands(pool, {
        productType: req.query.product_type,
        includeInactive: req.query.include_inactive === '1'
      });
      res.json({ ok: true, items: rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/distance-bands', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const saved = await db.upsertDistanceBand(pool, req.body, actor);
      await db.insertAudit(pool, {
        actor, target_type: 'distance_band', target_id: saved.id,
        target_label: `${saved.product_type}/${saved.code}`,
        field_changed: 'upsert',
        new_value: JSON.stringify({ points: saved.points, min: saved.min_km, max: saved.max_km, active: saved.is_active }),
        reason: req.body.reason || null,
      });
      distance.clearCache();
      res.json({ ok: true, item: saved });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.delete('/api/lead-score/distance-bands/:id', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      await db.deleteDistanceBand(pool, req.params.id);
      await db.insertAudit(pool, {
        actor: reqActor(req), target_type: 'distance_band', target_id: req.params.id,
        field_changed: 'deleted', reason: req.query.reason || null,
      });
      distance.clearCache();
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== CIDADES ============================== */

  router.get('/api/lead-score/cities', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const rows = await db.listCities(pool, { q: req.query.q, limit: Number(req.query.limit) || 200 });
      res.json({ ok: true, items: rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/cities', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const body = req.body || {};
      if (!body.cidade_display) return res.status(400).json({ ok: false, error: 'cidade_display obrigatório' });
      const norm = distance.normalize(body.cidade_normalizada || body.cidade_display);
      const saved = await db.upsertCity(pool, {
        cidade_normalizada: norm,
        cidade_display: body.cidade_display,
        uf: body.uf,
        distance_km_sjc: body.distance_km_sjc,
        aliases: body.aliases || [],
      });
      await db.insertAudit(pool, {
        actor: reqActor(req), target_type: 'city', target_id: saved.id,
        target_label: saved.cidade_display, field_changed: 'upsert',
        new_value: JSON.stringify({ km: saved.distance_km_sjc, uf: saved.uf }),
      });
      distance.clearCache();
      res.json({ ok: true, item: saved });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/lead-score/cities/lookup', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const dist = await distance.getDistanceKm(pool, req.query.q || '');
      res.json({ ok: true, found: !!dist, distance: dist });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== SETTINGS ============================== */

  router.get('/api/lead-score/settings', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const rows = await db.listSettings(pool);
      res.json({ ok: true, items: rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.put('/api/lead-score/settings/:key', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const before = await db.getSetting(pool, req.params.key);
      const saved = await db.setSetting(pool, req.params.key, req.body.value, req.body.description, actor);
      await db.insertAudit(pool, {
        actor, target_type: 'setting', target_id: req.params.key,
        target_label: req.params.key, field_changed: 'value',
        old_value: before != null ? JSON.stringify(before) : null,
        new_value: JSON.stringify(req.body.value),
        reason: req.body.reason || null,
      });
      res.json({ ok: true, item: saved });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== AUDITORIA ============================== */

  router.get('/api/lead-score/audit', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const rows = await db.listAudit(pool, {
        limit: Number(req.query.limit) || 100,
        actor: req.query.actor,
        target_type: req.query.target_type,
      });
      res.json({ ok: true, items: rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== BREAKDOWN / HISTORY ============================== */

  router.get('/api/lead-score/breakdown/:dealId', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const last = await db.lastHistoryForDeal(pool, req.params.dealId);
      const history = await db.historyForDeal(pool, req.params.dealId, 10);
      const override = await db.activeManualOverride(pool, req.params.dealId);
      res.json({ ok: true, last, history, manual_override: override });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== RECALC ============================== */

  router.post('/api/lead-score/recalc/test', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const breakdown = await engine.calculate(pool, req.body.lead_ctx || {}, { traceMisses: !!req.body.trace_misses });
      res.json({ ok: true, breakdown });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/recalc/:dealId', reqAuth, async (req, res) => {
    if (typeof recalcFn !== 'function') return res.status(500).json({ ok: false, error: 'recalc não montado' });
    try {
      const result = await recalcFn({
        deal_id: req.params.dealId,
        trigger_event: req.body.trigger_event || 'manual',
        requested_by: reqActor(req),
        push_zoho: req.body.push_zoho !== false,
        extra_ctx: req.body.extra_ctx || {},
      });
      res.json({ ok: true, result });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== MANUAL OVERRIDES ============================== */

  router.post('/api/lead-score/manual-override', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const saved = await db.insertManualOverride(pool, { ...req.body, actor });
      await db.insertAudit(pool, {
        actor, target_type: 'manual_override', target_id: req.body.deal_id,
        target_label: 'override deal ' + req.body.deal_id,
        field_changed: 'score_or_tier_manual',
        new_value: JSON.stringify({ score: saved.score_manual, tier: saved.tier_manual }),
        reason: saved.reason,
      });
      res.json({ ok: true, item: saved });
    } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
  });

  router.delete('/api/lead-score/manual-override/:dealId', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      await db.clearManualOverride(pool, req.params.dealId, reqActor(req), req.query.reason);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/lead-score/manual-overrides', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const rows = await db.listManualOverrides(pool, { limit: Number(req.query.limit) || 100 });
      res.json({ ok: true, items: rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== RESEED ============================== */

  router.post('/api/lead-score/reseed', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const result = await seed.applySeed(pool, { force: !!req.body.force });
      await db.insertAudit(pool, {
        actor: reqActor(req), target_type: 'seed', field_changed: 'applied',
        new_value: JSON.stringify(result),
        reason: req.body.reason || 'manual reseed',
      });
      res.json({ ok: true, result });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== CADÊNCIA ============================== */

  router.get('/api/lead-score/cadences', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      // __ALL__ devolve todas (fallback + específicas). Default: só com filtros casando exato.
      const product = req.query.product;
      const layout = req.query.layout;
      const pipeline = req.query.pipeline;
      const stage = req.query.stage;
      let opts = {};
      if (product === '__ALL__') {
        opts = {}; // todos os registros
      } else {
        // converte vazio em FALLBACK semântico (somente NULL)
        opts = {
          productType: product === '' || product == null ? 'FALLBACK' : product,
          layout: layout === '' || layout == null ? null : layout,
          pipeline: pipeline === '' || pipeline == null ? null : pipeline,
          stage: stage === '' || stage == null ? null : stage,
        };
      }
      const items = await db.listCadences(pool, opts);
      res.json({ ok: true, items });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.put('/api/lead-score/cadences/:tier', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const tier = String(req.params.tier).toUpperCase();
      const productType = req.body.product_type || null;
      const layout = req.body.layout || null;
      const pipeline = req.body.pipeline || null;
      const stage = req.body.stage || null;
      const before = await db.getCadenceForTier(pool, tier, productType, layout, pipeline, stage);
      const saved = await db.upsertCadence(pool, {
        ...req.body, tier,
        product_type: productType, layout, pipeline, stage,
        assignee_pool: req.body.assignee_pool || null,
      }, actor);
      const labelParts = [tier];
      if (productType) labelParts.push('prod:'+productType);
      if (layout) labelParts.push('layout:'+layout);
      if (pipeline) labelParts.push('funil:'+pipeline);
      if (stage) labelParts.push('stage:'+stage);
      if (!productType && !layout && !pipeline && !stage) labelParts.push('(fallback)');
      await db.insertAudit(pool, {
        actor, target_type: 'cadence', target_id: saved.id,
        target_label: labelParts.join(' · '),
        field_changed: before ? 'multi' : 'created',
        old_value: before ? JSON.stringify({ sla: before.sla_first_call_minutes, max: before.max_attempts, role: before.assignee_role, steps_n: (before.steps_json||[]).length, remind: before.remind_default }) : null,
        new_value: JSON.stringify({ sla: saved.sla_first_call_minutes, max: saved.max_attempts, role: saved.assignee_role, steps_n: (saved.steps_json||[]).length, remind: saved.remind_default }),
        reason: req.body.reason || null,
      });

      // Mudou assignee_role? Reforça runs ativos (escolha Paulo: "reforça em todos")
      let reapplyResult = null;
      if (before && before.assignee_role !== saved.assignee_role) {
        try {
          const handoff = require('./index')._getHandoff();
          reapplyResult = await cadence.reapplyToActiveRuns(pool, saved.id, {
            handoff, requested_by: actor,
          });
        } catch (e) {
          reapplyResult = { ok: false, error: e.message };
        }
      }

      res.json({ ok: true, item: saved, reapply: reapplyResult });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.delete('/api/lead-score/cadences/:id', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      await db.deleteCadence(pool, req.params.id);
      await db.insertAudit(pool, {
        actor, target_type: 'cadence', target_id: req.params.id, field_changed: 'deleted',
        reason: req.query.reason || 'manual delete',
      });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/lead-score/cadence-runs', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const items = await db.listCadenceRuns(pool, { status: req.query.status || 'active', limit: Number(req.query.limit) || 200 });
      res.json({ ok: true, items });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.delete('/api/lead-score/cadence-runs/:dealId', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      await cadence.cancelForDeal(pool, req.params.dealId, req.query.reason || `manual cancel by ${reqActor(req)}`);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/lead-score/overdue', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const det = require('./overdue-detector');
      const items = await det.listOverdueAlerts(pool, { limit: Number(req.query.limit) || 200 });
      // resumo agrupado por owner
      const by_owner = {};
      for (const it of items) {
        const k = it.owner_zoho_name || '(sem owner)';
        if (!by_owner[k]) by_owner[k] = { total: 0, last_alerted_at: null };
        by_owner[k].total++;
        if (!by_owner[k].last_alerted_at || it.alerted_at > by_owner[k].last_alerted_at) {
          by_owner[k].last_alerted_at = it.alerted_at;
        }
      }
      res.json({ ok: true, items, by_owner });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/overdue/run-now', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const det = require('./overdue-detector');
      const out = await det.detectAndAlert(pool, { dryRun: req.body?.dry_run === true });
      res.json(out);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/cadence-preview', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const body = req.body || {};
      // Se deal_id, usa engine.buildCtxFromDeal pra extrair tier/produto
      let args = { ...body };
      if (body.deal_id) {
        const z = require('../zoho');
        const deal = await z.getDeal(body.deal_id, 'Deal_Name,Owner,Stage,Pipeline,Layout,Categoria_do_Produto,Produto_Vendido,Tipo_de_Agua,Tipo_de_Cliente,Cidade,Telefone_contato,Prazo_para_a_Compra,Possui_Analise_de_Agua,Aceita_Analise,Vazao_da_Bomba,Tier_Lead,Score_Lead,Lead_Source,Description');
        if (!deal) return res.json({ ok: false, error: 'deal não encontrado no Zoho' });
        const ctx = engine.buildCtxFromDeal(deal);
        // Calcula breakdown pra pegar tier final (manual override considerado)
        const breakdown = await engine.calculate(pool, ctx);
        args.tier = body.tier || breakdown.tier_auto;
        args.product_type = body.product_type || breakdown.product_type;
        args.layout = body.layout || ctx._layout;
        args.pipeline = body.pipeline || ctx._pipeline;
        args.stage = body.stage || ctx._stage;
        args.owner_zoho_name = deal.Owner?.name || deal.Owner?.email;
        // Force role se needs_qualif
        const needsQualif = (breakdown.special_rules_applied || []).some(r => r.rule === 'needs_qualif_before_closer');
        if (needsQualif) args.force_assignee_role = 'sdr';
        args._breakdown = { score_auto: breakdown.score_auto, tier_auto: breakdown.tier_auto, special_rules: breakdown.special_rules_applied };
      }
      const result = await cadence.previewCadence(pool, args);
      if (args._breakdown) result.score_preview = args._breakdown;
      res.json(result);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/cadence-progress/run-now', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const out = await cadence.progressDue(pool, { limit: Number(req.body?.limit) || 50 });
      res.json({ ok: true, ...out });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/stage-poll/run-now', reqAuth, async (req, res) => {
    try {
      const out = await require('./index').pollStageChanges();
      res.json(out);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === EMERGENCIAL: cancela TODOS os runs ativos (kill-switch) ===
  router.post('/api/lead-score/admin/cancel-all-runs', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const reason = (req.body && req.body.reason) || 'manual admin cancel-all';
      const r = await pool.query(
        `UPDATE lead_score_cadence_runs
         SET status='cancelled', cancelled_reason=$1, completed_at=NOW()
         WHERE status='active'
         RETURNING id, deal_id, cadence_tier`
      , [reason]);
      const cancelled = r.rows;
      // audit em batch
      for (const run of cancelled) {
        await db.insertAudit(pool, {
          actor, target_type: 'cadence_run', target_id: run.id,
          target_label: `deal ${run.deal_id} · ${run.cadence_tier}`,
          field_changed: 'status', old_value: 'active', new_value: 'cancelled',
          reason,
        });
      }
      res.json({ ok: true, cancelled_count: cancelled.length, runs: cancelled.slice(0, 50) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === LEADS PARADOS: detectar e redistribuir ===
  router.get('/api/lead-score/stuck-leads', reqAuth, async (req, res) => {
    try {
      const stuck = require('./stuck-leads');
      const zoho = require('../zoho');
      const out = await stuck.detectStuck(zoho, {
        daysUteis: Number(req.query.days) || 3,
        limit: Number(req.query.limit) || 300,
      });
      res.json(out);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/redistribute/:dealId', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const stuck = require('./stuck-leads');
      const zoho = require('../zoho');
      const out = await stuck.redistributeDeal(pool, zoho, {
        dealId: req.params.dealId,
        newOwnerUsername: req.body?.new_owner,
        reason: req.body?.reason,
        actor: reqActor(req),
      });
      res.json(out);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === LISTA closers ativos pra UI da cadência ===
  router.get('/api/lead-score/closers', reqAuth, async (req, res) => {
    try {
      const validator = require('./owner-validator');
      const USERS = validator.getUsersTable();
      const closers = Object.entries(USERS)
        .filter(([_, u]) => !u.desligado && (u.role === 'closer' || u.role === 'posvenda'))
        .map(([username, u]) => ({
          username,
          name: u.name,
          crmOwner: u.crmOwner,
          team: u.team,
          role: u.role,
          permissoes: validator.permsForUser(u),
        }));
      res.json({ ok: true, items: closers });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === ATIVIDADE: lista bruta do audit dedicado ===
  router.get('/api/lead-score/activity-audit', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const items = await db.listActivityAudit(pool, {
        limit: Number(req.query.limit) || 200,
        status: req.query.status,
        deal_id: req.query.deal_id,
        dryRunOnly: req.query.dry_run === '1',
      });
      res.json({ ok: true, items });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/lead-score/activity-audit/wrong-owner', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const items = await db.listWrongOwnerActivities(pool, { limit: Number(req.query.limit) || 200 });
      // resumo por status
      const by_status = {};
      for (const it of items) by_status[it.status] = (by_status[it.status] || 0) + 1;
      res.json({ ok: true, total: items.length, by_status, items: items.slice(0, 100) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === DETECTOR: Task/Call em closer diferente do Owner do deal ===
  router.get('/api/lead-score/admin/owner-mismatch', reqAuth, async (req, res) => {
    try {
      const cleanup = require('./cleanup');
      const zoho = require('../zoho');
      const out = await cleanup.detectOwnerMismatch(zoho, {
        limit_deal_fetch: Number(req.query.limit) || 500,
      });
      // Não devolve full_mismatches em GET pra economizar payload
      if (out.full_mismatches) delete out.full_mismatches;
      res.json(out);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/lead-score/admin/fix-owner-mismatch', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const cleanup = require('./cleanup');
      const zoho = require('../zoho');
      const out = await cleanup.fixOwnerMismatch(pool, zoho, {
        dry_run: req.body?.dry_run === true,
        mode: req.body?.mode || 'transfer',   // 'transfer' (default) ou 'cancel'
      });
      res.json(out);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === DEDUP: deletar tasks duplicadas em deals (mantém mais recente) ===
  // POST /api/lead-score/admin/dedup-deal-tasks
  // Body: { dry_run: true, since_days: 30, max_pages: 100 }
  router.post('/api/lead-score/admin/dedup-deal-tasks', reqAuth, async (req, res) => {
    try {
      const z = require('../zoho');
      const dryRun = req.body?.dry_run !== false; // default true
      const sinceDays = Number(req.body?.since_days) || 30;
      const maxPages = Number(req.body?.max_pages) || 100;

      const ACTIVE_OWNERS = new Set([
        'guilherme henrique', 'tiago souza', 'júlia souza', 'julia souza',
        'gabriel martins', 'gabriel ferreira', 'italo alexandre',
        'catia americo', 'fabiana terra', 'larissa.p',
        'gabriel moraes', 'morgana',
      ]);
      const CLOSED = new Set(['completed', 'cancelled', 'canceled', 'closed', 'concluído', 'concluido', 'fechada', 'fechado', 'completado']);

      function isOwnerActive(ownerName) {
        if (!ownerName) return false;
        const n = String(ownerName).toLowerCase().trim();
        if (ACTIVE_OWNERS.has(n)) return true;
        const first = n.split(' ')[0];
        for (const a of ACTIVE_OWNERS) if (a.split(' ')[0] === first) return true;
        return false;
      }
      function isOpen(status) {
        if (!status) return true;
        return !CLOSED.has(String(status).toLowerCase().trim());
      }

      const token = await z.getToken();
      if (!token) return res.status(503).json({ ok: false, error: 'zoho indisponível' });
      const since = new Date(Date.now() - sinceDays * 86400000);
      const pad = n => String(n).padStart(2, '0');
      const sinceIso = `${since.getFullYear()}-${pad(since.getMonth()+1)}-${pad(since.getDate())}T00:00:00-03:00`;
      const crit = `(Created_Time:greater_equal:${sinceIso})`;
      let all = [];
      for (let page = 1; page <= maxPages; page++) {
        const url = `${z.BASE}/Tasks/search?criteria=${encodeURIComponent(crit)}&fields=Subject,Status,Owner,What_Id,Created_Time&per_page=200&page=${page}`;
        const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
        if (r.status === 204) break;
        if (!r.ok) break;
        const j = await r.json().catch(() => ({}));
        const data = (j.data || []).filter(t => isOpen(t.Status));
        all = all.concat(data);
        if (!j.data || j.data.length < 200) break;
      }

      const byDeal = new Map();
      let skipNoDeal = 0, skipOwnerInactive = 0;
      for (const t of all) {
        const dealId = t.What_Id?.id;
        if (!dealId) { skipNoDeal++; continue; }
        if (!isOwnerActive(t.Owner?.name)) { skipOwnerInactive++; continue; }
        if (!byDeal.has(dealId)) byDeal.set(dealId, []);
        byDeal.get(dealId).push(t);
      }

      const toDelete = [];
      const sampleReports = [];
      for (const [dealId, list] of byDeal) {
        if (list.length <= 1) continue;
        list.sort((a, b) => new Date(b.Created_Time) - new Date(a.Created_Time));
        const [keep, ...rest] = list;
        toDelete.push(...rest.map(t => t.id));
        if (sampleReports.length < 10) {
          sampleReports.push({
            deal_id: dealId,
            kept: { id: keep.id, subject: keep.Subject?.slice(0,80), owner: keep.Owner?.name, created: keep.Created_Time },
            deleted: rest.map(t => ({ id: t.id, subject: t.Subject?.slice(0,80), owner: t.Owner?.name, created: t.Created_Time })),
          });
        }
      }

      const stats = {
        params: { dry_run: dryRun, since_days: sinceDays, max_pages: maxPages },
        scanned_open_tasks: all.length,
        skip_no_deal: skipNoDeal,
        skip_owner_inactive: skipOwnerInactive,
        deals_with_open_tasks: byDeal.size,
        deals_with_duplicates: sampleReports.length > 0 ? Array.from(byDeal.values()).filter(l => l.length > 1).length : 0,
        tasks_to_delete: toDelete.length,
        sample: sampleReports,
      };

      if (dryRun) return res.json({ ok: true, ...stats });

      let deleted = 0;
      const errors = [];
      for (let i = 0; i < toDelete.length; i += 100) {
        const batch = toDelete.slice(i, i + 100);
        try {
          const r = await fetch(`${z.BASE}/Tasks?ids=${batch.join(',')}&wf_trigger=false`, {
            method: 'DELETE',
            headers: { Authorization: `Zoho-oauthtoken ${token}` },
          });
          const j = await r.json().catch(() => ({}));
          const success = (j.data || []).filter(d => d.status === 'success').length;
          deleted += success;
          if (success < batch.length) errors.push({ batch_start: i, response_summary: j });
          await new Promise(r => setTimeout(r, 300));
        } catch (e) {
          errors.push({ batch_start: i, error: e.message });
        }
      }
      res.json({ ok: true, applied: true, ...stats, deleted, errors });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === SANEAMENTO: limpar tarefas erradas V1 + recriar via V2 ===
  router.post('/api/lead-score/admin/cleanup-bad-tasks', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const cleanup = require('./cleanup');
      const { triggerRecalc } = require('./index');
      const out = await cleanup.cleanupBadActivities(pool, {
        dry_run: req.body?.dry_run === true,
        requeue: req.body?.requeue !== false,  // default true
        triggerRecalc,
        requested_by: reqActor(req),
      });
      res.json(out);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === PAINEL DE DISTRIBUIÇÃO ===
  router.get('/api/lead-score/admin/distribution', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const limit = Number(req.query.limit) || 1000;
      // 1. agrega activity_audit
      const auditR = await pool.query(
        `SELECT * FROM lead_score_activity_audit
         ORDER BY occurred_at DESC LIMIT $1`, [limit]);
      const items = auditR.rows;
      const by_status = {}, by_target = {}, by_owner = {};
      const by_target_dry = {};       // só os DRY_RUN
      const blocked_by_product = {};  // owner × produto
      const not_mapped = {};
      for (const it of items) {
        const s = it.status || '?';
        by_status[s] = (by_status[s] || 0) + 1;
        const tu = it.target_user || '(sem mapping)';
        by_target[tu] = (by_target[tu] || 0) + 1;
        if (s === 'DRY_RUN') by_target_dry[tu] = (by_target_dry[tu] || 0) + 1;
        const own = it.owner_zoho_name || '(sem owner)';
        by_owner[own] = (by_owner[own] || 0) + 1;
        if (s === 'OWNER_INVALIDO_PARA_PRODUTO') {
          const key = `${it.owner_zoho_name || '?'}|${it.product_type || '?'}`;
          blocked_by_product[key] = (blocked_by_product[key] || 0) + 1;
        }
        if (s === 'OWNER_NOT_MAPPED') {
          not_mapped[own] = (not_mapped[own] || 0) + 1;
        }
      }
      // 2. runs ativos
      const runsR = await pool.query(
        `SELECT cadence_tier, cadence_product_type, COUNT(*)::int n
         FROM lead_score_cadence_runs WHERE status='active'
         GROUP BY 1,2 ORDER BY n DESC`);
      const by_tier_runs = {}, by_product_runs = {};
      let total_runs = 0;
      for (const r of runsR.rows) {
        total_runs += r.n;
        by_tier_runs[r.cadence_tier] = (by_tier_runs[r.cadence_tier] || 0) + r.n;
        const p = r.cadence_product_type || '(fallback)';
        by_product_runs[p] = (by_product_runs[p] || 0) + r.n;
      }
      // 3. status atual
      const statusR = await pool.query(
        `SELECT
           (SELECT COUNT(*) FROM lead_score_history WHERE calculated_at > NOW() - INTERVAL '1 hour')::int AS history_last_hour,
           (SELECT COUNT(*) FROM lead_score_activity_audit WHERE occurred_at > NOW() - INTERVAL '1 hour')::int AS audit_last_hour`);
      res.json({
        ok: true,
        env_dry_run: process.env.LEAD_SCORE_CADENCE_DRY_RUN === '1',
        env_disabled: process.env.LEAD_SCORE_CADENCE_DISABLED === '1',
        audit_total_window: items.length,
        runs_active_total: total_runs,
        ...statusR.rows[0],
        by_status, by_target, by_owner, by_target_dry,
        blocked_by_product, not_mapped,
        by_tier_runs, by_product_runs,
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === Redistribui deals com Owner=marketing ou outro nome ===
  router.post('/api/lead-score/admin/redistribute-by-owner', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const actor = reqActor(req);
      const ownerToFix = req.body?.owner_name || 'marketing';
      const dryRun = req.body?.dry_run === true;
      const limit = Number(req.body?.limit) || 200;
      const updateZoho = req.body?.update_zoho !== false;  // default true: muda Owner no Zoho

      const z = require('../zoho');
      const validator = require('./owner-validator');
      const engine = require('./engine');
      const USERS = validator.getUsersTable();

      // Busca deals com Owner.name=marketing em stages ativos
      const stagesAtivos = ['Primeiro Contato','Em Qualificação','Etapa IA','Analise ou vazão','Qualificado','Proposta','Proposta Quente','Proposta Fria','Em Atendimento','Leads Novos','IA sem Contato'];
      const criteria = `(Owner.name:equals:${ownerToFix})and(Stage:in:${stagesAtivos.join(',')})`;
      let deals;
      try {
        deals = await z.search(criteria, 'Deal_Name,Owner,Stage,Pipeline,Layout,Categoria_do_Produto,Produto_Vendido,Tipo_de_Agua,Cidade', 200, 5);
      } catch (e) {
        return res.json({ ok: false, error: 'zoho_search_failed: ' + e.message });
      }
      const slice = (deals || []).slice(0, limit);

      // Pra cada deal, decide closer
      // counters por team
      const counters = { poco: 0, filtro: 0, bebedouro: 0, posvenda: 0 };
      const activeByTeam = { poco: [], filtro: [], bebedouro: [], posvenda: [] };
      for (const [username, u] of Object.entries(USERS)) {
        if ((u.role === 'closer' || u.role === 'posvenda') && !u.desligado) {
          if (activeByTeam[u.team]) activeByTeam[u.team].push(u);
        }
      }

      const plan = [];
      for (const d of slice) {
        const ctx = engine.buildCtxFromDeal(d);
        let team = 'bebedouro';
        const p = (ctx.product_type || '').toUpperCase();
        if (p.includes('POCO') || p.includes('IRON') || p.includes('SCALE')) team = 'poco';
        else if (p.includes('FILTRO_ENTRADA')) team = 'filtro';
        else if (p.includes('BEBEDOURO')) team = 'bebedouro';
        else if (p.includes('REFIL') || p.includes('PURIFICADOR')) team = 'posvenda';
        const pool = activeByTeam[team];
        if (!pool || !pool.length) { plan.push({ deal_id: d.id, name: d.Deal_Name, team, error: 'team_sem_closer_ativo' }); continue; }
        const target = pool[counters[team] % pool.length];
        counters[team]++;
        plan.push({
          deal_id: d.id, name: d.Deal_Name, product_type: ctx.product_type,
          team, target_username: target.username, target_name: target.name,
          new_owner_crm_name: target.crmOwner,
        });
      }

      if (dryRun) {
        return res.json({
          ok: true, dry_run: true,
          total_found: deals.length,
          will_process: plan.length,
          by_team: counters,
          plan_sample: plan.slice(0, 30),
        });
      }

      // Aplica: atualiza Owner no Zoho (se updateZoho) + meta.operadora local
      let applied = 0, errors = 0;
      for (const p of plan) {
        if (p.error) { errors++; continue; }
        // pra atualizar Owner no Zoho precisa do ID do user Zoho — primeiro busca via search
        let zohoUserId = null;
        try {
          // tenta achar pelo crmOwner exato
          const tk = await z.getToken();
          if (tk) {
            const ur = await fetch(`${z.BASE}/users?type=ActiveUsers`, {
              headers: { Authorization: `Zoho-oauthtoken ${tk}` },
            });
            if (ur.ok) {
              const jUsers = await ur.json();
              const usuarios = jUsers.users || [];
              const u = usuarios.find(x =>
                (x.full_name || '').toLowerCase().includes((p.new_owner_crm_name||'').toLowerCase().split(' ')[0])
              );
              zohoUserId = u?.id;
            }
          }
        } catch (_) {}

        if (updateZoho && zohoUserId) {
          try {
            await z.updateDeal(p.deal_id, { Owner: { id: zohoUserId } });
          } catch (e) {
            errors++;
            await db.insertActivityAudit(pool, {
              deal_id: p.deal_id, status: 'REDIST_ERROR',
              block_reason: 'updateDeal Owner falhou: ' + e.message,
              requested_by: actor,
            });
            continue;
          }
        }
        applied++;
        await db.insertActivityAudit(pool, {
          deal_id: p.deal_id, status: 'REDISTRIBUTED_FROM_' + ownerToFix.toUpperCase(),
          owner_zoho_name: p.new_owner_crm_name,
          target_user: p.target_username,
          product_type: p.product_type,
          block_reason: `redistribuído de ${ownerToFix} → ${p.target_username} (team=${p.team})`,
          requested_by: actor,
          metadata: { deal_name: p.name, zoho_user_id: zohoUserId, owner_zoho_updated: !!(updateZoho && zohoUserId) },
        });
      }

      res.json({
        ok: true, dry_run: false,
        total_found: deals.length, processed: plan.length,
        applied, errors,
        by_team: counters,
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === BULK REFRESH: recalcular Score+Tier de TODOS deals dos últimos N dias ===
  router.post('/api/lead-score/admin/bulk-refresh', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const days = Number(req.body?.days) || 5;
      const dryRun = req.body?.dry_run === true;
      const limit = Number(req.body?.limit) || 1000;
      const z = require('../zoho');

      // Busca deals dos últimos N dias
      const since = new Date(Date.now() - days*86400000);
      const pad = n => String(n).padStart(2,'0');
      const sinceIso = `${since.getFullYear()}-${pad(since.getMonth()+1)}-${pad(since.getDate())}T00:00:00-03:00`;
      const criteria = `(Created_Time:greater_than:${sinceIso})`;
      const fields = 'Deal_Name,Stage,Pipeline,Layout,Owner,Lead_Source,Cidade,Tipo_de_Agua,Tipo_de_Cliente,Prazo_para_a_Compra,Possui_Analise_de_Agua,Vazao_da_Bomba,Categoria_do_Produto,Produto_Vendido,Description,Telefone_contato,Score_Lead,Tier_Lead';
      let deals;
      try { deals = await z.search(criteria, fields, 200, 10); }
      catch (e) { return res.json({ ok: false, error: 'zoho_search: '+e.message }); }
      const slice = deals.slice(0, limit);

      const results = {
        ok: true, days, dry_run: dryRun,
        total_deals: deals.length,
        will_process: slice.length,
        updated: 0, unchanged: 0, errors: 0,
        tier_changes: {},
        score_diff_avg: 0,
        sample_updates: [],
      };

      let totalDiff = 0;
      const tierBefore = {}, tierAfter = {};

      const TIER_TO_ZOHO = { DIAMANTE:'Diamante', OURO:'Ouro', PRATA:'Prata', BRONZE:'Bronze', PEDRA:'Pedra' };

      for (const d of slice) {
        try {
          const ctx = engine.buildCtxFromDeal(d);
          const bd = await engine.calculate(pool, ctx);
          const newScore = bd.score_auto;
          const newTier = TIER_TO_ZOHO[bd.tier_auto] || bd.tier_auto;
          const curScore = Number(d.Score_Lead) || 0;
          const curTier = d.Tier_Lead || null;

          const tierKeyBefore = curTier || '(sem)';
          const tierKeyAfter = newTier;
          tierBefore[tierKeyBefore] = (tierBefore[tierKeyBefore] || 0) + 1;
          tierAfter[tierKeyAfter] = (tierAfter[tierKeyAfter] || 0) + 1;
          const tk = `${tierKeyBefore}→${tierKeyAfter}`;
          if (tierKeyBefore !== tierKeyAfter) results.tier_changes[tk] = (results.tier_changes[tk] || 0) + 1;

          if (newScore === curScore && newTier === curTier) {
            results.unchanged++;
            continue;
          }
          totalDiff += (newScore - curScore);

          if (results.sample_updates.length < 20) {
            results.sample_updates.push({
              deal_id: d.id, name: d.Deal_Name,
              source: d.Lead_Source,
              before: { score: curScore, tier: curTier },
              after: { score: newScore, tier: newTier, product: bd.product_type },
              hits: bd.hits.length,
            });
          }

          if (!dryRun) {
            await z.updateDeal(d.id, { Score_Lead: newScore, Tier_Lead: newTier });
            // Audit
            await db.insertAudit(pool, {
              actor: 'bulk-refresh',
              target_type: 'zoho_score_update',
              target_id: d.id,
              target_label: d.Deal_Name || d.id,
              field_changed: 'Score_Lead,Tier_Lead',
              old_value: JSON.stringify({ score: curScore, tier: curTier }),
              new_value: JSON.stringify({ score: newScore, tier: newTier }),
              reason: `bulk refresh ${days}d`,
            });
          }
          results.updated++;
        } catch (e) { results.errors++; }
      }
      results.score_diff_avg = results.updated ? Math.round(totalDiff / results.updated * 10) / 10 : 0;
      results.tier_before_dist = tierBefore;
      results.tier_after_dist = tierAfter;
      res.json(results);
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === LISTAR WORKFLOWS ZOHO (admin) ===
  router.get('/api/lead-score/admin/zoho-workflows', reqAuth, async (req, res) => {
    try {
      const z = require('../zoho');
      const token = await z.getToken();
      if (!token) return res.json({ ok: false, error: 'zoho indisponível' });

      // Workflow rules
      const r = await fetch(`${z.BASE}/settings/rules?module=Deals&per_page=100`, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      });
      const j = await r.json().catch(() => ({}));
      const rules = j.rules || [];

      // Pra cada rule, busca actions
      const detailed = [];
      for (const rule of rules.slice(0, Number(req.query.limit) || 40)) {
        let actions = [];
        try {
          const ar = await fetch(`${z.BASE}/settings/rules/${rule.id}?module=Deals`, {
            headers: { Authorization: `Zoho-oauthtoken ${token}` },
          });
          const aj = await ar.json().catch(() => ({}));
          actions = aj.rules?.[0]?.actions || [];
        } catch (_) {}
        detailed.push({
          id: rule.id,
          name: rule.rule_name || rule.name,
          active: rule.active !== false,
          execute_on: rule.execute_on || rule.trigger,
          modified: rule.modified_time,
          created_by: rule.created_by?.name,
          actions: actions.map(a => ({
            type: a.type || a.action_type,
            name: a.name || a.task_name,
            params: a.task ? { subject: a.task.subject, owner: a.task.owner } : a.email_template,
          })),
        });
      }
      res.json({ ok: true, total: rules.length, rules: detailed });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === ZOHO AUDIT LOG do deal (quem mexeu e quando) ===
  router.get('/api/lead-score/admin/zoho-audit/:dealId', reqAuth, async (req, res) => {
    try {
      const z = require('../zoho');
      const token = await z.getToken();
      if (!token) return res.json({ ok: false, error: 'zoho indisponível' });
      // Audit log do Zoho é restrito — pula se falhar e continua com tasks/calls
      let auditLog = null;
      try {
        const auditUrl = `${z.BASE}/settings/audit_logs?per_page=200&page=1`;
        const r0 = await fetch(auditUrl, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
        if (r0.ok) auditLog = await r0.json().catch(()=>null);
      } catch (_) {}

      // Busca Tasks e Calls do deal
      const tasksR = await fetch(`${z.BASE}/Tasks/search?criteria=(What_Id:equals:${req.params.dealId})&fields=Subject,Status,Due_Date,Owner,Created_Time,Created_By,Modified_By&per_page=50`, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      });
      const tasksJ = await tasksR.json().catch(()=>({}));
      const callsR = await fetch(`${z.BASE}/Calls/search?criteria=(What_Id:equals:${req.params.dealId})&fields=Subject,Call_Status,Owner,Created_Time,Created_By&per_page=50`, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      });
      const callsJ = await callsR.json().catch(()=>({}));

      res.json({
        ok: true,
        deal_id: req.params.dealId,
        audit_log: auditLog,
        tasks: (tasksJ.data || []).map(t => ({
          id: t.id, subject: t.Subject, status: t.Status, due: t.Due_Date,
          owner: t.Owner?.name, created_by: t.Created_By?.name, created: t.Created_Time,
        })),
        calls: (callsJ.data || []).map(c => ({
          id: c.id, subject: c.Subject, status: c.Call_Status,
          owner: c.Owner?.name, created_by: c.Created_By?.name, created: c.Created_Time,
        })),
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === DIAMANTES por closer (últimos N dias) ===
  router.get('/api/lead-score/admin/diamantes-by-owner', reqAuth, async (req, res) => {
    try {
      const days = Number(req.query.days) || 30;
      const z = require('../zoho');
      const since = new Date(Date.now() - days*86400000);
      const pad = n => String(n).padStart(2,'0');
      const sinceIso = `${since.getFullYear()}-${pad(since.getMonth()+1)}-${pad(since.getDate())}T00:00:00-03:00`;
      const criteria = `(Tier_Lead:equals:Diamante)and(Created_Time:greater_than:${sinceIso})`;
      let deals;
      try { deals = await z.search(criteria, 'Deal_Name,Stage,Pipeline,Owner,Categoria_do_Produto,Produto_Vendido,Tipo_de_Agua,Lead_Source,Created_Time,Score_Lead', 200, 5); }
      catch (e) { return res.json({ ok: false, error: 'zoho_search: '+e.message }); }
      const by_owner = {};
      const by_product = {};
      const recent_by_owner = {};
      for (const d of deals) {
        const own = d.Owner?.name || '(sem owner)';
        by_owner[own] = (by_owner[own] || 0) + 1;
        const p = d.Categoria_do_Produto || d.Produto_Vendido || '(sem produto)';
        by_product[p] = (by_product[p] || 0) + 1;
        if (!recent_by_owner[own]) recent_by_owner[own] = [];
        if (recent_by_owner[own].length < 5) {
          recent_by_owner[own].push({
            id: d.id, name: d.Deal_Name, stage: d.Stage, product: p,
            tipo_agua: d.Tipo_de_Agua, source: d.Lead_Source,
            created: d.Created_Time, score: d.Score_Lead,
          });
        }
      }
      // Verifica pools de Diamante por produto (pra ver se julia tá excluída)
      const pool = await getPool();
      const cadR = await pool.query(
        `SELECT product_type, assignee_role, assignee_pool_json
         FROM lead_score_cadence WHERE tier='DIAMANTE'`);
      const pools = cadR.rows.map(r => ({
        product_type: r.product_type || '(fallback)',
        role: r.assignee_role,
        pool: r.assignee_pool_json,
      }));
      res.json({
        ok: true, days, total: deals.length,
        by_owner: Object.fromEntries(Object.entries(by_owner).sort((a,b) => b[1]-a[1])),
        by_product: Object.fromEntries(Object.entries(by_product).sort((a,b) => b[1]-a[1])),
        recent_by_owner,
        diamante_pools: pools,
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === DISTRIBUIÇÃO DE SCORE POR FONTE ===
  router.get('/api/lead-score/admin/source-score-dist', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const source = req.query.source || 'Busca Paga - Facebook Ads';
      const days = Number(req.query.days) || 3;
      const limit = Number(req.query.limit) || 50;
      const z = require('../zoho');
      const since = new Date(Date.now() - days*86400000);
      const pad = n => String(n).padStart(2,'0');
      const sinceIso = `${since.getFullYear()}-${pad(since.getMonth()+1)}-${pad(since.getDate())}T00:00:00-03:00`;
      const criteria = `(Lead_Source:equals:${source})and(Created_Time:greater_than:${sinceIso})`;
      const fields = 'Deal_Name,Stage,Pipeline,Layout,Owner,Cidade,Tipo_de_Agua,Tipo_de_Cliente,Prazo_para_a_Compra,Possui_Analise_de_Agua,Vazao_da_Bomba,Categoria_do_Produto,Produto_Vendido,Telefone_contato,Description,Lead_Source';
      let deals = [];
      try { deals = await z.search(criteria, fields, 100, 3); }
      catch (e) { return res.json({ ok: false, error: 'zoho_search: '+e.message }); }
      const slice = deals.slice(0, limit);
      // Pra cada deal, roda engine
      const samples = [];
      const tier_counts = { DIAMANTE: 0, OURO: 0, PRATA: 0, BRONZE: 0, PEDRA: 0 };
      for (const d of slice) {
        const ctx = engine.buildCtxFromDeal(d);
        let bd;
        try { bd = await engine.calculate(pool, ctx); } catch(_) { continue; }
        tier_counts[bd.tier_auto] = (tier_counts[bd.tier_auto]||0) + 1;
        samples.push({
          id: d.id, name: d.Deal_Name, stage: d.Stage,
          cidade: d.Cidade, tipo_agua: d.Tipo_de_Agua, prazo: d.Prazo_para_a_Compra,
          produto_vendido: d.Produto_Vendido,
          score: bd.score_auto, tier: bd.tier_auto,
          product_type: bd.product_type,
          hits: (bd.hits||[]).map(h => `+${h.applied_points} ${h.code.split('__').slice(-1)[0]}`),
          n_hits: (bd.hits||[]).length,
        });
      }
      samples.sort((a,b) => b.score - a.score);
      res.json({
        ok: true, source, days, total: deals.length, sampled: slice.length,
        tier_counts, top_scores: samples.slice(0, 10), bottom_scores: samples.slice(-10),
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === RUNS de cadência por deal (debug cirúrgico) ===
  router.get('/api/lead-score/admin/deal-runs/:dealId', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const r = await pool.query(
        `SELECT id, cadence_tier, cadence_product_type, cadence_layout, cadence_pipeline, cadence_stage,
                step_index_current, next_action_at, status, last_zoho_task_id, last_task_created_at,
                cancelled_reason, started_at, completed_at, history_json
         FROM lead_score_cadence_runs
         WHERE deal_id = $1
         ORDER BY started_at DESC LIMIT 50`,
        [String(req.params.dealId)]
      );
      const runs = r.rows;
      const active = runs.filter(r => r.status === 'active');
      // Atividades audit do mesmo deal
      const audit = await db.listActivityAudit(pool, { deal_id: String(req.params.dealId), limit: 50 });
      res.json({
        ok: true,
        deal_id: req.params.dealId,
        total_runs: runs.length,
        active_runs: active.length,
        is_duplicated: active.length > 1,
        runs: runs.map(r => ({
          id: r.id, status: r.status,
          cadence: [r.cadence_tier, r.cadence_product_type, r.cadence_layout, r.cadence_pipeline, r.cadence_stage].filter(Boolean).join(' × '),
          step_idx: r.step_index_current,
          started_at: r.started_at,
          completed_at: r.completed_at,
          next_action_at: r.next_action_at,
          cancelled_reason: r.cancelled_reason,
          last_zoho_task_id: r.last_zoho_task_id,
          history_steps: Array.isArray(r.history_json) ? r.history_json.length : 0,
        })),
        activity_audit_recent: audit.slice(0, 20).map(a => ({
          when: a.occurred_at, status: a.status, kind: a.activity_kind,
          target_user: a.target_user, owner_zoho: a.owner_zoho_name,
          reason: a.block_reason,
        })),
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === INSPECT DEAL (debug) ===
  router.get('/api/lead-score/admin/inspect-deal/:dealId', reqAuth, async (req, res) => {
    try {
      const z = require('../zoho');
      const fields = 'Deal_Name,Stage,Pipeline,Layout,Owner,Lead_Source,Cidade,Tipo_de_Agua,Tipo_de_Cliente,Prazo_para_a_Compra,Possui_Analise_de_Agua,Aceita_Analise,Vazao_da_Bomba,Categoria_do_Produto,Produto_Vendido,Description,Telefone_contato,Tier_Lead,Score_Lead,Amount,Created_Time,Modified_Time,Tag';
      const deal = await z.getDeal(req.params.dealId, fields);
      if (!deal) return res.json({ ok: false, error: 'deal não encontrado' });

      // Score breakdown (último)
      const pool = await getPool();
      const last = await db.lastHistoryForDeal(pool, req.params.dealId);
      const breakdown = last ? (typeof last.breakdown_json === 'string' ? JSON.parse(last.breakdown_json) : last.breakdown_json) : null;

      // Tags formatadas
      const tags = (deal.Tag || []).map(t => t.name || t);

      // Análise das tags: quais combinações são suspeitas
      const tagAnalysis = [];
      const hasContradictory = (tags.some(t => /SDR.*IA/i.test(t)) && tags.some(t => /Nutri.*o.*IA/i.test(t)) && tags.some(t => /Qualificado/i.test(t)));
      if (hasContradictory) tagAnalysis.push('⚠️ Tags conflitantes: SDR IA + Nutrição IA + Qualificado IA simultâneos');
      const hasMultipleStages = tags.filter(t => /^(SDR|Nutri|Qualif|Visit|Propos|Closer)/i.test(t));
      if (hasMultipleStages.length > 2) tagAnalysis.push(`⚠️ ${hasMultipleStages.length} tags de etapa simultâneas: ${hasMultipleStages.join(', ')}`);

      res.json({
        ok: true,
        deal: {
          id: req.params.dealId,
          name: deal.Deal_Name,
          stage: deal.Stage,
          pipeline: deal.Pipeline,
          layout: deal.Layout?.name || deal.Layout,
          owner: deal.Owner ? { id: deal.Owner.id, name: deal.Owner.name, email: deal.Owner.email } : null,
          lead_source: deal.Lead_Source,
          tags,
          tag_analysis: tagAnalysis,
          campos: {
            Cidade: deal.Cidade || null,
            Tipo_de_Agua: deal.Tipo_de_Agua || null,
            Tipo_de_Cliente: deal.Tipo_de_Cliente || null,
            Prazo_para_a_Compra: deal.Prazo_para_a_Compra || null,
            Possui_Analise_de_Agua: deal.Possui_Analise_de_Agua || null,
            Aceita_Analise: deal.Aceita_Analise || null,
            Vazao_da_Bomba: deal.Vazao_da_Bomba || null,
            Categoria_do_Produto: deal.Categoria_do_Produto || null,
            Produto_Vendido: deal.Produto_Vendido || null,
            Telefone_contato: deal.Telefone_contato || null,
            Description: deal.Description ? String(deal.Description).slice(0, 280) : null,
          },
          score_lead: deal.Score_Lead,
          tier_lead: deal.Tier_Lead,
          amount: deal.Amount,
          created: deal.Created_Time,
          modified: deal.Modified_Time,
        },
        breakdown,
        history_id: last?.id,
        history_calculated_at: last?.calculated_at,
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === COBERTURA de campos por fonte de lead (debug) ===
  // Vasculha últimos N deals e mostra % de preenchimento dos campos críticos pro scoring.
  router.get('/api/lead-score/admin/field-coverage', reqAuth, async (req, res) => {
    try {
      const days = Number(req.query.days) || 3;
      const limit = Number(req.query.limit) || 300;
      const z = require('../zoho');
      // Busca deals criados nos últimos N dias
      const limitDate = new Date(Date.now() - days*86400000);
      const pad = n => String(n).padStart(2,'0');
      const iso = `${limitDate.getFullYear()}-${pad(limitDate.getMonth()+1)}-${pad(limitDate.getDate())}T00:00:00-03:00`;
      const criteria = `(Created_Time:greater_than:${iso})`;
      const fields = 'Deal_Name,Lead_Source,Stage,Pipeline,Layout,Cidade,Tipo_de_Agua,Tipo_de_Cliente,Prazo_para_a_Compra,Possui_Analise_de_Agua,Aceita_Analise,Vazao_da_Bomba,Categoria_do_Produto,Produto_Vendido,Description,Telefone_contato,Created_Time';
      let deals = [];
      try { deals = await z.search(criteria, fields, 200, 5); }
      catch (e) { return res.json({ ok: false, error: 'zoho_search_failed: '+e.message }); }
      const slice = deals.slice(0, limit);
      const CRITICAL = ['Cidade','Tipo_de_Agua','Tipo_de_Cliente','Prazo_para_a_Compra','Possui_Analise_de_Agua','Vazao_da_Bomba','Categoria_do_Produto','Produto_Vendido','Telefone_contato','Description'];
      // Geral
      const overall = {};
      for (const f of CRITICAL) overall[f] = { filled: 0, total: slice.length };
      for (const d of slice) {
        for (const f of CRITICAL) {
          const v = d[f];
          if (v != null && v !== '' && (typeof v !== 'object' || v.name || v.id)) overall[f].filled++;
        }
      }
      // Por Lead_Source
      const bySource = {};
      for (const d of slice) {
        const src = (d.Lead_Source || '(vazio)').trim() || '(vazio)';
        if (!bySource[src]) {
          bySource[src] = { total: 0, fields: {} };
          for (const f of CRITICAL) bySource[src].fields[f] = 0;
        }
        bySource[src].total++;
        for (const f of CRITICAL) {
          const v = d[f];
          if (v != null && v !== '' && (typeof v !== 'object' || v.name || v.id)) bySource[src].fields[f]++;
        }
      }
      // Pega top 10 sources com mais lacunas
      const sourceRank = Object.entries(bySource).map(([src, info]) => {
        const gaps = CRITICAL.reduce((s,f) => s + (info.total - info.fields[f]), 0);
        return { src, total: info.total, gaps, percent_gaps: Math.round(gaps/(info.total*CRITICAL.length)*100) };
      }).sort((a,b) => b.total - a.total);
      // Pega amostra de deals "vazios" (com 0 ou 1 campo crítico)
      const empty_samples = slice.filter(d => {
        let filled = 0;
        for (const f of CRITICAL) {
          const v = d[f];
          if (v != null && v !== '' && (typeof v !== 'object' || v.name || v.id)) filled++;
        }
        return filled <= 2;
      }).slice(0, 15).map(d => ({
        id: d.id, name: d.Deal_Name, source: d.Lead_Source || '(vazio)',
        stage: d.Stage, pipeline: d.Pipeline,
        created: d.Created_Time,
        filled_critical: CRITICAL.filter(f => {
          const v = d[f]; return v != null && v !== '' && (typeof v !== 'object' || v.name);
        }),
      }));
      res.json({
        ok: true, days, total_deals: slice.length,
        overall: Object.fromEntries(Object.entries(overall).map(([k,v]) => [k, {
          filled: v.filled, total: v.total, percent: Math.round(v.filled/v.total*100)
        }])),
        by_source: bySource,
        source_rank: sourceRank,
        empty_samples,
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === INTAKE NÚBIA: auto-preenche campos no Zoho ===
  // Núbia (Python FastAPI external) chama esse endpoint após cada extração via LLM.
  // POST /api/lead-score/intake/from-nubia
  // Header: x-tdf-svc-key: <TDF_LEAD_SCORE_SVC_KEY>
  // Body: {
  //   deal_id: "6311862000xxx",
  //   extracted_fields: { Tipo_de_Agua, Prazo_para_a_Compra, Possui_Analise_de_Agua, Vazao_da_Bomba, Tipo_de_Cliente, Description, ... },
  //   evidence: "texto da conversa onde extraiu (opcional)",
  //   confidence: 0.85, // opcional
  //   message_id: "wati-msg-id-opcional"
  // }
  router.post('/api/lead-score/intake/from-nubia', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const body = req.body || {};
      const dealId = body.deal_id;
      const fields = body.extracted_fields || {};
      if (!dealId) return res.status(400).json({ ok: false, error: 'deal_id obrigatório' });
      if (!Object.keys(fields).length) return res.status(400).json({ ok: false, error: 'extracted_fields vazio' });

      // Whitelist de campos atualizáveis (segurança — não deixa Núbia mexer em qualquer campo)
      const ALLOWED = [
        'Tipo_de_Agua', 'Prazo_para_a_Compra', 'Possui_Analise_de_Agua',
        'Aceita_Analise', 'Vazao_da_Bomba', 'Tipo_de_Cliente',
        'Cidade', 'Description', 'Categoria_do_Produto', 'Produto_Vendido',
      ];
      const safeFields = {};
      const ignoredFields = [];
      for (const [k, v] of Object.entries(fields)) {
        if (ALLOWED.includes(k) && v != null && v !== '') safeFields[k] = v;
        else if (!ALLOWED.includes(k)) ignoredFields.push(k);
      }
      if (!Object.keys(safeFields).length) {
        return res.json({ ok: false, error: 'nenhum campo permitido pra atualizar', ignored_fields: ignoredFields });
      }

      // Atualiza Zoho
      const z = require('../zoho');
      let zohoResult;
      try {
        zohoResult = await z.updateDeal(dealId, safeFields);
      } catch (e) {
        return res.json({ ok: false, error: 'zoho_update_failed: ' + e.message, fields: safeFields });
      }

      // Audit
      await db.insertAudit(pool, {
        actor: 'nubia',
        target_type: 'zoho_field_extracted',
        target_id: dealId,
        target_label: 'Auto-preenchido pela Núbia (LLM)',
        field_changed: Object.keys(safeFields).join(','),
        new_value: JSON.stringify(safeFields),
        reason: body.evidence ? `evidence: ${String(body.evidence).slice(0, 280)}` : null,
        metadata: {
          confidence: body.confidence,
          message_id: body.message_id,
          ignored_fields: ignoredFields,
        },
      });

      // Dispara recalc — vai re-calcular score com os novos dados
      const { triggerRecalc } = require('./index');
      try {
        triggerRecalc(dealId, 'nubia_extracted', {
          requested_by: 'nubia',
          extra_ctx: { _nubia_confidence: body.confidence },
        });
      } catch (_) {}

      res.json({
        ok: true,
        deal_id: dealId,
        zoho_updated: safeFields,
        ignored_fields: ignoredFields,
        recalc_triggered: true,
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // === LEADS POR TIER em janela de tempo ===
  router.get('/api/lead-score/admin/leads-by-tier', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const tier = String(req.query.tier || 'DIAMANTE').toUpperCase();
      const since = req.query.since || 'today';
      // Resolve since
      let sinceClause = `AND calculated_at > NOW() - INTERVAL '1 day'`;
      if (since === 'today') sinceClause = `AND calculated_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'America/Sao_Paulo')`;
      else if (since === '7d') sinceClause = `AND calculated_at > NOW() - INTERVAL '7 days'`;
      else if (since === '30d') sinceClause = `AND calculated_at > NOW() - INTERVAL '30 days'`;
      const limit = Number(req.query.limit) || 200;

      const r = await pool.query(`
        SELECT DISTINCT ON (deal_id)
          deal_id, deal_name, product_type, tier_final, score_final,
          tier_auto, score_auto, calculated_at, trigger_reason, breakdown_json
        FROM lead_score_history
        WHERE tier_final = $1 ${sinceClause}
        ORDER BY deal_id, calculated_at DESC
        LIMIT $2
      `, [tier, limit]);

      // Ordena por data desc no JS
      const items = r.rows.sort((a,b) => new Date(b.calculated_at) - new Date(a.calculated_at));
      res.json({
        ok: true, tier, since, count: items.length,
        items: items.map(it => ({
          deal_id: it.deal_id, deal_name: it.deal_name,
          product_type: it.product_type,
          tier_final: it.tier_final, score_final: it.score_final,
          tier_auto: it.tier_auto, score_auto: it.score_auto,
          calculated_at: it.calculated_at,
          trigger: it.trigger_reason,
        })),
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/lead-score/admin/status', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const active = await pool.query(`SELECT COUNT(*)::int n FROM lead_score_cadence_runs WHERE status='active'`);
      const recent = await pool.query(`SELECT COUNT(*)::int n FROM lead_score_history WHERE calculated_at > NOW() - INTERVAL '1 hour'`);
      res.json({
        ok: true,
        cadence_runs_active: active.rows[0].n,
        history_last_hour: recent.rows[0].n,
        env_dry_run: process.env.LEAD_SCORE_CADENCE_DRY_RUN === '1',
        env_disabled: process.env.LEAD_SCORE_CADENCE_DISABLED === '1',
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== TESTS ============================== */

  router.post('/api/lead-score/run-tests', reqAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const out = await tests.runAll(pool);
      res.json({ ok: true, ...out });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ============================== STATUS ============================== */

  router.get('/api/lead-score/status', async (req, res) => {
    try {
      const pool = await getPool();
      const crit = await pool.query('SELECT COUNT(*)::int AS n FROM lead_score_criteria WHERE is_active = TRUE');
      const bands = await pool.query('SELECT COUNT(*)::int AS n FROM lead_score_distance_bands WHERE is_active = TRUE');
      const cities = await pool.query('SELECT COUNT(*)::int AS n FROM lead_score_cities');
      const hist = await pool.query('SELECT COUNT(*)::int AS n FROM lead_score_history');
      res.json({
        ok: true, status: 'ready',
        criteria_active: crit.rows[0].n,
        distance_bands_active: bands.rows[0].n,
        cities_registered: cities.rows[0].n,
        history_records: hist.rows[0].n,
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  return router;
}

module.exports = { buildRouter };
