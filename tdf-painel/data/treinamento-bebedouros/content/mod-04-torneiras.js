// ============================================================================
// MÓDULO 4 — Torneiras metálicas e resistência
// ----------------------------------------------------------------------------
// Torneiras metálicas — modelo Copo (rosca) ou Jato (pressão).
// Regra interna de proposta: torneira JATO custa +R$100 e NÃO acompanha copo.
// Isso é nota interna de precificação, não spec pública do site.
// Schema idêntico ao mod-01-intro.js.
// ============================================================================

module.exports = {
  resumoCurto: 'Por que trabalhamos com torneiras metálicas em ambiente de uso intenso — resistência, durabilidade e reposição fácil — e como tratar a opção jato na proposta.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-04-torneiras-video' },

  blocos: [
    { tipo: 'texto', html: 'A torneira é o único componente que o usuário <strong>toca dezenas ou centenas de vezes por dia</strong>. É também o primeiro a falhar em bebedouros comuns. Por isso ela é um argumento de venda forte: mostra, na prática, que o equipamento foi feito para <strong>uso intenso</strong>, não para uso doméstico.' },

    { tipo: 'titulo', texto: 'Por que metal, e não plástico' },
    { tipo: 'cards', itens: [
      { icon: '💪', titulo: 'Maior resistência', html: 'Metal aguenta o acionamento repetido do dia a dia de uma empresa ou indústria.' },
      { icon: '🔁', titulo: 'Uso intenso', html: 'Feita para dezenas ou centenas de usos diários, sem folgar como o plástico simples.' },
      { icon: '🛡️', titulo: 'Menor risco de quebra', html: 'Menos trincas e quebras que uma torneira plástica comum — menos parada e reclamação.' },
      { icon: '⏳', titulo: 'Durabilidade', html: 'Vida útil maior no cenário de uso pesado, onde o plástico costuma ceder primeiro.' },
      { icon: '🔧', titulo: 'Reposição e manutenção', html: 'Fácil de repor e dar manutenção quando necessário, sem trocar o equipamento inteiro.' },
      { icon: '⭐', titulo: 'Percepção de robustez', html: 'Passa solidez ao cliente na hora da decisão: "isso aqui foi feito para aguentar".' },
    ]},

    { tipo: 'script',
      contexto: 'Cliente compara com um bebedouro mais barato de torneira plástica.',
      fala: 'Em uma empresa ou indústria, a torneira pode ser utilizada dezenas ou centenas de vezes por dia. Por isso, trabalhamos com torneiras metálicas, mais adequadas para esse tipo de uso.' },

    { tipo: 'titulo', texto: 'Copo × jato' },
    { tipo: 'texto', html: 'A torneira metálica vem em dois modelos: <strong>Copo</strong> (rosca, para encher copo/garrafa) e <strong>Jato</strong> (pressão, para beber direto). A escolha depende do ambiente e do hábito de uso do cliente — vale confirmar o que faz mais sentido na operação dele.' },

    { tipo: 'callout', variante: 'info', titulo: 'Nota interna de proposta — torneira jato',
      html: 'Regra interna de precificação (não é spec pública do site): a torneira <strong>Jato</strong> tem <strong>custo adicional de +R$100 por torneira</strong> e <strong>não acompanha copo</strong>. Sempre confirme e registre isso na proposta antes de fechar — não deixe para o cliente descobrir depois.' },

    { tipo: 'dodont',
      fazer: [
        'Usar a torneira metálica como prova concreta de que o equipamento é para uso pesado.',
        'Confirmar com o cliente se ele prefere copo (rosca) ou jato (pressão).',
        'Registrar na proposta o adicional do jato (+R$100/torneira, sem copo).',
      ],
      evitar: [
        'Prometer que a torneira "nunca quebra" — falar em maior resistência e menor risco, não em imortalidade.',
        'Oferecer jato sem informar o custo adicional e a ausência de copo.',
        'Citar grau/normas de metal não confirmadas.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Por que a Tudo de Filtro trabalha com torneiras metálicas?',
      opcoes: [
        'Só porque é mais bonito.',
        'Porque em empresa/indústria a torneira é usada dezenas ou centenas de vezes por dia e o metal resiste melhor a esse uso intenso.',
        'Porque metal deixa a água mais gelada.',
      ],
      correta: 1,
      explicacao: 'O argumento é resistência ao uso intenso e menor risco de quebra frente ao plástico — nada a ver com refrigeração.'
    },
    {
      pergunta: 'O cliente quer torneira jato. O que você registra na proposta?',
      opcoes: [
        'Nada, é igual à de copo.',
        'Que o jato tem adicional de +R$100 por torneira e não acompanha copo.',
        'Que o jato é mais barato e vem com copo.',
      ],
      correta: 1,
      explicacao: 'Regra interna: jato custa +R$100 por torneira e não vem com copo. Sempre confirmar e registrar na proposta.'
    },
  ],

  exercicio: {
    enunciado: 'Escreva como você responderia a um cliente que diz: "o concorrente é mais barato". Use a torneira metálica como argumento de valor e uso intenso, sem falar mal do concorrente.',
    dica: 'Traga o custo escondido do plástico que quebra: parada da operação, reclamação e troca. Metal = menos dor de cabeça no dia a dia.'
  },

  resumo: 'A torneira é o ponto de maior desgaste no uso diário. Trabalhamos com torneiras metálicas por maior resistência, durabilidade, menor risco de quebra frente ao plástico, reposição fácil e percepção de robustez. Modelos: Copo (rosca) e Jato (pressão). Nota interna: o jato custa +R$100 por torneira e não acompanha copo — confirmar e registrar na proposta.'
};
