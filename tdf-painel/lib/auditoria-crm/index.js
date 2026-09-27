/**
 * Auditoria CRM — Módulo plugável
 *
 * Uso (no server.js):
 *   const auditoriaCRM = require('./lib/auditoria-crm');
 *   auditoriaCRM.mount(app, { pool: _pgPool });   // se já existe pool
 *   // OU
 *   auditoriaCRM.mount(app, { connectionString: process.env.DATABASE_URL });
 *
 * Recursos:
 *   - Auto-cria tabelas (idempotente)
 *   - Auto-semeia mocks se DB vazio (controlado por TDF_AUDIT_SEED=1)
 *   - Sobe rotas /auditoria-crm + /api/auditoria-crm/*
 *   - Cron interno: rules.runAllRules a cada 10min
 */

const { buildRouter } = require('./routes');
const db = require('./db');
const rules = require('./rules');
const seed = require('./seed');

let _pool = null;
let _ownsPool = false;
let _cron = null;

async function getPoolFromOpts(opts) {
  if (_pool) return _pool;
  if (opts.pool) {
    _pool = opts.pool;
    _ownsPool = false;
  } else if (opts.connectionString || process.env.DATABASE_URL) {
    const { Pool } = require('pg');
    const conn = opts.connectionString || process.env.DATABASE_URL;
    _pool = new Pool({
      connectionString: conn,
      ssl: conn.includes('railway.internal') ? false : { rejectUnauthorized: false },
      max: 5
    });
    _ownsPool = true;
  } else {
    throw new Error('[auditoria-crm] sem DATABASE_URL nem pool fornecido');
  }
  return _pool;
}

async function mount(app, opts = {}) {
  if (!app) throw new Error('[auditoria-crm] app Express obrigatório');

  const ready = (async () => {
    try {
      const pool = await getPoolFromOpts(opts);
      await db.ensureSchema(pool);

      // Seed inicial se vazio (modo dev) — controlado por env
      const shouldSeed = process.env.TDF_AUDIT_SEED === '1' || opts.autoSeed === true;
      if (shouldSeed) {
        const out = await seed.maybeSeed(pool);
        if (!out.skipped) {
          console.log(`[auditoria-crm] seed inicial: ${out.inserted} eventos`);
          await rules.tagSuspiciousLogs(pool);
          const summary = await rules.runAllRules(pool);
          console.log(`[auditoria-crm] regras: ${summary.alerts_emitted} alertas`);
        }
      }

      // Cron de regras a cada 10min (configurable)
      const intervalMs = Number(opts.rulesIntervalMs || 10 * 60 * 1000);
      if (intervalMs > 0 && !_cron) {
        _cron = setInterval(async () => {
          try {
            await rules.tagSuspiciousLogs(pool);
            const summary = await rules.runAllRules(pool);
            if (summary.alerts_emitted > 0) {
              console.log(`[auditoria-crm cron] ${summary.alerts_emitted} novos alertas`);
            }
          } catch (e) { console.error('[auditoria-crm cron]', e.message); }
        }, intervalMs);
        if (_cron && _cron.unref) _cron.unref();
      }
    } catch (e) {
      console.error('[auditoria-crm] erro no boot:', e.message);
    }
  })();

  // Rotas precisam de uma promise lazy do pool — o handler espera ready resolver
  const getPool = async () => {
    await ready;
    if (!_pool) throw new Error('[auditoria-crm] pool não inicializado');
    return _pool;
  };

  app.use(buildRouter(getPool, opts));

  // Endpoint de healthcheck público (sem auth)
  app.get('/auditoria-crm/_status', async (req, res) => {
    try {
      await ready;
      const pool = await getPool();
      const r = await pool.query('SELECT COUNT(*)::int AS logs FROM crm_audit_logs');
      res.json({ ok: true, status: 'ready', logs: r.rows[0].logs });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  console.log('[auditoria-crm] módulo montado em /auditoria-crm + /api/auditoria-crm/*');
  return ready;
}

/**
 * Helper para outras partes do server.js (ou outros agentes/automações)
 * registrarem logs sem precisar conhecer a tabela:
 *
 *   const audit = require('./lib/auditoria-crm');
 *   await audit.log({
 *     action_type: 'task_completed',
 *     action_origin: 'seller_manual',
 *     crm_module: 'Tasks',
 *     crm_record_id: '12345',
 *     actor_name: 'Guilherme',
 *     ...
 *   });
 */
async function log(payload) {
  if (!_pool) {
    if (process.env.DATABASE_URL) {
      const { Pool } = require('pg');
      _pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('railway.internal') ? false : { rejectUnauthorized: false },
        max: 3
      });
      await db.ensureSchema(_pool);
    } else {
      throw new Error('[auditoria-crm] log() chamado sem pool nem DATABASE_URL');
    }
  }
  return db.insertLog(_pool, payload);
}

async function emitAlert(payload) {
  if (!_pool) throw new Error('[auditoria-crm] emitAlert() requer mount() prévio');
  return db.insertAlert(_pool, payload);
}

module.exports = {
  mount,
  log,
  emitAlert,
  db,
  rules,
  seed
};
