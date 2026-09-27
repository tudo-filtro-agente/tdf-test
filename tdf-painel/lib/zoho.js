// lib/zoho.js — Camada centralizada de integração com Zoho CRM v6
//
// Encapsula:
//   - State de token (refresh, cache, cooldown rate-limit)
//   - HTTP helpers (fetch automático com Auth header)
//   - Operations CRUD comuns (search, get, update, create)
//
// Uso:
//   const zoho = require('./lib/zoho');
//   const tk = await zoho.getToken();
//   const deals = await zoho.search('(Stage:equals:Qualificado)', 'Deal_Name,Amount');
//   const deal = await zoho.getDeal(dealId, 'Deal_Name,Stage');
//   await zoho.updateDeal(dealId, { Stage: 'Proposta' });
//
// Compatibilidade: server.js mantém helpers antigos (getZohoToken, zohoSearch) como
// wrappers chamando este módulo. Novos endpoints DEVEM usar `zoho.*`.

const ZOHO_REFRESH = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_CID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CSECRET = process.env.ZOHO_CLIENT_SECRET;
const BASE = 'https://www.zohoapis.com/crm/v6';

let _token = null;
let _tokenExpiry = 0;
let _refreshInFlight = null;
let _cooldownUntil = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  if (_refreshInFlight) return _refreshInFlight;
  if (Date.now() < _cooldownUntil) return _token;
  if (!ZOHO_REFRESH || !ZOHO_CID || !ZOHO_CSECRET) {
    console.error('[zoho] missing env vars');
    return '';
  }
  _refreshInFlight = (async () => {
    try {
      const params = new URLSearchParams({
        refresh_token: ZOHO_REFRESH, client_id: ZOHO_CID,
        client_secret: ZOHO_CSECRET, grant_type: 'refresh_token',
      });
      const res = await fetch('https://accounts.zoho.com/oauth/v2/token', { method: 'POST', body: params });
      const data = await res.json();
      if (data.access_token) {
        _token = data.access_token;
        _tokenExpiry = Date.now() + 3000 * 1000;
        console.log('[zoho] token refreshed OK');
      } else {
        console.error('[zoho] refresh failed:', JSON.stringify(data));
        if (/too many|rate|access\s*denied/i.test(data.error_description || data.error || '')) {
          _cooldownUntil = Date.now() + 60 * 1000;
          console.warn('[zoho] rate limit, cooldown 60s');
        }
      }
    } catch (e) {
      console.error('[zoho] refresh error:', e.message);
    } finally {
      _refreshInFlight = null;
    }
    return _token;
  })();
  return _refreshInFlight;
}

// Inject token + base URL automaticamente
async function fetchZ(path, options = {}) {
  const token = await getToken();
  if (!token) throw new Error('zoho: no token');
  const url = path.startsWith('http') ? path : (BASE + path);
  const headers = {
    Authorization: `Zoho-oauthtoken ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}

// Search deals via criteria + fields. Pagina automaticamente.
async function search(criteria, fields, perPage = 200, maxPages = 10) {
  const token = await getToken();
  if (!token) return [];
  let all = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE}/Deals/search?criteria=${encodeURIComponent(criteria)}&fields=${encodeURIComponent(fields)}&per_page=${perPage}&page=${page}`;
    const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
    if (r.status === 204) break;
    if (!r.ok) {
      console.warn('[zoho.search]', r.status, criteria.slice(0, 80));
      break;
    }
    const j = await r.json().catch(() => ({}));
    const data = j.data || [];
    if (!data.length) break;
    all = all.concat(data);
    if (data.length < perPage) break;
  }
  return all;
}

async function getDeal(dealId, fields) {
  const r = await fetchZ(`/Deals/${dealId}${fields ? '?fields=' + encodeURIComponent(fields) : ''}`);
  if (!r.ok) throw new Error('zoho.getDeal ' + r.status);
  const j = await r.json().catch(() => ({}));
  return j.data?.[0] || null;
}

async function updateDeal(dealId, fields) {
  const r = await fetchZ(`/Deals/${dealId}`, {
    method: 'PUT',
    body: JSON.stringify({ data: [fields] }),
  });
  const j = await r.json().catch(() => ({}));
  const result = j.data?.[0];
  if (result?.code !== 'SUCCESS') throw new Error('zoho.updateDeal: ' + (result?.message || r.status));
  return result;
}

