const test = require('node:test');
const assert = require('node:assert');
const pdvWeb = require('../lib/pdv-web');

test('isPdvRole aceita admin, closer e loja', () => {
  assert.strictEqual(pdvWeb.isPdvRole('admin'), true);
  assert.strictEqual(pdvWeb.isPdvRole('closer'), true);
  assert.strictEqual(pdvWeb.isPdvRole('loja'), true);
});

test('isPdvRole recusa outros papeis, string vazia e undefined', () => {
  assert.strictEqual(pdvWeb.isPdvRole('financeiro'), false);
  assert.strictEqual(pdvWeb.isPdvRole('posvenda'), false);
  assert.strictEqual(pdvWeb.isPdvRole('aprovador'), false);
  assert.strictEqual(pdvWeb.isPdvRole(''), false);
  assert.strictEqual(pdvWeb.isPdvRole(undefined), false);
});

test('respostaBancoIndisponivel devolve ok:false com erro em português, mesmo formato do finalizarVenda', () => {
  const r = pdvWeb.respostaBancoIndisponivel();
  assert.strictEqual(r.ok, false);
  assert.strictEqual(typeof r.erro, 'string');
  assert.match(r.erro, /banco de dados/i);
  assert.doesNotThrow(() => JSON.stringify(r));
});

test('montarSetupPdv filtra bancos inativos e passa adiante empresas do Omie', () => {
  const r = pdvWeb.montarSetupPdv({
    bancos: [{ id: 1, ativo: true }, { id: 2, ativo: false }, { id: 3, ativo: true }],
    empresasOmie: ['Tudo de Filtro', 'Mococa'],
    user: { name: 'Cátia', username: 'catia' },
    role: 'loja',
  });
  assert.strictEqual(r.ok, true);
  assert.deepStrictEqual(r.bancos.map(b => b.id), [1, 3]);
  assert.deepStrictEqual(r.empresas, ['Tudo de Filtro', 'Mococa']);
  assert.strictEqual(r.user.name, 'Cátia');
  assert.strictEqual(r.user.username, 'catia');
  assert.strictEqual(r.user.role, 'loja');
});

test('montarSetupPdv não quebra com bancos/empresas ausentes ou entradas nulas', () => {
  const r1 = pdvWeb.montarSetupPdv({ user: { name: 'x', username: 'x' }, role: 'admin' });
  assert.deepStrictEqual(r1.bancos, []);
  assert.deepStrictEqual(r1.empresas, []);

  const r2 = pdvWeb.montarSetupPdv({ bancos: [null, undefined, { id: 9, ativo: true }] });
  assert.deepStrictEqual(r2.bancos.map(b => b.id), [9]);

  const r3 = pdvWeb.montarSetupPdv();
  assert.strictEqual(r3.ok, true);
  assert.deepStrictEqual(r3.bancos, []);
  assert.deepStrictEqual(r3.empresas, []);
});

// ===========================================================================
// FONTE ÚNICA DO TETO — DESCONTO_MAX_PCT_OPERADOR. lib/bi-pdv.js importa esta
// constante (nunca redeclara "5") e a tela recebe o MESMO valor por aqui
// (montarSetupPdv), nunca hardcodado no HTML/JS. Mudar o teto é mudar só
// nesta constante — mensagem, motor e tela seguem juntos.
// MUTAÇÃO: mudar DESCONTO_MAX_PCT_OPERADOR aqui pra 7 (sem tocar mais nada)
// tem que quebrar TANTO o teste abaixo QUANTO os testes de 5%/8%/10% em
// test/bi-pdv.test.js (que importa a constante de bi-pdv.js, que por sua vez
// importa dela) — provando que não existe um segundo número escondido.
// ===========================================================================

test('montarSetupPdv devolve o MESMO valor de DESCONTO_MAX_PCT_OPERADOR — fonte unica que a tela le', () => {
  const r = pdvWeb.montarSetupPdv({ user: { name: 'x', username: 'x' }, role: 'loja' });
  assert.strictEqual(r.descontoMaxPctOperador, pdvWeb.DESCONTO_MAX_PCT_OPERADOR);
  assert.strictEqual(pdvWeb.DESCONTO_MAX_PCT_OPERADOR, 5);
});

test('mensagem de "falta autorizacao" usa a constante do teto, nao um numero solto', () => {
  const r = pdvWeb.verificarAutorizacaoDesconto({}, {});
  assert.match(r.erro, new RegExp(`acima de ${pdvWeb.DESCONTO_MAX_PCT_OPERADOR}%`));
});

