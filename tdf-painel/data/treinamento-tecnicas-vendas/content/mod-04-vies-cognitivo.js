// ============================================================================
// MÓDULO 4 — Viés Cognitivo do Comprador
// Baseado em: Inteligência Emocional em Vendas — Jeb Blount
// ============================================================================

module.exports = {
  resumoCurto: 'Entenda os vieses cognitivos que influenciam a decisão de compra e aprenda a usar esse conhecimento de forma ética para facilitar o fechamento.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-04-video' },

  blocos: [
    { tipo: 'texto', html: 'Todo ser humano toma decisões usando <strong>atalhos mentais</strong> — os chamados vieses cognitivos. Eles não são defeitos; são mecanismos do cérebro para lidar com a complexidade. O vendedor que entende esses vieses consegue <strong>comunicar valor de forma mais eficaz</strong>, sem manipular — apenas alinhando a mensagem ao modo como o cérebro realmente processa decisões.' },

    { tipo: 'titulo', texto: 'Os 8 vieses mais relevantes para vendas TDF' },
    { tipo: 'cards', itens: [
      { icon: '⚓', titulo: '1. Ancoragem', html: 'A primeira informação numérica "ancora" todas as comparações. Se você mostra o Iron Free de R$ 31.900 primeiro, o de R$ 13.990 parece barato. <strong>Use:</strong> sempre apresente a opção premium antes.' },
      { icon: '🚫', titulo: '2. Aversão à perda', html: 'Pessoas sentem a <strong>dor de perder</strong> 2x mais forte que o prazer de ganhar. "Se continuar sem tratar, o calcário vai custar R$ 8.000 em troca de aquecedor" pesa mais que "você vai economizar R$ 8.000".' },
      { icon: '👥', titulo: '3. Prova social', html: '"80% dos nossos clientes em [região] escolheram o Scale Stop." O cérebro pensa: <strong>se muita gente fez, deve ser seguro</strong>.' },
      { icon: '🏷️', titulo: '4. Efeito moldura (framing)', html: 'A mesma informação, apresentada de forma diferente, muda a decisão. "R$ 10.990" parece caro. "R$ 30 por dia durante 1 ano para proteger toda a casa" parece acessível.' },
    ]},
    { tipo: 'cards', itens: [
      { icon: '🎁', titulo: '5. Reciprocidade', html: 'Quando você entrega algo de valor real — uma <strong>informação útil</strong>, o <strong>cálculo de dano feito junto com o cliente</strong> ("vamos somar quanto a água está te custando por ano?"), um <strong>comparativo técnico</strong> entre soluções — o cliente sente a necessidade natural de retribuir com atenção e abertura.' },
      { icon: '✅', titulo: '6. Viés de confirmação', html: 'Pessoas buscam informações que <strong>confirmam</strong> o que já acreditam. Se o cliente acha que água de poço é ruim, reforce com dados. Se acha que filtro é desnecessário, não brigue — pergunte mais.' },
      { icon: '⏰', titulo: '7. Viés do status quo', html: 'A tendência natural é <strong>não mudar</strong>. "Sempre fiz assim" é o maior concorrente de qualquer vendedor. Para vencer, mostre o custo de manter o status quo.' },
      { icon: '🏅', titulo: '8. Efeito halo', html: 'Uma impressão positiva inicial colore toda a experiência. Se o primeiro contato é <strong>profissional e atencioso</strong>, o cliente assume que o produto e a instalação também serão.' },
    ]},

    { tipo: 'titulo', texto: 'Ancoragem na prática: apresentação de preços TDF' },
    { tipo: 'tabela',
      head: ['Ordem errada ❌', 'Ordem certa ✅'],
      rows: [
        ['Filtro Entrada R$ 3.490', 'Iron Free Premium R$ 31.900 (apresente primeiro)'],
        ['Iron Free R$ 13.990', 'Iron Free Standard R$ 13.990 (parece acessível!)'],
        ['Iron Free Premium R$ 31.900', 'Filtro Entrada R$ 3.490 (opção econômica)'],
      ]
    },
    { tipo: 'callout', variante: 'sucesso', titulo: 'Efeito da ancoragem',
      html: 'Quando o cliente vê R$ 31.900 primeiro, R$ 13.990 parece <strong>uma pechincha</strong>. Se vê R$ 3.490 primeiro, R$ 13.990 parece <strong>absurdamente caro</strong>. A ordem muda tudo.' },

    { tipo: 'titulo', texto: 'Aversão à perda: scripts para TDF' },
    { tipo: 'script', contexto: 'Cliente com calcário danificando equipamentos', fala: '"Sr. João, sem o Scale Stop, o calcário vai continuar se acumulando na tubulação e no aquecedor. A troca de um aquecedor a gás custa entre R$ 5.000 e R$ 12.000 — e o calcário pode forçar essa troca em 2 a 3 anos. O Scale Stop por R$ 8.990 protege todos os equipamentos da casa por pelo menos 10 anos."' },
    { tipo: 'script', contexto: 'Cliente com ferro na água do poço', fala: '"Dona Maria, cada mês que passa sem tratar o ferro, ele continua corroendo a tubulação por dentro. Quando o cano rompe, o conserto não sai por menos de R$ 3.000 — sem contar a reforma do piso e parede. O Iron Free elimina o ferro antes de entrar na casa."' },

    { tipo: 'titulo', texto: 'Efeito moldura: transformando preços em investimento diário' },
    { tipo: 'tabela',
      head: ['Produto', 'Preço total', 'Por dia (5 anos)', 'Comparação'],
      rows: [
        ['Filtro Entrada', 'R$ 3.490', 'R$ 1,91/dia', 'Menos que uma água mineral'],
        ['Scale Stop', 'R$ 8.990', 'R$ 4,93/dia', 'Menos que um café'],
        ['Iron Free', 'R$ 13.990', 'R$ 7,67/dia', 'Menos que uma garrafa de água'],
        ['Bebedouro', 'R$ 1.590', 'R$ 0,87/dia', 'Menos que um copo descartável'],
      ]
    },

    { tipo: 'titulo', texto: 'Ética no uso de vieses' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Limite ético importante',
      html: 'Vieses cognitivos são ferramentas de <strong>comunicação</strong>, não de manipulação. Use para ajudar o cliente a tomar a melhor decisão, não para empurrar algo que ele não precisa. Se o Filtro de Entrada resolve, não venda Iron Free. <strong>A confiança do cliente vale mais que uma venda maior.</strong>' },

    { tipo: 'dodont',
      fazer: [
        'Apresentar opção premium primeiro (ancoragem).',
        'Mostrar o custo de NÃO resolver (aversão à perda).',
        'Usar depoimentos e números de clientes (prova social).',
        'Fracionar o preço em valor diário (moldura).',
        'Criar uma primeira impressão excelente (efeito halo).',
      ],
      evitar: [
        'Inventar dados de prova social.',
        'Exagerar consequências para assustar o cliente.',
        'Usar vieses para vender algo que o cliente não precisa.',
        'Mentir sobre escassez ou urgência.',
        'Manipular emocionalmente clientes vulneráveis.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual viés explica por que mostrar o produto mais caro primeiro faz o segundo parecer mais acessível?',
      opcoes: [
        'Aversão à perda',
        'Ancoragem',
        'Prova social',
      ],
      correta: 1,
      explicacao: 'A ancoragem faz o cérebro usar a primeira informação numérica como referência para comparar todas as próximas.'
    },
    {
      pergunta: '"Se não tratar o calcário, a troca do aquecedor vai custar R$ 8.000" — qual viés está sendo usado?',
      opcoes: [
        'Efeito moldura',
        'Reciprocidade',
        'Aversão à perda',
      ],
      correta: 2,
      explicacao: 'Aversão à perda: a dor de perder R$ 8.000 motiva mais do que a promessa de economizar R$ 8.000.'
    },
    {
      pergunta: 'Qual a forma ética de usar vieses cognitivos em vendas?',
      opcoes: [
        'Manipular o cliente para comprar o produto mais caro.',
        'Comunicar valor de forma alinhada ao funcionamento do cérebro, vendendo o que o cliente realmente precisa.',
        'Esconder informações que possam levar o cliente a não comprar.',
      ],
      correta: 1,
      explicacao: 'Vieses são ferramentas de comunicação. O uso ético é ajudar o cliente a perceber o valor real da solução certa para ele.'
    },
  ],

  exercicio: {
    enunciado: 'Reescreva a apresentação de preço do Iron Free (R$ 13.990) usando pelo menos 3 vieses cognitivos diferentes. Identifique qual viés você usou em cada parte do texto.',
    dica: 'Comece com ancoragem (mencione o custo de danos sem tratamento), use moldura (preço por dia), e finalize com prova social (quantidade de clientes que já instalaram).'
  },

  resumo: 'Vieses cognitivos são atalhos mentais que influenciam decisões de compra. Os 8 principais para vendas TDF são: ancoragem, aversão à perda, prova social, efeito moldura, reciprocidade, viés de confirmação, viés do status quo e efeito halo. Usados de forma ética, ajudam a comunicar valor de forma eficaz e facilitam a decisão do cliente.'
};
