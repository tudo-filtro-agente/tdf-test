// ============================================================================
// MÓDULO 13 — Conduzindo o processo da venda
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: "A jornada consultiva em 12 etapas: do primeiro contato ao registro no CRM, sem pular diagnóstico e sem jogar preço antes de entender o cenário.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-13-video" },

  blocos: [
    { tipo: "texto", html: "Vender bebedouro industrial não é responder <em>quanto custa</em>. É <strong>conduzir</strong> o cliente por um processo até a decisão certa. Quando você domina a sequência, para de improvisar e passa a controlar o ritmo da conversa — mesmo quando o cliente tenta pular direto para o preço." },

    { tipo: "callout", variante: "info", titulo: "A lógica das 12 etapas",
      html: "Cada etapa prepara a próxima. Se você recomenda antes de diagnosticar, chuta. Se apresenta proposta antes de qualificar, negocia no escuro. A ordem existe por um motivo: <strong>entender antes de indicar, indicar antes de precificar, precificar antes de fechar</strong>." },

    { tipo: "titulo", texto: "As 12 etapas da condução" },
    { tipo: "cards", itens: [
      { icon: "1", titulo: "Receber o lead", html: "Responda rápido — velocidade é conversão. Antes de digitar qualquer coisa, <strong>leia as informações que já chegaram</strong>: origem, cidade, mensagem, produto de interesse. <strong>NÃO mande preço</strong> sem entender o cenário. O primeiro contato é para acolher e abrir a conversa, não para cotar." },
      { icon: "2", titulo: "Rapport", html: "Crie conexão antes de interrogar. Use o nome da pessoa, confirme a cidade, mostre que leu o que ela enviou. Um cliente que se sente ouvido responde às perguntas de diagnóstico com mais detalhe." },
      { icon: "3", titulo: "Diagnosticar", html: "Entenda o uso real: quantas pessoas, quantas <strong>no pico</strong>, quantos turnos, quantos pontos de água, tipo de ambiente e voltagem. É aqui que você descobre o que o cliente precisa — não o que ele pediu." },
      { icon: "4", titulo: "Qualificar (BANT-DP)", html: "Confirme <strong>B</strong>udget (orçamento), <strong>A</strong>uthority (quem decide), <strong>N</strong>eed (a dor), <strong>T</strong>iming (prazo), <strong>D</strong>ecisor e <strong>P</strong>rocesso de compra. Sem isso você não sabe se está falando com quem decide nem quando a compra acontece." },
      { icon: "5", titulo: "Recomendar", html: "Aqui está o coração da consultoria — detalhado no bloco abaixo. Você repete o diagnóstico, confirma, indica o modelo, explica o porquê, mostra os diferenciais e liga tudo à dor do cliente." },
      { icon: "6", titulo: "Apresentar proposta", html: "Estruture com clareza: modelo, quantidade, voltagem, nº de torneiras, valor, forma de pagamento, prazo de entrega, frete, garantia, refil incluso, e <strong>o que está e o que não está incluído</strong>. Proposta ambígua gera objeção depois." },
      { icon: "7", titulo: "Confirmar entendimento", html: "Pergunte <strong>\"essa configuração atende o que você precisa?\"</strong> — e <strong>nunca</strong> \"vai fechar?\". A primeira convida o cliente a validar a solução; a segunda pressiona e trava. Confirme a solução, não force a decisão." },
      { icon: "8", titulo: "Tratar objeções", html: "Objeção é sinal de interesse, não de recusa. Ouça inteira, valide, e responda com valor — não com desconto automático. Preço, prazo e confiança são as três famílias mais comuns." },
      { icon: "9", titulo: "Fechar", html: "Quando a configuração foi confirmada e as objeções resolvidas, conduza para a decisão com naturalidade. Fechar é a consequência de ter feito as etapas anteriores bem — não um ato isolado de pressão." },
      { icon: "10", titulo: "Upsell", html: "Só <strong>depois</strong> que o cliente aceitou o bebedouro. Ofereça os refis Acquabios Multi adicionais (o 1º já vem de brinde). Upsell antes do sim principal atrapalha a venda maior." },
      { icon: "11", titulo: "Próximo passo", html: "<strong>NUNCA</strong> encerre com \"qualquer coisa me avisa\". Defina algo concreto: forma de pagamento, documentos necessários, dia do retorno, data da entrega. Toda conversa fecha com um próximo passo agendado." },
      { icon: "12", titulo: "Registrar no CRM", html: "Anote o diagnóstico, o modelo recomendado, a proposta enviada, as objeções e o próximo passo com data. O que não está no CRM não existe — e o follow-up depende disso." },
    ]},

    { tipo: "titulo", texto: "Etapa 5 em detalhe — a sequência da recomendação" },
    { tipo: "texto", html: "Recomendar não é dizer \"eu indico o de 100 litros\". É conduzir o cliente até <strong>concordar</strong> com a recomendação. Siga a sequência:" },
    { tipo: "checklist", titulo: "Sequência da recomendação consultiva", itens: [
      "Repetir o diagnóstico: \"Pelo que você me falou, são X pessoas, com cerca de Y no pico...\"",
      "Confirmar: \"É isso mesmo?\" — deixe o cliente validar antes de indicar.",
      "Indicar o modelo: \"Para esse cenário, o modelo certo é o de Z litros.\"",
      "Explicar o porquê: pico, recuperação de temperatura e simultaneidade.",
      "Mostrar diferenciais: inox, serpentina 304, torneira metálica, compressor da faixa.",
      "Ligar à dor: como esse modelo resolve exatamente o problema que ele descreveu.",
    ]},

    { tipo: "exemplo",
      cliente: "Temos 120 funcionários na fábrica. No horário do almoço quase todo mundo desce junto, uns 80 ao mesmo tempo. É um ponto só, perto do refeitório.",
      closer: "Então são 120 no total, mas o que manda aqui é o pico: uns 80 pessoas usando quase ao mesmo tempo no almoço. É esse momento que define o equipamento. Para esse pico eu recomendo o de 100 litros — ele tem compressor 1/5, que dá uma recuperação de temperatura melhor. Na prática: quando muita gente pega água junta, ele volta a gelar mais rápido e não deixa a água perder o frio bem na hora de maior movimento. Um modelo menor até atende no total do dia, mas travaria justamente no seu pico do almoço, que é onde a reclamação aparece." },

    { tipo: "dodont",
      fazer: [
        "Responder rápido e ler o que o lead já enviou.",
        "Confirmar o diagnóstico antes de recomendar.",
        "Fechar toda conversa com um próximo passo datado.",
        "Registrar tudo no CRM na hora.",
      ],
      evitar: [
        "Mandar preço no primeiro contato, sem entender o cenário.",
        "Perguntar \"vai fechar?\" em vez de \"essa configuração atende?\".",
        "Oferecer upsell antes de o cliente aceitar o bebedouro.",
        "Encerrar com \"qualquer coisa me avisa\".",
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: "O lead chega pelo site pedindo \"preço do bebedouro\". Qual a primeira ação correta?",
      opcoes: [
        "Enviar a tabela de preços de todos os modelos.",
        "Responder rápido, ler a origem e a cidade, e abrir o diagnóstico antes de cotar.",
        "Perguntar direto \"vai fechar hoje?\".",
      ],
      correta: 1,
      explicacao: "Velocidade sim, mas preço só depois de entender o cenário. O primeiro contato acolhe e diagnostica — não cota no escuro."
    },
    {
      pergunta: "Na etapa de confirmar entendimento, o que você pergunta?",
      opcoes: [
        "\"Vai fechar?\"",
        "\"Essa configuração atende o que você precisa?\"",
        "\"Quer que eu já mande o boleto?\"",
      ],
      correta: 1,
      explicacao: "Confirmar entendimento valida a solução, sem pressionar a decisão. \"Vai fechar?\" trava a conversa."
    },
    {
      pergunta: "Quando oferecer o upsell dos refis Acquabios Multi?",
      opcoes: [
        "Logo no diagnóstico, para aumentar o ticket.",
        "Só depois que o cliente aceitou o bebedouro.",
        "Junto com o primeiro preço, para parecer mais completo.",
      ],
      correta: 1,
      explicacao: "Upsell vem depois do sim principal. Antes disso, ele compete com a venda maior e atrapalha."
    },
  ],

  exercicio: {
    enunciado: "Pegue um atendimento recente e liste em qual das 12 etapas ele parou. Escreva qual seria o próximo passo concreto (com data) que você deveria ter definido antes de encerrar a conversa.",
    dica: "Se você não consegue nomear a etapa, provavelmente pulou o diagnóstico ou a qualificação — volte uma casa."
  },

  resumo: "A venda consultiva é uma sequência de 12 etapas: receber, rapport, diagnosticar, qualificar (BANT-DP), recomendar, apresentar proposta, confirmar entendimento, tratar objeções, fechar, upsell, próximo passo e registrar no CRM. Entender antes de indicar, indicar antes de precificar. Nunca mande preço sem diagnóstico, nunca pergunte \"vai fechar?\" no lugar de \"essa configuração atende?\", e nunca encerre com \"qualquer coisa me avisa\"."
};
