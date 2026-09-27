// test/bi-pdv.test.js — miolo do PDV de balcão (Omie fecha, Zoho confirma por leitura de volta).
//
// Regras travadas aqui, cada uma com motivo real:
// - telefone obrigatório e em E.164 pelo COMPRIMENTO (DDD 55 não é código de país)
// - desconto máximo 5% sobre o bruto SEM autorização (teto do OPERADOR — acima disso,
//   com autorização válida de supervisor, não há teto); bruto zerado com desconto é
//   sempre recusado sem autorização
// - desconto NEGATIVO (inflaria o valor) e NÃO-NUMÉRICO (viraria NaN) são recusados
// - Amount do Deal NUNCA inclui frete (bônus é sobre produto) e SEMPRE desconta o desconto
// - o desconto vai junto pro Omie — nota pelo valor cheio com Negócio descontado é divergência fiscal
// - a empresa mandada ao Omie é a da venda (nota pelo CNPJ errado é problema fiscal)
// - o PDV NUNCA fatura (nenhum FaturarPedido/FaturarPedidoVenda) — quem emite a nota
//   depois é a Eloize, manualmente, no Omie; o pedido só nasce e é validado
// - validarPedido roda depois de criaPedido e NUNCA derruba a venda — erro de validação
//   vira aviso pra tela (avisoNotaFiscal, verbatim), e falha na PRÓPRIA chamada
//   (rede/Omie fora) também não derruba, só some o aviso
// - email é validado no FORMATO quando preenchido, mas NUNCA obrigatório pra fechar
// - falha do Omie devolve ok:false E o número do pedido, se ele já nasceu (senão o operador duplica)
// - Stage/Lead_Source/Autor_Lead_Vendedor são os valores confirmados pela API do CRM
// - o cliente do balcão SEMPRE vira Contato: reusa o do CRM, senão busca por telefone, senão cria
// - o id que veio da tela só entra em Contact_Name quando é MESMO de um Contato (Empresa/Lead/Negócio, não)
// - o Orçamento carrega produto, preço, quantidade e o vínculo com o Negócio (fila de manutenção lê dali)
// - o produto do Orçamento é apontado pelo ID do Zoho, nunca por nome (lookup por nome não resolve)
// - item sem código de cadastro é recusado NO SERVIDOR (sem código o Omie recebe o item sem NCM)
// - Focus NFe e recebimento no BI NUNCA são chamados (Omie é o emissor único da nota)
// - falha do Zoho não derruba a venda (o cliente já foi embora com a nota)
// - confirmação de "completa" só por LEITURA DE VOLTA do Zoho (Negócio E Orçamento), nunca pelo HTTP 200
// - o Orçamento é relido PELO ID e suas LINHAS conferidas — Orçamento sem linha não é venda completa
// - o Amount relido é conferido contra o líquido — CRM e ERP não podem divergir em silêncio
// - idempotência: o idem mandado ao Omie é o id do livro-razão, e venda já completa volta na hora
// - o livro-razão é aberto com o idem DA TELA, o operador e o total líquido (as duas camadas
//   da proteção contra duplo clique dependem desses argumentos)
// - falha do livro-razão devolve {ok:false, erro} — finalizarVenda NUNCA lança
// - o ESTADO GRAVADO no razão é afirmado em todo caminho de falha (é ele que o reconciliador lê)
// - auditoria financeira, Focus NFe e recebimentos do BI são dublados no dublê COMPARTILHADO —
//   a suíte NUNCA escreve em data/bi-auditoria.json nem em data/bi-recebimentos.json
// - TDF_PDV_MODO_SOMBRA=1 tranca TUDO que é externo (Omie, Zoho e auditoria), antes de qualquer chamada —
//   é a garantia de que o dia de teste em paralelo com o sistema atual não emite nota duplicada
// - ordem das guardas: venda já completa volta ANTES da trava de sombra (sombra não pode
//   remarcar, e assim apagar, o rastro de uma venda real)

const test = require('node:test');
const assert = require('node:assert');

const ledger = require('../lib/pdv-ledger');
const opdv = require('../lib/omie-pdv');
const zoho = require('../lib/zoho');
const pagamentos = require('../lib/bi-pagamentos');
const focus = require('../lib/bi-focusnfe');
const rec = require('../lib/bi-recebimentos');
const bipdv = require('../lib/bi-pdv');

function base(extra) {
  return Object.assign({
    idem: 'pdv_t1', empresa: 'Tudo de Filtro',
    clienteNome: 'Fulano', telefone: '5512999998888', cpf: '12345678909',
    origem: 'Indicação de amigo ou parente',
    itens: [{ id: 'zp-ref01', codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 1, valor: 200 }],
    frete: 30, desconto: 0, formaPagamento: 'PIX',
    // Endereço: sem `clienteZohoId` (a maioria destes testes), o payload é
    // tratado como CLIENTE NOVO — e cliente novo precisa de endereço completo
    // (regra do dono, 18/ago/2026, ver seção "ENDEREÇO OBRIGATÓRIO" abaixo).
    // Estes valores default deixam os ~150 testes acima intactos, que não são
    // sobre endereço nenhum.
    endereco: 'Rua das Flores', numero: '120', bairro: 'Centro',
    cidade: 'Bebedouro', uf: 'SP', cep: '14700-000',
  }, extra || {});
}

// stub() grava a CARGA enviada a cada dublê (não o que ele devolve) — é isso
// que prova as regras de negócio, não o resultado da função.
//
// `pagamentos.audit` é dublado junto: ele grava em data/bi-auditoria.json, que é
// o log de auditoria financeira versionado no git e, em produção, o log vivo.
// Rodar a suíte NÃO pode carimbar venda fabricada lá dentro.
//
// bi-focusnfe e bi-recebimentos são dublados AQUI, no dublê compartilhado, e não
// dentro de um teste só: `recebimentos.criar` grava em data/bi-recebimentos.json,
// arquivo versionado no git (uma regressão já reproduzida escreveu 994 linhas
// lá dentro). Toda venda fabricada nesta suíte tem que passar por dublê, senão
// a próxima regressão que reintroduzir o recebimento suja o repositório antes de
// qualquer assert notar. `proibidas` guarda o que foi tocado.
function stub(over) {
  const origLedger = { abrir: ledger.abrir, marcar: ledger.marcar, buscar: ledger.buscar };
  const origOpdv = {
    garanteCliente: opdv.garanteCliente, criaPedido: opdv.criaPedido,
    validarPedido: opdv.validarPedido,
  };
  const origZoho = {
    createDeal: zoho.createDeal, createQuote: zoho.createQuote, getRecord: zoho.getRecord,
    createContact: zoho.createContact, searchModulePhone: zoho.searchModulePhone,
  };
  const origAudit = pagamentos.audit;
  const origProibidas = {
    emitir: focus.emitir, criar: rec.criar,
    marcarRecebido: rec.marcarRecebido, recebimentoParcial: rec.recebimentoParcial,
  };

  const chamado = {
    deal: null, quote: null, getRecordArgs: null, abrirArgs: null,
    garanteCliente: null, criaPedido: null, validarPedido: null,
    // resolução do Contato: o que foi buscado por telefone e o que foi criado
    contato: null, buscaTelefone: null,
    // releitura de confirmação: TODA chamada, e a do Orçamento em separado.
    // `getRecordArgs` continua sendo a do Negócio.
    getRecordCalls: [], getRecordQuoteArgs: null,
  };
  const tocou = { omie: [], zoho: [] };
  const marcas = [];
  const auditorias = [];
  const proibidas = [];

  // O id do livro-razão é DIFERENTE do idem que veio da tela: é ele, e só ele,
  // que pode virar chave de idempotência no Omie.
  ledger.abrir = async (args) => { chamado.abrirArgs = args; return { id: 'pdv_v1', estado: 'aberta', novo: true }; };
  ledger.marcar = async (id, estado, dados) => { marcas.push({ id, estado, dados }); };
  // Default: nenhuma linha extra ao ler pelo id — só é exercitado quando um
  // teste sobrescreve `abrir` pra devolver uma venda já 'completa'. Devolver
  // null aqui é o comportamento seguro: bi-pdv.js trata a ausência de linha
  // sem quebrar (repetida:true continua, só sem pedidoOmie/dealId).
  ledger.buscar = async () => null;

  // Emissor de nota concorrente e recebimento no BI: NUNCA podem ser chamados
  // daqui (nota duplicada + receita contada duas vezes). Dublados pra que nem
  // uma regressão consiga escrever nos arquivos de data/.
  focus.emitir            = async () => { proibidas.push('focus.emitir'); };
  rec.criar               = () => { proibidas.push('recebimentos.criar'); };
  // marcarRecebido era justamente a função que o código antigo usava pra creditar
  // o banco: um revert parcial reintroduz receita contada duas vezes.
  rec.marcarRecebido      = () => { proibidas.push('recebimentos.marcarRecebido'); };
  rec.recebimentoParcial  = () => { proibidas.push('recebimentos.recebimentoParcial'); };

  opdv.garanteCliente = async (...args) => { tocou.omie.push('garanteCliente'); chamado.garanteCliente = args; return { codigo_cliente_omie: 777 }; };
  opdv.criaPedido    = async (...args) => { tocou.omie.push('criaPedido');    chamado.criaPedido    = args; return { numero_pedido: '5281', codigo_pedido: 991 }; };
  // Default: validação sem erro — a maioria das vendas nesta suíte não é
  // sobre o aviso de nota nenhum. Testes que exercitam o aviso sobrescrevem
  // via `over.opdv.validarPedido`.
  opdv.validarPedido = async (...args) => { tocou.omie.push('validarPedido'); chamado.validarPedido = args; return { ok: true, codStatus: '0', descStatus: '' }; };

  // Contato: por padrão o telefone NÃO acha ninguém e o Contato é criado —
  // é o caminho do cliente novo de balcão, o que o spec manda existir.
  zoho.searchModulePhone = async (...args) => { tocou.zoho.push('searchModulePhone'); chamado.buscaTelefone = args; return []; };
  zoho.createContact = async (f) => { tocou.zoho.push('createContact'); chamado.contato = f; return { id: 'C1' }; };

  zoho.createDeal  = async (f) => { tocou.zoho.push('createDeal');  chamado.deal  = f; return { id: 'D1' }; };
  zoho.createQuote = async (f) => { tocou.zoho.push('createQuote'); chamado.quote = f; return { id: 'Q1' }; };
  // O dublê do getRecord ECOA o Amount que o createDeal recebeu — é o que um CRM
  // consistente devolveria. Assim a checagem de Amount na releitura é exercitada
  // de verdade em toda venda boa, e divergência só aparece quando um teste
  // sobrescreve o getRecord de propósito.
  // O dublê do getRecord ECOA também o Orçamento: devolve as LINHAS que o
  // createQuote recebeu, que é o que um CRM consistente devolveria na releitura.
  zoho.getRecord   = async (...args) => {
    tocou.zoho.push('getRecord'); chamado.getRecordCalls.push(args);
    if (args[0] === 'Quotes') {
      chamado.getRecordQuoteArgs = args;
      return { id: 'Q1', Subject: chamado.quote ? chamado.quote.Subject : null,
               Quoted_Items: chamado.quote ? chamado.quote.Quoted_Items : [] };
    }
    chamado.getRecordArgs = args;
    return { id: 'D1', Stage: 'Fechado Ganho',
             Amount: chamado.deal ? chamado.deal.Amount : null, Pedido_Omie: '5281' };
  };

  pagamentos.audit = (ev) => { auditorias.push(ev); };

  Object.assign(ledger, over && over.ledger);
  Object.assign(opdv, over && over.opdv);
  Object.assign(zoho, over && over.zoho);

  return {
    chamado, tocou, marcas, auditorias, proibidas,
    // último estado gravado no livro-razão — é ESTA linha que o reconciliador lê.
    estadoNoRazao: () => (marcas.length ? marcas[marcas.length - 1].estado : null),
    restaurar: () => {
      Object.assign(ledger, origLedger);
      Object.assign(opdv, origOpdv);
      Object.assign(zoho, origZoho);
      pagamentos.audit = origAudit;
      focus.emitir = origProibidas.emitir;
      rec.criar = origProibidas.criar;
      rec.marcarRecebido = origProibidas.marcarRecebido;
      rec.recebimentoParcial = origProibidas.recebimentoParcial;
    },
  };
}

test('recusa venda sem telefone e nao chama nada', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '' }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /telefone/i);
    assert.equal(s.chamado.deal, null);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
  } finally { s.restaurar(); }
});

test('recusa telefone em formato invalido (curto demais) e nao chama nada', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '123' }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /telefone/i);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
  } finally { s.restaurar(); }
});

// === TELEFONE: normalização por COMPRIMENTO, não por prefixo ===
// Santa Maria/RS tem DDD 55. `startsWith('55')` acha que 5532223333 já tem
// código de país e devolve o número SEM o 55 na frente — o cliente some do
// relógio de troca de refil e a venda vira dado cego.
test('telefone com DDD 55 (Santa Maria/RS) recebe o codigo de pais, nao e confundido com E.164', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '5532223333' }), 'edson'); // 10 dígitos: DDD 55 + 8
    assert.equal(r.ok, true);
    assert.equal(s.chamado.deal.Telefone_contato, '555532223333');
    assert.equal(s.chamado.garanteCliente[1].telefone, '555532223333');
  } finally { s.restaurar(); }
});

test('telefone com DDD 55 e nono digito (11 digitos) tambem recebe o codigo de pais', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '55991234567' }), 'edson'); // 11 dígitos
    assert.equal(r.ok, true);
    assert.equal(s.chamado.deal.Telefone_contato, '5555991234567');
  } finally { s.restaurar(); }
});

test('telefone de 11 digitos sem pais vira E.164 com 55 na frente', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '(12) 99999-8888' }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(s.chamado.deal.Telefone_contato, '5512999998888');
  } finally { s.restaurar(); }
});

test('telefone de 10 digitos sem pais (fixo) vira E.164 com 55 na frente', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '1233334444' }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(s.chamado.deal.Telefone_contato, '551233334444');
  } finally { s.restaurar(); }
});

