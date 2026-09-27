// ============================================================================
// MÓDULO 7 — Treino Semanal — Método Chet Holmes
// Baseado em: A Máquina Definitiva de Vendas — Chet Holmes
// ============================================================================

module.exports = {
  resumoCurto: 'Implemente o método de treinamento semanal de Chet Holmes para desenvolver habilidades de venda de forma contínua e mensurável.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-07-video' },

  blocos: [
    { tipo: 'texto', html: 'Empresas que <strong>treinam semanalmente</strong> vendem significativamente mais do que as que treinam apenas na integração. O segredo não é treinar mais — é treinar <strong>com frequência, foco e repetição deliberada</strong>. Um treino de 1 hora por semana, bem estruturado, supera um workshop de 3 dias feito uma vez por ano.' },

    { tipo: 'titulo', texto: 'O princípio da "disciplina obstinada"' },
    { tipo: 'texto', html: 'Holmes chamava isso de <em>"pigheaded discipline"</em> — disciplina obstinada. A ideia: <strong>não busque 4.000 técnicas novas; domine 12 técnicas com 4.000 repetições</strong>. No contexto TDF, isso significa praticar as mesmas habilidades toda semana até que se tornem automáticas.' },

    { tipo: 'titulo', texto: 'As 12 competências-chave do vendedor TDF' },
    { tipo: 'checklist', titulo: 'Habilidades para treinar semanalmente (rodízio)', itens: [
      '1. Abertura de ligação — primeiros 30 segundos que prendem atenção',
      '2. Perguntas SPIN — Situação, Problema, Implicação, Necessidade',
      '3. Qualificação BANT — Budget, Authority, Need, Timeline',
      '4. Apresentação de valor — benefícios antes de preço',
      '5. Ancoragem de preço — apresentar premium primeiro',
      '6. Tratamento de objeção de preço',
      '7. Tratamento de objeção "vou pensar"',
      '8. Tratamento de objeção "preciso falar com meu cônjuge/sócio"',
      '9. Técnicas de fechamento sem pressão',
      '10. Pedido de indicação pós-venda',
      '11. Follow-up com valor (não cobrança)',
      '12. Construção de urgência real',
    ]},

    { tipo: 'titulo', texto: 'Estrutura do treino semanal — 60 minutos' },
    { tipo: 'tabela',
      head: ['Tempo', 'Atividade', 'Como fazer'],
      rows: [
        ['10 min', 'Revisão de resultados', 'Números da semana: leads, agendamentos, fechamentos, ticket médio'],
        ['10 min', 'Microaula', 'Uma habilidade da lista de 12 — conceito + exemplo rápido'],
        ['25 min', 'Role-play', 'Praticar em dupla: um faz o cliente, outro faz o vendedor. Trocar papéis.'],
        ['10 min', 'Feedback coletivo', 'O que funcionou? O que melhorar? Dicas práticas do grupo.'],
        ['5 min', 'Desafio da semana', 'Uma meta específica para aplicar no dia a dia até o próximo treino.'],
      ]
    },

    { tipo: 'titulo', texto: 'Role-play: a ferramenta mais poderosa' },
    { tipo: 'texto', html: 'Role-play é a prática simulada de uma conversa de venda. É o equivalente ao treino do atleta: <strong>você erra no treino para acertar no jogo</strong>. Vendedores que fazem role-play semanal fecham consistentemente mais que os que não praticam.' },

    { tipo: 'cards', itens: [
      { icon: '🎭', titulo: 'Role-play de abertura', html: '<strong>Cenário:</strong> Cliente liga pedindo preço de filtro. <strong>Desafio:</strong> Não dar preço. Fazer 3 perguntas de descoberta antes de qualquer número.' },
      { icon: '🛡️', titulo: 'Role-play de objeção', html: '<strong>Cenário:</strong> "Achei caro, vi um filtro de R$ 500 no Mercado Livre." <strong>Desafio:</strong> Diferenciar sem desmerecer o concorrente. Construir valor do Iron Free vs. filtro genérico.' },
      { icon: '🤝', titulo: 'Role-play de fechamento', html: '<strong>Cenário:</strong> Cliente fez visita, gostou, mas diz "vou pensar". <strong>Desafio:</strong> Descobrir a real objeção por trás do "vou pensar" e tratar.' },
      { icon: '📞', titulo: 'Role-play de follow-up', html: '<strong>Cenário:</strong> Lead que sumiu há 7 dias. <strong>Desafio:</strong> Retomar contato com valor (não cobrança) e reagendar conversa.' },
    ]},

    { tipo: 'titulo', texto: 'Scripts de role-play para TDF' },
    { tipo: 'script', contexto: 'Abertura — cliente pediu preço por WhatsApp', fala: '"Oi [nome], tudo bem? Vi que você tem interesse em tratamento de água. Antes de eu te passar valores, quero entender melhor a sua situação pra recomendar a solução certa. Posso te fazer umas perguntas rápidas?"' },
    { tipo: 'script', contexto: 'Objeção — "achei caro"', fala: '"Entendo. Me conta: quando você compara, está comparando com qual tipo de solução? Porque o [produto TDF] faz [benefício específico] que filtros convencionais não fazem. Vamos comparar maçã com maçã?"' },
    { tipo: 'script', contexto: 'Follow-up — lead sumiu', fala: '"Oi [nome], lembrei de você porque um cliente da sua região acabou de instalar o [produto] e resolveu exatamente o mesmo problema que você me contou. Achei que seria útil compartilhar. Ainda faz sentido conversarmos?"' },

    { tipo: 'callout', variante: 'sucesso', titulo: 'O efeito composto do treino semanal',
      html: 'Se você melhorar <strong>1% por semana</strong> em uma habilidade, em 1 ano terá melhorado 67%. Em 2 anos, 180%. O treino semanal é a maior vantagem competitiva de um time de vendas — e a mais subestimada.' },

    { tipo: 'dodont',
      fazer: [
        'Reservar 1 hora fixa por semana para treino (não cancelar).',
        'Fazer role-play toda semana — é a parte mais importante.',
        'Gravar seus role-plays e ouvir depois para autocrítica.',
        'Focar em UMA habilidade por semana (não 5).',
        'Trazer casos reais da semana para o treino.',
      ],
      evitar: [
        'Cancelar treino porque "tem muito lead pra atender".',
        'Fazer role-play superficial (sem levar a sério).',
        'Treinar só teoria sem prática simulada.',
        'Criticar colegas no role-play em vez de dar feedback construtivo.',
        'Achar que já sabe tudo e não precisa treinar.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Segundo Chet Holmes, o que gera mais resultado: um workshop de 3 dias por ano ou 1 hora de treino por semana?',
      opcoes: [
        'Workshop de 3 dias, porque é mais intenso.',
        '1 hora por semana, porque a repetição frequente fixa o aprendizado.',
        'Tanto faz, o resultado é o mesmo.',
      ],
      correta: 1,
      explicacao: 'A frequência e repetição superam a intensidade pontual. Treino semanal cria hábitos; workshop gera entusiasmo temporário.'
    },
    {
      pergunta: 'Qual é a parte mais importante do treino semanal?',
      opcoes: [
        'Revisão de resultados.',
        'Microaula teórica.',
        'Role-play (prática simulada).',
      ],
      correta: 2,
      explicacao: 'Role-play é onde a teoria vira prática. Vendedores que praticam em simulação erram menos na hora real.'
    },
    {
      pergunta: 'O que significa "pigheaded discipline" de Chet Holmes?',
      opcoes: [
        'Fazer muitas coisas diferentes todo dia.',
        'Dominar poucas técnicas com muita repetição.',
        'Ser teimoso com clientes.',
      ],
      correta: 1,
      explicacao: '"Pigheaded discipline" é a disciplina obstinada de repetir as mesmas 12 habilidades-chave até que se tornem automáticas.'
    },
  ],

  exercicio: {
    enunciado: 'Escolha uma das 12 competências-chave e faça um role-play de 5 minutos com um colega. Grave no celular e ouça depois. Anote: (1) o que fez bem, (2) o que faria diferente, (3) qual frase usaria na próxima vez.',
    dica: 'Comece pelo role-play de abertura — é o mais fácil e o mais impactante. Lembre: no treino você pode errar. No jogo (ligação real), os erros custam venda.'
  },

  resumo: 'O método Chet Holmes de treino semanal combina revisão de resultados, microaula, role-play e feedback em 60 minutos. A chave é a "disciplina obstinada": dominar 12 habilidades com repetição implacável. Role-play é a ferramenta mais poderosa — quem pratica toda semana fecha consistentemente mais. O efeito composto de 1% por semana transforma resultados em poucos meses.'
};
