// Smoke tests — lib/zoho.js
// Roda com: npm test  (ou node --test test/zoho.test.js)
// Não bate em Zoho real — apenas verifica state machine + interface

const test = require('node:test');
const assert = require('node:assert');

// Mock fetch global pra não bater na API real
const realFetch = global.fetch;

test('lib/zoho exporta interface esperada', () => {
  const zoho = require('../lib/zoho');
  assert.equal(typeof zoho.getToken, 'function');
  assert.equal(typeof zoho.fetch, 'function');
  assert.equal(typeof zoho.search, 'function');
  assert.equal(typeof zoho.getDeal, 'function');
  assert.equal(typeof zoho.updateDeal, 'function');
  assert.equal(typeof zoho.createDeal, 'function');
  assert.equal(typeof zoho.searchByPhone, 'function');
  assert.equal(typeof zoho.addTags, 'function');
  assert.equal(typeof zoho.stats, 'function');
  assert.equal(zoho.BASE, 'https://www.zohoapis.com/crm/v6');
});

test('zoho.stats() retorna shape correto', () => {
  const zoho = require('../lib/zoho');
  const s = zoho.stats();
  assert.equal(typeof s.hasToken, 'boolean');
  assert.equal(typeof s.expiresIn, 'number');
  assert.equal(typeof s.inFlight, 'boolean');
  assert.equal(typeof s.cooldownActive, 'boolean');
});

test('zoho.getToken() retorna string vazia sem credenciais', async () => {
  // Limpa env temporariamente
  const r = process.env.ZOHO_REFRESH_TOKEN;
  const c = process.env.ZOHO_CLIENT_ID;
  const s = process.env.ZOHO_CLIENT_SECRET;
  delete process.env.ZOHO_REFRESH_TOKEN;
  delete process.env.ZOHO_CLIENT_ID;
  delete process.env.ZOHO_CLIENT_SECRET;
  // Reload module pra pegar env limpa
  delete require.cache[require.resolve('../lib/zoho')];
  const zoho = require('../lib/zoho');
  const tok = await zoho.getToken();
  assert.equal(tok, '');
  // Restaura
  if (r) process.env.ZOHO_REFRESH_TOKEN = r;
  if (c) process.env.ZOHO_CLIENT_ID = c;
  if (s) process.env.ZOHO_CLIENT_SECRET = s;
});

test('zoho.searchByPhone com phone vazio retorna []', async () => {
  const zoho = require('../lib/zoho');
  const r = await zoho.searchByPhone('');
  assert.deepEqual(r, []);
});
