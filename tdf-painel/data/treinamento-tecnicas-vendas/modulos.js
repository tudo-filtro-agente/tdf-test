// ============================================================================
// ÍNDICE DOS MÓDULOS — Técnicas Avançadas de Vendas
// ----------------------------------------------------------------------------
// Baseado em 5 livros de referência:
//   • SPIN Selling — Neil Rackham
//   • Inteligência Emocional em Vendas — Jeb Blount
//   • Objeções — Jeb Blount
//   • A Máquina Definitiva de Vendas — Chet Holmes
//   • Receita Previsível — Aaron Ross
//
// publico: quem precisa fazer — 'SDR' | 'CLOSER'
// O conteúdo rico de cada módulo vive em ./content/<contentFile>.js
// ============================================================================

const MODULOS = [
  { num: 1,  slug: 'spin-selling',            titulo: 'SPIN Selling — Situação, Problema, Implicação e Necessidade',   icon: '🔍', tempoMin: 18, publico: ['SDR','CLOSER'], contentFile: 'mod-01-spin-selling' },
  { num: 2,  slug: 'perguntas-poderosas',     titulo: 'Perguntas Poderosas que Conduzem a Venda',                      icon: '❓', tempoMin: 15, publico: ['SDR','CLOSER'], contentFile: 'mod-02-perguntas-poderosas' },
  { num: 3,  slug: 'inteligencia-emocional',   titulo: 'Inteligência Emocional na Venda',                              icon: '🧠', tempoMin: 16, publico: ['SDR','CLOSER'], contentFile: 'mod-03-inteligencia-emocional' },
  { num: 4,  slug: 'vies-cognitivo',           titulo: 'Viés Cognitivo do Comprador',                                  icon: '🎭', tempoMin: 14, publico: ['CLOSER'],        contentFile: 'mod-04-vies-cognitivo' },
  { num: 5,  slug: 'pipeline-prospeccao',      titulo: 'Pipeline e Prospecção — Receita Previsível',                    icon: '📈', tempoMin: 18, publico: ['SDR','CLOSER'], contentFile: 'mod-05-pipeline-prospeccao' },
  { num: 6,  slug: 'gestao-tempo',             titulo: 'Gestão do Tempo — Regra 80/20 de Chet Holmes',                 icon: '⏱️', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-06-gestao-tempo' },
  { num: 7,  slug: 'treino-semanal',           titulo: 'Treino Semanal — Método Chet Holmes',                          icon: '🏋️', tempoMin: 10, publico: ['SDR','CLOSER'], contentFile: 'mod-07-treino-semanal' },
  { num: 8,  slug: 'objecoes-lscpa',           titulo: 'Objeções — Método Jeb Blount (Ledge–Disrupt–Ask) + LSCPA',     icon: '🛡️', tempoMin: 18, publico: ['CLOSER'],        contentFile: 'mod-08-objecoes-lscpa' },
  { num: 9,  slug: 'objecoes-preco',           titulo: 'Objeções de Preço — Como Desarmar e Reposicionar',             icon: '💰', tempoMin: 15, publico: ['CLOSER'],        contentFile: 'mod-09-objecoes-preco' },
  { num: 10, slug: 'objecoes-tempo-decisor',   titulo: 'Objeções de Tempo e Decisor',                                  icon: '⏳', tempoMin: 14, publico: ['CLOSER'],        contentFile: 'mod-10-objecoes-tempo-decisor' },
  { num: 11, slug: 'fechamento-sem-pressao',   titulo: 'Fechamento sem Pressão',                                       icon: '✅', tempoMin: 16, publico: ['CLOSER'],        contentFile: 'mod-11-fechamento' },
  { num: 12, slug: 'followup-com-valor',       titulo: 'Follow-up com Valor',                                          icon: '🔁', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-12-followup' },
  { num: 13, slug: 'construcao-valor',         titulo: 'Construção de Valor Antes do Preço',                           icon: '💎', tempoMin: 15, publico: ['CLOSER'],        contentFile: 'mod-13-construcao-valor' },
  { num: 14, slug: 'urgencia-real',            titulo: 'Urgência Real — Sem Gatilhos Falsos',                          icon: '🔥', tempoMin: 13, publico: ['CLOSER'],        contentFile: 'mod-14-urgencia-real' },
  { num: 15, slug: 'processo-comercial',       titulo: 'Processo Comercial Completo — Da Prospecção ao Pós-Venda',     icon: '🗺️', tempoMin: 20, publico: ['SDR','CLOSER'], contentFile: 'mod-15-processo-completo' },
];

const TREINAMENTO_META = {
  titulo: 'Técnicas Avançadas de Vendas',
  subtitulo: 'Domine SPIN Selling, inteligência emocional, tratamento de objeções e processos de alta performance comercial.',
  cargaHoraria: MODULOS.reduce((s, m) => s + m.tempoMin, 0), // minutos
  totalModulos: MODULOS.length,
  notaMinimaProva: 80,      // %
  questoesProva: 30,
  bancoMinimo: 60,
  certificado: 'Especialista em Técnicas Avançadas de Vendas — Tudo de Filtro',
};

function moduloPorSlug(slug) { return MODULOS.find(m => m.slug === slug) || null; }
function moduloPorNum(num) { return MODULOS.find(m => m.num === Number(num)) || null; }

module.exports = { MODULOS, TREINAMENTO_META, moduloPorSlug, moduloPorNum };
