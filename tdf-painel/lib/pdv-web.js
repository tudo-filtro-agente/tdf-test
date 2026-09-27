// lib/pdv-web.js — apoio PURO às rotas do PDV em server.js (Tarefa 6).
//
// Sem chamada externa, sem Express, sem `req`/`res`, sem banco. Existe só
// pra poder testar com node:test a lógica que mora em server.js — checagem
// de papel, resposta de "banco fora do ar", montagem do /pdv/api/setup e
// agora TAMBÉM a decisão inteira da rota /pdv/api/finalizar-venda (ver
// `tratarFinalizarVenda` abaixo) — sem precisar importar o server.js
// inteiro, que abre porta e agenda dezenas de setInterval (travaria a
// suíte, o processo nunca sairia).
//
// Não é o motor da venda: isso é lib/bi-pdv.js, travado por 144+ testes.
// Este arquivo só nasceu por exigência de testabilidade da Tarefa 6.
//
// ÚNICA exceção a "sem estado": o limitador de tentativas de autorização
// (mais abaixo) guarda um Map em memória do processo — é um freio contra
// força bruta manual, não um cofre; reinicia com o processo, de propósito.
const crypto = require('crypto');

// admin: acesso total. closer: vendedor de campo (Cátia, Fabiana já usavam
// o PDV). loja: balcão físico (Edson, Tainá, Gabrielly) — cadastrados em
// server.js com este papel.
const PDV_ROLES = ['admin', 'closer', 'loja'];

function isPdvRole(role) {
  return PDV_ROLES.includes(role);
}

// Mesmo formato de erro que finalizarVenda devolve ({ok:false, erro}) —
// assim a tela usa UM caminho só pra mostrar mensagem de falha, não importa
// se ela veio do motor (lib/bi-pdv.js) ou desta checagem anterior a ele.
function respostaBancoIndisponivel() {
  return {
    ok: false,
    erro: 'PDV indisponível: banco de dados não configurado. Chame o suporte técnico — nenhuma venda foi enviada.',
  };
}

// Monta a resposta de /pdv/api/setup: bancos ativos, empresas do Omie (pro
// <select> da tela não vir hardcoded no HTML), o usuário logado e o teto de
// desconto do operador (pra tela nunca hardcodar o número — ver
// DESCONTO_MAX_PCT_OPERADOR mais abaixo, fonte única desse valor).
function montarSetupPdv({ bancos, empresasOmie, user, role } = {}) {
  return {
    ok: true,
    bancos: (bancos || []).filter(b => b && b.ativo),
    empresas: empresasOmie || [],
    user: { name: user && user.name, username: user && user.username, role },
    descontoMaxPctOperador: DESCONTO_MAX_PCT_OPERADOR,
  };
}

// === AUTORIZAÇÃO DE DESCONTO ACIMA DO TETO DO OPERADOR ===
// Regra do dono (18/ago/2026): teto do operador caiu de 10% para 5%. Acima
// disso a venda só passa com usuário e senha de um AUTORIZADOR, digitados na
// hora e conferidos no servidor contra o MESMO registro de usuários do login
// (USERS, em server.js) — nunca um cadastro paralelo.
//
// FONTE ÚNICA do teto: este número só existe AQUI. lib/bi-pdv.js importa
// esta constante (nunca redeclara "5"); a tela (views/pdv.ejs) recebe o
// mesmo valor via /pdv/api/setup (montarSetupPdv, acima) e nunca hardcoda o
// número no HTML nem no cálculo em JS. Mudar o teto é mudar só aqui — texto
// da mensagem, cálculo do motor e aviso da tela seguem juntos, sempre.
const DESCONTO_MAX_PCT_OPERADOR = 5;

// Lista única, óbvia de editar: só quem está aqui pode autorizar. 'eloize'
// AINDA NÃO existe em USERS (server.js) — precisa ser cadastrada lá, com
// senha, antes que a autorização funcione pra ela. Até isso acontecer,
// verificarAutorizacaoDesconto recusa com "usuário não é autorizador" (ela
// não é achada em `users`), nunca com uma senha aceita por engano.
// Quem pode liberar desconto acima do teto do operador (Paulo, 18/08/2026).
// `italo` já tem login no portal — autorizar independe do papel dele (é closer).
// `eloize` (Eloize Medeiros) AINDA NÃO tem entrada em USERS: até ser cadastrada,
// cai em "não é autorizador" e nunca aceita senha por engano.
// Luis NÃO entra: fora da operação desde 18/08/2026, acesso a revogar.
const AUTORIZADORES_DESCONTO = ['paulo', 'eloize', 'italo'];

