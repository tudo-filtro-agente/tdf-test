// lib/bi-zapi-aprovacao.js — Aprovação de pagamentos via WhatsApp (Z-API)
//
// Reusa zapiSend() do server.js (passada como dependency injection no init).
// Parse de respostas com regex robusto:
//   APROVAR <token>                          → aprovação simples (sem banco escolhido — pede em seguida)
//   APROVAR <token> <bancoIdOuApelido>        → aprovação com banco direto
//   REPROVAR <token> [motivo livre]
//   AJUSTE <token> [observação livre]
//
// Token = string única gerada quando pagamento é submetido (em bi-pagamentos.submeter).
//
// Fluxo de aprovação 2-step (quando aprovação não inclui banco):
//   1. user envia APROVAR ABCDEFGH
//   2. bot responde com lista de bancos disponíveis
//   3. user envia o nome/apelido (ex: "Itaú Mococa") ou "1", "2"
//   4. estado pendente é mantido em data/bi-zapi-pending.json (curto, expira)

const fs = require('fs');
const path = require('path');
const aprovadores = require('./bi-aprovadores');
const pagamentos = require('./bi-pagamentos');
const bancos = require('./bi-bancos');
const zapiConfig = require('./bi-zapi-config');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PENDING  = path.join(DATA_DIR, 'bi-zapi-pending.json'); // estado conversacional curto

function _ensure() {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(_){}
  if (!fs.existsSync(PENDING)) fs.writeFileSync(PENDING, '{}');
}
function _loadPending()  { _ensure(); try { return JSON.parse(fs.readFileSync(PENDING,'utf8')||'{}'); } catch(_) { return {}; } }
function _savePending(o) { _ensure(); try { fs.writeFileSync(PENDING, JSON.stringify(o,null,2)); } catch(_){}}

const PENDING_TTL_MS = 30 * 60 * 1000; // 30 min pra escolher banco
function _setPending(phone, state) {
  const all = _loadPending();
  all[phone] = { ...state, expiresAt: Date.now() + PENDING_TTL_MS };
  _savePending(all);
}
function _getPending(phone) {
  const all = _loadPending();
  const s = all[phone];
  if (!s) return null;
  if (s.expiresAt && Date.now() > s.expiresAt) {
    delete all[phone]; _savePending(all); return null;
  }
  return s;
}
function _clearPending(phone) {
  const all = _loadPending();
  delete all[phone]; _savePending(all);
}

// Injeta dependência do sender (vem do server.js).
// _zapiSendByInstance(cfg, phone, msg) — usa cfg = { instance, token, clientToken } pra mandar.
// _zapiSendDefault(phone, msg) — fallback (usado se config não resolver, ex: na resposta a número não-aprovador).
let _zapiSendByInstance = null;
let _zapiSendDefault    = null;
let _portalUrl = '';
function init({ zapiSendByInstance, zapiSendDefault, portalUrl }) {
  _zapiSendByInstance = zapiSendByInstance;
  _zapiSendDefault    = zapiSendDefault;
  _portalUrl = portalUrl || '';
}

// Resolve qual instância usar pra falar com o aprovador, dado um pagamento.
// 1) tenta config dedicada da empresa do pagamento
// 2) fallback pra config global
function _resolveCfgPraPagamento(pgto) {
  if (!pgto) return null;
  return zapiConfig.resolve(pgto.empresaBI);
}

// Wrapper pra enviar com cfg resolvida (ou default fallback)
async function _send(cfg, phone, msg) {
  if (cfg && _zapiSendByInstance) return _zapiSendByInstance(cfg, phone, msg);
  if (_zapiSendDefault) return _zapiSendDefault(phone, msg);
  return { ok:false, error:'Z-API não configurada' };
}

const fmtBRL = (v) => 'R$ ' + Number(v||0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function _formatVencimento(d) {
  if (!d) return '—';
  try { const dd = new Date(d); return dd.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }); } catch(_) { return d; }
}