// Igual ao updateDeal, mas com trigger:[] — NÃO dispara workflows/blueprints do Zoho.
// Uso obrigatório em escritas de robô (score, carimbos) pra não reatribuir dono nem
// criar tarefa em lead antigo como efeito colateral.
async function updateDealSilent(dealId, fields) {
  const r = await fetchZ(`/Deals/${dealId}`, {
    method: 'PUT',
    body: JSON.stringify({ data: [fields], trigger: [] }),
  });
  const j = await r.json().catch(() => ({}));
  const result = j.data?.[0];
  if (result?.code !== 'SUCCESS') throw new Error('zoho.updateDealSilent: ' + (result?.message || r.status));
  return result;
}

async function createDeal(fields) {
  const r = await fetchZ('/Deals', {
    method: 'POST',
    body: JSON.stringify({ data: [fields] }),
  });
  const j = await r.json().catch(() => ({}));
  const result = j.data?.[0];
  if (result?.code !== 'SUCCESS') throw new Error('zoho.createDeal: ' + (result?.message || r.status));
  return { id: result.details?.id, raw: result };
}

// Cria o Orçamento (Quote) do PDV de balcão. No CRM desta empresa é o Quote,
// não o Deal, que carrega o produto vendido — é dali que a fila de manutenção
// lê o que o cliente comprou pra saber quando chamá-lo pra trocar o refil.
// trigger:[] suprime os workflows do Zoho na criação (113 workflows no módulo
// de negócios, vários zumbis — disparar workflow numa venda de balcão é
// efeito colateral indesejado).
//
// SEM portão de escrita, de propósito, e simétrico ao createDeal: um portão só
// aqui dava ILUSÃO de proteção — com o createDeal escrevendo, a rodada
// "protegida" gerava Negócio órfão (sem Orçamento), que é pior do que não
// proteger. A proteção real do PDV é a trava TDF_PDV_MODO_SOMBRA, verificada
// no orquestrador (lib/bi-pdv.js) antes de QUALQUER chamada externa.
async function createQuote(fields) {
  const r = await fetchZ('/Quotes', {
    method: 'POST',
    body: JSON.stringify({ data: [fields], trigger: [] }),
  });
  const j = await r.json().catch(() => ({}));
  const result = j.data?.[0];
  if (result?.code !== 'SUCCESS') throw new Error('zoho.createQuote: ' + (result?.message || r.status));
  return { id: result.details?.id };
}

// Cria o Contato (pessoa) do PDV de balcão. É o registro que faltava: sem
// Contato o cliente do balcão não existe como PESSOA no CRM e nunca entra no
// relógio de troca de refil — que é a razão de ser do PDV. Mesmo formato do
// createDeal/createQuote: POST no módulo, data:[fields], trigger:[] (não
// dispara os workflows zumbis do CRM numa venda de balcão), erro em qualquer
// código diferente de SUCCESS, e devolve só o id do registro criado.
async function createContact(fields) {
  const r = await fetchZ('/Contacts', {
    method: 'POST',
    body: JSON.stringify({ data: [fields], trigger: [] }),
  });
  const j = await r.json().catch(() => ({}));
  const result = j.data?.[0];
  if (result?.code !== 'SUCCESS') throw new Error('zoho.createContact: ' + (result?.message || r.status));
  return { id: result.details?.id };
}

// Acha o Produto pelo CÓDIGO ou cria. Devolve o id do Zoho, que é o que a
// linha do Orçamento precisa. Produto do Omie que nunca foi cadastrado no CRM
// entra aqui na primeira venda — com código e preço, nunca "solto".
async function garanteProdutoPorCodigo(codigo, nome, preco) {
  const cod = String(codigo || '').trim();
  if (!cod) return null;
  const achados = await searchModule('Products',
    `(Product_Code:equals:${cod})`, 'Product_Code,Product_Name', { perPage: 2, maxPages: 1 });
  const achado = (achados || []).find(p => p && p.id);
  if (achado) return achado.id;

  const r = await fetchZ('/Products', {
    method: 'POST',
    body: JSON.stringify({
      data: [{
        Product_Name: String(nome || cod).slice(0, 120),
        Product_Code: cod,
        Unit_Price: Number(preco || 0),
        Product_Active: true,
      }],
      trigger: [],
    }),
  });
  const j = await r.json().catch(() => ({}));
  const result = j.data?.[0];
  if (result?.code !== 'SUCCESS') throw new Error('zoho.garanteProdutoPorCodigo: ' + (result?.message || r.status));
  return result.details?.id || null;
}