// ===========================================================================
// verificarAutorizacaoDesconto — checagem PURA da credencial do autorizador
// de desconto do PDV. Mesmo mecanismo do login (POST /login em server.js):
// usuário existe em `users` e senha bate por comparação direta. `users` é
// injetado (nunca importado de server.js) — é o motivo deste arquivo existir.
// ===========================================================================

const USERS_FAKE = {
  paulo: { password: 'TDF@2026', name: 'Paulo', role: 'admin' },
  eloize: { password: 'eloize-senha-2026', name: 'Eloize', role: 'admin' },
  edson: { password: 'edson2026', name: 'Edson', role: 'loja' }, // existe no portal, mas NAO e autorizador
};

test('AUTORIZADORES_DESCONTO contem paulo, eloize e italo, e so eles — lista unica, editada num lugar so', () => {
  assert.deepStrictEqual(pdvWeb.AUTORIZADORES_DESCONTO, ['paulo', 'eloize', 'italo']);
});

// Luis Augusto esta fora da operacao desde 18/08/2026 e NAO autoriza desconto,
// apesar de ainda constar como admin/ceo no USERS do server.js (revogacao pendente).
// Se alguem reintroduzir 'luis' na lista, este teste quebra.
test('luis NAO autoriza desconto, mesmo sendo admin no portal', () => {
  assert.ok(!pdvWeb.AUTORIZADORES_DESCONTO.includes('luis'));
  const r = pdvWeb.verificarAutorizacaoDesconto(
    { usuario: 'luis', senha: 'Luis@9yhja5ss' },
    { luis: { password: 'Luis@9yhja5ss', name: 'Luis Augusto', role: 'admin' } }
  );
  assert.equal(r.ok, false);
});

test('verificarAutorizacaoDesconto aceita paulo com a senha certa', () => {
  const r = pdvWeb.verificarAutorizacaoDesconto({ usuario: 'paulo', senha: 'TDF@2026' }, USERS_FAKE);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.autorizador, 'paulo');
  assert.strictEqual(r.nomeAutorizador, 'Paulo');
});

// MUTAÇÃO: comparar com `!==` invertido, ou aceitar qualquer senha não-vazia,
// faz este teste quebrar — senha errada TEM que recusar.
test('verificarAutorizacaoDesconto recusa paulo com a senha ERRADA — mensagem distinta de "nao e autorizador"', () => {
  const r = pdvWeb.verificarAutorizacaoDesconto({ usuario: 'paulo', senha: 'senha-chutada' }, USERS_FAKE);
  assert.strictEqual(r.ok, false);
  assert.match(r.erro, /senha/i);
  assert.doesNotMatch(r.erro, /não é autorizador/);
});

// eloize É autorizadora na lista, mas neste `users` fake ela existe (cenário:
// depois de cadastrada). Antes de cadastrada (users sem a chave 'eloize'),
// tem que cair no mesmo caminho de "não é autorizador" — testado abaixo.
test('verificarAutorizacaoDesconto aceita eloize quando ela ja esta cadastrada em users, com a senha certa', () => {
  const r = pdvWeb.verificarAutorizacaoDesconto({ usuario: 'eloize', senha: 'eloize-senha-2026' }, USERS_FAKE);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.autorizador, 'eloize');
});

// MUTAÇÃO: tirar a checagem `!AUTORIZADORES_DESCONTO.includes(usuario)` faz
// este teste quebrar — edson tem login válido no portal, mas NÃO pode
// autorizar desconto.
test('verificarAutorizacaoDesconto recusa usuario que existe em users mas NAO esta na lista de autorizadores', () => {
  const r = pdvWeb.verificarAutorizacaoDesconto({ usuario: 'edson', senha: 'edson2026' }, USERS_FAKE);
  assert.strictEqual(r.ok, false);
  assert.match(r.erro, /não é autorizador/);
  assert.doesNotMatch(r.erro, /senha/i, 'senha do edson estava certa — a recusa tem que ser por PAPEL, nao por senha');
});

// 'eloize' ainda não cadastrada em USERS (server.js) no dia-a-dia real —
// mesmo estando na lista de autorizadores, sem registro em `users` ela tem
// que ser recusada como "não é autorizador", nunca com uma senha aceita.
test('verificarAutorizacaoDesconto recusa eloize quando ela AINDA NAO existe em users (nao cadastrada)', () => {
  const usersSemEloize = { paulo: USERS_FAKE.paulo, edson: USERS_FAKE.edson };
  const r = pdvWeb.verificarAutorizacaoDesconto({ usuario: 'eloize', senha: 'qualquer-coisa' }, usersSemEloize);
  assert.strictEqual(r.ok, false);
  assert.match(r.erro, /não é autorizador/);
});

