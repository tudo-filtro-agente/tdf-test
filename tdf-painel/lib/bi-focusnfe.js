// lib/bi-focusnfe.js — Adapter Focus NFe (focusnfe.com.br) pra emitir NF-e/NFC-e/NFS-e
//
// Doc oficial: https://focusnfe.com.br/doc
// Auth: HTTP Basic com token na conta principal (ambiente homologação ou produção)
//   Sandbox: https://homologacao.focusnfe.com.br
//   Prod:    https://api.focusnfe.com.br
//
// Mod 55 = NF-e (vendas B2B/B2C com transporte)
// Mod 65 = NFC-e (cupom fiscal eletrônico, balcão/consumidor final)
// NFS-e = serviços (varia por município)
//
// Cada empresa BI tem sua própria credencial (CNPJ + token + ambiente):
//   data/bi-focusnfe-config.json (gitignored — contém tokens cleartext)
//
// Storage de emissões:
//   data/bi-nfe-emissoes.json — { refId: { ...emissao } }
//     refId = identificador único da requisição (ex: 'pg_xxx' ou 'rc_xxx' ou 'pdv_<ts>')

const fs = require('fs');
const path = require('path');
const pagamentos = require('./bi-pagamentos'); // pra audit

const DATA_DIR = path.join(__dirname, '..', 'data');
const CFG_FILE = path.join(DATA_DIR, 'bi-focusnfe-config.json');
const EMI_FILE = path.join(DATA_DIR, 'bi-nfe-emissoes.json');

const URL_HOMOLOG = 'https://homologacao.focusnfe.com.br';
const URL_PROD    = 'https://api.focusnfe.com.br';

function _ensure() {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch(_){}
  if (!fs.existsSync(CFG_FILE)) fs.writeFileSync(CFG_FILE, JSON.stringify({ porEmpresa: {} }, null, 2));
  if (!fs.existsSync(EMI_FILE)) fs.writeFileSync(EMI_FILE, '{}');
}
function _loadCfg() { _ensure(); try { return JSON.parse(fs.readFileSync(CFG_FILE,'utf8')); } catch(_) { return { porEmpresa: {} }; } }
function _saveCfg(o) { _ensure(); try { fs.writeFileSync(CFG_FILE, JSON.stringify(o, null, 2)); return true; } catch(_) { return false; } }
function _loadEmi() { _ensure(); try { return JSON.parse(fs.readFileSync(EMI_FILE,'utf8')); } catch(_) { return {}; } }
function _saveEmi(o) { _ensure(); try { fs.writeFileSync(EMI_FILE, JSON.stringify(o, null, 2)); return true; } catch(_) { return false; } }

// === CONFIG por empresa ===
function _maskCfg(c, empId) {
  return {
    empresaId: empId,
    cnpj: c.cnpj || '',
    apelido: c.apelido || '',
    ambiente: c.ambiente || 'homologacao',
    tokenMasked: c.token ? (String(c.token).slice(0,6) + '…') : '',
    ativo: c.ativo !== false,
    updatedAt: c.updatedAt || null,
  };
}

function listConfigsMasked() {
  const o = _loadCfg();
  const out = {};
  for (const [empId, c] of Object.entries(o.porEmpresa || {})) {
    out[empId] = _maskCfg(c, empId);
  }
  return out;
}

function getConfig(empresaId) {
  const o = _loadCfg();
  return (o.porEmpresa || {})[empresaId] || null;
}

function upsertConfig(empresaId, patch, who) {
  if (!empresaId) return { ok:false, error:'empresaId obrigatório' };
  const o = _loadCfg();
  o.porEmpresa = o.porEmpresa || {};
  if (patch.remove === true) { delete o.porEmpresa[empresaId]; _saveCfg(o); return { ok:true, removed:true }; }
  const cur = o.porEmpresa[empresaId] || { createdAt: new Date().toISOString() };
  if (patch.cnpj     !== undefined) cur.cnpj     = String(patch.cnpj || '').replace(/\D/g,'');
  if (patch.token    !== undefined) cur.token    = String(patch.token || '').trim();
  if (patch.ambiente !== undefined) cur.ambiente = ['producao','prod'].includes(String(patch.ambiente).toLowerCase()) ? 'producao' : 'homologacao';
  if (patch.apelido  !== undefined) cur.apelido  = String(patch.apelido || '').trim();
  if (patch.ativo    !== undefined) cur.ativo    = !!patch.ativo;
  cur.updatedAt = new Date().toISOString();
  cur.updatedBy = who || null;
  o.porEmpresa[empresaId] = cur;
  _saveCfg(o);
  return { ok:true };
}

function _baseUrlFor(cfg) {
  return cfg.ambiente === 'producao' ? URL_PROD : URL_HOMOLOG;
}