test('telefone ja em E.164 (13 digitos com 55) passa intacto, sem duplicar o pais', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '5512999998888' }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(s.chamado.deal.Telefone_contato, '5512999998888');
  } finally { s.restaurar(); }
});

test('telefone de 12 digitos que NAO comeca com 55 e recusado (nao e numero BR)', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '351912345678' }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /telefone/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('Telefone_contato do Negocio recebe o telefone NORMALIZADO, nunca o valor cru da tela', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ telefone: '(12) 99999-8888' }), 'edson');
    assert.equal(s.chamado.deal.Telefone_contato, '5512999998888');
    assert.notEqual(s.chamado.deal.Telefone_contato, '(12) 99999-8888');
  } finally { s.restaurar(); }
});

// === DESCONTO ===
//
// Regra do dono (18/ago/2026): teto do OPERADOR caiu de 10% para 5%. Acima
// disso a venda só passa com autorização de supervisor JÁ VERIFICADA — o
// terceiro argumento de finalizarVenda (`autorizacaoDesconto`), montado por
// server.js chamando lib/pdv-web.js#verificarAutorizacaoDesconto ANTES de
// chamar o motor da venda. bi-pdv.js NUNCA vê a senha, só o resultado.
// Com autorização válida NÃO HÁ TETO — qualquer desconto passa.

test('recusa desconto acima de 5% sem nenhuma tentativa de autorizacao (3o argumento ausente)', async () => {
  const s = stub();
  try {
    // bruto = 200, 5% = 10 — desconto de 50 estoura bem acima, sem autorizacaoDesconto
    const r = await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /desconto/i);
    assert.match(r.erro, /autoriza/i, 'a mensagem tem que orientar o operador a buscar autorizacao');
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
    assert.equal(s.chamado.abrirArgs, null, 'nem o livro-razao pode receber a venda barrada pelo teto');
  } finally { s.restaurar(); }
});

// MUTAÇÃO: trocar DESCONTO_MAX_PCT_OPERADOR de 5 de volta pra 10 faz este
// teste falhar — 8% passaria sem autorização, que é exatamente a regra
// revogada pelo dono.
test('recusa desconto de 8% sem autorizacao — teto do operador e 5%, nao 10%', async () => {
  const s = stub();
  try {
    // bruto = 200, 8% = 16
    const r = await bipdv.finalizarVenda(base({ desconto: 16 }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /desconto/i);
    assert.deepEqual(s.tocou.omie, [], 'desconto de 8% sem autorizacao jamais pode chegar no Omie');
  } finally { s.restaurar(); }
});

test('aceita desconto exatamente em 5% (teto do operador, nao acima) sem precisar de autorizacao', async () => {
  const s = stub();
  try {
    // bruto = 200, 5% = 10
    const r = await bipdv.finalizarVenda(base({ desconto: 10 }), 'edson');
    assert.equal(r.ok, true);
  } finally { s.restaurar(); }
});

// Com autorização válida NÃO HÁ TETO — passa qualquer desconto, mesmo um
// desconto absurdo (90% do bruto). MUTAÇÃO: reintroduzir um teto superior
// (ex.: recusar acima de 50% mesmo autorizado) faz este teste quebrar.
test('com autorizacao valida, desconto acima de 5% passa SEM TETO — mesmo 90% do bruto', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    // bruto = 200, desconto = 180 (90%)
    const r = await bipdv.finalizarVenda(base({ desconto: 180 }), 'edson', autorizacaoDesconto);
    assert.equal(r.ok, true);
    assert.equal(r.estado, 'completa');
    assert.equal(s.chamado.deal.Amount, 20);
  } finally { s.restaurar(); }
});

// As 3 mensagens de recusa da autorização precisam ser DISTINGUÍVEIS — é
// como o operador sabe se falta tentar, se a pessoa não pode autorizar, ou
// se ela errou a senha. bi-pdv.js só REPASSA o `erro` que já veio verificado
// (a verificação em si é testada em test/pdv-web.test.js).
test('autorizacao com erro "falta autorizacao" e repassada tal e qual pro operador', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: false, erro: 'desconto acima de 5% exige autorização de um supervisor — informe usuário e senha do autorizador' };
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson', autorizacaoDesconto);
    assert.equal(r.ok, false);
    assert.equal(r.erro, autorizacaoDesconto.erro);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('autorizacao com erro "usuario nao e autorizador" e repassada tal e qual — nao vira mensagem generica de desconto', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: false, erro: 'usuário "taina" não é autorizador de desconto' };
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson', autorizacaoDesconto);
    assert.equal(r.ok, false);
    assert.equal(r.erro, autorizacaoDesconto.erro);
    assert.match(r.erro, /taina/);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

// MUTAÇÃO: trocar `autorizacaoDesconto.ok !== true` por uma checagem frouxa
// (ex.: `!autorizacaoDesconto.erro`) faz este teste quebrar — senha errada
// tem que RECUSAR, nunca passar batido.
test('autorizacao com senha errada (ok:false) e recusada — venda nao pode passar com credencial invalida', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: false, erro: 'senha do autorizador incorreta' };
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson', autorizacaoDesconto);
    assert.equal(r.ok, false);
    assert.match(r.erro, /senha/i);
    assert.deepEqual(s.tocou.omie, [], 'senha errada nao pode deixar a venda chegar no Omie');
    assert.deepEqual(s.tocou.zoho, []);
  } finally { s.restaurar(); }
});

// A SENHA em si nunca é um argumento que bi-pdv.js recebe pra decidir nada —
// só `ok`/`erro`/`autorizador`. Um objeto de autorização com `ok:true` mas
// SEM `autorizador` é malformado — nunca pode passar a venda nem virar um
// "Desconto autorizado por: undefined" gravado no Negócio. Defesa contra
// autorização malformada acidentalmente aceita.
test('autorizacao "ok:true" sem autorizador definido e tratada como invalida — nunca vira "autorizado por undefined"', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true }; // malformado — sem autorizador
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson', autorizacaoDesconto);
    assert.equal(r.ok, false, 'autorizacao malformada nao pode deixar a venda passar');
    assert.deepEqual(s.tocou.omie, []);
    assert.equal(s.chamado.deal, null, 'nem chega a montar o Negocio — Description nunca cita "undefined"');
  } finally { s.restaurar(); }
});

test('bruto zerado com desconto: COM autorizacao valida passa — "sem teto" vale tambem quando o bruto e zero', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ codigo: 'BRINDE', nome: 'Brinde', ncm: '8421.99.99', qtd: 1, valor: 0 }],
      desconto: 50,
    }), 'edson', autorizacaoDesconto);
    assert.equal(r.ok, true); // com autorizacao valida NAO HA TETO — passa
    assert.deepEqual(s.tocou.omie, ['garanteCliente', 'criaPedido', 'validarPedido']);
  } finally { s.restaurar(); }
});

test('bruto zerado com desconto SEM autorizacao e recusado — desconto sobre nada estoura qualquer teto', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ codigo: 'BRINDE', nome: 'Brinde', ncm: '8421.99.99', qtd: 1, valor: 0 }],
      desconto: 50,
    }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /desconto/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('bruto zerado SEM desconto passa — e a cortesia legitima', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ codigo: 'BRINDE', nome: 'Brinde', ncm: '8421.99.99', qtd: 1, valor: 0 }],
      desconto: 0,
    }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(s.chamado.deal.Amount, 0);
  } finally { s.restaurar(); }
});

// desconto_pct é NUMERIC(5,2) no livro-razão (lib/pdv-ledger.js) — só 3
// dígitos antes da vírgula, máximo 999.99. "Com autorização válida NÃO HÁ
// TETO" vale pro VALOR do desconto — mas o PERCENTUAL calculado (desconto /
// bruto * 100) pode passar de 999.99 fácil quando o bruto é pequeno e o
// desconto é grande (ex.: brinde de centavos com desconto de milhares). Sem
// saturar, o INSERT no Postgres real estouraria a coluna e a venda
// FALHARIA — contradizendo exatamente a regra que a autorização deveria
// garantir. O VALOR (R$) continua exato, sem teto nenhum; só o percentual
// exibido/auditado é limitado.
test('desconto_pct e SATURADO em 999.99 quando o percentual calculado estoura NUMERIC(5,2) — venda com autorizacao valida NAO PODE falhar por overflow', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ id: 'zp-ref01', codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 1, valor: 0.01 }],
      desconto: 100000, // bruto=0.01, desconto=100000 -> pct bruto seria ~999.999.900%
    }), 'edson', autorizacaoDesconto);
    assert.equal(r.ok, true, 'desconto absurdo com autorizacao valida NAO PODE falhar — "sem teto" e a regra');
    assert.equal(s.chamado.abrirArgs.descontoPct, 999.99, 'pct gravado no livro-razao tem que estar saturado no maximo que a coluna aguenta');
    assert.equal(s.chamado.abrirArgs.descontoValor, 100000, 'o VALOR (R$) do desconto continua exato — so o percentual e saturado');
  } finally { s.restaurar(); }
});

test('desconto_pct comum (dentro da coluna) NAO e afetado pela saturacao — continua o valor exato calculado', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    // bruto 200, desconto 50 -> 25%, bem abaixo de 999.99
    await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson', autorizacaoDesconto);
    assert.equal(s.chamado.abrirArgs.descontoPct, 25);
  } finally { s.restaurar(); }
});

// Desconto negativo INFLA o total: bruto 200 com desconto -50 devolvia ok:true e
// Amount 250 — valor inflado indo pro Omie (nota) e pra auditoria financeira.
test('recusa desconto NEGATIVO — desconto negativo inflaria o valor da venda', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: -50 }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /desconto/i);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
    assert.equal(s.chamado.abrirArgs, null, 'nem o livro-razao pode receber a venda invalida');
  } finally { s.restaurar(); }
});

// 'abc' vira NaN: Amount NaN serializa como null no Negocio e entra como NaN na
// coluna NUMERIC do livro-razao.
test('recusa desconto NAO-NUMERICO — NaN viraria null no Negocio e NaN no livro-razao', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: 'abc' }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /desconto/i);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
  } finally { s.restaurar(); }
});

test('recusa desconto Infinity', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: Infinity }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /desconto/i);
  } finally { s.restaurar(); }
});

test('Amount do Negocio e o LIQUIDO: desconto abatido e frete fora', async () => {
  const s = stub();
  try {
    // bruto 200, desconto 10 (no limite do operador, 5%), frete 30 → Amount tem que ser 190
    const r = await bipdv.finalizarVenda(base({ desconto: 10, frete: 30 }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(s.chamado.deal.Amount, 190);
    assert.equal(r.cupom.total, 190);
  } finally { s.restaurar(); }
});

test('o desconto vai junto pro Omie — nota cheia com Negocio descontado e divergencia fiscal', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ desconto: 10 }), 'edson');
    assert.equal(s.chamado.criaPedido[1].desconto, 10);
  } finally { s.restaurar(); }
});

// === OMIE: o PDV NUNCA fatura — só cria o pedido e VALIDA (avisa) ===
test('cria o pedido e VALIDA no Omie — nunca fatura, com a empresa da venda e o codigo_pedido devolvido pelo criaPedido', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    // Mutação-alvo #1: se o código voltar a chamar QUALQUER método de
    // faturamento, esta sequência exata não bate mais (teria um item a
    // mais, ou opdv.faturaPedido nem existiria e a chamada estouraria).
    assert.deepEqual(s.tocou.omie, ['garanteCliente', 'criaPedido', 'validarPedido']);
    assert.equal(s.chamado.validarPedido[0], 'Tudo de Filtro');
    assert.equal(s.chamado.validarPedido[1], 991); // codigo_pedido, nao numero_pedido
  } finally { s.restaurar(); }
});

test('TODAS as chamadas do omie-pdv levam a empresa da venda — nota pelo CNPJ errado e problema fiscal', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ empresa: 'Tudo de Filtro' }), 'edson');
    assert.equal(s.chamado.garanteCliente[0], 'Tudo de Filtro');
    assert.equal(s.chamado.criaPedido[0],    'Tudo de Filtro');
    assert.equal(s.chamado.validarPedido[0], 'Tudo de Filtro');
  } finally { s.restaurar(); }
});

test('venda da Mococa vai inteira para a Mococa no Omie, em todas as chamadas', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ empresa: 'Mococa' }), 'edson');
    assert.equal(s.chamado.garanteCliente[0], 'Mococa');
    assert.equal(s.chamado.criaPedido[0],    'Mococa');
    assert.equal(s.chamado.validarPedido[0], 'Mococa');
    assert.equal(s.chamado.deal.Empresa_da_venda, 'Mococa');
  } finally { s.restaurar(); }
});

// === bi-pdv.js NÃO CHAMA NENHUM MÉTODO DE FATURAMENTO — checagem estática ===
// Trava adicional, por texto-fonte: mesmo se alguém reintroduzisse
// opdv.faturaPedido (função que não existe mais em lib/omie-pdv.js) OU
// chamasse omie.chamar direto com 'FaturarPedido'/'FaturarPedidoVenda', esta
// checagem pega antes de qualquer teste de comportamento.
test('bi-pdv.js nao menciona FaturarPedido/FaturarPedidoVenda em lugar nenhum do arquivo', () => {
  const fonte = require('node:fs').readFileSync(require.resolve('../lib/bi-pdv.js'), 'utf8');
  assert.doesNotMatch(fonte, /FaturarPedido/);
  assert.doesNotMatch(fonte, /\.faturaPedido\(/);
});

test('os itens vao pro Omie com codigo, ncm, quantidade e valor — ncm hardcode gera nota errada', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({
      itens: [{ codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 3, valor: 200 },
              { codigo: 'TOR07', nome: 'Torneira', ncm: '8481.80.11', qtd: 1, valor: 90 }],
    }), 'edson');
    const enviados = s.chamado.criaPedido[1].itens;
    assert.equal(enviados.length, 2);
    assert.deepEqual(enviados[0], { codigo: 'REF01', descricao: 'Refil', ncm: '8421.99.99', qtd: 3, valor: 200 });
    assert.deepEqual(enviados[1], { codigo: 'TOR07', descricao: 'Torneira', ncm: '8481.80.11', qtd: 1, valor: 90 });
  } finally { s.restaurar(); }
});

