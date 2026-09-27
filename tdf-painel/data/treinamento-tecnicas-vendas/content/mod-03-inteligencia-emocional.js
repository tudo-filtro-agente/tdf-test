// ============================================================================
// MÓDULO 3 — Inteligência Emocional na Venda
// Baseado em: Inteligência Emocional em Vendas — Jeb Blount
// ============================================================================

module.exports = {
  resumoCurto: 'Desenvolva autoconsciência emocional, empatia e controle de impulsos para criar conexões genuínas e vender mais soluções de água.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-03-video' },

  blocos: [
    { tipo: 'texto', html: 'Jeb Blount afirma que <strong>vendas são transferência de emoção</strong>. Você pode ter o melhor produto do mundo — se não conseguir se conectar emocionalmente com o cliente, não fecha. <strong>Inteligência Emocional (IE)</strong> é a capacidade de reconhecer, entender e gerenciar suas emoções e as do cliente durante o processo de venda.' },

    { tipo: 'titulo', texto: 'Os 5 pilares da IE em Vendas' },
    { tipo: 'cards', itens: [
      { icon: '🪞', titulo: '1. Autoconsciência', html: 'Reconhecer <strong>seus próprios</strong> sentimentos durante a venda. Ansiedade ao falar preço? Frustração com objeção? Se você não percebe, reage no automático e perde o controle.' },
      { icon: '🎮', titulo: '2. Autocontrole', html: 'Capacidade de <strong>pausar antes de reagir</strong>. Cliente grosso? Não revide. Cliente indeciso? Não pressione. O closer emocionalmente inteligente respira, pensa e escolhe a resposta.' },
      { icon: '🤝', titulo: '3. Empatia', html: 'Capacidade de <strong>sentir o que o cliente sente</strong>. Não é concordar — é entender. "Eu entendo que R$ 13.990 é um investimento importante. Me conta: o que te preocupa mais nessa decisão?"' },
      { icon: '🧲', titulo: '4. Consciência Social', html: 'Ler o <strong>ambiente emocional</strong> da conversa. O cliente está com pressa? Está empolgado? Está desconfiado? Adapte seu tom, ritmo e abordagem ao estado emocional dele.' },
      { icon: '🔥', titulo: '5. Automotivação (Sales Drive)', html: 'A base dos quatro primeiros pilares vem de <strong>Daniel Goleman</strong>. No <em>Sales EQ</em>, Blount acrescenta o combustível do vendedor: a <strong>automotivação</strong> — a capacidade de se manter engajado, otimista e em movimento mesmo depois de vários "não". Para quem faz dezenas de ligações por dia, é o pilar que sustenta todos os outros.' },
    ]},

    { tipo: 'titulo', texto: 'A neurociência por trás da venda' },
    { tipo: 'texto', html: 'O cérebro humano decide com emoção e justifica com lógica. Quando um cliente diz <em>"vou pensar"</em>, na verdade está dizendo: <strong>"não me senti seguro o suficiente"</strong>. O trabalho do vendedor com IE é criar segurança emocional para que o cérebro racional do cliente justifique a compra.' },

    { tipo: 'callout', variante: 'info', titulo: 'O princípio da reciprocidade emocional',
      html: 'Se você demonstra calma, o cliente fica calmo. Se você demonstra entusiasmo genuíno, o cliente se anima. Se você demonstra ansiedade (pelo fechamento), o cliente sente desconforto e recua. <strong>Seu estado emocional é contagioso.</strong>' },

    { tipo: 'titulo', texto: 'IE na prática: Cenários TDF' },
    { tipo: 'exemplo', cliente: '(irritado) Eu já liguei pra 3 empresas e ninguém resolve meu problema de ferro na água!', closer: '(empatia + validação) Eu imagino a frustração. Lidar com ferro na água é realmente complicado e a maioria das soluções do mercado não funciona bem. Me conta exatamente o que já tentaram fazer — quero entender o que deu errado pra não repetir o mesmo erro.' },
    { tipo: 'exemplo', cliente: '(desconfiado) Isso é muito caro. Como sei que funciona mesmo?', closer: '(calma + segurança) Entendo a preocupação. R$ 13.990 é um investimento importante e faz todo sentido querer ter certeza. Por isso o primeiro passo é a visita técnica + análise da água (R$ 800), que entra como parte do seu projeto — o valor é abatido na proposta. Nosso técnico vai na sua casa, analisa a água, e você decide com o diagnóstico completo em mãos.' },
    { tipo: 'exemplo', cliente: '(ansioso) Preciso resolver isso urgente, minha esposa está grávida e não quer usar a água.', closer: '(conexão + urgência legítima) Parabéns pela chegada do bebê! Faz total sentido querer água segura antes da chegada dele. Vou priorizar o agendamento da visita técnica pra essa semana. Qual o melhor dia pra você?' },

    { tipo: 'titulo', texto: 'O termômetro emocional do vendedor' },
    { tipo: 'texto', html: 'Antes de cada atendimento, faça um <strong>check emocional de 10 segundos</strong>:' },
    { tipo: 'checklist', titulo: 'Check emocional pré-atendimento', itens: [
      'Como estou me sentindo agora? (ansioso, calmo, frustrado, motivado)',
      'A última ligação afetou meu humor? Preciso resetar?',
      'Estou focado neste cliente ou pensando na meta?',
      'Meu tom de voz está transmitindo segurança ou pressa?',
    ]},

    { tipo: 'titulo', texto: 'Os 3 "vampiros emocionais" da venda' },
    { tipo: 'cards', itens: [
      { icon: '😰', titulo: 'Medo da rejeição', html: 'Faz o vendedor evitar follow-up, não pedir o fechamento e aceitar "vou pensar" passivamente. <strong>Antídoto:</strong> Lembre que o "não" é ao produto, não a você.' },
      { icon: '😤', titulo: 'Necessidade de aprovação', html: 'Faz o vendedor dar desconto desnecessário, concordar com tudo e evitar confronto construtivo. <strong>Antídoto:</strong> Seu papel é ser consultor, não amigo.' },
      { icon: '🏃', titulo: 'Ansiedade de fechamento', html: 'Faz o vendedor apressar a venda, falar demais e pressionar antes da hora. <strong>Antídoto:</strong> Confie no processo. Se o SPIN foi bem feito, o fechamento é consequência.' },
    ]},

    { tipo: 'dodont',
      fazer: [
        'Pausar 2 segundos antes de responder a uma objeção.',
        'Validar a emoção do cliente antes de argumentar.',
        'Espelhar o tom de voz do cliente (não o conteúdo negativo).',
        'Fazer check emocional entre atendimentos.',
        'Separar o resultado da venda da sua autoestima.',
      ],
      evitar: [
        'Levar objeções para o lado pessoal.',
        'Reagir com sarcasmo ou irritação a clientes difíceis.',
        'Demonstrar desespero por bater meta.',
        'Ignorar sinais emocionais do cliente (silêncio, hesitação, pressa).',
        'Fingir empatia — o cliente percebe falsidade.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente diz irritado: "Já liguei pra 5 lugares e ninguém resolve!" Qual a melhor primeira reação?',
      opcoes: [
        'Falar que o produto TDF é diferente de todos os outros.',
        'Validar a frustração: "Eu entendo a frustração. Me conta o que já tentaram."',
        'Oferecer desconto para compensar a irritação.',
      ],
      correta: 1,
      explicacao: 'Validar a emoção primeiro cria conexão. Só depois de o cliente se sentir ouvido ele estará aberto a ouvir sobre a solução.'
    },
    {
      pergunta: 'Qual dos "vampiros emocionais" faz o vendedor dar desconto desnecessário?',
      opcoes: [
        'Medo da rejeição',
        'Necessidade de aprovação',
        'Ansiedade de fechamento',
      ],
      correta: 1,
      explicacao: 'A necessidade de aprovação faz o vendedor querer agradar o cliente a todo custo, inclusive sacrificando margem.'
    },
    {
      pergunta: 'Por que o cérebro do cliente decide com emoção e justifica com lógica?',
      opcoes: [
        'Porque clientes são irracionais.',
        'Porque o sistema límbico (emocional) processa mais rápido que o neocórtex (racional).',
        'Porque vendedores manipulam emoções.',
      ],
      correta: 1,
      explicacao: 'A neurociência mostra que decisões são emocionais primeiro. O papel do vendedor é criar segurança emocional para que o racional justifique a compra.'
    },
  ],

  exercicio: {
    enunciado: 'Relembre sua última venda que não fechou. Identifique: (1) qual era o estado emocional do cliente, (2) qual era o SEU estado emocional, (3) o que você faria diferente usando os 5 pilares de IE.',
    dica: 'Seja honesto sobre seus sentimentos. Estava ansioso para bater meta? Frustrado com a objeção? Identifique o vampiro emocional que atuou e planeje o antídoto.'
  },

  resumo: 'Inteligência Emocional em vendas é a capacidade de gerenciar suas emoções e ler as do cliente. Os 5 pilares (autoconsciência, autocontrole, empatia, consciência social — base de Goleman — e a automotivação, o sales drive do Sales EQ de Blount) permitem criar conexão genuína e sustentar o ritmo. Vendedores que dominam IE vendem mais porque o cliente se sente seguro — e segurança emocional é o gatilho da decisão de compra.'
};
