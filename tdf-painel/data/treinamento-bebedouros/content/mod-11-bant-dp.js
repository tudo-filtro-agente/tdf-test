// ============================================================================
// MÓDULO 11 — Qualificação BANT-DP
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// OBS: o formulário/score interativo BANT-DP já é embutido automaticamente pela
// página do módulo. NÃO incluir bloco { tipo:'componente', ref:'bant' } aqui.
// ============================================================================

module.exports = {
  resumoCurto: "BANT-DP adapta o clássico BANT (Budget, Authority, Need, Timing) à venda de bebedouros, somando o D de Dimensionamento e o P de Processo — as duas dimensões que evitam vender o modelo errado ou travar na burocracia.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-11-video" },

  blocos: [
    { tipo: "texto", html: "BANT é um framework clássico de qualificação: <strong>B</strong>udget (orçamento), <strong>A</strong>uthority (autoridade), <strong>N</strong>eed (necessidade) e <strong>T</strong>iming (prazo). Para bebedouros industriais, ele sozinho não basta — por isso usamos o <strong>BANT-DP</strong>, que acrescenta <strong>D</strong>imensionamento e <strong>P</strong>rocesso." },

    { tipo: "cards", itens: [
      { icon: "💰", titulo: "B — Budget", html: "Existe orçamento e em que faixa? Como será o pagamento?" },
      { icon: "👤", titulo: "A — Authority", html: "Quem decide, quem aprova e quem mais influencia?" },
      { icon: "🎯", titulo: "N — Need", html: "Qual é a dor real que fez o cliente procurar agora?" },
      { icon: "⏳", titulo: "T — Timing", html: "Para quando? Há inauguração, obra ou urgência?" },
      { icon: "📐", titulo: "D — Dimensionamento", html: "O coração técnico: pico, pontos de água, voltagem, ambiente." },
      { icon: "🧾", titulo: "P — Processo", html: "Como a empresa compra: NF, cadastro, licitação, crédito." },
    ]},

    { tipo: "callout", variante: "info", titulo: "O formulário BANT-DP é interativo",
      html: "Nesta página, logo abaixo, você tem o <strong>painel de score BANT-DP</strong> para preencher enquanto qualifica. Este módulo te ensina <strong>quais perguntas fazer</strong> em cada letra." },

    { tipo: "titulo", texto: "N — Need (necessidade)" },
    { tipo: "texto", html: "Comece pela necessidade: entender <strong>por que agora</strong> revela urgência e o problema real a resolver." },
    { tipo: "perguntas", titulo: "Perguntas de Need", itens: [
      "O que fez você procurar um bebedouro agora?",
      "Como vocês fornecem água hoje?",
      "Trabalham com galão / garrafão? Quem troca?",
      "Tem reclamação de água quente ou de falta d'água?",
      "O equipamento atual quebrou ou está no limite?",
      "É uma unidade nova, uma obra ou uma expansão?",
      "Tem alguma inauguração ou data marcada?",
    ]},
    { tipo: "exemplo",
      cliente: "A gente usa galão, mas vive faltando e o pessoal reclama.",
      closer: "Então hoje vocês dependem de troca de galão e ainda assim falta água — e isso já está gerando reclamação. É exatamente esse problema que um bebedouro ligado na rede resolve. Deixa eu entender o tamanho pra acertar o modelo." },

    { tipo: "titulo", texto: "D — Dimensionamento" },
    { tipo: "texto", html: "Esta é a dimensão que <strong>define o modelo</strong>. Nunca recomende só pelo total de pessoas — o que manda é o <strong>pico de consumo simultâneo</strong> e a capacidade de recuperar a temperatura." },
    { tipo: "perguntas", titulo: "Perguntas de Dimensionamento", itens: [
      "Quantas pessoas no total têm acesso ao bebedouro?",
      "Quantas usam ao mesmo tempo no horário de pico?",
      "Trabalham em quantos turnos? O consumo é concentrado em algum horário?",
      "Quantos pontos de água / bebedouros vocês pretendem ter?",
      "O bebedouro vai ficar em ambiente interno ou externo?",
      "O local é ventilado ou é quente / abafado?",
      "Qual a voltagem disponível: 110 ou 220?",
      "Já existe ponto hidráulico e dreno no local previsto?",
      "Qual o espaço disponível para o equipamento?",
      "A água é da rede pública ou de poço?",
      "Há previsão de crescimento no número de pessoas?",
      "Vocês já têm algum bebedouro hoje? Qual?",
      "Quantas torneiras vocês precisam no equipamento?",
    ]},
    { tipo: "callout", variante: "alerta", titulo: "Pico define o modelo",
      html: "A capacidade do reservatório <strong>não</strong> é limite diário de água. O que importa é quantos usam no pico e se o compressor recupera a temperatura a tempo. Registre o risco se o cliente insistir em descer de modelo só por preço." },

    { tipo: "titulo", texto: "B — Budget (orçamento)" },
    { tipo: "texto", html: "Orçamento se investiga com jeito. O objetivo é entender <strong>se há verba e como o cliente decide o valor</strong> — nunca constranger." },
    { tipo: "perguntas", titulo: "Perguntas de Budget", itens: [
      "Já existe um orçamento aprovado para essa compra?",
      "Vocês já têm uma faixa de investimento em mente?",
      "A compra seria à vista, no cartão ou faturada?",
      "Vocês estão comparando só por preço ou também por durabilidade e suporte?",
      "A liberação passa pelo financeiro ou já está aprovada?",
    ]},
    { tipo: "callout", variante: "perigo", titulo: "NÃO pergunte seco \"quanto você tem pra gastar?\"",
      html: "Essa pergunta soa invasiva e joga o cliente na defensiva. Prefira: <em>\"vocês já têm uma faixa de investimento em mente?\"</em> ou ancore em durabilidade e custo de errar o tamanho antes de falar de valor." },

    { tipo: "titulo", texto: "A — Authority (autoridade)" },
    { tipo: "texto", html: "Descubra <strong>quem realmente decide</strong> e quem mais precisa aprovar, sem diminuir a pessoa com quem você fala." },
    { tipo: "perguntas", titulo: "Perguntas de Authority", itens: [
      "Você participa da decisão dessa compra?",
      "Além de você, mais alguém avalia ou aprova?",
      "A manutenção ou a engenharia precisa validar a parte técnica?",
      "O diretor / financeiro costuma receber a proposta antes de fechar?",
      "O bebedouro é para uso de vocês ou para atender um cliente de vocês?",
    ]},
    { tipo: "exemplo",
      cliente: "Eu levanto a informação, mas quem assina é o diretor.",
      closer: "Perfeito, então eu preparo a proposta já pensando no que o diretor vai querer ver — modelo certo, condição e garantia bem claros — pra facilitar a aprovação dele. Faz sentido?" },

    { tipo: "titulo", texto: "T — Timing (prazo)" },
    { tipo: "texto", html: "Prazo revela <strong>urgência e o próximo passo</strong>. Sem timing, a proposta esfria." },
    { tipo: "perguntas", titulo: "Perguntas de Timing", itens: [
      "Para quando vocês precisam do bebedouro funcionando?",
      "Tem alguma inauguração ou data limite?",
      "O equipamento atual parou ou ainda está funcionando?",
      "Está atrelado a alguma obra em andamento?",
      "A decisão tende a sair ainda neste mês?",
      "Depois da proposta, qual seria o próximo passo de vocês?",
    ]},

    { tipo: "titulo", texto: "P — Processo (como a empresa compra)" },
    { tipo: "texto", html: "O P evita a surpresa no fechamento. Empresa não compra como pessoa física: pode exigir NF, cadastro, cotações, crédito ou <strong>licitação</strong>." },
    { tipo: "perguntas", titulo: "Perguntas de Processo", itens: [
      "Vocês precisam de proposta formal / por escrito?",
      "Há cadastro de fornecedor a ser preenchido?",
      "A compra exige nota fiscal? Em qual CNPJ?",
      "É compra direta ou passa por licitação / edital?",
      "Quantas cotações vocês costumam levantar?",
      "A aprovação depende da diretoria?",
      "Há análise de crédito para faturamento?",
      "Frete e instalação precisam entrar inclusos na proposta?",
    ]},
    { tipo: "callout", variante: "info", titulo: "Mapear o processo cedo evita perder o prazo",
      html: "Se você só descobre na hora de fechar que precisa de cadastro de fornecedor ou de três cotações, o negócio atrasa semanas. Levante o Processo <strong>antes</strong> de enviar a proposta." },

    { tipo: "dodont",
      fazer: [
        "Começar pela Need e deixar o cliente contar a dor.",
        "Tratar o Dimensionamento como o coração da qualificação.",
        "Investigar Budget por faixa e por critério de decisão.",
        "Mapear o Processo antes de enviar proposta.",
      ],
      evitar: [
        "Perguntar seco \"quanto você tem pra gastar?\".",
        "Recomendar modelo só pelo total de pessoas.",
        "Ignorar quem realmente aprova a compra.",
        "Descobrir a burocracia só no fechamento.",
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: "No BANT-DP, qual dimensão é o \"coração técnico\" que define qual modelo indicar?",
      opcoes: [
        "Budget (orçamento).",
        "Dimensionamento (pico, pontos de água, voltagem, ambiente).",
        "Timing (prazo).",
      ],
      correta: 1,
      explicacao: "O Dimensionamento é o que define o modelo — sobretudo o pico de consumo simultâneo e a recuperação de temperatura."
    },
    {
      pergunta: "Qual é a forma correta de investigar orçamento (Budget)?",
      opcoes: [
        "\"Quanto você tem pra gastar?\", direto e seco.",
        "\"Vocês já têm uma faixa de investimento em mente?\", ancorando em durabilidade e no custo de errar o tamanho.",
        "Não perguntar nada sobre dinheiro para não constranger.",
      ],
      correta: 1,
      explicacao: "Investiga-se por faixa e por critério de decisão. A pergunta seca sobre quanto a pessoa tem coloca o cliente na defensiva."
    },
    {
      pergunta: "Por que o P (Processo) foi adicionado ao BANT nesta venda?",
      opcoes: [
        "Para preencher mais campos no CRM.",
        "Porque empresa compra com NF, cadastro, cotações, crédito ou licitação — e descobrir isso tarde atrasa o fechamento.",
        "Porque substitui a necessidade de dimensionar.",
      ],
      correta: 1,
      explicacao: "Mapear o processo de compra cedo evita surpresas burocráticas que travam ou atrasam o negócio no fim."
    },
  ],

  exercicio: {
    enunciado: "Pegue um atendimento real (ou imaginado) e escreva uma pergunta sua para cada uma das seis letras do BANT-DP. Depois, marque qual delas você costuma esquecer de fazer.",
    dica: "Se a resposta for D ou P, atenção redobrada: são justamente as que evitam vender o modelo errado ou travar na burocracia."
  },

  resumo: "BANT-DP qualifica em seis dimensões: Need (por que agora), Dimensionamento (pico, pontos de água, voltagem, ambiente — define o modelo), Budget (faixa e critério, nunca \"quanto tem pra gastar?\"), Authority (quem decide e aprova), Timing (prazo e próximo passo) e Processo (NF, cadastro, cotações, crédito, licitação). O D é o coração técnico e o P evita a surpresa no fechamento — as duas letras que o BANT clássico não cobre."
};
