// ============================================================================
// SCRIPT DE VENDA — Bebedouro Industrial (Tudo de Filtro)
// ----------------------------------------------------------------------------
// Venda DINÂMICA e de ciclo curto (a maioria entra por WhatsApp/CTWA).
// Dois canais lado a lado: WhatsApp (mensagens curtas) e Ligação (falas completas).
//
// FONTE DE VERDADE (não inventar nada além disto):
//   produtos.js, precos.js, mod-07-icp.js, mod-11-bant-dp.js,
//   mod-16-objecoes.js, mod-18-fechamento.js, mod-19-upsell.js
//
// REGRAS INEGOCIÁVEIS embutidas no script:
//   - O PICO de consumo simultâneo define o modelo, NUNCA o total de pessoas.
//     Capacidade do reservatório != limite diário de água.
//   - Compressor: 15/25/60 L = 1/10; 100/200 L = 1/5. Refil = Acquabios Multi (1º brinde).
//   - Upsell refil: normal R$ 69 cada (3 = R$ 207); com o bebedouro, 3 por R$ 159
//     (economia R$ 48). Cliente fica com 4 refis (~1 ano). SÓ após aceitar o bebedouro.
//   - NUNCA prometer potabilidade nem % de economia de energia.
//   - Água de poço / com problema => avaliação técnica (não afirmar que só o refil resolve).
//   - Voltagem sempre confirmar (110/220). Frete grátis só para SP; fora de SP, calcular.
//   - Dimensões do site estão pendentes de validação => NÃO citar medida como definitiva.
//   - Sem urgência FALSA. Sem falar mal de concorrente. Desconto só com contrapartida.
//
// Falas prontas para COPIAR E COLAR. Placeholders: [nome], [cidade], [modelo].
// ============================================================================

