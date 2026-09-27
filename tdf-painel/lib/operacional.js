// lib/operacional.js — proxy fino entre tdf-portal (Express) e tdf-ops (FastAPI)
// Reutiliza endpoints já testados em https://tdf-ops-production.up.railway.app

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
  } finally {
    clearTimeout(timer);
  }
}

const get  = (p)        => _fetch('GET',  p);
const post = (p, body)  => _fetch('POST', p, body);

module.exports = {
  TDF_OPS_URL,

  // Vendas / pipeline
  listSales: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/sales${q ? `?${q}` : ''}`);
  },
  getSale: (id) => get(`/api/ops/sales/${id}`),
  getTimeline: (id) => get(`/api/ops/sales/${id}/timeline`),
  metricsDashboard: () => get('/api/ops/metrics/dashboard'),

  // Sugestões IA
  listSaleSuggestions: (saleId) => get(`/api/ops/sales/${saleId}/suggestions`),
  getSuggestion: (id) => get(`/api/ops/suggestions/${id}`),
  decide: (id, body) => post(`/api/ops/suggestions/${id}/decide`, body),
  reanalyze: (saleId, regeocode=false) =>
    post(`/api/ops/internal/sales/${saleId}/reanalyze${regeocode ? '?regeocode=true' : ''}`),

  // Rotas / técnicos
  listRoutes: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/routes${q ? `?${q}` : ''}`);
  },
  getRoute: (id) => get(`/api/ops/routes/${id}`),
  createRoute: (body) => post('/api/ops/routes', body),
  confirmRoute: (id, body={}) => post(`/api/ops/routes/${id}/confirm`, body),
  optimizeRoute: (id) => post(`/api/ops/routes/${id}/optimize`, {}),
  routeBriefing: (id) => get(`/api/ops/routes/${id}/briefing`),
  patchRouteStop: (id, body) => _fetch('PATCH', `/api/ops/route-stops/${id}`, body),
  reorderRouteStops: (id, stop_ids) => post(`/api/ops/routes/${id}/reorder-stops`, { stop_ids }),
  addStopsToRoute: (id, sale_ids) => post(`/api/ops/routes/${id}/stops`, { sale_ids }),
  deleteRouteStop: (id) => _fetch('DELETE', `/api/ops/route-stops/${id}`),
  patchRoute: (id, body) => _fetch('PATCH', `/api/ops/routes/${id}`, body),
  notifyTechnician: (id) => post(`/api/ops/routes/${id}/notify-technician`, {}),
  scheduleRouteStops: (id) => post(`/api/ops/routes/${id}/schedule`, {}),
  routeDetailedBriefing: (id) => get(`/api/ops/routes/${id}/briefing?detailed=true`),
  routeAiBriefing: (id) => get(`/api/ops/routes/${id}/briefing?ai=true`),
  routesGantt: (date) => get(`/api/ops/routes/gantt${date?`?target_date=${date}`:''}`),
  dashboardToday: () => get('/api/ops/dashboard/today'),
  feedAlerts: () => get('/api/ops/feed/alerts'),
  feedRecent: (limit=30) => get(`/api/ops/feed/recent?limit=${limit}`),

  // F8 Alert Engine
  alertsList: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/alerts${q ? `?${q}` : ''}`);
  },
  alertsSummary: () => get('/api/ops/alerts/summary'),
  alertsAck: (id, by) => post(`/api/ops/alerts/${id}/ack`, { by }),
  alertsResolve: (id) => post(`/api/ops/alerts/${id}/resolve`, {}),

  // F8 IA por aba
  abaInsight: (key, refresh=false) => get(`/api/ops/aba/${encodeURIComponent(key)}/insight${refresh ? '?refresh=true' : ''}`),

  // F-EXPEDICAO
  expedicao: () => get('/api/ops/expedicao'),
  shipmentTransition: (id, body) => post(`/api/ops/shipments/${id}/transition`, body),
  deliveryTransition: (id, body) => post(`/api/ops/deliveries/${id}/transition`, body),

  // F8 — Métricas diárias
  metricsDaily: (days=30) => get(`/api/ops/metrics/daily?days=${days}`),
  metricsToday: () => get('/api/ops/metrics/today'),
  metricsRunNow: (date) => post(`/api/ops/metrics/run-now${date?`?target_date=${date}`:''}`, {}),
  metricsBackfill: (days=7) => post(`/api/ops/metrics/backfill?days=${days}`, {}),

  // F-TRIAGEM
  triagemPending: () => get('/api/ops/triagem/pending'),
  triagemEscalate: (saleId) => post(`/api/ops/triagem/${saleId}/escalate-morgana`, {}),
  triagemSetQueue: (saleId, queue) => post(`/api/ops/triagem/${saleId}/set-queue?queue=${encodeURIComponent(queue)}`, {}),

  sendDailyBriefing: (id) => post(`/api/ops/routes/${id}/send-daily-briefing`, {}),
  syncRouteAuvo: (id, force=false) => post(`/api/ops/routes/${id}/sync-auvo${force?'?force_recreate=true':''}`, {}),
  patchSaleCondominio: (id, body) => _fetch('PATCH', `/api/ops/sales/${id}/condominio`, body),
  listTechnicians: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/technicians${q ? `?${q}` : ''}`);
  },
  patchTechnician: (id, body) => _fetch('PATCH', `/api/ops/technicians/${id}`, body),
  technicianAvailability: (date) => get(`/api/ops/technicians/availability${date ? `?date=${date}` : ''}`),
  triggerAuvoSync: () => post('/api/ops/internal/auvo/sync'),

  // Cadastros (Auditoria)
  listServiceTypes: () => get('/api/ops/service-types'),
  createServiceType: (body) => post('/api/ops/service-types', body),
  updateServiceType: (id, body) => _fetch('PUT', `/api/ops/service-types/${id}`, body),
  listVehicles: () => get('/api/ops/vehicles'),
  createVehicle: (body) => post('/api/ops/vehicles', body),
  updateVehicle: (id, body) => _fetch('PUT', `/api/ops/vehicles/${id}`, body),
  listFuelPrices: () => get('/api/ops/fuel-prices'),
  createFuelPrice: (body) => post('/api/ops/fuel-prices', body),

  // Shipments
  shipmentsKanban: () => get('/api/ops/shipments/kanban'),
  shipmentsList: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/shipments${q ? `?${q}` : ''}`);
  },
  shipmentTransition: (id, body) => post(`/api/ops/shipments/${id}/transition`, body),
  shipmentHistory: (id) => get(`/api/ops/shipments/${id}/history`),
  shipmentCreate: (body) => post('/api/ops/shipments', body),
  carriersList: () => get('/api/ops/carriers'),
  carrierCreate: (body) => post('/api/ops/carriers', body),

  // Map (F-MAPA)
  mapData: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/map-data${q ? `?${q}` : ''}`);
  },

  // Search (F-SEARCH)
  search: (q, limit=20) => get(`/api/ops/search?q=${encodeURIComponent(q)}&limit=${limit}`),

  // Customer card (F-CLIENTE)
  saleCard: (id) => get(`/api/ops/sales/${id}/card`),
  saleAddNote: (id, body) => post(`/api/ops/sales/${id}/notes`, body),
  saleSyncStage: (id, body) => post(`/api/ops/sales/${id}/zoho/stage`, body),

  // Zoho Deal full + patch (F-MAPA-DRAWER)
  saleZohoDeal: (id) => get(`/api/ops/sales/${id}/zoho-deal`),
  saleZohoDealPatch: (id, fields) => _fetch('PATCH', `/api/ops/sales/${id}/zoho-deal`, { fields }),
  techniciansAll: () => get('/api/ops/technicians'),

  // Deliveries (F-DELIVERY)
  deliveries: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/deliveries${q ? `?${q}` : ''}`);
  },
  deliveriesKanban: () => get('/api/ops/deliveries/kanban'),
  deliveryGet: (id) => get(`/api/ops/deliveries/${id}`),
  deliveryCreate: (body) => post('/api/ops/deliveries', body),
  deliveryPatch: (id, body) => _fetch('PATCH', `/api/ops/deliveries/${id}`, body),
  deliveryTransition: (id, body) => post(`/api/ops/deliveries/${id}/transition`, body),
  deliveryAssignRoute: (id, route_id, technician_id) => post(`/api/ops/deliveries/${id}/assign-route?route_id=${route_id}${technician_id?`&technician_id=${technician_id}`:''}`),
  deliveryProof: (id, body) => post(`/api/ops/deliveries/${id}/proof`, body),
  deliveryBackfill: () => post('/api/ops/internal/deliveries/backfill', {}),
  deliveryRouteFits: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/deliveries/route-fits${q ? `?${q}` : ''}`);
  },

  // Intakes (F-INTAKE)
  intakes: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/intakes${q ? `?${q}` : ''}`);
  },
  intakeGet: (id) => get(`/api/ops/intakes/${id}`),
  intakeCreate: (body) => post('/api/ops/intakes', body),
  intakeGenerateSuggestions: (id, body={}) => post(`/api/ops/intakes/${id}/generate-suggestions`, body),
  intakeApprove: (id, body) => post(`/api/ops/intakes/${id}/approve`, body),
  intakeCancel: (id, body) => post(`/api/ops/intakes/${id}/cancel`, body),
  intakeScan: () => post('/api/ops/internal/intakes/scan', {}),

  // Skills (F-SKILLS-MGMT)
  skills: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/skills${q ? `?${q}` : ''}`);
  },
  skillGet: (key) => get(`/api/ops/skills/${encodeURIComponent(key)}`),
  skillSave: (key, body) => post(`/api/ops/skills/${encodeURIComponent(key)}`, body),
  skillDelete: (key) => _fetch('DELETE', `/api/ops/skills/${encodeURIComponent(key)}`),
  // Auto-distribute (F-AUTO-DISTRIBUTE)
  autoDistributePreview: (body) => post('/api/ops/routes/auto-distribute/preview', body),
  autoDistributeApply: (body) => post('/api/ops/routes/auto-distribute/apply', body),
  // Manual service (F-MANUAL-SERVICE)
  createManualSale: (body) => post('/api/ops/sales/manual', body),
  saleRouteFits: (saleId, params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/sales/${saleId}/route-fits${q?`?${q}`:''}`);
  },

  // Agent Prompts (F-INTAKE-PROMPTS)
  agentPrompts: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/agent-prompts${q ? `?${q}` : ''}`);
  },
  agentPromptGet: (key) => get(`/api/ops/agent-prompts/${encodeURIComponent(key)}`),
  agentPromptSave: (key, body) => post(`/api/ops/agent-prompts/${encodeURIComponent(key)}`, body),
  agentPromptDelete: (key) => _fetch('DELETE', `/api/ops/agent-prompts/${encodeURIComponent(key)}`),
  agentPromptRender: (key, vars) => post(`/api/ops/agent-prompts/${encodeURIComponent(key)}/render`, { vars }),

  // Scheduler status (F-SCHEDULER-WATCH UI)
  schedulerStatus: () => get('/api/ops/internal/scheduler/status'),
  triggerBrasilSatSync: () => post('/api/ops/internal/brasilsat/sync', {}),
  triggerGpsSync: () => post('/api/ops/internal/gps/sync', {}),
  triggerIntakeScan: () => post('/api/ops/internal/intakes/scan?hours_back=24', {}),

  // App Settings (F-CONFIG-PANEL)
  settingsList: (prefix) => get(`/api/ops/settings${prefix?`?prefix=${encodeURIComponent(prefix)}`:''}`),
  settingGet: (key) => get(`/api/ops/settings/${encodeURIComponent(key)}`),
  settingPut: (key, body) => _fetch('PUT', `/api/ops/settings/${encodeURIComponent(key)}`, body),

  // Stage Messages (F-STAGE-MSGS)
  stageMessages: (kanban) => get(`/api/ops/stage-messages${kanban?`?kanban=${kanban}`:''}`),
  stageMessagePlaceholders: () => get('/api/ops/stage-messages/placeholders'),
  stageMessageGet: (id) => get(`/api/ops/stage-messages/${id}`),
  stageMessageCreate: (body) => post('/api/ops/stage-messages', body),
  stageMessageUpdate: (id, body) => _fetch('PUT', `/api/ops/stage-messages/${id}`, body),
  stageMessageDelete: (id) => _fetch('DELETE', `/api/ops/stage-messages/${id}`),
  stageMessageTest: (id, body) => post(`/api/ops/stage-messages/${id}/test`, body),

  // Kanban Stages (F-KANBAN-EDIT)
  kanbanStages: (kanban='shipment', activeOnly=false) => {
    const q = new URLSearchParams({ kanban, ...(activeOnly ? {active: 'true'} : {}) }).toString();
    return get(`/api/ops/kanban/stages?${q}`);
  },
  kanbanStageCreate: (body) => post('/api/ops/kanban/stages', body),
  kanbanStageUpdate: (id, body) => _fetch('PUT', `/api/ops/kanban/stages/${id}`, body),
  kanbanStageDelete: (id) => _fetch('DELETE', `/api/ops/kanban/stages/${id}`),
  kanbanStageReorder: (body) => post('/api/ops/kanban/stages/reorder', body),

  // Maintenance forecasts (F-REFILL)
  forecasts: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/maintenance/forecasts${q ? `?${q}` : ''}`);
  },
  triggerForecasts: () => post('/api/ops/internal/maintenance/forecast/run'),

  // Pós-venda (F7)
  postSaleList: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/post-sale${q ? `?${q}` : ''}`);
  },
  postSaleGet: (id) => get(`/api/ops/post-sale/${id}`),
  postSalePatch: (id, body) => _fetch('PATCH', `/api/ops/post-sale/${id}`, body),
  postSaleContact: (id) => post(`/api/ops/post-sale/${id}/contact`),
  postSaleEscalate: (id) => post(`/api/ops/post-sale/${id}/escalate`),
  triggerPostsaleSync: () => post('/api/ops/internal/post-sale/sync'),

  // Auditoria
  listSuspicious: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/audits/suspicious${q ? `?${q}` : ''}`);
  },
  justifySuspicious: (id, body) => post(`/api/ops/audits/suspicious/${id}/justify`, body),
  listRouteAudits: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/audits/routes${q ? `?${q}` : ''}`);
  },
  listDurationAudits: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/audits/durations${q ? `?${q}` : ''}`);
  },
  listScores: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/audits/scores${q ? `?${q}` : ''}`);
  },
  narrateRoute: (routeId) => post(`/api/ops/audits/narrate/route/${routeId}`),
  narrateTechnician: (techId, date) => post(`/api/ops/audits/narrate/technician/${techId}${date ? `?target_date=${date}` : ''}`),
  triggerScores: () => post('/api/ops/internal/audits/scores/run'),
  triggerKmAudit: () => post('/api/ops/internal/audits/km/run'),
  triggerTimeAudit: () => post('/api/ops/internal/audits/time/run'),
  triggerEscalate: () => post('/api/ops/internal/audits/escalate-criticals'),

  // WhatsApp
  waSend: (body) => post('/api/ops/whatsapp/send', body),
  waManualLink: (body) => post('/api/ops/whatsapp/manual-link', body),
  waMessages: (params={}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/ops/whatsapp/messages${q ? `?${q}` : ''}`);
  },
  waWindow: (phone) => get(`/api/ops/whatsapp/contacts/${encodeURIComponent(phone)}/window`),
};
