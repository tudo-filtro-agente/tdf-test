/**
 * Lead Score — Engine de cálculo.
 *
 *   calculate(pool, leadCtx, { traceMisses }) → breakdown
 *
 * leadCtx normalizado pode conter (todos opcionais):
 *   product_type            string (uma das constantes PRODUCT_TYPES)
 *   cidade                  string (qualquer grafia — engine normaliza)
 *   water_source            'poco' | 'mina' | 'cachoeira' | 'concessionaria' | ...
 *   symptoms                string | string[]  (lista de sintomas relatados)
 *   has_water_analysis      bool
 *   accepts_analysis_or_visit  bool
 *   flow_rate_known         bool
 *   accepts_flow_measure    bool
 *   audience                'pousada' | 'comercio' | 'industria' | 'empresa' | ...
 *   days_to_buy             number (dias até intenção de compra)
 *   asked_price             bool
 *   asked_install           bool
 *   sent_media              bool
 *   has_caixa_dagua         bool
 *   has_sensitive_equipment bool
 *   curioso_sem_intencao    bool
 *   is_pessoa_fisica        bool
 *   has_business_context    bool
 *   people_count_informed   bool
 *   consumption_informed    bool
 *   needs_pronta_entrega    bool
 *   accepts_nationwide_ship bool
 *   phone_invalid           bool
 *
 * O engine resolve internamente distance_km via distance.js e adiciona
 * ao ctx para que critérios distance_range possam usar.
 */

const db = require('./db');
const distance = require('./distance');

/* ============== DSL evaluator ============== */

function _getField(ctx, field) {
  return ctx[field];
}

function _normStr(v) {
  if (v == null) return '';
  return String(v).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function _asArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  return [v];
}

function evaluate(cond, ctx) {
  if (!cond || !cond.type) return false;

  switch (cond.type) {
    case 'truthy': {
      const v = _getField(ctx, cond.field);
      return !!v;
    }
    case 'falsy': {
      // Volta a comportamento original — null/undefined/false todos disparam.
      // Critérios penalizadores que devem ser estritos usam 'is_false' (explícito).
      const v = _getField(ctx, cond.field);
      return !v;
    }
    case 'is_false': {
      // Só dispara em FALSE explícito (não null/undefined). Usar em critérios
      // negativos que precisam que o lead tenha sido explicitamente perguntado.
      const v = _getField(ctx, cond.field);
      return v === false;
    }
    case 'has_value': {
      const v = _getField(ctx, cond.field);
      const present = v != null && v !== '' && v !== false;
      return cond.negate ? !present : present;
    }
    case 'eq': {
      const v = _normStr(_getField(ctx, cond.field));
      return v === _normStr(cond.value);
    }
    case 'in_list': {
      const v = _normStr(_getField(ctx, cond.field));
      if (!v) return false;
      return (cond.values || []).map(_normStr).includes(v);
    }
    case 'contains_any': {
      const raw = _getField(ctx, cond.field);
      const arr = _asArray(raw).map(_normStr).filter(Boolean);
      const blob = arr.join(' ') + ' ' + _normStr(raw);
      for (const needle of (cond.values || [])) {
        const n = _normStr(needle);
        if (!n) continue;
        if (arr.includes(n)) return true;
        if (blob.includes(n)) return true;
      }
      return false;
    }
    case 'numeric_compare': {
      const v = _getField(ctx, cond.field);
      if (v == null || v === '') return false;
      const n = Number(v);
      if (!Number.isFinite(n)) return false;
      const tgt = Number(cond.value);
      switch (cond.op) {
        case 'lt':  return n < tgt;
        case 'lte': return n <= tgt;
        case 'gt':  return n > tgt;
        case 'gte': return n >= tgt;
        case 'eq':  return n === tgt;
        case 'ne':  return n !== tgt;
        default: return false;
      }
    }
    case 'distance_range': {
      const km = ctx.distance_km;
      if (km == null) return false;
      if (cond.min != null && km < Number(cond.min)) return false;
      if (cond.max != null && km > Number(cond.max)) return false;
      return true;
    }
    case 'distance_band': {
      return ctx._matched_band_code === cond.band_code;
    }
    case 'all_of': {
      return (cond.conditions || []).every(c => evaluate(c, ctx));
    }
    case 'any_of': {
      return (cond.conditions || []).some(c => evaluate(c, ctx));
    }
    case 'not': {
      return !evaluate(cond.condition, ctx);
    }
    default:
      return false;
  }
}