// HTTP wrapper c/ Basic Auth (token vai como user, password vazio)
async function _focusFetch(cfg, path, options = {}) {
  if (!cfg || !cfg.token) throw new Error('Focus NFe não configurado pra esta empresa');
  const url = _baseUrlFor(cfg) + path;
  const auth = 'Basic ' + Buffer.from(cfg.token + ':').toString('base64');
  const r = await fetch(url, {
    method: options.method || 'GET',
    headers: { Authorization: auth, 'Content-Type':'application/json', ...(options.headers||{}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  return r;
}

// === Mapeamento de venda → payload Focus NFe ===
//
// Doc Focus mod 55: https://focusnfe.com.br/doc/#nfe
// Mínimo: natureza_operacao, data_emissao, tipo_documento (1=saida), local_destino (1=interna),
//         finalidade_emissao (1=normal), nome_emitente, cnpj_emitente, ...
//         items: { valor_unitario_comercial, quantidade_comercial, descricao, codigo_produto, ... }
//
// O payload abaixo é simplificado pra o caso de produção comum BR.
function montarPayloadNFe(venda, opts = {}) {
  const tipoDoc = opts.tipoDocumento === 'NFCe' ? 65 : 55;
  // Empresa emitente (vem do cfg)
  // Cliente: vem da venda
  const itens = (venda.itens || []).map((it, i) => ({
    numero_item: i + 1,
    codigo_produto: it.codigo || ('PROD' + (i+1)),
    descricao: it.nome || it.descricao || 'Produto',
    cfop: opts.cfop || '5102', // Venda mercadoria — mesmo estado
    unidade_comercial: it.unidade || 'UN',
    quantidade_comercial: Number(it.qtd) || 1,
    valor_unitario_comercial: +(Number(it.valor) / Math.max(1, Number(it.qtd) || 1)).toFixed(2),
    valor_bruto: Number(it.valor) || 0,
    unidade_tributavel: it.unidade || 'UN',
    quantidade_tributavel: Number(it.qtd) || 1,
    valor_unitario_tributavel: +(Number(it.valor) / Math.max(1, Number(it.qtd) || 1)).toFixed(2),
    origem: '0', // Nacional
    icms_situacao_tributaria: opts.icmsCST || '102', // Simples Nacional - sem permissão de crédito
    pis_situacao_tributaria: opts.pisCST || '07',    // Operação isenta
    cofins_situacao_tributaria: opts.cofinsCST || '07',
  }));
  const valorTotal = itens.reduce((s,it) => s + Number(it.valor_bruto || 0), 0);

  const payload = {
    natureza_operacao: opts.naturezaOperacao || 'Venda de mercadoria',
    data_emissao: opts.dataEmissao || new Date().toISOString(),
    tipo_documento: 1,                    // 0=entrada, 1=saída
    local_destino: opts.localDestino || 1, // 1=interna, 2=interestadual, 3=exterior
    finalidade_emissao: '1',              // 1=normal, 2=complementar, 3=ajuste, 4=devolução
    presenca_comprador: tipoDoc === 65 ? '1' : '9', // 1=presencial (NFCe), 9=outros
    modalidade_frete: 9,                  // 9=sem frete (default; ajusta se houver)
    nome_destinatario: venda.nomeDestinatario || venda.cliente || 'Consumidor Final',
    cnpj_destinatario: venda.cnpjDestinatario || null,
    cpf_destinatario:  venda.cpfDestinatario  || null,
    inscricao_estadual_destinatario: venda.ieDestinatario || null,
    email_destinatario: venda.emailDestinatario || null,
    telefone_destinatario: venda.telefoneDestinatario || null,
    indicador_inscricao_estadual_destinatario: venda.indIEDestinatario || '9', // 9=não contribuinte (consumidor final)
    logradouro_destinatario: venda.endereco?.rua || null,
    numero_destinatario: venda.endereco?.numero || 'S/N',
    bairro_destinatario: venda.endereco?.bairro || null,
    municipio_destinatario: venda.endereco?.cidade || null,
    uf_destinatario: venda.endereco?.uf || null,
    cep_destinatario: venda.endereco?.cep ? String(venda.endereco.cep).replace(/\D/g,'') : null,
    pais_destinatario: 'Brasil',
    items: itens,
    valor_produtos: valorTotal,
    valor_total: valorTotal,
    valor_desconto: opts.desconto || 0,
    forma_pagamento: opts.formaPagamento || '99', // 99=outros
    meio_pagamento: opts.meioPagamento || '01',   // 01=dinheiro, 03=crédito, 04=débito, 17=PIX
    informacoes_adicionais_contribuinte: opts.infoAdicional || null,
  };
  return { payload, tipoDoc };
}

// Emite NF-e ou NFC-e
async function emitir(empresaId, venda, opts = {}) {
  const cfg = getConfig(empresaId);
  if (!cfg) return { ok:false, error:'Focus NFe não configurado pra esta empresa' };
  if (!cfg.ativo) return { ok:false, error:'Config Focus NFe inativa' };
  if (!cfg.cnpj) return { ok:false, error:'CNPJ emitente não cadastrado' };

  const { payload, tipoDoc } = montarPayloadNFe(venda, opts);
  // Ref único — Focus exige pra evitar dupla emissão
  const ref = opts.ref || ('TDF_' + Date.now() + '_' + Math.random().toString(36).slice(2,6));
  const endpointPath = tipoDoc === 65
    ? `/v2/nfce?ref=${encodeURIComponent(ref)}`
    : `/v2/nfe?ref=${encodeURIComponent(ref)}`;

  let r;
  try {
    r = await _focusFetch(cfg, endpointPath, { method:'POST', body: payload });
  } catch(e) {
    return { ok:false, error:'erro de conexão Focus: ' + e.message };
  }

  const status = r.status;
  let body = null;
  try { body = await r.json(); } catch(_) { try { body = await r.text(); } catch(__){} }

  // Salva emissão
  const emiMap = _loadEmi();
  emiMap[ref] = {
    ref,
    empresaId,
    tipoDoc: tipoDoc === 65 ? 'NFCe' : 'NFe',
    ambiente: cfg.ambiente,
    status_focus: status,
    response: body,
    venda: {
      cliente: venda.cliente,
      valorTotal: payload.valor_total,
      vendaSourceId: opts.refId || null,
      vendaSourceType: opts.refTipo || null,
    },
    createdAt: new Date().toISOString(),
    autorizadaEm: null,
  };
  _saveEmi(emiMap);
  pagamentos.audit({ tipo:'nfe-emitida', ref, empresaBI: empresaId, tipoDoc: tipoDoc===65?'NFCe':'NFe', status, valor: payload.valor_total });

  if (status >= 200 && status < 300) return { ok:true, ref, status, response: body };
  return { ok:false, ref, status, error: body?.mensagem || body?.erros || 'falha na emissão', response: body };
}

// Consulta status de uma emissão
async function consultar(ref) {
  const emiMap = _loadEmi();
  const emi = emiMap[ref];
  if (!emi) return { ok:false, error:'ref desconhecido' };
  const cfg = getConfig(emi.empresaId);
  if (!cfg) return { ok:false, error:'cfg Focus não encontrada' };
  const path = (emi.tipoDoc === 'NFCe' ? '/v2/nfce/' : '/v2/nfe/') + encodeURIComponent(ref);
  let r, body;
  try {
    r = await _focusFetch(cfg, path);
    body = await r.json().catch(() => ({}));
  } catch(e) { return { ok:false, error: e.message }; }
  // Atualiza estado local
  emi.lastConsulta = { status: r.status, body, ts: new Date().toISOString() };
  if (body?.status === 'autorizado' && !emi.autorizadaEm) emi.autorizadaEm = new Date().toISOString();
  _saveEmi(emiMap);
  return { ok: r.ok, status: r.status, body, emissao: emi };
}

function listEmissoes(filtro = {}) {
  const all = Object.values(_loadEmi());
  let arr = all;
  if (filtro.empresaId) arr = arr.filter(e => e.empresaId === filtro.empresaId);
  if (filtro.tipoDoc)   arr = arr.filter(e => e.tipoDoc === filtro.tipoDoc);
  arr.sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||''));
  return arr;
}

function getEmissao(ref) { return _loadEmi()[ref] || null; }

// Webhook handler — chamado quando Focus avisa que NFe foi autorizada/rejeitada
function processarWebhook(body) {
  if (!body || !body.ref) return { ok:false, error:'sem ref no webhook' };
  const emiMap = _loadEmi();
  const emi = emiMap[body.ref];
  if (!emi) return { ok:false, error:'ref desconhecido', refRecebido: body.ref };
  emi.webhook = { body, ts: new Date().toISOString() };
  if (body.status) emi.statusFocusUltimo = body.status;
  if (body.status === 'autorizado' && !emi.autorizadaEm) emi.autorizadaEm = new Date().toISOString();
  if (body.caminho_xml_nota_fiscal) emi.caminhoXml = body.caminho_xml_nota_fiscal;
  if (body.caminho_danfe)           emi.caminhoDanfe = body.caminho_danfe;
  _saveEmi(emiMap);
  pagamentos.audit({ tipo:'nfe-webhook', ref: body.ref, status: body.status, empresaBI: emi.empresaId });
  return { ok:true, emissao: emi };
}

// Cancela NFe
async function cancelar(ref, justificativa) {
  if (!justificativa || justificativa.trim().length < 15) return { ok:false, error:'justificativa precisa ter pelo menos 15 caracteres' };
  const emi = _loadEmi()[ref]; if (!emi) return { ok:false, error:'emissão não existe' };
  const cfg = getConfig(emi.empresaId); if (!cfg) return { ok:false, error:'cfg não encontrada' };
  const path = (emi.tipoDoc === 'NFCe' ? '/v2/nfce/' : '/v2/nfe/') + encodeURIComponent(ref);
  const r = await _focusFetch(cfg, path, { method:'DELETE', body:{ justificativa } });
  const body = await r.json().catch(() => ({}));
  pagamentos.audit({ tipo:'nfe-cancelada', ref, justificativa, status: r.status });
  return { ok: r.ok, status: r.status, body };
}

module.exports = {
  // Config
  listConfigsMasked, getConfig, upsertConfig,
  // Emissão
  emitir, consultar, cancelar, listEmissoes, getEmissao,
  // Webhook
  processarWebhook,
  // Helpers
  montarPayloadNFe,
};
