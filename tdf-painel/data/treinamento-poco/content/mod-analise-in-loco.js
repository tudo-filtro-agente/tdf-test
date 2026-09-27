// ============================================================================
// MÓDULO — Análise in loco, abertura e taxa de interesse
// Conteúdo fornecido pela operação da Tudo de Filtro (processo real de campo).
// NÃO inventar valor da taxa nem preço do produto → placeholders [ ] a preencher
// da tabela vigente. Mantém a regra da academia: preço/solução final só depois de
// análise + sondagem hidráulica; aqui o closer dá uma ORDEM DE GRANDEZA para gerar
// interesse e qualificar, deixando claro que o valor fecha após o diagnóstico.
// ============================================================================

module.exports = {
  resumoCurto: 'A visita técnica na casa do cliente, a abertura padrão da conversa e por que a taxa da visita é, na verdade, uma taxa de interesse que qualifica quem realmente vai fechar.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-analise-in-loco-video' },

  blocos: [
    { tipo: 'titulo', texto: 'O que é a análise in loco' },
    { tipo: 'texto', html: 'Quando o cliente tem <strong>urgência</strong> ou o caso pede confirmação de campo, a Tudo de Filtro faz a <strong>análise in loco</strong> — uma visita técnica na <strong>residência do cliente</strong>. Na visita a gente olha os principais parâmetros de poço (<strong>ferro, manganês e dureza</strong>) e faz o <strong>dimensionamento no local</strong>: vazão, estrutura, reservação e espaço. É o que transforma "achismo" em projeto.' },
    { tipo: 'callout', variante: 'info', titulo: 'A análise não substitui o laudo',
      html: 'A análise in loco complementa e direciona, mas o <strong>laudo laboratorial</strong> continua sendo a base para parâmetros que não se leem em campo (microbiológico, nitrato, orgânicos…). Em loco confirmamos ferro/manganês/dureza e a hidráulica; o resto segue a regra da academia.' },

    { tipo: 'titulo', texto: 'A abertura de TODA conversa' },
    { tipo: 'texto', html: 'Toda conversa — SDR ou closer, WhatsApp ou ligação — começa do mesmo jeito: apresentação como <strong>especialista</strong>, permissão para perguntar e foco em <strong>resolver o problema</strong>, não em vender.' },
    { tipo: 'script', contexto: 'Abertura padrão (decore e adapte o nome)',
      fala: 'Oi [nome], tudo bem? Eu sou o [consultor], especialista em tratamento de água da Tudo de Filtro. Vou te fazer algumas perguntas pra entender se a gente tem uma solução pra te ajudar a resolver o seu problema.' },
    { tipo: 'texto', html: 'Por que funciona: posiciona você como <strong>especialista</strong> (autoridade), pede <strong>permissão</strong> para qualificar (reduz resistência) e coloca o objetivo no <strong>problema do cliente</strong> — não no produto.' },

    { tipo: 'titulo', texto: 'A taxa da visita é uma taxa de INTERESSE' },
    { tipo: 'texto', html: 'Antes de o cliente fechar a visita, o closer <strong>pode explicar o equipamento</strong> e dar uma <strong>ideia do valor do produto</strong> (uma ordem de grandeza) para gerar interesse. E aí entra o conceito mais importante deste módulo:' },
    { tipo: 'callout', variante: 'sucesso', titulo: 'O conceito que o SDR e o closer precisam entender',
      html: 'A visita tem uma taxa — mas ela <strong>não é uma cobrança "pela visita"</strong>. Ela é uma <strong>taxa de interesse</strong>. Serve para filtrar quem realmente quer resolver o problema. Na prática: <strong>quem não topa pagar a taxa, dificilmente fecha o produto/a solução depois</strong>. Quem topa, está demonstrando <strong>verba e intenção reais</strong>. A taxa qualifica — não é uma barreira, é um termômetro.' },
    { tipo: 'dodont',
      fazer: [
        'Explicar o equipamento e dar uma ORDEM DE GRANDEZA do produto antes de fechar a visita (gera interesse).',
        'Apresentar a taxa com naturalidade, como parte do processo do especialista.',
        'Ler a reação: quem topa a taxa é quem tem verba e intenção de resolver.',
        'Deixar claro que o valor final da solução fecha depois da análise + dimensionamento.',
      ],
      evitar: [
        'Vender a visita como se fosse "só uma cobrança pela ida".',
        'Fechar o preço definitivo do produto antes da análise + sondagem hidráulica.',
        'Insistir na visita com quem se recusa a pagar a taxa — normalmente não vai fechar.',
        'Prometer potabilidade ou remoção garantida para convencer a marcar a visita.',
      ]
    },
    { tipo: 'pendente', html: 'O <strong>valor da taxa de visita</strong> e a <strong>faixa de referência do produto</strong> seguem a <strong>tabela vigente da Tudo de Filtro</strong> — use sempre o valor oficial atualizado, não um número de memória.' },

    { tipo: 'titulo', texto: 'Perguntas de budget — sinais de que existe verba' },
    { tipo: 'texto', html: 'Você não pergunta "quanto você tem pra gastar". Você lê <strong>sinais</strong> na própria estrutura da casa e do poço. Eles indicam porte e verba disponível:' },
    { tipo: 'cards', itens: [
      { icon: '🕳️', titulo: 'Profundidade do poço', html: 'Poço mais profundo/artesiano costuma indicar investimento maior já feito na captação.' },
      { icon: '🔥', titulo: 'Boiler / aquecimento', html: 'Ter boiler indica estrutura hidráulica e padrão de investimento na casa.' },
      { icon: '🏊', titulo: 'Piscina', html: 'Piscina é forte sinal de porte e verba — e também aumenta o consumo/uso da água.' },
      { icon: '🚻', titulo: 'Quantidade de banheiros', html: 'Mais banheiros = casa maior, mais pontos de consumo, maior porte.' },
      { icon: '🏺', titulo: 'Caixa d\'água tipo taça', html: 'Caixa taça (elevada, de concreto) indica obra estruturada e investimento — sinal de porte.' },
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Como usar os sinais',
      html: 'Junte os sinais: poço artesiano + boiler + piscina + vários banheiros + caixa taça = cliente com estrutura e provável verba. Isso te dá confiança para apresentar a solução completa e a taxa sem medo. Poucos sinais = qualifique melhor antes de investir tempo/visita.' },

    { tipo: 'titulo', texto: 'Sondagem de contexto' },
    { tipo: 'perguntas', titulo: 'Entenda o cenário antes de propor', itens: [
      'É condomínio? (muda decisor, uso coletivo e responsabilidade — pode pedir o especialista desde o começo)',
      'A casa é de veraneio ou é moradia fixa? (uso esporádico vs diário muda urgência e prioridade)',
      'Essa é a única água que ele tem pra consumir? (se sim, a necessidade é real e urgente — não há "plano B")',
      'Quem usa a água e para quê? (consumo humano puxa o cuidado máximo com responsabilidade)',
      'Qual o problema que fez ele procurar agora? (cor, cheiro, mancha, gosto, incrustação…)',
    ]},

    { tipo: 'titulo', texto: 'Peça fotos' },
    { tipo: 'checklist', titulo: 'Antes/durante a qualificação, peça fotos de:', itens: [
      'A água (num copo/garrafa transparente, contra a luz).',
      'Manchas em louças, roupas, pisos ou tubulação (indício de ferro/manganês).',
      'O poço e a bomba (identificação, se possível).',
      'A caixa d\'água e o tipo (taça, fibra, polietileno).',
      'Os equipamentos já existentes (boiler, filtros, pressurizador).',
      'O espaço disponível para instalar o tratamento (com um objeto de referência de tamanho).',
    ]},
    { tipo: 'callout', variante: 'sucesso', titulo: 'Foto qualifica e acelera',
      html: 'As fotos ajudam a confirmar sinais (mancha = metal), a dimensionar o espaço e a mostrar ao especialista antes da visita. Cliente que manda fotos está engajado — mais um termômetro de interesse.' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente pergunta o preço e se recusa a pagar a taxa da visita. O que isso normalmente indica?',
      opcoes: [
        'Que a taxa está cara demais e deve ser removida.',
        'Que provavelmente ele não vai fechar a solução — a taxa é um termômetro de interesse e verba.',
        'Que é só marcar a visita mesmo assim para convencer no local.',
      ],
      correta: 1,
      explicacao: 'A taxa não é cobrança pela visita, é taxa de interesse. Quem não topa pagá-la raramente fecha o produto. É um qualificador — não insista às cegas.'
    },
    {
      pergunta: 'Qual conjunto de sinais indica melhor que o cliente tem porte/verba?',
      opcoes: [
        'Poço artesiano + boiler + piscina + vários banheiros + caixa taça.',
        'Perguntar diretamente "quanto você pode gastar?".',
        'O cliente dizer que a água "está boa".',
      ],
      correta: 0,
      explicacao: 'A leitura de budget vem dos sinais da estrutura (profundidade do poço, boiler, piscina, nº de banheiros, caixa taça), não de perguntar o valor de forma seca.'
    },
    {
      pergunta: 'Como deve começar TODA conversa (SDR ou closer)?',
      opcoes: [
        'Mandando o preço e a tabela de equipamentos.',
        'Se apresentando como especialista da Tudo de Filtro, pedindo permissão para perguntar e focando em resolver o problema.',
        'Perguntando só o endereço para agendar a visita.',
      ],
      correta: 1,
      explicacao: 'A abertura padrão posiciona autoridade (especialista), pede permissão para qualificar e foca no problema do cliente — não no produto.'
    },
  ],

  exercicio: {
    enunciado: 'Escreva sua abertura pessoal (com seu nome) seguindo o modelo do especialista, e liste 3 perguntas de sinal de budget que você faria numa casa com poço. Depois, escreva como você explicaria — com naturalidade — que a taxa da visita é uma taxa de interesse.',
    dica: 'Abertura = especialista + permissão + problema. Taxa = "faz parte do processo do especialista e mostra que faz sentido pra você resolver isso pra valer".'
  },

  resumo: 'A análise in loco confirma ferro/manganês/dureza e o dimensionamento na casa do cliente, sobretudo em urgência. Toda conversa abre com você como especialista, pedindo permissão e focando no problema. Antes de fechar a visita, dê uma ordem de grandeza do produto para gerar interesse — e entenda que a taxa da visita é uma TAXA DE INTERESSE: quem topa pagar tem verba e intenção; quem não topa, dificilmente fecha. Leia budget pelos sinais (profundidade do poço, boiler, piscina, banheiros, caixa taça), sonde o contexto (condomínio, veraneio, água única) e peça fotos. O valor da taxa e o preço vêm da tabela vigente; o valor final fecha após análise + dimensionamento.'
};
