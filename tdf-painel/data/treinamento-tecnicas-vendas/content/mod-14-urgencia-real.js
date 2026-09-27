// ============================================================================
// MÓDULO 14 — Urgência Real (Não Fake)
// Equipe na região, prazos de entrega, danos contínuos da água
// ============================================================================

module.exports = {
  resumoCurto: 'Aprenda a criar urgência real e ética nas vendas TDF — usando fatos verdadeiros como equipe de instalação na região, prazos reais e danos contínuos da água. Nunca invente urgência falsa.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-14-video' },

  blocos: [
    { tipo: 'texto', html: 'Urgência é um dos gatilhos mais poderosos de decisão — e também o mais <strong>abusado</strong>. "Última unidade!", "só hoje!", "vai acabar!" são frases que o consumidor brasileiro já aprendeu a ignorar. Na TDF, trabalhamos com <strong>urgência real</strong>: fatos verdadeiros que justificam agir agora. Isso constrói confiança e acelera decisões sem manipulação.' },

    { tipo: 'titulo', texto: '3 Fontes de Urgência Real na TDF' },
    { tipo: 'cards', itens: [
      { icon: '🔧', titulo: '1. Equipe de instalação na região', html: 'O instalador TDF viaja para atender regiões específicas em datas definidas. <strong>Se o cliente está numa cidade que o instalador vai visitar, o prazo é real.</strong> Fora dessa janela, o caminho é a visita técnica + análise (R$ 800), que entra como parte do projeto do cliente — abatida na proposta — ou aguardar a próxima ida da equipe à região.' },
      { icon: '📦', titulo: '2. Prazo de entrega / estoque', html: 'Modelos específicos têm prazos de fabricação e entrega. Se o estoque atual atende, <strong>a entrega é rápida</strong>. Se esgotar, o prazo pode dobrar. Isso é real e verificável — nunca invente escassez.' },
      { icon: '💧', titulo: '3. Dano contínuo da água', html: 'A água com ferro, calcário ou contaminantes <strong>causa dano todos os dias</strong>. Cada dia sem tratamento é mais corrosão, mais incrustação, mais risco à saúde. Essa urgência é permanente e verdadeira.' },
    ]},

    { tipo: 'titulo', texto: 'Urgência REAL vs. Urgência FAKE' },
    { tipo: 'tabela',
      head: ['❌ Urgência FAKE', '✅ Urgência REAL', 'Por que faz diferença'],
      rows: [
        ['"Última unidade em estoque!"', '"Esse modelo tem 3 unidades prontas. O prazo de fabricação do próximo lote é 45 dias."', 'Cliente pode verificar. Dado real gera confiança.'],
        ['"Só hoje esse preço!"', '"Nosso instalador estará na sua cidade dia 15. Se confirmar até dia 12, encaixo na agenda sem custo extra de deslocamento."', 'A janela de instalação é verificável e o benefício é concreto.'],
        ['"Promoção imperdível!"', '"A água com ferro está corroendo sua tubulação agora. Cada mês são mais R$ 500 em danos acumulados."', 'O dano é real, contínuo e calculável.'],
        ['"Meu gerente liberou desconto só pra você!"', '"Consigo incluir a instalação (R$ 590) como cortesia se fecharmos nessa semana, porque o instalador já vai estar na região."', 'A cortesia está vinculada a um fato logístico real.'],
        ['"Vai ficar mais caro mês que vem!"', '"O custo do calcário no seu aquecedor nos últimos 6 meses provavelmente já passou de R$ 2.000 em vida útil perdida."', 'O custo real é do problema, não um aumento fictício de preço.'],
      ]
    },

    { tipo: 'titulo', texto: 'Exemplos de frases com urgência real' },
    { tipo: 'exemplo', cliente: 'Vou pensar com calma...', closer: '(Urgência — equipe na região) Entendo perfeitamente. Uma informação importante: nosso time de instalação estará em [cidade] nos dias 18 e 19. Se fechar até dia 16, consigo encaixar e incluir a instalação como cortesia. A próxima ida pra sua região é só daqui a 40 dias.' },
    { tipo: 'exemplo', cliente: 'Será que não consigo um preço melhor?', closer: '(Urgência — dano contínuo) O preço do equipamento é fixo. Mas pensa comigo: a cada mês que a água com calcário passa pelo seu aquecedor, são mais R$ 300–500 em vida útil que você perde. Em 3 meses de "vou pensar", o prejuízo já cobriu o valor da instalação.' },
    { tipo: 'exemplo', cliente: 'Preciso pesquisar mais...', closer: '(Urgência — estoque real) Claro, pesquise à vontade. Só te informo que esse modelo FE-2000 tem 2 unidades prontas pra entrega imediata. Se esgotar, o prazo de fabricação é de 30 a 45 dias. Quando decidir, me avisa que verifico a disponibilidade na hora.' },

    { tipo: 'titulo', texto: 'Regras de ouro da urgência TDF' },
    { tipo: 'callout', variante: 'info', titulo: 'O que SEMPRE e o que NUNCA fazer',
      html: '<strong>SEMPRE:</strong> Use dados verificáveis. Datas reais de instalação, quantidades reais de estoque, cálculos reais de dano.<br><br><strong>NUNCA:</strong> Invente escassez, crie promoções falsas, minta sobre prazos ou finja que o preço vai subir. <strong>Se o cliente descobrir a mentira, você perde ele para sempre — e ele conta pra 10 pessoas.</strong>' },

    { tipo: 'titulo', texto: 'Cálculo de dano contínuo por produto' },
    { tipo: 'tabela',
      head: ['Produto TDF', 'Problema que resolve', 'Custo mensal de NÃO resolver', 'Em 12 meses'],
      rows: [
        ['Filtro de Entrada (R$ 3.490–10.990)', 'Sedimentos, turbidez, sujeira', 'R$ 200–400 (filtros descartáveis + manutenção)', 'R$ 2.400–4.800'],
        ['Iron Free (R$ 13.990–31.900)', 'Ferro e manganês na água', 'R$ 500–1.500 (danos em equipamentos, roupas)', 'R$ 6.000–18.000'],
        ['Scale Stop (R$ 8.990–17.990)', 'Calcário e incrustação', 'R$ 300–800 (vida útil reduzida, manutenção)', 'R$ 3.600–9.600'],
        ['Bebedouro (R$ 1.590–3.413)', 'Água potável em volume', 'R$ 200–400 (manutenção corretiva e reposição de bebedouros antigos)', 'R$ 2.400–4.800'],
      ]
    },

    { tipo: 'titulo', texto: 'Como usar o dano contínuo no discurso' },
    { tipo: 'dodont',
      fazer: [
        '"Cada dia sem o filtro são mais R$ X em danos que você está acumulando."',
        '"Em 6 meses, o custo de não resolver já pagou metade do equipamento."',
        '"A água com ferro corroeu R$ 15.000 em equipamentos do último cliente que esperou 2 anos."',
        'Usar casos reais de clientes anteriores como prova.',
        'Calcular junto com o cliente na hora: "Vamos fazer a conta juntos?"',
      ],
      evitar: [
        'Exagerar os números — use dados realistas e verificáveis.',
        'Ser alarmista: "Sua casa vai desmoronar!" — mantenha a credibilidade.',
        'Usar urgência como única estratégia — ela complementa valor, não substitui.',
        'Repetir a mesma urgência em todo follow-up — varia os argumentos.',
      ]
    },

    { tipo: 'titulo', texto: 'Exercício prático' },
    { tipo: 'checklist', titulo: 'Crie urgência real para cada cenário', itens: [
      'Cenário 1: Cliente de São Carlos quer Scale Stop. Instalador vai na região em 10 dias. Crie a frase.',
      'Cenário 2: Fazendeiro com ferro de 5 ppm na água. Calcule o dano mensal e use como urgência.',
      'Cenário 3: Empresa quer Bebedouro mas gasta R$ 450/mês em manutenção corretiva dos bebedouros antigos. Mostre o payback.',
      'Cenário 4: Identifique o que está ERRADO: "Sr. João, esse é o último Iron Free do estoque e não vamos fabricar mais!"',
    ]},
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual das opções abaixo é um exemplo de urgência REAL na TDF?',
      opcoes: [
        '"Última unidade! Só hoje esse preço!"',
        '"Nosso instalador estará na sua região dia 18. Se confirmar até dia 15, encaixo na agenda."',
        '"Meu gerente liberou um super desconto só pra você!"',
        '"Se não fechar agora, vai ficar mais caro."',
      ],
      correta: 1,
      explicacao: 'A agenda do instalador é verificável e real. O benefício (encaixar sem deslocamento extra) é concreto. Todas as outras são manipulativas.'
    },
    {
      pergunta: 'Qual é o principal problema com urgência fake?',
      opcoes: [
        'É ilegal.',
        'O cliente pode verificar e perder a confiança para sempre.',
        'O gerente não aprova.',
        'Funciona, mas é antiético.',
      ],
      correta: 1,
      explicacao: 'Urgência fake destrói confiança. Um cliente enganado não compra e ainda fala mal para outros. Urgência real constrói credibilidade.'
    },
    {
      pergunta: 'Um cliente com água com calcário está gastando R$ 500/mês em manutenção de equipamentos. Quanto ele "perde" em 1 ano?',
      opcoes: [
        'R$ 3.000',
        'R$ 5.000',
        'R$ 6.000',
        'R$ 12.000',
      ],
      correta: 2,
      explicacao: 'R$ 500 × 12 meses = R$ 6.000/ano. Compare com o Scale Stop a partir de R$ 8.990: em menos de 18 meses o equipamento se paga.'
    },
  ],

  exercicio: {
    enunciado: 'Um dentista tem consultório com autoclave que vive entupindo por calcário. Ele gasta R$ 600/mês em manutenção. O Scale Stop indicado custa R$ 11.990. O instalador vai estar na cidade dele em 12 dias. Monte um argumento de urgência que combine: 1) dano contínuo com cálculo, 2) janela de instalação, e 3) cortesia da instalação (R$ 590). Escreva exatamente o que você falaria.',
    dica: 'R$ 600/mês × 12 = R$ 7.200/ano em manutenção. O Scale Stop se paga em 20 meses. A janela de instalação é real. A cortesia amarra tudo.'
  },

  resumo: 'Na TDF, urgência é construída com fatos reais: agenda do instalador na região, prazos de entrega verificáveis e cálculo de dano contínuo da água. Nunca invente escassez, promoções falsas ou prazos fictícios. O dano contínuo é seu maior aliado — calcule com o cliente quanto ele perde por mês e compare com o investimento no equipamento.'
};
