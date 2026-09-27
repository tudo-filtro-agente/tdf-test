// lib/bi-pagamentos.js — Workflow contas a pagar
//
// State machine:
//   rascunho → aguardando-aprovacao → {aprovado, reprovado, ajuste-solicitado}
//   aprovado → pago
//   ajuste-solicitado → aguardando-aprovacao (após edição)
//   pago é estado terminal.
//
// Cada transição grava entry em data/bi-auditoria.json (append-only).
// Quando vira "pago", debita a conta bancária + cria entry no extrato.
//
// Persistência:
//   data/bi-pagamentos.json   — { id: { ...pagamento } }
//   data/bi-auditoria.json    — array append-only de events
//   data/bi-config.json       — alçadas + settings

const fs = require('fs');
const path = require('path');
const bancos = require('./bi-bancos');
const aprovadores = require('./bi-aprovadores');

const DATA_DIR  = path.join(__dirname, '..', 'data');
const FILE      = path.join(DATA_DIR, 'bi-pagamentos.json');
const AUDIT     = path.join(DATA_DIR, 'bi-auditoria.json');
const CONFIG    = path.join(DATA_DIR, 'bi-config.json');

const STATUS = {
  RASCUNHO: 'rascunho',
  AGUARDANDO: 'aguardando-aprovacao',
  APROVADO: 'aprovado',
  REPROVADO: 'reprovado',
  AJUSTE: 'ajuste-solicitado',
  PAGO: 'pago',
  CANCELADO: 'cancelado',
};

const TERMINAL = new Set([STATUS.PAGO, STATUS.REPROVADO, STATUS.CANCELADO]);

function _ensure() {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(_){}
  if (!fs.existsSync(FILE))   fs.writeFileSync(FILE, '{}');
  if (!fs.existsSync(AUDIT))  fs.writeFileSync(AUDIT, '[]');
  if (!fs.existsSync(CONFIG)) fs.writeFileSync(CONFIG, JSON.stringify({
    limitePadrao: 5000,           // valor até que aprovador 'padrao' aprova
    expiracaoSolicitacaoHoras: 72, // token Z-API expira após 72h
    notificarFinanceiro: true,
    pagamentoDiretoAdminExigeJustificativa: true,
  }, null, 2));
}
function _load(file)   { _ensure(); try { return JSON.parse(fs.readFileSync(file, 'utf8') || (file===AUDIT?'[]':'{}')); } catch(e) { return file===AUDIT?[]:{}; } }
function _save(file,o) { _ensure(); try { fs.writeFileSync(file, JSON.stringify(o, null, 2)); return true; } catch(e) { return false; } }

const uid = () => 'pg_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);
const tokenUid = () => Math.random().toString(36).slice(2,10).toUpperCase();

function loadAll()  { return _load(FILE); }
function saveAll(o) { return _save(FILE, o); }
function loadConfig() { return _load(CONFIG); }
function saveConfig(o) {
  const cur = _load(CONFIG);
  const next = { ...cur, ...o };
  _save(CONFIG, next);
  return next;
}

// === Auditoria (append-only) ===
function audit(event) {
  const arr = _load(AUDIT);
  arr.push({
    id: 'au_' + Math.random().toString(36).slice(2,8) + Date.now().toString(36).slice(-3),
    timestamp: new Date().toISOString(),
    ...event,
  });
  _save(AUDIT, arr);
}
function listAudit(filtro = {}) {
  let arr = _load(AUDIT);
  if (filtro.pagamentoId) arr = arr.filter(e => e.pagamentoId === filtro.pagamentoId);
  if (filtro.usuario)     arr = arr.filter(e => e.usuario === filtro.usuario);
  if (filtro.tipo)        arr = arr.filter(e => e.tipo === filtro.tipo);
  return arr.sort((a,b) => (b.timestamp||'').localeCompare(a.timestamp||''));
}

