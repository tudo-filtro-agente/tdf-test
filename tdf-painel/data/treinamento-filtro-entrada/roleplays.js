// ============================================================================
// ROLEPLAYS — Academia: Especialista Comercial em Filtro de Entrada (Tudo de Filtro)
// Simulações de atendimento para treino de SDR/closer. Todos obrigatórios.
//
// REGRA DE OURO (fundamenta as respostas "adequadas"):
//   CONFIRMAR origem = concessionária  →  ANCORAR na dor real (cloro, barro,
//   cor/ferro, desconfiança)  →  qualificar (ponto de instalação, moradores,
//   cidade/CEP, prazo)  →  ligar Característica→Benefício→Impacto  →  conduzir
//   com AGILIDADE (ciclo 3 dias)  →  fechar com PRÓXIMO PASSO + data.
//   NUNCA prometer potabilidade/remoção garantida; NUNCA cravar spec (vazão,
//   estágios) de cabeça; NUNCA tratar poço como filtro de entrada; frete grátis
//   só para SP.
//
// Cada opção: { texto, adequada, pontos(0|1|3), porque, risco, melhora }
// ============================================================================

module.exports = {
  ROLEPLAYS: [

    // ------------------------------------------------------------------ 1
    {
      id: 1,
      titulo: "Cheiro/gosto de cloro",
      obrigatorio: true,
      contexto: "Lead de anúncio (água da rua) reclama que a água tem <strong>cheiro e gosto de cloro</strong>, principalmente no banho. Quer saber se \"tem um filtro que resolve\".",
      passos: [
        {
          fala: "Oi, a água aqui de casa tá com um cheiro de cloro forte, parece piscina. Tem algum filtro que tira isso?",
          opcoes: [
            { texto: "Tem sim. Esse cheiro vem do cloro que a concessionária usa pra tratar. Só pra eu te indicar certo: a água aí é da rua mesmo, da concessionária, e o cheiro te incomoda mais no banho ou também na torneira?", adequada: true, pontos: 3, porque: "Confirma a origem (concessionária) e aprofunda a dor antes de propor.", risco: "", melhora: "" },
            { texto: "Tira 100% do cloro e deixa a água pura, pode fechar tranquilo.", adequada: false, pontos: 0, porque: "Promete remoção absoluta e pureza — o que não se pode garantir.", risco: "Promessa que vira reclamação e quebra de confiança.", melhora: "Fale em reduzir cloro/gosto/odor, nunca em remoção total ou pureza." },
            { texto: "Tenho um modelo de 3 estágios com vazão X que resolve, te mando o preço.", adequada: false, pontos: 1, porque: "Pula qualificação e crava spec de cabeça.", risco: "Errar spec e recomendar sem entender o caso.", melhora: "Qualifique primeiro; specs vêm da ficha técnica." }
          ]
        },
        {
          fala: "É da rua sim, da concessionária. O cheiro pega mais no banho mesmo, é horrível.",
          opcoes: [
            { texto: "Entendi. Como o cloro está na água que chega em toda a casa, um filtro de entrada trata logo na entrada e vale pro banho, torneira, tudo. A etapa de carvão é justamente pra reduzir cloro, gosto e cheiro. Quantas pessoas moram aí e é casa ou apê?", adequada: true, pontos: 3, porque: "Liga a dor à solução da casa toda e segue qualificando (porte).", risco: "", melhora: "" },
            { texto: "Então põe um filtro de torneira na pia que resolve.", adequada: false, pontos: 0, porque: "Filtro de torneira não trata o chuveiro, que é a dor dele.", risco: "Recomendar solução que não resolve o problema citado.", melhora: "Para dor no banho, é filtro de entrada (casa toda), não torneira." },
            { texto: "O carvão remove todo o cloro, sua água vai ficar igual água mineral.", adequada: false, pontos: 1, porque: "Exagera o resultado e compara com potabilidade.", risco: "Cria expectativa irreal.", melhora: "Reduz bastante o cheiro/gosto — sem prometer 'igual mineral'." }
          ]
        },
        {
          fala: "Moramos em 4, é casa. Gostei, e agora?",
          opcoes: [
            { texto: "Perfeito. Pra casa de 4 o Light Filter 1000 costuma atender bem — vou confirmar o modelo certo pelo seu consumo. Me passa cidade e CEP que eu já monto a proposta e te envio hoje; amanhã cedo eu retorno pra acertar a instalação. Pode ser?", adequada: true, pontos: 3, porque: "Recomenda com prova social, coleta cidade/CEP e fecha com próximo passo + data.", risco: "", melhora: "" },
            { texto: "Vou pensar num modelo e qualquer dia desses te retorno.", adequada: false, pontos: 0, porque: "Perde o timing do ciclo de 3 dias e não define próximo passo.", risco: "Lead esfria e some.", melhora: "Conduza com agilidade e combine ação + data." },
            { texto: "Te mando o link do site pra você escolher sozinho o que quiser.", adequada: false, pontos: 1, porque: "Empurra a decisão sem conduzir nem recomendar.", risco: "Cliente se perde e não fecha.", melhora: "Recomende pelo caso dele e conduza ao próximo passo." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 2
    {
      id: 2,
      titulo: "Barro na água",
      obrigatorio: true,
      contexto: "Cliente relata que <strong>às vezes sai barro/sujeira</strong> na água, sobretudo depois que falta água na rua. Água de concessionária.",
      passos: [
        {
          fala: "Toda vez que falta água na rua, quando volta vem uma sujeira, um barro no fundo do copo. Isso tem solução?",
          opcoes: [
            { texto: "Tem. Esse barro costuma soltar da rede e da tubulação quando a água volta. Confirmando: é água da concessionária, certo? E esse sedimento você percebe em toda a casa ou num ponto só?", adequada: true, pontos: 3, porque: "Explica a causa, confirma origem e investiga extensão da dor.", risco: "", melhora: "" },
            { texto: "Isso é porque sua água é contaminada, precisa de tratamento urgente.", adequada: false, pontos: 0, porque: "Alarmismo e afirmação de contaminação sem base.", risco: "Assusta o cliente com afirmação irresponsável.", melhora: "Explique a causa real (sedimento da rede) sem alarmar." },
            { texto: "Deve ser poço, né? Aí é outra linha.", adequada: false, pontos: 1, porque: "Assume origem errada sem confirmar.", risco: "Encaminhar linha errada.", melhora: "Confirme a origem antes de classificar." }
          ]
        },
        {
          fala: "É da concessionária. E sim, sinto na casa toda, até no chuveiro às vezes.",
          opcoes: [
            { texto: "Então o filtro de entrada é o caminho: instalado na entrada, ele tem uma etapa que retém barro, areia e ferrugem antes de circular pela casa. Na prática, acaba o barro no copo e ainda ajuda a proteger encanamento e eletrodomésticos. Quantos moram e é casa ou apê?", adequada: true, pontos: 3, porque: "Liga sedimento à etapa correta, agrega impacto (proteção) e qualifica.", risco: "", melhora: "" },
            { texto: "Um purificador na cozinha já resolve esse barro.", adequada: false, pontos: 0, porque: "Ponto único não resolve barro na casa toda/chuveiro.", risco: "Solução que não cobre a dor.", melhora: "Dor na casa toda pede filtro de entrada." },
            { texto: "Nosso filtro tira 100% de qualquer partícula, garantido.", adequada: false, pontos: 1, porque: "Garantia absoluta indevida.", risco: "Promessa que não se sustenta.", melhora: "Fale em reter sedimento, sem '100% garantido'." }
          ]
        },
        {
          fala: "Somos 3 numa casa. Quero resolver logo, odeio esse barro.",
          opcoes: [
            { texto: "Ótimo, dá pra resolver rápido. Vou confirmar o modelo certo pro seu consumo (o Light Filter costuma atender bem casas assim) e preciso da cidade e do CEP. Fecho a proposta hoje e te retorno amanhã cedo pra agendar. Combinado?", adequada: true, pontos: 3, porque: "Aproveita a urgência, coleta cidade/CEP e define próximo passo + data.", risco: "", melhora: "" },
            { texto: "Vou te passar todos os modelos que temos pra você comparar com calma em casa.", adequada: false, pontos: 1, porque: "Excesso de opção sem recomendação trava a decisão.", risco: "Cliente engavetа.", melhora: "Recomende pelo caso e conduza." },
            { texto: "Posso prometer instalação amanhã em qualquer cidade e frete grátis.", adequada: false, pontos: 0, porque: "Promete prazo e frete sem checar política (frete grátis só SP).", risco: "Promessa que não pode cumprir.", melhora: "Confirme prazo/frete na política oficial antes de prometer." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 3
    {
      id: 3,
      titulo: "\"A SABESP já trata\"",
      obrigatorio: true,
      contexto: "Cliente questiona a necessidade: <strong>\"a água já vem tratada da concessionária, pra que filtrar?\"</strong>.",
      passos: [
        {
          fala: "Sinceramente, a água já vem tratada da SABESP. Não sei se preciso de filtro.",
          opcoes: [
            { texto: "Você tem razão, ela vem tratada mesmo. Deixa eu te perguntar: no dia a dia, tem algo que te incomoda nessa água? Cheiro de cloro, um barro quando falta água, gosto?", adequada: true, pontos: 3, porque: "Concorda (não discute) e investiga a experiência real.", risco: "", melhora: "" },
            { texto: "Que nada, a água da SABESP é péssima, cheia de química.", adequada: false, pontos: 0, porque: "Desmente e ataca a concessionária sem base.", risco: "Perde credibilidade e assusta.", melhora: "Valide a fala e traga a dor cotidiana." },
            { texto: "Todo mundo precisa de filtro, é essencial, pode acreditar.", adequada: false, pontos: 1, porque: "Generaliza sem ancorar na dor do cliente.", risco: "Soa como pressão vazia.", melhora: "Descubra a dor específica antes de afirmar necessidade." }
          ]
        },
        {
          fala: "Agora que você falou... o cheiro de cloro no banho incomoda sim. E vez ou outra vem uma aguinha amarelada.",
          opcoes: [
            { texto: "Pois é, mesmo tratada a água faz um caminho longo pela rede e chega com o cloro que você sente no banho e, às vezes, com sedimento/ferrugem da tubulação que dá esse amarelado. O filtro de entrada trata isso na entrada, pra casa toda. É o incômodo que você quer resolver, certo?", adequada: true, pontos: 3, porque: "Explica a causa sem alarmar, liga à solução e confirma a dor.", risco: "", melhora: "" },
            { texto: "Amarelada?! Isso é perigoso, sua família pode adoecer, feche hoje.", adequada: false, pontos: 0, porque: "Usa medo e sugere risco à saúde sem base.", risco: "Manipulação e promessa implícita de proteção sanitária.", melhora: "Explique a causa (sedimento/ferrugem da rede) sem alarmismo." },
            { texto: "Então é ferro, você tem poço com certeza.", adequada: false, pontos: 1, porque: "Conclui origem errada; ele já disse que é concessionária.", risco: "Classificação equivocada.", melhora: "Amarelado na rede costuma ser sedimento/ferrugem da tubulação, não poço." }
          ]
        },
        {
          fala: "Faz sentido. Como funciona pra contratar?",
          opcoes: [
            { texto: "Simples: eu confirmo o modelo ideal pro tamanho da sua casa, monto a proposta e te envio hoje. Me passa cidade, CEP e quantas pessoas moram. Amanhã retorno pra tirar dúvidas e acertar a instalação. Pode ser?", adequada: true, pontos: 3, porque: "Conduz com agilidade, coleta dados e define próximo passo + data.", risco: "", melhora: "" },
            { texto: "Deixa eu ver aqui e uma hora dessas te chamo.", adequada: false, pontos: 0, porque: "Sem próximo passo nem data.", risco: "Lead esfria.", melhora: "Sempre combine ação e data." },
            { texto: "Escolhe no site e me avisa o que decidiu.", adequada: false, pontos: 1, porque: "Larga a condução no cliente.", risco: "Não fecha.", melhora: "Recomende e conduza você." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 4
    {
      id: 4,
      titulo: "Quer o mais barato",
      obrigatorio: true,
      contexto: "Cliente pede logo <strong>\"o mais barato que tiver\"</strong>, sem falar da dor.",
      passos: [
        {
          fala: "Me vê aí o filtro mais barato que vocês têm.",
          opcoes: [
            { texto: "Posso te mostrar a opção mais em conta, claro. Só quero garantir que ela dá conta do seu caso: me conta rapidinho o que mais te incomoda na água e quantas pessoas moram aí?", adequada: true, pontos: 3, porque: "Não briga com o preço e traz o critério certo (dor + porte).", risco: "", melhora: "" },
            { texto: "O mais barato é fraquinho, leva logo o mais caro que é bom.", adequada: false, pontos: 0, porque: "Empurra o topo sem entender a necessidade.", risco: "Afasta o cliente e soa forçado.", melhora: "Recomende pela necessidade, não pela margem." },
            { texto: "É a Filtralli V2, custa X, fecho pra você agora.", adequada: false, pontos: 1, porque: "Preço sem qualificar nem confirmar adequação.", risco: "Vender aquém da necessidade.", melhora: "Qualifique antes de cravar modelo/preço." }
          ]
        },
        {
          fala: "É que tá apertado. O que incomoda é o gosto mesmo, e moramos em 5.",
          opcoes: [
            { texto: "Entendi, obrigado por dividir. Pra gosto/odor a etapa de carvão é o que conta, e pra 5 pessoas o modelo precisa dar conta do consumo. A Filtralli é a porta de entrada mais acessível; se fizer sentido, mostro também o Light Filter, que costuma equilibrar bem. Vou confirmar o indicado pro seu consumo — qual sua cidade e CEP?", adequada: true, pontos: 3, porque: "Respeita o orçamento, alerta sobre porte e coleta dado, sem empurrar o topo.", risco: "", melhora: "" },
            { texto: "Pra 5 pessoas só o modelo mais caro serve, não tem jeito.", adequada: false, pontos: 1, porque: "Fecha alternativa e ignora o orçamento declarado.", risco: "Perde o cliente sensível a preço.", melhora: "Ofereça o adequado confirmando na ficha, sem forçar o topo." },
            { texto: "Pega o mais barato mesmo, qualquer um resolve gosto.", adequada: false, pontos: 0, porque: "Ignora o porte (5 pessoas) e pode subdimensionar.", risco: "Modelo aquém do consumo, cliente insatisfeito.", melhora: "Confirme se o modelo atende o porte antes de recomendar." }
          ]
        },
        {
          fala: "Beleza, cidade é Taubaté. Me diz qual vale mais a pena.",
          opcoes: [
            { texto: "Pra Taubaté, com 5 pessoas e dor de gosto, vou confirmar entre a Filtralli e o Light Filter qual atende melhor seu consumo na ficha e te mando a proposta hoje com o custo-benefício. Retorno amanhã pra fechar. Te passo por aqui mesmo?", adequada: true, pontos: 3, porque: "Recomenda pelo caso, confirma na ficha e fecha com próximo passo + data.", risco: "", melhora: "" },
            { texto: "Qualquer um serve, escolhe você.", adequada: false, pontos: 0, porque: "Não recomenda nem conduz.", risco: "Cliente indeciso não fecha.", melhora: "Dê uma recomendação clara pelo caso dele." },
            { texto: "Prometo o menor preço da região e frete grátis pra Taubaté.", adequada: false, pontos: 1, porque: "Promete frete/preço sem checar política.", risco: "Compromisso que pode não cumprir.", melhora: "Confirme condições e frete (grátis só SP) na política oficial." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 5
    {
      id: 5,
      titulo: "Comparando com concorrente",
      obrigatorio: true,
      contexto: "Cliente diz que <strong>viu um filtro parecido mais barato em outra marca</strong> e quer saber por que fechar com a TDF.",
      passos: [
        {
          fala: "Achei um filtro de entrada de outra marca bem mais barato. Por que eu fecharia com vocês?",
          opcoes: [
            { texto: "Ótima pergunta. Pra comparar de verdade, o que importa é se atende o seu caso. Me conta a dor principal e o tamanho da casa que eu te mostro o modelo certo e a diferença de valor — não só de preço.", adequada: true, pontos: 3, porque: "Recentra na necessidade e diferencia valor de preço.", risco: "", melhora: "" },
            { texto: "Essas marcas baratas são todas ruins, não confie.", adequada: false, pontos: 0, porque: "Ataca o concorrente sem argumento.", risco: "Soa inseguro e desonesto.", melhora: "Foque no valor da TDF e no caso do cliente, não em atacar." },
            { texto: "O nosso é mais caro porque é melhor, só isso.", adequada: false, pontos: 1, porque: "Afirmação vaga sem sustentar valor.", risco: "Não convence.", melhora: "Traduza valor em benefício/impacto para o caso dele." }
          ]
        },
        {
          fala: "A dor é o cloro e um pouco de barro. Casa de 4. O outro filtro parecia igual.",
          opcoes: [
            { texto: "Pelo que você descreve, precisa reter sedimento (o barro) e reduzir cloro/gosto na casa toda. Vou confirmar na ficha o modelo que atende seu consumo e te mostro o que está incluso — produto, instalação e suporte. Aí você compara valor real, não só a etiqueta. Faz sentido?", adequada: true, pontos: 3, porque: "Traz critério objetivo de comparação e o que compõe o valor.", risco: "", melhora: "" },
            { texto: "O nosso tem 5 estágios e vazão muito maior que o deles, garantido.", adequada: false, pontos: 1, porque: "Crava spec de cabeça para vencer comparação.", risco: "Afirmar número não confirmado.", melhora: "Specs vêm da ficha; compare valor e adequação." },
            { texto: "Deixa o outro pra lá, o nosso é o melhor do Brasil.", adequada: false, pontos: 0, porque: "Superlativo vazio.", risco: "Perde credibilidade.", melhora: "Sustente com adequação ao caso e o que está incluso." }
          ]
        },
        {
          fala: "Entendi. E se eu ainda achar o outro mais em conta?",
          opcoes: [
            { texto: "Aí a decisão é sua e eu respeito. Minha parte é garantir que você compare o que realmente atende sua casa e o que vem junto. Vou te enviar a proposta hoje com tudo detalhado e retorno amanhã pra qualquer dúvida. Se fizer sentido, seguimos. Pode ser?", adequada: true, pontos: 3, porque: "Respeita a autonomia, entrega comparação justa e define próximo passo + data.", risco: "", melhora: "" },
            { texto: "Se fechar agora te dou um desconto que o outro não cobre.", adequada: false, pontos: 1, porque: "Apela a desconto sem autorização/critério.", risco: "Guerra de preço e margem.", melhora: "Defenda valor; condições seguem a política oficial." },
            { texto: "Então vai no outro mesmo, boa sorte.", adequada: false, pontos: 0, porque: "Desiste e abandona a condução.", risco: "Perde a venda por passividade.", melhora: "Mantenha a porta aberta com proposta e próximo passo." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 6
    {
      id: 6,
      titulo: "Indicação de cliente",
      obrigatorio: true,
      contexto: "Lead chega por <strong>indicação</strong> de um cliente satisfeito (indicação vale 15% das vendas). Já vem com boa vontade.",
      passos: [
        {
          fala: "Oi, meu vizinho comprou o filtro de vocês e falou muito bem. Quero um igual.",
          opcoes: [
            { texto: "Que bom, fico feliz que ele esteja satisfeito! Pra te indicar o certo: sua casa é parecida com a dele em tamanho? E o que mais te incomoda na sua água — o mesmo que ele tinha ou algo diferente?", adequada: true, pontos: 3, porque: "Agradece a indicação e qualifica em vez de copiar o pedido cegamente.", risco: "", melhora: "" },
            { texto: "Perfeito, mando o mesmo modelo do seu vizinho e pronto.", adequada: false, pontos: 1, porque: "Copia sem confirmar se atende a casa/dor dele.", risco: "Modelo do vizinho pode não servir ao caso.", melhora: "Qualifique: a casa e a dor podem ser diferentes." },
            { texto: "Se o vizinho gostou, é porque é o melhor, fecha logo.", adequada: false, pontos: 0, porque: "Usa a indicação como pressão e pula qualificação.", risco: "Recomendação inadequada e má experiência.", melhora: "Aproveite a confiança para qualificar bem, não para apressar sem critério." }
          ]
        },
        {
          fala: "Minha casa é maior, moramos em 6. E aqui o problema é mais o cloro e o gosto.",
          opcoes: [
            { texto: "Então vale ajustar: pra 6 pessoas o modelo precisa dar conta do consumo, e pra cloro/gosto a etapa de carvão é a chave. Vou confirmar na ficha o indicado pro seu porte — pode ser um passo acima do seu vizinho. Me passa cidade e CEP?", adequada: true, pontos: 3, porque: "Adapta ao porte maior e à dor, sem só repetir o do vizinho.", risco: "", melhora: "" },
            { texto: "Mesmo sendo 6, o modelo do vizinho serve igual.", adequada: false, pontos: 0, porque: "Ignora o porte maior.", risco: "Subdimensionar para 6 pessoas.", melhora: "Confirme o modelo pelo consumo na ficha." },
            { texto: "Pra 6 pessoas só o Inox mais caro serve.", adequada: false, pontos: 1, porque: "Empurra o topo sem confirmar.", risco: "Forçar upgrade desnecessário.", melhora: "Recomende pelo que a ficha indicar para o porte." }
          ]
        },
        {
          fala: "Show. Cidade é São José dos Campos. Como fazemos?",
          opcoes: [
            { texto: "Fechado. Confirmo o modelo ideal pra 6 pessoas, monto a proposta e te envio hoje. Como você veio por indicação, faço questão de deixar tudo redondo. Retorno amanhã pra acertar instalação. Pode ser por aqui?", adequada: true, pontos: 3, porque: "Valoriza a indicação e fecha com próximo passo + data.", risco: "", melhora: "" },
            { texto: "Depois eu vejo e te falo.", adequada: false, pontos: 0, porque: "Sem próximo passo, desperdiça um lead quente.", risco: "Esfria uma indicação valiosa.", melhora: "Indicação quente merece condução ágil e data." },
            { texto: "Como é indicação, prometo o menor preço e frete grátis.", adequada: false, pontos: 1, porque: "Promete condição/frete sem checar política.", risco: "Compromisso indevido.", melhora: "Cuide bem, mas siga a política oficial (frete grátis só SP)." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 7
    {
      id: 7,
      titulo: "Apartamento",
      obrigatorio: true,
      contexto: "Cliente mora em <strong>apartamento</strong> e não sabe se dá pra instalar filtro de entrada. Água de concessionária.",
      passos: [
        {
          fala: "Moro em apartamento, será que dá pra instalar esse filtro da casa toda? Nem sei onde a água entra.",
          opcoes: [
            { texto: "Dá pra avaliar sim. Em apê a instalação depende de onde fica o ponto de entrada de água da unidade. Me diz: o que mais te incomoda na água hoje, e você sabe se tem um registro/entrada de água na área de serviço?", adequada: true, pontos: 3, porque: "Não descarta, investiga viabilidade (ponto de entrada) e a dor.", risco: "", melhora: "" },
            { texto: "Em apartamento não dá, filtro de entrada é só pra casa.", adequada: false, pontos: 0, porque: "Descarta sem investigar a viabilidade.", risco: "Perde venda por suposição.", melhora: "Avalie o ponto de entrada da unidade antes de descartar." },
            { texto: "Claro que dá, instalo em qualquer apartamento sem problema.", adequada: false, pontos: 1, porque: "Garante viabilidade sem checar o ponto de instalação.", risco: "Prometer o que pode não ser viável.", melhora: "Confirme o ponto de entrada antes de afirmar." }
          ]
        },
        {
          fala: "Incomoda o cloro. Tem sim um registro na área de serviço onde a água entra.",
          opcoes: [
            { texto: "Ótimo, esse registro na entrada da unidade é justamente onde o filtro de entrada trabalha — daí ele trata a água que chega em todo o apê. Pra cloro, a etapa de carvão é a que resolve. Quantas pessoas moram? Assim confirmo o modelo certo pro seu consumo.", adequada: true, pontos: 3, porque: "Liga o ponto de entrada à solução e segue qualificando.", risco: "", melhora: "" },
            { texto: "Em apê o cloro é mais fraco, nem precisa de filtro.", adequada: false, pontos: 0, porque: "Minimiza a dor que o cliente declarou.", risco: "Desqualifica a necessidade real.", melhora: "Respeite a dor: se incomoda, é válida." },
            { texto: "Vou mandar o maior modelo pra garantir.", adequada: false, pontos: 1, porque: "Superdimensiona sem base no consumo.", risco: "Custo e porte inadequados.", melhora: "Confirme o modelo pelo consumo na ficha." }
          ]
        },
        {
          fala: "Somos 2. Legal, e a instalação, é complicada?",
          opcoes: [
            { texto: "Pra 2 pessoas o modelo é mais enxuto — confirmo o certo na ficha. A instalação é feita no ponto de entrada da unidade; vou te enviar a proposta hoje com a condição de instalação e retorno amanhã pra alinhar. Me passa cidade e CEP?", adequada: true, pontos: 3, porque: "Recomenda pelo porte, encaminha instalação e fecha com próximo passo + data.", risco: "", melhora: "" },
            { texto: "A instalação é super simples, faço amanhã sem ver nada.", adequada: false, pontos: 1, porque: "Promete prazo/simplicidade sem avaliar.", risco: "Compromisso sem base técnica.", melhora: "Confirme condições de instalação antes de prometer prazo." },
            { texto: "Depois te explico a instalação, primeiro me paga.", adequada: false, pontos: 0, porque: "Inverte a ordem e não dá segurança ao cliente.", risco: "Quebra de confiança.", melhora: "Explique o próximo passo com clareza antes de fechar." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 8
    {
      id: 8,
      titulo: "Casa grande / muitos moradores",
      obrigatorio: true,
      contexto: "Cliente tem <strong>casa grande com muitos moradores</strong> e alto consumo de água. Concessionária. Quer garantir que o filtro dá conta.",
      passos: [
        {
          fala: "Tenho uma casa grande, moramos em 8 e o consumo é alto. Será que o filtro dá conta?",
          opcoes: [
            { texto: "Boa preocupação. Pra casa grande o ponto-chave é o modelo dar conta do consumo sem perder desempenho. Me conta a dor principal na água e a estrutura da casa (nº de banheiros, tem caixa d'água?) que eu confirmo o modelo certo pra esse porte.", adequada: true, pontos: 3, porque: "Reconhece o porte como fator, qualifica dor e estrutura para dimensionar.", risco: "", melhora: "" },
            { texto: "Dá conta de qualquer casa, é só instalar, não se preocupe.", adequada: false, pontos: 0, porque: "Garante sem avaliar o porte/consumo.", risco: "Subdimensionar uma casa de alto consumo.", melhora: "Porte alto exige confirmar o modelo pela ficha." },
            { texto: "Pra 8 pessoas nenhum filtro de entrada aguenta, esquece.", adequada: false, pontos: 1, porque: "Descarta sem checar a linha/modelos disponíveis.", risco: "Perde venda de ticket maior por suposição.", melhora: "Verifique na ficha o modelo adequado ao porte." }
          ]
        },
        {
          fala: "A dor é barro e cloro. São 4 banheiros e tem caixa d'água grande.",
          opcoes: [
            { texto: "Perfeito. Com esse porte, barro e cloro, precisamos de um modelo que retenha sedimento e reduza cloro mantendo bom desempenho no consumo alto — vou confirmar na ficha o indicado pra sua estrutura. Em casa grande, muitas vezes o American Filter (premium) ou um Light Filter de porte maior faz sentido. Qual sua cidade e CEP?", adequada: true, pontos: 3, porque: "Amarra dor + porte ao dimensionamento correto e coleta dado, sem cravar spec.", risco: "", melhora: "" },
            { texto: "Vou te dar o modelo de vazão exata Y estágios Z, é esse e pronto.", adequada: false, pontos: 1, porque: "Crava spec de memória para casa de alto consumo.", risco: "Errar o dimensionamento.", melhora: "Confirme vazão/estágios na ficha técnica oficial." },
            { texto: "Casa grande assim precisa é de estação de tratamento, filtro não serve.", adequada: false, pontos: 0, porque: "Empurra outra solução sem base e desqualifica a linha.", risco: "Confundir o cliente e perder a venda.", melhora: "Água de concessionária com barro/cloro é caso de filtro de entrada; dimensione pelo porte." }
          ]
        },
        {
          fala: "Entendi, é um investimento maior então. Cidade é Campinas. Como seguimos?",
          opcoes: [
            { texto: "Isso, o investimento acompanha o porte, mas resolve a água de toda a casa. Vou confirmar o modelo ideal pra sua estrutura, montar a proposta e te enviar hoje; amanhã retorno pra detalhar instalação e condições. Fechamos por aqui?", adequada: true, pontos: 3, porque: "Justifica o valor pelo porte e fecha com próximo passo + data.", risco: "", melhora: "" },
            { texto: "Pra fechar hoje eu te dou 20% e frete grátis pra Campinas.", adequada: false, pontos: 1, porque: "Desconto/frete sem autorização nem checar política.", risco: "Margem e frete indevidos (grátis só SP).", melhora: "Defenda o valor; condições seguem a política oficial." },
            { texto: "Depois te mando alguma coisa, tô sem tempo agora.", adequada: false, pontos: 0, porque: "Abandona um lead de ticket alto sem próximo passo.", risco: "Perde oportunidade grande.", melhora: "Priorize e combine ação + data." }
          ]
        }
      ]
    }

  ]
};
