/**
 * Lead Score — Detector de tarefas/chamadas atrasadas.
 *
 * Cron periódico:
 *   1. Busca no Zoho Tasks com Status='Not Started' e Due_Date < hoje
 *   2. Busca no Zoho Calls com Call_Status='Scheduled' e Call_Start_Time < now
 *   3. Filtra apenas as criadas pela cadência TDF (Subject que começa com [TIER])
 *   4. Agrupa por Owner do deal
 *   5. Pra cada owner com atrasos:
 *        - manda Z-API pro closer (lista resumida)
 *        - manda Cliq #operacional pro gestor (resumo total)
 *        - cria Note no Zoho deal: "⚠️ Cadência mal executada — task X atrasada Yh"
 *   6. Cooldown 4h por task pra não floodar
 *
 * Adapter de notificação injetado via setNotifier({zapiSend, cliqAlert, createNote}).
 * Sem adapter, só grava em lead_score_overdue_alerts (DB) sem disparar.
 */

const db = require('./db');
const businessHours = require('./business-hours');

let _notifier = null;
function setNotifier(fn) { _notifier = fn; }

let _zoho = null;
function zoho() {
  if (_zoho) return _zoho;
  try { _zoho = require('../zoho'); } catch (e) { _zoho = null; }
  return _zoho;
}

// Tolerância antes de considerar atrasado (em min úteis)
const OVERDUE_THRESHOLD_MIN = 120;     // 2h úteis
// Cooldown entre alertas pra mesma task
const COOLDOWN_HOURS = 4;

/**
 * Garante schema da tabela de cooldown (idempotente).
 */
