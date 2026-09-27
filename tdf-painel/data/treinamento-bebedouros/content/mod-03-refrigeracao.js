// ============================================================================
// MÓDULO 3 — Compressores e refrigeração
// ----------------------------------------------------------------------------
// Fato da empresa: 15/25/60 L = compressor 1/10; 100/200 L = compressor 1/5.
// Schema idêntico ao mod-01-intro.js. Nada de spec inventada, nada de % de
// economia sem laudo, nada de potabilidade.
// ============================================================================

module.exports = {
  resumoCurto: 'Como o bebedouro gela a água, por que os modelos maiores usam compressor 1/5 e como falar de recuperação de temperatura sem prometer o que não pode.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-03-refrigeracao-video' },

  blocos: [
    { tipo: 'texto', html: 'A refrigeração é o coração do bebedouro industrial. O cliente não compra "litros parados" — ele compra <strong>água gelada disponível justamente no pico</strong>. Quem entrega isso é o conjunto de refrigeração: <strong>compressor + serpentina + ventoinha</strong>, trabalhando para gelar a água e <strong>recuperar a temperatura</strong> depois de cada consumo.' },

    { tipo: 'titulo', texto: 'O que é "recuperação de temperatura"' },
    { tipo: 'texto', html: 'Quando muita gente usa o bebedouro ao mesmo tempo, entra água na temperatura ambiente para repor a que saiu. A <strong>recuperação</strong> é a velocidade com que o equipamento gela essa água nova. Um bebedouro bem dimensionado <strong>refrigera mais rápido</strong> e mantém o conforto no pico; um subdimensionado <strong>trabalha demais e perde desempenho</strong> — a água sai morna justamente quando mais se precisa dela.' },

    { tipo: 'titulo', texto: 'Compressor por modelo' },
    { tipo: 'texto', html: 'Não é só o tamanho do reservatório que muda entre os modelos. Os <strong>modelos maiores precisam de mais recuperação</strong>, então usam um compressor mais forte, preparado para demanda intensa.' },
    { tipo: 'tabela',
      head: ['Modelo', 'Compressor', 'Leitura comercial'],
      rows: [
        ['15 litros', '1/10', 'Uso leve, poucos usuários.'],
        ['25 litros', '1/10', 'Empresa pequena, uso distribuído.'],
        ['60 litros', '1/10', 'Empresa média — checar simultaneidade no pico.'],
        ['100 litros', '1/5', 'Alta demanda: compressor mais forte, recupera melhor no pico.'],
        ['200 litros', '1/5', 'Topo da linha: preparado para demanda intensa.'],
      ]
    },
    { tipo: 'callout', variante: 'info', titulo: 'A regra de compressor (fato da empresa)',
      html: '<strong>15, 25 e 60 litros → compressor 1/10.</strong><br><strong>100 e 200 litros → compressor 1/5.</strong><br>O 1/5 é mais forte: recupera a temperatura mais rápido, o que faz diferença no horário de pico.' },

    { tipo: 'titulo', texto: 'O papel da ventoinha' },
    { tipo: 'texto', html: 'A ventoinha <strong>dissipa o calor</strong> que a refrigeração gera. Quanto melhor o calor é jogado para fora, melhor o compressor trabalha e mais rápido o sistema recupera a temperatura. Por isso o equipamento não pode ficar prensado na parede nem com a ventilação bloqueada — o calor precisa de saída.' },

    { tipo: 'script',
      contexto: 'Cliente em dúvida entre um modelo menor e o modelo maior, focado só no preço.',
      fala: 'Além da capacidade do reservatório, nós analisamos a capacidade de recuperação da refrigeração. Nos modelos maiores, utilizamos compressor 1/5, preparado para uma demanda mais intensa.' },

    { tipo: 'titulo', texto: 'Dimensionar certo é vender certo' },
    { tipo: 'cards', itens: [
      { icon: '✅', titulo: 'Bem dimensionado', html: 'Trabalha dentro da folga, recupera a temperatura no pico e entrega conforto constante.' },
      { icon: '⚠️', titulo: 'Subdimensionado', html: 'Trabalha no limite o tempo todo, demora a recuperar e a água esquenta na hora de maior uso.' },
      { icon: '🎯', titulo: 'O critério', html: 'Pico de consumo simultâneo + recuperação, não só o total de pessoas nem o número de litros.' },
    ]},

    { tipo: 'dodont',
      fazer: [
        'Explicar recuperação de temperatura como o diferencial do modelo certo.',
        'Usar o compressor 1/5 dos modelos maiores como argumento de desempenho no pico.',
        'Pode explicar que economia PODE ocorrer porque um equipamento adequado não trabalha constantemente no limite.',
      ],
      evitar: [
        'NÃO prometer percentual de economia de energia sem laudo.',
        'Prometer temperatura exata em graus sem medição.',
        'Empurrar modelo menor só por preço sem registrar o risco de subdimensionamento.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Quais modelos usam compressor 1/5?',
      opcoes: [
        'Todos os modelos.',
        'Apenas 100 e 200 litros.',
        '15, 25 e 60 litros.',
      ],
      correta: 1,
      explicacao: 'Fato da empresa: 15/25/60 L usam 1/10; 100 e 200 L usam 1/5, para dar mais recuperação na demanda intensa.'
    },
    {
      pergunta: 'O cliente pergunta se o bebedouro "economiza energia". Qual a resposta correta?',
      opcoes: [
        'Sim, economiza 30% de energia.',
        'Não posso citar percentual sem laudo, mas um equipamento bem dimensionado não trabalha constantemente no limite, então a economia pode ocorrer.',
        'Bebedouro não tem nada a ver com energia.',
      ],
      correta: 1,
      explicacao: 'Nunca prometer percentual sem laudo. Pode-se explicar o mecanismo: equipamento adequado não fica no limite o tempo todo, e daí a economia pode acontecer.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente com 250 pessoas no pico quer o modelo de 60 litros para economizar. Escreva como você usaria "recuperação de temperatura" e "compressor 1/5" para recomendar o modelo adequado sem soar que só quer vender o mais caro.',
    dica: 'Ancore no pico simultâneo e no risco de a água esquentar na hora de maior uso. Registre o risco se o cliente insistir no menor.'
  },

  resumo: 'A refrigeração (compressor + serpentina + ventoinha) gela a água e recupera a temperatura no pico. 15/25/60 L usam compressor 1/10; 100/200 L usam 1/5, mais forte para demanda intensa. Modelo bem dimensionado trabalha com folga; subdimensionado trabalha demais e perde desempenho. Pode-se explicar que economia PODE ocorrer, mas nunca prometer percentual sem laudo.'
};