test('verificarAutorizacaoDesconto recusa usuario que nao existe em users nenhum', () => {
  const r = pdvWeb.verificarAutorizacaoDesconto({ usuario: 'fantasma', senha: 'x' }, USERS_FAKE);
  assert.strictEqual(r.ok, false);
  assert.match(r.erro, /não é autorizador/);
});

test('verificarAutorizacaoDesconto recusa quando falta usuario e/ou senha — mensagem de "falta autorizacao", distinta das outras duas', () => {
  const semNada = pdvWeb.verificarAutorizacaoDesconto({}, USERS_FAKE);
  assert.strictEqual(semNada.ok, false);
  assert.match(semNada.erro, /informe usuário e senha/i);

  const semSenha = pdvWeb.verificarAutorizacaoDesconto({ usuario: 'paulo' }, USERS_FAKE);
  assert.strictEqual(semSenha.ok, false);
  assert.match(semSenha.erro, /informe usuário e senha/i);

  const semUsuario = pdvWeb.verificarAutorizacaoDesconto({ senha: 'TDF@2026' }, USERS_FAKE);
  assert.strictEqual(semUsuario.ok, false);
  assert.match(semUsuario.erro, /informe usuário e senha/i);

  const semNadaMesmo = pdvWeb.verificarAutorizacaoDesconto(undefined, USERS_FAKE);
  assert.strictEqual(semNadaMesmo.ok, false);
  assert.match(semNadaMesmo.erro, /informe usuário e senha/i);
});

// Checa o VALOR da credencial submetida, não a palavra "senha" (que aparece
// legitimamente na mensagem de erro "senha do autorizador incorreta").
test('verificarAutorizacaoDesconto NUNCA devolve o VALOR da senha submetida, em nenhum caminho', () => {
  const caminhos = [
    pdvWeb.verificarAutorizacaoDesconto({ usuario: 'paulo', senha: 'TDF@2026' }, USERS_FAKE),
    pdvWeb.verificarAutorizacaoDesconto({ usuario: 'paulo', senha: 'SENHA-CHUTADA-XYZ' }, USERS_FAKE),
    pdvWeb.verificarAutorizacaoDesconto({ usuario: 'edson', senha: 'edson2026' }, USERS_FAKE),
    pdvWeb.verificarAutorizacaoDesconto({}, USERS_FAKE),
  ];
  for (const r of caminhos) {
    assert.doesNotMatch(JSON.stringify(r), /TDF@2026|SENHA-CHUTADA-XYZ|edson2026/);
  }
});

// ===========================================================================
// tratarFinalizarVenda — handler INTEIRO de /pdv/api/finalizar-venda,
// extraído de server.js pra virar testável. É a única porta entre o corpo
// que o CLIENTE mandou (body.autorizacao) e o motor da venda: o resultado
// que finalizarVenda recebe tem que ser SEMPRE o de verificarAutorizacao...,
// nunca o valor cru do corpo. Um cliente malicioso mandando
// `autorizacao:{ok:true,autorizador:'x'}` pronto tem que ser recusado.
//
// MUTAÇÃO alvo (a que a revisão pediu pra travar): trocar
// `verificarAutorizacaoDescontoComLimite(username, body && body.autorizacao, users)`
// por `body && body.autorizacao` dentro de tratarFinalizarVenda faz o
// primeiro teste abaixo quebrar — `recebido` passaria a ser o objeto
// fabricado pelo cliente, com `ok:true`, em vez de recomputado do zero.
// ===========================================================================

test('tratarFinalizarVenda NUNCA repassa autorizacao crua do cliente pro motor da venda — recomputa sempre', async () => {
  pdvWeb._resetTentativasParaTeste();
  let recebido;
  const fakeFinalizar = async (body, username, autorizacaoDesconto) => {
    recebido = autorizacaoDesconto;
    return { ok: true, vendaId: 'v1' };
  };
  const r = await pdvWeb.tratarFinalizarVenda({
    // Cliente malicioso: manda uma autorizacao "pronta", sem usuario/senha
    // nenhum — se o servidor confiasse nisso, a venda passaria liberada.
    body: { desconto: 999, autorizacao: { ok: true, autorizador: 'paulo', nomeAutorizador: 'Paulo' } },
    username: 'edson', dbReady: true, users: USERS_FAKE, finalizarVenda: fakeFinalizar,
  });
  assert.strictEqual(recebido.ok, false, 'sem usuario/senha de verdade, a autorizacao recomputada tem que falhar — nunca aceitar o que o cliente mandou pronto');
  assert.strictEqual(r.status, 200);
});

