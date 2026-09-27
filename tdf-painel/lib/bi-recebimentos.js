// lib/bi-recebimentos.js — Workflow contas a receber
//
// State machine:
//   a-receber → {recebido, parcial, cancelado}
//   parcial   → recebido (quando completar)
//   recebido  é terminal (credita banco + cria extrato).
//
// Auditoria: usa o mesmo append-only de bi-pagamentos (data/bi-auditoria.json) — trilha única.

const fs = require('fs');
const path = require('path');
const bancos = require('./bi-bancos');
const pagamentos = require('./bi-pagamentos'); // pra reusar audit()

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE     = path.join(DATA_DIR, 'bi-recebimentos.json');

const STATUS = {
  A_RECEBER:  'a-receber',
  PARCIAL:    'parcial',
  RECEBIDO:   'recebido',
  CANCELADO:  'cancelado',
};

function _ensure() {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(_){}
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '{}');
}
function _load() { _ensure(); try { return JSON.parse(fs.readFileSync(FILE,'utf8')||'{}'); } catch(e){ return {}; } }
function _save(o) { _ensure(); try { fs.writeFileSync(FILE, JSON.stringify(o,null,2)); return true; } catch(e){ return false; } }

const uid = () => 'rc_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

function defaultRecebimento() {
  return {
    id: '',
    empresaBI: '',
    cliente: '',
    dealZohoId: '',          // ref pra venda Zoho (Deal/Quote/SO)
    dealZohoModule: '',      // Deals|Quotes|Sales_Orders
    descricao: '',
    categoria: '',
    valor: 0,                // valor original
    valorRecebido: 0,        // acumulado quando há parcelas/parcial
    vencimento: '',
    formaPagamento: '',      // PIX, Boleto, TED...
    chavePix: '',
    anexoUrl: '',
    contaBancariaCredito: '', // banco onde caiu o $$
    status: STATUS.A_RECEBER,
    dataRecebimento: null,
    obs: '',
    historico: [],
    extratoEntries: [],      // ids dos movimentos no extrato (parciais geram múltiplos)
    createdAt: new Date().toISOString(),
    updatedAt: null,
    createdBy: '',
  };
}

const EDITAVEIS = ['empresaBI','cliente','dealZohoId','dealZohoModule','descricao','categoria','valor','vencimento','formaPagamento','chavePix','anexoUrl','contaBancariaCredito','obs'];

function _applyFields(r, patch) {
  EDITAVEIS.forEach(k => {
    if (patch[k] === undefined) return;
    if (k === 'valor') r[k] = Number(patch[k]) || 0;
    else r[k] = String(patch[k] || '').trim();
  });
}

function _addHistorico(r, tipo, usuario, payload) {
  if (!r.historico) r.historico = [];
  r.historico.push({ tipo, ts: new Date().toISOString(), usuario, payload: payload || null });
}

// === CRUD ===
function get(id) { return _load()[id] || null; }
function listAll() { return Object.values(_load()); }
function listFiltered(filtro = {}) {
  let arr = listAll();
  if (filtro.status)    arr = arr.filter(r => r.status === filtro.status);
  if (filtro.empresaBI) arr = arr.filter(r => r.empresaBI === filtro.empresaBI);
  if (filtro.statusIn)  arr = arr.filter(r => filtro.statusIn.includes(r.status));
  arr.sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||''));
  return arr;
}

function criar(patch, who) {
  const map = _load();
  const cur = defaultRecebimento();
  cur.id = uid();
  cur.createdBy = who || '';
  _applyFields(cur, patch);
  cur.status = STATUS.A_RECEBER;
  _addHistorico(cur, 'criado', who, { from: 'novo' });
  map[cur.id] = cur;
  _save(map);
  pagamentos.audit({ tipo:'recebimento-criar', recebimentoId: cur.id, usuario: who, valor: cur.valor, empresaBI: cur.empresaBI, dealZohoId: cur.dealZohoId });
  return cur;
}

function editar(id, patch, who) {
  const map = _load();
  const cur = map[id];
  if (!cur) return { ok:false, error:'recebimento não existe' };
  if (cur.status === STATUS.RECEBIDO) return { ok:false, error:'não é possível editar recebimento já efetivado' };
  _applyFields(cur, patch);
  cur.updatedAt = new Date().toISOString();
  _addHistorico(cur, 'editado', who, patch);
  _save(map);
  pagamentos.audit({ tipo:'recebimento-editar', recebimentoId: id, usuario: who, patch });
  return { ok:true, recebimento: cur };
}

