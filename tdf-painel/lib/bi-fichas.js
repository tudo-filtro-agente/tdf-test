// lib/bi-fichas.js — Storage das fichas financeiras por venda
//
// Cada ficha = custos editáveis adicionais sobre uma venda Zoho (Deal/Quote/Sales_Order).
// Os dados Zoho (cliente, valor, data, vendedor) NÃO são duplicados aqui; só os custos
// que o financeiro lança manualmente. Identificada por chave composta `module_zohoId`.
//
// Persistência: data/bi-fichas-vendas.json (compartilhado entre todos usuários do portal).

const fs = require('fs');
const path = require('path');

const DATA_DIR  = path.join(__dirname, '..', 'data');
const FILE      = path.join(DATA_DIR, 'bi-fichas-vendas.json');
const MAP_FILE  = path.join(DATA_DIR, 'bi-empresa-mapping.json'); // squad → empresaBI (não usado por enquanto, reservado)

const CUSTO_FIELDS = [
  'custoProduto',   // CMV adicional além do que vem do Zoho
  'frete',
  'taxaCartao',
  'comissao',
  'instalacao',
  'material',       // material de instalação
  'materialTrabalho', // material de trabalho
  'gasolina',       // deslocamento
  'pedagio',
  'maoDeObra',
  'operacional',    // custo operacional estimado
  'garantia',       // garantia/retrabalho
  'custoLogistico', // rateio automático do custo de rota (km × custo/km / N entregas) — preenchido server-side via bi-rotas-custo
  'custoMateriais', // materiais consumidos na OS (F4) — preenchido server-side via bi-os-materiais
  'outros',
  'desconto',       // desconto concedido
];

function _ensureFile() {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(_){}
  if (!fs.existsSync(FILE)) {
    try { fs.writeFileSync(FILE, '{}'); } catch(_){}
  }
}

function _key(module, zohoId) { return `${module}_${zohoId}`; }

function loadAll() {
  _ensureFile();
  try {
    const raw = fs.readFileSync(FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch(e) {
    console.warn('[bi-fichas] loadAll falhou, retornando {}', e.message);
    return {};
  }
}

function saveAll(map) {
  _ensureFile();
  try {
    fs.writeFileSync(FILE, JSON.stringify(map, null, 2));
    return true;
  } catch(e) {
    console.error('[bi-fichas] saveAll falhou', e.message);
    return false;
  }
}

function defaultFicha(module, zohoId) {
  const c = {};
  CUSTO_FIELDS.forEach(f => c[f] = 0);
  return {
    module,
    zohoId,
    empresaBI: '',          // mapeamento manual depois
    formaPagamento: '',
    statusFinanceiro: '',   // calculado em runtime, não persistido aqui
    custos: c,
    obs: '',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    updatedBy: null,
  };
}

function get(module, zohoId) {
  const all = loadAll();
  const k = _key(module, zohoId);
  return all[k] || null;
}

function getOrInit(module, zohoId) {
  return get(module, zohoId) || defaultFicha(module, zohoId);
}

function upsert(module, zohoId, patch, who) {
  const all = loadAll();
  const k = _key(module, zohoId);
  const cur = all[k] || defaultFicha(module, zohoId);
  // Sanitiza custos: só campos válidos, números >= 0
  const next = { ...cur };
  if (patch.empresaBI !== undefined)       next.empresaBI = String(patch.empresaBI || '');
  if (patch.formaPagamento !== undefined)  next.formaPagamento = String(patch.formaPagamento || '');
  if (patch.obs !== undefined)             next.obs = String(patch.obs || '');
  if (patch.custos && typeof patch.custos === 'object') {
    next.custos = { ...cur.custos };
    CUSTO_FIELDS.forEach(f => {
      if (patch.custos[f] !== undefined) {
        const v = Number(patch.custos[f]);
        next.custos[f] = isFinite(v) && v >= 0 ? v : 0;
      }
    });
  }
  next.updatedAt = new Date().toISOString();
  next.updatedBy = who || 'sistema';
  all[k] = next;
  saveAll(all);
  return next;
}

function remove(module, zohoId) {
  const all = loadAll();
  const k = _key(module, zohoId);
  if (all[k]) { delete all[k]; saveAll(all); return true; }
  return false;
}

// Lista todas as fichas (índice rápido por chave composta)
function indexAll() {
  return loadAll();
}

// Empresa mapping (squad → empresaBI). Estrutura: { "filtro": "id_xxx", ... }
function loadMapping() {
  try {
    if (!fs.existsSync(MAP_FILE)) return {};
    return JSON.parse(fs.readFileSync(MAP_FILE, 'utf8') || '{}');
  } catch(_) { return {}; }
}

function saveMapping(mapping) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(MAP_FILE, JSON.stringify(mapping || {}, null, 2));
    return true;
  } catch(e) {
    console.error('[bi-fichas] saveMapping', e.message); return false;
  }
}

// Cálculo do lucro real de uma venda (puro, sem efeitos colaterais).
// `venda` = objeto normalizado vindo do Zoho. `ficha` = ficha persistida (ou default).
function calcLucro(venda, ficha) {
  const valorBruto = Number(venda?.valor || 0);
  const desconto   = Number(ficha?.custos?.desconto || 0);
  const receitaLiquida = Math.max(0, valorBruto - desconto);
  let custoTotal = 0;
  CUSTO_FIELDS.forEach(f => { if (f !== 'desconto') custoTotal += Number(ficha?.custos?.[f] || 0); });
  const lucro = receitaLiquida - custoTotal;
  const margemBruta = valorBruto > 0 ? (valorBruto - Number(ficha?.custos?.custoProduto || 0)) / valorBruto : 0;
  const margemContrib = receitaLiquida > 0 ? (receitaLiquida - custoTotal) / receitaLiquida : 0;
  const margemLiquida = receitaLiquida > 0 ? lucro / receitaLiquida : 0;
  let status = 'sem-dados';
  if (custoTotal > 0 || receitaLiquida > 0) {
    if (lucro < 0) status = 'prejuizo';
    else if (margemLiquida < 0.10) status = 'atencao';
    else status = 'lucrativa';
  }
  return {
    valorBruto, desconto, receitaLiquida, custoTotal,
    lucro, margemBruta, margemContrib, margemLiquida, status
  };
}

module.exports = {
  CUSTO_FIELDS,
  loadAll,
  saveAll,
  get,
  getOrInit,
  upsert,
  remove,
  indexAll,
  defaultFicha,
  loadMapping,
  saveMapping,
  calcLucro,
};