// Monta a mensagem de pedido de aprovação
function buildMensagemAprovacao(pgto, contaSugerida, empresaNome) {
  const link = (_portalUrl || 'https://tdf-portal-production.up.railway.app') + '/bi-financeiro?aprovar=' + pgto.id;
  return [
    '🔔 *Conta aguardando aprovação*',
    '',
    `*Empresa:* ${empresaNome || '—'}`,
    `*Fornecedor:* ${pgto.fornecedor || '—'}`,
    `*Descrição:* ${pgto.descricao || '—'}`,
    `*Categoria:* ${pgto.categoria || '—'}`,
    `*Valor:* ${fmtBRL(pgto.valor)}`,
    `*Vencimento:* ${_formatVencimento(pgto.vencimento)}`,
    pgto.formaPagamento ? `*Forma:* ${pgto.formaPagamento}` : null,
    contaSugerida ? `*Conta sugerida:* ${contaSugerida.apelido || contaSugerida.banco} (saldo ${fmtBRL(contaSugerida.saldoAtual)})` : null,
    '',
    'Responda nesta conversa:',
    `• *APROVAR ${pgto.tokenAprovacao}*`,
    `• *REPROVAR ${pgto.tokenAprovacao} motivo*`,
    `• *AJUSTE ${pgto.tokenAprovacao} observação*`,
    '',
    `🔗 Detalhes/anexos: ${link}`,
  ].filter(Boolean).join('\n');
}

// Notifica todos os aprovadores autorizados
async function notificarAprovadores(pgtoId, opts = {}) {
  const pgto = pagamentos.get(pgtoId);
  if (!pgto) return { ok:false, error:'pagamento não existe' };
  const cfgGlobal = pagamentos.loadConfig();
  const elegiveis = aprovadores.listParaNotificar(pgto.valor, pgto.empresaBI, cfgGlobal.limitePadrao);
  if (elegiveis.length === 0) return { ok:false, error:'nenhum aprovador elegível' };

  // Sugestão de banco (passa pra mensagem)
  const contaSugerida = pgto.contaBancariaSugerida
    ? bancos.get(pgto.contaBancariaSugerida)
    : bancos.sugerirConta(pgto.empresaBI, pgto.valor);

  const empresaNome = opts.empresaNome || ''; // server passa (ele tem state das empresas)
  const msg = buildMensagemAprovacao(pgto, contaSugerida, empresaNome);

  // Resolve instância Z-API da empresa do pagamento (pra usar a Z-API certa por empresa)
  const cfgZapi = _resolveCfgPraPagamento(pgto);
  if (!cfgZapi) {
    pagamentos.audit({ tipo:'whatsapp-falhou', pagamentoId: pgtoId, motivo:'sem Z-API configurada pra empresa', empresaBI: pgto.empresaBI });
    return { ok:false, error:'sem Z-API configurada pra empresa '+pgto.empresaBI };
  }

  const results = [];
  for (const ap of elegiveis) {
    if (!ap.whatsapp) { results.push({ aprovador: ap.nome, skipped:true, reason:'sem whatsapp' }); continue; }
    try {
      const r = await _send(cfgZapi, ap.whatsapp, msg);
      results.push({ aprovador: ap.nome, whatsapp: ap.whatsapp, ok: !!r.ok, error: r.error, instancia: cfgZapi.apelido || cfgZapi.source });
    } catch(e) {
      results.push({ aprovador: ap.nome, ok:false, error: e.message });
    }
  }
  // Marca timestamp
  const map = pagamentos.loadAll();
  if (map[pgtoId]) {
    map[pgtoId].notifWhatsappEnviadoEm = new Date().toISOString();
    pagamentos.saveAll(map);
  }
  pagamentos.audit({ tipo:'whatsapp-notificado', pagamentoId: pgtoId, destinatarios: results });
  return { ok:true, notificados: results, contaSugerida };
}

// Notifica financeiro (quem submeteu) sobre desfecho
async function notificarFinanceiroDecisao(pgtoId, decisao) {
  const pgto = pagamentos.get(pgtoId);
  if (!pgto) return;
  // Avisa whatsappFinanceiro (configurável em data/bi-config.json) sobre o desfecho.
  const cfgGlobal = pagamentos.loadConfig();
  const dest = cfgGlobal.whatsappFinanceiro || '';
  if (!dest) return;
  const msg = [
    decisao === 'aprovado' ? '✅' : decisao === 'reprovado' ? '❌' : '⚠️',
    `Pagamento "${pgto.fornecedor}" — ${fmtBRL(pgto.valor)}`,
    `Status: ${pgto.status.toUpperCase()}`,
    pgto.aprovadoPor ? `Por: ${pgto.aprovadoPor}` : '',
    pgto.motivo ? `Motivo: ${pgto.motivo}` : '',
  ].filter(Boolean).join('\n');
  // Usa instância Z-API da empresa do pagamento (consistência: mesma origem)
  const cfgZapi = _resolveCfgPraPagamento(pgto);
  try { await _send(cfgZapi, dest, msg); } catch(_){}
}

