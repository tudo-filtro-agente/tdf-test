// ============================================================================
// MÓDULO 2 — Anatomia do bebedouro industrial
// ----------------------------------------------------------------------------
// A ilustração interativa clicável (hotspots de cada componente) é embutida
// automaticamente pelo sistema a partir de anatomia.js. Este conteúdo COMPLEMENTA
// essa ilustração: introduz o equipamento e reforça o discurso de venda.
// Schema idêntico ao mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: 'Conhecer o equipamento por dentro — estrutura, refrigeração, filtragem e ligação — para vender com segurança e sem prometer o que não pode.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-02-anatomia-video' },

  blocos: [
    { tipo: 'texto', html: 'Você não precisa ser técnico de refrigeração para vender bem — mas precisa <strong>conhecer o equipamento por dentro</strong>. Quando o cliente sente que está falando com alguém que entende do produto, a conversa muda: ele confia na recomendação e para de negociar só por preço.' },
    { tipo: 'texto', html: 'Use a ilustração interativa acima: clique em cada componente para ver o que é, para que serve e <strong>como explicar</strong> para o cliente. Este texto amarra tudo em uma visão de conjunto.' },

    { tipo: 'titulo', texto: 'O bebedouro em uma frase' },
    { tipo: 'texto', html: 'É um equipamento <strong>todo em inox</strong> que liga direto na rede de água, <strong>filtra</strong> (refil) e <strong>gela</strong> (compressor + serpentina) a água, mantendo volume disponível para uso intenso. Duas funções distintas convivem no mesmo gabinete: <strong>filtragem</strong> e <strong>refrigeração</strong> — não confunda uma com a outra.' },

    { tipo: 'titulo', texto: 'Os componentes que você precisa saber explicar' },
    { tipo: 'cards', itens: [
      { icon: '🪞', titulo: 'Estrutura em inox', html: 'Carcaça e corpo em aço inox: sustentação, higiene e resistência à corrosão em ambiente de uso pesado.' },
      { icon: '🛢️', titulo: 'Reservatório atóxico', html: 'Polietileno rotomoldado atóxico onde a água fica armazenada e gelada. Volume dimensionado para a demanda.' },
      { icon: '⚙️', titulo: 'Compressor', html: 'O motor da refrigeração. Gela a água e recupera a temperatura após o consumo. 15/25/60 L usam 1/10; 100/200 L usam 1/5.' },
      { icon: '🌀', titulo: 'Ventoinha', html: 'Ventilador que dissipa o calor gerado pela refrigeração, ajudando o compressor a trabalhar melhor.' },
      { icon: '🌡️', titulo: 'Serpentina inox 304', html: 'Serpentina interna em aço inox 304 por onde a água é resfriada — padrão sanitário de qualidade alimentar.' },
      { icon: '🎚️', titulo: 'Termostato regulável', html: 'Controle que ajusta o quão gelada a água sai, conforme a preferência e a estação.' },
      { icon: '🦶', titulo: 'Pés reguláveis', html: 'Nivelam o equipamento em piso irregular de obra ou indústria e deixam a instalação firme.' },
      { icon: '🚰', titulo: 'Torneiras metálicas', html: 'Ponto de saída da água. Metal resiste a dezenas ou centenas de usos por dia — menos quebra que plástico.' },
      { icon: '💧', titulo: 'Refil Acquabios Multi', html: 'Elemento filtrante responsável pela filtragem (diferente da refrigeração). O 1º refil acompanha como brinde.' },
      { icon: '🔌', titulo: 'Entrada de água / ligação', html: 'Conexão de água da rede + ligação elétrica. Por isso confirmamos voltagem e ponto hidráulico.' },
    ]},

    { tipo: 'callout', variante: 'alerta', titulo: 'Nunca bloquear a ventilação do equipamento',
      html: 'A ventoinha precisa <strong>dissipar o calor</strong> da refrigeração. Se o bebedouro fica encostado na parede, prensado em um canto sem circulação ou com a traseira obstruída, o compressor trabalha demais, <strong>perde desempenho</strong> e demora a recuperar a temperatura no pico. Oriente o cliente a deixar espaço livre ao redor e ventilação para o ambiente.' },

    { tipo: 'titulo', texto: 'Filtragem × refrigeração: não misture os dois' },
    { tipo: 'texto', html: 'O <strong>refil cuida da filtragem</strong> da água. O <strong>compressor e a serpentina cuidam da refrigeração</strong>. São sistemas diferentes: um não substitui nem compensa o outro. Trocar o refil não deixa a água mais gelada; regular o termostato não melhora a filtragem. Ter clareza nisso evita promessas erradas.' },

    { tipo: 'dodont',
      fazer: [
        'Explicar cada componente com a linguagem do cliente (uso intenso, recuperação, ventilação).',
        'Reforçar que estrutura, torneiras e serpentina são feitas para uso pesado.',
        'Confirmar voltagem e ponto hidráulico antes de fechar (110/220 e água na rede).',
      ],
      evitar: [
        'Prometer potabilidade da água.',
        'Prometer percentual de economia de energia sem laudo.',
        'Afirmar grau/normas de inox, temperatura exata em graus ou nível de ruído sem confirmação.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente pergunta: "trocar o refil deixa a água mais gelada?"',
      opcoes: [
        'Sim, o refil ajuda a gelar mais rápido.',
        'Não. O refil cuida da filtragem; quem gela é o compressor com a serpentina. São sistemas diferentes.',
        'Depende do modelo do refil.',
      ],
      correta: 1,
      explicacao: 'Filtragem e refrigeração são funções separadas. O refil filtra; o compressor e a serpentina refrigeram.'
    },
    {
      pergunta: 'Por que orientamos o cliente a não encostar o bebedouro na parede?',
      opcoes: [
        'Só por estética.',
        'Para a ventoinha dissipar o calor — sem ventilação o compressor trabalha demais e perde desempenho.',
        'Porque a garantia exige 1 metro de distância.',
      ],
      correta: 1,
      explicacao: 'A ventoinha precisa de circulação de ar para dissipar calor. Bloquear a ventilação prejudica a recuperação da temperatura.'
    },
  ],

  exercicio: {
    enunciado: 'Escolha três componentes e escreva, em uma frase cada, como você os explicaria a um gerente de fábrica que nunca comprou bebedouro. Use benefício, não jargão técnico.',
    dica: 'Ex.: "A serpentina é em inox 304, o mesmo padrão de equipamentos de qualidade alimentar." Foque no que aquilo entrega para ele.'
  },

  resumo: 'O bebedouro é um equipamento todo em inox que liga na rede, filtra (refil) e gela (compressor + serpentina) a água. Filtragem e refrigeração são funções distintas. A ventoinha precisa de ventilação livre para dissipar calor. Conhecer cada componente gera confiança — sem prometer potabilidade, economia sem laudo ou specs não confirmadas.'
};