// Comparação de senha em tempo constante — evita que o TEMPO de resposta
// vaze quantos caracteres bateram. `/login` (server.js) usa `!==` direto e
// isso NÃO é regressão desta tarefa (já existia); aqui, que é código novo,
// dá pra fazer melhor sem tocar no login. timingSafeEqual exige buffers do
// MESMO tamanho — quando os tamanhos diferem, ainda gasta um tempo
// proporcional (compara contra um buffer do mesmo tamanho de `a`) antes de
// devolver falso, em vez de sair na hora só por causa do length.
function _senhaBate(esperada, tentativa) {
  const bufA = Buffer.from(String(esperada));
  const bufB = Buffer.from(String(tentativa));
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length)); // gasta tempo, resultado descartado
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// Verificação PURA da credencial do autorizador — mesmo mecanismo do login
// (POST /login em server.js: usuário existe em `users` e senha bate,
// comparação direta). Recebe `users` por parâmetro pra continuar testável
// sem importar server.js inteiro (mesmo motivo de existir deste arquivo).
//
// Três recusas, DISTINGUÍVEIS pro operador saber o que fazer:
//   - falta usuário ou senha        -> autorização nem foi tentada
//   - usuário não é autorizador     -> existe ou não em `users`, mas não está
//                                       na lista AUTORIZADORES_DESCONTO
//   - senha errada                  -> usuário é autorizador, senha não bate
//
// A senha NUNCA é devolvida nem guardada em lugar nenhum por esta função —
// só entra na comparação e é descartada. O chamador (server.js) é quem
// decide o que fazer com o resultado; ele nunca deve reencaminhar `senha`
// adiante (ver lib/bi-pdv.js, onde a persistência é blindada mesmo assim).
function verificarAutorizacaoDesconto(autorizacao, users) {
  const usuario = String((autorizacao && autorizacao.usuario) || '').trim();
  const senha = String((autorizacao && autorizacao.senha) || '');
  if (!usuario || !senha) {
    return { ok: false, erro: `desconto acima de ${DESCONTO_MAX_PCT_OPERADOR}% exige autorização de um supervisor — informe usuário e senha do autorizador` };
  }
  const u = (users || {})[usuario];
  if (!u || !AUTORIZADORES_DESCONTO.includes(usuario)) {
    return { ok: false, erro: `usuário "${usuario}" não é autorizador de desconto` };
  }
  if (!_senhaBate(u.password, senha)) {
    return { ok: false, erro: 'senha do autorizador incorreta' };
  }
  return { ok: true, autorizador: usuario, nomeAutorizador: u.name || usuario };
}

// === LIMITE DE TENTATIVAS — o balcão não pode virar oráculo da senha do dono ===
// Sem limite, qualquer operador autenticado pode chutar a senha de um
// autorizador contra esta rota infinitas vezes — e a mensagem já distingue
// "senha errada" de "usuário não é autorizador", o que confirma quem É
// autorizador. Isso só é aceitável com um freio de tentativas.
//
// Janela deslizante em memória, por OPERADOR (quem está logado no balcão
// tentando autorizar) — reinicia com o processo, de propósito: isto é um
// freio contra automação/força bruta manual, não o cofre em si. Cada
// tentativa com credencial de verdade (usuário E senha preenchidos) que
// falhar fica no log — usuário que tentou, autorizador ALVO, horário — e
// NUNCA a senha, que nem chega perto do log.
const JANELA_TENTATIVAS_MS = 15 * 60 * 1000; // 15 minutos
const LIMITE_TENTATIVAS = 5;

const _tentativasPorOperador = new Map(); // operador -> [timestamps das falhas]
const _logTentativas = []; // { em, operador, autorizadorAlvo, motivo } — NUNCA senha

