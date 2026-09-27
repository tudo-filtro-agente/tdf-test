// lib/bi-bancos.js — Contas bancárias + saldo + extrato
//
// Cada conta bancária pertence a uma empresa BI. Saldo atual é mantido aqui
// (atualizado por debit/credit) e cada movimentação gera entry no extrato.
//
// Persistência:
//   data/bi-bancos.json    — { id: { ...conta } }
//   data/bi-extratos.json  — { contaId: [ ...entries ] }   (append-only por conta)

const fs = require('fs');
const path = require('path');

const DATA_DIR  = path.join(__dirname, '..', 'data');
const BANCOS    = path.join(DATA_DIR, 'bi-bancos.json');
const EXTRATOS  = path.join(DATA_DIR, 'bi-extratos.json');

function _ensure() {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(_){}
  if (!fs.existsSync(BANCOS))   fs.writeFileSync(BANCOS, '{}');
  if (!fs.existsSync(EXTRATOS)) fs.writeFileSync(EXTRATOS, '{}');
}
function _load(file) {
  _ensure();
  try { return JSON.parse(fs.readFileSync(file, 'utf8') || '{}'); }
  catch(e) { console.warn('[bi-bancos] load', file, e.message); return {}; }
}
function _save(file, obj) {
  _ensure();
  try { fs.writeFileSync(file, JSON.stringify(obj, null, 2)); return true; }
  catch(e) { console.error('[bi-bancos] save', file, e.message); return false; }
}

const uid = () => 'bk_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

