// ============================================================================
// BANCO DE QUESTÕES — Especialista Comercial em Scale Stop
// Foco: Scale Stop REDUZ sem remover; não é abrandador; dor de incrustação/mancha;
// combo; ticket alto; NÃO prometer água mole. Sem specs numéricas inventadas.
// tipo: 'vf' (verdadeiro/falso) ou 'multipla'. correta = índice em opcoes.
// ============================================================================

const QUESTOES = [
  // --- Fundamento: o que é / o que faz ---
  { id: 'q01', tema: 'fundamento', tipo: 'multipla',
    enunciado: 'O que é, tecnicamente, o Scale Stop?',
    opcoes: ['Um abrandador sem sal.', 'Um anti-incrustante sem sal (linha TAC) que reduz a formação de crosta.', 'Um filtro de carvão para cloro.', 'Um sistema de osmose reversa.'],
    correta: 1, explicacao: 'Scale Stop é anti-incrustante sem sal (TAC): converte o cálcio em micro-cristais que não aderem, reduzindo a crosta.' },

  { id: 'q02', tema: 'fundamento', tipo: 'vf',
    enunciado: 'Scale Stop remove a dureza da água, deixando-a mole.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Scale Stop REDUZ a incrustação SEM remover a dureza; não deixa a água mole. Água mole é abrandador.' },

  { id: 'q03', tema: 'fundamento', tipo: 'multipla',
    enunciado: 'Como o Scale Stop age sobre o cálcio da água?',
    opcoes: ['Troca o cálcio por sódio usando sal.', 'Converte o cálcio em micro-cristais estáveis que não aderem às superfícies.', 'Remove todo o cálcio por membrana.', 'Precipita o cálcio no fundo do reservatório.'],
    correta: 1, explicacao: 'A tecnologia TAC cristaliza o cálcio em micro-partículas que não grudam — os minerais seguem na água, mas a crosta não se forma.' },

  { id: 'q04', tema: 'fundamento', tipo: 'vf',
    enunciado: 'O Scale Stop funciona sem sal e sem descarte de salmoura.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 0, explicacao: 'Verdadeiro. Diferente do abrandador, o Scale Stop não usa sal, não adiciona sódio e não gera dreno de salmoura.' },

  { id: 'q05', tema: 'fundamento', tipo: 'multipla',
    enunciado: 'A sigla TAC, a que o Scale Stop pertence, refere-se a:',
    opcoes: ['Troca Aniônica Contínua.', 'Cristalização Assistida por Template (Template Assisted Crystallization).', 'Tratamento por Ar Comprimido.', 'Tanque de Abrandamento Compacto.'],
    correta: 1, explicacao: 'TAC = Template Assisted Crystallization: a mídia serve de molde para o cálcio cristalizar em partículas que não aderem.' },

  { id: 'q06', tema: 'fundamento', tipo: 'vf',
    enunciado: 'Após o Scale Stop, os minerais (cálcio e magnésio) continuam presentes na água.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 0, explicacao: 'Verdadeiro. Scale Stop não remove minerais — ele muda a forma do cálcio para não aderir; os minerais permanecem na água.' },

  { id: 'q07', tema: 'fundamento', tipo: 'multipla',
    enunciado: 'Qual afirmação sobre o Scale Stop é correta e honesta para um cliente?',
    opcoes: ['"Deixa sua água mole."', '"Remove a dureza."', '"Reduz a incrustação e a mancha branca mantendo os minerais, sem sal."', '"Substitui o abrandador em qualquer caso."'],
    correta: 2, explicacao: 'A descrição correta: reduz a crosta/mancha mantendo os minerais, sem sal. Nunca prometer água mole nem remoção de dureza.' },

  // --- Dor / incrustação / mancha ---
  { id: 'q08', tema: 'dor', tipo: 'multipla',
    enunciado: 'Segundo o CRM, qual é a dor nº1 que traz o cliente de Scale Stop?',
    opcoes: ['Água amarela / ferro.', 'Mancha branca em vidros e pedras (dureza) — cerca de 69% das vendas.', 'Excesso de cloro.', 'Água com barro.'],
    correta: 1, explicacao: 'Mancha branca/dureza é a dor de ~69% das vendas de Scale Stop — a mais nítida de todas as linhas da TDF.' },

  { id: 'q09', tema: 'dor', tipo: 'multipla',
    enunciado: 'A dureza da água é composta principalmente por quais minerais?',
    opcoes: ['Ferro e manganês.', 'Cálcio e magnésio.', 'Sódio e potássio.', 'Cloro e flúor.'],
    correta: 1, explicacao: 'Dureza = cálcio (Ca²⁺) + magnésio (Mg²⁺). São eles que formam a crosta e a mancha branca.' },

  { id: 'q10', tema: 'dor', tipo: 'vf',
    enunciado: 'Uma água pode ser potável e, ainda assim, formar muita incrustação.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 0, explicacao: 'Verdadeiro. Dureza é parâmetro organoléptico/de aceitação: potável não significa "sem incrustação".' },

  { id: 'q11', tema: 'dor', tipo: 'multipla',
    enunciado: 'Onde a incrustação por dureza costuma aparecer?',
    opcoes: ['Apenas no filtro.', 'Box, vidros, torneiras, boiler, resistência e louça.', 'Só na caixa d’água.', 'Somente em água de concessionária.'],
    correta: 1, explicacao: 'A crosta e a mancha branca aparecem em box, vidros, metais, boiler, resistência e louça — o dia a dia do cliente.' },

  { id: 'q12', tema: 'dor', tipo: 'multipla',
    enunciado: 'Na Portaria 888/2021, a dureza é classificada como parâmetro:',
    opcoes: ['De risco microbiológico.', 'Organoléptico / de aceitação (conforto, aparência, operação).', 'Radioativo.', 'De desinfecção.'],
    correta: 1, explicacao: 'Dureza é organoléptico/de aceitação — ligado a conforto e operação, não a risco agudo. Por isso potável pode incrustar.' },

  { id: 'q13', tema: 'dor', tipo: 'vf',
    enunciado: 'O valor-limite (VMP) de dureza deve ser citado de memória durante o atendimento.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. VMP e limites vêm sempre da fonte oficial (Portaria 888), nunca de cabeça.' },

  { id: 'q14', tema: 'dor', tipo: 'multipla',
    enunciado: 'Qual origem de água mais se associa à dureza no ICP de Scale Stop?',
    opcoes: ['Água de concessionária urbana tratada.', 'Água dura de poço / estação, em regiões de serra e interior.', 'Água de chuva.', 'Água do mar.'],
    correta: 1, explicacao: 'O ICP é água dura de poço/estação, SP + serra/interior (ex.: Sto Antônio do Pinhal, Caçapava, Itupeva).' },

  // --- Scale Stop x abrandador ---
  { id: 'q15', tema: 'vs-abrandador', tipo: 'multipla',
    enunciado: 'Qual é a diferença central entre abrandador e Scale Stop?',
    opcoes: ['São idênticos.', 'O abrandador REMOVE a dureza (com sal, água mole); o Scale Stop REDUZ a crosta sem remover e sem sal.', 'O Scale Stop remove mais dureza.', 'O abrandador não usa sal.'],
    correta: 1, explicacao: 'Abrandador remove dureza via resina catiônica + sal (água mole). Scale Stop reduz a crosta mantendo os minerais, sem sal.' },

  { id: 'q16', tema: 'vs-abrandador', tipo: 'multipla',
    enunciado: 'O abrandador convencional funciona trocando cálcio e magnésio por qual íon, regenerando com o quê?',
    opcoes: ['Por cloreto, regenerado com carvão.', 'Por sódio, regenerado com salmoura (sal).', 'Por ferro, regenerado com ar.', 'Por nitrato, regenerado com soda.'],
    correta: 1, explicacao: 'A resina catiônica troca Ca²⁺/Mg²⁺ por sódio (Na⁺) e regenera com salmoura (NaCl). Por isso a água sai mole.' },

  { id: 'q17', tema: 'vs-abrandador', tipo: 'vf',
    enunciado: 'O abrandador adiciona sódio à água e precisa de dreno para a salmoura; o Scale Stop, não.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 0, explicacao: 'Verdadeiro. Abrandador usa sal, adiciona sódio e precisa de dreno. Scale Stop é sem sal, sem sódio e sem dreno.' },

  { id: 'q18', tema: 'vs-abrandador', tipo: 'multipla',
    enunciado: 'O cliente precisa de água mole de verdade para um processo de aquecimento. O que indicar?',
    opcoes: ['Scale Stop, que deixa a água mole.', 'Abrandador, que remove a dureza de fato.', 'Filtro de carvão.', 'Nada resolve.'],
    correta: 1, explicacao: 'Água mole de verdade = abrandador. Scale Stop não deixa a água mole; nunca prometa isso.' },

  { id: 'q19', tema: 'vs-abrandador', tipo: 'multipla',
    enunciado: 'O cliente quer parar a mancha branca, mas não quer sal nem dreno em casa. O que indicar?',
    opcoes: ['Abrandador com sal.', 'Scale Stop — reduz a crosta sem sal e sem salmoura.', 'Osmose reversa.', 'Trocar de concessionária.'],
    correta: 1, explicacao: 'Sem sal e sem dreno, com foco em reduzir crosta/mancha: Scale Stop é o encaixe correto.' },

  { id: 'q20', tema: 'vs-abrandador', tipo: 'vf',
    enunciado: 'É correto vender o Scale Stop como "um abrandador sem sal".',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Scale Stop NÃO é abrandador. Chamá-lo assim induz o cliente a esperar água mole/remoção de dureza.' },

  { id: 'q21', tema: 'vs-abrandador', tipo: 'multipla',
    enunciado: 'Qual pergunta separa, na prática, um caso de Scale Stop de um caso de abrandador?',
    opcoes: ['"Prefere inox ou plástico?"', '"Você quer água mole de verdade ou parar a mancha/crosta sem sal?"', '"Quer parcelar?"', '"Sua água é de rua ou de poço?"'],
    correta: 1, explicacao: 'O objetivo decide: água mole = abrandador; parar a crosta sem sal = Scale Stop.' },

  { id: 'q22', tema: 'vs-abrandador', tipo: 'vf',
    enunciado: 'Abrandador é sempre "melhor" que Scale Stop.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Nenhum é melhor no geral — resolvem objetivos diferentes. O objetivo do cliente define o certo.' },

  // --- Combo / posicionamento / ticket ---
  { id: 'q23', tema: 'posicionamento', tipo: 'multipla',
    enunciado: 'Segundo o CRM, como o Scale Stop quase sempre é vendido?',
    opcoes: ['Sozinho, produto avulso.', 'Como combo/projeto, junto de Light Filter, V2 ou Fibra.', 'Só por locação.', 'Somente em bebedouros.'],
    correta: 1, explicacao: 'É quase sempre combo: Light Filter + Scale Stop Inox, Scale Stop + V2, Scale Stop + Fibra 1500.' },

  { id: 'q24', tema: 'posicionamento', tipo: 'multipla',
    enunciado: 'O Scale Stop, em relação ao ticket, representa na TDF:',
    opcoes: ['O menor ticket.', 'O maior ticket (mediana em torno de R$10.700).', 'Um ticket médio, igual ao filtro de entrada.', 'Um valor irrelevante.'],
    correta: 1, explicacao: 'Scale Stop é o MAIOR ticket da TDF (mediana ~R$10.700): cliente com verba, venda de projeto.' },

  { id: 'q25', tema: 'posicionamento', tipo: 'multipla',
    enunciado: 'No combo Scale Stop + Fibra, qual é o papel de cada parte?',
    opcoes: ['Ambos removem dureza.', 'Fibra cuida de partículas/água não tratada; Scale Stop reduz a crosta/mancha.', 'Fibra abranda; Scale Stop filtra cloro.', 'Ambos deixam a água mole.'],
    correta: 1, explicacao: 'Fibra = partículas/água não tratada; Scale Stop = anti-incrustação. Cada um resolve uma dor.' },

  { id: 'q26', tema: 'posicionamento', tipo: 'vf',
    enunciado: 'Por ser o maior ticket, o preço do Scale Stop deve ser ancorado no valor do sistema, não no preço da peça.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 0, explicacao: 'Verdadeiro. É venda de projeto: ancore no valor entregue (protege a casa, resolve a mancha), não no item.' },

  { id: 'q27', tema: 'posicionamento', tipo: 'multipla',
    enunciado: 'Qual combo aparece com frequência no CRM de Scale Stop?',
    opcoes: ['Scale Stop + bebedouro.', 'Light Filter + Scale Stop Inox.', 'Scale Stop + osmose portátil.', 'Scale Stop + purificador de bancada.'],
    correta: 1, explicacao: 'Light Filter + Scale Stop Inox é o combo mais comum; também Scale Stop + V2 e Scale Stop + Fibra 1500.' },

  { id: 'q28', tema: 'posicionamento', tipo: 'vf',
    enunciado: 'É recomendável vender o Scale Stop isolado mesmo quando o caso pede combo, para baratear.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Subdimensionar contra a necessidade da água entrega uma solução que não resolve; dimensione pela dor.' },

  { id: 'q29', tema: 'posicionamento', tipo: 'multipla',
    enunciado: 'A melhor forma de apresentar o Scale Stop dentro de um combo é:',
    opcoes: ['Como o item mais caro do carrinho.', 'Como o componente anti-crosta de um sistema, ligando cada parte a uma dor do cliente.', 'Como um upgrade opcional sem função clara.', 'Sem explicar, só somando preços.'],
    correta: 1, explicacao: 'Posicione como o "cérebro anti-incrustação" do sistema, amarrando cada componente a uma dor específica.' },

  // --- Não prometer água mole / honestidade técnica ---
  { id: 'q30', tema: 'regra-travada', tipo: 'vf',
    enunciado: 'É aceitável dizer "mais ou menos, fica um pouco mais mole" quando o cliente pergunta se o Scale Stop deixa a água mole.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Meia-verdade também induz ao erro. O correto é categórico: Scale Stop NÃO deixa a água mole.' },

  { id: 'q31', tema: 'regra-travada', tipo: 'multipla',
    enunciado: 'Cliente: "isso deixa a água mole?" Qual a melhor resposta?',
    opcoes: ['"Sim, deixa bem mole."', '"Não — água mole é o abrandador; o Scale Stop reduz a crosta/mancha sem sal, mantendo os minerais."', '"Depende do dia."', '"Deixa, e é melhor que abrandador."'],
    correta: 1, explicacao: 'Corrigir com honestidade e diferenciar do abrandador. Prometer água mole é a falha mais grave da linha.' },

  { id: 'q32', tema: 'regra-travada', tipo: 'vf',
    enunciado: 'Ganhar uma objeção prometendo que o Scale Stop "remove a dureza" é uma tática aceitável para fechar.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Prometer o que o produto não faz vira problema no pós-venda e destrói a credibilidade.' },

  { id: 'q33', tema: 'regra-travada', tipo: 'multipla',
    enunciado: 'Um concorrente promete "acabar com a dureza e deixar a água mole". Como responder?',
    opcoes: ['"O Scale Stop também faz isso."', '"Ele deve estar mentindo, é impossível."', '"Vou ser transparente: o Scale Stop reduz a crosta sem remover a dureza; se o equipamento dele deixa a água mole, provavelmente é um abrandador com sal — tecnologias diferentes."', '"O nosso é melhor em tudo."'],
    correta: 2, explicacao: 'Honestidade técnica: diferencie as tecnologias sem prometer água mole e sem atacar o concorrente sem base.' },

  { id: 'q34', tema: 'regra-travada', tipo: 'multipla',
    enunciado: 'Qual descrição do Scale Stop NUNCA deve ser usada?',
    opcoes: ['"Anti-incrustante sem sal."', '"Reduz a crosta mantendo os minerais."', '"Remove a dureza e deixa a água mole."', '"Converte o cálcio para não aderir."'],
    correta: 2, explicacao: '"Remove a dureza / água mole" é exatamente o que o Scale Stop NÃO faz — isso é abrandador.' },

  // --- Qualificação ---
  { id: 'q35', tema: 'qualificacao', tipo: 'multipla',
    enunciado: 'Qual dor confirma um caso de Scale Stop na qualificação?',
    opcoes: ['Água amarela/ferro.', 'Mancha branca / crosta (dureza).', 'Cheiro de cloro.', 'Falta de pressão.'],
    correta: 1, explicacao: 'Mancha branca/crosta = dureza, a dor central do Scale Stop. Ferro é caso de Iron Free/Fibra.' },

  { id: 'q36', tema: 'qualificacao', tipo: 'multipla',
    enunciado: 'Além da dor, o que é essencial levantar num lead de Scale Stop?',
    opcoes: ['Só o telefone.', 'Origem da água, porte/verba, cidade, prazo, decisor e objetivo (crosta × água mole).', 'Apenas a cor da casa.', 'Nada além do nome.'],
    correta: 1, explicacao: 'Por ser projeto/combo, é preciso mapear origem, porte, cidade, prazo, decisor e o objetivo real.' },

  { id: 'q37', tema: 'qualificacao', tipo: 'vf',
    enunciado: 'Perguntar "você quer parar a crosta ou precisa de água mole?" ajuda a evitar prometer o que o Scale Stop não faz.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 0, explicacao: 'Verdadeiro. Essa pergunta separa Scale Stop de abrandador e protege você da promessa errada.' },

  { id: 'q38', tema: 'qualificacao', tipo: 'multipla',
    enunciado: 'Cliente relata mancha branca E barro fino na água de poço. O que isso sugere?',
    opcoes: ['Só Scale Stop resolve tudo.', 'Provável combo: Scale Stop (crosta) + etapa de filtragem como Fibra (partículas/barro).', 'Só um abrandador.', 'Nenhum tratamento necessário.'],
    correta: 1, explicacao: 'Scale Stop não filtra barro; partículas pedem uma etapa de filtragem. É caso típico de combo.' },

  // --- Objeções ---
  { id: 'q39', tema: 'objecoes', tipo: 'multipla',
    enunciado: 'Qual é a estrutura recomendada para tratar objeções?',
    opcoes: ['Rebater e insistir.', 'Ouvir → confirmar → investigar → responder → próximo passo.', 'Baixar o preço na hora.', 'Ignorar e seguir o script.'],
    correta: 1, explicacao: 'Objeção é pedido de informação: entenda o real motivo antes de responder e sempre avance uma etapa.' },

  { id: 'q40', tema: 'objecoes', tipo: 'multipla',
    enunciado: 'Objeção "está caro" no Scale Stop. Melhor caminho?',
    opcoes: ['Dar desconto imediato.', 'Ancorar no valor do sistema (protege a casa toda, resolve a mancha) e investigar "caro comparado a quê".', 'Dizer que é o mais barato do mercado.', 'Encerrar o atendimento.'],
    correta: 1, explicacao: 'É o maior ticket: venda valor do projeto e entenda a referência de "caro" antes de mexer no preço.' },

  { id: 'q41', tema: 'objecoes', tipo: 'multipla',
    enunciado: 'Objeção "vou pensar". Qual a melhor conduta?',
    opcoes: ['Pressionar para fechar já.', 'Descobrir o que trava (valor, eficácia ou decisor) e marcar um retorno com data.', 'Desistir do lead.', 'Mandar o boleto assim mesmo.'],
    correta: 1, explicacao: 'O ciclo é ~12 dias; investigue o real motivo e agende retorno com data para não esfriar o lead.' },

  { id: 'q42', tema: 'objecoes', tipo: 'vf',
    enunciado: 'Se a objeção for técnica (ex.: "aguenta minha vazão?"), o vendedor deve estimar um número na hora para não travar a venda.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Specs (vazão/capacidade) vêm do especialista/ficha oficial. Nunca invente número para o cliente.' },

  // --- Fechamento ---
  { id: 'q43', tema: 'fechamento', tipo: 'multipla',
    enunciado: 'O ciclo mediano de venda do Scale Stop (~12 dias, o mais longo da TDF) indica que:',
    opcoes: ['A venda está perdida.', 'É venda de projeto que exige análise/dimensionamento — o follow-up com valor faz parte do fechamento.', 'Deve-se pressionar para fechar no 1º contato.', 'O produto é ruim.'],
    correta: 1, explicacao: 'É o ciclo mais longo por ser projeto. Nutrir com valor (projeto, retorno com data) é o que fecha.' },

  { id: 'q44', tema: 'fechamento', tipo: 'multipla',
    enunciado: 'O que não pode faltar ao encerrar uma conversa de fechamento de projeto?',
    opcoes: ['Um desconto.', 'Um próximo passo concreto com data e o decisor no jogo.', 'A promessa de água mole.', 'Uma spec inventada de vazão.'],
    correta: 1, explicacao: 'Fechamento saudável: cliente entendeu o projeto, decisor presente e próximo passo com data. Sem isso, só adiou.' },

  { id: 'q45', tema: 'fechamento', tipo: 'vf',
    enunciado: 'Condições comerciais (descontos, prazos) podem ser inventadas para fechar o Scale Stop.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Condições seguem a política oficial da TDF; não crie condição fora do que está autorizado.' },

  { id: 'q46', tema: 'fechamento', tipo: 'multipla',
    enunciado: 'No fechamento condicional, o vendedor:',
    opcoes: ['Baixa o preço sem contrapartida.', 'Amarra a resposta do cliente a um avanço ("se eu conseguir X, você toca o projeto?"), dentro da política oficial.', 'Promete o que for preciso.', 'Espera o cliente decidir sozinho.'],
    correta: 1, explicacao: 'Condicional é troca por troca: cada concessão vem amarrada a um avanço, sempre dentro da política oficial.' },

  // --- CRM ---
  { id: 'q47', tema: 'crm', tipo: 'multipla',
    enunciado: 'O que não pode faltar no card de CRM de um lead de Scale Stop?',
    opcoes: ['Só o nome.', 'Dor (mancha/dureza), origem da água, combo, ticket, cidade, decisor e próximo passo com data.', 'Apenas o valor.', 'Somente a cidade.'],
    correta: 1, explicacao: 'O card sustenta o follow-up do ciclo de 12 dias e a inteligência da linha — precisa do quadro completo.' },

  { id: 'q48', tema: 'crm', tipo: 'multipla',
    enunciado: 'Como descrever a solução no CRM, de forma tecnicamente correta?',
    opcoes: ['"Remove a dureza / deixa a água mole."', '"Anti-incrustante que reduz a crosta/mancha (Scale Stop, sem sal)."', '"Abrandador sem sal."', '"Filtro que amacia a água."'],
    correta: 1, explicacao: 'Registro correto evita promessa errada no próximo contato. Água mole/remoção de dureza seria abrandador.' },

  { id: 'q49', tema: 'crm', tipo: 'vf',
    enunciado: 'Registrar o motivo de perda real (preço, foi de abrandador, sumiu, adiou) é importante porque a amostra de Scale Stop é pequena.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 0, explicacao: 'Verdadeiro. Com poucas vendas, cada motivo de perda bem registrado é inteligência valiosa da linha.' },

  { id: 'q50', tema: 'crm', tipo: 'vf',
    enunciado: 'Deixar o próximo passo sem data no card é aceitável porque o ciclo é longo.',
    opcoes: ['Verdadeiro', 'Falso'],
    correta: 1, explicacao: 'Falso. Justamente porque o ciclo é ~12 dias, sem data com hora o lead esfria. Sempre agende o retorno.' },
];

module.exports = { QUESTOES };
