// lib/bi-recorrencia.js — Gerador automático de pagamentos recorrentes
//
// Modelo: pagamento com `recorrente=true && !geradoDeRecorrencia` (é um template).
// Cópia: novo pagamento (status rascunho) com geradoDeRecorrencia=<modeloId> e competenciaMes='YYYY-MM'.
// Anti-dup: para cada (modeloId, competenciaMes), só pode existir 1 cópia.
//
// O cron diário no server.js chama `rodarRecorrencia()` 1x/dia. UI também tem
// botão "Rodar agora" pro admin testar.

const fs = require('fs');
const path = require('path');
const pagamentos = require('./bi-pagamentos');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LAST_RUN = path.join(DATA_DIR, 'bi-recorrencia-lastrun.json');

function _saveLastRun(payload) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(LAST_RUN, JSON.stringify(payload, null, 2));
  } catch(_){}
}
function getLastRun() {
  try { return JSON.parse(fs.readFileSync(LAST_RUN,'utf8')); } catch(_) { return null; }
}

const competenciaAtual = () => {
  const d = new Date();
  return d.toISOString().slice(0,7); // YYYY-MM em UTC; pra Brasil idem por simplicidade
};

// Calcula o vencimento da cópia: mesmo "dia do mês" do modelo, mas no mês de competência.
// Modelo vencia dia 10 de algum mês → cópia de competência 2026-06 vence 2026-06-10.
// Se o dia não existir no mês alvo (ex: 31/02), usa o último dia do mês.
function _calcVencimento(modeloVencimento, competenciaMes) {
  if (!competenciaMes) return '';
  const [ano, mes] = competenciaMes.split('-').map(Number);
  let dia = 1;
  if (modeloVencimento) {
    const m = String(modeloVencimento).match(/-(\d{2})$/);
    if (m) dia = parseInt(m[1], 10);
  }
  // último dia possível do mês alvo
  const ultimoDia = new Date(ano, mes, 0).getDate();
  if (dia > ultimoDia) dia = ultimoDia;
  return `${ano}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
}

// Encontra modelos (recorrente=true && !geradoDeRecorrencia)
function listarModelos() {
  return Object.values(pagamentos.loadAll())
    .filter(p => p.recorrente === true && !p.geradoDeRecorrencia);
}

// Existe cópia (modeloId, competencia)?
function copiaExistente(modeloId, competenciaMes) {
  return Object.values(pagamentos.loadAll())
    .find(p => p.geradoDeRecorrencia === modeloId && p.competenciaMes === competenciaMes);
}

// Pré-visualiza o que seria gerado se rodasse agora (não cria nada)
function preview(competenciaMes) {
  const comp = competenciaMes || competenciaAtual();
  const modelos = listarModelos();
  const out = [];
  for (const m of modelos) {
    const ja = copiaExistente(m.id, comp);
    out.push({
      modeloId: m.id,
      modeloFornecedor: m.fornecedor,
      modeloValor: m.valor,
      modeloEmpresaBI: m.empresaBI,
      competenciaMes: comp,
      vencimentoCopia: _calcVencimento(m.vencimento, comp),
      jaGerado: !!ja,
      copiaExistenteId: ja?.id || null,
      copiaExistenteStatus: ja?.status || null,
    });
  }
  return { competencia: comp, totalModelos: modelos.length, itens: out };
}

// Roda a geração: cria cópias em rascunho pra cada modelo que ainda não tem cópia do mês.
// Retorna lista do que foi criado.
function rodarRecorrencia(opts = {}) {
  const comp = opts.competenciaMes || competenciaAtual();
  const who = opts.usuario || 'cron-recorrencia';
  const modelos = listarModelos();
  const criados = [];
  const pulados = [];
  for (const m of modelos) {
    const ja = copiaExistente(m.id, comp);
    if (ja) { pulados.push({ modeloId: m.id, motivo: 'já existia', copiaId: ja.id }); continue; }
    // Cria cópia: copia campos editáveis do modelo, marca geradoDeRecorrencia + competenciaMes
    const novoPgto = pagamentos.criar({
      empresaBI: m.empresaBI,
      fornecedor: m.fornecedor,
      categoria: m.categoria,
      descricao: m.descricao + ' · ' + comp,
      valor: m.valor,
      vencimento: _calcVencimento(m.vencimento, comp),
      formaPagamento: m.formaPagamento,
      chavePix: m.chavePix,
      codigoBarras: '', // boleto muda todo mês — não copia
      dadosBancarios: m.dadosBancarios,
      anexoUrl: '',     // anexo é específico de cada mês
      centroCusto: m.centroCusto,
      contaBancariaSugerida: m.contaBancariaSugerida,
      recorrente: false, // cópia NÃO é modelo (não gera filhotes)
      obs: m.obs ? `[Recorrência ${comp}] ${m.obs}` : `[Recorrência ${comp}]`,
    }, who);
    // Marca geradoDeRecorrencia + competenciaMes (campos não-editáveis via .criar)
    const all = pagamentos.loadAll();
    all[novoPgto.id].geradoDeRecorrencia = m.id;
    all[novoPgto.id].competenciaMes = comp;
    pagamentos.saveAll(all);
    pagamentos.audit({ tipo:'recorrencia-gerada', pagamentoId: novoPgto.id, usuario: who, modeloId: m.id, competenciaMes: comp, valor: m.valor });
    criados.push({ modeloId: m.id, copiaId: novoPgto.id, fornecedor: m.fornecedor, valor: m.valor, vencimento: novoPgto.vencimento });
  }
  const result = { competencia: comp, criados: criados.length, pulados: pulados.length, items: { criados, pulados }, executedAt: new Date().toISOString(), usuario: who };
  _saveLastRun(result);
  return result;
}

module.exports = {
  competenciaAtual,
  listarModelos,
  copiaExistente,
  preview,
  rodarRecorrencia,
  getLastRun,
};
