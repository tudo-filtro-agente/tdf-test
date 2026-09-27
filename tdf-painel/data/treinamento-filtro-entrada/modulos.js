// ============================================================================
// ÍNDICE — Academia: Especialista Comercial em Filtro de Entrada
// Mesmo motor genérico (lib/treinamento-academia.js). Conteúdo em ./content/.
// Regra: specs técnicas de produto NÃO inventadas -> blocos "pendente".
// ============================================================================

const MODULOS = [
  { num: 1,  slug: 'fundamentos',       titulo: 'O que é um filtro de entrada',        icon: '🏠', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-01-fundamentos' },
  { num: 2,  slug: 'agua-concessionaria', titulo: 'O que tem na água da concessionária', icon: '🚰', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-02-agua-concessionaria' },
  { num: 3,  slug: 'linha-produtos',    titulo: 'A linha: Filtralli, American, Light Filter', icon: '📦', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-03-linha-produtos' },
  { num: 4,  slug: 'como-funciona',     titulo: 'Como funciona a filtragem',           icon: '⚙️', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-04-como-funciona' },
  { num: 5,  slug: 'icp-jornada',       titulo: 'ICP, Personas e Jornada do Lead (dados do CRM)', icon: '🧭', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-icp-jornada' },
  { num: 6,  slug: 'qualificacao',      titulo: 'Qualificação do cliente',             icon: '🔍', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-06-qualificacao' },
  { num: 7,  slug: 'valor',             titulo: 'Apresentação de valor',               icon: '💎', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-07-valor' },
  { num: 8,  slug: 'objecoes',          titulo: 'Objeções',                            icon: '🛡️', tempoMin: 14, publico: ['CLOSER'],        contentFile: 'mod-08-objecoes' },
  { num: 9,  slug: 'fechamento',        titulo: 'Fechamento',                          icon: '✅', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-09-fechamento' },
  { num: 10, slug: 'crm',               titulo: 'Registro no CRM',                     icon: '🗂️', tempoMin: 10, publico: ['SDR','CLOSER'], contentFile: 'mod-10-crm' },
];

const TREINAMENTO_META = {
  titulo: 'Especialista Comercial em Filtro de Entrada',
  subtitulo: 'A maior linha da TDF: água de concessionária, cliente urbano, ciclo curto.',
  heroIcon: '🏠',
  principioCentral: 'Filtro de entrada resolve a água da <strong>concessionária</strong> (não é poço): o cliente é urbano e desconfia/quer melhorar a água da rua. Recomende pela <strong>dor real</strong> (cor, cloro, sedimento, desconfiança) e pela necessidade — nunca por impulso.',
  cargaHoraria: MODULOS.reduce((s, m) => s + m.tempoMin, 0),
  totalModulos: MODULOS.length,
  notaMinimaProva: 80,
  questoesProva: 25,
  bancoMinimo: 50,
  certificado: 'Especialista Comercial em Filtro de Entrada — Tudo de Filtro',
  certPrefix: 'TDF-FE',
};

function moduloPorSlug(slug) { return MODULOS.find(m => m.slug === slug) || null; }
function moduloPorNum(num) { return MODULOS.find(m => m.num === Number(num)) || null; }
module.exports = { MODULOS, TREINAMENTO_META, moduloPorSlug, moduloPorNum };