test('tratarFinalizarVenda aceita autorizacao valida quando usuario/senha batem de verdade', async () => {
  pdvWeb._resetTentativasParaTeste();
  let recebido;
  const fakeFinalizar = async (body, username, autorizacaoDesconto) => { recebido = autorizacaoDesconto; return { ok: true, vendaId: 'v2' }; };
  await pdvWeb.tratarFinalizarVenda({
    body: { autorizacao: { usuario: 'paulo', senha: 'TDF@2026' } },
    username: 'edson', dbReady: true, users: USERS_FAKE, finalizarVenda: fakeFinalizar,
  });
  assert.strictEqual(recebido.ok, true);
  assert.strictEqual(recebido.autorizador, 'paulo');
});

test('tratarFinalizarVenda devolve 503 quando o banco nao esta pronto, sem chamar finalizarVenda', async () => {
  let chamado = false;
  const r = await pdvWeb.tratarFinalizarVenda({
    body: {}, username: 'edson', dbReady: false, users: USERS_FAKE,
    finalizarVenda: async () => { chamado = true; return { ok: true }; },
  });
  assert.strictEqual(chamado, false);
  assert.strictEqual(r.status, 503);
  assert.match(r.json.erro, /banco de dados/i);
});

test('tratarFinalizarVenda devolve 400 quando finalizarVenda recusa, 200 quando aceita', async () => {
  pdvWeb._resetTentativasParaTeste();
  const recusa = await pdvWeb.tratarFinalizarVenda({
    body: {}, username: 'edson', dbReady: true, users: USERS_FAKE,
    finalizarVenda: async () => ({ ok: false, erro: 'sem itens' }),
  });
  assert.strictEqual(recusa.status, 400);

  const aceita = await pdvWeb.tratarFinalizarVenda({
    body: {}, username: 'edson', dbReady: true, users: USERS_FAKE,
    finalizarVenda: async () => ({ ok: true, vendaId: 'v3' }),
  });
  assert.strictEqual(aceita.status, 200);
});

// ===========================================================================
// LIMITE DE TENTATIVAS — o balcão não pode virar oráculo da senha do dono.
// Sem limite, um operador autenticado poderia chutar a senha de um
// autorizador infinitas vezes; a mensagem já distingue "senha errada" de
// "não é autorizador", o que confirma quem É autorizador. Só é aceitável
// com um freio de tentativas + registro de cada falha (nunca a senha).
// ===========================================================================

test('verificarAutorizacaoDescontoComLimite bloqueia apos LIMITE_TENTATIVAS tentativas erradas do MESMO operador', () => {
  pdvWeb._resetTentativasParaTeste();
  for (let i = 0; i < pdvWeb.LIMITE_TENTATIVAS; i++) {
    const r = pdvWeb.verificarAutorizacaoDescontoComLimite('edson', { usuario: 'paulo', senha: 'chute' + i }, USERS_FAKE);
    assert.strictEqual(r.ok, false);
  }
  // A senha CERTA, na tentativa seguinte, tem que continuar bloqueada — o
  // limite estourou, não importa mais se a credencial está certa.
  const bloqueado = pdvWeb.verificarAutorizacaoDescontoComLimite('edson', { usuario: 'paulo', senha: 'TDF@2026' }, USERS_FAKE);
  assert.strictEqual(bloqueado.ok, false);
  assert.match(bloqueado.erro, /muitas tentativas|limite/i);
});

test('limite de tentativas e por OPERADOR — nao bloqueia um operador diferente', () => {
  pdvWeb._resetTentativasParaTeste();
  for (let i = 0; i < pdvWeb.LIMITE_TENTATIVAS; i++) {
    pdvWeb.verificarAutorizacaoDescontoComLimite('edson', { usuario: 'paulo', senha: 'chute' + i }, USERS_FAKE);
  }
  const outraPessoa = pdvWeb.verificarAutorizacaoDescontoComLimite('taina', { usuario: 'paulo', senha: 'TDF@2026' }, USERS_FAKE);
  assert.strictEqual(outraPessoa.ok, true, 'tentativas de um operador nao podem bloquear outro');
});

