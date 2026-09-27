// ============================================================================
// MÓDULO 03 — Scale Stop × abrandador (o que faz e o que NÃO faz)
// Abrandador REMOVE dureza (resina catiônica + sal, água mole). Scale Stop REDUZ
// crosta SEM remover, sem sal. Quando indicar cada um. Callout perigo travado.
// ============================================================================

module.exports = {
  resumoCurto: 'A distinção que mais gera erro em venda: abrandador REMOVE a dureza (resina catiônica regenerada com sal, deixa a água mole); Scale Stop REDUZ a crosta SEM remover a dureza e sem sal. Objetivo do cliente decide qual dos dois.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-vs-abrandador-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ A confusão que mais custa venda (e credibilidade)',
      html: 'Scale Stop <strong>NÃO é abrandador</strong>. Abrandador <strong>remove</strong> a dureza e deixa a água <strong>mole</strong>; Scale Stop <strong>reduz a crosta sem remover</strong> a dureza e <strong>sem sal</strong>. Se o cliente precisa mesmo de água mole, o caminho é o abrandador — nunca prometa isso no Scale Stop.' },

    { tipo: 'titulo', texto: 'Como cada um funciona' },
    { tipo: 'cards', itens: [
      { icon: '🧂', titulo: 'Abrandador — REMOVE a dureza', html: 'Usa <strong>resina catiônica</strong> num vaso + <strong>tanque de sal</strong>. Troca o cálcio e o magnésio por <strong>sódio</strong> → água sai <strong>mole</strong>. Regenera com salmoura (sal), manda a dureza pro dreno.' },
      { icon: '💎', titulo: 'Scale Stop — REDUZ a crosta sem remover', html: 'Anti-incrustante <strong>sem sal</strong> (TAC). Converte o cálcio em <strong>micro-cristais que não aderem</strong>. Os minerais continuam na água, mas a crosta deixa de se formar.' },
    ]},

    { tipo: 'titulo', texto: 'A tabela que você precisa dominar' },
    { tipo: 'tabela',
      head: ['', 'Abrandador', 'Scale Stop'],
      rows: [
        ['O que faz na dureza', 'REMOVE (troca por sódio)', 'MANTÉM (não remove)'],
        ['Água fica…', 'Mole', 'Igual — só sem a crosta'],
        ['Usa sal?', 'Sim (regenera com salmoura)', 'Não'],
        ['Adiciona sódio?', 'Sim', 'Não'],
        ['Dreno / descarte de salmoura', 'Precisa', 'Não precisa'],
        ['Objetivo ideal', 'Água mole de verdade', 'Parar a crosta/mancha sem sal'],
      ]
    },

    { tipo: 'especialista', nome: 'mídias filtrantes', icon: '🧑‍🔬',
      html: 'Regra de bolso: objetivo é "<strong>água mole / remover dureza</strong>" (aquecimento, caldeira, certos processos)? <strong>Abrandador</strong>. Objetivo é "<strong>parar a crosta e a mancha sem usar sal</strong>"? <strong>Scale Stop</strong>. E sempre confirme vazão e espaço antes de fechar.' },

    { tipo: 'titulo', texto: 'Quando indicar cada um' },
    { tipo: 'cards', itens: [
      { icon: '💎', titulo: 'Scale Stop quando…', html: 'Cliente quer <strong>reduzir crosta/mancha branca</strong>, não quer sal/sódio nem dreno de salmoura, e não precisa de água mole de verdade.' },
      { icon: '🧂', titulo: 'Abrandador quando…', html: 'O objetivo é <strong>remover a dureza de fato</strong> — água mole para aquecimento, processo, caldeira, ou conforto pleno que exige abrandamento real.' },
    ]},

    { tipo: 'callout', variante: 'perigo', titulo: '⛔ Nunca diga isso do Scale Stop',
      html: '"O Scale Stop deixa a sua água mole." / "Ele remove a dureza." / "É um abrandador sem sal." <strong>Tudo errado.</strong> O correto: "reduz a incrustação e a mancha branca mantendo os minerais, sem sal e sem salmoura".' },

    { tipo: 'script', titulo: 'Como corrigir sem perder a venda',
      passos: [
        'Cliente: "então o Scale Stop deixa minha água mole?"',
        'Você: "Ótima pergunta, e é importante ser honesto: não. Quem deixa a água mole é o abrandador, que usa sal e troca o cálcio por sódio."',
        '"O Scale Stop faz outra coisa: ele muda a forma do cálcio pra que ele pare de grudar — então a crosta e a mancha branca caem muito, mas sem sal e sem mexer nos minerais."',
        '"Me conta seu objetivo: você quer a água mole de verdade, ou quer parar a mancha/crosta sem usar sal? Isso define qual é o caminho certo pra você."',
      ] },

    { tipo: 'dodont',
      fazer: [
        'Explicar a diferença com honestidade: remover (abrandador) × reduzir (Scale Stop).',
        'Descobrir o OBJETIVO do cliente antes de indicar um ou outro.',
        'Confirmar vazão/espaço antes de fechar qualquer um dos dois.',
      ],
      evitar: [
        'Vender Scale Stop como "abrandador sem sal" ou prometendo água mole.',
        'Empurrar Scale Stop quando o caso exige abrandamento real.',
        'Falar mal do abrandador — cada um resolve um objetivo diferente.',
      ] },
  ],

  perguntasRapidas: [
    { pergunta: 'Diferença central entre abrandador e Scale Stop?',
      opcoes: ['São a mesma coisa.', 'Abrandador REMOVE a dureza (sal, água mole); Scale Stop REDUZ a crosta sem remover, sem sal.', 'Scale Stop remove mais dureza que o abrandador.'],
      correta: 1, explicacao: 'Abrandador = remoção real via resina catiônica + sal (água mole). Scale Stop = TAC, reduz crosta mantendo os minerais, sem sal.' },
    { pergunta: 'Cliente precisa de água mole de verdade para um aquecimento. O que indicar?',
      opcoes: ['Scale Stop, que deixa a água mole.', 'Abrandador — é ele que remove a dureza.', 'Qualquer um, dá no mesmo.'],
      correta: 1, explicacao: 'Água mole = abrandador. Scale Stop não deixa a água mole; nunca prometa isso.' },
    { pergunta: 'Cliente quer parar a mancha branca, mas não quer usar sal nem ter dreno. O que indicar?',
      opcoes: ['Abrandador com sal.', 'Scale Stop — reduz a crosta sem sal e sem salmoura.', 'Nada resolve sem sal.'],
      correta: 1, explicacao: 'Scale Stop é sem sal e sem dreno de salmoura — ideal pra reduzir crosta/mancha sem sódio.' },
  ],

  exercicio: {
    enunciado: 'Um cliente diz: "me falaram que esse Scale Stop é um abrandador sem sal que deixa a água mole". Corrija esse entendimento em 3 frases, sem desmerecer o abrandador, e faça 1 pergunta que define qual produto é o certo pra ele.',
    dica: 'Corrija: Scale Stop reduz crosta sem remover dureza (não deixa mole). Pergunta-chave: "seu objetivo é água mole de verdade ou parar a mancha/crosta sem sal?"'
  },

  resumo: 'Abrandador REMOVE a dureza (resina catiônica + sal, água mole, adiciona sódio, precisa de dreno). Scale Stop REDUZ a crosta SEM remover a dureza, sem sal, sem salmoura, mantendo os minerais. Objetivo decide: água mole de verdade = abrandador; parar mancha/crosta sem sal = Scale Stop. Nunca venda Scale Stop como abrandador nem prometa água mole.'
};