// Atualiza campos de um Contato existente. `trigger: []` igual ao create: o
// PDV não pode acordar workflow de Contatos no meio de uma venda.
async function updateContact(id, fields) {
  const r = await fetchZ('/Contacts', {
    method: 'PUT',
    body: JSON.stringify({ data: [{ id, ...fields }], trigger: [] }),
  });
  const j = await r.json().catch(() => ({}));
  const result = j.data?.[0];
  if (result?.code !== 'SUCCESS') throw new Error('zoho.updateContact: ' + (result?.message || r.status));
  return { id };
}

// Busca por telefone em QUALQUER módulo (o searchByPhone só olha Deals).
// Usa o parâmetro `phone` dedicado da API — ele varre todos os campos de
// telefone do módulo (Phone, Mobile, Other_Phone...), o que criteria não faz.
// Normaliza para os 9 últimos dígitos, igual ao searchByPhone: o CRM guarda o
// mesmo número em mil formatos ((12) 99999-8888, +5512999998888, 12999998888)
// e só o sufixo é comparável entre eles.
async function searchModulePhone(module, phone, fields) {
  const last9 = String(phone || '').replace(/\D/g, '').slice(-9);
  if (!last9) return [];
  const token = await getToken();
  if (!token) return [];
  const url = `${BASE}/${module}/search?phone=${encodeURIComponent(last9)}` +
              (fields ? `&fields=${encodeURIComponent(fields)}` : '');
  const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
  if (r.status === 204) return [];
  if (!r.ok) { console.warn('[zoho.searchModulePhone]', module, r.status); return []; }
  const j = await r.json().catch(() => ({}));
  return j.data || [];
}

async function searchByPhone(phone, fields = 'Deal_Name,Telefone_contato,Stage') {
  const last9 = String(phone || '').replace(/\D/g, '').slice(-9);
  if (!last9) return [];
  const token = await getToken();
  if (!token) return [];
  const url = `${BASE}/Deals/search?phone=${encodeURIComponent(last9)}&fields=${encodeURIComponent(fields)}`;
  const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
  if (r.status === 204) return [];
  if (!r.ok) return [];
  const j = await r.json().catch(() => ({}));
  return j.data || [];
}

// Add tag to deal (Zoho v6 specific endpoint)
async function addTags(dealId, tagNames) {
  const tk = await getToken();
  if (!tk) return false;
  const tagsParam = (Array.isArray(tagNames) ? tagNames : [tagNames]).map(t => encodeURIComponent(t)).join(',');
  const url = `${BASE}/Deals/${dealId}/actions/add_tags?tag_names=${tagsParam}`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${tk}` },
    });
    return r.ok;
  } catch(e) {
    console.warn('[zoho.addTags]', e.message);
    return false;
  }
}

// Remove tags do deal (Zoho v6)
async function removeTags(dealId, tagNames) {
  const tk = await getToken();
  if (!tk) return false;
  const tagsParam = (Array.isArray(tagNames) ? tagNames : [tagNames]).map(t => encodeURIComponent(t)).join(',');
  const url = `${BASE}/Deals/${dealId}/actions/remove_tags?tag_names=${tagsParam}`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${tk}` },
    });
    return r.ok;
  } catch(e) {
    console.warn('[zoho.removeTags]', e.message);
    return false;
  }
}

