// lib/meta-attrib.js — atribuição em camadas pra Meta Lead Ads cego
//
// Resolve o problema crônico: webhook WATI recebe leads de Lead Ads do Facebook
// mas não consegue identificar campaign_id/ad_id de forma direta.
//
// Estratégia 5 camadas (decrescente em confiança):
//   1. high   — referral.sourceId/adId direto no payload WATI (raro mas existe)
//   2. high   — UTMs explícitos no link (utm_campaign + utm_content + utm_source)
//   3. medium — fbclid presente (correlacionar via Meta Insights API se setada)
//   4. medium — ctwa_clid (Click-to-WhatsApp ID, identifica ad mas não 100%)
//   5. low    — sourceUrl com ad_id parseável (regex pattern Meta)
//   6. none   — orgânico ou indistinguível

const URL_AD_PATTERNS = [
  // Padrões comuns que Meta Lead Ads passa em links externos
  /[?&]ad_id=(\d+)/i,
  /[?&]adset_id=(\d+)/i,
  /[?&]campaign_id=(\d+)/i,
  /[?&]fbclid=([A-Za-z0-9_-]+)/i,
  /[?&]ctwa_clid=([A-Za-z0-9_-]+)/i,
];

function parseUrlAttrib(url) {
  if (!url) return {};
  const out = {};
  try {
    const u = new URL(url);
    // UTMs explícitos
    const params = u.searchParams;
    if (params.get('utm_source')) out.utm_source = params.get('utm_source');
    if (params.get('utm_medium')) out.utm_medium = params.get('utm_medium');
    if (params.get('utm_campaign')) out.utm_campaign = params.get('utm_campaign');
    if (params.get('utm_content')) out.utm_content = params.get('utm_content');
    if (params.get('utm_term')) out.utm_term = params.get('utm_term');
    // IDs Meta
    if (params.get('ad_id')) out.ad_id = params.get('ad_id');
    if (params.get('adset_id')) out.adset_id = params.get('adset_id');
    if (params.get('campaign_id')) out.campaign_id = params.get('campaign_id');
    if (params.get('fbclid')) out.fbclid = params.get('fbclid');
    if (params.get('ctwa_clid')) out.ctwa_clid = params.get('ctwa_clid');
    if (params.get('gclid')) out.gclid = params.get('gclid');
  } catch(e) {
    // URL inválida — tenta regex direto
    for (const pat of URL_AD_PATTERNS) {
      const m = url.match(pat);
      if (m) {
        const key = pat.source.match(/[?&]([a-z_]+)=/)?.[1];
        if (key) out[key] = m[1];
      }
    }
  }
  return out;
}

// Determina confidence + lead_source string baseado nos sinais coletados
function classifyAttrib(parsed, referralExtra) {
  const all = { ...parsed, ...(referralExtra || {}) };
  // Camada 1 — IDs diretos da Meta (mais alto)
  if (all.ad_id || all.campaign_id) {
    return {
      confidence: 'high',
      lead_source: `Meta · LeadAd · ${all.utm_campaign || all.campaign_id || 'campanha'}${all.utm_content ? ' · '+all.utm_content : ''}`,
      ids: { ad_id: all.ad_id, adset_id: all.adset_id, campaign_id: all.campaign_id },
    };
  }
  // Camada 2 — UTMs completos (high se source+campaign+content)
  if (all.utm_source && all.utm_campaign && (all.utm_content || all.utm_medium)) {
    const src = String(all.utm_source).toLowerCase();
    const platform = /facebook|fb|meta|ig|instagram/i.test(src) ? 'Meta'
                   : /google/i.test(src) ? 'Google'
                   : /whatsapp/i.test(src) ? 'WhatsApp'
                   : src.toUpperCase();
    return {
      confidence: 'high',
      lead_source: `${platform} · ${all.utm_medium || ''} · ${all.utm_campaign}${all.utm_content ? ' · '+all.utm_content : ''}`,
      utms: { source: all.utm_source, medium: all.utm_medium, campaign: all.utm_campaign, content: all.utm_content },
    };
  }
  // Camada 3 — fbclid (medium — sabemos que veio de FB mas não qual ad sem cruzar com Insights)
  if (all.fbclid) {
    return {
      confidence: 'medium',
      lead_source: 'Meta · fbclid · campanha indeterminada',
      fbclid: all.fbclid,
    };
  }
  // Camada 4 — ctwa_clid (CTWA = Click-to-WhatsApp Ad da Meta)
  if (all.ctwa_clid) {
    return {
      confidence: 'medium',
      lead_source: 'Meta · CTWA · campanha indeterminada',
      ctwa_clid: all.ctwa_clid,
    };
  }
  // Camada 5 — gclid (Google)
  if (all.gclid) {
    return {
      confidence: 'medium',
      lead_source: 'Google · gclid · campanha indeterminada',
      gclid: all.gclid,
    };
  }
  // Camada 6 — UTMs parciais
  if (all.utm_source) {
    return {
      confidence: 'low',
      lead_source: `${all.utm_source}${all.utm_campaign ? ' · '+all.utm_campaign : ''}`,
    };
  }
  return { confidence: 'none', lead_source: '' };
}

// Função principal: dado um payload WATI de webhook, extrai atribuição
function extractAttribFromWebhook(body) {
  if (!body) return { confidence: 'none', lead_source: '' };
  // WATI traz `referral.sourceUrl` ou `referral.body` ou `messageReferral` em alguns formatos
  const ref = body.referral || body.messageReferral || {};
  const url = ref.sourceUrl || ref.url || ref.source_url || ref.body || '';
  const parsed = parseUrlAttrib(url);
  // IDs diretos no referral (alguns webhooks WATI passam adId/headline)
  const referralExtra = {};
  if (ref.adId || ref.ad_id) referralExtra.ad_id = ref.adId || ref.ad_id;
  if (ref.headline) referralExtra.utm_content = ref.headline;
  if (ref.sourceType) referralExtra.utm_source = ref.sourceType;
  // CTWA específico
  if (ref.ctwaClid || body.ctwa_clid) referralExtra.ctwa_clid = ref.ctwaClid || body.ctwa_clid;
  return classifyAttrib(parsed, referralExtra);
}

module.exports = {
  parseUrlAttrib,
  classifyAttrib,
  extractAttribFromWebhook,
};
