// ============================================================================
// PRODUTOS — Bebedouros Industriais Tudo de Filtro
// ----------------------------------------------------------------------------
// FONTE DOS DADOS:
//   [site]     = extraído literalmente de https://tudodefiltro.com.br/bebedouro-industrial/ (02/jul/2026)
//   [empresa]  = informação fornecida diretamente pela Tudo de Filtro (não está no site)
//   [pendente] = inconsistência detectada — NÃO exibir como definitivo até validação técnica
//
// REGRA: nunca corrigir medidas por conta própria. Onde `dimensaoPendente: true`,
// a UI mostra o aviso "Dimensão pendente de validação técnica".
//
// Para atualizar: edite este arquivo. Nada de dado comercial fica preso em componente.
// ============================================================================

/** @typedef {'copo'|'jato'} TipoTorneira */

const PRODUTOS = [
  {
    id: 'beb-15',
    litros: 15,
    nome: 'Bebedouro Industrial 15 litros',
    slug: '15-litros',
    imagem: '/img/treinamento-bebedouros/bebedouro-01.webp',
    pessoasHora: 'até 25 pessoas/hora',      // [site]
    pessoasHoraMin: 0,
    pessoasHoraMax: 25,
    dimensao: '65 x 45 x 40 cm',              // [site] — unidades consistentes (cm)
    dimensaoPendente: false,
    dimensaoNota: 'Medidas em centímetros, consistentes.',
    peso: '15 kg',                            // [site]
    compressor: '1/10',                       // [empresa]
    garantia: '12 meses',                     // [site]
    voltagemPendente: true,                   // [pendente] site não informa 110/220 — confirmar com cliente
    torneirasQtdPendente: true,               // [pendente] nº de torneiras não especificado no site
    perfil: 'Escritórios pequenos, consultórios, lojas, salas comerciais, equipes enxutas.',
    riscoSubdimensionamento: 'Baixo volume: adequado só para poucos usuários. Em pico de empresa média já trabalha no limite.',
    perguntasAntesDeIndicar: [
      'Quantas pessoas usam no horário de maior movimento?',
      'É ponto único ou vai ter mais de um bebedouro?',
      'Ambiente interno com ventilação?',
    ],
  },
  {
    id: 'beb-25',
    litros: 25,
    nome: 'Bebedouro Industrial 25 litros',
    slug: '25-litros',
    imagem: '/img/treinamento-bebedouros/bebedouro-02.webp',
    pessoasHora: 'até 40 pessoas/hora',       // [site]
    pessoasHoraMin: 0,
    pessoasHoraMax: 40,
    dimensao: '1,30 x 42 x 53',               // [site] — SEM unidade especificada
    dimensaoPendente: true,                   // [pendente]
    dimensaoNota: 'Site publica "1,30 x 42 x 53" sem unidade. Provável mistura de metro (1,30 m) e centímetro (42/53 cm). Validar com a fábrica.',
    peso: '25 kg',                            // [site]
    compressor: '1/10',                       // [empresa]
    garantia: '12 meses',                     // [site]
    voltagemPendente: true,
    torneirasQtdPendente: true,
    perfil: 'Empresas pequenas, clínicas, academias de bairro, escolas pequenas.',
    riscoSubdimensionamento: 'Se o consumo for concentrado no pico, pode não recuperar a temperatura a tempo. Checar simultaneidade.',
    perguntasAntesDeIndicar: [
      'Quantas pessoas ao mesmo tempo no pico?',
      'Tem turnos ou é uso distribuído no dia?',
      'Qual a voltagem do local?',
    ],
  },
  {
    id: 'beb-60',
    litros: 60,
    nome: 'Bebedouro Industrial 60 litros',
    slug: '60-litros',
    imagem: '/img/treinamento-bebedouros/bebedouro-03.webp',
    pessoasHora: '70 a 150 pessoas/hora',     // [site]
    pessoasHoraMin: 70,
    pessoasHoraMax: 150,
    dimensao: '1,27 x 56 x 54 cm',            // [site] — altura "1,27" rotulada cm
    dimensaoPendente: true,                   // [pendente]
    dimensaoNota: 'Altura "1,27" aparece com "cm", mas o valor sugere 1,27 m (127 cm). Padrão inconsistente na linha (altura em metro, largura/prof em cm). Validar.',
    peso: '35 kg',                            // [site]
    compressor: '1/10',                       // [empresa]
    garantia: '12 meses',                     // [site]
    voltagemPendente: true,
    torneirasQtdPendente: true,
    perfil: 'Empresas médias, academias, escolas, restaurantes, padarias, igrejas.',
    riscoSubdimensionamento: 'Faixa larga (70–150). Perto de 150 no pico já pede avaliação de simultaneidade e pontos de água.',
    perguntasAntesDeIndicar: [
      'Total de pessoas e quantas no pico?',
      'Um ponto só ou vários pontos de água?',
      'Local quente / sem ventilação?',
    ],
  },
  {
    id: 'beb-100',
    litros: 100,
    nome: 'Bebedouro Industrial 100 litros',
    slug: '100-litros',
    imagem: '/img/treinamento-bebedouros/bebedouro-04.webp',
    pessoasHora: '150 a 300 pessoas/hora',    // [site]
    pessoasHoraMin: 150,
    pessoasHoraMax: 300,
    dimensao: '1,27 x 66 x 70 cm',            // [site] — altura "1,27" rotulada cm
    dimensaoPendente: true,                   // [pendente]
    dimensaoNota: 'Altura "1,27" rotulada cm mas provavelmente 1,27 m. Mesmo padrão inconsistente da linha. Validar.',
    peso: '40 kg',                            // [site]
    compressor: '1/5',                        // [empresa]
    garantia: '12 meses',                     // [site]
    voltagemPendente: true,
    torneirasQtdPendente: true,
    perfil: 'Indústrias, galpões, centros logísticos, escolas grandes, obras médias.',
    riscoSubdimensionamento: 'Alta demanda. Compressor 1/5 dá recuperação melhor no pico — não descer de modelo só por preço sem registrar o risco.',
    perguntasAntesDeIndicar: [
      'Quantos turnos e quantas pessoas por turno?',
      'Intervalos concentrados (todo mundo junto)?',
      'Quantos pontos de água e qual voltagem?',
    ],
  },
  {
    id: 'beb-200',
    litros: 200,
    nome: 'Bebedouro Industrial 200 litros',
    slug: '200-litros',
    imagem: '/img/treinamento-bebedouros/bebedouro-05.webp',
    pessoasHora: '300 a 350 pessoas/hora',    // [site]
    pessoasHoraMin: 300,
    pessoasHoraMax: 350,
    dimensao: '1,38 x 66 x 1,10 cm',          // [site] — ERRO conhecido de unidade
    dimensaoPendente: true,                   // [pendente] — sinalizado no briefing
    dimensaoNota: 'Site publica "1,38 x 66 x 1,10 cm". A terceira medida "1,10 cm" é fisicamente incoerente (provável 1,10 m). NÃO publicar como definitivo. Aguardar validação técnica.',
    peso: '45 kg',                            // [site]
    compressor: '1/5',                        // [empresa]
    garantia: '12 meses',                     // [site]
    voltagemPendente: true,
    torneirasQtdPendente: true,
    perfil: 'Grandes indústrias, grandes obras, centros logísticos, eventos, órgãos públicos.',
    riscoSubdimensionamento: 'Topo da linha. Se a demanda passa disso, avaliar mais de uma unidade / mais pontos, não forçar um só equipamento.',
    perguntasAntesDeIndicar: [
      'Efetivo total, por turno e no pico?',
      'Quantos pontos de água distribuídos?',
      'Precisa de mais de uma unidade para cobrir o ambiente?',
    ],
  },
];

