// ============================================================================
// MÓDULO 8 — Dureza  (academia de Poço — segue CONTRATO DE SCHEMA do mod-01)
// Blocos suportados: texto | titulo | callout | card | cards | script | dodont |
//   checklist | tabela | perguntas | exemplo | pendente | especialista
// REGRA: NÃO inventar dosagens, consumo de sal, dimensionamento ou "solução
//   definitiva". Onde precisa de cálculo/valor, usar bloco `pendente`.
// ============================================================================

module.exports = {
  resumoCurto: 'Dureza é cálcio e magnésio dissolvidos — não é partícula. Filtrar não abranda; abrandar é troca iônica com resina e sal. Dimensionar e consumir sal dependem de análise.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-08-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'A confusão que mais gera venda errada',
      html: 'Dureza é mineral <strong>dissolvido</strong> (cálcio e magnésio), não partícula em suspensão. Um filtro de sedimentos, por melhor que seja, <strong>não reduz dureza</strong>. Nunca prometa "acabar com a incrustação" só trocando um elemento filtrante — e nunca cite consumo de sal ou tamanho de equipamento de cabeça: isso vem da análise e do dimensionamento.' },

    { tipo: 'titulo', texto: 'O que é dureza' },
    { tipo: 'texto', html: 'Dureza é a soma dos <strong>íons de cálcio (Ca²⁺) e magnésio (Mg²⁺)</strong> dissolvidos na água. Quanto mais desses minerais, mais "dura" é a água. No laudo, a <strong>dureza total</strong> costuma ser expressa em <strong>mg/L como CaCO₃</strong> (miligramas por litro equivalentes a carbonato de cálcio) — uma unidade de referência que padroniza a leitura.' },
    { tipo: 'cards', itens: [
      { icon: '🧪', titulo: 'Cálcio (Ca²⁺)', html: 'Principal responsável pela dureza na maioria das águas de poço.' },
      { icon: '⚗️', titulo: 'Magnésio (Mg²⁺)', html: 'Soma-se ao cálcio na formação da dureza total.' },
      { icon: '📏', titulo: 'Dureza total', html: 'Cálcio + magnésio, lida em mg/L como CaCO₃ no laudo.' },
      { icon: '🚫', titulo: 'Não é partícula', html: 'Está dissolvida na água — não fica retida em tela nem em vela.' },
    ]},

    { tipo: 'titulo', texto: 'Por que a incrustação atrapalha' },
    { tipo: 'texto', html: 'Quando a água aquece ou evapora, cálcio e magnésio tendem a precipitar e formar <strong>incrustação</strong> (a "crosta" branca/dura). Com o tempo isso afeta o desempenho e a vida útil de vários pontos da casa e da operação.' },
    { tipo: 'tabela',
      head: ['Onde a incrustação aparece', 'O que costuma acontecer'],
      rows: [
        ['Resistências e boilers', 'Crosta isola a resistência, exige mais energia e reduz vida útil.'],
        ['Chuveiros e aeradores', 'Furos entopem, o jato perde força e "pinga" mineral.'],
        ['Tubulações e válvulas', 'Depósito estreita a passagem e pode travar registros.'],
        ['Superfícies (louças, vidros, torneiras)', 'Manchas esbranquiçadas e aspecto "encardido" mesmo limpo.'],
      ]
    },
    { tipo: 'callout', variante: 'info', titulo: 'Filtrar partícula ≠ tratar dureza',
      html: 'Retenção de sujeira (areia, barro, ferro precipitado) é uma coisa; reduzir cálcio e magnésio <strong>dissolvidos</strong> é outra. São problemas diferentes que pedem tecnologias diferentes. Confundir os dois é a origem da promessa que não se cumpre.' },

    { tipo: 'titulo', texto: 'Abrandamento por troca iônica' },
    { tipo: 'texto', html: 'A forma clássica de reduzir dureza é o <strong>abrandamento por troca iônica</strong>. A água passa por um leito de <strong>resina catiônica</strong> que "troca" os íons de cálcio e magnésio por sódio. A água que sai tem menos dureza — daí o nome abrandador.' },
    { tipo: 'cards', itens: [
      { icon: '🟤', titulo: 'Resina catiônica', html: 'Leito que captura Ca²⁺ e Mg²⁺ e libera sódio em troca.' },
      { icon: '🔁', titulo: 'Regeneração', html: 'Quando a resina satura, ela é "recarregada" com salmoura (solução de sal).' },
      { icon: '🧂', titulo: 'Tanque de salmoura', html: 'Reservatório onde o sal vira a solução usada na regeneração.' },
      { icon: '💧', titulo: 'Dureza residual', html: 'A dureza que ainda passa depois do abrandamento — precisa ser medida, não presumida.' },
    ]},
    { tipo: 'especialista', nome: 'abrandamento', icon: '🧑‍🔬',
      html: 'Pensa na resina como uma esponja de íons: ela captura cálcio e magnésio até encher. Aí a gente regenera com salmoura pra ela voltar a trabalhar. O detalhe é: quanto ela aguenta, com que frequência regenera e quanto sal gasta são contas — dependem da dureza do laudo e do consumo de água. Não chuta.' },

    { tipo: 'titulo', texto: 'O que define o projeto (e o que é conta)' },
    { tipo: 'texto', html: 'O abrandador é dimensionado pela <strong>carga de dureza</strong> que precisa tratar e pela <strong>vazão</strong> exigida no ponto de uso. Disso decorrem a <strong>frequência de regeneração</strong> e o <strong>consumo de sal</strong>. Todos esses números saem do cruzamento entre laudo + demanda de água + engenharia — nunca de estimativa comercial.' },
    { tipo: 'checklist', titulo: 'Dados que o projeto de abrandamento precisa', itens: [
      'Dureza total do laudo (mg/L como CaCO₃).',
      'Vazão necessária no ponto de uso (quanta água por vez).',
      'Consumo/volume de água tratada por período.',
      'Objetivo do cliente (proteger boiler, evitar mancha, processo industrial etc.).',
      'Espaço, ponto elétrico/hidráulico e destino do descarte da regeneração.',
    ]},
    { tipo: 'pendente', html: 'Valores de <strong>dimensionamento</strong> (capacidade da resina, tamanho do equipamento), <strong>consumo de sal</strong>, <strong>frequência de regeneração</strong> e <strong>dureza residual alvo</strong> dependem de análise + demanda + cálculo do especialista. Não informar números de cabeça.' },

    { tipo: 'titulo', texto: 'Descarte da salmoura' },
    { tipo: 'texto', html: 'Cada regeneração gera um <strong>efluente salino</strong> (a salmoura usada). O destino desse descarte precisa ser considerado no projeto — direção da rede, viabilidade no local e boas práticas ambientais. Trate isso como parte da solução, não como detalhe.' },

    { tipo: 'titulo', texto: 'Alternativas anti-incrustação' },
    { tipo: 'callout', variante: 'alerta', titulo: 'CRÍTICO — o que essas tecnologias fazem (e o que NÃO fazem)',
      html: 'Existem tecnologias <strong>anti-incrustação</strong> (físicas, indução, condicionadores etc.) que buscam <strong>reduzir a formação</strong> de crosta. Elas <strong>NÃO removem cálcio e magnésio</strong> da água — a dureza continua presente. Nunca diga que "tiram a dureza" ou que "substituem o abrandador em qualquer caso". São abordagens diferentes, com objetivos diferentes. A escolha entre abrandar (remover dureza por troca iônica) e reduzir incrustação depende do objetivo do cliente e da análise.' },
    { tipo: 'dodont',
      fazer: [
        'Explicar que dureza é mineral dissolvido, não partícula.',
        'Posicionar abrandamento (troca iônica) como remoção de dureza.',
        'Deixar claro que anti-incrustação reduz formação de crosta, sem tirar cálcio/magnésio.',
        'Enviar dureza do laudo + demanda pro especialista dimensionar.',
      ],
      evitar: [
        'Prometer "acabar com a incrustação" trocando um filtro de sedimentos.',
        'Dizer que anti-incrustação "remove a dureza".',
        'Chutar consumo de sal, tamanho do equipamento ou frequência de regeneração.',
        'Ignorar o destino do descarte da salmoura no projeto.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente pede "um filtro que tire a dureza do poço". Qual a resposta técnica correta?',
      opcoes: [
        'Vender o filtro de sedimentos, que retém a dureza.',
        'Explicar que dureza é cálcio e magnésio dissolvidos: filtro de partícula não reduz; o caminho clássico é abrandamento por troca iônica, dimensionado pela análise.',
        'Oferecer o maior filtro disponível para garantir.',
      ],
      correta: 1,
      explicacao: 'Dureza está dissolvida na água. Filtro mecânico retém partícula, não íons. Reduzir dureza é abrandamento (resina + regeneração com sal), dimensionado por laudo e demanda.'
    },
    {
      pergunta: 'Sobre tecnologias anti-incrustação, o que é correto afirmar?',
      opcoes: [
        'Elas removem cálcio e magnésio da água.',
        'Elas buscam reduzir a formação de incrustação, mas NÃO removem cálcio e magnésio — a dureza continua presente.',
        'Elas substituem o abrandador em qualquer situação.',
      ],
      correta: 1,
      explicacao: 'Anti-incrustação atua na formação da crosta, não na remoção da dureza. Afirmar que "tiram a dureza" é promessa falsa.'
    },
    {
      pergunta: 'Um colega quer passar por telefone o consumo de sal e a frequência de regeneração. O que fazer?',
      opcoes: [
        'Passar uma estimativa "por experiência" para agilizar.',
        'Explicar que são cálculos: dependem da dureza do laudo, da vazão e do volume tratado — encaminhar ao especialista para dimensionar.',
        'Dizer que é sempre um saco de sal por mês.',
      ],
      correta: 1,
      explicacao: 'Consumo de sal, dimensionamento e frequência de regeneração são resultado de conta (carga de dureza + demanda), nunca número fixo de memória.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente com poço reclama de "crosta branca no chuveiro e no boiler" e pergunta se um filtro resolve. Escreva, em 3–4 frases, como você diferencia filtrar partícula de tratar dureza, apresenta o abrandamento como caminho e explica por que consumo de sal e dimensionamento só saem depois da análise.',
    dica: 'Ancore em "dureza é dissolvida, não partícula", "abrandamento = troca iônica com regeneração por sal" e "dimensionar é conta, não chute".'
  },

  resumo: 'Dureza é cálcio e magnésio dissolvidos (mg/L como CaCO₃) e causa incrustação em resistências, chuveiros, tubulações e superfícies. Filtrar partícula não reduz dureza; o caminho clássico é o abrandamento por troca iônica, com resina catiônica regenerada por salmoura no tanque de sal — gerando dureza residual e descarte a considerar. Dimensionamento, consumo de sal e frequência de regeneração são cálculo do especialista (análise + demanda). Tecnologias anti-incrustação reduzem a formação de crosta, mas NÃO removem cálcio e magnésio.'
};
