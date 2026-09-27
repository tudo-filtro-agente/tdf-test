// ============================================================================
// ROLEPLAYS — Especialista Comercial em Scale Stop
// 8 roleplays, 3 passos cada. A resposta ADEQUADA NUNCA promete remover dureza
// nem água mole. Scale Stop = anti-incrustante sem sal que REDUZ a crosta.
// ============================================================================

const ROLEPLAYS = [
  {
    id: 'rp-01-mancha-box',
    titulo: 'Mancha branca no box',
    obrigatorio: true,
    contexto: 'Cliente de casa em região de serra liga incomodada: "fica uma mancha branca no box e nos vidros que não sai de jeito nenhum". Dor clássica de dureza.',
    passos: [
      {
        fala: 'Cliente: "Essa mancha branca no box não sai com nada, já tentei de tudo. O que é isso?"',
        opcoes: [
          { texto: 'Isso é a dureza da sua água — o cálcio e o magnésio secam e formam essa crosta branca. É a dor mais comum de quem tem água dura, e tem solução.', adequada: true, pontos: 3, porque: 'Nomeia a causa (dureza) com precisão e valida a dor, abrindo caminho pra solução.', risco: '', melhora: '' },
          { texto: 'É sujeira da água, provavelmente barro. Um filtro comum resolve.', adequada: false, pontos: 0, porque: 'Diagnóstico errado: mancha branca é dureza, não barro.', risco: 'Leva à solução errada e queima credibilidade.', melhora: 'Ligue a mancha branca à dureza (cálcio/magnésio).' },
          { texto: 'Com o nosso equipamento sua água vai ficar mole e a mancha some pra sempre.', adequada: false, pontos: 0, porque: 'Promete "água mole" — isso é abrandador, não Scale Stop.', risco: 'Promessa falsa que vira problema no pós-venda.', melhora: 'Scale Stop reduz a crosta sem deixar a água mole.' },
        ],
      },
      {
        fala: 'Cliente: "E como vocês resolvem isso?"',
        opcoes: [
          { texto: 'Com o Scale Stop, um anti-incrustante sem sal: ele muda a forma do cálcio pra ele parar de grudar. A crosta e a mancha caem muito, sem sal e sem mexer nos minerais da sua água.', adequada: true, pontos: 3, porque: 'Explica o mecanismo (TAC) com honestidade: reduz a crosta mantendo os minerais.', risco: '', melhora: '' },
          { texto: 'Com um abrandador que remove toda a dureza e deixa a água limpinha.', adequada: false, pontos: 0, porque: 'Confunde Scale Stop com abrandador e promete remoção de dureza.', risco: 'Escopo e produto errados.', melhora: 'Apresente o Scale Stop como anti-incrustante sem sal que reduz a crosta.' },
          { texto: 'A gente instala um filtro qualquer, geralmente resolve.', adequada: false, pontos: 0, porque: 'Vago e sem diagnóstico; não trata a dureza.', risco: 'Cliente não vê valor e você não dimensiona.', melhora: 'Nomeie o Scale Stop e o que ele faz na dureza.' },
        ],
      },
      {
        fala: 'Cliente: "Então minha água fica mole depois disso?"',
        opcoes: [
          { texto: 'Não — e é importante ser honesto: água mole é o abrandador, que usa sal. O Scale Stop não deixa a água mole; ele reduz a crosta e a mancha mantendo os minerais. Seu objetivo é parar a mancha ou você precisa da água mole mesmo?', adequada: true, pontos: 3, porque: 'Corrige com responsabilidade e investiga o objetivo real.', risco: '', melhora: '' },
          { texto: 'Fica sim, bem mais mole, você vai sentir na pele.', adequada: false, pontos: 0, porque: 'Promete água mole — regra travada quebrada.', risco: 'Falsa promessa; cliente frustrado depois.', melhora: 'Diga que Scale Stop não deixa a água mole; água mole é abrandador.' },
          { texto: 'Mais ou menos, fica um pouco mais mole.', adequada: false, pontos: 1, porque: 'Ambíguo e deixa o cliente entender que sim.', risco: 'Meia-verdade também vira problema no pós.', melhora: 'Seja categórico: não deixa a água mole.' },
        ],
      },
    ],
  },
  {
    id: 'rp-02-agua-mole',
    titulo: 'Cliente pergunta "deixa a água mole?"',
    obrigatorio: true,
    contexto: 'Lead pesquisou na internet e chega perguntando direto se o Scale Stop deixa a água mole. Momento de honestidade técnica.',
    passos: [
      {
        fala: 'Cliente: "Vi que vocês têm o Scale Stop. Ele deixa minha água mole, né?"',
        opcoes: [
          { texto: 'Ótima pergunta, e vou ser 100% honesto: não. Água mole é o abrandador. O Scale Stop faz outra coisa — reduz a incrustação e a mancha branca sem sal, mantendo os minerais na água.', adequada: true, pontos: 3, porque: 'Corrige de cara, com clareza, e já diferencia do abrandador.', risco: '', melhora: '' },
          { texto: 'Deixa sim, é pra isso mesmo.', adequada: false, pontos: 0, porque: 'Confirma uma falsidade.', risco: 'Promessa que não se cumpre; perde a venda no pós.', melhora: 'Corrija: Scale Stop não deixa a água mole.' },
          { texto: 'Deixa, e ainda é sem sal, melhor que o abrandador.', adequada: false, pontos: 0, porque: 'Junta duas mentiras: água mole + "melhor que abrandador".', risco: 'Descredibiliza você quando o cliente perceber.', melhora: 'Scale Stop reduz crosta sem sal; não substitui abrandamento real.' },
        ],
      },
      {
        fala: 'Cliente: "Ah, então pra que serve o Scale Stop?"',
        opcoes: [
          { texto: 'Ele ataca exatamente a crosta e a mancha branca: converte o cálcio em micro-cristais que não grudam nas superfícies. Você para de ver a incrustação no box, na torneira e no boiler — sem usar sal.', adequada: true, pontos: 3, porque: 'Explica a função real e conecta à dor visível.', risco: '', melhora: '' },
          { texto: 'Serve pra deixar a água mais pura e saudável de beber.', adequada: false, pontos: 0, porque: 'Desvia pro tema errado (saúde), não é o papel do Scale Stop.', risco: 'Confunde o cliente e não trata a dureza.', melhora: 'Foque em reduzir crosta/incrustação (conforto/operação).' },
          { texto: 'Serve pra remover metais pesados da água.', adequada: false, pontos: 0, porque: 'Informação incorreta sobre a função.', risco: 'Promessa técnica falsa.', melhora: 'Scale Stop é anti-incrustante; foco em dureza/crosta.' },
        ],
      },
      {
        fala: 'Cliente: "Mas eu queria mesmo a água mole. E agora?"',
        opcoes: [
          { texto: 'Aí o caminho certo pra você pode ser o abrandador, que remove a dureza de verdade. Me conta: você faz questão da água mole, ou o que te incomoda mesmo é a mancha/crosta? Isso define o produto certo.', adequada: true, pontos: 3, porque: 'Encaminha para a solução correta e investiga o objetivo real.', risco: '', melhora: '' },
          { texto: 'Então leva o Scale Stop mesmo, no fim dá quase no mesmo.', adequada: false, pontos: 0, porque: 'Empurra o produto errado com meia-verdade.', risco: 'Cliente compra frustrado; devolução/reclamação.', melhora: 'Se o objetivo é água mole, indique abrandador.' },
          { texto: 'Água mole faz mal, melhor ficar com o Scale Stop.', adequada: false, pontos: 0, porque: 'Argumento falso pra empurrar produto.', risco: 'Desinformação e perda de confiança.', melhora: 'Seja neutro: cada produto tem seu objetivo; pergunte o dele.' },
        ],
      },
    ],
  },
  {
    id: 'rp-03-abrandador-melhor',
    titulo: '"Abrandador é melhor?"',
    obrigatorio: true,
    contexto: 'Cliente ouviu de um conhecido que abrandador é a melhor solução e questiona por que consideraria o Scale Stop.',
    passos: [
      {
        fala: 'Cliente: "Um amigo meu falou que abrandador é melhor que esse Scale Stop. É verdade?"',
        opcoes: [
          { texto: 'Nenhum é "melhor" no geral — eles resolvem coisas diferentes. O abrandador remove a dureza e deixa a água mole, mas usa sal e precisa de dreno. O Scale Stop reduz a crosta sem sal e sem sódio. Depende do seu objetivo.', adequada: true, pontos: 3, porque: 'Neutraliza o "melhor/pior" e enquadra por objetivo.', risco: '', melhora: '' },
          { texto: 'Que nada, abrandador é ultrapassado, o Scale Stop é muito superior.', adequada: false, pontos: 0, porque: 'Desmerece o abrandador com argumento vazio.', risco: 'Soa vendedor e desonesto; cliente desconfia.', melhora: 'Explique que são objetivos diferentes, não melhor/pior.' },
          { texto: 'É verdade, o abrandador é melhor. Vou te vender um.', adequada: false, pontos: 1, porque: 'Cede sem investigar o objetivo do cliente.', risco: 'Pode indicar o produto errado pra dor dele.', melhora: 'Antes de indicar, pergunte o objetivo (água mole × crosta).' },
        ],
      },
      {
        fala: 'Cliente: "Mas qual a diferença prática pra mim?"',
        opcoes: [
          { texto: 'Se você precisa da água mole de verdade (ex.: certos aquecimentos/processos), é abrandador — com sal e dreno. Se o que te incomoda é a mancha/crosta e você prefere não lidar com sal, é o Scale Stop. Qual desses é o seu caso?', adequada: true, pontos: 3, porque: 'Traduz a diferença em decisão prática e pergunta o caso dele.', risco: '', melhora: '' },
          { texto: 'Na prática o Scale Stop faz tudo o que o abrandador faz e ainda sem sal.', adequada: false, pontos: 0, porque: 'Falso: Scale Stop não remove dureza nem deixa água mole.', risco: 'Promessa técnica incorreta.', melhora: 'Deixe claro que Scale Stop não substitui abrandamento real.' },
          { texto: 'A diferença é só o preço, o resto é igual.', adequada: false, pontos: 0, porque: 'Achata a diferença técnica real.', risco: 'Cliente decide errado por falta de informação.', melhora: 'Explique remover (abrandador) × reduzir crosta (Scale Stop).' },
        ],
      },
      {
        fala: 'Cliente: "Meu incômodo é a mancha branca mesmo, não ligo pra água mole."',
        opcoes: [
          { texto: 'Então o Scale Stop encaixa direitinho no seu caso: ele ataca a mancha/crosta sem sal e sem dreno, mantendo os minerais. Deixa eu levantar sua água e te trazer a solução dimensionada?', adequada: true, pontos: 3, porque: 'Confirma o encaixe correto e avança para o próximo passo.', risco: '', melhora: '' },
          { texto: 'Perfeito, mas mesmo assim recomendo o abrandador que é mais completo.', adequada: false, pontos: 0, porque: 'Ignora o objetivo declarado do cliente.', risco: 'Empurra produto desalinhado à dor.', melhora: 'Se a dor é crosta e ele não quer água mole, indique Scale Stop.' },
          { texto: 'Ok, mando o boleto do Scale Stop agora.', adequada: false, pontos: 1, porque: 'Pula o levantamento/dimensionamento do projeto.', risco: 'Fecha sem análise; risco de dimensionar errado.', melhora: 'Avance para análise/desenho antes de fechar.' },
        ],
      },
    ],
  },
  {
    id: 'rp-04-poco-serra',
    titulo: 'Água dura de poço na serra',
    obrigatorio: true,
    contexto: 'Cliente com casa de campo na serra, água de poço, reclama de crosta em vários pontos. ICP quente de Scale Stop.',
    passos: [
      {
        fala: 'Cliente: "Aqui na serra a água é de poço e cria uma crosta branca em tudo: torneira, chuveiro, até no boiler."',
        opcoes: [
          { texto: 'Isso é clássico de água dura de poço na serra: muito cálcio e magnésio, que formam crosta ao aquecer e secar. É exatamente o cenário que o Scale Stop trata. Me conta onde mais você percebe.', adequada: true, pontos: 3, porque: 'Reconhece o ICP, nomeia a causa e continua investigando.', risco: '', melhora: '' },
          { texto: 'Água de poço é sempre contaminada, você precisa de osmose reversa.', adequada: false, pontos: 0, porque: 'Alarmista e desviado da dor (crosta = dureza).', risco: 'Assusta e vende solução errada.', melhora: 'Ligue a crosta à dureza e apresente o Scale Stop.' },
          { texto: 'Com nosso produto sua água de poço vai ficar mole e sem crosta.', adequada: false, pontos: 0, porque: 'Promete água mole.', risco: 'Regra travada quebrada.', melhora: 'Scale Stop reduz a crosta sem deixar a água mole.' },
        ],
      },
      {
        fala: 'Cliente: "Tem também um barro fininho que às vezes vem junto."',
        opcoes: [
          { texto: 'Então provavelmente é caso de projeto: o Scale Stop cuida da crosta/mancha e uma etapa de filtragem (tipo a Fibra) cuida desse barro/partículas. As duas partes se completam. Vamos dimensionar com uma análise?', adequada: true, pontos: 3, porque: 'Identifica a necessidade de combo e propõe o próximo passo (análise).', risco: '', melhora: '' },
          { texto: 'O Scale Stop sozinho resolve o barro também, pode deixar.', adequada: false, pontos: 0, porque: 'Falso: Scale Stop é anti-incrustante, não filtra barro.', risco: 'Promessa técnica incorreta; cliente insatisfeito.', melhora: 'Barro/partículas pedem etapa de filtragem no combo.' },
          { texto: 'Barro é normal em poço, ignora isso.', adequada: false, pontos: 0, porque: 'Minimiza uma dor real do cliente.', risco: 'Perde a chance de montar o combo certo.', melhora: 'Trate o barro com a etapa de filtragem adequada.' },
        ],
      },
      {
        fala: 'Cliente: "E vai aguentar a vazão da minha casa? Quantos litros por hora?"',
        opcoes: [
          { texto: 'Boa pergunta — vazão e dimensionamento eu não chuto: nossa análise levanta isso e o especialista dimensiona o sistema certo pra sua casa. Posso agendar essa etapa pra te trazer os números corretos?', adequada: true, pontos: 3, porque: 'Não inventa spec e encaminha para o especialista/análise.', risco: '', melhora: '' },
          { texto: 'Aguenta tranquilo, esses aparelhos têm vazão altíssima.', adequada: false, pontos: 0, porque: 'Inventa spec sem base.', risco: 'Dimensionamento errado; dor no pós.', melhora: 'Vazão/capacidade vêm da análise e ficha oficial.' },
          { texto: 'Faz uns 5.000 litros por hora, com certeza dá.', adequada: false, pontos: 0, porque: 'Número inventado.', risco: 'Compromisso técnico falso.', melhora: 'Nunca cite spec de cabeça; leve ao especialista.' },
        ],
      },
    ],
  },
  {
    id: 'rp-05-combo-fibra',
    titulo: 'Combo com Fibra',
    obrigatorio: true,
    contexto: 'Cliente de poço tem dureza (mancha) e água não tratada com partículas. Caso típico de combo Scale Stop + Fibra.',
    passos: [
      {
        fala: 'Cliente: "Tenho mancha branca e também a água vem meio turva do poço. Um produto só resolve os dois?"',
        opcoes: [
          { texto: 'São duas coisas diferentes, então o ideal é um projeto com duas frentes: a Fibra cuida da água turva/partículas e o Scale Stop cuida da crosta e da mancha. Juntos, resolvem o quadro completo.', adequada: true, pontos: 3, porque: 'Separa as dores e propõe o combo correto (Fibra + Scale Stop).', risco: '', melhora: '' },
          { texto: 'Sim, o Scale Stop sozinho resolve a turbidez e a mancha.', adequada: false, pontos: 0, porque: 'Scale Stop não filtra partículas/turbidez.', risco: 'Promessa técnica errada.', melhora: 'Turbidez/partículas = Fibra; crosta = Scale Stop.' },
          { texto: 'Resolve com um abrandador, que faz tudo.', adequada: false, pontos: 0, porque: 'Abrandador não filtra turbidez e não é o pedido.', risco: 'Produto errado pra dor.', melhora: 'Monte o combo pela dor: Fibra + Scale Stop.' },
        ],
      },
      {
        fala: 'Cliente: "E por que não só a Fibra, já que ela filtra?"',
        opcoes: [
          { texto: 'A Fibra cuida das partículas, mas ela não trata a dureza — a mancha branca continuaria. É por isso que entra o Scale Stop junto: ele é a parte anti-crosta do sistema. Cada um faz o seu.', adequada: true, pontos: 3, porque: 'Explica o limite da Fibra e o papel do Scale Stop sem exagero.', risco: '', melhora: '' },
          { texto: 'A Fibra também abranda a água, mas o Scale Stop é um upgrade.', adequada: false, pontos: 0, porque: 'Atribui à Fibra função que não é dela.', risco: 'Informação técnica incorreta.', melhora: 'Fibra = partículas; dureza/crosta = Scale Stop.' },
          { texto: 'Pode ser só a Fibra sim, se quiser economizar.', adequada: false, pontos: 1, porque: 'Abre mão de resolver a dureza que o cliente citou.', risco: 'Cliente segue com a mancha e frustra.', melhora: 'Explique que a mancha (dureza) exige o Scale Stop.' },
        ],
      },
      {
        fala: 'Cliente: "Entendi. E como fica o valor de tudo isso?"',
        opcoes: [
          { texto: 'É um projeto, então o valor é do sistema completo — que protege sua casa e resolve as duas dores de vez. Deixa eu levantar sua água, dimensionar e te trazer a proposta fechada. Podemos agendar?', adequada: true, pontos: 3, porque: 'Ancora no valor do sistema e avança para análise/proposta.', risco: '', melhora: '' },
          { texto: 'A Fibra é X e o Scale Stop é Y, somando dá Z. Fecha?', adequada: false, pontos: 1, porque: 'Empurra preço de peças sem dimensionar nem ancorar valor.', risco: 'Cliente compara item por item; perde o valor do projeto.', melhora: 'Venda o valor do sistema; dimensione antes de precificar.' },
          { texto: 'Te passo um valor aproximado agora de cabeça.', adequada: false, pontos: 0, porque: 'Precifica sem dimensionamento.', risco: 'Valor errado; retrabalho e desconfiança.', melhora: 'Só precifique após análise/dimensionamento oficial.' },
        ],
      },
    ],
  },
  {
    id: 'rp-06-so-scale-stop-barato',
    titulo: 'Cliente quer só Scale Stop barato',
    obrigatorio: true,
    contexto: 'Cliente resiste ao projeto e quer apenas "o Scale Stop mais baratinho" para tirar a mancha, mesmo com sinais de que precisa de mais.',
    passos: [
      {
        fala: 'Cliente: "Não quero projetão não. Me vê só o Scale Stop mais barato pra tirar essa mancha."',
        opcoes: [
          { texto: 'Perfeito, seu foco é acabar com a mancha — é isso que vamos resolver. Só deixa eu entender sua água pra te dar a solução no tamanho certo: de onde ela vem e onde mais você vê crosta?', adequada: true, pontos: 3, porque: 'Respeita o desejo e qualifica antes de dimensionar.', risco: '', melhora: '' },
          { texto: 'Fechado, mando o Scale Stop mais barato que temos.', adequada: false, pontos: 0, porque: 'Fecha sem qualificar nem dimensionar.', risco: 'Pode entregar solução subdimensionada que não resolve.', melhora: 'Levante a água antes de escolher a configuração.' },
          { texto: 'Barato não vai resolver, você precisa do projeto completo ou nada.', adequada: false, pontos: 0, porque: 'Impõe o combo sem investigar, atropela o cliente.', risco: 'Cliente se fecha e vai embora.', melhora: 'Qualifique e mostre o porquê, sem ultimato.' },
        ],
      },
      {
        fala: 'Cliente: "É água de poço, e a mancha aparece no box e também na torneira da cozinha e no chuveiro."',
        opcoes: [
          { texto: 'Como a crosta aparece em vários pontos e é água de poço, o Scale Stop bem dimensionado é o caminho — e, dependendo da sua água, pode pedir uma etapa a mais pra durar e funcionar direito. Não é encarecer por encarecer, é a sua água que define.', adequada: true, pontos: 3, porque: 'Justifica o dimensionamento pela realidade da água, sem empurrar.', risco: '', melhora: '' },
          { texto: 'Então um Scale Stop pequeninho de ponto de uso resolve o box.', adequada: false, pontos: 0, porque: 'Subdimensiona ignorando que a dor é na casa toda.', risco: 'Solução que não entrega; cliente insatisfeito.', melhora: 'Dimensione para o uso real (vários pontos, poço).' },
          { texto: 'Aí só o projeto completo caríssimo resolve mesmo.', adequada: false, pontos: 0, porque: 'Exagera pra cima sem base técnica.', risco: 'Espanta o cliente e soa oportunista.', melhora: 'Deixe a análise definir o tamanho certo, nem a mais nem a menos.' },
        ],
      },
      {
        fala: 'Cliente: "Tá, mas eu não quero gastar muito. Dá pra fazer o essencial?"',
        opcoes: [
          { texto: 'Dá sim — a ideia é resolver sua dor no tamanho certo, sem exagero. Deixa eu levantar sua água e te trazer a opção que resolve a mancha e cabe no seu bolso, com o valor do que realmente precisa. Combinamos a análise?', adequada: true, pontos: 3, porque: 'Acolhe o orçamento e encaminha para dimensionamento honesto.', risco: '', melhora: '' },
          { texto: 'Essencial é o abrandador, deixa a água mole e some tudo.', adequada: false, pontos: 0, porque: 'Muda pro produto errado e promete água mole.', risco: 'Regra travada quebrada.', melhora: 'Mantenha o foco na dor (crosta) com Scale Stop dimensionado.' },
          { texto: 'Se quer barato, compra qualquer filtro de mercado, tanto faz.', adequada: false, pontos: 0, porque: 'Desqualifica a própria solução e abandona o cliente.', risco: 'Perde a venda e não resolve a dor.', melhora: 'Ofereça a solução certa dentro do orçamento, com análise.' },
        ],
      },
    ],
  },
  {
    id: 'rp-07-verba-alta-projeto',
    titulo: 'Verba alta / projeto',
    obrigatorio: true,
    contexto: 'Cliente de alto padrão, casa grande na serra, com verba, quer resolver a dureza de vez e valoriza uma solução completa. Maior ticket.',
    passos: [
      {
        fala: 'Cliente: "Tenho uma casa grande na serra, água de poço dura, e quero resolver isso de forma definitiva. Não é questão de preço, é de resolver bem."',
        opcoes: [
          { texto: 'Então vamos pensar como projeto: um sistema dimensionado pra sua casa que protege boiler, metais, box e louça e ataca a mancha/crosta de vez. O Scale Stop é o coração anti-incrustação, e a gente completa conforme a sua água pedir.', adequada: true, pontos: 3, porque: 'Sobe o nível para projeto/valor, alinhado ao perfil com verba.', risco: '', melhora: '' },
          { texto: 'Ótimo, então vou te vender o Scale Stop mais caro do catálogo.', adequada: false, pontos: 0, porque: 'Vende preço, não valor nem solução dimensionada.', risco: 'Soa oportunista; pode dimensionar errado.', melhora: 'Fale em projeto dimensionado pela água, não no "mais caro".' },
          { texto: 'Pra resolver de vez só osmose reversa na casa inteira.', adequada: false, pontos: 0, porque: 'Desvia da dureza para solução não pedida.', risco: 'Escopo errado; encarece sem alvo.', melhora: 'Trate a dureza com Scale Stop; complemente conforme a análise.' },
        ],
      },
      {
        fala: 'Cliente: "Quero que fique impecável. Vale a pena um abrandador junto pra água ficar mole também?"',
        opcoes: [
          { texto: 'Pode fazer sentido, sim: se você quer também a sensação de água mole, o abrandador entra pra isso — enquanto o Scale Stop protege contra a crosta. São funções distintas e podem conviver no projeto. Você faz questão da água mole ou o foco é a crosta?', adequada: true, pontos: 3, porque: 'Diferencia corretamente e mantém honestidade; investiga o objetivo.', risco: '', melhora: '' },
          { texto: 'Não precisa, o Scale Stop já deixa a água mole também.', adequada: false, pontos: 0, porque: 'Promete água mole no Scale Stop.', risco: 'Regra travada quebrada.', melhora: 'Água mole é abrandador; Scale Stop reduz crosta sem sal.' },
          { texto: 'Abrandador é desnecessário, esquece isso.', adequada: false, pontos: 1, porque: 'Descarta sem entender o objetivo do cliente.', risco: 'Pode negar exatamente o que ele quer (água mole).', melhora: 'Pergunte se ele faz questão da água mole antes de decidir.' },
        ],
      },
      {
        fala: 'Cliente: "Perfeito. Como seguimos?"',
        opcoes: [
          { texto: 'Vou agendar a análise da sua água e uma visita pra dimensionar o sistema. Com isso, te entrego o projeto completo por escrito, com tudo especificado, e a gente marca um retorno pra você decidir com tudo na mão. Que dia funciona?', adequada: true, pontos: 3, porque: 'Próximo passo concreto com data, coerente com venda de projeto.', risco: '', melhora: '' },
          { texto: 'Te mando o contrato agora por e-mail pra assinar.', adequada: false, pontos: 0, porque: 'Pula análise/dimensionamento do projeto.', risco: 'Fecha sem base técnica; risco alto num ticket alto.', melhora: 'Análise e projeto por escrito antes de contrato.' },
          { texto: 'Depois eu te chamo quando tiver os detalhes.', adequada: false, pontos: 0, porque: 'Próximo passo vago, sem data.', risco: 'Lead esfria no ciclo de ~12 dias.', melhora: 'Agende a análise/retorno com dia e hora.' },
        ],
      },
    ],
  },
  {
    id: 'rp-08-comparando-concorrente',
    titulo: 'Comparando concorrente',
    obrigatorio: true,
    contexto: 'Cliente recebeu proposta de um concorrente que promete "acabar com a dureza" e questiona a TDF sobre isso.',
    passos: [
      {
        fala: 'Cliente: "Um concorrente me disse que o equipamento dele acaba com a dureza e deixa a água mole. Vocês fazem isso com o Scale Stop?"',
        opcoes: [
          { texto: 'Vou ser transparente: o Scale Stop não remove a dureza nem deixa a água mole — ele reduz a crosta e a mancha sem sal. Se o equipamento do concorrente realmente deixa a água mole, provavelmente é um abrandador com sal. São tecnologias diferentes; vale entender o que você realmente quer.', adequada: true, pontos: 3, porque: 'Honestidade técnica e educa o cliente sem atacar o concorrente.', risco: '', melhora: '' },
          { texto: 'Fazemos sim, o Scale Stop acaba com a dureza igual ao dele.', adequada: false, pontos: 0, porque: 'Promete remover dureza pra empatar com o concorrente.', risco: 'Falsa promessa; regra travada quebrada.', melhora: 'Diga a verdade: Scale Stop reduz crosta, não remove dureza.' },
          { texto: 'Esse concorrente está mentindo, isso é impossível.', adequada: false, pontos: 0, porque: 'Ataca sem base; abrandador realmente deixa a água mole.', risco: 'Você fica errado se for um abrandador; perde credibilidade.', melhora: 'Explique as tecnologias em vez de acusar.' },
        ],
      },
      {
        fala: 'Cliente: "Então o dele é melhor, porque tira a dureza e o de vocês não?"',
        opcoes: [
          { texto: 'Não é melhor nem pior — é diferente. O abrandador remove a dureza usando sal, adiciona sódio e precisa de dreno. O Scale Stop reduz a crosta sem sal, sem sódio e sem dreno, mantendo os minerais. Depende do que importa mais pra você: água mole ou parar a crosta sem sal?', adequada: true, pontos: 3, porque: 'Reenquadra por objetivo e expõe os trade-offs reais.', risco: '', melhora: '' },
          { texto: 'É, o dele é melhor mesmo, mas o nosso é mais barato.', adequada: false, pontos: 0, porque: 'Cede a comparação e compete só por preço.', risco: 'Desvaloriza a solução e não esclarece o objetivo.', melhora: 'Enquadre por objetivo, não por "melhor/pior".' },
          { texto: 'O nosso é melhor em tudo, pode confiar.', adequada: false, pontos: 0, porque: 'Afirmação vazia e não verdadeira em todos os aspectos.', risco: 'Soa vendedor; cliente desconfia.', melhora: 'Mostre trade-offs concretos e pergunte a prioridade dele.' },
        ],
      },
      {
        fala: 'Cliente: "Na real, eu só quero acabar com a mancha branca, sal me incomoda um pouco."',
        opcoes: [
          { texto: 'Então o Scale Stop conversa perfeitamente com o que você quer: acaba com a mancha/crosta sem usar sal e sem dreno. Deixa eu levantar sua água e te trazer a proposta dimensionada pra comparar de igual pra igual com a outra. Podemos agendar?', adequada: true, pontos: 3, porque: 'Alinha à prioridade declarada e avança para proposta/análise.', risco: '', melhora: '' },
          { texto: 'Ótimo, mas mesmo assim o abrandador com sal seria melhor pra você.', adequada: false, pontos: 0, porque: 'Contradiz a preferência do cliente (que não quer sal).', risco: 'Empurra o oposto do que ele pediu.', melhora: 'Se ele não quer sal e quer parar a mancha, é Scale Stop.' },
          { texto: 'Então fecha logo antes que o concorrente te convença.', adequada: false, pontos: 1, porque: 'Pressão e pula o dimensionamento.', risco: 'Fecha sem análise; mina a confiança.', melhora: 'Avance com análise e proposta comparável, sem pressão.' },
        ],
      },
    ],
  },
];

module.exports = { ROLEPLAYS };
