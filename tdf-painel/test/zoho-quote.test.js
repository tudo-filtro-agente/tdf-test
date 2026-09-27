// Testes — lib/zoho.js: as duas escritas do PDV de balcão, createQuote e
// createContact.
//
// createQuote é quem grava o produto vendido no Orçamento (Quote) do Zoho —
// é dali que a fila de manutenção lê o que o cliente comprou. createContact é
// quem faz o cliente do balcão existir como PESSOA no CRM: sem Contato ele
// nunca entra no relógio de troca de refil. Estes testes afirmam sobre a CARGA
// ENVIADA ao fetch (módulo, corpo, trigger, campos), não sobre a resposta que
// o dublê foi programado pra devolver.
//
// Isola process.env / require.cache pra não vazar pros outros arquivos da
// suíte (rodada com `node --test test/*.test.js`).

const test = require('node:test');
const assert = require('node:assert');

const ZOHO_PATH = require.resolve('../lib/zoho');

const ENV_KEYS = ['TDF_ZOHO_WRITES_ENABLED', 'ZOHO_REFRESH_TOKEN', 'ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET'];

function snapshotEnv() {
  const snap = {};
  for (const k of ENV_KEYS) snap[k] = process.env[k];
  return snap;
}

function restoreEnv(snap) {
  for (const k of ENV_KEYS) {
    if (snap[k] === undefined) delete process.env[k];
    else process.env[k] = snap[k];
  }
}

function freshZoho() {
  delete require.cache[ZOHO_PATH];
  return require('../lib/zoho');
}

// Mock de fetch que resolve o oauth token e delega o resto pra `onCall`.
function mockFetchComToken(onCall) {
  return async (url, opts) => {
    const u = String(url);
    if (u.includes('accounts.zoho.com/oauth')) {
      return { ok: true, status: 200, json: async () => ({ access_token: 'tok-fake' }) };
    }
    return onCall(u, opts);
  };
}

test('lib/zoho exporta createQuote', () => {
  const zoho = require('../lib/zoho');
  assert.equal(typeof zoho.createQuote, 'function');
});

// createQuote NAO tem portao de escrita, e isso e simetrico ao createDeal.
// Um portao so no Orcamento dava ILUSAO de protecao: com o createDeal gravando,
// a rodada "protegida" deixava Negocio orfao (sem Orcamento) e, como quoteId
// entra na condicao de 'completa', nenhuma venda jamais chegava a 'completa'.
// A protecao real do PDV e TDF_PDV_MODO_SOMBRA, no orquestrador.
test('createQuote escreve mesmo com TDF_ZOHO_WRITES_ENABLED=0 — nao ha portao, igual ao createDeal', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.TDF_ZOHO_WRITES_ENABLED = '0';
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let vistoUrl = null;
    global.fetch = mockFetchComToken((u) => {
      vistoUrl = u;
      return { ok: true, status: 200, json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'q1' } }] }) };
    });
    const r = await zoho.createQuote({ Subject: 'teste' });
    assert.equal(vistoUrl, 'https://www.zohoapis.com/crm/v6/Quotes');
    assert.equal(r.id, 'q1');
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createQuote envia POST para /Quotes (nao outro modulo)', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let vistoUrl = null;
    let vistoMethod = null;
    global.fetch = mockFetchComToken((u, opts) => {
      vistoUrl = u;
      vistoMethod = opts.method;
      return { ok: true, status: 200, json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'q1' } }] }) };
    });
    await zoho.createQuote({ Subject: 'teste' });
    assert.equal(vistoUrl, 'https://www.zohoapis.com/crm/v6/Quotes');
    assert.equal(vistoMethod, 'POST');
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createQuote inclui trigger: [] no corpo do POST (suprime workflows)', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let vistoBody = null;
    global.fetch = mockFetchComToken((u, opts) => {
      vistoBody = JSON.parse(opts.body);
      return { ok: true, status: 200, json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'q1' } }] }) };
    });
    await zoho.createQuote({ Subject: 'teste' });
    assert.deepEqual(vistoBody.trigger, []);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createQuote manda TODOS os campos recebidos no corpo, sem alterar nem descartar nenhum', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let vistoBody = null;
    global.fetch = mockFetchComToken((u, opts) => {
      vistoBody = JSON.parse(opts.body);
      return { ok: true, status: 200, json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'q1' } }] }) };
    });
    const fields = {
      Subject: 'Venda balcão #42',
      Deal_Name: 'Deal 42',
      Contact_Name: { id: '999' },
      Product_Details: [{ product: { id: '111' }, quantity: 1 }],
    };
    await zoho.createQuote(fields);
    assert.deepEqual(vistoBody.data, [fields]);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createQuote lanca erro quando o Zoho responde com codigo diferente de SUCCESS', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    global.fetch = mockFetchComToken(() => ({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ code: 'INVALID_DATA', message: 'Subject obrigatorio' }] }),
    }));
    await assert.rejects(
      () => zoho.createQuote({ Deal_Name: 'sem subject' }),
      /zoho\.createQuote.*Subject obrigatorio/,
    );
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createQuote lanca erro quando a resposta nao tem data (falha de rede/HTTP)', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    global.fetch = mockFetchComToken(() => ({
      ok: false,
      status: 500,
      json: async () => ({}),
    }));
    await assert.rejects(() => zoho.createQuote({ Subject: 'x' }), /zoho\.createQuote/);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createQuote devolve exatamente { id } do registro criado (nao a resposta crua)', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    global.fetch = mockFetchComToken(() => ({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'quote-abc-123' } }] }),
    }));
    const r = await zoho.createQuote({ Subject: 'x' });
    assert.deepStrictEqual(r, { id: 'quote-abc-123' });
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});


