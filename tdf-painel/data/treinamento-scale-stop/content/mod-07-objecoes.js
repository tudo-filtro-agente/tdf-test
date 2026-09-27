// ============================================================================
// MÓDULO 07 — Objeções
// Estrutura: ouvir -> confirmar -> investigar -> responder -> próximo passo.
// "está caro", "deixa a água mole?", "abrandador não é melhor?", "vou pensar",
// "só quero tirar a mancha".
// ============================================================================

module.exports = {
  resumoCurto: 'As objeções do Scale Stop giram em torno de preço (é o maior ticket), da confusão com abrandador ("deixa a água mole?", "abrandador não é melhor?") e do escopo ("só quero tirar a mancha"). Trate com honestidade técnica: nunca ganhe a objeção prometendo água mole.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-objecoes-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ A regra que não se quebra (vale em toda objeção)',
      html: 'Nenhuma objeção se resolve prometendo o que o Scale Stop não faz. Ele <strong>reduz a incrustação sem remover a dureza</strong> — <strong>não deixa a água mole</strong>. Ganhar a objeção mentindo custa a venda no pós-venda.' },

    { tipo: 'titulo', texto: 'A estrutura (use em todas)' },
    { tipo: 'texto', html: '<strong>Ouvir</strong> (deixe falar) → <strong>Confirmar</strong> (mostre que entendeu) → <strong>Investigar</strong> (uma pergunta que abre o real motivo) → <strong>Responder</strong> (com honestidade técnica) → <strong>Próximo passo</strong> (avance o processo). Objeção não é ataque; é pedido de informação.' },

    { tipo: 'titulo', texto: '"Está caro"' },
    { tipo: 'script', titulo: 'Ouvir → confirmar → investigar → responder → próximo passo',
      passos: [
        'Ouvir: deixe ele colocar o incômodo do preço sem interromper.',
        'Confirmar: "Entendo — é um investimento e você quer ter certeza de que vale."',
        'Investigar: "Caro comparado a quê? Você já viu outra proposta, ou é o valor em si que assustou?"',
        'Responder: "Esse é o nosso projeto mais parrudo porque ele protege a casa inteira — boiler, resistência, metais, box e louça — e ataca a mancha branca de vez. Não é uma peça, é um sistema dimensionado pra sua água."',
        'Próximo passo: "Posso te mostrar o desenho do projeto e a gente vê forma de pagamento que caiba? Assim você decide com o valor completo na mão."',
      ] },

    { tipo: 'titulo', texto: '"Isso deixa a água mole?" (a mais importante de corrigir)' },
    { tipo: 'dodont',
      fazer: [
        'Corrigir com responsabilidade: "não, água mole é o abrandador".',
        'Explicar o que ELE faz: reduz a crosta/mancha convertendo o cálcio, sem sal.',
        'Perguntar o objetivo real (parar a crosta × água mole) pra indicar o certo.',
      ],
      evitar: [
        'Dizer "mais ou menos" ou deixar o cliente achar que sim.',
        'Confirmar "água mole" só pra fechar.',
        'Fingir que Scale Stop e abrandador são a mesma coisa.',
      ] },
    { tipo: 'script', titulo: 'Resposta modelo',
      passos: [
        'Confirmar: "Pergunta certíssima, e vou ser 100% honesto com você."',
        'Responder: "O Scale Stop não deixa a água mole — quem faz isso é o abrandador, que usa sal e troca o cálcio por sódio. O Scale Stop muda a forma do cálcio pra ele parar de grudar: a mancha e a crosta caem muito, sem sal e sem mexer nos minerais."',
        'Investigar: "Seu objetivo é parar a mancha/crosta, ou você precisa mesmo da água mole? Isso define o caminho certo."',
      ] },

    { tipo: 'titulo', texto: '"Abrandador não é melhor?"' },
    { tipo: 'script', titulo: 'Não é melhor nem pior — é objetivo diferente',
      passos: [
        'Confirmar: "Boa — os dois são bons, mas resolvem coisas diferentes."',
        'Responder: "O abrandador remove a dureza e deixa a água mole, mas usa sal, adiciona sódio e precisa de dreno pra salmoura. O Scale Stop reduz a crosta sem sal, sem sódio e sem dreno."',
        'Investigar: "Você faz questão da água mole, ou o que te incomoda é a mancha/crosta e você prefere não lidar com sal? Isso decide."',
        'Próximo passo: "Com base na sua resposta, eu te trago o projeto certo — não o mais caro, o certo."',
      ] },

    { tipo: 'titulo', texto: '"Vou pensar"' },
    { tipo: 'script', titulo: 'Descobrir o que trava (ciclo é de ~12 dias, é normal pensar)',
      passos: [
        'Confirmar: "Faz sentido, é um projeto — natural querer pensar."',
        'Investigar: "Só pra eu te ajudar melhor: o que ainda está te deixando em dúvida — é o valor, é entender se resolve mesmo, ou é falar com alguém em casa?"',
        'Responder: trate exatamente o ponto que ele citar (valor, eficácia ou decisor).',
        'Próximo passo: "Combina de eu te mandar o projeto por escrito e a gente marca um retorno pra [dia]? Assim você pensa com tudo na mão."',
      ] },

    { tipo: 'titulo', texto: '"Só quero tirar a mancha (não quero um projetão)"' },
    { tipo: 'script', titulo: 'Respeitar o desejo, dimensionar pela dor',
      passos: [
        'Confirmar: "Perfeito — seu foco é acabar com a mancha branca, é isso que vamos resolver."',
        'Investigar: "De onde vem sua água (poço/serra)? Ela aparece só no box ou também em torneira, boiler, louça?"',
        'Responder: "A mancha vem da dureza da água. O Scale Stop é exatamente o componente que ataca isso. Dependendo do seu caso, ele resolve bem acompanhado de mais uma etapa — mas quem define é a sua água, não a vontade de vender."',
        'Próximo passo: "Deixa eu levantar sua água e te trazer a solução no tamanho certo — nem a mais, nem a menos."',
      ] },

    { tipo: 'callout', variante: 'sucesso', titulo: 'Fechamento mental de toda objeção',
      html: 'Se você respondeu com honestidade e avançou uma etapa (mandar projeto, marcar retorno, levantar a água), a objeção cumpriu o papel: virou informação e próximo passo. Nunca termine uma objeção sem um próximo passo combinado.' },

    { tipo: 'pendente', html: 'Se a objeção for técnica (vazão, capacidade, "vai aguentar minha vazão?"), <strong>não improvise número</strong>: leve ao especialista/ficha oficial e volte com o dado certo.' },
  ],

  perguntasRapidas: [
    { pergunta: 'Cliente: "isso deixa a água mole?" Melhor resposta?',
      opcoes: ['"Sim, deixa a água bem mais mole."', '"Não — água mole é o abrandador; o Scale Stop reduz a crosta/mancha sem sal, mantendo os minerais."', '"Mais ou menos, depende."'],
      correta: 1, explicacao: 'Corrigir com honestidade. Prometer água mole no Scale Stop é errado e volta como problema no pós-venda.' },
    { pergunta: 'Qual é a estrutura correta para tratar objeção?',
      opcoes: ['Rebater na hora e insistir no fechamento.', 'Ouvir → confirmar → investigar → responder → próximo passo.', 'Baixar o preço imediatamente.'],
      correta: 1, explicacao: 'Objeção é pedido de informação: entenda o real motivo antes de responder e sempre avance uma etapa.' },
    { pergunta: 'Cliente: "abrandador não é melhor?" Como conduzir?',
      opcoes: ['"É melhor sim, vou te vender um abrandador."', 'Explicar que são objetivos diferentes (remover dureza/água mole × reduzir crosta sem sal) e perguntar o objetivo dele.', '"Abrandador é ruim, nem pense."'],
      correta: 1, explicacao: 'Nenhum é "melhor" — resolvem coisas diferentes. O objetivo do cliente define qual indicar.' },
  ],

  exercicio: {
    enunciado: 'Um cliente com verba diz: "achei caro, e um vizinho falou que abrandador é melhor porque deixa a água mole". Responda usando a estrutura (ouvir→confirmar→investigar→responder→próximo passo), sem prometer água mole no Scale Stop.',
    dica: 'Separe as duas objeções: preço (valor do sistema) e abrandador (objetivo diferente). Investigue o objetivo real e feche com um próximo passo (projeto por escrito + retorno).'
  },

  resumo: 'Trate toda objeção com ouvir→confirmar→investigar→responder→próximo passo. "Está caro": ancore no valor do sistema (maior ticket, protege a casa toda). "Deixa a água mole?"/"Abrandador é melhor?": corrija com honestidade — água mole é abrandador; Scale Stop reduz crosta sem sal; objetivo decide. "Vou pensar": descubra o que trava e marque retorno. "Só quero tirar a mancha": dimensione pela dor. Nunca ganhe a objeção prometendo remover dureza/água mole; dúvidas técnicas vão ao especialista.'
};
