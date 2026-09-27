// ============================================================================
// ÍNDICE — Academia: Especialista Comercial em Scale Stop
// Mesmo motor genérico. Conteúdo em ./content/. Specs técnicas -> "pendente".
// Regra travada: Scale Stop reduz incrustação SEM remover dureza (não é abrandador).
// ============================================================================

const MODULOS = [
  { num: 1, slug: 'o-que-e',            titulo: 'O que é o Scale Stop',                icon: '💎', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-01-o-que-e' },
  { num: 2, slug: 'hyperscalex',        titulo: 'HyperScaleX — ficha técnica e dimensionamento', icon: '🧪', tempoMin: 16, publico: ['SDR','CLOSER'], contentFile: 'mod-hyperscalex' },
  { num: 3, slug: 'dureza-incrustacao', titulo: 'Dureza e incrustação — a dor',        icon: '🧱', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-02-dureza-incrustacao' },
  { num: 4, slug: 'vs-abrandador',      titulo: 'Scale Stop × abrandador (o que faz e o que NÃO faz)', icon: '⚖️', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-03-vs-abrandador' },
  { num: 5, slug: 'icp-jornada',        titulo: 'ICP, Personas e Jornada do Lead (dados do CRM)', icon: '🧭', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-icp-jornada' },
  { num: 6, slug: 'posicionamento',     titulo: 'Posicionamento: combo e projeto',     icon: '🧩', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-05-posicionamento' },
  { num: 7, slug: 'qualificacao',       titulo: 'Qualificação do cliente',             icon: '🔍', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-06-qualificacao' },
  { num: 8, slug: 'objecoes',           titulo: 'Objeções',                            icon: '🛡️', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-07-objecoes' },
  { num: 9, slug: 'fechamento',         titulo: 'Fechamento',                          icon: '✅', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-08-fechamento' },
  { num: 10, slug: 'crm',               titulo: 'Registro no CRM',                     icon: '🗂️', tempoMin: 10, publico: ['SDR','CLOSER'], contentFile: 'mod-09-crm' },
];

const TREINAMENTO_META = {
  titulo: 'Especialista Comercial em Scale Stop',
  subtitulo: 'O maior ticket da TDF (R$10,7k), dor de dureza/incrustação, venda de projeto/combo.',
  heroIcon: '💎',
  principioCentral: 'Scale Stop <strong>reduz a incrustação sem remover a dureza</strong> — <strong>não é abrandador</strong> e não deixa a água mole. Nunca prometa "remover dureza" nem "água mole". Posicione pela dor de <strong>incrustação/mancha branca</strong> e, quase sempre, como <strong>combo/projeto</strong>.',
  cargaHoraria: MODULOS.reduce((s, m) => s + m.tempoMin, 0),
  totalModulos: MODULOS.length,
  notaMinimaProva: 80,
  questoesProva: 20,
  bancoMinimo: 40,
  certificado: 'Especialista Comercial em Scale Stop — Tudo de Filtro',
  certPrefix: 'TDF-SS',
};

function moduloPorSlug(slug) { return MODULOS.find(m => m.slug === slug) || null; }
function moduloPorNum(num) { return MODULOS.find(m => m.num === Number(num)) || null; }
module.exports = { MODULOS, TREINAMENTO_META, moduloPorSlug, moduloPorNum };