function _tentativasRecentes(operador, agora) {
  const lista = (_tentativasPorOperador.get(operador) || []).filter(t => agora - t < JANELA_TENTATIVAS_MS);
  _tentativasPorOperador.set(operador, lista);
  return lista;
}

function _registrarFalha(operador, autorizadorAlvo, motivo) {
  _logTentativas.push({ em: new Date().toISOString(), operador: operador || '(desconhecido)', autorizadorAlvo: autorizadorAlvo || '(vazio)', motivo });
}

// Verificação de credencial COM limite de tentativas — é esta, e só esta,
// que a rota (tratarFinalizarVenda, abaixo) deve chamar. `operador` é quem
// está logado tentando autorizar (req.session.user.username), nunca o
// autorizador-alvo. Só conta/loga como TENTATIVA quando usuário E senha
// vieram preenchidos — uma venda dentro do teto (sem `autorizacao` nenhuma
// no corpo) não pode consumir o limite de ninguém.
function verificarAutorizacaoDescontoComLimite(operador, autorizacao, users) {
  const usuarioAlvo = String((autorizacao && autorizacao.usuario) || '').trim();
  const senha = String((autorizacao && autorizacao.senha) || '');
  const tentandoCredencial = !!usuarioAlvo && !!senha;

  if (tentandoCredencial) {
    const agora = Date.now();
    if (_tentativasRecentes(operador, agora).length >= LIMITE_TENTATIVAS) {
      _registrarFalha(operador, usuarioAlvo, 'limite de tentativas excedido');
      return {
        ok: false,
        erro: `muitas tentativas de autorização — aguarde alguns minutos ou peça pro supervisor autorizar pessoalmente`,
      };
    }
  }

  const r = verificarAutorizacaoDesconto(autorizacao, users);

  if (tentandoCredencial && !r.ok) {
    const agora = Date.now();
    _tentativasRecentes(operador, agora).push(agora);
    _registrarFalha(operador, usuarioAlvo, r.erro);
  }
  return r;
}

// Só pra teste: reseta o estado do limitador entre casos, e devolve uma
// CÓPIA do log (nunca a referência viva) pra afirmar sobre o que foi
// gravado sem dar jeito de um teste mutar o log de verdade.
function _resetTentativasParaTeste() {
  _tentativasPorOperador.clear();
  _logTentativas.length = 0;
}
function _obterLogTentativasParaTeste() {
  return _logTentativas.map(e => ({ ...e }));
}

// === LOG DE FALHA DE VENDA — server-side, nunca só na tela ===
// Antes desta mudança, uma venda que falhava (ex.: "erro na UF do cadastro",
// reportado pelo dono numa venda real de balcão) voltava só como mensagem pro
// navegador do operador — nenhum rastro ficava no servidor, e foi impossível
// diagnosticar o bug pelo log de produção.
//
// Registra só operador, empresa, etapa e a MENSAGEM de erro — nunca o `body`
// inteiro (que pode carregar `body.autorizacao.senha`) e nunca dados de
// cartão. `etapa` vem de `r.etapa`, um campo que finalizarVenda (lib/bi-pdv.js)
// passou a incluir em todo retorno {ok:false} pra dizer ONDE a venda quebrou
// (validação de endereço, Omie, livro-razão, etc.) — sem ela o log teria só a
// mensagem crua, sem contexto de qual etapa falhou.
//
// Mesmo padrão em memória do limitador de tentativas acima: reinicia com o
// processo, de propósito — é log, não auditoria persistida; a persistência de
// verdade continua sendo o console.error (que vai pro log real do processo em
// produção) e o livro-razão (lib/pdv-ledger.js), que já grava o estado
// 'falhou' com o erro.
const _logFalhasVenda = []; // { em, operador, empresa, etapa, mensagem } — NUNCA senha/cartão

function _logarFalhaVenda({ operador, empresa, etapa, mensagem }) {
  const entrada = {
    em: new Date().toISOString(),
    operador: operador || '(desconhecido)',
    empresa: empresa || '(sem empresa)',
    etapa: etapa || '(sem etapa)',
    mensagem: String(mensagem == null ? '' : mensagem),
  };
  _logFalhasVenda.push(entrada);
  console.error('[pdv falha]', JSON.stringify(entrada));
}

