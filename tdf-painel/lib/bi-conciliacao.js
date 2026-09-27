// lib/bi-conciliacao.js — Conciliação bancária OFX/CSV vs extrato interno
//
// Parse OFX (SGML legacy típico de banco BR — Itaú, BB, Sicoob, Bradesco, Santander).
// Parse CSV com autodetect de separador (vírgula, ponto-e-vírgula, tab).
// Match vs data/bi-extratos.json por valor exato + data ±3 dias + tipo (entrada/saída).
// Retorna 3 listas: conciliados, pendentesBanco (OFX sem match interno), pendentesSistema.

const fs = require('fs');
const path = require('path');
const bancos = require('./bi-bancos');
const pagamentos = require('./bi-pagamentos'); // pra audit

const DATA_DIR = path.join(__dirname, '..', 'data');
const RECONCILED = path.join(DATA_DIR, 'bi-conciliados.json'); // { extratoEntryId: { ofxTxId, conciliadoEm, conciliadoPor } }

function _loadConciliados() {
  try { return JSON.parse(fs.readFileSync(RECONCILED,'utf8')); } catch(_) { return {}; }
}
function _saveConciliados(o) {
  try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(RECONCILED, JSON.stringify(o, null, 2)); }
  catch(_){}
}

// === PARSE OFX ===
// Formato: cada transação é <STMTTRN>...</STMTTRN> com TRNTYPE, DTPOSTED, TRNAMT, FITID, MEMO/NAME
// Datas vêm como YYYYMMDD ou YYYYMMDDHHMMSS[-3:GMT]
function parseOFX(text) {
  if (!text || typeof text !== 'string') return [];
  const txs = [];
  const blocks = text.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi) || [];
  for (const block of blocks) {
    const get = (tag) => {
      // OFX SGML: <TAG>value\n  (sem closing tag) ou <TAG>value</TAG>
      const m = block.match(new RegExp(`<${tag}>\\s*([^<\\r\\n]+)`, 'i'));
      return m ? m[1].trim() : '';
    };
    const trnType = get('TRNTYPE').toUpperCase();      // CREDIT|DEBIT|...
    const dtRaw   = get('DTPOSTED').slice(0,8);         // YYYYMMDD
    const amount  = parseFloat(get('TRNAMT')) || 0;
    const fitId   = get('FITID');
    const memo    = get('MEMO') || get('NAME') || '';
    if (!dtRaw || isNaN(amount) || amount === 0) continue;
    const data = `${dtRaw.slice(0,4)}-${dtRaw.slice(4,6)}-${dtRaw.slice(6,8)}`;
    txs.push({
      ofxTxId: fitId || `${dtRaw}_${amount.toFixed(2)}_${memo.slice(0,20)}`,
      data,
      valor: Math.abs(amount),
      tipo: amount < 0 || trnType === 'DEBIT' ? 'saida' : 'entrada',
      descricao: memo,
      raw: { trnType, amount, fitId },
    });
  }
  return txs;
}

// === PARSE CSV ===
// Autodetect separador (; , \t). Espera colunas: data, valor, descrição.
// Aceita variações: dd/mm/yyyy ou yyyy-mm-dd; valor com vírgula ou ponto; sinal de tipo.
function parseCSV(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return [];
  // Detect separator pelo primeiro non-header line
  const sep = lines[0].includes(';') ? ';' : (lines[0].includes('\t') ? '\t' : ',');
  // Detect header
  const headerCandidate = lines[0].toLowerCase();
  const hasHeader = /data|date|hist|valor|amount|descri/.test(headerCandidate);
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const txs = [];
  for (const line of dataLines) {
    const cols = line.split(sep).map(c => c.trim().replace(/^"|"$/g,''));
    if (cols.length < 2) continue;
    // Heurística: 1ª coluna data, 2ª valor, 3ª+ descrição
    let dataRaw = cols[0];
    let valorRaw = cols[1];
    let memo = cols.slice(2).join(' · ').trim();
    // Se 1ª col não parece data e 2ª sim, troca
    if (!/^\d/.test(dataRaw) && /^\d/.test(cols[2]||'')) {
      dataRaw = cols[2]; valorRaw = cols[3]||'0'; memo = cols[0]+' '+cols[1];
    }
    // Parse data
    let data = '';
    let m = dataRaw.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})$/);
    if (m) data = `${m[1]}-${m[2]}-${m[3]}`;
    else { m = dataRaw.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})$/); if (m) data = `${m[3]}-${m[2]}-${m[1]}`; }
    if (!data) continue;
    // Parse valor (BR: 1.234,56 ou 1234,56; EN: 1,234.56 ou 1234.56)
    let v = valorRaw.replace(/\s/g, '');
    if (v.includes(',') && v.includes('.')) {
      // Se tem ambos, o último separador é decimal
      if (v.lastIndexOf(',') > v.lastIndexOf('.')) v = v.replace(/\./g,'').replace(',','.');
      else v = v.replace(/,/g,'');
    } else if (v.includes(',')) {
      v = v.replace(',','.');
    }
    const amount = parseFloat(v);
    if (isNaN(amount) || amount === 0) continue;
    txs.push({
      ofxTxId: `csv_${data}_${amount.toFixed(2)}_${(memo||'').slice(0,20)}`.replace(/\s/g,'_'),
      data,
      valor: Math.abs(amount),
      tipo: amount < 0 ? 'saida' : 'entrada',
      descricao: memo,
      raw: { amount },
    });
  }
  return txs;
}

