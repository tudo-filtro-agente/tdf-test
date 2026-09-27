// ============================================================================
// PLAYBOOK PRÁTICO DO CLOSER — Bebedouros Industriais (Tudo de Filtro)
// ----------------------------------------------------------------------------
// Guia de execução do fluxo comercial, do preparo antes do contato ao pós-venda.
// Complementa (não substitui) script-venda.js, produtos.js e precos.js.
//
// FONTE DE VERDADE (não inventar nada além disto):
//   produtos.js, precos.js, script-venda.js
//
// REGRAS INEGOCIÁVEIS que atravessam todo o playbook:
//   - O PICO simultâneo define o modelo, NUNCA o total de pessoas.
//   - Compressor: 15/25/60 L = 1/10; 100/200 L = 1/5. Refil = Acquabios Multi (1º brinde).
//   - Upsell refil: normal R$ 69 cada (3 = R$ 207); com o bebedouro, 3 por R$ 159
//     (economia R$ 48). Cliente fica com 4 refis (~1 ano). SÓ após aceitar o bebedouro.
//   - NUNCA prometer potabilidade nem % de economia de energia.
//   - Água de poço / com problema => avaliação técnica (não afirmar que só o refil resolve).
//   - Voltagem sempre confirmar (110/220). Frete grátis só para SP; fora de SP, calcular.
//   - Dimensões do site estão pendentes de validação => NÃO citar medida como definitiva.
//   - Sem urgência FALSA. Sem falar mal de concorrente. Desconto só com contrapartida.
//
// Placeholders aceitos: [nome], [modelo], [cidade], [valor], [horario],
//   [quantidade], [prazo], [voltagem].
// ============================================================================

