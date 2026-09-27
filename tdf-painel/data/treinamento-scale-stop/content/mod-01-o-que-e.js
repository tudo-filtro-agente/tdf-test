// ============================================================================
// MÓDULO 01 — O que é o Scale Stop
// Anti-incrustante SEM SAL (linha TAC). Reduz a incrustação SEM remover a dureza.
// NÃO é abrandador, NÃO deixa a água mole. Specs (vazão/mídia/capacidade) -> pendente.
// ============================================================================

module.exports = {
  resumoCurto: 'Scale Stop é um anti-incrustante SEM SAL (tecnologia TAC): converte o cálcio em micro-cristais que não aderem, reduzindo a crosta — sem remover a dureza, sem sal e sem descarte de salmoura.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-o-que-e-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ A regra que não se quebra',
      html: 'Scale Stop <strong>reduz a incrustação sem remover a dureza</strong> — <strong>não é abrandador</strong> e <strong>não deixa a água mole</strong>. Nunca prometa "remover dureza" nem "água mole". Isso é abrandador, não Scale Stop.' },

    { tipo: 'titulo', texto: 'O que é o Scale Stop, em uma frase' },
    { tipo: 'texto', html: 'Scale Stop é uma tecnologia <strong>anti-incrustação sem sal</strong> (linha <strong>TAC — cristalização assistida por template</strong>). Em vez de tirar o cálcio e o magnésio da água, ele faz o mineral virar <strong>micro-cristais estáveis</strong> que <strong>não aderem</strong> às superfícies. Resultado: a <strong>crosta deixa de se formar</strong>, mas os minerais continuam na água.' },

    { tipo: 'titulo', texto: 'Como funciona (TAC — sem sal, sem salmoura)' },
    { tipo: 'cards', itens: [
      { icon: '💠', titulo: 'Converte, não remove', html: 'O cálcio dissolvido é <strong>convertido em micro-cristais</strong> na superfície da mídia TAC. Esses cristais ficam estáveis e passam pela tubulação sem "colar".' },
      { icon: '🧱', titulo: 'Sem crosta aderente', html: 'Como o mineral já saiu cristalizado, ele <strong>não adere</strong> ao boiler, chuveiro, resistência, torneira e louça. A incrustação é reduzida.' },
      { icon: '🚫🧂', titulo: 'Sem sal, sem dreno', html: 'Diferente do abrandador, <strong>não usa sal</strong>, não adiciona sódio e <strong>não gera descarte de salmoura</strong> nem precisa de dreno de regeneração.' },
    ]},

    { tipo: 'especialista', nome: 'mídias filtrantes', icon: '🧑‍🔬',
      html: 'TAC (Template Assisted Crystallization) é a família à qual o Scale Stop pertence. A mídia serve de "molde" para o cálcio se cristalizar em partículas microscópicas que não grudam. A dureza continua na água (os minerais estão lá), mas a tendência de formar crosta cai muito.' },

    { tipo: 'titulo', texto: 'O que faz × o que NÃO faz' },
    { tipo: 'tabela', head: ['O Scale Stop FAZ', 'O Scale Stop NÃO faz'], rows: [
      ['Reduz a formação de incrustação/crosta', 'NÃO remove a dureza (cálcio e magnésio continuam)'],
      ['Trabalha sem sal e sem salmoura', 'NÃO deixa a água "mole" como o abrandador'],
      ['Protege boiler, resistência, chuveiro, louça e vidros', 'NÃO adiciona sódio à água'],
      ['Mantém os minerais na água', 'NÃO substitui o abrandador quando o cliente PRECISA de água mole'],
    ]},

    { tipo: 'callout', variante: 'sucesso', titulo: 'A analogia que o cliente entende',
      html: 'Diga: "O Scale Stop <strong>não tira o cálcio da sua água</strong> — ele muda a forma do cálcio para que ele <strong>pare de grudar</strong> nas suas superfícies. Sua água continua a mesma, mas a crosta e a mancha branca diminuem muito." Simples e honesto.' },

    { tipo: 'pendente', html: 'Números de <strong>vazão, tipo/volume de mídia, capacidade e dimensionamento</strong> do Scale Stop <strong>não vão de cabeça</strong>. Isso depende de análise + hidráulica e sai do especialista/ficha técnica oficial da TDF. Não invente spec para o cliente.' },

    { tipo: 'dodont',
      fazer: [
        'Explicar como "anti-incrustante sem sal que converte o cálcio para não grudar".',
        'Deixar claro que reduz a crosta/mancha mantendo os minerais na água.',
        'Puxar spec (vazão/mídia/capacidade) da ficha oficial, nunca de memória.',
      ],
      evitar: [
        'Dizer que "remove a dureza" ou "deixa a água mole".',
        'Chamar de abrandador ou comparar como se fosse a mesma coisa.',
        'Inventar número de vazão/capacidade para ganhar a conversa.',
      ] },
  ],

  perguntasRapidas: [
    { pergunta: 'Qual é o mecanismo do Scale Stop?',
      opcoes: ['Troca o cálcio por sódio usando sal.', 'Converte o cálcio em micro-cristais que não aderem (TAC), sem sal.', 'Remove todo o cálcio e magnésio por osmose.'],
      correta: 1, explicacao: 'Scale Stop é TAC: cristaliza o cálcio em micro-partículas que não grudam. Não usa sal e não remove a dureza.' },
    { pergunta: 'O que o Scale Stop NÃO faz?',
      opcoes: ['Reduzir a formação de crosta.', 'Trabalhar sem sal e sem salmoura.', 'Remover a dureza / deixar a água mole.'],
      correta: 2, explicacao: 'Scale Stop reduz a crosta SEM remover a dureza. Água mole é abrandador — nunca prometa isso no Scale Stop.' },
    { pergunta: 'Cliente pergunta a vazão exata do equipamento. O que você faz?',
      opcoes: ['Chuta um número que parece razoável.', 'Puxa a spec da ficha oficial / especialista, sem inventar.', 'Diz que a vazão é ilimitada.'],
      correta: 1, explicacao: 'Vazão, mídia e capacidade são specs técnicas — sempre da fonte oficial, nunca de memória.' },
  ],

  exercicio: {
    enunciado: 'Explique, em 3 frases para um cliente leigo, o que é o Scale Stop, sem usar as palavras "abrandador", "água mole" ou "remover dureza".',
    dica: 'Ancore em: anti-incrustante sem sal, converte o cálcio para não grudar, reduz crosta/mancha mantendo os minerais na água.'
  },

  resumo: 'Scale Stop é anti-incrustante SEM SAL (linha TAC): converte o cálcio em micro-cristais que não aderem, reduzindo a crosta/mancha — sem remover a dureza, sem sal, sem salmoura. Faz: reduz incrustação mantendo os minerais. NÃO faz: remover dureza / deixar água mole (isso é abrandador). Specs de vazão/mídia/capacidade vêm sempre da ficha oficial, nunca de memória.'
};
