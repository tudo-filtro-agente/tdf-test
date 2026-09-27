// ============================================================================
// MÓDULO 10 — Objeções de Tempo e Decisor
// Baseado em: Objeções — Jeb Blount
// ============================================================================

module.exports = {
  resumoCurto: 'Aprenda a tratar as objeções "vou pensar", "não é o momento" e "preciso falar com meu cônjuge/sócio" com técnicas que aceleram a decisão sem pressão.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-10-video' },

  blocos: [
    { tipo: 'texto', html: 'Depois do preço, as objeções mais comuns são as de <strong>tempo</strong> ("vou pensar", "não é o momento", "mês que vem") e de <strong>decisor</strong> ("preciso falar com meu marido/esposa/sócio"). Jeb Blount ensina que essas objeções quase nunca são reais — são <strong>cortinas de fumaça</strong> que escondem medo, insegurança ou uma objeção não verbalizada.' },

    { tipo: 'titulo', texto: 'Objeções de tempo: o que realmente significam' },
    { tipo: 'tabela',
      head: ['O que diz', 'O que geralmente significa', 'Estratégia'],
      rows: [
        ['"Vou pensar"', '"Não estou seguro o suficiente para decidir"', 'Descubra O QUE ele precisa pensar'],
        ['"Não é o momento"', '"Não vejo urgência" ou "tenho outra prioridade"', 'Mostre o custo de esperar'],
        ['"Mês que vem"', '"Quero adiar a decisão"', 'Crie marco temporal real'],
        ['"Preciso pesquisar mais"', '"Não confio o suficiente" ou "vi mais barato"', 'Ofereça comparação transparente'],
        ['"Vou ver com calma"', '"Não quero dizer não na sua cara"', 'Crie compromisso de próximo passo'],
      ]
    },

    { tipo: 'titulo', texto: 'Técnica 1: A pergunta que revela a objeção real' },
    { tipo: 'texto', html: 'Quando o cliente diz "vou pensar", a maioria dos vendedores diz "ok, fico no aguardo". <strong>Erro fatal.</strong> A pergunta que muda tudo:' },
    { tipo: 'script', contexto: 'Cliente disse "vou pensar"', fala: '"Claro, faz todo sentido pensar com calma. Me ajuda só numa coisa: quando você diz \'pensar\', o que exatamente precisa avaliar melhor? É sobre o produto em si, sobre o investimento, ou tem alguma outra preocupação?"' },
    { tipo: 'callout', variante: 'sucesso', titulo: 'Por que funciona',
      html: 'Essa pergunta obriga o cliente a especificar. E quando ele especifica, você pode tratar a objeção real. <strong>Na grande maioria das vezes, o "vou pensar" vira uma objeção de preço ou de medo</strong> — e essas você já sabe tratar.' },

    { tipo: 'titulo', texto: 'Técnica 2: O custo de esperar' },
    { tipo: 'exemplo', cliente: 'Não é o momento. Vou deixar pro mês que vem.', closer: 'Entendo. Só pra eu entender: enquanto isso, o ferro continua na água, certo? A tubulação continua corroendo, as roupas continuam manchando. Se a gente calcular, cada mês sem tratamento custa em média R$ 200 em danos. Em 3 meses, são R$ 600 — quase metade de uma parcela do Iron Free. Faz sentido esperar e pagar mais caro pelo problema?' },

    { tipo: 'titulo', texto: 'Técnica 3: Compromisso de próximo passo' },
    { tipo: 'texto', html: 'Nunca termine uma conversa sem um <strong>compromisso concreto de próximo passo</strong>. "Vou pensar" sem data é venda morta.' },
    { tipo: 'tabela',
      head: ['Resposta fraca ❌', 'Resposta forte ✅'],
      rows: [
        ['"Ok, fico no aguardo"', '"Combinamos então: te ligo quinta às 14h pra conversarmos. Funciona pra você?"'],
        ['"Quando puder, me avisa"', '"Posso te enviar o comparativo por WhatsApp hoje e conversamos amanhã?"'],
        ['"Pensa com calma"', '"O que preciso te enviar pra ajudar na avaliação? Posso mandar um resumo com tudo que conversamos."'],
      ]
    },

    { tipo: 'titulo', texto: 'Objeções de decisor: tratando o "preciso falar com..."' },
    { tipo: 'texto', html: 'Quando o cliente diz que precisa consultar outra pessoa, pode significar duas coisas: (1) é verdade e há um co-decisor, ou (2) é uma cortina de fumaça para ganhar tempo. O tratamento é diferente para cada caso.' },

    { tipo: 'cards', itens: [
      { icon: '👫', titulo: 'Se é verdade (co-decisor real)', html: '<strong>Estratégias:</strong><br>• Pergunte: "O que você acha que ele(a) vai querer saber?"<br>• Ofereça: "Posso preparar um resumo para vocês avaliarem juntos?"<br>• Proponha: "Que tal uma ligação com os dois? Assim tiro todas as dúvidas de uma vez."' },
      { icon: '🎭', titulo: 'Se é cortina de fumaça', html: '<strong>Como descobrir:</strong><br>• "Se dependesse só de você, o que faria?"<br>• Se responder "compraria", o decisor é real. Trabalhe o acesso a ele.<br>• Se hesitar, há outra objeção. Investigue.' },
    ]},

    { tipo: 'titulo', texto: 'O framework "Se... Então"' },
    { tipo: 'texto', html: 'Técnica para objeção de decisor: criar um <strong>compromisso condicional</strong>.' },
    { tipo: 'script', contexto: 'Cliente precisa falar com o sócio', fala: '"Entendo perfeitamente. Me diz uma coisa: se o seu sócio concordar, vocês avançam? (pausa) Ótimo. Então vamos fazer assim: eu preparo uma apresentação completa com diagnóstico, benefícios e condições. Você agenda 15 minutos com ele e, se quiser, posso participar da conversa por telefone pra responder qualquer dúvida técnica. Quando seria melhor?"' },

    { tipo: 'titulo', texto: 'Como prevenir objeções de tempo e decisor' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Prevenção é melhor que tratamento',
      html: 'A melhor forma de evitar essas objeções é <strong>qualificar corretamente no início</strong>:<br>• <strong>Decisor:</strong> "Quem mais participa dessa decisão na casa/empresa?"<br>• <strong>Prazo:</strong> "Pra quando você gostaria de ter isso resolvido?"<br>• <strong>Urgência:</strong> "O que te motivou a buscar uma solução agora?"<br>Se fizer essas perguntas no começo, reduz drasticamente as objeções de tempo e decisor no final.' },

    { tipo: 'dodont',
      fazer: [
        'Sempre descobrir o que está por trás do "vou pensar".',
        'Mostrar o custo de esperar (CNFN mensal).',
        'Criar compromisso de próximo passo com data e hora.',
        'Oferecer acesso ao co-decisor (ligação conjunta, resumo).',
        'Qualificar decisor e prazo logo no início da conversa.',
      ],
      evitar: [
        'Aceitar "vou pensar" como resposta final.',
        'Dizer "ok, fico no aguardo" sem data de retorno.',
        'Pressionar o cliente a decidir na hora.',
        'Ignorar o co-decisor e tentar fechar só com um.',
        'Criar urgência falsa ("só até amanhã!").',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Cliente diz "vou pensar". Qual a melhor resposta?',
      opcoes: [
        '"Ok, fico no aguardo."',
        '"Claro. Me ajuda: o que exatamente precisa avaliar melhor?"',
        '"Se não fechar hoje, perco a condição."',
      ],
      correta: 1,
      explicacao: 'Perguntar o que precisa avaliar revela a objeção real. Na grande maioria das vezes é preço ou medo — e essas você sabe tratar.'
    },
    {
      pergunta: 'Como saber se "preciso falar com meu marido" é verdade ou cortina de fumaça?',
      opcoes: [
        'Perguntar: "Se dependesse só de você, o que faria?"',
        'Aceitar e ligar mês que vem.',
        'Ignorar e tentar fechar mesmo assim.',
      ],
      correta: 0,
      explicacao: 'Se responder "compraria", o co-decisor é real. Se hesitar, há outra objeção que precisa ser tratada primeiro.'
    },
    {
      pergunta: 'Qual a melhor forma de prevenir objeções de tempo e decisor?',
      opcoes: [
        'Criar urgência artificial.',
        'Qualificar decisor, prazo e urgência no início da conversa.',
        'Não falar de preço até o final.',
      ],
      correta: 1,
      explicacao: 'Qualificar no início identifica quem decide, quando quer resolver e por que agora — reduzindo objeções no final.'
    },
  ],

  exercicio: {
    enunciado: 'Escreva respostas para 3 cenários: (1) Cliente diz "vou pensar" depois da visita técnica do Scale Stop. (2) Cliente diz "preciso falar com minha esposa" sobre o Iron Free. (3) Cliente diz "não é o momento" para o Filtro de Entrada. Use as técnicas do módulo.',
    dica: 'Para cada cenário: descubra a objeção real, mostre o custo de esperar, e crie um compromisso de próximo passo com data e hora.'
  },

  resumo: 'Objeções de tempo ("vou pensar", "não é o momento") e de decisor ("preciso falar com...") quase nunca são reais — são cortinas de fumaça. As técnicas-chave: pergunta reveladora, custo de esperar, compromisso de próximo passo e framework "Se... Então". A melhor defesa é qualificar decisor e prazo no início da conversa.'
};
