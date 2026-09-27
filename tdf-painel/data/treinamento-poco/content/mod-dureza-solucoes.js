// ============================================================================
// MÓDULO — Potabilidade × conforto: dureza na prática e as soluções
// Base: conceito da Portaria GM/MS 888/2021 (dureza = padrão ORGANOLÉPTICO/de
// aceitação, não risco agudo). NÃO cravar VMP aqui — o valor oficial fica em
// parametros-agua.js (a confirmar na fonte oficial). Exemplo dos 140 mg/L é
// ILUSTRATIVO (fornecido pela operação TDF). Produtos e resinas explicados
// tecnicamente; onde o mecanismo do produto não está confirmado, usar `pendente`.
// Regra da academia mantida: anti-incrustante NÃO remove dureza; escolha depende
// de análise + objetivo + hidráulica.
// ============================================================================

module.exports = {
  resumoCurto: 'Por que uma água pode ser potável e ainda assim incrustar tudo — e como escolher entre REMOVER a dureza (abrandador/resina catiônica) ou REDUZIR a incrustação sem sal (Scale Stop / HyperScale).',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-dureza-solucoes-video' },

  blocos: [
    { tipo: 'titulo', texto: 'Portaria 888/2021 e o que "potável" quer dizer' },
    { tipo: 'texto', html: 'A <strong>Portaria GM/MS nº 888/2021</strong> define o padrão de potabilidade da água para consumo humano — os <strong>VMP</strong> (Valores Máximos Permitidos) de cada parâmetro. Só que os parâmetros têm naturezas diferentes: alguns são de <strong>risco à saúde</strong> (microbiológico, nitrato, metais…) e outros são <strong>organolépticos / de aceitação</strong> — ligados a <strong>conforto, aparência e operação</strong>, não a risco agudo.' },
    { tipo: 'callout', variante: 'sucesso', titulo: 'A ideia central deste módulo',
      html: 'A <strong>dureza</strong> é um parâmetro <strong>organoléptico / de aceitação</strong> na 888/2021. Consequência prática: <strong>estar dentro do limite de potabilidade NÃO significa "sem problema"</strong>. A água pode ser potável e ainda assim <strong>incrustar boiler, chuveiro, louça e tubulação</strong> e prejudicar a eficiência de sabão/detergente.' },
    { tipo: 'pendente', html: 'O <strong>VMP oficial da dureza</strong> (e demais parâmetros) fica em <code>parametros-agua.js</code>, referenciado à Portaria 888/2021 — <strong>a confirmar na fonte oficial</strong> pela Tudo de Filtro. Não cite um número de memória: puxe o valor validado.' },

    { tipo: 'titulo', texto: 'Índices de dureza: o exemplo que todo closer precisa entender' },
    { tipo: 'texto', html: 'Exemplo real de campo (ilustrativo): um cliente com cerca de <strong>140 mg/L de dureza</strong> pode estar <strong>abaixo</strong> do limite de potabilidade — ou seja, "a água é potável" — e <strong>mesmo assim</strong> ter <strong>muita incrustação</strong> e reclamações no dia a dia (crosta em resistência, mancha branca, sabão que não rende). É por isso que a gente <strong>não</strong> decide pelo "passou/não passou" na potabilidade: decide pela <strong>dor real</strong> e pelo <strong>objetivo do cliente</strong>.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Não confunda os eixos',
      html: '“Potável” responde <strong>risco à saúde</strong>. “Incrusta / dá conforto” responde <strong>dureza/organoléptico</strong>. Um cliente pode estar tranquilo no primeiro eixo e sofrendo no segundo. Sua venda vive muito nesse segundo eixo.' },

    { tipo: 'titulo', texto: 'Duas famílias de solução (não confunda!)' },
    { tipo: 'cards', itens: [
      { icon: '🧂', titulo: 'REMOVER a dureza', html: 'Abrandador com sal (resina catiônica). Tira de fato o cálcio e o magnésio → água "mole". Consome sal e gera descarte de salmoura.' },
      { icon: '💎', titulo: 'REDUZIR a incrustação sem remover', html: 'Anti-incrustante sem sal (Scale Stop / HyperScale). Os minerais continuam na água, mas passam a não aderir. Sem sal, sem salmoura.' },
    ]},
    { tipo: 'callout', variante: 'perigo', titulo: 'Regra que não se quebra',
      html: 'Anti-incrustante <strong>NÃO remove</strong> cálcio e magnésio e <strong>não deixa a água mole</strong> — ele <strong>reduz a formação de crosta</strong>. Nunca venda anti-incrustante prometendo "remoção de dureza". Se o cliente precisa de água mole de verdade (ex.: processo, caldeira, certos aquecimentos), o caminho é o abrandador.' },

    { tipo: 'titulo', texto: 'Abrandador com sal — como funciona e quando indicar' },
    { tipo: 'texto', html: 'O abrandador usa <strong>resina catiônica</strong> num vaso, mais um <strong>tanque de sal</strong>. A água dura passa pela resina, que <strong>troca o cálcio e o magnésio por sódio</strong> — a água sai <strong>mole</strong>. Quando a resina satura, a válvula faz a <strong>regeneração</strong>: uma salmoura (água + sal) passa pela resina e <strong>recarrega os sítios com sódio</strong>, mandando a dureza para o dreno.' },
    { tipo: 'cards', itens: [
      { icon: '🎯', titulo: 'Dor que resolve', html: 'Incrustação em aquecimento/boiler/chuveiro/tubulação, mancha branca, baixo rendimento de sabão.' },
      { icon: '📍', titulo: 'Onde é indicado', html: 'Quando o objetivo é REMOVER dureza de verdade — aquecimento, certos processos, conforto pleno.' },
      { icon: '⚠️', titulo: 'Pontos de atenção', html: 'Adiciona sódio à água; consome sal; precisa de dreno para a salmoura; dimensionar por carga/vazão.' },
    ]},
    { tipo: 'pendente', html: 'Dimensionamento (litros de resina, consumo de sal, frequência de regeneração, dureza residual-alvo) → depende de análise + vazão + hidráulica. Sai do <strong>especialista</strong>, não de tabela decorada.' },

    { tipo: 'titulo', texto: 'Anti-incrustante sem sal — Scale Stop e HyperScale' },
    { tipo: 'texto', html: '<strong>Scale Stop</strong> e <strong>HyperScale</strong> são tecnologias <strong>anti-incrustação sem sal</strong> (linha TAC — cristalização assistida por template). Em vez de remover o cálcio, elas fazem o mineral virar <strong>micro-cristais estáveis</strong> que <strong>não aderem</strong> às superfícies — então a crosta deixa de se formar, mas os minerais continuam na água.' },
    { tipo: 'cards', itens: [
      { icon: '🎯', titulo: 'Dor que resolve', html: 'Reduzir incrustação/crosta mantendo os minerais, sem sal, sem descarte de salmoura.' },
      { icon: '📍', titulo: 'Onde é indicado', html: 'Quem não quer sal/sódio nem dreno de salmoura e cujo objetivo é reduzir crosta (não zerar dureza).' },
      { icon: '⚠️', titulo: 'Limite honesto', html: 'Não deixa a água mole, não remove dureza, não resolve casos que exigem abrandamento real.' },
    ]},
    { tipo: 'especialista', nome: 'mídias filtrantes', icon: '🧑‍🔬',
      html: 'Regra de bolso: objetivo é "água mole / remover dureza"? Abrandador. Objetivo é "parar a crosta sem sal"? Anti-incrustante (Scale Stop / HyperScale). E sempre confirme vazão e espaço antes de fechar.' },
    { tipo: 'pendente', html: 'O produto <strong>Ion Guard</strong> entra nessa conversa de controle de incrustação/dureza — mas o <strong>mecanismo exato, a linha e a indicação oficial dele devem ser confirmados com a Tudo de Filtro</strong> antes de apresentar ao cliente. Não descreva o funcionamento por suposição.' },

    { tipo: 'titulo', texto: 'Resina catiônica × resina aniônica' },
    { tipo: 'texto', html: '<strong>Resina catiônica</strong> troca <strong>cátions</strong> (íons positivos). Na versão do abrandador, ela troca <strong>Ca²⁺ e Mg²⁺ (dureza) por sódio (Na⁺)</strong>, e é regenerada com <strong>sal (NaCl)</strong>. É a resina do abrandamento.' },
    { tipo: 'texto', html: '<strong>Resina aniônica</strong> (introdução) troca <strong>ânions</strong> (íons negativos) — por exemplo <strong>nitrato, sulfato, cloreto</strong> — geralmente por cloreto ou hidroxila. É a base de tecnologias como a <strong>resina seletiva de nitrato</strong> e de processos de desmineralização. Aparece quando o problema não é dureza, e sim ânions (ver o módulo de nitrato/nitrito/amônia).' },
    { tipo: 'tabela',
      head: ['', 'Resina catiônica', 'Resina aniônica'],
      rows: [
        ['Troca', 'Cátions (+): Ca²⁺, Mg²⁺…', 'Ânions (−): nitrato, sulfato, cloreto…'],
        ['Uso típico', 'Abrandamento (remover dureza)', 'Nitrato / desmineralização'],
        ['Regeneração', 'Salmoura (NaCl)', 'Depende do tipo (ex.: salmoura/soda)'],
        ['Quando pensar nela', 'Água dura / incrustação', 'Ânion fora do padrão (ex.: nitrato)'],
      ]
    },
    { tipo: 'pendente', html: 'Detalhes de resina aniônica (tipo, capacidade, regenerante, aplicação em nitrato) → tecnicamente sensíveis: confirmar com o especialista e com a base técnica da TDF antes de propor.' },

    { tipo: 'dodont',
      fazer: [
        'Separar os dois eixos: "é potável?" (saúde) e "incrusta / incomoda?" (dureza/conforto).',
        'Escolher a família certa pelo OBJETIVO: remover dureza (abrandador) vs reduzir crosta sem sal (Scale Stop/HyperScale).',
        'Puxar o VMP oficial do arquivo de configuração (Portaria 888), não da memória.',
      ],
      evitar: [
        'Dizer que anti-incrustante "remove a dureza" ou "deixa a água mole".',
        'Cravar o valor-limite de dureza de cabeça.',
        'Descrever o Ion Guard por suposição — confirmar com a TDF.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Um cliente tem ~140 mg/L de dureza, abaixo do limite de potabilidade, mas reclama de crosta e mancha. O que dizer?',
      opcoes: [
        'Como é potável, não precisa de nada.',
        'A dureza é um parâmetro de conforto/aceitação: mesmo dentro da potabilidade ela pode incrustar e incomodar — e existe solução para isso.',
        'Só osmose reversa resolve.',
      ],
      correta: 1,
      explicacao: 'Potabilidade responde risco à saúde; dureza é organoléptica/de aceitação. Estar no limite não elimina incrustação — e há solução (abrandador ou anti-incrustante), conforme o objetivo.'
    },
    {
      pergunta: 'Qual a diferença central entre abrandador e Scale Stop/HyperScale?',
      opcoes: [
        'Nenhuma, são a mesma coisa.',
        'O abrandador REMOVE a dureza (troca por sódio, usa sal); o Scale Stop/HyperScale NÃO remove — só reduz a formação de crosta, sem sal.',
        'O Scale Stop remove mais dureza que o abrandador.',
      ],
      correta: 1,
      explicacao: 'Abrandador = remoção real de dureza via resina catiônica regenerada com sal. Anti-incrustante (TAC) = mantém os minerais mas evita que a crosta se forme.'
    },
    {
      pergunta: 'A resina catiônica do abrandador troca o cálcio e o magnésio por qual íon, e é regenerada com o quê?',
      opcoes: [
        'Por cloreto; regenerada com soda.',
        'Por sódio; regenerada com salmoura (sal).',
        'Por nitrato; regenerada com carvão.',
      ],
      correta: 1,
      explicacao: 'A catiônica troca Ca²⁺/Mg²⁺ por Na⁺ (sódio) e regenera com salmoura (NaCl). A troca de ânions (nitrato etc.) é papel da resina aniônica.'
    },
  ],

  exercicio: {
    enunciado: 'Explique, para um cliente com água potável mas com muita incrustação, por que ainda vale tratar — e ajude-o a escolher entre abrandador e anti-incrustante sem sal, listando 1 pergunta que define a escolha.',
    dica: 'Pergunta-chave: "seu objetivo é deixar a água mole de verdade (aquecimento/processo) ou só parar a crosta sem usar sal?" — e sempre confirmar vazão/espaço.'
  },

  resumo: 'Na Portaria 888/2021 a dureza é organoléptica/de aceitação — potável não quer dizer sem incrustação (o caso dos ~140 mg/L). Há dois caminhos: REMOVER a dureza (abrandador com resina catiônica regenerada com sal, troca Ca/Mg por sódio) ou REDUZIR a crosta sem remover (Scale Stop / HyperScale, sem sal). Anti-incrustante nunca "remove dureza". Resina catiônica troca cátions (dureza→sódio); resina aniônica troca ânions (ex.: nitrato). Ion Guard e valores/dimensionamentos ficam pendentes de confirmação técnica com a TDF.'
};
