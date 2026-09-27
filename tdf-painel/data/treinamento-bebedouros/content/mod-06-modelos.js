// ============================================================================
// MÓDULO 6 — Conhecimento dos modelos
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// OBS: o comparador (tabela de modelos + calculadora de dimensionamento) é
// embutido AUTOMATICAMENTE pela view. Este módulo NÃO cria bloco 'componente'
// nem repete a tabela — foca em COMO diferenciar e recomendar cada modelo.
// Fatos: data/treinamento-bebedouros/produtos.js e precos.js.
// ============================================================================

module.exports = {
  resumoCurto: 'Como diferenciar os cinco modelos (15, 25, 60, 100 e 200 litros) por perfil de cliente, compressor e pico de consumo — e o que perguntar antes de recomendar.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-06-video' },

  blocos: [
    { tipo: 'texto', html: 'A linha industrial da Tudo de Filtro tem <strong>cinco modelos</strong>: 15, 25, 60, 100 e 200 litros. Conhecer os cinco de cor é o que separa um vendedor que <em>chuta</em> de um consultor que <strong>dimensiona</strong>. Todos compartilham a mesma base construtiva — inox, serpentina em aço inox 304, reservatório em polietileno rotomoldado atóxico, termostato regulável e pés reguláveis. O que muda de um para o outro é a <strong>capacidade de atender o pico</strong> e a <strong>potência do compressor</strong>.' },

    { tipo: 'titulo', texto: 'Como diferenciar os cinco modelos' },
    { tipo: 'texto', html: 'Não decore só o número de litros. Decore a <strong>faixa de pessoas/hora</strong> e o <strong>compressor</strong> de cada um, porque é isso que sustenta a recomendação diante do cliente. O litro é o rótulo; o que entrega água gelada no momento crítico é a combinação de reservatório com a força do compressor para <strong>recuperar a temperatura</strong>.' },

    { tipo: 'callout', variante: 'info', titulo: 'Os dois grupos de compressor',
      html: 'Os modelos <strong>15, 25 e 60 litros</strong> usam compressor <strong>1/10</strong>. Os modelos <strong>100 e 200 litros</strong> sobem para compressor <strong>1/5</strong> — mais força para recuperar a temperatura sob demanda alta e contínua. Quando o cliente tem pico pesado, o salto de 60 para 100 não é só "mais litros": é <strong>outro patamar de recuperação</strong>.' },

    { tipo: 'titulo', texto: 'Os cinco modelos, um a um' },
    { tipo: 'cards', itens: [
      { icon: '💧', titulo: '15 litros — até 25 pessoas/hora',
        html: '<strong>Compressor 1/10.</strong> <strong>Perfil:</strong> escritórios pequenos, consultórios, lojas, salas comerciais e equipes enxutas. <strong>Quando indicar:</strong> ponto único de baixo volume, poucos usuários no pico. <strong>Risco de subdimensionar:</strong> baixo volume — em pico de empresa média já trabalha no limite. Se houver crescimento previsto, registre o risco antes de fechar no menor modelo.' },
      { icon: '💧', titulo: '25 litros — até 40 pessoas/hora',
        html: '<strong>Compressor 1/10.</strong> <strong>Perfil:</strong> empresas pequenas, clínicas, academias de bairro e escolas pequenas. <strong>Quando indicar:</strong> uso distribuído ao longo do dia, sem todo mundo no mesmo horário. <strong>Risco de subdimensionar:</strong> se o consumo for concentrado no pico, pode não recuperar a temperatura a tempo — sempre cheque a simultaneidade antes de confirmar.' },
      { icon: '💧', titulo: '60 litros — 70 a 150 pessoas/hora',
        html: '<strong>Compressor 1/10.</strong> <strong>Perfil:</strong> empresas médias, academias, escolas, restaurantes, padarias e igrejas. <strong>Quando indicar:</strong> volume médio com pico moderado, um ou dois pontos de água. <strong>Risco de subdimensionar:</strong> a faixa é larga (70 a 150). Perto de 150 no pico, já pede avaliação de simultaneidade e de pontos de água — não empurre o topo da faixa sem checar.' },
      { icon: '💧', titulo: '100 litros — 150 a 300 pessoas/hora',
        html: '<strong>Compressor 1/5.</strong> <strong>Perfil:</strong> indústrias, galpões, centros logísticos, escolas grandes e obras médias. <strong>Quando indicar:</strong> alta demanda com intervalos concentrados. <strong>Risco de subdimensionar:</strong> o compressor 1/5 dá recuperação melhor no pico — não desça de modelo só por preço sem registrar o risco na proposta.' },
      { icon: '💧', titulo: '200 litros — 300 a 350 pessoas/hora',
        html: '<strong>Compressor 1/5.</strong> <strong>Perfil:</strong> grandes indústrias, grandes obras, centros logísticos, eventos e órgãos públicos. <strong>Quando indicar:</strong> efetivo alto e pico intenso. <strong>Risco de subdimensionar:</strong> é o topo da linha. Se a demanda passa disso, avalie <strong>mais de uma unidade</strong> e mais pontos de água — não force um único equipamento além do que ele foi feito para entregar.' },
    ]},

    { tipo: 'callout', variante: 'alerta', titulo: 'Dimensões: pendentes de validação técnica',
      html: 'As medidas publicadas no site têm <strong>inconsistência de unidade</strong> em vários modelos (alturas que aparecem em "cm" mas sugerem metros, e no 200 L uma medida fisicamente incoerente). Trate toda dimensão como <strong>pendente de validação técnica</strong>. Nunca "corrija" a medida por conta própria diante do cliente nem prometa encaixe exato em um vão — confirme com a fábrica antes. Diferencie os modelos por <strong>pessoas/hora e compressor</strong>, não por centímetros.' },

    { tipo: 'callout', variante: 'sucesso', titulo: 'Refil que já vai junto',
      html: 'Todos os modelos usam o refil <strong>Acquabios Multi</strong>, e o <strong>1º refil acompanha o bebedouro como brinde</strong>. É um gancho natural de valor na hora de recomendar o modelo — mas o dimensionamento vem sempre antes do argumento de refil.' },

    { tipo: 'perguntas', titulo: 'O que perguntar antes de recomendar um modelo',
      itens: [
        'Quantas pessoas usam no horário de maior movimento (o pico), não só o total?',
        'O consumo é concentrado (todo mundo junto no intervalo) ou distribuído ao longo do dia?',
        'Há turnos? Quantas pessoas por turno?',
        'É um ponto único de água ou vários pontos no ambiente?',
        'Qual a voltagem do local (110 ou 220)?',
        'O ambiente é quente / sem ventilação, o que exige mais do compressor?',
        'Há previsão de crescimento que justifique subir um modelo agora?',
      ]
    },

    { tipo: 'dodont',
      fazer: [
        'Recomendar pelo pico de consumo simultâneo e pela recuperação de temperatura.',
        'Explicar o salto de compressor 1/10 para 1/5 quando a demanda é alta.',
        'Registrar o risco na proposta quando o cliente insistir em descer de modelo por preço.',
        'Sugerir mais de uma unidade quando a demanda ultrapassa o topo da linha.',
      ],
      evitar: [
        'Recomendar modelo só pelo total de pessoas da empresa.',
        'Tratar os litros do reservatório como limite diário de água.',
        'Corrigir ou afirmar as dimensões como definitivas antes da validação técnica.',
        'Prometer potabilidade ou percentual de economia de energia.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual a diferença de compressor entre a base da linha e os modelos maiores?',
      opcoes: [
        'Todos usam o mesmo compressor 1/10.',
        '15, 25 e 60 usam 1/10; 100 e 200 usam 1/5.',
        '15 e 25 usam 1/5; os demais usam 1/10.',
      ],
      correta: 1,
      explicacao: 'Os modelos 15, 25 e 60 litros têm compressor 1/10. O 100 e o 200 litros sobem para 1/5, com recuperação de temperatura melhor sob demanda alta.'
    },
    {
      pergunta: 'Um cliente com pico próximo de 150 pessoas/hora pergunta se o 60 litros resolve. Melhor conduta?',
      opcoes: [
        'Fechar no 60 litros, já que 150 está dentro da faixa.',
        'Checar simultaneidade e pontos de água; perto do topo da faixa pode pedir o 100 litros.',
        'Ir direto para o 200 litros para não errar.',
      ],
      correta: 1,
      explicacao: 'A faixa do 60 litros vai até 150, mas o topo da faixa exige avaliar simultaneidade e pontos de água. Perto do limite, o 100 litros (compressor 1/5) dá mais folga de recuperação.'
    },
    {
      pergunta: 'O cliente pede para confirmar a altura exata do 200 litros para um vão apertado. O que fazer?',
      opcoes: [
        'Informar a medida do site como definitiva.',
        'Explicar que a dimensão está pendente de validação técnica e confirmar com a fábrica antes.',
        'Corrigir a medida na hora para o que parecer mais lógico.',
      ],
      correta: 1,
      explicacao: 'As dimensões do site têm inconsistência de unidade. Nunca afirme como definitivo nem corrija por conta própria — sinalize pendência e valide com a fábrica.'
    },
  ],

  exercicio: {
    enunciado: 'Uma indústria com 240 funcionários faz o intervalo do almoço todos no mesmo horário, em um galpão quente. Explique qual modelo você investigaria, por que o compressor importa aqui e quais três perguntas você faria antes de confirmar.',
    dica: 'Pense em pico simultâneo (não no total de 240), no salto de compressor 1/10 para 1/5 e na possibilidade de mais de um ponto de água.'
  },

  resumo: 'A linha tem cinco modelos (15, 25, 60, 100 e 200 L) com a mesma base construtiva. Diferencie-os por faixa de pessoas/hora e compressor: 15/25/60 usam 1/10 e 100/200 usam 1/5. Recomende pelo pico de consumo simultâneo e pela recuperação de temperatura, nunca só pelo total de pessoas. As dimensões do site são pendentes de validação técnica — não corrigir. O 1º refil Acquabios Multi já acompanha o bebedouro.'
};
