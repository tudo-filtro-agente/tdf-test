// Módulo — HyperScaleX: ficha técnica e dimensionamento (dados OFICIAIS da TDF).
// Mídia anti-incrustante salt-free (TAC/DAC). Comunicação segura obrigatória:
// NUNCA "remove cálcio / zera dureza / água mole igual abrandador".
module.exports = {
  resumoCurto: 'A mídia por trás do Scale Stop: HyperScaleX (anti-incrustante sem sal, TAC/DAC). Reduz a aderência do calcário, protege boiler e tubulação — sem remover dureza. Limites, dimensionamento por vazão e conversão oficiais.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-hyperscalex-video' },
  blocos: [
    { tipo: 'titulo', texto: '1. O que é' },
    { tipo: 'texto', html: 'O <strong>HyperScaleX</strong> é uma <strong>mídia anti-incrustante salt-free</strong> (sem sal), baseada em tecnologia <strong>TAC/DAC</strong>. Ela <strong>condiciona os minerais da água</strong> para reduzir a formação de incrustação em tubulações, boilers, chuveiros, máquinas e sistemas hidráulicos.' },

    { tipo: 'titulo', texto: '2. Como funciona' },
    { tipo: 'texto', html: 'Em vez de <strong>remover</strong> o cálcio (como faz o abrandador com sal), o HyperScaleX <strong>condiciona</strong> os minerais: transforma o cálcio em micro-cristais estáveis que <strong>não aderem</strong> às superfícies. Resultado: menos crosta se formando — com os <strong>minerais preservados</strong> na água. Sem sal, sem regeneração, sem descarte.' },

    { tipo: 'callout', variante: 'perigo', titulo: '4. O que NÃO faz (trava de comunicação)',
      html: 'O HyperScaleX <strong>NÃO remove dureza</strong>, <strong>NÃO zera o cálcio</strong>, <strong>NÃO deixa a água mole</strong> como abrandador e <strong>NÃO substitui o abrandador com sal em casos extremos</strong>. Ele é um <strong>condicionador anti-incrustante</strong>. Nunca prometa "remover cálcio", "zerar dureza" ou "água mole".' },

    { tipo: 'titulo', texto: '3 & 5. Para que serve / aplicações ideais' },
    { tipo: 'cards', itens: [
      { icon: '🚿', titulo: 'Onde protege', html: 'Tubulações, boilers, chuveiros, máquinas (lava-louças/roupas), aquecedores e sistemas hidráulicos.' },
      { icon: '🏠', titulo: 'Residencial', html: 'Casas com água dura que sofrem com incrustação/mancha e não querem sal nem descarte.' },
      { icon: '🏢', titulo: 'Comercial / industrial', html: 'Onde a incrustação ataca equipamento e não se quer a operação de um abrandador (sal, regeneração, dreno).' },
    ]},

    { tipo: 'titulo', texto: '6. Limites técnicos (respeite sempre)' },
    { tipo: 'tabela', head: ['Parâmetro', 'Limite do HyperScaleX', 'Se acima…'], rows: [
      ['Ferro', '<strong>máx 0,3 ppm</strong>', 'Precisa de <strong>remoção de ferro ANTES</strong> (ex.: Iron Free)'],
      ['Manganês', '<strong>máx 0,05 ppm</strong>', 'Precisa de <strong>remoção de manganês ANTES</strong>'],
    ]},
    { tipo: 'callout', variante: 'alerta', titulo: 'Regra de ouro do dimensionamento',
      html: 'Água com <strong>ferro/manganês acima do limite</strong> deve passar <strong>primeiro</strong> por remoção de ferro/manganês. Colocar HyperScaleX em água ferruginosa = a mídia satura/incrusta e o sistema não entrega. Sempre confirme na <strong>análise</strong> antes.' },

    { tipo: 'titulo', texto: '7. Dimensionamento padrão (por vazão)' },
    { tipo: 'tabela', head: ['Vazão', 'Litros de mídia'], rows: [
      ['500 L/h', '1,5 L'], ['1000 L/h', '3 L'], ['1500 L/h', '5 L'], ['2000 L/h', '6 L'],
      ['2500 L/h', '8 L'], ['3000 L/h', '9 L'], ['3500 L/h', '10 L'], ['4000 L/h', '13 L'],
      ['4500 L/h', '14 L'], ['5500 L/h', '17 L'], ['8000 L/h', '25 L'],
    ]},
    { tipo: 'texto', html: 'Dimensiona-se pela <strong>vazão</strong> que passa pela mídia. Confirme a vazão de serviço/pico do ponto de instalação antes de fechar o litro de mídia.' },

    { tipo: 'titulo', texto: '8. Conversões úteis' },
    { tipo: 'cards', itens: [
      { icon: '⚖️', titulo: 'Litros ↔ kg da mídia', html: '<strong>1 litro ≈ 770 g</strong> de HyperScaleX. Ex.: 9 L ≈ 6,93 kg; 25 L ≈ 19,25 kg.' },
      { icon: '💧', titulo: 'Vazão', html: 'm³/h ↔ L/h: <strong>1 m³/h = 1.000 L/h</strong> (ex.: 2 m³/h = 2.000 L/h → 6 L de mídia).' },
    ]},

    { tipo: 'titulo', texto: '9. Argumentos comerciais' },
    { tipo: 'cards', itens: [
      { icon: '🧂', titulo: 'Sem sal', html: 'Não usa sal nem gera água mole — nada de comprar/repor sal.' },
      { icon: '♻️', titulo: 'Sem regeneração/descarte', html: 'Não regenera e não joga água fora (diferente do abrandador). Ecológico e prático.' },
      { icon: '🛠️', titulo: 'Baixa manutenção / longa vida', html: 'Manutenção baixa e vida útil longa da mídia.' },
      { icon: '💎', titulo: 'Preserva os minerais', html: 'Reduz a incrustação mantendo os minerais naturais da água.' },
    ]},

    { tipo: 'titulo', texto: '10. Objeções comuns' },
    { tipo: 'script', contexto: '"Isso deixa a água mole como abrandador?"',
      fala: 'Não — e essa é a diferença importante. O HyperScaleX não remove a dureza nem deixa a água mole: ele condiciona os minerais para o calcário não grudar, reduzindo a incrustação no boiler e na tubulação, sem usar sal e sem desperdiçar água. Se o seu caso exige água mole de verdade, aí a conversa é o abrandador.' },
    { tipo: 'script', contexto: '"Abrandador não é melhor?"',
      fala: 'Depende do objetivo. Abrandador remove a dureza (água mole), mas usa sal, regenera e descarta água. O HyperScaleX protege contra incrustação sem sal, sem descarte e com baixa manutenção. Para proteger boiler e tubulação sem essa operação toda, ele costuma ser a melhor relação de custo/praticidade.' },
    { tipo: 'script', contexto: '"E se minha água tiver ferro?"',
      fala: 'Ótima pergunta. O HyperScaleX trabalha com ferro até 0,3 ppm e manganês até 0,05 ppm. Se a sua análise mostrar mais que isso, a gente coloca uma etapa de remoção de ferro antes — senão o sistema não entrega. Por isso eu peço a análise da água.' },

    { tipo: 'titulo', texto: '11. Erros comuns (evite)' },
    { tipo: 'dodont',
      fazer: [
        'Confirmar ferro/manganês na análise (limites 0,3 / 0,05 ppm) antes de indicar.',
        'Dimensionar pela vazão (tabela oficial) e confirmar a vazão do ponto.',
        'Falar em "redução da incrustação / proteção hidráulica", não em "água mole".',
      ],
      evitar: [
        'Prometer "remover cálcio", "zerar dureza" ou "água mole igual abrandador".',
        'Instalar em água com ferro alto sem pré-tratamento (a mídia satura).',
        'Chutar litro de mídia sem confirmar a vazão.',
      ]
    },

    { tipo: 'especialista', nome: 'mídias filtrantes',
      html: 'Para o cliente leigo: "O HyperScaleX faz o calcário não grudar nos canos e no boiler, sem usar sal e sem desperdiçar água — protege a parte hidráulica da casa. Ele não deixa a água mole; para isso existe o abrandador." Para o instalador: dimensione pela vazão (tabela), respeite Fe ≤ 0,3 / Mn ≤ 0,05 ppm (pré-tratar acima disso), 1 L ≈ 770 g.' },
  ],
  perguntasRapidas: [
    { pergunta: 'O que o HyperScaleX faz com a dureza?', opcoes: ['Remove a dureza e deixa a água mole.', 'NÃO remove — condiciona os minerais para o calcário não aderir (reduz incrustação).', 'Zera o cálcio.'], correta: 1, explicacao: 'É condicionador anti-incrustante (TAC/DAC): reduz a aderência do calcário sem remover dureza. Nunca prometer água mole.' },
    { pergunta: 'Qual o limite de ferro para usar HyperScaleX?', opcoes: ['Sem limite.', 'Máx 0,3 ppm (acima disso, remover ferro antes).', '3 ppm.'], correta: 1, explicacao: 'Ferro máx 0,3 ppm e manganês máx 0,05 ppm. Acima disso, precisa de remoção de ferro/manganês antes.' },
    { pergunta: 'Para uma vazão de 2.000 L/h, quantos litros de mídia (tabela oficial)?', opcoes: ['3 L.', '6 L.', '25 L.'], correta: 1, explicacao: '2.000 L/h = 6 L de mídia pela tabela de dimensionamento padrão. Sempre confirmar a vazão do ponto.' },
  ],
  exercicio: { enunciado: 'Um cliente tem água dura com ferro de 0,8 ppm e vazão de ~3.000 L/h. O que você faz antes de indicar HyperScaleX, quantos litros de mídia a tabela indica, e como comunica o benefício sem prometer água mole?', dica: 'Ferro 0,8 > 0,3 → remover ferro ANTES (Iron Free). Vazão 3.000 L/h → 9 L de mídia. Comunicar "redução da incrustação / proteção do boiler e tubulação", nunca "água mole".' },
  resumo: 'HyperScaleX é a mídia anti-incrustante sem sal (TAC/DAC) do Scale Stop: condiciona os minerais para reduzir incrustação em boiler/tubulação/máquinas, sem sal, sem regeneração e sem descarte, preservando os minerais. NÃO remove dureza nem deixa a água mole (não é abrandador). Limites: ferro ≤ 0,3 ppm e manganês ≤ 0,05 ppm (pré-tratar acima). Dimensiona pela vazão (tabela: 500 L/h→1,5 L … 8000 L/h→25 L) e 1 L ≈ 770 g. Comunicação segura: "redução da incrustação / proteção hidráulica", nunca "remove cálcio / zera dureza / água mole".'
};
