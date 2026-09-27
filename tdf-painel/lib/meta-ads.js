// lib/meta-ads.js — Meta Marketing API client (Graph API v21+)
//
// Env vars necessárias:
//   META_ACCESS_TOKEN          (long-lived user token ou system user)
//   META_AD_ACCOUNT_ID         (sem 'act_' — ex: '1234567890')

const VERSION = 'v21.0';
const BASE = `https://graph.facebook.com/${VERSION}`;

// Override runtime via tenant config (UI cadastra) — fallback pra env vars
let _runtimeCreds = null;
function setCreds(creds) { _runtimeCreds = creds || null; }
function _cred(key) {
  if (_runtimeCreds && _runtimeCreds[key]) return _runtimeCreds[key];
  // Aceita também os nomes antigos do mcp service: META_ADS_ACCESS_TOKEN
  if (key === 'META_ACCESS_TOKEN' && process.env.META_ADS_ACCESS_TOKEN) return process.env.META_ADS_ACCESS_TOKEN;
  return process.env[key] || '';
}
function _hasCreds() {
  return !!(_cred('META_ACCESS_TOKEN') && _cred('META_AD_ACCOUNT_ID'));
}
function _accountId() {
  const id = _cred('META_AD_ACCOUNT_ID');
  return id.startsWith('act_') ? id : 'act_' + id;
}
function _tk() { return _cred('META_ACCESS_TOKEN'); }

async function _get(path, params = {}) {
  if (!_hasCreds()) throw new Error('meta-ads: sem credenciais');
  const qs = new URLSearchParams({ ...params, access_token: _tk() }).toString();
  const url = BASE + path + '?' + qs;
  const r = await fetch(url);
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`meta-ads ${r.status}: ${t.slice(0, 300)}`);
  }
  return r.json();
}

async function _post(path, body = {}) {
  if (!_hasCreds()) throw new Error('meta-ads: sem credenciais');
  const formBody = new URLSearchParams({ ...body, access_token: _tk() });
  const r = await fetch(BASE + path, { method: 'POST', body: formBody });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`meta-ads ${r.status}: ${t.slice(0, 300)}`);
  }
  return r.json();
}

// Lista campanhas com insights — aceita 'last_7d' (preset) OU {start,end}
async function getCampaigns(periodo = 'last_7d') {
  let insightsClause;
  if (typeof periodo === 'object' && periodo?.start && periodo?.end) {
    // URLSearchParams já faz encode — passar JSON direto evita double-encoding
    const tr = JSON.stringify({since: periodo.start, until: periodo.end});
    insightsClause = `insights.time_range(${tr}){spend,impressions,clicks,ctr,cpm,frequency,actions,cost_per_action_type}`;
  } else {
    insightsClause = `insights.date_preset(${periodo}){spend,impressions,clicks,ctr,cpm,frequency,actions,cost_per_action_type}`;
  }
  const j = await _get(`/${_accountId()}/campaigns`, {
    fields: 'id,name,status,effective_status,objective,daily_budget,lifetime_budget,created_time,start_time,buying_type,bid_strategy,' + insightsClause,
    limit: 200,
  });
  return (j.data || []).map(c => {
    const ins = (c.insights?.data?.[0]) || {};
    const leads = (ins.actions || []).find(a => a.action_type === 'lead' || a.action_type === 'leadgen.other')?.value || 0;
    const createdTime = c.created_time;
    let idadeDias = null;
    if (createdTime) {
      idadeDias = Math.floor((Date.now() - new Date(createdTime).getTime()) / 86400000);
    }
    const numLeads = Number(leads) || 0;
    // Heurística Meta: em aprendizado se <7 dias OU adset ainda <50 conversões
    // (Meta diz 50 conv/semana = exit learning). Aqui aproximamos no nivel da campanha.
    const em_aprendizado = idadeDias != null && (idadeDias < 7 || (idadeDias < 14 && numLeads < 50));
    return {
      id: c.id,
      name: c.name,
      status: c.status,
      effective_status: c.effective_status,
      objective: c.objective,
      bid_strategy: c.bid_strategy,
      buying_type: c.buying_type,
      created_time: createdTime,
      idade_dias: idadeDias,
      em_aprendizado,
      budget_brl: ((Number(c.daily_budget) || Number(c.lifetime_budget) || 0)) / 100,
      spend_brl: Number(ins.spend) || 0,
      impressions: Number(ins.impressions) || 0,
      clicks: Number(ins.clicks) || 0,
      ctr: Number(ins.ctr) || 0,
      cpm: Number(ins.cpm) || 0,
      frequency: Number(ins.frequency) || 0,
      leads: numLeads,
    };
  });
}

