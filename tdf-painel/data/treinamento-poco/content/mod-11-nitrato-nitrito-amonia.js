// ============================================================================
// MÓDULO 11 — Nitrato, nitrito e amônia  (academia de Poço — CONTRATO DE SCHEMA)
// REGRA: NÃO inventar dimensionamento nem prometer remoção garantida. Nenhuma
//   tecnologia é "solução definitiva" aqui — tudo "a avaliar tecnicamente".
//   Onde precisa de número, usar bloco `pendente`.
// ============================================================================

module.exports = {
  resumoCurto: 'Nitrato, nitrito e amônia são formas do nitrogênio, com origens sanitárias e agrícolas. Não saem em filtro comum de sedimentos: exigem tecnologia específica, a avaliar tecnicamente pelo especialista, com nova análise.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-11-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'Nada de promessa fácil aqui',
      html: 'Nitrato, nitrito e amônia são contaminantes <strong>dissolvidos e invisíveis</strong> — sem cor, cheiro ou gosto. Não saem em filtro comum de sedimentos, carvão ou similares. Qualquer solução é <strong>a avaliar tecnicamente</strong>, com limitações e nova análise. O closer não fecha esse tema sozinho: encaminha ao especialista.' },

    { tipo: 'titulo', texto: 'O ciclo do nitrogênio, em resumo' },
    { tipo: 'texto', html: 'Nitrato (NO₃⁻), nitrito (NO₂⁻) e amônia (NH₃/NH₄⁺) são <strong>formas diferentes do nitrogênio</strong> na água. No ambiente, o nitrogênio se transforma entre essas formas (o "ciclo do nitrogênio"). Por isso eles costumam ser lidos em conjunto no laudo (todos expressos como N — ver parametros-agua.js).' },
    { tipo: 'cards', itens: [
      { icon: '🟢', titulo: 'Nitrato (NO₃⁻)', html: 'Forma mais oxidada; comum onde há contaminação por fossas ou fertilizantes.' },
      { icon: '🟡', titulo: 'Nitrito (NO₂⁻)', html: 'Forma intermediária, geralmente instável; sua presença é sinal de atenção.' },
      { icon: '🔵', titulo: 'Amônia (NH₃/NH₄⁺)', html: 'Forma reduzida; costuma indicar contaminação mais recente/próxima.' },
      { icon: '🔄', titulo: 'Mesma família', html: 'São etapas do ciclo do nitrogênio — por isso se avaliam juntos.' },
    ]},

    { tipo: 'titulo', texto: 'De onde vêm' },
    { tipo: 'texto', html: 'As origens são tipicamente <strong>sanitárias, agrícolas e ambientais</strong>, e ajudam a levantar hipóteses sobre o poço e seu entorno:' },
    { tipo: 'tabela',
      head: ['Origem', 'Exemplos'],
      rows: [
        ['Sanitária', 'Fossas, esgoto, infiltração de efluente próximo ao poço.'],
        ['Agrícola', 'Fertilizantes nitrogenados, adubação, atividade de campo no entorno.'],
        ['Ambiental / aquífero', 'Contaminação do aquífero, migração no solo, condições do entorno.'],
      ]
    },
    { tipo: 'callout', variante: 'info', titulo: 'Invisíveis — só a análise mostra',
      html: 'Como nitrato, nitrito e amônia não têm cor, cheiro nem gosto, água "cristalina" pode contê-los. Só a <strong>análise laboratorial</strong> revela — e os limites de referência (VMP) vêm da fonte oficial (parametros-agua.js), nunca de memória.' },

    { tipo: 'titulo', texto: 'Por que filtro comum não resolve' },
    { tipo: 'texto', html: 'Filtro de sedimentos retém <strong>partícula</strong>. Nitrato, nitrito e amônia estão <strong>dissolvidos</strong> na água, em nível iônico/molecular — passam direto por telas, velas e meios de retenção de sujeira. Reduzir esses compostos exige <strong>tecnologia específica</strong>, não filtragem mecânica.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'CRÍTICO — o que o closer NÃO pode prometer',
      html: 'O closer <strong>NÃO</strong> pode prometer resolver nitrato/nitrito/amônia só com <strong>carvão ativado, quartzo, zeólita comum ou ultrafiltração</strong>. Esses meios têm outras finalidades e não são garantia para esses contaminantes. Presença de nitrato/nitrito/amônia = <strong>encaminhar ao especialista</strong> para avaliação técnica. Nunca afirmar remoção garantida.' },

    { tipo: 'titulo', texto: 'Caminhos possíveis — sempre "a avaliar tecnicamente"' },
    { tipo: 'texto', html: 'Existem tecnologias que <strong>podem</strong> ser aplicadas dependendo do caso, cada uma com condições, limitações e cuidados. Nenhuma é "solução definitiva" no discurso comercial — todas passam por avaliação do especialista:' },
    { tipo: 'cards', itens: [
      { icon: '💧', titulo: 'Osmose reversa', html: 'Pode reduzir compostos dissolvidos, mas gera rejeito, exige pré-tratamento e tem limitações a avaliar.' },
      { icon: '🔩', titulo: 'Troca iônica específica', html: 'Resinas específicas (não a comum de abrandamento) podem ser aplicáveis, conforme análise e projeto.' },
      { icon: '🦠', titulo: 'Processos biológicos', html: 'Em aplicações apropriadas, processos biológicos podem ser considerados — com engenharia e monitoramento.' },
      { icon: '🧑‍🔬', titulo: 'Sempre com avaliação', html: 'A escolha depende do laudo, do objetivo e das condições do local. Nada de receita pronta.' },
    ]},
    { tipo: 'checklist', titulo: 'Toda solução para N passa por', itens: [
      'Avaliação técnica do especialista (não decisão do closer).',
      'Limitações e condições de cada tecnologia consideradas.',
      'Rejeito/efluente e seu destino (ex.: rejeito de osmose).',
      'Pré-tratamento necessário para a tecnologia funcionar.',
      'Monitoramento ao longo do tempo.',
      'NOVA análise laboratorial para verificar o resultado.',
    ]},
    { tipo: 'especialista', nome: 'nitrogênio (N)', icon: '🧑‍🔬',
      html: 'Nitrato, nitrito e amônia são meu terreno de cautela. Não existe "filtrinho" que resolve — são compostos dissolvidos, ligados a fossa, adubo e contaminação do aquífero. Dá pra atacar com osmose, troca iônica específica ou processo biológico em alguns casos, sempre pesando rejeito, pré-tratamento, limitação e monitoramento. Você me traz o laudo e o contexto; eu avalio. E fechamos com nova análise — nunca com promessa.' },
    { tipo: 'pendente', html: 'Qualquer <strong>dimensionamento</strong>, escolha de tecnologia, capacidade, rejeito esperado e configuração para nitrato/nitrito/amônia depende de análise + avaliação técnica do especialista. Não informar números nem prometer remoção garantida.' },

    { tipo: 'dodont',
      fazer: [
        'Explicar que nitrato/nitrito/amônia são formas dissolvidas do nitrogênio.',
        'Associar às origens (fossas, fertilizantes, contaminação do aquífero).',
        'Deixar claro que filtro comum de sedimentos não remove esses compostos.',
        'Encaminhar ao especialista e fechar com nova análise.',
      ],
      evitar: [
        'Prometer resolver com carvão, quartzo, zeólita comum ou ultrafiltração.',
        'Chamar qualquer tecnologia de "solução definitiva".',
        'Passar dimensionamento ou capacidade de cabeça.',
        'Afirmar remoção garantida sem avaliação e sem nova análise.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O laudo aponta nitrato acima do esperado. Um colega quer vender "um filtro de carvão que resolve". O que está errado?',
      opcoes: [
        'Nada; carvão remove nitrato tranquilamente.',
        'Nitrato é composto dissolvido: carvão, quartzo, zeólita comum e ultrafiltração NÃO são garantia. O caso deve ir ao especialista para avaliação técnica.',
        'Basta trocar por um filtro de sedimentos maior.',
      ],
      correta: 1,
      explicacao: 'Nitrato está dissolvido; meios comuns não garantem sua remoção. Presença de nitrato/nitrito/amônia exige tecnologia específica avaliada pelo especialista.'
    },
    {
      pergunta: 'Como apresentar tecnologias como osmose reversa ou troca iônica específica para nitrato?',
      opcoes: [
        'Como solução definitiva, sem ressalvas.',
        'Como caminhos "a avaliar tecnicamente", com limitações, rejeito, pré-tratamento, monitoramento e nova análise.',
        'Como desnecessárias, já que qualquer filtro resolve.',
      ],
      correta: 1,
      explicacao: 'Nenhuma tecnologia é "definitiva" no discurso comercial. Cada uma tem condições e limitações — a escolha é do especialista, com validação por nova análise.'
    },
    {
      pergunta: 'Por que nitrato, nitrito e amônia não aparecem "a olho nu" e não saem em filtro comum?',
      opcoes: [
        'Porque evaporam sozinhos com o tempo.',
        'Porque são compostos dissolvidos e invisíveis (sem cor/cheiro/gosto); filtro de sedimentos retém partícula, não íons/moléculas.',
        'Porque só existem em água colorida.',
      ],
      correta: 1,
      explicacao: 'São formas dissolvidas do nitrogênio, invisíveis, detectadas só por análise. Filtro mecânico retém partícula e não remove o que está dissolvido.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente com poço perto de área agrícola manda laudo com nitrato elevado e pede "o filtro que tira isso". Escreva, em 3–4 frases, explicando as origens (fossa/fertilizante/aquífero), por que filtro comum não resolve, e como você encaminha para avaliação técnica do especialista sem prometer remoção garantida.',
    dica: 'Ancore em "nitrogênio dissolvido, invisível", "filtro comum não remove", "tecnologia específica a avaliar" e "nada de promessa — fecha com nova análise".'
  },

  resumo: 'Nitrato, nitrito e amônia são formas do nitrogênio (ciclo do nitrogênio), com origens sanitárias (fossas), agrícolas (fertilizantes) e ambientais (contaminação do aquífero). São dissolvidos e invisíveis, detectados só por análise, e NÃO saem em filtro comum de sedimentos. Reduzir esses compostos exige tecnologia específica — osmose reversa, troca iônica específica ou processos biológicos em aplicações apropriadas — sempre "a avaliar tecnicamente", com limitações, rejeito, pré-tratamento, monitoramento e nova análise. O closer não pode prometer solução só com carvão, quartzo, zeólita comum ou ultrafiltração: encaminha ao especialista.'
};