// === Word search (busca textual genérica em todos os campos texto) ===
// Mais robusta que criteria pra dados "sujos" (ex: Last_Name="." quando importado).
// Doc: https://www.zoho.com/crm/developer/docs/api/v6/search-records.html
async function searchModuleWord(module, word, fields, opts = {}) {
  const { perPage = 50, maxPages = 1 } = opts;
  const token = await getToken();
  if (!token) return [];
  const all = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE}/${module}/search?word=${encodeURIComponent(word)}&fields=${encodeURIComponent(fields)}&per_page=${perPage}&page=${page}`;
    const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
    if (r.status === 204) break;
    if (!r.ok) { console.warn('[zoho.searchModuleWord]', module, r.status, word); break; }
    const j = await r.json().catch(() => ({}));
    const data = j.data || [];
    if (!data.length) break;
    all.push(...data);
    if (data.length < perPage) break;
  }
  return all;
}

// === Generic search por módulo (Deals, Quotes, Sales_Orders, Contacts, Accounts, Products) ===
async function searchModule(module, criteria, fields, opts = {}) {
  const { perPage = 200, maxPages = 5 } = opts;
  const token = await getToken();
  if (!token) return [];
  let all = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE}/${module}/search?criteria=${encodeURIComponent(criteria)}&fields=${encodeURIComponent(fields)}&per_page=${perPage}&page=${page}`;
    const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
    if (r.status === 204) break;
    if (!r.ok) { console.warn('[zoho.searchModule]', module, r.status, criteria.slice(0, 100)); break; }
    const j = await r.json().catch(() => ({}));
    const data = j.data || [];
    if (!data.length) break;
    all = all.concat(data);
    if (data.length < perPage) break;
  }
  return all;
}

