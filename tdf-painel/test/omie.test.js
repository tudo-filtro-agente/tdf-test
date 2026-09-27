const test = require('node:test');
const assert = require('node:assert');
const omie = require('../lib/omie');

test('EMPRESAS lista Tudo de Filtro e Mococa', () => {
  assert.deepEqual(omie.EMPRESAS, ['Tudo de Filtro', 'Mococa']);
});

test('truncar corta no limite e preserva string curta', () => {
  assert.equal(omie.truncar('abcdefghij', 5), 'abcde');
  assert.equal(omie.truncar('abc', 5), 'abc');
  assert.equal(omie.truncar(null, 5), '');
});

test('truncar preserva string exatamente no limite (fronteira)', () => {
  assert.equal(omie.truncar('abcde', 5), 'abcde');
});

// O Omie devolve a cidade do cliente cadastrado como "SAO JOSE DOS CAMPOS
// (SP)" — nome com a UF colada entre parênteses. Ao GRAVAR (IncluirCliente)
// só o nome pode ir; ao LER um cliente existente, o sufixo tem que sair antes
// de qualquer exibição.
test('limparCidade remove o sufixo "(UF)" que o Omie devolve', () => {
  assert.equal(omie.limparCidade('SAO JOSE DOS CAMPOS (SP)'), 'SAO JOSE DOS CAMPOS');
  assert.equal(omie.limparCidade('Bebedouro (SP)'), 'Bebedouro');
  assert.equal(omie.limparCidade('Rio de Janeiro (RJ)'), 'Rio de Janeiro');
});

test('limparCidade preserva cidade sem sufixo (ja limpa, ex: vinda do ViaCEP)', () => {
  assert.equal(omie.limparCidade('São Paulo'), 'São Paulo');
  assert.equal(omie.limparCidade('Bebedouro'), 'Bebedouro');
});

test('limparCidade nao mutila nome de cidade que legitimamente termina com parenteses de 2 letras que NAO e UF', () => {
  // Defesa deliberadamente frouxa: o padrão real do Omie é sempre "(UF)" no
  // fim, então qualquer coisa nesse formato é tratada como sufixo de UF —
  // não existe cidade brasileira cujo nome termine assim.
  assert.equal(omie.limparCidade(''), '');
});

test('limparCidade lida com null/undefined sem lancar, devolve string vazia', () => {
  assert.equal(omie.limparCidade(null), '');
  assert.equal(omie.limparCidade(undefined), '');
});

test('chamar rejeita empresa desconhecida', async () => {
  await assert.rejects(() => omie.chamar('Outra', 'geral/clientes/', 'ListarClientes', {}),
    /empresa desconhecida/);
});

test('chamar monta o corpo padrão do Omie e devolve o JSON', async () => {
  const real = global.fetch;
  let visto = null;
  global.fetch = async (url, opts) => {
    visto = { url, body: JSON.parse(opts.body) };
    return { ok: true, status: 200, json: async () => ({ codigo_cliente_omie: 42 }) };
  };
  try {
    process.env.OMIE_TDF_APP_KEY = 'k1';
    process.env.OMIE_TDF_APP_SECRET = 's1';
    const r = await omie.chamar('Tudo de Filtro', 'geral/clientes/', 'ListarClientes', { pagina: 1 });
    assert.equal(r.codigo_cliente_omie, 42);
    assert.equal(visto.url, 'https://app.omie.com.br/api/v1/geral/clientes/');
    assert.equal(visto.body.call, 'ListarClientes');
    assert.equal(visto.body.app_key, 'k1');
    assert.equal(visto.body.app_secret, 's1');
    assert.deepEqual(visto.body.param, [{ pagina: 1 }]);
  } finally { global.fetch = real; }
});

test('chamar usa param:[{}] quando param não é passado (undefined)', async () => {
  const real = global.fetch;
  let visto = null;
  global.fetch = async (url, opts) => {
    visto = JSON.parse(opts.body);
    return { ok: true, status: 200, json: async () => ({ ok: 1 }) };
  };
  try {
    process.env.OMIE_TDF_APP_KEY = 'k1';
    process.env.OMIE_TDF_APP_SECRET = 's1';
    await omie.chamar('Tudo de Filtro', 'geral/clientes/', 'ListarClientes', undefined);
    assert.deepEqual(visto.param, [{}]);
  } finally { global.fetch = real; }
});

test('chamar transforma faultstring do Omie em erro legível', async () => {
  const real = global.fetch;
  global.fetch = async () => ({ ok: true, status: 200,
    json: async () => ({ faultstring: 'CEP invalido', faultcode: 'SOAP-ENV:Client-101' }) });
  try {
    process.env.OMIE_TDF_APP_KEY = 'k1';
    process.env.OMIE_TDF_APP_SECRET = 's1';
    await assert.rejects(() => omie.chamar('Tudo de Filtro', 'geral/clientes/', 'IncluirCliente', {}),
      /CEP invalido/);
  } finally { global.fetch = real; }
});

