/**
 * Detector de leads parados (sem atividade há N dias úteis).
 * Lista deals em stage ativo cujo Last_Activity_Time é mais antigo que o limite.
 */
const db = require('./db');
const validator = require('./owner-validator');

const STAGES_ATIVOS = [
  'Primeiro Contato', 'Em Qualificação', 'Etapa IA',
  'Analise ou vazão', 'Qualificado',
  'Proposta', 'Proposta Quente', 'Proposta Fria',
  'Em Atendimento',
];

function _businessDaysAgo(days) {
  const d = new Date();
  let removed = 0;
  while (removed < days) {
    d.setDate(d.getDate() - 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) removed++;
  }
  return d;
}

async function detectStuck(zohoLib, { daysUteis = 3, limit = 300 } = {}) {
  if (!zohoLib?.search) return { ok: false, error: 'zoho_lib_unavailable' };

  const limitDate = _businessDaysAgo(daysUteis);
  const pad = n => String(n).padStart(2, '0');
  const limitIso = `${limitDate.getFullYear()}-${pad(limitDate.getMonth()+1)}-${pad(limitDate.getDate())}T23:59:59-03:00`;
  const criteria = `(Stage:in:${STAGES_ATIVOS.join(',')})and(Last_Activity_Time:less_than:${limitIso})`;
  const fields = 'Deal_Name,Stage,Pipeline,Layout,Owner,Last_Activity_Time,Created_Time,Tier_Lead,Score_Lead,Categoria_do_Produto,Produto_Vendido,Tipo_de_Agua,Cidade,Telefone_contato,Amount';

  let deals = [];
  try {
    deals = await zohoLib.search(criteria, fields, 200, 5);
  } catch (e) {
    return { ok: false, error: 'zoho_search_failed: ' + e.message };
  }

  // Agrupa por owner
  const byOwner = {};
  for (const d of deals.slice(0, limit)) {
    const owner = d.Owner?.name || '(sem owner)';
    if (!byOwner[owner]) byOwner[owner] = [];
    byOwner[owner].push({
      id: d.id,
      name: d.Deal_Name,
      stage: d.Stage,
      pipeline: d.Pipeline,
      layout: d.Layout?.name || d.Layout || null,
      tier: d.Tier_Lead,
      score: d.Score_Lead,
      product: d.Categoria_do_Produto || d.Produto_Vendido || null,
      tipo_agua: d.Tipo_de_Agua,
      cidade: d.Cidade,
      phone: d.Telefone_contato,
      amount: d.Amount,
      last_activity: d.Last_Activity_Time,
      created: d.Created_Time,
      days_since_activity: Math.floor((Date.now() - new Date(d.Last_Activity_Time).getTime()) / 86400000),
    });
  }

  return {
    ok: true,
    total: deals.length,
    days_uteis_threshold: daysUteis,
    limit_iso: limitIso,
    by_owner: byOwner,
    owners_count: Object.keys(byOwner).length,
  };
}

async function redistributeDeal(pool, zohoLib, { dealId, newOwnerUsername, reason, actor }) {
  if (!dealId || !newOwnerUsername) return { ok: false, error: 'dealId e newOwnerUsername obrigatórios' };

  const USERS = validator.getUsersTable();
  const newUser = USERS[newOwnerUsername];
  if (!newUser) return { ok: false, error: `username "${newOwnerUsername}" não encontrado em USERS` };

  // Busca deal pra extrair produto
  const deal = await zohoLib.getDeal(dealId, 'Deal_Name,Owner,Categoria_do_Produto,Produto_Vendido,Tipo_de_Agua,Cidade');
  if (!deal) return { ok: false, error: 'deal não encontrado no Zoho' };

  const engine = require('./engine');
  const ctx = engine.buildCtxFromDeal(deal);

  // Valida permissão do novo owner
  const validation = validator.validateOwnerForProduct({
    owner_zoho_name: newUser.crmOwner || newUser.name,
    product_type: ctx.product_type,
  });
  if (!validation.ok) {
    return { ok: false, error: `${newUser.name} não pode receber ${ctx.product_type}: ${validation.reason}` };
  }

  // Audit
  await db.insertAudit(pool, {
    actor: actor || 'system',
    target_type: 'redistribution',
    target_id: dealId,
    target_label: `${deal.Deal_Name} (${ctx.product_type})`,
    field_changed: 'owner_meta',
    old_value: deal.Owner?.name || null,
    new_value: newUser.crmOwner || newUser.name,
    reason: reason || 'redistribute parado via UI',
    metadata: { product: ctx.product_type, new_username: newOwnerUsername },
  });

  return {
    ok: true, deal_id: dealId,
    new_owner: { username: newOwnerUsername, name: newUser.name, team: newUser.team },
    product: ctx.product_type,
    previous_owner: deal.Owner?.name || null,
  };
}

module.exports = { detectStuck, redistributeDeal, STAGES_ATIVOS };
