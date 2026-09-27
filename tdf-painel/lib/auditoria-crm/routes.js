/**
 * Auditoria CRM — Rotas REST + EJS
 *
 * Monta todas as rotas em um Router. O index.js exporta uma função
 * `mount(app, opts)` que injeta isso no Express principal sem precisar
 * tocar no resto do server.js.
 */

const express = require('express');
const db = require('./db');
const rules = require('./rules');
const seed = require('./seed');
const sistemica = require('./sistemica');
const { backfillFromTimeline } = require('./backfill');

function periodFromQuery(q) {
  const now = new Date();
  const to = q.to ? new Date(q.to) : now;
  let from;
  switch ((q.period || 'last30').toLowerCase()) {
    case 'today': {
      from = new Date(now); from.setHours(0, 0, 0, 0); break;
    }
    case 'yesterday': {
      from = new Date(now); from.setDate(from.getDate() - 1); from.setHours(0, 0, 0, 0);
      const t = new Date(from); t.setHours(23, 59, 59, 999);
      return { from, to: t };
    }
    case 'last7': from = new Date(now.getTime() - 7 * 86400000); break;
    case 'last30': from = new Date(now.getTime() - 30 * 86400000); break;
    case 'last90': from = new Date(now.getTime() - 90 * 86400000); break;
    case 'custom':
      from = q.from ? new Date(q.from) : new Date(now.getTime() - 30 * 86400000);
      break;
    default: from = new Date(now.getTime() - 30 * 86400000);
  }
  return { from, to };
}

function parseListFilters(q) {
  const f = {};
  if (q.action_origin) f.action_origin = q.action_origin;
  if (q.origins) f.action_origin_in = String(q.origins).split(',').filter(Boolean);
  if (q.action_type) f.action_type = q.action_type;
  if (q.crm_module) f.crm_module = q.crm_module;
  if (q.validation_status) f.validation_status = q.validation_status;
  if (q.impact_type) f.impact_type = q.impact_type;
  if (q.seller) f.seller_after = q.seller;
  if (q.actor) f.actor_name = q.actor;
  if (q.channel) f.related_channel = q.channel;
  if (q.crm_record_id) f.crm_record_id = q.crm_record_id;
  if (q.rule) f.rule_triggered = q.rule;
  if (q.q) f.q = q.q;
  return f;
}

function requireAuth(req, res, next) {
  // Reusa session do portal. Se o portal expõe `req.session.user`, ok.
  // Senão, deixa passar (módulo é interno; quem cuida do auth é o server.js).
  if (req.session && req.session.user) return next();
  // fallback: GET libera, POST/PATCH precisam ter um header de serviço
  if (req.method === 'GET') return next();
  const svc = req.get('x-tdf-svc-key');
  if (svc && process.env.TDF_AUDIT_SVC_KEY && svc === process.env.TDF_AUDIT_SVC_KEY) return next();
  if (!process.env.TDF_AUDIT_SVC_KEY) return next(); // dev mode
  return res.status(401).json({ error: 'unauthorized' });
}

