// ============================================================================
// BANCO DE QUESTÕES — Academia: Especialista em Tratamento de Água de Poço
// ----------------------------------------------------------------------------
// REGRA CRÍTICA (briefing TDF): a prova avalia RACIOCÍNIO e CONDUTA RESPONSÁVEL,
// não decoreba. NENHUMA resposta correta depende de VMP/dosagem/vazão inventados.
// As respostas certas privilegiam: pedir a análise, confirmar parâmetro + unidade,
// não prometer potabilidade, encaminhar ao especialista, checar vazão de
// retrolavagem, refazer análise após tratamento, "transparente não é potável",
// "uma tecnologia não resolve tudo", "o tanque sozinho não define o sistema".
//
// Limites regulatórios (Portaria GM/MS nº 888/2021) vivem em parametros-agua.js
// como "pendentes de validação" — nunca citados de memória aqui.
//
// FORMATO: { id, tema, tipo:"multipla"|"vf"|"cenario", enunciado, opcoes[], correta, explicacao }
//   correta = índice 0-based da opção certa.
//   O sistema embaralha questões E opções e corrige pelo TEXTO — cada opção tem texto único.
// ============================================================================

module.exports = { QUESTOES: [

  // ===================== FUNDAMENTOS =====================
  { id:"q1", tema:"Fundamentos", tipo:"multipla",
    enunciado:"O cliente manda uma foto e diz que a água do poço é cristalina. Qual a conduta correta?",
    opcoes:[
      "Confirmar que, se está transparente, já está potável",
      "Explicar que transparência é parâmetro físico e não garante potabilidade, e solicitar a análise laboratorial",
      "Indicar o maior tanque disponível para garantir segurança",
      "Prometer que um filtro de sedimentos resolve qualquer poço"
    ], correta:1,
    explicacao:"Transparência não indica ausência de nitrato, metais ou contaminação microbiológica. Só a análise responde." },

  { id:"q2", tema:"Fundamentos", tipo:"vf",
    enunciado:"Água de poço límpida pode conter contaminantes sem cor, cheiro ou gosto.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Nitrato, alguns metais e contaminação microbiológica não são percebidos pelos sentidos; o olho não enxerga potabilidade." },

  { id:"q3", tema:"Fundamentos", tipo:"multipla",
    enunciado:"Por que a TDF trata o processo como diagnóstico e não como venda de tanque?",
    opcoes:[
      "Porque tanque grande é sempre mais lucrativo",
      "Porque filtrar partícula, tratar dureza, desinfetar e remover nitrato são problemas distintos que pedem tecnologias compatíveis",
      "Porque o cliente gosta de comprar vários equipamentos",
      "Porque a análise é opcional quando a água está limpa"
    ], correta:1,
    explicacao:"Uma tecnologia não resolve tudo: cada parâmetro fora do padrão exige a etapa de tratamento adequada." },

  { id:"q4", tema:"Fundamentos", tipo:"multipla",
    enunciado:"De onde devem vir os valores de referência (VMP) usados no atendimento?",
    opcoes:[
      "Da memória do vendedor, para agilizar",
      "De um blog técnico bem avaliado",
      "Do arquivo de configuração associado à fonte oficial (Portaria GM/MS nº 888/2021), validado pela TDF",
      "Da média dos concorrentes da região"
    ], correta:2,
    explicacao:"Limites nascem de fonte oficial e ficam pendentes até validação técnica da TDF; nunca de memória ou blog." },

  { id:"q5", tema:"Fundamentos", tipo:"multipla",
    enunciado:"O tipo de captação (artesiano, semiartesiano, cisterna, nascente) serve para:",
    opcoes:[
      "Definir sozinho a solução final",
      "Dispensar a análise quando o poço é profundo",
      "Levantar hipóteses de risco, sem substituir a análise laboratorial",
      "Garantir potabilidade em poços artesianos"
    ], correta:2,
    explicacao:"Profundidade e origem ajudam a levantar hipóteses, mas não substituem o laudo." },

  { id:"q6", tema:"Fundamentos", tipo:"vf",
    enunciado:"Um poço artesiano profundo dispensa a análise porque a água vem de aquífero confinado.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Nenhuma origem dispensa a análise; a profundidade só ajuda a levantar hipóteses de risco." },

  { id:"q7", tema:"Fundamentos", tipo:"cenario",
    enunciado:"Cliente novo: 'quero um filtro para meu poço, o mais completo'. Melhor primeiro passo?",
    opcoes:[
      "Fechar o kit mais caro por segurança",
      "Perguntar origem da água e objetivo, e conduzir para a análise antes de propor",
      "Enviar tabela de preços de tanques",
      "Garantir que ficará potável após a instalação"
    ], correta:1,
    explicacao:"O processo é origem + objetivo + análise; o equipamento vem depois do diagnóstico." },

  { id:"q8", tema:"Fundamentos", tipo:"vf",
    enunciado:"Apresentar um único tanque como solução universal é uma prática aceitável para simplificar.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"O tanque isolado nunca é solução universal; a solução vem do diagnóstico." },

  // ===================== ANÁLISE =====================
  { id:"q9", tema:"Análise", tipo:"multipla",
    enunciado:"Um laudo traz 'ferro: 2'. Antes de interpretar, o que é indispensável confirmar?",
    opcoes:[
      "Apenas o nome do laboratório",
      "O parâmetro e a unidade de medida em que o resultado foi expresso",
      "A cor da água na foto",
      "O preço do tratamento"
    ], correta:1,
    explicacao:"Um número sem unidade não significa nada; confirmar parâmetro E unidade é pré-requisito." },

  { id:"q10", tema:"Análise", tipo:"multipla",
    enunciado:"O laudo enviado tem 8 meses e é de outra captação. Conduta?",
    opcoes:[
      "Usar assim mesmo, laudo é laudo",
      "Solicitar análise recente e da captação correta antes de propor",
      "Estimar os valores atuais pela média histórica",
      "Propor com base na foto da água"
    ], correta:1,
    explicacao:"Sem laudo recente e legível da fonte certa, você ainda não sabe o que a água tem." },

  { id:"q11", tema:"Análise", tipo:"vf",
    enunciado:"Comparar um resultado de laudo com o limite oficial exige que ambos estejam na mesma unidade.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Sem alinhar unidades, a comparação com o VMP é inválida." },

  { id:"q12", tema:"Análise", tipo:"multipla",
    enunciado:"O grupo de parâmetros que o olho humano NUNCA consegue avaliar é o:",
    opcoes:["Físico","Microbiológico","Aspecto visual","Turbidez aparente"], correta:1,
    explicacao:"Coliformes e E. coli não têm manifestação visual; exigem análise microbiológica." },

  { id:"q13", tema:"Análise", tipo:"multipla",
    enunciado:"O laudo aponta um parâmetro cujo VMP ainda está marcado como pendente de validação. O que fazer?",
    opcoes:[
      "Inventar um limite plausível para não travar a venda",
      "Tratar como pendente, não afirmar conformidade e encaminhar ao especialista",
      "Copiar o limite de outro parâmetro parecido",
      "Ignorar o parâmetro"
    ], correta:1,
    explicacao:"Enquanto o VMP está pendente, não se afirma conformidade; escala-se ao especialista." },

  { id:"q14", tema:"Análise", tipo:"vf",
    enunciado:"Se o laudo não informa a unidade de um parâmetro, o vendedor pode assumir a unidade mais comum.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Assumir unidade é adivinhar; deve-se confirmar com o laboratório ou pedir novo laudo." },

  { id:"q15", tema:"Análise", tipo:"cenario",
    enunciado:"O cliente lê o próprio laudo e diz que 'está tudo dentro'. Você percebe um parâmetro sem valor de referência claro. Conduta?",
    opcoes:[
      "Concordar para não gerar atrito",
      "Confirmar parâmetro, unidade e a referência oficial vigente antes de afirmar conformidade",
      "Dizer que o laudo está errado",
      "Fechar a proposta imediatamente"
    ], correta:1,
    explicacao:"Conformidade só se afirma com parâmetro, unidade e referência oficial confirmados." },

  // ===================== ANÁLISE OBRIGATÓRIA =====================
  { id:"q16", tema:"Análise obrigatória", tipo:"vf",
    enunciado:"Água para consumo humano de poço pode ser tratada comercialmente sem análise, desde que o cliente assuma o risco.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"A análise é obrigatória antes da venda; não se transfere ao cliente a responsabilidade de dispensá-la." },

  { id:"q17", tema:"Análise obrigatória", tipo:"multipla",
    enunciado:"Situação que SEMPRE exige encaminhamento ao especialista antes de qualquer proposta:",
    opcoes:[
      "Cliente com pressa",
      "Ausência de análise laboratorial",
      "Cliente que já tem caixa d'água",
      "Poço com bomba nova"
    ], correta:1,
    explicacao:"Sem análise, não há diagnóstico; encaminha-se ao especialista." },

  { id:"q18", tema:"Análise obrigatória", tipo:"multipla",
    enunciado:"O cliente diz que já fez a análise há 3 anos e nada mudou. Melhor conduta?",
    opcoes:[
      "Aceitar o laudo antigo como válido",
      "Explicar que a qualidade do poço varia no tempo e solicitar análise atualizada",
      "Propor o mesmo sistema de outro cliente parecido",
      "Garantir que continua igual"
    ], correta:1,
    explicacao:"Qualidade de água subterrânea muda com estação, uso e entorno; análise deve ser recente." },

  { id:"q19", tema:"Análise obrigatória", tipo:"vf",
    enunciado:"Após instalar o tratamento, uma nova análise deve ser feita para verificar o resultado.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Refazer análise após o tratamento comprova a eficácia; não se presume o resultado." },

  { id:"q20", tema:"Análise obrigatória", tipo:"cenario",
    enunciado:"Cliente pressiona: 'não quero gastar com análise, só me venda o filtro'. Resposta responsável?",
    opcoes:[
      "Vender o filtro sem análise para não perder a venda",
      "Explicar que sem análise não é possível garantir a solução correta, e posicionar a análise como parte do diagnóstico",
      "Oferecer desconto no maior tanque",
      "Afirmar que qualquer filtro serve"
    ], correta:1,
    explicacao:"A análise é etapa do diagnóstico, não custo dispensável; sem ela não há proposta responsável." },

  { id:"q21", tema:"Análise obrigatória", tipo:"multipla",
    enunciado:"Um pedido de 'garantia de que a água ficará potável' deve ser tratado como:",
    opcoes:[
      "Promessa que o vendedor pode assumir",
      "Sinal de que o caso precisa ir ao especialista, sem prometer potabilidade no atendimento comercial",
      "Motivo para fechar mais rápido",
      "Algo que qualquer filtro entrega"
    ], correta:1,
    explicacao:"Garantia de potabilidade é gatilho de escalonamento; não se promete no atendimento comercial." },

  // ===================== HIDRÁULICA =====================
  { id:"q22", tema:"Hidráulica", tipo:"multipla",
    enunciado:"Na sondagem hidráulica, por que a vazão do poço não basta para dimensionar o sistema?",
    opcoes:[
      "Porque a vazão do poço é sempre baixa",
      "Porque vazão do poço, vazão da bomba e vazão necessária são coisas diferentes e precisam ser confrontadas",
      "Porque a vazão não influencia no tratamento",
      "Porque só o volume da caixa importa"
    ], correta:1,
    explicacao:"São grandezas distintas; dimensionar exige confrontar as três." },

  { id:"q23", tema:"Hidráulica", tipo:"vf",
    enunciado:"A vazão necessária para a retrolavagem pode ser maior que a vazão de consumo do cliente.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Retrolavagem costuma exigir vazão maior; por isso é preciso verificar a vazão disponível." },

  { id:"q24", tema:"Hidráulica", tipo:"multipla",
    enunciado:"Antes de fechar um sistema com retrolavagem automática, o que é essencial verificar?",
    opcoes:[
      "Apenas a cor da água",
      "Se a vazão disponível atende à vazão de retrolavagem exigida pela mídia e pelo tanque",
      "Somente a marca da bomba",
      "O tamanho da casa"
    ], correta:1,
    explicacao:"Sem vazão de retrolavagem adequada, a mídia não limpa e o sistema falha." },

  { id:"q25", tema:"Hidráulica", tipo:"vf",
    enunciado:"Alimentação por gravidade e alimentação por bomba pressurizada podem exigir soluções hidráulicas diferentes.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"O regime de alimentação muda pressão e vazão disponíveis, afetando o dimensionamento." },

  { id:"q26", tema:"Hidráulica", tipo:"cenario",
    enunciado:"O cliente tem ótima vazão de poço, mas a bomba instalada é fraca. Como isso impacta a proposta?",
    opcoes:[
      "Não impacta, o poço compensa",
      "A vazão efetiva pode ficar limitada pela bomba; é preciso confirmar a vazão real disponível antes de dimensionar",
      "Basta pegar o maior tanque",
      "A bomba não tem relação com o filtro"
    ], correta:1,
    explicacao:"A vazão que chega ao sistema é limitada pelo elo mais fraco; confirmar a vazão real é obrigatório." },

  { id:"q27", tema:"Hidráulica", tipo:"multipla",
    enunciado:"Vazão elevada ou sistema coletivo (condomínio) devem ser tratados como:",
    opcoes:[
      "Caso simples, igual a residência",
      "Caso que exige envolvimento do especialista no dimensionamento",
      "Motivo para dobrar o preço sem análise",
      "Dispensa de análise"
    ], correta:1,
    explicacao:"Vazão elevada e sistemas coletivos são gatilhos de escalonamento ao especialista." },

  // ===================== TANQUES FRP =====================
  { id:"q28", tema:"Tanques FRP", tipo:"multipla",
    enunciado:"A capacidade do tanque FRP, isoladamente, define o desempenho do tratamento?",
    opcoes:[
      "Sim, tanque maior sempre trata melhor",
      "Não; capacidade do tanque sozinha não define o sistema, que depende de mídia, hidráulica e análise",
      "Sim, desde que seja de fibra de vidro",
      "Não, pois o tanque não tem função"
    ], correta:1,
    explicacao:"O tanque é o invólucro; o que trata é a combinação mídia + hidráulica + diagnóstico." },

  { id:"q29", tema:"Tanques FRP", tipo:"vf",
    enunciado:"Escolher um tanque maior compensa a falta de análise da água.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Tamanho não substitui diagnóstico; sem análise não se sabe qual mídia usar." },

  { id:"q30", tema:"Tanques FRP", tipo:"multipla",
    enunciado:"O que o tanque FRP precisa suportar para operar com segurança?",
    opcoes:[
      "Apenas o peso da mídia",
      "A pressão de trabalho e o regime de retrolavagem do sistema",
      "Somente a estética do ambiente",
      "A cor da água"
    ], correta:1,
    explicacao:"O tanque deve ser compatível com pressão de trabalho e ciclo de retrolavagem." },

  { id:"q31", tema:"Tanques FRP", tipo:"vf",
    enunciado:"O mesmo tanque FRP pode receber mídias diferentes conforme o problema diagnosticado na água.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"O tanque é o invólucro; a mídia é escolhida a partir do diagnóstico." },

  { id:"q32", tema:"Tanques FRP", tipo:"cenario",
    enunciado:"Cliente quer comprar só o tanque FRP e escolher a mídia depois, por conta própria. Conduta?",
    opcoes:[
      "Vender o tanque isolado e liberar o cliente",
      "Explicar que mídia e dimensionamento saem do diagnóstico, e não vender o tanque como solução avulsa",
      "Sugerir a mídia mais barata",
      "Garantir que qualquer mídia serve naquele tanque"
    ], correta:1,
    explicacao:"O tanque não é solução avulsa; a mídia correta depende da análise e da hidráulica." },

  // ===================== VÁLVULAS RUNXIN =====================
  { id:"q33", tema:"Válvulas Runxin", tipo:"multipla",
    enunciado:"A válvula Runxin automatiza os ciclos do sistema. O que ela NÃO faz sozinha?",
    opcoes:[
      "Comandar a retrolavagem programada",
      "Escolher a mídia certa e dispensar o diagnóstico da água",
      "Controlar etapas do ciclo",
      "Operar por tempo ou volume conforme configuração"
    ], correta:1,
    explicacao:"A válvula controla ciclos, mas não substitui a análise nem a escolha correta da mídia." },

  { id:"q34", tema:"Válvulas Runxin", tipo:"vf",
    enunciado:"Uma válvula automática só funciona bem se houver vazão suficiente para executar a retrolavagem.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Sem vazão de retrolavagem adequada, o ciclo automático não limpa a mídia corretamente." },

  { id:"q35", tema:"Válvulas Runxin", tipo:"multipla",
    enunciado:"A programação da válvula (por tempo ou por volume) deve ser definida com base em:",
    opcoes:[
      "Preferência estética do cliente",
      "Diagnóstico da água, mídia e uso real, respeitando a hidráulica",
      "Um padrão fixo igual para todos",
      "A cor do tanque"
    ], correta:1,
    explicacao:"A configuração depende do que se trata, da mídia e do consumo; não é padrão universal." },

  { id:"q36", tema:"Válvulas Runxin", tipo:"vf",
    enunciado:"Instalar uma válvula automática garante, por si só, que a água ficará potável.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"A válvula automatiza ciclos; potabilidade depende de tratamento adequado e comprovação por análise." },

  { id:"q37", tema:"Válvulas Runxin", tipo:"cenario",
    enunciado:"Cliente quer a válvula 'mais automática possível' mas o poço tem vazão baixa. Como orientar?",
    opcoes:[
      "Vender a mais cara, automação resolve tudo",
      "Verificar se a vazão atende ao ciclo de retrolavagem antes de indicar automação, envolvendo o especialista se preciso",
      "Ignorar a vazão, a válvula compensa",
      "Prometer que funcionará em qualquer poço"
    ], correta:1,
    explicacao:"Automação depende de vazão de retrolavagem; sem ela a válvula não opera bem." },

  // ===================== FERRO E MANGANÊS =====================
  { id:"q38", tema:"Ferro e manganês", tipo:"multipla",
    enunciado:"O cliente reclama de manchas amareladas/marrom. Antes de afirmar que é ferro, o correto é:",
    opcoes:[
      "Garantir que é ferro e vender o tratamento",
      "Solicitar a análise para confirmar o parâmetro e sua forma antes de propor",
      "Dizer que é manganês, sempre",
      "Recomendar o maior tanque"
    ], correta:1,
    explicacao:"Sintomas orientam hipóteses; a confirmação vem da análise, não do palpite." },

  { id:"q39", tema:"Ferro e manganês", tipo:"vf",
    enunciado:"Ferro e manganês podem exigir abordagens de tratamento diferentes conforme a análise.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"São contaminantes distintos; o tratamento adequado depende do que o laudo mostrar." },

  { id:"q40", tema:"Ferro e manganês", tipo:"multipla",
    enunciado:"Um filtro de sedimentos comum garante a remoção de ferro dissolvido?",
    opcoes:[
      "Sim, sempre",
      "Não necessariamente; ferro dissolvido não é simples partícula e exige tecnologia compatível confirmada por análise",
      "Sim, se o tanque for grande",
      "Só se a água estiver colorida"
    ], correta:1,
    explicacao:"Filtrar partícula é diferente de tratar contaminante dissolvido." },

  { id:"q41", tema:"Ferro e manganês", tipo:"vf",
    enunciado:"O vendedor pode informar de memória o limite de ferro para consumo humano durante a ligação.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Limites vêm da fonte oficial validada, não da memória." },

  { id:"q42", tema:"Ferro e manganês", tipo:"cenario",
    enunciado:"A água sai limpa da torneira mas escurece após alguns minutos no balde. O que isso sugere e como agir?",
    opcoes:[
      "Que a água está potável, pode vender qualquer filtro",
      "Que pode haver ferro/manganês que oxidam com o ar; confirmar com análise antes de definir a tecnologia",
      "Que é sujeira do balde, ignore",
      "Que basta trocar a bomba"
    ], correta:1,
    explicacao:"Oxidação ao contato com o ar é hipótese de ferro/manganês; a análise confirma e orienta a tecnologia." },

  // ===================== DUREZA =====================
  { id:"q43", tema:"Dureza", tipo:"multipla",
    enunciado:"Um anti-incrustante reduz incrustação, mas o que ele NÃO faz?",
    opcoes:[
      "Ajuda a reduzir deposição em tubulações",
      "Remove o cálcio e o magnésio dissolvidos da água",
      "Atua sobre a formação de incrustação",
      "Pode ser uma etapa complementar"
    ], correta:1,
    explicacao:"Anti-incrustante reduz incrustação, mas não remove a dureza (cálcio e magnésio) da água." },

  { id:"q44", tema:"Dureza", tipo:"vf",
    enunciado:"Filtrar partículas em suspensão trata a dureza dissolvida da água.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Dureza está dissolvida; filtro de partícula não a remove." },

  { id:"q45", tema:"Dureza", tipo:"multipla",
    enunciado:"Cliente quer 'acabar com o acúmulo branco' e pergunta o preço na hora. Conduta técnica?",
    opcoes:[
      "Dar o preço do maior abrandador imediatamente",
      "Confirmar a dureza por análise e o objetivo antes de indicar a tecnologia adequada",
      "Afirmar que qualquer filtro resolve",
      "Dizer que é impossível tratar"
    ], correta:1,
    explicacao:"A tecnologia para dureza depende do laudo e do objetivo; não se define pela queixa isolada." },

  { id:"q46", tema:"Dureza", tipo:"vf",
    enunciado:"A distinção entre reduzir incrustação e remover dureza é irrelevante para o cliente.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"É uma distinção central: define se o problema real será resolvido ou apenas atenuado." },

  { id:"q47", tema:"Dureza", tipo:"cenario",
    enunciado:"O cliente diz que instalou um 'imã anti-cálcio' e a água continua com dureza alta no laudo. Como orientar?",
    opcoes:[
      "Garantir que o imã removeu o cálcio",
      "Explicar que reduzir incrustação não é o mesmo que remover cálcio e magnésio, e propor a tecnologia adequada conforme a análise",
      "Dizer que o laudo está errado",
      "Vender outro imã maior"
    ], correta:1,
    explicacao:"Se a dureza segue alta no laudo, o cálcio/magnésio continuam na água; tratar exige tecnologia compatível." },

  // ===================== COLIFORMES E DESINFECÇÃO =====================
  { id:"q48", tema:"Coliformes e desinfecção", tipo:"vf",
    enunciado:"Um filtro mecânico de sedimentos garante desinfecção microbiológica da água.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Filtro mecânico retém partículas; desinfecção é um processo distinto." },

  { id:"q49", tema:"Coliformes e desinfecção", tipo:"multipla",
    enunciado:"O laudo aponta presença de coliformes. Qual conduta?",
    opcoes:[
      "Vender o filtro comum e seguir",
      "Tratar como caso microbiológico que exige tecnologia de desinfecção adequada e encaminhamento ao especialista",
      "Dizer que some ao ferver uma vez",
      "Ignorar, pois a água está transparente"
    ], correta:1,
    explicacao:"Contaminação microbiológica é gatilho de escalonamento e exige desinfecção adequada." },

  { id:"q50", tema:"Coliformes e desinfecção", tipo:"vf",
    enunciado:"Água transparente comprova ausência de coliformes.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Coliformes não têm manifestação visual; só a análise microbiológica confirma." },

  { id:"q51", tema:"Coliformes e desinfecção", tipo:"multipla",
    enunciado:"Para o UV (ultravioleta) desinfetar de forma eficaz, é importante que a água tenha:",
    opcoes:[
      "Cor intensa",
      "Baixa turbidez, para que a radiação alcance os microrganismos",
      "Muito ferro",
      "Alta dureza"
    ], correta:1,
    explicacao:"Turbidez blinda microrganismos da radiação; UV precisa de água com baixa turbidez." },

  { id:"q52", tema:"Coliformes e desinfecção", tipo:"vf",
    enunciado:"Após o UV existe risco de recontaminação se a rede a jusante estiver comprometida.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"O UV não deixa residual; contaminação após o ponto de tratamento pode recontaminar a água." },

  { id:"q53", tema:"Coliformes e desinfecção", tipo:"cenario",
    enunciado:"Cliente pede 'um UV para deixar a água 100% potável'. Melhor abordagem?",
    opcoes:[
      "Prometer potabilidade total com o UV",
      "Explicar que o UV precisa de baixa turbidez, que há risco de recontaminação depois dele, e que potabilidade se comprova por análise, não se promete",
      "Vender o UV mais potente sem análise",
      "Garantir que resolve qualquer contaminação"
    ], correta:1,
    explicacao:"UV tem pré-requisitos e limites; não se promete potabilidade, ela é comprovada por análise." },

  // ===================== CLORO RESIDUAL =====================
  { id:"q54", tema:"Cloro residual", tipo:"vf",
    enunciado:"O cloro residual deve ser medido, não presumido.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Presumir cloro é arriscado; ele precisa ser medido para se saber se há residual." },

  { id:"q55", tema:"Cloro residual", tipo:"multipla",
    enunciado:"A dosagem de cloro deve ser definida com base em:",
    opcoes:[
      "Apenas o volume do reservatório",
      "Demanda da água, análise e acompanhamento com medição, não só pelo tamanho da caixa",
      "O chute do vendedor",
      "A cor do reservatório"
    ], correta:1,
    explicacao:"Dosagem não se define pelo volume do reservatório; depende da demanda e é confirmada por medição." },

  { id:"q56", tema:"Cloro residual", tipo:"multipla",
    enunciado:"Por que manter cloro residual importa em água de poço com desinfecção?",
    opcoes:[
      "Só para dar cheiro à água",
      "Para ajudar a manter proteção ao longo da rede, reduzindo risco de recontaminação, sempre com medição",
      "Para aumentar a dureza",
      "Para dispensar a análise"
    ], correta:1,
    explicacao:"O residual ajuda a proteger a água na distribuição, mas precisa ser monitorado por medição." },

  { id:"q57", tema:"Cloro residual", tipo:"vf",
    enunciado:"Pode-se informar ao cliente a dose exata de cloro de memória, sem medir e sem análise.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Dose depende de análise e medição; não se define de memória." },

  { id:"q58", tema:"Cloro residual", tipo:"cenario",
    enunciado:"Cliente pergunta 'quantas gotas de cloro coloco na caixa por dia?'. Resposta responsável?",
    opcoes:[
      "Dar um número redondo para agradar",
      "Explicar que a dosagem depende da demanda da água e deve ser definida com análise e medição do residual, encaminhando ao especialista",
      "Dizer que é sempre a mesma quantidade",
      "Afirmar que não precisa medir"
    ], correta:1,
    explicacao:"Dosagem se define por análise + medição, não por regra fixa de memória." },

  // ===================== NITRATO / NITRITO / AMÔNIA =====================
  { id:"q59", tema:"Nitrato/nitrito/amônia", tipo:"vf",
    enunciado:"Nitrato sai da água em um filtro comum de sedimentos.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Nitrato é dissolvido; filtro de sedimentos não o remove." },

  { id:"q60", tema:"Nitrato/nitrito/amônia", tipo:"multipla",
    enunciado:"O laudo indica nitrato acima da referência. Conduta correta?",
    opcoes:[
      "Vender carvão ativado, que remove tudo",
      "Tratar como caso que exige tecnologia específica e encaminhamento ao especialista, sem prometer solução genérica",
      "Ignorar, pois não tem cor",
      "Recomendar o maior tanque"
    ], correta:1,
    explicacao:"Nitrato/nitrito/amônia exigem tecnologia específica; é gatilho de escalonamento." },

  { id:"q61", tema:"Nitrato/nitrito/amônia", tipo:"vf",
    enunciado:"Carvão ativado remove todos os contaminantes dissolvidos, inclusive nitrato.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Carvão não remove tudo; nitrato não é retido por adsorção em carvão comum." },

  { id:"q62", tema:"Nitrato/nitrito/amônia", tipo:"multipla",
    enunciado:"Nitrato, nitrito e amônia não têm cor nem cheiro. Isso significa que:",
    opcoes:[
      "Podem ser ignorados",
      "Só a análise detecta e quantifica; a ausência de cor/cheiro não indica ausência do contaminante",
      "A água está potável",
      "Basta olhar para a água"
    ], correta:1,
    explicacao:"Sem cor/cheiro, apenas o laudo revela; ausência sensorial não é ausência do contaminante." },

  { id:"q63", tema:"Nitrato/nitrito/amônia", tipo:"cenario",
    enunciado:"Poço em área agrícola, cliente com bebê em casa, laudo com nitrato elevado. O que pesa mais na conduta?",
    opcoes:[
      "Fechar rápido com qualquer filtro",
      "Tratar como caso sensível de tecnologia específica, envolver o especialista e não prometer potabilidade",
      "Vender carvão ativado",
      "Dizer que o bebê pode beber assim mesmo"
    ], correta:1,
    explicacao:"Nitrato elevado em área agrícola é caso crítico; exige especialista e tecnologia específica, sem promessas." },

  // ===================== COR E MATÉRIA ORGÂNICA =====================
  { id:"q64", tema:"Cor e matéria orgânica", tipo:"multipla",
    enunciado:"Cor aparente e cor verdadeira em um laudo diferem porque:",
    opcoes:[
      "São a mesma coisa com nomes diferentes",
      "Uma pode incluir material em suspensão e a outra a cor após remover partículas; a leitura correta exige confirmar parâmetro e unidade",
      "Cor verdadeira é sempre zero",
      "Cor não aparece em laudo"
    ], correta:1,
    explicacao:"São parâmetros distintos; interpretar exige atenção ao que cada um mede e à unidade." },

  { id:"q65", tema:"Cor e matéria orgânica", tipo:"vf",
    enunciado:"Água com cor amarelada pode indicar matéria orgânica, mas a causa deve ser confirmada por análise.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"A cor levanta hipótese; a causa e o tratamento adequado vêm do laudo." },

  { id:"q66", tema:"Cor e matéria orgânica", tipo:"multipla",
    enunciado:"Remover a cor visível da água comprova que a matéria orgânica foi tratada adequadamente?",
    opcoes:[
      "Sim, sem cor está resolvido",
      "Não; a ausência de cor não comprova tratamento adequado, que deve ser verificado por análise",
      "Sim, se usar tanque grande",
      "Não, pois cor não se trata"
    ], correta:1,
    explicacao:"Aparência melhor não é prova de tratamento; verifica-se por análise." },

  { id:"q67", tema:"Cor e matéria orgânica", tipo:"cenario",
    enunciado:"Cliente quer 'só tirar a cor' da água para vender melhor um imóvel. Como agir com responsabilidade?",
    opcoes:[
      "Prometer água potável ao remover a cor",
      "Esclarecer que tratar a aparência não garante potabilidade e conduzir para análise e diagnóstico completo",
      "Vender o filtro mais barato",
      "Garantir que ficará própria para consumo"
    ], correta:1,
    explicacao:"Tratar cor é estético; potabilidade é outra questão, comprovada por análise." },

  // ===================== COMPOSTOS ORGÂNICOS =====================
  { id:"q68", tema:"Compostos orgânicos", tipo:"multipla",
    enunciado:"Suspeita de compostos orgânicos ou agrotóxicos na água exige:",
    opcoes:[
      "Venda imediata de carvão para qualquer caso",
      "Análise específica por substância e encaminhamento ao especialista, sem prometer remoção genérica",
      "Ignorar, pois é raro",
      "Um tanque maior"
    ], correta:1,
    explicacao:"Cada composto exige análise específica; é gatilho de escalonamento, sem promessa genérica." },

  { id:"q69", tema:"Compostos orgânicos", tipo:"vf",
    enunciado:"Um único tipo de mídia trata qualquer composto orgânico da água.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Depende do composto; a tecnologia adequada só se define após análise específica." },

  { id:"q70", tema:"Compostos orgânicos", tipo:"multipla",
    enunciado:"Cliente relata cheiro de combustível na água do poço. Conduta prioritária?",
    opcoes:[
      "Vender carvão ativado na hora",
      "Tratar como caso crítico, solicitar análise específica e encaminhar ao especialista, sem prometer solução",
      "Dizer que some com o tempo",
      "Recomendar fervura"
    ], correta:1,
    explicacao:"Suspeita de contaminação orgânica é caso crítico; exige análise específica e especialista." },

  { id:"q71", tema:"Compostos orgânicos", tipo:"vf",
    enunciado:"Aplicações industriais críticas, hospitalares ou de alimentos podem exigir cuidados e tecnologias além do padrão residencial.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"São contextos sensíveis e gatilhos de escalonamento ao especialista." },

  // ===================== TECNOLOGIAS =====================
  { id:"q72", tema:"Tecnologias", tipo:"multipla",
    enunciado:"O princípio central ao combinar tecnologias de tratamento é:",
    opcoes:[
      "Usar sempre a mais cara",
      "Cada parâmetro fora do padrão pede a etapa compatível; uma tecnologia não resolve tudo",
      "Uma tecnologia única resolve qualquer água",
      "Escolher pela cor do equipamento"
    ], correta:1,
    explicacao:"A solução é composta a partir do diagnóstico; nenhuma tecnologia isolada cobre tudo." },

  { id:"q73", tema:"Tecnologias", tipo:"vf",
    enunciado:"A escolha da tecnologia deve partir do laudo e do objetivo, não de um kit padrão.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Diagnóstico define a tecnologia; kit padrão sem análise é venda irresponsável." },

  { id:"q74", tema:"Tecnologias", tipo:"multipla",
    enunciado:"Filtração de partículas, tratamento de dureza e desinfecção são etapas que:",
    opcoes:[
      "Fazem a mesma coisa",
      "Resolvem problemas diferentes e podem ser combinadas conforme a análise",
      "Se anulam entre si",
      "Nunca convivem no mesmo sistema"
    ], correta:1,
    explicacao:"São funções distintas, combinadas quando o diagnóstico exige." },

  { id:"q75", tema:"Tecnologias", tipo:"vf",
    enunciado:"Adicionar mais etapas de tratamento sempre melhora a água, mesmo sem análise.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Etapas desnecessárias encarecem e podem não atacar o problema real; tudo parte do laudo." },

  { id:"q76", tema:"Tecnologias", tipo:"cenario",
    enunciado:"Cliente pede o 'kit completo' que o vizinho comprou. O laudo dele é diferente. Conduta?",
    opcoes:[
      "Vender o mesmo kit do vizinho",
      "Explicar que cada água tem seu diagnóstico e dimensionar a partir do laudo do próprio cliente",
      "Garantir que serve porque é o mesmo bairro",
      "Dobrar o kit por segurança"
    ], correta:1,
    explicacao:"Solução copiada ignora o diagnóstico específico; cada água exige seu próprio dimensionamento." },

  { id:"q77", tema:"Tecnologias", tipo:"multipla",
    enunciado:"Sobre a osmose reversa e outras tecnologias avançadas, a postura correta é:",
    opcoes:[
      "Prometer que removem tudo em qualquer caso",
      "Indicá-las quando o diagnóstico justificar, avaliando pré-tratamento, hidráulica e manutenção, sem promessas genéricas",
      "Nunca considerar",
      "Vender sempre a mais potente"
    ], correta:1,
    explicacao:"Toda tecnologia tem indicação, pré-requisitos e limites; nada de promessa genérica." },

  // ===================== ARQUITETURA =====================
  { id:"q78", tema:"Arquitetura", tipo:"multipla",
    enunciado:"Ao projetar a arquitetura de uma estação de tratamento, a ordem das etapas é definida por:",
    opcoes:[
      "Preferência do cliente pela estética",
      "Diagnóstico da água e lógica de tratamento (o que precede o quê), com hidráulica compatível",
      "Tamanho do terreno apenas",
      "Preço dos equipamentos"
    ], correta:1,
    explicacao:"A sequência decorre do diagnóstico e da lógica de tratamento, respeitando a hidráulica." },

  { id:"q79", tema:"Arquitetura", tipo:"vf",
    enunciado:"Uma estação bem projetada considera a vazão de retrolavagem de cada etapa, não só o consumo.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Retrolavagem impacta o dimensionamento; ignorá-la compromete a operação." },

  { id:"q80", tema:"Arquitetura", tipo:"multipla",
    enunciado:"Um cliente quer 'juntar tudo em um único tanque' para economizar espaço. Resposta técnica?",
    opcoes:[
      "Concordar sempre, um tanque basta",
      "Avaliar se as funções são compatíveis em um mesmo estágio; muitas vezes etapas distintas exigem estágios distintos, conforme o diagnóstico",
      "Recusar sem explicar",
      "Garantir que um tanque trata tudo"
    ], correta:1,
    explicacao:"Combinar funções depende de compatibilidade técnica; o tanque único nem sempre atende às etapas necessárias." },

  { id:"q81", tema:"Arquitetura", tipo:"vf",
    enunciado:"A manutenção e a operação futura devem ser pensadas já no projeto da estação.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Projetar sem pensar em operação e manutenção gera falhas e insatisfação depois." },

  { id:"q82", tema:"Arquitetura", tipo:"cenario",
    enunciado:"O laudo aponta múltiplos problemas (partícula, dureza, microbiológico). Como estruturar a estação?",
    opcoes:[
      "Um filtro só, para simplificar",
      "Compor etapas compatíveis na sequência correta conforme o diagnóstico, envolvendo o especialista no dimensionamento",
      "Vender o maior tanque e pronto",
      "Tratar só o problema mais barato"
    ], correta:1,
    explicacao:"Múltiplos problemas pedem etapas encadeadas com lógica; o especialista dimensiona o conjunto." },

  // ===================== QUALIFICAÇÃO =====================
  { id:"q83", tema:"Qualificação", tipo:"multipla",
    enunciado:"Na qualificação de um lead de poço, uma informação essencial de levantar é:",
    opcoes:[
      "A cor preferida do tanque",
      "Origem da água, objetivo do cliente e existência de análise",
      "O signo do cliente",
      "A marca do carro dele"
    ], correta:1,
    explicacao:"Origem + objetivo + análise são a base do diagnóstico e da qualificação." },

  { id:"q84", tema:"Qualificação", tipo:"vf",
    enunciado:"Se o lead ainda não tem análise, a qualificação já deve encaminhar para a realização da análise.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Sem análise não há diagnóstico; conduzir para a análise é parte da qualificação." },

  { id:"q85", tema:"Qualificação", tipo:"multipla",
    enunciado:"Cliente com aplicação hospitalar ou de alimentos deve ser qualificado como:",
    opcoes:[
      "Igual a uma residência simples",
      "Caso sensível que requer especialista e cuidado adicional",
      "Motivo para pular a análise",
      "Venda rápida de kit padrão"
    ], correta:1,
    explicacao:"Aplicações hospitalares e de alimentos são gatilhos de escalonamento." },

  { id:"q86", tema:"Qualificação", tipo:"vf",
    enunciado:"Perguntar sobre o regime de alimentação (gravidade ou bomba) ajuda a antecipar restrições hidráulicas.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"O regime afeta pressão e vazão; levantar isso cedo evita surpresas no dimensionamento." },

  { id:"q87", tema:"Qualificação", tipo:"multipla",
    enunciado:"O cliente pergunta o preço logo no primeiro contato, sem análise. Melhor conduta na qualificação?",
    opcoes:[
      "Dar um preço fixo qualquer",
      "Explicar que o preço depende do diagnóstico e conduzir para a análise, alinhando expectativa",
      "Prometer o menor preço da região",
      "Encerrar o atendimento"
    ], correta:1,
    explicacao:"Preço sem diagnóstico é chute; a qualificação alinha a expectativa e conduz à análise." },

  { id:"q88", tema:"Qualificação", tipo:"cenario",
    enunciado:"Lead de condomínio com muitas unidades e vazão alta. Como qualificar?",
    opcoes:[
      "Tratar como residência e fechar rápido",
      "Sinalizar sistema coletivo e vazão elevada como caso de especialista, coletando dados e análise antes de propor",
      "Ignorar a vazão",
      "Vender o kit residencial multiplicado"
    ], correta:1,
    explicacao:"Sistema coletivo e vazão elevada são gatilhos de escalonamento ao especialista." },

  // ===================== ROTEIRO DE VENDA =====================
  { id:"q89", tema:"Roteiro de venda", tipo:"multipla",
    enunciado:"No roteiro de venda de poço, a proposta comercial deve ser apresentada:",
    opcoes:[
      "Antes de qualquer análise, para adiantar",
      "Após a análise e o diagnóstico hidráulico, ancorada no problema real do cliente",
      "Somente com base na foto da água",
      "Sem mencionar a análise"
    ], correta:1,
    explicacao:"A proposta vem depois do diagnóstico; é ancorada no problema real revelado pelo laudo." },

  { id:"q90", tema:"Roteiro de venda", tipo:"vf",
    enunciado:"Explicar o porquê de cada etapa do sistema fortalece a venda mais do que só citar o preço.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Vincular cada etapa ao problema diagnosticado gera valor e confiança." },

  { id:"q91", tema:"Roteiro de venda", tipo:"multipla",
    enunciado:"Durante o fechamento, o cliente pede uma 'garantia de água potável no contrato'. Conduta?",
    opcoes:[
      "Colocar a garantia de potabilidade para fechar",
      "Não prometer potabilidade; alinhar que o resultado é verificado por análise após o tratamento e envolver o especialista",
      "Prometer verbalmente e não registrar",
      "Ignorar o pedido"
    ], correta:1,
    explicacao:"Potabilidade não se promete; comprova-se por análise. Garantia dessa natureza é gatilho de escalonamento." },

  { id:"q92", tema:"Roteiro de venda", tipo:"vf",
    enunciado:"Prometer resultados que não podem ser comprovados por análise fragiliza a venda e a empresa.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Promessas não comprováveis geram frustração, retrabalho e risco à reputação." },

  { id:"q93", tema:"Roteiro de venda", tipo:"cenario",
    enunciado:"O cliente aprovou o diagnóstico e quer fechar. Qual passo consolida a venda com responsabilidade?",
    opcoes:[
      "Entregar e nunca mais medir nada",
      "Alinhar a instalação, a manutenção e a nova análise pós-tratamento para verificar o resultado",
      "Prometer que nunca precisará de manutenção",
      "Vender um tanque extra por garantia"
    ], correta:1,
    explicacao:"Fechar bem inclui operação, manutenção e verificação por nova análise após o tratamento." },

  // ===================== OBJEÇÕES =====================
  { id:"q94", tema:"Objeções", tipo:"multipla",
    enunciado:"Objeção: 'não preciso de análise, minha água sempre foi boa'. Melhor resposta?",
    opcoes:[
      "Concordar e vender sem análise",
      "Acolher e explicar que a qualidade varia no tempo e que contaminantes podem ser invisíveis, posicionando a análise como proteção do cliente",
      "Dizer que ele está errado e encerrar",
      "Oferecer desconto para pular a análise"
    ], correta:1,
    explicacao:"Rebate-se com educação: qualidade muda e há contaminantes invisíveis; a análise protege o cliente." },

  { id:"q95", tema:"Objeções", tipo:"multipla",
    enunciado:"Objeção: 'o vizinho comprou um filtro barato e resolveu'. Conduta?",
    opcoes:[
      "Vender o mesmo filtro barato",
      "Explicar que cada água tem diagnóstico próprio e que a solução do vizinho pode não servir ao problema dele",
      "Dizer que o vizinho foi enganado",
      "Prometer preço menor que o do vizinho"
    ], correta:1,
    explicacao:"Comparação com terceiros ignora o diagnóstico específico de cada água." },

  { id:"q96", tema:"Objeções", tipo:"vf",
    enunciado:"Diante da objeção de preço, baixar a qualidade técnica do sistema sem rever o diagnóstico é aceitável para fechar.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Reduzir o sistema abaixo do que o diagnóstico exige entrega solução que não resolve o problema." },

  { id:"q97", tema:"Objeções", tipo:"multipla",
    enunciado:"Objeção: 'é muito caro, quero só metade do sistema'. Resposta responsável?",
    opcoes:[
      "Vender metade e prometer o mesmo resultado",
      "Explicar o que cada etapa resolve, mostrar o risco de remover o que o diagnóstico exige e buscar alternativa sem prometer o que não se cumpre",
      "Aceitar sem comentar o impacto",
      "Dobrar o desconto no maior tanque"
    ], correta:1,
    explicacao:"Transparência sobre o que cada etapa resolve evita vender uma solução que não trata o problema." },

  { id:"q98", tema:"Objeções", tipo:"cenario",
    enunciado:"Cliente: 'me garante que fica potável ou não fecho'. Como conduzir sem perder a ética?",
    opcoes:[
      "Garantir potabilidade para fechar",
      "Explicar que potabilidade é comprovada por análise, não prometida, e propor o processo correto com verificação pós-tratamento",
      "Prometer só de boca",
      "Encerrar sem alternativa"
    ], correta:1,
    explicacao:"Nunca se promete potabilidade; oferece-se o processo correto com comprovação por análise." },

  // ===================== QUANDO PARAR =====================
  { id:"q99", tema:"Quando parar", tipo:"multipla",
    enunciado:"Qual destas situações é motivo para PARAR e encaminhar ao especialista?",
    opcoes:[
      "Cliente quer instalar num sábado",
      "Resultado microbiológico positivo no laudo",
      "Cliente que já tem caixa d'água",
      "Poço com bomba recém-trocada"
    ], correta:1,
    explicacao:"Contaminação microbiológica é um dos gatilhos claros de escalonamento." },

  { id:"q100", tema:"Quando parar", tipo:"vf",
    enunciado:"Na ausência de análise, o closer deve parar e conduzir para a análise antes de propor qualquer sistema.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Sem análise não há diagnóstico; propor sistema seria irresponsável." },

  { id:"q101", tema:"Quando parar", tipo:"multipla",
    enunciado:"O cliente insiste em uma garantia formal de potabilidade. O closer deve:",
    opcoes:[
      "Assinar a garantia para não perder a venda",
      "Parar, não prometer potabilidade e encaminhar ao especialista",
      "Prometer verbalmente",
      "Reduzir o preço até ele desistir do pedido"
    ], correta:1,
    explicacao:"Pedido de garantia de potabilidade é gatilho de parada e escalonamento." },

  { id:"q102", tema:"Quando parar", tipo:"multipla",
    enunciado:"Detecção (ou suspeita) de nitrato, metais pesados, agrotóxicos ou compostos orgânicos deve levar a:",
    opcoes:[
      "Venda imediata de kit padrão",
      "Parada e encaminhamento ao especialista, com análise específica",
      "Recomendação de fervura",
      "Um tanque maior"
    ], correta:1,
    explicacao:"São contaminantes que exigem tecnologia específica e especialista; o closer não decide sozinho." },

  { id:"q103", tema:"Quando parar", tipo:"vf",
    enunciado:"Aplicações industriais críticas, hospitalares, de alimentos e sistemas coletivos de vazão elevada são casos para envolver o especialista.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Todos são gatilhos de escalonamento definidos no processo." },

  { id:"q104", tema:"Quando parar", tipo:"cenario",
    enunciado:"Você não tem certeza se a tecnologia proposta resolve o problema do laudo. Qual a atitude correta?",
    opcoes:[
      "Fechar mesmo assim e ver depois",
      "Parar, não prometer solução e pedir apoio do especialista antes de propor",
      "Chutar a tecnologia mais cara",
      "Dizer ao cliente que resolve com certeza"
    ], correta:1,
    explicacao:"Na dúvida técnica, não se promete; escala-se ao especialista antes de propor." },

  { id:"q105", tema:"Quando parar", tipo:"vf",
    enunciado:"Se o laudo estiver ilegível ou incompleto, o correto é seguir e propor com base no que dá para ler.",
    opcoes:["Verdadeiro","Falso"], correta:1,
    explicacao:"Laudo ilegível/incompleto exige novo laudo; propor com dados parciais é irresponsável." },

  // ===================== EXTRAS (reforço de raciocínio) =====================
  { id:"q106", tema:"Fundamentos", tipo:"multipla",
    enunciado:"A frase que melhor resume a filosofia da academia de poço é:",
    opcoes:[
      "Venda o tanque, depois se preocupa com a água",
      "Diagnóstico antes de solução: análise, hidráulica e dimensionamento antes de qualquer proposta",
      "Se a água está limpa, está pronta",
      "Um filtro serve para tudo"
    ], correta:1,
    explicacao:"O eixo é diagnóstico responsável antes da proposta." },

  { id:"q107", tema:"Análise", tipo:"cenario",
    enunciado:"Dois laudos do mesmo poço, meses diferentes, com resultados distintos para um parâmetro. O que isso ensina?",
    opcoes:[
      "Que um dos laboratórios mentiu",
      "Que a qualidade da água varia no tempo, reforçando a necessidade de análise recente antes de propor",
      "Que laudo não serve para nada",
      "Que se deve usar a média dos dois"
    ], correta:1,
    explicacao:"Variação temporal é esperada; por isso a análise deve ser recente." },

  { id:"q108", tema:"Tecnologias", tipo:"vf",
    enunciado:"UV, tratamento de dureza e remoção de nitrato podem coexistir num mesmo projeto quando o laudo justifica.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"Problemas distintos podem ser combinados em etapas compatíveis conforme o diagnóstico." },

  { id:"q109", tema:"Ferro e manganês", tipo:"vf",
    enunciado:"O tipo de tratamento para ferro pode mudar conforme a forma em que o ferro está presente na água.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"A forma do contaminante influencia a tecnologia; por isso a análise é decisiva." },

  { id:"q110", tema:"Dureza", tipo:"multipla",
    enunciado:"Após instalar um sistema para dureza, como comprovar que funcionou?",
    opcoes:[
      "Olhando se a água ficou mais clara",
      "Refazendo a análise para verificar a dureza tratada",
      "Perguntando ao cliente se gostou",
      "Medindo o tamanho do tanque"
    ], correta:1,
    explicacao:"Eficácia se comprova por nova análise, não por percepção visual." },

  { id:"q111", tema:"Coliformes e desinfecção", tipo:"multipla",
    enunciado:"Por que a desinfecção sozinha pode não bastar sem cuidar da turbidez?",
    opcoes:[
      "Porque a turbidez deixa a água mais bonita",
      "Porque partículas em suspensão podem proteger microrganismos e reduzir a eficácia da desinfecção",
      "Porque turbidez aumenta o cloro",
      "Porque não há relação entre eles"
    ], correta:1,
    explicacao:"Turbidez pode blindar microrganismos; muitas vezes é preciso reduzir turbidez antes de desinfetar." },

  { id:"q112", tema:"Cloro residual", tipo:"vf",
    enunciado:"Monitorar o cloro residual ao longo do tempo é parte de uma operação responsável.",
    opcoes:["Verdadeiro","Falso"], correta:0,
    explicacao:"O residual precisa ser acompanhado por medição, não presumido uma única vez." },

  { id:"q113", tema:"Hidráulica", tipo:"multipla",
    enunciado:"Antes de prometer que a estação atende ao consumo de pico da casa, o que confirmar?",
    opcoes:[
      "A cor das paredes",
      "A vazão real disponível e a compatibilidade com a demanda e a retrolavagem",
      "O número de janelas",
      "A marca do chuveiro"
    ], correta:1,
    explicacao:"Atender ao pico depende de vazão real, demanda e retrolavagem confirmadas." },

  { id:"q114", tema:"Nitrato/nitrito/amônia", tipo:"cenario",
    enunciado:"Cliente pergunta se o filtro de carvão que ele já tem resolve o nitrato do laudo. Resposta correta?",
    opcoes:[
      "Sim, carvão remove nitrato",
      "Não; carvão comum não remove nitrato, que exige tecnologia específica e avaliação do especialista",
      "Depende da cor da água",
      "Sim, se trocar o refil"
    ], correta:1,
    explicacao:"Carvão não remove tudo; nitrato exige tecnologia específica confirmada por especialista." },

  { id:"q115", tema:"Análise obrigatória", tipo:"multipla",
    enunciado:"O papel da análise no processo comercial da TDF é:",
    opcoes:[
      "Uma cortesia opcional",
      "A base do diagnóstico, sem a qual não há proposta responsável",
      "Um custo a ser evitado",
      "Algo que só o cliente decide fazer"
    ], correta:1,
    explicacao:"A análise é a base do diagnóstico e condição para qualquer proposta séria." }

]};
