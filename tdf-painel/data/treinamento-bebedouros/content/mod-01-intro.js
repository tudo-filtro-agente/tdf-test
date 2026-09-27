// ============================================================================
// MÓDULO 1 — Introdução ao mercado de bebedouros industriais
// ----------------------------------------------------------------------------
// Este arquivo é o CONTRATO DE SCHEMA de todo módulo. Os demais módulos seguem
// exatamente a mesma forma. Blocos suportados pelo renderizador (views/.../_blocos.ejs):
//
//  { tipo:'texto',    html }                              → parágrafo (aceita <strong> <em> <br>)
//  { tipo:'titulo',   texto }                             → subtítulo de seção
//  { tipo:'callout',  variante:'info|alerta|sucesso|perigo', titulo, html }
//  { tipo:'card',     titulo, icon?, html }               → 1 card destacado
//  { tipo:'cards',    itens:[{titulo, icon?, html}] }     → grid de cards
//  { tipo:'script',   contexto, fala }                    → fala pronta (botão copiar)
//  { tipo:'dodont',   fazer:[..], evitar:[..] }           → o que fazer / o que NÃO prometer
//  { tipo:'checklist',titulo?, itens:[..] }
//  { tipo:'tabela',   head:[..], rows:[[..]] }
//  { tipo:'perguntas',titulo?, itens:[..] }               → perguntas de descoberta
//  { tipo:'exemplo',  cliente, closer }                   → diálogo cliente↔closer
//  { tipo:'componente', ref:'anatomia|comparador|calculadora|bant|upsell|crm-checklist' }
//
// perguntasRapidas: verificação de conhecimento DENTRO do módulo (não é a prova).
//   [{ pergunta, opcoes:[..], correta:<idx>, explicacao }]
// exercicio: { enunciado, dica? }  (reflexão prática ao fim do módulo)
// video: SEMPRE presente e vazio — pronto pra receber vídeo do Higgsfield depois.
// ============================================================================

module.exports = {
  resumoCurto: 'O que é um bebedouro industrial, para quem serve e por que o dimensionamento correto é o coração da venda consultiva.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-01-video' },

  blocos: [
    { tipo: 'texto', html: 'Um <strong>bebedouro industrial</strong> é um equipamento de água gelada projetado para <strong>alto volume e uso intenso</strong>. Ele não compete com o purificador residencial nem com o bebedouro de galão — resolve um problema diferente: manter água gelada disponível para <strong>muitas pessoas ao mesmo tempo</strong>, sem depender de troca manual de garrafão.' },

    { tipo: 'titulo', texto: 'O cliente não compra um reservatório' },
    { tipo: 'texto', html: 'Esse é o erro nº1 do vendedor iniciante: falar de litros. O cliente não compra litros. Ele compra <strong>o que os litros entregam</strong>.' },
    { tipo: 'cards', itens: [
      { icon: '❄️', titulo: 'Água gelada no pico', html: 'Que continua gelada justamente na hora de maior consumo — não só de manhã cedo.' },
      { icon: '😌', titulo: 'Menos reclamação', html: 'Funcionário e cliente param de reclamar de água quente ou de falta d\'água.' },
      { icon: '🔄', titulo: 'Fim da troca de galão', html: 'Ninguém precisa parar a operação para levantar e trocar garrafão.' },
      { icon: '🛡️', titulo: 'Estrutura que aguenta', html: 'Inox e torneira metálica para uso pesado, não plástico que quebra.' },
      { icon: '✅', titulo: 'Segurança na escolha', html: 'Um consultor dimensionou certo — não é chute.' },
      { icon: '⚙️', titulo: 'Praticidade', html: 'Ligado na rede de água, sem logística de galão.' },
    ]},

    { tipo: 'titulo', texto: 'Bebedouro industrial × purificador × galão' },
    { tipo: 'tabela',
      head: ['', 'Bebedouro industrial', 'Purificador residencial', 'Bebedouro de galão'],
      rows: [
        ['Público', 'Empresas, indústria, escola, obra', 'Casa / família', 'Sala pequena / uso leve'],
        ['Volume', 'Alto, uso intenso', 'Baixo', 'Baixo a médio'],
        ['Refrigeração', 'Compressor + serpentina inox', 'Compressor pequeno / eletrônico', 'Compressor pequeno'],
        ['Estrutura', 'Todo em inox', 'Plástico / inox parcial', 'Plástico'],
        ['Água', 'Ligado na rede', 'Ligado na rede', 'Depende de galão'],
      ]
    },

    { tipo: 'titulo', texto: 'Onde ele é indicado' },
    { tipo: 'texto', html: 'Indústrias, fábricas, galpões, centros logísticos, escritórios, academias, escolas, universidades, hospitais, clínicas, construção civil, padarias, restaurantes, supermercados, igrejas, condomínios, órgãos públicos e eventos. Cada ambiente tem um perfil de consumo diferente — você verá isso no módulo de ICP.' },

    { tipo: 'callout', variante: 'alerta', titulo: 'A regra de ouro deste treinamento',
      html: 'Nunca recomende um modelo <strong>só pelo número total de pessoas</strong>. O que define o modelo é o <strong>pico de consumo</strong> — quantas pessoas usam ao mesmo tempo — e a capacidade de <strong>recuperar a temperatura</strong>. Capacidade do reservatório <strong>não</strong> é limite diário de água.' },

    { tipo: 'dodont',
      fazer: [
        'Entender o cenário antes de falar preço.',
        'Falar de conforto, pico e recuperação de temperatura.',
        'Assumir a responsabilidade da recomendação como consultor.',
      ],
      evitar: [
        'Prometer potabilidade.',
        'Prometer percentual de economia de energia sem laudo.',
        'Tratar "litros do reservatório" como "litros por dia".',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente pergunta: "esse de 100 litros dá pra minha empresa de 100 pessoas?" Qual a melhor primeira reação?',
      opcoes: [
        'Sim, 100 litros = 100 pessoas.',
        'Depende: quantas usam ao mesmo tempo no pico? É isso que define o modelo.',
        'Não, você precisa do de 200 litros.',
      ],
      correta: 1,
      explicacao: 'O total de pessoas não define o modelo. O pico de consumo simultâneo e a recuperação da temperatura, sim.'
    },
    {
      pergunta: 'Qual destes NÃO é um benefício que o cliente compra?',
      opcoes: [
        'Água gelada disponível no pico.',
        'Fim da troca manual de galão.',
        'Um reservatório de X litros.',
      ],
      correta: 2,
      explicacao: 'Litros são característica, não benefício. O cliente compra o resultado: conforto, disponibilidade e praticidade.'
    },
  ],

  exercicio: {
    enunciado: 'Escreva, com suas palavras, como você explicaria a um dono de academia por que não basta olhar "quantos alunos tenho". Foque em pico e recuperação de temperatura.',
    dica: 'Use a ideia: "não é quantos alunos no total, é quantos usam o bebedouro no mesmo horário".'
  },

  resumo: 'Bebedouro industrial = água gelada para alto volume e uso intenso. O cliente compra conforto, disponibilidade no pico e praticidade — não litros. O modelo certo depende do pico de consumo e da recuperação de temperatura, nunca só do total de pessoas.'
};
