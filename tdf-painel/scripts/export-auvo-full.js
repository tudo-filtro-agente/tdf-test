#!/usr/bin/env node
/**
 * Export completo do Auvo — pra eventualmente substituir o Auvo por app próprio.
 *
 * Puxa TUDO via API e salva em data/auvo-export/<entidade>.json:
 *   - customers.json     — todos os clientes Auvo (cadastro completo)
 *   - tasks.json         — todas as tasks (visitas) dos últimos N anos
 *   - tasks-detalhe/     — cada task com fotos/checklists em arquivo separado
 *   - users.json         — todos os técnicos
 *   - taskTypes.json     — tipos de tarefa
 *   - products.json      — produtos cadastrados (se houver)
 *   - quotes.json        — orçamentos/serviços (se houver)
 *   - gps-recente.json   — última posição de cada técnico
 *
 * Uso:
 *   railway run --service tdf-portal node scripts/export-auvo-full.js
 *   node scripts/export-auvo-full.js --years=2 --limit-tasks=500   # limites menores
 *   node scripts/export-auvo-full.js --skip-task-details           # pula a busca individual
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const YEARS = parseInt((args.find(a => a.startsWith('--years=')) || '').split('=')[1] || '5');
const LIMIT_TASKS = parseInt((args.find(a => a.startsWith('--limit-tasks=')) || '').split('=')[1] || '0') || Infinity;
const SKIP_DETAILS = args.includes('--skip-task-details');

const AUVO_KEY = process.env.AUVO_API_KEY;
const AUVO_TOK = process.env.AUVO_TOKEN;
const AUVO_BASE = process.env.AUVO_BASE_URL || 'https://api.auvo.com.br/v2';
if (!AUVO_KEY || !AUVO_TOK) { console.error('❌ AUVO_API_KEY / AUVO_TOKEN faltando'); process.exit(1); }

const OUT_DIR = path.join(__dirname, '..', 'data', 'auvo-export');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, 'tasks-detalhe'), { recursive: true });

let _token = null;
async function login() {
  const r = await fetch(`${AUVO_BASE}/login/?apiKey=${AUVO_KEY}&apiToken=${AUVO_TOK}`);
  const j = await r.json();
  _token = j?.result?.accessToken || j?.accessToken;
  if (!_token) throw new Error('Auvo login falhou: ' + JSON.stringify(j).slice(0, 200));
  console.log('✅ Auvo login ok');
}

async function call(p) {
  const r = await fetch(`${AUVO_BASE}${p}`, { headers: { 'Authorization': `Bearer ${_token}` } });
  if (r.status === 401) { await login(); return call(p); }
  if (r.status === 403) { console.warn('  ⚠️ rate limit (espera 5s)'); await new Promise(s => setTimeout(s, 5000)); return call(p); }
  return r.json();
}

async function paginar(pathBase, pageSize = 200) {
  const out = [];
  for (let page = 1; page <= 200; page++) {
    const sep = pathBase.includes('?') ? '&' : '?';
    const j = await call(`${pathBase}${sep}page=${page}&pageSize=${pageSize}&order=desc`);
    const arr = j?.result?.entityList || j?.entityList || [];
    if (!arr.length) break;
    out.push(...arr);
    process.stdout.write(`\r  página ${page}: +${arr.length} (total ${out.length})  `);
    if (arr.length < pageSize) break;
  }
  console.log();
  return out;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  await login();
  const stats = {};

  // 1. Users (técnicos)
  console.log('\n👷 Users…');
  const users = await paginar('/users/?paramFilter=');
  fs.writeFileSync(path.join(OUT_DIR, 'users.json'), JSON.stringify(users, null, 2));
  stats.users = users.length;

  // 2. TaskTypes
  console.log('\n📋 TaskTypes…');
  const taskTypes = await paginar('/taskTypes/?paramFilter=');
  fs.writeFileSync(path.join(OUT_DIR, 'taskTypes.json'), JSON.stringify(taskTypes, null, 2));
  stats.taskTypes = taskTypes.length;

  // 3. Customers
  console.log('\n👥 Customers…');
  const customers = await paginar('/customers/?paramFilter=');
  fs.writeFileSync(path.join(OUT_DIR, 'customers.json'), JSON.stringify(customers, null, 2));
  stats.customers = customers.length;

  // 4. Products
  try {
    console.log('\n📦 Products…');
    const products = await paginar('/products/?paramFilter=');
    fs.writeFileSync(path.join(OUT_DIR, 'products.json'), JSON.stringify(products, null, 2));
    stats.products = products.length;
  } catch(e) { console.log('  (products não disponível)'); stats.products = 0; }

  // 5. Quotes
  try {
    console.log('\n💰 Quotes…');
    const quotes = await paginar('/quotes/?paramFilter=');
    fs.writeFileSync(path.join(OUT_DIR, 'quotes.json'), JSON.stringify(quotes, null, 2));
    stats.quotes = quotes.length;
  } catch(e) { console.log('  (quotes não disponível)'); stats.quotes = 0; }

  // 6. Tasks (todas dos últimos N anos)
  console.log(`\n📅 Tasks (últimos ${YEARS} anos)…`);
  const today = new Date().toISOString().slice(0, 10);
  const dStart = new Date(); dStart.setFullYear(dStart.getFullYear() - YEARS);
  const filter = encodeURIComponent(JSON.stringify({ startDate: dStart.toISOString().slice(0,10), endDate: today }));
  let tasks = await paginar(`/tasks/?paramFilter=${filter}`);
  if (tasks.length > LIMIT_TASKS) tasks = tasks.slice(0, LIMIT_TASKS);
  fs.writeFileSync(path.join(OUT_DIR, 'tasks.json'), JSON.stringify(tasks, null, 2));
  stats.tasks = tasks.length;

  // 7. Detalhe de cada task (com fotos/checklists/respostas) — pesado, opcional
  if (!SKIP_DETAILS) {
    console.log(`\n🔍 Detalhe completo de cada task (com fotos/checklists)…`);
    let detailsCount = 0, skipped = 0;
    for (const t of tasks) {
      const tid = t.taskID || t.id;
      if (!tid) { skipped++; continue; }
      const detailFile = path.join(OUT_DIR, 'tasks-detalhe', `${tid}.json`);
      if (fs.existsSync(detailFile)) { skipped++; continue; }
      try {
        const j = await call(`/tasks/${tid}/`);
        const det = j?.result?.entity || j?.entity || j;
        fs.writeFileSync(detailFile, JSON.stringify(det, null, 2));
        detailsCount++;
        if (detailsCount % 50 === 0) process.stdout.write(`\r  ${detailsCount}/${tasks.length}  `);
        await sleep(150); // rate limit
      } catch(e) { console.log('  ⚠️ task '+tid+': '+e.message); }
    }
    console.log(`\n  ✓ ${detailsCount} detalhes baixados (${skipped} já existiam)`);
    stats.taskDetalhes = detailsCount;
  }

  // 8. GPS última posição (snapshot atual)
  console.log('\n📍 GPS (última posição de cada técnico)…');
  const gpsRecente = {};
  for (const u of users) {
    const uid = u.userId || u.id;
    if (!uid) continue;
    try {
      const filter2 = encodeURIComponent(JSON.stringify({ userId: uid }));
      const j = await call(`/gps/?paramFilter=${filter2}&page=1&pageSize=1&order=desc`);
      const last = (j?.result?.entityList || j?.entityList || [])[0];
      if (last) gpsRecente[uid] = { user: u.name || u.userName, ...last };
      await sleep(200);
    } catch(e) {}
  }
  fs.writeFileSync(path.join(OUT_DIR, 'gps-recente.json'), JSON.stringify(gpsRecente, null, 2));
  stats.gpsRecente = Object.keys(gpsRecente).length;

  // Manifest
  const manifest = {
    exportedAt: new Date().toISOString(),
    exportYears: YEARS,
    stats,
    files: fs.readdirSync(OUT_DIR).filter(f => !f.startsWith('.') && f !== 'tasks-detalhe').map(f => ({ name: f, size: fs.statSync(path.join(OUT_DIR, f)).size })),
    detailsCount: fs.readdirSync(path.join(OUT_DIR, 'tasks-detalhe')).length,
  };
  fs.writeFileSync(path.join(OUT_DIR, '_manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('✅ EXPORT COMPLETO\n');
  console.log('Estatísticas:');
  for (const k of Object.keys(stats)) console.log(`  ${k.padEnd(20)} ${stats[k]}`);
  console.log(`\nArquivos em: ${OUT_DIR}`);
  console.log(`Manifest: ${path.join(OUT_DIR, '_manifest.json')}`);
}

main().catch(e => { console.error('\n❌ ERRO:', e.message); process.exit(1); });
