// Smoke tests — calcDecayScore (Sales #4)
// Verifica que score reflete sinais de risco como esperado.
// Não importa server.js inteiro (que abre porta) — re-implementa função pra testar o algoritmo.

const test = require('node:test');
const assert = require('node:assert');

// Cópia da função do server.js — se mudar lá, atualizar aqui
function calcDecayScore(deal, metaCli, watiInboxEntry, hasFutureTask) {
  const now = Date.now();
  let score = 0;
  if (watiInboxEntry?.ultimaClienteTs) {
    const dias = (now - watiInboxEntry.ultimaClienteTs) / 86400000;
    if (dias >= 14) score += 30;
    else if (dias >= 7) score += 20;
    else if (dias >= 3) score += 10;
  } else {
    score += 25;
  }
  if (watiInboxEntry?.ultimaNossaTs) {
    const dias = (now - watiInboxEntry.ultimaNossaTs) / 86400000;
    if (dias >= 7) score += 20;
    else if (dias >= 4) score += 12;
    else if (dias >= 2) score += 6;
  } else {
    score += 18;
  }
  if (deal.Last_Activity_Time) {
    const dias = (now - new Date(deal.Last_Activity_Time).getTime()) / 86400000;
    if (dias >= 14) score += 20;
    else if (dias >= 7) score += 12;
    else if (dias >= 3) score += 5;
  } else if (deal.Modified_Time) {
    const dias = (now - new Date(deal.Modified_Time).getTime()) / 86400000;
    if (dias >= 14) score += 18;
    else if (dias >= 7) score += 10;
  }
  if (!hasFutureTask) score += 15;
  if (deal.Created_Time) {
    const dias = (now - new Date(deal.Created_Time).getTime()) / 86400000;
    if (dias >= 60) score += 15;
    else if (dias >= 30) score += 10;
    else if (dias >= 14) score += 5;
  }
  return Math.min(100, score);
}

const HOJE = Date.now();
const dias = n => HOJE - n * 86400000;

test('Deal saudável (sem sinais ruins) tem score baixo', () => {
  const score = calcDecayScore(
    { Last_Activity_Time: new Date(dias(1)).toISOString(), Created_Time: new Date(dias(5)).toISOString() },
    {},
    { ultimaClienteTs: dias(1), ultimaNossaTs: dias(0.5) },
    true,
  );
  assert.ok(score < 30, `Deal saudável deveria ter score < 30, got ${score}`);
});

test('Deal abandonado tem score alto (>= 70)', () => {
  const score = calcDecayScore(
    { Last_Activity_Time: new Date(dias(20)).toISOString(), Created_Time: new Date(dias(45)).toISOString() },
    {},
    null,
    false,
  );
  assert.ok(score >= 70, `Deal abandonado deveria ter score >= 70, got ${score}`);
});

test('Cliente que nunca respondeu soma 25 pontos', () => {
  const s1 = calcDecayScore({}, {}, { ultimaClienteTs: HOJE }, true);
  const s2 = calcDecayScore({}, {}, null, true);
  assert.ok(s2 > s1, `score sem cliente (${s2}) deveria ser maior que com cliente (${s1})`);
});

test('Sem tarefa futura adiciona 15 pontos', () => {
  const a = calcDecayScore({}, {}, { ultimaClienteTs: HOJE, ultimaNossaTs: HOJE }, true);
  const b = calcDecayScore({}, {}, { ultimaClienteTs: HOJE, ultimaNossaTs: HOJE }, false);
  assert.equal(b - a, 15, `sem tarefa deveria adicionar exatamente 15 pontos, diff=${b-a}`);
});

test('Score nunca passa de 100', () => {
  const score = calcDecayScore(
    { Last_Activity_Time: new Date(dias(60)).toISOString(), Created_Time: new Date(dias(180)).toISOString() },
    {},
    { ultimaClienteTs: dias(60), ultimaNossaTs: dias(30) },
    false,
  );
  assert.ok(score <= 100, `score não pode passar de 100, got ${score}`);
});
