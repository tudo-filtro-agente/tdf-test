// ============================================================================
// MÓDULO 5 — Pipeline e Prospecção — Receita Previsível
// Baseado em: Receita Previsível — Aaron Ross
// ============================================================================

module.exports = {
  resumoCurto: 'Aprenda a construir um pipeline previsível de vendas usando os conceitos de Aaron Ross, adaptados para o mercado de tratamento de água.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-05-video' },

  blocos: [
    { tipo: 'texto', html: 'Aaron Ross revolucionou a Salesforce ao criar um sistema de prospecção que gerava <strong>receita previsível</strong>. O conceito central é simples: se você sabe quantos leads precisa gerar, quantos viram oportunidade e quantos fecham, consegue <strong>prever o faturamento</strong> com precisão. Na TDF, isso significa saber exatamente quantas visitas técnicas agendar por semana para bater a meta.' },

    { tipo: 'titulo', texto: 'Os 3 tipos de leads segundo Aaron Ross' },
    { tipo: 'cards', itens: [
      { icon: '🌱', titulo: 'Seeds (Sementes)', html: 'Vêm de <strong>indicação e boca a boca</strong>. São os melhores leads porque já vêm com confiança. Na TDF: cliente satisfeito que indica vizinho, amigo ou familiar. <strong>Taxa de conversão: alta (40-60%).</strong>' },
      { icon: '🕸️', titulo: 'Nets (Redes)', html: 'Vêm de <strong>marketing inbound</strong> — site, Google, redes sociais. O cliente veio até você. Na TDF: lead que preencheu formulário, mandou mensagem no WhatsApp ou ligou pedindo orçamento. <strong>Taxa de conversão: média (15-30%).</strong>' },
      { icon: '🎯', titulo: 'Spears (Lanças)', html: 'Vêm de <strong>prospecção ativa</strong> — o vendedor vai atrás. Na TDF: SDR que prospecta construtoras, condomínios, clínicas, restaurantes. <strong>Taxa de conversão: variável (5-15%), mas alta previsibilidade.</strong>' },
    ]},

    { tipo: 'titulo', texto: 'O funil de vendas TDF em números' },
    { tipo: 'tabela',
      head: ['Etapa', 'Quantidade', 'Taxa', 'Responsável'],
      rows: [
        ['Leads novos/semana', '50', '100%', 'Marketing + SDR'],
        ['Leads qualificados', '25', '50%', 'SDR'],
        ['Visitas agendadas', '12', '48%', 'SDR + Closer'],
        ['Visitas realizadas', '10', '83%', 'Técnico'],
        ['Propostas enviadas', '8', '80%', 'Closer'],
        ['Vendas fechadas', '3-4', '40-50%', 'Closer'],
      ]
    },
    { tipo: 'callout', variante: 'info', titulo: 'A matemática da previsibilidade',
      html: 'Se cada venda média é R$ 8.000 e você fecha 3,5 por semana, o faturamento semanal previsível é <strong>R$ 28.000</strong>. Para aumentar, aumente a entrada do funil (mais leads) ou melhore as taxas de conversão de cada etapa.' },

    { tipo: 'titulo', texto: 'A separação SDR × Closer' },
    { tipo: 'texto', html: 'Aaron Ross defende que <strong>quem prospecta não deve fechar</strong> e vice-versa. A separação de funções é essencial para a previsibilidade:' },
    { tipo: 'tabela',
      head: ['SDR (Pré-venda)', 'Closer (Venda)'],
      rows: [
        ['Prospecta e qualifica leads', 'Recebe leads qualificados'],
        ['Faz primeiro contato', 'Faz a venda consultiva (SPIN)'],
        ['Identifica dor e urgência', 'Apresenta solução e preço'],
        ['Agenda visita técnica', 'Trata objeções e fecha'],
        ['Meta: agendamentos/semana', 'Meta: vendas/semana e ticket médio'],
      ]
    },

    { tipo: 'titulo', texto: 'Cold Calling 2.0 — prospecção sem cold call' },
    { tipo: 'texto', html: 'Aaron Ross ficou famoso por gerar milhões em pipeline na Salesforce <strong>sem fazer cold call</strong>. O Cold Calling 2.0 troca a ligação fria por um processo de pesquisa + e-mail curto pedindo <strong>indicação interna</strong>: em vez de ligar direto para um decisor que nunca ouviu falar de você, envia-se uma mensagem simples perguntando <em>"quem é a pessoa certa para falar sobre [tema]?"</em>. Quando a resposta chega, a ligação deixa de ser fria — você foi indicado por alguém de dentro.' },
    { tipo: 'texto', html: 'Na TDF, isso se aplica à prospecção de contas maiores (Spears): condomínios, construtoras, administradoras, pousadas, clínicas e indústrias da região. O SDR pesquisa a empresa, identifica um contato de entrada (administradora, síndico profissional, gerente predial) e envia um e-mail ou mensagem curta: <em>"Olá! Ajudamos condomínios do Vale do Paraíba a resolver problemas de qualidade de água e proteção da tubulação. Quem seria a pessoa certa aí para falar sobre esse assunto?"</em>' },
    { tipo: 'texto', html: 'A regra de ouro: o primeiro contato <strong>não vende nada</strong> — só pede direcionamento. É curto, educado e fácil de responder. Só depois de chegar ao decisor certo, com a "ponte" da indicação interna, o SDR liga e inicia a qualificação normal (perguntas de Situação + BANT).' },

    { tipo: 'titulo', texto: 'Qualificação de leads: o filtro BANT adaptado' },
    { tipo: 'texto', html: 'Nem todo lead merece o tempo de um closer. O SDR qualifica usando <strong>BANT</strong>:' },
    { tipo: 'cards', itens: [
      { icon: '💰', titulo: 'B — Budget (Orçamento)', html: 'O cliente tem capacidade financeira? Faz sentido falar de Iron Free (R$ 13.990+) para quem busca filtro de R$ 200? <strong>Pergunte:</strong> "Você já tem uma ideia de quanto investir em tratamento de água?"' },
      { icon: '👤', titulo: 'A — Authority (Autoridade)', html: 'Quem decide? Em empresa, é o dono? Gerente? Compras? <strong>Pergunte:</strong> "Além de você, quem mais participa dessa decisão?"' },
      { icon: '🎯', titulo: 'N — Need (Necessidade)', html: 'O problema é real e o cliente reconhece? <strong>Pergunte:</strong> "O que te motivou a buscar uma solução agora?"' },
      { icon: '📅', titulo: 'T — Timeline (Prazo)', html: 'Quando pretende resolver? <strong>Pergunte:</strong> "Pra quando você gostaria de ter isso resolvido?"' },
    ]},

    { tipo: 'titulo', texto: 'Pipeline: as 7 etapas do processo TDF' },
    { tipo: 'checklist', titulo: 'Etapas do pipeline comercial', itens: [
      '1. Lead recebido — entrou por formulário, WhatsApp, indicação ou prospecção ativa',
      '2. Primeiro contato — SDR liga/envia mensagem em até 5 minutos (speed-to-lead)',
      '3. Qualificação BANT — SDR valida necessidade, orçamento, decisor e prazo',
      '4. Visita agendada — técnico + closer agendam visita na residência/empresa',
      '5. Visita realizada — diagnóstico técnico da água e apresentação da solução',
      '6. Proposta enviada — orçamento formal com opções e condições de pagamento',
      '7. Fechamento — assinatura, pagamento e agendamento da instalação (R$ 590)',
    ]},

    { tipo: 'titulo', texto: 'Speed-to-lead: a regra dos 5 minutos' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Dados que todo vendedor deveria saber',
      html: 'Segundo o estudo clássico de lead response, um lead contactado em <strong>menos de 5 minutos</strong> tem 21x mais chance de ser qualificado do que um contactado em 30 minutos. Após a primeira hora, as chances de qualificação caem drasticamente. <strong>Na TDF: lead chegou = liga agora.</strong>' },

    { tipo: 'dodont',
      fazer: [
        'Medir todas as etapas do funil semanalmente.',
        'Contactar todo lead em menos de 5 minutos.',
        'Separar claramente as funções de SDR e Closer.',
        'Investir em Seeds: peça indicação a todo cliente satisfeito.',
        'Registrar cada interação no CRM sem exceção.',
      ],
      evitar: [
        'Achar que "semana que vem recupero" — pipeline vazio hoje = venda zero em 15 dias.',
        'Deixar o closer prospectar — ele perde tempo de fechamento.',
        'Ignorar leads frios — eles podem aquecer com nurturing.',
        'Confundir leads no pipeline com vendas garantidas.',
        'Trabalhar sem meta semanal de cada etapa do funil.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Segundo Aaron Ross, qual tipo de lead tem maior taxa de conversão?',
      opcoes: [
        'Nets (Redes) — leads de marketing inbound',
        'Spears (Lanças) — prospecção ativa',
        'Seeds (Sementes) — indicações e boca a boca',
      ],
      correta: 2,
      explicacao: 'Seeds (indicações) já vêm com confiança do indicador, gerando taxas de 40-60%. Por isso é fundamental pedir indicação a clientes satisfeitos.'
    },
    {
      pergunta: 'Na regra de speed-to-lead, qual é o tempo ideal para primeiro contato?',
      opcoes: [
        'Até 1 hora',
        'Até 5 minutos',
        'Até 24 horas',
      ],
      correta: 1,
      explicacao: 'Leads contactados em menos de 5 minutos têm 21x mais chance de qualificação. Na TDF: lead chegou, liga agora.'
    },
    {
      pergunta: 'Por que Aaron Ross defende separar SDR e Closer?',
      opcoes: [
        'Porque o closer não sabe prospectar.',
        'Porque a separação permite previsibilidade e especialização em cada etapa.',
        'Porque o SDR ganha menos.',
      ],
      correta: 1,
      explicacao: 'A separação permite que cada profissional se especialize e que o gestor meça e otimize cada etapa do funil separadamente.'
    },
  ],

  exercicio: {
    enunciado: 'Monte seu funil de vendas pessoal da última semana: quantos leads recebeu, quantos qualificou, quantos agendou visita, quantos fechou. Identifique o gargalo (onde perde mais) e proponha uma ação para melhorar 10%.',
    dica: 'Se não tem os dados, comece a registrar esta semana. Meça cada etapa. O gargalo mais comum é entre "lead qualificado" e "visita agendada" — trabalhe a urgência na qualificação.'
  },

  resumo: 'Receita Previsível ensina que vendas previsíveis vêm de um funil medido em cada etapa. Os 3 tipos de lead (Seeds, Nets, Spears) alimentam o pipeline. A separação SDR/Closer permite especialização. Speed-to-lead (5 min) é crítico. BANT qualifica. Medir semanalmente garante que o pipeline nunca seque.'
};