// Componentes/materiais comuns a toda a linha (confirmados no site + empresa)
const COMPONENTES_COMUNS = {
  estrutura: 'Todo em inox',                                   // [site]
  serpentina: 'Serpentina interna em aço inox 304',            // [site]
  reservatorio: 'Reservatório em polietileno rotomoldado atóxico', // [site]
  termostato: 'Termostato regulável',                          // [site]
  pes: 'Pés reguláveis',                                       // [site]
  torneiras: 'Torneiras metálicas — modelo Copo (rosca) ou Jato (pressão)', // [site + empresa]
  ventoinha: 'Ventoinha para auxiliar na dissipação de calor', // [empresa]
  refil: 'Acquabios Multi (1º refil acompanha como brinde)',   // [empresa]
};

// Regra comercial interna (fonte: operação TDF). NÃO é spec pública do site.
const REGRAS_TORNEIRA = {
  jatoAdicional: 100, // R$ a mais por torneira jato
  nota: 'Torneira JATO custa +R$100 e não acompanha copo. Regra interna de precificação — confirmar na proposta.',
};

// Compressor por faixa (fonte: empresa)
const COMPRESSOR_POR_MODELO = {
  '15': '1/10', '25': '1/10', '60': '1/10', '100': '1/5', '200': '1/5',
};

module.exports = { PRODUTOS, COMPONENTES_COMUNS, REGRAS_TORNEIRA, COMPRESSOR_POR_MODELO };
