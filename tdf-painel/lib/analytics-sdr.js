// Analytics SDR — funil de pré-venda por pessoa e período.
// Fonte: Zoho (Calls + Tasks + Deals) via lib/zoho.js. Cache em memória de 10 min
// por período, porque a conta varre milhares de registros.
const zoho = require('./zoho');

// Pré-vendas acompanhados. Ajustar aqui quando o time mudar.
const SDRS = [
  { id: '6311862000259482001', nome: 'Lucas' },
  { id: '6311862000259481001', nome: 'Walmir' },
  { id: '6311862000265139001', nome: 'Nicole' },
  { id: '6311862000265565001', nome: 'Danúbia' },
  { id: '6311862000265382001', nome: 'Evandra' },
];

const PERIODOS = { hoje: 1, '7d': 7, '30d': 30 };
const AVANCO = ['Qualificado', 'Proposta', 'Agendado'];
const GANHO = (s) => (s || '').toLowerCase().startsWith('fechado ganho');
const LIGACAO_RE = /(LIGA|LIGAR|CHAMADA)/i;

const cache = {}; // { periodo: { ts, data } }

function isoInicio(dias) {
  const d = new Date(Date.now() - (dias - 1) * 86400000);
  const brt = new Date(d.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const ymd = `${brt.getFullYear()}-${String(brt.getMonth() + 1).padStart(2, '0')}-${String(brt.getDate()).padStart(2, '0')}`;
  return `${ymd}T00:00:00-03:00`;
}

function ligacaoReal(c) {
  const desc = (c.Description || '').toLowerCase();
  return desc.includes('goto') || Number(c.Call_Duration_in_seconds || 0) > 5;
}

async function stagesAtuais(ids) {
  const out = {};
  for (let i = 0; i < ids.length; i += 100) {
    const lote = ids.slice(i, i + 100);
    const r = await zoho.fetch(`/Deals?ids=${lote.join(',')}&fields=Stage,Deal_Name,Amount`);
    if (!r.ok) continue;
    const j = await r.json().catch(() => ({}));
    for (const d of j.data || []) out[d.id] = d;
  }
  return out;
}

async function calculaSdr(uid, ini) {
  const calls = await zoho.searchModule('Calls',
    `((Owner:equals:${uid})and(Call_Start_Time:greater_equal:${ini}))`,
    'Call_Start_Time,Call_Duration_in_seconds,Description,What_Id,Who_Id', { maxPages: 15 });
  const reais = (calls || []).filter(ligacaoReal);
  const con30 = reais.filter((c) => Number(c.Call_Duration_in_seconds || 0) > 30);
  const pessoas = new Set(reais.map((c) => c.What_Id?.id || c.Who_Id?.id).filter(Boolean));
  const callsPorDeal = {};
  for (const c of reais) {
    const wid = c.What_Id?.id;
    if (wid) callsPorDeal[wid] = (callsPorDeal[wid] || 0) + 1;
  }
  const dealIds = Object.keys(callsPorDeal);

  const tasks = await zoho.searchModule('Tasks',
    `((Owner:equals:${uid})and(Modified_Time:greater_equal:${ini}))`,
    'Subject,Status,What_Id', { maxPages: 10 });
  const lig = (tasks || []).filter((t) => LIGACAO_RE.test(t.Subject || '') && t.What_Id?.id);
  const done = lig.filter((t) => t.Status === 'Completado');
  const fantasma = done.filter((t) => !callsPorDeal[t.What_Id.id]).length;

  const stages = await stagesAtuais(dealIds);
  let qual = 0, prop = 0, ganho = 0, perdido = 0;
  for (const id of dealIds) {
    const s = stages[id]?.Stage || '';
    if (s === 'Qualificado') qual++;
    else if (s === 'Proposta' || s === 'Agendado') prop++;
    else if (GANHO(s)) ganho++;
    else if (s.toLowerCase().startsWith('fechado perdido')) perdido++;
  }
  return {
    discagens: reais.length,
    conectadas30: con30.length,
    pessoas: pessoas.size,
    leadsLigados: dealIds.length,
    emQualificado: qual,
    emPropostaAgendado: prop,
    ganho,
    perdido,
    tarefasLigacaoConcluidas: done.length,
    conclusoesSemLigacao: fantasma,
    taxaAvanco: dealIds.length ? Math.round(((qual + prop + ganho) / dealIds.length) * 100) : 0,
  };
}

async function analytics(periodo) {
  const dias = PERIODOS[periodo] || 7;
  const hit = cache[periodo];
  if (hit && Date.now() - hit.ts < 10 * 60 * 1000) return hit.data;
  const ini = isoInicio(dias);
  const linhas = [];
  for (const s of SDRS) {
    try {
      linhas.push({ nome: s.nome, ...(await calculaSdr(s.id, ini)) });
    } catch (e) {
      linhas.push({ nome: s.nome, erro: e.message });
    }
  }
  const data = { periodo, inicio: ini.slice(0, 10), geradoEm: new Date().toISOString(), linhas };
  cache[periodo] = { ts: Date.now(), data };
  return data;
}

module.exports = { analytics, SDRS, PERIODOS };