// ===========================================================================
// createContact — o Contato do PDV de balcão
// ===========================================================================
test('lib/zoho exporta createContact', () => {
  const zoho = require('../lib/zoho');
  assert.equal(typeof zoho.createContact, 'function');
});

test('createContact envia POST para /Contacts (nao outro modulo)', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let vistoUrl = null, vistoMethod = null;
    global.fetch = mockFetchComToken((u, opts) => {
      vistoUrl = u; vistoMethod = opts.method;
      return { ok: true, status: 200, json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'c1' } }] }) };
    });
    await zoho.createContact({ Last_Name: 'Fulano' });
    assert.equal(vistoUrl, 'https://www.zohoapis.com/crm/v6/Contacts');
    assert.equal(vistoMethod, 'POST');
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createContact inclui trigger: [] no corpo do POST (suprime workflows)', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let vistoBody = null;
    global.fetch = mockFetchComToken((u, opts) => {
      vistoBody = JSON.parse(opts.body);
      return { ok: true, status: 200, json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'c1' } }] }) };
    });
    await zoho.createContact({ Last_Name: 'Fulano' });
    assert.deepEqual(vistoBody.trigger, []);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createContact manda TODOS os campos recebidos no corpo, sem alterar nem descartar nenhum', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let vistoBody = null;
    global.fetch = mockFetchComToken((u, opts) => {
      vistoBody = JSON.parse(opts.body);
      return { ok: true, status: 200, json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'c1' } }] }) };
    });
    const fields = {
      First_Name: 'Ana', Last_Name: 'Maria Souza',
      Phone: '5512999998888', Mobile: '5512999998888',
      CPF: '12345678909', Mailing_City: 'Bebedouro',
      Account_Name: { id: 'ACC-9' }, Lead_Source: 'Visita na loja',
    };
    await zoho.createContact(fields);
    assert.deepEqual(vistoBody.data, [fields]);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createContact lanca erro quando o Zoho responde com codigo diferente de SUCCESS', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    global.fetch = mockFetchComToken(() => ({
      ok: true, status: 200,
      json: async () => ({ data: [{ code: 'INVALID_DATA', message: 'Last_Name obrigatorio' }] }),
    }));
    await assert.rejects(
      () => zoho.createContact({ Phone: '5512999998888' }),
      /zoho\.createContact.*Last_Name obrigatorio/,
    );
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createContact lanca erro quando a resposta nao tem data (falha de rede/HTTP)', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    global.fetch = mockFetchComToken(() => ({ ok: false, status: 500, json: async () => ({}) }));
    await assert.rejects(() => zoho.createContact({ Last_Name: 'x' }), /zoho\.createContact/);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('createContact devolve exatamente { id } do registro criado (nao a resposta crua)', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    global.fetch = mockFetchComToken(() => ({
      ok: true, status: 200,
      json: async () => ({ data: [{ code: 'SUCCESS', details: { id: 'contact-abc-123' } }] }),
    }));
    const r = await zoho.createContact({ Last_Name: 'x' });
    assert.deepStrictEqual(r, { id: 'contact-abc-123' });
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

// searchModulePhone é a busca que decide entre REUSAR e CRIAR o Contato.
test('searchModulePhone busca no modulo pedido, pelos 9 ultimos digitos do telefone', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let vistoUrl = null;
    global.fetch = mockFetchComToken((u) => {
      vistoUrl = u;
      return { ok: true, status: 200, json: async () => ({ data: [{ id: 'C9' }] }) };
    });
    const r = await zoho.searchModulePhone('Contacts', '5512999998888', 'Last_Name');
    assert.match(vistoUrl, /^https:\/\/www\.zohoapis\.com\/crm\/v6\/Contacts\/search\?phone=999998888/);
    assert.deepEqual(r, [{ id: 'C9' }]);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('searchModulePhone devolve [] no 204 (nenhum registro) — nao lanca', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    global.fetch = mockFetchComToken(() => ({ ok: false, status: 204, json: async () => ({}) }));
    assert.deepEqual(await zoho.searchModulePhone('Contacts', '5512999998888'), []);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});

test('searchModulePhone com telefone vazio nem chama a API', async () => {
  const snap = snapshotEnv();
  const realFetch = global.fetch;
  try {
    process.env.ZOHO_REFRESH_TOKEN = 'r1';
    process.env.ZOHO_CLIENT_ID = 'c1';
    process.env.ZOHO_CLIENT_SECRET = 's1';
    const zoho = freshZoho();
    let chamou = false;
    global.fetch = mockFetchComToken(() => { chamou = true; return { ok: true, status: 200, json: async () => ({}) }; });
    assert.deepEqual(await zoho.searchModulePhone('Contacts', ''), []);
    assert.equal(chamou, false);
  } finally {
    global.fetch = realFetch;
    restoreEnv(snap);
    delete require.cache[ZOHO_PATH];
  }
});
