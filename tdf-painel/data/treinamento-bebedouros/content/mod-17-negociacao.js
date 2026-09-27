// ============================================================================
// MÓDULO 17 — Negociação com concessões
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// Tipos de bloco usados aqui: texto, titulo, callout, cards, dodont, script,
// exemplo, checklist, tabela.
// ============================================================================

module.exports = {
  resumoCurto: "Negociar não é baixar preço. É trocar valor por valor. Este módulo ensina a lógica das concessões — nada sai sem contrapartida — e mostra, com exemplos de negociação boa e ruim, como preservar margem, autoridade e o modelo tecnicamente correto.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-17-video" },

  blocos: [
    { tipo: "texto", html: "Negociação começa quando existe uma <strong>objeção real</strong>, não antes. O vendedor iniciante abre o desconto sozinho, com medo de perder a venda, e destrói a margem numa conversa que nem tinha virado disputa. O consultor mantém o valor até que apareça uma barreira concreta — e, aí sim, troca concessão por concessão." },

    { tipo: "callout", variante: "alerta", titulo: "A regra que sustenta todo este módulo",
      html: "<strong>Nada é concedido de graça.</strong> Todo desconto, todo prazo especial, toda condição extra que você dá tem que vir acompanhada de algo que o cliente dá em troca: pagamento à vista, mais unidades, retirada, ou o fechamento dentro de uma condição válida." },

    { tipo: "titulo", texto: "O que NÃO fazer numa negociação" },
    { tipo: "dodont",
      fazer: [
        "Segurar o valor até existir uma objeção concreta.",
        "Trocar cada concessão por uma contrapartida clara.",
        "Registrar o risco por escrito quando o cliente força um modelo menor.",
        "Confirmar prazo, voltagem e faturamento antes de prometer.",
        "Fechar em cima de condições que a operação sustenta.",
      ],
      evitar: [
        "Reduzir o preço imediatamente, no reflexo.",
        "Oferecer desconto antes de existir qualquer objeção.",
        "Criar urgência falsa (\"é só hoje\", \"última unidade\") sem ser verdade.",
        "Falar mal do concorrente para justificar o seu preço.",
        "Inventar informação de spec, prazo ou capacidade.",
        "Trocar o modelo correto por um menor só para competir, sem registrar o risco.",
        "Prometer prazo de entrega ou faturamento sem confirmar antes.",
      ]
    },

    { tipo: "titulo", texto: "A moeda de troca: por que você concede" },
    { tipo: "texto", html: "Toda concessão precisa de um motivo do lado do cliente. Guarde estes cinco gatilhos — você só melhora a condição quando um deles está sobre a mesa." },
    { tipo: "cards", itens: [
      { icon: "💵", titulo: "Por pagamento", html: "À vista ou no Pix libera margem que o parcelado não libera. Condição melhor em troca da forma de pagamento." },
      { icon: "📦", titulo: "Por quantidade", html: "Mais unidades diluem custo fixo e frete. O preço por equipamento cai quando o volume sobe." },
      { icon: "🚚", titulo: "Por retirada", html: "Se o cliente retira, sai o custo de frete da conta. Troca direta e transparente." },
      { icon: "✍️", titulo: "Por decisão", html: "Fechar agora, dentro de uma condição válida, justifica um esforço a mais na proposta." },
      { icon: "⏱️", titulo: "Por fechamento na condição", html: "Condição especial vale enquanto a condição existe — sem inventar urgência que não é real." },
    ]},

    { tipo: "tabela",
      head: ["Você concede", "O cliente dá em troca"],
      rows: [
        ["Melhor condição de preço", "Pagamento à vista / Pix"],
        ["Preço por unidade menor", "Fecha mais de uma unidade"],
        ["Frete abatido ou zerado", "Retira o equipamento"],
        ["Esforço extra na proposta", "Decisão fechada hoje"],
        ["Condição especial mantida", "Fechamento dentro do prazo da condição"],
      ]
    },

    { tipo: "titulo", texto: "Negociação BOA × negociação RUIM" },
    { tipo: "texto", html: "Os exemplos abaixo usam a mesma situação. Observe onde o desconto aparece, se houve contrapartida e o que aconteceu com a autoridade do vendedor." },

    { tipo: "exemplo",
      cliente: "Gostei do de 100 litros, mas queria um desconto pra fechar.",
      closer: "[BOA] Consigo trabalhar uma condição melhor, mas preciso de uma contrapartida do seu lado. Se for à vista no Pix, eu tenho mais margem. E se você fechar hoje dentro dessa condição, eu já garanto. Fechamos assim: Pix e pedido emitido hoje?" },
    { tipo: "callout", variante: "sucesso", titulo: "Por que a de cima é boa",
      html: "O desconto veio <strong>depois</strong> da objeção, <strong>em troca</strong> de pagamento à vista e fechamento hoje, e <strong>sem urgência inventada</strong>. A margem foi protegida e o vendedor manteve o controle da conversa." },

    { tipo: "exemplo",
      cliente: "Gostei do de 100 litros, mas queria um desconto pra fechar.",
      closer: "[RUIM] Ah, sem problema! Já tiro 15% pra você, e se quiser tiro o frete também. É só hoje, viu? Amanhã já não consigo esse preço." },
    { tipo: "callout", variante: "perigo", titulo: "Por que a de baixo é ruim",
      html: "Desconto <strong>reflexo</strong>, empilhando frete de graça <strong>sem nenhuma contrapartida</strong>, e ainda com <strong>urgência falsa</strong> (\"só hoje\"). O cliente aprende que o preço era inflado e que dá pra empurrar mais. A margem evapora e a autoridade também." },

    { tipo: "exemplo",
      cliente: "Pra fechar hoje, me dá o de 60 pelo preço que dá, é o que cabe no meu bolso.",
      closer: "[BOA] Consigo fechar hoje com você. Só que, pelo seu pico, o de 60 trabalha no limite — então vou deixar isso registrado na proposta e minha recomendação segue sendo o de 100. Se a decisão for o de 60, eu respeito e formalizo, com a orientação anotada. Podemos seguir assim?" },
    { tipo: "callout", variante: "sucesso", titulo: "Modelo menor, feito do jeito certo",
      html: "O vendedor não empurrou o modelo maior à força nem cedeu calado. Atendeu o pedido do cliente <strong>e registrou o risco por escrito</strong>. Os dois ficam protegidos." },

    { tipo: "exemplo",
      cliente: "Consegue entregar até sexta e faturar pra 30 dias?",
      closer: "[BOA] Boa pergunta. Prazo de entrega e faturamento pra 30 dias eu não confirmo de cabeça — deixa eu checar com a operação e já te retorno com a informação certa. Prefiro te dar o \"sim\" real do que prometer o que não depende só de mim." },
    { tipo: "callout", variante: "info", titulo: "Prometer só o que se confirma",
      html: "Prazo e faturamento envolvem estoque e financeiro. Um \"sim\" apressado que não se cumpre custa mais caro que o tempo de checar. Confirme, depois prometa." },

    { tipo: "titulo", texto: "Roteiro mental antes de conceder" },
    { tipo: "checklist", titulo: "Pare e responda a estas perguntas",
      itens: [
        "Já existe uma objeção real, ou eu estou concedendo por medo?",
        "O que o cliente me dá em troca desta concessão?",
        "Essa condição é sustentável para a operação (frete, prazo, faturamento)?",
        "Estou mantendo o modelo tecnicamente correto? Se não, registrei o risco?",
        "Estou criando urgência verdadeira ou inventando pressão?",
      ]
    },

    { tipo: "callout", variante: "alerta", titulo: "Concessão sem contrapartida vira expectativa",
      html: "O que você dá de graça uma vez, o cliente cobra como padrão na próxima. Cada concessão precisa ter um \"em troca de\" explícito — inclusive para o cliente entender que aquilo tem valor." },
  ],

  perguntasRapidas: [
    {
      pergunta: "Quando é o momento certo de começar a negociar preço?",
      opcoes: [
        "Logo no começo, para adiantar e não perder o cliente.",
        "Só quando surge uma objeção real — antes disso, você segura o valor.",
        "Assim que o cliente pede o orçamento.",
      ],
      correta: 1,
      explicacao: "Oferecer desconto antes de existir objeção destrói margem numa conversa que nem virou disputa. Segure o valor até aparecer uma barreira concreta."
    },
    {
      pergunta: "O cliente quer desconto. Qual é a forma correta de conceder?",
      opcoes: [
        "Dar o desconto na hora e ainda oferecer frete grátis para garantir.",
        "Trocar por uma contrapartida: à vista/Pix, mais unidades, retirada ou fechamento hoje.",
        "Recusar qualquer negociação porque o preço é fixo.",
      ],
      correta: 1,
      explicacao: "Nada sai de graça. Toda concessão vem acompanhada de algo que o cliente dá em troca — pagamento, volume, retirada ou decisão fechada."
    },
    {
      pergunta: "O cliente insiste num modelo menor do que o recomendado. O que você faz?",
      opcoes: [
        "Recusa vender e encerra a negociação.",
        "Vende sem comentar nada, afinal o cliente é quem manda.",
        "Fornece o modelo pedido, mas registra por escrito o risco de subdimensionamento na proposta.",
      ],
      correta: 2,
      explicacao: "Você atende o pedido, mas nunca troca o modelo correto por um menor calado. Registrar o risco protege o cliente e protege você."
    },
  ],

  exercicio: {
    enunciado: "Pegue uma negociação real ou fictícia em que o cliente pede desconto. Escreva a versão BOA e a versão RUIM da sua resposta, e explique em uma frase o que diferencia as duas.",
    dica: "Na versão boa, todo desconto tem um \"em troca de\". Na ruim, o desconto aparece sozinho e no reflexo — muitas vezes com urgência inventada."
  },

  resumo: "Negociar é trocar valor por valor, nunca baixar preço no reflexo. Só se negocia depois que existe objeção real. Toda concessão tem contrapartida: pagamento à vista, mais unidades, retirada ou fechamento dentro de uma condição válida. Nunca crie urgência falsa, nunca fale mal do concorrente, nunca invente spec/prazo/faturamento e nunca troque o modelo correto por um menor sem registrar o risco por escrito. Prometa só o que a operação confirma."
};
