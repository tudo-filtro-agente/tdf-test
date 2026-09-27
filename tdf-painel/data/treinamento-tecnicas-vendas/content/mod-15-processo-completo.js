// ============================================================================
// MÓDULO 15 — Processo Comercial Completo TDF
// Da entrada do lead ao fechamento — SDR → Closer, CRM, WATI + GoTo
// ============================================================================

module.exports = {
  resumoCurto: 'Domine o processo comercial completo da TDF: da entrada do lead ao pós-venda — com os 12 passos, handoff SDR→Closer, etapas do CRM, e uso de WATI e GoTo.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-15-video' },

  blocos: [
    { tipo: 'texto', html: 'Vender na TDF não é improviso — é <strong>processo</strong>. Cada lead que entra segue uma jornada definida, com responsáveis claros, ferramentas específicas e critérios de avanço. Quando o processo é seguido, a conversão sobe. Quando é ignorado, leads são perdidos no caminho. Este módulo conecta <strong>tudo que você aprendeu</strong> nos módulos anteriores em um fluxo único e prático.' },

    { tipo: 'titulo', texto: 'Visão geral: O funil TDF' },
    { tipo: 'cards', itens: [
      { icon: '📥', titulo: 'Entrada do Lead', html: 'Lead chega via site, WhatsApp (WATI), indicação ou anúncio. É registrado automaticamente no CRM com origem e data.' },
      { icon: '📞', titulo: 'Qualificação (SDR)', html: 'O SDR faz o primeiro contato em até <strong>5 minutos</strong>. Qualifica o lead com perguntas de Situação (SPIN) e define se é qualificado para o Closer.' },
      { icon: '🎯', titulo: 'Apresentação (Closer)', html: 'O Closer recebe o lead qualificado, aplica SPIN completo, constrói valor (Módulo 13) e conduz à proposta.' },
      { icon: '🤝', titulo: 'Fechamento + Pós-venda', html: 'Fechamento sem pressão (Módulo 11), follow-up com valor (Módulo 12), agendamento de instalação e acompanhamento pós-venda.' },
    ]},

    { tipo: 'titulo', texto: 'Os 12 Passos do Processo Comercial TDF' },
    { tipo: 'tabela',
      head: ['#', 'Passo', 'Responsável', 'Ferramenta', 'Critério de Avanço'],
      rows: [
        ['1', 'Lead entra no sistema', 'Automático', 'WATI / CRM', 'Lead registrado com origem e dados de contato'],
        ['2', 'Primeiro contato (≤ 5 min)', 'SDR', 'WATI + GoTo', 'Contato realizado e respondido'],
        ['3', 'Qualificação BANT', 'SDR', 'GoTo (ligação)', 'Budget, Authority, Need, Timeline confirmados'],
        ['4', 'Handoff SDR → Closer', 'SDR', 'CRM', 'Ficha preenchida: problema, decisor, orçamento, urgência'],
        ['5', 'Rapport + SPIN (Situação/Problema)', 'Closer', 'GoTo (ligação)', 'Problema identificado e dor verbalizada pelo cliente'],
        ['6', 'SPIN (Implicação/Necessidade)', 'Closer', 'GoTo (ligação)', 'Cliente verbalizou consequência e desejo de resolver'],
        ['7', 'Construção de valor', 'Closer', 'WhatsApp + GoTo', 'Sequência Problema→Dor→Consequência→Solução apresentada'],
        ['8', 'Apresentação de proposta', 'Closer', 'WhatsApp (WATI)', 'Proposta enviada com produto, valor e condições'],
        ['9', 'Tratamento de objeções', 'Closer', 'GoTo (ligação)', 'Objeções tratadas — cliente sem dúvidas pendentes'],
        ['10', 'Fechamento', 'Closer', 'GoTo + WATI', 'Pedido confirmado e pagamento processado'],
        ['11', 'Agendamento de instalação', 'Closer + Ops', 'CRM', 'Data e endereço de instalação confirmados'],
        ['12', 'Pós-venda (D+7 e D+30)', 'CS / Closer', 'WATI', 'Cliente satisfeito, NPS coletado, indicação solicitada'],
      ]
    },

    { tipo: 'titulo', texto: 'Handoff SDR → Closer: O momento crítico' },
    { tipo: 'callout', variante: 'alerta', titulo: 'O handoff mal feito é a maior causa de leads perdidos',
      html: 'Quando o SDR passa um lead sem informação suficiente, o Closer repete perguntas que o cliente já respondeu — gerando irritação e perda de credibilidade. <strong>O handoff deve incluir:</strong> nome, problema principal, decisor, orçamento estimado, timeline e resumo da conversa do SDR.' },

    { tipo: 'dodont',
      fazer: [
        'SDR preenche ficha completa no CRM antes de transferir.',
        'Closer lê a ficha ANTES de ligar — nunca liga sem contexto.',
        'Closer começa com: "O [SDR] me passou seu caso. Vi que sua água tem [problema]..."',
        'SDR avisa o cliente: "Vou te transferir pro [Closer], nosso especialista em [produto]."',
        'Handoff acontece em até 1 hora após qualificação.',
      ],
      evitar: [
        'Transferir lead sem ficha: "Tem um cara aí que quer filtro."',
        'Closer perguntar tudo de novo: "Me conta, qual seu problema?"',
        'Deixar o lead mais de 24h sem contato entre SDR e Closer.',
        'SDR qualificar mal e enviar lead que não tem orçamento/decisão.',
        'Não registrar o handoff no CRM — lead se perde entre os dois.',
      ]
    },

    { tipo: 'titulo', texto: 'Ferramentas do processo: WATI + GoTo' },
    { tipo: 'cards', itens: [
      { icon: '💬', titulo: 'WATI (WhatsApp Business API)', html: '<strong>Quando usar:</strong> Primeiro contato automático, envio de propostas, follow-up com templates, pesquisa de satisfação pós-venda.<br><strong>Regra:</strong> Toda mensagem de WATI deve ser personalizada com nome do cliente e problema específico. Templates genéricos são proibidos.' },
      { icon: '📱', titulo: 'GoTo (Telefonia VoIP)', html: '<strong>Quando usar:</strong> Qualificação BANT (SDR), SPIN completo (Closer), tratamento de objeções, fechamento verbal.<br><strong>Regra:</strong> Ligações devem ser gravadas (com consentimento). Duração ideal: SDR 5–8 min, Closer 15–25 min.' },
    ]},

    { tipo: 'titulo', texto: 'Etapas do CRM — O que registrar' },
    { tipo: 'texto', html: 'O CRM é a <strong>fonte da verdade</strong> do processo. Se não está no CRM, não aconteceu. Etapas:' },
    { tipo: 'checklist', titulo: 'Campos obrigatórios em cada etapa', itens: [
      'NOVO: Nome, telefone, email, origem do lead, data de entrada.',
      'QUALIFICADO (SDR): Problema principal, tipo de água, decisor, orçamento, urgência.',
      'EM NEGOCIAÇÃO (Closer): Produto indicado, valor da proposta, objeções identificadas.',
      'PROPOSTA ENVIADA: Data de envio, valor, condições, prazo de validade.',
      'FECHADO GANHO: Valor final, forma de pagamento, data de instalação.',
      'FECHADO PERDIDO: Motivo da perda (preço, timing, concorrência, sem resposta).',
    ]},

    { tipo: 'titulo', texto: 'Checklist diário do Closer' },
    { tipo: 'checklist', titulo: 'Antes de começar o dia', itens: [
      '☐ Verificar leads novos transferidos pelo SDR no CRM.',
      '☐ Ler fichas de qualificação de cada lead antes de ligar.',
      '☐ Checar follow-ups pendentes (D+1, D+2, D+3, D+5).',
      '☐ Verificar agenda do instalador para informar janelas reais.',
      '☐ Atualizar status de todas as negociações no CRM.',
      '☐ Retornar WhatsApps pendentes do WATI.',
    ]},

    { tipo: 'titulo', texto: 'Como tudo se conecta — Mapa dos módulos' },
    { tipo: 'texto', html: 'Cada módulo do treinamento se encaixa em uma parte do processo:<br><br>• <strong>Módulo SPIN (1):</strong> Passos 5 e 6 (diagnóstico do Closer)<br>• <strong>Módulo Construção de Valor (13):</strong> Passo 7<br>• <strong>Módulo Fechamento (11):</strong> Passo 10<br>• <strong>Módulo Follow-up (12):</strong> Entre passos 8 e 10<br>• <strong>Módulo Urgência Real (14):</strong> Passos 8, 9 e 10<br>• <strong>Este módulo (15):</strong> A cola que une tudo' },

    { tipo: 'titulo', texto: 'Exercício final' },
    { tipo: 'checklist', titulo: 'Simule o processo completo', itens: [
      'Lead: Maria, dona de restaurante, água de poço com ferro, 15 funcionários, orçamento aprovado.',
      'Passo 1-3: Escreva a mensagem de primeiro contato (WATI) e as perguntas de qualificação (SDR).',
      'Passo 4: Monte a ficha de handoff para o Closer.',
      'Passo 5-7: Escreva o roteiro SPIN + construção de valor para Iron Free.',
      'Passo 8-10: Monte a proposta, trate a objeção "tá caro" e feche com urgência real + instalação cortesia.',
      'Passo 11-12: Agende a instalação e escreva a mensagem de pós-venda D+7.',
    ]},
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual é o tempo máximo para o primeiro contato com um lead novo na TDF?',
      opcoes: [
        '24 horas',
        '1 hora',
        '5 minutos',
        '30 minutos',
      ],
      correta: 2,
      explicacao: 'O primeiro contato deve ser feito em até 5 minutos após a entrada do lead. Leads contatados rapidamente têm taxa de conversão muito superior.'
    },
    {
      pergunta: 'O que o SDR DEVE incluir na ficha de handoff para o Closer?',
      opcoes: [
        'Apenas nome e telefone.',
        'Nome, problema, decisor, orçamento, urgência e resumo da conversa.',
        'Só o produto que o cliente quer.',
        'Histórico completo de redes sociais do cliente.',
      ],
      correta: 1,
      explicacao: 'A ficha completa permite que o Closer entre na conversa com contexto, sem repetir perguntas e demonstrando profissionalismo.'
    },
    {
      pergunta: 'Qual ferramenta é usada para envio de propostas e follow-up via WhatsApp na TDF?',
      opcoes: [
        'GoTo',
        'WATI',
        'Slack',
        'E-mail marketing',
      ],
      correta: 1,
      explicacao: 'WATI é a plataforma de WhatsApp Business API usada para templates, propostas e follow-up. GoTo é para ligações telefônicas.'
    },
    {
      pergunta: 'Qual é a etapa mais crítica do processo onde leads são perdidos?',
      opcoes: [
        'Entrada do lead no sistema.',
        'Handoff SDR → Closer.',
        'Pós-venda.',
        'Agendamento de instalação.',
      ],
      correta: 1,
      explicacao: 'O handoff mal feito — sem ficha, sem contexto, sem rapidez — é a maior causa de leads perdidos. O Closer perde credibilidade ao repetir perguntas já feitas.'
    },
  ],

  exercicio: {
    enunciado: 'Desenhe o processo completo para o seguinte caso: Lead "Carlos" entra via anúncio no Instagram, WhatsApp automatizado. Ele é dono de uma clínica veterinária com água de poço que tem muito calcário. Precisa proteger autoclaves e máquinas de lavar. Orçamento aprovado pela sócia. Descreva cada um dos 12 passos com o que seria feito, dito e registrado — incluindo as ferramentas (WATI, GoTo, CRM) em cada etapa.',
    dica: 'Comece pelo WATI (primeiro contato automático), passe pelo SDR (qualificação por GoTo), handoff com ficha completa, Closer com SPIN aplicado a calcário em autoclave, construção de valor com custo de manutenção, proposta de Scale Stop, fechamento com instalação cortesia, e pós-venda com NPS.'
  },

  resumo: 'O processo comercial TDF tem 12 passos — da entrada do lead ao pós-venda. O SDR qualifica em até 5 minutos e faz handoff completo para o Closer. O Closer aplica SPIN, constrói valor, fecha sem pressão e acompanha o pós-venda. WATI cuida do WhatsApp, GoTo das ligações, CRM registra tudo. Se não está no CRM, não aconteceu. O processo é a cola que une todas as técnicas dos módulos anteriores.'
};
