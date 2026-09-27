// ============================================================================
// MÓDULO 08 — Fechamento
// Venda de projeto/combo, ciclo mediano de 12 dias (o mais longo da TDF).
// Resumo do combo, próximo passo, condicional, com decisor. Scripts.
// ============================================================================

module.exports = {
  resumoCurto: 'Fechar Scale Stop é fechar um PROJETO: resumir o combo pela dor, confirmar o decisor, dar um próximo passo concreto e usar o fechamento condicional. Ciclo mediano de 12 dias (o mais longo da TDF) — follow-up com valor faz parte do jogo.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-fechamento-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ No fechamento também vale',
      html: 'Não feche prometendo o que o Scale Stop não faz. Ele <strong>reduz a incrustação sem remover a dureza</strong> — não deixa a água mole. O fechamento honesto é o que não vira dor de cabeça no pós.' },

    { tipo: 'titulo', texto: 'Antes de fechar: os 3 checks' },
    { tipo: 'cards', itens: [
      { icon: '👥', titulo: 'Decisor presente?', html: 'É venda de projeto — confirme que quem decide (e paga) está na conversa. Fechar sem o decisor é fechar no vazio.' },
      { icon: '🧩', titulo: 'Combo alinhado?', html: 'O cliente entendeu o sistema (Scale Stop + o que mais) e concorda com o escopo pela dor dele?' },
      { icon: '💰', titulo: 'Valor > preço?', html: 'O cliente enxerga o valor do sistema (protege a casa, acaba a mancha) acima do número? É o maior ticket da TDF.' },
    ]},

    { tipo: 'titulo', texto: 'O fechamento por resumo (recapitular o projeto)' },
    { tipo: 'script', titulo: 'Amarre a dor ao projeto e peça a decisão',
      passos: [
        '"Então, recapitulando: sua água é dura, de poço/serra, e a mancha branca no box e nas torneiras é o que mais te incomoda."',
        '"A gente resolve isso com o Scale Stop, que ataca a crosta e a mancha sem sal, junto do [Light Filter / V2 / Fibra], que cuida de [partículas / filtragem geral]."',
        '"É um projeto único, dimensionado pra sua casa, que protege boiler, metais, box e louça."',
        '"Faz sentido pra você? Se sim, eu já sigo com [próximo passo concreto]."',
      ] },

    { tipo: 'titulo', texto: 'Fechamento condicional (troca por troca)' },
    { tipo: 'script', titulo: 'Amarre a resposta a um avanço',
      passos: [
        '"Se eu conseguir [condição — ex.: fechar a visita/análise esta semana / uma condição de pagamento que caiba], você consegue tocar o projeto?"',
        'Se sim: avance imediatamente para o próximo passo combinado.',
        'Se não: "o que precisaria ser diferente pra você seguir?" — volta para investigar a objeção real.',
      ] },
    { tipo: 'pendente', html: 'Condições comerciais concretas (descontos, prazos de pagamento, valores) seguem a <strong>política oficial da TDF</strong> — não invente condição para fechar. Use o que está autorizado.' },

    { tipo: 'titulo', texto: 'O próximo passo concreto (nunca "eu te aviso")' },
    { tipo: 'cards', itens: [
      { icon: '📐', titulo: 'Análise / visita', html: 'Como é projeto, o próximo passo costuma ser a análise da água / visita para dimensionar. Marque data.' },
      { icon: '📄', titulo: 'Projeto por escrito', html: 'Enviar o desenho do combo por escrito, com o valor do sistema. Combine quando ele recebe e quando vocês retornam.' },
      { icon: '📅', titulo: 'Retorno com data', html: 'Ciclo é ~12 dias: agende o retorno com dia/hora, não deixe em aberto.' },
    ]},

    { tipo: 'especialista', nome: 'operação TDF', icon: '🧑‍🔬',
      html: 'O ciclo mediano de 12 dias é o mais longo da TDF porque é venda de projeto que exige análise e dimensionamento. Isso não é problema — é a natureza. O que fecha é o <strong>follow-up com valor</strong> (lembrar da dor, mandar o projeto, marcar retorno), não a pressa.' },

    { tipo: 'callout', variante: 'sucesso', titulo: 'A régua do fechamento saudável',
      html: 'Toda conversa termina com: (1) o cliente entendeu o projeto pela dor dele, (2) o decisor está no jogo, (3) existe um próximo passo com <strong>data</strong>. Se faltar um desses, você não fechou — você adiou sem plano.' },

    { tipo: 'dodont',
      fazer: [
        'Recapitular o projeto amarrado à dor antes de pedir a decisão.',
        'Confirmar o decisor e dar sempre um próximo passo com data.',
        'Nutrir o ciclo de ~12 dias com follow-up de valor (projeto, retorno).',
      ],
      evitar: [
        'Fechar sem o decisor ou sem o cliente entender o combo.',
        'Prometer água mole/remoção de dureza para conseguir o sim.',
        'Inventar condição comercial fora da política oficial.',
      ] },
  
    // ------------------------------------------------- A MOEDA DA INSTALAÇÃO (Paulo, 09/07/2026)
    { tipo: 'titulo', texto: 'A moeda da instalação (técnica oficial de fechamento)' },
    { tipo: 'texto', html: 'A instalação é <strong>produto, não taxa</strong>. Tempo 1 — <strong>ancore valor SEMPRE</strong>: "a instalação é completa: nosso técnico leva TODO o material — tubulação, registro, conexões. Você não se preocupa com nada. R$ 590 (até 200 km; acima, +R$ 200 a cada 100 km)". Tempo 2 — <strong>bonificação SÓ como moeda de fechamento</strong> (último caso), ancorada em logística e prazo.' },
    { tipo: 'script', titulo: 'O fechamento com a instalação (quando o cliente hesita)',
      fala: 'Deixa eu te falar — eu estava olhando aqui sobre a instalação enquanto a gente conversava. Caso você consiga fechar até hoje ou amanhã, eu consigo te bonificar 50% (ou até 100%) da instalação, porque te encaixo na rota do técnico.' },
    { tipo: 'dodont',
      fazer: ['Gerar valor primeiro (concierge: levamos tudo — tubulação, registro, conexões)', 'Bonificar só com prazo + justificativa logística', 'Oferecer a válvula automática na mesma conversa'],
      evitar: ['Dar instalação grátis de cara (joga fora R$ 590 de valor percebido)', 'Bonificar sem contrapartida de fechamento'] },
],

  perguntasRapidas: [
    { pergunta: 'O ciclo mediano de 12 dias do Scale Stop significa que…',
      opcoes: ['A venda está perdida.', 'É venda de projeto que exige análise/dimensionamento — o follow-up com valor é parte do fechamento.', 'Você deve pressionar pra fechar no primeiro contato.'],
      correta: 1, explicacao: 'É o ciclo mais longo da TDF por ser projeto. Nutrir com valor (projeto, retorno com data) é o que fecha.' },
    { pergunta: 'O que não pode faltar ao encerrar uma conversa de fechamento?',
      opcoes: ['Um desconto.', 'Um próximo passo concreto com data (e o decisor no jogo).', 'A promessa de água mole.'],
      correta: 1, explicacao: 'Fechamento saudável = cliente entendeu o projeto, decisor presente e próximo passo com data. Sem isso, você só adiou.' },
    { pergunta: 'No fechamento condicional, o que você faz?',
      opcoes: ['Baixa o preço sem contrapartida.', 'Amarra a resposta do cliente a um avanço concreto ("se eu conseguir X, você toca o projeto?").', 'Promete o que for preciso pra fechar.'],
      correta: 1, explicacao: 'Condicional troca por troca: cada concessão vem amarrada a um avanço. Sempre dentro da política oficial.' },
  ],

  exercicio: {
    enunciado: 'Escreva um fechamento por resumo para um cliente de poço na serra com verba, dor de mancha branca, combo Scale Stop + Fibra, terminando com um próximo passo concreto e com data — sem prometer água mole.',
    dica: 'Recapitule dor → projeto → valor pra casa → "faz sentido?" → marque análise/retorno com dia. Confirme o decisor.'
  },

  resumo: 'Fechar Scale Stop = fechar projeto. Antes: confirme decisor, alinhamento do combo e valor > preço. Use fechamento por resumo (amarrar dor→projeto) e condicional (troca por troca, dentro da política oficial). Sempre termine com próximo passo concreto e data (análise/visita, projeto por escrito, retorno). Ciclo mediano de 12 dias: nutra com follow-up de valor. Nunca feche prometendo remover dureza/água mole.'
};
