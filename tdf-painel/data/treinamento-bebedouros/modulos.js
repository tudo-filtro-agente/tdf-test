// ============================================================================
// ÍNDICE DOS MÓDULOS — Treinamento de Vendas: Bebedouros Industriais
// ----------------------------------------------------------------------------
// Este arquivo define a ORDEM, a navegação e os metadados de cada módulo.
// O conteúdo rico de cada módulo vive em ./content/<contentFile>.js
// (carregado sob demanda pelo motor; se faltar, o módulo aparece "em preparação").
//
// publico: quem precisa fazer — 'SDR' | 'CLOSER' | 'SUPERVISOR'
// componente: embute uma ferramenta interativa ('anatomia'|'comparador'|'calculadora'|'bant'|'upsell'|'crm-checklist')
// ============================================================================

const MODULOS = [
  { num: 1,  slug: 'intro',        titulo: 'Introdução ao mercado de bebedouros', icon: '🏭', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-01-intro' },
  { num: 2,  slug: 'anatomia',     titulo: 'Anatomia do bebedouro industrial',   icon: '🔧', tempoMin: 15, publico: ['SDR','CLOSER'], contentFile: 'mod-02-anatomia', componente: 'anatomia' },
  { num: 3,  slug: 'refrigeracao', titulo: 'Compressores e refrigeração',         icon: '❄️', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-03-refrigeracao' },
  { num: 4,  slug: 'torneiras',    titulo: 'Torneiras metálicas e resistência',   icon: '🚰', tempoMin: 8,  publico: ['SDR','CLOSER'], contentFile: 'mod-04-torneiras' },
  { num: 5,  slug: 'refil',        titulo: 'Refil Acquabios Multi',               icon: '💧', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-05-refil' },
  { num: 6,  slug: 'modelos',      titulo: 'Conhecimento dos modelos',            icon: '📊', tempoMin: 18, publico: ['SDR','CLOSER'], contentFile: 'mod-06-modelos', componente: 'comparador' },
  { num: 7,  slug: 'icp',          titulo: 'ICP — Perfil de Cliente Ideal',       icon: '🎯', tempoMin: 15, publico: ['SDR','CLOSER'], contentFile: 'mod-07-icp' },
  { num: 8,  slug: 'personas',     titulo: 'Personas na decisão de compra',       icon: '👥', tempoMin: 15, publico: ['CLOSER'],        contentFile: 'mod-08-personas' },
  { num: 9,  slug: 'rapport',      titulo: 'Rapport — conexão com propósito',     icon: '🤝', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-09-rapport' },
  { num: 10, slug: 'abertura',     titulo: 'Abertura do atendimento',             icon: '📞', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-10-abertura' },
  { num: 11, slug: 'bant-dp',      titulo: 'Qualificação BANT-DP',                icon: '🧭', tempoMin: 20, publico: ['SDR','CLOSER'], contentFile: 'mod-11-bant-dp', componente: 'bant' },
  { num: 12, slug: 'spin',         titulo: 'SPIN Selling aplicado',               icon: '🔍', tempoMin: 16, publico: ['CLOSER'],        contentFile: 'mod-12-spin' },
  { num: 13, slug: 'conducao',     titulo: 'Conduzindo o processo da venda',      icon: '🧩', tempoMin: 18, publico: ['CLOSER'],        contentFile: 'mod-13-conducao' },
  { num: 14, slug: 'valor',        titulo: 'Apresentação de valor',               icon: '💎', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-14-valor' },
  { num: 15, slug: 'licitacao',    titulo: 'Licitação e revenda',                 icon: '📋', tempoMin: 18, publico: ['CLOSER'],        contentFile: 'mod-15-licitacao' },
  { num: 16, slug: 'objecoes',     titulo: 'Tratamento de objeções',             icon: '🛡️', tempoMin: 18, publico: ['CLOSER'],        contentFile: 'mod-16-objecoes' },
  { num: 17, slug: 'negociacao',   titulo: 'Negociação com concessões',           icon: '⚖️', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-17-negociacao' },
  { num: 18, slug: 'fechamento',   titulo: 'Fechamento',                          icon: '✅', tempoMin: 14, publico: ['CLOSER'],        contentFile: 'mod-18-fechamento' },
  { num: 19, slug: 'upsell',       titulo: 'Upsell dos 3 refis',                  icon: '🎁', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-19-upsell', componente: 'upsell' },
  { num: 20, slug: 'followup',     titulo: 'Follow-up com valor',                 icon: '🔁', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-20-followup' },
  { num: 21, slug: 'crm',          titulo: 'Registro correto no CRM',             icon: '🗂️', tempoMin: 10, publico: ['SDR','CLOSER'], contentFile: 'mod-21-crm', componente: 'crm-checklist' },
  { num: 22, slug: 'icp-jornada',  titulo: 'ICP, Personas e Jornada do Lead (dados do CRM)', icon: '🧭', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-icp-jornada' },
];

const TREINAMENTO_META = {
  titulo: 'Treinamento de Vendas — Bebedouros Industriais',
  subtitulo: 'Do produto ao fechamento: qualifique, recomende o modelo certo e feche com upsell.',
  cargaHoraria: MODULOS.reduce((s, m) => s + m.tempoMin, 0), // minutos
  totalModulos: MODULOS.length,
  notaMinimaProva: 80,      // %
  questoesProva: 30,
  bancoMinimo: 60,
  certificado: 'Closer Certificado em Bebedouros Industriais — Tudo de Filtro',
};

function moduloPorSlug(slug) { return MODULOS.find(m => m.slug === slug) || null; }
function moduloPorNum(num) { return MODULOS.find(m => m.num === Number(num)) || null; }

module.exports = { MODULOS, TREINAMENTO_META, moduloPorSlug, moduloPorNum };
