// ============================================================================
// MÓDULO 5 — Refil Acquabios Multi
// ----------------------------------------------------------------------------
// Refil = FILTRAGEM (diferente de refrigeração). 1º refil é brinde.
// Troca segue orientação da empresa + condições/uso + origem da água.
// PERIGO: água de poço ou com problema aparente → NÃO afirmar que só o refil
// resolve; encaminhar avaliação técnica.
// Schema idêntico ao mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: 'O refil Acquabios Multi cuida da filtragem (não da refrigeração), o primeiro vem de brinde e a troca depende do uso e da água — com limites claros de quando encaminhar avaliação técnica.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-05-refil-video' },

  blocos: [
    { tipo: 'texto', html: 'O <strong>refil Acquabios Multi</strong> é o elemento filtrante do bebedouro. Ele é responsável pela <strong>FILTRAGEM</strong> da água — uma função <strong>diferente da refrigeração</strong>. O refil não gela nada; o compressor e a serpentina é que refrigeram. Deixe isso claro para o cliente e para você mesmo: são dois sistemas distintos no mesmo equipamento.' },

    { tipo: 'callout', variante: 'sucesso', titulo: 'O primeiro refil é brinde',
      html: 'O <strong>1º refil já acompanha o bebedouro</strong>, sem custo adicional. É um bom argumento de valor — o cliente sai com a filtragem pronta para usar.' },

    { tipo: 'titulo', texto: 'Quando trocar o refil' },
    { tipo: 'texto', html: 'Não existe prazo fixo cravado como garantia. A troca segue a <strong>orientação da empresa</strong> e depende das <strong>condições e do uso</strong> e da <strong>origem da água</strong>. Água mais "suja", uso mais intenso ou fonte de pior qualidade encurtam o ciclo. Por isso a periodicidade é <strong>orientada</strong>, não prometida em número fechado.' },
    { tipo: 'cards', itens: [
      { icon: '📋', titulo: 'Orientação da empresa', html: 'A periodicidade de troca segue a recomendação oficial da Tudo de Filtro.' },
      { icon: '💧', titulo: 'Origem da água', html: 'Rede pública, poço ou caixa d\'água mudam a exigência sobre o refil.' },
      { icon: '🔁', titulo: 'Condições e uso', html: 'Volume consumido e qualidade da água aceleram ou espaçam a troca.' },
    ]},

    { tipo: 'titulo', texto: 'Antes de falar de refil, entenda a água' },
    { tipo: 'texto', html: 'A qualidade da filtragem depende do que entra no equipamento. Faça as perguntas abaixo <strong>antes</strong> de afirmar qualquer coisa sobre o refil. Elas também protegem você de prometer o que o refil sozinho não faz.' },
    { tipo: 'perguntas', titulo: 'Perguntas obrigatórias sobre a água',
      itens: [
        'A água é da rede pública?',
        'A água vem de poço?',
        'Passa por caixa d\'água antes de chegar ao ponto?',
        'A água tem cor?',
        'A água tem cheiro?',
        'A água tem gosto diferente?',
        'Aparece sedimento (areia, sujeira, partículas)?',
        'O cliente tem alguma análise/laudo da água?',
        'Já existe outro tratamento instalado (abrandador, filtro de entrada, etc.)?',
      ]
    },

    { tipo: 'callout', variante: 'perigo', titulo: 'Água de poço ou com problema aparente: NÃO prometer que só o refil resolve',
      html: 'Se a água for de <strong>poço</strong> ou apresentar <strong>problema aparente</strong> (cor, cheiro, gosto forte, sedimento), o closer <strong>não deve afirmar que só o refil resolve</strong>. O refil faz a filtragem do bebedouro — ele não é tratamento de água de poço. Nesses casos, <strong>encaminhe para avaliação técnica</strong> antes de qualquer promessa. E nunca prometa potabilidade.' },

    { tipo: 'exemplo',
      cliente: 'A água aqui é de poço e às vezes sai meio amarelada. Esse refil resolve, né?',
      closer: 'Água de poço com essa característica pede uma avaliação técnica antes — o refil cuida da filtragem do bebedouro, mas não substitui um tratamento adequado para a fonte. Vou encaminhar para a nossa análise para te dar a orientação certa, sem prometer o que não posso garantir.' },

    { tipo: 'dodont',
      fazer: [
        'Explicar que o refil cuida da filtragem, diferente da refrigeração.',
        'Destacar que o primeiro refil é brinde.',
        'Fazer as perguntas sobre a água antes de recomendar e encaminhar avaliação técnica quando houver poço ou problema aparente.',
      ],
      evitar: [
        'Afirmar que "só o refil resolve" água de poço ou com problema aparente.',
        'Prometer potabilidade da água.',
        'Cravar prazo fixo de troca como garantia — a periodicidade é orientada e depende do uso e da água.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O refil Acquabios Multi é responsável por quê?',
      opcoes: [
        'Pela refrigeração da água.',
        'Pela filtragem da água — função diferente da refrigeração.',
        'Por regular a temperatura.',
      ],
      correta: 1,
      explicacao: 'O refil cuida da filtragem. Quem refrigera é o compressor com a serpentina. São sistemas distintos.'
    },
    {
      pergunta: 'Cliente com água de poço amarelada pergunta se o refil resolve. Melhor conduta?',
      opcoes: [
        'Afirmar que sim, o refil resolve tudo.',
        'Não afirmar que só o refil resolve; encaminhar para avaliação técnica antes de prometer.',
        'Dizer que a água já está potável.',
      ],
      correta: 1,
      explicacao: 'Água de poço ou com problema aparente exige avaliação técnica. O refil filtra o bebedouro, não trata a fonte. E nunca prometer potabilidade.'
    },
  ],

  exercicio: {
    enunciado: 'Monte seu roteiro de 3 a 4 perguntas de abertura para entender a água do cliente antes de falar de refil, e defina em que resposta você aciona a avaliação técnica.',
    dica: 'Comece por origem (rede/poço/caixa), depois sinais aparentes (cor, cheiro, gosto, sedimento). Poço ou qualquer sinal forte = encaminhar avaliação técnica.'
  },

  resumo: 'O refil Acquabios Multi cuida da filtragem, que é diferente da refrigeração. O primeiro refil é brinde. A troca segue a orientação da empresa e depende do uso e da origem da água — sem prazo fixo garantido. Sempre perguntar sobre a água (rede/poço/caixa, cor, cheiro, gosto, sedimento, análise, outro tratamento). Em água de poço ou com problema aparente, não afirmar que só o refil resolve: encaminhar avaliação técnica e nunca prometer potabilidade.'
};