test('o cliente vai pro Omie com nome e documento da tela', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ clienteNome: 'Fulano', cpf: '12345678909' }), 'edson');
    assert.equal(s.chamado.garanteCliente[1].nome, 'Fulano');
    assert.equal(s.chamado.garanteCliente[1].cpf, '12345678909');
  } finally { s.restaurar(); }
});

test('o pedido no Omie usa o codigo de cliente devolvido pelo garanteCliente', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(s.chamado.criaPedido[1].codigoCliente, 777);
  } finally { s.restaurar(); }
});

// === OMIE: caminho de FALHA ===
test('falha no garanteCliente derruba a venda com ok:false e nao toca no Zoho', async () => {
  const s = stub({ opdv: { garanteCliente: async () => { throw new Error('omie cliente fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, false, 'venda que nao aconteceu NUNCA pode voltar ok:true — a tela imprimiria sucesso');
    assert.equal(r.estado, 'falhou');
    assert.match(r.erro, /omie cliente fora/);
    assert.equal('pedidoOmie' in r, false); // pedido nem chegou a nascer
    assert.deepEqual(s.tocou.zoho, []);
    assert.ok(s.marcas.some(m => m.estado === 'falhou'));
  } finally { s.restaurar(); }
});

test('falha no criaPedido derruba a venda com ok:false e nao toca no Zoho', async () => {
  const s = stub({ opdv: { criaPedido: async () => { throw new Error('omie pedido fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, false);
    assert.equal(r.estado, 'falhou');
    assert.match(r.erro, /omie pedido fora/);
    assert.equal('pedidoOmie' in r, false);
    assert.deepEqual(s.tocou.zoho, []);
    assert.ok(s.marcas.some(m => m.estado === 'falhou'));
  } finally { s.restaurar(); }
});

// ===========================================================================
// VALIDAÇÃO DA NOTA (ValidarPedidoVenda) — avisa, NUNCA derruba a venda
// ===========================================================================
// Mudança de escopo (19/ago/2026): antes, um erro de validação (ou de
// faturamento) parava a venda. Agora não — o pedido nasceu, a venda
// aconteceu; a validação só avisa o operador (com o cliente ainda na
// frente) do que falta pra Eloize emitir a nota depois.

test('validacao com erro NAO derruba a venda — pedido existe, venda aconteceu, so vira aviso', async () => {
  // Texto EXATO medido contra a API real (pedido 5846036916, cliente sem
  // e-mail no cadastro).
  const DESC = 'Foram encontrados erros durante a validação dessa Pedido de Venda de Produto! '
    + 'Para emitir a NF-e falta preencher o E-mail.';
  const s = stub({ opdv: { validarPedido: async () => ({ ok: false, codStatus: '1', descStatus: DESC }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    // Mutação-alvo: se o código passar a tratar validacao.ok===false como
    // falha da venda (return {ok:false,...}), este assert quebra.
    assert.equal(r.ok, true, 'erro de validacao NUNCA pode derrubar a venda — o pedido ja existe no Omie');
    assert.equal(r.pedidoOmie, '5281');
    assert.equal(r.avisoNotaFiscal, DESC, 'a mensagem do Omie tem que chegar na tela EXATAMENTE como veio — sem reescrever/resumir');
    // e o resto do fluxo (Zoho) continua rodando normalmente
    assert.equal(r.dealId, 'D1');
  } finally { s.restaurar(); }
});

test('validacao com erro grava nf_pendente no livro-razao, com a mensagem do Omie no erro', async () => {
  const s = stub({ opdv: { validarPedido: async () => ({ ok: false, codStatus: '1', descStatus: 'falta email' }) } });
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.ok(s.marcas.some(m => m.estado === 'nf_pendente' && m.dados.erro === 'falta email'),
      'o livro-razao precisa registrar nf_pendente com a mensagem, pra quem for emitir a nota depois');
  } finally { s.restaurar(); }
});

test('validacao SEM erro nao grava nf_pendente nem devolve avisoNotaFiscal', async () => {
  const s = stub(); // default: validarPedido devolve ok:true
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.avisoNotaFiscal, null);
    assert.ok(!s.marcas.some(m => m.estado === 'nf_pendente'));
  } finally { s.restaurar(); }
});

test('falha na PROPRIA chamada de validacao (rede/Omie fora) tambem NAO derruba a venda — so fica sem aviso', async () => {
  const s = stub({ opdv: { validarPedido: async () => { throw new Error('omie ValidarPedidoVenda: Timeout na API'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    // Mutação-alvo: se a chamada de validarPedido saísse do try/catch
    // próprio (ficasse só no try grande do Omie), esta exceção derrubaria a
    // venda inteira como 'falhou' — errado, o pedido já nasceu.
    assert.equal(r.ok, true, 'falha ao VALIDAR nao pode derrubar uma venda cujo pedido ja existe');
    assert.equal(r.pedidoOmie, '5281');
    assert.equal(r.avisoNotaFiscal, null);
    assert.equal(r.dealId, 'D1');
  } finally { s.restaurar(); }
});

test('a validacao roda DEPOIS do criaPedido, com o codigo_pedido (nao numero_pedido)', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    const ordem = s.tocou.omie;
    assert.ok(ordem.indexOf('criaPedido') < ordem.indexOf('validarPedido'));
    assert.equal(s.chamado.validarPedido[1], 991);
  } finally { s.restaurar(); }
});

// === IDEMPOTÊNCIA ===
test('o idem mandado ao Omie e o id do livro-razao — duplo clique nao pode virar pedido duplicado', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ idem: 'pdv_t1' }), 'edson');
    assert.equal(s.chamado.criaPedido[1].idem, 'pdv_v1'); // id do livro-razão, estável entre cliques
  } finally { s.restaurar(); }
});

// === LIVRO-RAZÃO: os argumentos do abrir ===
// `idem` é metade da proteção contra duplo clique. Com o idem errado o razão
// nunca deduplica, o venda.id nasce novo a cada clique e o
// codigo_pedido_integracao mandado ao Omie muda junto — as DUAS camadas caem ao
// mesmo tempo. `total` e `operador` são dinheiro e atribuição gravados no razão.
test('o livro-razao e aberto com o idem da tela, o operador, a empresa e o total LIQUIDO', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ idem: 'idem-da-tela-42', desconto: 10, frete: 30, empresa: 'Mococa' }), 'edson');
    const a = s.chamado.abrirArgs;
    assert.equal(a.idem, 'idem-da-tela-42');   // exatamente o da tela — chave de dedup
    assert.equal(a.operador, 'edson');
    assert.equal(a.empresa, 'Mococa');
    assert.equal(a.total, 190);                // liquido: desconto abatido, frete fora
  } finally { s.restaurar(); }
});

test('o payload inteiro da tela vai pro livro-razao — e o que permite reconstruir a venda', async () => {
  const s = stub();
  try {
    const p = base({ idem: 'idem-x' });
    await bipdv.finalizarVenda(p, 'edson');
    assert.equal(s.chamado.abrirArgs.payload, p);
  } finally { s.restaurar(); }
});

// O contrato de finalizarVenda e SEMPRE {ok:false, erro} — nunca lancar. Com o
// abrir fora do try, idem ausente ou Postgres fora estourava como 500 na tela.
test('falha do livro-razao devolve ok:false com erro, nunca lanca', async () => {
  const s = stub({ ledger: { abrir: async () => { throw new Error('pdv-ledger: idem obrigatório'); } } });
  try {
    const r = await bipdv.finalizarVenda(base({ idem: '' }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /idem obrigat/i);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
    assert.deepEqual(s.auditorias, []);
  } finally { s.restaurar(); }
});

test('banco fora no livro-razao tambem devolve ok:false, sem tocar em Omie nem Zoho', async () => {
  const s = stub({ ledger: { abrir: async () => { throw new Error('connect ECONNREFUSED'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /ECONNREFUSED/);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('venda ja completa volta na hora, sem tocar em Omie nem em Zoho', async () => {
  const s = stub({ ledger: { abrir: async () => ({ id: 'pdv_v1', estado: 'completa', novo: false }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.estado, 'completa');
    assert.equal(r.repetida, true);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
    assert.deepEqual(s.auditorias, []);
  } finally { s.restaurar(); }
});

// === DEFEITO CRÍTICO (revisão Tarefa 6): reenvio do MESMO idem depois que a
// venda já chegou a 'completa' tinha que devolver o número do pedido pro
// operador. Sem ele, a tela (views/pdv.ejs) mandava esse retorno pro caminho
// de cupom — que quebra sem `cupom` — e o "erro de conexão" falso levava o
// operador a refazer uma venda que já tinha fechado de verdade.

test('venda repetida devolve pedidoOmie e dealId lidos do livro-razao (nao so repetida:true)', async () => {
  const s = stub({
    ledger: {
      abrir: async () => ({ id: 'pdv_v1', estado: 'completa', novo: false }),
      buscar: async (args) => {
        assert.equal(args.id, 'pdv_v1', 'buscar() tem que ser chamado pelo id da venda ja gravada');
        return { id: 'pdv_v1', estado: 'completa', omie_pedido: '5281', zoho_deal_id: 'D1' };
      },
    },
  });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.repetida, true);
    assert.equal(r.estado, 'completa');
    assert.equal(r.pedidoOmie, '5281');
    assert.equal(r.dealId, 'D1');
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
  } finally { s.restaurar(); }
});

test('venda repetida sem linha encontrada no livro-razao ainda devolve repetida:true, sem lancar', async () => {
  // A leitura extra é só enriquecimento — se ela falhar ou não achar nada, o
  // retorno idempotente básico (que a trava inteira existe pra garantir) não
  // pode desaparecer.
  const s = stub({
    ledger: {
      abrir: async () => ({ id: 'pdv_v1', estado: 'completa', novo: false }),
      buscar: async () => null,
    },
  });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.repetida, true);
    assert.equal(r.estado, 'completa');
    assert.equal(r.pedidoOmie, undefined);
  } finally { s.restaurar(); }
});

test('venda repetida com buscar() lancando erro ainda devolve repetida:true, sem lancar', async () => {
  const s = stub({
    ledger: {
      abrir: async () => ({ id: 'pdv_v1', estado: 'completa', novo: false }),
      buscar: async () => { throw new Error('ECONNREFUSED'); },
    },
  });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.repetida, true);
    assert.equal(r.estado, 'completa');
  } finally { s.restaurar(); }
});

// === ZOHO ===
test('venda boa grava Deal com os valores reais do CRM', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.estado, 'completa');
    assert.equal(r.pedidoOmie, '5281');
    assert.equal(s.chamado.deal.Stage, 'Fechado Ganho');
    assert.equal(s.chamado.deal.Lead_Source, 'Visita na loja');
    assert.equal(s.chamado.deal.Autor_Lead_Vendedor, 'edson');
    assert.equal(s.chamado.deal.Empresa_da_venda, 'Tudo de Filtro');
    assert.equal(s.chamado.deal.Pedido_Omie, '5281');
    assert.equal(s.chamado.deal.Amount, 200);          // frete de 30 fica FORA
    assert.ok(s.chamado.quote.Quoted_Items.length === 1);
  } finally { s.restaurar(); }
});

// === ORÇAMENTO — é dele que a fila de manutenção lê o que o cliente comprou ===
test('o Orcamento leva produto, codigo, quantidade e preco de cada item', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({
      itens: [{ id: 'zp-ref01', codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 3, valor: 200 },
              { id: 'zp-tor07', codigo: 'TOR07', nome: 'Torneira', ncm: '8481.80.11', qtd: 1, valor: 90 }],
    }), 'edson');
    const itens = s.chamado.quote.Quoted_Items;
    assert.equal(itens.length, 2);
    assert.deepEqual(itens[0], { Product_Name: { id: 'zp-ref01' }, Quantity: 3, List_Price: 200, Product_Code: 'REF01' });
    assert.deepEqual(itens[1], { Product_Name: { id: 'zp-tor07' }, Quantity: 1, List_Price: 90, Product_Code: 'TOR07' });
  } finally { s.restaurar(); }
});

// Lookup do Zoho por NOME depende de o texto bater caractere a caractere com o
// cadastro: com dado sujo ele não resolve, a linha nasce sem produto e a fila
// de troca de refil fica sem saber o que o cliente comprou. O id do produto no
// Zoho já vem no carrinho — ele TEM que viajar até o Orçamento.
test('o Orcamento aponta o produto pelo ID do Zoho — nenhuma linha usa lookup por nome', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({
      itens: [{ id: 'zp-ref01', codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 1, valor: 200 },
              { id: 'zp-tor07', codigo: 'TOR07', nome: 'Torneira', ncm: '8481.80.11', qtd: 2, valor: 90 }],
    }), 'edson');
    const itens = s.chamado.quote.Quoted_Items;
    assert.equal(itens.length, 2);
    for (const linha of itens) {
      assert.ok(linha.Product_Name, 'linha do Orcamento sem lookup de produto');
      assert.equal('name' in linha.Product_Name, false, 'lookup por NOME nao resolve com dado sujo');
      assert.ok(linha.Product_Name.id, 'o lookup tem que ser pelo id do produto no Zoho');
    }
    assert.equal(itens[0].Product_Name.id, 'zp-ref01');
    assert.equal(itens[1].Product_Name.id, 'zp-tor07');
  } finally { s.restaurar(); }
});

test('o Orcamento nasce vinculado ao Negocio criado — Orcamento orfao nao entra na fila de recompra', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.deepEqual(s.chamado.quote.Deal_Name, { id: 'D1' });
    assert.match(s.chamado.quote.Subject, /Fulano/);
  } finally { s.restaurar(); }
});

