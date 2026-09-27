// ============================================================================
// PLANO DE PREMIAÇÃO v7 — Closers CLT (Filtro de Entrada) · Tudo de Filtro
// Fiel ao documento oficial (plano_premiacao_v7.md). Natureza: Prêmio por Desempenho
// (art. 457 §§ 2º e 4º CLT) — NÃO integra salário. Sujeito a validação jurídica.
// FAIXAS INTERMEDIÁRIAS = PENDENTES (só piso e teto confirmados). Não inventar.
// ============================================================================

const META = {
  titulo: 'Plano de Premiação por Desempenho v7',
  aplicavel: 'Closers CLT — Inside Sales (Filtro de Entrada)',
  versao: '7.0',
  natureza: 'Prêmio por Desempenho (art. 457, §§ 2º e 4º, CLT — Lei 13.467/2017). Não integra salário para férias, 13º, FGTS, INSS, aviso prévio ou hora extra.',
  aviso: 'Documento base oficial vigente, sujeito a validação jurídica.',
};

// Alto Ticket (HT) — lista sujeita a fechamento (pendência #3 do doc)
const HT_PRODUTOS = ['Iron Free', 'ScaleStop', 'Ion Guard', 'Abrandador', 'Ultrafiltração', 'Sistema Completo Poço', 'Combo Completo'];

const REGUAS = {
  normal: {
    id: 'normal', nome: 'Régua Normal', condicao: 'Mix de Alto Ticket (HT) < 51% do faturamento validado',
    piso: 75000, premioPiso: 2000, teto: 210000, premioTeto: 11200,
    intermediariasPendentes: true,
    faixas: [
      { fat: 75000, premio: 2000, label: 'Piso de elegibilidade' },
      // faixas intermediárias PENDENTES de confirmação v7
      { fat: 210000, premio: 11200, label: 'Teto validado' },
    ],
  },
  diferenciada: {
    id: 'diferenciada', nome: 'Régua Diferenciada', condicao: 'Mix de Alto Ticket (HT) ≥ 51% do faturamento validado',
    piso: 60000, premioPiso: 2000, teto: 210000, premioTeto: 21000,
    intermediariasPendentes: true,
    faixas: [
      { fat: 60000, premio: 2000, label: 'Piso de elegibilidade' },
      // faixas intermediárias PENDENTES de confirmação v7
      { fat: 210000, premio: 21000, label: 'Teto validado' },
    ],
  },
};

const EXCELENCIA = {
  condicaoGlobal: 'Só recebe QUALQUER prêmio do Programa de Excelência se atingir o piso da régua principal aplicável (Normal R$ 75.000 / Diferenciada R$ 60.000). Abaixo do piso = zero excelência (Cláusula 6.2.1 e 6.2.2).',
  modalidades: [
    { id: 'valvula',    nome: 'Válvula automática',          tiers: [{ un: 5, premio: 400 }, { un: 10, premio: 1200 }, { un: 15, premio: 2000 }] },
    { id: 'instalacao', nome: 'Instalação cobrada à parte',  tiers: [{ un: 5, premio: 350 }, { un: 10, premio: 1000 }, { un: 15, premio: 1700 }] },
  ],
  combo: {
    premioUnit: 250, teto: 6, tetoValor: 1500,
    definicao: 'Mesmo cliente com Filtro de Entrada + Válvula Automática + Instalação Adicional Cobrada, pagamento integral confirmado no mesmo período de apuração.',
  },
  cumulativo: 'Válvula, Instalação e Combo são cumulativos entre si (modalidades distintas, não duplicidade — Cláusula 6.2.4).',
};

const APURACAO = {
  vendaValida: [
    'Fechada e registrada no CRM dentro do mês de apuração',
    'Pagamento efetivamente confirmado pela área financeira',
    'Sem cancelamento, estorno, devolução ou inadimplência',
    'Observando a margem mínima de comercialização vigente',
    'Descontos acima de 10% com autorização prévia registrada no CRM',
  ],
  altoValor: 'Vendas individuais ≥ R$ 100.000: o prêmio só é apurado e pago APÓS a quitação integral do cliente. Em parcelado, reconhecido no mês da confirmação do pagamento total pelo financeiro.',
  estornos: 'Cancelamentos, estornos, devoluções ou inadimplências identificados após o pagamento do prêmio podem ser descontados, total ou parcialmente, das apurações subsequentes.',
};

const CLAUSULAS = [
  { id: '6.2.1', titulo: 'Condição de Elegibilidade Global', texto: 'O direito a qualquer prêmio do Programa de Excelência em Mix está condicionado ao atingimento cumulativo da meta mínima da régua principal aplicável ao Closer no mês de apuração.' },
  { id: '6.2.2', titulo: 'Perda Automática', texto: 'O não atingimento da meta mínima da régua principal implica perda automática do direito aos prêmios do Programa de Excelência do mês, independentemente das quantidades vendidas nas modalidades individuais.' },
  { id: '6.2.3', titulo: 'Fundamento de Desempenho Agregado', texto: 'Os prêmios do Programa de Excelência têm natureza de prêmio por desempenho superior agregado — volume de faturamento e qualidade do mix — nos termos do art. 457, §§ 2º e 4º, da CLT.' },
  { id: '6.2.4', titulo: 'Cumulatividade entre Modalidades', texto: 'Os prêmios das modalidades Válvula Automática, Instalação Cobrada e Combo Completo são cumulativos entre si e não configuram duplicidade de pagamento.' },
];

const PENDENCIAS = [
  'Faixas intermediárias da Régua Normal (entre R$ 75k e R$ 210k)',
  'Faixas intermediárias da Régua Diferenciada (entre R$ 60k e R$ 210k)',
  'Lista fechada de produtos classificados como Alto Ticket (HT)',
  'Definição operacional de "Instalação cobrada à parte" (critérios de contagem 5/10/15)',
];

module.exports = { META, HT_PRODUTOS, REGUAS, EXCELENCIA, APURACAO, CLAUSULAS, PENDENCIAS };