// === Default ===
function defaultPagamento() {
  return {
    id: '',
    empresaBI: '',
    fornecedor: '',
    fornecedorId: '',  // ref pra bi_fornecedores.id (autocomplete)
    categoria: '',
    descricao: '',
    valor: 0,
    vencimento: '',
    formaPagamento: '',         // PIX, Boleto, TED, Cartão...
    chavePix: '',
    codigoBarras: '',
    dadosBancarios: '',         // texto livre quando não for boleto/pix
    anexoUrl: '',               // URL externa do boleto/NF
    centroCusto: '',
    recorrente: false,
    contaBancariaSugerida: '',
    contaBancariaAprovada: '',
    // === Recorrência ===
    // Se `recorrente=true && !geradoDeRecorrencia` → este é um MODELO; o cron diário
    // gera cópias mensais a partir dele. As cópias têm geradoDeRecorrencia preenchido
    // e competenciaMes = 'YYYY-MM' (mês a que se refere). Anti-dup: par (modeloId, mes) único.
    geradoDeRecorrencia: '',
    competenciaMes: '',
    status: STATUS.RASCUNHO,
    solicitadoPor: '',
    aprovadoPor: '',
    reprovadoPor: '',
    motivo: '',                 // motivo reprovação OU obs ajuste
    dataAprovacao: null,
    dataPagamento: null,
    dataSubmissao: null,
    obs: '',
    historico: [],              // [{tipo, ts, usuario, payload}]
    tokenAprovacao: '',         // único por solicitação WhatsApp
    tokenExpiraEm: null,
    notifWhatsappEnviadoEm: null,
    extratoEntryId: '',         // referência do movimento bancário gerado quando pago
    createdAt: new Date().toISOString(),
    updatedAt: null,
    createdBy: '',
  };
}

// === CRUD básico ===
function get(id) { return loadAll()[id] || null; }
function listAll2() { return Object.values(loadAll()); }
function listFiltered(filtro = {}) {
  let arr = listAll2();
  if (filtro.status)    arr = arr.filter(p => p.status === filtro.status);
  if (filtro.empresaBI) arr = arr.filter(p => p.empresaBI === filtro.empresaBI);
  if (filtro.statusIn)  arr = arr.filter(p => filtro.statusIn.includes(p.status));
  arr.sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||''));
  return arr;
}

function _addHistorico(p, tipo, usuario, payload) {
  if (!p.historico) p.historico = [];
  p.historico.push({ tipo, ts: new Date().toISOString(), usuario, payload: payload || null });
}

function criar(patch, who) {
  const map = loadAll();
  const cur = defaultPagamento();
  cur.id = uid();
  cur.createdBy = who || '';
  cur.solicitadoPor = who || '';
  _applyEditableFields(cur, patch);
  cur.status = STATUS.RASCUNHO;
  _addHistorico(cur, 'criado', who, { from: 'novo' });
  map[cur.id] = cur;
  saveAll(map);
  audit({ tipo:'criar', pagamentoId: cur.id, usuario: who, valor: cur.valor, empresaBI: cur.empresaBI });
  return cur;
}

// Campos que podem ser editados em rascunho/ajuste
const EDITAVEIS = ['empresaBI','fornecedor','fornecedorId','categoria','descricao','valor','vencimento','formaPagamento','chavePix','codigoBarras','dadosBancarios','anexoUrl','centroCusto','recorrente','contaBancariaSugerida','obs'];
function _applyEditableFields(p, patch) {
  EDITAVEIS.forEach(k => {
    if (patch[k] === undefined) return;
    if (k === 'valor')        p[k] = Number(patch[k]) || 0;
    else if (k === 'recorrente') p[k] = !!patch[k];
    else                      p[k] = String(patch[k] || '').trim();
  });
}

function editar(id, patch, who) {
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'pagamento não existe' };
  if (![STATUS.RASCUNHO, STATUS.AJUSTE, STATUS.AGUARDANDO].includes(cur.status)) {
    // Apenas admin pode editar quando aprovado/pago, mas aí é via outra rota
    return { ok:false, error:`não é possível editar pagamento com status "${cur.status}"` };
  }
  _applyEditableFields(cur, patch);
  cur.updatedAt = new Date().toISOString();
  _addHistorico(cur, 'editado', who, patch);
  // Se estava em ajuste e foi editado, volta pra aguardando
  if (cur.status === STATUS.AJUSTE) {
    cur.status = STATUS.AGUARDANDO;
    cur.tokenAprovacao = tokenUid();
    cur.tokenExpiraEm  = _expiraEm();
    _addHistorico(cur, 'reenviado-aprovacao', who, null);
  }
  map[id] = cur;
  saveAll(map);
  audit({ tipo:'editar', pagamentoId: id, usuario: who, patch });
  return { ok:true, pagamento: cur };
}

