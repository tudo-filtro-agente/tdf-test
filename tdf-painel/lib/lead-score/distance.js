/**
 * Lead Score — Distance lookup.
 *
 * Normaliza nome de cidade e consulta `lead_score_cities` no Postgres.
 * Mantém cache em memória de 5min para reduzir round-trips.
 *
 * Função principal:
 *   getDistanceKm(pool, cidade) → { display, km } | null
 *
 * km === null  →  cidade conhecida mas sem distância cadastrada
 * retorno null →  cidade não cadastrada (faixa "nacional/sem cálculo")
 */

const db = require('./db');

const _cache = new Map();        // norm → { v, t }
const TTL_MS = 5 * 60 * 1000;

function normalize(raw) {
  if (raw == null) return '';
  return String(raw)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // strip acentos
    .toLowerCase()
    .replace(/[\.\,\-_/]/g, ' ')                         // pontuação → espaço
    .replace(/\s+/g, ' ')
    .trim()
    // aliases comuns
    .replace(/^sjc$/, 'sao jose dos campos')
    .replace(/^sjcampos$/, 'sao jose dos campos')
    .replace(/^s j campos$/, 'sao jose dos campos')
    .replace(/^s j c$/, 'sao jose dos campos')
    .replace(/^sao paulo capital$/, 'sao paulo')
    .replace(/^sp capital$/, 'sao paulo');
}

async function getDistanceKm(pool, cidade) {
  const norm = normalize(cidade);
  if (!norm) return null;

  const cached = _cache.get(norm);
  if (cached && (Date.now() - cached.t) < TTL_MS) return cached.v;

  try {
    const row = await db.findCityDistance(pool, norm);
    _cache.set(norm, { v: row, t: Date.now() });
    return row;
  } catch (e) {
    console.warn('[lead-score/distance] erro lookup', e.message);
    return null;
  }
}

function clearCache() {
  _cache.clear();
}

function bandMatches(band, km) {
  if (km == null) return band.min_km == null && band.max_km == null && band.code === 'nacional';
  const min = band.min_km != null ? Number(band.min_km) : -Infinity;
  const max = band.max_km != null ? Number(band.max_km) : Infinity;
  return km >= min && km <= max;
}

async function findBandForLead(pool, cidade, productType) {
  const dist = await getDistanceKm(pool, cidade);
  const bands = await db.listDistanceBands(pool, { productType });
  const km = dist ? dist.km : null;

  for (const b of bands) {
    if (bandMatches(b, km)) return { band: b, km, display: dist ? dist.display : null };
  }
  return { band: null, km, display: dist ? dist.display : null };
}

module.exports = {
  normalize,
  getDistanceKm,
  findBandForLead,
  bandMatches,
  clearCache,
};
