// ============================================================================
// MÓDULO 21 — Registro correto no CRM
// ----------------------------------------------------------------------------
// O checklist de campos do CRM é EMBUTIDO automaticamente pela view
// (componente crm-checklist). NÃO recriar a lista de campos aqui.
// ============================================================================

module.exports = {
  resumoCurto: 'Por que registrar tudo no CRM: sem histórico e sem próximo passo com data, a oportunidade morre — e a próxima abordagem começa do zero.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-21-crm-video' },

  blocos: [
    { tipo: 'texto', html: 'O CRM não é burocracia — é a <strong>memória da venda</strong>. Cada informação registrada é o que permite que você (ou outro consultor) retome a conversa exatamente de onde parou, sem fazer o cliente repetir tudo e sem perder o timing. O que não está no CRM, na prática, <strong>não aconteceu</strong>.' },

    { tipo: 'titulo', texto: 'Por que registrar tudo' },
    { tipo: 'cards', itens: [
      { icon: '🧠', titulo: 'Memória que não falha', html: 'Você atende dezenas de clientes. O registro guarda o pico, a aplicação e as objeções de cada um — sua cabeça não guarda.' },
      { icon: '🤝', titulo: 'Continuidade', html: 'Se você faltar ou sair, outro consultor assume sem o cliente ter que recomeçar do zero.' },
      { icon: '⏱️', titulo: 'Timing certo', html: 'O próximo passo com data faz o CRM lembrar você na hora certa — nada esfria esquecido.' },
      { icon: '📊', titulo: 'Decisão da gestão', html: 'Motivo de perda e histórico alimentam o que a empresa melhora em produto, preço e processo.' },
    ]},

    { tipo: 'callout', variante: 'perigo', titulo: 'Regra inegociável',
      html: '<strong>Nenhuma oportunidade pode ficar sem próximo passo e sem data.</strong> Um negócio sem próxima ação agendada é um negócio abandonado — ele simplesmente vai esfriar até morrer. Antes de encerrar qualquer atendimento, defina o que vem a seguir e quando.' },

    { tipo: 'titulo', texto: 'O que registrar com atenção especial' },
    { tipo: 'texto', html: 'Além de preencher os campos, alguns registros mudam o rumo da venda e precisam de capricho:' },
    { tipo: 'cards', itens: [
      { icon: '🔀', titulo: 'Modelo recomendado × solicitado', html: 'Se o cliente pediu um modelo mas você recomendou outro (pelo pico e recuperação de temperatura), registre os dois e o porquê. Isso protege a venda e evita retrabalho na entrega.' },
      { icon: '👤', titulo: 'Decisor', html: 'Quem realmente aprova a compra? Registrar o decisor e seu papel direciona todo o follow-up para quem tem a caneta.' },
      { icon: '➕', titulo: 'Upsell apresentado / aceito', html: 'Marque se os refis foram apresentados e se foram aceitos ou recusados. Recusa vira gancho documentado para a próxima troca.' },
      { icon: '❌', titulo: 'Motivo de perda', html: 'Quando não fecha, registre o porquê real (preço, prazo, concorrente, sumiu). É o dado mais valioso para reabordar e para a empresa corrigir rota.' },
    ]},

    { tipo: 'texto', html: 'O registro de <strong>modelo recomendado × solicitado</strong> merece destaque: é ele que documenta você como <strong>consultor</strong>, não como tirador de pedido. Se a entrega ou o cliente questionar depois, o histórico mostra que a recomendação foi técnica e fundamentada no pico de consumo.' },

    { tipo: 'dodont',
      fazer: [
        'Registrar logo após o contato, enquanto está fresco.',
        'Sempre deixar um próximo passo com data marcada.',
        'Anotar o modelo recomendado e o solicitado, com o porquê.',
        'Registrar o motivo real da perda, mesmo quando é desconfortável.',
      ],
      evitar: [
        'Deixar para "atualizar depois" — depois vira nunca.',
        'Fechar o atendimento sem próxima ação agendada.',
        'Registrar motivo de perda genérico ("não quis") sem o real.',
        'Confiar só na memória para pico, decisor e objeções.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual é a regra inegociável de registro no CRM?',
      opcoes: [
        'Preencher o e-mail do cliente em todo cadastro.',
        'Nenhuma oportunidade pode ficar sem próximo passo e sem data.',
        'Registrar apenas os negócios que fecharam.',
      ],
      correta: 1,
      explicacao: 'Oportunidade sem próxima ação agendada esfria e morre. O próximo passo com data é o que mantém o negócio vivo e no timing certo.'
    },
    {
      pergunta: 'Por que registrar o modelo recomendado além do modelo solicitado?',
      opcoes: [
        'Para ocupar mais campos no sistema.',
        'Porque documenta a recomendação técnica (pico, recuperação de temperatura) e protege a venda contra retrabalho e questionamentos.',
        'Porque o cliente pediu por escrito.',
      ],
      correta: 1,
      explicacao: 'Registrar os dois e o porquê mostra que a recomendação foi consultiva e fundamentada, evitando erro na entrega e sustentando a venda se houver questionamento.'
    },
    {
      pergunta: 'O negócio não fechou. O que fazer no CRM?',
      opcoes: [
        'Apagar a oportunidade para limpar o funil.',
        'Registrar o motivo de perda real (preço, prazo, concorrente, sumiu).',
        'Marcar como perdido sem explicar o porquê.',
      ],
      correta: 1,
      explicacao: 'O motivo de perda real é o dado mais valioso para reabordar o cliente no futuro e para a empresa corrigir produto, preço e processo.'
    },
  ],

  exercicio: {
    enunciado: 'Você acabou de atender um cliente que pediu um modelo menor, mas você recomendou um maior por causa do pico; ele vai levar a proposta para o dono decidir. Descreva o que você registraria no CRM antes de encerrar o atendimento.',
    dica: 'Inclua: modelo solicitado × recomendado e o porquê, quem é o decisor, se o upsell foi apresentado, e — obrigatório — o próximo passo com data.'
  },

  resumo: 'O CRM é a memória da venda: o que não está registrado não aconteceu. Regra inegociável — nenhuma oportunidade sem próximo passo e sem data. Registre com atenção o modelo recomendado × solicitado (e o porquê), o decisor, o upsell apresentado/aceito e o motivo de perda real. Atualize na hora, nunca "depois".'
};
