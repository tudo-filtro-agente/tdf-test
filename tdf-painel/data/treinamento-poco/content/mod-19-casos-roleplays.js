// ============================================================================
// MÓDULO 19 — Casos reais & Roleplays (fechamento prático da academia de Poço)
// Conecta a teoria dos módulos anteriores com a prática dos roleplays.
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js.
//
// REGRA DE OURO (a mesma dos roleplays): PEDIR/INTERPRETAR a análise →
// SONDAGEM HIDRÁULICA (incl. vazão de RETROLAVAGEM) → CONFIRMAR parâmetro E
// unidade → NÃO prometer potabilidade/remoção → ENCAMINHAR ao especialista
// quando houver risco → prever NOVA ANÁLISE pós-tratamento.
// ============================================================================

module.exports = {
  resumoCurto: 'Hora de treinar de verdade: cenários reais de água de poço para praticar diagnóstico, escuta e recusa responsável — antes de falar com o cliente de carne e osso.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-casos-roleplays-video' },

  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'Do conteúdo para a prática',
      html: 'Você já viu os fundamentos, os parâmetros e as tecnologias. Agora vem a parte que separa o closer que sabe do closer que aplica: <strong>conduzir o atendimento sob pressão</strong>. Cada caso deste módulo é uma situação que aparece de verdade no dia a dia da água de poço.' },

    { tipo: 'titulo', texto: 'Por que treinar em casos reais' },
    { tipo: 'texto', html: 'Saber a teoria não garante que você vai reagir certo quando o cliente estiver com pressa, achando que já sabe o diagnóstico, ou pedindo <strong>preço na hora</strong>. Os roleplays existem pra você errar aqui — no treino — e não na frente do cliente. Em cada passo você escolhe uma resposta e recebe feedback: <strong>por que</strong> a resposta é boa ou ruim, o <strong>risco</strong> que ela cria e como <strong>melhorar</strong>.' },
    { tipo: 'texto', html: 'A régua de avaliação é sempre a mesma regra de ouro: começar pela <strong>análise</strong>, fazer a <strong>sondagem hidráulica</strong> (incluindo a vazão de <strong>retrolavagem</strong>), <strong>confirmar o parâmetro e a unidade</strong>, <strong>nunca prometer</strong> potabilidade ou remoção, <strong>encaminhar ao especialista</strong> diante de risco e prever <strong>nova análise</strong> depois do tratamento.' },

    { tipo: 'titulo', texto: 'Os tipos de caso que você vai treinar' },
    { tipo: 'cards', itens: [
      { icon: '🟠', titulo: 'Ferro alto', html: 'Mancha amarela/laranja. Levantar hipótese sem cravar, confirmar ferro (mg/L) no laudo e checar vazão de retrolavagem.' },
      { icon: '⚫', titulo: 'Ferro + manganês', html: 'Mancha preta junto da amarela. Dois parâmetros, condição de oxidação sensível — caso de dimensionar com especialista.' },
      { icon: '🟡', titulo: 'Água amarelada (causa desconhecida)', html: 'Pode ser ferro, cor orgânica ou turbidez. Não diagnosticar por foto: análise que separe cor, turbidez e ferro.' },
      { icon: '🧱', titulo: 'Dureza alta', html: 'Crosta branca, sabão sem espuma. Dureza dissolvida ≠ filtragem de partícula; abrandador depende de vazão de regeneração.' },
      { icon: '🦠', titulo: 'Coliformes totais', html: 'Alerta microbiológico a investigar. Encaminhar ao especialista; desinfecção tem pré-requisitos, não é "mata tudo".' },
      { icon: '☣️', titulo: 'E. coli', html: 'Contaminação fecal, risco sério. Orientar fonte segura, não liberar consumo, acionar especialista com urgência.' },
      { icon: '💧', titulo: 'Nitrato alto', html: 'Invisível ao olho, crítico com bebês. Tecnologia compatível dimensionada por especialista; nunca tranquilizar por aparência.' },
      { icon: '🌫️', titulo: 'Amônia', html: 'Mais que "cheiro": possível indicador de contaminação e interfere na desinfecção. Investigar origem com especialista.' },
      { icon: '🍵', titulo: 'Cor orgânica', html: 'Aspecto de chá, dissolvida. Filtro de sedimentos não segura; tecnologia compatível dimensionada por laudo.' },
      { icon: '🏠', titulo: 'Residência', html: 'Uso doméstico e consumo humano. Cruzar objetivo do cliente com análise e hidráulica da casa.' },
      { icon: '🏢', titulo: 'Condomínio', html: 'Volume e vazão maiores, múltiplos usuários. Dimensionamento e responsabilidade ampliados — apoio do especialista.' },
      { icon: '🏭', titulo: 'Indústria', html: 'Requisitos de processo específicos. Objetivo técnico define os parâmetros; nada de solução de prateleira.' },
      { icon: '📄', titulo: 'Sem análise', html: 'Cliente decidido a comprar sem laudo. Análise é pré-requisito inegociável; recusar o pacote genérico.' },
      { icon: '🗓️', titulo: 'Análise antiga', html: 'Laudo de anos atrás. Serve de histórico/baseline, mas água muda: exigir análise recente para dimensionar.' },
      { icon: '⬇️', titulo: 'Vazão insuficiente para retrolavagem', html: 'Gravidade fraca não retrolava o leito. Medir vazão, corrigir hidráulica ou rever rota com especialista.' },
      { icon: '📦', titulo: 'Equipamento isolado', html: 'Cliente quer só "o tanque". Recusar a solução universal; a proposta nasce do diagnóstico, não do produto.' },
      { icon: '🚫', titulo: 'Garantia impossível', html: 'Pedido de "garanta que fica potável". Nunca prometer potabilidade/remoção; comprovar com nova análise pós-tratamento.' },
    ]},

    { tipo: 'callout', variante: 'sucesso', titulo: 'Agora vá para a aba de Roleplays',
      html: 'Este módulo é o mapa; o treino acontece na aba <strong>Roleplays</strong>. Faça <strong>todos os cenários</strong> (todos são obrigatórios), leia o feedback de cada opção — inclusive o das respostas erradas — e repita até acertar por convicção, não por decoreba. Se travar num caso, volte ao módulo correspondente e depois refaça o roleplay.' },

    { tipo: 'dodont',
      fazer: [
        'Tratar cada caso como um cliente real: acolher, perguntar e conduzir pela análise.',
        'Confirmar sempre o parâmetro E a unidade antes de propor qualquer coisa.',
        'Fazer a sondagem hidráulica, incluindo a vazão de retrolavagem/regeneração.',
        'Encaminhar ao especialista diante de risco microbiológico, contaminação ou complexidade.',
        'Prever nova análise depois do tratamento para comprovar o resultado.',
      ],
      evitar: [
        'Cravar o diagnóstico pelo sintoma, pela cor ou por foto.',
        'Prometer potabilidade, remoção total ou resultado "garantido".',
        'Vender equipamento isolado ou tanque como solução universal.',
        'Inventar valor, dosagem, vazão ou tecnologia sem base no laudo.',
        'Usar aparência ("ficou transparente") como prova de que resolveu.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'No roleplay, qual é a régua que define se uma resposta é "adequada"?',
      opcoes: [
        'Fechar a venda o mais rápido possível para não perder o cliente.',
        'Começar pela análise, sondar a hidráulica, confirmar parâmetro e unidade, não prometer, encaminhar diante de risco e prever nova análise.',
        'Oferecer sempre o sistema mais completo para resolver de uma vez.',
      ],
      correta: 1,
      explicacao: 'A régua é a regra de ouro da água de poço: diagnóstico e responsabilidade antes de proposta. Velocidade de venda e "pacote completo" não são critérios de acerto.'
    },
    {
      pergunta: 'Um cliente pede que você "garanta que a água vai ficar potável" depois do equipamento. Qual conduta é a correta no treino?',
      opcoes: [
        'Garantir a potabilidade para fechar, já que o equipamento é bom.',
        'Nunca prometer potabilidade; encaminhar ao especialista quando houver risco e comprovar o resultado com nova análise pós-tratamento.',
        'Dizer que se a água ficar transparente já está potável.',
      ],
      correta: 1,
      explicacao: 'Potabilidade nunca se promete no discurso. Diante de risco, encaminha-se ao especialista, e a comprovação vem de laudo pós-tratamento — não da aparência.'
    },
  ],

  exercicio: {
    enunciado: 'Escolha dois casos que você achou mais difíceis nos roleplays (por exemplo, E. coli e "cliente sem análise"). Para cada um, escreva em 2–3 frases como você conduziria o atendimento aplicando a regra de ouro, sem prometer nada e deixando claro o próximo passo (análise, hidráulica ou encaminhamento ao especialista).',
    dica: 'Ancore em "diagnóstico antes de proposta" e sempre feche indicando o próximo passo concreto — nunca uma promessa.'
  },

  resumo: 'Os roleplays transformam a teoria em reflexo. Em todos os cenários — de ferro a E. coli, de dureza a vazão insuficiente — a resposta certa segue a mesma régua: análise primeiro, sondagem hidráulica com vazão de retrolavagem, confirmação de parâmetro e unidade, nada de promessa de potabilidade ou remoção, encaminhamento ao especialista diante de risco e nova análise depois do tratamento. Treine na aba de Roleplays até isso virar automático.'
};