/* ============== Tier ============== */

const DEFAULT_TIERS = {
  DIAMANTE: { min: 80, max: null, icon: '💎' },
  OURO:     { min: 60, max: 79, icon: '🥇' },
  PRATA:    { min: 40, max: 59, icon: '🥈' },
  BRONZE:   { min: 20, max: 39, icon: '🥉' },
  PEDRA:    { min: null, max: 19, icon: '🪨' },
};

function tierFromScore(score, thresholds) {
  const t = thresholds || DEFAULT_TIERS;
  // ordem fixa do mais alto pro mais baixo
  const order = ['DIAMANTE', 'OURO', 'PRATA', 'BRONZE', 'PEDRA'];
  for (const name of order) {
    const cfg = t[name];
    if (!cfg) continue;
    const min = cfg.min == null ? -Infinity : Number(cfg.min);
    const max = cfg.max == null ? Infinity : Number(cfg.max);
    if (score >= min && score <= max) return name;
  }
  return 'PEDRA';
}

/* ============== Main calc ============== */

async function calculate(pool, rawCtx, opts = {}) {
  const ctx = { ...rawCtx };
  const productType = ctx.product_type || 'OUTROS';

  // 1) resolve distância
  let bandInfo = { band: null, km: null, display: null };
  if (ctx.cidade) {
    bandInfo = await distance.findBandForLead(pool, ctx.cidade, productType);
  } else {
    // fallback: já injetado pelo caller
    if (ctx.distance_km != null) {
      const bands = await db.listDistanceBands(pool, { productType });
      for (const b of bands) {
        if (distance.bandMatches(b, ctx.distance_km)) { bandInfo = { band: b, km: ctx.distance_km, display: null }; break; }
      }
    }
  }
  ctx.distance_km = bandInfo.km;
  ctx._matched_band_code = bandInfo.band ? bandInfo.band.code : null;

  // 2) busca critérios ativos
  const criteria = await db.listCriteria(pool, { productType });
  const thresholds = await db.getSetting(pool, 'tier_thresholds', DEFAULT_TIERS);
  const specialRules = await db.getSetting(pool, 'special_rules', {
    invalid_phone_forces_pedra: true,
    above_300_iron_free_no_analysis_needs_qualif: true,
    diamante_min_must_have_phone_valid: true,
  });

  // 3) avalia
  const hits = [];
  const misses = [];
  for (const c of criteria) {
    const cond = typeof c.condition_json === 'string' ? JSON.parse(c.condition_json) : c.condition_json;
    let matched = false;
    try { matched = evaluate(cond, ctx); } catch (e) { matched = false; }
    if (matched) {
      hits.push({
        id: c.id, code: c.code, name: c.name, description: c.description,
        points: Number(c.points), group_key: c.group_key, group_cap: c.group_cap,
        accumulable: c.accumulable,
      });
    } else if (opts.traceMisses) {
      misses.push({ id: c.id, code: c.code, name: c.name, points: Number(c.points), group_key: c.group_key });
    }
  }

  // 4) aplica accumulable=false (mantém só a primeira por group_key)
  const seenGroupsNonAccum = new Set();
  const filteredHits = [];
  for (const h of hits) {
    if (h.accumulable === false && h.group_key) {
      if (seenGroupsNonAccum.has(h.group_key)) continue;
      seenGroupsNonAccum.add(h.group_key);
    }
    filteredHits.push(h);
  }

  // 5) aplica group_cap (limite por grupo)
  const groupCaps = {};                  // group_key → cap (max positivo)
  for (const h of filteredHits) {
    if (h.group_cap != null && h.group_key) {
      groupCaps[h.group_key] = Math.max(groupCaps[h.group_key] || 0, Number(h.group_cap));
    }
  }
  const groupTotals = {};
  const adjustments = [];
  let subtotal = 0;
  for (const h of filteredHits) {
    const k = h.group_key || '__none__';
    const cap = groupCaps[h.group_key];
    if (cap != null && (groupTotals[k] || 0) + Math.max(h.points, 0) > cap) {
      const remaining = Math.max(0, cap - (groupTotals[k] || 0));
      const original = h.points;
      const capped = h.points >= 0 ? remaining : h.points;     // só capa positivos
      if (capped !== original) {
        adjustments.push({
          code: h.code, reason: `group_cap=${cap} no grupo "${h.group_key}"`,
          original, applied: capped, diff: capped - original
        });
      }
      h.applied_points = capped;
      groupTotals[k] = (groupTotals[k] || 0) + capped;
      subtotal += capped;
    } else {
      h.applied_points = h.points;
      groupTotals[k] = (groupTotals[k] || 0) + h.points;
      subtotal += h.points;
    }
  }

  // 6) adiciona faixa de distância como hit
  if (bandInfo.band && Number(bandInfo.band.points) !== 0) {
    const bandHit = {
      id: `band:${bandInfo.band.id}`,
      code: `band__${bandInfo.band.code}`,
      name: `Distância: ${bandInfo.band.label}` + (bandInfo.km != null ? ` (${bandInfo.km} km)` : ''),
      description: bandInfo.band.label,
      points: Number(bandInfo.band.points),
      applied_points: Number(bandInfo.band.points),
      group_key: 'distancia',
      group_cap: null,
      accumulable: true,
      is_distance_band: true,
    };
    filteredHits.push(bandHit);
    subtotal += Number(bandInfo.band.points);
  }

  // 7) clamp total entre -100 e 100
  let total = Math.max(-100, Math.min(100, subtotal));
  if (total !== subtotal) {
    adjustments.push({
      code: 'clamp',
      reason: 'Score clamp entre -100 e 100',
      original: subtotal, applied: total, diff: total - subtotal
    });
  }

  // 8) tier base
  let tier = tierFromScore(total, thresholds);

  // 9) special rules
  const specialRulesApplied = [];

  if (specialRules?.invalid_phone_forces_pedra && ctx.phone_invalid) {
    if (tier !== 'PEDRA') specialRulesApplied.push({ rule: 'invalid_phone_forces_pedra', from: tier, to: 'PEDRA' });
    tier = 'PEDRA';
  }

  if (
    specialRules?.above_300_iron_free_no_analysis_needs_qualif &&
    (productType === 'IRON_FREE' || productType === 'FILTRO_ENTRADA_POCO') &&
    (bandInfo.km != null && bandInfo.km > 300) &&
    !ctx.has_water_analysis
  ) {
    // não força PEDRA, mas marca "needs_qualif" — usado por roteamento
    if (tier === 'DIAMANTE' || tier === 'OURO') {
      specialRulesApplied.push({ rule: 'needs_qualif_before_closer', tier_kept: tier, marker: 'requires_sdr_qualification' });
    }
  }

  if (specialRules?.diamante_min_must_have_phone_valid && tier === 'DIAMANTE' && ctx.phone_invalid) {
    specialRulesApplied.push({ rule: 'diamante_requires_phone_valid', from: 'DIAMANTE', to: 'BRONZE' });
    tier = 'BRONZE';
  }

  const breakdown = {
    product_type: productType,
    score_auto: total,
    tier_auto: tier,
    hits: filteredHits.map(h => ({
      code: h.code, name: h.name, description: h.description,
      points: h.points, applied_points: h.applied_points,
      group_key: h.group_key,
      is_distance_band: !!h.is_distance_band,
    })),
    misses: misses,
    adjustments,
    special_rules_applied: specialRulesApplied,
    distance: {
      cidade_input: rawCtx.cidade || null,
      cidade_match: bandInfo.display,
      km: bandInfo.km,
      band: bandInfo.band ? { code: bandInfo.band.code, label: bandInfo.band.label, points: Number(bandInfo.band.points) } : null,
    },
    calculated_at: new Date().toISOString(),
  };

  return breakdown;
}

