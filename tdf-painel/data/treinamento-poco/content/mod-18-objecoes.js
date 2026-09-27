// ============================================================================
// MÓDULO 18 — Objeções (água de poço)
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js
// Blocos: texto | titulo | callout | card | cards | script | dodont |
//         checklist | tabela | perguntas | exemplo | pendente | especialista
// Estrutura de toda resposta: ouvir → confirmar → investigar → responder com
// responsabilidade → próximo passo. NUNCA prometer potabilidade nem afirmar que
// uma tecnologia resolve tudo. Sempre reconduzir para análise/hidráulica/especialista.
// ============================================================================

module.exports = {
  resumoCurto: 'Como responder às 17 objeções mais comuns de poço sem prometer potabilidade e sem dizer que "uma tecnologia resolve tudo". Toda resposta reconhece, educa com responsabilidade e reconduz para análise, hidráulica ou especialista.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-18-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'A régua de toda objeção',
      html: 'Nenhuma objeção se vence com promessa. Você <strong>nunca</strong> garante potabilidade, <strong>nunca</strong> diz que remove 100% de um contaminante e <strong>nunca</strong> afirma que uma tecnologia resolve tudo. A saída é sempre a mesma: <strong>reconhecer → educar com responsabilidade → reconduzir para análise, hidráulica ou especialista</strong>.' },

    { tipo: 'titulo', texto: 'A estrutura de resposta (use em todas)' },
    { tipo: 'cards', itens: [
      { icon: '👂', titulo: '1. Ouvir', html: 'Deixe o cliente falar até o fim. Não interrompa a objeção.' },
      { icon: '🤝', titulo: '2. Confirmar', html: 'Reconheça o ponto: "faz sentido você pensar assim".' },
      { icon: '🔎', titulo: '3. Investigar', html: 'Pergunte para entender o que está por trás.' },
      { icon: '🧭', titulo: '4. Responder', html: 'Eduque com responsabilidade — sem prometer.' },
      { icon: '➡️', titulo: '5. Próximo passo', html: 'Reconduza para análise / hidráulica / especialista.' },
    ]},
    { tipo: 'texto', html: 'Abaixo, cada objeção aparece como um diálogo. A fala do <strong>Cliente</strong> é a objeção; a do <strong>Consultor</strong> mostra a resposta na régua acima. Adapte as palavras, mantenha a lógica.' },

    // 1 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 1 — "Minha água é transparente"' },
    { tipo: 'exemplo',
      cliente: 'Minha água é transparente, então ela é boa.',
      closer: '<strong>Confirmo:</strong> água limpa passa mesmo essa sensação de segurança, entendo. <strong>Investigo:</strong> posso te perguntar se você já fez uma análise dela? <strong>Respondo:</strong> transparência é só um parâmetro físico — vários contaminantes, como nitrato, alguns metais e bactérias, <em>não têm cor, cheiro nem gosto</em>. O olho não enxerga potabilidade. <strong>Próximo passo:</strong> a única forma de saber é a análise laboratorial. Me envia um laudo recente ou a gente agenda a coleta?' },

    // 2 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 2 — "Sempre bebemos e nunca aconteceu nada"' },
    { tipo: 'exemplo',
      cliente: 'A gente sempre bebeu essa água e nunca aconteceu nada.',
      closer: '<strong>Confirmo:</strong> entendo, e que bom que está todo mundo bem. <strong>Investigo:</strong> há quanto tempo vocês usam esse poço e já chegaram a analisar a água alguma vez? <strong>Respondo:</strong> alguns riscos de poço são cumulativos ou intermitentes — mudam com chuva, seca e uso, e nem sempre dão sinal na hora. Por isso "nunca aconteceu" não é o mesmo que "está seguro". <strong>Próximo passo:</strong> sem alarme, o caminho responsável é uma análise atualizada pra gente enxergar o que a rotina não mostra. Podemos providenciar?' },

    // 3 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 3 — "Quero apenas tirar o ferro"' },
    { tipo: 'exemplo',
      cliente: 'Eu só quero tirar o ferro, o resto tá tudo bem.',
      closer: '<strong>Confirmo:</strong> ferro incomoda mesmo — mancha, gosto, entope. Faz sentido querer resolver. <strong>Investigo:</strong> você tem análise que confirma que é ferro e mostra em que nível está? <strong>Respondo:</strong> o sintoma aponta para ferro, mas só o laudo confirma o que é e se vem sozinho — muitas vezes vem acompanhado de manganês, dureza ou parte microbiológica. Dimensionar "só pro ferro" sem isso pode não resolver ou mascarar outra coisa. <strong>Próximo passo:</strong> com o laudo e os dados da sua instalação, o especialista define o tratamento certo. Consegue me enviar a análise?' },

    // 4 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 4 — "Um filtro simples resolve?"' },
    { tipo: 'exemplo',
      cliente: 'Não dá pra resolver com um filtro simples?',
      closer: '<strong>Confirmo:</strong> seria ótimo se fosse simples assim, entendo a busca pelo prático. <strong>Investigo:</strong> você sabe o que exatamente precisa ser tratado na sua água? <strong>Respondo:</strong> um filtro simples costuma reter partícula, mas não trata dureza dissolvida, não desinfeta e não remove nitrato — cada problema pede uma etapa compatível. Depende inteiramente do que o laudo apontar. <strong>Próximo passo:</strong> em vez de eu adivinhar, vamos partir da análise e da hidráulica; aí o especialista diz se é simples ou se exige mais etapas. Me manda o laudo?' },

    // 5 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 5 — "O concorrente não pediu análise"' },
    { tipo: 'exemplo',
      cliente: 'O concorrente já me passou o equipamento sem pedir análise nenhuma.',
      closer: '<strong>Confirmo:</strong> entendo, e realmente parece mais rápido assim. <strong>Investigo:</strong> ele chegou a explicar como sabe o que a sua água tem sem analisar? <strong>Respondo:</strong> sem análise, qualquer equipamento é um palpite — pode não resolver, ou até criar falsa sensação de segurança em água para consumo. A gente trabalha por diagnóstico justamente pra você não pagar por algo que não trata o seu problema. <strong>Próximo passo:</strong> deixa eu te mostrar o valor disso: a partir do laudo, você recebe uma solução dimensionada pro seu caso, não genérica. Vamos começar pela análise?' },

    // 6 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 6 — "A análise é cara"' },
    { tipo: 'exemplo',
      cliente: 'Essa análise é cara, não quero gastar com isso.',
      closer: '<strong>Confirmo:</strong> entendo, ninguém gosta de custo extra antes de resolver. <strong>Investigo:</strong> o que mais pesa: o valor em si ou não saber se vai valer a pena? <strong>Respondo:</strong> a análise é o que evita o gasto maior — comprar o equipamento errado, que não trata o seu problema, custa muito mais. Ela é o mapa que garante que cada real do projeto ataque o que realmente precisa. <strong>Próximo passo:</strong> posso te orientar sobre como fazer a coleta do jeito certo; assim a gente parte de dados reais e não de chute. Combinamos a análise?' },
    { tipo: 'pendente', html: 'Custos de análise, laboratórios parceiros e eventuais condições: <strong>pendente de validação comercial pela Tudo de Filtro</strong>. Não citar valores de memória.' },

    // 7 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 7 — "Quero o menor tanque"' },
    { tipo: 'exemplo',
      cliente: 'Me vê logo o menor tanque, é só pra economizar espaço e dinheiro.',
      closer: '<strong>Confirmo:</strong> economizar espaço e custo é justo, entendo. <strong>Investigo:</strong> você sabe qual a sua vazão e o consumo da casa? <strong>Respondo:</strong> o porte não é escolha de preferência, é cálculo: um tanque subdimensionado estrangula a água, não faz o serviço direito e pode falhar. É a vazão, a reservação e o que precisa ser tratado que definem o tamanho. <strong>Próximo passo:</strong> quem dimensiona isso é o especialista, com a sua hidráulica e o laudo em mãos. Vamos levantar esses dados primeiro?' },

    // 8 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 8 — "Minha bomba tem muita vazão"' },
    { tipo: 'exemplo',
      cliente: 'Minha bomba é forte, tem muita vazão, então qualquer equipamento serve.',
      closer: '<strong>Confirmo:</strong> ter uma bomba boa ajuda mesmo, ótimo. <strong>Investigo:</strong> você chegou a medir a vazão real na saída, em litros por minuto? <strong>Respondo:</strong> vazão alta não é "qualquer equipamento serve" — é o contrário: exige um sistema compatível para não perder pressão nem comprometer o tratamento. Vazão demais para um equipamento pequeno prejudica o resultado. <strong>Próximo passo:</strong> essa é exatamente a informação que o especialista usa para dimensionar. Consegue levantar a vazão da bomba e do poço pra mim?' },

    // 9 -----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 9 — "Não quero usar cloro"' },
    { tipo: 'exemplo',
      cliente: 'Não quero usar cloro de jeito nenhum.',
      closer: '<strong>Confirmo:</strong> entendo a sua preferência, muita gente pensa assim. <strong>Investigo:</strong> posso perguntar o que te preocupa no cloro especificamente? <strong>Respondo:</strong> desinfecção pode ser feita por diferentes caminhos, e a escolha depende do que a análise mostrar — principalmente a parte microbiológica. Eu não vou te empurrar cloro nem prometer que "sem cloro resolve": isso é decisão técnica caso a caso. <strong>Próximo passo:</strong> com o laudo, o especialista avalia as opções de desinfecção adequadas pra sua água e sua preferência. Vamos começar pela análise?' },

    // 10 ----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 10 — "Cloro faz mal"' },
    { tipo: 'exemplo',
      cliente: 'Cloro faz mal pra saúde, não quero isso na minha água.',
      closer: '<strong>Confirmo:</strong> entendo a preocupação com saúde, é legítima. <strong>Investigo:</strong> você leu ou ouviu algo específico que te deixou com esse receio? <strong>Respondo:</strong> desinfecção existe justamente pra reduzir risco microbiológico, que também é uma questão de saúde. Cada método tem prós e contras, e a definição é técnica — não é algo que eu resolvo com "faz mal" ou "não faz mal" no telefone. <strong>Próximo passo:</strong> o especialista avalia, a partir do laudo, o que a sua água exige e quais alternativas de desinfecção cabem. Posso encaminhar depois da análise?' },

    // 11 ----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 11 — "UV resolve tudo"' },
    { tipo: 'exemplo',
      cliente: 'É só colocar um UV que resolve tudo, né?',
      closer: '<strong>Confirmo:</strong> UV é uma tecnologia interessante mesmo, entendo o raciocínio. <strong>Investigo:</strong> você sabe o que a sua água tem além da parte microbiológica? <strong>Respondo:</strong> nenhuma tecnologia sozinha "resolve tudo". UV atua num tipo de problema e exige pré-condições (como água clara) pra funcionar; ele não trata dureza, ferro, nitrato ou partícula. Depende do que o laudo mostrar. <strong>Próximo passo:</strong> vamos ver o laudo e a hidráulica; aí o especialista diz se o UV faz parte da solução e em que etapa. Me envia a análise?' },

    // 12 ----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 12 — "Carvão remove tudo"' },
    { tipo: 'exemplo',
      cliente: 'Filtro de carvão remove tudo, é só isso que eu preciso.',
      closer: '<strong>Confirmo:</strong> carvão é conhecido e útil, faz sentido lembrar dele. <strong>Investigo:</strong> você já sabe quais parâmetros da sua água estão fora? <strong>Respondo:</strong> carvão ajuda em certos pontos, mas não é solução universal — não trata dureza dissolvida, não desinfeta por si só e não remove nitrato. Dizer que "remove tudo" seria te enganar. <strong>Próximo passo:</strong> a análise mostra o que precisa ser tratado, e o especialista define se e onde o carvão entra. Vamos pela análise primeiro?' },

    // 13 ----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 13 — "Osmose resolve tudo"' },
    { tipo: 'exemplo',
      cliente: 'Osmose reversa resolve tudo, então é só instalar isso.',
      closer: '<strong>Confirmo:</strong> osmose é uma tecnologia potente mesmo, entendo. <strong>Investigo:</strong> você sabe a vazão que precisa atender e o que a água tem hoje? <strong>Respondo:</strong> osmose atua em muita coisa, mas tem contexto: exige pré-tratamento, gera descarte, tem vazão própria e nem sempre é o caminho certo para todo uso ou toda vazão. "Resolve tudo" é simplificação — a decisão vem do diagnóstico. <strong>Próximo passo:</strong> com laudo e hidráulica, o especialista avalia se osmose faz sentido no seu caso. Vamos levantar esses dados?' },

    // 14 ----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 14 — "Quero garantia de potabilidade"' },
    { tipo: 'exemplo',
      cliente: 'Eu quero que vocês me garantam que a água vai ficar potável.',
      closer: '<strong>Confirmo:</strong> entendo perfeitamente — você quer segurança pra sua família, é o mais importante. <strong>Investigo:</strong> qual é o uso principal, beber e cozinhar? <strong>Respondo:</strong> vou ser honesto com você: ninguém sério promete "potabilidade garantida" como um selo eterno. O que a gente faz é tratar o que o laudo aponta, declarar limitações e comprovar o resultado com <em>reanálise</em> depois que o sistema estabiliza. Potabilidade se verifica com laudo, não se promete no telefone. <strong>Próximo passo:</strong> começamos pela análise; o especialista dimensiona; e confirmamos com nova análise. É assim que a gente entrega segurança de verdade.' },
    { tipo: 'callout', variante: 'perigo', titulo: 'Nunca ceda nesta objeção',
      html: 'Por mais que o cliente pressione, <strong>não</strong> prometa potabilidade garantida. A resposta honesta — tratar o que o laudo aponta, declarar limitações e comprovar por reanálise — é mais forte e protege todos. Prometer o impossível é o caminho mais rápido para o problema.' },

    // 15 ----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 15 — "Quero preço antes de mandar a análise"' },
    { tipo: 'exemplo',
      cliente: 'Me passa pelo menos uma faixa de preço antes, aí eu vejo se vale mandar a análise.',
      closer: '<strong>Confirmo:</strong> entendo, você quer saber se cabe no bolso antes de investir tempo. <strong>Investigo:</strong> o que você precisa enxergar pra seguir: uma ordem de grandeza ou a certeza de que vale a pena? <strong>Respondo:</strong> se eu jogar um preço agora, seria um número inventado — sem saber o que tratar e qual a sua vazão, qualquer valor engana, pra mais ou pra menos. Não quero te passar expectativa errada. <strong>Próximo passo:</strong> com a análise e a hidráulica, o especialista monta uma proposta real, dimensionada, e aí o preço faz sentido. Vamos dar esse primeiro passo?' },

    // 16 ----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 16 — "Vi um equipamento mais barato na internet"' },
    { tipo: 'exemplo',
      cliente: 'Achei um equipamento bem mais barato na internet, por que eu pagaria mais?',
      closer: '<strong>Confirmo:</strong> ótimo que você pesquisou, preço importa mesmo. <strong>Investigo:</strong> esse equipamento foi indicado a partir de uma análise da sua água e da sua vazão, ou é um modelo genérico? <strong>Respondo:</strong> o que a gente vende não é uma caixa, é um projeto: análise, dimensionamento, etapas compatíveis, limitações declaradas e reanálise. Um equipamento genérico barato pode não tratar o seu problema — e aí o barato sai caro. <strong>Próximo passo:</strong> deixa a análise mostrar o que a sua água precisa; se um equipamento simples resolver, o especialista vai te dizer com honestidade. Vamos começar por aí?' },

    // 17 ----------------------------------------------------------------------
    { tipo: 'titulo', texto: 'Objeção 17 — "Não quero fazer outra análise depois"' },
    { tipo: 'exemplo',
      cliente: 'Depois de instalar eu não quero ter que fazer análise de novo.',
      closer: '<strong>Confirmo:</strong> entendo, parece trabalho extra, faz sentido questionar. <strong>Investigo:</strong> posso te explicar por que essa segunda análise existe? <strong>Respondo:</strong> a reanálise depois que o sistema estabiliza é o que <em>comprova</em> que o tratamento funcionou — é ela que transforma promessa em prova. Sem ela, a gente estaria confiando só na aparência da água, e aparência não garante nada. Ela protege você. <strong>Próximo passo:</strong> a gente já deixa isso combinado no plano de manutenção, com o especialista orientando quando e o que reavaliar. Fechado assim?' },

    { tipo: 'especialista', nome: 'objeções', icon: '🧑‍🔬',
      html: 'Repare que em nenhuma resposta a gente prometeu potabilidade ou disse que uma tecnologia resolve tudo. Toda objeção terminou me trazendo o cliente com laudo e hidráulica. É esse o caminho: reconhecer, educar e reconduzir — nunca prometer o impossível.' },

    { tipo: 'dodont',
      fazer: [
        'Reconhecer a objeção antes de responder.',
        'Educar com honestidade e reconduzir para análise/hidráulica/especialista.',
        'Terminar toda resposta com um próximo passo concreto.',
      ],
      evitar: [
        'Prometer potabilidade ou remoção 100% garantida.',
        'Afirmar que uma tecnologia (UV, carvão, osmose…) resolve tudo.',
        'Dar preço ou solução antes de análise + hidráulica.',
      ]
    },

    { tipo: 'callout', variante: 'sucesso', titulo: 'PRÓXIMO PASSO',
      html: 'Treine cada objeção na régua <strong>ouvir → confirmar → investigar → responder com responsabilidade → próximo passo</strong>. Se em algum momento a única forma de "ganhar" for prometer potabilidade ou dizer que algo resolve tudo, é sinal de que você deve parar, ser honesto e reconduzir para a análise ou para o especialista (Módulo 20).' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente diz "quero garantia de que a água vai ficar potável". Qual a resposta correta?',
      opcoes: [
        'Garantir a potabilidade para fechar a venda.',
        'Explicar com honestidade que se trata o que o laudo aponta, declaram-se limitações e comprova-se por reanálise — sem prometer potabilidade garantida.',
        'Dizer que a osmose garante potabilidade.',
      ],
      correta: 1,
      explicacao: 'Nunca se promete potabilidade garantida. A resposta honesta — tratar o que o laudo aponta, declarar limitações e comprovar por reanálise — é mais forte e protege cliente e empresa.'
    },
    {
      pergunta: 'Cliente afirma "UV resolve tudo". Como conduzir?',
      opcoes: [
        'Concordar e vender só o UV.',
        'Reconhecer, explicar que nenhuma tecnologia sozinha resolve tudo e que depende do laudo, e reconduzir para análise + especialista.',
        'Dizer que carvão é melhor e resolve tudo.',
      ],
      correta: 1,
      explicacao: 'Afirmar que qualquer tecnologia resolve tudo é proibido. Reconhecer, educar e reconduzir para o diagnóstico é o caminho.'
    },
    {
      pergunta: 'Qual é o passo final obrigatório em toda resposta a objeção?',
      opcoes: [
        'Fechar o preço.',
        'Encerrar com um próximo passo que reconduz para análise, hidráulica ou especialista.',
        'Repetir a objeção do cliente.',
      ],
      correta: 1,
      explicacao: 'A régua sempre termina em próximo passo — reconduzindo para o processo (análise/hidráulica/especialista), nunca para uma promessa.'
    },
  ],

  exercicio: {
    enunciado: 'Escolha 3 objeções deste módulo (uma sobre transparência/segurança, uma sobre "tecnologia X resolve tudo" e a de "quero preço antes da análise") e escreva sua própria resposta para cada uma, seguindo a régua ouvir → confirmar → investigar → responder com responsabilidade → próximo passo.',
    dica: 'Revise cada resposta perguntando: eu prometi potabilidade? eu disse que algo resolve tudo? eu dei preço/solução antes da análise? Se sim em qualquer uma, reescreva.'
  },

  resumo: 'Objeção de poço não se vence com promessa. Toda resposta segue a régua ouvir → confirmar → investigar → responder com responsabilidade → próximo passo, e nunca promete potabilidade nem afirma que uma tecnologia resolve tudo. As 17 objeções mais comuns — de "minha água é transparente" a "não quero fazer outra análise depois" — terminam sempre reconduzindo o cliente para a análise, a hidráulica ou o especialista. Quando a única forma de ganhar seria prometer o impossível, a atitude certa é ser honesto e escalar (Módulo 20).'
};
