// lib/bi-aprovadores.js — Tabela de aprovadores (separada do USERS de login)
//
// Aprovador é quem pode autorizar pagamento. Pode ou não ter login no portal.
// Identificado pelo whatsapp (E.164 sem '+') pra notificação Z-API.
//
// Níveis:
//   'padrao'  → respeita limiteValor (default 5000)
//   'titular' → sem limite (Paulo, pai, sócios)
//
// Persistência: data/bi-aprovadores.json

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE     = path.join(DATA_DIR, 'bi-aprovadores.json');

function _ensure() {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(_){}
  if (!fs.existsSync(FILE)) {
    // Seed inicial: Paulo titular, vinculado ao número PAULO_PHONE do server.js
    const seed = {
      'apr_paulo': {
        id: 'apr_paulo',
        nome: 'Paulo Camargo Junior',
        whatsapp: '5512991513007',
        email: 'theroomsjc@gmail.com',
        nivel: 'titular',
        limiteValor: 0, // 0 = sem limite (titular)
        empresasAutorizadas: [], // [] = todas
        ativo: true,
        userLogin: 'paulo', // ref ao USERS[].username (pra correlacionar quando ele aprovar via UI)
        createdAt: new Date().toISOString(),
        updatedAt: null,
      }
    };
    try { fs.writeFileSync(FILE, JSON.stringify(seed, null, 2)); } catch(_){}
  }
}

function _load() {
  _ensure();
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8') || '{}'); }
  catch(e) { console.warn('[bi-aprovadores] load', e.message); return {}; }
}
function _save(o) {
  _ensure();
  try { fs.writeFileSync(FILE, JSON.stringify(o, null, 2)); return true; }
  catch(e) { console.error('[bi-aprovadores] save', e.message); return false; }
}

const uid = () => 'apr_' + Math.random().toString(36).slice(2,9);

// Normaliza WhatsApp pra E.164 sem '+': "+55 12 99151-3007" → "5512991513007"
function normalizePhone(p) {
  return String(p || '').replace(/\D/g, '');
}

function listAll() {
  return Object.values(_load()).sort((a,b) => (a.nome||'').localeCompare(b.nome||''));
}

function get(id) { return _load()[id] || null; }

function findByPhone(phone) {
  const norm = normalizePhone(phone);
  if (!norm) return null;
  // Match exato e fallback comparando últimos 11 dígitos (mobile BR)
  const map = _load();
  for (const a of Object.values(map)) {
    const ap = normalizePhone(a.whatsapp);
    if (ap === norm) return a;
  }
  // Fallback comparando últimos 11 dígitos (caso Z-API mande sem 55)
  for (const a of Object.values(map)) {
    const ap = normalizePhone(a.whatsapp).slice(-11);
    if (ap && ap === norm.slice(-11)) return a;
  }
  return null;
}

function findByLogin(username) {
  const map = _load();
  return Object.values(map).find(a => a.userLogin === username) || null;
}

function upsert(patch, who) {
  const map = _load();
  const id = patch.id && map[patch.id] ? patch.id : uid();
  const cur = map[id] || { id, createdAt: new Date().toISOString() };
  ['nome','email','userLogin','obs'].forEach(k => {
    if (patch[k] !== undefined) cur[k] = String(patch[k] || '').trim();
  });
  if (patch.whatsapp !== undefined) cur.whatsapp = normalizePhone(patch.whatsapp);
  if (patch.nivel !== undefined)    cur.nivel = (patch.nivel === 'titular') ? 'titular' : 'padrao';
  if (patch.limiteValor !== undefined) cur.limiteValor = Number(patch.limiteValor) || 0;
  if (patch.empresasAutorizadas !== undefined) cur.empresasAutorizadas = Array.isArray(patch.empresasAutorizadas) ? patch.empresasAutorizadas : [];
  if (patch.ativo !== undefined)    cur.ativo = !!patch.ativo;
  cur.updatedAt = new Date().toISOString();
  cur.updatedBy = who || null;
  map[id] = cur;
  _save(map);
  return cur;
}

function remove(id) {
  const map = _load();
  if (!map[id]) return false;
  delete map[id];
  _save(map);
  return true;
}

// === Regras de alçada ===
//
// limitePadrao default = R$ 5.000 (lib/bi-config). 'titular' ignora.
// empresaBI: o pagamento é da empresa X. Se aprovador.empresasAutorizadas vazio, pode tudo.
//
function podeAprovar(aprovador, valor, empresaBI, limitePadrao) {
  if (!aprovador || !aprovador.ativo) return { ok:false, motivo:'aprovador inativo' };
  // Empresas autorizadas
  if (Array.isArray(aprovador.empresasAutorizadas) && aprovador.empresasAutorizadas.length > 0) {
    if (empresaBI && !aprovador.empresasAutorizadas.includes(empresaBI)) {
      return { ok:false, motivo:'aprovador não tem alçada nesta empresa' };
    }
  }
  if (aprovador.nivel === 'titular') return { ok:true };
  // Padrão: respeita limite
  const lim = Number(aprovador.limiteValor) || Number(limitePadrao) || 5000;
  if (Number(valor||0) > lim) {
    return { ok:false, motivo:`valor (R$ ${Number(valor).toFixed(2)}) excede alçada (R$ ${lim.toFixed(2)}) — precisa de titular`, alcadaExcedida:true };
  }
  return { ok:true };
}

// Lista todos titulares ativos (pra fallback quando padrão não pode)
function listTitulares() {
  return listAll().filter(a => a.ativo && a.nivel === 'titular');
}

// Lista aprovadores ativos pra notificar quando uma conta é submetida
function listParaNotificar(valor, empresaBI, limitePadrao) {
  const all = listAll().filter(a => a.ativo);
  const lim = Number(limitePadrao) || 5000;
  const v = Number(valor) || 0;
  return all.filter(a => {
    // Filtra por empresa autorizada
    if (Array.isArray(a.empresasAutorizadas) && a.empresasAutorizadas.length > 0 && empresaBI) {
      if (!a.empresasAutorizadas.includes(empresaBI)) return false;
    }
    if (a.nivel === 'titular') return true;
    return v <= (Number(a.limiteValor) || lim);
  });
}

module.exports = {
  listAll, get, upsert, remove, findByPhone, findByLogin,
  podeAprovar, listTitulares, listParaNotificar, normalizePhone,
};
