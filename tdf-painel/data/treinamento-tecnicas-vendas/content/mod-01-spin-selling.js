// ============================================================================
// MÓDULO 1 — SPIN Selling — Situação, Problema, Implicação e Necessidade
// Baseado em: SPIN Selling — Neil Rackham
// ============================================================================

module.exports = {
  resumoCurto: 'Domine a metodologia SPIN Selling e aprenda a conduzir conversas consultivas que revelam as reais necessidades do cliente de tratamento de água.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-01-video' },

  blocos: [
    { tipo: 'texto', html: 'O <strong>SPIN Selling</strong> é uma metodologia criada por Neil Rackham após estudar mais de 35.000 interações de vendas. A sigla SPIN representa quatro tipos de perguntas que, usadas na sequência certa, transformam uma conversa comum em uma <strong>venda consultiva de alto valor</strong>.' },

    { tipo: 'titulo', texto: 'O que é SPIN?' },
    { tipo: 'cards', itens: [
      { icon: '🔍', titulo: 'S — Situação', html: 'Perguntas para entender o cenário atual do cliente. <strong>Exemplo TDF:</strong> "Quantas pessoas utilizam água na sua empresa hoje?"' },
      { icon: '⚠️', titulo: 'P — Problema', html: 'Perguntas para identificar dificuldades e insatisfações. <strong>Exemplo TDF:</strong> "Você já teve problemas com manchas em roupas ou equipamentos por causa da água?"' },
      { icon: '💡', titulo: 'I — Implicação', html: 'Perguntas que ampliam a percepção do impacto do problema. <strong>Exemplo TDF:</strong> "Quanto você gasta por mês com manutenção de equipamentos danificados pela água com ferro?"' },
      { icon: '✅', titulo: 'N — Necessidade de Solução', html: 'Perguntas que levam o cliente a verbalizar o benefício. <strong>Exemplo TDF:</strong> "Se você eliminasse o ferro da água, quanto economizaria em manutenção por ano?"' },
    ]},

    { tipo: 'titulo', texto: 'Por que SPIN funciona em vendas de filtros?' },
    { tipo: 'texto', html: 'Vender um <strong>Filtro de Entrada</strong> (R$ 3.490 a R$ 10.990) ou um <strong>Iron Free</strong> (R$ 13.990 a R$ 31.900) não é como vender um produto de prateleira. O cliente precisa <strong>entender o problema antes de ver valor na solução</strong>. O SPIN faz exatamente isso: conduz o cliente da ignorância do problema até a urgência da solução — sem pressão.' },

    { tipo: 'callout', variante: 'info', titulo: 'Regra de ouro do SPIN',
      html: 'Em vendas complexas, <strong>quem faz as perguntas controla a conversa</strong>. Quanto mais o cliente fala sobre seus problemas, mais ele se convence sozinho da necessidade de resolver.' },

    { tipo: 'titulo', texto: 'Sequência SPIN na prática — Venda de Iron Free' },
    { tipo: 'exemplo', cliente: 'Tenho uma casa de campo e a água é de poço.', closer: '(S) Quantas pessoas usam a água da casa regularmente? Vocês usam pra lavar roupa também?' },
    { tipo: 'exemplo', cliente: 'Sim, mas a roupa sai com umas manchas amareladas...', closer: '(P) Essas manchas são frequentes? Já aconteceu de estragar alguma peça importante?' },
    { tipo: 'exemplo', cliente: 'Já, minha esposa reclama direto. E a louça fica manchada também.', closer: '(I) Além das roupas e louças, o ferro também pode danificar chuveiros, torneiras e a tubulação. Vocês já notaram entupimento em algum registro ou chuveiro?' },
    { tipo: 'exemplo', cliente: 'Agora que você falou, o chuveiro entupiu mês passado.', closer: '(N) Se existisse uma solução que eliminasse o ferro da água antes de entrar na casa, protegendo roupas, louça e toda a tubulação — seria interessante pra vocês?' },

    { tipo: 'titulo', texto: 'Erros comuns ao usar SPIN' },
    { tipo: 'dodont',
      fazer: [
        'Preparar perguntas de Situação antes da ligação — pesquise o cliente.',
        'Usar perguntas de Problema de forma natural, não como interrogatório.',
        'Deixar o cliente falar — ouça mais, fale menos.',
        'Usar Implicação para amplificar o custo de não resolver o problema.',
        'Só apresentar a solução depois das perguntas de Necessidade.',
      ],
      evitar: [
        'Fazer muitas perguntas de Situação (entedia o cliente).',
        'Pular direto para apresentação do produto sem descobrir o problema.',
        'Responder suas próprias perguntas — dê tempo ao cliente.',
        'Usar Implicação de forma agressiva ou ameaçadora.',
        'Apresentar preço antes de construir valor via SPIN.',
      ]
    },

    { tipo: 'titulo', texto: 'Tabela: Tipo de pergunta × Objetivo × Exemplo TDF' },
    { tipo: 'tabela',
      head: ['Tipo', 'Objetivo', 'Exemplo para TDF'],
      rows: [
        ['Situação', 'Mapear o cenário', '"De onde vem a água da sua residência/empresa?"'],
        ['Problema', 'Identificar dor', '"Você nota algum problema com a qualidade da água?"'],
        ['Implicação', 'Ampliar consequência', '"Se o calcário continuar, quanto vai custar trocar o aquecedor?"'],
        ['Necessidade', 'Cliente verbaliza solução', '"Se a água chegasse limpa, o que mudaria na sua rotina?"'],
      ]
    },

    { tipo: 'titulo', texto: 'Exercício prático: Monte seu roteiro SPIN' },
    { tipo: 'texto', html: 'Para cada produto TDF abaixo, escreva <strong>uma pergunta de cada tipo SPIN</strong>:' },
    { tipo: 'checklist', titulo: 'Produtos para praticar', itens: [
      'Filtro de Entrada (R$ 3.490–10.990) — foco em sedimentos e turbidez',
      'Iron Free (R$ 13.990–31.900) — foco em ferro e manganês',
      'Scale Stop (R$ 8.990–17.990) — foco em calcário e incrustação',
      'Bebedouro Industrial (R$ 1.590–3.413) — foco em volume e praticidade',
    ]},
  ],

  perguntasRapidas: [
    {
      pergunta: 'Na metodologia SPIN, qual tipo de pergunta deve ser usado para ampliar a percepção do cliente sobre as consequências do problema?',
      opcoes: [
        'Situação',
        'Problema',
        'Implicação',
        'Necessidade de Solução',
      ],
      correta: 2,
      explicacao: 'Perguntas de Implicação fazem o cliente perceber o custo e as consequências de NÃO resolver o problema, aumentando a urgência.'
    },
    {
      pergunta: 'Um cliente diz: "A água do meu poço tem gosto de ferro." Qual seria a melhor próxima pergunta SPIN?',
      opcoes: [
        '(S) Quantos litros vocês consomem por dia?',
        '(I) Esse ferro já danificou algum equipamento da casa?',
        '(N) Você gostaria de instalar nosso Iron Free?',
      ],
      correta: 1,
      explicacao: 'O cliente já revelou o problema. O próximo passo é Implicação: ampliar a percepção do impacto antes de apresentar a solução.'
    },
    {
      pergunta: 'Qual é o erro mais comum de vendedores ao usar SPIN?',
      opcoes: [
        'Fazer perguntas de Necessidade.',
        'Pular direto para a apresentação do produto sem descobrir problemas.',
        'Ouvir demais o cliente.',
      ],
      correta: 1,
      explicacao: 'Vendedores ansiosos pulam Situação/Problema/Implicação e vão direto para a solução, perdendo a chance de o cliente se convencer sozinho.'
    },
  ],

  exercicio: {
    enunciado: 'Monte um roteiro SPIN completo (4 perguntas) para vender um Scale Stop para um dono de clínica que reclama que o autoclave está com problema de calcário. Anote cada pergunta com a letra correspondente (S, P, I ou N).',
    dica: 'Comece com Situação sobre o equipamento e frequência de uso, depois explore o Problema do calcário, a Implicação do custo de manutenção/troca do autoclave, e finalize com a Necessidade de uma solução preventiva.'
  },

  resumo: 'SPIN Selling é uma metodologia de perguntas sequenciais (Situação → Problema → Implicação → Necessidade) que conduz o cliente a perceber sozinho a urgência de resolver seu problema com água. Em vendas de filtros TDF, usar SPIN evita o erro de apresentar preço antes de construir valor e transforma a venda em consultoria.'
};
