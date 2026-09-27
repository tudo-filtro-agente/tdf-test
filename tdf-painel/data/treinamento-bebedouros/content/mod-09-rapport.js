// ============================================================================
// MÓDULO 9 — Rapport com propósito
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: "Rapport de verdade não é puxar assunto nem virar amigo do cliente: é construir confiança, conexão e segurança para que ele se sinta à vontade de contar como será o uso do bebedouro.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-09-video" },

  blocos: [
    { tipo: "texto", html: "Muita gente aprende que rapport é <strong>puxar assunto</strong>, falar de futebol ou soltar uma piada para \"quebrar o gelo\". Não é. No B2B consultivo, rapport é o que faz o cliente <strong>baixar a guarda e falar a verdade</strong> sobre o uso, o orçamento e o prazo — sem isso, você não dimensiona certo e não vende." },

    { tipo: "titulo", texto: "O que rapport REALMENTE é" },
    { tipo: "cards", itens: [
      { icon: "🤝", titulo: "Confiança", html: "O cliente sente que você está do lado dele, não só querendo empurrar um modelo." },
      { icon: "🔗", titulo: "Conexão", html: "Ele percebe que você entendeu o cenário dele especificamente, não um script genérico." },
      { icon: "🛡️", titulo: "Segurança", html: "Ele fica tranquilo de que a recomendação foi pensada e não vai errar o tamanho." },
      { icon: "💡", titulo: "Clareza", html: "A conversa flui, sem jargão desnecessário e sem enrolação." },
      { icon: "👂", titulo: "Interesse real", html: "Você quer mesmo entender o problema dele — e isso aparece nas perguntas." },
      { icon: "⏱️", titulo: "Respeito ao tempo", html: "Você vai direto ao ponto e mostra que valoriza a agenda do cliente." },
    ]},

    { tipo: "callout", variante: "info", titulo: "Rapport NÃO é",
      html: "Não é ser amigo do cliente, não é bajular, não é puxar assunto sobre a vida pessoal. É criar o <strong>ambiente de confiança</strong> no qual uma venda consultiva acontece." },

    { tipo: "titulo", texto: "Técnica 1 — Escuta ativa" },
    { tipo: "texto", html: "Escutar ativamente é <strong>devolver ao cliente o que ele disse, já traduzido para o problema técnico</strong>. Isso prova que você entendeu e ainda avança o diagnóstico." },
    { tipo: "exemplo",
      cliente: "No horário do almoço a água fica quente, aí todo mundo reclama.",
      closer: "Entendi. Então o ponto crítico é o pico do almoço: chega todo mundo junto e o equipamento atual não consegue recuperar a temperatura na velocidade do consumo. É exatamente aí que a gente precisa dimensionar certo." },
    { tipo: "texto", html: "Repare: o closer não mudou de assunto nem começou a falar de preço. Ele <strong>confirmou que o problema é perda de refrigeração no pico</strong> — e o cliente sente que foi ouvido." },

    { tipo: "titulo", texto: "Técnica 2 — Espelhamento" },
    { tipo: "texto", html: "Use <strong>as palavras do próprio cliente</strong>. Se ele diz \"funcionários\", você diz \"funcionários\". Se ele diz \"colaboradores\", use \"colaboradores\". Se é uma \"obra\", fale \"obra\", não \"empreendimento\". Espelhar o vocabulário reduz distância e mostra atenção." },
    { tipo: "cards", itens: [
      { icon: "🗣️", titulo: "Cliente diz \"funcionários\"", html: "Você responde: \"Para atender bem seus funcionários no pico...\" — não troque por \"pessoal\" ou \"staff\"." },
      { icon: "🗣️", titulo: "Cliente diz \"colaboradores\"", html: "Você mantém: \"Quantos colaboradores usam ao mesmo tempo no intervalo?\"" },
      { icon: "🗣️", titulo: "Cliente diz \"obra\"", html: "Você acompanha: \"Na obra, os pedreiros bebem mais concentrado em algum horário?\"" },
    ]},

    { tipo: "titulo", texto: "Técnica 3 — Validação" },
    { tipo: "texto", html: "Validar é <strong>reconhecer que a preocupação do cliente é legítima</strong> antes de resolver. Isso desarma a defensividade." },
    { tipo: "script", contexto: "Cliente com receio de errar o tamanho",
      fala: "Faz todo sentido essa preocupação — errar o tamanho do bebedouro é caro dos dois lados: se vier pequeno, falta água no pico; se vier grande demais, você pagou por capacidade que não usa. Por isso eu prefiro entender o uso antes de indicar." },
    { tipo: "script", contexto: "Cliente que já teve experiência ruim",
      fala: "Entendo perfeitamente, e você tem razão de ficar de pé atrás depois disso. Deixa eu te mostrar como a gente evita repetir esse problema olhando o pico de consumo e a recuperação de temperatura." },

    { tipo: "titulo", texto: "Técnica 4 — Contextualização" },
    { tipo: "texto", html: "Contextualizar é <strong>trazer a conversa para a realidade específica do cliente</strong>, mostrando que o número que importa é o dele, não uma média genérica." },
    { tipo: "exemplo",
      cliente: "Tenho uns 400 alunos na academia, qual bebedouro serve?",
      closer: "Ótimo, 400 é o total de alunos, mas o que define o modelo não é o total — é quantos usam o bebedouro no mesmo horário. Numa academia, o pico costuma ser no início da noite. Quantos alunos você tem na aula das 18h/19h, mais ou menos?" },
    { tipo: "callout", variante: "alerta", titulo: "Sempre traga para o pico",
      html: "Contextualizar em bebedouro quase sempre significa levar o cliente do <strong>total</strong> para o <strong>pico de uso simultâneo</strong>. Nunca recomende modelo só pelo total de pessoas." },

    { tipo: "dodont",
      fazer: [
        "Ouvir mais do que falar e devolver o problema traduzido.",
        "Usar as mesmas palavras que o cliente usou.",
        "Validar a preocupação antes de resolver.",
        "Ir direto ao ponto — respeitar o tempo é rapport.",
      ],
      evitar: [
        "Perguntas invasivas sobre a vida pessoal do cliente.",
        "Piadas forçadas e excesso de informalidade.",
        "Fingir intimidade ou concordar com tudo só para agradar.",
        "Interromper o cliente e falar demais de si mesmo.",
      ]
    },

    { tipo: "titulo", texto: "Rapport por canal" },
    { tipo: "texto", html: "O propósito é o mesmo, mas o jeito muda conforme o canal e o tipo de cliente." },

    { tipo: "card", titulo: "Telefone", icon: "📞", html: "Sem imagem, a voz carrega tudo. Fale com calma, confirme o nome e sinalize que vai ser rápido." },
    { tipo: "script", contexto: "Abertura por telefone",
      fala: "Oi, [nome], tudo bem? Aqui é [consultor] da Tudo de Filtro. Consigo te roubar dois minutos para entender o uso e já te indicar o modelo certo?" },

    { tipo: "card", titulo: "WhatsApp", icon: "💬", html: "Mensagens curtas, uma pergunta por vez, sem áudio gigante. Espelhe o tom do cliente." },
    { tipo: "script", contexto: "Primeira resposta no WhatsApp",
      fala: "Oi, [nome]! Que bom que chamou. Pra eu te indicar o bebedouro certo e não errar no tamanho, me conta rapidinho: é pra empresa, obra, academia...? E umas quantas pessoas usam no horário de maior movimento?" },

    { tipo: "card", titulo: "Videoconferência", icon: "🎥", html: "Câmera ligada, olho na câmera, e valide o que a pessoa mostra na tela do ambiente." },
    { tipo: "script", contexto: "Abertura em vídeo",
      fala: "Consigo te ver bem, [nome]. Se puder, me mostra depois onde ficaria o bebedouro — isso me ajuda a pensar no ponto de água e na ventilação. Antes disso, me explica como é o uso no dia a dia?" },

    { tipo: "card", titulo: "Presencial", icon: "🏢", html: "Olhe o ambiente com o cliente, comente o que vê (fluxo de pessoas, ponto de água) e conecte ao problema." },
    { tipo: "script", contexto: "Visita presencial",
      fala: "Já dá pra sentir o movimento aqui. No horário de pico, esse corredor deve encher, né? Vamos olhar juntos onde tem ponto de água pra eu pensar no melhor lugar e no modelo certo." },

    { tipo: "card", titulo: "Cliente apressado", icon: "⚡", html: "Respeito ao tempo é rapport. Prometa objetividade e cumpra." },
    { tipo: "script", contexto: "Cliente sem tempo",
      fala: "Vou ser direto pra não tomar seu tempo: me responde só duas coisas — quantas pessoas usam no pico e qual a voltagem do local — e eu já te digo o modelo certo e o valor." },

    { tipo: "card", titulo: "Cliente técnico", icon: "🔧", html: "Fale com precisão, use os termos corretos e mostre domínio de compressor, recuperação e pontos de água." },
    { tipo: "script", contexto: "Cliente técnico (manutenção/engenharia)",
      fala: "Como você é da área, direto ao ponto: o que pesa aqui é o compressor e a recuperação de temperatura no pico. Me passa o efetivo por turno e a simultaneidade que eu já dimensiono a serpentina e os pontos certos." },

    { tipo: "card", titulo: "Focado em preço", icon: "💰", html: "Não brigue pelo preço na largada. Valide a preocupação e reancore em custo de errar o tamanho." },
    { tipo: "script", contexto: "Cliente que só fala em preço",
      fala: "Entendo, preço conta mesmo. Só que o mais caro é comprar o tamanho errado: se faltar água no pico, você troca de novo. Deixa eu entender rapidinho o uso pra te dar o preço do modelo certo — nem maior, nem menor do que precisa." },
  ],

  perguntasRapidas: [
    {
      pergunta: "O cliente diz: \"no horário do almoço a água fica quente\". Qual resposta demonstra escuta ativa?",
      opcoes: [
        "Que dia! Aqui também tá calor demais, né?",
        "Então o ponto crítico é o pico do almoço: o equipamento não recupera a temperatura na velocidade do consumo. É aí que precisamos dimensionar certo.",
        "Temos um modelo de 100 litros em promoção esta semana.",
      ],
      correta: 1,
      explicacao: "Escuta ativa é devolver o que o cliente disse já traduzido para o problema técnico — aqui, perda de refrigeração no pico."
    },
    {
      pergunta: "O cliente fala \"meus colaboradores\". Como aplicar espelhamento?",
      opcoes: [
        "Continuar usando \"a galera\" para soar próximo.",
        "Usar a mesma palavra: \"quantos colaboradores usam ao mesmo tempo no pico?\"",
        "Trocar por \"funcionários\", que é mais formal.",
      ],
      correta: 1,
      explicacao: "Espelhamento é usar o mesmo vocabulário do cliente. Se ele diz colaboradores, você diz colaboradores."
    },
    {
      pergunta: "Qual destas atitudes NÃO constrói rapport?",
      opcoes: [
        "Validar a preocupação do cliente antes de resolver.",
        "Fazer piadas forçadas e perguntas sobre a vida pessoal para \"quebrar o gelo\".",
        "Ir direto ao ponto com um cliente apressado.",
      ],
      correta: 1,
      explicacao: "Rapport não é puxar assunto nem forçar intimidade. É confiança, clareza e respeito ao tempo."
    },
  ],

  exercicio: {
    enunciado: "Um cliente de academia manda no WhatsApp: \"tenho 500 alunos, qual bebedouro?\". Escreva uma resposta que use validação, espelhamento (a palavra \"alunos\") e contextualização, levando ele do total para o pico.",
    dica: "Reconheça o número, mantenha a palavra \"alunos\" e pergunte quantos usam no horário de maior movimento (ex.: começo da noite)."
  },

  resumo: "Rapport com propósito é criar confiança, conexão, segurança, clareza e respeito ao tempo — não puxar assunto nem virar amigo. As técnicas centrais são escuta ativa (devolver o problema traduzido), espelhamento (usar as palavras do cliente), validação (reconhecer a preocupação) e contextualização (levar do total para o pico). O jeito muda por canal e por perfil, mas o objetivo é sempre o mesmo: o cliente falar a verdade sobre o uso para você dimensionar certo."
};