test('cada tentativa com credencial que FALHA fica no log: operador, autorizador-alvo e horario — NUNCA a senha', () => {
  pdvWeb._resetTentativasParaTeste();
  pdvWeb.verificarAutorizacaoDescontoComLimite('gabrielly', { usuario: 'paulo', senha: 'SENHA-SECRETA-XPTO-999' }, USERS_FAKE);
  const log = pdvWeb._obterLogTentativasParaTeste();
  assert.strictEqual(log.length, 1);
  assert.strictEqual(log[0].operador, 'gabrielly');
  assert.strictEqual(log[0].autorizadorAlvo, 'paulo');
  assert.ok(log[0].em, 'esperava um horario registrado');
  assert.ok(!('senha' in log[0]), 'o registro nao pode ter um campo senha');
  assert.doesNotMatch(JSON.stringify(log), /SENHA-SECRETA-XPTO-999/);
});

test('tentativa SEM credencial nenhuma (venda dentro do teto, sem caixa de autorizacao) NAO conta nem entra no log', () => {
  pdvWeb._resetTentativasParaTeste();
  pdvWeb.verificarAutorizacaoDescontoComLimite('edson', undefined, USERS_FAKE);
  pdvWeb.verificarAutorizacaoDescontoComLimite('edson', {}, USERS_FAKE);
  pdvWeb.verificarAutorizacaoDescontoComLimite('edson', { usuario: 'paulo' }, USERS_FAKE); // senha ausente
  assert.strictEqual(pdvWeb._obterLogTentativasParaTeste().length, 0);
});

// ===========================================================================
// LOG DE FALHA DE VENDA — item 2 do pedido do dono: "quando a venda falha, o
// erro volta pra tela e não fica em log nenhum no servidor. Foi impossível
// diagnosticar este bug pelo log de produção." (o bug real foi "erro na UF do
// cadastro", numa venda de cliente novo). tratarFinalizarVenda registra
// operador, empresa, etapa e a mensagem de erro — NUNCA o payload inteiro
// (que pode carregar `autorizacao.senha`) e NUNCA dados de cartão.
// ===========================================================================

test('venda que falha grava operador, empresa, etapa e mensagem no log do servidor', async () => {
  pdvWeb._resetLogFalhasParaTeste();
  await pdvWeb.tratarFinalizarVenda({
    body: { empresa: 'Tudo de Filtro' }, username: 'edson', dbReady: true, users: USERS_FAKE,
    finalizarVenda: async () => ({ ok: false, etapa: 'validacao-endereco', erro: 'endereço obrigatório para cliente novo — falta: UF' }),
  });
  const log = pdvWeb._obterLogFalhasParaTeste();
  assert.strictEqual(log.length, 1);
  assert.strictEqual(log[0].operador, 'edson');
  assert.strictEqual(log[0].empresa, 'Tudo de Filtro');
  assert.strictEqual(log[0].etapa, 'validacao-endereco');
  assert.match(log[0].mensagem, /UF/);
  assert.ok(log[0].em, 'esperava um horario registrado');
});

test('venda que passa (ok:true) NAO grava nada no log de falhas', async () => {
  pdvWeb._resetLogFalhasParaTeste();
  await pdvWeb.tratarFinalizarVenda({
    body: { empresa: 'Tudo de Filtro' }, username: 'edson', dbReady: true, users: USERS_FAKE,
    finalizarVenda: async () => ({ ok: true, vendaId: 'v1' }),
  });
  assert.strictEqual(pdvWeb._obterLogFalhasParaTeste().length, 0);
});

// MUTAÇÃO-ALVO: se o log passasse a gravar o `body` inteiro (em vez dos
// campos específicos operador/empresa/etapa/mensagem), a senha do autorizador
// vazaria pro log do servidor — o mesmo tipo de vazamento que a suíte de
// bi-pdv.js já trava pro livro-razão.
test('a SENHA do autorizador NUNCA aparece no log de falha, mesmo vindo dentro do body', async () => {
  pdvWeb._resetLogFalhasParaTeste();
  await pdvWeb.tratarFinalizarVenda({
    body: {
      empresa: 'Tudo de Filtro',
      autorizacao: { usuario: 'paulo', senha: 'SENHA-SECRETA-999' },
    },
    username: 'edson', dbReady: true, users: USERS_FAKE,
    finalizarVenda: async () => ({ ok: false, etapa: 'autorizacao-desconto', erro: 'senha do autorizador incorreta' }),
  });
  const log = pdvWeb._obterLogFalhasParaTeste();
  assert.strictEqual(log.length, 1);
  assert.doesNotMatch(JSON.stringify(log), /SENHA-SECRETA-999/, 'a senha do autorizador vazou pro log de falha');
});

