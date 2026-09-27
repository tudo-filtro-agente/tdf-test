// ============================================================================
// MÓDULO 2 — Perguntas Poderosas que Conduzem a Venda
// Baseado em: SPIN Selling — Neil Rackham
// ============================================================================

module.exports = {
  resumoCurto: 'Aprenda a formular perguntas que revelam necessidades ocultas, criam conexão e conduzem naturalmente ao fechamento na venda de soluções de água.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-02-video' },

  blocos: [
    { tipo: 'texto', html: 'Perguntas poderosas são aquelas que fazem o cliente <strong>pensar, refletir e revelar informações</strong> que ele nem sabia que eram relevantes. Diferente de perguntas fechadas ("Você tem filtro?"), perguntas poderosas abrem portas para <strong>necessidades ocultas</strong> que se transformam em oportunidades de venda.' },

    { tipo: 'titulo', texto: 'Perguntas abertas vs. fechadas' },
    { tipo: 'tabela',
      head: ['Tipo', 'Exemplo fraco', 'Exemplo poderoso'],
      rows: [
        ['Sobre água', '"Sua água é boa?"', '"Como você descreveria a qualidade da água que chega na sua casa hoje?"'],
        ['Sobre problema', '"Tem problema com ferro?"', '"O que você nota de diferente na água quando sai da torneira?"'],
        ['Sobre impacto', '"Isso te incomoda?"', '"De que forma isso tem afetado o dia a dia da sua família/empresa?"'],
        ['Sobre solução', '"Quer comprar um filtro?"', '"Se existisse uma forma de resolver isso de uma vez, o que mudaria pra você?"'],
        ['Sobre decisão', '"Você decide sozinho?"', '"Quem mais na casa/empresa participa de decisões como essa?"'],
      ]
    },

    { tipo: 'titulo', texto: 'As 5 categorias de perguntas poderosas para TDF' },
    { tipo: 'cards', itens: [
      { icon: '🏠', titulo: '1. Contexto e Cenário', html: '"Me conta um pouco sobre a água aí na sua região..."<br>"De onde vem a água — Sabesp, poço, cisterna?"<br>"Quantas pessoas usam água no dia a dia?"' },
      { icon: '😟', titulo: '2. Dor e Frustração', html: '"O que mais te incomoda na água hoje?"<br>"Já aconteceu de alguém da família reclamar da água?"<br>"Há quanto tempo vocês convivem com isso?"' },
      { icon: '💸', titulo: '3. Impacto Financeiro', html: '"Quanto você já gastou tentando resolver isso?"<br>"Se somar manutenção + produtos + peças, quanto dá por ano?"<br>"Quanto custa trocar um aquecedor danificado por calcário?"' },
      { icon: '🎯', titulo: '4. Visão de Futuro', html: '"Como seria o cenário ideal da água pra você?"<br>"Se a água chegasse perfeita, o que mudaria no seu dia a dia?"<br>"Qual seria o impacto de não precisar mais se preocupar com isso?"' },
      { icon: '⏰', titulo: '5. Urgência e Decisão', html: '"O que te fez procurar uma solução agora?"<br>"De 0 a 10, quão urgente é resolver isso?"<br>"O que acontece se vocês ficarem mais 6 meses sem tratar?"' },
    ]},

    { tipo: 'titulo', texto: 'Técnica do funil: do amplo ao específico' },
    { tipo: 'texto', html: 'As melhores conversas de venda seguem um <strong>funil de perguntas</strong>: começam amplas (cenário geral) e vão afunilando até a dor específica e a decisão. Isso cria um fluxo natural que o cliente nem percebe estar sendo conduzido.' },
    { tipo: 'checklist', titulo: 'Sequência do funil de perguntas', itens: [
      '1º — Perguntas amplas de contexto (quebra-gelo, cenário)',
      '2º — Perguntas sobre experiências anteriores com água',
      '3º — Perguntas sobre problemas específicos percebidos',
      '4º — Perguntas sobre impacto financeiro e emocional',
      '5º — Perguntas sobre visão de solução ideal',
      '6º — Perguntas sobre prazo e processo de decisão',
    ]},

    { tipo: 'titulo', texto: 'Diálogo modelo: Venda de Filtro de Entrada' },
    { tipo: 'exemplo', cliente: 'Oi, vi no site que vocês vendem filtros.', closer: 'Que bom que nos encontrou! Me conta: de onde vem a água aí na sua casa — é Sabesp, poço artesiano...?' },
    { tipo: 'exemplo', cliente: 'É Sabesp mesmo, mas a água chega meio turva às vezes.', closer: 'Turva com que frequência? Todo dia ou mais quando chove?' },
    { tipo: 'exemplo', cliente: 'Quando chove fica pior, mas no geral nunca é transparente 100%.', closer: 'Entendi. E isso já afetou alguma coisa em casa? Roupa, chuveiro, eletrodoméstico...?' },
    { tipo: 'exemplo', cliente: 'A máquina de lavar vive dando problema. O técnico falou que é sujeira na entrada de água.', closer: 'Quanto foi a última manutenção da máquina? E quantas vezes já precisou chamar técnico esse ano?' },
    { tipo: 'exemplo', cliente: 'Umas 3 vezes. Gastei uns 600 reais já.', closer: 'R$ 600 em 6 meses… Se existisse um filtro na entrada da casa que retivesse toda essa sujeira antes de chegar nos equipamentos, protegendo máquina de lavar, chuveiro, tudo — isso faria sentido pra você?' },

    { tipo: 'callout', variante: 'sucesso', titulo: 'Perceba a técnica',
      html: 'O closer nunca disse "temos um Filtro de Entrada por R$ 3.490". Ele <strong>conduziu</strong> o cliente a perceber o custo de não ter filtro (R$ 600 em manutenção) e <strong>pedir</strong> a solução. Isso é o poder das perguntas.' },

    { tipo: 'titulo', texto: 'Perguntas que aceleram a decisão' },
    { tipo: 'perguntas', titulo: 'Use quando o cliente está em cima do muro', itens: [
      '"O que precisa acontecer para você se sentir seguro em avançar?"',
      '"Se o preço não fosse um fator, você instalaria hoje?"',
      '"O que está te impedindo de resolver isso agora?"',
      '"Quanto mais tempo com esse problema é aceitável pra você?"',
      '"Além de você, quem mais precisa estar confortável com a decisão?"',
    ]},

    { tipo: 'dodont',
      fazer: [
        'Preparar 5-8 perguntas antes de cada conversa.',
        'Anotar as respostas do cliente (CRM ou bloco).',
        'Usar silêncio depois da pergunta — deixe o cliente pensar.',
        'Reformular se o cliente não entendeu — não repita igual.',
        'Conectar cada pergunta à resposta anterior (fluxo natural).',
      ],
      evitar: [
        'Fazer mais de 2 perguntas seguidas sem comentar a resposta.',
        'Perguntas que você já deveria saber (pesquise antes).',
        'Perguntas que parecem interrogatório policial.',
        'Ignorar a resposta e seguir o roteiro de qualquer jeito.',
        'Perguntar "você tem interesse?" — isso mata a venda.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual destas é uma pergunta poderosa para descobrir impacto financeiro?',
      opcoes: [
        '"Você quer um filtro?"',
        '"Quanto você já gastou com manutenção de equipamentos por causa da água?"',
        '"A água da sua casa é boa?"',
      ],
      correta: 1,
      explicacao: 'Perguntas de impacto financeiro quantificam o custo do problema e ajudam o cliente a comparar com o investimento na solução.'
    },
    {
      pergunta: 'Na técnica do funil, qual é a ordem correta?',
      opcoes: [
        'Dor → Contexto → Decisão → Impacto',
        'Contexto → Problema → Impacto → Visão de solução → Decisão',
        'Preço → Produto → Fechamento',
      ],
      correta: 1,
      explicacao: 'O funil vai do amplo (contexto) ao específico (decisão), passando por problema, impacto e visão de solução.'
    },
    {
      pergunta: 'O cliente disse que a água é turva. Qual a melhor próxima pergunta?',
      opcoes: [
        '"Quer comprar nosso Filtro de Entrada?"',
        '"Isso já afetou algum equipamento da casa?"',
        '"A gente tem um filtro de R$ 3.490."',
      ],
      correta: 1,
      explicacao: 'Antes de apresentar solução, explore o impacto do problema para construir valor e urgência.'
    },
  ],

  exercicio: {
    enunciado: 'Escreva 6 perguntas poderosas (uma de cada categoria) para uma ligação com um dono de restaurante que reclamou de cheiro na água. Use a técnica do funil.',
    dica: 'Comece pelo contexto (de onde vem a água, quantas torneiras), depois explore a dor (cheiro, sabor, reclamação de clientes), impacto (perda de clientes, vigilância sanitária), visão (água sem cheiro para cozinha e clientes), e urgência (próxima visita da vigilância).'
  },

  resumo: 'Perguntas poderosas são abertas, específicas e conduzem o cliente a revelar necessidades ocultas. Usando a técnica do funil (contexto → dor → impacto → visão → decisão), o vendedor TDF transforma conversas em vendas consultivas sem precisar empurrar produto. O segredo: quem pergunta, lidera.'
};