test('venda NAO vira completa com Orcamento nulo (Zoho respondeu sem id)', async () => {
  // O Zoho pode responder SUCCESS sem `details.id` — createQuote devolve
  // { id: undefined } sem lançar. Sem o Orçamento não existe registro do produto
  // vendido: a fila de manutenção não sabe o quê nem de quem. Não é "completa".
  const s = stub({ zoho: { createQuote: async () => ({ id: null }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.quoteId, null);
    assert.notEqual(r.estado, 'completa');
    assert.equal(r.estado, 'zoho_ok');
  } finally { s.restaurar(); }
});

test('falha do Zoho NAO derruba a venda — estado fica omie_ok (nota nao e mais responsabilidade do PDV)', async () => {
  const s = stub({ zoho: { createDeal: async () => { throw new Error('zoho fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.estado, 'omie_ok');
    assert.match(r.erro, /zoho fora/);
    // a venda foi criada de verdade no Omie mesmo com o Zoho fora
    assert.equal(r.pedidoOmie, '5281');
  } finally { s.restaurar(); }
});

test('falha do Zoho COM aviso de validacao pendente: o estado fica nf_pendente, nao omie_ok', async () => {
  // As duas coisas são independentes: o Zoho falhou (não confirmou o CRM) E
  // a validação do Omie tinha avisado de algo faltando pra nota. O estado
  // final tem que refletir o sinal mais específico (nf_pendente) — é ele que
  // diz pro reconciliador/pra Eloize que este pedido precisa de atenção.
  const s = stub({
    opdv: { validarPedido: async () => ({ ok: false, codStatus: '1', descStatus: 'falta email' }) },
    zoho: { createDeal: async () => { throw new Error('zoho fora'); } },
  });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.estado, 'nf_pendente');
    assert.equal(r.avisoNotaFiscal, 'falta email');
  } finally { s.restaurar(); }
});

test('nunca chama Focus NFe nem recebimento do BI', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.deepEqual(s.proibidas, []);
  } finally { s.restaurar(); }
});

test('bi-pdv.js nao importa Focus nem recebimentos no topo do arquivo', () => {
  const fonte = require('node:fs').readFileSync(require.resolve('../lib/bi-pdv.js'), 'utf8');
  // aceita com e sem o sufixo .js — require('./bi-focusnfe.js') e o mesmo modulo
  assert.doesNotMatch(fonte, /require\(\s*['"]\.\/bi-focusnfe(\.js)?['"]\s*\)/);
  assert.doesNotMatch(fonte, /require\(\s*['"]\.\/bi-recebimentos(\.js)?['"]\s*\)/);
});

// === CONFIRMAÇÃO POR LEITURA DE VOLTA ===
test('a releitura de confirmacao le o Deal criado, no modulo Deals, com os campos que a checagem usa', async () => {
  // Ler outro módulo daria 404 em produção, cairia no catch e a venda ficaria
  // eternamente pendente — sem nunca virar 'completa'.
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(s.chamado.getRecordArgs[0], 'Deals');
    assert.equal(s.chamado.getRecordArgs[1], 'D1');
    const campos = String(s.chamado.getRecordArgs[2]).split(',').map(x => x.trim());
    for (const c of ['Stage', 'Amount', 'Pedido_Omie']) {
      assert.ok(campos.includes(c), `campo ${c} faltando na releitura de confirmacao`);
    }
  } finally { s.restaurar(); }
});

test('confirmacao por leitura de volta: getRecord discordando NAO marca completa', async () => {
  // createDeal/createQuote "sucedem" (200), mas a releitura do CRM não bate —
  // a venda TEM que ficar num estado incompleto, nunca 'completa', porque a
  // confirmação é pela leitura, nunca pelo HTTP.
  const s = stub({ zoho: { getRecord: async (mod) => (mod === 'Quotes'
    ? { id: 'Q1', Quoted_Items: [{ Product_Name: { id: 'zp-ref01' } }] }
    : { id: 'D1', Stage: 'Em negociação', Amount: 200, Pedido_Omie: '5281' }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.notEqual(r.estado, 'completa');
  } finally { s.restaurar(); }
});

test('confirmacao por leitura de volta: Pedido_Omie discordando tambem NAO marca completa', async () => {
  const s = stub({ zoho: { getRecord: async (mod) => (mod === 'Quotes'
    ? { id: 'Q1', Quoted_Items: [{ Product_Name: { id: 'zp-ref01' } }] }
    : { id: 'D1', Stage: 'Fechado Ganho', Amount: 200, Pedido_Omie: '9999' }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.notEqual(r.estado, 'completa');
  } finally { s.restaurar(); }
});

// === AUDITORIA FINANCEIRA ===
test('a auditoria financeira registra a venda com estado, total liquido e numero do pedido', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ desconto: 10, frete: 30 }), 'edson');
    assert.equal(s.auditorias.length, 1);
    const ev = s.auditorias[0];
    assert.equal(ev.tipo, 'pdv-venda');
    assert.equal(ev.usuario, 'edson');
    assert.equal(ev.vendaId, 'pdv_v1');
    assert.equal(ev.empresa, 'Tudo de Filtro');
    assert.equal(ev.estado, 'completa');
    assert.equal(ev.total, 190);          // líquido: desconto abatido, frete fora
    assert.equal(ev.pedidoOmie, '5281');
    assert.equal(ev.dealId, 'D1');
    assert.equal(ev.quoteId, 'Q1');
  } finally { s.restaurar(); }
});

test('a auditoria registra o estado REAL quando o Zoho cai — nao inventa completa', async () => {
  const s = stub({ zoho: { createDeal: async () => { throw new Error('zoho fora'); } } });
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(s.auditorias.length, 1);
    assert.equal(s.auditorias[0].estado, 'omie_ok');
    assert.equal(s.auditorias[0].dealId, null);
    assert.equal(s.auditorias[0].pedidoOmie, '5281');
  } finally { s.restaurar(); }
});

// === MODO SOMBRA — a trava que impede nota fiscal duplicada durante o teste em paralelo ===
test('modo sombra: com a trava ligada, NENHUMA funcao do omie-pdv ou do zoho e chamada', async () => {
  const s = stub();
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  process.env.TDF_PDV_MODO_SOMBRA = '1';
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.estado, 'sombra');
    assert.equal(r.vendaId, 'pdv_v1');
    assert.equal('pedidoOmie' in r, false);
    assert.equal('nota' in r, false);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

test('modo sombra: NAO grava na auditoria financeira — venda sombra nao e receita', async () => {
  // Decisão declarada em lib/bi-pdv.js: o log de auditoria é o registro de vendas
  // que aconteceram de verdade. A venda sombra não emitiu nota nem movimentou
  // dinheiro; carimbá-la ali seria receita fantasma. O rastro fica no livro-razão.
  const s = stub();
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  process.env.TDF_PDV_MODO_SOMBRA = '1';
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.deepEqual(s.auditorias, []);
    assert.ok(s.marcas.some(m => m.estado === 'sombra'));
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

test('modo sombra: ainda recusa venda sem telefone (validacao roda antes da trava)', async () => {
  const s = stub();
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  process.env.TDF_PDV_MODO_SOMBRA = '1';
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '' }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /telefone/i);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

test('modo sombra: ainda recusa desconto acima de 10%', async () => {
  const s = stub();
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  process.env.TDF_PDV_MODO_SOMBRA = '1';
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /desconto/i);
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

test('modo sombra: grava no livro-razao o que faria (marcar chamado com estado sombra)', async () => {
  const s = stub();
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  process.env.TDF_PDV_MODO_SOMBRA = '1';
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.ok(s.marcas.some(m => m.estado === 'sombra'));
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

test('sem a trava (TDF_PDV_MODO_SOMBRA != 1), a venda chama Omie e Zoho normalmente', async () => {
  const s = stub();
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  delete process.env.TDF_PDV_MODO_SOMBRA;
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.notEqual(r.estado, 'sombra');
    assert.ok(s.tocou.omie.length > 0);
    assert.ok(s.tocou.zoho.length > 0);
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

// ===========================================================================
// FRONTEIRAS DE ENTRADA
// ===========================================================================
test('venda sem nenhum item e recusada antes de tudo', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ itens: [] }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /sem itens/i);
    assert.equal(s.chamado.abrirArgs, null);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
  } finally { s.restaurar(); }
});

test('itens ausente no payload (undefined) tambem e recusado, sem estourar', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ itens: undefined }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /sem itens/i);
  } finally { s.restaurar(); }
});

// Linha de quantidade zero é lixo de digitação da tela. Se ela passasse, iria
// pro Omie como item de qtd 0 e a nota sairia com linha fantasma.
test('item com quantidade zero e descartado — nao vai pro Omie nem entra no bruto', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({
      itens: [{ codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 1, valor: 200 },
              { codigo: 'LIXO', nome: 'Linha vazia', ncm: '0000.00.00', qtd: 0, valor: 500 }],
    }), 'edson');
    const enviados = s.chamado.criaPedido[1].itens;
    assert.equal(enviados.length, 1);
    assert.equal(enviados[0].codigo, 'REF01');
    assert.equal(s.chamado.deal.Amount, 200);  // os 500 da linha zerada NAO entram
  } finally { s.restaurar(); }
});

test('item com quantidade negativa tambem e descartado', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({
      itens: [{ codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 1, valor: 200 },
              { codigo: 'DEV', nome: 'Devolucao', ncm: '0000.00.00', qtd: -1, valor: 100 }],
    }), 'edson');
    assert.equal(s.chamado.criaPedido[1].itens.length, 1);
    assert.equal(s.chamado.deal.Amount, 200);
  } finally { s.restaurar(); }
});

test('venda so com linhas de quantidade zero vira "sem itens"', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ codigo: 'LIXO', nome: 'Linha vazia', ncm: '0000.00.00', qtd: 0, valor: 500 }],
    }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /sem itens/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

// 9 dígitos = celular SEM DDD. Aceitar isso poria '55' + 9 dígitos no CRM: um
// número que não existe, e o cliente some do relógio de troca de refil.
test('telefone de 9 digitos (celular sem DDD) e recusado', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '999998888' }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /telefone/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('telefone de 14 digitos (longo demais) e recusado', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '55129999988887' }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /telefone/i);
  } finally { s.restaurar(); }
});

// ===========================================================================
// CAMPOS DO NEGÓCIO — os que a operação lê depois
// ===========================================================================
test('o Negocio nasce com a data de hoje em Closing_Date — sem ela a venda some do relatorio do mes', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(s.chamado.deal.Closing_Date, new Date().toISOString().slice(0, 10));
    assert.match(s.chamado.deal.Closing_Date, /^\d{4}-\d{2}-\d{2}$/);
  } finally { s.restaurar(); }
});

test('o Negocio e carimbado como ja enviado ao Omie — senao a integracao tenta manda-lo de novo', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(s.chamado.deal.Foi_enviado_para_o_Omie, 'Sim');
  } finally { s.restaurar(); }
});

test('o Negocio nasce no layout da Loja — layout errado esconde os campos do balcao no CRM', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.deepEqual(s.chamado.deal.Layout, { id: '6311862000101582231' });
  } finally { s.restaurar(); }
});

test('a cidade da tela vai pro Negocio (roteirizacao da instalacao/manutencao le dali)', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ cidade: 'Bebedouro' }), 'edson');
    assert.equal(s.chamado.deal.Cidade, 'Bebedouro');
  } finally { s.restaurar(); }
});

// Cliente JÁ ENCONTRADO na busca (clienteZohoId presente): endereço não é
// obrigatório (regra 1 do dono, ver seção "ENDEREÇO OBRIGATÓRIO" abaixo) —
// por isso este teste, que verifica que Cidade ausente vira '' e não
// "undefined" no Negócio, precisa simular um cliente já achado; sem isso a
// venda seria recusada por falta de endereço antes de chegar no Negócio.
// Desde 01/set o endereço do Negócio é montado por `montaEnderecoDeal`, que
// OMITE a chave quando o valor está vazio, em vez de mandar ''. O motivo do
// teste original continua valendo e é o que se verifica aqui: nunca pode viajar
// a string "undefined". Omitir é ainda mais seguro que '' — numa venda futura
// que só atualize o card, '' APAGARIA o endereço que já estava lá.
test('sem cidade na tela o campo não viaja — nunca vai a string "undefined"', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({
      clienteZohoId: 'C-EXISTENTE', clienteZohoModulo: 'Contacts',
      cidade: undefined, endereco: undefined, numero: undefined, bairro: undefined, uf: undefined, cep: undefined,
    }), 'edson');
    const d = s.chamado.deal;
    for (const c of ['Cidade', 'Endere_o', 'Bairro', 'Estado', 'CEP', 'N_mero']) {
      assert.notStrictEqual(d[c], 'undefined', `${c} viajou como a string "undefined"`);
      assert.notStrictEqual(d[c], undefined === d[c] ? 'x' : 'undefined');
    }
    assert.equal('Cidade' in d, false, 'cidade vazia não deve ocupar o campo');
  } finally { s.restaurar(); }
});

// Canal_Normalizado e Origem_Normalizada NÃO existem no módulo Negócios desta
// org (conferido nos metadados do CRM) — gravar neles faz o createDeal voltar
// INVALID_DATA, cai no catch, e a venda inteira some do CRM (mesma armadilha
// do campo `CPF`). A resposta do "como conheceu a gente" não pode se perder,
// então vai pro Description, que EXISTE, num rótulo fixo e buscável.
test('a origem da tela NUNCA vai em Canal_Normalizado/Origem_Normalizada (campos inexistentes) — vai no Description', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ origem: 'Indicação de amigo ou parente' }), 'edson');
    assert.equal('Canal_Normalizado' in s.chamado.deal, false);
    assert.equal('Origem_Normalizada' in s.chamado.deal, false);
    assert.equal(s.chamado.deal.Description, 'Origem PDV: Indicação de amigo ou parente | Canal: Indicação');
  } finally { s.restaurar(); }
});

test('cada origem do balcao mapeia para o canal certo no Description — mapa errado falseia a atribuicao', async () => {
  const esperado = {
    'Já é cliente / veio trocar refil': 'Base/CRM',
    'Indicação de amigo ou parente': 'Indicação',
    'Passou em frente / viu a loja': 'Direto',
    'Pesquisou no Google': 'Orgânico',
    'Viu no Instagram ou Facebook': 'Orgânico',
    'Recebeu mensagem nossa no WhatsApp': 'Base/CRM',
    'Viu placa, carro ou adesivo': 'Direto',
  };
  for (const [origem, canal] of Object.entries(esperado)) {
    const s = stub();
    try {
      await bipdv.finalizarVenda(base({ origem }), 'edson');
      assert.equal('Canal_Normalizado' in s.chamado.deal, false);
      assert.equal('Origem_Normalizada' in s.chamado.deal, false);
      assert.equal(s.chamado.deal.Description, `Origem PDV: ${origem} | Canal: ${canal}`,
        `origem "${origem}" deveria virar canal "${canal}" no Description`);
    } finally { s.restaurar(); }
  }
});

