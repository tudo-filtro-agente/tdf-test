// ============================================================================
// MÓDULO 12 — Follow-up com Valor
// Cadência D+0 a D+7, WhatsApp + Ligação, Templates TDF
// ============================================================================

module.exports = {
  resumoCurto: 'Aprenda a fazer follow-up que agrega valor a cada contato — nunca mais envie "alguma novidade?" — com cadência estruturada de D+0 a D+7 usando WhatsApp e ligação.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-12-video' },

  blocos: [
    { tipo: 'texto', html: 'A maioria das vendas é perdida <strong>não por rejeição, mas por abandono</strong>. O vendedor faz uma boa apresentação, o cliente diz "vou pensar" e… silêncio. O follow-up é o que separa closers profissionais de tiradores de pedido. Mas follow-up ruim é pior que nenhum follow-up. <strong>Cada contato deve agregar valor.</strong>' },

    { tipo: 'titulo', texto: 'A regra de ouro do follow-up' },
    { tipo: 'callout', variante: 'info', titulo: 'Nunca pergunte "alguma novidade?"',
      html: '"Alguma novidade?" coloca o poder na mão do cliente e demonstra que você não tem nada a oferecer. <strong>Cada follow-up deve trazer uma informação nova, um dado relevante ou um motivo real para avançar.</strong>' },

    { tipo: 'titulo', texto: 'Cadência TDF: D+0 a D+7' },
    { tipo: 'tabela',
      head: ['Dia', 'Canal', 'Ação', 'Exemplo de Mensagem'],
      rows: [
        ['D+0', 'WhatsApp', 'Resumo da conversa + material', '"Oi [Nome], conforme conversamos, segue o resumo da solução que indiquei para sua água: [link/PDF]. Qualquer dúvida, estou aqui!"'],
        ['D+1', 'WhatsApp', 'Conteúdo de valor', '"[Nome], encontrei esse caso de um cliente com situação parecida com a sua — olha o antes e depois da água dele: [foto/depoimento]."'],
        ['D+2', 'Ligação', 'Checar dúvidas + decisor', 'Ligar para esclarecer dúvidas técnicas. Perguntar: "Conseguiu ver o material? Tem alguma dúvida sobre a instalação?"'],
        ['D+3', 'WhatsApp', 'Urgência real', '"[Nome], nosso time de instalação estará na sua região [data]. Se confirmar até [prazo], consigo encaixar na agenda."'],
        ['D+5', 'Ligação', 'Última tentativa ativa', 'Ligação consultiva: "Quero entender se ainda faz sentido resolver a questão da água. Se o momento não for agora, sem problema — posso retomar quando for melhor."'],
        ['D+7', 'WhatsApp', 'Encerramento com porta aberta', '"[Nome], como não conseguimos avançar, vou deixar seu orçamento salvo. Quando quiser retomar, é só me chamar. A questão da água não vai embora sozinha 😉"'],
      ]
    },

    { tipo: 'titulo', texto: 'Templates de WhatsApp — Prontos para uso' },
    { tipo: 'cards', itens: [
      { icon: '📋', titulo: 'D+0 — Resumo pós-conversa', html: '"Oi [Nome]! Foi ótimo conversar com você. Como combinamos, o [Produto] resolve [problema específico]. Investimento: R$ [X] + instalação profissional (R$ 590). Segue material técnico: [link]. Posso agendar a instalação pra [data]?"' },
      { icon: '📸', titulo: 'D+1 — Prova social', html: '"[Nome], esse é o depoimento do [Cliente similar] que instalou o [Produto] mês passado. Ele tinha o mesmo problema de [dor]. Olha o resultado: [foto antes/depois]."' },
      { icon: '⏰', titulo: 'D+3 — Agenda de instalação', html: '"[Nome], boa notícia: nosso instalador confirmou agenda na sua cidade dia [data]. Se fechar até [prazo], encaixo sem custo adicional de deslocamento. Quer que eu reserve?"' },
      { icon: '👋', titulo: 'D+7 — Encerramento elegante', html: '"[Nome], entendo que o momento pode não ser agora. Deixo seu projeto salvo aqui — quando quiser retomar, os valores e condições são esses. A água com [problema] continua fazendo estrago enquanto isso, mas respeito seu tempo. Abraço!"' },
    ]},

    { tipo: 'titulo', texto: 'Follow-up por telefone: Roteiro de ligação' },
    { tipo: 'texto', html: 'Ligações de follow-up devem durar <strong>no máximo 3 minutos</strong>. Roteiro:' },
    { tipo: 'checklist', titulo: 'Checklist da ligação D+2', itens: [
      '1. Cumprimento rápido e contexto: "Oi [Nome], sou o [Closer] da Tudo de Filtro, conversamos [quando]."',
      '2. Pergunta de valor: "Conseguiu ver o material que enviei? Ficou alguma dúvida técnica?"',
      '3. Identificar bloqueio: "O que falta pra gente avançar?" (Preço? Decisor? Timing?)',
      '4. Oferecer próximo passo concreto: "Posso agendar uma visita técnica?" ou "Quer que eu envie o comparativo?"',
      '5. Confirmar compromisso: "Então fico de retornar [quando] com [o quê]. Combinado?"',
    ]},

    { tipo: 'titulo', texto: 'Erros fatais no follow-up' },
    { tipo: 'dodont',
      fazer: [
        'Trazer informação nova a cada contato — dado, caso, foto, depoimento.',
        'Respeitar os intervalos da cadência — nem cedo demais, nem tarde demais.',
        'Registrar cada contato no CRM com data e resultado.',
        'Encerrar com porta aberta quando o cliente não quer agora.',
        'Usar o nome do cliente e referência ao problema específico dele.',
      ],
      evitar: [
        '"Alguma novidade?" ou "Conseguiu pensar?" — zero valor agregado.',
        'Ligar 3x no mesmo dia — isso é assédio, não follow-up.',
        'Mandar áudio de 3 minutos no WhatsApp — ninguém ouve.',
        'Desistir depois de um "vou pensar" — a maioria das vendas se decide nos primeiros dias de follow-up.',
        'Copiar e colar template sem personalizar com o nome e dor do cliente.',
      ]
    },

    { tipo: 'titulo', texto: 'Exercício prático' },
    { tipo: 'texto', html: 'Monte a <strong>cadência completa de follow-up</strong> para o cenário abaixo:' },
    { tipo: 'checklist', titulo: 'Cenário', itens: [
      'Cliente: Dono de restaurante com 200 funcionários',
      'Problema: Água com calcário entupindo máquina de lavar louça',
      'Produto indicado: Scale Stop (R$ 14.990)',
      'Escreva as mensagens de D+0, D+1, D+3 e D+7 personalizadas para esse caso',
    ]},
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual é o principal erro no follow-up de vendas?',
      opcoes: [
        'Ligar demais para o cliente.',
        'Enviar mensagens como "alguma novidade?" sem agregar valor.',
        'Fazer follow-up por WhatsApp.',
        'Encerrar o contato em D+7.',
      ],
      correta: 1,
      explicacao: '"Alguma novidade?" demonstra que você não tem nada a oferecer e coloca o poder na mão do cliente. Cada contato deve trazer informação nova.'
    },
    {
      pergunta: 'Na cadência TDF, qual é o canal recomendado para D+2?',
      opcoes: [
        'E-mail formal',
        'WhatsApp com template',
        'Ligação telefônica',
        'Visita presencial',
      ],
      correta: 2,
      explicacao: 'D+2 é o momento de ligação para esclarecer dúvidas técnicas, identificar o decisor e entender o que falta para avançar.'
    },
    {
      pergunta: 'O que fazer quando o cliente não responde até D+7?',
      opcoes: [
        'Insistir com ligações diárias até ele responder.',
        'Encerrar com porta aberta e deixar o projeto salvo.',
        'Dar desconto de 20% para forçar o fechamento.',
      ],
      correta: 1,
      explicacao: 'Encerrar com elegância mantém a relação. O cliente pode retomar no futuro. Pressão excessiva queima o lead permanentemente.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente viu a apresentação do Iron Free (R$ 21.900) para sua fazenda e disse "vou conversar com minha esposa". Monte as mensagens de follow-up para D+0 (resumo), D+1 (prova social), D+3 (urgência real) e D+5 (ligação — escreva o roteiro). Use o nome fictício "Sr. Roberto".',
    dica: 'No D+0, resuma o problema e a solução. No D+1, envie caso de outro fazendeiro. No D+3, use a agenda de instalação na região como urgência real. No D+5, ligue para entender se ele conversou com a esposa e ofereça incluir ela na próxima conversa.'
  },

  resumo: 'Follow-up com valor é a diferença entre fechar e perder a venda. Use a cadência D+0 a D+7 com WhatsApp e ligação intercalados. Cada contato traz informação nova — nunca "alguma novidade?". Registre tudo no CRM. Encerre com elegância em D+7 se não houve avanço. A maioria das vendas se decide nos primeiros dias de follow-up — não abandone o lead.'
};
