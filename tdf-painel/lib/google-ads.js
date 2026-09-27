// lib/google-ads.js — Google Ads API v17 client (wrapper REST direto)
//
// Env vars necessárias:
//   GOOGLE_ADS_DEVELOPER_TOKEN
//   GOOGLE_ADS_CLIENT_ID
//   GOOGLE_ADS_CLIENT_SECRET
//   GOOGLE_ADS_REFRESH_TOKEN
//   GOOGLE_ADS_LOGIN_CUSTOMER_ID  (manager account, sem hífens)
//   GOOGLE_ADS_CUSTOMER_ID        (conta TDF, sem hífens)

// API Google Ads — v17/18/19 foram descontinuadas. v20+ funciona.
const VERSION = 'v21';
const BASE = `https://googleads.googleapis.com/${VERSION}`;

let _token = null;
let _tokenExpiry = 0;
let _refreshInFlight = null;

// Override runtime via tenant config (UI cadastra) — fallback pra env vars
let _runtimeCreds = null;
function setCreds(creds) {
  _runtimeCreds = creds || null;
  _token = null; _tokenExpiry = 0; // força refresh com novas creds
}
function _cred(key) {
  if (_runtimeCreds && _runtimeCreds[key]) return _runtimeCreds[key];
  return process.env[key] || '';
}
function _hasCreds() {
  return !!(_cred('GOOGLE_ADS_REFRESH_TOKEN')
    && _cred('GOOGLE_ADS_CLIENT_ID')
    && _cred('GOOGLE_ADS_CLIENT_SECRET')
    && _cred('GOOGLE_ADS_DEVELOPER_TOKEN'));
}

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  if (_refreshInFlight) return _refreshInFlight;
  if (!_hasCreds()) return null;
  _refreshInFlight = (async () => {
    try {
      const params = new URLSearchParams({
        refresh_token: _cred('GOOGLE_ADS_REFRESH_TOKEN'),
        client_id: _cred('GOOGLE_ADS_CLIENT_ID'),
        client_secret: _cred('GOOGLE_ADS_CLIENT_SECRET'),
        grant_type: 'refresh_token',
      });
      const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: params });
      const j = await r.json();
      if (j.access_token) {
        _token = j.access_token;
        _tokenExpiry = Date.now() + 3000 * 1000;
        console.log('[google-ads] token refreshed OK');
      } else {
        console.error('[google-ads] token failed:', JSON.stringify(j));
      }
    } catch(e) { console.error('[google-ads] token error:', e.message); }
    finally { _refreshInFlight = null; }
    return _token;
  })();
  return _refreshInFlight;
}

function _customerId() {
  const id = _cred('GOOGLE_ADS_CUSTOMER_ID');
  return id.replace(/-/g, '');
}
function _loginCustomerId() {
  const id = _cred('GOOGLE_ADS_LOGIN_CUSTOMER_ID') || _cred('GOOGLE_ADS_MANAGER_ID');
  return id.replace(/-/g, '');
}

async function _post(path, body) {
  const token = await getToken();
  if (!token) throw new Error('google-ads: sem credenciais');
  const headers = {
    Authorization: `Bearer ${token}`,
    'developer-token': _cred('GOOGLE_ADS_DEVELOPER_TOKEN'),
    'Content-Type': 'application/json',
  };
  const loginCid = _loginCustomerId();
  if (loginCid) headers['login-customer-id'] = loginCid;
  const r = await fetch(BASE + path, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!r.ok) {
    const errText = await r.text();
    throw new Error(`google-ads ${r.status}: ${errText.slice(0, 300)}`);
  }
  return r.json();
}

// Roda GAQL. Retorna lista flat de results.
async function runGAQL(query) {
  const cid = _customerId();
  if (!cid) throw new Error('google-ads: GOOGLE_ADS_CUSTOMER_ID não setado');
  const j = await _post(`/customers/${cid}/googleAds:searchStream`, { query });
  // searchStream retorna array de { results: [...] }
  const all = [];
  if (Array.isArray(j)) for (const chunk of j) all.push(...(chunk.results || []));
  else if (j.results) all.push(...j.results);
  return all;
}