test('origem desconhecida nao inventa canal — Description marca "Nao mapeado"', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ origem: 'Caiu de paraquedas' }), 'edson');
    assert.equal('Canal_Normalizado' in s.chamado.deal, false);
    assert.equal('Origem_Normalizada' in s.chamado.deal, false);
    assert.equal(s.chamado.deal.Description, 'Origem PDV: Caiu de paraquedas | Canal: Não mapeado');
  } finally { s.restaurar(); }
});

test('sem origem nenhuma, nada de origem/canal e mandado ao CRM (nem campo inexistente, nem Description)', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ origem: '' }), 'edson');
    assert.equal('Canal_Normalizado' in s.chamado.deal, false);
    assert.equal('Origem_Normalizada' in s.chamado.deal, false);
    assert.equal('Description' in s.chamado.deal, false);
  } finally { s.restaurar(); }
});

// ===========================================================================
// AUTORIZAÇÃO DE DESCONTO — o dono quer poder auditar quem anda liberando
// desconto. Registrada em TRÊS lugares: livro-razão, auditoria financeira
// (pagamentos.audit) e uma linha no Description do Negócio, mesmo padrão da
// linha de origem. NUNCA a senha — só quem autorizou, o percentual e o
// valor.
// ===========================================================================

test('venda com desconto autorizado grava a linha "Desconto autorizado por" no Description, junto da origem', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    // bruto 200, desconto 50 (25%) — acima do teto, autorizado
    await bipdv.finalizarVenda(base({ desconto: 50, origem: 'Indicação de amigo ou parente' }), 'edson', autorizacaoDesconto);
    assert.equal(s.chamado.deal.Description,
      'Origem PDV: Indicação de amigo ou parente | Canal: Indicação\n'
      + 'Desconto autorizado por: Paulo (paulo) | 25% | R$ 50.00');
  } finally { s.restaurar(); }
});

test('venda com desconto autorizado e SEM origem grava só a linha de desconto no Description', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    await bipdv.finalizarVenda(base({ desconto: 50, origem: '' }), 'edson', autorizacaoDesconto);
    assert.equal(s.chamado.deal.Description, 'Desconto autorizado por: Paulo (paulo) | 25% | R$ 50.00');
  } finally { s.restaurar(); }
});

// MUTAÇÃO: gravar a linha de desconto SEMPRE (mesmo sem autorização) faz
// este teste quebrar — a linha só pode existir quando a autorização foi de
// fato usada.
test('venda com desconto DENTRO do teto (sem usar autorizacao) NAO grava linha de desconto no Description', async () => {
  const s = stub();
  try {
    // bruto 200, desconto 10 (5%, dentro do teto) — autorizacaoDesconto nem é passada
    await bipdv.finalizarVenda(base({ desconto: 10, origem: '' }), 'edson');
    assert.equal('Description' in s.chamado.deal, false);
  } finally { s.restaurar(); }
});

test('registro de autorizacao no livro-razao: abrir() recebe quem autorizou, o percentual e o valor', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson', autorizacaoDesconto);
    const a = s.chamado.abrirArgs;
    assert.equal(a.descontoAutorizadoPor, 'paulo');
    assert.equal(a.descontoPct, 25);
    assert.equal(a.descontoValor, 50);
  } finally { s.restaurar(); }
});

// MUTAÇÃO: parar de passar os 3 campos (ou passá-los sempre como null) pro
// abrir() faz este teste — e o de cima — quebrarem.
test('venda SEM autorizacao (dentro do teto) grava os 3 campos de autorizacao como null no abrir()', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ desconto: 10 }), 'edson'); // 5%, dentro do teto
    const a = s.chamado.abrirArgs;
    assert.equal(a.descontoAutorizadoPor, null);
    assert.equal(a.descontoPct, null);
    assert.equal(a.descontoValor, null);
  } finally { s.restaurar(); }
});

test('registro de autorizacao na auditoria financeira (pagamentos.audit): mesmos 3 campos', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson', autorizacaoDesconto);
    const ev = s.auditorias[0];
    assert.equal(ev.descontoAutorizadoPor, 'paulo');
    assert.equal(ev.descontoPct, 25);
    assert.equal(ev.descontoValor, 50);
  } finally { s.restaurar(); }
});

// MUTAÇÃO: incluir os campos de autorização sempre (mesmo undefined) faz
// este teste quebrar — a chave não pode nem existir quando não houve
// autorização, senão uma venda normal pareceria "revisada" na auditoria.
test('venda SEM autorizacao NAO inclui as chaves de autorizacao na auditoria financeira', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ desconto: 10 }), 'edson'); // 5%, dentro do teto
    const ev = s.auditorias[0];
    assert.equal('descontoAutorizadoPor' in ev, false);
    assert.equal('descontoPct' in ev, false);
    assert.equal('descontoValor' in ev, false);
  } finally { s.restaurar(); }
});

// === A SENHA NUNCA PODE SER GRAVADA ===
// O livro-razão grava o `payload` INTEIRO numa coluna JSONB. Se a senha
// viajar dentro de `payload.autorizacao.senha` até aqui (defesa contra um bug
// em server.js que esqueça de tirar), finalizarVenda tem que arrancá-la ANTES
// de chamar ledger.abrir — nunca deixar a credencial chegar no que é
// persistido. A prova é sobre a CARGA enviada ao dublê de abrir(), não sobre
// o que o dublê devolve.
test('a SENHA do autorizador NUNCA aparece no payload gravado no livro-razao, mesmo vindo dentro do payload', async () => {
  const s = stub();
  const autorizacaoDesconto = { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' };
  try {
    const payload = base({
      desconto: 50,
      autorizacao: { usuario: 'paulo', senha: 'SENHA-SECRETA-999' },
    });
    await bipdv.finalizarVenda(payload, 'edson', autorizacaoDesconto);
    const gravado = s.chamado.abrirArgs.payload;
    assert.ok(gravado, 'esperava um payload gravado no livro-razao');
    const serializado = JSON.stringify(gravado);
    assert.doesNotMatch(serializado, /SENHA-SECRETA-999/, 'a senha do autorizador vazou pro que e persistido');
    // quem autorizou (usuario) pode sobreviver — só a senha é proibida
    assert.equal(gravado.autorizacao.usuario, 'paulo');
    assert.equal('senha' in gravado.autorizacao, false);
  } finally { s.restaurar(); }
});

test('payload sem campo autorizacao continua indo pro livro-razao pela MESMA referencia (nao regride o teste de reconstrucao da venda)', async () => {
  const s = stub();
  try {
    const p = base({ idem: 'sem-autorizacao-x' });
    await bipdv.finalizarVenda(p, 'edson');
    assert.equal(s.chamado.abrirArgs.payload, p, 'sem autorizacao.senha no payload original, a referencia tem que ser preservada');
  } finally { s.restaurar(); }
});

// Cliente escolhido na busca do PDV: o Negócio TEM que amarrar no contato que já
// existe, senão a venda não aparece na ficha dele e a fila de recompra duplica.
test('cliente vindo da busca do CRM amarra o Negocio no contato existente', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ clienteZohoId: '631186200099', clienteZohoModulo: 'Contacts' }), 'edson');
    assert.deepEqual(s.chamado.deal.Contact_Name, { id: '631186200099' });
    // resultado que JÁ é Contato se reusa direto: nada de buscar nem criar
    assert.equal(s.chamado.contato, null, 'contato existente nao pode virar duplicado');
    assert.equal(s.chamado.buscaTelefone, null);
  } finally { s.restaurar(); }
});

test('sem cliente do CRM o Negocio amarra no Contato NOVO, criado na hora', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.deepEqual(s.chamado.deal.Contact_Name, { id: 'C1' });
    assert.ok(s.chamado.contato, 'venda de balcao sem cadastro TEM que criar o Contato');
  } finally { s.restaurar(); }
});

test('o nome do cliente da tela nomeia o Negocio; sem nome, vira Consumidor Final', async () => {
  let s = stub();
  try {
    await bipdv.finalizarVenda(base({ clienteNome: 'Fulano' }), 'edson');
    assert.equal(s.chamado.deal.Deal_Name, 'Balcão — Fulano');
  } finally { s.restaurar(); }
  // Sem nome a venda agora é recusada (17/09) — o caminho de "Consumidor Final"
  // exige a marcação explícita do operador.
  s = stub();
  try {
    await bipdv.finalizarVenda(base({ clienteNome: '', semIdentificar: true }), 'edson');
    assert.equal(s.chamado.deal.Deal_Name, 'Balcão — Consumidor Final');
    assert.equal(s.chamado.quote.Subject, 'Balcão — Consumidor Final');
  } finally { s.restaurar(); }
});

// ===========================================================================
// ESTADO GRAVADO NO LIVRO-RAZÃO — é a linha que o reconciliador lê, não o retorno
// ===========================================================================
test('falha do Omie grava falhou no razao — nao basta devolver falhou pra tela', async () => {
  const s = stub({ opdv: { criaPedido: async () => { throw new Error('omie pedido fora'); } } });
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(s.estadoNoRazao(), 'falhou');
    assert.equal(s.marcas[s.marcas.length - 1].dados.erro, 'omie pedido fora');
    assert.ok(!s.marcas.some(m => m.estado === 'completa'));
  } finally { s.restaurar(); }
});

test('falha do Zoho NAO grava completa no razao — o reconciliador tem que ver a venda pendente', async () => {
  const s = stub({ zoho: { createDeal: async () => { throw new Error('zoho fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.estado, 'omie_ok');
    assert.equal(s.estadoNoRazao(), 'omie_ok');
    assert.ok(!s.marcas.some(m => m.estado === 'completa'),
      'marcar completa no catch do Zoho deixaria a venda fora da fila de reconciliacao');
    assert.equal(s.marcas[s.marcas.length - 1].dados.erro, 'zoho fora');
  } finally { s.restaurar(); }
});

test('Negocio criado grava zoho_ok com o id do Negocio ANTES do Orcamento — sem isso o Negocio fica orfao no razao', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    const zk = s.marcas.find(m => m.estado === 'zoho_ok');
    assert.ok(zk, 'o razao precisa registrar zoho_ok assim que o Negocio nasce');
    assert.equal(zk.dados.zoho_deal_id, 'D1');
    // e essa marca vem ANTES da confirmacao final
    assert.ok(s.marcas.indexOf(zk) < s.marcas.length - 1);
    assert.equal(s.estadoNoRazao(), 'completa');
    assert.equal(s.marcas[s.marcas.length - 1].dados.zoho_quote_id, 'Q1');
  } finally { s.restaurar(); }
});

test('Orcamento falhando: o razao guarda o id do Negocio ja criado e NAO vira completa', async () => {
  const s = stub({ zoho: { createQuote: async () => { throw new Error('quote fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.dealId, 'D1');
    assert.ok(s.marcas.some(m => m.estado === 'zoho_ok' && m.dados.zoho_deal_id === 'D1'));
    assert.ok(!s.marcas.some(m => m.estado === 'completa'));
    assert.equal(s.marcas[s.marcas.length - 1].dados.erro, 'quote fora');
  } finally { s.restaurar(); }
});

test('releitura falhando: o razao guarda o Negocio e a venda fica pendente, nunca completa', async () => {
  const s = stub({ zoho: { getRecord: async () => { throw new Error('crm fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.match(r.erro, /crm fora/);
    assert.ok(!s.marcas.some(m => m.estado === 'completa'));
    assert.ok(s.marcas.some(m => m.estado === 'zoho_ok' && m.dados.zoho_deal_id === 'D1'));
  } finally { s.restaurar(); }
});

test('o livro-razao e sempre marcado no id devolvido pelo abrir, nunca no idem da tela', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ idem: 'idem-da-tela' }), 'edson');
    assert.ok(s.marcas.length > 0);
    for (const m of s.marcas) assert.equal(m.id, 'pdv_v1');
  } finally { s.restaurar(); }
});

// ===========================================================================
// CONFIRMAÇÃO POR LEITURA DE VOLTA — o Amount relido também é conferido
// ===========================================================================
test('Amount relido divergindo do liquido NAO marca completa — CRM e ERP nao podem divergir em silencio', async () => {
  // O Negócio foi gravado com 200, mas o CRM devolve 250 (workflow zumbi, campo
  // sobrescrito). Pedir o Amount na releitura e não conferi-lo deixaria a
  // divergência passar batido.
  const s = stub({ zoho: { getRecord: async (mod) => (mod === 'Quotes'
    ? { id: 'Q1', Quoted_Items: [{ Product_Name: { id: 'zp-ref01' } }] }
    : { id: 'D1', Stage: 'Fechado Ganho', Amount: 250, Pedido_Omie: '5281' }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.notEqual(r.estado, 'completa');
    assert.equal(r.estado, 'zoho_ok');
  } finally { s.restaurar(); }
});

test('Amount ausente na releitura NAO marca completa', async () => {
  const s = stub({ zoho: { getRecord: async (mod) => (mod === 'Quotes'
    ? { id: 'Q1', Quoted_Items: [{ Product_Name: { id: 'zp-ref01' } }] }
    : { id: 'D1', Stage: 'Fechado Ganho', Amount: null, Pedido_Omie: '5281' }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.notEqual(r.estado, 'completa');
  } finally { s.restaurar(); }
});

test('Amount relido como string do CRM ("190.00") bate com o liquido e a venda fecha', async () => {
  const s = stub({ zoho: { getRecord: async (mod, id) => (mod === 'Quotes'
    ? { id: 'Q1', Quoted_Items: [{ Product_Name: { id: 'zp-ref01' } }] }
    : { id: 'D1', Stage: 'Fechado Ganho', Amount: '190.00', Pedido_Omie: '5281' }) } });
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: 10 }), 'edson');
    assert.equal(r.estado, 'completa');
  } finally { s.restaurar(); }
});

// ===========================================================================
// ORDEM DAS GUARDAS: venda completa × modo sombra
// ===========================================================================
test('modo sombra NAO remarca uma venda ja completa — sombra nao pode apagar o rastro de venda real', async () => {
  // Uma linha 'completa' só nasce fora do modo sombra: é venda real, com nota
  // emitida e Negócio confirmado por releitura. Se a trava de sombra rodasse
  // antes do retorno antecipado, um reclique com a trava ligada remarcaria essa
  // linha como 'sombra' e o rastro da venda real sumiria do livro-razão.
  const s = stub({ ledger: { abrir: async () => ({ id: 'pdv_v1', estado: 'completa', novo: false }) } });
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  process.env.TDF_PDV_MODO_SOMBRA = '1';
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.estado, 'completa');
    assert.equal(r.repetida, true);
    assert.deepEqual(s.marcas, [], 'venda completa nao pode ser remarcada — nem como sombra');
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
    assert.deepEqual(s.auditorias, []);
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

test('modo sombra ainda marca sombra numa venda NOVA (o retorno antecipado nao engoliu a trava)', async () => {
  const s = stub();
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  process.env.TDF_PDV_MODO_SOMBRA = '1';
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.estado, 'sombra');
    assert.equal(s.estadoNoRazao(), 'sombra');
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

test('venda repetida ainda incompleta (nao completa) segue o fluxo normal, mesmo fora da sombra', async () => {
  // Retomada de venda que parou no meio: tem que continuar, nao voltar seco.
  const s = stub({ ledger: { abrir: async () => ({ id: 'pdv_v1', estado: 'omie_ok', novo: false }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.repetida, undefined);
    assert.ok(s.tocou.omie.length > 0);
  } finally { s.restaurar(); }
});

// ===========================================================================
// QUEM É O CLIENTE NO CRM — o id sozinho é ambíguo, o módulo viaja junto
//
// buscarContato devolve resultado de QUATRO módulos (Contatos, Empresas, Leads
// e Negócios) e a tela pinta um badge por tipo. `Contact_Name` é lookup do
// módulo CONTATOS: id de Empresa, de Lead ou de Negócio ali faz o createDeal
// estourar, cair no catch do Zoho, e a venda ficar SEM Negócio e SEM Orçamento
// — sai no Omie e some do CRM. Três dos quatro tipos davam nisso.
// ===========================================================================
test('resultado do tipo EMPRESA nao vai pro Contact_Name — vai pro Account_Name, que e o lookup dele', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ clienteZohoId: 'ACC-9', clienteZohoModulo: 'Accounts' }), 'edson');
    assert.equal(r.ok, true);
    assert.deepEqual(s.chamado.deal.Account_Name, { id: 'ACC-9' });
    assert.notEqual(s.chamado.deal.Contact_Name.id, 'ACC-9', 'id de Empresa em lookup de Contato estoura o createDeal');
    // a PESSOA é resolvida à parte, e nasce amarrada na empresa escolhida
    assert.deepEqual(s.chamado.deal.Contact_Name, { id: 'C1' });
    assert.deepEqual(s.chamado.contato.Account_Name, { id: 'ACC-9' });
  } finally { s.restaurar(); }
});

test('resultado do tipo LEAD nao vira Contact_Name — e tratado como cliente novo', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ clienteZohoId: 'LEAD-9', clienteZohoModulo: 'Leads' }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.estado, 'completa');
    assert.deepEqual(s.chamado.deal.Contact_Name, { id: 'C1' });
    assert.equal('Account_Name' in s.chamado.deal, false, 'id de Lead nao tem lookup nenhum no Negocio');
    assert.equal(JSON.stringify(s.chamado.deal).includes('LEAD-9'), false, 'o id do Lead nao pode ir pro Negocio');
  } finally { s.restaurar(); }
});

test('resultado do tipo NEGOCIO nao vira Contact_Name — e tratado como cliente novo', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ clienteZohoId: 'DEAL-9', clienteZohoModulo: 'Deals' }), 'edson');
    assert.equal(r.ok, true);
    assert.deepEqual(s.chamado.deal.Contact_Name, { id: 'C1' });
    assert.equal(JSON.stringify(s.chamado.deal).includes('DEAL-9'), false, 'id de Negocio nao tem lookup no Negocio novo');
  } finally { s.restaurar(); }
});

