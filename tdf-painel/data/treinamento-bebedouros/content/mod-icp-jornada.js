// ============================================================================
// MÓDULO — ICP, Personas e Jornada do Lead (dados REAIS do CRM)
// Ancorado 100% em dados do Zoho CRM (extração 06/jul/2026): 697 deals ganhos
// da linha Bebedouro. Nenhum número inventado. Fonte: ~/tdf-crm-icp-analysis/.
// ============================================================================

module.exports = {
  resumoCurto: 'Quem realmente compra bebedouro (dados do CRM): a única linha com B2B de verdade, ciclo de 1 dia e forte entrada por WhatsApp. O que isso muda no seu atendimento.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'beb-icp-jornada-video' },

  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'Este módulo é baseado em dados reais',
      html: 'Tudo aqui vem do <strong>Zoho CRM</strong> — <strong>697 vendas fechadas</strong> de bebedouro (win rate 23,1%). Não é achismo: é o retrato de quem <strong>de fato compra</strong>.' },

    { tipo: 'titulo', texto: 'O ICP do bebedouro — quem compra' },
    { tipo: 'cards', itens: [
      { icon: '🏢', titulo: 'A ÚNICA linha B2B', html: '<strong>27,7%</strong> das vendas têm empresa (CNPJ) — de todas as linhas da TDF, bebedouro é a única com B2B real. O resto é misto PJ+PF.' },
      { icon: '💰', titulo: 'Ticket', html: 'Mediano <strong>R$2.145</strong> (baixo no unitário, alto no volume). Máximo R$39.440 em compras multi-unidade.' },
      { icon: '📍', titulo: 'Região', html: '<strong>~82% São Paulo</strong> (capital 95, São José dos Campos 70, Guarulhos 24, Jacareí 19).' },
      { icon: '📈', titulo: 'Em crescimento', html: 'Linha acelerando (jun/2026 = 89 vendas no mês). Motor transacional em alta.' },
    ]},

    { tipo: 'titulo', texto: 'A persona' },
    { tipo: 'texto', html: 'Empresa ou estabelecimento (às vezes residência) que precisa de <strong>água gelada para muita gente</strong> — funcionários, clientes, alunos. A compra é <strong>utilitária e rápida</strong>: o decisor quer resolver, muitas vezes com <strong>CNPJ</strong> (nota fiscal, faturamento). Não é uma venda emocional de "qualidade da água" — é operacional.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Ponto cego do CRM (higiene)',
      html: 'Nos bebedouros, os campos <strong>Tipo de Água</strong> e <strong>Queixa</strong> vêm vazios, e a empresa (Account) muitas vezes não é preenchida. Isso cega a análise. <strong>Preencha o CRM</strong>: marque a empresa (PJ), o segmento e o motivo — o próprio módulo de CRM da academia ensina isso.' },

    { tipo: 'titulo', texto: 'A jornada do lead — e por que ela muda seu jogo' },
    { tipo: 'tabela',
      head: ['Sinal do CRM', 'Número real', 'O que isso significa pra você'],
      rows: [
        ['Ciclo de venda', '<strong>1 dia</strong> (mediano)', 'É a linha MAIS transacional. Quem responde primeiro, fecha. Velocidade > profundidade.'],
        ['Origem: Google', '52%', 'Metade vem de busca com intenção de compra — cliente já quer bebedouro.'],
        ['Origem: CTWA/WhatsApp', '<strong>27%</strong>', 'ÚNICA linha com forte entrada por WhatsApp. Muita venda nasce e morre no chat.'],
        ['Pipeline', '"Geral"', 'Fora do funil consultivo longo — trate como e-commerce/velocidade.'],
      ]
    },
    { tipo: 'callout', variante: 'sucesso', titulo: 'A lição prática',
      html: 'Bebedouro é <strong>velocidade + WhatsApp + PJ</strong>. Com ciclo de 1 dia, <strong>speed-to-lead é tudo</strong>: responder em minutos muda o resultado. Qualifique rápido (pico, voltagem, cidade, CNPJ) e conduza pro fechamento no mesmo dia — sem arrastar como se fosse projeto de poço.' },

    { tipo: 'dodont',
      fazer: [
        'Responder na hora (o ciclo é de 1 dia — quem demora perde).',
        'Tratar bem o WhatsApp/CTWA: 27% das vendas entram por aí.',
        'Qualificar CNPJ/nota/faturamento quando for empresa (é B2B de verdade).',
        'Registrar a empresa e o motivo no CRM (hoje vem cego).',
      ],
      evitar: [
        'Arrastar a venda como se fosse consultiva longa (não é o comportamento da linha).',
        'Ignorar o lead de WhatsApp achando que "não é sério".',
        'Deixar de marcar PJ no CRM e perder a leitura de B2B.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Pelos dados do CRM, o que mais define o atendimento de bebedouro?',
      opcoes: [
        'É uma venda consultiva longa, pode levar semanas.',
        'É transacional: ciclo mediano de 1 dia — velocidade e resposta rápida decidem.',
        'O cliente sempre compra por qualidade da água.',
      ],
      correta: 1,
      explicacao: 'O ciclo mediano é de 1 dia — a linha mais transacional da TDF. Speed-to-lead é o fator decisivo.'
    },
    {
      pergunta: 'Qual característica é EXCLUSIVA do bebedouro entre as linhas da TDF?',
      opcoes: [
        'É a única com B2B real (27,7% empresas) e forte entrada por WhatsApp/CTWA (27%).',
        'É a de maior ticket.',
        'É a que mais depende de análise de água.',
      ],
      correta: 0,
      explicacao: 'Bebedouro é a única linha com B2B expressivo e a única com forte canal WhatsApp/CTWA. As outras são PF via tráfego pago.'
    },
  ],

  exercicio: {
    enunciado: 'Chega um lead de bebedouro pelo WhatsApp às 14h. Sabendo que o ciclo mediano é de 1 dia e que 27,7% são empresas, descreva os 3 primeiros movimentos que você faz nos próximos 10 minutos.',
    dica: 'Pense: responder na hora → qualificar rápido (pico, voltagem, cidade, é empresa/CNPJ?) → encaminhar pro fechamento no mesmo dia.'
  },

  resumo: 'Dados do CRM (697 vendas): bebedouro é a ÚNICA linha B2B (27,7% empresas), ticket mediano R$2.145, ~82% em SP, e a mais transacional (ciclo de 1 dia). Metade vem do Google e 27% do WhatsApp/CTWA. Tradução prática: velocidade de resposta, bom atendimento no WhatsApp e qualificação de PJ. Trate como e-commerce, não como projeto consultivo — e preencha o CRM (empresa/segmento/motivo) que hoje vem cego.'
};