function remover(id, who) {
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status === STATUS.PAGO) return { ok:false, error:'pagamento já efetivado, use cancelar' };
  delete map[id];
  saveAll(map);
  audit({ tipo:'remover', pagamentoId: id, usuario: who });
  return { ok:true };
}

// === State machine ===

function _expiraEm() {
  const cfg = loadConfig();
  const horas = Number(cfg.expiracaoSolicitacaoHoras) || 72;
  return new Date(Date.now() + horas*3600*1000).toISOString();
}

// rascunho → aguardando-aprovacao
function submeter(id, who) {
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (![STATUS.RASCUNHO, STATUS.AJUSTE].includes(cur.status))
    return { ok:false, error:`não é possível submeter status "${cur.status}"` };
  if (!cur.empresaBI || !cur.fornecedor || !cur.valor || cur.valor <= 0)
    return { ok:false, error:'preencha empresa, fornecedor e valor antes de submeter' };
  cur.status = STATUS.AGUARDANDO;
  cur.dataSubmissao = new Date().toISOString();
  cur.tokenAprovacao = tokenUid();
  cur.tokenExpiraEm  = _expiraEm();
  _addHistorico(cur, 'submetido', who, null);
  saveAll(map);
  audit({ tipo:'submeter', pagamentoId: id, usuario: who, valor: cur.valor, empresaBI: cur.empresaBI });
  return { ok:true, pagamento: cur };
}

// aguardando → aprovado (com banco escolhido)
function aprovar(id, aprovadorInfo, contaBancariaId, observacao) {
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status !== STATUS.AGUARDANDO)
    return { ok:false, error:`não é possível aprovar status "${cur.status}"` };
  // Validação alçada
  const cfg = loadConfig();
  const aprovador = aprovadorInfo.aprovador;
  const judge = aprovadores.podeAprovar(aprovador, cur.valor, cur.empresaBI, cfg.limitePadrao);
  if (!judge.ok) return { ok:false, error: judge.motivo, alcadaExcedida: judge.alcadaExcedida };
  // Validação banco
  if (!contaBancariaId) return { ok:false, error:'selecione a conta bancária de saída' };
  const conta = bancos.get(contaBancariaId);
  if (!conta) return { ok:false, error:'conta bancária não encontrada' };
  if (!conta.ativo) return { ok:false, error:'conta bancária inativa' };
  if (conta.empresaBI && cur.empresaBI && conta.empresaBI !== cur.empresaBI) {
    return { ok:false, error:'conta bancária é de outra empresa', avisoEmpresa:true };
  }
  // Aviso de saldo (não bloqueia, só sinaliza — vai bloquear de fato no marcarPago)
  const saldoSuf = (Number(conta.saldoAtual||0) + Number(conta.limite||0)) >= Number(cur.valor||0);
  cur.status = STATUS.APROVADO;
  cur.aprovadoPor = aprovadorInfo.nome || aprovadorInfo.username || '';
  cur.dataAprovacao = new Date().toISOString();
  cur.contaBancariaAprovada = contaBancariaId;
  if (observacao) cur.obs = (cur.obs ? cur.obs+'\n' : '') + '[aprovação] ' + observacao;
  _addHistorico(cur, 'aprovado', aprovadorInfo.nome, { contaBancariaId, observacao });
  saveAll(map);
  audit({ tipo:'aprovar', pagamentoId: id, usuario: aprovadorInfo.username || aprovadorInfo.nome, contaBancariaId, valor: cur.valor, viaWhatsapp: !!aprovadorInfo.viaWhatsapp });
  return { ok:true, pagamento: cur, saldoSuficiente: saldoSuf, conta };
}

// aguardando → reprovado
function reprovar(id, aprovadorInfo, motivo) {
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status !== STATUS.AGUARDANDO)
    return { ok:false, error:`não é possível reprovar status "${cur.status}"` };
  cur.status = STATUS.REPROVADO;
  cur.reprovadoPor = aprovadorInfo.nome || aprovadorInfo.username || '';
  cur.motivo = String(motivo || '').trim() || 'sem motivo informado';
  _addHistorico(cur, 'reprovado', aprovadorInfo.nome, { motivo });
  saveAll(map);
  audit({ tipo:'reprovar', pagamentoId: id, usuario: aprovadorInfo.username || aprovadorInfo.nome, motivo, viaWhatsapp: !!aprovadorInfo.viaWhatsapp });
  return { ok:true, pagamento: cur };
}