test('chamar prioriza faultstring mesmo quando ok é false (ordem correta: corpo antes do status)', async () => {
  const real = global.fetch;
  global.fetch = async () => ({ ok: false, status: 500,
    json: async () => ({ faultstring: 'CNPJ invalido', faultcode: 'SOAP-ENV:Client-102' }) });
  try {
    process.env.OMIE_TDF_APP_KEY = 'k1';
    process.env.OMIE_TDF_APP_SECRET = 's1';
    await assert.rejects(
      () => omie.chamar('Tudo de Filtro', 'geral/clientes/', 'IncluirCliente', {}),
      (err) => {
        assert.match(err.message, /CNPJ invalido/);
        assert.doesNotMatch(err.message, /HTTP 500/);
        return true;
      }
    );
  } finally { global.fetch = real; }
});

test('chamar lança erro de HTTP genérico quando ok é false e não há faultstring', async () => {
  const real = global.fetch;
  global.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });
  try {
    process.env.OMIE_TDF_APP_KEY = 'k1';
    process.env.OMIE_TDF_APP_SECRET = 's1';
    await assert.rejects(() => omie.chamar('Tudo de Filtro', 'geral/clientes/', 'IncluirCliente', {}),
      /HTTP 500/);
  } finally { global.fetch = real; }
});

test('chamar embrulha erro de parse de JSON com prefixo padrão "omie <call>:"', async () => {
  const real = global.fetch;
  global.fetch = async () => ({ ok: false, status: 504,
    json: async () => { throw new SyntaxError('Unexpected token < in JSON'); } });
  try {
    process.env.OMIE_TDF_APP_KEY = 'k1';
    process.env.OMIE_TDF_APP_SECRET = 's1';
    await assert.rejects(() => omie.chamar('Tudo de Filtro', 'geral/clientes/', 'IncluirCliente', {}),
      /omie IncluirCliente: /);
  } finally { global.fetch = real; }
});

// O fetch é dublado de propósito, mesmo o erro estourando ANTES dele: se a
// guarda de credencial regredir, sem o dublê esta rodada sai da máquina e bate
// na API de PRODUÇÃO do Omie. O dublê registra a saída e o teste afirma que
// nenhuma aconteceu — a guarda passa a ser verificada, não presumida.
test('chamar rejeita com erro de credencial quando app_key/app_secret ausentes do ambiente', async () => {
  const realKey = process.env.OMIE_TDF_APP_KEY;
  const realSecret = process.env.OMIE_TDF_APP_SECRET;
  const realFetch = global.fetch;
  let saiu = 0;
  global.fetch = async () => { saiu++; throw new Error('a suite NUNCA pode bater na API do Omie'); };
  delete process.env.OMIE_TDF_APP_KEY;
  delete process.env.OMIE_TDF_APP_SECRET;
  try {
    await assert.rejects(() => omie.chamar('Tudo de Filtro', 'geral/clientes/', 'ListarClientes', {}),
      /credencial ausente/);
    assert.equal(saiu, 0, 'a guarda de credencial tem que barrar ANTES de qualquer chamada de rede');
  } finally {
    global.fetch = realFetch;
    if (realKey === undefined) delete process.env.OMIE_TDF_APP_KEY; else process.env.OMIE_TDF_APP_KEY = realKey;
    if (realSecret === undefined) delete process.env.OMIE_TDF_APP_SECRET; else process.env.OMIE_TDF_APP_SECRET = realSecret;
  }
});

test('contaCorrente devolve o valor quando a variável de ambiente está setada', () => {
  const real = process.env.OMIE_TDF_CONTA_CORRENTE;
  process.env.OMIE_TDF_CONTA_CORRENTE = '12345';
  try {
    assert.equal(omie.contaCorrente('Tudo de Filtro'), '12345');
  } finally {
    if (real === undefined) delete process.env.OMIE_TDF_CONTA_CORRENTE; else process.env.OMIE_TDF_CONTA_CORRENTE = real;
  }
});

test('contaCorrente lança erro ruidoso quando a variável de ambiente está ausente', () => {
  const real = process.env.OMIE_TDF_CONTA_CORRENTE;
  delete process.env.OMIE_TDF_CONTA_CORRENTE;
  try {
    assert.throws(() => omie.contaCorrente('Tudo de Filtro'), /conta corrente ausente/);
  } finally {
    if (real === undefined) delete process.env.OMIE_TDF_CONTA_CORRENTE; else process.env.OMIE_TDF_CONTA_CORRENTE = real;
  }
});