function remover(id, who) {
  const map = _load();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status === STATUS.RECEBIDO || cur.status === STATUS.PARCIAL) {
    return { ok:false, error:'já tem valor recebido — use cancelar (gera estorno se preferir)' };
  }
  delete map[id];
  _save(map);
  pagamentos.audit({ tipo:'recebimento-remover', recebimentoId: id, usuario: who });
  return { ok:true };
}

// Marca como recebido total — credita banco + extrato
function marcarRecebido(id, who, opts = {}) {
  const map = _load();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status === STATUS.RECEBIDO) return { ok:false, error:'já recebido' };
  if (cur.status === STATUS.CANCELADO) return { ok:false, error:'cancelado, não pode receber' };
  const contaId = opts.contaBancariaId || cur.contaBancariaCredito;
  if (!contaId) return { ok:false, error:'selecione conta bancária de crédito' };
  const conta = bancos.get(contaId);
  if (!conta) return { ok:false, error:'conta bancária não encontrada' };
  // Valor a creditar = restante (valor - valorRecebido)
  const restante = +(Number(cur.valor||0) - Number(cur.valorRecebido||0)).toFixed(2);
  if (restante <= 0) return { ok:false, error:'nada a receber' };
  const ref = {
    descricao: `Recebimento — ${cur.cliente} — ${cur.descricao||''}`.slice(0,200),
    refTipo: 'recebimento', refId: cur.id, obs: opts.obs || '',
  };
  const r = bancos.creditar(contaId, restante, ref, who);
  if (!r.ok) return r;
  cur.status = STATUS.RECEBIDO;
  cur.valorRecebido = Number(cur.valor) || 0;
  cur.contaBancariaCredito = contaId;
  cur.dataRecebimento = new Date().toISOString();
  if (!cur.extratoEntries) cur.extratoEntries = [];
  cur.extratoEntries.push(r.entry.id);
  _addHistorico(cur, 'recebido', who, { contaId, valorCreditado: restante, novoSaldo: r.novoSaldo, extratoId: r.entry.id });
  _save(map);
  pagamentos.audit({ tipo:'recebimento-pago', recebimentoId: id, usuario: who, contaBancariaId: contaId, valor: restante, novoSaldo: r.novoSaldo });
  return { ok:true, recebimento: cur, novoSaldo: r.novoSaldo, extrato: r.entry };
}

// Recebimento parcial: credita só o valor informado, mantém status='parcial'
function recebimentoParcial(id, who, opts = {}) {
  const map = _load();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status === STATUS.RECEBIDO) return { ok:false, error:'já totalmente recebido' };
  if (cur.status === STATUS.CANCELADO) return { ok:false, error:'cancelado' };
  const contaId = opts.contaBancariaId || cur.contaBancariaCredito;
  if (!contaId) return { ok:false, error:'selecione conta bancária' };
  const valor = Number(opts.valor) || 0;
  if (valor <= 0) return { ok:false, error:'valor inválido' };
  const restante = +(Number(cur.valor||0) - Number(cur.valorRecebido||0)).toFixed(2);
  if (valor > restante + 0.001) return { ok:false, error:`valor excede o restante (${restante.toFixed(2)})` };
  const ref = {
    descricao: `Recebimento parcial — ${cur.cliente} — ${cur.descricao||''}`.slice(0,200),
    refTipo: 'recebimento', refId: cur.id, obs: opts.obs || '',
  };
  const r = bancos.creditar(contaId, valor, ref, who);
  if (!r.ok) return r;
  cur.valorRecebido = +(Number(cur.valorRecebido||0) + valor).toFixed(2);
  cur.contaBancariaCredito = contaId;
  if (!cur.extratoEntries) cur.extratoEntries = [];
  cur.extratoEntries.push(r.entry.id);
  // Se completou, vira recebido; senão parcial
  const novoRestante = +(Number(cur.valor||0) - cur.valorRecebido).toFixed(2);
  if (novoRestante <= 0.001) {
    cur.status = STATUS.RECEBIDO;
    cur.dataRecebimento = new Date().toISOString();
  } else {
    cur.status = STATUS.PARCIAL;
  }
  _addHistorico(cur, 'recebimento-parcial', who, { valor, contaId, restante: novoRestante, extratoId: r.entry.id });
  _save(map);
  pagamentos.audit({ tipo:'recebimento-parcial', recebimentoId: id, usuario: who, valor, novoSaldo: r.novoSaldo, restante: novoRestante });
  return { ok:true, recebimento: cur, novoSaldo: r.novoSaldo, restante: novoRestante };
}