// Só pra teste: mesma disciplina do limitador de tentativas — reseta entre
// casos e devolve uma CÓPIA (nunca a referência viva).
function _resetLogFalhasParaTeste() { _logFalhasVenda.length = 0; }
function _obterLogFalhasParaTeste() { return _logFalhasVenda.map(e => ({ ...e })); }

// === HANDLER DE /pdv/api/finalizar-venda ===
// Extraído de server.js pra virar testável sem precisar importar server.js
// inteiro (abre porta, agenda dezenas de setInterval). É a ÚNICA porta entre
// o corpo que o CLIENTE mandou (req.body) e o motor da venda
// (lib/bi-pdv.js#finalizarVenda): a autorização de desconto SEMPRE passa por
// verificarAutorizacaoDescontoComLimite aqui — o valor cru de
// `body.autorizacao` NUNCA viaja direto pra finalizarVenda. Um cliente
// malicioso que mande `autorizacao:{ok:true,autorizador:'x'}` pronto no
// corpo tem que ser recusado por esta função, não aceito de bandeja.
//
// `finalizarVenda` é injetado (não importa lib/bi-pdv.js direto) — dá pra
// testar sem tocar Omie/Zoho reais, e sem acoplar este módulo "puro" a
// dependências pesadas. server.js chama assim:
//   pdvWeb.tratarFinalizarVenda({ body: req.body,
//     username: req.session.user?.username, dbReady: _pdvDbReady,
//     users: USERS, finalizarVenda: biPDV.finalizarVenda })
async function tratarFinalizarVenda({ body, username, dbReady, users, finalizarVenda }) {
  if (!dbReady) return { status: 503, json: respostaBancoIndisponivel() };
  const autorizacaoDesconto = verificarAutorizacaoDescontoComLimite(username, body && body.autorizacao, users);
  const r = await finalizarVenda(body || {}, username, autorizacaoDesconto);
  if (!r.ok) {
    _logarFalhaVenda({ operador: username, empresa: body && body.empresa, etapa: r.etapa, mensagem: r.erro });
    return { status: 400, json: r };
  }
  return { status: 200, json: r };
}

// === CONSULTA CNPJ NO CADASTRO NACIONAL — /pdv/api/cnpj/:cnpj ===
// Pedido do dono depois de usar o PDV: ao digitar o CNPJ de um cliente novo,
// o cadastro (razão social, endereço, telefone, email) deve vir preenchido
// da Receita — mesma ideia do CEP, que já preenche o endereço.
//
// A consulta em si (BrasilAPI → fallback publica.cnpj.ws, cache 24h) já
// existe em server.js e é usada por /bi-financeiro/api/cnpj/:cnpj, atrás de
// requireBIRole — papel que o operador de loja NÃO tem. Em vez de duplicar
// fetch/normalização aqui (ou afrouxar o gate do BI), esta função só decide
// a ROTA do PDV: recomputa o papel contra `users` (nunca confia em quem já
// passou pelo middleware — mesmo motivo do resto deste arquivo: server.js
// não é testado, então a decisão de segurança tem que morar AQUI pra dar
// pra travar por teste) e delega a consulta de verdade pra `consultarCnpj`,
// injetada pelo chamador (server.js passa a mesma função que
// /bi-financeiro/api/cnpj usa — ver comentário lá).
//
// `consultarCnpj` é assíncrona e devolve sempre `{status, json}` — nunca
// deveria rejeitar (a versão real em server.js já captura toda falha de
// rede/timeout/serviço fora do ar e devolve um `status` de erro), mas o
// try/catch abaixo é o cinto de segurança: NENHUMA falha da consulta pode
// travar a venda — o operador preenche à mão e segue, mesma regra do CEP.
async function tratarConsultaCnpj({ cnpj, username, users, consultarCnpj }) {
  const role = (users || {})[username] && (users || {})[username].role;
  if (!isPdvRole(role)) {
    return { status: 403, json: { ok: false, error: 'sem permissão pra PDV' } };
  }
  const digits = String(cnpj || '').replace(/\D/g, '');
  if (digits.length !== 14) {
    return { status: 400, json: { ok: false, error: 'CNPJ inválido (precisa 14 dígitos)' } };
  }
  let r;
  try {
    r = await consultarCnpj(digits);
  } catch (e) {
    return { status: 200, json: { ok: false, error: 'consulta ao Cadastro Nacional indisponível: ' + ((e && e.message) || 'erro desconhecido') } };
  }
  if (r && r.json && r.json.ok) {
    const { irregular, alerta } = avaliarSituacaoCadastral(r.json.situacao);
    return { status: r.status, json: { ...r.json, situacaoIrregular: irregular, alertaSituacao: alerta } };
  }
  return r;
}

