// ============================================================================
// MÓDULO — ICP, Personas e Jornada do Lead (dados REAIS do CRM)
// Ancorado 100% em dados do Zoho CRM (extração 06/jul/2026): 409 deals ganhos
// da linha Poço/Iron Free. Nenhum número inventado. Fonte: ~/tdf-crm-icp-analysis/.
// ============================================================================

module.exports = {
  resumoCurto: 'Quem compra tratamento de poço (dados do CRM), a dor que traz o cliente, o ciclo mais longo — e o alerta real: Iron Free puro converte muito menos que a Fibra.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-icp-jornada-video' },

  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'Baseado em dados reais do CRM',
      html: 'Tudo aqui vem do <strong>Zoho CRM</strong> — <strong>409 vendas fechadas</strong> de poço (win rate 20,9%). Retrato de quem realmente compra.' },

    { tipo: 'callout', variante: 'perigo', titulo: '🚨 O alerta que todo closer de poço precisa saber',
      html: 'Nos dados: <strong>Iron Free puro converte só 7,4%</strong> (48 fechados em 605) — enquanto a <strong>Fibra converte 27,7%</strong> (360 em 939). Ou seja: a linha se <strong>sustenta pela Fibra</strong>, e o Iron Free grande vendido "solto" quase não fecha. Se você está empurrando Iron Free puro sem <strong>análise + qualificação de verdade</strong>, os números dizem que vai perder. Confirme a água, a hidráulica e o objetivo antes — e monte a solução certa (muitas vezes com Fibra), não o produto isolado.' },

    { tipo: 'titulo', texto: 'O ICP do poço — quem compra' },
    { tipo: 'cards', itens: [
      { icon: '🏠', titulo: 'Perfil', html: 'Dono de imóvel com <strong>poço / água não tratada</strong>. Tipo de água: Poço 43%, Estação 39%, Mina 9% (misto — nem todo "poço" é poço puro).' },
      { icon: '💰', titulo: 'Ticket', html: 'Mediano <strong>R$3.390</strong> (maior que filtro de entrada); média R$6.561 com cauda até R$72.400 em projetos grandes.' },
      { icon: '🗺️', titulo: 'Região', html: 'SP 59%, mas <strong>pulverizado</strong> — interior, RJ, MG. Menos concentrado que bebedouro/filtro.' },
      { icon: '🔧', titulo: 'Produtos que fecham', html: 'Fibra 1000/2000/3000 são o carro-chefe. Iron Free grande raramente fecha sozinho.' },
    ]},

    { tipo: 'titulo', texto: 'A dor que traz o cliente (persona)' },
    { tipo: 'texto', html: 'A dor mais forte aqui é <strong>"água amarela / com ferro"</strong> — é o gatilho nº1 do poço. Depois vêm "quero melhorar a qualidade" e "água com barro/sujeira". A persona é o <strong>dono do imóvel incomodado com a água</strong>: mancha, cor, sedimento, desconfiança.' },
    { tipo: 'perguntas', titulo: 'Gatilhos reais (queixas mais comuns no CRM)', itens: [
      'Água amarela / com possibilidade de ferro (a dor nº1)',
      'Quero melhorar a qualidade da água',
      'Água com barro / sujeira / sedimento',
      'Não confio na água que recebo',
    ]},
    { tipo: 'especialista', nome: 'análises', icon: '🧑‍🔬',
      html: 'Repare: a dor é visível (cor, mancha, barro), mas a SOLUÇÃO depende de análise. É por isso que o ciclo é mais longo — e é por isso que o Iron Free puro sem qualificação falha.' },

    { tipo: 'titulo', texto: 'A jornada do lead' },
    { tipo: 'tabela',
      head: ['Sinal do CRM', 'Número real', 'O que muda pra você'],
      rows: [
        ['Ciclo de venda', '<strong>9,5 dias</strong> (mediano)', 'É consultivo, não transacional. Precisa de análise + acompanhamento. Follow-up com valor é essencial.'],
        ['Origem', '80% pago (Google 46% + Meta 34%)', 'Lead vem de anúncio com a dor à flor da pele — chegue confirmando a dor, não empurrando produto.'],
        ['Pipeline', '"Funil água não tratada"', 'Fluxo consultivo: diagnóstico antes da proposta.'],
        ['Sazonalidade', 'Pico ago–set (seca)', 'Na estiagem a água piora e a procura sobe. Prepare-se para o pico.'],
      ]
    },
    { tipo: 'callout', variante: 'sucesso', titulo: 'A lição prática',
      html: 'Poço é <strong>consultivo</strong> (ciclo ~10 dias): confirme a dor visível, peça a análise, faça a sondagem hidráulica e monte a solução certa — normalmente com <strong>Fibra</strong>, não Iron Free solto. Follow-up com valor mantém o lead vivo nos ~10 dias. E lembre da sazonalidade: ago–set puxa demanda.' },

    { tipo: 'dodont',
      fazer: [
        'Confirmar a dor (água amarela/ferro é o gatilho nº1) e pedir a análise.',
        'Montar a solução pela análise + hidráulica — Fibra converte 3,7× mais que Iron Free puro.',
        'Fazer follow-up com valor ao longo do ciclo de ~10 dias.',
        'Preparar-se para o pico de ago–set (seca).',
      ],
      evitar: [
        'Empurrar Iron Free grande "solto" sem análise (7,4% de conversão — os dados provam).',
        'Tratar como venda de 1 dia (o ciclo real é ~10 dias).',
        'Prometer solução sem análise (você viu isso nos módulos técnicos).',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Os dados do CRM mostram que, entre Iron Free puro e Fibra, o que converte melhor?',
      opcoes: [
        'Iron Free puro, de longe.',
        'Fibra (27,7%) converte cerca de 3,7× mais que Iron Free puro (7,4%).',
        'Os dois convertem igual.',
      ],
      correta: 1,
      explicacao: 'Iron Free puro fecha só 7,4% (48/605) vs Fibra 27,7% (360/939). A linha se sustenta pela Fibra — Iron Free grande solto quase não fecha.'
    },
    {
      pergunta: 'Qual é a dor (gatilho) nº1 que traz o cliente de poço, segundo o CRM?',
      opcoes: [
        'Preço alto da conta de água.',
        'Água amarela / com ferro (mancha, cor, sedimento).',
        'Falta de água na rede.',
      ],
      correta: 1,
      explicacao: '"Água amarela / com possibilidade de ferro" é a queixa mais comum na linha de poço. A dor é visível; a solução depende de análise.'
    },
  ],

  exercicio: {
    enunciado: 'Um lead de poço chega dizendo "minha água tá amarela". Sabendo que o ciclo é de ~10 dias e que Iron Free puro converte mal, descreva sua condução: o que confirma, o que pede, e por que você NÃO fecha na primeira conversa.',
    dica: 'Confirmar dor → pedir análise → sondagem hidráulica → solução (provável Fibra) → follow-up com valor ao longo dos ~10 dias.'
  },

  resumo: 'Dados do CRM (409 vendas): cliente de poço é dono de imóvel incomodado com a água (dor nº1 = amarela/ferro), ticket mediano R$3.390, região pulverizada, ciclo consultivo de ~10 dias, 80% de tráfego pago e pico na seca (ago–set). O alerta central: Iron Free puro converte só 7,4% vs Fibra 27,7% — não empurre o produto isolado; qualifique, analise e monte a solução certa. Follow-up com valor sustenta o ciclo longo.'
};
