// ============================================================================
// MÓDULO 12 — SPIN Selling aplicado
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: "SPIN Selling conduz o cliente da Situação ao Problema, deste à Implicação (o custo de não resolver) e, por fim, à Necessidade de solução — fazendo ele próprio concluir que precisa do bebedouro certo.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-12-video" },

  blocos: [
    { tipo: "texto", html: "SPIN é uma sequência de perguntas que leva o cliente a <strong>construir sozinho a percepção de necessidade</strong>. São quatro tipos: <strong>S</strong>ituação, <strong>P</strong>roblema, <strong>I</strong>mplicação e <strong>N</strong>ecessidade de solução. A força está na ordem: você não empurra a solução, você faz o cliente chegar até ela." },

    { tipo: "cards", itens: [
      { icon: "🗺️", titulo: "S — Situação", html: "Levanta o cenário atual: quantas pessoas, como fornecem água, qual equipamento, turnos." },
      { icon: "⚠️", titulo: "P — Problema", html: "Traz à tona as dores: água quente, reclamação, falta, troca de galão, torneira que quebra." },
      { icon: "📉", titulo: "I — Implicação", html: "Amplia o custo do problema: produtividade, reclamação da diretoria, risco de faltar água no turno." },
      { icon: "✅", titulo: "N — Necessidade de solução", html: "Faz o cliente enunciar o valor de resolver: água gelada no pico, fim do galão, margem, suporte." },
    ]},

    { tipo: "callout", variante: "info", titulo: "A ordem importa",
      html: "Situação e Problema levantam o terreno. A <strong>Implicação</strong> é onde a venda ganha peso — é ela que faz a dor doer o suficiente para justificar o investimento. Só então a Necessidade de solução aparece natural." },

    { tipo: "titulo", texto: "S — Perguntas de Situação" },
    { tipo: "texto", html: "Mapeiam o cenário atual sem julgar. Faça poucas e objetivas — o cliente não gosta de repetir o óbvio." },
    { tipo: "perguntas", titulo: "Perguntas de Situação", itens: [
      "Quantas pessoas costumam usar a água aí no dia a dia?",
      "Como vocês fornecem água hoje?",
      "Qual equipamento vocês usam atualmente?",
      "Vocês trabalham em quantos turnos?",
    ]},

    { tipo: "titulo", texto: "P — Perguntas de Problema" },
    { tipo: "texto", html: "Revelam a dor. Cada pergunta abre uma ferida que o bebedouro certo resolve." },
    { tipo: "perguntas", titulo: "Perguntas de Problema", itens: [
      "No horário de pico, a água chega a perder a refrigeração?",
      "As pessoas reclamam de água quente ou morna?",
      "Já aconteceu de faltar água no meio do expediente?",
      "Quem para para trocar o galão quando acaba?",
      "As torneiras atuais quebram ou dão problema?",
      "Você sente que o equipamento de hoje está subdimensionado?",
    ]},
    { tipo: "exemplo",
      cliente: "No almoço a água fica quente e todo mundo reclama.",
      closer: "Entendi, então no pico do almoço o equipamento não dá conta de manter a água gelada. E quando isso acontece, o pessoal reclama direto com você ou some pra comprar água fora?" },

    { tipo: "titulo", texto: "I — Perguntas de Implicação" },
    { tipo: "texto", html: "Aqui a venda cresce. A Implicação mostra <strong>o custo de continuar com o problema</strong> — em produtividade, imagem e risco. Deixe o cliente sentir o tamanho da dor." },
    { tipo: "perguntas", titulo: "Perguntas de Implicação", itens: [
      "O que acontece com o pessoal quando a água fica quente no pico?",
      "Quantas pessoas são afetadas quando falta água?",
      "Isso chega a atrapalhar a produtividade da equipe?",
      "Essas reclamações já chegaram até a diretoria?",
      "Quanto tempo se perde parando a operação pra trocar galão?",
      "Qual o risco de simplesmente faltar água num turno cheio?",
    ]},
    { tipo: "exemplo",
      cliente: "Aí um vai buscar água na padaria e demora pra voltar.",
      closer: "Então além do incômodo, você tem gente saindo do posto pra buscar água — isso é tempo de trabalho perdido, várias vezes ao dia. Se somar no mês, dá pra sentir no bolso, né?" },
    { tipo: "callout", variante: "alerta", titulo: "Não pule a Implicação",
      html: "Vendedor iniciante vai direto do Problema para a oferta. Sem Implicação, o cliente reconhece a dor mas não vê urgência — e o preço parece caro. É a Implicação que <strong>justifica o investimento</strong>." },

    { tipo: "titulo", texto: "N — Perguntas de Necessidade de solução" },
    { tipo: "texto", html: "Fazem o cliente <strong>dizer com as próprias palavras</strong> o valor de resolver. Quando ele mesmo enuncia o benefício, a objeção de preço praticamente cai." },
    { tipo: "perguntas", titulo: "Perguntas de Necessidade de solução", itens: [
      "Se a água ficasse gelada justamente no pico, isso resolveria a reclamação?",
      "Eliminar a troca de galão ajudaria a equipe a não parar a operação?",
      "Faz sentido já pensar numa margem de capacidade pro crescimento de vocês?",
      "Ter suporte e peças de reposição garantidos traz mais segurança pra decisão?",
    ]},
    { tipo: "exemplo",
      cliente: "Com certeza, se a água ficasse gelada no almoço já resolvia metade dos problemas.",
      closer: "Perfeito. Então o que você busca é um equipamento que segure a água gelada exatamente no pico e acabe com a dependência de galão. É isso que eu vou dimensionar pra você." },

    { tipo: "titulo", texto: "SPIN e o dimensionamento" },
    { tipo: "texto", html: "SPIN não substitui o dimensionamento — ele <strong>prepara o terreno</strong>. Quando o cliente já reconheceu a dor do pico, a pergunta técnica \"quantos usam ao mesmo tempo?\" faz todo sentido pra ele." },
    { tipo: "callout", variante: "sucesso", titulo: "Do problema ao modelo certo",
      html: "A Implicação sobre \"faltar água no pico\" conecta direto com a regra de ouro: o modelo se define pelo <strong>pico de consumo simultâneo</strong> e pela recuperação de temperatura, nunca só pelo total de pessoas." },

    { tipo: "dodont",
      fazer: [
        "Fazer poucas perguntas de Situação e ir direto ao ponto.",
        "Investir na Implicação — é ela que dá peso à dor.",
        "Deixar o cliente enunciar o benefício na Necessidade de solução.",
        "Conectar o pico levantado no SPIN ao dimensionamento.",
      ],
      evitar: [
        "Repetir perguntas de Situação sobre coisas que você já sabe.",
        "Pular da dor direto para o preço, sem Implicação.",
        "Responder pelo cliente em vez de deixá-lo concluir.",
        "Prometer economia percentual ou potabilidade para reforçar a dor.",
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: "Classifique: \"Quantas pessoas costumam usar a água aí no dia a dia?\"",
      opcoes: [
        "Situação",
        "Implicação",
        "Necessidade de solução",
      ],
      correta: 0,
      explicacao: "É uma pergunta de Situação: levanta o cenário atual, sem ainda tocar na dor."
    },
    {
      pergunta: "Classifique: \"O que acontece com a produtividade quando falta água no pico?\"",
      opcoes: [
        "Problema",
        "Implicação",
        "Situação",
      ],
      correta: 1,
      explicacao: "É Implicação: amplia o custo do problema (produtividade), aumentando a urgência de resolver."
    },
    {
      pergunta: "Classifique: \"Se a água ficasse gelada no pico, isso resolveria a reclamação?\"",
      opcoes: [
        "Situação",
        "Problema",
        "Necessidade de solução",
      ],
      correta: 2,
      explicacao: "É Necessidade de solução: faz o cliente enunciar o valor de resolver, preparando o fechamento."
    },
  ],

  exercicio: {
    enunciado: "Monte uma sequência SPIN completa (uma pergunta de cada tipo: S, P, I, N) para um restaurante que hoje usa galão e reclama de falta de água no horário do almoço.",
    dica: "Na Implicação, explore o custo de alguém sair para comprar água fora; na Necessidade, faça o cliente confirmar que quer água gelada garantida no pico."
  },

  resumo: "SPIN conduz o cliente por quatro tipos de pergunta: Situação (cenário atual), Problema (a dor: água quente, reclamação, falta, galão, torneira quebrada), Implicação (o custo de não resolver: produtividade, diretoria, risco de faltar no turno) e Necessidade de solução (o cliente enuncia o valor: água gelada no pico, fim do galão, margem, suporte). A Implicação é o passo que dá peso à dor e justifica o investimento; sem ela, o preço parece caro. O pico levantado no SPIN conecta direto com o dimensionamento do modelo certo."
};
