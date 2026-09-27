// lib/bi-zapi-config.js — Configuração de instância Z-API POR EMPRESA BI
//
// Cada empresa BI pode ter sua própria instância Z-API (com seu WhatsApp empresarial).
// Storage em arquivo JSON LOCAL (não vai pro git — credentials nele).
//
// Fallback: se uma empresa não tem config dedicada, usa env vars globais
//   ZAPI_APROVACAO_INSTANCE / TOKEN / CLIENT_TOKEN (instância única).
//
// Nada disso vai pro repo: data/bi-zapi-config.json deve estar em .gitignore.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE     = path.join(DATA_DIR, 'bi-zapi-config.json');

function _ensure() {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(_){}
  if (!fs.existsSync(FILE)) {
    try { fs.writeFileSync(FILE, JSON.stringify({ porEmpresa: {} }, null, 2)); } catch(_){}
  }
}

function _load() {
  _ensure();
  try { const o = JSON.parse(fs.readFileSync(FILE, 'utf8') || '{}'); return o.porEmpresa ? o : { porEmpresa: o.porEmpresa || {} }; }
  catch(e) { return { porEmpresa: {} }; }
}
function _save(o) {
  _ensure();
  try { fs.writeFileSync(FILE, JSON.stringify(o, null, 2)); return true; }
  catch(e) { return false; }
}

const GLOBAL_KEY = '__global__';

function _maskCfg(c, empId) {
  return {
    empresaId: empId,
    apelido: c.apelido || '',
    whatsappBot: c.whatsappBot || '',
    instanceMasked: c.instance ? (String(c.instance).slice(0,6) + '…') : '',
    tokenMasked:    c.token    ? (String(c.token).slice(0,4) + '…') : '',
    clientTokenMasked: c.clientToken ? (String(c.clientToken).slice(0,4) + '…') : '',
    ativo: c.ativo !== false,
    isGlobal: empId === GLOBAL_KEY,
    updatedAt: c.updatedAt || null,
  };
}

// Lista mascarada — separa global das empresa-específicas
function listMasked() {
  const o = _load();
  const out = {};
  for (const [empId, c] of Object.entries(o.porEmpresa || {})) {
    out[empId] = _maskCfg(c, empId);
  }
  return out;
}

// Lista só a config global (mascarada)
function getGlobalMasked() {
  const o = _load();
  const c = (o.porEmpresa || {})[GLOBAL_KEY];
  return c ? _maskCfg(c, GLOBAL_KEY) : null;
}

// Resolve config (cleartext) com prioridade:
//   1) empresa-específica (o usuário pode ter override pra uma empresa específica)
//   2) Z-API GLOBAL salva no JSON (key __global__) — caso uso, mesma instância pra todas
//   3) env vars (compat com setup antigo)
function resolve(empresaId) {
  const o = _load();
  // 1) empresa-específica (apenas se empresaId não for o GLOBAL_KEY)
  if (empresaId && empresaId !== GLOBAL_KEY) {
    const c = (o.porEmpresa || {})[empresaId];
    if (c && c.ativo !== false && c.instance && c.token) {
      return {
        instance: c.instance, token: c.token,
        clientToken: c.clientToken || '', whatsappBot: c.whatsappBot || '',
        source: 'empresa', apelido: c.apelido || '',
      };
    }
  }
  // 2) Z-API global no JSON
  const g = (o.porEmpresa || {})[GLOBAL_KEY];
  if (g && g.ativo !== false && g.instance && g.token) {
    return {
      instance: g.instance, token: g.token,
      clientToken: g.clientToken || '', whatsappBot: g.whatsappBot || '',
      source: 'global-json', apelido: g.apelido || 'global',
    };
  }
  // 3) Fallback env vars
  const envI  = process.env.ZAPI_APROVACAO_INSTANCE || process.env.ZAPI_INSTANCE || '';
  const envT  = process.env.ZAPI_APROVACAO_TOKEN    || process.env.ZAPI_TOKEN || '';
  const envCT = process.env.ZAPI_APROVACAO_CLIENT_TOKEN || process.env.ZAPI_CLIENT_TOKEN || '';
  if (envI && envT) {
    return { instance: envI, token: envT, clientToken: envCT, whatsappBot: '', source: 'global-env', apelido: 'global (env)' };
  }
  return null;
}

// Salva config (admin-only chamada via endpoint).
// Aceita patch { instance, token, clientToken, whatsappBot, apelido, ativo }
// Para limpar uma empresa, passar { remove: true }.
function upsert(empresaId, patch, who) {
  if (!empresaId) return { ok:false, error:'empresaId obrigatório' };
  const o = _load();
  o.porEmpresa = o.porEmpresa || {};
  if (patch.remove === true) {
    delete o.porEmpresa[empresaId];
    _save(o);
    return { ok:true, removed:true };
  }
  const cur = o.porEmpresa[empresaId] || { createdAt: new Date().toISOString() };
  if (patch.instance    !== undefined) cur.instance    = String(patch.instance || '').trim();
  if (patch.token       !== undefined) cur.token       = String(patch.token || '').trim();
  if (patch.clientToken !== undefined) cur.clientToken = String(patch.clientToken || '').trim();
  if (patch.whatsappBot !== undefined) cur.whatsappBot = String(patch.whatsappBot || '').replace(/\D/g,'');
  if (patch.apelido     !== undefined) cur.apelido     = String(patch.apelido || '').trim();
  if (patch.ativo       !== undefined) cur.ativo       = !!patch.ativo;
  cur.updatedAt = new Date().toISOString();
  cur.updatedBy = who || null;
  o.porEmpresa[empresaId] = cur;
  _save(o);
  return { ok:true, config: cur };
}

// Resolve config A PARTIR de uma instância recebida no webhook (Z-API manda instanceId).
// Retorna a CFG cleartext pra responder pela MESMA instância — funciona pra global E empresa-específica.
function findCfgByInstance(instanceId) {
  if (!instanceId) return null;
  const o = _load();
  for (const [empId, c] of Object.entries(o.porEmpresa || {})) {
    if (c.instance === instanceId && c.ativo !== false) {
      return {
        instance: c.instance, token: c.token,
        clientToken: c.clientToken || '', whatsappBot: c.whatsappBot || '',
        source: empId === GLOBAL_KEY ? 'global-json' : 'empresa',
        apelido: c.apelido || '',
        empresaId: empId,
      };
    }
  }
  return null;
}

// Compat: retorna apenas o ID da empresa (legado)
function findEmpresaByInstance(instanceId) {
  const c = findCfgByInstance(instanceId);
  return c ? c.empresaId : null;
}

module.exports = { GLOBAL_KEY, listMasked, getGlobalMasked, resolve, upsert, findEmpresaByInstance, findCfgByInstance };