function cancelar(id, who, motivo) {
  const map = _load();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status === STATUS.RECEBIDO) return { ok:false, error:'já recebido — não cancela; faça estorno manual' };
  cur.status = STATUS.CANCELADO;
  cur.obs = (cur.obs ? cur.obs+'\n' : '') + '[CANCELADO] ' + (motivo || '');
  _addHistorico(cur, 'cancelado', who, { motivo });
  _save(map);
  pagamentos.audit({ tipo:'recebimento-cancelar', recebimentoId: id, usuario: who, motivo });
  return { ok:true, recebimento: cur };
}

// Cria recebimento a partir de uma venda Zoho (Deal/Quote/SO)
// Usado pelo botão "Gerar a-receber" no modal Vendas Zoho.
function criarFromVendaZoho({ module, zohoId, cliente, valor, dataVencimento, empresaBI, descricao, categoria }, who) {
  // Anti-duplicidade: se já existir um recebimento com este zohoId+module, retorna o existente
  const map = _load();
  const existing = Object.values(map).find(r => r.dealZohoId === zohoId && r.dealZohoModule === module && r.status !== STATUS.CANCELADO);
  if (existing) return { ok:true, recebimento: existing, jaExistia: true };
  const r = criar({
    empresaBI: empresaBI || '',
    cliente: cliente || 'Cliente Zoho',
    dealZohoId: zohoId,
    dealZohoModule: module,
    descricao: descricao || `Venda Zoho ${module} #${zohoId}`,
    categoria: categoria || 'venda',
    valor: Number(valor) || 0,
    vencimento: dataVencimento || '',
  }, who);
  return { ok:true, recebimento: r, jaExistia: false };
}

// === Dashboard ===
function dashboardSummary(empresaBI) {
  const all = listAll().filter(r => !empresaBI || r.empresaBI === empresaBI);
  const today = new Date().toISOString().slice(0,10);
  const thisMonth = today.slice(0,7);

  const aberto    = all.filter(r => [STATUS.A_RECEBER, STATUS.PARCIAL].includes(r.status));
  const recebido  = all.filter(r => r.status === STATUS.RECEBIDO);
  const parcial   = all.filter(r => r.status === STATUS.PARCIAL);
  const cancelado = all.filter(r => r.status === STATUS.CANCELADO);

  const sumAberto = (arr) => arr.reduce((s,r) => s + Math.max(0, Number(r.valor||0) - Number(r.valorRecebido||0)), 0);
  const sumRecebido = (arr) => arr.reduce((s,r) => s + Number(r.valorRecebido||0), 0);

  const vencendoHoje = aberto.filter(r => r.vencimento === today);
  const vencidos     = aberto.filter(r => r.vencimento && r.vencimento < today);
  const recebidoNoMes = recebido.filter(r => (r.dataRecebimento||'').slice(0,7) === thisMonth);

  return {
    counts: {
      aberto: aberto.length, recebido: recebido.length, parcial: parcial.length,
      cancelado: cancelado.length, total: all.length,
    },
    valores: {
      totalAberto:     sumAberto(aberto),
      totalRecebido:   sumRecebido(recebido),
      vencendoHoje:    sumAberto(vencendoHoje),
      vencidos:        sumAberto(vencidos),
      recebidoNoMes:   sumRecebido(recebidoNoMes),
    },
    listas: { vencendoHoje, vencidos, parcial, aberto },
  };
}

module.exports = {
  STATUS, defaultRecebimento, get, listAll, listFiltered,
  criar, editar, remover, marcarRecebido, recebimentoParcial, cancelar,
  criarFromVendaZoho, dashboardSummary,
};