// aguardando → ajuste-solicitado
function solicitarAjuste(id, aprovadorInfo, observacao) {
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status !== STATUS.AGUARDANDO)
    return { ok:false, error:`não é possível pedir ajuste em status "${cur.status}"` };
  cur.status = STATUS.AJUSTE;
  cur.motivo = String(observacao || '').trim() || 'ajuste solicitado';
  _addHistorico(cur, 'ajuste-solicitado', aprovadorInfo.nome, { observacao });
  saveAll(map);
  audit({ tipo:'ajuste', pagamentoId: id, usuario: aprovadorInfo.username || aprovadorInfo.nome, observacao, viaWhatsapp: !!aprovadorInfo.viaWhatsapp });
  return { ok:true, pagamento: cur };
}

// aprovado → pago (debita banco + cria extrato)
function marcarPago(id, who, opts = {}) {
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status !== STATUS.APROVADO)
    return { ok:false, error:`pagamento não está aprovado (status atual: ${cur.status})` };
  const contaId = opts.contaBancariaId || cur.contaBancariaAprovada;
  if (!contaId) return { ok:false, error:'sem conta bancária definida' };
  const debitInfo = {
    descricao: `Pagamento — ${cur.fornecedor} — ${cur.descricao || ''}`.slice(0, 200),
    refTipo: 'pagamento', refId: cur.id,
    obs: opts.obs || '',
  };
  const r = bancos.debitar(contaId, cur.valor, debitInfo, who);
  if (!r.ok) return r;
  cur.status = STATUS.PAGO;
  cur.dataPagamento = new Date().toISOString();
  cur.contaBancariaAprovada = contaId;
  cur.extratoEntryId = r.entry.id;
  _addHistorico(cur, 'pago', who, { contaId, novoSaldo: r.novoSaldo, extratoId: r.entry.id });
  saveAll(map);
  audit({ tipo:'pago', pagamentoId: id, usuario: who, contaBancariaId: contaId, valor: cur.valor, novoSaldo: r.novoSaldo });
  return { ok:true, pagamento: cur, novoSaldo: r.novoSaldo, extrato: r.entry };
}

// Pagamento direto (admin only) — pula workflow, exige justificativa
function pagamentoDireto(id, who, contaBancariaId, justificativa) {
  const cfg = loadConfig();
  if (cfg.pagamentoDiretoAdminExigeJustificativa) {
    if (!justificativa || String(justificativa).trim().length < 10) {
      return { ok:false, error:'justificativa obrigatória (mín 10 caracteres)' };
    }
  }
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (TERMINAL.has(cur.status)) return { ok:false, error:`status terminal: ${cur.status}` };
  // Força aprovação + pagamento
  cur.status = STATUS.APROVADO;
  cur.aprovadoPor = who + ' (PAGAMENTO DIRETO)';
  cur.dataAprovacao = new Date().toISOString();
  cur.contaBancariaAprovada = contaBancariaId;
  cur.obs = (cur.obs ? cur.obs+'\n' : '') + '[PAGTO DIRETO] ' + (justificativa || '');
  _addHistorico(cur, 'pagamento-direto', who, { justificativa });
  saveAll(map);
  audit({ tipo:'pagamento-direto', pagamentoId: id, usuario: who, contaBancariaId, valor: cur.valor, justificativa });
  return marcarPago(id, who, { contaBancariaId });
}

function cancelar(id, who, motivo) {
  const map = loadAll();
  const cur = map[id];
  if (!cur) return { ok:false, error:'não existe' };
  if (cur.status === STATUS.PAGO) return { ok:false, error:'já pago — use estorno' };
  cur.status = STATUS.CANCELADO;
  cur.motivo = String(motivo || '').trim() || 'cancelado';
  _addHistorico(cur, 'cancelado', who, { motivo });
  saveAll(map);
  audit({ tipo:'cancelar', pagamentoId: id, usuario: who, motivo });
  return { ok:true, pagamento: cur };
}