function defaultBanco() {
  return {
    id: '',
    empresaBI: '',           // id da empresa BI (multiempresa)
    banco: '',               // nome do banco (Itaú, Bradesco, ...)
    agencia: '',
    conta: '',
    tipoConta: 'corrente',   // corrente | poupanca | investimento | caixa
    apelido: '',             // ex: "Itaú Mococa"
    saldoInicial: 0,
    saldoAtual: 0,
    limite: 0,               // limite cheque especial
    responsavel: '',
    ativo: true,
    obs: '',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
}

function loadAll()              { return _load(BANCOS); }
function saveAll(obj)           { return _save(BANCOS, obj); }
function listAll()              { return Object.values(loadAll()).sort((a,b)=>(a.apelido||a.banco).localeCompare(b.apelido||b.banco)); }
function get(id)                { return loadAll()[id] || null; }

function listByEmpresa(empresaBI) {
  return listAll().filter(b => !empresaBI || b.empresaBI === empresaBI);
}

function upsert(patch, who) {
  const map = loadAll();
  let cur;
  if (patch.id && map[patch.id]) {
    cur = { ...map[patch.id] };
  } else {
    cur = defaultBanco();
    cur.id = patch.id || uid();
    cur.saldoAtual = Number(patch.saldoInicial || 0);
  }
  // Sanitiza
  ['empresaBI','banco','agencia','conta','tipoConta','apelido','responsavel','obs'].forEach(k => {
    if (patch[k] !== undefined) cur[k] = String(patch[k] || '').trim();
  });
  if (patch.saldoInicial !== undefined) cur.saldoInicial = Number(patch.saldoInicial) || 0;
  if (patch.limite !== undefined)        cur.limite = Number(patch.limite) || 0;
  if (patch.ativo !== undefined)         cur.ativo = !!patch.ativo;
  // Saldo atual NÃO é editável diretamente exceto se for novo (vem do saldoInicial)
  if (!map[cur.id] && patch.saldoAtual !== undefined) {
    cur.saldoAtual = Number(patch.saldoAtual) || cur.saldoInicial || 0;
  }
  cur.updatedAt = new Date().toISOString();
  cur.updatedBy = who || null;
  map[cur.id] = cur;
  saveAll(map);
  return cur;
}

function remove(id) {
  const map = loadAll();
  if (!map[id]) return false;
  delete map[id];
  saveAll(map);
  return true;
}

// === Extrato (append-only por conta) ===
function _loadExt() { return _load(EXTRATOS); }
function _saveExt(o) { return _save(EXTRATOS, o); }

function listExtrato(contaId, opts = {}) {
  const all = _loadExt();
  const arr = (all[contaId] || []).slice();
  // mais recente primeiro
  arr.sort((a,b) => (b.data||'').localeCompare(a.data||''));
  if (opts.limit) return arr.slice(0, opts.limit);
  return arr;
}

function addExtratoEntry(contaId, entry) {
  const all = _loadExt();
  if (!all[contaId]) all[contaId] = [];
  const e = {
    id: 'mv_' + Math.random().toString(36).slice(2,8) + Date.now().toString(36).slice(-3),
    contaId,
    tipo: entry.tipo,                  // 'entrada' | 'saida'
    descricao: entry.descricao || '',
    valor: Number(entry.valor) || 0,
    saldoAnterior: Number(entry.saldoAnterior) || 0,
    saldoFinal: Number(entry.saldoFinal) || 0,
    data: entry.data || new Date().toISOString(),
    refTipo: entry.refTipo || '',      // 'pagamento' | 'recebimento' | 'ajuste-manual'
    refId: entry.refId || '',
    usuario: entry.usuario || '',
    obs: entry.obs || '',
  };
  all[contaId].push(e);
  _saveExt(all);
  return e;
}

// Debita valor da conta + grava extrato. Retorna { ok, novoSaldo, entry, error }.
function debitar(contaId, valor, refInfo, who) {
  const map = loadAll();
  const conta = map[contaId];
  if (!conta) return { ok:false, error:'conta bancária não existe' };
  if (!conta.ativo) return { ok:false, error:'conta inativa' };
  const v = Number(valor) || 0;
  if (v <= 0) return { ok:false, error:'valor inválido' };
  const saldoAnterior = Number(conta.saldoAtual || 0);
  const limite = Number(conta.limite || 0);
  if (saldoAnterior + limite < v) {
    return { ok:false, error:'saldo + limite insuficiente', saldoAnterior, limite };
  }
  const saldoFinal = +(saldoAnterior - v).toFixed(2);
  conta.saldoAtual = saldoFinal;
  conta.updatedAt = new Date().toISOString();
  map[contaId] = conta;
  saveAll(map);
  const entry = addExtratoEntry(contaId, {
    tipo:'saida', descricao: refInfo?.descricao || 'Pagamento',
    valor: v, saldoAnterior, saldoFinal,
    refTipo: refInfo?.refTipo || 'pagamento', refId: refInfo?.refId || '',
    usuario: who || '', obs: refInfo?.obs || '',
  });
  return { ok:true, novoSaldo: saldoFinal, entry };
}

// Credita (entrada) — pra ajustes manuais ou estornos
function creditar(contaId, valor, refInfo, who) {
  const map = loadAll();
  const conta = map[contaId];
  if (!conta) return { ok:false, error:'conta bancária não existe' };
  if (!conta.ativo) return { ok:false, error:'conta inativa' };
  const v = Number(valor) || 0;
  if (v <= 0) return { ok:false, error:'valor inválido' };
  const saldoAnterior = Number(conta.saldoAtual || 0);
  const saldoFinal = +(saldoAnterior + v).toFixed(2);
  conta.saldoAtual = saldoFinal;
  conta.updatedAt = new Date().toISOString();
  map[contaId] = conta;
  saveAll(map);
  const entry = addExtratoEntry(contaId, {
    tipo:'entrada', descricao: refInfo?.descricao || 'Crédito',
    valor: v, saldoAnterior, saldoFinal,
    refTipo: refInfo?.refTipo || 'ajuste-manual', refId: refInfo?.refId || '',
    usuario: who || '', obs: refInfo?.obs || '',
  });
  return { ok:true, novoSaldo: saldoFinal, entry };
}

// Sugere melhor conta pra um pagamento (mesma empresa, ativa, com saldo+limite >= valor; ordena por saldo desc).
function sugerirConta(empresaBI, valor) {
  const v = Number(valor) || 0;
  return listAll()
    .filter(b => b.ativo && (!empresaBI || b.empresaBI === empresaBI))
    .filter(b => (Number(b.saldoAtual||0) + Number(b.limite||0)) >= v)
    .sort((a,b) => Number(b.saldoAtual||0) - Number(a.saldoAtual||0))[0] || null;
}

module.exports = {
  defaultBanco, loadAll, saveAll, listAll, listByEmpresa, get,
  upsert, remove, listExtrato, addExtratoEntry, debitar, creditar, sugerirConta,
};
