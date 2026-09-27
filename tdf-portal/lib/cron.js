// lib/cron.js — Agendador automático de sync OMIE → Postgres
// Etapa 2 / Parte 3
//
// - Roda syncAll() a cada SYNC_INTERVAL_MIN minutos (default 30, configurável por env)
// - Usa lock pra não conflitar com sync manual disparado pelo admin
// - Loga início/fim no console e no sync_log
// - Pode ser desativado com CRON_ENABLED=false
// - Pode ser forçado manualmente via /api/bi/admin/cron/trigger
//
// IMPORTANTE: o sync é SOMENTE LEITURA na OMIE. Nada é escrito na OMIE.

const cron = require('node-cron');
const sync = require('./sync');
const { pool } = require('./auth');

const ENABLED = (process.env.CRON_ENABLED || 'true').toLowerCase() === 'true';
const INTERVAL_MIN = parseInt(process.env.SYNC_INTERVAL_MIN || '30', 10);

let task = null;
let isRunning = false;        // lock em memória (processo local)
let lastCronRun = null;       // Date da última execução iniciada pelo cron
let lastCronResult = null;    // resultado da última execução
let nextRunAt = null;         // Date da próxima execução agendada

// Constrói expressão cron a partir de intervalo em minutos.
// Para intervalos que não dividem 60, usamos "a cada X minutos" (*/X).
// Para intervalos maiores, "*/X * * * *" roda a cada X minutos na posição 0..59.
function buildCronExpr(intervalMin) {
  if (intervalMin < 1) intervalMin = 1;
  if (intervalMin > 59) intervalMin = 59; // node-cron básico aceita 0-59 no primeiro campo
  return `*/${intervalMin} * * * *`;
}

async function tick(source = 'cron') {
  if (isRunning) {
    console.log(`[cron] sync já em andamento, ignorando trigger (source=${source})`);
    return { skipped: true, reason: 'already_running' };
  }
  isRunning = true;
  const startedAt = new Date();
  console.log(`[cron] INÍCIO sync automático (source=${source}, intervalo=${INTERVAL_MIN}min)`);
  try {
    const results = await sync.syncAll(`cron:${source}`, false); // sync real (não mock)
    const finishedAt = new Date();
    const totalRegs = results.reduce((a, b) => a + b.total, 0);
    const status = results.every(r => r.status === 'success') ? 'success' : 'partial';
    lastCronRun = startedAt;
    lastCronResult = { started_at: startedAt, finished_at: finishedAt, status, total: totalRegs, empresas: results.length, source };
    console.log(`[cron] FIM — ${results.length} empresas, ${totalRegs} registros, status=${status}, durou ${finishedAt - startedAt}ms`);
    return lastCronResult;
  } catch (err) {
    console.error('[cron] ERRO:', err);
    lastCronRun = startedAt;
    lastCronResult = { started_at: startedAt, finished_at: new Date(), status: 'error', error: err.message, source };
    return lastCronResult;
  } finally {
    isRunning = false;
  }
}

function start() {
  if (!ENABLED) {
    console.log(`[cron] DESATIVADO (CRON_ENABLED=false)`);
    return { enabled: false };
  }
  if (task) {
    console.log(`[cron] já iniciado, ignorando start duplicado`);
    return { enabled: true, already_running: true };
  }
  const expr = buildCronExpr(INTERVAL_MIN);
  task = cron.schedule(expr, () => { tick('scheduled'); }, { scheduled: true });
  // Calcula próxima execução (aproximada)
  nextRunAt = new Date(Date.now() + INTERVAL_MIN * 60 * 1000);
  console.log(`[cron] INICIADO — expressão "${expr}", a cada ${INTERVAL_MIN} minutos, próxima execução ~${nextRunAt.toISOString()}`);
  return { enabled: true, expression: expr, interval_min: INTERVAL_MIN, next_run: nextRunAt };
}

function stop() {
  if (task) {
    task.stop();
    task = null;
    console.log(`[cron] parado`);
    return { stopped: true };
  }
  return { stopped: false, reason: 'não estava rodando' };
}

function status() {
  return {
    enabled: ENABLED,
    running: isRunning,
    interval_min: INTERVAL_MIN,
    cron_expression: ENABLED ? buildCronExpr(INTERVAL_MIN) : null,
    last_run: lastCronRun,
    last_result: lastCronResult,
    next_run_estimate: nextRunAt,
  };
}

module.exports = { start, stop, tick, status };