module.exports = {
  SCRIPT_META: {
    titulo: "Script de Venda — Bebedouro Industrial",
    subtitulo: "Venda dinâmica de ciclo curto (WhatsApp/CTWA + Ligação) — do primeiro oi ao pedido, com upsell dos refis",
    comoUsar: "Siga as etapas na ordem, mas sem robotizar: cole a fala, adapte o [nome] e o contexto, e SEMPRE avance com um próximo passo datado. Regra de ouro do bebedouro: o PICO simultâneo define o modelo, nunca o total de pessoas."
  },

  ETAPAS: [
    {
      num: 1,
      id: "abertura",
      titulo: "Abertura",
      icon: "👋",
      objetivo: "Responder rápido, criar conexão humana e assumir a condução da conversa sem parecer robô nem catálogo.",
      tecnica: "Quebra de padrão + permissão para qualificar",
      whatsapp: [
        "Oi, [nome]! Aqui é o [seu nome] da Tudo de Filtro 💧 Recebi seu contato sobre bebedouro industrial.",
        "Pra eu já te indicar o modelo certo (e não te empurrar o mais caro à toa), posso te fazer 3 perguntinhas rápidas?"
      ],
      ligacao: [
        "Oi [nome], tudo bem? Aqui é o [seu nome], falo da Tudo de Filtro. Vi que você chegou até a gente procurando bebedouro industrial — é isso mesmo?",
        "Ótimo. Olha, pra eu te recomendar o equipamento certo pro seu caso e não te fazer pagar por algo que você não precisa, posso te fazer umas perguntas rápidas antes de falar de valor? São coisas de 2 minutos."
      ],
      porque: "Pedir permissão para qualificar tira o clima de interrogatório e dá a você o controle da conversa. Dizer que quer acertar o modelo (não empurrar o mais caro) desarma a defesa logo no início.",
      evitar: [
        "Mandar tabela de preços de cara, antes de entender o pico.",
        "Abrir com um textão. No WhatsApp, 1-2 linhas por mensagem que puxam resposta."
      ]
    },
    {
      num: 2,
      id: "qualificacao",
      titulo: "Qualificação rápida (pico, voltagem, cidade, uso)",
      icon: "🎯",
      objetivo: "Em poucas perguntas, capturar o essencial pra dimensionar: pico simultâneo, voltagem, cidade (frete) e tipo de uso/segmento. Enxuto porque a venda é dinâmica.",
      tecnica: "Escuta ativa / espelhamento + amarração (\"faz sentido?\")",
      whatsapp: [
        "Show! 1) No horário de MAIOR movimento, quantas pessoas usam o bebedouro mais ou menos ao mesmo tempo? (é isso que define o tamanho, não o total de gente)",
        "2) A voltagem do local é 110 ou 220? 3) É pra qual cidade? 4) É pra uso da própria empresa ou revenda?",
        "Pode responder tudo junto que eu já monto a recomendação certa 👍"
      ],
      ligacao: [
        "Deixa eu entender o seu movimento: no horário de pico, quantas pessoas usam o bebedouro mais ou menos na mesma hora? Pergunto isso porque o que manda no tamanho é o pico simultâneo, não o total de pessoas que passam no dia.",
        "Perfeito. E o local é 110 ou 220? … Certo. Você é de qual cidade, pra eu já verificar a questão da entrega? E esse bebedouro é pra uso de vocês mesmos ou é pra revenda?",
        "Só pra confirmar que entendi: [espelha o que o cliente disse — ex: \"uns 40 no pico, 220, em Campinas, uso próprio\"]. É isso? Faz sentido?"
      ],
      porque: "O pico simultâneo é a única variável que dimensiona corretamente. Espelhar o que o cliente falou prova que você ouviu e evita recomendar errado. Amarrar com \"faz sentido?\" pega micro-compromissos ao longo do caminho.",
      evitar: [
        "Perguntar \"quantas pessoas no total\" e recomendar por aí — é o erro clássico que subdimensiona ou superdimensiona.",
        "Perguntar \"quanto você tem pra gastar?\" seco. Isso vem depois, por faixa e ancorado em valor."
      ]
    },
    {
      num: 3,
      id: "recomendacao",
      titulo: "Recomendação do modelo",
      icon: "📐",
      objetivo: "Indicar UM modelo com convicção técnica, justificado pelo pico e pela recuperação de temperatura (compressor). Recomendação profissional, não menu.",
      tecnica: "Ancoragem técnica (capacidade + recuperação antes do preço) + fechamento assumido leve",
      whatsapp: [
        "Pelo seu pico, o modelo certo pra você é o [modelo] 👌",
        "Ele foi feito pra dar conta da sua faixa de pico e recuperar a temperatura rápido na hora do movimento — que é onde a maioria dos bebedouros de plástico falha.",
        "Todo em inox, serpentina em aço inox 304, termostato regulável e já vem com o 1º refil. Quer que eu te passe a condição dele?"
      ],
      ligacao: [
        "Com esse pico que você me passou, a minha recomendação profissional é o [modelo]. Ele é dimensionado exatamente pra essa faixa de consumo simultâneo e tem o compressor certo pra recuperar a temperatura na hora do pico — que é o momento em que equipamento subdimensionado deixa o cliente na mão.",
        "E é um equipamento robusto: estrutura toda em inox, serpentina interna em aço inox 304, reservatório atóxico, termostato regulável e pés reguláveis. O primeiro refil Acquabios Multi já acompanha o equipamento.",
        "Faz sentido pra você? Se estiver de acordo, já te passo a condição dele."
      ],
      porque: "Ancorar na capacidade e na recuperação de temperatura ANTES do preço faz o cliente comprar a solução, não o número. Uma recomendação única e justificada transmite autoridade; menu de 5 modelos transfere a insegurança pro cliente.",
      evitar: [
        "Jogar os 5 modelos e mandar o cliente escolher.",
        "Descer de modelo só pra baratear sem registrar o risco. Se o cliente pedir menor, avise (ver objeção \"Quero o menor\").",
        "Citar medidas do site como definitivas — estão pendentes de validação técnica."
      ]
    },
    {
      num: 4,
      id: "valor",
      titulo: "Apresentação de valor (ancoragem)",
      icon: "💎",
      objetivo: "Construir valor com o que está incluso e o custo de errar o tamanho, ANTES de dizer o preço, para o número cair em terreno preparado.",
      tecnica: "Ancoragem de valor + prova social por segmento",
      whatsapp: [
        "Antes do valor, o que vai junto: equipamento todo em inox, garantia de 12 meses, 1º refil incluso e torneiras metálicas.",
        "É o tipo de bebedouro que a gente coloca em [segmento do cliente], onde não pode faltar água gelada na hora do pico — e aguenta uso pesado sem virar dor de cabeça.",
        "O barato de um bebedouro pequeno sai caro: ele não recupera a temperatura no movimento e todo mundo reclama. O [modelo] resolve isso de vez."
      ],
      ligacao: [
        "Deixa eu te mostrar o que você está levando antes de falar de número, pra você ver que não é só um preço. O equipamento é todo em inox, tem garantia de 12 meses, vem com o primeiro refil já incluso e com torneiras metálicas.",
        "Esse é o modelo que a gente coloca em [segmento] parecido com o seu, justamente onde a água quente na hora do pico vira reclamação. Ele foi pensado pra aguentar uso intenso e recuperar a temperatura rápido.",
        "E pensa comigo: o erro mais caro nessa compra é levar um equipamento pequeno demais pra economizar. Ele até liga, mas na hora do pico não dá conta, esquenta e o pessoal reclama. Aí você gasta duas vezes. Por isso eu prefiro te entregar o tamanho certo de primeira."
      ],
      porque: "Ancorar no que está incluso e no custo de subdimensionar cria um contexto de valor; quando o preço aparece, ele compete com o custo de errar, não com o zero. Prova social por segmento reduz a percepção de risco.",
      evitar: [
        "Falar de potabilidade ou de percentual de economia de energia — proibido.",
        "Prometer prazo de troca de refil fixo como garantia.",
        "Correr direto pro preço sem construir o valor."
      ]
    },
    {
      num: 5,
      id: "proposta",
      titulo: "Proposta (preço, pagamento, frete, garantia, refil incluso)",
      icon: "🧾",
      objetivo: "Apresentar a condição de forma clara e completa, já direcionando para uma decisão (Pix x parcelado), com frete tratado conforme a cidade.",
      tecnica: "Fechamento por alternativa (Pix x parcelado) + amarração",
      whatsapp: [
        "Fechou o [modelo]. A condição fica assim:",
        "💠 No Pix: [preço Pix do modelo]\n💳 Parcelado: até 7x de [valor parcela] (total [preço parcelado])\n✅ Já incluso: garantia 12 meses, torneiras metálicas e o 1º refil.",
        "Frete: pra SP a gente trabalha com condição especial; fora de SP eu calculo pela sua cidade e já te confirmo. Você prefere no Pix ou parcelado?"
      ],
      ligacao: [
        "Então, pro [modelo], a condição fica assim: à vista no Pix sai por [preço Pix do modelo]; ou parcelado em até 7 vezes de [valor parcela], dando [preço parcelado] no total. E nos dois casos já entra a garantia de 12 meses, as torneiras metálicas e o primeiro refil incluso.",
        "Sobre o frete: se for entrega em São Paulo eu trabalho uma condição especial; fora de SP eu calculo certinho pela sua cidade e já te confirmo junto — sem surpresa depois.",
        "Você prefere resolver no Pix, que eu consigo trabalhar melhor a condição, ou parcelado pra caber no fluxo de vocês?"
      ],
      porque: "Oferecer duas formas de pagamento que ambas fecham move o cliente do \"se\" pro \"como\". Tratar o frete com transparência (SP x fora de SP) evita a objeção de frete depois e protege a operação de promessa que não se sustenta.",
      evitar: [
        "Prometer frete grátis fora de SP — nunca.",
        "Dar preço sem dizer o que está incluso (garantia, refil, torneiras).",
        "Perguntar \"quer fechar?\" (sim/não) quando dá pra oferecer alternativa que já fecha."
      ]
    },
    {
      num: 6,
      id: "confirmacao",
      titulo: "Confirmação de entendimento",
      icon: "✅",
      objetivo: "Isolar qualquer dúvida antes de fechar, garantindo que problema, modelo, valor e processo estão alinhados. Se travar, voltar uma etapa.",
      tecnica: "Isolar (dos 7 passos de objeção) + uso do silêncio",
      whatsapp: [
        "Ficou claro assim, [nome]? Fora o valor, tem mais algum ponto te segurando — modelo, prazo ou alguém que precise aprovar junto?",
        "Me fala com sinceridade que eu já resolvo o que estiver na minha mão 👍"
      ],
      ligacao: [
        "Deixa eu confirmar se ficou tudo claro pra você. Fora a questão do valor, tem mais alguma coisa te segurando — é o modelo, é o prazo de entrega, ou tem outra pessoa que precisa aprovar junto com você?",
        "[Fica em silêncio e deixa o cliente responder. Não preencha o vazio.]",
        "Perfeito. Então, pelo que eu entendi, a gente está alinhado no [modelo], na condição e na entrega pra [cidade], certo?"
      ],
      porque: "Isolar antes de fechar impede que você gaste o melhor argumento numa objeção que não era a decisiva. O silêncio depois da pergunta faz o cliente nomear a real barreira — que você trata antes de avançar.",
      evitar: [
        "Atropelar o silêncio com mais argumento. Pergunte e espere.",
        "Empurrar o fechamento quando há dúvida aberta — volte a etapa que ficou incompleta."
      ]
    },
    {
      num: 7,
      id: "fechamento",
      titulo: "Fechamento",
      icon: "🤝",
      objetivo: "Ajudar o cliente a decidir e transformar decisão em ação, pedindo os dados do pedido. Escolher a técnica conforme o momento (ver bloco FECHAMENTOS).",
      tecnica: "Fechamento assumido / por resumo / por próximo passo",
      whatsapp: [
        "Então fechamos assim: [modelo], compressor certo pro seu pico, torneiras metálicas, 1º refil incluso e entrega pra [cidade]. Posso formalizar? 🙌",
        "Pra emitir o pedido eu vou precisar de: CNPJ (ou CPF), endereço de entrega e a confirmação da voltagem (110/220). Pode me mandar?"
      ],
      ligacao: [
        "Deixa eu recapitular pra não faltar nada: fica o [modelo], com o compressor certo pro seu pico, torneiras metálicas, o primeiro refil já incluso e entrega pra [cidade]. Posso formalizar?",
        "Perfeito. Pra eu emitir o pedido, preciso do CNPJ ou CPF, o endereço de entrega e a confirmação da voltagem, 110 ou 220. Pode me passar que eu já dou entrada."
      ],
      porque: "Depois das 5 etapas (problema, modelo, valor, dúvidas, processo), pedir os dados move a conversa da decisão pra execução. O resumo reforça o valor: o cliente ouve tudo que está levando antes do \"posso formalizar?\".",
      evitar: [
        "Criar urgência falsa (\"é só hoje\") — proibido. Escassez só se for REAL (estoque, prazo do próprio cliente).",
        "Fechar com modelo subdimensionado sem registrar o risco por escrito.",
        "Prometer prazo de entrega ou faturamento sem confirmar antes com a operação."
      ]
    },
    {
      num: 8,
      id: "upsell",
      titulo: "Upsell dos refis",
      icon: "➕",
      objetivo: "Somente APÓS o sim ao bebedouro, oferecer os 3 refis adicionais como fechamento de valor, não como empurrão. Um assunto de cada vez.",
      tecnica: "Fechamento por resumo do benefício + brinde primeiro",
      whatsapp: [
        "Fechado o bebedouro! 🎉 Antes de finalizar, uma condição só pra quem leva o equipamento:",
        "O 1º refil já vai de brinde. Cada refil avulso custa R$ 69,00, mas você pode levar mais 3 por R$ 159,00 (em vez de R$ 207,00) — economiza R$ 48,00 e já fica com ~1 ano de trocas programadas.",
        "Assim você não corre atrás de refil de última hora. Posso incluir?"
      ],
      ligacao: [
        "Show, então está fechado o bebedouro. Antes de eu finalizar, deixa eu te passar uma condição que é só pra quem compra o equipamento. O primeiro refil já vai de brinde com o bebedouro. Cada refil avulso custa R$ 69,00, mas você pode levar mais três por R$ 159,00, em vez dos R$ 207,00 que sairiam soltos.",
        "Na prática, você economiza R$ 48,00 e fica com quatro refis no total, o que dá aproximadamente um ano de trocas já programadas — sem precisar abrir uma nova compra a cada troca nem correr atrás de refil na hora errada. Posso incluir na sua proposta?"
      ],
      porque: "Depois do sim ao equipamento, o refil deixa de ser objeção e vira complemento lógico da decisão. Começar pelo brinde (o cliente já ganhou algo) e fechar com \"posso incluir?\" torna esse um dos fechamentos mais naturais que existem.",
      evitar: [
        "Oferecer refil antes de o cliente decidir o bebedouro — vira ruído.",
        "Prometer prazo de troca fixo, potabilidade ou economia percentual.",
        "Insistir depois de um \"não\" claro. Registre como apresentado/recusado no CRM e deixe o gancho pra próxima troca."
      ]
    },
    {
      num: 9,
      id: "proximo-passo",
      titulo: "Próximo passo + registro",
      icon: "📌",
      objetivo: "Nunca deixar a conversa no ar: todo atendimento termina com um próximo passo DATADO e o registro no CRM (modelo, condição, upsell apresentado/aceito/recusado).",
      tecnica: "Próximo passo sempre com data",
      whatsapp: [
        "Combinado, [nome]! Vou [ação concreta: emitir o pedido / calcular o frete de [cidade] / preparar a proposta pro diretor] e te retorno até [data/hora].",
        "Se precisar de qualquer coisa antes disso, é só me chamar aqui 💧"
      ],
      ligacao: [
        "Então ficou combinado assim: eu vou [ação concreta — ex: dar entrada no pedido / calcular o frete de [cidade] / montar a proposta destacando o que o diretor olha] e te retorno até [data/hora]. Pode ser?",
        "Fechado. Já deixo tudo encaminhado e te chamo até lá. Obrigado, [nome], qualquer dúvida antes disso me chama."
      ],
      porque: "Coaching sem próximo passo é advice; venda sem próximo passo datado esfria. Uma data e uma ação com dono transformam intenção em compromisso e mantêm o ciclo curto que essa venda pede.",
      evitar: [
        "Encerrar com \"qualquer coisa me avisa\" sem data — é o buraco por onde o deal ghosteia.",
        "Não registrar no CRM o estágio, a condição e o status do upsell.",
        "Prometer retorno num prazo que você não vai cumprir."
      ]
    }
  ],

  ICP_AJUSTES: [
    {
      segmento: "Academia",
      gancho: "Pico intenso nos horários de aula; aluno reclama de água quente na hora do treino. É a recuperação no pico que conta, não o total de matriculados.",
      pergunta_chave: "Quantos alunos treinam no mesmo horário de pico? E quais são os horários de maior movimento?",
      modelo_comum: "Costuma cair no 60 L (70-150 pessoas/hora), mas SÓ confirmando o pico simultâneo — sala grande com aula lotada pode pedir mais."
    },
    {
      segmento: "Indústria",
      gancho: "Muita gente, turnos e calor de operação; água quente derruba o conforto e o bem-estar. Alto potencial de múltiplas unidades por setor/galpão.",
      pergunta_chave: "Quantas pessoas por turno e os intervalos são concentrados (todo mundo junto)? Quantos pontos de água e qual a voltagem?",
      modelo_comum: "Geralmente 100 L (150-300/h, compressor 1/5) ou 200 L (300-350/h) — confirmando pico por turno e avaliando vários pontos em vez de um só."
    },
    {
      segmento: "Escola",
      gancho: "O recreio concentra centenas de alunos em minutos: pico altíssimo e curto, estrutura que aguenta uso infantil. Potencial de várias unidades por pátio/andar.",
      pergunta_chave: "Quantos alunos por turno e quantos usam no recreio ao mesmo tempo? Quantos pátios/andares?",
      modelo_comum: "Do 100 L ao 200 L conforme o pico do recreio — quase sempre com mais de um ponto distribuído, confirmando a simultaneidade."
    },
    {
      segmento: "Obra / Construção civil",
      gancho: "Calor pesado, NR de bem-estar do trabalhador e frentes espalhadas. Robustez de obra e volume no pico; potencial alto por frente de trabalho.",
      pergunta_chave: "Qual o efetivo na obra, as frentes/andares são distantes e qual a voltagem disponível no canteiro?",
      modelo_comum: "100 L ou 200 L pela robustez e volume no pico — avaliando mais de um ponto para frentes distantes, sempre confirmando o pico."
    },
    {
      segmento: "Empresa / Escritório",
      gancho: "Reclamação de água quente e a logística de galão no corporativo. Decisão por praticidade, estética e conforto do time; um ponto por andar em prédios maiores.",
      pergunta_chave: "Quantas pessoas usam no andar no horário de pico? É um ponto por pavimento?",
      modelo_comum: "Times enxutos: 15 L (até 25/h) ou 25 L (até 40/h); andares maiores: 60 L — sempre pelo pico do andar, não pelo total de funcionários."
    },
    {
      segmento: "Padaria / Restaurante",
      gancho: "Padaria: calor do forno e fluxo o dia todo. Restaurante: pico de almoço concentra clientes e equipe em pouco tempo, com recuperação rápida e higiene.",
      pergunta_chave: "Qual o pico de movimento (no almoço, no restaurante) e é equipe + clientes juntos? Salão e cozinha são pontos separados?",
      modelo_comum: "Padaria costuma ser ponto único (25 L / 60 L); restaurante pode pedir 60 L ou dois pontos (salão e interna) — confirmando o pico do almoço."
    },
    {
      segmento: "Licitação / Revenda",
      gancho: "Licitação: especificação e conformidade pesam, quantidade e prazo vêm do edital. Revenda: quer margem, giro e produto que não gere pós-venda; compra recorrente.",
      pergunta_chave: "É compra direta ou passa por licitação/edital? (licitação) Qual o volume de compra e o perfil dos seus clientes? (revenda)",
      modelo_comum: "Definido por edital ou pelo mix de revenda (vários modelos) — na licitação, o fechamento é validar estoque e condição; na revenda, condição comercial e recorrência."
    }
  ],

  FECHAMENTOS: [
    {
      nome: "Assumido (por confirmação)",
      quando: "O cliente já sinalizou preferência clara pelo modelo e pela voltagem. Você confirma a escolha como se a decisão já estivesse encaminhada.",
      whatsapp: "Perfeito, então seguimos com o [modelo] em [110/220] V? Se estiver de acordo eu já começo a preparar o pedido 👍",
      ligacao: "Então podemos seguir com o [modelo] em [110/220] V? Se estiver tudo certo, eu já começo a preparar o seu pedido."
    },
    {
      nome: "Por alternativa",
      quando: "Modelo já definido, falta a forma de pagamento. Você oferece duas opções que ambas fecham a venda, tirando o cliente do \"se\".",
      whatsapp: "Fechou o [modelo]! Você prefere no Pix (eu consigo trabalhar uma condição melhor) ou parcelado em até 7x?",
      ligacao: "Ótima escolha, o [modelo] atende bem seu caso. Você prefere resolver no Pix, que eu consigo uma condição melhor, ou parcelado em até 7 vezes pra caber no fluxo de vocês?"
    },
    {
      nome: "Por resumo",
      quando: "Depois de alinhar modelo, configuração e entrega. Recapitula tudo num bloco só, reforça o valor e conduz ao \"posso formalizar?\".",
      whatsapp: "Recapitulando: [modelo], compressor certo pro seu pico, torneiras metálicas, 1º refil incluso e entrega pra [cidade]. Posso formalizar?",
      ligacao: "Deixa eu recapitular pra não faltar nada: fica o [modelo], compressor certo pro seu pico, torneiras metálicas, o primeiro refil já incluso e entrega pra [cidade]. Posso formalizar?"
    },
    {
      nome: "Condicional",
      quando: "O cliente pediu uma condição específica (pagamento, prazo). Você amarra a concessão a um compromisso de avançar — a condição só se justifica se ele fecha.",
      whatsapp: "Se eu confirmar essa condição de pagamento com a operação, a gente consegue avançar hoje? Aí eu já checo sabendo que fechamos na sequência.",
      ligacao: "Combinado. Se eu conseguir confirmar essa condição de pagamento, a gente consegue avançar hoje? Assim eu já checo com a operação sabendo que a gente fecha na sequência."
    },
    {
      nome: "Com decisor",
      quando: "Existe um aprovador acima do contato que ainda não participou. O fechamento é conseguir a conversa com quem decide, tirando o peso técnico do seu contato.",
      whatsapp: "Faz sentido a gente marcar uma conversa rápida com quem aprova, pra eu explicar o dimensionamento na fonte? Assim você não carrega a parte técnica sozinho. Quando vocês pretendem falar?",
      ligacao: "Faz total sentido. Faz sentido marcarmos uma conversa rápida com o responsável pela aprovação, pra eu explicar o dimensionamento? Assim ele tira as dúvidas na fonte e você não precisa carregar a parte técnica sozinho. Quando vocês pretendem conversar?"
    },
    {
      nome: "Licitação ganha",
      quando: "Compra pública ou licitação já vencida: quantidade e prazo vêm do edital. O fechamento é validar estoque e condição pra formalizar, objetivo e sem pressão comercial.",
      whatsapp: "Com a quantidade e o prazo do edital confirmados, posso validar estoque e condição pra formalizar o pedido? Eu checo a disponibilidade e já te retorno com tudo pronto.",
      ligacao: "Excelente. Com a quantidade e o prazo confirmados no edital, posso validar estoque e condição pra formalizarmos o pedido? Eu checo a disponibilidade e já te retorno com tudo pronto pra emissão."
    }
  ],

  OBJECOES: [
    {
      objecao: "Está caro",
      whatsapp: "Entendo, [nome]. Só pra eu te comparar direito: você está comparando com um equipamento da MESMA capacidade e configuração, ou com um modelo diferente? Pergunto porque o [modelo] foi o que dimensionei pelo seu pico, com o compressor certo pra recuperar a temperatura na hora do movimento.",
      ligacao: "Entendo. Você está comparando com um equipamento da mesma capacidade e configuração, ou com um modelo diferente? Pergunto porque o [modelo] foi o que eu dimensionei pelo seu pico, com o compressor certo pra recuperar a temperatura na hora do movimento. Se for pra comparar, eu quero comparar item a item com você."
    },
    {
      objecao: "Encontrei mais barato",
      whatsapp: "Pode acontecer, e faz sentido você pesquisar. Pra comparar de verdade, vale olhar 7 pontos: capacidade real, compressor, quantas torneiras e se são metálicas, estrutura em inox, garantia, filtragem inclusa e o suporte pós-venda. Quer que eu monte essa comparação lado a lado com você?",
      ligacao: "Pode acontecer, e faz sentido você pesquisar. Pra você comparar de verdade e não levar gato por lebre, vale olhar sete pontos: a capacidade real, o compressor, quantas torneiras e se são metálicas, a estrutura em inox, a garantia, a filtragem que acompanha e o suporte depois da venda. Se estiver tudo igual, ótimo. Quer que eu monte essa comparação lado a lado?"
    },
    {
      objecao: "Quero o menor modelo",
      whatsapp: "Consigo te fornecer o menor, sem problema. Só preciso deixar registrada uma orientação técnica: pelo seu pico, ele vai trabalhar perto do limite e pode não recuperar a temperatura na hora do movimento. Minha recomendação profissional continua sendo o [modelo]. Se ainda assim preferir o menor, eu formalizo — mas quero que a decisão seja sua com essa informação na mão.",
      ligacao: "Consigo fornecer o menor, sem problema. Só preciso deixar registrado uma orientação técnica: pelo efetivo e pelo pico que você me passou, ele vai trabalhar perto do limite e pode não recuperar a temperatura no movimento. Minha recomendação profissional é o [modelo]. Se ainda assim preferir o menor, eu formalizo, mas quero que a decisão seja sua com essa informação na mão."
    },
    {
      objecao: "Só quero orçamento",
      whatsapp: "Sem problema, te mando! Só pra eu não errar e ter que refazer: quantas pessoas usam no pico, qual a voltagem (110/220), qual a cidade pro frete, o prazo que você precisa e se é uso próprio ou revenda? Com isso eu já te mando o valor certo de primeira.",
      ligacao: "Sem problema, te mando. Só pra eu não errar e ter que refazer: quantas pessoas usam no pico, qual a voltagem do local, qual a cidade pra eu ver o frete, qual o prazo que você precisa e se é pra uso da própria empresa ou pra revenda? Com isso eu já te mando o valor certo de primeira."
    },
    {
      objecao: "Vou pensar",
      whatsapp: "Claro, decisão de equipamento não se toma no susto. Só pra eu te ajudar melhor: o que ainda falta avaliar é o modelo, o valor, o prazo de entrega, ou tem outra pessoa que precisa aprovar junto? Sabendo disso eu já adianto o que estiver na minha mão.",
      ligacao: "Claro, decisão de equipamento a gente não toma no susto. Só pra eu te ajudar melhor: o que ainda falta avaliar é o modelo, o valor, o prazo de entrega ou tem outra pessoa que precisa aprovar junto com você? Sabendo disso eu já adianto o que estiver na minha mão."
    },
    {
      objecao: "Preciso falar com meu diretor",
      whatsapp: "Perfeito. Pra te ajudar a defender lá dentro: qual ponto ele costuma olhar primeiro — preço, prazo ou garantia? Eu já monto a proposta destacando isso. E quando vocês pretendem conversar, ainda essa semana? Assim eu deixo tudo pronto na sua mão até lá.",
      ligacao: "Perfeito. Pra eu te ajudar a defender lá dentro: qual ponto ele costuma olhar primeiro, é preço, é prazo ou é garantia? Posso montar a proposta já destacando isso pra facilitar a aprovação. E quando vocês pretendem conversar, ainda essa semana? Assim eu deixo tudo pronto na sua mão até lá."
    },
    {
      objecao: "O frete ficou caro",
      whatsapp: "Entendo, e é justo olhar isso. O equipamento é pesado e volumoso, então o frete acompanha a distância e o cuidado no transporte. Algumas saídas: se você puder retirar, a gente tira o frete da conta; se fechar mais de uma unidade, o custo por equipamento dilui; e vale olhar o total da condição, não só a linha do frete isolada. Qual dessas faz mais sentido pra você?",
      ligacao: "Entendo, e é justo olhar isso. O equipamento tem peso e volume grandes, então o frete acompanha a distância e o cuidado no transporte pra chegar sem avaria. Algumas saídas: se você tiver como retirar, a gente tira o frete da conta; se fechar mais de uma unidade, o custo por equipamento dilui; e vale olhar o total da condição, não só a linha do frete isolada. Qual dessas faz mais sentido pra você?"
    },
    {
      objecao: "Quero desconto",
      whatsapp: "Consigo olhar, mas antes deixa eu entender: se eu conseguir uma condição melhor, você fecha hoje ou ainda tem outro ponto pra resolver? E você pensa em à vista no Pix ou parcelado? Pergunto porque à vista eu tenho mais margem pra trabalhar. Me diz o que falta pra avançar que eu vejo o que dá pra fazer.",
      ligacao: "Consigo olhar, mas antes deixa eu entender: se eu conseguir uma condição melhor, você fecha hoje ou ainda tem outro ponto pra resolver? E você pensa em à vista no Pix ou parcelado? Pergunto porque à vista eu tenho mais margem pra trabalhar. Me diz exatamente o que falta pra avançar que eu vejo o que dá pra fazer."
    },
    {
      objecao: "Não quero os refis",
      whatsapp: "Sem problema mesmo! O 1º refil já acompanha o equipamento, então você começa tranquilo. Quando chegar perto da próxima troca é só me chamar que a gente resolve — o refil unitário fica R$ 69,00. Fechado assim?",
      ligacao: "Sem problema mesmo. O primeiro refil já acompanha o equipamento, então você já sai coberto. A oferta dos três adicionais é só pra você não precisar comprar em cima da hora — mas fica totalmente a seu critério, dá pra pegar depois quando precisar, a R$ 69,00 o unitário. Fechado assim?"
    },
    {
      objecao: "Não sei a voltagem",
      whatsapp: "Tranquilo, é rápido de descobrir. Dá uma olhada na tomada/quadro do local ou pergunta pra quem cuida da parte elétrica — a maioria das empresas é 220, mas preciso confirmar pra não te mandar o equipamento errado. Assim que você checar me avisa que eu emito certinho 👍",
      ligacao: "Tranquilo, isso a gente confirma rapidinho. Dá pra ver na tomada ou no quadro de energia do local, ou perguntar pra quem cuida da parte elétrica. É importante porque o equipamento é 110 ou 220 e eu não quero te mandar o errado. Assim que você confirmar, me avisa que eu já emito com a voltagem certa."
    }
  ],

  UPSELL: {
    momento: "SÓ após o cliente aceitar o bebedouro. Um assunto de cada vez: primeiro fecha o equipamento, só então apresenta a condição dos refis. Registrar no CRM se foi apresentado, aceito ou recusado.",
    whatsapp: "Fechado o bebedouro! 🎉 Antes de finalizar, uma condição só pra quem leva o equipamento: o 1º refil já vai de brinde. Cada refil avulso custa R$ 69,00, mas você pode levar mais 3 por R$ 159,00 (em vez de R$ 207,00) — economiza R$ 48,00, fica com 4 refis no total e já garante ~1 ano de trocas programadas, sem correr atrás de refil de última hora. Posso incluir?",
    ligacao: "Show, então está fechado o bebedouro. Antes de eu finalizar, deixa eu te passar uma condição que é só pra quem compra o equipamento. O primeiro refil já vai de brinde. Cada refil avulso custa R$ 69,00, mas você pode levar mais três por R$ 159,00, em vez dos R$ 207,00 que sairiam soltos. Na prática, você economiza R$ 48,00, fica com quatro refis no total e já garante aproximadamente um ano de trocas programadas, sem precisar abrir uma nova compra a cada troca. Posso incluir na sua proposta?"
  }
};