// Procura pagamento por token (usado no webhook Z-API)
function findByToken(token) {
  if (!token) return null;
  const map = loadAll();
  return Object.values(map).find(p => p.tokenAprovacao === String(token).trim()) || null;
}

// === KPIs / Dashboard ===
function dashboardSummary(empresaBI) {
  const all = listAll2().filter(p => !empresaBI || p.empresaBI === empresaBI);
  const today = new Date().toISOString().slice(0,10);
  const inWeek = (d) => {
    if (!d) return false;
    const dd = new Date(d);
    const now = new Date();
    const diffDays = (dd - now)/(1000*3600*24);
    return diffDays >= 0 && diffDays <= 7;
  };
  const inMonth = (d) => {
    if (!d) return false;
    return d.slice(0,7) === today.slice(0,7);
  };

  const aguardando = all.filter(p => p.status === STATUS.AGUARDANDO);
  const aprovado = all.filter(p => p.status === STATUS.APROVADO);
  const pago = all.filter(p => p.status === STATUS.PAGO);
  const reprovado = all.filter(p => p.status === STATUS.REPROVADO);
  const ajuste = all.filter(p => p.status === STATUS.AJUSTE);

  const sum = arr => arr.reduce((s,p) => s + Number(p.valor||0), 0);

  const naoPago = all.filter(p => ![STATUS.PAGO, STATUS.REPROVADO, STATUS.CANCELADO].includes(p.status));
  const vencendoHoje = naoPago.filter(p => p.vencimento === today);
  const vencidos    = naoPago.filter(p => p.vencimento && p.vencimento < today);
  const proxSemana  = naoPago.filter(p => inWeek(p.vencimento));
  const noMes       = naoPago.filter(p => inMonth(p.vencimento));

  return {
    counts: { aguardando: aguardando.length, aprovado: aprovado.length, pago: pago.length, reprovado: reprovado.length, ajuste: ajuste.length, total: all.length },
    valores: {
      aguardando: sum(aguardando), aprovado: sum(aprovado), pago: sum(pago),
      vencendoHoje: sum(vencendoHoje), vencidos: sum(vencidos),
      proxSemana: sum(proxSemana), noMes: sum(noMes),
    },
    listas: { vencendoHoje, vencidos, aguardando, aprovado, ajuste },
  };
}

// === IMPORTAÇÃO CSV ===
// Formato aceito:
//   - Separador: ; ou , (autodetecta)
//   - 1ª linha = headers (case-insensitive, com/sem acentos)
//   - Colunas reconhecidas: empresa_id ou empresa(nome), fornecedor, descricao,
//     categoria, valor, vencimento (DD/MM/YYYY ou YYYY-MM-DD), forma_pagamento,
//     chave_pix, codigo_barras, centro_custo, conta_bancaria_sugerida (id ou apelido),
//     recorrente (sim/nao/true/false), observacoes
//   - Apenas fornecedor + valor são obrigatórios; resto é opcional
//
// Retorna: { previewMode, criados:[], pulados:[], erros:[{linha, motivo, raw}] }
//
// `dryRun:true` retorna preview sem criar. `dryRun:false` cria os válidos.
function _normHeader(h) {
  return String(h||'').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9_]+/g,'_')
    .replace(/^_|_$/g,'');
}
const HEADER_ALIASES = {
  empresa_id: 'empresaId', empresa: 'empresaNome', empresa_bi: 'empresaId',
  fornecedor: 'fornecedor', supplier: 'fornecedor',
  descricao: 'descricao', description: 'descricao', desc: 'descricao',
  categoria: 'categoria', category: 'categoria',
  valor: 'valor', amount: 'valor', total: 'valor',
  vencimento: 'vencimento', due_date: 'vencimento', vencto: 'vencimento', data_vencimento: 'vencimento',
  forma_pagamento: 'formaPagamento', forma_pgto: 'formaPagamento', forma: 'formaPagamento',
  chave_pix: 'chavePix', pix: 'chavePix',
  codigo_barras: 'codigoBarras', boleto: 'codigoBarras',
  centro_custo: 'centroCusto', cc: 'centroCusto',
  conta_bancaria_sugerida: 'contaBancariaSugerida', banco: 'contaBancariaSugerida',
  recorrente: 'recorrente',
  observacoes: 'obs', obs: 'obs', observacao: 'obs',
  dados_bancarios: 'dadosBancarios',
  anexo_url: 'anexoUrl', anexo: 'anexoUrl',
};

