// ============================================================================
// MÓDULO 14 — Apresentação de valor
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: "Transformar característica técnica em valor percebido usando a estrutura Característica → Benefício → Impacto no cliente.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-14-video" },

  blocos: [
    { tipo: "texto", html: "Cliente não compra <strong>característica</strong>. Ele compra o que aquela característica muda na vida dele. \"Compressor 1/5\" não significa nada para quem não é técnico — mas \"água que continua gelada quando todo mundo desce junto no almoço\" significa tudo." },

    { tipo: "titulo", texto: "A estrutura de três degraus" },
    { tipo: "cards", itens: [
      { icon: "🔧", titulo: "Característica", html: "O fato técnico do produto. Neutro, verdadeiro, verificável. Ex.: compressor 1/5." },
      { icon: "⚙️", titulo: "Benefício", html: "O que a característica <strong>faz</strong>. A função traduzida. Ex.: recuperação de temperatura mais rápida." },
      { icon: "🎯", titulo: "Impacto no cliente", html: "O que isso muda <strong>no cenário dele</strong>. A dor resolvida. Ex.: menor risco de a água perder o frio no pico." },
    ]},

    { tipo: "callout", variante: "info", titulo: "O erro comum",
      html: "O vendedor iniciante para no primeiro degrau: recita características. O consultor sobe até o terceiro degrau e <strong>conecta com a dor específica</strong> que o cliente descreveu no diagnóstico. Sempre feche no impacto." },

    { tipo: "titulo", texto: "Tabela de valor — do técnico ao impacto" },
    { tipo: "tabela",
      head: ["Característica", "Benefício", "Impacto no cliente"],
      rows: [
        ["Compressor 1/5 (modelos 100 e 200 L)", "Recuperação de temperatura mais rápida", "Menor risco de a água perder refrigeração no pico, quando muita gente pega junto"],
        ["Ventoinha de dissipação", "Ajuda a dissipar o calor do sistema", "Trabalha melhor em ambiente quente ou pouco ventilado, comum em galpão e obra"],
        ["Torneira metálica", "Resistência mecânica ao uso pesado", "Aguenta o uso intenso do dia a dia sem quebrar como o plástico"],
        ["Estrutura em inox", "Superfície durável e fácil de higienizar", "Equipamento que dura e passa boa impressão de limpeza para funcionário e visita"],
        ["Serpentina interna em inox 304", "Troca térmica em material nobre e resistente", "Refrigeração consistente com material adequado ao contato com água"],
        ["Termostato regulável", "Ajuste do nível de gelado", "O cliente regula a temperatura conforme a preferência da equipe"],
        ["Reservatório em polietileno atóxico", "Material apropriado para o contato com a água", "Tranquilidade quanto ao material do reservatório no uso diário"],
        ["Refil Acquabios Multi (1º de brinde)", "Troca programada já incluída no início", "Começa a usar com o primeiro refil incluso, sem custo extra na largada"],
        ["Suporte Tudo de Filtro", "Atendimento e orientação de quem vende e dá assistência", "Não fica sozinho depois da compra — tem com quem falar quando precisar"],
        ["Garantia de 12 meses", "Cobertura de fábrica no período", "Segurança na compra de um equipamento de uso intenso"],
        ["Disponibilidade de peças", "Reposição acessível ao longo da vida útil", "Manutenção viável no futuro, sem virar sucata por falta de peça"],
        ["Dimensionamento consultivo", "Modelo escolhido pelo pico, não pelo chute", "Compra o equipamento certo de primeira, sem subdimensionar nem gastar a mais"],
      ]
    },

    { tipo: "titulo", texto: "Como usar na conversa" },
    { tipo: "texto", html: "Não despeje a tabela inteira. Escolha <strong>as 2 ou 3 linhas que batem com a dor</strong> que o cliente trouxe no diagnóstico. Para uma fábrica com pico no almoço, o compressor 1/5 e a ventoinha valem ouro. Para um cliente preocupado com durabilidade, foque em inox, torneira metálica e peças." },

    { tipo: "script",
      contexto: "Cliente de galpão preocupado se a água aguenta o movimento no calor",
      fala: "Esse modelo tem compressor 1/5 e ventoinha de dissipação. Na prática, isso quer dizer que ele recupera a temperatura mais rápido e trabalha bem mesmo em ambiente quente. Traduzindo para o seu caso: quando o pessoal descer junto no intervalo, a água não vai perder o frio bem na hora de maior movimento — que é justamente onde a reclamação costuma aparecer." },

    { tipo: "dodont",
      fazer: [
        "Subir sempre até o impacto no cliente.",
        "Selecionar as características que batem com a dor diagnosticada.",
        "Usar linguagem do cliente, não jargão técnico.",
      ],
      evitar: [
        "Recitar lista de características soltas.",
        "Prometer potabilidade da água.",
        "Prometer percentual de economia de energia sem laudo.",
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: "\"Compressor 1/5\" é qual degrau da estrutura de valor?",
      opcoes: [
        "Impacto no cliente.",
        "Característica.",
        "Benefício.",
      ],
      correta: 1,
      explicacao: "É uma característica — o fato técnico. O benefício é \"recupera a temperatura mais rápido\" e o impacto é \"água não perde o frio no pico\"."
    },
    {
      pergunta: "Qual é a forma mais forte de apresentar valor?",
      opcoes: [
        "Listar todas as características técnicas do equipamento.",
        "Ligar a característica ao impacto na dor específica do cliente.",
        "Dar o maior desconto possível logo de cara.",
      ],
      correta: 1,
      explicacao: "Valor percebido nasce quando o cliente enxerga o impacto no cenário dele — não na quantidade de specs recitadas."
    },
  ],

  exercicio: {
    enunciado: "Escolha 3 características da tabela e escreva o benefício e o impacto de cada uma para um cliente específico (ex.: academia, obra, escola). Use a dor típica desse cenário para chegar no impacto.",
    dica: "Se o impacto ficou genérico (\"é bom\", \"é de qualidade\"), volte e conecte com uma dor concreta daquele cliente."
  },

  resumo: "Apresentar valor é subir três degraus: Característica (o fato técnico) → Benefício (o que ela faz) → Impacto no cliente (o que muda na dor dele). Nunca pare na característica. Selecione as linhas que batem com o diagnóstico e feche sempre no impacto — sem prometer potabilidade nem percentual de economia de energia."
};
