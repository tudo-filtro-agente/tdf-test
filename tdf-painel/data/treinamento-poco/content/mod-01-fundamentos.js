// ============================================================================
// MÓDULO 1 — Fundamentos da água de poço  (CONTRATO DE SCHEMA da academia de Poço)
// Blocos suportados por views/treinamento/poco/_blocos.ejs:
//   texto | titulo | callout(variante:info|alerta|sucesso|perigo) | card | cards |
//   script | dodont(fazer[],evitar[]) | checklist | tabela | perguntas | exemplo |
//   pendente(html?)  → "Pendente de validação técnica pela Tudo de Filtro" |
//   especialista(nome, icon?, html)  → personagem educacional
//
// perguntasRapidas: [{pergunta, opcoes[], correta:idx, explicacao}]
// exercicio: {enunciado, dica?}   video: sempre presente e vazio (Higgsfield-ready)
//
// REGRA: NÃO inventar valores/limites/soluções técnicas. Onde faltar base oficial,
// usar bloco `pendente`. Limites regulatórios vêm de data/treinamento-poco/parametros-agua.js.
// ============================================================================

module.exports = {
  resumoCurto: 'Por que água de poço transparente não é sinônimo de água potável — e por que o processo começa sempre na análise, não no equipamento.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-01-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'A regra que rege tudo',
      html: 'A Tudo de Filtro <strong>não vende equipamento isolado</strong> por foto, cor da água ou número de pessoas. Água de poço exige <strong>análise laboratorial, diagnóstico hidráulico e dimensionamento</strong>. Nunca apresente um tanque como solução universal, nunca diga que a água é potável só porque ficou transparente, e nunca prometa remoção de contaminante sem análise e tecnologia compatível.' },

    { tipo: 'titulo', texto: 'De onde vem essa água' },
    { tipo: 'cards', itens: [
      { icon: '🕳️', titulo: 'Poço artesiano', html: 'Capta de aquífero confinado, geralmente profundo e sob pressão.' },
      { icon: '🚰', titulo: 'Poço semiartesiano', html: 'Aquífero livre/freático, mais raso; mais sujeito a influência da superfície.' },
      { icon: '🪣', titulo: 'Cisterna / poço escavado', html: 'Raso e largo; maior risco de contaminação por infiltração.' },
      { icon: '⛰️', titulo: 'Mina / nascente', html: 'Afloramento; qualidade varia muito com o entorno e a estação.' },
    ]},
    { tipo: 'texto', html: 'Cada origem tem risco e comportamento diferentes. A profundidade e o tipo de captação ajudam a levantar hipóteses — mas <strong>não substituem a análise</strong>.' },

    { tipo: 'titulo', texto: 'Transparente ≠ potável' },
    { tipo: 'texto', html: 'Águas subterrâneas costumam chegar límpidas e ainda assim conter contaminantes que <strong>não têm cor, cheiro ou gosto</strong> — como nitrato, alguns metais e contaminação microbiológica. O olho não enxerga potabilidade.' },
    { tipo: 'tabela',
      head: ['Grupo de parâmetro', 'O que avalia', 'Dá pra ver a olho nu?'],
      rows: [
        ['Físico', 'Cor, turbidez, odor, aspecto', 'Às vezes'],
        ['Químico', 'pH, dureza, ferro, nitrato, metais…', 'Quase nunca'],
        ['Microbiológico', 'Coliformes, E. coli…', 'Nunca'],
      ]
    },
    { tipo: 'callout', variante: 'info', titulo: 'Os limites ficam na fonte oficial',
      html: 'Os valores de referência (VMP) deste treinamento vêm de <strong>arquivo de configuração</strong> associado à <strong>Portaria GM/MS nº 888/2021</strong> — nunca de memória nem de blog. Enquanto um valor não for validado pela Tudo de Filtro, ele aparece como "pendente de validação técnica".' },

    { tipo: 'titulo', texto: 'Uma tecnologia não resolve tudo' },
    { tipo: 'texto', html: 'Filtrar partícula é diferente de tratar dureza dissolvida, que é diferente de desinfetar, que é diferente de remover nitrato. Cada problema pede a tecnologia compatível — por isso o processo é <strong>diagnóstico → solução</strong>, e não "vende o tanque".' },

    { tipo: 'especialista', nome: 'análises', icon: '🧑‍🔬',
      html: 'Sou o especialista didático que te ensina a ler o laudo. Regra nº1: sem laudo recente e legível, você ainda não sabe o que a água tem — e não pode prometer nada.' },

    { tipo: 'dodont',
      fazer: [
        'Começar pela origem da água e pelo objetivo do cliente.',
        'Pedir/interpretar a análise laboratorial antes de propor.',
        'Assumir a responsabilidade de falar de água para consumo humano com cuidado.',
      ],
      evitar: [
        'Dizer que a água é potável porque "ficou transparente".',
        'Prometer remover contaminante sem análise e tecnologia compatível.',
        'Apresentar um tanque como solução universal.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente diz: "minha água é cristalina, então é boa". Qual a melhor resposta técnica?',
      opcoes: [
        'Concordar: se está transparente, está potável.',
        'Explicar que transparência é um parâmetro físico e não garante potabilidade — vários contaminantes não têm cor/cheiro/gosto e só a análise mostra.',
        'Recomendar o maior tanque para garantir.',
      ],
      correta: 1,
      explicacao: 'Transparência não indica ausência de nitrato, metais ou contaminação microbiológica. Só a análise laboratorial responde.'
    },
    {
      pergunta: 'Por que "uma única tecnologia" costuma ser resposta errada em água de poço?',
      opcoes: [
        'Porque encarece a proposta.',
        'Porque problemas diferentes (partícula, dureza, desinfecção, nitrato) exigem tecnologias diferentes e compatíveis.',
        'Porque o cliente prefer vários equipamentos.',
      ],
      correta: 1,
      explicacao: 'Cada parâmetro fora do padrão pede a etapa de tratamento adequada. A solução vem do diagnóstico, não de um produto padrão.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente pede orçamento de "um filtro para poço" enviando só uma foto da água limpa. Escreva, em 2–3 frases, como você explicaria por que precisa da análise antes de propor qualquer coisa — sem desmerecer o cliente.',
    dica: 'Ancore em "transparente não é potável" e "cada problema pede uma tecnologia".'
  },

  resumo: 'Água de poço pode parecer limpa e ainda ter contaminantes invisíveis. O trabalho começa na origem + objetivo + análise laboratorial, nunca no equipamento. Uma tecnologia não resolve tudo, e todo limite regulatório vem de fonte oficial (Portaria 888/2021), não de memória.'
};