// Match de banco por nome/apelido digitado pelo aprovador
function _resolveBancoByName(empresaBI, str) {
  const norm = (s) => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'');
  const t = norm(str);
  if (!t) return null;
  const opts = bancos.listAll().filter(b => b.ativo && (!empresaBI || b.empresaBI === empresaBI));
  // Ordinal "1" "2" - se o aprovador tinha visto a lista
  if (/^\d+$/.test(str.trim())) {
    const idx = parseInt(str.trim(), 10) - 1;
    return opts[idx] || null;
  }
  return opts.find(b => norm(b.apelido) === t || norm(b.banco) === t)
      || opts.find(b => norm(b.apelido).includes(t) || norm(b.banco).includes(t)) || null;
}

function _listarBancosTexto(empresaBI) {
  const opts = bancos.listAll().filter(b => b.ativo && (!empresaBI || b.empresaBI === empresaBI));
  if (opts.length === 0) return null;
  return opts.map((b,i) => `${i+1}. ${b.apelido || b.banco} — saldo ${fmtBRL(b.saldoAtual)}`).join('\n');
}

// Parser principal — chamado pelo webhook /webhooks/zapi-aprovacao.
// O webhook responde com a MESMA instância Z-API que recebeu a mensagem
// (via instanceId no payload), garantindo consistência de conversa.
// Esta função só processa o texto; a resposta volta como `reply` e o webhook
// decide a instância de envio.
async function processarMensagem({ phone, text }) {
  const fromPhone = aprovadores.normalizePhone(phone);
  const ap = aprovadores.findByPhone(fromPhone);
  const raw = String(text || '').trim();

  // Estado pendente: aprovador anteriormente disse APROVAR sem banco e agora envia o banco
  const pending = _getPending(fromPhone);
  if (pending && pending.kind === 'aguarda-banco') {
    if (!ap) { _clearPending(fromPhone); return { matched:true, reply:'❌ Número não está autorizado.' }; }
    const pgto = pagamentos.get(pending.pagamentoId);
    if (!pgto || pgto.status !== pagamentos.STATUS.AGUARDANDO) {
      _clearPending(fromPhone);
      return { matched:true, reply:`❌ Solicitação ${pending.pagamentoId} não está mais aguardando.` };
    }
    const banco = _resolveBancoByName(pgto.empresaBI, raw);
    if (!banco) {
      const lista = _listarBancosTexto(pgto.empresaBI) || 'Nenhuma conta bancária ativa cadastrada.';
      return { matched:true, reply:`❓ Não identifiquei a conta. Responda com nome ou número:\n\n${lista}` };
    }
    const r = pagamentos.aprovar(pending.pagamentoId, { aprovador: ap, nome: ap.nome, username: ap.userLogin, viaWhatsapp:true }, banco.id, 'aprovado via WhatsApp');
    _clearPending(fromPhone);
    if (!r.ok) return { matched:true, reply:`❌ ${r.error}` };
    notificarFinanceiroDecisao(pending.pagamentoId, 'aprovado').catch(()=>{});
    return { matched:true, reply: `✅ Pagamento *${pgto.fornecedor}* (${fmtBRL(pgto.valor)}) aprovado.\nConta: ${banco.apelido || banco.banco}.\n${r.saldoSuficiente ? '' : '⚠️ Saldo insuficiente — verifique antes de marcar como pago.'}\n\nMarque como *PAGO* no portal pra debitar o saldo.` };
  }

  // Sem token → não é uma mensagem de aprovação
  // Patterns:
  const mAprovar  = raw.match(/^APROVAR\s+([A-Z0-9]{4,12})(?:\s+(.+))?$/i);
  const mReprovar = raw.match(/^REPROVAR\s+([A-Z0-9]{4,12})(?:\s+(.+))?$/i);
  const mAjuste   = raw.match(/^AJUSTE\s+([A-Z0-9]{4,12})(?:\s+(.+))?$/i);
  if (!mAprovar && !mReprovar && !mAjuste) return { matched:false };

  // Aqui sabemos que é tentativa de aprovação. Validar aprovador.
  if (!ap)        return { matched:true, reply:'❌ Seu número não está cadastrado como aprovador autorizado.' };
  if (!ap.ativo)  return { matched:true, reply:'❌ Aprovador inativo.' };

  const token = (mAprovar?.[1] || mReprovar?.[1] || mAjuste?.[1] || '').toUpperCase();
  const pgto = pagamentos.findByToken(token);
  if (!pgto) return { matched:true, reply:`❌ Token *${token}* inválido ou expirado.` };
  if (pgto.tokenExpiraEm && new Date(pgto.tokenExpiraEm) < new Date()) {
    return { matched:true, reply:`⏰ Solicitação *${token}* expirou. Reenvie a aprovação pelo portal.` };
  }
  if (pgto.status !== pagamentos.STATUS.AGUARDANDO) {
    return { matched:true, reply:`❌ Pagamento já está com status *${pgto.status}*. Não pode mais ser respondido.` };
  }

  // Validação alçada / empresa autorizada
  const cfg = pagamentos.loadConfig();
  const judge = aprovadores.podeAprovar(ap, pgto.valor, pgto.empresaBI, cfg.limitePadrao);

  if (mReprovar) {
    if (!judge.ok && !judge.alcadaExcedida) return { matched:true, reply:`❌ ${judge.motivo}` };
    // reprovar não exige alçada (qualquer aprovador autorizado pode dizer "não")
    const motivo = (mReprovar[2] || '').trim() || 'sem motivo';
    const r = pagamentos.reprovar(pgto.id, { aprovador: ap, nome: ap.nome, username: ap.userLogin, viaWhatsapp:true }, motivo);
    if (!r.ok) return { matched:true, reply:`❌ ${r.error}` };
    notificarFinanceiroDecisao(pgto.id, 'reprovado').catch(()=>{});
    return { matched:true, reply:`❌ Pagamento *${pgto.fornecedor}* (${fmtBRL(pgto.valor)}) REPROVADO.\nMotivo: ${motivo}` };
  }

  if (mAjuste) {
    if (!judge.ok && !judge.alcadaExcedida) return { matched:true, reply:`❌ ${judge.motivo}` };
    const obs = (mAjuste[2] || '').trim() || 'ajuste solicitado';
    const r = pagamentos.solicitarAjuste(pgto.id, { aprovador: ap, nome: ap.nome, username: ap.userLogin, viaWhatsapp:true }, obs);
    if (!r.ok) return { matched:true, reply:`❌ ${r.error}` };
    notificarFinanceiroDecisao(pgto.id, 'ajuste').catch(()=>{});
    return { matched:true, reply:`⚠️ Ajuste solicitado em *${pgto.fornecedor}*.\nObs: ${obs}\nO financeiro vai revisar e reenviar pra aprovação.` };
  }

  // mAprovar
  if (!judge.ok) {
    if (judge.alcadaExcedida) {
      return { matched:true, reply:`🚫 ${judge.motivo}\n\nPasse pra um titular (Paulo ou pai) aprovar.` };
    }
    return { matched:true, reply:`❌ ${judge.motivo}` };
  }
  const bancoNome = (mAprovar[2] || '').trim();
  if (bancoNome) {
    // Aprovação com banco direto
    const banco = _resolveBancoByName(pgto.empresaBI, bancoNome);
    if (!banco) {
      const lista = _listarBancosTexto(pgto.empresaBI) || 'Nenhuma conta bancária ativa.';
      _setPending(fromPhone, { kind:'aguarda-banco', pagamentoId: pgto.id });
      return { matched:true, reply:`❓ Conta "*${bancoNome}*" não identificada. Escolha respondendo o número ou nome:\n\n${lista}` };
    }
    const r = pagamentos.aprovar(pgto.id, { aprovador: ap, nome: ap.nome, username: ap.userLogin, viaWhatsapp:true }, banco.id, 'aprovado via WhatsApp');
    if (!r.ok) return { matched:true, reply:`❌ ${r.error}` };
    notificarFinanceiroDecisao(pgto.id, 'aprovado').catch(()=>{});
    return { matched:true, reply:`✅ Pagamento *${pgto.fornecedor}* (${fmtBRL(pgto.valor)}) aprovado.\nConta: ${banco.apelido || banco.banco}.\n${r.saldoSuficiente ? '' : '⚠️ Saldo insuficiente!'}\n\nMarque como *PAGO* no portal pra debitar.` };
  }

  // Aprovação sem banco — pergunta qual conta
  const lista = _listarBancosTexto(pgto.empresaBI) || 'Nenhuma conta bancária ativa cadastrada — cadastre antes de aprovar.';
  _setPending(fromPhone, { kind:'aguarda-banco', pagamentoId: pgto.id });
  return { matched:true, reply:`✅ Aprovação preliminar registrada.\n\nDe *qual conta bancária* deseja pagar?\n\n${lista}\n\nResponda com o nome ou número.` };
}

module.exports = { init, notificarAprovadores, notificarFinanceiroDecisao, processarMensagem, buildMensagemAprovacao };