test('id sem modulo (grafia antiga do payload) NAO e usado como Contato — resolve pelo telefone', async () => {
  // Defesa contra o descasamento que existia: a tela mandava só o id, e o
  // servidor assumia que era de Contato. Sem o módulo, o id não é confiável.
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ clienteZohoId: 'SEI-LA-9' }), 'edson');
    assert.deepEqual(s.chamado.deal.Contact_Name, { id: 'C1' });
    assert.equal(JSON.stringify(s.chamado.deal).includes('SEI-LA-9'), false);
  } finally { s.restaurar(); }
});

// ===========================================================================
// CONTATO — o registro que faltava: sem ele o cliente do balcão não existe
// como PESSOA no CRM e nunca entra no relógio de troca de refil
// ===========================================================================
test('contato ja existente com o mesmo telefone e REUSADO, nunca duplicado', async () => {
  const s = stub({ zoho: { searchModulePhone: async () => [{ id: 'C-EXISTE', Last_Name: 'Fulano' }] } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.deepEqual(s.chamado.deal.Contact_Name, { id: 'C-EXISTE' });
    assert.equal(r.contatoId, 'C-EXISTE');
    assert.equal(s.chamado.contato, null, 'achou pelo telefone: criar de novo duplicaria a pessoa no CRM');
  } finally { s.restaurar(); }
});

test('a busca do contato e no modulo Contacts e pelo telefone NORMALIZADO em E.164', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ telefone: '(12) 99999-8888' }), 'edson');
    assert.equal(s.chamado.buscaTelefone[0], 'Contacts');
    assert.equal(s.chamado.buscaTelefone[1], '5512999998888');
    assert.notEqual(s.chamado.buscaTelefone[1], '(12) 99999-8888');
  } finally { s.restaurar(); }
});

test('cliente novo: o Contato nasce com nome, telefone, documento e endereco', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      clienteNome: 'Ana Maria Souza', telefone: '(12) 99999-8888', cpf: '123.456.789-09',
      email: 'ana@exemplo.com', endereco: 'Rua das Flores', numero: '120', bairro: 'Centro',
      cidade: 'Bebedouro', uf: 'SP', cep: '14700-000',
    }), 'edson');
    assert.equal(r.ok, true);
    const c = s.chamado.contato;
    assert.ok(c, 'sem createContact o cliente do balcao nunca vira pessoa no CRM');
    assert.equal(c.First_Name, 'Ana');
    assert.equal(c.Last_Name, 'Maria Souza');
    assert.equal(c.Phone, '5512999998888');
    assert.equal(c.Mobile, '5512999998888');
    assert.equal(c.CNPJ_CPF, '12345678909');        // campo de TEXTO, só dígitos
    assert.equal('CPF' in c, false, 'CPF não existe no módulo Contatos desta org');
    assert.equal('CPF_CNPJ' in c, false, 'CPF_CNPJ é bigint — perde o zero à esquerda');
    assert.equal(c.Email, 'ana@exemplo.com');
    // Bairro saiu de dentro da rua e ganhou campo próprio (01/set): concatenado
    // ele não servia pra roteirizar entrega. Número segue na rua — Contatos não
    // tem campo de número.
    assert.equal(c.Mailing_Street, 'Rua das Flores, 120');
    assert.equal(c.Bairro, 'Centro');
    assert.equal(c.Mailing_City, 'Bebedouro');
    assert.equal(c.Mailing_State, 'SP');
    assert.equal(c.Mailing_Zip, '14700-000');
    assert.equal(c.Lead_Source, 'Visita na loja');
  } finally { s.restaurar(); }
});

// CPF é opcional na tela do balcão — cliente sem documento tem que fechar a
// venda igual. O que NÃO pode acontecer é o campo ir vazio ou undefined pro
// Zoho e sujar o registro: ausência de documento é AUSÊNCIA da chave.
test('cliente sem CPF nem CNPJ: a venda fecha normal e o Contato nasce sem CNPJ_CPF', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ cpf: undefined, cnpj: undefined }), 'edson');
    assert.equal(r.ok, true);
    const c = s.chamado.contato;
    assert.ok(c, 'sem documento a venda ainda cria o Contato');
    assert.equal('CNPJ_CPF' in c, false, 'sem documento a chave nao pode ir vazia/undefined pro Zoho');
    assert.equal('CPF' in c, false);
    assert.equal('CPF_CNPJ' in c, false);
  } finally { s.restaurar(); }
});

test('nome de uma palavra vai inteiro pro Last_Name — sobrenome vazio e o que gera o Last_Name "." da base', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ clienteNome: 'Fulano' }), 'edson');
    assert.equal(s.chamado.contato.Last_Name, 'Fulano');
    assert.equal('First_Name' in s.chamado.contato, false);
  } finally { s.restaurar(); }
});

// Desde 17/09 o nome é OBRIGATÓRIO: sem ele a ficha do Omie nasce
// "Consumidor Final" e a NOTA FISCAL sai nesse nome — e a busca por telefone
// reusa a ficha, então o cliente fica genérico pra sempre.
test('venda sem nome é RECUSADA — o rótulo não entra sozinho', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ clienteNome: '' }), 'edson');
    assert.equal(r.ok, false);
    assert.equal(r.etapa, 'validacao-cliente');
    assert.match(r.erro, /nome/i);
    assert.equal(s.chamado.contato, null, 'nao pode ter criado contato');
    assert.equal(s.chamado.pedido, null, 'nao pode ter subido pedido no Omie');
  } finally { s.restaurar(); }
});

// A saída explícita: o operador MARCA que não vai identificar, em vez de o
// rótulo entrar sozinho porque o campo ficou em branco.
test('marcando "sem identificar", a venda passa e o Contato nasce Consumidor Final', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ clienteNome: '', semIdentificar: true }), 'edson');
    assert.equal(s.chamado.contato.Last_Name, 'Consumidor Final');
    assert.equal('First_Name' in s.chamado.contato, false,
      'nao pode criar uma pessoa de sobrenome "Final"');
  } finally { s.restaurar(); }
});

test('o Negocio e o Orcamento apontam para o MESMO contato', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.deepEqual(s.chamado.deal.Contact_Name, { id: 'C1' });
    assert.deepEqual(s.chamado.quote.Contact_Name, { id: 'C1' });
    assert.equal(r.contatoId, 'C1');
  } finally { s.restaurar(); }
});

test('falha ao criar o Contato NAO derruba a venda nem o Negocio — mas impede completa', async () => {
  const s = stub({ zoho: { createContact: async () => { throw new Error('contato fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);                       // o cliente ja foi embora com a nota
    assert.equal(r.dealId, 'D1');                   // o Negocio nasce mesmo assim
    assert.equal('Contact_Name' in s.chamado.deal, false, 'lookup vazio quebraria a criacao do Negocio');
    assert.notEqual(r.estado, 'completa');
    assert.equal(s.estadoNoRazao(), 'zoho_ok');
    assert.match(r.erro, /contato/i);
  } finally { s.restaurar(); }
});

test('falha na busca de contato por telefone tambem nao derruba a venda', async () => {
  const s = stub({ zoho: { searchModulePhone: async () => { throw new Error('busca fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.dealId, 'D1');
    assert.notEqual(r.estado, 'completa');
  } finally { s.restaurar(); }
});

test('lib/zoho exporta createContact — sem ela o fluxo do PDV nao tem como criar a pessoa', () => {
  assert.equal(typeof require('../lib/zoho').createContact, 'function');
});

// ===========================================================================
// ITEM SEM CÓDIGO — a rota que já mandou NCM de móvel de madeira em pedido real
// ===========================================================================
test('item sem codigo e recusado NO SERVIDOR, antes de qualquer chamada externa', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ id: 'manual_1', codigo: '', nome: 'Filtro avulso', qtd: 1, valor: 150 }],
    }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /c[óo]digo/i);
    assert.deepEqual(s.tocou.omie, [], 'sem codigo o item iria pro Omie sem NCM');
    assert.deepEqual(s.tocou.zoho, []);
    assert.equal(s.chamado.abrirArgs, null, 'nem o livro-razao pode receber a venda invalida');
  } finally { s.restaurar(); }
});

test('codigo so com espacos tambem e recusado — string em branco nao e codigo', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ id: 'x', codigo: '   ', nome: 'Filtro avulso', qtd: 1, valor: 150 }],
    }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /c[óo]digo/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('codigo ausente (undefined) e recusado — nao pode virar string "undefined" no Omie', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ id: 'x', nome: 'Filtro avulso', qtd: 1, valor: 150 }],
    }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /c[óo]digo/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('basta UM item sem codigo pra recusar a venda inteira, e a mensagem diz qual', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ id: 'zp-ref01', codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 1, valor: 200 },
              { id: 'manual_2', codigo: '', nome: 'Cotovelo avulso', qtd: 1, valor: 12 }],
    }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /Cotovelo avulso/);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('a tela nao tem mais o atalho de item manual (era ele que produzia item sem codigo)', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.doesNotMatch(tela, /adicionarManual/);
});

test('a tela manda o MODULO do cliente junto com o id', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.match(tela, /clienteZohoModulo/);
});

// A senha do supervisor não pode sobreviver no campo da tela além do
// instante em que é lida pro payload — antes da correção, ficava lá até o
// operador clicar "Nova venda" (fecharCupom), inclusive atrás do modal do
// cupom numa venda bem-sucedida. MUTAÇÃO: remover a linha que zera
// pdvAutorSenha logo após montar payload.autorizacao faz este teste quebrar.
test('a senha do supervisor e limpa da tela assim que entra no payload — nao pode sobreviver ate fecharCupom', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const inicioAutorizacao = tela.indexOf("getElementById('pdvAutorizacaoBox').style.display !== 'none'");
  const inicioFetch = tela.indexOf(`fetch('/pdv/api/finalizar-venda'`);
  assert.ok(inicioAutorizacao > -1, 'esperava achar o bloco que monta payload.autorizacao');
  assert.ok(inicioFetch > inicioAutorizacao, 'esperava o fetch depois do bloco de autorizacao');
  const trecho = tela.slice(inicioAutorizacao, inicioFetch);
  // Aceita tanto `getElementById('pdvAutorSenha').value = ''` direto quanto
  // uma variável apontando pro mesmo elemento (`senhaEl.value = ''`) — o que
  // importa é que o CAMPO seja zerado neste trecho, antes do fetch.
  assert.match(trecho, /getElementById\('pdvAutorSenha'\)/, 'esperava o campo pdvAutorSenha referenciado neste trecho');
  assert.match(trecho, /\.value\s*=\s*''/,
    'a senha tem que ser limpa do campo LOGO apos entrar no payload, antes do fetch — nao so no fecharCupom');
});