test('log de falha sem empresa/operador nao lanca, usa marcadores neutros', async () => {
  pdvWeb._resetLogFalhasParaTeste();
  await pdvWeb.tratarFinalizarVenda({
    body: {}, username: undefined, dbReady: true, users: USERS_FAKE,
    finalizarVenda: async () => ({ ok: false, erro: 'sem itens' }),
  });
  const log = pdvWeb._obterLogFalhasParaTeste();
  assert.strictEqual(log.length, 1);
  assert.ok(log[0].operador);
  assert.ok(log[0].empresa);
  assert.ok(log[0].etapa);
});

test('tentativa com senha CERTA nao fica no log nem consome o limite', () => {
  pdvWeb._resetTentativasParaTeste();
  const r = pdvWeb.verificarAutorizacaoDescontoComLimite('edson', { usuario: 'paulo', senha: 'TDF@2026' }, USERS_FAKE);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(pdvWeb._obterLogTentativasParaTeste().length, 0);
  // confirma que o limite nao foi consumido: dá pra errar LIMITE_TENTATIVAS
  // vezes DEPOIS de um acerto sem já nascer bloqueado
  for (let i = 0; i < pdvWeb.LIMITE_TENTATIVAS - 1; i++) {
    const errado = pdvWeb.verificarAutorizacaoDescontoComLimite('edson', { usuario: 'paulo', senha: 'chute' + i }, USERS_FAKE);
    assert.strictEqual(errado.ok, false);
    assert.doesNotMatch(errado.erro, /muitas tentativas|limite/i);
  }
});

// ===========================================================================
// tratarConsultaCnpj — handler INTEIRO de /pdv/api/cnpj/:cnpj (Tarefa:
// autopreenchimento de cliente novo pelo CNPJ, pedido do dono depois de usar
// o PDV). MESMA consulta (BrasilAPI + fallback publica.cnpj.ws + cache) que
// /bi-financeiro/api/cnpj/:cnpj usa — atrás de requireBIRole, papel que o
// operador de loja NÃO tem — mas aqui liberada pro PDV (loja/closer/admin).
// `consultarCnpj` é injetada (nunca a rede de verdade): dá pra afirmar sobre
// a CARGA que a função manda pra dependência (o CNPJ só-dígitos), não sobre
// o que o dublê decide devolver.
//
// MUTAÇÕES alvo:
//  1) trocar `if (!isPdvRole(role))` por algo que sempre deixa passar (ou
//     remover o `return`) — o teste de papel abaixo quebra: consultarCnpj
//     seria chamada mesmo por um papel fora de PDV_ROLES.
//  2) trocar o `try/catch` por uma chamada direta a `consultarCnpj` (sem
//     captura) — o teste de "consulta falha, não trava" quebra: a promise
//     rejeitada propagaria em vez de virar {status:200, json:{ok:false,...}}.
//  3) remover `avaliarSituacaoCadastral`/o merge de `alertaSituacao` na
//     resposta — o teste de situação irregular quebra: a resposta não
//     carregaria mais o aviso.
// ===========================================================================

const USERS_PDV_FAKE = {
  edson: { password: 'edson2026', name: 'Edson', role: 'loja' },      // tem papel de PDV
  paulo: { password: 'TDF@2026', name: 'Paulo', role: 'admin' },      // tem papel de PDV
  raissa: { password: 'x', name: 'Raissa', role: 'posvenda' },        // NAO tem papel de PDV
};

test('tratarConsultaCnpj recusa quem NAO tem papel de PDV, com 403, SEM chamar a consulta', async () => {
  let chamado = false;
  const r = await pdvWeb.tratarConsultaCnpj({
    cnpj: '11222333000181', username: 'raissa', users: USERS_PDV_FAKE,
    consultarCnpj: async (digits) => { chamado = true; return { status: 200, json: { ok: true, situacao: 'ATIVA' } }; },
  });
  assert.strictEqual(r.status, 403);
  assert.strictEqual(r.json.ok, false);
  assert.strictEqual(chamado, false, 'papel fora de PDV_ROLES nunca pode chegar a consultar a Receita');
});

test('tratarConsultaCnpj aceita quem TEM papel de PDV (loja) e manda o CNPJ só-dígitos pra consulta', async () => {
  let cnpjRecebido = null;
  const r = await pdvWeb.tratarConsultaCnpj({
    cnpj: '11.222.333/0001-81', username: 'edson', users: USERS_PDV_FAKE,
    consultarCnpj: async (digits) => { cnpjRecebido = digits; return { status: 200, json: { ok: true, situacao: 'ATIVA', razaoSocial: 'Empresa X' } }; },
  });
  assert.strictEqual(cnpjRecebido, '11222333000181', 'a carga mandada pra consulta tem que ser só dígitos, sem pontuação');
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.ok, true);
});

