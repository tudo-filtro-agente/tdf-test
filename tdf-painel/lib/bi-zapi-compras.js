// lib/bi-zapi-compras.js — Notificação Z-API + parser de resposta pra compras (F2)
//
// Espelha bi-zapi-aprovacao mas pra solicitações de compra. Token formato COMP-XXXXX.
// Não pede banco (compra vira pagamento depois quando NF é vinculada).
//
// Webhook fluxo: bi-zapi-aprovacao roda primeiro (matched=false retorna sem ação)
// → server tenta este parser como fallback.

const compras = require('./bi-compras');
const aprovadores = require('./bi-aprovadores');
const zapiConfig = require('./bi-zapi-config');

let _zapiSendByInstance = null;
let _zapiSendDefault = null;
let _portalUrl = '';

function init({ zapiSendByInstance, zapiSendDefault, portalUrl }) {
  _zapiSendByInstance = zapiSendByInstance;
  _zapiSendDefault = zapiSendDefault;
  _portalUrl = portalUrl || '';
}

const fmtBRL = (v) => 'R$ ' + Number(v||0).toLocaleString('pt-BR', { minimumFractionDigits:2 });

async function _send(cfg, phone, msg) {
  if (cfg && _zapiSendByInstance) return _zapiSendByInstance(cfg, phone, msg);
  if (_zapiSendDefault) return _zapiSendDefault(phone, msg);
  return { ok:false, error:'Z-API não configurada' };
}

function buildMensagem(comp) {
  const link = (_portalUrl || 'https://tdf-portal-production.up.railway.app') + '/bi-financeiro?compra=' + comp.id;
  const itensTxt = (comp.itens||[]).slice(0,5).map(i => `• ${i.produto_nome || i.sku} — ${Number(i.qtd)} × ${fmtBRL(i.custo_unit_estimado)}`).join('\n');
  const maisItens = comp.itens && comp.itens.length > 5 ? `\n_(+${comp.itens.length - 5} item(ns))_` : '';
  const urgencia = comp.urgencia === 'urgente' ? '🚨 URGENTE' : comp.urgencia === 'alta' ? '⚡ Alta' : comp.urgencia === 'baixa' ? '🐢 Baixa' : '⚪ Normal';
  return [
    `🛒 *Solicitação de compra #${comp.numero_seq}*`,
    '',
    `*Solicitante:* ${comp.solicitante_username || '—'}`,
    `*Empresa:* ${comp.empresa_nome || '—'}`,
    `*Fornecedor sugerido:* ${comp.fornecedor_nome || comp.fornecedor_nome_db || '—'}`,
    `*Urgência:* ${urgencia}`,
    `*Valor estimado:* ${fmtBRL(comp.valor_estimado_total)}`,
    '',
    `*Itens:*\n${itensTxt}${maisItens}`,
    '',
    comp.justificativa ? `*Justificativa:* ${comp.justificativa}` : null,
    '',
    'Responda nesta conversa:',
    `• *APROVAR ${comp.token_aprovacao}*`,
    `• *REPROVAR ${comp.token_aprovacao} motivo*`,
    `• *AJUSTE ${comp.token_aprovacao} observação*`,
    '',
    `🔗 Detalhes: ${link}`,
  ].filter(Boolean).join('\n');
}

async function notificarAprovadores(compId) {
  const comp = await compras.get(compId);
  if (!comp) return { ok:false, error:'compra não existe' };
  if (!comp.token_aprovacao) return { ok:false, error:'sem token (submeta antes)' };

  // Aprovadores autorizados (qualquer um ativo recebe — alçada vai checar na resposta)
  const todos = aprovadores.listAll().filter(a => a.ativo);
  if (todos.length === 0) return { ok:false, error:'nenhum aprovador cadastrado' };

  // Resolve instância pela empresa BI (mesmo padrão do bi-zapi-aprovacao)
  const cfgZapi = zapiConfig.resolve(comp.empresa_bi || null);
  if (!cfgZapi) return { ok:false, error:'sem Z-API configurada' };

  const msg = buildMensagem(comp);
  const results = [];
  for (const ap of todos) {
    if (!ap.whatsapp) { results.push({ aprovador: ap.nome, skipped:true, reason:'sem whatsapp' }); continue; }
    try {
      const r = await _send(cfgZapi, ap.whatsapp, msg);
      results.push({ aprovador: ap.nome, whatsapp: ap.whatsapp, ok: !!r.ok, error: r.error, instancia: cfgZapi.apelido || cfgZapi.source });
    } catch(e) { results.push({ aprovador: ap.nome, ok:false, error: e.message }); }
  }
  return { ok:true, notificados: results };
}

// Parser de mensagens inbound — chamado pelo webhook quando bi-zapi-aprovacao retorna matched:false
async function processarMensagem({ phone, text }) {
  const raw = String(text || '').trim();
  const m = raw.match(/^(APROVAR|REPROVAR|AJUSTE)\s+(COMP-[A-Z0-9]+)(?:\s+(.+))?$/i);
  if (!m) return { matched:false };
  const tipo = m[1].toUpperCase();
  const token = m[2].toUpperCase();
  const obs = (m[3] || '').trim();

  const fromPhone = aprovadores.normalizePhone(phone);
  const ap = aprovadores.findByPhone(fromPhone);
  if (!ap) return { matched:true, reply:'❌ Seu número não está autorizado a aprovar compras.' };
  if (!ap.ativo) return { matched:true, reply:'❌ Aprovador inativo.' };

  const comp = await compras.getByToken(token);
  if (!comp) return { matched:true, reply:`❌ Token *${token}* inválido ou expirado.` };
  if (comp.token_expira_em && new Date(comp.token_expira_em) < new Date()) {
    return { matched:true, reply:`⏰ Solicitação *${token}* expirou.` };
  }
  if (comp.status !== compras.STATUS.AGUARDANDO) {
    return { matched:true, reply:`❌ Compra já está com status *${comp.status}*. Não pode mais ser respondida.` };
  }

  try {
    if (tipo === 'APROVAR') {
      await compras.aprovar(comp.id, ap.userLogin || ap.nome, fromPhone);
      return { matched:true, reply:`✅ Compra #${comp.numero_seq} (${fmtBRL(comp.valor_estimado_total)}) APROVADA.\nFornecedor: ${comp.fornecedor_nome||'—'}\n\nO portal vai gerar o PDF do pedido pra envio ao fornecedor.` };
    }
    if (tipo === 'REPROVAR') {
      const motivo = obs || 'sem motivo informado';
      await compras.reprovar(comp.id, ap.userLogin || ap.nome, motivo, fromPhone);
      return { matched:true, reply:`❌ Compra #${comp.numero_seq} REPROVADA.\nMotivo: ${motivo}` };
    }
    if (tipo === 'AJUSTE') {
      const observacao = obs || 'ajuste solicitado';
      await compras.pedirAjuste(comp.id, ap.userLogin || ap.nome, observacao, fromPhone);
      return { matched:true, reply:`⚠️ Ajuste solicitado em #${comp.numero_seq}.\nObs: ${observacao}\nO solicitante vai revisar e reenviar.` };
    }
  } catch(e) {
    return { matched:true, reply:`❌ ${e.message}` };
  }
  return { matched:false };
}

module.exports = { init, notificarAprovadores, processarMensagem, buildMensagem };