// Lista campanhas com métricas — aceita days OU {start,end} (YYYY-MM-DD)
async function getCampaignMetrics(daysOrRange = 7) {
  let dateClause;
  if (typeof daysOrRange === 'object' && daysOrRange?.start && daysOrRange?.end) {
    dateClause = `segments.date BETWEEN '${daysOrRange.start}' AND '${daysOrRange.end}'`;
  } else {
    const days = Number(daysOrRange) || 7;
    dateClause = `segments.date DURING ${days <= 1 ? 'TODAY' : 'LAST_' + days + '_DAYS'}`;
  }
  const q = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign.start_date,
      campaign.bidding_strategy_type,
      campaign_budget.amount_micros,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.conversions,
      metrics.conversions_value,
      metrics.average_cpc,
      metrics.ctr
    FROM campaign
    WHERE ${dateClause}
      AND campaign.status != 'REMOVED'
    ORDER BY metrics.cost_micros DESC
  `;
  const rows = await runGAQL(q);
  return rows.map(r => {
    const startDate = r.campaign?.startDate || r.campaign?.start_date;
    let idadeDias = null;
    if (startDate) {
      idadeDias = Math.floor((Date.now() - new Date(startDate + 'T00:00:00').getTime()) / 86400000);
    }
    const conversions = Number(r.metrics?.conversions) || 0;
    // Heurística Google: campanha em aprendizado se <7 dias OU <30 conversões totais
    const em_aprendizado = idadeDias != null && (idadeDias < 7 || (idadeDias < 14 && conversions < 30));
    return {
      id: r.campaign?.id,
      name: r.campaign?.name,
      status: r.campaign?.status,
      type: r.campaign?.advertisingChannelType,
      bidding_strategy: r.campaign?.biddingStrategyType,
      start_date: startDate,
      idade_dias: idadeDias,
      em_aprendizado,
      budget_brl: (Number(r.campaignBudget?.amountMicros) || 0) / 1e6,
      cost_brl: (Number(r.metrics?.costMicros) || 0) / 1e6,
      impressions: Number(r.metrics?.impressions) || 0,
      clicks: Number(r.metrics?.clicks) || 0,
      conversions,
      conv_value: Number(r.metrics?.conversionsValue) || 0,
      cpc_brl: (Number(r.metrics?.averageCpc) || 0) / 1e6,
      ctr: Number(r.metrics?.ctr) || 0,
    };
  });
}

// Lista keywords com métricas
async function getKeywordMetrics(daysOrRange = 30, limit = 200) {
  let dateClause;
  if (typeof daysOrRange === 'object' && daysOrRange?.start && daysOrRange?.end) {
    dateClause = `segments.date BETWEEN '${daysOrRange.start}' AND '${daysOrRange.end}'`;
  } else {
    const days = Number(daysOrRange) || 30;
    dateClause = `segments.date DURING ${days <= 1 ? 'TODAY' : 'LAST_' + days + '_DAYS'}`;
  }
  const q = `
    SELECT
      ad_group.id, ad_group.name,
      campaign.id, campaign.name,
      ad_group_criterion.criterion_id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.conversions,
      metrics.conversions_value,
      metrics.ctr
    FROM keyword_view
    WHERE ${dateClause}
      AND ad_group_criterion.status = 'ENABLED'
    ORDER BY metrics.cost_micros DESC
    LIMIT ${limit}
  `;
  const rows = await runGAQL(q);
  return rows.map(r => ({
    keyword: r.adGroupCriterion?.keyword?.text,
    match_type: r.adGroupCriterion?.keyword?.matchType,
    criterion_id: r.adGroupCriterion?.criterionId,
    ad_group_id: r.adGroup?.id,
    ad_group_name: r.adGroup?.name,
    campaign_id: r.campaign?.id,
    campaign_name: r.campaign?.name,
    cost_brl: (Number(r.metrics?.costMicros) || 0) / 1e6,
    impressions: Number(r.metrics?.impressions) || 0,
    clicks: Number(r.metrics?.clicks) || 0,
    conversions: Number(r.metrics?.conversions) || 0,
    conv_value: Number(r.metrics?.conversionsValue) || 0,
    ctr: Number(r.metrics?.ctr) || 0,
  }));
}

// === MUTATIONS ===
async function pauseCampaign(campaignId) {
  const cid = _customerId();
  return _post(`/customers/${cid}/campaigns:mutate`, {
    operations: [{
      update: {
        resource_name: `customers/${cid}/campaigns/${campaignId}`,
        status: 'PAUSED',
      },
      update_mask: 'status',
    }],
  });
}

async function enableCampaign(campaignId) {
  const cid = _customerId();
  return _post(`/customers/${cid}/campaigns:mutate`, {
    operations: [{
      update: {
        resource_name: `customers/${cid}/campaigns/${campaignId}`,
        status: 'ENABLED',
      },
      update_mask: 'status',
    }],
  });
}

async function setBudget(campaignBudgetId, amountBrl) {
  const cid = _customerId();
  return _post(`/customers/${cid}/campaignBudgets:mutate`, {
    operations: [{
      update: {
        resource_name: `customers/${cid}/campaignBudgets/${campaignBudgetId}`,
        amount_micros: Math.round(amountBrl * 1e6),
      },
      update_mask: 'amount_micros',
    }],
  });
}

async function pauseKeyword(adGroupId, criterionId) {
  const cid = _customerId();
  return _post(`/customers/${cid}/adGroupCriteria:mutate`, {
    operations: [{
      update: {
        resource_name: `customers/${cid}/adGroupCriteria/${adGroupId}~${criterionId}`,
        status: 'PAUSED',
      },
      update_mask: 'status',
    }],
  });
}

function status() {
  return {
    hasCreds: _hasCreds(),
    hasToken: !!_token,
    expiresIn: _token ? Math.max(0, _tokenExpiry - Date.now()) : 0,
    customerId: _customerId() || null,
    loginCustomerId: _loginCustomerId() || null,
  };
}

module.exports = {
  getToken, runGAQL, getCampaignMetrics, getKeywordMetrics,
  pauseCampaign, enableCampaign, setBudget, pauseKeyword,
  status, setCreds,
};