// Teto do desconto: única fonte é lib/pdv-web.js (DESCONTO_MAX_PCT_OPERADOR),
// entregue pra tela via /pdv/api/setup. A tela NUNCA pode voltar a hardcodar
// o número — nem no cálculo (recalc) nem no texto do aviso.
test('a tela NAO hardcoda o teto de desconto — le state.descontoMaxPctOperador, nunca um "5" solto', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.match(tela, /state\.descontoMaxPctOperador/, 'esperava a tela usar state.descontoMaxPctOperador');
  assert.match(tela, /r\.descontoMaxPctOperador/, 'esperava a tela ler descontoMaxPctOperador da resposta de /pdv\\/api\\/setup');
  assert.doesNotMatch(tela, /pct\s*>\s*5\b/, 'o calculo de "precisa autorizacao" nao pode hardcodar o numero 5');
});

// ===========================================================================
// CONFIRMAÇÃO POR LEITURA DE VOLTA — o ORÇAMENTO também é relido, com as linhas
//
// O id que o POST devolveu prova só que o Zoho respondeu. É a linha do
// Orçamento (Quoted_Items) que carrega o produto de que a fila de troca de
// refil depende — e ela nasce vazia, calada, quando o lookup não resolve.
// ===========================================================================
test('a confirmacao rele o Orcamento PELO ID, no modulo Quotes, pedindo as linhas', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    const args = s.chamado.getRecordQuoteArgs;
    assert.ok(args, 'sem releitura do Orcamento a venda vira completa pelo 200');
    assert.equal(args[0], 'Quotes');
    assert.equal(args[1], 'Q1');
    const campos = String(args[2]).split(',').map(x => x.trim());
    assert.ok(campos.includes('Quoted_Items'), 'sem pedir Quoted_Items nao da pra conferir as linhas');
  } finally { s.restaurar(); }
});

test('Orcamento relido SEM linhas NAO marca completa — Orcamento vazio nao alimenta a fila de refil', async () => {
  const s = stub({ zoho: { getRecord: async (mod) => (mod === 'Quotes'
    ? { id: 'Q1', Quoted_Items: [] }
    : { id: 'D1', Stage: 'Fechado Ganho', Amount: 200, Pedido_Omie: '5281' }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.equal(r.quoteId, 'Q1');       // o POST "sucedeu"
    assert.notEqual(r.estado, 'completa');
    assert.equal(s.estadoNoRazao(), 'zoho_ok');
  } finally { s.restaurar(); }
});

test('Orcamento relido sem o campo de linhas (Zoho nao devolveu) tambem NAO marca completa', async () => {
  const s = stub({ zoho: { getRecord: async (mod) => (mod === 'Quotes'
    ? { id: 'Q1' }
    : { id: 'D1', Stage: 'Fechado Ganho', Amount: 200, Pedido_Omie: '5281' }) } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.notEqual(r.estado, 'completa');
  } finally { s.restaurar(); }
});

test('Orcamento relido com MENOS linhas do que a venda NAO marca completa', async () => {
  const s = stub({ zoho: { getRecord: async (mod) => (mod === 'Quotes'
    ? { id: 'Q1', Quoted_Items: [{ Product_Name: { id: 'zp-ref01' } }] }
    : { id: 'D1', Stage: 'Fechado Ganho', Amount: 290, Pedido_Omie: '5281' }) } });
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ id: 'zp-ref01', codigo: 'REF01', nome: 'Refil', ncm: '8421.99.99', qtd: 1, valor: 200 },
              { id: 'zp-tor07', codigo: 'TOR07', nome: 'Torneira', ncm: '8481.80.11', qtd: 1, valor: 90 }],
    }), 'edson');
    assert.equal(r.ok, true);
    assert.notEqual(r.estado, 'completa');
  } finally { s.restaurar(); }
});

test('releitura do Orcamento falhando deixa a venda pendente, nunca completa', async () => {
  const s = stub({ zoho: { getRecord: async (mod) => {
    if (mod === 'Quotes') throw new Error('quote relido fora');
    return { id: 'D1', Stage: 'Fechado Ganho', Amount: 200, Pedido_Omie: '5281' };
  } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.ok, true);
    assert.match(r.erro, /quote relido fora/);
    assert.ok(!s.marcas.some(m => m.estado === 'completa'));
  } finally { s.restaurar(); }
});

test('venda boa rele os DOIS registros: o Negocio e o Orcamento', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.estado, 'completa');
    const modulos = s.chamado.getRecordCalls.map(a => a[0]);
    assert.ok(modulos.includes('Deals'), 'o Negocio tem que ser relido');
    assert.ok(modulos.includes('Quotes'), 'o Orcamento tem que ser relido');
  } finally { s.restaurar(); }
});

// ===========================================================================
// ENDEREÇO OBRIGATÓRIO PARA CLIENTE NOVO — bug real reportado pelo dono numa
// venda de balcão: "erro na UF do cadastro". lib/omie-pdv.js sempre mandou
// `estado: omie.truncar(cliente.uf, 2)` pro Omie, mas a tela nunca coletava
// endereço nenhum — cliente.uf chegava `undefined`, virava '' e o Omie
// recusava a criação. Só quebrava com CLIENTE NOVO: cliente existente é
// achado e reusado pelo Omie sem tocar em endereço nenhum.
//
// Regra do dono (18/ago/2026):
//   1. Só para cliente novo — quem já foi encontrado na busca do CRM
//      (payload.clienteZohoId presente, qualquer módulo) já tem endereço no
//      Omie de uma venda anterior; perguntar de novo é atrito puro.
//   2. Saída manual obrigatória — o requisito é TER endereço, nunca TER vindo
//      do ViaCEP. CEP é o único campo do bloco que fica de fora da
//      obrigatoriedade (cliente pode não saber o CEP) — endereço, número,
//      bairro, cidade e UF são exigidos.
//   3. A validação vale no SERVIDOR (aqui, em finalizarVenda) — a tela é só
//      conveniência.
// ===========================================================================

test('cliente novo sem endereco nenhum e recusado, sem tocar Omie nem Zoho, ANTES do livro-razao', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      endereco: undefined, numero: undefined, bairro: undefined, cidade: undefined, uf: undefined,
    }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /endere[çc]o/i);
    assert.deepEqual(s.tocou.omie, []);
    assert.deepEqual(s.tocou.zoho, []);
    assert.equal(s.chamado.abrirArgs, null, 'validacao de endereco tem que rodar ANTES do livro-razao');
  } finally { s.restaurar(); }
});

// MUTAÇÃO-ALVO principal desta seção: remover (ou pular) a checagem de
// endereço faz este teste passar quando não deveria — a venda chegaria ao
// Omie com `uf` undefined, reproduzindo o bug real.
test('cliente novo faltando SO a UF e recusado, mensagem cita UF, e a venda nunca chega no Omie', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ uf: undefined }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /UF/);
    assert.deepEqual(s.tocou.omie, [], 'sem UF a venda NUNCA pode chegar no Omie — e o bug real que gerou esta regra');
  } finally { s.restaurar(); }
});

test('cliente novo faltando SO o endereco (logradouro) e recusado, mensagem cita o campo', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ endereco: undefined }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /endere[çc]o/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('cliente novo faltando SO o numero e recusado', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ numero: undefined }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /n[úu]mero/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('cliente novo faltando SO o bairro e recusado', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ bairro: undefined }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /bairro/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

test('cliente novo faltando SO a cidade e recusado', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ cidade: undefined }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /cidade/i);
    assert.deepEqual(s.tocou.omie, []);
  } finally { s.restaurar(); }
});

// CEP é o único campo do bloco que NÃO trava a venda: cliente que não sabe o
// CEP, CEP fora da base do ViaCEP, internet lenta — a saída manual (regra 2)
// existe justamente pra este caso não travar o balcão.
test('cliente novo SEM CEP mas com o resto do endereco preenchido fecha normal (CEP nao e obrigatorio)', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ cep: undefined }), 'edson');
    assert.equal(r.ok, true);
    assert.ok(s.tocou.omie.includes('garanteCliente'));
  } finally { s.restaurar(); }
});

test('cliente ja encontrado na busca (clienteZohoId presente) NAO precisa de endereco nenhum', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      clienteZohoId: 'C-999', clienteZohoModulo: 'Contacts',
      endereco: undefined, numero: undefined, bairro: undefined, cidade: undefined, uf: undefined, cep: undefined,
    }), 'edson');
    assert.equal(r.ok, true);
    assert.ok(s.tocou.omie.includes('garanteCliente'));
  } finally { s.restaurar(); }
});

// Cliente achado por QUALQUER módulo (Empresa/Lead/Negócio) também é
// dispensado do endereço — a regra é "achou na busca", não "achou como
// Contato".
test('cliente achado como EMPRESA (Accounts) na busca tambem nao precisa de endereco', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      clienteZohoId: 'ACC-9', clienteZohoModulo: 'Accounts',
      endereco: undefined, numero: undefined, bairro: undefined, cidade: undefined, uf: undefined,
    }), 'edson');
    assert.equal(r.ok, true);
  } finally { s.restaurar(); }
});

test('cliente novo com endereco DIGITADO A MAO (sem vir do ViaCEP) fecha normal — o obrigatorio e TER endereco', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      cep: undefined, // nunca consultou o ViaCEP
      endereco: 'Avenida Central', numero: '55', bairro: 'Jardim', cidade: 'Bebedouro', uf: 'SP',
    }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(s.chamado.garanteCliente[1].uf, 'SP');
    assert.equal(s.chamado.garanteCliente[1].endereco, 'Avenida Central');
  } finally { s.restaurar(); }
});

test('validacao de endereco roda mesmo em modo sombra (nao passa batido so por causa da trava)', async () => {
  const s = stub();
  const antes = process.env.TDF_PDV_MODO_SOMBRA;
  process.env.TDF_PDV_MODO_SOMBRA = '1';
  try {
    const r = await bipdv.finalizarVenda(base({ uf: undefined }), 'edson');
    assert.equal(r.ok, false);
    assert.match(r.erro, /UF/);
  } finally {
    if (antes === undefined) delete process.env.TDF_PDV_MODO_SOMBRA; else process.env.TDF_PDV_MODO_SOMBRA = antes;
    s.restaurar();
  }
});

// O complemento (opcional) e o email (opcional) sao esperados pelo Omie
// (garanteCliente) e agora tambem coletados pela tela — precisam viajar
// intactos do payload ate o motor da venda.
test('complemento e email do payload viajam ate garanteCliente', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base({ complemento: 'Apto 4', email: 'ana@exemplo.com' }), 'edson');
    assert.equal(s.chamado.garanteCliente[1].complemento, 'Apto 4');
    assert.equal(s.chamado.garanteCliente[1].email, 'ana@exemplo.com');
  } finally { s.restaurar(); }
});

// ===========================================================================
// TELEFONE FIXO — "coloque 2 campos de telefone de contato, às vezes ele tem
// um fixo" (pedido do dono). SEMPRE opcional — ao contrário do celular
// (obrigatório, E.164, já travado acima). MUTAÇÃO alvo (telefone fixo virar
// obrigatório): se uma checagem tipo `if (!payload.telefoneFixo) return
// {ok:false...}` for inserida em finalizarVenda, o teste de venda sem
// telefone fixo abaixo quebra.
// ===========================================================================

test('telefoneFixo do payload viaja ate garanteCliente, intacto', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefoneFixo: '1233334444' }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(s.chamado.garanteCliente[1].telefoneFixo, '1233334444');
  } finally { s.restaurar(); }
});

test('venda fecha normal SEM telefoneFixo nenhum — campo e opcional, nunca trava a venda', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefoneFixo: undefined }), 'edson');
    assert.equal(r.ok, true, 'telefone fixo ausente nao pode derrubar a venda');
    assert.equal(r.etapa, undefined);
  } finally { s.restaurar(); }
});

test('venda fecha normal com telefoneFixo VAZIO (string vazia) — mesma regra, opcional', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefoneFixo: '' }), 'edson');
    assert.equal(r.ok, true);
  } finally { s.restaurar(); }
});

// ===========================================================================
// DIVERGÊNCIA DE ENDEREÇO/TELEFONE DE CLIENTE EXISTENTE — regra do dono: um
// erro de digitação no balcão não pode corromper cadastro antigo, então
// omie-pdv.js NUNCA sobrescreve um campo que já tinha valor divergente; a
// divergência devolvida em `garanteCliente(...).divergenciasEndereco` tem
// que aparecer na observação da venda (Description do Negócio) — nunca
// sumir em silêncio.
// ===========================================================================

test('divergencias de endereco devolvidas por garanteCliente entram na Description do Negocio, sem apagar o resto', async () => {
  const s = stub({
    opdv: {
      garanteCliente: async (...args) => ({
        codigo_cliente_omie: 777,
        divergenciasEndereco: ['endereço: cadastro tem "Rua Antiga", balcão digitou "Rua Nova" — cadastro mantido'],
      }),
    },
  });
  try {
    const r = await bipdv.finalizarVenda(base({ origem: 'Indicação de amigo ou parente' }), 'edson');
    assert.equal(r.ok, true);
    assert.match(s.chamado.deal.Description, /Divergência de cadastro no balcão \(Omie mantido\)/);
    assert.match(s.chamado.deal.Description, /Rua Antiga/);
    assert.match(s.chamado.deal.Description, /Rua Nova/);
    // A linha de origem (já existente) continua lá — a divergência ACRESCENTA, nunca sobrescreve.
    assert.match(s.chamado.deal.Description, /Origem PDV:/);
  } finally { s.restaurar(); }
});

