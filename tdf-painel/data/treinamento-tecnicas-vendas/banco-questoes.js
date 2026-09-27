// Banco de Questões - Prova Final: Técnicas Avançadas de Vendas
// Academia Tudo de Filtro
// 60 questões distribuídas por 5 livros + questões mistas/aplicadas
// Tipos: 'multipla' (4 opções), 'vf' (V/F 2 opções), 'cenario' (cenário 4 opções)

const QUESTOES = [
  // =============================================
  // SPIN SELLING (12 questões: q1-q12)
  // =============================================
  {
    id: 'q1',
    tema: 'SPIN Selling',
    tipo: 'multipla',
    enunciado: 'Na metodologia SPIN Selling, qual é a sequência correta das perguntas que um Closer da TDF deve seguir ao abordar um cliente interessado em Filtro de Entrada?',
    opcoes: [
      'Situação, Problema, Implicação, Necessidade de Solução',
      'Solução, Problema, Investigação, Negociação',
      'Situação, Proposta, Informação, Necessidade',
      'Solicitação, Problema, Implicação, Negociação'
    ],
    correta: 0,
    explicacao: 'SPIN = Situação, Problema, Implicação, Necessidade de Solução. Essa sequência guia o cliente a perceber sozinho o valor da solução antes de apresentar o produto.'
  },
  {
    id: 'q2',
    tema: 'SPIN Selling',
    tipo: 'cenario',
    enunciado: 'Um cliente liga dizendo que a água do poço artesiano tem cheiro de ferro. O SDR qualificou e passou para o Closer. Qual pergunta de IMPLICAÇÃO o Closer deve fazer?',
    opcoes: [
      '"Você tem poço artesiano há quanto tempo?"',
      '"Se esse ferro continuar danificando seus equipamentos e encanamento, quanto você estima que vai gastar em manutenção nos próximos 2 anos?"',
      '"Você já conhece nosso Iron Free?"',
      '"Qual o tamanho do seu poço?"'
    ],
    correta: 1,
    explicacao: 'Perguntas de Implicação ampliam a dor do cliente mostrando consequências futuras. Fazer o cliente calcular o custo de NÃO resolver o problema torna o investimento no Iron Free (R$13.990-R$31.900) justificável.'
  },
  {
    id: 'q3',
    tema: 'SPIN Selling',
    tipo: 'vf',
    enunciado: 'No SPIN Selling, o Closer da TDF deve apresentar o preço do Filtro de Entrada (R$3.490-R$10.990) logo no início da conversa para demonstrar transparência.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. No SPIN Selling, apresentar o preço antes de desenvolver as perguntas de Situação, Problema e Implicação faz o cliente julgar apenas pelo valor, sem perceber o real impacto da solução. Primeiro construímos o valor, depois revelamos o investimento.'
  },
  {
    id: 'q4',
    tema: 'SPIN Selling',
    tipo: 'multipla',
    enunciado: 'Um Closer está atendendo um cliente que precisa de Scale Stop para proteger equipamentos industriais. Qual é o melhor exemplo de pergunta de NECESSIDADE DE SOLUÇÃO?',
    opcoes: [
      '"Você sabia que o Scale Stop custa a partir de R$8.990?"',
      '"Se existisse uma solução que impedisse a incrustação sem usar sal e sem manutenção constante, como isso impactaria sua operação?"',
      '"Há quanto tempo você tem problema com calcário?"',
      '"Quantos funcionários trabalham na sua fábrica?"'
    ],
    correta: 1,
    explicacao: 'Perguntas de Necessidade de Solução fazem o CLIENTE verbalizar os benefícios da solução. Quando ele mesmo diz o valor, a resistência ao preço diminui drasticamente.'
  },
  {
    id: 'q5',
    tema: 'SPIN Selling',
    tipo: 'cenario',
    enunciado: 'O SDR recebe um lead de um restaurante com 3 bebedouros antigos. O lead foi qualificado e o Closer inicia a abordagem. Qual sequência SPIN está correta?',
    opcoes: [
      'S: "Quantos colaboradores usam os bebedouros?" → P: "Já teve problema com a qualidade da água servida?" → I: "Se um cliente passar mal por causa da água, quanto isso custaria em reputação e processo?" → N: "Se você tivesse bebedouros industriais novos com filtração certificada, como isso afetaria a confiança dos seus clientes?"',
      'Apresentar catálogo → Falar do preço → Pedir o fechamento',
      'N: "Você precisa de bebedouros novos" → S: "Quantos tem?" → P: "Estão velhos, né?" → I: "Vai gastar muito com conserto"',
      'I: "Sua água é ruim" → P: "Você tem problema" → S: "Me conta sobre o restaurante" → N: "Compre nosso bebedouro"'
    ],
    correta: 0,
    explicacao: 'A sequência correta segue S→P→I→N. Cada etapa constrói sobre a anterior, levando o cliente a concluir sozinho que precisa dos Bebedouros Industriais TDF (R$1.590-R$3.413).'
  },
  {
    id: 'q6',
    tema: 'SPIN Selling',
    tipo: 'vf',
    enunciado: 'Segundo o SPIN Selling, quanto mais perguntas de Situação o SDR fizer na qualificação, maior a chance de converter o lead.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. Excesso de perguntas de Situação entedia o cliente. Elas são necessárias, mas devem ser limitadas ao essencial. O SDR deve coletar dados básicos e rapidamente avançar para perguntas de Problema.'
  },
  {
    id: 'q7',
    tema: 'SPIN Selling',
    tipo: 'multipla',
    enunciado: 'Na venda de Iron Free para um cliente com poço artesiano, qual pergunta de PROBLEMA é mais eficaz?',
    opcoes: [
      '"Quantos litros por hora seu poço produz?"',
      '"Você já percebeu manchas alaranjadas nas louças, roupas ou equipamentos por causa do ferro na água?"',
      '"Você conhece a tecnologia de remoção de ferro?"',
      '"Quando foi a última vez que fez manutenção no poço?"'
    ],
    correta: 1,
    explicacao: 'Perguntas de Problema revelam dificuldades explícitas que o cliente enfrenta. Manchas em louças e roupas são sintomas visíveis e emocionais que conectam o cliente à sua dor real.'
  },
  {
    id: 'q8',
    tema: 'SPIN Selling',
    tipo: 'cenario',
    enunciado: 'Um Closer da TDF está vendendo um Filtro de Entrada de R$6.990 para uma família. O marido está convencido, mas a esposa acha caro. Usando SPIN, qual a melhor abordagem?',
    opcoes: [
      'Dar desconto para a esposa concordar',
      'Ignorar a esposa e fechar com o marido',
      'Fazer perguntas de Implicação direcionadas à esposa: "Dona Maria, a senhora já reparou no sedimento que vai se acumulando na caixa d\'água? E quanto já foi gasto com manutenção do aquecedor e da máquina de lavar, ou com roupas e louças manchadas pela água sem filtro?"',
      'Pedir para o marido convencer a esposa depois'
    ],
    correta: 2,
    explicacao: 'O SPIN Selling ensina a envolver todos os decisores. Perguntas de Implicação personalizadas para a esposa fazem ELA perceber o custo de não ter o filtro, gerando convicção própria em vez de pressão.'
  },
  {
    id: 'q9',
    tema: 'SPIN Selling',
    tipo: 'multipla',
    enunciado: 'No contexto da TDF, qual a principal diferença entre necessidades implícitas e explícitas segundo o SPIN Selling?',
    opcoes: [
      'Implícitas são baratas e explícitas são caras',
      'Implícitas são quando o cliente menciona problemas ou insatisfações; explícitas são quando ele declara desejos ou intenções claras de ação',
      'Implícitas são do SDR e explícitas são do Closer',
      'Não há diferença prática entre elas'
    ],
    correta: 1,
    explicacao: 'Necessidades implícitas ("minha água tem gosto ruim") precisam ser desenvolvidas em explícitas ("preciso de um filtro que resolva isso") através de perguntas de Implicação e Necessidade de Solução.'
  },
  {
    id: 'q10',
    tema: 'SPIN Selling',
    tipo: 'vf',
    enunciado: 'No SPIN Selling, perguntas de Necessidade de Solução são especialmente úteis quando há múltiplos decisores, pois fazem o próprio cliente "vender" a solução internamente.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 0,
    explicacao: 'Verdadeiro. Quando o cliente verbaliza os benefícios ("Se eu tivesse água filtrada, pararia de trocar resistência de chuveiro e de gastar com manutenção da máquina de lavar toda hora"), ele se torna um defensor interno da compra, facilitando aprovação de outros decisores.'
  },
  {
    id: 'q11',
    tema: 'SPIN Selling',
    tipo: 'cenario',
    enunciado: 'Um SDR recebe um lead de uma fazenda que usa água de poço com alto teor de ferro. O fazendeiro diz: "A água aqui é meio amarelada, mas a gente se acostumou." Qual a melhor resposta SPIN?',
    opcoes: [
      '"Posso te enviar o catálogo do Iron Free?"',
      '"Entendo. Me conta, essa água amarelada já causou algum problema nos equipamentos de irrigação ou nos bebedouros dos animais?"',
      '"Você precisa urgente de um Iron Free, isso é perigoso!"',
      '"Legal, então não precisa de nada por enquanto."'
    ],
    correta: 1,
    explicacao: 'O cliente minimizou o problema (necessidade implícita). A pergunta de Problema/Implicação faz ele perceber consequências que não havia considerado, transformando em necessidade explícita.'
  },
  {
    id: 'q12',
    tema: 'SPIN Selling',
    tipo: 'multipla',
    enunciado: 'Segundo o SPIN Selling, em vendas de alto valor como o Iron Free (R$13.990-R$31.900), qual comportamento do vendedor está mais correlacionado com o sucesso?',
    opcoes: [
      'Falar mais sobre características técnicas do produto',
      'Fazer mais perguntas de Implicação e Necessidade de Solução',
      'Oferecer mais descontos',
      'Enviar mais materiais por e-mail'
    ],
    correta: 1,
    explicacao: 'Pesquisas do SPIN Selling mostram que em vendas complexas e de alto valor, a quantidade de perguntas de Implicação e Necessidade de Solução é o maior preditor de sucesso. Características técnicas só importam depois que o valor foi construído.'
  },

  // =============================================
  // INTELIGÊNCIA EMOCIONAL (10 questões: q13-q22)
  // =============================================
  {
    id: 'q13',
    tema: 'Inteligência Emocional',
    tipo: 'multipla',
    enunciado: 'Um Closer da TDF acabou de perder uma venda de Scale Stop de R$17.990 após 3 reuniões. Qual atitude demonstra maior inteligência emocional?',
    opcoes: [
      'Culpar o SDR pela má qualificação do lead',
      'Analisar o que poderia ter feito diferente, registrar os aprendizados e seguir para o próximo lead com energia renovada',
      'Desabafar no grupo do WhatsApp da equipe sobre o cliente difícil',
      'Ligar para o cliente e pressionar mais uma vez'
    ],
    correta: 1,
    explicacao: 'Inteligência emocional envolve autoconsciência e autorregulação. Processar a perda com análise racional, sem culpar outros ou se deixar abater, é o que diferencia vendedores de alta performance.'
  },
  {
    id: 'q14',
    tema: 'Inteligência Emocional',
    tipo: 'vf',
    enunciado: 'Um vendedor com alta inteligência emocional nunca sente frustração ao perder uma venda.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. Inteligência emocional não é ausência de emoções, mas sim a capacidade de reconhecê-las e gerenciá-las. Sentir frustração é natural; o diferencial é não deixar que ela contamine as próximas interações.'
  },
  {
    id: 'q15',
    tema: 'Inteligência Emocional',
    tipo: 'cenario',
    enunciado: 'Durante uma visita técnica (R$800), o cliente começa a gritar dizendo que o preço do Filtro de Entrada é "um roubo". Como o técnico/vendedor deve reagir?',
    opcoes: [
      'Gritar de volta defendendo o produto',
      'Sair da casa do cliente imediatamente',
      'Manter a calma, validar o sentimento ("Entendo sua preocupação com o investimento"), e redirecionar para o valor: "Posso mostrar quanto você economiza por mês comparado a comprar água?"',
      'Dar desconto imediato para acalmar o cliente'
    ],
    correta: 2,
    explicacao: 'A técnica de validação emocional + redirecionamento racional é fundamental. Primeiro acolhemos a emoção do cliente, depois guiamos para uma análise lógica do custo-benefício.'
  },
  {
    id: 'q16',
    tema: 'Inteligência Emocional',
    tipo: 'multipla',
    enunciado: 'Qual dos cinco pilares da inteligência emocional é MAIS importante para um SDR da TDF que faz 40 ligações por dia e ouve muitos "não"?',
    opcoes: [
      'Habilidade social',
      'Automotivação',
      'Empatia',
      'Autoconsciência'
    ],
    correta: 1,
    explicacao: 'A automotivação é crucial para SDRs que enfrentam rejeição constante. É a capacidade de manter-se engajado e positivo mesmo após múltiplas negativas, focando no processo e não apenas nos resultados imediatos.'
  },
  {
    id: 'q17',
    tema: 'Inteligência Emocional',
    tipo: 'cenario',
    enunciado: 'Um Closer percebe que o cliente está ansioso e indeciso sobre comprar o Iron Free de R$24.990. O cliente diz: "Preciso pensar..." Qual abordagem usa inteligência emocional?',
    opcoes: [
      '"Não tem o que pensar, é agora ou nunca!"',
      '"Ok, pensa e me liga quando quiser" (e nunca mais faz follow-up)',
      '"Entendo perfeitamente. Decisão importante merece reflexão. O que exatamente te deixa em dúvida? Às vezes posso ajudar com informações que facilitem sua análise."',
      '"Se não fechar hoje, o preço vai subir amanhã."'
    ],
    correta: 2,
    explicacao: 'Empatia + investigação gentil. Ao validar o direito do cliente de pensar e perguntar sobre a dúvida específica, o Closer demonstra respeito e ainda tem chance de resolver a objeção real.'
  },
  {
    id: 'q18',
    tema: 'Inteligência Emocional',
    tipo: 'vf',
    enunciado: 'A empatia na venda significa concordar com tudo que o cliente diz, mesmo quando ele está equivocado sobre o produto.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. Empatia é compreender o ponto de vista do cliente, não concordar com tudo. Um vendedor empático entende a perspectiva do cliente, mas pode educá-lo com respeito quando há informações incorretas.'
  },
  {
    id: 'q19',
    tema: 'Inteligência Emocional',
    tipo: 'multipla',
    enunciado: 'No contexto da TDF, o que é "sequestro da amígdala" e como afeta a venda?',
    opcoes: [
      'É quando o cliente sequestra a negociação e impõe o preço',
      'É uma reação emocional intensa que faz o vendedor perder a racionalidade — por exemplo, quando um Closer se irrita com objeção de preço e começa a argumentar de forma agressiva',
      'É uma técnica de fechamento agressivo',
      'É quando o SDR esquece o script de qualificação'
    ],
    correta: 1,
    explicacao: 'O sequestro da amígdala ocorre quando emoções intensas dominam o raciocínio. Na venda, pode fazer o Closer reagir defensivamente a objeções, prejudicando a relação e perdendo a venda.'
  },
  {
    id: 'q20',
    tema: 'Inteligência Emocional',
    tipo: 'cenario',
    enunciado: 'O SDR está tendo um dia péssimo: perdeu 3 leads seguidos. O próximo lead é de um condomínio com potencial para Filtro de Entrada de R$10.990. O que fazer?',
    opcoes: [
      'Transferir o lead para outro SDR porque não está no clima',
      'Fazer uma pausa de 5 minutos, respirar, resetar o estado emocional e atender o lead com energia renovada — cada lead é uma nova oportunidade independente',
      'Atender rápido e sem entusiasmo para tirar da frente',
      'Reclamar com o gestor que os leads estão ruins'
    ],
    correta: 1,
    explicacao: 'Autorregulação emocional: reconhecer o estado emocional negativo, usar técnicas de reset (respiração, pausa) e separar resultados anteriores da próxima oportunidade. Cada lead merece o melhor atendimento.'
  },
  {
    id: 'q21',
    tema: 'Inteligência Emocional',
    tipo: 'multipla',
    enunciado: 'Como a inteligência emocional ajuda na passagem de bastão entre SDR e Closer na TDF?',
    opcoes: [
      'Não tem relação — é processo, não emoção',
      'O SDR com empatia entende as necessidades emocionais do lead e as comunica ao Closer, que inicia a conversa já calibrado ao estado emocional do cliente',
      'O Closer deve ignorar o que o SDR relatou e começar do zero',
      'A inteligência emocional só se aplica ao atendimento presencial'
    ],
    correta: 1,
    explicacao: 'A passagem de bastão emocional é tão importante quanto a informacional. Saber que o cliente está ansioso, empolgado ou desconfiado permite ao Closer calibrar tom e abordagem desde o primeiro contato.'
  },
  {
    id: 'q22',
    tema: 'Inteligência Emocional',
    tipo: 'vf',
    enunciado: 'Vendedores com alta inteligência emocional tendem a ter melhores resultados em vendas consultivas de alto valor como Filtro de Entrada e Iron Free porque constroem confiança mais rapidamente.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 0,
    explicacao: 'Verdadeiro. Em vendas de alto valor, a confiança é fator decisivo. Vendedores emocionalmente inteligentes leem melhor o cliente, adaptam sua comunicação e constroem rapport genuíno, acelerando o ciclo de venda.'
  },

  // =============================================
  // OBJEÇÕES (12 questões: q23-q34)
  // =============================================
  {
    id: 'q23',
    tema: 'Objeções',
    tipo: 'multipla',
    enunciado: 'Quando o cliente diz "O Filtro de Entrada de R$6.990 é muito caro", qual é a primeira coisa que o Closer deve fazer?',
    opcoes: [
      'Oferecer desconto imediatamente',
      'Concordar que é caro e mudar de assunto',
      'Ouvir, validar a preocupação e investigar: "Caro comparado a quê? Me ajuda a entender sua referência de valor."',
      'Argumentar que o produto vale cada centavo'
    ],
    correta: 2,
    explicacao: 'Antes de rebater, é preciso entender a objeção real. "Caro" pode significar: não vê valor, não tem orçamento, está comparando com concorrente, ou é apenas reflexo de negociação. Cada caso exige resposta diferente.'
  },
  {
    id: 'q24',
    tema: 'Objeções',
    tipo: 'cenario',
    enunciado: 'Um cliente diz: "Achei um filtro de entrada por R$1.500 na internet. Por que o de vocês custa R$5.490?" Como responder?',
    opcoes: [
      '"Nosso produto é melhor, confia em mim."',
      '"Entendo a comparação. Posso te mostrar as diferenças? O nosso tem especificações comprovadas em ficha técnica oficial, vazão real garantida, mídia filtrante de longa duração e instalação profissional própria (R$590, item da proposta). Aquele de R$1.500 cobre tudo isso? Vamos comparar item a item."',
      '"Então compra aquele."',
      '"Posso igualar o preço."'
    ],
    correta: 1,
    explicacao: 'A técnica de isolamento e comparação detalhada desmonta a objeção de preço com fatos. Não se ataca o concorrente, mas se evidencia o que compõe o valor, especialmente a instalação profissional de R$590.'
  },
  {
    id: 'q25',
    tema: 'Objeções',
    tipo: 'vf',
    enunciado: 'Na TDF, o Closer pode oferecer desconto no valor do produto (Filtro de Entrada, Iron Free, Scale Stop) como estratégia de negociação.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. A política da TDF é: NUNCA dar desconto no produto. A alavanca de negociação é a instalação de R$590, bonificada apenas no fechamento e com justificativa logística. O valor do produto é inegociável.'
  },
  {
    id: 'q26',
    tema: 'Objeções',
    tipo: 'multipla',
    enunciado: 'O cliente diz: "Preciso falar com minha esposa antes de decidir sobre o Scale Stop de R$12.990." Qual a melhor abordagem?',
    opcoes: [
      '"Fecha agora e surpreende ela!"',
      '"Perfeito, decisão importante deve ser em conjunto. Que tal agendarmos uma conversa rápida com ela presente? Assim posso tirar as dúvidas dela também e vocês decidem com todas as informações."',
      '"Tudo bem, me liga quando decidir."',
      '"Se não fechar agora, perco a condição."'
    ],
    correta: 1,
    explicacao: 'A objeção "preciso falar com cônjuge" muitas vezes é legítima em vendas de alto valor. A melhor estratégia é incluir o outro decisor na conversa, não pressionar para fechar sem ele.'
  },
  {
    id: 'q27',
    tema: 'Objeções',
    tipo: 'cenario',
    enunciado: 'Após a visita técnica de R$800, o técnico apresenta o orçamento de R$8.990 para Filtro de Entrada. O cliente diz: "Vou pesquisar outros orçamentos." O que fazer?',
    opcoes: [
      '"Fique à vontade para pesquisar" e ir embora',
      '"Claro, pesquisar é importante. Só para eu te ajudar na comparação: quando avaliar outros orçamentos, verifique se incluem visita técnica, dimensionamento personalizado, instalação profissional e garantia como a nossa. Posso deixar um checklist comparativo?"',
      '"Se pesquisar vai encontrar mais caro"',
      '"Só consigo manter esse preço hoje"'
    ],
    correta: 1,
    explicacao: 'A técnica de "armar o cliente" para comparar cria critérios de avaliação que favorecem a TDF. O checklist comparativo posiciona a TDF como referência e dificulta que concorrentes inferiores pareçam equivalentes.'
  },
  {
    id: 'q28',
    tema: 'Objeções',
    tipo: 'multipla',
    enunciado: 'Qual a diferença entre uma objeção real e uma objeção cortina de fumaça?',
    opcoes: [
      'Não existe diferença — toda objeção é real',
      'Objeção real é o verdadeiro motivo da hesitação; cortina de fumaça é uma desculpa que esconde a razão verdadeira (ex: diz "vou pensar" mas na verdade não tem orçamento)',
      'Objeção real vem do decisor; cortina de fumaça vem de influenciadores',
      'Objeção real aparece no início; cortina de fumaça no final da venda'
    ],
    correta: 1,
    explicacao: 'Identificar se a objeção é real ou cortina de fumaça é crucial. A técnica é perguntar: "Além do preço, existe alguma outra coisa que te impede de avançar?" — isso revela a objeção verdadeira.'
  },
  {
    id: 'q29',
    tema: 'Objeções',
    tipo: 'vf',
    enunciado: 'Quando o cliente objeta o preço do Iron Free, o Closer pode oferecer a instalação de R$590 como cortesia para facilitar o fechamento.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 0,
    explicacao: 'Verdadeiro. A instalação de R$590 é a única alavanca de negociação da TDF. Pode ser bonificada no fechamento, com justificativa logística (ex.: equipe já na região), desde que o valor do produto seja mantido integralmente.'
  },
  {
    id: 'q30',
    tema: 'Objeções',
    tipo: 'cenario',
    enunciado: 'O cliente diz: "O bebedouro industrial de R$2.890 da TDF é bonito, mas tenho medo de dar problema e não ter suporte." Como tratar essa objeção?',
    opcoes: [
      '"Não vai dar problema, pode confiar."',
      '"Entendo sua preocupação. Nosso suporte é referência: temos equipe técnica própria, peças de reposição em estoque e refil avulso a R$64 (ou combo de 3 por R$159) com entrega rápida. Posso te mostrar depoimentos de clientes que usam há anos?"',
      '"Todos os produtos dão problema eventualmente."',
      '"Compra de outra marca então."'
    ],
    correta: 1,
    explicacao: 'Objeções de risco/confiança são tratadas com provas sociais, garantias concretas e demonstração de estrutura de suporte. Nunca minimize a preocupação do cliente.'
  },
  {
    id: 'q31',
    tema: 'Objeções',
    tipo: 'multipla',
    enunciado: 'Qual técnica de tratamento de objeção é mais eficaz quando o cliente diz "está caro" para o Scale Stop de R$14.990?',
    opcoes: [
      'Técnica do "Bumerangue": transformar a objeção em razão de compra — "Justamente por ser um investimento significativo é que você precisa da melhor tecnologia, que não vai te dar dor de cabeça depois."',
      'Ignorar e continuar apresentando features',
      'Contar a história da empresa',
      'Perguntar se o cliente quer parcelar'
    ],
    correta: 0,
    explicacao: 'O Bumerangue transforma a objeção em argumento de venda. O próprio fato de ser um investimento importante reforça que a escolha deve ser pela melhor solução, não a mais barata.'
  },
  {
    id: 'q32',
    tema: 'Objeções',
    tipo: 'vf',
    enunciado: 'O vendedor da TDF deve tratar TODAS as objeções antes de tentar o fechamento. Se restarem objeções não tratadas, o fechamento vai fracassar.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. Nem toda objeção precisa ser 100% resolvida. Algumas são menores e o cliente avança mesmo assim. O importante é tratar as objeções principais (preço, confiança, timing) e testar o fechamento.'
  },
  {
    id: 'q33',
    tema: 'Objeções',
    tipo: 'cenario',
    enunciado: 'Cliente: "Vou instalar eu mesmo para economizar os R$590 de instalação." Como o Closer deve responder?',
    opcoes: [
      '"Tudo bem, você economiza R$590."',
      '"Não pode, só nós instalamos."',
      '"Entendo a vontade de economizar. Porém, a instalação profissional garante o dimensionamento correto, evita vazamentos e mantém a garantia integral do produto. Se tiver qualquer problema por instalação inadequada, o custo de reparo pode ser bem maior que R$590. E olha, estou aqui justamente para encontrar a melhor condição pra você."',
      '"Se instalar errado, o produto explode."'
    ],
    correta: 2,
    explicacao: 'Mostrar o risco da autoinstalação sem ser alarmista, vincular instalação à garantia e abrir espaço para negociar a cortesia da instalação é a abordagem ideal.'
  },
  {
    id: 'q34',
    tema: 'Objeções',
    tipo: 'multipla',
    enunciado: 'Quando o cliente apresenta uma objeção, qual é a sequência correta de tratamento?',
    opcoes: [
      'Rebater → Argumentar → Fechar',
      'Ouvir → Validar/Empatizar → Investigar a objeção real → Responder com valor → Confirmar se resolveu → Avançar',
      'Ignorar → Mudar de assunto → Tentar fechar',
      'Concordar com tudo → Dar desconto → Fechar'
    ],
    correta: 1,
    explicacao: 'A sequência completa de tratamento de objeções garante que o cliente se sinta ouvido, que a objeção real seja identificada e que a resposta gere valor real antes de avançar.'
  },

  // =============================================
  // A MÁQUINA DEFINITIVA DE VENDAS (8 questões: q35-q42)
  // =============================================
  {
    id: 'q35',
    tema: 'Máquina Definitiva de Vendas',
    tipo: 'multipla',
    enunciado: 'Segundo "A Máquina Definitiva de Vendas" de Chet Holmes, qual conceito se aplica diretamente à equipe de Closers da TDF?',
    opcoes: [
      'Fazer mil coisas uma vez',
      'Fazer 12 coisas, 4.000 vezes cada — dominar poucos processos com maestria através de repetição disciplinada',
      'Inventar uma técnica nova para cada cliente',
      'Trocar de estratégia toda semana'
    ],
    correta: 1,
    explicacao: 'Chet Holmes defende a maestria por repetição. Na TDF, isso significa que o Closer deve dominar profundamente o script SPIN, o tratamento de objeções e o fechamento, praticando até virar segunda natureza.'
  },
  {
    id: 'q36',
    tema: 'Máquina Definitiva de Vendas',
    tipo: 'vf',
    enunciado: 'Segundo a Máquina Definitiva de Vendas, o treinamento da equipe de vendas deve ser um evento pontual e intensivo, não um processo contínuo.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. Chet Holmes defende que treinamento deve ser contínuo e repetitivo. Uma hora por semana de treinamento constante supera um workshop de uma semana feito uma vez. Na TDF, o treinamento semanal é essencial.'
  },
  {
    id: 'q37',
    tema: 'Máquina Definitiva de Vendas',
    tipo: 'cenario',
    enunciado: 'A TDF quer implementar o conceito de "Education-Based Marketing" (Marketing Baseado em Educação) de Chet Holmes. Qual estratégia está mais alinhada?',
    opcoes: [
      'Criar anúncios gritando "PROMOÇÃO! Filtro com 50% OFF!"',
      'Produzir conteúdo educativo como "7 Sinais de que a Água da Sua Casa Está Prejudicando Sua Saúde" para atrair leads qualificados que já entendem o problema antes de falar com o SDR',
      'Enviar spam com fotos dos produtos',
      'Ligar para números aleatórios oferecendo filtros'
    ],
    correta: 1,
    explicacao: 'O Education-Based Marketing educa o cliente sobre o PROBLEMA antes de vender a SOLUÇÃO. Leads que chegam já educados sobre os riscos da água não filtrada convertem mais e aceitam melhor o preço.'
  },
  {
    id: 'q38',
    tema: 'Máquina Definitiva de Vendas',
    tipo: 'multipla',
    enunciado: 'O conceito de "Dream 100" de Chet Holmes aplicado à TDF significaria:',
    opcoes: [
      'Ter 100 produtos no catálogo',
      'Identificar os 100 clientes/parceiros ideais (construtoras, condomínios grandes, indústrias) e criar uma estratégia persistente e personalizada para conquistá-los',
      'Fazer 100 ligações por dia',
      'Ter 100 funcionários na equipe comercial'
    ],
    correta: 1,
    explicacao: 'O Dream 100 foca esforço concentrado nos clientes de maior potencial. Para a TDF, podem ser grandes condomínios, construtoras ou indústrias que comprariam múltiplos Filtros de Entrada ou Iron Free.'
  },
  {
    id: 'q39',
    tema: 'Máquina Definitiva de Vendas',
    tipo: 'vf',
    enunciado: 'Segundo Chet Holmes, apenas 3% do mercado está comprando ativamente agora. A TDF deve focar seus esforços de marketing APENAS nesses 3%.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. Holmes ensina que 3% compram agora, 7% estão abertos, 30% não estão pensando nisso, 30% acham que não precisam e 30% sabem que não precisam. O Education-Based Marketing alcança os 37% que podem ser educados.'
  },
  {
    id: 'q40',
    tema: 'Máquina Definitiva de Vendas',
    tipo: 'cenario',
    enunciado: 'O gestor da TDF percebe que cada vendedor usa um método diferente para apresentar o Filtro de Entrada. Usando o princípio da Máquina Definitiva de Vendas, o que fazer?',
    opcoes: [
      'Deixar cada um vender do seu jeito, pois criatividade é importante',
      'Criar um processo padronizado de apresentação baseado nas melhores práticas dos top performers, treinar toda equipe nesse processo e refiná-lo continuamente com role-plays semanais',
      'Contratar novos vendedores que já venham treinados',
      'Comprar um software de vendas'
    ],
    correta: 1,
    explicacao: 'A Máquina Definitiva exige processos padronizados e replicáveis. Identificar o que os melhores fazem, sistematizar e treinar todos garante resultados consistentes, não dependentes de talentos individuais.'
  },
  {
    id: 'q41',
    tema: 'Máquina Definitiva de Vendas',
    tipo: 'multipla',
    enunciado: 'Chet Holmes fala sobre "pigheaded discipline" (disciplina obstinada). Na TDF, isso se traduz em:',
    opcoes: [
      'Ser teimoso com o cliente até ele comprar',
      'Manter disciplina implacável nos processos diários: número de follow-ups, qualidade dos registros no CRM, role-plays semanais — mesmo quando os resultados demoram a aparecer',
      'Trabalhar 16 horas por dia sem parar',
      'Nunca mudar nenhum processo, mesmo que não funcione'
    ],
    correta: 1,
    explicacao: 'Disciplina obstinada é sobre consistência nos processos comprovados, não sobre teimosia cega. É fazer o básico bem feito todos os dias, sem pular etapas mesmo quando a motivação está baixa.'
  },
  {
    id: 'q42',
    tema: 'Máquina Definitiva de Vendas',
    tipo: 'multipla',
    enunciado: 'Segundo a Máquina Definitiva de Vendas, qual o papel do gestor comercial da TDF no treinamento da equipe?',
    opcoes: [
      'Apenas cobrar resultados e metas',
      'Delegar 100% do treinamento para o RH',
      'Ser o principal treinador: conduzir role-plays semanais, corrigir comportamentos em tempo real e elevar o padrão da equipe constantemente',
      'Contratar consultores externos para todo treinamento'
    ],
    correta: 2,
    explicacao: 'Holmes defende que o líder de vendas é o treinador principal. Na TDF, o gestor deve conduzir práticas semanais, simular atendimentos e dar feedback direto, construindo uma cultura de melhoria contínua.'
  },

  // =============================================
  // RECEITA PREVISÍVEL (8 questões: q43-q50)
  // =============================================
  {
    id: 'q43',
    tema: 'Receita Previsível',
    tipo: 'multipla',
    enunciado: 'Segundo "Receita Previsível" de Aaron Ross, por que a TDF separa SDRs de Closers em vez de ter um vendedor que faz tudo?',
    opcoes: [
      'Porque SDRs são mais baratos',
      'Porque a especialização aumenta a eficiência: SDRs focam em qualificar volume de leads sem a pressão de fechar, e Closers focam em converter leads já qualificados sem perder tempo prospectando',
      'Porque é moda no mercado',
      'Porque os Closers não gostam de prospectar'
    ],
    correta: 1,
    explicacao: 'Aaron Ross provou na Salesforce que separar prospecção de fechamento aumenta drasticamente a produtividade. Na TDF, SDRs qualificam leads de poço, filtro ou bebedouro, e Closers convertem com técnica SPIN.'
  },
  {
    id: 'q44',
    tema: 'Receita Previsível',
    tipo: 'vf',
    enunciado: 'Segundo Receita Previsível, o SDR da TDF deve tentar fechar a venda diretamente quando percebe que o lead está muito interessado.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 1,
    explicacao: 'Falso. O SDR qualifica e agenda; o Closer fecha. Mesmo com lead muito quente, o SDR deve fazer uma passagem de bastão profissional. Misturar papéis quebra a previsibilidade do processo.'
  },
  {
    id: 'q45',
    tema: 'Receita Previsível',
    tipo: 'cenario',
    enunciado: 'A TDF quer tornar a receita mais previsível. Atualmente, 80% das vendas vêm de indicações espontâneas e 20% de outbound. Segundo Aaron Ross, qual o risco?',
    opcoes: [
      'Nenhum risco — indicações são o melhor canal',
      'Dependência excessiva de um canal não controlável. Se as indicações caírem, a receita despenca. A TDF precisa desenvolver canais controlados (outbound, inbound, parcerias) para ter previsibilidade.',
      'O risco é que outbound é mais caro',
      'O risco é ter vendedores demais'
    ],
    correta: 1,
    explicacao: 'Receita Previsível exige diversificação de canais controlados. Indicações são ótimas mas imprevisíveis. A TDF precisa de processos de outbound e inbound que gerem volume consistente de leads.'
  },
  {
    id: 'q46',
    tema: 'Receita Previsível',
    tipo: 'multipla',
    enunciado: 'No modelo de Receita Previsível, quais são os 3 tipos de leads que a TDF deve gerenciar?',
    opcoes: [
      'Quentes, mornos e frios',
      'Seeds (indicações/boca a boca), Nets (inbound/marketing) e Spears (outbound proativo)',
      'Pequenos, médios e grandes',
      'Online, offline e híbridos'
    ],
    correta: 1,
    explicacao: 'Seeds são orgânicos (indicações de clientes satisfeitos com TDF), Nets vêm do marketing (anúncios sobre qualidade de água), Spears são prospecção ativa (SDR ligando para condomínios ou indústrias).'
  },
  {
    id: 'q47',
    tema: 'Receita Previsível',
    tipo: 'vf',
    enunciado: 'Segundo Receita Previsível, a meta de um SDR da TDF deve ser baseada em número de reuniões qualificadas agendadas para os Closers, não em receita fechada.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 0,
    explicacao: 'Verdadeiro. O SDR é medido por output do seu processo: leads qualificados e reuniões agendadas. A receita fechada é métrica do Closer. Cada papel tem suas métricas específicas para manter a previsibilidade.'
  },
  {
    id: 'q48',
    tema: 'Receita Previsível',
    tipo: 'cenario',
    enunciado: 'A TDF tem 2 SDRs que geram 40 leads qualificados/mês e 2 Closers que fecham 15 vendas/mês. A empresa quer dobrar a receita. Segundo Receita Previsível, qual a abordagem correta?',
    opcoes: [
      'Pressionar os Closers a fechar mais',
      'Analisar o funil: se os Closers convertem 37,5% dos leads, dobrar a receita exige dobrar os leads qualificados. Contratar mais 2 SDRs ou otimizar os canais de geração antes de adicionar Closers.',
      'Dar mais desconto para fechar mais',
      'Trocar os vendedores atuais'
    ],
    correta: 1,
    explicacao: 'Receita Previsível ensina a analisar cada etapa do funil. Se a taxa de conversão dos Closers é boa (37,5%), o gargalo está na geração de leads. Dobrar o input de leads qualificados dobra o output de vendas.'
  },
  {
    id: 'q49',
    tema: 'Receita Previsível',
    tipo: 'multipla',
    enunciado: 'Aaron Ross enfatiza que o tempo de resposta ao lead é crucial. Na TDF, qual o impacto prático disso?',
    opcoes: [
      'Não faz diferença — o cliente espera',
      'Lead que pede orçamento de Filtro de Entrada deve ser contatado pelo SDR em menos de 5 minutos para maximizar conversão. A cada hora de atraso, a probabilidade de qualificação cai drasticamente.',
      'O ideal é esperar 24h para não parecer desesperado',
      'Só importa para leads de alto valor como Iron Free'
    ],
    correta: 1,
    explicacao: 'Estudos mostram que contato em até 5 minutos tem 21x mais chance de qualificar o lead do que após 30 minutos. Na TDF, speed-to-lead é métrica crítica para todo tipo de lead.'
  },
  {
    id: 'q50',
    tema: 'Receita Previsível',
    tipo: 'multipla',
    enunciado: 'No conceito de Receita Previsível, o que é o "Cold Call 2.0" e como a TDF pode aplicá-lo?',
    opcoes: [
      'Ligar para números aleatórios de listas compradas',
      'Prospecção outbound inteligente: identificar empresas-alvo (ex: condomínios com água de poço), enviar e-mail personalizado pedindo indicação do decisor, e só ligar após obter o contato certo',
      'Fazer ligações automáticas com robô',
      'Enviar mensagens em massa no WhatsApp'
    ],
    correta: 1,
    explicacao: 'Cold Call 2.0 é prospecção outbound com pesquisa prévia. Para a TDF, significa identificar condomínios/indústrias com problemas de água, fazer contato inteligente e chegar ao decisor com relevância.'
  },

  // =============================================
  // QUESTÕES MISTAS/APLICADAS (10 questões: q51-q60)
  // =============================================
  {
    id: 'q51',
    tema: 'Aplicação Integrada',
    tipo: 'cenario',
    enunciado: 'Um lead inbound (Net) chegou pelo site pedindo orçamento de Iron Free. O SDR qualificou em 3 minutos e agendou com o Closer. O Closer usou SPIN: descobriu que o cliente gasta R$500/mês consertando canos corroídos pelo ferro. O cliente objetou o preço de R$24.990. O Closer ofereceu instalação cortesia de R$590 e fechou. Quais conceitos foram aplicados corretamente?',
    opcoes: [
      'Apenas SPIN Selling',
      'Receita Previsível (especialização SDR/Closer + speed-to-lead) + SPIN Selling (perguntas de Implicação sobre custo mensal) + Tratamento de Objeções (instalação como alavanca)',
      'Apenas Receita Previsível',
      'Máquina Definitiva + Inteligência Emocional'
    ],
    correta: 1,
    explicacao: 'A venda perfeita da TDF integra múltiplos conceitos: processo previsível (Receita Previsível), construção de valor (SPIN) e negociação inteligente (Objeções com instalação como alavanca).'
  },
  {
    id: 'q52',
    tema: 'Aplicação Integrada',
    tipo: 'multipla',
    enunciado: 'Na TDF, a visita técnica custa R$800 e a instalação R$590. Como esses valores se conectam com as técnicas de venda aprendidas?',
    opcoes: [
      'São custos que devem ser escondidos do cliente',
      'A visita técnica + análise de R$800 entra como parte do projeto do cliente — abatida na proposta — e demonstra expertise (Education-Based Marketing); a instalação de R$590 é a única alavanca de negociação permitida, bonificada só no fechamento (Tratamento de Objeções)',
      'Ambos devem ser oferecidos de graça para todo cliente',
      'São valores aleatórios sem estratégia por trás'
    ],
    correta: 1,
    explicacao: 'Cada valor tem função estratégica. A visita técnica posiciona a TDF como autoridade (Máquina Definitiva), e a instalação é moeda de troca planejada para facilitar fechamentos difíceis.'
  },
  {
    id: 'q53',
    tema: 'Aplicação Integrada',
    tipo: 'cenario',
    enunciado: 'O Closer está apresentando o Scale Stop de R$14.990 para uma indústria. O gerente de compras é analítico e frio. O Closer percebe que argumentos emocionais não funcionam. Integrando inteligência emocional e SPIN, o que fazer?',
    opcoes: [
      'Insistir com argumentos emocionais — todo mundo é emotivo no fundo',
      'Usar autoconsciência para reconhecer o perfil do cliente e adaptar a comunicação: focar em dados, ROI, economia calculada ("Com Scale Stop, sua caldeira economiza R$X/ano em manutenção") e perguntas SPIN orientadas a números',
      'Desistir porque clientes analíticos são impossíveis',
      'Pedir para outro Closer mais extrovertido atender'
    ],
    correta: 1,
    explicacao: 'Inteligência emocional inclui ler o perfil do outro e adaptar-se. Com clientes analíticos, SPIN com foco em números e ROI é mais eficaz que apelos emocionais. A flexibilidade comunicativa é chave.'
  },
  {
    id: 'q54',
    tema: 'Aplicação Integrada',
    tipo: 'vf',
    enunciado: 'Na TDF, o preço do refil do bebedouro (R$64 avulso ou combo de 3 por R$159) pode ser usado como argumento de baixo custo de manutenção durante o tratamento de objeções sobre o preço do bebedouro.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 0,
    explicacao: 'Verdadeiro. O refil acessível é um argumento poderoso: "O bebedouro custa R$2.890 e a manutenção é R$64 por troca avulsa — ou 3 refis por R$159 no combo. Compare com o custo de manter equipamentos antigos funcionando." Isso recontextualiza o investimento total.'
  },
  {
    id: 'q55',
    tema: 'Aplicação Integrada',
    tipo: 'cenario',
    enunciado: 'Uma construtora (Dream 100) pede orçamento para 50 Filtros de Entrada para um condomínio novo. Qual a abordagem integrada correta?',
    opcoes: [
      'Mandar tabela de preços por e-mail e aguardar retorno',
      'Aplicar Dream 100 (atendimento VIP) + Education-Based Marketing (apresentação sobre qualidade de água em condomínios) + SPIN (entender necessidades específicas do projeto) + Receita Previsível (Closer especializado em grandes contas)',
      'Tratar como qualquer outro lead do dia',
      'Dar 50% de desconto por ser volume grande'
    ],
    correta: 1,
    explicacao: 'Clientes Dream 100 exigem abordagem integrada e premium. Cada técnica aprendida se potencializa quando aplicada em conjunto para contas de alto valor estratégico.'
  },
  {
    id: 'q56',
    tema: 'Aplicação Integrada',
    tipo: 'multipla',
    enunciado: 'Um SDR da TDF qualifica um lead que precisa de Iron Free mas tem orçamento limitado. Segundo as melhores práticas integradas, o que fazer?',
    opcoes: [
      'Desqualificar o lead imediatamente',
      'Registrar a informação de orçamento limitado, passar ao Closer com essa nota para que ele ajuste a abordagem SPIN (focando no custo de NÃO resolver) e explore parcelamento ou modelos menores de Iron Free',
      'Tentar vender um produto mais barato por conta própria',
      'Mentir sobre o preço para agendar a reunião'
    ],
    correta: 1,
    explicacao: 'O SDR qualifica e reporta fielmente (Receita Previsível). O Closer usa a informação para calibrar SPIN (Implicação do custo de não resolver) e explorar opções dentro do portfólio Iron Free (R$13.990-R$31.900).'
  },
  {
    id: 'q57',
    tema: 'Aplicação Integrada',
    tipo: 'vf',
    enunciado: 'Role-play semanal, conforme recomendado pela Máquina Definitiva de Vendas, deve incluir simulações de tratamento de objeções reais que os Closers da TDF enfrentaram na semana.',
    opcoes: [
      'Verdadeiro',
      'Falso'
    ],
    correta: 0,
    explicacao: 'Verdadeiro. Role-plays com objeções reais (preço do Iron Free, comparação com concorrente, "vou pensar") são o treinamento mais eficaz porque preparam o vendedor para situações que vai enfrentar no dia seguinte.'
  },
  {
    id: 'q58',
    tema: 'Aplicação Integrada',
    tipo: 'cenario',
    enunciado: 'A equipe de bebedouros da TDF vende direto (sem SDR/Closer separados). Um cliente quer 5 bebedouros industriais (R$3.413 cada = R$17.065 total). Ele diz: "Na concorrência é R$12.000 pelo mesmo tanto." Como integrar as técnicas?',
    opcoes: [
      '"Nosso preço é esse, pegar ou largar."',
      'Usar SPIN para entender necessidades reais → Tratar objeção de preço com comparação detalhada (filtração, garantia, refil acessível a R$64 avulso ou 3 por R$159, suporte) → Usar Education-Based Marketing para demonstrar diferencial técnico → Se necessário, oferecer a instalação dos 5 bonificada no fechamento como alavanca',
      'Baixar o preço para R$12.000 para igualar',
      'Falar mal da concorrência'
    ],
    correta: 1,
    explicacao: 'Mesmo sem separação SDR/Closer, as técnicas se aplicam integralmente. SPIN constrói valor, tratamento de objeções defende o preço, educação diferencia, e a instalação cortesia é a alavanca final.'
  },
  {
    id: 'q59',
    tema: 'Aplicação Integrada',
    tipo: 'multipla',
    enunciado: 'Qual métrica integra conceitos de Receita Previsível, SPIN Selling e Máquina Definitiva de Vendas simultaneamente?',
    opcoes: [
      'Número total de ligações feitas',
      'Taxa de conversão de lead qualificado para venda fechada — pois mede qualidade da qualificação (Receita Previsível), eficácia do SPIN (construção de valor) e consistência do processo (Máquina Definitiva)',
      'Número de e-mails enviados',
      'Tempo médio de almoço da equipe'
    ],
    correta: 1,
    explicacao: 'A taxa de conversão reflete a saúde de todo o processo: leads bem qualificados (RP) + valor construído (SPIN) + processo consistente (MD) = alta conversão. Se cai, indica falha em alguma dessas dimensões.'
  },
  {
    id: 'q60',
    tema: 'Aplicação Integrada',
    tipo: 'cenario',
    enunciado: 'Final do mês: faltam R$25.000 para bater a meta. O Closer tem 3 propostas abertas: Filtro de Entrada R$8.990, Iron Free R$18.990 e Scale Stop R$12.990. Integrando todos os conceitos, qual a abordagem?',
    opcoes: [
      'Dar desconto em todos para fechar rápido',
      'Pressionar todos os 3 clientes com urgência falsa',
      'Priorizar por probabilidade de fechamento (não por valor). Usar inteligência emocional para não transmitir desespero. Aplicar follow-up estratégico com SPIN de reforço (relembrar as implicações discutidas). Oferecer instalação cortesia como acelerador de decisão onde fizer sentido. Manter disciplina obstinada no processo.',
      'Pedir para o gestor ligar e pressionar os clientes'
    ],
    correta: 2,
    explicacao: 'A situação de pressão é onde todas as técnicas são testadas: IE para manter equilíbrio, SPIN para reforçar valor, Objeções para destravar, Instalação como alavanca, e disciplina para não queimar o processo por pressa.'
  }
];

module.exports = { QUESTOES };
