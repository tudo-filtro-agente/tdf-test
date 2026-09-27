// ============================================================================
// MÓDULO 11 — Fechamento sem Pressão
// Técnicas: Trial Close, Assumptive Close, Alternative Close
// ============================================================================

module.exports = {
  resumoCurto: 'Aprenda técnicas de fechamento que conduzem o cliente à decisão de forma natural, sem pressão — usando trial close, assumptive close e alternative close aplicados à venda de filtros TDF.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-11-video' },

  blocos: [
    { tipo: 'texto', html: 'Fechar uma venda <strong>não é pressionar</strong>. É o resultado natural de um processo bem conduzido. Se você aplicou SPIN, construiu valor e tratou objeções, o fechamento é apenas o próximo passo lógico. Este módulo ensina <strong>três técnicas de fechamento</strong> que funcionam perfeitamente para vendas consultivas de tratamento de água.' },

    { tipo: 'titulo', texto: '3 Técnicas de Fechamento' },
    { tipo: 'cards', itens: [
      { icon: '🌡️', titulo: 'Trial Close (Teste de Temperatura)', html: 'Pergunta sutil para medir a prontidão do cliente <strong>antes</strong> de pedir o fechamento. <strong>Exemplo TDF:</strong> "Faz sentido pra você resolver esse problema de ferro na água ainda esse mês?"' },
      { icon: '✅', titulo: 'Assumptive Close (Fechamento Presumido)', html: 'Você age como se a decisão já foi tomada e avança para os detalhes logísticos. <strong>Exemplo TDF:</strong> "Vou verificar a disponibilidade de instalação na sua região. Prefere manhã ou tarde?"' },
      { icon: '🔀', titulo: 'Alternative Close (Fechamento Alternativo)', html: 'Oferece duas opções — ambas levam ao fechamento. <strong>Exemplo TDF:</strong> "Você prefere o Filtro de Entrada modelo FE-1000 ou o FE-1500 que atende vazão maior?"' },
    ]},

    { tipo: 'titulo', texto: 'Regra TDF: NUNCA dê desconto no produto' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Política de preço firme',
      html: 'Na TDF, <strong>o preço do produto não é negociável</strong>. Filtro de Entrada (R$ 3.490–10.990), Iron Free (R$ 13.990–31.900), Scale Stop (R$ 8.990–17.990), Bebedouro (R$ 1.590–3.413). O que você pode usar como alavanca é a <strong>Instalação (R$ 590 até 200 km de SJC; +R$ 200 a cada 100 km adicionais)</strong> — bonificada apenas no fechamento, com justificativa logística — nunca o preço do equipamento.' },

    { tipo: 'titulo', texto: 'Usando a Instalação como alavanca de fechamento' },
    { tipo: 'texto', html: 'A instalação de R$ 590 é sua <strong>única moeda de negociação</strong>. Ela é um item da proposta com valor próprio — <strong>não é "inclusa por padrão"</strong>. Use-a estrategicamente:' },
    { tipo: 'dodont',
      fazer: [
        '"Se fecharmos hoje, consigo incluir a instalação como cortesia." (Assumptive + alavanca)',
        '"Nosso time de instalação está na sua região essa semana. Se confirmar agora, consigo encaixar e incluir a instalação." (Urgência real + alavanca)',
        'Guardar a cortesia da instalação para o momento certo — nunca oferecer logo no início.',
        'Apresentar a instalação cortesia como conquista do cliente, não como obrigação sua.',
      ],
      evitar: [
        '"Posso dar um desconto no filtro." — NUNCA desconte o produto.',
        'Oferecer instalação cortesia antes de o cliente demonstrar intenção de compra.',
        'Usar a cortesia como muleta para toda venda — ela é um fechador, não um padrão.',
        '"É o máximo que posso fazer." — Isso posiciona você como fraco.',
      ]
    },

    { tipo: 'titulo', texto: 'Fechamento na prática — Venda de Filtro de Entrada' },
    { tipo: 'exemplo', cliente: 'Entendi, o filtro resolve o problema dos sedimentos. Mas preciso pensar...', closer: '(Trial Close) Entendo. Me diz uma coisa: se a gente conseguisse instalar ainda essa semana, seria interessante pra você?' },
    { tipo: 'exemplo', cliente: 'Seria bom sim, porque a água tá bem ruim...', closer: '(Assumptive Close) Perfeito. Vou verificar a agenda do nosso instalador na sua região. O endereço de instalação é o mesmo que você me passou?' },
    { tipo: 'exemplo', cliente: 'Sim, é esse mesmo. Mas quanto fica tudo?', closer: '(Alternative Close) O FE-1000 atende perfeitamente sua casa — são R$ 3.490. Se quiser uma vazão maior pra cobrir a área externa também, o FE-1500 sai por R$ 5.490. Qual faz mais sentido pra sua necessidade?' },

    { tipo: 'titulo', texto: 'Frases de fechamento: Boas vs. Ruins' },
    { tipo: 'tabela',
      head: ['❌ Frase Ruim', '✅ Frase Boa', 'Por quê'],
      rows: [
        ['"Então, vai querer?"', '"Faz sentido avançarmos com a instalação essa semana?"', 'Trial close é sutil e não pressiona.'],
        ['"Posso dar 10% de desconto"', '"Consigo incluir a instalação como cortesia se fecharmos hoje"', 'Mantém o valor do produto intacto.'],
        ['"Você que sabe..."', '"Pra sua situação, eu recomendo o modelo X. Vamos agendar?"', 'Posicionamento consultivo, não passivo.'],
        ['"É pegar ou largar"', '"Entendo que é uma decisão importante. Que dúvida ainda ficou?"', 'Respeita o tempo do cliente sem perder o controle.'],
        ['"Última unidade!"', '"Nosso time está na região até sexta. Consigo encaixar sua instalação."', 'Urgência real, não fake.'],
      ]
    },

    { tipo: 'titulo', texto: 'Quando NÃO tentar fechar' },
    { tipo: 'checklist', titulo: 'Sinais de que ainda não é hora', itens: [
      'O cliente ainda não verbalizou o problema claramente.',
      'Você não apresentou a solução completa (produto + instalação + garantia).',
      'O cliente tem objeção técnica não respondida.',
      'O decisor não está na conversa.',
      'O cliente não sabe o preço e você não construiu valor ainda.',
    ]},

    { tipo: 'titulo', texto: 'Exercício prático' },
    { tipo: 'texto', html: 'Simule um fechamento para cada cenário abaixo, usando a técnica indicada:' },
    { tipo: 'checklist', titulo: 'Cenários de prática', itens: [
      'Cliente residencial quer Scale Stop (R$ 8.990–17.990) — use Trial Close',
      'Empresa com 50 funcionários precisa de Bebedouro (R$ 1.590–3.413) — use Assumptive Close',
      'Fazendeiro com problema de ferro quer Iron Free (R$ 13.990–31.900) — use Alternative Close',
    ]},
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual técnica de fechamento consiste em agir como se o cliente já decidiu e avançar para detalhes logísticos?',
      opcoes: [
        'Trial Close',
        'Assumptive Close',
        'Alternative Close',
        'Hard Close',
      ],
      correta: 1,
      explicacao: 'O Assumptive Close presume que a decisão foi tomada e avança naturalmente para instalação, endereço, forma de pagamento — sem pedir "sim" explicitamente.'
    },
    {
      pergunta: 'Na TDF, qual é a alavanca permitida para facilitar o fechamento?',
      opcoes: [
        'Desconto de 10% no produto',
        'Cortesia da instalação (R$ 590)',
        'Desconto progressivo por volume',
        'Frete grátis',
      ],
      correta: 1,
      explicacao: 'O preço dos produtos TDF não é negociável. A única alavanca é a instalação de R$ 590, que pode ser oferecida como cortesia no momento certo do fechamento.'
    },
    {
      pergunta: 'Qual é o melhor momento para oferecer a instalação cortesia?',
      opcoes: [
        'Logo na primeira apresentação do produto.',
        'Quando o cliente demonstra intenção mas hesita no fechamento.',
        'Depois que o cliente já recusou a compra.',
      ],
      correta: 1,
      explicacao: 'A cortesia é um fechador — deve ser usada quando o cliente já vê valor mas precisa de um empurrão final. Usar cedo demais desperdiça a alavanca.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente residencial quer resolver o problema de calcário no aquecedor solar. Ele entendeu o Scale Stop (R$ 12.990) mas diz "preciso pensar". Monte uma sequência de 3 frases usando: 1) Trial Close para medir temperatura, 2) Tratamento da hesitação, 3) Assumptive Close com alavanca de instalação.',
    dica: 'Comece validando a preocupação, depois use o trial close pra entender o que falta, trate a dúvida e feche presumindo a decisão com a cortesia de instalação como incentivo.'
  },

  resumo: 'Fechamento não é pressão — é consequência de um processo bem feito. Use Trial Close para medir prontidão, Assumptive Close para avançar naturalmente e Alternative Close para dar controle ao cliente. Na TDF, nunca desconte o produto: use a instalação (R$ 590) como alavanca estratégica. Boas frases de fechamento são consultivas, não agressivas.'
};