// Auto-detecta formato. Se começar com 'OFXHEADER' ou tiver <OFX>, é OFX.
function parseAuto(text) {
  if (!text) return { formato:'desconhecido', txs: [] };
  if (/OFXHEADER|<OFX>/i.test(text.slice(0, 500))) {
    return { formato:'ofx', txs: parseOFX(text) };
  }
  return { formato:'csv', txs: parseCSV(text) };
}

// === MATCH ===
// Compara transações do banco com extrato interno da conta.
// Critério: mesmo tipo + mesmo valor (tolerância 0.01) + data ±3 dias.
function match(txsBanco, contaId) {
  const extratoSistema = bancos.listExtrato(contaId, { limit: 5000 }) || [];
  const conciliadosFile = _loadConciliados();
  const conciliados = [];
  const pendentesBanco = [];
  const usadosSistema = new Set();
  // Já pré-conciliados (de cargas anteriores)
  for (const e of extratoSistema) {
    if (conciliadosFile[e.id]) usadosSistema.add(e.id);
  }

  function diffDias(d1, d2) { return Math.abs((new Date(d1) - new Date(d2)) / 86400000); }

  for (const tx of txsBanco) {
    let melhor = null;
    for (const e of extratoSistema) {
      if (usadosSistema.has(e.id)) continue;
      if (e.tipo !== tx.tipo) continue;
      if (Math.abs(Number(e.valor) - tx.valor) > 0.01) continue;
      const d = diffDias((e.data||'').slice(0,10), tx.data);
      if (d > 3) continue;
      if (!melhor || d < melhor.diff) melhor = { entry: e, diff: d };
    }
    if (melhor) {
      conciliados.push({ ofxTx: tx, sistemaEntry: melhor.entry, diffDias: melhor.diff, jaConfirmado: !!conciliadosFile[melhor.entry.id] });
      usadosSistema.add(melhor.entry.id);
    } else {
      pendentesBanco.push(tx);
    }
  }
  // Sistema sem match
  const pendentesSistema = extratoSistema.filter(e => !usadosSistema.has(e.id) && !conciliadosFile[e.id]);

  return {
    contaId,
    totalBanco: txsBanco.length,
    totalSistema: extratoSistema.length,
    conciliados,
    pendentesBanco,
    pendentesSistema,
    saldoBanco: txsBanco.reduce((s,tx) => s + (tx.tipo==='entrada' ? tx.valor : -tx.valor), 0),
    saldoSistema: extratoSistema.reduce((s,e) => s + (e.tipo==='entrada' ? Number(e.valor) : -Number(e.valor)), 0),
  };
}

// Confirma match (marca extratoEntryId como conciliado com ofxTxId)
function confirmarMatch(extratoEntryId, ofxTxId, who) {
  const map = _loadConciliados();
  map[extratoEntryId] = {
    ofxTxId,
    conciliadoEm: new Date().toISOString(),
    conciliadoPor: who || 'admin',
  };
  _saveConciliados(map);
  pagamentos.audit({ tipo:'conciliacao-confirmada', extratoEntryId, ofxTxId, usuario: who });
  return { ok:true };
}

function quebrarMatch(extratoEntryId, who) {
  const map = _loadConciliados();
  if (!map[extratoEntryId]) return { ok:false, error:'não estava conciliado' };
  delete map[extratoEntryId];
  _saveConciliados(map);
  pagamentos.audit({ tipo:'conciliacao-quebrada', extratoEntryId, usuario: who });
  return { ok:true };
}

// Importa transação OFX/CSV pendente como movimento avulso no extrato interno.
// Útil quando aparece no banco algo que ainda não foi cadastrado como pagamento/recebimento.
function importarComoMovimento(tx, contaId, who) {
  if (!tx || !contaId) return { ok:false, error:'parâmetros inválidos' };
  const fn = tx.tipo === 'entrada' ? bancos.creditar : bancos.debitar;
  const ref = {
    descricao: '[OFX] ' + (tx.descricao || 'Importado do extrato bancário'),
    refTipo: 'ajuste-manual',
    refId: tx.ofxTxId,
    obs: `Data OFX: ${tx.data} · valor: ${tx.valor.toFixed(2)} · tipo: ${tx.tipo}`,
  };
  const r = fn(contaId, tx.valor, ref, who);
  if (!r.ok) return r;
  // Marca como conciliado (já que veio do banco)
  confirmarMatch(r.entry.id, tx.ofxTxId, who);
  pagamentos.audit({ tipo:'conciliacao-importada', contaId, ofxTxId: tx.ofxTxId, valor: tx.valor, usuario: who });
  return { ok:true, entry: r.entry, novoSaldo: r.novoSaldo };
}

module.exports = {
  parseOFX, parseCSV, parseAuto,
  match, confirmarMatch, quebrarMatch, importarComoMovimento,
};