test('sem divergencia nenhuma (garanteCliente nao devolve divergenciasEndereco), a Description NAO ganha a linha de divergencia', async () => {
  const s = stub();
  try {
    await bipdv.finalizarVenda(base(), 'edson');
    assert.doesNotMatch(s.chamado.deal.Description || '', /Divergência de cadastro/);
  } finally { s.restaurar(); }
});

// ===========================================================================
// EMAIL — formato validado quando preenchido, NUNCA obrigatório
// ===========================================================================
// Caso real que motivou o conserto: venda de balcão que falhou em produção
// com "edson" digitado no campo email (sem @, claramente não um e-mail).

test('email obviamente invalido ("edson", sem @) e recusado NO SERVIDOR, antes de qualquer chamada externa', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ email: 'edson' }), 'edson');
    assert.equal(r.ok, false, 'o caso real que motivou o conserto: "edson" no campo email nao pode passar');
    assert.equal(r.etapa, 'validacao-email');
    assert.match(r.erro, /email/i);
    assert.deepEqual(s.tocou.omie, [], 'email invalido nao pode chegar no Omie');
    assert.deepEqual(s.tocou.zoho, []);
  } finally { s.restaurar(); }
});

test('email sem dominio (sem ponto depois do @) tambem e recusado', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ email: 'ana@exemplo' }), 'edson');
    assert.equal(r.ok, false);
    assert.equal(r.etapa, 'validacao-email');
  } finally { s.restaurar(); }
});

test('email VAZIO passa direto — nunca bloqueia a venda (a nota nao sai mais no ato)', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ email: null }), 'edson');
    assert.equal(r.ok, true);
    assert.deepEqual(s.tocou.omie, ['garanteCliente', 'criaPedido', 'validarPedido']);
  } finally { s.restaurar(); }
});

test('email VALIDO passa e viaja intacto ate o Omie', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ email: 'cliente@dominio.com.br' }), 'edson');
    assert.equal(r.ok, true);
    assert.equal(s.chamado.garanteCliente[1].email, 'cliente@dominio.com.br');
  } finally { s.restaurar(); }
});

// ===========================================================================
// ETAPA DA FALHA — item 2 do pedido: "quando a venda falha, o erro volta pra
// tela e não fica em log nenhum no servidor". A etapa acompanha o erro pra
// lib/pdv-web.js (tratarFinalizarVenda) poder registrar operador+empresa+
// etapa+mensagem no log do servidor — sem ela o log ficaria só com a
// mensagem crua, sem dizer ONDE a venda quebrou.
// ===========================================================================

test('falha de "sem itens" carrega etapa de validacao', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ itens: [] }), 'edson');
    assert.equal(r.ok, false);
    assert.equal(r.etapa, 'validacao-itens');
  } finally { s.restaurar(); }
});

test('falha de telefone carrega etapa de validacao', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ telefone: '' }), 'edson');
    assert.equal(r.etapa, 'validacao-telefone');
  } finally { s.restaurar(); }
});

test('falha de endereco (cliente novo) carrega etapa de validacao', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ uf: undefined }), 'edson');
    assert.equal(r.etapa, 'validacao-endereco');
  } finally { s.restaurar(); }
});

test('falha de item sem codigo carrega etapa de validacao', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({
      itens: [{ id: 'x', codigo: '', nome: 'Item', qtd: 1, valor: 10 }],
    }), 'edson');
    assert.equal(r.etapa, 'validacao-item');
  } finally { s.restaurar(); }
});

test('falha de desconto (acima do teto, sem autorizacao) carrega etapa de autorizacao', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: 50 }), 'edson');
    assert.equal(r.etapa, 'autorizacao-desconto');
  } finally { s.restaurar(); }
});

test('falha de desconto invalido (negativo) carrega etapa de validacao', async () => {
  const s = stub();
  try {
    const r = await bipdv.finalizarVenda(base({ desconto: -10 }), 'edson');
    assert.equal(r.etapa, 'validacao-desconto');
  } finally { s.restaurar(); }
});

test('falha do livro-razao carrega etapa de livro-razao', async () => {
  const s = stub({ ledger: { abrir: async () => { throw new Error('idem obrigatório'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.etapa, 'livro-razao');
  } finally { s.restaurar(); }
});

test('falha do Omie carrega etapa omie', async () => {
  const s = stub({ opdv: { garanteCliente: async () => { throw new Error('omie cliente fora'); } } });
  try {
    const r = await bipdv.finalizarVenda(base(), 'edson');
    assert.equal(r.etapa, 'omie');
  } finally { s.restaurar(); }
});

// ===========================================================================
// TELA — CAMPOS DE ENDEREÇO (views/pdv.ejs) — string-tests puros no
// HTML/JS da tela, mesmo padrão dos testes acima ("a tela nao tem mais o
// atalho de item manual", "a tela manda o MODULO do cliente junto com o id",
// etc.). A validação que VALE é a do servidor (seção "ENDEREÇO OBRIGATÓRIO"
// acima); estes testes garantem que a CONVENIÊNCIA da tela existe, reusa o
// ViaCEP que o portal já tem, e não regride.
// ===========================================================================

test('a tela tem os campos de endereco: cep, numero, complemento, endereco, bairro, cidade, uf', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  for (const id of ['pdvCep', 'pdvNumero', 'pdvComplemento', 'pdvEndereco', 'pdvBairro', 'pdvCidade', 'pdvUf']) {
    assert.match(tela, new RegExp(`id=["']${id}["']`), `campo ${id} nao encontrado na tela`);
  }
});

test('a tela tem um campo de email opcional', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.match(tela, /id=["']pdvEmail["']/);
});

// A nota não sai mais no ato (Eloize emite depois, manualmente) — por isso o
// email não pode travar o envio, mas a tela precisa deixar visível, sempre,
// que a nota fica travada sem ele.
test('a tela avisa de forma visivel que sem email a nota nao pode ser emitida depois', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.match(tela, /nota fiscal não poderá ser emitida/i);
});

// A tela não fatura mais nada sozinha: sem r.nota/r.nota.pdf, sem botão
// "Abrir nota". Se esta regressão voltar, o botão reapareceria escondido
// (display:none) sem NUNCA poder ser mostrado (o servidor não manda mais
// nota nenhuma) — código morto que este teste barra na raiz.
test('a tela NAO depende mais de r.nota nem tem o botao "Abrir nota" (o PDV nao fatura)', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.doesNotMatch(tela, /r\.nota\b/);
  assert.doesNotMatch(tela, /pdvBtnNota/);
});

// O aviso da validação (cDescStatus do Omie) tem que aparecer na tela pro
// operador ver ENQUANTO o cliente ainda está na frente dele.
test('a tela mostra r.avisoNotaFiscal quando a venda fecha com aviso pendente', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.match(tela, /r\.avisoNotaFiscal/);
});

test('a tela consulta o proxy /cep/ do proprio servidor — reusa o ViaCEP que o portal ja tem, nunca chama viacep.com.br direto do navegador', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.match(tela, /fetch\(\s*['"`]\/cep\//, 'esperava a tela chamar o proxy /cep/:cep do servidor');
  assert.doesNotMatch(tela, /viacep\.com\.br/, 'a tela NAO pode chamar o viacep.com.br direto — o proxy do servidor ja existe (server.js:/cep/:cep) e tem que ser reusado');
});

test('o payload de finalizar manda cep, numero, complemento, endereco, bairro, cidade, uf e email', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const inicio = tela.indexOf('const payload = {');
  const fim = tela.indexOf(`fetch('/pdv/api/finalizar-venda'`);
  assert.ok(inicio > -1 && fim > inicio, 'esperava achar o bloco de montagem do payload antes do fetch');
  const trecho = tela.slice(inicio, fim);
  for (const campo of ['cep', 'numero', 'complemento', 'endereco', 'bairro', 'cidade', 'uf', 'email']) {
    assert.match(trecho, new RegExp(`\\b${campo}:`), `payload nao manda o campo ${campo}`);
  }
});

test('o bloco de endereco existe na tela (pdvEnderecoBox)', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.match(tela, /id=["']pdvEnderecoBox["']/);
});

// A função de visibilidade continua chamada nos mesmos pontos que mudam se o
// cliente é novo ou não (carregamento inicial, selecionar resultado da
// busca, "sem cadastro", limpar seleção) — o que mudou (ver testes abaixo) é
// que ela não esconde mais o bloco: só troca o rótulo.
test('atualizarVisibilidadeEndereco e definida e chamada nos pontos que mudam se o cliente e novo', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const ocorrencias = (tela.match(/atualizarVisibilidadeEndereco\s*\(\s*\)/g) || []).length;
  // 1 definição + pelo menos 3 chamadas (selecionarCliente, usarSemCadastro, limparCliente)
  assert.ok(ocorrencias >= 4, `esperava a função definida + pelo menos 3 chamadas, achei ${ocorrencias} ocorrências`);
});

// ===========================================================================
// ENDEREÇO DO CLIENTE EXISTENTE — pedido do dono depois de usar o PDV em
// produção (print de tela): o bloco de endereço SUMIA por completo ao
// selecionar um cliente já cadastrado, sem chance nenhuma de conferir ou
// completar. MUTAÇÃO alvo (endereço deixar de ser carregado): se
// atualizarVisibilidadeEndereco() voltar a esconder o bloco (`display =
// clienteNovo ? 'block' : 'none'`), o teste abaixo quebra.
// ===========================================================================

test('o bloco de endereco NUNCA e escondido pra cliente existente — atualizarVisibilidadeEndereco so troca o display para "block"', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const inicio = tela.indexOf('function atualizarVisibilidadeEndereco()');
  const fim = tela.indexOf('atualizarVisibilidadeEndereco();', inicio); // a chamada logo após a definição
  assert.ok(inicio > -1 && fim > inicio);
  const trecho = tela.slice(inicio, fim);
  assert.doesNotMatch(trecho, /display\s*=\s*['"]none['"]/, 'a função nao pode voltar a esconder o bloco de endereco');
  assert.match(trecho, /pdvEnderecoBox['"]\)\.style\.display\s*=\s*['"]block['"]/, 'o bloco tem que ficar sempre visivel');
});

test('selecionarCliente busca a ficha do Omie (PDV.buscarEnderecoOmie) assim que o cliente e escolhido', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const inicio = tela.indexOf('selecionarCliente(c) {');
  const fim = tela.indexOf('usarSemCadastro() {');
  assert.ok(inicio > -1 && fim > inicio);
  const trecho = tela.slice(inicio, fim);
  assert.match(trecho, /this\.buscarEnderecoOmie\(\)/, 'esperava a tela chamar a busca de endereço do Omie ao selecionar o cliente');
});

test('buscarEnderecoOmie existe, chama /pdv/api/cliente-omie e NUNCA dispara durante a digitacao (sem debounce de input)', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  assert.match(tela, /async buscarEnderecoOmie\s*\(\s*\)\s*{/);
  const inicio = tela.indexOf('async buscarEnderecoOmie()');
  const fim = tela.indexOf('cepDebounce()', inicio);
  const trecho = tela.slice(inicio, fim);
  assert.match(trecho, /fetch\(\s*['"`]\/pdv\/api\/cliente-omie/);
  // Nenhum input de busca de cliente chama buscarEnderecoOmie diretamente no
  // oninput (só clique em selecionarCliente ou troca de empresa) — a busca
  // de cliente em si usa buscaClienteDebounce, nunca este método.
  assert.doesNotMatch(tela, /oninput=["']PDV\.buscarEnderecoOmie/);
});

test('a tela tem o campo de telefone fixo (pdvTelefoneFixo), SEM o atributo required — celular continua obrigatorio, fixo nunca', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const m = tela.match(/<input id="pdvTelefoneFixo"[^>]*>/);
  assert.ok(m, 'campo pdvTelefoneFixo nao encontrado na tela');
  assert.doesNotMatch(m[0], /\brequired\b/, 'telefone fixo NUNCA pode ser obrigatorio — pedido do dono e so "as vezes ele tem um fixo"');
  // Celular continua com required — nao regride.
  assert.match(tela, /<input id="pdvTelefone" required/);
});

test('o payload de finalizar manda telefoneFixo junto com o celular', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const inicio = tela.indexOf('const payload = {');
  const fim = tela.indexOf(`fetch('/pdv/api/finalizar-venda'`);
  const trecho = tela.slice(inicio, fim);
  assert.match(trecho, /\btelefoneFixo:/);
  assert.match(trecho, /pdvTelefoneFixo/);
});

test('a tela valida por conveniencia que o endereco esta completo quando o cliente e novo, antes do fetch', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const inicioFinalizar = tela.indexOf('async finalizar() {');
  const inicioFetch = tela.indexOf(`fetch('/pdv/api/finalizar-venda'`);
  assert.ok(inicioFinalizar > -1 && inicioFetch > inicioFinalizar);
  const trecho = tela.slice(inicioFinalizar, inicioFetch);
  // O bloco de endereço agora fica sempre visível (não indica mais "é
  // novo"), então a checagem de conveniência usa clienteEhNovo() — não mais
  // a visibilidade do pdvEnderecoBox.
  assert.match(trecho, /if\s*\(\s*clienteEhNovo\(\)\s*\)/, 'esperava a tela checar clienteEhNovo() antes de exigir endereco');
});

// Regra 2 do dono: o obrigatório é TER endereço, nunca TER vindo do CEP —
// CEP fica de fora da checagem de conveniência (mesma regra do servidor).
test('a validacao de conveniencia da tela NAO exige CEP — regra: saida manual obrigatoria, cliente pode nao saber o CEP', () => {
  const tela = require('node:fs').readFileSync(require.resolve('../views/pdv.ejs'), 'utf8');
  const inicioFinalizar = tela.indexOf('async finalizar() {');
  const inicioFetch = tela.indexOf(`fetch('/pdv/api/finalizar-venda'`);
  const trecho = tela.slice(inicioFinalizar, inicioFetch);
  assert.doesNotMatch(trecho, /faltando\.push\(['"]CEP['"]\)/i);
});
