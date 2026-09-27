// ============================================================================
// ÍNDICE DOS MÓDULOS — Academia: Especialista em Tratamento de Água de Poço
// Mesmo padrão da academia de Bebedouros. Conteúdo em ./content/<contentFile>.js
// ATENÇÃO: conteúdo TÉCNICO não pode ser inventado — módulos técnicos trazem
// estrutura + blocos "pendente" (validação técnica) até o documento-mestre da TDF.
// ============================================================================

const MODULOS = [
  { num: 1,  slug: 'fundamentos',            titulo: 'Fundamentos da água de poço',        icon: '🌎', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-01-fundamentos' },
  { num: 2,  slug: 'interpretar-analise',    titulo: 'Como interpretar uma análise',       icon: '🧪', tempoMin: 20, publico: ['SDR','CLOSER'], contentFile: 'mod-02-interpretar-analise' },
  { num: 3,  slug: 'analise-obrigatoria',    titulo: 'Análise obrigatória antes da venda', icon: '📄', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-03-analise-obrigatoria' },
  { num: 4,  slug: 'sondagem-hidraulica',    titulo: 'Sondagem hidráulica',                icon: '🔧', tempoMin: 18, publico: ['SDR','CLOSER'], contentFile: 'mod-04-sondagem-hidraulica' },
  { num: 5,  slug: 'tanques-frp',            titulo: 'Tanques em fibra de vidro / FRP',    icon: '🛢️', tempoMin: 16, publico: ['CLOSER'],        contentFile: 'mod-05-tanques-frp' },
  { num: 6,  slug: 'valvulas-runxin',        titulo: 'Válvulas Runxin',                    icon: '⚙️', tempoMin: 16, publico: ['CLOSER'],        contentFile: 'mod-06-valvulas-runxin' },
  { num: 7,  slug: 'ferro-manganes',         titulo: 'Ferro e manganês',                   icon: '🟤', tempoMin: 16, publico: ['SDR','CLOSER'], contentFile: 'mod-07-ferro-manganes' },
  { num: 8,  slug: 'iron-free',              titulo: 'Iron Free: oxidação, cloro, pH e barrilha', icon: '🧲', tempoMin: 18, publico: ['SDR','CLOSER'], contentFile: 'mod-iron-free' },
  { num: 9,  slug: 'dureza',                 titulo: 'Dureza',                             icon: '🧱', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-08-dureza' },
  { num: 10, slug: 'dureza-solucoes',        titulo: 'Potabilidade × conforto: dureza e soluções', icon: '💎', tempoMin: 16, publico: ['SDR','CLOSER'], contentFile: 'mod-dureza-solucoes' },
  { num: 11, slug: 'coliformes-desinfeccao', titulo: 'Coliformes e desinfecção',           icon: '🦠', tempoMin: 16, publico: ['SDR','CLOSER'], contentFile: 'mod-09-coliformes-desinfeccao' },
  { num: 12, slug: 'cloro-residual',         titulo: 'Por que manter cloro residual',      icon: '🧴', tempoMin: 10, publico: ['SDR','CLOSER'], contentFile: 'mod-10-cloro-residual' },
  { num: 13, slug: 'nitrato-nitrito-amonia', titulo: 'Nitrato, nitrito e amônia',          icon: '⚗️', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-11-nitrato-nitrito-amonia' },
  { num: 14, slug: 'cor-materia-organica',   titulo: 'Cor aparente e matéria orgânica',    icon: '🟡', tempoMin: 12, publico: ['SDR','CLOSER'], contentFile: 'mod-12-cor-materia-organica' },
  { num: 15, slug: 'carvao-ativado',         titulo: 'Filtro de carvão ativado: tipos e aplicação', icon: '⬛', tempoMin: 16, publico: ['SDR','CLOSER'], contentFile: 'mod-carvao-ativado' },
  { num: 16, slug: 'compostos-organicos',    titulo: 'Compostos orgânicos',                icon: '🧬', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-13-compostos-organicos' },
  { num: 17, slug: 'tecnologias',            titulo: 'Tecnologias de tratamento',          icon: '🏭', tempoMin: 22, publico: ['SDR','CLOSER'], contentFile: 'mod-14-tecnologias' },
  { num: 18, slug: 'arquitetura-estacao',    titulo: 'Arquitetura de uma estação',         icon: '🗺️', tempoMin: 16, publico: ['CLOSER'],        contentFile: 'mod-15-arquitetura-estacao' },
  { num: 19, slug: 'qualificacao',           titulo: 'Roteiro de qualificação comercial',  icon: '🧭', tempoMin: 18, publico: ['SDR','CLOSER'], contentFile: 'mod-16-qualificacao' },
  { num: 20, slug: 'analise-in-loco',        titulo: 'Análise in loco, abertura e taxa de interesse', icon: '🏠', tempoMin: 16, publico: ['SDR','CLOSER'], contentFile: 'mod-analise-in-loco' },
  // Obs.: os módulos abaixo mantêm o nome de arquivo original (mod-17..mod-20); o número de exibição foi deslocado com as inserções acima.
  { num: 21, slug: 'roteiro-venda',          titulo: 'Roteiro de venda',                   icon: '🤝', tempoMin: 18, publico: ['CLOSER'],        contentFile: 'mod-17-roteiro-venda' },
  { num: 22, slug: 'objecoes',               titulo: 'Objeções',                           icon: '🛡️', tempoMin: 16, publico: ['CLOSER'],        contentFile: 'mod-18-objecoes' },
  { num: 23, slug: 'casos-roleplays',        titulo: 'Casos e roleplays',                  icon: '🎭', tempoMin: 12, publico: ['CLOSER'],        contentFile: 'mod-19-casos-roleplays' },
  { num: 24, slug: 'quando-parar',           titulo: 'Quando o closer deve parar',         icon: '🛑', tempoMin: 10, publico: ['SDR','CLOSER'], contentFile: 'mod-20-quando-parar' },
  { num: 25, slug: 'icp-jornada',            titulo: 'ICP, Personas e Jornada do Lead (dados do CRM)', icon: '🧭', tempoMin: 14, publico: ['SDR','CLOSER'], contentFile: 'mod-icp-jornada' },
];

const TREINAMENTO_META = {
  titulo: 'Especialista em Tratamento de Água de Poço',
  subtitulo: 'Diagnóstico responsável: análise, hidráulica e dimensionamento antes de qualquer proposta.',
  cargaHoraria: MODULOS.reduce((s, m) => s + m.tempoMin, 0),
  totalModulos: MODULOS.length,
  notaMinimaProva: 85,      // %
  questoesProva: 40,
  bancoMinimo: 100,
  certificado: 'Especialista Comercial em Tratamento de Água de Poço — Tudo de Filtro',
  certPrefix: 'TDF-POCO',
};

function moduloPorSlug(slug) { return MODULOS.find(m => m.slug === slug) || null; }
function moduloPorNum(num) { return MODULOS.find(m => m.num === Number(num)) || null; }

module.exports = { MODULOS, TREINAMENTO_META, moduloPorSlug, moduloPorNum };