test('tratarConsultaCnpj devolve 400 sem chamar a consulta quando o CNPJ nao tem 14 digitos', async () => {
  let chamado = false;
  const r = await pdvWeb.tratarConsultaCnpj({
    cnpj: '123', username: 'edson', users: USERS_PDV_FAKE,
    consultarCnpj: async () => { chamado = true; return { status: 200, json: { ok: true } }; },
  });
  assert.strictEqual(r.status, 400);
  assert.strictEqual(chamado, false);
});

test('tratarConsultaCnpj NUNCA trava a venda: consulta que rejeita vira resposta normal (nao propaga excecao)', async () => {
  await assert.doesNotReject(pdvWeb.tratarConsultaCnpj({
    cnpj: '11222333000181', username: 'edson', users: USERS_PDV_FAKE,
    consultarCnpj: async () => { throw new Error('timeout consultando a Receita'); },
  }));
  const r = await pdvWeb.tratarConsultaCnpj({
    cnpj: '11222333000181', username: 'edson', users: USERS_PDV_FAKE,
    consultarCnpj: async () => { throw new Error('timeout consultando a Receita'); },
  });
  assert.strictEqual(r.json.ok, false);
  assert.match(r.json.error, /timeout consultando a Receita/);
  assert.notStrictEqual(r.status, 500, 'falha de consulta nao pode virar erro de servidor — o operador preenche a mao e segue');
});

test('tratarConsultaCnpj avisa quando a situacao cadastral NAO e ATIVA, sem bloquear (ok continua true)', async () => {
  const r = await pdvWeb.tratarConsultaCnpj({
    cnpj: '11222333000181', username: 'edson', users: USERS_PDV_FAKE,
    consultarCnpj: async () => ({ status: 200, json: { ok: true, situacao: 'BAIXADA', razaoSocial: 'Empresa Baixada' } }),
  });
  assert.strictEqual(r.json.ok, true, 'CNPJ irregular nao bloqueia a venda, so avisa');
  assert.strictEqual(r.json.situacaoIrregular, true);
  assert.match(r.json.alertaSituacao, /BAIXADA/);
  assert.match(r.json.alertaSituacao, /nota fiscal/i);
});

test('tratarConsultaCnpj NAO avisa quando a situacao cadastral e ATIVA', async () => {
  const r = await pdvWeb.tratarConsultaCnpj({
    cnpj: '11222333000181', username: 'edson', users: USERS_PDV_FAKE,
    consultarCnpj: async () => ({ status: 200, json: { ok: true, situacao: 'Ativa', razaoSocial: 'Empresa OK' } }),
  });
  assert.strictEqual(r.json.situacaoIrregular, false);
  assert.strictEqual(r.json.alertaSituacao, null);
});

test('tratarConsultaCnpj propaga erro (CNPJ nao encontrado) sem inventar aviso de situacao', async () => {
  const r = await pdvWeb.tratarConsultaCnpj({
    cnpj: '11222333000181', username: 'edson', users: USERS_PDV_FAKE,
    consultarCnpj: async () => ({ status: 404, json: { ok: false, error: 'CNPJ não encontrado' } }),
  });
  assert.strictEqual(r.status, 404);
  assert.strictEqual(r.json.ok, false);
  assert.strictEqual(r.json.alertaSituacao, undefined);
});

test('avaliarSituacaoCadastral: ATIVA (com variação de caixa/acento) nao gera alerta', () => {
  assert.deepStrictEqual(pdvWeb.avaliarSituacaoCadastral('ATIVA'), { irregular: false, alerta: null });
  assert.deepStrictEqual(pdvWeb.avaliarSituacaoCadastral('ativa'), { irregular: false, alerta: null });
  assert.deepStrictEqual(pdvWeb.avaliarSituacaoCadastral('Ativa'), { irregular: false, alerta: null });
});

test('avaliarSituacaoCadastral: baixada, inapta, suspensa geram alerta com o texto da situacao', () => {
  for (const s of ['BAIXADA', 'INAPTA', 'SUSPENSA', 'NULA']) {
    const r = pdvWeb.avaliarSituacaoCadastral(s);
    assert.strictEqual(r.irregular, true);
    assert.match(r.alerta, new RegExp(s));
  }
});

