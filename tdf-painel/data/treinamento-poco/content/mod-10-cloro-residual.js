// ============================================================================
// MÓDULO 10 — Por que manter cloro residual  (academia de Poço — CONTRATO DE SCHEMA)
// REGRA: NÃO inventar valores de residual-alvo nem prescrever dosagem. Onde
//   precisa de número, usar bloco `pendente`. O residual é MEDIDO, não presumido.
// ============================================================================

module.exports = {
  resumoCurto: 'O cloro desinfeta e parte dele é consumida ao reagir com a água; o residual é o que sobra para proteger contra recontaminação na reservação e distribuição — e ele precisa ser MEDIDO, não presumido.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-10-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'Residual é medida, não palpite',
      html: 'Manter cloro residual é o que protege a água <strong>depois</strong> do tratamento. Mas o valor certo <strong>não se adivinha</strong>: ele é medido. Nunca prescreva uma dose ou um residual "de cabeça" — isso é cálculo e validação técnica, com base em análise.' },

    { tipo: 'titulo', texto: 'O que acontece com o cloro na água' },
    { tipo: 'texto', html: 'Quando o cloro é aplicado, ele <strong>desinfeta</strong> — age contra microrganismos. Nesse processo, <strong>parte do cloro é consumida</strong> ao reagir com substâncias presentes na água (matéria orgânica, alguns minerais etc.). O que resta depois desse consumo é o <strong>cloro residual</strong>.' },
    { tipo: 'cards', itens: [
      { icon: '🧫', titulo: 'Desinfeta', html: 'O cloro age contra microrganismos na água.' },
      { icon: '🔥', titulo: 'É consumido', html: 'Parte reage com substâncias da água (a "demanda de cloro") e some.' },
      { icon: '🛡️', titulo: 'Sobra o residual', html: 'O que resta segue protegendo a água ao longo da reservação e distribuição.' },
      { icon: '📟', titulo: 'É medido', html: 'O residual real só se conhece medindo — não por estimativa.' },
    ]},

    { tipo: 'titulo', texto: 'Para que serve o residual' },
    { tipo: 'texto', html: 'A água tratada não vai direto para a boca: ela passa por <strong>reservatórios e tubulações</strong> até o ponto de uso. Nesse caminho pode haver oportunidade de <strong>recontaminação</strong>. O cloro residual é a "proteção que viaja junto" — mantém uma barreira ao longo da rede, entre o tratamento e a torneira.' },
    { tipo: 'callout', variante: 'info', titulo: 'Por isso desinfetar uma vez pode não bastar',
      html: 'Desinfecção pontual sem proteção residual deixa a rede vulnerável depois do tratamento. O residual é justamente o que segura essa proteção ao longo da reservação e distribuição.' },

    { tipo: 'titulo', texto: 'Nem de menos, nem de mais' },
    { tipo: 'texto', html: 'O residual precisa ficar numa faixa adequada — e os dois extremos trazem problema:' },
    { tipo: 'tabela',
      head: ['Situação', 'Consequência'],
      rows: [
        ['Residual insuficiente', 'Sistema fica sem proteção; a água pode recontaminar na rede/reservação.'],
        ['Residual em excesso', 'Dependendo da água, pode gerar gosto/odor e subprodutos indesejados.'],
        ['Residual medido e mantido na faixa', 'Proteção ao longo da rede sem exageros — situação buscada.'],
      ]
    },
    { tipo: 'callout', variante: 'alerta', titulo: 'Excesso não é "mais seguro"',
      html: 'Passar cloro "para garantir" não é boa prática: dependendo das características da água, o excesso pode causar <strong>gosto e odor</strong> e favorecer <strong>subprodutos</strong>. Por isso o residual é ajustado por medição — não por "quanto mais, melhor".' },

    { tipo: 'titulo', texto: 'Medir, não presumir' },
    { tipo: 'texto', html: 'O ponto central deste módulo: o cloro residual <strong>é um valor medido</strong>, ao longo do tempo e nos pontos certos da rede. Presumir que "está ok porque coloquei cloro" é justamente o erro que deixa o sistema desprotegido — ou com excesso. Medição é o que fecha o controle.' },
    { tipo: 'especialista', nome: 'controle de cloro', icon: '🧑‍🔬',
      html: 'Regra de ouro: o residual você mede, não chuta. Eu calculo a dose e o alvo com base no laudo e na demanda de cloro daquela água; o campo confirma medindo. Se veio pouco, sem proteção; se veio muito, risco de gosto/odor e subproduto. O número certo é o que a medição sustenta — não o que a gente "acha".' },
    { tipo: 'pendente', html: 'Valores de <strong>cloro residual alvo</strong> (faixa a manter) e a <strong>dosagem</strong> correspondente dependem das características da água (demanda de cloro), da vazão, do tempo de contato e de validação técnica. Não informar números de cabeça — encaminhar ao especialista e confirmar por medição/análise.' },

    { tipo: 'dodont',
      fazer: [
        'Explicar que o cloro desinfeta e parte é consumida (demanda de cloro).',
        'Posicionar o residual como proteção contra recontaminação na rede.',
        'Reforçar que o residual é medido ao longo do tempo, não presumido.',
        'Encaminhar dose e faixa de residual ao especialista.',
      ],
      evitar: [
        'Prescrever dosagem sem cálculo e validação técnica.',
        'Dizer que "quanto mais cloro, mais seguro".',
        'Afirmar que "está protegido" só porque aplicou cloro, sem medir.',
        'Passar um valor de residual alvo de cabeça.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Por que se busca manter cloro residual na água tratada?',
      opcoes: [
        'Para deixar gosto de cloro e o cliente perceber que tratou.',
        'Porque o residual protege contra recontaminação ao longo da reservação e distribuição, depois do tratamento.',
        'Porque o residual substitui a análise laboratorial.',
      ],
      correta: 1,
      explicacao: 'O residual é a proteção que segue com a água pela rede, reduzindo o risco de recontaminação entre o tratamento e o ponto de uso.'
    },
    {
      pergunta: 'Um cliente quer "colocar bastante cloro para garantir". Qual a orientação correta?',
      opcoes: [
        'Concordar: quanto mais cloro, mais seguro.',
        'Explicar que o excesso pode gerar gosto/odor e subprodutos dependendo da água; o residual deve ser medido e mantido na faixa adequada, não maximizado.',
        'Dizer que cloro nunca faz diferença no sabor.',
      ],
      correta: 1,
      explicacao: 'Excesso não é mais seguro: pode causar gosto/odor e subprodutos. O residual certo é o que a medição sustenta, não o máximo possível.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente pergunta "por que preciso manter cloro se já tratei a água uma vez?". Escreva, em 2–3 frases, explicando o consumo do cloro (demanda), o papel do residual como proteção na rede e por que o valor é medido — sem prescrever dose.',
    dica: 'Ancore em "parte do cloro é consumida", "o residual protege até a torneira" e "residual se mede, não se presume".'
  },

  resumo: 'O cloro desinfeta e parte dele é consumida ao reagir com substâncias da água (demanda de cloro); o que sobra é o cloro residual, que protege contra recontaminação na reservação e distribuição. Residual insuficiente deixa o sistema desprotegido; excesso pode gerar gosto, odor e subprodutos dependendo da água. Por isso o residual precisa ser MEDIDO, não presumido — e dose e faixa alvo dependem de cálculo e validação técnica, nunca de prescrição de cabeça.'
};
