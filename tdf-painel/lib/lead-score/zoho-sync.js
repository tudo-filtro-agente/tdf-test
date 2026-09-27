/**
 * Lead Score — Sync portal → Zoho.
 *
 * Escreve Score_Lead e Tier_Lead nos deals do Zoho.
 * Dedupe: se valor atual já é igual, não chama API.
 *
 * Tier_Lead no Zoho usa Title case ('Diamante','Ouro','Prata','Bronze','Pedra')
 * para compatibilidade com o histórico (ver server.js — tierRank usa Title).
 *
 * Uso:
 *   const sync = require('./zoho-sync');
 *   await sync.pushScoreToZoho({ deal_id, score, tier, current: { score, tier } });
 */

let _zoho = null;
function getZohoLib() {
  if (_zoho) return _zoho;
  try {
    _zoho = require('../zoho');
  } catch (e) {
    _zoho = null;
  }
  return _zoho;
}

function tierToZoho(tier) {
  if (!tier) return '';
  const map = {
    DIAMANTE: 'Diamante', OURO: 'Ouro', PRATA: 'Prata',
    BRONZE: 'Bronze',     PEDRA: 'Pedra',
  };
  return map[tier.toUpperCase()] || tier;
}

function tierFromZoho(tier) {
  if (!tier) return null;
  return String(tier).toUpperCase();
}

/**
 * @param {object} payload
 * @param {string} payload.deal_id          Zoho deal id
 * @param {number} payload.score
 * @param {string} payload.tier             internal UPPERCASE
 * @param {object} [payload.current]        { Score_Lead, Tier_Lead } se já lido
 * @param {string} [payload.note]           opcional, vai para campo Score_Lead_Note
 * @returns {{ pushed: bool, reason: string, error?: string, updated_fields: string[] }}
 */
async function pushScoreToZoho(payload) {
  const zoho = getZohoLib();
  if (!zoho || !zoho.updateDeal) {
    return { pushed: false, reason: 'zoho_lib_unavailable', updated_fields: [] };
  }

  let current = payload.current;
  if (!current) {
    try {
      current = await zoho.getDeal(payload.deal_id, 'Score_Lead,Tier_Lead');
    } catch (e) {
      current = null;
    }
  }

  const targetScore = Number(payload.score);
  const targetTier = tierToZoho(payload.tier);
  const fields = {};

  const currScore = current && current.Score_Lead != null ? Number(current.Score_Lead) : null;
  const currTier = current && current.Tier_Lead ? String(current.Tier_Lead) : null;

  if (currScore !== targetScore) fields.Score_Lead = targetScore;
  if (currTier !== targetTier && targetTier) fields.Tier_Lead = targetTier;

  if (Object.keys(fields).length === 0) {
    return { pushed: false, reason: 'no_change', updated_fields: [] };
  }

  try {
    // trigger:[] — push de score não pode disparar workflow do Zoho (reatribuição de dono,
    // tarefa em lead antigo). updateDealSilent envia a atualização sem acionar automações.
    await (zoho.updateDealSilent || zoho.updateDeal)(payload.deal_id, fields);
    return { pushed: true, reason: 'updated', updated_fields: Object.keys(fields) };
  } catch (e) {
    return { pushed: false, reason: 'zoho_error', error: e.message, updated_fields: [] };
  }
}

/**
 * Busca contexto de um deal pra recalcular score. Retorna o objeto Zoho cru —
 * o engine.buildCtxFromDeal cuida de mapear pros campos do leadCtx.
 */
async function fetchDealForScoring(dealId) {
  const zoho = getZohoLib();
  if (!zoho || !zoho.getDeal) return null;
  try {
    const fields = [
      'Deal_Name', 'Stage', 'Pipeline', 'Layout',
      'Score_Lead', 'Tier_Lead',
      'Cidade', 'Telefone_contato',
      'Produto_Vendido', 'Categoria_do_Produto',
      'Tipo_de_Agua', 'Tipo_de_Cliente',
      'Prazo_para_a_Compra',
      'Possui_Analise_de_Agua', 'Aceita_Analise', 'Vazao_da_Bomba',
      'Lead_Source', 'Owner', 'Description',
      'Amount', 'Created_Time', 'Last_Activity_Time'
    ].join(',');
    return await zoho.getDeal(dealId, fields);
  } catch (e) {
    console.warn('[lead-score/zoho-sync] fetchDealForScoring falhou', e.message);
    return null;
  }
}

module.exports = {
  pushScoreToZoho,
  fetchDealForScoring,
  tierToZoho,
  tierFromZoho,
};