test('avaliarSituacaoCadastral: sem dado nenhum (consulta falhou) nao inventa alerta', () => {
  assert.deepStrictEqual(pdvWeb.avaliarSituacaoCadastral(''), { irregular: false, alerta: null });
  assert.deepStrictEqual(pdvWeb.avaliarSituacaoCadastral(undefined), { irregular: false, alerta: null });
  assert.deepStrictEqual(pdvWeb.avaliarSituacaoCadastral(null), { irregular: false, alerta: null });
});

// ===========================================================================
// tratarClienteOmie — handler INTEIRO de /pdv/api/cliente-omie (endereço do
// cliente existente, pedido do dono depois de usar o PDV — print de tela: o
// bloco de endereço sumia por completo ao selecionar um cliente já
// cadastrado). `buscarClienteOmie` é injetada (nunca a rede de verdade): dá
// pra afirmar sobre a CARGA que a função manda pra dependência (empresa,
// doc só-dígitos, telefone só-dígitos), não sobre o que o dublê decide
// devolver.
//
// MUTAÇÕES alvo:
//  1) remover a checagem de `empresa` — o teste de "sem empresa" quebra:
//     buscarClienteOmie seria chamada mesmo sem saber qual conta do Omie
//     consultar.
//  2) trocar o `try/catch` por uma chamada direta a `buscarClienteOmie`
//     (sem captura) — o teste de "consulta falha, nao trava" quebra: a
//     promise rejeitada propagaria em vez de virar {status:200,
//     json:{ok:false,...}}.
// ===========================================================================

test('tratarClienteOmie devolve 400 sem chamar a busca quando falta empresa', async () => {
  let chamado = false;
  const r = await pdvWeb.tratarClienteOmie({
    query: { doc: '12345678909' },
    buscarClienteOmie: async () => { chamado = true; return { encontrado: false }; },
  });
  assert.strictEqual(r.status, 400);
  assert.strictEqual(r.json.ok, false);
  assert.strictEqual(chamado, false);
});

test('tratarClienteOmie devolve 400 sem chamar a busca quando nao ha doc nem telefone', async () => {
  let chamado = false;
  const r = await pdvWeb.tratarClienteOmie({
    query: { empresa: 'Tudo de Filtro' },
    buscarClienteOmie: async () => { chamado = true; return { encontrado: false }; },
  });
  assert.strictEqual(r.status, 400);
  assert.strictEqual(chamado, false);
});

test('tratarClienteOmie manda empresa e doc/telefone SO-DIGITOS pra busca, e devolve a ficha', async () => {
  let recebido = null;
  const r = await pdvWeb.tratarClienteOmie({
    query: { empresa: 'Tudo de Filtro', doc: '123.456.789-09', telefone: '(12) 99999-8888' },
    buscarClienteOmie: async (empresa, args) => {
      recebido = { empresa, ...args };
      return { encontrado: true, endereco: 'Rua X', codigoClienteOmie: 42 };
    },
  });
  assert.strictEqual(recebido.empresa, 'Tudo de Filtro');
  assert.strictEqual(recebido.cpf, '12345678909');
  assert.strictEqual(recebido.telefone, '12999998888');
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.ok, true);
  assert.strictEqual(r.json.encontrado, true);
  assert.strictEqual(r.json.endereco, 'Rua X');
});

test('tratarClienteOmie devolve encontrado:false repassado do dublê quando o cliente nao existe', async () => {
  const r = await pdvWeb.tratarClienteOmie({
    query: { empresa: 'Tudo de Filtro', telefone: '5512999997777' },
    buscarClienteOmie: async () => ({ encontrado: false }),
  });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.json.ok, true);
  assert.strictEqual(r.json.encontrado, false);
});

test('tratarClienteOmie NUNCA trava a venda: falha na busca vira resposta normal (nao propaga excecao)', async () => {
  await assert.doesNotReject(pdvWeb.tratarClienteOmie({
    query: { empresa: 'Tudo de Filtro', telefone: '5512999997777' },
    buscarClienteOmie: async () => { throw new Error('omie fora do ar'); },
  }));
  const r = await pdvWeb.tratarClienteOmie({
    query: { empresa: 'Tudo de Filtro', telefone: '5512999997777' },
    buscarClienteOmie: async () => { throw new Error('omie fora do ar'); },
  });
  assert.strictEqual(r.json.ok, false);
  assert.match(r.json.error, /omie fora do ar/);
  assert.notStrictEqual(r.status, 500, 'falha na consulta nao pode virar erro de servidor — o operador confere/preenche a mao e segue');
});
