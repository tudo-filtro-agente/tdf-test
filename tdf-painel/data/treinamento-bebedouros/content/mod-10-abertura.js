// ============================================================================
// MÓDULO 10 — Abertura do atendimento
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: "A abertura define o resto do atendimento: em poucos segundos você se apresenta, contextualiza, mostra autoridade e pede permissão para qualificar — sem parecer interrogatório.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-10-video" },

  blocos: [
    { tipo: "texto", html: "A abertura é a <strong>porta de entrada</strong> da venda consultiva. Uma boa abertura conquista o direito de fazer perguntas: em poucos segundos você diz quem é, por que está falando, e por que precisa entender o uso antes de indicar qualquer modelo." },

    { tipo: "titulo", texto: "O SCRIPT-BASE" },
    { tipo: "callout", variante: "sucesso", titulo: "Decore a estrutura, não a frase",
      html: "Esta é a abertura de referência. Adapte o canal e as palavras, mas mantenha os cinco elementos: <strong>cumprimento + apresentação + contexto + motivo das perguntas + pedido de permissão</strong>." },
    { tipo: "script", contexto: "SCRIPT-BASE (referência de toda abertura)",
      fala: "Olá, [nome], tudo bem? Aqui é [consultor] da Tudo de Filtro. Vi que você está procurando um bebedouro industrial. Para eu indicar o modelo correto e não correr o risco de colocar um equipamento menor ou maior do que o necessário, posso entender rapidamente como será o uso?" },

    { tipo: "titulo", texto: "Aberturas por origem do contato" },
    { tipo: "texto", html: "A base é sempre a mesma, mas o gancho inicial muda conforme <strong>de onde o lead veio</strong>. Use a versão certa para não soar genérico." },

    { tipo: "card", titulo: "Lead de formulário (site)", icon: "📝", html: "Ele já demonstrou interesse ativo. Referencie o preenchimento." },
    { tipo: "script", contexto: "Lead de formulário",
      fala: "Olá, [nome], tudo bem? Aqui é [consultor] da Tudo de Filtro. Recebi seu contato pelo nosso site sobre bebedouro industrial. Para eu já te indicar o modelo certo — sem errar pra mais nem pra menos — posso te fazer duas ou três perguntas rápidas sobre o uso?" },

    { tipo: "card", titulo: "WhatsApp", icon: "💬", html: "Curto e humano. Uma pergunta por vez." },
    { tipo: "script", contexto: "WhatsApp",
      fala: "Oi, [nome]! Aqui é o [consultor] da Tudo de Filtro. Que bom que chamou! Para eu te indicar o bebedouro certo e não errar no tamanho, me conta rapidinho: é pra empresa, obra, academia...? E quantas pessoas usam no horário de maior movimento?" },

    { tipo: "card", titulo: "Anúncio (Meta/Google)", icon: "📣", html: "Ele clicou por uma dor específica. Conecte ao anúncio." },
    { tipo: "script", contexto: "Lead de anúncio",
      fala: "Olá, [nome], tudo bem? Aqui é [consultor] da Tudo de Filtro. Você chegou pelo nosso anúncio de bebedouro industrial. Pra eu te mostrar exatamente o modelo que resolve o seu caso, posso entender rapidinho como vai ser o uso aí?" },

    { tipo: "card", titulo: "Indicação", icon: "🤝", html: "Aproveite a prova social. Cite quem indicou (com autorização)." },
    { tipo: "script", contexto: "Indicação",
      fala: "Olá, [nome], tudo bem? Aqui é [consultor] da Tudo de Filtro. O [quem indicou] comentou que você está precisando de um bebedouro industrial e pediu pra eu te ajudar. Pra eu indicar certo, posso entender rapidamente como será o uso?" },

    { tipo: "card", titulo: "Ligação ativa (prospecção)", icon: "📞", html: "Você interrompeu o dia dele. Seja objetivo e peça permissão para o tempo." },
    { tipo: "script", contexto: "Ligação ativa",
      fala: "Olá, [nome], tudo bem? Aqui é [consultor] da Tudo de Filtro, trabalhamos com bebedouros industriais para empresas. Peguei você em boa hora pra dois minutos? Quero entender se faz sentido pro seu cenário e, se fizer, já te indico o modelo certo." },

    { tipo: "card", titulo: "Cliente antigo (reativação)", icon: "🔁", html: "Resgate o histórico. Mostre que você lembra dele." },
    { tipo: "script", contexto: "Cliente antigo",
      fala: "Olá, [nome], tudo bem? Aqui é [consultor] da Tudo de Filtro. A gente já se falou sobre bebedouro tempos atrás. Passei pra saber como está a operação aí e se o uso mudou — pra eu ver se o que a gente conversou ainda é o modelo ideal ou se vale ajustar." },

    { tipo: "card", titulo: "Pedido de orçamento direto", icon: "🧾", html: "Ele já quer preço. Não recuse — mas conquiste o direito de qualificar antes." },
    { tipo: "script", contexto: "Pedido de orçamento",
      fala: "Perfeito, [nome], já preparo seu orçamento. Só que pra ele vir com o preço certo — nem de um modelo maior do que você precisa, nem de um que vá faltar água no pico — deixa eu entender rapidinho o uso? São duas ou três perguntas." },

    { tipo: "card", titulo: "Licitação / órgão público", icon: "🏛️", html: "Tom formal. Foque em especificação, edital e conformidade." },
    { tipo: "script", contexto: "Licitação",
      fala: "Bom dia, aqui é [consultor], da Tudo de Filtro. Estou à disposição para atender a demanda de bebedouros industriais. Para adequarmos a proposta ao edital, o senhor pode me indicar se já há especificação técnica definida e qual a modalidade e o prazo do processo?" },

    { tipo: "card", titulo: "Revendedor", icon: "📦", html: "Ele compra pra revender. Foque em volume, margem e recorrência." },
    { tipo: "script", contexto: "Revendedor",
      fala: "Olá, [nome], tudo bem? Aqui é [consultor] da Tudo de Filtro. Entendi que o interesse é para revenda. Pra eu montar a melhor condição pra você, me conta: qual volume costuma girar, quais modelos seus clientes mais pedem e se você já trabalha com bebedouro hoje?" },

    { tipo: "titulo", texto: "Por que o SCRIPT-BASE funciona" },
    { tipo: "texto", html: "Cada pedaço da abertura tem uma função. Entender <strong>por que</strong> funciona é o que permite adaptar sem perder o efeito." },
    { tipo: "cards", itens: [
      { icon: "🙋", titulo: "Apresentação", html: "\"Aqui é [consultor] da Tudo de Filtro\" — o cliente sabe com quem fala e a empresa por trás. Reduz desconfiança." },
      { icon: "🎯", titulo: "Contextualização", html: "\"Vi que você está procurando um bebedouro industrial\" — conecta ao interesse real dele e mostra que não é ligação aleatória." },
      { icon: "🏅", titulo: "Autoridade", html: "\"Para eu indicar o modelo correto\" — você se posiciona como quem dimensiona, não como quem só tira pedido." },
      { icon: "🧭", titulo: "Motivo das perguntas", html: "\"Não correr o risco de colocar um equipamento menor ou maior\" — o cliente entende que as perguntas são a favor dele." },
      { icon: "🛡️", titulo: "Redução de resistência", html: "Quando o cliente sabe o porquê das perguntas, ele responde de bom grado em vez de se fechar." },
      { icon: "🔑", titulo: "Permissão para qualificar", html: "\"Posso entender rapidamente como será o uso?\" — você pede licença e ganha o direito de conduzir a descoberta." },
    ]},

    { tipo: "callout", variante: "info", titulo: "A permissão muda tudo",
      html: "Sem pedir permissão, cada pergunta soa como interrogatório. Com a permissão, o cliente entra na conversa como <strong>parceiro do diagnóstico</strong> — e a qualificação flui." },

    { tipo: "dodont",
      fazer: [
        "Se apresentar com nome e empresa logo de cara.",
        "Explicar por que você vai perguntar (evitar o modelo errado).",
        "Pedir permissão antes de começar a qualificar.",
        "Adaptar o gancho à origem do lead (site, anúncio, indicação...).",
      ],
      evitar: [
        "Disparar perguntas sem contexto, como um interrogatório.",
        "Falar de preço ou modelo antes de entender o uso.",
        "Usar a mesma abertura genérica para qualquer origem.",
        "Prometer economia de energia ou potabilidade na abertura.",
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: "Qual é a função da frase \"para eu indicar o modelo correto e não correr o risco de colocar um equipamento menor ou maior do que o necessário\"?",
      opcoes: [
        "Encher linguiça para a conversa não ficar seca.",
        "Dar o motivo das perguntas, mostrando que a qualificação é a favor do cliente.",
        "Já anunciar o preço do modelo.",
      ],
      correta: 1,
      explicacao: "Explicar o motivo das perguntas reduz resistência: o cliente entende que responder é do interesse dele."
    },
    {
      pergunta: "Um lead pede orçamento direto. Qual é a melhor abertura?",
      opcoes: [
        "Mandar a tabela de preços de todos os modelos na hora.",
        "Confirmar que vai preparar o orçamento, mas pedir permissão para entender o uso antes, para o preço vir do modelo certo.",
        "Dizer que só passa preço depois da visita técnica.",
      ],
      correta: 1,
      explicacao: "Não se recusa o pedido — aceita-se e conquista-se o direito de qualificar antes, para orçar o modelo certo."
    },
    {
      pergunta: "Por que pedir permissão (\"posso entender como será o uso?\") é tão importante na abertura?",
      opcoes: [
        "Porque é obrigatório por lei.",
        "Porque transforma a qualificação em interrogatório.",
        "Porque faz o cliente entrar como parceiro do diagnóstico, e não sentir que está sendo interrogado.",
      ],
      correta: 2,
      explicacao: "A permissão dá ao cliente o papel de colaborador da descoberta, e as perguntas passam a fluir naturalmente."
    },
  ],

  exercicio: {
    enunciado: "Escreva sua própria abertura para um lead que veio de um anúncio no Instagram, mantendo os cinco elementos do SCRIPT-BASE (apresentação, contexto, autoridade, motivo das perguntas e permissão).",
    dica: "Comece conectando ao anúncio (\"você chegou pelo nosso anúncio de bebedouro industrial\") e feche pedindo licença para entender o uso."
  },

  resumo: "A abertura conquista o direito de qualificar. O SCRIPT-BASE tem cinco elementos: apresentação (nome + empresa), contextualização (interesse do cliente), autoridade (você dimensiona), motivo das perguntas (evitar modelo maior ou menor do que o necessário) e pedido de permissão. Adapte o gancho à origem do lead — formulário, WhatsApp, anúncio, indicação, ligação ativa, cliente antigo, orçamento, licitação, revendedor — mas mantenha a estrutura. Pedir permissão é o que evita que a qualificação vire interrogatório."
};