// Listagem de records de um módulo (sem critério, com paginação por created/modified time)
async function listModule(module, fields, opts = {}) {
  const { perPage = 200, maxPages = 5, sortBy = 'Modified_Time', sortOrder = 'desc' } = opts;
  const token = await getToken();
  if (!token) return [];
  let all = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE}/${module}?fields=${encodeURIComponent(fields)}&per_page=${perPage}&page=${page}&sort_by=${sortBy}&sort_order=${sortOrder}`;
    const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
    if (r.status === 204) break;
    if (!r.ok) { console.warn('[zoho.listModule]', module, r.status); break; }
    const j = await r.json().catch(() => ({}));
    const data = j.data || [];
    if (!data.length) break;
    all = all.concat(data);
    if (data.length < perPage) break;
  }
  return all;
}

async function getRecord(module, id, fields) {
  const r = await fetchZ(`/${module}/${id}${fields ? '?fields=' + encodeURIComponent(fields) : ''}`);
  if (!r.ok) throw new Error('zoho.getRecord ' + module + '/' + id + ' ' + r.status);
  const j = await r.json().catch(() => ({}));
  return j.data?.[0] || null;
}

// Stats internas (pra /diag e debugging)
function stats() {
  return {
    hasToken: !!_token,
    expiresIn: _token ? Math.max(0, _tokenExpiry - Date.now()) : 0,
    inFlight: !!_refreshInFlight,
    cooldownActive: Date.now() < _cooldownUntil,
    cooldownRemainingMs: Math.max(0, _cooldownUntil - Date.now()),
  };
}

/**
 * Cria task no Zoho. Suporta reminder popup via Remind_At (ISO 8601 datetime).
 * Quando remindAt é setado, Zoho dispara popup na tela do owner no momento exato.
 */
async function createTask({ dealId, ownerId, subject, description, dueDate, remindAt, status = 'Not Started', priority = 'High' }) {
  const token = await getToken();
  if (!token) return { ok: false, error: 'zoho indisponível' };
  const taskFields = {
    Subject: subject,
    What_Id: dealId,
    $se_module: 'Deals',
    Description: description || '',
    Due_Date: dueDate,
    Status: status,
    Priority: priority,
    ...(ownerId ? { Owner: { id: ownerId } } : {}),
  };
  if (remindAt) {
    // Zoho Reminder formato: { ALARM: 'FREQ=NONE;ACTION=POPUP;TRIGGER=DATE-TIME:<ISO>' }
    // O ISO precisa estar em UTC ou com offset.
    taskFields.Remind_At = { ALARM: `FREQ=NONE;ACTION=POPUP;TRIGGER=DATE-TIME:${remindAt}` };
  }
  const body = { data: [taskFields] };
  try {
    const r = await fetch(`${BASE}/Tasks`, {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    const result = j.data?.[0];
    if (result?.code === 'SUCCESS') return { ok: true, taskId: result.details?.id };
    return { ok: false, error: result?.message || JSON.stringify(j).slice(0, 200) };
  } catch (e) { return { ok: false, error: e.message }; }
}

/**
 * Cria uma Chamada Agendada (Scheduled Call) no módulo Calls do Zoho CRM.
 * Diferente de Task: aparece no módulo Calls, registra como atividade de
 * telefonia, gera popup se Reminder estiver setado.
 *
 * @param {object} args
 * @param {string} args.dealId       Deal id (vai pra What_Id)
 * @param {string} [args.contactId]  Contact id (vai pra Who_Id) — opcional
 * @param {string} [args.ownerId]    Zoho user id pra atribuir
 * @param {string} args.subject
 * @param {string} [args.description]
 * @param {string} args.callStartTime  ISO 8601 datetime (ex: 2026-05-12T09:00:00-03:00)
 * @param {number} [args.durationMinutes=15]
 * @param {string} [args.remindAt]   ISO 8601 datetime — opcional, ativa popup
 * @param {string} [args.callPurpose]
 */
async function createCall(args) {
  const token = await getToken();
  if (!token) return { ok: false, error: 'zoho indisponível' };
  const fields = {
    Subject: args.subject,
    Call_Type: 'Outbound',
    Call_Status: 'Scheduled',
    Call_Start_Time: args.callStartTime,
    Call_Duration: String(args.durationMinutes || 15),
    Description: args.description || '',
    What_Id: args.dealId,
    $se_module: 'Deals',
    ...(args.contactId ? { Who_Id: args.contactId } : {}),
    ...(args.ownerId ? { Owner: { id: args.ownerId } } : {}),
    ...(args.callPurpose ? { Call_Purpose: args.callPurpose } : {}),
  };
  if (args.remindAt) {
    fields.Reminder = { ALARM: `FREQ=NONE;ACTION=POPUP;TRIGGER=DATE-TIME:${args.remindAt}` };
  }
  try {
    const r = await fetch(`${BASE}/Calls`, {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [fields] }),
    });
    const j = await r.json();
    const result = j.data?.[0];
    if (result?.code === 'SUCCESS') return { ok: true, callId: result.details?.id };
    return { ok: false, error: result?.message || JSON.stringify(j).slice(0, 200) };
  } catch (e) { return { ok: false, error: e.message }; }
}

async function createNote({ parentId, parentModule = 'Deals', title, content }) {
  const token = await getToken();
  if (!token) return { ok: false, error: 'zoho indisponível' };
  const body = { data: [{
    Note_Title: title || 'Nota TDF',
    Note_Content: content || '',
    Parent_Id: { id: parentId, $module: parentModule },
  }] };
  try {
    const r = await fetch(`${BASE}/Notes`, {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    const result = j.data?.[0];
    if (result?.code === 'SUCCESS') return { ok: true, noteId: result.details?.id };
    return { ok: false, error: result?.message || JSON.stringify(j).slice(0, 200) };
  } catch (e) { return { ok: false, error: e.message }; }
}

async function updateCall(callId, fields) {
  const token = await getToken();
  if (!token) return { ok: false, error: 'zoho indisponível' };
  try {
    const r = await fetch(`${BASE}/Calls/${callId}`, {
      method: 'PUT',
      headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [fields] }),
    });
    const j = await r.json();
    const result = j.data?.[0];
    if (result?.code === 'SUCCESS') return { ok: true };
    return { ok: false, error: result?.message || JSON.stringify(j).slice(0, 200) };
  } catch (e) { return { ok: false, error: e.message }; }
}

async function updateTask(taskId, fields) {
  const token = await getToken();
  if (!token) return { ok: false, error: 'zoho indisponível' };
  try {
    const r = await fetch(`${BASE}/Tasks/${taskId}`, {
      method: 'PUT',
      headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [fields] }),
    });
    const j = await r.json();
    const result = j.data?.[0];
    if (result?.code === 'SUCCESS') return { ok: true };
    return { ok: false, error: result?.message || JSON.stringify(j).slice(0, 200) };
  } catch (e) { return { ok: false, error: e.message }; }
}

module.exports = { garanteProdutoPorCodigo, updateContact,
  getToken,
  fetch: fetchZ,
  search,
  searchModule,
  searchModuleWord,
  listModule,
  getRecord,
  getDeal,
  updateDeal,
  updateDealSilent,
  createDeal,
  createQuote,
  createContact,
  searchModulePhone,
  createTask,
  updateTask,
  createCall,
  updateCall,
  createNote,
  searchByPhone,
  addTags,
  removeTags,
  stats,
  BASE,
};
