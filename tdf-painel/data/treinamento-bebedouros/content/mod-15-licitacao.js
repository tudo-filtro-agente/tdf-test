// ============================================================================
// MÓDULO 15 — Licitação e revenda
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: "Nem todo que fala \"licitação\" é o órgão público. Aprenda a classificar quem está do outro lado e a qualificar antes de dar preço.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-15-video" },

  blocos: [
    { tipo: "texto", html: "Quando alguém diz \"é para uma licitação\", o vendedor iniciante imagina o órgão público comprando direto. Na prática, o interlocutor pode ser muitas coisas diferentes — e cada uma exige um caminho de qualificação distinto." },

    { tipo: "titulo", texto: "Quem pode estar do outro lado" },
    { tipo: "texto", html: "Pode ser um <strong>revendedor</strong>, um <strong>distribuidor</strong>, uma <strong>empresa de suprimentos</strong>, um <strong>participante de pregão</strong>, um <strong>consultor</strong>, uma <strong>empresa formando preço</strong> para montar a proposta dela, uma empresa que <strong>já venceu</strong> a licitação e agora procura fornecedor, ou uma empresa <strong>sem edital</strong> ainda em fase de pesquisa. Cada perfil muda o que você precisa perguntar e como você precifica." },

    { tipo: "callout", variante: "alerta", titulo: "Por que isso importa",
      html: "Dar um preço \"de licitação\" sem saber o estágio e a quantidade é o caminho mais rápido para <strong>passar um valor que não se sustenta</strong> quando a compra realmente acontece — ou para virar cotação de referência de graça para o concorrente." },

    { tipo: "titulo", texto: "Perguntas obrigatórias antes de precificar" },
    { tipo: "perguntas", titulo: "Qualifique o cenário de licitação/revenda", itens: [
      "É para a sua empresa ou para um cliente seu?",
      "A licitação já foi vencida ou ainda vai acontecer?",
      "Existe edital publicado?",
      "Tem termo de referência?",
      "Qual a quantidade de equipamentos?",
      "Qual o prazo de entrega exigido?",
      "Qual a cidade / local de entrega?",
      "O frete está incluído no que você precisa?",
      "Precisa de instalação?",
      "O edital pede marca específica?",
      "Produto equivalente é permitido?",
      "Quais documentos são exigidos do fornecedor?",
      "Qual a validade da proposta?",
      "Qual a data da sessão / abertura?",
      "Já existe empenho?",
      "Vai ter contrato?",
      "Qual a condição de pagamento?",
      "Há penalidade por atraso na entrega?",
    ]},

    { tipo: "titulo", texto: "Classificando a oportunidade" },
    { tipo: "cards", itens: [
      { icon: "🏆", titulo: "Licitação ganha", html: "A empresa já venceu e precisa do fornecedor para entregar. Oportunidade quente — foco em prazo, quantidade e viabilidade de entrega." },
      { icon: "⏳", titulo: "Licitação em andamento", html: "O processo está aberto e a empresa vai disputar. Precisa de proposta para compor a dela. Trate como cotação séria, mas confirme edital e prazos." },
      { icon: "📝", titulo: "Cotação para participar", html: "Ainda está montando preço para decidir se entra. Legítimo, mas exige as perguntas de qualificação para não virar preço de referência solto." },
      { icon: "🤝", titulo: "Revendedor com cliente identificado", html: "Tem um cliente final concreto por trás. Vale relacionamento e condição de parceria — peça para identificar a oportunidade." },
      { icon: "🔍", titulo: "Revendedor sem oportunidade", html: "Só quer tabela para ter \"na gaveta\". Baixa prioridade: informe condições gerais sem investir tempo em proposta customizada." },
      { icon: "📊", titulo: "Pesquisa de preço", html: "Coletando valores de mercado, às vezes só para referência de edital. Responda com cuidado — pode não haver compra real por trás." },
    ]},

    { tipo: "titulo", texto: "Sinais de alerta" },
    { tipo: "checklist", titulo: "Desconfie e qualifique mais quando o contato:", itens: [
      "Não envia o edital.",
      "Não informa quantidade, cidade ou prazo.",
      "Só quer o menor preço, sem falar de mais nada.",
      "Pede o desconto máximo sem nenhum compromisso.",
      "Pede exclusividade sem apresentar a oportunidade.",
      "Pede documentação da empresa sem mostrar a oportunidade real.",
      "Não aceita informar qual é o órgão / cliente final.",
    ]},

    { tipo: "callout", variante: "info", titulo: "O que os sinais indicam",
      html: "Um ou dois sinais podem ser só desorganização — qualifique. Vários juntos indicam que <strong>ainda não há oportunidade real</strong> ou que estão usando você só para formar referência. Não é para recusar: é para <strong>não investir proposta customizada</strong> antes de ter as informações." },

    { tipo: "titulo", texto: "Script de qualificação" },
    { tipo: "script",
      contexto: "Contato pede \"o melhor preço para licitação\" sem dar detalhes",
      fala: "Consigo estruturar a melhor condição, mas preciso entender quantidade, prazo, cidade e o estágio da licitação. Sem essas informações, eu posso passar um valor que não seja sustentável quando a compra realmente acontecer." },

    { tipo: "callout", variante: "perigo", titulo: "Conduta ética — inegociável",
      html: "<strong>Nunca</strong> combine preços com concorrentes, oriente direcionamento de edital ou qualquer prática irregular em processo de compra pública ou privada. Nosso papel é apresentar a melhor condição legítima do nosso produto — nada além disso. Diante de qualquer pedido nesse sentido, recuse com educação e registre a situação." },

    { tipo: "dodont",
      fazer: [
        "Descobrir se é para a própria empresa ou para um cliente.",
        "Classificar a oportunidade antes de investir proposta.",
        "Pedir edital, quantidade, cidade e prazo antes de precificar.",
      ],
      evitar: [
        "Dar preço de licitação sem saber estágio e quantidade.",
        "Investir proposta customizada com vários sinais de alerta.",
        "Combinar preços ou orientar qualquer prática irregular.",
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: "Um contato diz \"é para licitação\". O que isso garante?",
      opcoes: [
        "Que é um órgão público comprando direto.",
        "Nada em definitivo — pode ser revendedor, distribuidor, consultor, participante de pregão etc.",
        "Que a venda é certa e grande.",
      ],
      correta: 1,
      explicacao: "\"Licitação\" é um guarda-chuva. Antes de precificar, descubra quem é o interlocutor e o estágio do processo."
    },
    {
      pergunta: "O contato não envia edital, não informa quantidade nem cidade e só quer o menor preço. O que fazer?",
      opcoes: [
        "Enviar o menor preço possível na hora para não perder a venda.",
        "Aplicar o script de qualificação e pedir quantidade, prazo, cidade e estágio antes de cotar.",
        "Recusar o atendimento de imediato.",
      ],
      correta: 1,
      explicacao: "São sinais de alerta juntos. Não se recusa nem se despeja preço: qualifica-se primeiro, com o script."
    },
    {
      pergunta: "O contato pede para você combinar o preço com outro fornecedor para \"garantir\" o resultado da licitação. Qual a conduta?",
      opcoes: [
        "Aceitar, já que ajuda a fechar.",
        "Recusar com educação e registrar — combinar preços é prática irregular, inegociável.",
        "Aceitar só se o valor for alto.",
      ],
      correta: 1,
      explicacao: "Combinação de preços e direcionamento são práticas irregulares. Nosso papel é apresentar a melhor condição legítima, nada além."
    },
  ],

  exercicio: {
    enunciado: "Pegue um contato de \"licitação\" que você atendeu (ou imagine um). Classifique-o em uma das 6 categorias e liste quais das perguntas obrigatórias ainda faltam responder para você poder precificar com segurança.",
    dica: "Se você não consegue classificar, é porque faltam respostas — comece pela pergunta \"é para sua empresa ou para um cliente?\"."
  },

  resumo: "Nem todo \"licitação\" é o órgão público: pode ser revendedor, distribuidor, consultor, participante de pregão ou empresa formando preço. Antes de precificar, qualifique com as perguntas obrigatórias (edital, termo de referência, quantidade, prazo, cidade, frete, instalação, marca, equivalência, documentos, validade, sessão, empenho, contrato, pagamento, penalidade) e classifique a oportunidade. Fique atento aos sinais de alerta e nunca combine preços ou oriente prática irregular — apenas a melhor condição legítima do nosso produto."
};
