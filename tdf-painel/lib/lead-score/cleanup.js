/**
 * Lead Score — Saneamento de tarefas/chamadas erradas no Zoho.
 *
 * Detecta toda Task/Call ABERTA no Zoho com prefixo [TIER] (criada pela
 * cadência) e oferece cancelar. Após cancelar, opcionalmente dispara
 * triggerRecalc nos deals afetados pra que a cadência V2 corrigida
 * (com Owner validado, permissão por produto, idempotência) recrie
 * as atividades corretas — só pra Owner válido.
 *
 * SUPORTA DRY-RUN: lista o que faria sem chamar Zoho.
 */

const db = require('./db');

let _zoho = null;
function zoho() {
  if (_zoho) return _zoho;
  try { _zoho = require('../zoho'); } catch (e) { _zoho = null; }
  return _zoho;
}

const TIER_REGEX = /^\[(DIAMANTE|OURO|PRATA|BRONZE|PEDRA)\]/;

/**
 * Busca tasks abertas no Zoho com prefixo de tier (criadas pela cadência).
 * Tasks "abertas" = Status diferente de Completed/Cancelled.
 */
async function _fetchBadTasks(zohoLib) {
  if (!zohoLib?.fetch) return [];
  const token = await zohoLib.getToken();
  if (!token) return [];
  // criteria amplo: status diferente de Completed/Cancelled. Filtramos por subject prefix client-side.
  const criteria = `(Status:not_equal:Completed)and(Status:not_equal:Cancelled)`;
  try {
    let all = [];
    for (let page = 1; page <= 10; page++) {
      const url = `${zohoLib.BASE}/Tasks/search?criteria=${encodeURIComponent(criteria)}&fields=Subject,Status,Due_Date,Owner,What_Id,Created_Time&per_page=200&page=${page}`;
      const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
      if (r.status === 204) break;
      if (!r.ok) break;
      const j = await r.json().catch(() => ({}));
      const data = (j.data || []).filter(t => TIER_REGEX.test(t.Subject || ''));
      all = all.concat(data);
      if (!j.data || j.data.length < 200) break;
    }
    return all;
  } catch (e) { return []; }
}

async function _fetchBadCalls(zohoLib) {
  if (!zohoLib?.fetch) return [];
  const token = await zohoLib.getToken();
  if (!token) return [];
  const criteria = `(Call_Status:equals:Scheduled)`;
  try {
    let all = [];
    for (let page = 1; page <= 10; page++) {
      const url = `${zohoLib.BASE}/Calls/search?criteria=${encodeURIComponent(criteria)}&fields=Subject,Call_Status,Call_Start_Time,Owner,What_Id,Created_Time&per_page=200&page=${page}`;
      const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
      if (r.status === 204) break;
      if (!r.ok) break;
      const j = await r.json().catch(() => ({}));
      const data = (j.data || []).filter(c => TIER_REGEX.test(c.Subject || ''));
      all = all.concat(data);
      if (!j.data || j.data.length < 200) break;
    }
    return all;
  } catch (e) { return []; }
}

/**
 * Executa o saneamento.
 *
 * @param {object} pool
 * @param {object} opts
 * @param {boolean} opts.dry_run            só lista, não chama Zoho
 * @param {boolean} opts.requeue=true       após cancelar, dispara triggerRecalc nos deals
 * @param {function} opts.triggerRecalc     função triggerRecalc do index.js
 * @param {string} opts.requested_by
 */