// Lista ads (criativos) com insights e thumbnail
async function getAdsCreatives(periodo = 'last_7d', limit = 100) {
  let insightsClause;
  if (typeof periodo === 'object' && periodo?.start && periodo?.end) {
    // URLSearchParams já faz encode — passar JSON direto evita double-encoding
    const tr = JSON.stringify({since: periodo.start, until: periodo.end});
    insightsClause = `insights.time_range(${tr}){spend,impressions,clicks,ctr,cpm,frequency,actions,video_p25_watched_actions,video_p75_watched_actions}`;
  } else {
    insightsClause = `insights.date_preset(${periodo}){spend,impressions,clicks,ctr,cpm,frequency,actions,video_p25_watched_actions,video_p75_watched_actions}`;
  }
  const j = await _get(`/${_accountId()}/ads`, {
    fields: 'id,name,status,effective_status,creative{id,thumbnail_url,image_url,video_id,object_story_spec},adset{id,name},campaign{id,name},' + insightsClause,
    limit,
  });
  return (j.data || []).map(a => {
    const ins = a.insights?.data?.[0] || {};
    const v25 = (ins.video_p25_watched_actions || []).find(x => x.action_type === 'video_view')?.value || 0;
    const v75 = (ins.video_p75_watched_actions || []).find(x => x.action_type === 'video_view')?.value || 0;
    const v3s = (ins.video_p25_watched_actions || []).find(x => x.action_type === 'video_view')?.value || 0; // proxy
    const leads = (ins.actions || []).find(x => /lead/i.test(x.action_type))?.value || 0;
    const impressions = Number(ins.impressions) || 0;
    const hookRate = impressions > 0 ? (Number(v3s) / impressions) : 0;
    const holdRate = Number(v3s) > 0 ? (Number(v75) / Number(v3s)) : 0;
    return {
      id: a.id,
      name: a.name,
      status: a.status,
      effective_status: a.effective_status,
      thumbnail_url: a.creative?.thumbnail_url || a.creative?.image_url || null,
      adset_id: a.adset?.id,
      adset_name: a.adset?.name,
      campaign_id: a.campaign?.id,
      campaign_name: a.campaign?.name,
      spend_brl: Number(ins.spend) || 0,
      impressions,
      clicks: Number(ins.clicks) || 0,
      ctr: Number(ins.ctr) || 0,
      cpm: Number(ins.cpm) || 0,
      frequency: Number(ins.frequency) || 0,
      hook_rate: hookRate,
      hold_rate: holdRate,
      leads: Number(leads) || 0,
    };
  });
}

// === MUTATIONS ===
async function pauseCampaign(campaignId) {
  return _post(`/${campaignId}`, { status: 'PAUSED' });
}
async function enableCampaign(campaignId) {
  return _post(`/${campaignId}`, { status: 'ACTIVE' });
}
async function setCampaignBudget(campaignId, dailyBrl) {
  return _post(`/${campaignId}`, { daily_budget: Math.round(dailyBrl * 100) });
}
async function pauseAd(adId) {
  return _post(`/${adId}`, { status: 'PAUSED' });
}

function status() {
  return {
    hasCreds: _hasCreds(),
    accountId: _accountId(),
    apiVersion: VERSION,
  };
}

// Leads breakdown por publisher_platform (Facebook vs Instagram vs Audience Network)
async function getLeadsByPlatform(periodo = 'last_7d') {
  let timeParam;
  if (typeof periodo === 'object' && periodo?.start && periodo?.end) {
    timeParam = { time_range: JSON.stringify({since: periodo.start, until: periodo.end}) };
  } else {
    timeParam = { date_preset: periodo };
  }
  try {
    const j = await _get(`/${_accountId()}/insights`, {
      ...timeParam,
      level: 'account',
      breakdowns: 'publisher_platform',
      fields: 'spend,impressions,clicks,actions',
    });
    const out = { facebook: { leads: 0, spend: 0 }, instagram: { leads: 0, spend: 0 }, audience_network: { leads: 0, spend: 0 }, messenger: { leads: 0, spend: 0 } };
    for (const row of (j.data || [])) {
      const pl = row.publisher_platform || 'unknown';
      const target = out[pl] || (out[pl] = { leads: 0, spend: 0 });
      target.spend += Number(row.spend) || 0;
      const leadAction = (row.actions || []).find(a => /lead/i.test(a.action_type));
      target.leads += Number(leadAction?.value) || 0;
    }
    return out;
  } catch(e) {
    console.warn('[meta.getLeadsByPlatform]', e.message);
    return { error: e.message };
  }
}

module.exports = {
  getCampaigns,
  getAdsCreatives,
  getLeadsByPlatform,
  pauseCampaign,
  enableCampaign,
  setCampaignBudget,
  pauseAd,
  status, setCreds,
};
