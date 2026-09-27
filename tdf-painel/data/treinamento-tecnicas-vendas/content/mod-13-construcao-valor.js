// ============================================================================
// MÓDULO 13 — Construção de Valor Antes do Preço
// Sequência obrigatória: Problema → Dor → Consequência → Solução → Preço
// ============================================================================

module.exports = {
  resumoCurto: 'Entenda por que revelar o preço antes de construir valor mata a venda — e domine a sequência Problema → Dor → Consequência → Solução → Preço aplicada a todos os produtos TDF.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-13-video' },

  blocos: [
    { tipo: 'texto', html: 'O maior erro em vendas consultivas é <strong>falar o preço antes de o cliente entender o valor</strong>. Quando você diz "o Iron Free custa R$ 21.900" sem contexto, o cliente compara com um filtro de geladeira de R$ 200. A sequência correta <strong>Problema → Dor → Consequência → Solução → Preço</strong> faz o cliente perceber que o investimento é pequeno comparado ao custo de não resolver.' },

    { tipo: 'titulo', texto: 'A Sequência Obrigatória de Construção de Valor' },
    { tipo: 'cards', itens: [
      { icon: '1️⃣', titulo: 'Problema', html: 'Identifique o problema objetivo: <strong>"A água tem ferro"</strong>, <strong>"Tem calcário na tubulação"</strong>, <strong>"A água tem cheiro"</strong>. Fato concreto.' },
      { icon: '2️⃣', titulo: 'Dor', html: 'Conecte o problema a algo que o cliente <strong>sente</strong>: roupas manchadas, chuveiro entupido, pele ressecada, equipamentos quebrados. <strong>Dor é emocional.</strong>' },
      { icon: '3️⃣', titulo: 'Consequência', html: 'Amplifique o custo de não resolver: <strong>"Se o calcário continuar, vai trocar o aquecedor solar de R$ 8.000 em 2 anos"</strong>. Coloque número no prejuízo.' },
      { icon: '4️⃣', titulo: 'Solução', html: 'Apresente o produto como a solução específica para aquela dor: <strong>"O Scale Stop impede que o calcário se incruste na tubulação e nos equipamentos, protegendo tudo o que a água toca"</strong>.' },
      { icon: '5️⃣', titulo: 'Preço', html: 'Só agora revele o valor: <strong>"O investimento é R$ 14.990 — menos do que a troca de um único aquecedor"</strong>. O preço se torna pequeno perto da consequência.' },
    ]},

    { tipo: 'titulo', texto: 'Por que falar preço antes de valor mata a venda' },
    { tipo: 'callout', variante: 'alerta', titulo: 'O cérebro do cliente sem contexto',
      html: 'Sem contexto de valor, o cérebro faz <strong>comparação automática com a referência mais barata</strong>: "R$ 21.900 num filtro?! Um filtro de torneira custa R$ 80!". A ancoragem errada destrói sua venda. <strong>Você precisa criar a ancoragem certa ANTES</strong> — o custo do problema é a âncora, não o preço de outro filtro.' },

    { tipo: 'titulo', texto: 'Exemplo completo: Iron Free para casa de campo' },
    { tipo: 'exemplo', cliente: 'Quanto custa o filtro de ferro?', closer: '(Não responde o preço ainda) Antes de falar em valor, preciso entender melhor sua situação. A água de poço com ferro causa vários problemas além do que se vê. Me conta: você já notou manchas nas roupas ou nos equipamentos?' },
    { tipo: 'exemplo', cliente: 'Sim, roupa fica manchada e o chuveiro entupiu 2 vezes.', closer: '(Dor) Isso é muito comum com ferro acima de 0,3 mg/L. Além das roupas e chuveiros, o ferro corrói internamente a tubulação, aquecedores e eletrodomésticos.' },
    { tipo: 'exemplo', cliente: 'Sério? Meu aquecedor é novo...', closer: '(Consequência) Exatamente. Um aquecedor solar custa R$ 6.000 a R$ 12.000, e com ferro na água, a vida útil cai pela metade. Sem contar torneiras, misturadores, máquina de lavar... estamos falando de R$ 20.000+ em danos nos próximos 3 anos.' },
    { tipo: 'exemplo', cliente: 'Nossa, não tinha pensado nisso...', closer: '(Solução → Preço) O Iron Free remove até 20 ppm de ferro da água antes de entrar na casa. Protege todos os equipamentos, roupas e a tubulação. O investimento no modelo ideal pra sua casa é R$ 21.900 — pagamento em até 12x. Menos do que a troca de um aquecedor.' },

    { tipo: 'titulo', texto: 'Comparativo: Preço antes vs. Preço depois do valor' },
    { tipo: 'tabela',
      head: ['Cenário', 'Abordagem ERRADA ❌', 'Abordagem CORRETA ✅'],
      rows: [
        ['Filtro de Entrada', '"Custa R$ 5.490. Quer?"', '"Sua caixa d\'água vai acumulando sedimento com o tempo — e é dessa água que sua família toma banho. O filtro retém essa sujeira antes de entrar por R$ 5.490 — cerca de R$ 3/dia."'],
        ['Iron Free', '"R$ 21.900 o Iron Free."', '"O ferro destrói R$ 20.000+ em equipamentos em 3 anos. O Iron Free protege tudo por R$ 21.900 — se paga em menos de 2 anos."'],
        ['Scale Stop', '"R$ 14.990 anti-calcário."', '"Trocar o aquecedor solar custa R$ 8.000+. O Scale Stop evita isso e protege toda a casa por R$ 14.990."'],
        ['Bebedouro', '"R$ 2.990 o bebedouro."', '"Bebedouro antigo sem filtração adequada é manutenção constante e reclamação da equipe. O bebedouro industrial de R$ 2.990 resolve com água gelada e filtrada direto da rede."'],
      ]
    },

    { tipo: 'titulo', texto: 'A técnica do "Investimento vs. Custo"' },
    { tipo: 'texto', html: 'Nunca diga <strong>"custa"</strong> ou <strong>"o preço é"</strong>. Use <strong>"o investimento é"</strong>. Custo é algo que você perde. Investimento é algo que retorna. Reforce isso com a comparação:<br><br>• "O investimento no Scale Stop é R$ 14.990"<br>• "O custo de NÃO ter é R$ 8.000+ na troca do aquecedor + R$ 3.000 em manutenções + R$ 2.000 em torneiras"<br>• <strong>"Resolver sai mais barato que não resolver."</strong>' },

    { tipo: 'titulo', texto: 'Exercício: Reescreva as frases' },
    { tipo: 'checklist', titulo: 'Transforme cada frase errada em construção de valor', itens: [
      'ERRADA: "O Filtro de Entrada custa R$ 3.490." → Reescreva com Problema→Dor→Consequência→Solução→Preço',
      'ERRADA: "Instalação é R$ 590 à parte." → Reescreva posicionando como investimento mínimo',
      'ERRADA: "O Iron Free mais caro é R$ 31.900." → Reescreva comparando com o custo dos danos',
      'ERRADA: "A visita técnica custa R$ 800." → Reescreva com a frase oficial: visita técnica + análise, que entra como parte do seu projeto — abatida na proposta',
    ]},

    { tipo: 'titulo', texto: 'Quando o cliente pergunta o preço logo de cara' },
    { tipo: 'dodont',
      fazer: [
        '"Depende do modelo ideal pro seu caso. Me conta: qual o problema principal com a água?"',
        '"Antes de falar em valor, preciso entender sua situação pra indicar o modelo certo."',
        '"Nossos filtros vão de R$ 3.490 a R$ 31.900 dependendo da solução. Pra indicar o ideal, me fala..."',
        'Se o cliente INSISTIR: dê a faixa e volte para a construção de valor imediatamente.',
      ],
      evitar: [
        'Dar o preço exato sem contexto: "R$ 21.900" (morreu a venda).',
        'Negar o preço de forma rude: "Não posso falar preço agora."',
        'Dar preço e ficar em silêncio esperando reação.',
        'Se desculpar pelo preço: "É caro, mas..."',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual é a sequência obrigatória de construção de valor na TDF?',
      opcoes: [
        'Preço → Produto → Desconto → Fechamento',
        'Problema → Dor → Consequência → Solução → Preço',
        'Apresentação → Objeção → Desconto → Venda',
        'Situação → Preço → Negociação → Fechamento',
      ],
      correta: 1,
      explicacao: 'A sequência correta faz o cliente perceber o custo de não resolver antes de ouvir o preço, criando a ancoragem certa.'
    },
    {
      pergunta: 'Um cliente pergunta "quanto custa o Iron Free?" logo na primeira mensagem. O que fazer?',
      opcoes: [
        'Responder "R$ 21.900" imediatamente para ser transparente.',
        'Dizer "não posso informar preço por mensagem".',
        'Dar a faixa de preço e redirecionar para entender o problema antes de indicar o modelo.',
      ],
      correta: 2,
      explicacao: 'Dar a faixa mostra transparência, mas redirecionar para o problema permite construir valor antes de especificar o modelo e preço exato.'
    },
    {
      pergunta: 'Por que devemos dizer "investimento" em vez de "custo" ou "preço"?',
      opcoes: [
        'Porque é mais bonito.',
        'Porque investimento implica retorno — o cliente recupera o valor ao evitar danos.',
        'Porque a diretoria exige.',
      ],
      correta: 1,
      explicacao: 'A palavra "investimento" ativa a ideia de retorno e proteção. "Custo" ativa a ideia de perda. A palavra que você usa molda a percepção do cliente.'
    },
  ],

  exercicio: {
    enunciado: 'Um dono de pousada liga perguntando o preço do Scale Stop. A pousada tem 10 quartos, todos com chuveiro elétrico, e a água é de poço com alto teor de calcário. Monte o diálogo completo usando a sequência Problema → Dor → Consequência → Solução → Preço. Inclua pelo menos um número de custo de consequência para ancorar o preço.',
    dica: 'Calcule: 10 chuveiros × R$ 400 cada = R$ 4.000 em trocas. Manutenção de aquecedores/tubulação = R$ 3.000/ano. Em 3 anos sem Scale Stop = R$ 13.000+ em danos. O Scale Stop de R$ 17.990 se paga em pouco mais de 1 ano.'
  },

  resumo: 'Nunca revele o preço antes de construir valor. Siga a sequência obrigatória: Problema → Dor → Consequência → Solução → Preço. Ancore o preço no custo de não resolver, não no preço de produtos concorrentes. Use "investimento" em vez de "custo". Quando o cliente pergunta preço de cara, dê a faixa e redirecione para entender o problema.'
};