async function cleanupBadActivities(pool, opts = {}) {
  const z = zoho();
  if (!z) return { ok: false, error: 'zoho_lib_unavailable' };

  const [tasks, calls] = await Promise.all([_fetchBadTasks(z), _fetchBadCalls(z)]);
  const items = [
    ...tasks.map(t => ({ kind: 'task', id: t.id, subject: t.Subject, deal_id: t.What_Id?.id, owner_name: t.Owner?.name, created_at: t.Created_Time })),
    ...calls.map(c => ({ kind: 'call', id: c.id, subject: c.Subject, deal_id: c.What_Id?.id, owner_name: c.Owner?.name, created_at: c.Created_Time })),
  ];

  const results = {
    tasks_found: tasks.length, calls_found: calls.length, total: items.length,
    cancelled: 0, errors: 0, dry_run: !!opts.dry_run,
    deal_ids_unique: 0, deals_requeued: 0,
  };

  if (!items.length) return { ok: true, ...results, message: 'nenhuma atividade com prefixo [TIER] aberta encontrada' };

  // Resumo por tier antes de qualquer ação
  const by_tier = {};
  for (const it of items) {
    const m = it.subject?.match(TIER_REGEX);
    const t = m ? m[1] : 'OUTROS';
    by_tier[t] = (by_tier[t] || 0) + 1;
  }
  results.by_tier = by_tier;

  if (opts.dry_run) {
    return { ok: true, ...results, preview_sample: items.slice(0, 20) };
  }

  // Cancela cada uma no Zoho + audit log
  const dealIds = new Set();
  for (const it of items) {
    try {
      let r;
      if (it.kind === 'task') {
        r = await z.updateTask(it.id, { Status: 'Cancelled' });
      } else {
        r = await z.updateCall(it.id, { Call_Status: 'Cancelled' });
      }
      if (r.ok) {
        results.cancelled++;
        if (it.deal_id) dealIds.add(it.deal_id);
      } else {
        results.errors++;
      }
      // audit
      await db.insertActivityAudit(pool, {
        deal_id: it.deal_id || 'unknown',
        activity_kind: it.kind,
        owner_zoho_name: it.owner_name,
        status: r.ok ? 'CLEANUP_CANCELLED' : 'CLEANUP_ERROR',
        block_reason: r.ok ? `Cancelada pelo saneamento V1→V2 (subject prefixo TIER)` : (r.error || 'unknown'),
        zoho_id: it.id,
        requested_by: opts.requested_by || 'cleanup',
        metadata: { subject: it.subject },
      });
    } catch (e) {
      results.errors++;
    }
  }
  results.deal_ids_unique = dealIds.size;

  // Requeue: dispara recalc nos deals afetados (V2 corrigida vai criar as corretas — em DRY_RUN audita)
  if (opts.requeue && typeof opts.triggerRecalc === 'function') {
    for (const dealId of dealIds) {
      try {
        opts.triggerRecalc(dealId, 'cleanup_v1_v2_migration', { requested_by: opts.requested_by || 'cleanup' });
        results.deals_requeued++;
      } catch (_) { /* fire-and-forget */ }
    }
  }

  return { ok: true, ...results };
}

/**
 * Detecta Tasks/Calls onde o Owner da atividade é DIFERENTE do Owner do Deal.
 * Sintoma clássico do bug V1 (round-robin colocou task em closer aleatório).
 *
 * Retorna { mismatches: [...], by_activity_owner: {...}, total }
 */
