// ============================================================================
// MÓDULO 16 — Tratamento de objeções
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// Tipos de bloco usados aqui: texto, titulo, callout, cards, script, exemplo,
// dodont, checklist.
// ============================================================================

module.exports = {
  resumoCurto: "Objeção não é um 'não'. É um pedido de mais informação ou de mais segurança. Este módulo ensina a estrutura de 7 passos para tratar as objeções mais comuns na venda de bebedouros industriais — sem pressão, sem desconto reflexo e sem falar mal do concorrente.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-16-video" },

  blocos: [
    { tipo: "texto", html: "A maioria das vendas não é perdida por preço. É perdida porque o vendedor <strong>tratou a objeção como uma discussão</strong> — quis vencer o cliente em vez de entendê-lo. Uma objeção quase sempre é um sinal de interesse: quem não tem interesse nenhum não levanta dúvida, apenas encerra a conversa." },

    { tipo: "titulo", texto: "A estrutura dos 7 passos" },
    { tipo: "texto", html: "Toda objeção, seja de preço, de prazo ou de decisão, é tratada com a mesma sequência. Ela evita que você responda no impulso e reduz o valor do equipamento antes da hora." },
    { tipo: "cards", itens: [
      { icon: "1", titulo: "Ouvir", html: "Deixe o cliente terminar. Não interrompa para defender o produto. Silêncio aqui vale ouro." },
      { icon: "2", titulo: "Confirmar", html: "Mostre que entendeu: \"Entendi, então o ponto é o valor, é isso?\". O cliente precisa se sentir ouvido." },
      { icon: "3", titulo: "Investigar", html: "Pergunte para descobrir o que está por trás. \"Comparado com o quê?\" costuma revelar a objeção real." },
      { icon: "4", titulo: "Isolar", html: "Descubra se é a única barreira: \"Fora esse ponto, tem mais alguma coisa te segurando?\"." },
      { icon: "5", titulo: "Responder", html: "Só agora responda — de forma objetiva, ancorada em dimensionamento, estrutura, garantia e suporte." },
      { icon: "6", titulo: "Confirmar", html: "Cheque se a resposta resolveu: \"Ficou mais claro? Faz sentido pra você?\"." },
      { icon: "7", titulo: "Voltar ao fechamento", html: "Retome o próximo passo: \"Então podemos seguir com o modelo de ___?\". Não deixe a conversa no ar." },
    ]},

    { tipo: "callout", variante: "info", titulo: "Isolar é o passo que mais gente pula",
      html: "Sem isolar, você responde \"está caro\", o cliente concorda, e aí aparece \"e também preciso falar com meu sócio\". Você gastou seu melhor argumento numa objeção que não era a decisiva. Sempre pergunte se é o único ponto <strong>antes</strong> de responder." },

    { tipo: "titulo", texto: "Objeção: \"Está caro\"" },
    { tipo: "script", contexto: "Cliente diz que o preço está alto — passo Confirmar + Investigar",
      fala: "Entendo. Você está comparando com um equipamento da mesma capacidade e configuração ou com um modelo diferente?" },
    { tipo: "texto", html: "Essa pergunta faz o cliente sair do \"caro\" abstrato e ir para uma comparação concreta. Na maioria das vezes ele está comparando com um bebedouro menor, de plástico, com um só ponto de água ou sem torneira metálica — ou seja, outra categoria de produto." },
    { tipo: "exemplo",
      cliente: "Achei caro esse de 100 litros.",
      closer: "Entendo. Você está comparando com um equipamento da mesma capacidade e configuração, ou com um modelo diferente? Pergunto porque o de 100 litros foi o que dimensionei pelo seu pico de turno, com compressor 1/5 pra recuperar a temperatura na hora do movimento. Se for pra comparar, quero comparar item a item com você." },

    { tipo: "titulo", texto: "Objeção: \"Encontrei mais barato\"" },
    { tipo: "script", contexto: "Cliente diz que viu preço menor em outro lugar",
      fala: "Pode acontecer. Para comparar corretamente, precisamos verificar capacidade, compressor, torneiras, estrutura, garantia, filtragem, frete e suporte." },
    { tipo: "texto", html: "Não desqualifique o concorrente. Puxe a conversa para os <strong>critérios de comparação</strong>. Se o equipamento do outro for realmente igual em tudo, é uma decisão legítima do cliente. Quase nunca é — e a própria lista faz o cliente enxergar as diferenças sozinho." },
    { tipo: "exemplo",
      cliente: "Vi um bem parecido bem mais barato em outro fornecedor.",
      closer: "Pode acontecer, e faz sentido você pesquisar. Pra você comparar de verdade e não levar gato por lebre, vale olhar sete pontos: a capacidade real, o compressor, quantas torneiras e se são metálicas, a estrutura em inox, a garantia, a filtragem que acompanha e o suporte depois da venda. Se estiver tudo igual, ótimo. Quer que eu monte essa comparação lado a lado com você?" },

    { tipo: "titulo", texto: "Objeção: \"Quero o menor modelo\"" },
    { tipo: "script", contexto: "Cliente pede um modelo abaixo do recomendado — registrar o risco",
      fala: "Consigo fornecer, mas preciso deixar uma orientação: pela quantidade de pessoas e pelo pico informado, ele pode trabalhar próximo do limite. Minha recomendação profissional é o modelo de ___." },
    { tipo: "callout", variante: "alerta", titulo: "Nunca troque o modelo certo por um menor calado",
      html: "Você pode atender o pedido, mas <strong>registre o risco por escrito</strong> na proposta. Se o equipamento subdimensionado não recuperar a temperatura no pico, o cliente vai lembrar que você avisou — ou que não avisou. Sua orientação protege os dois." },
    { tipo: "exemplo",
      cliente: "Prefiro levar o de 60 litros, é mais em conta.",
      closer: "Consigo fornecer o de 60, sem problema. Só preciso deixar registrado uma orientação técnica: pelo efetivo que você me passou e pela concentração no horário do almoço, o de 60 vai trabalhar perto do limite e pode não recuperar a temperatura no pico. Minha recomendação profissional é o de 100 litros, com compressor 1/5. Se ainda assim preferir o de 60, eu formalizo, mas quero que a decisão seja sua com essa informação na mão." },

    { tipo: "titulo", texto: "Objeção: \"Só quero orçamento\"" },
    { tipo: "script", contexto: "Cliente quer apenas um número, sem conversa",
      fala: "Sem problema. Para eu não enviar um orçamento errado, preciso confirmar quantidade de pessoas, voltagem, cidade, prazo e se é para uso próprio ou revenda." },
    { tipo: "texto", html: "\"Só quero orçamento\" costuma ser uma forma educada de encurtar a conversa. Você respeita o pedido, mas condiciona o orçamento a <strong>informações que evitam retrabalho</strong> — e, de quebra, faz a descoberta que o cliente tentou pular." },
    { tipo: "exemplo",
      cliente: "Não precisa de tudo isso, me manda só um orçamento.",
      closer: "Sem problema, te mando. Só pra eu não errar e ter que refazer: quantas pessoas usam no pico, qual a voltagem do local, qual a cidade pra eu ver o frete, qual o prazo que você precisa e se é pra uso da própria empresa ou pra revenda? Com isso eu já te mando o valor certo de primeira." },

    { tipo: "titulo", texto: "Objeção: \"Vou pensar\"" },
    { tipo: "script", contexto: "Cliente adia a decisão — isolar o que falta",
      fala: "O que você ainda precisa avaliar: modelo, valor, prazo ou aprovação de outra pessoa?" },
    { tipo: "texto", html: "\"Vou pensar\" não é objeção — é a ausência de uma. Sua função é <strong>transformar em uma pergunta concreta</strong>. Ao oferecer as quatro opções, você facilita para o cliente nomear a real barreira, que você então trata com a estrutura de 7 passos." },
    { tipo: "exemplo",
      cliente: "Deixa eu pensar e te retorno.",
      closer: "Claro, decisão de equipamento a gente não toma no susto. Só pra eu te ajudar melhor: o que ainda falta avaliar é o modelo, o valor, o prazo de entrega ou tem outra pessoa que precisa aprovar junto com você? Sabendo disso eu já adianto o que estiver na minha mão." },

    { tipo: "titulo", texto: "Objeção: \"Preciso falar com meu diretor\"" },
    { tipo: "script", contexto: "Existe um decisor acima do contato",
      fala: "Qual ponto ele costuma analisar primeiro? Posso preparar a proposta destacando isso. Quando vocês pretendem conversar?" },
    { tipo: "texto", html: "Aqui você tem duas metas: <strong>municiar o seu contato</strong> para ele defender a compra internamente e <strong>marcar o próximo passo com data</strong>. Nunca deixe o \"vou falar com o diretor\" sem uma data de retorno." },
    { tipo: "exemplo",
      cliente: "Isso quem decide é o diretor, vou levar pra ele.",
      closer: "Perfeito. Pra eu te ajudar a defender lá dentro: qual ponto ele costuma olhar primeiro, é preço, é prazo ou é garantia? Posso montar a proposta já destacando isso pra facilitar a aprovação. E quando vocês pretendem conversar, ainda essa semana? Assim eu deixo tudo pronto na sua mão até lá." },

    { tipo: "titulo", texto: "Objeção: \"O frete ficou caro\"" },
    { tipo: "texto", html: "Frete de bebedouro industrial é peso e volume reais — não dá para zerar. O caminho é <strong>colocar o frete no contexto do valor total</strong> e mostrar alternativas: distância, volume, peso, segurança da entrega, retirada, ganho de escala com mais unidades e a condição fechada." },
    { tipo: "exemplo",
      cliente: "O frete pesou, ficou salgado.",
      closer: "Entendo, e é justo olhar isso. O equipamento tem 40 kg e volume grande, então o frete acompanha a distância e o cuidado no transporte pra chegar sem avaria. Algumas saídas: se você tiver como retirar, a gente tira o frete da conta; se fechar mais de uma unidade, o custo por equipamento dilui; e vale olhar o total da condição, não só a linha do frete isolada. Qual dessas faz mais sentido pra você?" },
    { tipo: "callout", variante: "alerta", titulo: "Frete grátis só para SP",
      html: "Nunca prometa frete grátis fora de São Paulo. Fora de SP, o frete é calculado conforme a região. Ofereça retirada ou ganho de escala, não gratuidade que a operação não sustenta." },

    { tipo: "titulo", texto: "Objeção: \"Quero desconto\"" },
    { tipo: "texto", html: "Desconto nunca é dado de graça. A regra é simples: <strong>toda concessão tem contrapartida</strong>. Antes de mexer no preço, descubra se o desconto é o que realmente destrava a decisão — muitas vezes não é." },
    { tipo: "checklist", titulo: "Perguntas antes de conceder qualquer desconto",
      itens: [
        "O desconto viabiliza a decisão hoje, ou ainda falta outra coisa?",
        "Se for à vista / Pix, consigo trabalhar melhor a condição?",
        "Fechando mais unidades, faz sentido rever o valor?",
        "Se eu conseguir essa condição, você fecha hoje?",
        "O que exatamente falta pra gente avançar?",
      ]
    },
    { tipo: "exemplo",
      cliente: "Consegue melhorar o preço pra mim?",
      closer: "Consigo olhar, mas antes deixa eu entender: se eu conseguir uma condição melhor, você fecha hoje ou ainda tem outro ponto pra resolver? E você pensa em à vista no Pix ou parcelado? Pergunto porque à vista eu tenho mais margem pra trabalhar. Me diz o que falta pra avançar que eu vejo o que dá pra fazer." },
    { tipo: "callout", variante: "perigo", titulo: "Desconto reflexo mata a sua margem e a sua autoridade",
      html: "Se você baixa o preço no primeiro empurrão, ensina o cliente a empurrar sempre. Pior: sinaliza que o preço inicial era inflado. Concessão só existe em <strong>troca</strong> — de pagamento, de quantidade, de retirada ou de fechamento imediato." },

    { tipo: "titulo", texto: "Objeção: \"Não quero os refis\"" },
    { tipo: "script", contexto: "Cliente recusa a oferta dos refis adicionais",
      fala: "Sem problema. O primeiro já acompanha o equipamento. A oferta dos três adicionais é para evitar compra emergencial e deixar as próximas trocas programadas." },
    { tipo: "texto", html: "O refil Acquabios Multi <strong>não é obrigatório</strong> e o primeiro já vai de brinde com o bebedouro. A oferta dos três adicionais é conveniência: evita que o cliente fique na mão numa troca de última hora. Aceite o \"não\" com naturalidade e deixe a porta aberta." },
    { tipo: "exemplo",
      cliente: "Não quero levar os refis agora.",
      closer: "Sem problema mesmo. O primeiro refil já acompanha o equipamento, então você já sai coberto. A oferta dos três adicionais é só pra você não precisar comprar em cima da hora e deixar as próximas trocas já programadas — mas fica totalmente a seu critério, dá pra pegar depois quando precisar." },

    { tipo: "dodont",
      fazer: [
        "Ouvir a objeção inteira antes de responder.",
        "Isolar: confirmar se é a única barreira antes de gastar o argumento.",
        "Registrar por escrito quando o cliente insiste em modelo subdimensionado.",
        "Trocar toda concessão por uma contrapartida clara.",
        "Voltar sempre para o próximo passo depois de responder.",
      ],
      evitar: [
        "Falar mal do concorrente para vencer a comparação.",
        "Dar desconto no primeiro empurrão, sem contrapartida.",
        "Prometer frete grátis fora de SP.",
        "Prometer potabilidade ou percentual de economia de energia.",
        "Inventar prazo, faturamento ou spec que você não confirmou.",
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: "O cliente diz \"está caro\". Qual é a melhor primeira reação, seguindo a estrutura?",
      opcoes: [
        "Oferecer 10% de desconto na hora para não perder a venda.",
        "Confirmar e investigar: \"Você está comparando com um equipamento da mesma capacidade e configuração ou com um modelo diferente?\"",
        "Explicar que o concorrente vende produto de qualidade inferior.",
      ],
      correta: 1,
      explicacao: "Antes de responder, você investiga com o que ele compara. \"Caro\" quase sempre é comparação com outra categoria de produto. Desconto reflexo e falar mal do concorrente estão fora."
    },
    {
      pergunta: "Por que \"isolar\" (passo 4) vem antes de \"responder\" (passo 5)?",
      opcoes: [
        "Para ganhar tempo enquanto pensa no preço.",
        "Para não gastar seu melhor argumento numa objeção que não é a decisiva — pode haver outra barreira escondida.",
        "Porque isolar é opcional e pode ser pulado.",
      ],
      correta: 1,
      explicacao: "Se você não confirma que aquela é a única barreira, responde uma objeção e aparece outra logo em seguida. Isolar garante que você trata o que realmente segura a decisão."
    },
    {
      pergunta: "O cliente pede desconto. O que você faz ANTES de mexer no preço?",
      opcoes: [
        "Concede o desconto imediatamente para demonstrar boa vontade.",
        "Pergunta se o desconto viabiliza a decisão hoje e busca uma contrapartida (à vista, mais unidades, fechar hoje).",
        "Diz que o preço é fixo e encerra o assunto.",
      ],
      correta: 1,
      explicacao: "Toda concessão tem contrapartida. Primeiro descubra se o desconto realmente destrava a decisão e troque por pagamento à vista, volume ou fechamento imediato."
    },
  ],

  exercicio: {
    enunciado: "Escolha uma das objeções do módulo e escreva o diálogo completo aplicando os 7 passos, do Ouvir até o Voltar ao fechamento. Marque no texto onde está cada passo.",
    dica: "Preste atenção especial ao passo Isolar: escreva a pergunta que confirma se aquela é a única barreira antes de você responder."
  },

  resumo: "Objeção é sinal de interesse, não recusa. Trate toda objeção com os 7 passos: Ouvir, Confirmar, Investigar, Isolar, Responder, Confirmar e Voltar ao fechamento. \"Caro\" e \"achei mais barato\" pedem comparação item a item, nunca ataque ao concorrente. \"Vou pensar\" e \"falar com o diretor\" pedem que você isole o que falta e marque o próximo passo com data. Modelo menor que o recomendado: forneça, mas registre o risco. Desconto só com contrapartida. Refil é opcional e o primeiro já é brinde. Frete grátis apenas para SP."
};