function buildRouter(getPool, opts = {}) {
  const router = express.Router();
  router.use(express.json({ limit: '2mb' }));

  /* ========== EJS Pages ========== */

  router.get('/auditoria-crm', (req, res) => {
    res.render('auditoria-crm', {
      user: req.session?.user || { name: 'guest', role: 'admin' },
      activePage: 'auditoria-crm',
      pageTitle: 'Auditoria CRM'
    });
  });

  router.get('/auditoria-crm/influencia-ia', (req, res) => {
    res.render('auditoria-crm-influencia-ia', {
      user: req.session?.user || { name: 'guest', role: 'admin' },
      activePage: 'auditoria-crm',
      pageTitle: 'Auditoria · Influência da IA'
    });
  });

  router.get('/auditoria-crm/distribuicao-leads', (req, res) => {
    res.render('auditoria-crm-distribuicao', {
      user: req.session?.user || { name: 'guest', role: 'admin' },
      activePage: 'auditoria-crm',
      pageTitle: 'Auditoria · Distribuição de Leads'
    });
  });

  router.get('/auditoria-crm/vendedores', (req, res) => {
    res.render('auditoria-crm-vendedores', {
      user: req.session?.user || { name: 'guest', role: 'admin' },
      activePage: 'auditoria-crm',
      pageTitle: 'Auditoria · Vendedores'
    });
  });

  router.get('/auditoria-crm/sistemica-ia', (req, res) => {
    res.render('auditoria-crm-sistemica', {
      user: req.session?.user || { name: 'guest', role: 'admin' },
      activePage: 'auditoria-crm',
      pageTitle: 'Auditoria · Sistêmica IA'
    });
  });

  /* ========== API ========== */

  router.get('/api/auditoria-crm/overview', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const { from, to } = periodFromQuery(req.query);
      const overview = await db.overviewMetrics(pool, from, to);
      const alerts = await db.alertsCount(pool, 'open');
      res.json({ ok: true, period: { from, to }, overview, alerts });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/logs', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const { from, to } = periodFromQuery(req.query);
      const filters = { ...parseListFilters(req.query), from, to };
      const limit = Math.min(parseInt(req.query.limit) || 100, 500);
      const offset = parseInt(req.query.offset) || 0;
      const [rows, total] = await Promise.all([
        db.listLogs(pool, filters, { limit, offset }),
        db.countLogs(pool, filters)
      ]);
      res.json({ ok: true, total, limit, offset, rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/logs/:id', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const log = await db.getLogById(pool, req.params.id);
      if (!log) return res.status(404).json({ ok: false, error: 'not_found' });
      res.json({ ok: true, log });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/auditoria-crm/log', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const result = await db.insertLog(pool, req.body);
      res.json({ ok: true, ...result });
    } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/alerts', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const filters = {
        status: req.query.status,
        severity: req.query.severity,
        seller_name: req.query.seller,
        alert_type: req.query.alert_type,
      };
      const rows = await db.listAlerts(pool, filters);
      res.json({ ok: true, total: rows.length, rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/auditoria-crm/alerts/:id/resolve', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const updated = await db.updateAlert(pool, req.params.id, {
        status: 'resolved',
        resolved_by: req.body.resolved_by || req.session?.user?.name || 'gestor',
        resolved_at: new Date(),
        notes: req.body.notes
      });
      res.json({ ok: true, alert: updated });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/auditoria-crm/alerts/:id/ignore', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const updated = await db.updateAlert(pool, req.params.id, {
        status: 'ignored',
        resolved_by: req.body.resolved_by || req.session?.user?.name || 'gestor',
        resolved_at: new Date(),
        notes: req.body.notes
      });
      res.json({ ok: true, alert: updated });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/influencia-ia', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const { from, to } = periodFromQuery(req.query);
      const metrics = await db.influenciaIaMetrics(pool, from, to);
      // Calcula KPIs derivados
      const leadsIa = Number(metrics.leads_ia) || 0;
      const wonIa = Number(metrics.won_com_ia) || 0;
      const wonSemIa = Number(metrics.won_sem_ia) || 0;
      const lostIa = Number(metrics.lost_com_ia) || 0;
      const lostSemIa = Number(metrics.lost_sem_ia) || 0;
      const totalLeads = Number(metrics.leads_total) || 0;
      const leadsSemIa = Math.max(0, totalLeads - leadsIa);
      const conv = (won, total) => total > 0 ? +(100 * won / total).toFixed(1) : 0;
      const compare = {
        com_ia: {
          leads: leadsIa,
          won: wonIa,
          lost: lostIa,
          taxa_fechamento: conv(wonIa, leadsIa),
          receita: Number(metrics.receita_ia) || 0,
        },
        sem_ia: {
          leads: leadsSemIa,
          won: wonSemIa,
          lost: lostSemIa,
          taxa_fechamento: conv(wonSemIa, leadsSemIa),
          receita: Number(metrics.receita_sem_ia) || 0,
        }
      };
      res.json({ ok: true, period: { from, to }, metrics, compare });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/distribuicao-leads', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const { from, to } = periodFromQuery(req.query);
      const [dist, negByTier, negSummary, detail] = await Promise.all([
        db.distribuicaoMetrics(pool, from, to),
        db.negotiationsByTier(pool, from, to),
        db.negotiationsSummary(pool, from, to),
        db.listLogs(pool, { action_type: 'lead_assigned', from, to }, { limit: 200 })
      ]);

      // Pivot rows -> matrix: { vendedor: { tier: n } }
      const tiers = new Set();
      const matrix = {};
      const valorMatrix = {};
      for (const row of negByTier) {
        tiers.add(row.tier);
        if (!matrix[row.vendedor]) { matrix[row.vendedor] = {}; valorMatrix[row.vendedor] = {}; }
        matrix[row.vendedor][row.tier] = row.n;
        valorMatrix[row.vendedor][row.tier] = Number(row.valor) || 0;
      }
      const tierOrder = ['Diamante', 'Ouro', 'Prata', 'Bronze', 'Sem tier', 'Tier indisponível'];
      const tiersList = tierOrder.filter(t => tiers.has(t)).concat([...tiers].filter(t => !tierOrder.includes(t)));

      res.json({
        ok: true,
        period: { from, to },
        negotiations_summary: negSummary,
        by_seller: dist,
        by_seller_tier: { matrix, value_matrix: valorMatrix, tiers: tiersList },
        detail
      });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/vendedores', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const { from, to } = periodFromQuery(req.query);
      const rows = await db.vendedorMetrics(pool, from, to);
      res.json({ ok: true, period: { from, to }, rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/sistemica-ia', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const { from, to } = periodFromQuery(req.query);
      const data = await sistemica.buildSistemicAudit(pool, from, to);
      res.json({ ok: true, ...data });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/timeline/:crm_record_id', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const crmModule = req.query.module || 'Leads';
      const events = await db.timelineForRecord(pool, crmModule, req.params.crm_record_id);
      res.json({ ok: true, events });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  /* ========== Admin: rerun rules + reseed ========== */

  router.post('/api/auditoria-crm/admin/run-rules', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      await rules.tagSuspiciousLogs(pool);
      const summary = await rules.runAllRules(pool);
      res.json({ ok: true, summary });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/auditoria-crm/admin/seed', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const force = req.body && req.body.force === true;
      const out = await seed.maybeSeed(pool, { force });
      // Após semear, roda regras
      if (!out.skipped) {
        await rules.tagSuspiciousLogs(pool);
        const summary = await rules.runAllRules(pool);
        return res.json({ ok: true, seed: out, rules: summary });
      }
      res.json({ ok: true, seed: out });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.post('/api/auditoria-crm/admin/backfill-from-timeline', requireAuth, async (req, res) => {
    try {
      const pool = await getPool();
      const since = req.body?.since || req.query?.since || null;
      const dryRun = req.body?.dry_run === true || String(req.query?.dry_run || '') === '1';
      const stats = await backfillFromTimeline(pool, { since, dryRun });
      res.json({ ok: true, ...stats });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  router.get('/api/auditoria-crm/admin/health', async (req, res) => {
    try {
      const pool = await getPool();
      const r = await pool.query('SELECT COUNT(*)::int AS logs FROM crm_audit_logs');
      const a = await pool.query('SELECT COUNT(*)::int AS alerts FROM crm_audit_alerts');
      res.json({ ok: true, logs: r.rows[0].logs, alerts: a.rows[0].alerts });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  return router;
}

module.exports = { buildRouter, periodFromQuery, parseListFilters };
