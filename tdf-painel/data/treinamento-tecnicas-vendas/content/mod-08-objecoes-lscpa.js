// ============================================================================
// MÓDULO 8 — Objeções — Framework LSCPA
// Baseado em: Objeções — Jeb Blount
// ============================================================================

module.exports = {
  resumoCurto: 'Domine o método de Jeb Blount para objeções — Ledge, Disrupt, Ask — e o framework complementar LSCPA (Ouvir, Simpatizar, Confirmar, Propor, Avançar) para tratar qualquer objeção com elegância e eficácia.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-08-video' },

  blocos: [
    { tipo: 'texto', html: 'Jeb Blount ensina que <strong>objeções não são rejeições</strong> — são sinais de que o cliente está engajado. Um cliente que não objeta não está interessado. No livro <em>Objeções</em>, Blount propõe um método de <strong>3 passos — Ledge, Disrupt, Ask</strong> — para responder a qualquer objeção sem cair no modo defensivo. Neste módulo você aprende esse método e, como apoio, o <strong>LSCPA</strong>, um framework complementar de mercado com 5 passos para conduzir a conversa.' },

    { tipo: 'titulo', texto: 'RBOs vs. objeções reais de compra' },
    { tipo: 'texto', html: 'Antes do método, Blount faz uma distinção essencial: <strong>RBOs (Reflex Buyer Objections)</strong> são respostas-reflexo automáticas — "tá caro", "me manda por e-mail", "não tenho interesse" — ditas sem pensar, como quem espanta vendedor. Já as <strong>objeções reais de compra</strong> são preocupações genuínas sobre valor, orçamento, confiança ou timing. RBO não se rebate com argumento: se você discute com um reflexo, vira briga. Objeção real, sim, merece tratamento completo.' },

    { tipo: 'titulo', texto: 'O método de Jeb Blount: Ledge → Disrupt → Ask' },
    { tipo: 'cards', itens: [
      { icon: '🪨', titulo: '1. Ledge (resposta-âncora)', html: 'Uma frase memorizada e automática que <strong>ganha o quarto de segundo</strong> entre a objeção e a sua reação. Ex.: <em>"Interessante você dizer isso…"</em>, <em>"Boa pergunta — muita gente pensa assim no começo."</em> O Ledge impede o cérebro de entrar em modo luta-ou-fuga e te dá tempo de escolher a resposta em vez de reagir no impulso.' },
      { icon: '⚡', titulo: '2. Disrupt (quebra do padrão)', html: 'O cliente espera que você insista ou discuta. <strong>Faça o inesperado</strong>: concorde parcialmente, mude o ângulo, faça uma pergunta. <em>"Vários dos meus melhores clientes disseram exatamente isso antes de ver o diagnóstico da água deles."</em> A quebra do padrão desarma o reflexo e reabre a conversa.' },
      { icon: '🔁', titulo: '3. Ask (peça de novo)', html: 'Depois de quebrar o padrão, <strong>peça de novo o que você quer</strong> — com confiança e sem rodeio: o agendamento, a visita, o próximo passo. Quem não pede de novo depois da objeção perde a venda por abandono, não por rejeição.' },
    ]},
    { tipo: 'script', contexto: 'RBO na prospecção — "Não tenho interesse"', fala: '"Entendo — e era isso mesmo que eu esperava ouvir (Ledge). A maioria dos clientes que hoje têm a água tratada com a gente me disse a mesma coisa no primeiro contato, até descobrir quanto a água estava custando em equipamentos (Disrupt). Me dá 3 minutos na quinta às 10h pra te mostrar o que encontramos na sua região? (Ask)"' },

    { tipo: 'titulo', texto: 'Framework complementar de mercado: LSCPA' },
    { tipo: 'texto', html: 'Para <strong>objeções reais de compra</strong>, usamos na TDF um framework complementar de mercado, o <strong>LSCPA</strong> — um roteiro de 5 passos que garante que o cliente se sinta ouvido antes de receber a resposta.' },
    { tipo: 'cards', itens: [
      { icon: '👂', titulo: 'L — Listen (Ouvir)', html: '<strong>Cale-se e ouça.</strong> Não interrompa. Não prepare a resposta enquanto o cliente fala. Ouça até o fim. Muitas vezes o cliente revela a objeção real na segunda ou terceira frase.' },
      { icon: '🤝', titulo: 'S — Sympathize (Simpatizar)', html: '<strong>Valide o sentimento.</strong> "Eu entendo completamente sua preocupação." Não diga "mas" logo depois — isso anula a validação. Use pausa.' },
      { icon: '✅', titulo: 'C — Confirm (Confirmar)', html: '<strong>Repita a objeção</strong> para garantir que entendeu. "Então, se eu entendi bem, sua principal preocupação é [X]. É isso mesmo?" Isso mostra respeito e evita tratar a objeção errada.' },
      { icon: '💡', titulo: 'P — Propose (Propor)', html: '<strong>Apresente uma solução</strong> específica para a objeção. Não genérica — específica ao que o cliente disse. Use dados, exemplos de clientes similares, ou uma alternativa.' },
      { icon: '➡️', titulo: 'A — Advance (Avançar)', html: '<strong>Dê o próximo passo.</strong> Não fique parado esperando. "Faz sentido? Posso agendar a visita técnica pra essa semana?" Sempre conduza para a próxima etapa.' },
    ]},

    { tipo: 'titulo', texto: 'LSCPA na prática: objeções comuns TDF' },

    { tipo: 'callout', variante: 'info', titulo: 'Objeção #1: "Está muito caro"',
      html: '<strong>L:</strong> (ouça sem interromper)<br><strong>S:</strong> "Entendo. R$ 13.990 é um investimento importante e faz sentido querer ter certeza."<br><strong>C:</strong> "A sua principal preocupação é o valor total, ou é a forma de pagamento?"<br><strong>P:</strong> "Muitos clientes que pensaram o mesmo perceberam que, dividindo por 5 anos de vida útil, são R$ 7,67 por dia — menos que uma garrafa d\'água. E a economia em manutenção e equipamentos danificados paga o filtro em 18 meses."<br><strong>A:</strong> "Posso preparar uma simulação de parcelamento pra você avaliar com mais calma?"' },

    { tipo: 'callout', variante: 'info', titulo: 'Objeção #2: "Vou pensar"',
      html: '<strong>L:</strong> (ouça, respire)<br><strong>S:</strong> "Claro, é uma decisão importante mesmo."<br><strong>C:</strong> "Me ajuda a entender: o que exatamente você precisa pensar melhor? É sobre o produto, o valor, ou algo mais?"<br><strong>P:</strong> (responder de acordo com o que o cliente revelou)<br><strong>A:</strong> "Que tal eu te ligar quinta-feira às 14h? Assim você tem tempo de pensar e posso esclarecer qualquer dúvida."' },

    { tipo: 'callout', variante: 'info', titulo: 'Objeção #3: "Preciso falar com meu marido/esposa"',
      html: '<strong>L:</strong> (ouça)<br><strong>S:</strong> "Com certeza, é importante que vocês decidam juntos."<br><strong>C:</strong> "Ele(a) já sabe que você está pesquisando solução para a água? Tem alguma preocupação específica que ele(a) possa ter?"<br><strong>P:</strong> "Posso preparar um resumo com tudo que conversamos pra você mostrar a ele(a)? Ou, se preferir, posso ligar num horário que os dois estejam juntos."<br><strong>A:</strong> "Quando seria um bom horário para conversarmos com ele(a) junto?"' },

    { tipo: 'titulo', texto: 'Os 4 tipos de objeção' },
    { tipo: 'tabela',
      head: ['Tipo', 'O que é', 'Exemplo TDF', 'Como tratar'],
      rows: [
        ['Reflexo (RBO)', 'Automática, sem pensar', '"Está caro" (antes de ouvir o preço)', 'Ledge → Disrupt → Ask — nunca rebata com argumento'],
        ['Real', 'Preocupação genuína', '"Não sei se cabe no meu orçamento"', 'LSCPA completo com solução de parcelamento'],
        ['Cortina de fumaça', 'Esconde a objeção real', '"Vou pensar" (na verdade é preço)', 'Confirme: "O que exatamente precisa pensar?"'],
        ['Teste', 'Cliente testando o vendedor', '"Na internet vi por metade do preço"', 'Mantenha a calma e diferencie: "Me manda o link? Vamos comparar juntos."'],
      ]
    },

    { tipo: 'titulo', texto: 'O erro fatal: argumentar antes de ouvir' },
    { tipo: 'texto', html: 'O maior erro ao receber uma objeção é <strong>responder imediatamente</strong>. Quando você pula L, S e C e vai direto para P, o cliente sente que não foi ouvido — e se fecha mais ainda. É a reação por impulso que Blount descreve: no quarto de segundo após a objeção, o cérebro entra em modo luta-ou-fuga — exatamente o que o <strong>Ledge</strong> existe para evitar.' },

    { tipo: 'exemplo', cliente: 'Achei muito caro esse Iron Free.', closer: '(ERRADO — reação por impulso) "Mas você viu que a gente parcela em 12x? E tem garantia de 5 anos!"' },
    { tipo: 'exemplo', cliente: 'Achei muito caro esse Iron Free.', closer: '(CERTO — LSCPA) "Entendo. É um investimento importante mesmo. (pausa) Me conta: quando você diz caro, está comparando com alguma outra solução, ou é o valor total que preocupa?"' },

    { tipo: 'dodont',
      fazer: [
        'Sempre completar os 5 passos do LSCPA na ordem.',
        'Pausar 2-3 segundos entre S e C (silêncio é poderoso).',
        'Confirmar a objeção antes de responder — evita tratar a objeção errada.',
        'Terminar sempre com um avanço (próximo passo concreto).',
        'Praticar LSCPA em role-play toda semana.',
      ],
      evitar: [
        'Responder objeção antes de ouvir até o fim.',
        'Dizer "mas" depois de simpatizar (anula a validação).',
        'Tratar objeção reflexo como objeção real.',
        'Ficar na defensiva ou levar para o pessoal.',
        'Dar desconto como primeira resposta a "está caro".',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'No framework LSCPA, qual passo vem depois de Simpatizar?',
      opcoes: [
        'Propor',
        'Avançar',
        'Confirmar',
      ],
      correta: 2,
      explicacao: 'Depois de simpatizar, você confirma a objeção ("Se entendi bem, sua preocupação é X?") para garantir que vai tratar a objeção certa.'
    },
    {
      pergunta: 'Cliente diz "vou pensar". Que tipo de objeção provavelmente é?',
      opcoes: [
        'Real',
        'Cortina de fumaça',
        'Reflexo',
      ],
      correta: 1,
      explicacao: '"Vou pensar" quase sempre é cortina de fumaça que esconde a real objeção (preço, medo, falta de autoridade). Use o passo C para descobrir o que está por trás.'
    },
    {
      pergunta: 'No método de Jeb Blount (Objeções), qual é a função do Ledge?',
      opcoes: [
        'Dar um desconto imediato para desarmar o cliente.',
        'Ganhar o quarto de segundo entre a objeção e a sua reação, evitando a resposta por impulso.',
        'Encerrar a conversa educadamente.',
      ],
      correta: 1,
      explicacao: 'O Ledge é a resposta-âncora memorizada que impede o modo luta-ou-fuga e dá tempo de escolher a resposta. Depois vêm o Disrupt (quebra do padrão) e o Ask (pedir de novo).'
    },
  ],

  exercicio: {
    enunciado: 'Escreva o LSCPA completo (5 passos, com falas) para a seguinte objeção: "Meu encanador falou que não precisa de filtro de entrada, que a água da Sabesp já vem tratada."',
    dica: 'Na etapa C, confirme: "Então sua preocupação é que talvez não seja necessário?" Na etapa P, explique a diferença entre água tratada (potável) e água limpa (sem sedimentos, cloro residual, etc.) que protege equipamentos.'
  },

  resumo: 'O método de Jeb Blount (Objeções) tem 3 passos: Ledge (resposta-âncora que ganha o quarto de segundo) → Disrupt (quebra do padrão) → Ask (pedir de novo) — somado à distinção entre RBOs (reflexos automáticos) e objeções reais de compra. Como apoio, o LSCPA (Ouvir, Simpatizar, Confirmar, Propor, Avançar) é um framework complementar de mercado que garante que o cliente se sinta ouvido antes de receber a resposta. O erro fatal continua o mesmo: responder antes de ouvir.'
};