function _parseValor(s) {
  if (typeof s === 'number') return s;
  let v = String(s||'').trim().replace(/[R$\s]/g,'');
  if (!v) return 0;
  // BR: 1.234,56 ou 1234,56. EN: 1,234.56 ou 1234.56
  if (v.includes(',') && v.includes('.')) {
    if (v.lastIndexOf(',') > v.lastIndexOf('.')) v = v.replace(/\./g,'').replace(',','.');
    else v = v.replace(/,/g,'');
  } else if (v.includes(',')) v = v.replace(',','.');
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}
function _parseData(s) {
  if (!s) return '';
  const t = String(s).trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    let y = m[3]; if (y.length === 2) y = '20' + y;
    return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  }
  return '';
}
function _parseBool(s) {
  const v = String(s||'').toLowerCase().trim();
  return ['1','true','sim','s','yes','y','verdadeiro'].includes(v);
}

function importCsv(csvText, { dryRun = false, who = 'import-csv', resolveEmpresaPorNome = null, resolveBancoPorApelido = null } = {}) {
  const lines = String(csvText||'').split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { dryRun, criados:[], pulados:[], erros:[{ linha:0, motivo:'CSV vazio ou só header' }] };

  // Detecta separador
  const sep = lines[0].includes(';') ? ';' : (lines[0].includes('\t') ? '\t' : ',');
  const rawHeaders = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g,''));
  const headers = rawHeaders.map(_normHeader).map(h => HEADER_ALIASES[h] || h);

  const criados = []; const erros = []; const pulados = [];

  for (let i = 1; i < lines.length; i++) {
    const linha = i + 1;
    const cols = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g,''));
    const row = {};
    headers.forEach((h, idx) => { row[h] = cols[idx] || ''; });

    // Resolução empresa
    let empresaId = row.empresaId || '';
    if (!empresaId && row.empresaNome && resolveEmpresaPorNome) {
      empresaId = resolveEmpresaPorNome(row.empresaNome) || '';
    }
    // Resolução banco sugerido
    let bancoId = row.contaBancariaSugerida || '';
    if (bancoId && !/^bk_/.test(bancoId) && resolveBancoPorApelido) {
      bancoId = resolveBancoPorApelido(bancoId) || bancoId;
    }

    const valor = _parseValor(row.valor);
    const vencimento = _parseData(row.vencimento);

    // Validação mínima
    if (!row.fornecedor) { erros.push({ linha, motivo:'fornecedor obrigatório', raw: row }); continue; }
    if (valor <= 0)      { erros.push({ linha, motivo:'valor inválido ou zero', raw: row }); continue; }
    if (!empresaId)      { erros.push({ linha, motivo:'empresa não identificada (passe empresa_id ou empresa)', raw: row }); continue; }

    const payload = {
      empresaBI: empresaId,
      fornecedor: row.fornecedor,
      categoria: row.categoria || '',
      descricao: row.descricao || '',
      valor,
      vencimento,
      formaPagamento: row.formaPagamento || '',
      chavePix: row.chavePix || '',
      codigoBarras: row.codigoBarras || '',
      dadosBancarios: row.dadosBancarios || '',
      anexoUrl: row.anexoUrl || '',
      centroCusto: row.centroCusto || '',
      contaBancariaSugerida: bancoId,
      recorrente: _parseBool(row.recorrente),
      obs: row.obs || '',
    };

    if (dryRun) {
      criados.push({ linha, payload });
    } else {
      try {
        const p = criar(payload, who);
        criados.push({ linha, id: p.id, fornecedor: p.fornecedor, valor: p.valor });
      } catch(e) {
        erros.push({ linha, motivo: e.message, raw: row });
      }
    }
  }

  return { dryRun, criados, erros, pulados, total: lines.length - 1 };
}

module.exports = {
  STATUS, defaultPagamento,
  loadAll, saveAll, get, listFiltered,
  criar, editar, remover, submeter, aprovar, reprovar, solicitarAjuste, marcarPago, pagamentoDireto, cancelar,
  findByToken, listAudit, audit,
  loadConfig, saveConfig, dashboardSummary,
  importCsv,
};
