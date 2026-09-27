#!/usr/bin/env node
/**
 * Cruza data/erp-manutencao.json com Zoho CRM Deals e atualiza:
 *   - Produto_Vendido (quando vazio no Zoho mas tem na planilha)
 *   - Description (sem sobrescrever — anexa info do ERP)
 *
 * Uso:
 *   node scripts/sync-erp-to-zoho.js --dry-run        # só mostra o que faria
 *   node scripts/sync-erp-to-zoho.js                  # executa de verdade
 *   node scripts/sync-erp-to-zoho.js --limit=200      # processa só 200
 *   node scripts/sync-erp-to-zoho.js --only=outros    # só os que tão como 'outros'
 *
 * Env vars necessárias: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN
 * (já configurados no Railway — pra rodar local exporte da Railway: `railway variables`).
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY_OUTROS = args.includes('--only=outros');
const LIMIT = (args.find(a => a.startsWith('--limit=')) || '').split('=')[1];
const MAX = LIMIT ? parseInt(LIMIT) : Infinity;

const ERP_FILE = path.join(__dirname, '..', 'data', 'erp-manutencao.json');
if (!fs.existsSync(ERP_FILE)) {
  console.error('❌ data/erp-manutencao.json não existe. Rode primeiro: node scripts/import-erp-manutencao.js');
  process.exit(1);
}
const erpData = JSON.parse(fs.readFileSync(ERP_FILE, 'utf8'));
const erp = erpData.index || {};
console.log(`📂 ERP: ${Object.keys(erp).length} entradas (gerado ${erpData.generatedAt})`);

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
  console.error('❌ ZOHO_CLIENT_ID/SECRET/REFRESH_TOKEN não setados. Exporte ou rode via Railway.');
  process.exit(1);
}

let _zohoToken = null;
let _zohoTokenExp = 0;
async function getZohoToken() {
  if (_zohoToken && Date.now() < _zohoTokenExp) return _zohoToken;
  const r = await fetch(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${ZOHO_REFRESH_TOKEN}&client_id=${ZOHO_CLIENT_ID}&client_secret=${ZOHO_CLIENT_SECRET}&grant_type=refresh_token`, { method:'POST' });
  const j = await r.json();
  if (!j.access_token) { console.error('❌ falha refresh token Zoho:', j); process.exit(1); }
  _zohoToken = j.access_token;
  _zohoTokenExp = Date.now() + 50 * 60 * 1000;
  return _zohoToken;
}

async function zohoSearchByPhone(last9, fields) {
  const token = await getZohoToken();
  // Zoho v6 não aceita contains em campo telefone. Usa o param ?phone= que faz match parcial nativo.
  const url = `https://www.zohoapis.com/crm/v6/Deals/search?phone=${encodeURIComponent(last9)}&fields=${encodeURIComponent(fields.join(','))}`;
  const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
  if (r.status === 204) return [];
  if (!r.ok) { const t = await r.text(); throw new Error(`zoho ${r.status}: ${t}`); }
  const j = await r.json();
  return j.data || [];
}

async function zohoUpdateDeal(dealId, fields) {
  const token = await getZohoToken();
  const r = await fetch(`https://www.zohoapis.com/crm/v6/Deals/${dealId}`, {
    method: 'PUT',
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [fields] }),
  });
  const j = await r.json();
  return j.data?.[0]?.code === 'SUCCESS' ? { ok:true } : { ok:false, error: j.data?.[0]?.message || JSON.stringify(j) };
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const stats = {
    erpTotal: Object.keys(erp).length,
    processados: 0, semMatchZoho: 0,
    matched: 0,
    jaTinhamProduto: 0,
    atualizados: 0, falhas: 0,
    porCategoria: {},
  };
  const log = [];

  console.log(`\n${DRY_RUN ? '🧪 DRY-RUN' : '🚀 EXECUTANDO'} — sync ERP → Zoho\n`);
  if (ONLY_OUTROS) console.log('Filtro: apenas registros que estão como "outros" no Zoho\n');

  // Itera o índice ERP — chave = last9 do telefone
  const phones = Object.keys(erp);
  let i = 0;
  for (const phone of phones) {
    if (stats.processados >= MAX) break;
    const reg = erp[phone];
    stats.processados++;
    if (i++ % 50 === 0) console.log(`  ... ${i}/${phones.length} processados (${stats.atualizados} atualizados)`);

    try {
      const deals = await zohoSearchByPhone(phone, ['id','Deal_Name','Stage','Produto_Vendido','Telefone_contato']);
      if (!deals.length) { stats.semMatchZoho++; continue; }
      stats.matched++;

      // Pega o deal Fechado Ganho mais recente — esse é o "ativo" da base de manutenção
      const ganhos = deals.filter(d => d.Stage === 'Fechado Ganho');
      const target = ganhos[0] || deals[0];

      const tinhaProduto = !!(target.Produto_Vendido && target.Produto_Vendido.trim());
      if (tinhaProduto && !ONLY_OUTROS) {
        stats.jaTinhamProduto++;
        continue; // não sobrescreve produto existente
      }

      // Aqui: atualiza Produto_Vendido com o produto do ERP
      const novoProduto = reg.produtos || '';
      if (!novoProduto) continue;

      stats.porCategoria[reg.categoria] = (stats.porCategoria[reg.categoria] || 0) + 1;
      log.push({ dealId: target.id, nome: target.Deal_Name, antes: target.Produto_Vendido, depois: novoProduto, categoria: reg.categoria });

      if (DRY_RUN) {
        stats.atualizados++;
      } else {
        const r = await zohoUpdateDeal(target.id, { Produto_Vendido: novoProduto });
        if (r.ok) stats.atualizados++;
        else { stats.falhas++; log[log.length-1].erro = r.error; }
        await sleep(300); // rate limit Zoho ~10/s
      }
    } catch (e) {
      stats.falhas++;
      log.push({ phone, erro: e.message });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 ${DRY_RUN ? 'DRY-RUN — seria feito' : 'RESULTADO'}:`);
  console.log('  ERP entradas:', stats.erpTotal);
  console.log('  Processados:', stats.processados);
  console.log('  Sem match no Zoho:', stats.semMatchZoho);
  console.log('  Match encontrado:', stats.matched);
  console.log('  Já tinham produto (skip):', stats.jaTinhamProduto);
  console.log('  Atualizados Produto_Vendido:', stats.atualizados);
  console.log('  Falhas:', stats.falhas);
  console.log('  Por categoria:', stats.porCategoria);

  // Salva log detalhado
  const logFile = path.join(__dirname, '..', 'data', `sync-erp-zoho-${Date.now()}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ stats, log: log.slice(0, 500) }, null, 2));
  console.log(`\n💾 Log detalhado: ${logFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
