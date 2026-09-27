#!/usr/bin/env node
/**
 * dedup-deal-tasks.js
 *
 * Pra cada deal com >1 task ABERTA (Status != Completed/Cancelled/Closed/Concluído),
 * mantém apenas a mais RECENTE e deleta as outras — desde que o Owner da task seja
 * closer ATIVO.
 *
 * Uso:
 *   node scripts/dedup-deal-tasks.js              # dry-run (default)
 *   node scripts/dedup-deal-tasks.js --apply      # executa delete
 *   node scripts/dedup-deal-tasks.js --since-days=30 --apply
 *   node scripts/dedup-deal-tasks.js --max-pages=50
 *
 * Requer envs: ZOHO_REFRESH_TOKEN, ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET (mesmo do portal).
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const zoho = require('../lib/zoho');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const SINCE_DAYS = (() => {
  const a = args.find(x => x.startsWith('--since-days='));
  return a ? Number(a.split('=')[1]) : 60;
})();
const MAX_PAGES = (() => {
  const a = args.find(x => x.startsWith('--max-pages='));
  return a ? Number(a.split('=')[1]) : 200;
})();

// Closers ATIVOS no Zoho (Owner.name como aparece no CRM).
// Alinhado com USERS de server.js após exclusões (Laudrik, Marcus, Giseli saíram).
const ACTIVE_OWNER_NAMES = new Set([
  'guilherme henrique',
  'tiago souza',
  'júlia souza', 'julia souza',
  'gabriel martins',
  'gabriel ferreira',
  'italo alexandre',
  'catia americo',
  'fabiana terra',
  'larissa.p',
  'gabriel moraes',
  'morgana',
]);

const CLOSED_STATUSES = new Set(['completed', 'cancelled', 'canceled', 'closed', 'concluído', 'concluido', 'fechada', 'fechado']);

function isOwnerActive(ownerName) {
  if (!ownerName) return false;
  const norm = String(ownerName).toLowerCase().trim();
  if (ACTIVE_OWNER_NAMES.has(norm)) return true;
  // match por primeiro nome
  const first = norm.split(' ')[0];
  for (const a of ACTIVE_OWNER_NAMES) {
    if (a.split(' ')[0] === first) return true;
  }
  return false;
}

function isOpenStatus(status) {
  if (!status) return true; // sem status → considera aberto
  return !CLOSED_STATUSES.has(String(status).toLowerCase().trim());
}

async function fetchOpenTasks() {
  const token = await zoho.getToken();
  if (!token) throw new Error('sem token Zoho');
  const since = new Date(Date.now() - SINCE_DAYS * 86400000).toISOString().split('.')[0] + '-03:00';
  // criteria: not completed and recently created
  const crit = `(Created_Time:greater_equal:${since})`;
  let all = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${zoho.BASE || 'https://www.zohoapis.com/crm/v6'}/Tasks/search?criteria=${encodeURIComponent(crit)}&fields=Subject,Status,Owner,What_Id,Created_Time&per_page=200&page=${page}`;
    const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
    if (r.status === 204) break;
    if (!r.ok) {
      console.warn(`[fetch] page ${page} status ${r.status}`);
      break;
    }
    const j = await r.json().catch(() => ({}));
    const data = (j.data || []).filter(t => isOpenStatus(t.Status));
    all = all.concat(data);
    process.stdout.write(`\rpaginas=${page} tasks=${all.length}     `);
    if (!j.data || j.data.length < 200) break;
  }
  process.stdout.write('\n');
  return all;
}

async function deleteBatch(ids) {
  const token = await zoho.getToken();
  const url = `${zoho.BASE || 'https://www.zohoapis.com/crm/v6'}/Tasks?ids=${ids.join(',')}&wf_trigger=false`;
  const r = await fetch(url, { method: 'DELETE', headers: { Authorization: `Zoho-oauthtoken ${token}` } });
  const j = await r.json().catch(() => ({}));
  const success = (j.data || []).filter(d => d.status === 'success').length;
  return { success, total: ids.length, raw: j };
}

(async () => {
  console.log(`[dedup-deal-tasks] mode=${APPLY ? 'APPLY' : 'DRY-RUN'} since_days=${SINCE_DAYS} max_pages=${MAX_PAGES}`);
  const tasks = await fetchOpenTasks();
  console.log(`[dedup-deal-tasks] tasks abertas encontradas: ${tasks.length}`);

  const byDeal = new Map();
  let skipNoDeal = 0;
  let skipOwnerInactive = 0;
  for (const t of tasks) {
    const dealId = t.What_Id?.id;
    if (!dealId) { skipNoDeal++; continue; }
    if (!isOwnerActive(t.Owner?.name)) { skipOwnerInactive++; continue; }
    if (!byDeal.has(dealId)) byDeal.set(dealId, []);
    byDeal.get(dealId).push(t);
  }

  const toDelete = [];
  const dealReports = [];
  for (const [dealId, list] of byDeal) {
    if (list.length <= 1) continue;
    list.sort((a, b) => new Date(b.Created_Time) - new Date(a.Created_Time));
    const [keep, ...rest] = list;
    toDelete.push(...rest.map(t => t.id));
    dealReports.push({
      deal_id: dealId,
      kept: { id: keep.id, subject: keep.Subject, owner: keep.Owner?.name, created: keep.Created_Time },
      deleted: rest.map(t => ({ id: t.id, subject: t.Subject, owner: t.Owner?.name, created: t.Created_Time })),
    });
  }

  console.log('');
  console.log(`Tasks sem What_Id (skip):       ${skipNoDeal}`);
  console.log(`Tasks de owner inativo (skip):  ${skipOwnerInactive}`);
  console.log(`Deals com tasks abertas:        ${byDeal.size}`);
  console.log(`Deals com duplicatas:           ${dealReports.length}`);
  console.log(`Tasks a deletar:                ${toDelete.length}`);
  console.log('');
  console.log('Amostra (até 5 deals):');
  for (const r of dealReports.slice(0, 5)) {
    console.log(`  Deal ${r.deal_id} | manter "${r.kept.subject?.slice(0, 50)}" (${r.kept.owner}, ${r.kept.created})`);
    for (const d of r.deleted) {
      console.log(`    - DEL ${d.id} | "${d.subject?.slice(0, 50)}" (${d.owner}, ${d.created})`);
    }
  }

  if (!APPLY) {
    console.log('');
    console.log('Dry-run finalizado. Pra deletar de verdade, rode com --apply');
    return;
  }

  console.log('');
  console.log(`Deletando ${toDelete.length} tasks em batches de 100...`);
  let deleted = 0;
  for (let i = 0; i < toDelete.length; i += 100) {
    const batch = toDelete.slice(i, i + 100);
    try {
      const out = await deleteBatch(batch);
      deleted += out.success;
      process.stdout.write(`\rDeletadas: ${deleted}/${toDelete.length}     `);
      await new Promise(r => setTimeout(r, 300)); // rate-limit gentle
    } catch (e) {
      console.warn(`\nErro batch start=${i}:`, e.message);
    }
  }
  process.stdout.write('\n');
  console.log(`[dedup-deal-tasks] FINISHED. deleted=${deleted}/${toDelete.length}`);
})().catch(e => { console.error(e); process.exit(1); });
