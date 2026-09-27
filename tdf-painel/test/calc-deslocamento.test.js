// Smoke tests — calcDeslocamento (Catálogo Produtos)
// Função pura, fácil de testar.

const test = require('node:test');
const assert = require('node:assert');

function calcDeslocamento(distKm, regra) {
  if (!regra) regra = { kmGratis: 50, bloco: 50, precoBloco: 100, linear: { ativo: false, precoPorKm: 2 } };
  const km = Math.max(0, distKm);
  if (km <= regra.kmGratis) return { valor: 0, detalhe: `Dentro de ${regra.kmGratis}km — sem cobrança` };
  const excesso = km - regra.kmGratis;
  if (regra.linear?.ativo) {
    const valor = Math.round(excesso * (regra.linear.precoPorKm || 0));
    return { valor, detalhe: `${excesso.toFixed(1)}km extra × R$ ${regra.linear.precoPorKm}/km = R$ ${valor}` };
  }
  const nBlocos = Math.ceil(excesso / regra.bloco);
  const valor = nBlocos * regra.precoBloco;
  return { valor, detalhe: `${nBlocos} bloco(s) de ${regra.bloco}km × R$ ${regra.precoBloco} = R$ ${valor}` };
}

test('Dentro do raio gratuito retorna 0', () => {
  assert.equal(calcDeslocamento(40).valor, 0);
  assert.equal(calcDeslocamento(50).valor, 0);
  assert.equal(calcDeslocamento(0).valor, 0);
});

test('Excesso 37km arredonda pra cima 1 bloco (50km grátis + 50km bloco)', () => {
  // 87km total = 37km excesso = 1 bloco × R$ 100
  assert.equal(calcDeslocamento(87).valor, 100);
});

test('Excesso 51km arredonda pra cima 2 blocos', () => {
  // 101km total = 51km excesso = 2 blocos × R$ 100
  assert.equal(calcDeslocamento(101).valor, 200);
});

test('Modo linear cobra por km exato', () => {
  const r = { kmGratis: 50, linear: { ativo: true, precoPorKm: 2 } };
  // 75km - 50 grátis = 25km × R$ 2 = R$ 50
  assert.equal(calcDeslocamento(75, r).valor, 50);
});

test('Distância negativa trata como 0', () => {
  assert.equal(calcDeslocamento(-10).valor, 0);
});

test('Detalhe contém info útil', () => {
  const r = calcDeslocamento(120);
  assert.match(r.detalhe, /bloco/i);
  assert.match(r.detalhe, /\d+/);
});