// Decide se a situação cadastral vinda da Receita merece aviso antes de
// fechar a venda. Regra do dono: emitir nota fiscal pra CNPJ com situação
// diferente de ATIVA (baixada, inapta, suspensa, nula) é problema fiscal —
// mas a decisão de seguir é do OPERADOR, então isto nunca bloqueia, só avisa.
// Sem dado nenhum (consulta falhou, `situacao` vazia) não inventa alarme —
// melhor silêncio do que um falso aviso de irregularidade.
function avaliarSituacaoCadastral(situacao) {
  const s = String(situacao || '').trim();
  if (!s) return { irregular: false, alerta: null };
  const norm = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  if (norm === 'ATIVA') return { irregular: false, alerta: null };
  return {
    irregular: true,
    alerta: `Situação cadastral deste CNPJ na Receita: ${s} (não é ATIVA). Emitir nota fiscal pode dar problema — confirme antes de fechar a venda.`,
  };
}

// === ENDEREÇO DO CLIENTE EXISTENTE — /pdv/api/cliente-omie ===
// Pedido do dono depois de usar o PDV em produção (print de tela): ao
// selecionar um cliente já cadastrado, o bloco de endereço sumia por
// completo — construído assim de propósito pra não perguntar de novo a quem
// já tem, mas sem chance nenhuma de conferir ou completar o que falta. Esta
// rota busca a ficha COMPLETA do cliente no Omie (endereço, telefones,
// e-mail) pra tela mostrar assim que o operador ESCOLHE o cliente — nunca
// durante a digitação (o Omie tem trava de "consumo redundante" contra
// chamadas repetidas em menos de 60s).
//
// `buscarClienteOmie` é injetada (lib/omie-pdv.js#buscarClienteOmie, que
// chama o Omie de verdade) — dá pra testar sem tocar a API real. Mesma
// regra do CEP e do CNPJ: uma falha na consulta NUNCA pode travar a venda —
// devolve ok:false e o operador confere/preenche à mão.
async function tratarClienteOmie({ query, buscarClienteOmie }) {
  const empresa = String((query && query.empresa) || '').trim();
  const doc = String((query && query.doc) || '').replace(/\D/g, '');
  const telefone = String((query && query.telefone) || '').replace(/\D/g, '');
  if (!empresa) return { status: 400, json: { ok: false, error: 'empresa obrigatória' } };
  if (!doc && !telefone) return { status: 400, json: { ok: false, error: 'informe documento ou telefone pra buscar' } };
  try {
    const r = await buscarClienteOmie(empresa, { cpf: doc, telefone });
    return { status: 200, json: { ok: true, ...r } };
  } catch (e) {
    return { status: 200, json: { ok: false, error: 'consulta ao Omie indisponível: ' + ((e && e.message) || 'erro desconhecido') } };
  }
}

module.exports = {
  PDV_ROLES, isPdvRole, respostaBancoIndisponivel, montarSetupPdv,
  DESCONTO_MAX_PCT_OPERADOR, AUTORIZADORES_DESCONTO, verificarAutorizacaoDesconto,
  LIMITE_TENTATIVAS, JANELA_TENTATIVAS_MS, verificarAutorizacaoDescontoComLimite,
  _resetTentativasParaTeste, _obterLogTentativasParaTeste,
  _resetLogFalhasParaTeste, _obterLogFalhasParaTeste,
  tratarFinalizarVenda,
  tratarConsultaCnpj, avaliarSituacaoCadastral,
  tratarClienteOmie,
};