/* ============== Helper: builds lead_ctx from a Zoho deal payload ============== */

function buildCtxFromDeal(deal) {
  if (!deal) return {};

  const productRaw = String(deal.Produto_Vendido || deal.Categoria_do_Produto || '').toLowerCase();
  const water = String(deal.Tipo_de_Agua || '').toLowerCase();
  let product_type = 'OUTROS';
  if (/iron|ferro\s*free/i.test(productRaw)) product_type = 'IRON_FREE';
  else if (/scale\s*stop|abrandador/i.test(productRaw)) product_type = 'SCALE_STOP';
  else if (/bebedouro|industrial/i.test(productRaw)) product_type = 'BEBEDOURO_INDUSTRIAL';
  else if (/refil|manuten/i.test(productRaw)) product_type = 'REFIL_MANUTENCAO';
  else if (/purificador/i.test(productRaw)) product_type = 'PURIFICADOR';
  else if (/pe[cç]a|acess[oó]rio/i.test(productRaw)) product_type = 'PECAS_ACESSORIOS';
  else if (/filtro.*(entrada|residenc)|filtralli/i.test(productRaw)) {
    product_type = /poco|poço|po..o|mina|cachoeira/.test(water) ? 'FILTRO_ENTRADA_POCO' : 'FILTRO_ENTRADA_AGUA_TRATADA';
  }
  // CORREÇÃO BUG 2: se produto não detectado mas Tipo_de_Agua conhecido, infere
  if (product_type === 'OUTROS' && water) {
    if (/poco|poço|po..o|artesiano|po.o/.test(water)) product_type = 'FILTRO_ENTRADA_POCO';
    else if (/mina|cachoeira|superf|fonte|rio|nascente/.test(water)) product_type = 'FILTRO_ENTRADA_POCO';
    else if (/esta[cç][aã]o|tratamento|sabesp|concession|rede.*p[uú]bl|tratada/.test(water)) product_type = 'FILTRO_ENTRADA_AGUA_TRATADA';
  }

  let water_source = null;
  if (/poco|poço|po..o|artesiano/.test(water)) water_source = 'poco';
  else if (/mina/.test(water)) water_source = 'mina';
  else if (/cachoeira|superficie/.test(water)) water_source = 'cachoeira';
  else if (/concession|sabesp|tratada|rua|esta[cç][aã]o|tratamento|rede.*p[uú]bl/.test(water)) water_source = 'concessionaria';

  // dias até compra — CORREÇÃO BUG 3: regex expandida pra cobrir formatos Meta/Google
  const prazoRaw = String(deal.Prazo_para_a_Compra || '').toLowerCase();
  let days_to_buy = null;
  if (/imediat|hoje|at[eé].*7.*d|em.*at[eé].*7|7.*d|esta.*semana/.test(prazoRaw)) days_to_buy = 5;
  else if (/15.*d|2.*semana|pr[oó]ximas?.*semana/.test(prazoRaw)) days_to_buy = 15;
  else if (/30.*d|at[eé].*1.*m[eê]s|1.*m[eê]s|este.*m[eê]s/.test(prazoRaw)) days_to_buy = 30;
  else if (/60.*d|2.*m[eê]s|at[eé].*2.*m/.test(prazoRaw)) days_to_buy = 60;
  else if (/90.*d|3.*m[eê]s|at[eé].*3.*m/.test(prazoRaw)) days_to_buy = 90;
  else if (/acima.*3.*m|mais.*3.*m|6.*m[eê]s|semestre/.test(prazoRaw)) days_to_buy = 180;
  else if (/ano|12.*m|365/.test(prazoRaw)) days_to_buy = 365;

  // telefone — só marca inválido se claramente é
  const tel = String(deal.Telefone_contato || '').replace(/\D/g, '');
  const phone_invalid = tel.length > 0 && tel.length < 10;

  return {
    product_type,
    cidade: deal.Cidade || null,
    water_source,
    days_to_buy,
    phone_invalid,
    // os booleanos abaixo vêm de campos custom ou da Núbia; permanecem null se não setados
    has_water_analysis: deal.Possui_Analise_de_Agua === true || /sim|tenho/i.test(String(deal.Possui_Analise_de_Agua || '')),
    accepts_analysis_or_visit: deal.Aceita_Analise === true || /sim/i.test(String(deal.Aceita_Analise || '')),
    flow_rate_known: deal.Vazao_da_Bomba != null && String(deal.Vazao_da_Bomba).trim() !== '',
    audience: (deal.Tipo_de_Cliente || '').toLowerCase() || null,
    asked_price: /preco|preço|valor|or[cç]amento/i.test(String(deal.Description || '')),
    // metadata pra handoff e cascata de cadência (não usado em scoring)
    telefone_contato: deal.Telefone_contato || null,
    _owner_name: deal.Owner?.name || deal.Owner?.email || null,
    _layout: deal.Layout?.name || deal.Layout || null,
    _pipeline: deal.Pipeline || null,
    _stage: deal.Stage || null,
  };
}

module.exports = {
  calculate,
  evaluate,
  tierFromScore,
  buildCtxFromDeal,
  DEFAULT_TIERS,
};
