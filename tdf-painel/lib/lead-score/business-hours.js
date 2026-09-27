/**
 * Lead Score — Horário comercial e bump pra próxima janela útil.
 *
 * Config default TDF:
 *   Seg-Sex 09:00-18:00
 *   Sáb 09:00-13:00 (meio período — memory: time bebedouro tem sábado parcial)
 *   Dom — sem expediente
 *
 * Override por settings.business_hours no banco (futuro).
 *
 * Função principal:
 *   bumpToBusinessHours(date)  → Date  (mesmo se já estiver dentro)
 *
 * Quando a data cai fora da janela:
 *   antes do start → mesmo dia, no start
 *   depois do end  → próximo dia útil, no start
 *   fim de semana  → próximo dia útil, no start
 */

const DEFAULT_BUSINESS_HOURS = {
  // 0=Domingo ... 6=Sábado
  0: null,
  1: { startH: 9,  startM: 0, endH: 18, endM: 0 }, // Seg
  2: { startH: 9,  startM: 0, endH: 18, endM: 0 }, // Ter
  3: { startH: 9,  startM: 0, endH: 18, endM: 0 }, // Qua
  4: { startH: 9,  startM: 0, endH: 18, endM: 0 }, // Qui
  5: { startH: 9,  startM: 0, endH: 18, endM: 0 }, // Sex
  6: { startH: 9,  startM: 0, endH: 13, endM: 0 }, // Sáb
};

let _CFG = DEFAULT_BUSINESS_HOURS;
function setBusinessHours(cfg) { _CFG = cfg || DEFAULT_BUSINESS_HOURS; }
function getBusinessHours() { return _CFG; }

function _isInWindow(date) {
  const dow = date.getDay();
  const cfg = _CFG[dow];
  if (!cfg) return false;
  const h = date.getHours();
  const m = date.getMinutes();
  const cur = h * 60 + m;
  const start = cfg.startH * 60 + cfg.startM;
  const end = cfg.endH * 60 + cfg.endM;
  return cur >= start && cur < end;
}

function _windowStart(date) {
  const dow = date.getDay();
  const cfg = _CFG[dow];
  if (!cfg) return null;
  const d = new Date(date);
  d.setHours(cfg.startH, cfg.startM, 0, 0);
  return d;
}

function _windowEnd(date) {
  const dow = date.getDay();
  const cfg = _CFG[dow];
  if (!cfg) return null;
  const d = new Date(date);
  d.setHours(cfg.endH, cfg.endM, 0, 0);
  return d;
}

/**
 * Retorna data ajustada pra próxima janela comercial. Se já estiver dentro,
 * retorna a própria. Se estiver antes do start do dia útil, vai pro start.
 * Se estiver depois do end ou em dia não-útil, vai pro próximo dia útil
 * no start dele.
 *
 * Limite: avança até 14 dias pra evitar loop infinito em config quebrada.
 */
function bumpToBusinessHours(date) {
  if (!(date instanceof Date)) date = new Date(date);
  if (_isInWindow(date)) return date;

  // Caso 1: dia útil, mas antes do start
  const ws = _windowStart(date);
  if (ws && date < ws) return ws;

  // Caso 2: dia útil, mas após o end → próximo dia útil
  // Caso 3: dia não útil → próximo dia útil
  for (let i = 1; i <= 14; i++) {
    const next = new Date(date);
    next.setDate(next.getDate() + i);
    const cfg = _CFG[next.getDay()];
    if (cfg) {
      next.setHours(cfg.startH, cfg.startM, 0, 0);
      return next;
    }
  }
  return date; // fallback impossível
}

function isBusinessHours(date) {
  return _isInWindow(date instanceof Date ? date : new Date(date));
}

/**
 * Conta minutos úteis entre 2 datas (descontando fim de semana e horário fora
 * da janela). Útil pra alertar atraso de tarefa em horas úteis.
 */
function businessMinutesBetween(from, to) {
  if (!(from instanceof Date)) from = new Date(from);
  if (!(to instanceof Date)) to = new Date(to);
  if (to <= from) return 0;
  let total = 0;
  const cursor = new Date(from);
  let safety = 0;
  while (cursor < to && safety < 1000) {
    safety++;
    const dow = cursor.getDay();
    const cfg = _CFG[dow];
    if (!cfg) {
      // pula pro próximo dia 00:00
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }
    const dayStart = new Date(cursor); dayStart.setHours(cfg.startH, cfg.startM, 0, 0);
    const dayEnd = new Date(cursor); dayEnd.setHours(cfg.endH, cfg.endM, 0, 0);
    const effStart = cursor > dayStart ? cursor : dayStart;
    const effEnd = to < dayEnd ? to : dayEnd;
    if (effEnd > effStart) total += Math.round((effEnd - effStart) / 60000);
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
  }
  return total;
}

module.exports = {
  setBusinessHours,
  getBusinessHours,
  bumpToBusinessHours,
  isBusinessHours,
  businessMinutesBetween,
  DEFAULT_BUSINESS_HOURS,
};
