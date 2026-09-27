// ============================================================================
// ROLEPLAYS — Academia de Água de Poço (Tudo de Filtro)
// Simulações de atendimento para treino do closer. Todos obrigatórios.
// Estrutura consumida pela aba de Roleplays do treinamento de poço.
//
// REGRA DE OURO (fundamenta as respostas "adequadas"):
//   PEDIR/INTERPRETAR a análise  →  SONDAGEM HIDRÁULICA (incl. vazão de
//   RETROLAVAGEM)  →  CONFIRMAR parâmetro E unidade  →  NÃO prometer
//   potabilidade/remoção  →  ENCAMINHAR ao especialista quando houver risco
//   →  prever NOVA ANÁLISE pós-tratamento.
//   Nunca inventar valor/dosagem/vazão/solução; nunca dizer que uma
//   tecnologia resolve tudo; nunca apresentar tanque como solução universal.
//
// Cada opção: { texto, adequada, pontos(0|1|3), porque, risco, melhora }
// ============================================================================

module.exports = {
  ROLEPLAYS: [

    // ------------------------------------------------------------------ 1
    {
      id: 1,
      titulo: "Ferro alto",
      obrigatorio: true,
      contexto: "Cliente de sítio liga: a água do poço sai limpa, mas mancha a roupa e a louça de amarelo/laranja e deixa depósito no reservatório. Ele quer <strong>\"aquele filtro que tira ferro\"</strong> e um preço na hora.",
      passos: [
        {
          fala: "Óh, minha água tá saindo com ferro, tá manchando tudo. Já sei que é ferro. Me manda o preço do filtro de ferro que eu fecho hoje.",
          opcoes: [
            { texto: "Entendo a pressa. Mancha amarelada realmente sugere ferro, mas antes de propor eu preciso ver a análise da água: quero confirmar o ferro em mg/L e se vem manganês junto. Você tem um laudo recente?", adequada: true, pontos: 3, porque: "Acolhe a urgência, levanta a hipótese sem cravar, e ancora a decisão na análise com parâmetro e unidade.", risco: "", melhora: "" },
            { texto: "Fechado! Filtro de ferro resolve. Te passo o valor do nosso tanque que já sai resolvido pra qualquer poço.", adequada: false, pontos: 0, porque: "Promete solução e apresenta o tanque como universal sem análise nem dimensionamento.", risco: "Errar a tecnologia, subdimensionar e o problema voltar — cliente insatisfeito e retrabalho.", melhora: "Nunca cravar solução por sintoma. Peça o laudo e confirme ferro (mg/L) e manganês antes de qualquer valor." },
            { texto: "Se está manchando é ferro mesmo, não precisa de análise. Qual o tamanho da sua caixa que eu já dimensiono?", adequada: false, pontos: 1, porque: "Puxa um dado hidráulico, mas dispensa a análise e assume o diagnóstico só pelo sintoma.", risco: "Mancha laranja pode ter manganês, ou o ferro estar em forma que muda a tecnologia. Sem laudo você chuta.", melhora: "Volume de caixa é sondagem hidráulica útil, mas não substitui a análise. Peça os dois." }
          ]
        },
        {
          fala: "Análise eu não tenho não. Mas é só ferro, tenho certeza. Não dá pra você já mandar o filtro certo?",
          opcoes: [
            { texto: "Sem análise eu não consigo garantir qual tecnologia é a certa nem o quanto ela vai remover — seria irresponsável te vender no escuro. O caminho é fazer uma análise que meça ferro, manganês, pH e alguns parâmetros. Com o laudo eu monto a proposta certa.", adequada: true, pontos: 3, porque: "Recusa a venda cega com responsabilidade e explica o porquê técnico (tecnologia e capacidade dependem do laudo).", risco: "", melhora: "" },
            { texto: "Como você tem certeza, vou confiar em você. Mando o filtro de ferro padrão e se não resolver a gente troca depois.", adequada: false, pontos: 0, porque: "Transfere a decisão técnica ao cliente e aposta no 'troca depois'.", risco: "Instalação errada, custo de troca, perda de confiança e possível dano ao equipamento.", melhora: "A responsabilidade técnica é sua. Não venda contra a própria regra só porque o cliente insiste." },
            { texto: "Posso mandar um filtro de sedimentos por enquanto, que já deixa a água mais limpa, e depois vemos a análise.", adequada: false, pontos: 1, porque: "Oferece um paliativo que não trata ferro dissolvido e ainda dá a impressão de solução.", risco: "Ferro dissolvido passa direto por filtro de sedimentos; cliente acha que resolveu e a mancha volta.", melhora: "Não empurre etapa que não trata o parâmetro. Primeiro laudo, depois a tecnologia compatível." }
          ]
        },
        {
          fala: "Tá bom, faço a análise. Mas o filtro de ferro precisa de quê pra funcionar? É só ligar na caixa?",
          opcoes: [
            { texto: "Boa pergunta. Filtros de ferro por leito costumam precisar de retrolavagem, e pra isso a instalação precisa de vazão e pressão suficientes. Então, junto com o laudo, eu vou levantar a sua vazão disponível e como é a hidráulica — se é por gravidade ou bomba. Sem isso o equipamento não lava direito.", adequada: true, pontos: 3, porque: "Introduz a sondagem hidráulica e a vazão de retrolavagem como condição real de funcionamento.", risco: "", melhora: "" },
            { texto: "É só ligar na caixa mesmo, funciona em qualquer instalação, não tem segredo.", adequada: false, pontos: 0, porque: "Ignora vazão/pressão de retrolavagem, que é condição técnica essencial.", risco: "Instalar por gravidade sem vazão para retrolavar mata o leito e trava o equipamento.", melhora: "Sempre confirme vazão e forma de recalque antes de prometer que 'liga em qualquer lugar'." },
            { texto: "Precisa de energia elétrica e só. O resto o equipamento resolve sozinho.", adequada: false, pontos: 1, porque: "Cita um requisito, mas erra o principal (vazão/pressão para retrolavagem).", risco: "Foco no elétrico esconde o gargalo hidráulico, que é o que costuma inviabilizar a instalação.", melhora: "O ponto crítico é a vazão de retrolavagem. Levante a hidráulica, não só a tomada." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 2
    {
      id: 2,
      titulo: "Ferro e manganês",
      obrigatorio: true,
      contexto: "Cliente já trocou um filtro de ferro antes e não resolveu: além da mancha amarela, aparecem manchas <strong>escuras/pretas</strong> na roupa e nos azulejos. Traz um laudo que mostra ferro e também manganês.",
      passos: [
        {
          fala: "Já comprei um filtro de ferro e continuou manchando, agora até de preto. Esse filtro de vocês é melhor?",
          opcoes: [
            { texto: "Mancha preta junto com a amarela é um sinal clássico de manganês além do ferro — e manganês costuma exigir condição de tratamento diferente do ferro sozinho. Você tem o laudo? Quero ver ferro e manganês, cada um com seu valor e unidade, pra entender por que o filtro anterior não deu conta.", adequada: true, pontos: 3, porque: "Lê o sintoma corretamente (manganês), não promete e vai direto confirmar parâmetro e unidade no laudo.", risco: "", melhora: "" },
            { texto: "Nosso filtro é mais potente, resolve ferro e manganês numerados juntos, pode fechar tranquilo.", adequada: false, pontos: 0, porque: "Promete remover dois parâmetros sem ver laudo nem confirmar condição (pH, oxidação).", risco: "Manganês costuma pedir pH/oxidação específicos; prometer 'resolve tudo' repete o erro que trouxe o cliente até você.", melhora: "Não venda 'mais potente'. Confirme os valores e a condição de remoção de cada parâmetro." },
            { texto: "O filtro anterior devia estar subdimensionado. Compra o maior nosso que agora vai.", adequada: false, pontos: 1, porque: "Atribui tudo ao tamanho e ignora que manganês pode exigir tecnologia/condição diferente.", risco: "Aumentar o tanque não resolve manganês se a condição de oxidação não estiver correta.", melhora: "Antes de falar em tamanho, confirme no laudo os dois metais e a condição necessária pra remover cada um." }
          ]
        },
        {
          fala: "Aqui ó, no laudo tá escrito ferro e manganês. Os dois tão altos. E agora?",
          opcoes: [
            { texto: "Perfeito ter o laudo. Deixa eu confirmar os valores e as unidades de cada um, porque ferro e manganês juntos normalmente pedem uma etapa de oxidação bem conduzida e a mídia compatível. Como envolve dois parâmetros e a condição é sensível, quero alinhar o dimensionamento com nosso especialista antes de te dar a solução.", adequada: true, pontos: 3, porque: "Confirma valor+unidade, reconhece a complexidade e encaminha ao especialista em vez de improvisar.", risco: "", melhora: "" },
            { texto: "Beleza, com esses números eu já fecho a dosagem de oxidante e o tamanho do tanque pra você agora.", adequada: false, pontos: 0, porque: "Inventa dosagem e dimensionamento na hora, sem validação técnica.", risco: "Dosagem/dimensionamento errados em manganês pioram o resultado e podem gerar passagem de contaminante.", melhora: "Nunca improvise dosagem. Encaminhe pro especialista dimensionar com base no laudo." },
            { texto: "Com ferro e manganês o melhor é osmose reversa, que tira tudo. Vou por esse caminho.", adequada: false, pontos: 1, porque: "Pula pra uma tecnologia 'tira tudo' sem diagnóstico hidráulico nem avaliação de custo/aplicação.", risco: "Sugerir 'tira tudo' por reflexo repete o vício de tecnologia universal e ignora vazão/uso.", melhora: "Cada parâmetro pede etapa compatível. Deixe o especialista definir a rota a partir do laudo e da hidráulica." }
          ]
        },
        {
          fala: "E depois que instalar, como eu sei que resolveu de verdade dessa vez?",
          opcoes: [
            { texto: "A gente prevê uma nova análise depois do sistema em operação, pra comprovar que ferro e manganês baixaram pro padrão. Sem essa reanálise, ninguém pode te garantir que resolveu — foi justamente o que faltou no equipamento anterior.", adequada: true, pontos: 3, porque: "Prevê a nova análise pós-tratamento como prova objetiva, sem prometer no discurso.", risco: "", melhora: "" },
            { texto: "Você vai ver na hora: a água sai cristalina e sem mancha, isso já é a garantia.", adequada: false, pontos: 0, porque: "Usa aparência como prova de remoção — exatamente o erro 'transparente = potável'.", risco: "Manganês pode estar dissolvido e invisível; 'cristalina' não comprova remoção.", melhora: "Prova de remoção é laudo pós-tratamento, não aspecto visual." },
            { texto: "Te dou minha palavra que resolve. Se manchar de novo é só chamar na garantia.", adequada: false, pontos: 1, porque: "Aposta na palavra e no acionamento de garantia em vez de medir.", risco: "Sem reanálise você não tem baseline objetivo e vira discussão de 'achismo' com o cliente.", melhora: "Substitua promessa por reanálise agendada; é o que dá segurança pros dois lados." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 3
    {
      id: 3,
      titulo: "Água amarelada de causa desconhecida",
      obrigatorio: true,
      contexto: "Cliente relata água <strong>amarelada</strong>, mas não sabe a causa: pode ser ferro, pode ser matéria orgânica (cor), pode ser turbidez. Não tem laudo e quer resolver 'a cor' rapidamente.",
      passos: [
        {
          fala: "Minha água tá amarelada. Deve ser ferro né? Me vê um filtro que tira essa cor.",
          opcoes: [
            { texto: "Amarelado pode ser várias coisas: ferro, matéria orgânica dando cor, ou turbidez em suspensão — e cada uma pede tratamento diferente. Por isso eu não arrisco pelo aspecto. O caminho certo é uma análise que separe cor, turbidez e ferro. Consegue coletar pra análise?", adequada: true, pontos: 3, porque: "Não crava a causa, lista hipóteses concorrentes e conduz à análise que diferencia os parâmetros.", risco: "", melhora: "" },
            { texto: "Amarelo é ferro sim. Filtro de ferro resolve a cor, pode confiar.", adequada: false, pontos: 0, porque: "Crava causa por cor e promete resolver sem análise.", risco: "Se a cor for orgânica, filtro de ferro não remove e o cliente paga por algo que não resolve.", melhora: "Amarelado tem várias origens. Nunca cravar; peça análise que distinga cor, turbidez e ferro." },
            { texto: "Manda uma foto da água que eu já te digo o que é e qual filtro comprar.", adequada: false, pontos: 1, porque: "Tenta diagnosticar por foto, o que a regra proíbe explicitamente.", risco: "Foto não mede ferro, cor verdadeira nem turbidez; diagnóstico por imagem induz proposta errada.", melhora: "Foto não é análise. Direcione para coleta e laudo antes de indicar qualquer equipamento." }
          ]
        },
        {
          fala: "E se eu não quiser gastar com análise? Não dá pra chutar o mais provável e ir testando?",
          opcoes: [
            { texto: "Eu entendo querer economizar, mas 'ir testando' costuma sair mais caro: você pode comprar a etapa errada e ainda não resolver. A análise é justamente o que evita gasto à toa — ela diz exatamente o que tratar. É o investimento que protege todos os outros.", adequada: true, pontos: 3, porque: "Reposiciona a análise como economia, mantém a recusa de chutar e educa sobre custo do erro.", risco: "", melhora: "" },
            { texto: "Pode sim, vamos começar pelo filtro de ferro que é o mais comum e ver no que dá.", adequada: false, pontos: 0, porque: "Aceita o método do chute contra a regra central.", risco: "Alta chance de tratar o parâmetro errado; cliente perde dinheiro e confiança.", melhora: "Nunca aceite 'ir testando' em poço. A análise é o que impede o desperdício." },
            { texto: "Sem análise eu não falo mais nada, procure um laboratório e volte depois.", adequada: false, pontos: 1, porque: "Mantém a regra, mas encerra de forma seca e perde o cliente pelo tom.", risco: "Cliente pode desistir por falta de acolhimento, mesmo com a recomendação tecnicamente correta.", melhora: "Segure a regra sem espantar: explique o porquê e ofereça ajudar a encaminhar a coleta." }
          ]
        },
        {
          fala: "Certo, vou fazer a análise. O que exatamente eu peço pro laboratório medir?",
          opcoes: [
            { texto: "Pra esse caso, peça pelo menos cor, turbidez, ferro e manganês, além dos parâmetros básicos como pH. Quando o laudo chegar, me manda que eu confirmo cada valor com a unidade e a gente decide a rota. Assim a proposta sai em cima de número, não de palpite.", adequada: true, pontos: 3, porque: "Orienta os parâmetros úteis para diferenciar as hipóteses e reforça confirmar valor+unidade.", risco: "", melhora: "" },
            { texto: "Pede só ferro, que é o que interessa aqui.", adequada: false, pontos: 1, porque: "Restringe demais o escopo e assume que é ferro antes do laudo.", risco: "Se a causa for cor orgânica ou turbidez, o laudo restrito não vai apontar e você repete o ciclo.", melhora: "Peça um painel que cubra as hipóteses (cor, turbidez, ferro, manganês), não só o palpite." },
            { texto: "Pede uma análise de potabilidade completa e a gente já resolve tudo de uma vez.", adequada: false, pontos: 1, porque: "Não está errado pedir amplo, mas joga a decisão pro laudo sem orientar a leitura do problema de cor.", risco: "Cliente pode gastar mais sem foco; e 'resolve tudo de uma vez' insinua solução única.", melhora: "Ampliar é válido, mas guie os parâmetros-chave do caso e evite prometer que 'resolve tudo'." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 4
    {
      id: 4,
      titulo: "Dureza alta",
      obrigatorio: true,
      contexto: "Cliente reclama de incrustação branca em torneiras, chuveiro e resistência, e sabão que 'não faz espuma'. Laudo aponta dureza elevada. Ele quer 'um filtro que amoleça a água'.",
      passos: [
        {
          fala: "Tá dando muita crosta branca e o sabão não rende. Me arruma um filtro que amolece a água.",
          opcoes: [
            { texto: "Isso tem cara de dureza alta mesmo — cálcio e magnésio. Mas 'amolecer' é diferente de 'filtrar partícula': dureza dissolvida pede tratamento específico, tipo abrandamento. Você tem o laudo com o valor da dureza? Quero confirmar quanto está e em que unidade antes de dimensionar.", adequada: true, pontos: 3, porque: "Distingue dureza dissolvida de filtragem de partícula e ancora no valor+unidade da análise.", risco: "", melhora: "" },
            { texto: "Qualquer filtro nosso já melhora isso, o de sedimentos deixa a água boa e para a crosta.", adequada: false, pontos: 0, porque: "Confunde filtragem de partícula com tratamento de dureza dissolvida.", risco: "Filtro de sedimentos não remove dureza; a incrustação continua e o cliente se sente enganado.", melhora: "Dureza é dissolvida: não sai em filtro de partícula. Explique a diferença e confirme o laudo." },
            { texto: "Amolecedor resolve. Te mando o abrandador padrão que serve pra qualquer casa.", adequada: false, pontos: 1, porque: "Acerta a família (abrandador) mas trata como produto universal sem dimensionar por dureza e consumo.", risco: "Abrandador subdimensionado satura rápido e não entrega; superdimensionado encarece à toa.", melhora: "Abrandador precisa ser dimensionado pela dureza (valor) e pelo consumo/vazão. Confirme antes." }
          ]
        },
        {
          fala: "Tenho o laudo sim. A dureza tá alta. Esse abrandador precisa de manutenção? Como funciona?",
          opcoes: [
            { texto: "Deixa eu confirmar o valor da dureza e a unidade no seu laudo. Abrandador por resina trabalha com ciclos de regeneração e, pra isso, também depende de vazão e pressão adequadas — inclusive na etapa de retrolavagem/regeneração. Por isso, além do laudo, vou levantar sua hidráulica e o consumo pra dimensionar direito.", adequada: true, pontos: 3, porque: "Confirma parâmetro, explica regeneração e traz a sondagem hidráulica (vazão de retrolavagem/consumo).", risco: "", melhora: "" },
            { texto: "Não precisa de manutenção nenhuma, é só instalar e esquecer.", adequada: false, pontos: 0, porque: "Falso: abrandador de resina exige regeneração e insumo (sal), com condição hidráulica.", risco: "Cliente sem manutenção perde a capacidade de troca iônica e a dureza volta sem ele entender por quê.", melhora: "Explique a regeneração e os requisitos hidráulicos; não prometa 'instala e esquece'." },
            { texto: "Precisa trocar o filtro toda semana, mas fora isso funciona em qualquer vazão.", adequada: false, pontos: 1, porque: "Erra o tipo de manutenção e ainda afirma que funciona em qualquer vazão.", risco: "Informação errada sobre operação e negação do requisito de vazão de regeneração.", melhora: "Estude a operação real (regeneração, não 'troca semanal') e confirme a vazão disponível." }
          ]
        },
        {
          fala: "Minha vazão é fraca, a casa é abastecida por gravidade da caixa. Isso atrapalha?",
          opcoes: [
            { texto: "Atrapalha e é um ponto decisivo. Muitos abrandadores precisam de uma vazão mínima pra regenerar/retrolavar, e gravidade pura às vezes não entrega. Antes de propor, preciso medir sua vazão real; se ela não atender, a gente avalia pressurização ou outra rota com o especialista. Não vou te vender algo que a sua hidráulica não sustenta.", adequada: true, pontos: 3, porque: "Trata a vazão de retrolavagem como critério de viabilidade e encaminha ao especialista se não atender.", risco: "", melhora: "" },
            { texto: "Não atrapalha, gravidade serve pra tudo. Pode instalar do jeito que está.", adequada: false, pontos: 0, porque: "Nega o requisito de vazão de regeneração.", risco: "Regeneração incompleta por falta de vazão: resina não recupera e o abrandador vira enfeite.", melhora: "Meça a vazão. Gravidade fraca frequentemente inviabiliza retrolavagem/regeneração." },
            { texto: "Se a vazão é fraca, coloca um tanque maior que compensa.", adequada: false, pontos: 1, porque: "Confunde capacidade de troca com vazão de regeneração — tanque maior não cria vazão.", risco: "Tanque maior sem vazão continua sem regenerar direito; gasto maior e mesmo problema.", melhora: "Vazão e volume são coisas diferentes. Resolva a vazão de retrolavagem antes de mexer no tamanho." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 5
    {
      id: 5,
      titulo: "Coliformes totais",
      obrigatorio: true,
      contexto: "Laudo do cliente acusa <strong>coliformes totais</strong> presentes (E. coli ausente). Cliente quer saber se 'a água tá contaminada' e pede um equipamento que 'deixe potável'.",
      passos: [
        {
          fala: "No meu laudo deu coliformes totais. Tá contaminada? Me vende um equipamento que deixa potável de novo.",
          opcoes: [
            { texto: "Coliformes totais no laudo é um sinal de alerta microbiológico que precisa ser levado a sério e investigado — pode indicar entrada de contaminação no poço. Isso não é coisa que eu resolva te empurrando um equipamento por telefone. Vou te encaminhar pro nosso especialista avaliar o laudo e a estrutura do poço. Enquanto isso, eu não posso te prometer potabilidade.", adequada: true, pontos: 3, porque: "Reconhece o risco microbiológico, encaminha ao especialista e recusa prometer potabilidade.", risco: "", melhora: "" },
            { texto: "Fica tranquilo, um bom filtro deixa potável de novo. Já te mando o equipamento que resolve isso.", adequada: false, pontos: 0, porque: "Promete potabilidade — algo que a regra proíbe — e trata contaminação microbiológica como venda simples.", risco: "Prometer potabilidade em água com contaminação microbiológica é grave: risco à saúde e responsabilidade legal.", melhora: "Nunca prometa potabilidade. Contaminação microbiológica é caso de especialista, não de venda por telefone." },
            { texto: "Coliformes totais é normal em poço, não precisa se preocupar, qualquer filtrinho dá conta.", adequada: false, pontos: 0, porque: "Minimiza um resultado microbiológico e banaliza a desinfecção.", risco: "Desqualificar o alerta pode expor a família a risco sanitário e sua empresa a responsabilidade.", melhora: "Trate qualquer sinal microbiológico com seriedade; encaminhe ao especialista e não minimize." }
          ]
        },
        {
          fala: "Mas dá pra desinfetar né? Coloca um ultravioleta desses que mata tudo e pronto.",
          opcoes: [
            { texto: "Desinfecção como UV pode fazer parte da solução, mas ela tem pré-requisitos: exige água com turbidez baixa, dimensionamento por vazão e, muitas vezes, corrigir a causa da entrada de contaminação primeiro. 'Mata tudo e pronto' não existe. Por isso o especialista precisa ver o laudo completo e a hidráulica antes de definir.", adequada: true, pontos: 3, porque: "Explica pré-requisitos da desinfecção, nega o 'mata tudo' e condiciona ao especialista + hidráulica.", risco: "", melhora: "" },
            { texto: "Isso, UV mata tudo. Instala um UV e a água fica 100% potável garantido.", adequada: false, pontos: 0, porque: "Promete potabilidade garantida e ignora turbidez, vazão e a causa da contaminação.", risco: "UV mal dimensionado ou com turbidez alta não desinfeta; prometer 100% é falso e perigoso.", melhora: "UV tem condições (turbidez, vazão, causa). Nunca prometa 100%; encaminhe pro dimensionamento." },
            { texto: "UV é bom, mas fervendo a água já resolve, nem precisa comprar nada.", adequada: false, pontos: 1, porque: "Desvia para um paliativo doméstico e abandona o diagnóstico técnico.", risco: "Ferver é medida emergencial pontual, não solução; e você abre mão de resolver a causa.", melhora: "Não empurre paliativo como solução. Encaminhe o laudo pro especialista definir a desinfecção correta." }
          ]
        },
        {
          fala: "E depois que fizer o tratamento, como eu comprovo que a água voltou a ficar boa?",
          opcoes: [
            { texto: "Com uma nova análise microbiológica depois do sistema instalado e operando. É ela que comprova que os coliformes sumiram — e, em água pra consumo, esse recheck não é opcional. Sem a reanálise, ninguém pode afirmar que está resolvido.", adequada: true, pontos: 3, porque: "Prevê nova análise microbiológica pós-tratamento como única prova válida.", risco: "", melhora: "" },
            { texto: "Você vai perceber pelo gosto e pelo cheiro que melhorou, isso já basta.", adequada: false, pontos: 0, porque: "Usa gosto/cheiro como prova de segurança microbiológica — que é invisível aos sentidos.", risco: "Contaminação microbiológica não tem cheiro/gosto; confiar nisso expõe o cliente a risco.", melhora: "Prova de desinfecção é laudo, nunca percepção sensorial. Agende a reanálise." },
            { texto: "Depois de instalado pode confiar que está resolvido, a tecnologia é certificada.", adequada: false, pontos: 1, porque: "Troca a comprovação por confiança na certificação do equipamento.", risco: "Certificação do produto não comprova o resultado naquela instalação específica.", melhora: "Certificado do equipamento não substitui laudo pós-tratamento do ponto de uso." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 6
    {
      id: 6,
      titulo: "Presença de E. coli",
      obrigatorio: true,
      contexto: "Laudo acusa <strong>E. coli presente</strong> — indicador de contaminação fecal. Cliente está bebendo dessa água e quer 'resolver rápido e barato'.",
      passos: [
        {
          fala: "Deu E. coli no meu laudo mas a gente bebe essa água há anos e nunca passou mal. É frescura?",
          opcoes: [
            { texto: "Não é frescura, não. E. coli no laudo indica contaminação fecal e é um risco sério à saúde, independente de já terem bebido antes. A minha recomendação imediata é não consumir essa água pra beber/cozinhar até resolver, e deixar o nosso especialista avaliar com urgência. Isso vai além de vender equipamento.", adequada: true, pontos: 3, porque: "Trata E. coli com a gravidade devida, orienta interromper consumo e encaminha ao especialista com urgência.", risco: "", melhora: "" },
            { texto: "Se nunca passaram mal, deve ser contaminação leve. Um filtro comum já dá conta.", adequada: false, pontos: 0, porque: "Minimiza contaminação fecal e oferece filtro comum como solução.", risco: "Banalizar E. coli pode resultar em doença grave; filtro comum não é barreira microbiológica.", melhora: "E. coli é sempre grave. Nunca minimize nem ofereça filtro comum; encaminhe com urgência." },
            { texto: "Provavelmente foi erro do laboratório. Refaz a coleta que deve dar limpo.", adequada: false, pontos: 1, porque: "Descarta o resultado presumindo erro, sem base, e adia a proteção do cliente.", risco: "Presumir erro de laudo em E. coli pode atrasar uma medida urgente de saúde.", melhora: "Recoleta pode fazer parte, mas trate como risco real desde já e envolva o especialista." }
          ]
        },
        {
          fala: "Então me vende logo o mais barato que mata E. coli pra eu voltar a beber.",
          opcoes: [
            { texto: "Eu entendo a urgência, mas 'o mais barato que mata' não é uma decisão que se toma no balcão. Desinfecção pra E. coli precisa ser dimensionada e, principalmente, é essencial descobrir e corrigir a fonte da contaminação — senão volta. Vou acionar o especialista pra avaliar o poço e o laudo. Não vou te vender no escuro uma coisa dessas.", adequada: true, pontos: 3, porque: "Recusa a venda cega, prioriza causa raiz e encaminha ao especialista com responsabilidade.", risco: "", melhora: "" },
            { texto: "Fechado, o mais barato é uma pastilha de cloro, coloca na caixa que resolve.", adequada: false, pontos: 0, porque: "Improvisa dosagem/produto sem dimensionamento nem investigação da fonte.", risco: "Cloração empírica pode ser insuficiente ou mal dosada; contaminação fecal exige método correto.", melhora: "Nunca improvise dosagem de desinfetante. Encaminhe pro especialista dimensionar e achar a causa." },
            { texto: "Compra o UV mais em conta que mata E. coli na hora e pode beber.", adequada: false, pontos: 1, porque: "Escolhe por preço e promete liberar consumo sem tratar causa nem confirmar por laudo.", risco: "Sem corrigir a fonte e sem reanálise, liberar consumo é assumir risco à saúde do cliente.", melhora: "Não libere consumo por venda. Trate a causa, dimensione e comprove com nova análise." }
          ]
        },
        {
          fala: "Tá, e enquanto o especialista não vem, o que eu faço pra não ficar sem água boa?",
          opcoes: [
            { texto: "Pra beber e cozinhar, use uma fonte segura nesse intervalo — água tratada/comprada ou fervida como medida emergencial. Eu já sinalizo a urgência pro especialista pra encurtar o prazo. Assim você não fica exposto enquanto a gente resolve a causa e define a desinfecção certa.", adequada: true, pontos: 3, porque: "Protege o cliente com orientação emergencial responsável sem prometer nada nem vender às pressas.", risco: "", melhora: "" },
            { texto: "Pode beber normal, só não dá pras crianças. Adulto aguenta.", adequada: false, pontos: 0, porque: "Libera consumo de água com E. coli e cria uma distinção sem base.", risco: "Orientação perigosa: contaminação fecal pode adoecer qualquer pessoa.", melhora: "Nunca libere consumo de água com E. coli. Oriente fonte segura até resolver." },
            { texto: "Coloca um pouco de cloro na caixa por conta própria que segura até lá.", adequada: false, pontos: 1, porque: "Recomenda cloração caseira sem dosagem, transferindo risco ao cliente.", risco: "Cloração por conta própria sem controle pode ser ineficaz ou inadequada.", melhora: "Não terceirize desinfecção sem controle. Oriente fonte segura e priorize o especialista." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 7
    {
      id: 7,
      titulo: "Nitrato alto",
      obrigatorio: true,
      contexto: "Laudo aponta <strong>nitrato acima do limite</strong>. A água é límpida e sem cheiro. Há um bebê na casa. Cliente não entende o risco porque 'a água parece perfeita'.",
      passos: [
        {
          fala: "A análise deu nitrato alto, mas a água é cristalina e sem cheiro. Isso é problema mesmo? Tenho um bebê em casa.",
          opcoes: [
            { texto: "É problema sim, e justamente por ter bebê eu preciso ser franco: nitrato não tem cor, cheiro nem gosto, e em bebês é especialmente preocupante. 'Parecer perfeita' não conta aqui. Deixa eu confirmar o valor e a unidade do nitrato no laudo, e já quero envolver o especialista pela presença da criança.", adequada: true, pontos: 3, porque: "Explica que nitrato é invisível aos sentidos, valoriza o contexto do bebê e confirma valor+unidade + especialista.", risco: "", melhora: "" },
            { texto: "Se a água está cristalina e sem cheiro, relaxa, deve estar tudo bem no dia a dia.", adequada: false, pontos: 0, porque: "Usa aparência para tranquilizar sobre um contaminante invisível e sensível para bebês.", risco: "Minimizar nitrato com bebê em casa é um erro grave de orientação de saúde.", melhora: "Nitrato é invisível. Nunca tranquilize por aparência, ainda mais com criança pequena." },
            { texto: "Nitrato qualquer filtro tira, é só colocar um filtro de carvão que resolve.", adequada: false, pontos: 0, porque: "Afirma remoção sem base — carvão comum não é a via típica para nitrato dissolvido.", risco: "Prometer remoção com tecnologia incompatível deixa o bebê exposto achando que resolveu.", melhora: "Não afirme remoção sem tecnologia compatível comprovada. Confirme laudo e chame o especialista." }
          ]
        },
        {
          fala: "Então como é que tira o nitrato? Tem que ser aquele negócio de osmose?",
          opcoes: [
            { texto: "Nitrato dissolvido pede uma tecnologia específica e compatível — não é qualquer filtro. Osmose é uma das rotas possíveis, mas quem define isso é o especialista, olhando o valor do nitrato, o uso (só o ponto de beber ou a casa toda) e a hidráulica. Não vou cravar a solução sem esse dimensionamento.", adequada: true, pontos: 3, porque: "Reconhece que nitrato exige tecnologia compatível, não crava e encaminha ao dimensionamento do especialista.", risco: "", melhora: "" },
            { texto: "Isso, osmose reversa resolve nitrato e de quebra tira todo o resto, pode fechar.", adequada: false, pontos: 1, porque: "Fixa a tecnologia e ainda diz que 'tira todo o resto' sem dimensionar.", risco: "'Tira todo o resto' é a armadilha da tecnologia universal; e ponto de uso vs casa toda muda tudo.", melhora: "Mesmo quando a rota provável é osmose, deixe o especialista dimensionar; não prometa 'tira tudo'." },
            { texto: "Tem uns filtros de nitrato baratos, compra um desses que já baixa.", adequada: false, pontos: 1, porque: "Sugere produto genérico 'de nitrato' sem confirmar valor nem capacidade.", risco: "Mídia de nitrato tem capacidade e condições; sem dimensionar, pode não atingir o padrão para bebê.", melhora: "Confirme o valor e deixe o especialista dimensionar capacidade/condição, especialmente com bebê." }
          ]
        },
        {
          fala: "Depois de instalar, dá pra confiar que o nitrato baixou o suficiente pro bebê?",
          opcoes: [
            { texto: "A única forma de confiar é uma nova análise de nitrato depois do sistema operando, comparando com o limite. Com bebê em casa, esse recheck é indispensável. Enquanto não sair o laudo pós-tratamento, use uma fonte segura pra ele e não confie só no aspecto da água.", adequada: true, pontos: 3, porque: "Exige reanálise pós-tratamento e protege o bebê no intervalo, sem prometer pelo discurso.", risco: "", melhora: "" },
            { texto: "Pode confiar assim que instalar, esses sistemas já vêm calibrados de fábrica.", adequada: false, pontos: 0, porque: "Confia em 'calibração de fábrica' em vez de medir o resultado real.", risco: "Nenhuma calibração de fábrica comprova o nitrato final naquela água; bebê exposto se falhar.", melhora: "Resultado se comprova com laudo pós-tratamento, não com premissa de fábrica." },
            { texto: "Faz um teste de gosto com o bebê depois de uns dias pra ver se ele reage.", adequada: false, pontos: 0, porque: "Sugere 'testar no bebê', o que é perigoso e sem sentido técnico.", risco: "Nitrato é insípido e o risco é justamente para bebês; jamais usar a criança como teste.", melhora: "Nunca proponha testar em pessoas. Comprove com análise laboratorial pós-tratamento." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 8
    {
      id: 8,
      titulo: "Amônia",
      obrigatorio: true,
      contexto: "Laudo aponta <strong>amônia</strong> na água do poço. Cliente associa a 'cheiro' e quer só 'tirar o cheiro'. A presença de amônia também levanta hipótese de contaminação a investigar.",
      passos: [
        {
          fala: "Deu amônia na análise. Deve ser por causa de um cheiro que às vezes sinto. Tem filtro que tira cheiro?",
          opcoes: [
            { texto: "Amônia é mais do que uma questão de cheiro: a presença dela pode indicar uma fonte de contaminação que precisa ser investigada, e também interfere em etapas como a desinfecção. Antes de falar em 'tirar cheiro', quero confirmar o valor e a unidade da amônia no laudo e entender a origem com o especialista.", adequada: true, pontos: 3, porque: "Recontextualiza amônia como possível indicador de contaminação, confirma valor+unidade e envolve especialista.", risco: "", melhora: "" },
            { texto: "Tem sim, um filtro de carvão tira o cheiro rapidinho e pronto.", adequada: false, pontos: 0, porque: "Reduz amônia a cheiro e promete resolver com carvão sem investigar a causa.", risco: "Tratar só o 'cheiro' ignora a possível contaminação e o impacto na desinfecção.", melhora: "Não reduza amônia a odor. Confirme o valor e investigue a origem com o especialista." },
            { texto: "Cheiro é sempre enxofre, o laboratório deve ter trocado o nome. Ignora a amônia.", adequada: false, pontos: 0, porque: "Descarta o parâmetro do laudo com base num palpite.", risco: "Ignorar amônia do laudo pode deixar passar contaminação real e comprometer a desinfecção.", melhora: "Confie no laudo e confirme o parâmetro; não substitua o resultado por achismo." }
          ]
        },
        {
          fala: "Contaminação? De onde viria isso? Meu poço é fechado.",
          opcoes: [
            { texto: "Nem sempre dá pra saber pela aparência — amônia pode vir de infiltração, atividade próxima ou problema na estrutura do poço. Como pode ser sinal de contaminação e ainda atrapalha a desinfecção, o certo é o especialista avaliar o laudo completo e a estrutura antes de qualquer proposta. Não é caso de resolver por telefone.", adequada: true, pontos: 3, porque: "Explica origens possíveis, liga amônia ao risco/desinfecção e encaminha ao especialista.", risco: "", melhora: "" },
            { texto: "Se o poço é fechado, então não é contaminação. Deve ser natural, pode deixar pra lá.", adequada: false, pontos: 0, porque: "Descarta contaminação pela premissa de 'poço fechado' e manda ignorar.", risco: "Poço fechado não garante ausência de contaminação; ignorar pode manter risco ativo.", melhora: "Não descarte contaminação por presunção. Investigue a origem com o especialista." },
            { texto: "Deve ser da bomba ou da tubulação, troca o encanamento que resolve.", adequada: false, pontos: 1, porque: "Chuta uma causa mecânica e propõe obra sem diagnóstico.", risco: "Trocar encanamento no palpite gera custo sem resolver se a origem for outra.", melhora: "Não presuma a causa. Deixe o especialista investigar a origem da amônia a partir do laudo." }
          ]
        },
        {
          fala: "E se for o caso de tratar mesmo, dá pra desinfetar por cima da amônia?",
          opcoes: [
            { texto: "Aí está um ponto técnico importante: amônia interfere na desinfecção, então não é só 'jogar desinfetante por cima'. A sequência e a tecnologia certas dependem do laudo completo e da hidráulica — inclusive vazão pra etapas que precisam de retrolavagem. Por isso o especialista precisa desenhar a rota; eu não improviso essa sequência.", adequada: true, pontos: 3, porque: "Explica a interferência da amônia na desinfecção, traz hidráulica/vazão e encaminha ao especialista.", risco: "", melhora: "" },
            { texto: "Dá sim, é só dobrar a dose de cloro que vence a amônia fácil.", adequada: false, pontos: 0, porque: "Inventa dosagem ('dobrar cloro') sem base técnica.", risco: "Dosagem empírica com amônia pode ser ineficaz e gerar subprodutos; decisão perigosa.", melhora: "Nunca improvise dosagem. Amônia muda a demanda de desinfecção; deixe o especialista calcular." },
            { texto: "Melhor nem desinfetar, só coloca um filtro grande que segura tudo.", adequada: false, pontos: 1, porque: "Propõe um 'filtro grande' universal e ainda desencoraja a desinfecção necessária.", risco: "Tanque grande não trata amônia nem desinfeta; é a solução universal de novo.", melhora: "Descarte o 'filtro que segura tudo'. Sequência de tratamento é definida por especialista com base no laudo." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 9
    {
      id: 9,
      titulo: "Cor orgânica",
      obrigatorio: true,
      contexto: "Água com <strong>cor amarelo-amarronzada de origem orgânica</strong> (aspecto de 'chá'), comum em áreas com matéria orgânica no solo. Cliente já tentou filtro de sedimentos e não adiantou.",
      passos: [
        {
          fala: "Minha água parece chá, meio marrom. Botei filtro de sedimentos e não mudou nada. Por quê?",
          opcoes: [
            { texto: "Esse aspecto de chá costuma ser cor de origem orgânica, que fica dissolvida na água — por isso o filtro de sedimentos, que pega partícula, não segura. São coisas diferentes. Pra ter certeza e dimensionar, preciso de uma análise que meça cor verdadeira e parâmetros associados. Você consegue coletar?", adequada: true, pontos: 3, porque: "Explica por que sedimentos não remove cor dissolvida e conduz à análise de cor verdadeira.", risco: "", melhora: "" },
            { texto: "Seu filtro de sedimentos era fraco. Compra o nosso, que é mais fino e tira essa cor.", adequada: false, pontos: 0, porque: "Atribui à 'finura' do filtro e promete remover cor dissolvida com filtragem de partícula.", risco: "Cor orgânica dissolvida não sai por sedimentos por mais 'fino' que seja; cliente frustra de novo.", melhora: "Cor dissolvida ≠ partícula. Não venda filtro mais fino; explique e peça análise de cor verdadeira." },
            { texto: "Marrom é ferro. Põe um filtro de ferro que a cor sai.", adequada: false, pontos: 1, porque: "Crava ferro pelo aspecto quando pode ser cor orgânica, sem análise.", risco: "Se for orgânica, o filtro de ferro não resolve e o cliente paga por diagnóstico errado.", melhora: "Não crave ferro por cor. Peça análise que diferencie cor orgânica de ferro." }
          ]
        },
        {
          fala: "Ah, então é dissolvido. E como tira cor dissolvida dessas?",
          opcoes: [
            { texto: "Cor orgânica dissolvida pede uma tecnologia compatível com matéria orgânica — não é filtragem de partícula. Existem rotas possíveis, mas a escolha e o dimensionamento dependem do valor de cor no laudo, do uso e da hidráulica. Quem fecha isso é o especialista; eu não vou chutar a mídia certa.", adequada: true, pontos: 3, porque: "Reconhece que exige tecnologia compatível, não crava e encaminha ao dimensionamento.", risco: "", melhora: "" },
            { texto: "Carvão ativado tira qualquer cor, pode comprar o maior que resolve.", adequada: false, pontos: 1, porque: "Fixa a tecnologia e o tamanho sem laudo, com o 'maior resolve'.", risco: "Mesmo que carvão seja uma via, capacidade/condição dependem do valor de cor; 'o maior' não é dimensionamento.", melhora: "Confirme o valor de cor e deixe o especialista dimensionar a mídia e a capacidade." },
            { texto: "Cor dissolvida só osmose tira, então vai de osmose na casa toda.", adequada: false, pontos: 1, porque: "Salta pra osmose na casa toda sem avaliar uso, custo e hidráulica.", risco: "Osmose na casa toda por reflexo pode ser superdimensionada e cara; decisão sem diagnóstico.", melhora: "Não decida a rota sozinho. Leve laudo + uso + hidráulica ao especialista." }
          ]
        },
        {
          fala: "Beleza. Se instalar a tecnologia certa, a cor some de vez e não volta?",
          opcoes: [
            { texto: "Some se estiver bem dimensionada e mantida — e a gente comprova com uma nova análise de cor depois de instalar. Cor orgânica também pode variar com a estação, então a reanálise e o acompanhamento importam. Não vou te prometer 'nunca mais' sem esse controle.", adequada: true, pontos: 3, porque: "Condiciona o resultado a dimensionamento+manutenção, prevê reanálise e evita promessa absoluta.", risco: "", melhora: "" },
            { texto: "Some pra sempre, garantido. Instalou, acabou o problema, pode esquecer.", adequada: false, pontos: 0, porque: "Promete resultado permanente e nega manutenção/variação sazonal.", risco: "Mídia satura e a cor pode variar na estação; 'nunca mais' vira reclamação.", melhora: "Nunca prometa permanência. Fale de manutenção, variação sazonal e reanálise." },
            { texto: "Depois de instalar, se a água ficar transparente já pode confiar que resolveu.", adequada: false, pontos: 1, porque: "Usa transparência como prova, contrariando 'transparente ≠ resolvido'.", risco: "Aspecto limpo não comprova o valor de cor dentro do padrão.", melhora: "Comprove com análise de cor pós-tratamento, não com o olho." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 10
    {
      id: 10,
      titulo: "Cliente SEM análise",
      obrigatorio: true,
      contexto: "Cliente novo quer <strong>comprar um sistema completo de tratamento</strong> para o poço, mas <strong>nunca fez análise nenhuma</strong>. Está decidido a comprar hoje e resiste à ideia de 'gastar com laboratório'.",
      passos: [
        {
          fala: "Quero comprar um sistema completo pro meu poço hoje. Nunca fiz análise, mas quero deixar tudo resolvido de uma vez.",
          opcoes: [
            { texto: "Adoro a disposição de resolver de vez — e é exatamente por isso que a análise vem primeiro. Sem saber o que a sua água tem, um 'sistema completo' pode tratar o que não precisa e deixar passar o que importa. A análise é o mapa: com ela eu monto o sistema certo pra sua água, não um pacote genérico.", adequada: true, pontos: 3, porque: "Aproveita a motivação, recusa o pacote genérico e posiciona a análise como o que garante acerto.", risco: "", melhora: "" },
            { texto: "Show! Nosso combo completo cobre tudo que aparece em poço, pode levar sem análise.", adequada: false, pontos: 0, porque: "Vende pacote universal sem diagnóstico, exatamente o que a regra proíbe.", risco: "Sistema genérico pode não tratar o contaminante real e ainda ter etapa inútil; dinheiro mal gasto.", melhora: "Não existe combo que 'cobre tudo' sem laudo. Sempre analise antes de propor sistema." },
            { texto: "Sem análise fica difícil, mas se você faz questão te mando o kit padrão que a maioria leva.", adequada: false, pontos: 1, porque: "Sinaliza a regra mas cede e empurra um 'kit padrão' assim mesmo.", risco: "Ceder ao 'padrão' repete o erro; e o 'a maioria leva' não diz nada sobre a água dele.", melhora: "Não ceda por pressão. Mantenha a análise como pré-requisito inegociável do sistema." }
          ]
        },
        {
          fala: "Mas análise é dinheiro jogado fora. Não dá pra você olhar meu poço e já saber?",
          opcoes: [
            { texto: "Olhar o poço ajuda a levantar hipóteses da hidráulica, mas não mede nitrato, dureza, coliformes, ferro… nada disso se vê. Análise não é dinheiro jogado fora — é o que impede você de comprar o sistema errado, que aí sim seria dinheiro perdido. Posso te ajudar a encaminhar a coleta num laboratório.", adequada: true, pontos: 3, porque: "Separa sondagem hidráulica visual da análise, reforça o valor do laudo e oferece ajuda prática.", risco: "", melhora: "" },
            { texto: "Consigo sim, com a experiência eu bato o olho e já sei o que seu poço precisa.", adequada: false, pontos: 0, porque: "Afirma diagnosticar 'de olho', contrariando toda a regra.", risco: "Diagnóstico visual não detecta contaminantes invisíveis; leva a proposta errada e risco à saúde.", melhora: "Experiência não enxerga nitrato/coliforme. Nunca diagnostique de olho; peça análise." },
            { texto: "Então vamos pela sua região: nessa área o povo geralmente tem ferro, vou por ferro.", adequada: false, pontos: 1, porque: "Generaliza pela região em vez de analisar aquele poço específico.", risco: "Padrão regional não garante o perfil daquele poço; pode errar o parâmetro principal.", melhora: "Região é hipótese, não diagnóstico. Confirme com análise do poço do cliente." }
          ]
        },
        {
          fala: "Tá, e enquanto sai a análise, você já vai adiantando qual sistema é?",
          opcoes: [
            { texto: "Vou adiantando o que dá com segurança: levanto sua hidráulica — vazão, pressão, se é gravidade ou bomba, ponto de instalação e se tem vazão pra retrolavagem. Isso a gente resolve já. A definição das tecnologias eu fecho quando o laudo chegar, aí monto a proposta certinha em cima dos números.", adequada: true, pontos: 3, porque: "Aproveita o tempo com sondagem hidráulica legítima e reserva a tecnologia para depois do laudo.", risco: "", melhora: "" },
            { texto: "Já deixo separado o sistema completo aqui, e quando o laudo vier a gente confirma.", adequada: false, pontos: 1, porque: "Pré-decide o sistema antes do laudo, criando ancoragem que enviesa a proposta.", risco: "Reservar o pacote antes do laudo pressiona a encaixar o resultado no que já foi 'separado'.", melhora: "Não pré-monte a solução. Levante a hidráulica e espere o laudo definir as tecnologias." },
            { texto: "Adianto sim: fecho a osmose que serve pra qualquer laudo que vier.", adequada: false, pontos: 0, porque: "Crava tecnologia 'pra qualquer laudo', ou seja, solução universal.", risco: "Definir a osmose antes do laudo é o vício da tecnologia que 'serve pra tudo'.", melhora: "Nenhuma tecnologia serve pra qualquer laudo. Espere os números pra decidir." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 11
    {
      id: 11,
      titulo: "Cliente com análise ANTIGA",
      obrigatorio: true,
      contexto: "Cliente tem um laudo, mas <strong>de vários anos atrás</strong>. Quer usar esse laudo antigo para fechar o sistema agora e economizar uma análise nova.",
      passos: [
        {
          fala: "Tenho um laudo aqui, mas é de uns 4 anos atrás. Serve pra você montar o sistema, né? Assim economizo a análise nova.",
          opcoes: [
            { texto: "Esse laudo antigo é ótimo como histórico, mas água de poço muda com o tempo — estação, uso do entorno, nível do aquífero. Pra dimensionar o que você vai instalar agora, eu preciso de uma análise recente. Uso o antigo pra comparar a evolução, mas a proposta tem que sair em cima de dados atuais.", adequada: true, pontos: 3, porque: "Valoriza o histórico, explica por que a água muda e exige laudo recente para dimensionar.", risco: "", melhora: "" },
            { texto: "Serve sim, água de poço não muda muito. Vou montar em cima desse laudo mesmo.", adequada: false, pontos: 0, porque: "Assume estabilidade da água e dimensiona sobre dado desatualizado.", risco: "Parâmetros podem ter mudado; dimensionar no laudo velho arrisca subtratar ou tratar o errado.", melhora: "Água de poço muda. Nunca dimensione em laudo antigo; peça análise recente." },
            { texto: "Se é de 4 anos, joga fora, não presta pra nada. Começa tudo do zero e nem me mostra.", adequada: false, pontos: 1, porque: "Descarta o histórico, que tem valor comparativo, de forma abrupta.", risco: "Ignorar o laudo antigo perde uma referência útil de evolução e soa desqualificador.", melhora: "Não descarte o histórico. Peça o laudo novo, mas use o antigo pra comparar tendência." }
          ]
        },
        {
          fala: "Mas de 4 anos pra cá o que poderia ter mudado numa água de poço?",
          opcoes: [
            { texto: "Vários parâmetros podem oscilar: nível e recarga do aquífero, chuvas, atividade agrícola ou fossas próximas, e até a estrutura do poço envelhecendo. Coisas como nitrato e o microbiológico são sensíveis a isso. Por segurança, principalmente por ser água de consumo, a gente confirma com um laudo atual antes de investir num sistema.", adequada: true, pontos: 3, porque: "Dá causas concretas de variação e liga ao risco de consumo para justificar o laudo novo.", risco: "", melhora: "" },
            { texto: "Praticamente nada muda em 4 anos, é a mesma água lá embaixo.", adequada: false, pontos: 0, porque: "Nega a variabilidade da água subterrânea.", risco: "Falsa estabilidade leva a dispensar reanálise e a errar o dimensionamento atual.", melhora: "Água subterrânea varia. Não afirme estabilidade; justifique a reanálise." },
            { texto: "Muda tudo sempre, então nem adianta analisar porque semana que vem já mudou de novo.", adequada: false, pontos: 1, porque: "Exagera a variação a ponto de desvalorizar a própria análise.", risco: "Esse fatalismo pode fazer o cliente achar que análise é inútil e desistir do processo.", melhora: "Equilibre: a água varia, por isso se usa um laudo recente como base — não se descarta analisar." }
          ]
        },
        {
          fala: "Certo, faço a nova. Depois de instalado, esse laudo novo ainda serve pra alguma coisa?",
          opcoes: [
            { texto: "Serve como o seu marco zero. Depois do sistema operando, a gente faz uma análise pós-tratamento e compara com esse laudo recente pra comprovar a melhora. E vale repetir análises periodicamente, porque a água muda — assim você acompanha e mantém a segurança ao longo do tempo.", adequada: true, pontos: 3, porque: "Usa o laudo novo como baseline, prevê reanálise pós-tratamento e recomenda monitoramento periódico.", risco: "", melhora: "" },
            { texto: "Depois de instalar pode jogar fora os laudos, não precisa mais de análise nenhuma.", adequada: false, pontos: 0, porque: "Descarta o baseline e abandona o monitoramento.", risco: "Sem baseline e sem reanálise você não comprova resultado nem detecta mudança futura.", melhora: "Guarde o laudo como marco zero e mantenha reanálises periódicas." },
            { texto: "Guarda o laudo só pra garantia, mas análise nova nunca mais vai precisar.", adequada: false, pontos: 1, porque: "Reduz o laudo a papel de garantia e nega o monitoramento futuro.", risco: "Negar reanálises futuras ignora que a água muda e que há prova pós-tratamento a fazer.", melhora: "Além de guardar, programe a análise pós-tratamento e monitoramento ao longo do tempo." }
          ]
        }
      ]
    },

    // ------------------------------------------------------------------ 12
    {
      id: 12,
      titulo: "Vazão insuficiente para retrolavagem",
      obrigatorio: true,
      contexto: "Laudo já indica um tratamento por leito filtrante que precisa de <strong>retrolavagem</strong>. Na sondagem hidráulica, a <strong>vazão disponível é baixa</strong> (abastecimento por gravidade, caixa baixa). Cliente quer instalar mesmo assim.",
      passos: [
        {
          fala: "O laudo já saiu e você disse que precisa de um filtro que retrolava. Pode instalar, minha água chega da caixa por gravidade.",
          opcoes: [
            { texto: "Antes de instalar eu preciso medir a sua vazão real, porque filtro de leito só funciona bem se conseguir retrolavar — e retrolavagem exige uma vazão mínima. Gravidade de caixa baixa às vezes não entrega isso. Se não atender, a gente resolve a hidráulica primeiro; instalar sem vazão de retrolavagem é receita de dor de cabeça.", adequada: true, pontos: 3, porque: "Coloca a medição de vazão de retrolavagem como pré-condição e recusa instalar sem confirmá-la.", risco: "", melhora: "" },
            { texto: "Pode deixar, instalo por gravidade mesmo. Retrolavagem sempre dá um jeito de acontecer.", adequada: false, pontos: 0, porque: "Ignora o requisito de vazão e assume que a retrolavagem 'se resolve'.", risco: "Sem vazão suficiente o leito não retrolava, entope, canaliza e o tratamento falha.", melhora: "Nunca instale leito sem confirmar a vazão de retrolavagem. Meça antes." },
            { texto: "Se a vazão é baixa, é só colocar um tanque maior que compensa a retrolavagem.", adequada: false, pontos: 1, porque: "Confunde volume com vazão — tanque maior não gera a vazão de retrolavagem que falta.", risco: "Tanque maior ainda exige (ou até mais) vazão pra retrolavar; o problema piora.", melhora: "Volume ≠ vazão. Resolva a vazão de retrolavagem, não aumente o tanque." }
          ]
        },
        {
          fala: "Medindo aqui a vazão realmente tá fraca. E agora, não tem jeito de instalar?",
          opcoes: [
            { texto: "Tem caminho, mas passa por corrigir a hidráulica: normalmente uma pressurização/bomba pra garantir a vazão de retrolavagem, ou repensar o ponto e a rota com o especialista. Eu prefiro te entregar uma solução que funciona de verdade a instalar algo que vai falhar. Deixa eu levar sua vazão medida pro especialista dimensionar.", adequada: true, pontos: 3, porque: "Oferece caminhos reais (pressurização/rever rota), encaminha ao especialista e não instala no improviso.", risco: "", melhora: "" },
            { texto: "Sem jeito então, esquece o tratamento, sua água vai ficar como está mesmo.", adequada: false, pontos: 1, porque: "Desiste do cliente em vez de buscar a correção hidráulica possível.", risco: "Abandonar o caso deixa um problema tratável sem solução e perde a venda legítima.", melhora: "Baixa vazão não é fim de linha: avalie pressurização/rota com o especialista antes de desistir." },
            { texto: "Instala assim mesmo e orienta o cliente a retrolavar manualmente com balde quando lembrar.", adequada: false, pontos: 0, porque: "Improvisa uma retrolavagem manual inviável para contornar a falta de vazão.", risco: "Retrolavagem 'de balde' não reproduz a vazão necessária; o leito degrada e o tratamento falha.", melhora: "Não improvise retrolavagem manual. Corrija a vazão de forma adequada antes de instalar." }
          ]
        },
        {
          fala: "Se eu resolver a bomba pra dar vazão, aí funciona e você garante que trata?",
          opcoes: [
            { texto: "Com a vazão corrigida o filtro passa a poder retrolavar como deve, que é a condição pra ele trabalhar. Mas 'garantir que trata' quem diz é a análise pós-tratamento: instala, opera, e a gente coleta pra comprovar que o parâmetro baixou pro padrão. Vazão certa habilita o equipamento; o laudo confirma o resultado.", adequada: true, pontos: 3, porque: "Liga vazão à operação correta e mantém a nova análise como prova, sem prometer no discurso.", risco: "", melhora: "" },
            { texto: "Aí sim, com bomba eu te garanto que trata, pode contar como resolvido.", adequada: false, pontos: 0, porque: "Promete resultado só por corrigir a vazão, sem reanálise.", risco: "Vazão correta é condição de operação, não prova de remoção; garantir sem laudo é arriscado.", melhora: "Não garanta remoção pela vazão. Comprove o resultado com análise pós-tratamento." },
            { texto: "Com bomba funciona e nem precisa mais analisar, a água já sai tratada visivelmente.", adequada: false, pontos: 1, porque: "Dispensa a reanálise e volta a usar o 'visível' como prova.", risco: "Aspecto não comprova remoção do parâmetro; sem laudo você não fecha o ciclo.", melhora: "Mantenha a análise pós-tratamento como fechamento; o visível não substitui o laudo." }
          ]
        }
      ]
    }

  ]
};