async function detectOwnerMismatch(zohoLib, { limit_deal_fetch = 500 } = {}) {
  if (!zohoLib) return { ok: false, error: 'zoho_lib_unavailable' };

  const [tasks, calls] = await Promise.all([_fetchBadTasks(zohoLib), _fetchBadCalls(zohoLib)]);
  const all = [
    ...tasks.map(t => ({ kind: 'task', id: t.id, subject: t.Subject, dueDate: t.Due_Date, owner: t.Owner, what: t.What_Id })),
    ...calls.map(c => ({ kind: 'call', id: c.id, subject: c.Subject, startTime: c.Call_Start_Time, owner: c.Owner, what: c.What_Id })),
  ];

  const dealCache = new Map();
  const mismatches = [];
  let dealsFetched = 0;

  for (const it of all) {
    const dealId = it.what?.id;
    if (!dealId) continue;

    let deal = dealCache.get(dealId);
    if (deal === undefined) {
      if (dealsFetched >= limit_deal_fetch) { dealCache.set(dealId, null); continue; }
      try {
        deal = await zohoLib.getDeal(dealId, 'Owner,Deal_Name,Stage,Pipeline,Layout,Categoria_do_Produto');
        dealsFetched++;
      } catch (_) { deal = null; }
      dealCache.set(dealId, deal);
    }
    if (!deal) continue;

    const dealOwnerId = deal.Owner?.id || null;
    const dealOwnerName = deal.Owner?.name || null;
    const actOwnerId = it.owner?.id || null;
    const actOwnerName = it.owner?.name || null;

    if (dealOwnerId && actOwnerId && dealOwnerId !== actOwnerId) {
      mismatches.push({
        kind: it.kind,
        activity_id: it.id,
        subject: it.subject,
        when: it.dueDate || it.startTime || null,
        deal_id: dealId,
        deal_name: deal.Deal_Name,
        deal_stage: deal.Stage,
        deal_pipeline: deal.Pipeline,
        deal_layout: deal.Layout?.name || deal.Layout,
        deal_owner: dealOwnerName,
        deal_owner_id: dealOwnerId,
        activity_owner: actOwnerName,
        activity_owner_id: actOwnerId,
      });
    }
  }

  // Agrupar por activity_owner (closer que recebeu task errada)
  const by_activity_owner = {};
  for (const m of mismatches) {
    const k = m.activity_owner || '(sem owner)';
    if (!by_activity_owner[k]) by_activity_owner[k] = 0;
    by_activity_owner[k]++;
  }
  // Agrupar por deal_owner também
  const by_deal_owner = {};
  for (const m of mismatches) {
    const k = m.deal_owner || '(sem owner)';
    if (!by_deal_owner[k]) by_deal_owner[k] = 0;
    by_deal_owner[k]++;
  }

  return {
    ok: true,
    total: mismatches.length,
    tasks_scanned: tasks.length,
    calls_scanned: calls.length,
    deals_fetched: dealsFetched,
    by_activity_owner, by_deal_owner,
    mismatches: mismatches.slice(0, 500),  // preview
    full_mismatches: mismatches,  // pra fix
  };
}

/**
 * Corrige mismatches: PUT Owner do deal nas Task/Call afetadas (ou cancela
 * se prefer canceled em vez de transferir).
 */
async function fixOwnerMismatch(pool, zohoLib, { dry_run = false, mode = 'transfer' } = {}) {
  const det = await detectOwnerMismatch(zohoLib);
  if (!det.ok) return det;

  const results = {
    ok: true, total: det.total, mode,
    fixed: 0, errors: 0, dry_run: !!dry_run,
    by_activity_owner: det.by_activity_owner,
  };

  if (dry_run) return { ...results, preview_sample: det.mismatches.slice(0, 30) };

  for (const m of (det.full_mismatches || det.mismatches)) {
    try {
      let r;
      if (mode === 'cancel') {
        if (m.kind === 'task') r = await zohoLib.updateTask(m.activity_id, { Status: 'Cancelled' });
        else                   r = await zohoLib.updateCall(m.activity_id, { Call_Status: 'Cancelled' });
      } else {
        // mode='transfer' — atualiza Owner pro do deal
        if (m.kind === 'task') r = await zohoLib.updateTask(m.activity_id, { Owner: { id: m.deal_owner_id } });
        else                   r = await zohoLib.updateCall(m.activity_id, { Owner: { id: m.deal_owner_id } });
      }
      if (r.ok) results.fixed++; else results.errors++;
      await db.insertActivityAudit(pool, {
        deal_id: m.deal_id, activity_kind: m.kind,
        owner_zoho_name: m.deal_owner, owner_zoho_id: m.deal_owner_id,
        target_user: m.activity_owner,
        status: r.ok ? (mode === 'cancel' ? 'MISMATCH_CANCELLED' : 'MISMATCH_FIXED') : 'MISMATCH_ERROR',
        block_reason: r.ok ? `Owner activity (${m.activity_owner}) != deal (${m.deal_owner}) — ${mode}` : (r.error || 'unknown'),
        zoho_id: m.activity_id,
        requested_by: 'cleanup-owner-mismatch',
        metadata: { subject: m.subject, deal_name: m.deal_name },
      });
    } catch (e) {
      results.errors++;
    }
  }
  return results;
}

module.exports = { cleanupBadActivities, detectOwnerMismatch, fixOwnerMismatch, TIER_REGEX };
