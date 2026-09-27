// lib/followUps.js — proxy pro módulo /api/ops/follow-ups do tdf-ops.
const TDF_OPS_URL = process.env.TDF_OPS_URL || 'https://tdf-ops-production.up.railway.app';
const TIMEOUT_MS = 15000;

async function _fetch(method, path, body) {
  const url = `${TDF_OPS_URL}${path}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    const text = await r.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    if (!r.ok) {
      const msg = (data && (data.detail || data.error)) || `tdf-ops ${method} ${path} -> ${r.status}`;
      const err = new Error(msg);
      err.status = r.status;
      err.body = data;
      throw err;
    }
    return data;
  } finally { clearTimeout(timer); }
}

const get = (p) => _fetch('GET', p);
const post = (p, body) => _fetch('POST', p, body);
const patch = (p, body) => _fetch('PATCH', p, body);

module.exports = {
  TDF_OPS_URL,
  reasons: () => get('/api/ops/follow-ups/reasons'),
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/follow-ups${q ? `?${q}` : ''}`);
  },
  kanban: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/follow-ups/kanban${q ? `?${q}` : ''}`);
  },
  summary: () => get('/api/ops/follow-ups/stats/summary'),
  byContact: (zohoContactId) => get(`/api/ops/follow-ups/by-contact/${encodeURIComponent(zohoContactId)}`),
  contactStatus: (phone) => get(`/api/ops/follow-ups/contact-status?phone=${encodeURIComponent(phone)}`),
  one: (id) => get(`/api/ops/follow-ups/${id}`),
  create: (body) => post('/api/ops/follow-ups', body),
  update: (id, body) => patch(`/api/ops/follow-ups/${id}`, body),
  snooze: (id, body) => post(`/api/ops/follow-ups/${id}/snooze`, body),
  cancel: (id) => post(`/api/ops/follow-ups/${id}/cancel`),
  done: (id, body) => post(`/api/ops/follow-ups/${id}/done`, body),
  suggestTemplate: (body) => post('/api/ops/follow-ups/suggest-template', body),
};