module.exports = {
  META: {
    titulo: "Playbook Prático do Closer",
    subtitulo: "Do preparo antes do contato ao pós-venda: as 18 etapas do fechamento de bebedouro industrial, com o que fazer, o que perguntar e o que nunca fazer em cada uma."
  },

  FLUXO: [
    {
      num: 1,
      titulo: "Preparação antes do contato",
      icon: "clipboard",
      objetivo: "Chegar na conversa sabendo o máximo possível: origem do lead, o que já veio preenchido (cidade, segmento, mensagem) e qual hipótese de modelo faz sentido — para conduzir, não improvisar.",
      fazer: [
        "Ler o CRM antes de falar: origem, cidade, segmento, mensagem inicial e histórico.",
        "Levantar hipótese de modelo pelo que já se sabe (segmento típico), mas confirmar sempre pelo pico.",
        "Ter em mãos preço, condição de pagamento e regra de frete (SP x fora de SP).",
        "Checar se é lead novo ou recontato para não repetir perguntas já respondidas."
      ],
      perguntar: [
        "O que já sei sobre esse lead que evita eu perguntar de novo?",
        "Qual segmento provável e qual pico eu preciso confirmar?",
        "É uso próprio, revenda ou compra pública (licitação)?"
      ],
      evitar: [
        "Abrir a conversa sem ter olhado o CRM.",
        "Presumir modelo pelo total de pessoas sem confirmar o pico.",
        "Citar medida do site como definitiva (estão pendentes de validação)."
      ],
      exemploBom: "Antes de responder o lead de academia em Campinas, o closer viu no CRM que veio por anúncio, anotou a hipótese do 60 L e já deixou a condição na tela para confirmar só o pico.",
      exemploRuim: "Responder \"oi, temos vários modelos, qual você quer?\" sem ler nada do que o lead já informou.",
      criterio: "Só avança quando sabe origem, cidade, segmento e tem hipótese de modelo para testar contra o pico."
    },
    {
      num: 2,
      titulo: "Abertura",
      icon: "hand-wave",
      objetivo: "Responder rápido, se apresentar, dar contexto e assumir a condução pedindo permissão para qualificar — sem parecer robô nem catálogo.",
      fazer: [
        "Se apresentar pelo nome e pela Tudo de Filtro.",
        "Dar contexto (\"vi que você procura bebedouro industrial\").",
        "Pedir permissão para fazer poucas perguntas antes de falar de valor."
      ],
      perguntar: [
        "Posso te fazer 3 perguntas rápidas para indicar o modelo certo?",
        "É isso mesmo, bebedouro industrial, correto?"
      ],
      evitar: [
        "Mandar tabela de preço de cara, antes de entender o pico.",
        "Abrir com textão no WhatsApp (1-2 linhas que puxam resposta).",
        "Começar a conversa pelo preço."
      ],
      exemploBom: "Olá, [nome], tudo bem? Aqui é o consultor da Tudo de Filtro. Vi que você procura bebedouro industrial. Para eu indicar o modelo certo, posso entender rapidamente como será o uso?",
      exemploRuim: "\"Bom dia! O 100 litros sai R$ 2.450. Quer fechar?\" — preço antes de qualquer pergunta.",
      criterio: "Só avança depois que o cliente aceita responder as perguntas de qualificação."
    },
    {
      num: 3,
      titulo: "Rapport",
      icon: "handshake",
      objetivo: "Criar segurança e confiança em poucos segundos, mostrando interesse real e conhecimento do segmento do cliente, sem enrolação.",
      fazer: [
        "Usar escuta ativa e devolver o que o cliente disse com as palavras dele.",
        "Validar a preocupação do cliente antes de argumentar.",
        "Demonstrar que entende o segmento (academia, indústria, escola, obra)."
      ],
      perguntar: [
        "Então o problema aparece mais no horário de pico, correto?",
        "Vocês chamam de funcionários, colaboradores ou trabalhadores?"
      ],
      evitar: [
        "Rapport falso ou puxa-saquismo.",
        "Falar mais do que ouvir logo no começo.",
        "Ignorar o segmento e tratar tudo igual."
      ],
      exemploBom: "Faz sentido sua preocupação: quando o consumo fica concentrado no almoço, um equipamento menor perde capacidade de recuperação. Em indústria isso é comum por causa dos turnos.",
      exemploRuim: "\"Legal, mas deixa eu te falar do produto\" — atropela o que o cliente acabou de contar.",
      criterio: "O cliente demonstra que se sentiu ouvido e segue engajado na conversa."
    },
    {
      num: 4,
      titulo: "Identificação do motivo da compra",
      icon: "search",
      objetivo: "Descobrir o que fez o cliente procurar agora: dor real, urgência e consequência de não resolver — não só o motivo declarado.",
      fazer: [
        "Perguntar o que motivou a busca neste momento.",
        "Separar motivo declarado da dor real por trás.",
        "Mapear a consequência de não resolver (reclamação, obra parada, inauguração)."
      ],
      perguntar: [
        "O que fez você procurar um bebedouro agora?",
        "Qual problema está acontecendo hoje?",
        "O equipamento atual parou ou a água não fica gelada?"
      ],
      evitar: [
        "Ficar só no motivo de superfície sem entender a dor.",
        "Pular para o produto antes de entender o porquê da compra.",
        "Presumir urgência que o cliente não confirmou."
      ],
      exemploBom: "O bebedouro de plástico da fábrica parou e no calor do turno da tarde o pessoal reclama — precisam resolver antes da próxima fiscalização. Aí está a dor e a urgência real.",
      exemploRuim: "\"Ah, você quer um bebedouro, então tá, qual tamanho?\" — sem descobrir por que ele procura.",
      criterio: "Você consegue nomear a dor real, a urgência e a consequência de não agir."
    },
    {
      num: 5,
      titulo: "Qualificação",
      icon: "target",
      objetivo: "Capturar o essencial para dimensionar e vender: pessoas, simultaneidade, segmento, cidade, voltagem, origem da água, prazo e decisor.",
      fazer: [
        "Perguntar quantas pessoas usam e quantas ao mesmo tempo no pico.",
        "Confirmar voltagem (110/220) e cidade (frete).",
        "Confirmar se é uso próprio, revenda ou licitação."
      ],
      perguntar: [
        "No horário de maior movimento, quantas pessoas usam ao mesmo tempo?",
        "A voltagem do local é 110 ou 220?",
        "É para qual cidade e é uso da própria empresa ou revenda?"
      ],
      evitar: [
        "Perguntar só o total de pessoas e recomendar por aí.",
        "Perguntar \"quanto você tem para gastar?\" seco.",
        "Deixar cidade e voltagem em aberto até a proposta."
      ],
      exemploBom: "\"Uns 40 no pico, 220, em Campinas, uso próprio\" — com isso já dá para dimensionar sem chutar.",
      exemploRuim: "\"Somos 300 funcionários\" e o closer já indica o 200 L, sem perguntar quantos usam ao mesmo tempo.",
      criterio: "Tem pessoas, simultaneidade, segmento, cidade, voltagem e tipo de compra na mão."
    },
    {
      num: 6,
      titulo: "Dimensionamento",
      icon: "ruler",
      objetivo: "Traduzir a qualificação em modelo certo, usando o pico simultâneo e a recuperação de temperatura (compressor), não a capacidade do reservatório como limite diário.",
      fazer: [
        "Usar o pico simultâneo como variável principal do modelo.",
        "Considerar turnos, intervalos concentrados e local quente/sem ventilação.",
        "Avaliar mais de um ponto de água em vez de forçar um só equipamento."
      ],
      perguntar: [
        "Quantas pessoas por turno e os intervalos são concentrados?",
        "Quantos pontos de água e o ambiente é quente ou sem ventilação?",
        "A água é de rede ou de poço?"
      ],
      evitar: [
        "Dimensionar pelo total diário em vez do pico.",
        "Descer de modelo só por preço sem registrar o risco.",
        "Ignorar ambiente quente, que exige mais da recuperação."
      ],
      exemploBom: "300 pessoas na fábrica, mas 40 no pico do intervalo, ambiente quente: 100 L com compressor 1/5 pela recuperação, avaliando um segundo ponto no galpão distante.",
      exemploRuim: "Indicar 200 L \"porque são 300 pessoas\", ignorando que só 30 usam ao mesmo tempo.",
      criterio: "Existe UM modelo recomendado, justificado pelo pico e pela recuperação de temperatura."
    },
    {
      num: 7,
      titulo: "Identificação do decisor",
      icon: "users",
      objetivo: "Saber quem decide e quem aprova o pagamento antes de investir energia na proposta, para não fechar com quem não pode dizer sim.",
      fazer: [
        "Perguntar quem mais participa da decisão e quem aprova a verba.",
        "Descobrir o que o decisor olha primeiro (preço, prazo, garantia).",
        "Oferecer conversa com o decisor quando ele ainda não participou."
      ],
      perguntar: [
        "Você decide sozinho ou tem mais alguém que aprova junto?",
        "Quem aprova o pagamento na empresa?",
        "Que ponto o responsável costuma olhar primeiro?"
      ],
      evitar: [
        "Assumir que o contato é o decisor sem confirmar.",
        "Montar proposta pesada antes de saber quem aprova.",
        "Deixar o contato carregar sozinho a parte técnica com o chefe."
      ],
      exemploBom: "\"Quem aprova é o diretor financeiro, e ele olha prazo primeiro\" — o closer já monta a proposta destacando prazo e oferece falar direto com ele.",
      exemploRuim: "Passar a proposta completa e só depois descobrir que \"preciso ver com meu sócio\".",
      criterio: "Você sabe quem decide, quem paga e o que o decisor valoriza."
    },
    {
      num: 8,
      titulo: "Apresentação da recomendação",
      icon: "layout-grid",
      objetivo: "Indicar UM modelo com convicção técnica, justificado pelo pico e pela recuperação de temperatura — recomendação profissional, não menu de 5 opções.",
      fazer: [
        "Recomendar um único modelo e explicar o porquê.",
        "Justificar pela faixa de pico e pelo compressor certo.",
        "Confirmar com o cliente se faz sentido para a operação dele."
      ],
      perguntar: [
        "Faz sentido para o seu movimento?",
        "Esse cenário que descrevi é o de vocês, correto?"
      ],
      evitar: [
        "Jogar os 5 modelos e mandar o cliente escolher.",
        "Descer de modelo só para baratear sem registrar o risco.",
        "Citar medidas do site como definitivas."
      ],
      exemploBom: "Pelo seu pico, minha recomendação é o [modelo]: dimensionado para essa faixa e com o compressor certo para recuperar a temperatura no pico. Faz sentido para você?",
      exemploRuim: "\"Temos 15, 25, 60, 100 e 200 litros, qual você prefere?\" — transfere a insegurança para o cliente.",
      criterio: "Cliente entende qual modelo, por quê, e concorda com a lógica antes do preço."
    },
    {
      num: 9,
      titulo: "Construção de valor",
      icon: "gem",
      objetivo: "Ancorar valor no que está incluso e no custo de errar o tamanho ANTES do preço, para o número cair em terreno preparado.",
      fazer: [
        "Listar o que acompanha: inox, garantia 12 meses, torneiras metálicas, 1º refil.",
        "Traduzir característica em benefício e em impacto prático no pico.",
        "Usar prova social por segmento parecido com o do cliente."
      ],
      perguntar: [
        "Você concorda que o pior cenário é faltar água gelada no pico?",
        "Faz sentido pensar no custo de comprar errado e ter que trocar depois?"
      ],
      evitar: [
        "Falar de potabilidade ou de percentual de economia de energia.",
        "Prometer prazo de troca de refil fixo como garantia.",
        "Correr para o preço sem construir valor."
      ],
      exemploBom: "É todo em inox, garantia de 12 meses e vem com o 1º refil. O erro mais caro aqui é levar um pequeno demais para economizar: ele liga, mas não recupera no pico e o pessoal reclama.",
      exemploRuim: "\"Custa R$ 2.450\" logo de cara, sem dizer o que está incluso nem o risco de subdimensionar.",
      criterio: "O cliente percebe valor concreto antes de ouvir o preço."
    },
    {
      num: 10,
      titulo: "Envio da proposta",
      icon: "receipt",
      objetivo: "Apresentar a condição completa e clara (modelo, valor, pagamento, frete, garantia, refil), já direcionando para uma decisão entre Pix e parcelado.",
      fazer: [
        "Fechar modelo, quantidade, voltagem e nº de torneiras.",
        "Apresentar valor no Pix e parcelado, dizendo o que está incluso.",
        "Tratar o frete com transparência (SP x fora de SP)."
      ],
      perguntar: [
        "Essa configuração atende ao que vocês precisam?",
        "Você prefere no Pix ou parcelado?"
      ],
      evitar: [
        "Prometer frete grátis fora de SP.",
        "Dar preço sem dizer o que está incluso.",
        "Perguntar \"quer fechar?\" quando dá para oferecer alternativa que já fecha."
      ],
      exemploBom: "Para [quantidade] unidade do [modelo] em [voltagem]: no Pix [valor], ou 7x, já com garantia, torneiras metálicas e 1º refil. Essa configuração atende?",
      exemploRuim: "Mandar só \"R$ 2.450\" sem itens, sem frete e sem próxima pergunta.",
      criterio: "Proposta completa enviada e cliente convidado a escolher a forma de pagamento."
    },
    {
      num: 11,
      titulo: "Tratamento de objeções",
      icon: "shield",
      objetivo: "Ouvir, investigar e isolar a objeção real antes de responder, sem gastar o melhor argumento na barreira errada.",
      fazer: [
        "Ouvir a objeção inteira sem interromper.",
        "Investigar o que está por trás (comparação, modelo, decisor, prazo).",
        "Isolar: \"fora isso, tem mais algum ponto?\" antes de responder."
      ],
      perguntar: [
        "Você está comparando com um equipamento da mesma capacidade e configuração?",
        "Fora o valor, tem mais algo te segurando — modelo, prazo ou aprovação?"
      ],
      evitar: [
        "Dar desconto na primeira reclamação de preço.",
        "Responder rápido sem entender a objeção real.",
        "Discutir com o cliente em vez de investigar."
      ],
      exemploBom: "\"Entendo. Você compara com equipamento da mesma capacidade e compressor, ou com um modelo menor? Quero comparar item a item com você.\"",
      exemploRuim: "\"Está caro? Te dou 10% então.\" — cede antes de entender a objeção.",
      criterio: "A objeção real foi nomeada, isolada e tratada, e o cliente confirma que resolveu."
    },
    {
      num: 12,
      titulo: "Negociação",
      icon: "scale",
      objetivo: "Preservar o preço e o modelo adequado, concedendo apenas com contrapartida clara e sem urgência falsa.",
      fazer: [
        "Amarrar qualquer concessão a um avanço (fecha hoje? à vista?).",
        "Usar contrapartidas: Pix, quantidade, retirada, decisão.",
        "Manter o modelo adequado; se descer, registrar o risco."
      ],
      perguntar: [
        "Se eu conseguir uma condição melhor, você fecha hoje?",
        "Seria à vista no Pix ou parcelado?"
      ],
      evitar: [
        "Oferecer desconto antes da objeção.",
        "Dar desconto sem contrapartida.",
        "Criar urgência falsa ou prometer prazo/faturamento sem confirmar."
      ],
      exemploBom: "\"Posso verificar uma condição. Se conseguirmos melhorar o valor, vocês avançam hoje? Seria à vista ou parcelado?\"",
      exemploRuim: "\"Tem desconto?\" — \"Consigo dar 10%.\" (sem contrapartida, sem avanço).",
      criterio: "Toda concessão veio atrelada a uma contrapartida e a um passo de avanço."
    },
    {
      num: 13,
      titulo: "Fechamento",
      icon: "check-circle",
      objetivo: "Ajudar o cliente a decidir e transformar decisão em ação, pedindo os dados do pedido com a técnica certa para o momento.",
      fazer: [
        "Escolher a técnica (assumido, alternativa, resumo, próximo passo, condicional, decisor).",
        "Recapitular o que está incluso antes do \"posso formalizar?\".",
        "Pedir CNPJ/CPF, endereço e confirmação de voltagem."
      ],
      perguntar: [
        "Podemos seguir com o [modelo] em [voltagem]?",
        "Posso formalizar o pedido?"
      ],
      evitar: [
        "Criar urgência falsa (\"é só hoje\").",
        "Fechar com modelo subdimensionado sem registrar o risco.",
        "Prometer prazo de entrega sem confirmar com a operação."
      ],
      exemploBom: "Então fica o [modelo], compressor certo para o seu pico, torneiras metálicas, 1º refil incluso e entrega para [cidade]. Posso formalizar?",
      exemploRuim: "\"Fecha agora que a promoção acaba hoje\" — escassez inventada.",
      criterio: "Cliente disse sim e passou (ou está passando) os dados do pedido."
    },
    {
      num: 14,
      titulo: "Upsell dos refis",
      icon: "plus-circle",
      objetivo: "Somente APÓS o sim ao bebedouro, oferecer os 3 refis adicionais como fechamento de valor, começando pelo brinde.",
      fazer: [
        "Confirmar primeiro que o bebedouro está fechado.",
        "Lembrar que o 1º refil já vai de brinde.",
        "Oferecer 3 por R$ 159 (em vez de R$ 207), economia de R$ 48."
      ],
      perguntar: [
        "Posso incluir os 3 refis por R$ 159 na sua proposta?",
        "Quer já deixar as próximas trocas programadas?"
      ],
      evitar: [
        "Oferecer refil antes de o cliente decidir o bebedouro.",
        "Prometer prazo de troca fixo, potabilidade ou economia percentual.",
        "Insistir depois de um \"não\" claro."
      ],
      exemploBom: "Fechado o bebedouro! O 1º refil já vai de brinde. Cada avulso é R$ 69, mas você leva mais 3 por R$ 159 (economiza R$ 48) e fica com ~1 ano de trocas. Posso incluir?",
      exemploRuim: "Oferecer o combo de refis no meio da qualificação, antes de o cliente aceitar o equipamento.",
      criterio: "Upsell apresentado só após o sim, com status (aceito/recusado) definido."
    },
    {
      num: 15,
      titulo: "Próximo passo",
      icon: "flag",
      objetivo: "Nunca deixar a conversa no ar: todo atendimento termina com uma ação concreta e uma data.",
      fazer: [
        "Definir a ação (emitir pedido, calcular frete, montar proposta ao diretor).",
        "Colocar uma data/hora de retorno.",
        "Confirmar o combinado com o cliente."
      ],
      perguntar: [
        "Combinamos que eu retorno até [horario], pode ser?",
        "Fica bom se eu te confirmo o frete de [cidade] até [prazo]?"
      ],
      evitar: [
        "Encerrar com \"qualquer coisa me avisa\" sem data.",
        "Prometer retorno num prazo que não vai cumprir.",
        "Deixar o cliente sem saber qual é o próximo movimento."
      ],
      exemploBom: "Combinado, [nome]! Vou calcular o frete de [cidade] e te retorno até [horario]. Qualquer coisa antes disso, me chama.",
      exemploRuim: "\"Então tá, qualquer coisa você me chama\" — sem ação e sem data.",
      criterio: "Existe uma ação com dono e uma data acordada com o cliente."
    },
    {
      num: 16,
      titulo: "Registro no CRM",
      icon: "database",
      objetivo: "Deixar o histórico fiel: modelo, condição, status do upsell, objeções e o próximo passo datado, com tarefa criada.",
      fazer: [
        "Registrar modelo recomendado, condição e frete tratado.",
        "Anotar status do upsell (apresentado/aceito/recusado).",
        "Criar tarefa com a data do próximo passo."
      ],
      perguntar: [
        "Registrei o modelo, a condição e o status do upsell?",
        "A tarefa do próximo passo está com data?"
      ],
      evitar: [
        "Fechar o atendimento sem tarefa no CRM.",
        "Registrar informação inventada ou incompleta.",
        "Deixar o estágio do funil desatualizado."
      ],
      exemploBom: "CRM: 100 L 220V, Pix R$ 2.328, frete de Campinas a calcular, upsell apresentado (aguardando), tarefa \"retornar frete\" para amanhã 10h.",
      exemploRuim: "Fechar a conversa e não registrar nada — o próximo contato começa do zero.",
      criterio: "Registro completo e tarefa datada criada no CRM."
    },
    {
      num: 17,
      titulo: "Follow-up",
      icon: "repeat",
      objetivo: "Manter o ciclo curto vivo com follow-ups que agregam informação, nunca cobranças vazias tipo \"e aí?\".",
      fazer: [
        "Trazer uma informação nova a cada follow-up (frete, prazo, condição).",
        "Referenciar o combinado anterior e o próximo passo.",
        "Encerrar com elegância quando o cliente esfria de vez."
      ],
      perguntar: [
        "Consegui o frete de [cidade], quer que eu já deixe reservado?",
        "Você chegou a falar com o decisor sobre o [modelo]?"
      ],
      evitar: [
        "Escrever \"conseguiu ver?\", \"e aí?\", \"alguma novidade?\".",
        "Cobrar sem agregar nada novo.",
        "Sumir e deixar o lead esfriar sem retomada."
      ],
      exemploBom: "[nome], consegui confirmar o frete de [cidade] em [valor] e o prazo de [prazo]. Quer que eu já deixe o [modelo] reservado?",
      exemploRuim: "\"E aí, vai fechar?\" — cobrança seca, sem informação nova.",
      criterio: "Cada follow-up carrega informação nova e um próximo passo claro."
    },
    {
      num: 18,
      titulo: "Pós-venda",
      icon: "life-buoy",
      objetivo: "Garantir a boa entrega, confirmar satisfação e plantar a próxima venda (refil, nova unidade, indicação).",
      fazer: [
        "Confirmar recebimento, instalação e voltagem correta.",
        "Programar o lembrete da próxima troca de refil.",
        "Pedir indicação e registrar a conta para expansão."
      ],
      perguntar: [
        "O equipamento chegou certinho e a voltagem bateu?",
        "Está atendendo bem no horário de pico?",
        "Conhece outra unidade ou empresa que precise de bebedouro?"
      ],
      evitar: [
        "Sumir depois da venda.",
        "Prometer prazo fixo de troca de refil como garantia.",
        "Deixar de registrar a conta para futuras vendas."
      ],
      exemploBom: "[nome], tudo certo com o [modelo]? Já deixei anotado para te lembrar da próxima troca de refil. Se conhecer outra unidade que precise, me avisa que cuido com prioridade.",
      exemploRuim: "Entregar e nunca mais falar com o cliente — perde refil, expansão e indicação.",
      criterio: "Entrega confirmada, próxima troca programada e gancho de nova venda plantado."
    }
  ],

  ABERTURAS: [
    {
      canal: "WhatsApp",
      fala: "Oi, [nome]! Aqui é o consultor da Tudo de Filtro. 💧 Vi que você está buscando bebedouro industrial. Para eu já te indicar o modelo certo (e não te empurrar o mais caro à toa), posso te fazer 3 perguntinhas rápidas sobre o uso?"
    },
    {
      canal: "Ligação",
      fala: "Olá, [nome], tudo bem? Aqui é o consultor da Tudo de Filtro. Vi que você está buscando um bebedouro industrial. Para eu indicar o modelo certo e não correr o risco de colocar um equipamento menor ou maior do que o necessário, posso entender rapidamente como será o uso?"
    },
    {
      canal: "Lead de anúncio",
      fala: "Oi, [nome]! Aqui é o consultor da Tudo de Filtro. Você clicou no nosso anúncio de bebedouro industrial, então já te respondo de primeira. Para eu indicar o modelo certo, posso entender rapidamente como será o uso de vocês?"
    },
    {
      canal: "Lead de formulário",
      fala: "Olá, [nome], tudo bem? Aqui é o consultor da Tudo de Filtro. Recebi seu formulário sobre bebedouro industrial com os dados de [cidade]. Para eu montar a recomendação certa, posso confirmar rapidamente alguns pontos do uso?"
    },
    {
      canal: "Cliente antigo",
      fala: "Oi, [nome]! Aqui é o consultor da Tudo de Filtro, tudo bem? Já atendemos vocês antes, então vou direto ao ponto. Vi que você voltou a procurar bebedouro industrial. Para eu indicar o modelo certo desta vez, posso entender como vai ser o uso agora?"
    },
    {
      canal: "Indicação",
      fala: "Olá, [nome]! Aqui é o consultor da Tudo de Filtro. Você foi indicado por quem já compra com a gente, então quero te atender bem. Vi que precisa de bebedouro industrial. Para eu indicar o modelo certo, posso entender rapidamente como será o uso?"
    },
    {
      canal: "Cotação empresarial",
      fala: "Olá, [nome], tudo bem? Aqui é o consultor da Tudo de Filtro. Recebi a solicitação de cotação de bebedouro industrial da sua empresa. Para eu montar a proposta certa e não errar o dimensionamento, posso confirmar rapidamente como será o uso e a voltagem do local?"
    },
    {
      canal: "Licitação",
      fala: "Olá, [nome]. Aqui é o consultor da Tudo de Filtro. Recebemos a demanda relacionada ao edital de bebedouro industrial. Para eu alinhar a proposta à especificação e ao prazo, posso confirmar a quantidade, a voltagem e as condições exigidas no edital?"
    },
    {
      canal: "Revendedor",
      fala: "Olá, [nome], tudo bem? Aqui é o consultor da Tudo de Filtro. Entendi que o interesse é para revenda de bebedouro industrial. Para eu te apresentar a condição comercial e o mix certo, posso entender o volume de compra e o perfil dos seus clientes?"
    }
  ],

  ABERTURA_PORQUE: [
    "Apresenta o consultor e a empresa, dando identidade humana à conversa.",
    "Dá contexto (bebedouro industrial), mostrando que você já sabe do que se trata.",
    "Explica o motivo das perguntas: indicar o modelo certo, não empurrar o mais caro.",
    "Reduz a resistência ao pedir permissão antes de qualificar.",
    "Posiciona você como especialista que dimensiona, não como vendedor de catálogo.",
    "Evita começar por preço, que é o erro que trava a conversa antes de gerar valor."
  ],

  RAPPORT: {
    intro: [
      "Segurança",
      "Interesse real",
      "Clareza",
      "Confiança",
      "Respeito pelo tempo",
      "Conhecimento do segmento"
    ],
    tecnicas: [
      {
        nome: "Escuta ativa",
        exemplo: "Então o principal problema acontece no horário do almoço, quando várias pessoas utilizam ao mesmo tempo. Correto?"
      },
      {
        nome: "Espelhamento de linguagem",
        exemplo: "Usar as mesmas palavras do cliente: se ele fala \"funcionários\", você fala \"funcionários\"; se fala \"colaboradores\" ou \"obra\", você acompanha o termo dele."
      },
      {
        nome: "Validação",
        exemplo: "Faz sentido sua preocupação, porque quando o consumo fica concentrado, um equipamento menor pode perder capacidade de recuperação."
      }
    ],
    segmentos: [
      {
        seg: "Academia",
        fala: "Em academia, o mais importante não é apenas o total de alunos cadastrados, mas quantos utilizam o bebedouro no horário de pico."
      },
      {
        seg: "Indústria",
        fala: "Em indústria, normalmente precisamos entender os turnos e os intervalos, porque é nesse momento que a demanda fica concentrada."
      },
      {
        seg: "Escola",
        fala: "Em escola, os intervalos mudam completamente o dimensionamento, porque muitos alunos utilizam ao mesmo tempo."
      },
      {
        seg: "Obra",
        fala: "Em obra, além da quantidade de trabalhadores, precisamos entender cobertura, energia, ponto de água e segurança do local."
      }
    ],
    bom: "Cliente diz que o pessoal reclama de água quente no pico; o closer responde: \"Faz sentido, [nome]. Em indústria isso acontece bem no intervalo, quando todo mundo usa junto. É esse horário concentrado que a gente precisa resolver, certo?\" — usa o termo dele, valida e devolve o problema com clareza.",
    ruim: "Cliente conta o problema e o closer corta: \"Ótimo, deixa eu te falar dos nossos modelos\" — ignora o que foi dito, não valida e parte para o pitch."
  },

  DESCOBERTA: {
    perguntas: [
      "O que fez você procurar um bebedouro agora?",
      "É uma instalação nova ou vocês já possuem um equipamento?",
      "Qual problema está acontecendo hoje?",
      "O equipamento atual parou?",
      "A água não fica gelada?",
      "Existe reclamação dos funcionários?",
      "Hoje vocês utilizam galões?",
      "Existe dificuldade com troca e armazenamento?",
      "É uma obra, inauguração ou nova unidade?",
      "Já existe prazo para resolver?"
    ],
    identificar: [
      "Motivo declarado",
      "Dor real",
      "Urgência",
      "Consequência",
      "Próximo passo"
    ]
  },

  BANTDP: {
    need: [
      "Quantas pessoas utilizarão?",
      "Como fornecem água hoje?",
      "Qual é o principal problema?",
      "O problema acontece durante todo o dia ou em horários específicos?",
      "Existe reclamação?",
      "É substituição ou compra nova?",
      "Quantos equipamentos já existem?",
      "O que precisa melhorar em relação ao sistema atual?"
    ],
    dimensionamento: [
      "Quantas pessoas há no local?",
      "Quantas utilizam ao mesmo tempo?",
      "Quantos turnos existem?",
      "Quantas pessoas por turno?",
      "Qual é o horário de pico?",
      "O consumo fica concentrado nos intervalos?",
      "Quantos pontos de água serão necessários?",
      "O uso é interno ou externo?",
      "O local tem cobertura?",
      "É um local quente?",
      "Qual a voltagem (110/220)?",
      "Existe ponto hidráulico disponível?",
      "Existe ponto de drenagem?",
      "Qual o espaço disponível?",
      "A água é de rede ou de poço?",
      "Existe outro sistema de filtragem?",
      "Há previsão de crescimento do número de pessoas?",
      "Quantas torneiras são necessárias?",
      "Qual o CEP para o cálculo do frete?"
    ],
    checklist: [
      "Quantidade de pessoas",
      "Pessoas simultâneas",
      "Pico",
      "Segmento",
      "Cidade",
      "CEP",
      "Voltagem",
      "Origem da água",
      "Prazo",
      "Decisor"
    ],
    budget: {
      perguntas: [
        "Já existe verba aprovada para o equipamento?",
        "Vocês trabalham com alguma faixa de investimento para isso?",
        "A compra seria à vista, no cartão ou faturada?",
        "Vocês estão comparando só preço ou também capacidade, durabilidade e suporte?",
        "A aprovação financeira já passou ou ainda precisa passar?"
      ],
      evitar: "Perguntar seco \"Quanto você tem para gastar?\" — soa como tentativa de calibrar o preço para cima e derruba a confiança."
    },
    authority: [
      "Você participa da decisão de compra?",
      "Quem mais avalia junto com você?",
      "Quem aprova o pagamento?",
      "A manutenção ou o técnico precisa validar algo?",
      "A diretoria recebe a proposta antes da decisão?",
      "A compra é para a empresa ou para um cliente de vocês?"
    ],
    timing: [
      "Para quando vocês precisam do equipamento?",
      "Existe data de inauguração ou entrega de obra?",
      "O equipamento atual já parou?",
      "A ideia é comprar ainda neste mês?",
      "Quando vocês costumam bater o martelo em decisões assim?",
      "Qual etapa ainda falta para vocês decidirem?"
    ],
    processo: [
      "Vocês precisam de proposta formal?",
      "Existe cadastro de fornecedor a cumprir?",
      "A compra é direta?",
      "Precisam de três cotações?",
      "Passa por licitação?",
      "Existe edital com especificação?",
      "O frete precisa entrar incluso?",
      "Precisam de instalação?",
      "Há análise de crédito para o faturamento?",
      "Qual é o próximo passo depois que a proposta chegar?"
    ]
  },

  CONFIRMACAO: {
    script: "Só para confirmar se eu entendi corretamente: vocês têm [quantidade] pessoas, com cerca de [quantidade] utilizando no mesmo horário, principalmente no período de [horario]. Hoje o problema é [problema], e vocês precisam resolver isso até [prazo]. Correto?",
    avaliar: [
      "Clareza",
      "Precisão",
      "Uso dos dados",
      "Confirmação",
      "Ausência de informações inventadas"
    ]
  },

  RECOMENDACAO: {
    estrutura: [
      "Diagnóstico",
      "Modelo recomendado",
      "Motivo",
      "Diferenciais",
      "Impacto prático",
      "Confirmação"
    ],
    script: "Pelo cenário que você me apresentou, minha recomendação é o modelo de [modelo]. Eu não indicaria o modelo menor porque o consumo fica concentrado em [horario] e ele poderia trabalhar muito próximo do limite. Esse modelo possui [diferencial], o que ajuda a manter uma recuperação mais adequada da temperatura durante o pico. Faz sentido para sua operação?",
    porModelo: [
      {
        litros: 15,
        fala: "Para um time enxuto, com baixa simultaneidade no pico, o modelo de 15 litros (compressor 1/10) atende bem escritórios, consultórios e salas comerciais. Só confirmo: quantas pessoas usam ao mesmo tempo no horário de maior movimento? Porque é o pico, não o total, que define o tamanho."
      },
      {
        litros: 25,
        fala: "Para uma operação pequena com pico moderado, o modelo de 25 litros (compressor 1/10) atende clínicas, academias de bairro e escolas pequenas. Confirmando o pico simultâneo: se o consumo se concentrar num único horário, avalio subir de faixa para não trabalhar no limite."
      },
      {
        litros: 60,
        fala: "Pelo seu pico, o modelo de 60 litros (compressor 1/10) é o mais indicado: foi feito para uma faixa maior de consumo simultâneo, comum em academias, escolas e restaurantes. Ele recupera a temperatura melhor no movimento. Só reforço que a decisão é pelo pico, não pelo total de pessoas."
      },
      {
        litros: 100,
        fala: "Para alta demanda com intervalos concentrados, minha recomendação é o modelo de 100 litros, que já vem com compressor 1/5. Esse compressor dá uma recuperação de temperatura melhor no pico, o que é decisivo em indústria, escola grande e obra. Eu não desceria de modelo só por preço sem te avisar do risco."
      },
      {
        litros: 200,
        fala: "Para o topo de demanda, o modelo de 200 litros (compressor 1/5) atende grandes indústrias, grandes obras e órgãos públicos. Se o seu pico passar até da faixa dele, em vez de forçar um só equipamento, eu avalio com você mais de uma unidade e mais pontos de água. Sempre confirmando o pico simultâneo, nunca só o total."
      }
    ]
  },

  VALOR: [
    {
      componente: "Compressor 1/5",
      caracteristica: "Compressor de maior capacidade (nos modelos 100 e 200 litros).",
      beneficio: "Recuperação de temperatura mais rápida.",
      impacto: "Menor risco de perder temperatura no pico, quando todos usam ao mesmo tempo."
    },
    {
      componente: "Ventoinha",
      caracteristica: "Ventoinha que auxilia na dissipação de calor.",
      beneficio: "Melhor troca térmica do equipamento.",
      impacto: "Desempenho mais estável em uso intenso e em ambiente quente."
    },
    {
      componente: "Torneiras metálicas",
      caracteristica: "Torneiras em metal, mais resistentes.",
      beneficio: "Maior resistência ao uso.",
      impacto: "Menos quebra e menos manutenção com muitas pessoas usando."
    },
    {
      componente: "Estrutura em inox",
      caracteristica: "Equipamento todo em inox, com serpentina interna em aço inox 304.",
      beneficio: "Facilidade de limpeza e resistência.",
      impacto: "Adequado ao uso comercial e industrial, com higiene e durabilidade."
    },
    {
      componente: "Refil Acquabios Multi",
      caracteristica: "Refil de filtragem que acompanha o equipamento (1º refil como brinde).",
      beneficio: "Água filtrada e refrigerada no mesmo equipamento.",
      impacto: "Praticidade: filtragem e refrigeração juntas, sem depender de galão."
    }
  ],

  PROPOSTA: {
    itens: [
      "Modelo",
      "Quantidade",
      "Voltagem",
      "Número de torneiras",
      "Valor",
      "Forma de pagamento",
      "Prazo",
      "Frete",
      "Garantia",
      "1º refil incluso",
      "O que está incluso",
      "O que não está incluso"
    ],
    script: "Para o seu cenário, a configuração fica com [quantidade] unidade do modelo [modelo], em [voltagem], com [torneiras]. O valor é de [valor], com possibilidade de [pagamento]. O primeiro refil já acompanha o equipamento, e o prazo de entrega é de [prazo].",
    perguntaCerta: "Essa configuração atende ao que vocês precisam?",
    perguntaEvitar: "Vai fechar?"
  },

  OBJECOES: [
    {
      objecao: "Está caro",
      resposta: "Entendo, [nome]. Só para eu te comparar direito: você está comparando com um equipamento da MESMA capacidade e configuração, ou com um modelo diferente? Pergunto porque o [modelo] foi o que dimensionei pelo seu pico, com o compressor certo para recuperar a temperatura na hora do movimento — e é isso que evita a compra errada que sai duas vezes mais cara.",
      investigar: [
        "Está comparando com a mesma capacidade?",
        "É o mesmo compressor?",
        "Mesmo material (inox)?",
        "Mesma quantidade de torneiras metálicas?",
        "Inclui o refil?",
        "Tem a mesma garantia?",
        "O frete está considerado?",
        "Tem suporte pós-venda igual?"
      ]
    },
    {
      objecao: "Encontrei mais barato",
      resposta: "Pode acontecer, e faz sentido você pesquisar. Para comparar de verdade e não levar gato por lebre, vale olhar 7 pontos: capacidade real, compressor, quantas torneiras e se são metálicas, estrutura em inox, garantia, filtragem inclusa e o suporte pós-venda. Se estiver tudo igual, ótimo. Quer que eu monte essa comparação lado a lado com você?",
      investigar: [
        "É a mesma capacidade e o mesmo compressor?",
        "As torneiras são metálicas e na mesma quantidade?",
        "A estrutura é toda em inox?",
        "A garantia é igual?",
        "Acompanha refil e suporte pós-venda?"
      ]
    },
    {
      objecao: "Quero o menor modelo",
      resposta: "Consigo te fornecer o menor, sem problema. Só preciso deixar registrada uma orientação técnica: pelo seu pico, ele vai trabalhar perto do limite e pode não recuperar a temperatura na hora do movimento. Minha recomendação profissional continua sendo o [modelo]. Se ainda assim preferir o menor, eu formalizo — mas quero que a decisão seja sua com essa informação na mão.",
      investigar: [
        "Qual o pico simultâneo real?",
        "O ambiente é quente ou sem ventilação?",
        "A escolha é por preço ou por espaço?",
        "O cliente entendeu o risco de subdimensionar?"
      ]
    },
    {
      objecao: "Só quero orçamento",
      resposta: "Sem problema, te mando! Só para eu não errar e ter que refazer: quantas pessoas usam no pico, qual a voltagem (110/220), qual a cidade para o frete, o prazo que você precisa e se é uso próprio ou revenda? Com isso eu já te mando o valor certo de primeira.",
      investigar: [
        "Quantas pessoas no pico?",
        "Qual a voltagem?",
        "Qual a cidade/CEP para o frete?",
        "Qual o prazo?",
        "É uso próprio ou revenda?"
      ]
    },
    {
      objecao: "Vou pensar",
      resposta: "Claro, decisão de equipamento não se toma no susto. Só para eu te ajudar melhor: o que ainda falta avaliar é o modelo, o valor, o prazo de entrega, ou tem outra pessoa que precisa aprovar junto? Sabendo disso eu já adianto o que estiver na minha mão.",
      investigar: [
        "É modelo, valor, prazo ou aprovação?",
        "Existe um decisor que ainda não participou?",
        "Falta alguma informação que você pode adiantar?",
        "Existe um prazo real por trás do \"vou pensar\"?"
      ]
    },
    {
      objecao: "Preciso falar com meu diretor",
      resposta: "Perfeito. Para te ajudar a defender lá dentro: qual ponto ele costuma olhar primeiro — preço, prazo ou garantia? Eu já monto a proposta destacando isso. E quando vocês pretendem conversar, ainda essa semana? Assim eu deixo tudo pronto na sua mão até lá.",
      investigar: [
        "Quem é o decisor e o que ele olha primeiro?",
        "Quando pretendem conversar?",
        "Faz sentido uma conversa direta com o decisor?",
        "O que o contato precisa para defender internamente?"
      ]
    },
    {
      objecao: "Quero desconto",
      resposta: "Consigo olhar, mas antes deixa eu entender: se eu conseguir uma condição melhor, você fecha hoje ou ainda tem outro ponto para resolver? E você pensa em à vista no Pix ou parcelado? Pergunto porque à vista eu tenho mais margem para trabalhar. Me diz o que falta para avançar que eu vejo o que dá para fazer.",
      investigar: [
        "Se melhorar a condição, fecha hoje?",
        "Seria à vista no Pix ou parcelado?",
        "É uma unidade ou várias (dilui o custo)?",
        "Há alguma contrapartida possível (retirada, decisão)?"
      ]
    },
    {
      objecao: "O frete ficou caro",
      resposta: "Entendo, e é justo olhar isso. O equipamento é pesado e volumoso, então o frete acompanha a distância e o cuidado no transporte. Algumas saídas: se você puder retirar, a gente tira o frete da conta; se fechar mais de uma unidade, o custo por equipamento dilui; e vale olhar o total da condição, não só a linha do frete isolada. Qual dessas faz mais sentido para você?",
      investigar: [
        "Qual a cidade/CEP e a distância?",
        "O cliente tem como retirar?",
        "É uma unidade ou várias (dilui o frete)?",
        "Ele está olhando o frete isolado ou o total?"
      ]
    },
    {
      objecao: "Não quero os refis",
      resposta: "Sem problema mesmo! O 1º refil já acompanha o equipamento, então você começa tranquilo. A oferta dos 3 adicionais é só para você não precisar comprar em cima da hora — mas fica totalmente a seu critério, dá para pegar depois quando precisar, a R$ 69,00 o unitário. Fechado assim?",
      investigar: [
        "O cliente entendeu que o 1º refil já vem de brinde?",
        "É objeção de preço ou de \"não preciso agora\"?",
        "Vale deixar o gancho registrado para a próxima troca?"
      ]
    }
  ],

  OBJECAO_ESTRUTURA: [
    "Ouvir",
    "Confirmar",
    "Investigar",
    "Isolar",
    "Responder",
    "Confirmar se resolveu",
    "Voltar ao fechamento"
  ],

  NEGOCIACAO: {
    regras: [
      "Não oferecer desconto antes da objeção.",
      "Não reduzir o preço imediatamente.",
      "Não dar desconto sem contrapartida.",
      "Não trocar o modelo adequado por um menor só para ganhar a venda.",
      "Não criar urgência falsa.",
      "Não prometer prazo sem confirmar com a operação.",
      "Não prometer faturamento sem aprovação.",
      "Não falar mal do concorrente."
    ],
    concessoes: [
      "Desconto por pagamento à vista (Pix).",
      "Condição melhor por quantidade (várias unidades).",
      "Abatimento do frete por retirada no local.",
      "Condição por decisão fechada na hora.",
      "Condição atrelada ao prazo de fechamento.",
      "Condição especial para pedido com várias unidades."
    ],
    ruim: {
      cliente: "Tem desconto?",
      closer: "Consigo dar 10%."
    },
    bom: {
      cliente: "Tem desconto?",
      closer: "Posso verificar uma condição. Para eu entender se faz sentido, se conseguirmos melhorar o valor, vocês conseguem avançar? A compra seria à vista ou parcelada?"
    }
  },

  FECHAMENTOS: [
    {
      nome: "Confirmação",
      fala: "Podemos seguir com o modelo de 60 litros em 220 V?"
    },
    {
      nome: "Alternativa",
      fala: "Você prefere aproveitar a condição no Pix ou parcelar?"
    },
    {
      nome: "Resumo",
      fala: "Então teremos o modelo de 100 litros, compressor 1/5, torneiras metálicas, primeiro refil incluso e entrega para [cidade]. Posso formalizar?"
    },
    {
      nome: "Próximo passo",
      fala: "Para emitir o pedido, preciso somente do CNPJ, endereço e voltagem."
    },
    {
      nome: "Condicional",
      fala: "Se eu conseguir confirmar essa condição, conseguimos avançar hoje?"
    },
    {
      nome: "Com decisor",
      fala: "Faz sentido fazermos uma conversa rápida com o responsável pela aprovação para eu explicar o dimensionamento?"
    },
    {
      nome: "Várias unidades",
      fala: "Como são [quantidade] unidades, posso estruturar o pedido completo e verificar uma condição pelo volume. Posso avançar com essa configuração?"
    }
  ],

  UPSELL: {
    momento: "Só depois que o cliente aceitar o bebedouro. Um assunto de cada vez: primeiro fecha o equipamento, só então apresenta a condição dos refis. Registrar no CRM se foi apresentado, aceito ou recusado.",
    scriptPrincipal: "Antes de finalizar, o equipamento já acompanha o primeiro refil como brinde. Temos uma condição exclusiva para quem compra o bebedouro: cada refil custa normalmente R$ 69,00, mas você pode levar mais três por R$ 159,00. Assim, já deixa as próximas trocas programadas e evita precisar comprar separadamente depois. Posso incluir?",
    scripts: [
      {
        contexto: "Empresarial",
        fala: "Para a empresa, o combo dos refis é o mais prático: você já deixa quase um ano de trocas programadas no mesmo pedido, sem abrir requisição nova a cada troca. Ficam 4 refis no total, com economia de R$ 48,00. Posso incluir na proposta?"
      },
      {
        contexto: "Obra",
        fala: "Em obra, refil na hora errada é dor de cabeça, porque o canteiro não pode ficar sem água. Levando os 3 adicionais por R$ 159,00 você já garante as próximas trocas e não depende de compra de última hora no meio da obra. Posso incluir?"
      },
      {
        contexto: "Comprador",
        fala: "Para quem gerencia a compra, faz diferença resolver tudo num pedido só: com os 3 refis por R$ 159,00 você economiza R$ 48,00 e não precisa reabrir processo de compra a cada troca. Posso já incluir junto?"
      }
    ],
    objecoes: [
      "Não preciso agora",
      "Compro depois",
      "Está caro",
      "Não tenho onde guardar",
      "Não sei quando trocar"
    ]
  },

  FOLLOWUP: {
    scripts: [
      {
        contexto: "Após envio da proposta",
        fala: "[nome], te enviei a proposta do [modelo] com a condição que combinamos. Ficou clara para você ou tem algum ponto que eu possa detalhar melhor antes de você decidir?"
      },
      {
        contexto: "Depois de falar com o decisor",
        fala: "[nome], você chegou a conversar com o responsável pela aprovação sobre o [modelo]? Se ele tiver alguma dúvida no dimensionamento, eu explico direto para facilitar a decisão de vocês."
      },
      {
        contexto: "Comparação com concorrente",
        fala: "[nome], montei aquela comparação item a item que combinamos: capacidade, compressor, torneiras metálicas, inox, garantia e refil incluso. Quer que eu te passe lado a lado para você avaliar com segurança?"
      },
      {
        contexto: "Follow-up de prazo",
        fala: "[nome], como você comentou que precisava resolver até [prazo], passei para confirmar se seguimos com o [modelo] a tempo. Quer que eu já reserve para garantir a entrega dentro desse prazo?"
      },
      {
        contexto: "Follow-up com nova informação",
        fala: "[nome], consegui confirmar o frete de [cidade] em [valor] e o prazo de entrega em [prazo]. Com isso resolvido, faz sentido a gente avançar com o [modelo]?"
      },
      {
        contexto: "Encerramento",
        fala: "[nome], vou deixar sua proposta do [modelo] registrada aqui e paro de te acionar para não incomodar. Quando quiser retomar, é só me chamar que a condição a gente rediscute na hora. Obrigado pela conversa!"
      }
    ],
    nuncaEscrever: [
      "Conseguiu ver?",
      "E aí?",
      "Alguma novidade?",
      "Vai fechar?",
      "Posso ajudar?"
    ]
  },

  CARTOES: [
    {
      titulo: "Abertura",
      icon: "hand-wave",
      itens: [
        "Se apresente: nome + Tudo de Filtro.",
        "Dê contexto: bebedouro industrial.",
        "Peça permissão para 3 perguntas.",
        "Nunca abra pelo preço.",
        "1-2 linhas no WhatsApp."
      ]
    },
    {
      titulo: "Perguntas obrigatórias",
      icon: "list-checks",
      itens: [
        "Pico simultâneo (define o modelo).",
        "Voltagem (110/220).",
        "Cidade / CEP (frete).",
        "Segmento e uso.",
        "Prazo e decisor.",
        "Uso próprio, revenda ou licitação?"
      ]
    },
    {
      titulo: "Dimensionamento",
      icon: "ruler",
      itens: [
        "Pico manda, não o total.",
        "Turnos e intervalos concentrados.",
        "Ambiente quente / sem ventilação.",
        "15/25/60 L = 1/10; 100/200 L = 1/5.",
        "Vários pontos > um só forçado.",
        "Medida do site: não citar como definitiva."
      ]
    },
    {
      titulo: "Rapport",
      icon: "handshake",
      itens: [
        "Escuta ativa e espelhamento.",
        "Valide a preocupação do cliente.",
        "Use as palavras dele.",
        "Mostre domínio do segmento.",
        "Respeite o tempo do cliente."
      ]
    },
    {
      titulo: "Objeções",
      icon: "shield",
      itens: [
        "Ouvir, confirmar, investigar, isolar.",
        "\"Caro\": comparar mesma capacidade.",
        "\"Mais barato\": os 7 pontos.",
        "\"Menor\": registrar o risco.",
        "\"Vou pensar\": modelo, valor, prazo ou decisor?",
        "Responder e voltar ao fechamento."
      ]
    },
    {
      titulo: "Fechamento",
      icon: "check-circle",
      itens: [
        "Escolha a técnica pelo momento.",
        "Recapitule o que está incluso.",
        "Peça CNPJ/CPF, endereço, voltagem.",
        "Sem urgência falsa.",
        "Não fechar subdimensionado sem registrar.",
        "Não prometer prazo sem confirmar."
      ]
    },
    {
      titulo: "Upsell",
      icon: "plus-circle",
      itens: [
        "Só depois do sim ao bebedouro.",
        "1º refil já é brinde.",
        "3 por R$ 159 (em vez de R$ 207).",
        "Economia de R$ 48, ~1 ano de trocas.",
        "Sem prazo fixo de troca.",
        "\"Posso incluir?\""
      ]
    },
    {
      titulo: "Follow-up",
      icon: "repeat",
      itens: [
        "Sempre traga informação nova.",
        "Referencie o combinado.",
        "Termine com próximo passo.",
        "Nunca \"e aí?\" ou \"vai fechar?\".",
        "Encerre com elegância se esfriar."
      ]
    },
    {
      titulo: "Licitação",
      icon: "gavel",
      itens: [
        "Especificação e prazo vêm do edital.",
        "Confirme quantidade e voltagem exigidas.",
        "Valide estoque e condição.",
        "Cadastro de fornecedor / documentos.",
        "Tom objetivo, sem pressão comercial."
      ]
    },
    {
      titulo: "CRM",
      icon: "database",
      itens: [
        "Registre modelo e condição.",
        "Frete tratado (SP x fora).",
        "Status do upsell (apresentado/aceito/recusado).",
        "Objeções encontradas.",
        "Tarefa do próximo passo com data."
      ]
    }
  ],

  CHECKLIST: {
    antesProposta: [
      "Quantidade de pessoas",
      "Pessoas simultâneas",
      "Turnos",
      "Horário de pico",
      "Segmento",
      "Problema atual",
      "Modelo atual",
      "Cidade",
      "CEP",
      "Voltagem",
      "Ponto hidráulico",
      "Drenagem",
      "Ambiente",
      "Origem da água",
      "Prazo",
      "Decisor",
      "Forma de compra",
      "Modelo recomendado",
      "Quantidade de equipamentos"
    ],
    antesFechamento: [
      "Valor apresentado",
      "Condição apresentada",
      "Frete confirmado",
      "Prazo confirmado",
      "Garantia explicada",
      "Primeiro refil explicado",
      "Objeção identificada",
      "Decisor envolvido",
      "Próximo passo definido"
    ],
    depoisFechamento: [
      "Documentos recebidos",
      "Pedido emitido",
      "Pagamento confirmado",
      "Upsell apresentado",
      "Upsell aceito ou recusado",
      "CRM atualizado",
      "Tarefa criada",
      "Pós-venda programado"
    ]
  },

  REGRAS: [
    "Não inventar especificações.",
    "Não recomendar modelo apenas por total de pessoas.",
    "Não prometer desempenho absoluto.",
    "Não prometer economia percentual.",
    "Não pressionar o cliente.",
    "Não criar urgência falsa.",
    "Não falar mal do concorrente.",
    "Não dar desconto sem contrapartida.",
    "Não enviar proposta sem próximo passo.",
    "Não deixar o CRM sem tarefa.",
    "Não esquecer o upsell.",
    "Não vender modelo subdimensionado sem registrar a orientação.",
    "Não tratar revendedor como cliente final sem confirmar.",
    "Não prometer tratamento de água de poço só com o refil do bebedouro."
  ]
};
