// ============================================================================
// BANCO DE QUESTÕES — Academia: Especialista Comercial em Filtro de Entrada (TDF)
// ----------------------------------------------------------------------------
// REGRA CRÍTICA: a prova avalia RACIOCÍNIO e CONDUTA COMERCIAL RESPONSÁVEL,
// não decoreba de spec. NENHUMA resposta correta depende de vazão/estágios/
// capacidade inventados — specs vêm da ficha técnica oficial da TDF.
//
// Condutas premiadas: confirmar origem = concessionária (não é poço); ancorar
// na dor real (cloro, barro/sedimento, cor/ferro da rede, desconfiança); não
// prometer potabilidade/remoção garantida; conduzir com agilidade (ciclo 3
// dias); recomendar por perfil (Light Filter carro-chefe, American Filter Inox
// premium, Filtralli entrada); frete grátis só SP; nenhuma oportunidade sem
// próximo passo no CRM.
//
// FORMATO: { id, tema, tipo:"multipla"|"vf"|"cenario", enunciado, opcoes[], correta, explicacao }
//   correta = índice 0-based da opção certa.
//   O sistema embaralha questões E opções e corrige pelo TEXTO — cada opção tem texto único.
// ============================================================================

module.exports = { QUESTOES: [

  // ===================== FUNDAMENTOS =====================
  { id:"q1", tema:"Fundamentos", tipo:"multipla",
    enunciado:"O que caracteriza um filtro de entrada?",
    opcoes:[
      "Um filtro instalado só na torneira da cozinha para beber",
      "A filtragem da casa toda a partir do ponto de entrada da água do imóvel",
      "Um equipamento exclusivo para tratar água de poço",
      "Um purificador que gela a água"
    ], correta:1,
    explicacao:"Filtro de entrada trata a água que chega em toda a casa, instalado no ponto onde a água da rua entra no imóvel." },

  { id:"q2", tema:"Fundamentos", tipo:"multipla",
    enunciado:"Qual a origem da água do cliente típico de filtro de entrada?",
    opcoes:[
      "Poço artesiano não tratado",
      "Concessionária (água da rua urbana)",
      "Mina ou nascente",
      "Caminhão-pipa"
    ], correta:1,
    explicacao:"89% dos casos são água de concessionária — cliente urbano que quer melhorar/desconfia da água da rua." },

  { id:"q3", tema:"Fundamentos", tipo:"vf",
    enunciado:"Filtro de entrada e filtro de torneira resolvem a mesma coisa.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Filtro de torneira atende um ponto (a pia); filtro de entrada trata a água que chega em toda a casa." },

  { id:"q4", tema:"Fundamentos", tipo:"multipla",
    enunciado:"Um cliente reclama de cheiro de cloro no banho. Por que o filtro de torneira não resolve isso?",
    opcoes:[
      "Porque o cloro não tem cheiro",
      "Porque o filtro de torneira trata só um ponto, e o chuveiro recebe a mesma água sem tratar",
      "Porque banho não usa água",
      "Porque o cloro só existe na cozinha"
    ], correta:1,
    explicacao:"A dor está no chuveiro; só o filtro de entrada, que trata a casa toda, alcança esse ponto." },

  { id:"q5", tema:"Fundamentos", tipo:"vf",
    enunciado:"Se o cliente tem poço, o produto indicado é o filtro de entrada.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Poço é água não tratada — outra linha. Filtro de entrada é para água de concessionária." },

  { id:"q6", tema:"Fundamentos", tipo:"multipla",
    enunciado:"Além de melhorar a água, o filtro de entrada ajuda a:",
    opcoes:[
      "Aumentar a pressão da rua",
      "Proteger encanamento e eletrodomésticos ao reter sedimento",
      "Eliminar a conta de água",
      "Substituir a caixa d'água"
    ], correta:1,
    explicacao:"Ao reter barro/areia/ferrugem, reduz sujeira circulando e ajuda a proteger tubulação e aparelhos." },

  { id:"q7", tema:"Fundamentos", tipo:"cenario",
    enunciado:"Cliente: 'quero um filtrinho só na pia, é onde bebo'. Melhor conduta?",
    opcoes:[
      "Concordar e vender só o filtro de torneira sem mais conversa",
      "Reconhecer o ponto, mostrar que a mesma água sai no chuveiro e enche a caixa, e posicionar o filtro de entrada para a casa toda",
      "Dizer que filtro de pia não serve para nada",
      "Encerrar o atendimento"
    ], correta:1,
    explicacao:"Valide a preocupação e amplie: a água que incomoda é a mesma da casa inteira." },

  // ===================== ÁGUA DA CONCESSIONÁRIA =====================
  { id:"q8", tema:"Água da concessionária", tipo:"multipla",
    enunciado:"O que costuma causar o gosto e o cheiro de 'piscina' na água da rua?",
    opcoes:["Sedimento","Cloro usado na desinfecção","Dureza","Falta de água"], correta:1,
    explicacao:"O cloro do tratamento é o responsável pelo gosto/cheiro de piscina que o cliente reclama." },

  { id:"q9", tema:"Água da concessionária", tipo:"multipla",
    enunciado:"De onde costuma vir o barro/sedimento que aparece na água da concessionária?",
    opcoes:[
      "Do filtro do cliente",
      "Da rede e da tubulação, principalmente após manutenção/falta d'água",
      "Sempre de contaminação por esgoto",
      "Da caixa d'água nova"
    ], correta:1,
    explicacao:"Sedimento e ferrugem soltam da rede e do encanamento no caminho até a torneira." },

  { id:"q10", tema:"Água da concessionária", tipo:"vf",
    enunciado:"A água da concessionária já vem tratada, então nunca incomoda o cliente.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Mesmo tratada, pode chegar com cloro, sedimento, gosto/odor e variação — é a dor real do cliente." },

  { id:"q11", tema:"Água da concessionária", tipo:"cenario",
    enunciado:"Cliente diz 'a água já vem tratada da SABESP, pra que filtrar?'. Melhor resposta?",
    opcoes:[
      "'A água da SABESP é péssima, cheia de química'",
      "Concordar que vem tratada e trazer a experiência do dia a dia: cloro no banho, barro, gosto",
      "'Todo mundo precisa de filtro, é essencial'",
      "Encerrar, ele tem razão"
    ], correta:1,
    explicacao:"Não se discute a legalidade da água; valida-se e traz-se a dor cotidiana que ele sente." },

  { id:"q12", tema:"Água da concessionária", tipo:"multipla",
    enunciado:"O cliente pergunta o limite oficial de cloro na água. O que você faz?",
    opcoes:[
      "Cravo um número de memória para mostrar domínio",
      "Explico que valores oficiais vêm de fonte regulatória e remeto à fonte/ficha, sem inventar número",
      "Digo que não existe limite",
      "Invento um valor aproximado"
    ], correta:1,
    explicacao:"Limites e padrões são de norma regulatória. Não se improvisa número." },

  { id:"q13", tema:"Água da concessionária", tipo:"multipla",
    enunciado:"Água 'amarelada' na concessionária costuma estar ligada a quê?",
    opcoes:[
      "Sempre a poço",
      "Sedimento/ferrugem da tubulação e da rede",
      "Excesso de flúor",
      "Cloro em excesso apenas"
    ], correta:1,
    explicacao:"Amarelado na rede costuma vir de ferrugem/sedimento da tubulação — confirme sempre a origem." },

  { id:"q14", tema:"Água da concessionária", tipo:"vf",
    enunciado:"É correto dizer ao cliente que a água da rua é 'contaminada' para fechar mais rápido.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Alarmismo sem base é irresponsável. Ancore na dor real (cloro, barro, gosto), não no medo." },

  { id:"q15", tema:"Água da concessionária", tipo:"multipla",
    enunciado:"Qual dessas é uma dor REAL registrada no CRM de filtro de entrada?",
    opcoes:[
      "'A água está muito gelada'",
      "'Não confio / quero melhorar' a água da rua",
      "'A pressão está alta demais'",
      "'A conta veio cara'"
    ], correta:1,
    explicacao:"'Não confio/quero melhorar' é a maior dor (~54%), seguida de barro, cor/ferro e cloro." },

  // ===================== LINHA DE PRODUTOS =====================
  { id:"q16", tema:"Linha de produtos", tipo:"multipla",
    enunciado:"Qual família é o carro-chefe pelos dados do CRM?",
    opcoes:["Filtralli","American Filter Inox","Light Filter (1000 é o mais vendido)","Nenhuma"], correta:2,
    explicacao:"Light Filter 1000 lidera as vendas (603) — recomendação padrão para o residencial típico." },

  { id:"q17", tema:"Linha de produtos", tipo:"multipla",
    enunciado:"Para um cliente que valoriza acabamento em inox e durabilidade, qual família?",
    opcoes:["Filtralli","American Filter Inox (premium)","Light Filter","Nenhuma, é poço"], correta:1,
    explicacao:"American Filter Inox é a linha premium, indicada para quem valoriza estética e durabilidade." },

  { id:"q18", tema:"Linha de produtos", tipo:"multipla",
    enunciado:"Qual família funciona como porta de entrada mais acessível da linha?",
    opcoes:["Filtralli (V2–V8)","American Filter Inox","Light Filter 1000","Iron Free"], correta:0,
    explicacao:"Filtralli é a linha de entrada; a V2 é a mais vendida da família." },

  { id:"q19", tema:"Linha de produtos", tipo:"cenario",
    enunciado:"O cliente pergunta a vazão exata e o número de estágios de um modelo. Conduta correta?",
    opcoes:[
      "Chutar um número plausível",
      "Explicar o princípio e confirmar a spec exata na ficha técnica oficial da TDF",
      "Dizer que não importa",
      "Inventar para não perder a venda"
    ], correta:1,
    explicacao:"Specs exatas vêm da ficha técnica; nunca se inventa nem se aproxima de cabeça." },

  { id:"q20", tema:"Linha de produtos", tipo:"vf",
    enunciado:"Deve-se recomendar a família pelo perfil e necessidade do cliente, não pela margem.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Encaixe a família (entrada/padrão/premium) no perfil e na dor — nunca empurre o topo sem ler a necessidade." },

  { id:"q21", tema:"Linha de produtos", tipo:"multipla",
    enunciado:"Quais são os três produtos mais fechados no CRM de filtro de entrada?",
    opcoes:[
      "Iron Free, Scale Stop, Bebedouro",
      "Light Filter 1000, American Filter Inox e Filtrali V2",
      "Purificador, torneira e caixa d'água",
      "Fibra 1000, 2000 e 3000"
    ], correta:1,
    explicacao:"Light Filter 1000 (603), American Filter Inox (248) e Filtrali V2 (160) — ótima prova social." },

  { id:"q22", tema:"Linha de produtos", tipo:"cenario",
    enunciado:"Casal quer resolver a água de um apê, gosta de coisas bem-acabadas mas sem exagerar no investimento. Como posicionar?",
    opcoes:[
      "Só o modelo mais caro serve",
      "Light Filter como padrão, mencionando o Inox como upgrade de acabamento, confirmando o modelo na ficha",
      "Filtro de torneira",
      "Dizer que apê não tem solução"
    ], correta:1,
    explicacao:"Padrão Light Filter, com o Inox como opção de acabamento — confirmando o modelo pelo porte." },

  // ===================== COMO FUNCIONA =====================
  { id:"q23", tema:"Como funciona", tipo:"multipla",
    enunciado:"Por que a etapa de sedimentos costuma vir primeiro na filtragem?",
    opcoes:[
      "Por acaso, a ordem é irrelevante",
      "Para reter o que é grosso antes, protegendo as etapas seguintes",
      "Porque o carvão não funciona",
      "Para gelar a água"
    ], correta:1,
    explicacao:"Reter o sólido primeiro evita sobrecarregar carvão e polimento. A ordem, do grosso ao fino, importa." },

  { id:"q24", tema:"Como funciona", tipo:"multipla",
    enunciado:"Qual etapa está mais ligada a reduzir cloro, gosto e odor?",
    opcoes:["Sedimentos","Carvão","Polimento","Nenhuma"], correta:1,
    explicacao:"A etapa de carvão atua sobre cloro, gosto e odor — o 'gosto de piscina'." },

  { id:"q25", tema:"Como funciona", tipo:"multipla",
    enunciado:"Como explicar a filtragem em etapas para um cliente leigo?",
    opcoes:[
      "Detalhando a química de cada mídia filtrante",
      "Ligando cada etapa a uma dor dele: sedimento segura o barro, carvão tira cloro/gosto, polimento dá o acabamento",
      "Falando só de vazão e estágios",
      "Dizendo que é complicado demais para explicar"
    ], correta:1,
    explicacao:"Conecte etapa à dor: assim a explicação técnica vira benefício percebido." },

  { id:"q26", tema:"Como funciona", tipo:"vf",
    enunciado:"Explicar as etapas de filtragem equivale a garantir potabilidade absoluta.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Explicar o que cada etapa faz não é prometer água '100% pura' nem remoção garantida." },

  { id:"q27", tema:"Como funciona", tipo:"multipla",
    enunciado:"O cliente insiste em saber o número exato de estágios do modelo. Melhor conduta?",
    opcoes:[
      "Chutar um número",
      "Explicar o princípio (sedimento→carvão→polimento) e confirmar o número na ficha técnica",
      "Dizer qualquer valor redondo",
      "Ignorar a pergunta"
    ], correta:1,
    explicacao:"O princípio você domina; o número exato vem da ficha técnica oficial." },

  { id:"q28", tema:"Como funciona", tipo:"cenario",
    enunciado:"Cliente reclama de barro e cheiro de cloro. Qual explicação liga corretamente etapa e dor?",
    opcoes:[
      "Carvão segura o barro e sedimento tira o cloro",
      "Sedimento retém o barro e o carvão reduz o cheiro/gosto de cloro",
      "Só o polimento resolve os dois",
      "Nenhuma etapa trata isso"
    ], correta:1,
    explicacao:"Barro → sedimentos; cloro/cheiro → carvão. Cada dor tem sua etapa." },

  // ===================== ICP E JORNADA =====================
  { id:"q29", tema:"ICP e jornada", tipo:"multipla",
    enunciado:"Qual o ciclo de venda mediano do filtro de entrada?",
    opcoes:["1 dia","3 dias","9,5 dias","30 dias"], correta:1,
    explicacao:"Ciclo mediano de 3 dias — o cliente pesquisa e decide em poucos dias; agilidade importa." },

  { id:"q30", tema:"ICP e jornada", tipo:"multipla",
    enunciado:"De onde vem a maior parte dos leads de filtro de entrada?",
    opcoes:[
      "Indicação apenas",
      "Tráfego pago (Google + Meta ≈ 73%)",
      "Porta a porta",
      "Rádio e TV"
    ], correta:1,
    explicacao:"73% é tráfego pago (Google 40% + Meta 33%); indicação vale ~15%." },

  { id:"q31", tema:"ICP e jornada", tipo:"multipla",
    enunciado:"Qual o ticket mediano da linha de filtro de entrada?",
    opcoes:["R$270","R$2.700","R$10.700","R$29.000"], correta:1,
    explicacao:"Ticket mediano de R$2.700 (p25–p75 R$2.480–3.290)." },

  { id:"q32", tema:"ICP e jornada", tipo:"vf",
    enunciado:"Cuidar do pós-venda importa porque indicação gera cerca de 15% das vendas.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Indicação vale ~15%; satisfação e experiência geram novas vendas." },

  { id:"q33", tema:"ICP e jornada", tipo:"multipla",
    enunciado:"Filtro de entrada é a maior linha da TDF em volume de vendas ganhas. Quantas vendas ganhas no CRM?",
    opcoes:["409","697","1.331","51"], correta:2,
    explicacao:"1.331 vendas ganhas (win 21,3%) — a maior linha da TDF." },

  { id:"q34", tema:"ICP e jornada", tipo:"cenario",
    enunciado:"Um lead chega de anúncio dizendo que a água tem gosto de cloro e às vezes sai barro. Como conduzir, dado o ciclo curto?",
    opcoes:[
      "Deixar para retornar semana que vem",
      "Confirmar a dor, posicionar a solução da linha e conduzir com agilidade rumo à proposta",
      "Mandar só o link do site",
      "Pedir para ele pensar sem próximo passo"
    ], correta:1,
    explicacao:"Ciclo de 3 dias + lead de anúncio = confirmar dor e conduzir rápido ao próximo passo." },

  // ===================== QUALIFICAÇÃO =====================
  { id:"q35", tema:"Qualificação", tipo:"multipla",
    enunciado:"Qual pergunta de qualificação nunca pode faltar em filtro de entrada?",
    opcoes:[
      "A cor preferida do produto",
      "A origem da água (confirmar que é concessionária)",
      "A marca do chuveiro",
      "O signo do cliente"
    ], correta:1,
    explicacao:"Confirmar a origem evita recomendar filtro de entrada para quem tem poço (outra linha)." },

  { id:"q36", tema:"Qualificação", tipo:"multipla",
    enunciado:"Para que serve saber o número de moradores e o tipo de imóvel?",
    opcoes:[
      "Curiosidade",
      "Dar o porte/consumo e ajudar a recomendar o modelo certo, confirmando na ficha",
      "Calcular o cloro da rua",
      "Definir a cor do produto"
    ], correta:1,
    explicacao:"Porte/consumo orienta o modelo indicado — que se confirma na ficha técnica." },

  { id:"q37", tema:"Qualificação", tipo:"vf",
    enunciado:"Você deve ler o CRM antes de atender e só perguntar o que ainda falta.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Cidade, origem, queixa e prazo muitas vezes já estão no CRM. Qualificação é conversa, não interrogatório." },

  { id:"q38", tema:"Qualificação", tipo:"multipla",
    enunciado:"O cliente diz que quer resolver 'daqui uns 3 meses'. Isso muda o quê?",
    opcoes:[
      "Nada, trato igual a quem quer agora",
      "É prazo mais longo: mantenho nutrição sem largar, sem forçar fechamento imediato",
      "Descarto o lead",
      "Aumento o preço"
    ], correta:1,
    explicacao:"Prazo longo pede nutrição; prazo curto pede condução imediata. O prazo define o ritmo." },

  { id:"q39", tema:"Qualificação", tipo:"multipla",
    enunciado:"Por que coletar cidade e CEP na qualificação?",
    opcoes:[
      "Para nada específico",
      "Instalação, logística e frete (frete grátis apenas para SP)",
      "Para saber o clima",
      "Para calcular o cloro"
    ], correta:1,
    explicacao:"Cidade/CEP viabilizam instalação e logística e definem frete — grátis só para SP." },

  { id:"q40", tema:"Qualificação", tipo:"cenario",
    enunciado:"Antes de avançar para a proposta, o que precisa estar confirmado?",
    opcoes:[
      "Apenas o telefone do cliente",
      "Origem (concessionária), dor, ponto de instalação, moradores/imóvel, cidade/CEP e prazo",
      "Só o modelo mais caro",
      "A cor do produto"
    ], correta:1,
    explicacao:"Só avance à proposta com o checklist de qualificação completo." },

  // ===================== VALOR =====================
  { id:"q41", tema:"Valor", tipo:"multipla",
    enunciado:"Qual a estrutura correta de apresentação de valor?",
    opcoes:[
      "Listar só as características técnicas",
      "Característica → Benefício → Impacto na vida do cliente",
      "Falar só de preço",
      "Prometer água pura"
    ], correta:1,
    explicacao:"Valor é traduzir a característica em benefício e, principalmente, em impacto real na vida do cliente." },

  { id:"q42", tema:"Valor", tipo:"vf",
    enunciado:"É permitido prometer potabilidade absoluta se ajudar a fechar a venda.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Nunca prometa água '100% pura', potabilidade absoluta ou remoção garantida de contaminante." },

  { id:"q43", tema:"Valor", tipo:"multipla",
    enunciado:"O cliente só reclamou de barro. Onde focar o valor?",
    opcoes:[
      "Em todos os benefícios de uma vez",
      "Na etapa de sedimentos e no impacto de acabar com o barro no copo",
      "No preço mais baixo",
      "Na cor do produto"
    ], correta:1,
    explicacao:"Foque na dor citada: barro → sedimentos → impacto concreto (copo sem barro)." },

  { id:"q44", tema:"Valor", tipo:"multipla",
    enunciado:"Como falar do desempenho quando você não tem o percentual exato de redução?",
    opcoes:[
      "Cravar um percentual qualquer",
      "Falar do benefício em linguagem de experiência ('reduz bastante o cheiro de cloro'), sem inventar número",
      "Dizer que remove 100%",
      "Não falar nada de benefício"
    ], correta:1,
    explicacao:"Percentuais vêm da ficha técnica; fale do benefício sem cravar número não confirmado." },

  { id:"q45", tema:"Valor", tipo:"cenario",
    enunciado:"Depois de apresentar o valor, qual é o passo do especialista?",
    opcoes:[
      "Esperar o cliente voltar sozinho",
      "Confirmar o valor com o cliente ('faz sentido resolver isso na casa toda?') e avançar ao próximo passo",
      "Baixar o preço",
      "Encerrar a conversa"
    ], correta:1,
    explicacao:"Confirmar transforma a apresentação em compromisso e prepara o fechamento." },

  // ===================== OBJEÇÕES =====================
  { id:"q46", tema:"Objeções", tipo:"multipla",
    enunciado:"Qual a estrutura correta para tratar uma objeção?",
    opcoes:[
      "Responder na hora com o melhor argumento",
      "Ouvir → confirmar → investigar → responder → próximo passo",
      "Baixar o preço imediatamente",
      "Encerrar o contato"
    ], correta:1,
    explicacao:"Investigar antes de responder evita rebater a objeção errada; sempre feche com próximo passo." },

  { id:"q47", tema:"Objeções", tipo:"multipla",
    enunciado:"'Está caro' geralmente significa o quê?",
    opcoes:[
      "Que o cliente não tem dinheiro nenhum",
      "Valor não percebido — investigue 'caro comparado a quê?' e reancore no que ele ganha",
      "Que ele quer de graça",
      "Que a venda acabou"
    ], correta:1,
    explicacao:"'Caro' quase nunca é sobre o número, e sim sobre valor não percebido." },

  { id:"q48", tema:"Objeções", tipo:"cenario",
    enunciado:"Cliente: 'filtro de torneira já resolve'. Melhor conduta?",
    opcoes:[
      "Concordar e desistir da venda",
      "Educar sem desmerecer: o de torneira cuida de um ponto; o de entrada trata a água que chega em toda a casa",
      "Dizer que filtro de torneira é lixo",
      "Prometer que o de entrada purifica 100%"
    ], correta:1,
    explicacao:"Diferencie os papéis e recentre na dor da casa toda, sem atacar nem prometer pureza." },

  { id:"q49", tema:"Objeções", tipo:"multipla",
    enunciado:"'Vou pensar' com ciclo de 3 dias — o que fazer?",
    opcoes:[
      "Deixar totalmente no ar",
      "Investigar a dúvida pendente e oferecer um próximo passo",
      "Pressionar para fechar à força",
      "Descartar o lead"
    ], correta:1,
    explicacao:"'Vou pensar' esconde dúvida. Investigue e reconduza sem perder o timing curto." },

  { id:"q50", tema:"Objeções", tipo:"cenario",
    enunciado:"Cliente: 'quero o mais barato'. Conduta que educa e recomenda certo?",
    opcoes:[
      "Empurrar o modelo mais caro",
      "Não brigar com o preço, trazer o critério (dor + porte) e recomendar pela necessidade, mostrando a diferença de valor",
      "Vender o mais barato sem qualificar",
      "Dizer que barato não existe"
    ], correta:1,
    explicacao:"Traga o critério certo: o mais barato pode não atender o porte/dor. Recomende pela necessidade." },

  { id:"q51", tema:"Objeções", tipo:"vf",
    enunciado:"Diante de 'a água já vem tratada', o certo é dizer que a água da concessionária é ruim.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Concorde que vem tratada e traga a dor real do dia a dia; não ataque a concessionária." },

  // ===================== FECHAMENTO =====================
  { id:"q52", tema:"Fechamento", tipo:"multipla",
    enunciado:"O que todo contato de fechamento precisa ter?",
    opcoes:[
      "Um desconto",
      "Um próximo passo combinado, com ação e data",
      "A ficha técnica completa impressa",
      "Uma promessa de pureza"
    ], correta:1,
    explicacao:"Nenhum contato termina sem próximo passo definido — é o que mantém a venda viva no ciclo curto." },

  { id:"q53", tema:"Fechamento", tipo:"multipla",
    enunciado:"Qual destes é um fechamento por alternativa?",
    opcoes:[
      "'Você quer ou não quer?'",
      "'Prefere o Light Filter 1000 ou dar um passo no acabamento com o American Filter Inox?'",
      "'Pensa e me avisa'",
      "'Depois eu te ligo'"
    ], correta:1,
    explicacao:"Alternativa oferece escolha entre opções, não entre sim e não — avança a decisão." },

  { id:"q54", tema:"Fechamento", tipo:"vf",
    enunciado:"Com ciclo de 3 dias, responder rápido e mandar a proposta no mesmo dia aproveita o timing.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Ciclo curto + lead de anúncio pede agilidade: proposta no dia e retorno no dia seguinte." },

  { id:"q55", tema:"Fechamento", tipo:"cenario",
    enunciado:"O cliente gostou da proposta. Qual conduta usa resumo + próximo passo?",
    opcoes:[
      "'Qualquer dia desses eu te retorno'",
      "Recapitular dor + solução para a casa toda e combinar 'envio a proposta hoje e retorno amanhã cedo para acertar a instalação'",
      "Mandar o link e sumir",
      "Pedir para ele decidir sozinho no site"
    ], correta:1,
    explicacao:"Resumo dá segurança; próximo passo com data mantém a venda avançando." },

  { id:"q56", tema:"Fechamento", tipo:"multipla",
    enunciado:"Sobre condições comerciais (prazo, pagamento, frete), o correto é:",
    opcoes:[
      "Prometer o que for preciso para fechar",
      "Seguir a política oficial da TDF e não prometer prazo/condição/frete que não pode cumprir (frete grátis só SP)",
      "Sempre oferecer frete grátis",
      "Dar 20% de desconto por conta própria"
    ], correta:1,
    explicacao:"Condições e frete seguem a política oficial; frete grátis é apenas para SP." },

  // ===================== CRM =====================
  { id:"q57", tema:"CRM", tipo:"multipla",
    enunciado:"Qual a regra de ouro do registro no CRM?",
    opcoes:[
      "Preencher só o telefone",
      "Nenhuma oportunidade sem próximo passo (com data)",
      "Registrar só quando fechar",
      "Anotar apenas o nome"
    ], correta:1,
    explicacao:"Toda oportunidade aberta precisa de próximo passo com data — no ciclo de 3 dias, sem isso ela se perde." },

  { id:"q58", tema:"CRM", tipo:"multipla",
    enunciado:"Por que registrar o motivo de perda real?",
    opcoes:[
      "É pura burocracia",
      "Serve de base para reativação futura e para melhorar a abordagem",
      "Não precisa registrar perda",
      "Só para preencher espaço"
    ], correta:1,
    explicacao:"O motivo real de perda alimenta a reativação e o aprendizado do time." },

  { id:"q59", tema:"CRM", tipo:"cenario",
    enunciado:"O cliente é de poço. Como registrar em uma oportunidade de filtro de entrada?",
    opcoes:[
      "Registrar normal como filtro de entrada",
      "Não é filtro de entrada — é outra linha (água não tratada); corrigir a origem da água",
      "Deixar a origem em branco",
      "Registrar como bebedouro"
    ], correta:1,
    explicacao:"Origem da água define a linha. Poço não é filtro de entrada; registrar certo mantém o CRM confiável." },

  { id:"q60", tema:"CRM", tipo:"multipla",
    enunciado:"Quais campos são essenciais em toda oportunidade de filtro de entrada?",
    opcoes:[
      "Só nome e telefone",
      "Origem da água, dor, produto recomendado, cidade/CEP, próximo passo + data e motivo de perda (se houver)",
      "Apenas o valor",
      "Somente a cidade"
    ], correta:1,
    explicacao:"Esses campos são a memória da venda e sustentam a condução no ciclo curto." },

  { id:"q61", tema:"CRM", tipo:"vf",
    enunciado:"A dor deve ser registrada de forma genérica, sem as palavras do cliente.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Registre a dor com as palavras do cliente — ajuda na reativação e na leitura do que converte." },

  // ===================== CONDUTA GERAL / TRANSVERSAIS =====================
  { id:"q62", tema:"Conduta geral", tipo:"vf",
    enunciado:"É aceitável inventar a vazão de um modelo se o cliente pressionar por um número.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Specs (vazão, estágios, capacidade) vêm da ficha técnica oficial — nunca se inventa." },

  { id:"q63", tema:"Conduta geral", tipo:"multipla",
    enunciado:"Qual afirmação é sempre proibida ao vender filtro de entrada?",
    opcoes:[
      "'Reduz o cheiro de cloro'",
      "'Deixa a água 100% pura e potável, remove qualquer contaminante'",
      "'Trata a água da casa toda'",
      "'Ajuda a proteger o encanamento'"
    ], correta:1,
    explicacao:"Nunca prometa potabilidade absoluta ou remoção garantida de contaminante específico." },

  { id:"q64", tema:"Conduta geral", tipo:"cenario",
    enunciado:"Cliente de fora de SP pergunta sobre frete. Melhor conduta?",
    opcoes:[
      "Prometer frete grátis para fechar",
      "Explicar que frete grátis é apenas para SP e calcular/confirmar o frete conforme a região pela política oficial",
      "Dizer que não tem frete",
      "Ignorar a pergunta"
    ], correta:1,
    explicacao:"Frete grátis só para SP; fora disso, calcule conforme a região sem prometer gratuidade." },

  { id:"q65", tema:"Conduta geral", tipo:"multipla",
    enunciado:"Um lead diz que a água é de poço e tem ferro. Conduta correta?",
    opcoes:[
      "Vender filtro de entrada mesmo assim",
      "Reconhecer que é água não tratada (outra linha) e encaminhar corretamente, não como filtro de entrada",
      "Prometer que o filtro de entrada resolve o ferro do poço",
      "Descartar o cliente"
    ], correta:1,
    explicacao:"Filtro de entrada é para concessionária; poço com ferro é outra linha (água não tratada)." },

  { id:"q66", tema:"Produtos", tipo:"multipla",
    enunciado:"Qual a diferença central entre o American Filter e o Light Filter?",
    opcoes:[
      "Só o preço e a cor",
      "O American NÃO tem carvão e MANTÉM o cloro de propósito; o Light TEM carvão e TIRA o cloro (gosto/cheiro)",
      "O American tem carvão e o Light não",
      "Os dois removem dureza"
    ], correta:1,
    explicacao:"O diferenciador nº1 é a estratégia do cloro: American mantém (sem carvão), Light tira (com carvão)." },
  { id:"q67", tema:"Produtos", tipo:"cenario",
    enunciado:"Cliente com caixa d'água quer limpar a sujeira MAS manter a proteção da água na caixa. Qual família você indica?",
    opcoes:[
      "Light Filter (com carvão)",
      "American Filter (sem carvão) — filtra o sedimento e mantém o cloro que protege a caixa",
      "Nenhuma, é caso de poço",
      "Tanto faz"
    ], correta:1,
    explicacao:"O cloro residual protege a água parada na caixa. O American filtra e mantém o cloro; o Light tiraria essa proteção." },
  { id:"q68", tema:"Como funciona", tipo:"vf",
    enunciado:"Tirar o cloro logo na entrada da casa é sempre a melhor opção.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Falso. O cloro residual protege a água na caixa d'água e na tubulação; tirar na entrada remove essa proteção. O descloro costuma fazer mais sentido no ponto de consumo." },
  { id:"q69", tema:"Como funciona", tipo:"multipla",
    enunciado:"Por que o American Filter mantém o cloro de propósito?",
    opcoes:[
      "Porque carvão é caro",
      "Porque o cloro residual protege a água contra recontaminação na caixa d'água e na tubulação",
      "Porque o cliente gosta do gosto de cloro",
      "Porque não existe carvão para ele"
    ], correta:1,
    explicacao:"Instalado na entrada, manter o cloro preserva o residual que protege a reservação e a casa toda." }

]};