async function ensureSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lead_score_overdue_alerts (
      id BIGSERIAL PRIMARY KEY,
      activity_kind TEXT NOT NULL,
      zoho_activity_id TEXT NOT NULL,
      deal_id TEXT NOT NULL,
      owner_zoho_name TEXT,
      overdue_minutes INTEGER,
      alerted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      channels_sent JSONB DEFAULT '[]'::jsonb,
      note_id TEXT,
      UNIQUE (activity_kind, zoho_activity_id, alerted_at)
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_lsoa_activity ON lead_score_overdue_alerts(activity_kind, zoho_activity_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_lsoa_deal ON lead_score_overdue_alerts(deal_id, alerted_at DESC)`);
}

async function _wasRecentlyAlerted(pool, kind, activityId) {
  const r = await pool.query(
    `SELECT 1 FROM lead_score_overdue_alerts
     WHERE activity_kind = $1 AND zoho_activity_id = $2
       AND alerted_at > NOW() - INTERVAL '${COOLDOWN_HOURS} hours'
     LIMIT 1`,
    [kind, String(activityId)]
  );
  return r.rows.length > 0;
}

async function _markAlerted(pool, payload) {
  await pool.query(
    `INSERT INTO lead_score_overdue_alerts
       (activity_kind, zoho_activity_id, deal_id, owner_zoho_name, overdue_minutes, channels_sent, note_id)
     VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7)`,
    [
      payload.activity_kind,
      String(payload.zoho_activity_id),
      String(payload.deal_id),
      payload.owner_zoho_name || null,
      Number(payload.overdue_minutes || 0),
      JSON.stringify(payload.channels_sent || []),
      payload.note_id || null,
    ]
  );
}

/**
 * Busca Tasks atrasadas no Zoho criadas pela cadência (Subject começa com [TIER]).
 */
async function _fetchOverdueTasks(zohoLib) {
  if (!zohoLib?.fetch) return [];
  const token = await zohoLib.getToken();
  if (!token) return [];
  // Tasks Not Started com Due_Date < hoje, criadas pela cadência (subject prefixo [DIAMANTE]/[OURO]/...)
  const today = new Date().toISOString().slice(0, 10);
  const criteria = `(Status:equals:Not Started)and(Due_Date:less_than:${today})`;
  try {
    const url = `${zohoLib.BASE}/Tasks/search?criteria=${encodeURIComponent(criteria)}&fields=Subject,Status,Due_Date,Owner,What_Id,Created_Time&per_page=100`;
    const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
    if (r.status === 204) return [];
    if (!r.ok) return [];
    const j = await r.json().catch(() => ({}));
    return (j.data || []).filter(t => /^\[(DIAMANTE|OURO|PRATA|BRONZE|PEDRA)\]/.test(t.Subject || ''));
  } catch (e) { return []; }
}

async function _fetchOverdueCalls(zohoLib) {
  if (!zohoLib?.fetch) return [];
  const token = await zohoLib.getToken();
  if (!token) return [];
  const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
  const criteria = `(Call_Status:equals:Scheduled)and(Call_Start_Time:less_than:${nowIso})`;
  try {
    const url = `${zohoLib.BASE}/Calls/search?criteria=${encodeURIComponent(criteria)}&fields=Subject,Call_Status,Call_Start_Time,Owner,What_Id&per_page=100`;
    const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
    if (r.status === 204) return [];
    if (!r.ok) return [];
    const j = await r.json().catch(() => ({}));
    return (j.data || []).filter(c => /^\[(DIAMANTE|OURO|PRATA|BRONZE|PEDRA)\]/.test(c.Subject || ''));
  } catch (e) { return []; }
}

function _overdueMinutes(due) {
  return businessHours.businessMinutesBetween(due, new Date());
}

/**
 * Detector principal.
 */
async function detectAndAlert(pool, { dryRun = false } = {}) {
  await ensureSchema(pool);
  const z = zoho();
  if (!z) return { ok: false, error: 'zoho_lib_unavailable' };

  const [tasks, calls] = await Promise.all([_fetchOverdueTasks(z), _fetchOverdueCalls(z)]);

  // Normaliza
  const items = [
    ...tasks.map(t => ({
      kind: 'task', id: t.id, subject: t.Subject || '',
      due: new Date(t.Due_Date + 'T18:00:00-03:00'),
      owner_id: t.Owner?.id, owner_name: t.Owner?.name || t.Owner?.email || null,
      deal_id: t.What_Id?.id || null, deal_name: t.What_Id?.name || null,
    })),
    ...calls.map(c => ({
      kind: 'call', id: c.id, subject: c.Subject || '',
      due: new Date(c.Call_Start_Time),
      owner_id: c.Owner?.id, owner_name: c.Owner?.name || c.Owner?.email || null,
      deal_id: c.What_Id?.id || null, deal_name: c.What_Id?.name || null,
    })),
  ];

  // Filtra por threshold de atraso (em minutos úteis)
  const overdue = items.filter(it => _overdueMinutes(it.due) >= OVERDUE_THRESHOLD_MIN);

  // Filtra os que estão em cooldown
  const toAlert = [];
  for (const it of overdue) {
    const recent = await _wasRecentlyAlerted(pool, it.kind, it.id);
    if (!recent) toAlert.push(it);
  }

  // Agrupa por owner
  const byOwner = {};
  for (const it of toAlert) {
    const k = it.owner_name || '(sem owner)';
    if (!byOwner[k]) byOwner[k] = [];
    byOwner[k].push(it);
  }

  const results = { detected: overdue.length, to_alert: toAlert.length, owners: Object.keys(byOwner).length, sent: 0, errors: 0, details: [] };

  if (dryRun) return { ...results, dry_run: true };

  for (const [ownerName, ownerItems] of Object.entries(byOwner)) {
    try {
      const overdueText = ownerItems.slice(0, 10).map(it => {
        const hrs = Math.round(_overdueMinutes(it.due) / 60 * 10) / 10;
        return `• ${it.subject} (${hrs}h atrasada${it.deal_name?' · '+it.deal_name:''})`;
      }).join('\n');
      const more = ownerItems.length > 10 ? `\n…e mais ${ownerItems.length - 10}` : '';
      const msgCloser = `⚠️ *${ownerItems.length} tarefa(s)/chamada(s) atrasada(s) da cadência:*\n\n${overdueText}${more}\n\nAtualiza no Zoho assim que tratar.`;
      const msgGestor = `🚨 Cadência mal executada: ${ownerName} tem ${ownerItems.length} atividade(s) atrasada(s) >${OVERDUE_THRESHOLD_MIN}min úteis.`;

      if (_notifier) {
        const chans = [];
        try { if (_notifier.zapiSend) { await _notifier.zapiSend({ ownerName, message: msgCloser }); chans.push('zapi'); } } catch(_){}
        try { if (_notifier.cliqAlert) { await _notifier.cliqAlert({ message: msgGestor }); chans.push('cliq'); } } catch(_){}

        // Cria Note em cada deal afetado
        for (const it of ownerItems) {
          if (!it.deal_id) continue;
          let noteId = null;
          if (_notifier.createNote) {
            try {
              const note = await _notifier.createNote({
                dealId: it.deal_id,
                title: `⚠️ Cadência mal executada — ${it.kind === 'call' ? 'Chamada' : 'Tarefa'} atrasada`,
                content: `${it.subject}\nVence: ${it.due.toLocaleString('pt-BR')}\nAtrasada: ${Math.round(_overdueMinutes(it.due)/60*10)/10}h úteis\nOwner: ${it.owner_name}\nDetectado em ${new Date().toLocaleString('pt-BR')}`,
              });
              noteId = note?.noteId || null;
              if (noteId) chans.push('note');
            } catch(_){}
          }
          await _markAlerted(pool, {
            activity_kind: it.kind, zoho_activity_id: it.id, deal_id: it.deal_id,
            owner_zoho_name: ownerName, overdue_minutes: _overdueMinutes(it.due),
            channels_sent: chans, note_id: noteId,
          });
        }
        results.sent++;
        results.details.push({ owner: ownerName, items: ownerItems.length, channels: chans });
      } else {
        // sem notifier — só registra
        for (const it of ownerItems) {
          await _markAlerted(pool, {
            activity_kind: it.kind, zoho_activity_id: it.id, deal_id: it.deal_id,
            owner_zoho_name: ownerName, overdue_minutes: _overdueMinutes(it.due),
            channels_sent: ['db_only'],
          });
        }
        results.details.push({ owner: ownerName, items: ownerItems.length, channels: ['db_only'] });
      }
    } catch (e) {
      results.errors++;
      results.details.push({ owner: ownerName, error: e.message });
    }
  }

  return { ok: true, ...results };
}

async function listOverdueAlerts(pool, { limit = 200 } = {}) {
  const r = await pool.query(
    `SELECT * FROM lead_score_overdue_alerts ORDER BY alerted_at DESC LIMIT $1`,
    [limit]
  );
  return r.rows;
}

module.exports = {
  setNotifier,
  ensureSchema,
  detectAndAlert,
  listOverdueAlerts,
  OVERDUE_THRESHOLD_MIN,
  COOLDOWN_HOURS,
};
