// ============================================================================
// MÓDULO 6 — Gestão do Tempo — Regra 80/20 de Chet Holmes
// Baseado em: A Máquina Definitiva de Vendas — Chet Holmes
// ============================================================================

module.exports = {
  resumoCurto: 'Aplique a regra 80/20 e as técnicas de Chet Holmes para focar nas atividades que realmente geram resultado em vendas de tratamento de água.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-06-video' },

  blocos: [
    { tipo: 'texto', html: 'Chet Holmes, em <em>A Máquina Definitiva de Vendas</em>, defende que a maioria dos vendedores gasta 80% do tempo em atividades que geram apenas 20% do resultado. O vendedor de alta performance <strong>inverte essa proporção</strong>: dedica a maior parte do dia às atividades de maior impacto e automatiza ou elimina o resto.' },

    { tipo: 'titulo', texto: 'A regra 80/20 aplicada a vendas TDF' },
    { tipo: 'tabela',
      head: ['20% que geram 80% do resultado', '80% que geram só 20%'],
      rows: [
        ['Ligações de follow-up para leads quentes', 'Organizar planilhas e relatórios'],
        ['Visitas técnicas com decisor presente', 'Responder e-mails que não são de clientes'],
        ['Apresentações de solução com SPIN', 'Reuniões internas sem pauta definida'],
        ['Pedir indicações a clientes satisfeitos', 'Ficar no WhatsApp respondendo curiosos'],
        ['Tratar objeções e fechar vendas', 'Procurar informação que deveria estar no CRM'],
      ]
    },

    { tipo: 'titulo', texto: 'O método das 6 tarefas prioritárias' },
    { tipo: 'texto', html: 'Chet Holmes ensina: todo dia, antes de começar, liste as <strong>6 tarefas mais importantes</strong> do dia. Faça a primeira antes de abrir e-mail, WhatsApp ou qualquer distração. Só passe para a segunda quando terminar a primeira.' },
    { tipo: 'texto', html: 'Essa lista faz parte das <strong>6 etapas de gestão do tempo de Chet Holmes</strong>: (1) <strong>toque uma vez só</strong> (<em>touch it once</em>) — se decidiu abrir um e-mail ou mensagem, resolva na hora, nada de "deixar pra depois"; (2) liste as 6 tarefas mais importantes do dia; (3) estime quanto tempo cada uma vai levar; (4) planeje o dia em agenda, com hora marcada; (5) priorize — a mais importante primeiro; (6) pergunte-se <em>"vai me prejudicar descartar isso?"</em> antes de acumular tarefas e pendências que não geram venda.' },
    { tipo: 'checklist', titulo: 'Exemplo de lista diária de um Closer TDF', itens: [
      '1. Ligar para 3 leads quentes do dia anterior (follow-up)',
      '2. Preparar proposta para cliente que fez visita ontem',
      '3. Fazer 2 ligações de fechamento pendentes',
      '4. Agendar 2 visitas técnicas para a semana',
      '5. Pedir indicação para cliente que recebeu instalação',
      '6. Atualizar pipeline no CRM',
    ]},

    { tipo: 'titulo', texto: 'Time-blocking: blocos de tempo para vendas' },
    { tipo: 'texto', html: 'Divida seu dia em <strong>blocos de tempo</strong> dedicados a um único tipo de atividade. Multitarefa é inimigo da produtividade em vendas.' },
    { tipo: 'tabela',
      head: ['Horário', 'Bloco', 'Atividade'],
      rows: [
        ['08:00–09:00', '🔥 Power Hour', 'Ligações de follow-up e fechamento (zero distração)'],
        ['09:00–10:30', '📞 Prospecção', 'Ligações para leads novos e qualificação'],
        ['10:30–11:00', '☕ Admin', 'E-mails, CRM, mensagens pendentes'],
        ['11:00–12:00', '📋 Propostas', 'Elaborar e enviar propostas comerciais'],
        ['13:00–15:00', '🚗 Visitas', 'Visitas técnicas agendadas'],
        ['15:00–16:00', '📞 Follow-up', 'Retornar para leads que não atenderam de manhã'],
        ['16:00–17:00', '📊 Planejamento', 'Preparar lista do dia seguinte, atualizar pipeline'],
      ]
    },

    { tipo: 'callout', variante: 'alerta', titulo: 'A armadilha do WhatsApp',
      html: 'O WhatsApp é essencial para vendas, mas também é o maior <strong>ladrão de tempo</strong>. Defina horários para responder mensagens (ex: 9h, 12h, 15h, 17h). Fora desses horários, silencie notificações e foque nas atividades de alto impacto.' },

    { tipo: 'titulo', texto: 'Pareto nos clientes: foque nos 20% que geram 80%' },
    { tipo: 'texto', html: 'Nem todo lead merece o mesmo esforço. Classifique seus leads por <strong>potencial de receita × probabilidade de fechamento</strong>:' },
    { tipo: 'cards', itens: [
      { icon: '🔴', titulo: 'Lead A (Hot)', html: 'Decisor identificado, necessidade confirmada, orçamento disponível, prazo definido. <strong>Ação:</strong> prioridade máxima, follow-up diário, agendar visita imediatamente.' },
      { icon: '🟡', titulo: 'Lead B (Warm)', html: 'Interesse real, mas falta algo (decisor, prazo, orçamento). <strong>Ação:</strong> follow-up 2-3x por semana, nutrir com conteúdo relevante.' },
      { icon: '🔵', titulo: 'Lead C (Cold)', html: 'Curioso, pesquisando, sem urgência. <strong>Ação:</strong> follow-up semanal automatizado, não gaste tempo de ligação.' },
    ]},

    { tipo: 'titulo', texto: 'Dream 100 — os 100 clientes dos sonhos' },
    { tipo: 'texto', html: 'Outro conceito central de Chet Holmes é o <strong>Dream 100</strong>: em vez de atirar para todos os lados, liste os 100 clientes ou parceiros ideais — aqueles que, sozinhos, moveriam o ponteiro do faturamento — e trabalhe essa lista com constância e criatividade até conquistá-los. Para a TDF, o Dream 100 pode incluir grandes condomínios, construtoras, administradoras de imóveis, pousadas e indústrias do Vale do Paraíba que comprariam múltiplos Filtros de Entrada, Iron Free ou bebedouros.' },
    { tipo: 'texto', html: 'A lógica é de <strong>persistência educada</strong>: contatos regulares, sempre agregando valor (conteúdo educativo, casos de clientes parecidos, convite para diagnóstico), mês após mês. Holmes ensinava que as grandes contas raramente fecham nos primeiros contatos — quem desiste no segundo toque nunca descobre o tamanho da conta que deixou na mesa.' },

    { tipo: 'titulo', texto: 'Education-Based Marketing e a pirâmide do comprador' },
    { tipo: 'texto', html: 'Holmes também ensina que, em qualquer mercado, apenas <strong>3% dos compradores estão comprando agora</strong>. Outros <strong>7%</strong> estão abertos a ouvir; <strong>30%</strong> não estão pensando no assunto; <strong>30%</strong> acham que não precisam; e <strong>30%</strong> têm certeza de que não precisam. Quem só fala de produto e preço briga pelos mesmos 3% que todos os concorrentes disputam.' },
    { tipo: 'texto', html: 'A saída é o <strong>Education-Based Marketing</strong> (marketing baseado em educação): educar o mercado sobre o <strong>problema</strong> antes de vender a <strong>solução</strong>. Conteúdos como "os sinais de que a água está encurtando a vida útil dos seus equipamentos" atraem e amadurecem quem ainda não está comprando. Na TDF, isso aparece nos conteúdos educativos dos canais da empresa e no próprio discurso do vendedor: quem ensina primeiro, vende depois — com muito menos resistência.' },

    { tipo: 'titulo', texto: 'A regra da "disciplina obstinada" de Chet Holmes' },
    { tipo: 'texto', html: 'Holmes afirma que o sucesso não vem de fazer 4.000 coisas, mas de fazer <strong>12 coisas 4.000 vezes</strong>. Na TDF, isso significa: domine as 12 atividades-chave (qualificação, SPIN, apresentação, objeções, fechamento, follow-up, indicação...) e repita com <strong>disciplina implacável</strong>, todos os dias, sem pular.' },

    { tipo: 'dodont',
      fazer: [
        'Começar o dia pela tarefa de maior impacto (Power Hour).',
        'Usar time-blocking e proteger seus blocos de foco.',
        'Classificar leads em A/B/C e dedicar tempo proporcional.',
        'Medir quanto tempo gasta em cada tipo de atividade por semana.',
        'Eliminar ou delegar atividades que não geram venda.',
      ],
      evitar: [
        'Começar o dia checando e-mail e WhatsApp.',
        'Fazer multitarefa (responder WhatsApp enquanto faz proposta).',
        'Gastar o mesmo tempo com lead C e lead A.',
        'Deixar tarefas administrativas invadirem horário de venda.',
        'Trabalhar sem lista de prioridades diárias.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Segundo a regra 80/20, qual atividade do vendedor TDF gera mais resultado?',
      opcoes: [
        'Organizar planilhas e relatórios.',
        'Fazer follow-up e fechar vendas com leads quentes.',
        'Responder mensagens no WhatsApp o dia todo.',
      ],
      correta: 1,
      explicacao: 'Follow-up e fechamento com leads quentes estão nos 20% de atividades que geram 80% do resultado.'
    },
    {
      pergunta: 'O que é a Power Hour na rotina de vendas da TDF?',
      opcoes: [
        'Uma hora de reunião com a equipe.',
        'A primeira hora do dia dedicada às atividades de maior impacto, sem distração.',
        'Uma hora de treinamento semanal.',
      ],
      correta: 1,
      explicacao: 'A Power Hour é uma prática da TDF, inspirada nos princípios de foco e time-blocking de Chet Holmes: o bloco mais valioso do dia, com ligações de follow-up e fechamento com zero distração.'
    },
    {
      pergunta: 'Um lead tem decisor identificado, necessidade confirmada e prazo definido. Qual a classificação?',
      opcoes: [
        'Lead C (Cold)',
        'Lead B (Warm)',
        'Lead A (Hot)',
      ],
      correta: 2,
      explicacao: 'Lead A (Hot) tem todos os critérios BANT atendidos. Merece prioridade máxima e follow-up diário.'
    },
  ],

  exercicio: {
    enunciado: 'Registre como você gastou seu tempo ontem, hora por hora. Classifique cada atividade como "20% de alto impacto" ou "80% de baixo impacto". Calcule a proporção e crie um time-blocking ideal para amanhã.',
    dica: 'Seja brutalmente honesto. Inclua tempo em WhatsApp, redes sociais e distrações. O objetivo é identificar onde está desperdiçando tempo que poderia ser de venda.'
  },

  resumo: 'A regra 80/20 de Chet Holmes ensina a focar nas atividades de maior impacto: follow-up, fechamento e visitas. Use time-blocking para proteger horários de venda, classifique leads em A/B/C, e comece o dia pela Power Hour. Sucesso em vendas é disciplina implacável nas poucas coisas que realmente importam.'
};
