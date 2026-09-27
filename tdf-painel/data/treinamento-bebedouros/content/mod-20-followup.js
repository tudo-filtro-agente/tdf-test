// ============================================================================
// MÓDULO 20 — Follow-up com valor
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA do mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: 'Follow-up não é "conseguiu ver?". É retomar a conversa entregando um motivo novo para o cliente avançar — sempre com cadência e propósito.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-20-followup-video' },

  blocos: [
    { tipo: 'texto', html: 'O follow-up mais comum do mercado — <em>"e aí, conseguiu ver a proposta?"</em> — não entrega nada. Ele empurra a responsabilidade para o cliente, não adiciona informação e é fácil de ignorar. <strong>Follow-up com valor faz o contrário</strong>: cada contato traz um motivo novo, remove um obstáculo ou facilita a próxima decisão.' },

    { tipo: 'callout', variante: 'alerta', titulo: 'A pergunta que você deve se fazer antes de cada follow-up',
      html: '"Qual <strong>valor novo</strong> estou levando neste contato?" Se a resposta for "nenhum, só quero cobrar", reescreva a mensagem. Todo toque precisa ajudar o cliente a avançar.' },

    { tipo: 'titulo', texto: 'Modelos de follow-up por situação' },
    { tipo: 'texto', html: 'Use estes modelos como base e personalize com o que o cliente te contou. Quanto mais específico ao caso dele, mais difícil de ignorar.' },

    { tipo: 'script', contexto: 'Follow-up após a proposta',
      fala: 'Olá, [nome]. Separei o modelo considerando o pico de utilização que você informou. Conseguiu validar internamente se essa capacidade atende à operação?' },

    { tipo: 'script', contexto: 'Follow-up com o decisor / aprovação superior',
      fala: 'Você comentou que a diretoria avaliaria a compra. Qual informação eu posso complementar para facilitar essa aprovação?' },

    { tipo: 'script', contexto: 'Follow-up quando o cliente está comparando fornecedores',
      fala: 'Para ajudar na análise, vale comparar não apenas os litros, mas compressor, recuperação da temperatura, torneiras, garantia e suporte.' },

    { tipo: 'script', contexto: 'Follow-up de prazo / cliente com data-limite',
      fala: 'Você mencionou que precisa do equipamento antes de [data]. Para manter esse planejamento, quando precisaremos concluir a aprovação?' },

    { tipo: 'script', contexto: 'Follow-up de encerramento (sem resposta após a cadência)',
      fala: 'Como ainda não consegui confirmar o andamento, vou encerrar o acompanhamento ativo por enquanto. Caso o projeto continue, é só me chamar que retomamos do ponto em que paramos.' },

    { tipo: 'callout', variante: 'info', titulo: 'Por que o encerramento também é uma técnica',
      html: 'A mensagem de encerramento é educada e sem cobrança — e muitas vezes é justamente ela que <strong>traz o cliente de volta</strong>, porque tira a pressão e deixa claro que a porta continua aberta. Encerrar o acompanhamento ativo não é desistir: é liberar seu tempo para oportunidades quentes e deixar um convite limpo para o retorno.' },

    { tipo: 'titulo', texto: 'Cadência sugerida' },
    { tipo: 'texto', html: 'Esta é uma <strong>sugestão de ritmo</strong>, não uma regra rígida. Ajuste conforme o tamanho do projeto, a urgência do cliente e o que foi combinado na conversa. O importante é que cada toque tenha um propósito diferente — nunca repetir a mesma cobrança.' },
    { tipo: 'tabela',
      head: ['Momento', 'Objetivo do contato', 'Modelo de referência'],
      rows: [
        ['D+0', 'Enviar a proposta já ancorada no que o cliente pediu (pico, aplicação).', 'Envio da proposta'],
        ['D+1', 'Confirmar recebimento e checar se a capacidade atende à operação.', 'Após a proposta'],
        ['D+3', 'Ajudar na análise interna / munir o decisor de informação.', 'Com o decisor / comparação'],
        ['D+7', 'Reforçar prazo e alinhar quando a aprovação precisa sair.', 'De prazo'],
        ['D+14', 'Encerrar o acompanhamento ativo com a porta aberta.', 'De encerramento'],
      ]
    },
    { tipo: 'callout', variante: 'alerta', titulo: 'A cadência é um guia, não uma camisa de força',
      html: 'Cliente com data-limite curta pode precisar de toques mais próximos; projeto grande com muitos aprovadores pode pedir intervalos maiores. <strong>Leia o contexto</strong> — a régua serve para você nunca deixar uma oportunidade esfriar sem próximo passo, não para robotizar o contato.' },

    { tipo: 'dodont',
      fazer: [
        'Levar um motivo ou informação nova em cada follow-up.',
        'Personalizar com o que o cliente contou (pico, prazo, decisor).',
        'Variar o objetivo de cada toque ao longo da cadência.',
        'Encerrar com elegância quando não houver resposta.',
      ],
      evitar: [
        'Mandar "conseguiu ver?" sem agregar nada.',
        'Repetir a mesma mensagem de cobrança várias vezes.',
        'Sumir e deixar a oportunidade sem próximo passo.',
        'Prometer prazo de entrega ou benefícios não confirmados só para pressionar.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual destes é um follow-up COM valor?',
      opcoes: [
        '"Oi, conseguiu ver a proposta que te mandei?"',
        '"Separei o modelo considerando o pico que você informou. Conseguiu validar se a capacidade atende à operação?"',
        '"Bom dia! Passando para lembrar de você."',
      ],
      correta: 1,
      explicacao: 'O bom follow-up retoma um dado específico do cliente (o pico) e faz uma pergunta que ajuda a avançar a decisão — não apenas cobra resposta.'
    },
    {
      pergunta: 'Sobre a cadência sugerida (D+0, D+1, D+3, D+7, D+14), o que é correto?',
      opcoes: [
        'É uma regra fixa e deve ser seguida à risca em todo negócio.',
        'É uma sugestão de ritmo; cada toque deve ter um objetivo diferente e o intervalo se ajusta ao contexto.',
        'Serve para repetir a mesma cobrança em datas espaçadas.',
      ],
      correta: 1,
      explicacao: 'A cadência é um guia para não deixar a oportunidade esfriar. O intervalo se adapta à urgência e ao tamanho do projeto, e cada contato tem propósito próprio.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente recebeu a proposta há 7 dias e disse que a diretoria precisa aprovar antes do fim do mês. Escreva o follow-up que você enviaria hoje, combinando o modelo de decisor com o de prazo, sem cobrar de forma vazia.',
    dica: 'Ofereça-se para munir o decisor de informação E amarre a data-limite: "quando precisaríamos concluir a aprovação para manter o prazo?".'
  },

  resumo: 'Follow-up com valor entrega um motivo novo a cada contato, nunca um "conseguiu ver?" vazio. Use os modelos por situação — após a proposta, com decisor, comparação, prazo e encerramento — e siga a cadência sugerida (D+0/D+1/D+3/D+7/D+14) como guia flexível, dando a cada toque um objetivo distinto e nunca deixando a oportunidade sem próximo passo.'
};
