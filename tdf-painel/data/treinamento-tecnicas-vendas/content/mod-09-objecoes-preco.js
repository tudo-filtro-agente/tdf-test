// ============================================================================
// MÓDULO 9 — Objeções de Preço — Como Desarmar e Reposicionar
// Baseado em: Objeções — Jeb Blount
// ============================================================================

module.exports = {
  resumoCurto: 'Aprenda técnicas específicas para tratar objeções de preço, reposicionar valor e proteger margem nas vendas de soluções de água TDF.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-09-video' },

  blocos: [
    { tipo: 'texto', html: 'A objeção de preço é a mais comum em vendas — e a que mais assusta vendedores. Jeb Blount ensina que <strong>"caro" nunca é sobre o número</strong>. É sobre a percepção de valor. Se o cliente diz "caro", significa que ele <strong>ainda não viu valor suficiente</strong> para justificar o investimento. A solução não é desconto — é construção de valor.' },

    { tipo: 'titulo', texto: 'As 5 variações de "está caro"' },
    { tipo: 'tabela',
      head: ['O que o cliente diz', 'O que realmente quer dizer', 'Como responder'],
      rows: [
        ['"Está caro"', '"Não entendi o valor ainda"', 'Reconstrua o valor com benefícios específicos'],
        ['"Vi mais barato na internet"', '"Me convença que vale a diferença"', 'Compare maçã com maçã — diferencie o produto'],
        ['"Não cabe no meu orçamento"', '"Preciso de alternativa de pagamento"', 'Apresente parcelamento, financiamento'],
        ['"Meu marido/esposa vai achar caro"', '"Preciso de argumentos para convencer"', 'Forneça munição: resumo de benefícios e economia'],
        ['"Vou pesquisar mais"', '"Não estou seguro o suficiente"', 'Descubra a insegurança e trate com prova social'],
      ]
    },

    { tipo: 'titulo', texto: 'Técnica 1: Isolamento da objeção' },
    { tipo: 'texto', html: 'Antes de tratar o preço, isole: <strong>"Tirando o preço, existe alguma outra coisa que te impede de avançar?"</strong> Se a resposta for "não", o preço é a única barreira e você pode focar nela. Se houver outra objeção, trate essa primeiro — muitas vezes o preço nem era a real objeção.' },

    { tipo: 'titulo', texto: 'Técnica 2: Custo de não fazer nada (CNFN)' },
    { tipo: 'texto', html: 'A técnica mais poderosa contra objeção de preço: mostrar quanto o cliente vai <strong>gastar se NÃO comprar</strong>.' },
    { tipo: 'tabela',
      head: ['Problema', 'Custo anual sem tratar', 'Solução TDF', 'Investimento'],
      rows: [
        ['Ferro na água — roupas manchadas', 'R$ 2.400/ano (roupas danificadas)', 'Iron Free', 'A partir de R$ 13.990'],
        ['Calcário — aquecedor danificado', 'R$ 5.000-12.000 (troca de aquecedor)', 'Scale Stop', 'A partir de R$ 8.990'],
        ['Sedimentos — manutenção de equipamentos', 'R$ 1.800/ano (técnico + peças)', 'Filtro Entrada', 'A partir de R$ 3.490'],
        ['Bebedouros antigos — empresa 50 pessoas', 'R$ 3.600/ano (manutenção corretiva + filtração vencida + reclamações da equipe)', 'Bebedouro Industrial', 'A partir de R$ 1.590'],
      ]
    },
    { tipo: 'callout', variante: 'sucesso', titulo: 'O reframe do investimento',
      html: 'Quando o cliente vê que está <strong>gastando todo ano com manutenção corretiva e equipamentos no fim da vida útil</strong>, e o bebedouro industrial novo começa em R$ 1.590, o "caro" vira "barato". O produto se paga em poucos meses.' },

    { tipo: 'titulo', texto: 'Técnica 3: Fracionamento (preço por dia)' },
    { tipo: 'cards', itens: [
      { icon: '💧', titulo: 'Filtro Entrada R$ 3.490', html: '<strong>R$ 1,91/dia</strong> por 5 anos. "Menos que uma garrafa de água mineral por dia para proteger toda a casa."' },
      { icon: '🔧', titulo: 'Scale Stop R$ 8.990', html: '<strong>R$ 4,93/dia</strong> por 5 anos. "Menos que um cafezinho para salvar o aquecedor de R$ 10.000."' },
      { icon: '⚡', titulo: 'Iron Free R$ 13.990', html: '<strong>R$ 7,67/dia</strong> por 5 anos. "O preço de uma água mineral para eliminar o ferro de toda a água da casa."' },
      { icon: '❄️', titulo: 'Bebedouro R$ 1.590', html: '<strong>R$ 0,87/dia</strong> por 5 anos. "Menos que um copo descartável para água gelada ilimitada."' },
    ]},

    { tipo: 'titulo', texto: 'Técnica 4: Comparação inteligente' },
    { tipo: 'exemplo', cliente: 'Vi um filtro de ferro no Mercado Livre por R$ 2.500. O de vocês é R$ 13.990. Por que tão caro?', closer: 'Boa pergunta! Me manda o link? Vou te mostrar exatamente a diferença. (pausa) Geralmente esses filtros de R$ 2.500 usam refil que precisa trocar a cada 3-6 meses, custando R$ 400-600 cada troca. Em 5 anos, são R$ 4.000-6.000 só de refil, além do filtro. O Iron Free usa mídia catalítica que dura 5-7 anos sem troca. No final, o custo total é menor — e a eficiência muito maior.' },

    { tipo: 'titulo', texto: 'Técnica 5: A pergunta de perspectiva' },
    { tipo: 'script', contexto: 'Cliente hesitando por preço do Scale Stop', fala: '"Sr. Carlos, se daqui a 2 anos o aquecedor a gás de R$ 10.000 parar por causa do calcário, e você lembrar que hoje deixou de investir R$ 8.990 pra proteger ele — como você se sentiria? O Scale Stop não é um gasto: é um seguro para todos os seus equipamentos."' },

    { tipo: 'titulo', texto: 'Desconto? Nunca no produto — a moeda é a instalação' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Política de negociação da TDF',
      html: '<strong>O preço do produto é fixo — NUNCA dê desconto no equipamento.</strong> Diante da objeção de preço:<br>1. Construa valor completo (SPIN + benefícios + CNFN)<br>2. Trate a objeção com LSCPA<br>3. Se ainda precisar de uma alavanca, a <strong>única moeda de negociação é a instalação (R$ 590)</strong> — bonificada apenas no fechamento, com justificativa logística (ex.: equipe já na região)<br>4. Condição de pagamento pode ser facilitada (parcelamento) — reduzir o preço do produto, jamais.' },

    { tipo: 'dodont',
      fazer: [
        'Isolar a objeção de preço antes de tratar.',
        'Mostrar o Custo de Não Fazer Nada (CNFN).',
        'Fracionar o preço em valor diário ou mensal.',
        'Comparar com o custo de alternativas inferiores no longo prazo.',
        'Usar a instalação (R$ 590) como única moeda — bonificada só no fechamento, com justificativa logística.',
      ],
      evitar: [
        'Dar desconto imediato ao ouvir "está caro".',
        'Ficar na defensiva ("não é caro, é investimento").',
        'Comparar diretamente com concorrente genérico sem dados.',
        'Baixar preço sem construir valor antes.',
        'Aceitar "está caro" como resposta final sem explorar.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Cliente diz "está caro". Qual deve ser o primeiro passo?',
      opcoes: [
        'Oferecer desconto.',
        'Isolar a objeção: "Tirando o preço, existe outra coisa que te impede de avançar?"',
        'Argumentar que não é caro.',
      ],
      correta: 1,
      explicacao: 'Isolar a objeção primeiro garante que o preço é de fato a única barreira. Muitas vezes, há outra objeção por trás.'
    },
    {
      pergunta: 'O que é CNFN?',
      opcoes: [
        'Custo Nominal Final Negociado',
        'Custo de Não Fazer Nada — quanto o cliente gasta se não comprar',
        'Condição Normal de Financiamento Nacional',
      ],
      correta: 1,
      explicacao: 'CNFN mostra ao cliente que não resolver o problema também custa dinheiro — muitas vezes mais que a solução.'
    },
    {
      pergunta: 'Qual é a política de negociação da TDF diante da objeção de preço?',
      opcoes: [
        'Dar desconto no produto sempre que o cliente pedir.',
        'Dar até 10% de desconto no produto para pagamento à vista.',
        'Preço do produto fixo; a única moeda é a instalação (R$ 590), bonificada só no fechamento com justificativa logística. Condição de pagamento pode ser facilitada.',
      ],
      correta: 2,
      explicacao: 'O produto nunca é descontado — isso protege a margem e a credibilidade do preço. A alavanca é a instalação, usada como moeda de fechamento, e o parcelamento resolve objeção de fluxo de caixa.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente diz: "R$ 8.990 pelo Scale Stop? Meu encanador falou que resolve com um filtro de R$ 300." Monte a resposta completa usando: isolamento, CNFN, fracionamento e comparação inteligente.',
    dica: 'Isole a objeção, depois mostre o CNFN (custo de troca de aquecedor), fracione (R$ 4,93/dia), e compare o custo total do filtro genérico com trocas frequentes vs. Scale Stop sem troca por 5+ anos.'
  },

  resumo: 'Objeção de preço nunca é sobre o número — é sobre percepção de valor. As 5 técnicas para desarmar: isolamento da objeção, custo de não fazer nada (CNFN), fracionamento por dia, comparação inteligente e pergunta de perspectiva. Desconto no produto: nunca — a única moeda de negociação é a instalação (R$ 590), bonificada apenas no fechamento com justificativa logística. Em vez de baixar preço, suba o valor percebido e facilite a condição de pagamento.'
};
