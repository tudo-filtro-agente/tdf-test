// ============================================================================
// ROLEPLAYS — Simulações de venda (bebedouros industriais Tudo de Filtro)
// ----------------------------------------------------------------------------
// Treino interativo do closer. Cada cenário tem passos; cada passo traz a fala
// do CLIENTE e 3 opções de resposta do closer (pontos 0/1/3) com feedback.
//
// FATOS que sustentam as respostas "adequadas" (ver produtos.js / precos.js):
//   - O PICO de consumo simultâneo define o modelo, nunca o total de pessoas.
//     Capacidade do reservatório NÃO é limite diário.
//   - Compressor: 15/25/60 = 1/10; 100/200 = 1/5.
//   - Refil = Acquabios Multi (1º acompanha de brinde). Upsell dos 3 refis
//     (3 por R$159, economia R$48) só DEPOIS de o cliente aceitar o bebedouro.
//   - Não prometer potabilidade nem % de economia. Não corrigir dimensões
//     (pendentes de validação). Não descer de modelo por preço sem registrar
//     o risco de subdimensionamento.
//   - Licitação: qualificar (edital, quantidade, cidade, prazo, estágio) antes
//     de preço; nunca prática irregular. Água de poço → avaliação técnica.
//   - Sempre terminar com PRÓXIMO PASSO definido.
//
// Nada de conteúdo comercial fica preso em componente. Edite só este arquivo.
// ============================================================================

module.exports = {
  ROLEPLAYS: [
    // ========================================================================
    // 1. ACADEMIA
    // ========================================================================
    {
      id: 1,
      titulo: "Academia",
      obrigatorio: true,
      contexto:
        "<strong>Academia de bairro.</strong> 300 alunos cadastrados, mas o movimento no horário de pico chega a <strong>40 pessoas ao mesmo tempo</strong>. O bebedouro atual perde a refrigeração quando enche. O dono é bem focado em preço e já começa a conversa perguntando quanto custa o mais barato.",
      passos: [
        {
          fala:
            "Tenho 300 alunos cadastrados. Preciso de um bebedouro grande o bastante pra atender todo mundo, né? Me passa o de maior capacidade.",
          opcoes: [
            {
              texto:
                "300 é o cadastro, mas o que dimensiona o equipamento é o pico simultâneo. Quantas pessoas usam ao mesmo tempo no horário mais cheio?",
              adequada: true,
              pontos: 3,
              porque:
                "Corrige o raciocínio central: o pico simultâneo define o modelo, não o total de cadastrados. Puxa a informação certa antes de indicar.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Perfeito, com 300 alunos o ideal é o 200 litros, que é o topo de linha. Fecho no maior pra garantir.",
              adequada: false,
              pontos: 1,
              porque:
                "Usa o total de cadastrados como se fosse a demanda instantânea. Superdimensiona e encarece sem necessidade.",
              risco:
                "Cliente sensível a preço recusa a proposta inflada, ou compra achando que capacidade = limite diário e você perde credibilidade técnica.",
              melhora:
                "Perguntar o pico simultâneo antes de sugerir modelo, explicando que reservatório não é limite diário.",
            },
            {
              texto:
                "O reservatório maior dá conta de 300 pessoas por dia tranquilo, é só somar o consumo total.",
              adequada: false,
              pontos: 0,
              porque:
                "Afirmação tecnicamente errada: trata a capacidade do reservatório como limite diário de pessoas.",
              risco:
                "Dimensionamento por número errado, promessa que o equipamento pode não cumprir no pico e risco de reclamação pós-venda.",
              melhora:
                "Nunca usar 'total por dia'. Ancorar no consumo simultâneo do horário de maior movimento.",
            },
          ],
        },
        {
          fala:
            "No pico, umas 40 pessoas ao mesmo tempo, depois da aula das 19h. E o meu atual esquenta justo nessa hora.",
          opcoes: [
            {
              texto:
                "Esse esquentar no pico é recuperação de temperatura. Pra 40 no pico o 60 litros atende, e o compressor 1/10 dele repõe o frio melhor que o seu atual. Vou te mostrar esse modelo.",
              adequada: true,
              pontos: 3,
              porque:
                "Liga o sintoma (perde frio no pico) à solução técnica correta e indica o modelo pela demanda simultânea real, com o compressor certo (60L = 1/10).",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Então precisa do 200 litros mesmo, quanto maior o reservatório menos ele esquenta.",
              adequada: false,
              pontos: 1,
              porque:
                "Confunde volume de reservatório com capacidade de refrigeração. O problema de recuperação não se resolve só com litro a mais.",
              risco:
                "Empurra o topo de linha para um pico de 40, superdimensiona e ainda passa informação técnica imprecisa.",
              melhora:
                "Explicar recuperação/compressor e casar o modelo com o pico de 40 (60 litros).",
            },
            {
              texto: "Qualquer um novo já vai gelar melhor que o seu velho, pode pegar o 15 que é mais barato.",
              adequada: false,
              pontos: 0,
              porque:
                "Desce para um modelo claramente subdimensionado (15L atende até ~25/hora) só mirando preço, ignorando o pico de 40.",
              risco:
                "Subdimensionamento garantido: o 15L trabalha no limite e repete o problema que o cliente já tem hoje.",
              melhora:
                "Indicar pela demanda; se o cliente insistir em modelo menor, registrar por escrito o risco de subdimensionamento.",
            },
          ],
        },
        {
          fala:
            "Gostei do 60 litros. Mas tá caro pra mim. Não dá pra pegar o 15 ou o 25 que cabe melhor no bolso?",
          opcoes: [
            {
              texto:
                "Consigo, mas preciso registrar: 15 e 25 atendem picos bem menores que os seus 40. Você teria o mesmo problema de agora. Se quiser mesmo o menor por preço, deixo anotado o risco de subdimensionamento na proposta.",
              adequada: true,
              pontos: 3,
              porque:
                "Não desce de modelo por preço sem registrar formalmente o risco de subdimensionamento — exatamente a regra da casa. Mantém a decisão informada.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Sem problema, pego o 25 pra você que é mais em conta e resolve igual.",
              adequada: false,
              pontos: 1,
              porque:
                "Cede ao preço afirmando que 'resolve igual', o que não é verdade para um pico de 40 pessoas.",
              risco:
                "Cliente compra subdimensionado, reclama depois e a culpa recai na TDF por não ter alertado.",
              melhora:
                "Se ceder ao menor, sempre registrar o risco por escrito e reforçar a diferença de capacidade.",
            },
            {
              texto: "Deixa comigo, na entrega você nem vai notar diferença entre o 25 e o 60.",
              adequada: false,
              pontos: 0,
              porque:
                "Minimiza uma diferença técnica real e induz o cliente ao erro para fechar rápido.",
              risco:
                "Quebra de expectativa na primeira semana de pico, pedido de troca/devolução e desgaste de marca.",
              melhora:
                "Ser honesto sobre a diferença de pico e propor parcelamento em vez de baixar o modelo.",
            },
          ],
        },
        {
          fala:
            "Tá, faz sentido. Vou fechar o 60 litros. E esses refis, como funciona?",
          opcoes: [
            {
              texto:
                "O 1º refil Acquabios Multi já vai de brinde com o bebedouro. Como você fechou o equipamento, consigo ainda os 3 adicionais por R$159 em vez de R$207, economia de R$48. Fecho assim? Aí já emito a proposta com entrega.",
              adequada: true,
              pontos: 3,
              porque:
                "Faz o upsell dos 3 refis SÓ depois de o cliente aceitar o bebedouro, com os números corretos (R$159/economia R$48) e define o próximo passo (proposta + entrega).",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Antes de fechar o bebedouro te empurro logo o pacote de 4 refis, sai melhor comprar tudo junto.",
              adequada: false,
              pontos: 1,
              porque:
                "Antecipa o upsell antes do aceite do equipamento e erra a mecânica (1 é brinde + 3 adicionais, não 'pacote de 4' vendido).",
              risco:
                "Sobrecarrega a decisão e pode travar o fechamento do item principal.",
              melhora:
                "Fechar o bebedouro primeiro; só então oferecer os 3 refis por R$159.",
            },
            {
              texto:
                "Os refis deixam sua água 100% potável e garantida, pode comprar vários que nunca falta.",
              adequada: false,
              pontos: 0,
              porque:
                "Promete potabilidade — algo que não se pode afirmar — e ignora a oferta oficial estruturada.",
              risco:
                "Promessa indevida de resultado de qualidade de água, exposição legal e de reputação.",
              melhora:
                "Nunca prometer potabilidade. Apresentar o 1º brinde + 3 adicionais por R$159 e encerrar com próximo passo.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 2. INDÚSTRIA
    // ========================================================================
    {
      id: 2,
      titulo: "Indústria",
      obrigatorio: true,
      contexto:
        "<strong>Indústria metalúrgica.</strong> 220 colaboradores em <strong>3 turnos</strong>, com intervalos concentrados (todo mundo sai junto). O comprador é técnico, precisa da <strong>aprovação da manutenção</strong> antes de fechar e valoriza informação de compressor e voltagem.",
      passos: [
        {
          fala:
            "Somos 220 funcionários. Qual bebedouro atende 220 pessoas?",
          opcoes: [
            {
              texto:
                "220 é o total. Como vocês têm 3 turnos, quero saber quantas pessoas por turno e quantas saem juntas no intervalo — é o pico simultâneo que define o modelo.",
              adequada: true,
              pontos: 3,
              porque:
                "Quebra o total em pessoas/turno e pico simultâneo, que é o que realmente dimensiona. Puxa dado de intervalo concentrado.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Pra 220 pessoas o 200 litros, que é o maior. Fechado.",
              adequada: false,
              pontos: 1,
              porque:
                "Dimensiona pelo total ignorando que 3 turnos diluem a demanda instantânea.",
              risco:
                "Pode superdimensionar (se cada turno tem poucos no pico) ou subestimar pontos de água. Decisão sem os dados certos.",
              melhora:
                "Levantar pessoas por turno e simultaneidade no intervalo antes de indicar.",
            },
            {
              texto: "220 divididos por dia é pouca coisa, o 25 litros dá conta.",
              adequada: false,
              pontos: 0,
              porque:
                "Raciocínio de 'diluição por dia' está errado e ignora que os intervalos são concentrados.",
              risco:
                "Subdimensionamento severo no pico do intervalo, filas e água quente.",
              melhora:
                "Focar no pico do intervalo, não em média diária.",
            },
          ],
        },
        {
          fala:
            "Cada turno tem uns 70, e no intervalo saem quase todos juntos. Uns 60 ao mesmo tempo, fácil.",
          opcoes: [
            {
              texto:
                "60 pessoas concentradas num intervalo curto pede boa recuperação de frio. O 100 litros tem compressor 1/5, que repõe temperatura mais rápido no pico. Recomendo o 100 e, se os pontos forem distantes, avaliamos mais de uma unidade.",
              adequada: true,
              pontos: 3,
              porque:
                "Casa o pico concentrado com o modelo de melhor recuperação (100L = compressor 1/5) e já levanta a hipótese de múltiplos pontos — correto para intervalos concentrados.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "60 no pico o 60 litros resolve, o nome já diz que é pra 60.",
              adequada: false,
              pontos: 1,
              porque:
                "Associa litragem a número de pessoas ('60 litros = 60 pessoas'), o que não é a lógica. O 60L (1/10) fica no limite para 60 concentrados.",
              risco:
                "Recuperação insuficiente num intervalo curto e concentrado; água esquenta antes de todos beberem.",
              melhora:
                "Priorizar recuperação: 100L com compressor 1/5 para pico concentrado.",
            },
            {
              texto: "Pega o 200 litros que é o mais potente e não erra nunca.",
              adequada: false,
              pontos: 0,
              porque:
                "'Mais potente' por reflexo, sem raciocínio de pontos de água nem justificativa técnica. Superdimensiona por medo.",
              risco:
                "Custo desnecessário e um único ponto pode não cobrir o ambiente mesmo sendo grande.",
              melhora:
                "Indicar 100L (1/5) para o pico e avaliar distribuição de pontos em vez de só aumentar litragem.",
            },
          ],
        },
        {
          fala:
            "A manutenção vai querer saber de voltagem e do compressor antes de eu aprovar. Já me adianta isso?",
          opcoes: [
            {
              texto:
                "O 100 litros usa compressor 1/5. A voltagem específica eu confirmo com a fábrica antes de fechar, porque preciso checar a do seu ponto de instalação — qual a voltagem disponível aí? Assim já alinho com a manutenção.",
              adequada: true,
              pontos: 3,
              porque:
                "Dá o dado que existe (compressor 1/5) e trata voltagem como pendente a confirmar, sem inventar — coerente com voltagemPendente. Ainda envolve a manutenção.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "É bivolt automático, pode instalar em qualquer tomada, não precisa perguntar nada pra fábrica.",
              adequada: false,
              pontos: 1,
              porque:
                "Afirma voltagem como se fosse fato conhecido, quando é pendente de confirmação.",
              risco:
                "Se a informação estiver errada, queima do equipamento e problema com a manutenção logo na instalação.",
              melhora:
                "Assumir voltagem como pendente e confirmar com a fábrica e com o ponto do cliente.",
            },
            {
              texto:
                "Compressor e voltagem são detalhe, o importante é o preço. A manutenção aprova depois.",
              adequada: false,
              pontos: 0,
              porque:
                "Despreza o critério técnico do decisor da manutenção — justamente quem destrava a compra.",
              risco:
                "Perde o aliado técnico interno e trava a aprovação; comprador fica sem argumento.",
              melhora:
                "Municiar a manutenção com dado técnico correto (compressor 1/5) e tratar voltagem com transparência.",
            },
          ],
        },
        {
          fala:
            "Ok, dados batem. Vou levar pra manutenção aprovar. Como seguimos?",
          opcoes: [
            {
              texto:
                "Fecho assim: envio a proposta do 100 litros com o dado de compressor 1/5 e a voltagem a confirmar. Combinamos que na quinta você retorna com o ok da manutenção? Aí libero produção e a entrega.",
              adequada: true,
              pontos: 3,
              porque:
                "Encerra com PRÓXIMO PASSO datado e responsável definido (retorno da manutenção na quinta), em vez de deixar em aberto.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Beleza, qualquer coisa você me avisa quando a manutenção decidir.",
              adequada: false,
              pontos: 1,
              porque:
                "Termina sem próximo passo definido — deixa a bola inteiramente com o cliente e sem data.",
              risco:
                "Negócio esfria, sem gatilho de follow-up; comum morrer em 'estou aguardando a manutenção'.",
              melhora:
                "Combinar data de retorno e o que cada lado faz até lá.",
            },
            {
              texto:
                "Não precisa nem esperar a manutenção, já emito o pedido e você resolve internamente depois.",
              adequada: false,
              pontos: 0,
              porque:
                "Atropela o processo de aprovação do cliente e força um pedido sem o de-acordo do decisor técnico.",
              risco:
                "Pedido cancelado, atrito com a manutenção e queima de confiança no comprador.",
              melhora:
                "Respeitar o fluxo de aprovação e ancorar um próximo passo com data.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 3. OBRA
    // ========================================================================
    {
      id: 3,
      titulo: "Obra",
      obrigatorio: true,
      contexto:
        "<strong>Canteiro de obra.</strong> 150 trabalhadores, prazo de <strong>18 meses</strong>, parte da estrutura ainda é externa (sol/poeira). Necessidade urgente: fiscalização apertando por ponto de água gelada. O engenheiro tem pressa mas quer o equipamento certo.",
      passos: [
        {
          fala:
            "Tenho 150 homens na obra e a fiscalização no meu pé. Preciso disso pra ontem. Qual você manda?",
          opcoes: [
            {
              texto:
                "Entendi a urgência. Antes de definir: no intervalo, quantos vão beber ao mesmo tempo? E é um ponto só ou dá pra distribuir? Isso define o modelo certo pra não errar na pressa.",
              adequada: true,
              pontos: 3,
              porque:
                "Reconhece a urgência mas não abre mão do pico simultâneo e da distribuição de pontos — evita erro caro sob pressão.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Com 150 homens manda o 200 litros, o maior, e resolve logo sua urgência.",
              adequada: false,
              pontos: 1,
              porque:
                "Deixa a pressa atropelar a qualificação; dimensiona pelo total sem checar pico nem pontos.",
              risco:
                "Um único equipamento grande pode não cobrir um canteiro espalhado; e pode estar superdimensionado.",
              melhora:
                "Mesmo com urgência, confirmar pico e número de pontos de água.",
            },
            {
              texto: "Manda o mais barato que tiver em estoque, na obra qualquer um serve.",
              adequada: false,
              pontos: 0,
              porque:
                "Ignora dimensionamento e condições do canteiro; 'qualquer um serve' é o oposto da regra.",
              risco:
                "Subdimensionamento e equipamento inadequado ao ambiente; fiscalização não aceita e retrabalho.",
              melhora:
                "Qualificar rápido, mas qualificar: pico, pontos e ambiente de instalação.",
            },
          ],
        },
        {
          fala:
            "No intervalo umas 80 saem juntas. E tem um trecho que ainda é a céu aberto, o pessoal bebe lá também.",
          opcoes: [
            {
              texto:
                "80 no pico pede o 100 litros (compressor 1/5) pela recuperação. Sobre o trecho externo: o equipamento é pra ambiente protegido — precisamos de um ponto coberto/ventilado pra instalar. Podemos ver abrigo ou um 2º ponto pra essa área.",
              adequada: true,
              pontos: 3,
              porque:
                "Dimensiona pelo pico (100L, 1/5) e trata a instalação externa como restrição real, propondo abrigo/2º ponto em vez de ignorar.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "80 no pico o 60 litros aguenta, e pode deixar no sol mesmo que é inox, não enferruja.",
              adequada: false,
              pontos: 1,
              porque:
                "Subdimensiona para 80 concentrados (60L é 1/10) e banaliza a exposição ao tempo com um argumento de material.",
              risco:
                "Recuperação insuficiente no pico e equipamento exposto a sol/poeira fora das condições adequadas.",
              melhora:
                "100L para o pico e exigir ponto protegido/ventilado para instalar.",
            },
            {
              texto: "Pode instalar em qualquer canto da obra, aguenta chuva e sol tranquilo.",
              adequada: false,
              pontos: 0,
              porque:
                "Afirma tolerância a intempéries que não está especificada e ignora as condições de instalação.",
              risco:
                "Falha do equipamento por instalação inadequada, perda de garantia e novo problema com a fiscalização.",
              melhora:
                "Definir local coberto e ventilado; se preciso, prever abrigo ou ponto adicional.",
            },
          ],
        },
        {
          fala:
            "A obra dura 18 meses. Vale a pena comprar ou é melhor alguma outra coisa pra esse tempo?",
          opcoes: [
            {
              texto:
                "Por 18 meses e uso pesado de canteiro, comprar o 100 litros faz sentido: garantia de 12 meses e ele serve depois em outra obra sua. Fecho a proposta do 100 com entrega rápida pra destravar a fiscalização?",
              adequada: true,
              pontos: 3,
              porque:
                "Justifica a compra pelo horizonte de 18 meses e reaproveitamento, cita a garantia real (12 meses) e caminha para o fechamento com próximo passo.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Compra que a garantia é vitalícia, nunca vai ter problema nos 18 meses.",
              adequada: false,
              pontos: 1,
              porque:
                "Inventa 'garantia vitalícia' — a garantia informada é de 12 meses.",
              risco:
                "Promessa falsa de garantia gera conflito quando surgir manutenção após o 12º mês.",
              melhora:
                "Usar a garantia real (12 meses) como argumento honesto.",
            },
            {
              texto:
                "Sei lá, pra 18 meses talvez não compense, veja com outro fornecedor de locação.",
              adequada: false,
              pontos: 0,
              porque:
                "Empurra o cliente para fora sem defender a solução; abandona um lead urgente e qualificado.",
              risco:
                "Perde a venda e a autoridade; cliente compra com o concorrente.",
              melhora:
                "Mostrar o valor da compra para o horizonte da obra e conduzir ao fechamento.",
            },
          ],
        },
        {
          fala:
            "Fechado o 100 litros. Preciso disso instalado rápido. E os refis?",
          opcoes: [
            {
              texto:
                "Ótimo. O 1º refil Acquabios Multi já acompanha de brinde. Como fechou o bebedouro, garanto os 3 adicionais por R$159 (economia de R$48). Emito agora a proposta do 100 com data de entrega e instalação — te confirmo o dia ainda hoje.",
              adequada: true,
              pontos: 3,
              porque:
                "Upsell dos 3 refis por R$159 apenas após o aceite do equipamento e fecha com próximo passo concreto (proposta + data de entrega/instalação hoje).",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Refil a gente vê depois, por enquanto foca em receber o bebedouro e qualquer coisa me chama.",
              adequada: false,
              pontos: 1,
              porque:
                "Perde a janela natural do upsell no aceite e encerra com 'qualquer coisa me chama', sem próximo passo.",
              risco:
                "Deixa dinheiro na mesa e o negócio sem gatilho de acompanhamento.",
              melhora:
                "Oferecer os 3 refis por R$159 agora e cravar a data de entrega/instalação.",
            },
            {
              texto:
                "Compra logo uns 10 refis de uma vez que a água da obra é suja e vai precisar.",
              adequada: false,
              pontos: 0,
              porque:
                "Ignora a oferta oficial (1 brinde + 3 por R$159) e faz suposição sobre a água sem base.",
              risco:
                "Empurra volume aleatório, quebra a política de upsell e passa insegurança técnica.",
              melhora:
                "Seguir a oferta estruturada e definir entrega/instalação como próximo passo.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 4. ESCOLA
    // ========================================================================
    {
      id: 4,
      titulo: "Escola",
      obrigatorio: true,
      contexto:
        "<strong>Escola.</strong> 400 alunos, <strong>2 intervalos</strong> em que muita gente bebe ao mesmo tempo, e <strong>vários pontos de água</strong> espalhados pelos corredores. A diretoria ainda está avaliando o orçamento e não decide sozinha (precisa da mantenedora).",
      passos: [
        {
          fala:
            "Somos 400 alunos. Um bebedouro de 400 litros dá conta de todos?",
          opcoes: [
            {
              texto:
                "Não existe pelo total, e sim pelo pico. Nos 2 intervalos, quantos alunos bebem ao mesmo tempo? E como hoje vocês têm vários pontos, talvez o melhor seja distribuir em mais de um equipamento.",
              adequada: true,
              pontos: 3,
              porque:
                "Corrige a lógica do total, ancora no pico dos intervalos e levanta a distribuição por múltiplos pontos — ideal para escola.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Não temos 400 litros; o maior é o 200, então leva o 200 que é o mais perto de 400.",
              adequada: false,
              pontos: 1,
              porque:
                "Continua raciocinando por litragem x total de alunos, sem considerar pico nem os vários pontos.",
              risco:
                "Um único 200L pode não cobrir corredores distantes e ainda estar mal dimensionado para o pico real.",
              melhora:
                "Levantar pico dos intervalos e propor distribuição em pontos.",
            },
            {
              texto: "400 alunos por dia é tranquilo, o 60 litros segura numa boa.",
              adequada: false,
              pontos: 0,
              porque:
                "Diluição por dia de novo, ignorando que em 2 intervalos a demanda é concentrada.",
              risco:
                "Filas enormes no recreio e água quente; péssima experiência num ambiente escolar.",
              melhora:
                "Focar no pico do intervalo e nos pontos, não na média diária.",
            },
          ],
        },
        {
          fala:
            "No recreio deve dar uns 120 bebendo quase juntos. E são 4 corredores diferentes.",
          opcoes: [
            {
              texto:
                "Com 120 no pico e 4 corredores, faz mais sentido distribuir: por exemplo, unidades de 100 litros (compressor 1/5) em pontos estratégicos, em vez de forçar um só equipamento. Posso montar o dimensionamento por ponto.",
              adequada: true,
              pontos: 3,
              porque:
                "Resolve pico alto + área espalhada com distribuição de pontos e modelo de boa recuperação (100L, 1/5), em vez de um único aparelho gigante.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Então põe um 200 litros num ponto central que os alunos vão até lá.",
              adequada: false,
              pontos: 1,
              porque:
                "Aposta num único equipamento central ignorando que os 4 corredores pedem distribuição.",
              risco:
                "Concentra fila num ponto só e deixa corredores distantes descobertos.",
              melhora:
                "Distribuir em vários pontos dimensionados pelo pico de cada área.",
            },
            {
              texto: "Coloca vários 15 litros baratinhos, um em cada corredor, e pronto.",
              adequada: false,
              pontos: 0,
              porque:
                "Distribui, mas com modelo subdimensionado (15L, até ~25/hora) para um pico alto de recreio — barato acima do técnico.",
              risco:
                "Cada 15L colapsa no recreio; subdimensionamento em rede.",
              melhora:
                "Dimensionar cada ponto pelo pico local (provavelmente 60/100L), não pelo mais barato.",
            },
          ],
        },
        {
          fala:
            "A diretoria gostou, mas quem libera o orçamento é a mantenedora. Ainda estamos avaliando.",
          opcoes: [
            {
              texto:
                "Faz sentido. Vou preparar uma proposta com o dimensionamento por ponto e os valores, num formato que você leva pronto pra mantenedora aprovar. Quando é a próxima reunião com eles pra eu te dar o material antes?",
              adequada: true,
              pontos: 3,
              porque:
                "Aceita o processo decisório real, municia o interlocutor para vender internamente e busca a data da reunião — avança em vez de pressionar.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Se você fechar hoje comigo eu seguro o preço, senão não garanto depois.",
              adequada: false,
              pontos: 1,
              porque:
                "Pressão artificial de escassez sobre quem admitiu não ter poder de decisão isolado.",
              risco:
                "Queima confiança da diretoria e não resolve o gargalo real (a mantenedora).",
              melhora:
                "Ajudar a diretoria a levar o caso à mantenedora com material pronto e data.",
            },
            {
              texto:
                "Tá bom, quando a mantenedora decidir vocês me procuram.",
              adequada: false,
              pontos: 0,
              porque:
                "Encerra passivo, sem próximo passo e sem apoiar a venda interna.",
              risco:
                "Proposta engavetada por falta de acompanhamento; negócio morre.",
              melhora:
                "Definir entrega da proposta + data da reunião da mantenedora como próximo passo.",
            },
          ],
        },
        {
          fala:
            "Perfeito, me manda esse material. E os refis desses bebedouros, entram no orçamento?",
          opcoes: [
            {
              texto:
                "Coloco assim: cada bebedouro já vem com o 1º refil Acquabios Multi de brinde. Se a escola fechar os equipamentos, incluo os 3 refis adicionais por unidade a R$159 (em vez de R$207) na proposta pra mantenedora. Te envio o material até amanhã — combinado?",
              adequada: true,
              pontos: 3,
              porque:
                "Condiciona o upsell dos refis ao fechamento dos bebedouros, usa os números corretos e fecha com prazo de envio definido.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Já boto no orçamento vários refis avulsos antes mesmo de decidirem os bebedouros, pra adiantar.",
              adequada: false,
              pontos: 1,
              porque:
                "Antecipa refil antes do aceite dos equipamentos, invertendo a ordem da oferta.",
              risco:
                "Infla o orçamento que ainda está sob avaliação e pode travar a aprovação.",
              melhora:
                "Vincular os 3 refis por R$159 à decisão dos bebedouros.",
            },
            {
              texto:
                "Os refis garantem água 100% pura pras crianças, pode colocar quantos quiser.",
              adequada: false,
              pontos: 0,
              porque:
                "Promete pureza/potabilidade — vedado — ainda mais em contexto sensível (crianças).",
              risco:
                "Promessa indevida com público sensível; risco reputacional e legal alto.",
              melhora:
                "Nunca prometer potabilidade; apresentar a oferta oficial e encerrar com prazo.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 5. LICITAÇÃO
    // ========================================================================
    {
      id: 5,
      titulo: "Licitação",
      obrigatorio: true,
      contexto:
        "<strong>Suposta licitação.</strong> Um contato pede <strong>10 equipamentos</strong>, mas <strong>não informa o órgão</strong>, <strong>não envia o edital</strong> e insiste no <strong>menor preço</strong>, com pressa. Faltam dados básicos e há sinais de que talvez nem seja um processo formal.",
      passos: [
        {
          fala:
            "Preciso de 10 bebedouros pra um órgão público. Me passa o menor preço possível, é pra licitação.",
          opcoes: [
            {
              texto:
                "Com prazer. Pra cotar certo numa licitação preciso do edital ou do número do processo, o órgão, a cidade e o prazo de entrega. Consegue me enviar? Aí monto a proposta correta.",
              adequada: true,
              pontos: 3,
              porque:
                "Qualifica a licitação pelos itens que importam (edital, órgão, cidade, prazo) antes de qualquer preço — exatamente a regra.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Pra 10 unidades te dou o menor preço da tabela já já, sem burocracia.",
              adequada: false,
              pontos: 1,
              porque:
                "Dá preço antes de qualificar edital/órgão/prazo; ignora a exigência de qualificação em licitação.",
              risco:
                "Cotação sem base, exposição a jogo de preço e a processo informal/irregular disfarçado.",
              melhora:
                "Só cotar após edital, órgão, quantidade, cidade e prazo confirmados.",
            },
            {
              texto: "Fecho fácil: sou seu contato interno e a gente dá um jeito de ganhar essa.",
              adequada: false,
              pontos: 0,
              porque:
                "Sugere favorecimento/prática irregular em processo público — inaceitável.",
              risco:
                "Ilegalidade, risco jurídico grave para o cliente e para a TDF.",
              melhora:
                "Conduzir apenas por meios formais: edital, especificação e proposta regular.",
            },
          ],
        },
        {
          fala:
            "Edital eu não tenho aqui agora, e o órgão prefiro não falar. Só quero o preço mais baixo pra 10.",
          opcoes: [
            {
              texto:
                "Sem o edital e o órgão eu não consigo cotar corretamente nem garantir que atende a especificação exigida. Posso te enviar uma proposta técnica de referência, mas o preço oficial sai quando você me passar o processo. Como prefere seguir?",
              adequada: true,
              pontos: 3,
              porque:
                "Mantém a exigência de dados formais, não cede à pressão por preço e ainda oferece um caminho legítimo (proposta técnica de referência).",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Tudo bem, sem edital mesmo eu te passo o menor preço só pra você não perder tempo.",
              adequada: false,
              pontos: 1,
              porque:
                "Abandona a qualificação por causa da pressão; entrega preço no escuro.",
              risco:
                "Proposta desalinhada da especificação real e possível uso indevido do preço.",
              melhora:
                "Não fechar preço oficial sem edital/órgão; oferecer referência técnica no máximo.",
            },
            {
              texto:
                "Se é sigiloso a gente resolve por fora, me passa seu PIX que agilizo os 10.",
              adequada: false,
              pontos: 0,
              porque:
                "Propõe transação 'por fora' de um suposto processo público — irregularidade explícita.",
              risco:
                "Fraude/corrupção; expõe a empresa a crime e dano reputacional irreversível.",
              melhora:
                "Recusar qualquer via informal e exigir o processo formal.",
            },
          ],
        },
        {
          fala:
            "Você complica demais. Outro fornecedor já me passou preço sem pedir nada disso.",
          opcoes: [
            {
              texto:
                "Entendo, mas peço esses dados justamente pra te entregar a proposta certa e sem risco no processo. Me passando edital, órgão, cidade e prazo, comparo com o do concorrente e mostro onde a gente é mais forte. Topa me enviar?",
              adequada: true,
              pontos: 3,
              porque:
                "Reposiciona a exigência como benefício (proposta correta, sem risco) e mantém a régua sem perder o lead. Continua qualificando.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Se o outro passou, eu cubro: te dou 10% abaixo dele sem ver edital nenhum.",
              adequada: false,
              pontos: 1,
              porque:
                "Entra em guerra de preço cega e abandona a qualificação para não perder o lead.",
              risco:
                "Margem destruída e proposta sem lastro técnico; ainda pode ser processo irregular.",
              melhora:
                "Defender o valor da proposta correta; só precificar com o processo em mãos.",
            },
            {
              texto:
                "Então fecha com o outro mesmo, se pra você tanto faz.",
              adequada: false,
              pontos: 0,
              porque:
                "Desiste do lead de forma ríspida, sem tentar reconduzir ao processo correto.",
              risco:
                "Perde a oportunidade e a chance de educar o cliente; imagem ruim.",
              melhora:
                "Manter a régua com cordialidade e mostrar o ganho de fazer certo.",
            },
          ],
        },
        {
          fala:
            "Tá, se eu conseguir o edital eu te mando. Como fica então?",
          opcoes: [
            {
              texto:
                "Fechado: assim que você me enviar o edital, o órgão e o prazo, monto a proposta oficial dos 10 equipamentos com o dimensionamento certo. Combinamos que você me manda até sexta e eu retorno a proposta em 2 dias úteis?",
              adequada: true,
              pontos: 3,
              porque:
                "Encerra com PRÓXIMO PASSO claro e prazos dos dois lados, condicionado à entrega do edital — sem abrir mão do processo.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Beleza, quando tiver o edital qualquer coisa você me avisa.",
              adequada: false,
              pontos: 1,
              porque:
                "Fecha sem data e sem compromisso mútuo — 'qualquer coisa me avisa'.",
              risco:
                "Sem gatilho de follow-up, o contato some.",
              melhora:
                "Definir data de envio do edital e prazo de retorno da proposta.",
            },
            {
              texto:
                "Já vou emitindo os 10 no menor preço e você me manda o edital depois pra formalizar.",
              adequada: false,
              pontos: 0,
              porque:
                "Emite pedido antes de qualquer documento formal — inverte a ordem legal do processo.",
              risco:
                "Compromisso de estoque/preço sem base e sem edital; risco comercial e de conformidade.",
              melhora:
                "Nada é emitido antes do edital; formalizar primeiro, cotar depois.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 6. REVENDEDOR
    // ========================================================================
    {
      id: 6,
      titulo: "Revendedor",
      obrigatorio: true,
      contexto:
        "<strong>Possível revendedor.</strong> Quer a <strong>tabela de preços</strong> completa, <strong>não tem nenhum cliente confirmado</strong> ainda e já pede <strong>exclusividade na região</strong>. Precisa ser qualificado com cuidado — sem entregar tabela nem exclusividade a quem ainda não provou nada.",
      passos: [
        {
          fala:
            "Quero revender os bebedouros de vocês. Me manda a tabela completa com todos os preços de revenda.",
          opcoes: [
            {
              texto:
                "Legal ter você no radar. Antes da tabela, me conta: você já atua com que produtos, em qual região e tem clientes/demanda hoje? Assim vejo o formato de parceria certo pra você.",
              adequada: true,
              pontos: 3,
              porque:
                "Qualifica o parceiro (atuação, região, demanda) antes de liberar tabela — protege a política comercial e entende o real potencial.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Claro, já te mando a tabela de revenda inteira com todas as margens.",
              adequada: false,
              pontos: 1,
              porque:
                "Entrega tabela e margens a um contato ainda não qualificado.",
              risco:
                "Preços e margens circulando sem controle, distorção de mercado e concorrência com o próprio cliente final.",
              melhora:
                "Qualificar antes; liberar condições só após entender atuação e demanda.",
            },
            {
              texto: "Tabela é confidencial, não passo pra revendedor não.",
              adequada: false,
              pontos: 0,
              porque:
                "Fecha a porta de forma seca, sem qualificar nem explorar uma parceria potencialmente boa.",
              risco:
                "Perde um possível canal de vendas por falta de condução.",
              melhora:
                "Não recusar de cara: qualificar e, se fizer sentido, evoluir a conversa.",
            },
          ],
        },
        {
          fala:
            "Cliente fechado ainda não tenho, mas se eu tiver preço bom eu encontro. Me dá a exclusividade da região que eu trago volume.",
          opcoes: [
            {
              texto:
                "Exclusividade a gente não abre sem histórico. Funciona assim: você começa vendendo, prova demanda, e conforme o volume avaliamos condições melhores. Que tal fecharmos um primeiro pedido pra você testar o mercado?",
              adequada: true,
              pontos: 3,
              porque:
                "Nega exclusividade a quem ainda não vendeu nada, oferece um caminho por mérito e conduz a um primeiro pedido concreto.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Fechado, te dou exclusividade da região já, só não me deixa na mão.",
              adequada: false,
              pontos: 1,
              porque:
                "Concede exclusividade sem nenhum histórico nem volume comprovado.",
              risco:
                "Trava a região com um parceiro que pode não vender, bloqueando outros canais.",
              melhora:
                "Condicionar exclusividade a volume/performance comprovados.",
            },
            {
              texto:
                "Exclusividade nem pensar, você não tem nem cliente, tá começando errado.",
              adequada: false,
              pontos: 0,
              porque:
                "Recusa correta no mérito, mas com tom que humilha e afasta o parceiro.",
              risco:
                "Queima um canal potencial por falta de tato.",
              melhora:
                "Manter a política com respeito e oferecer o caminho por desempenho.",
            },
          ],
        },
        {
          fala:
            "E o preço? Se eu comprar 5 de uma vez você desce bastante? Preciso de margem gorda.",
          opcoes: [
            {
              texto:
                "Consigo condição pra um primeiro lote, mas trabalho com preço que preserva sua margem e não estraga o mercado da região. Te passo a condição do primeiro pedido de 5 unidades e a partir daí evoluímos. Fechamos esse lote inicial?",
              adequada: true,
              pontos: 3,
              porque:
                "Oferece condição real sem descontos predatórios, protege o mercado e avança para um pedido inicial — parceria por etapas.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Desço o quanto você quiser, me diz o preço que você precisa que eu chego lá.",
              adequada: false,
              pontos: 1,
              porque:
                "Abre mão do preço de forma ilimitada para um parceiro não provado.",
              risco:
                "Margem destruída e referência de preço estragada na região.",
              melhora:
                "Dar condição estruturada, não desconto aberto e ilimitado.",
            },
            {
              texto: "Preço de revenda é o mesmo do site, não tem desconto nenhum pra você.",
              adequada: false,
              pontos: 0,
              porque:
                "Inviabiliza qualquer revenda (sem margem) e mostra desconhecimento de política de canal.",
              risco:
                "Afasta o parceiro e perde o canal por rigidez sem sentido.",
              melhora:
                "Oferecer condição de canal coerente para o primeiro lote.",
            },
          ],
        },
        {
          fala:
            "Faz sentido começar pequeno. Como a gente segue pra esse primeiro pedido?",
          opcoes: [
            {
              texto:
                "Fecho assim: te envio a condição do primeiro lote de 5 unidades por escrito hoje, com prazo de entrega. Você confirma até quinta e já organizamos a logística. Conforme esse lote girar, revemos condições e região. Combinado?",
              adequada: true,
              pontos: 3,
              porque:
                "Encerra com PRÓXIMO PASSO datado (condição hoje, confirmação quinta) e deixa a evolução da parceria atrelada ao desempenho.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Beleza, quando você decidir o tamanho do pedido me chama.",
              adequada: false,
              pontos: 1,
              porque:
                "Fecha sem data nem compromisso; devolve tudo para o parceiro sem gatilho.",
              risco:
                "Parceria esfria antes do primeiro pedido.",
              melhora:
                "Enviar condição com prazo e marcar data de confirmação.",
            },
            {
              texto:
                "Já te cadastro como revendedor oficial exclusivo e mando o primeiro pedido no maior desconto.",
              adequada: false,
              pontos: 0,
              porque:
                "Concede status oficial + exclusividade + desconto máximo sem histórico algum.",
              risco:
                "Compromete região e margem com parceiro não testado; difícil reverter depois.",
              melhora:
                "Começar com pedido inicial condicionado; status e exclusividade só por performance.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 7. CLIENTE QUE QUER MODELO MENOR
    // ========================================================================
    {
      id: 7,
      titulo: "Cliente quer modelo menor",
      obrigatorio: true,
      contexto:
        "<strong>Empresa média.</strong> A qualificação aponta claramente para o <strong>100 litros</strong> (pico alto, intervalo concentrado), mas o cliente quer o <strong>60 litros</strong> só porque é mais barato. Cabe ao closer não descer de modelo por preço sem, no mínimo, registrar o risco.",
      passos: [
        {
          fala:
            "Pela nossa conversa você falou 100 litros, mas o 60 é bem mais barato. Vou de 60 mesmo.",
          opcoes: [
            {
              texto:
                "Entendo o preço, mas relembrando: seu pico bate perto de 150 e o intervalo é concentrado. O 100 tem compressor 1/5, que recupera o frio no pico; o 60 é 1/10 e ficaria no limite. Vale mesmo economizar aí?",
              adequada: true,
              pontos: 3,
              porque:
                "Defende o dimensionamento com o dado técnico (pico + compressor 1/5 vs 1/10) antes de aceitar a descida — sem ceder cegamente ao preço.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Tudo bem, o 60 também é bom, pode ir nele sem problema.",
              adequada: false,
              pontos: 1,
              porque:
                "Aceita a descida de modelo por preço sem sequer alertar sobre o subdimensionamento.",
              risco:
                "Cliente compra abaixo da necessidade achando que 'é bom', e a TDF não registrou o risco.",
              melhora:
                "Reforçar a diferença de pico/recuperação e, se insistir, registrar o risco.",
            },
            {
              texto: "Se é questão de preço, então pega o 25 que é ainda mais barato.",
              adequada: false,
              pontos: 0,
              porque:
                "Puxa para baixo demais, agravando o subdimensionamento em vez de proteger o cliente.",
              risco:
                "Falha certa no pico; a empresa fica com um equipamento muito aquém.",
              melhora:
                "Nunca reduzir ainda mais o modelo; defender o dimensionamento correto.",
            },
          ],
        },
        {
          fala:
            "Eu sei, mas orçamento é orçamento. Prefiro o 60 e economizar agora.",
          opcoes: [
            {
              texto:
                "Respeito. Então preciso deixar registrado na proposta que o 60 fica subdimensionado pro seu pico — se faltar água gelada no intervalo, é por isso. De acordo em seguir com o 60 com essa ressalva?",
              adequada: true,
              pontos: 3,
              porque:
                "Segue a regra à risca: não desce de modelo sem registrar formalmente o risco de subdimensionamento e obtém o de-acordo do cliente.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Beleza, vou de 60 e sem essa história de subdimensionado na proposta, senão fica feio.",
              adequada: false,
              pontos: 1,
              porque:
                "Omite o registro do risco para 'não ficar feio' — contraria a regra explícita.",
              risco:
                "Sem registro, a TDF fica exposta quando o equipamento falhar no pico.",
              melhora:
                "Sempre registrar o risco, mesmo que o cliente decida pelo menor.",
            },
            {
              texto: "Confia em mim, o 60 vai dar conta igual ao 100, deixa quieto.",
              adequada: false,
              pontos: 0,
              porque:
                "Afirma equivalência falsa entre 60 e 100 e induz o cliente ao erro.",
              risco:
                "Quebra de expectativa e reclamação; a promessa não se sustenta no pico.",
              melhora:
                "Ser honesto sobre a diferença e registrar a ressalva.",
            },
          ],
        },
        {
          fala:
            "Tá certo, pode registrar. Mas será que dá pra melhorar sem gastar muito mais?",
          opcoes: [
            {
              texto:
                "Dá: uma saída é ficar no 100 e diluir no parcelamento (7x), que aproxima da parcela do 60 sem perder capacidade. Outra é manter o 60 e um 2º ponto menor pra aliviar o pico. Qual te serve melhor?",
              adequada: true,
              pontos: 3,
              porque:
                "Oferece caminhos legítimos (parcelamento para viabilizar o 100, ou distribuir a demanda) em vez de simplesmente rebaixar o equipamento.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Melhorar sem gastar é impossível, ou você paga o 100 ou aceita o 60 capado.",
              adequada: false,
              pontos: 1,
              porque:
                "Fecha as alternativas de forma dura, sem explorar parcelamento ou distribuição de pontos.",
              risco:
                "Empurra o cliente para o subdimensionado sem ter oferecido a via do parcelamento.",
              melhora:
                "Apresentar parcelamento (7x) e a opção de 2º ponto.",
            },
            {
              texto: "Compra o 60 agora e daqui a um ano você troca pelo 100, mais fácil.",
              adequada: false,
              pontos: 0,
              porque:
                "Sugere comprar errado de propósito e trocar depois — custo duplicado e sem sentido.",
              risco:
                "Cliente gasta duas vezes e passa um ano com equipamento inadequado.",
              melhora:
                "Viabilizar o modelo certo agora via parcelamento, não trocar depois.",
            },
          ],
        },
        {
          fala:
            "Sabe que o parcelamento do 100 mudou meu jogo? Vou de 100. E os refis?",
          opcoes: [
            {
              texto:
                "Ótima escolha pro seu pico. O 1º refil Acquabios Multi já acompanha de brinde; como fechou o 100, garanto os 3 adicionais por R$159 (economia de R$48). Fecho a proposta do 100 em 7x com a entrega e te confirmo a data?",
              adequada: true,
              pontos: 3,
              porque:
                "Faz o upsell dos 3 refis só após o aceite (agora do modelo correto), com números certos, e encerra com próximo passo (proposta 7x + data).",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Boa, e já que subiu pro 100 aproveita e leva logo uns 8 refis de estoque.",
              adequada: false,
              pontos: 1,
              porque:
                "Extrapola a oferta oficial (1 brinde + 3 por R$159) empurrando volume aleatório.",
              risco:
                "Desconfiança e sensação de 'empurra-empurra' logo após uma decisão positiva.",
              melhora:
                "Seguir a oferta estruturada dos 3 refis por R$159.",
            },
            {
              texto:
                "Com o 100 e os refis sua água fica 100% pura e você economiza garantido todo mês.",
              adequada: false,
              pontos: 0,
              porque:
                "Promete potabilidade e percentual/garantia de economia — ambos proibidos.",
              risco:
                "Promessas indevidas de qualidade e de economia; risco legal e de reputação.",
              melhora:
                "Nada de potabilidade ou % de economia; apresentar a oferta e o próximo passo.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 8. FECHAMENTO
    // ========================================================================
    {
      id: 8,
      titulo: "Fechamento",
      obrigatorio: true,
      contexto:
        "<strong>Reta final.</strong> O cliente gostou do equipamento e do atendimento, o dimensionamento está correto, mas na hora de assinar diz que <strong>precisa pensar</strong>. Ainda não revelou a verdadeira objeção. O trabalho do closer é descobrir o real motivo e conduzir a um próximo passo.",
      passos: [
        {
          fala:
            "Olha, gostei de tudo. Mas deixa eu pensar um pouco e depois te falo.",
          opcoes: [
            {
              texto:
                "Claro, decisão importante. Só pra eu te ajudar melhor: o que ainda está te segurando — é preço, prazo de entrega, aprovação de alguém, ou alguma dúvida técnica?",
              adequada: true,
              pontos: 3,
              porque:
                "Acolhe e faz a pergunta que expõe a objeção real, oferecendo opções concretas em vez de aceitar o 'vou pensar' vago.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Sem problema, qualquer coisa é só me chamar quando decidir.",
              adequada: false,
              pontos: 1,
              porque:
                "Aceita o adiamento sem investigar a objeção e encerra sem próximo passo.",
              risco:
                "'Vou pensar' vira sumiço; sem descobrir o motivo, não há como avançar.",
              melhora:
                "Perguntar o que está segurando e combinar um retorno com data.",
            },
            {
              texto: "Se pensar demais o preço sobe, então é melhor fechar agora.",
              adequada: false,
              pontos: 0,
              porque:
                "Pressão de escassez artificial no lugar de entender a real objeção; soa manipulador.",
              risco:
                "Afasta um cliente que já gostou de tudo e queima a confiança construída.",
              melhora:
                "Descobrir a objeção real antes de qualquer gatilho de urgência.",
            },
          ],
        },
        {
          fala:
            "É que… na verdade eu queria comparar com outra marca que vi mais barata.",
          opcoes: [
            {
              texto:
                "Faz sentido comparar. Só cuidado pra comparar igual: veja o compressor, o material (nosso é todo inox, serpentina inox 304) e se o modelo deles aguenta o SEU pico. Muita diferença de preço vem de equipamento subdimensionado. Quer que eu te ajude a comparar ponto a ponto?",
              adequada: true,
              pontos: 3,
              porque:
                "Reenquadra a comparação nos critérios que importam (compressor, material, dimensionamento pelo pico) sem falar mal do concorrente, e se oferece para ajudar.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Marca mais barata é tudo ruim, não perde tempo com isso não.",
              adequada: false,
              pontos: 1,
              porque:
                "Desqualifica o concorrente genericamente, sem argumento técnico; soa defensivo.",
              risco:
                "Cliente sente que está sendo enrolado e vai comparar por conta própria mesmo assim.",
              melhora:
                "Dar critérios objetivos de comparação (compressor, material, pico).",
            },
            {
              texto: "Então cubro qualquer preço que eles te derem, é só me mostrar.",
              adequada: false,
              pontos: 0,
              porque:
                "Pula direto para guerra de preço, tratando equipamentos possivelmente diferentes como iguais.",
              risco:
                "Destrói margem e valida a comparação errada (preço puro, sem dimensionamento).",
              melhora:
                "Comparar valor e adequação técnica antes de tocar em preço.",
            },
          ],
        },
        {
          fala:
            "Verdade, o deles é um 60 e o meu pico é alto. Mas o valor do 100 ainda pesa um pouco pra mim.",
          opcoes: [
            {
              texto:
                "Então o ponto é viabilizar o 100, não trocar por um equipamento que não te atende. No 100 temos 7x, o que dilui bem a parcela, e ainda entra o 1º refil de brinde. Se eu te encaixar numa condição confortável, a gente fecha hoje?",
              adequada: true,
              pontos: 3,
              porque:
                "Isola a objeção real (é preço, não modelo), oferece parcelamento como solução e faz um fechamento condicional claro.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Se pesa, volta pro 60 que é mais barato e resolve.",
              adequada: false,
              pontos: 1,
              porque:
                "Rebaixa o modelo por preço mesmo sabendo que o pico é alto — e sem registrar risco.",
              risco:
                "Subdimensionamento e recompra futura; joga fora todo o trabalho de dimensionar certo.",
              melhora:
                "Manter o 100 e viabilizar via parcelamento; se descer, registrar o risco.",
            },
            {
              texto: "Preço é preço, ou você tem o dinheiro ou não dá pra fazer nada.",
              adequada: false,
              pontos: 0,
              porque:
                "Encerra a negociação sem oferecer parcelamento nem alternativa; abandona o cliente na objeção.",
              risco:
                "Perde uma venda que estava madura por falta de condução da condição de pagamento.",
              melhora:
                "Apresentar as 7x e uma condição confortável para fechar.",
            },
          ],
        },
        {
          fala:
            "Nessa condição parcelada eu consigo. Pode fechar o 100.",
          opcoes: [
            {
              texto:
                "Fechado! Emito agora a proposta do 100 em 7x, com o 1º refil de brinde e os 3 adicionais por R$159 (economia de R$48). Te envio pra assinatura hoje e já agendo a entrega — confirmo a data em seguida. Bem-vindo!",
              adequada: true,
              pontos: 3,
              porque:
                "Fecha, faz o upsell dos refis após o aceite e encerra com PRÓXIMO PASSO concreto (proposta para assinar hoje + agenda de entrega).",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Show, depois eu te mando os detalhes e a gente acerta a entrega qualquer dia desses.",
              adequada: false,
              pontos: 1,
              porque:
                "Fecha a venda mas afrouxa o encerramento com 'qualquer dia desses', sem próximo passo firme.",
              risco:
                "Sem data, a entrega e a assinatura escorregam e o cliente pode esfriar mesmo após o sim.",
              melhora:
                "Emitir a proposta na hora e cravar data de assinatura/entrega.",
            },
            {
              texto:
                "Ótimo! E antes de fechar, leva também 10 refis e uns produtos extras que eu recomendo.",
              adequada: false,
              pontos: 0,
              porque:
                "Sobrecarrega o momento do sim com volume fora da oferta oficial, arriscando a venda já ganha.",
              risco:
                "Cliente recua diante do empurra-empurra e a venda principal trava.",
              melhora:
                "Fechar o 100, aplicar só a oferta oficial dos 3 refis e definir entrega.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 9. ESCRITÓRIO PEQUENO (evitar superdimensionamento)
    // ========================================================================
    {
      id: 9,
      titulo: "Escritório pequeno",
      obrigatorio: true,
      contexto:
        "<strong>Escritório de 18 funcionários.</strong> Uso de água <strong>bem distribuído no dia</strong> (ninguém bebe todo mundo junto), ambiente interno com ar-condicionado. O cliente pesquisou por conta própria e chegou querendo o <strong>60 litros</strong> \"pra garantir\". Aqui o risco é o oposto do comum: <strong>superdimensionar</strong>. O closer precisa ser honesto e não empurrar equipamento maior do que a necessidade.",
      passos: [
        {
          fala:
            "Somos 18 aqui no escritório. Andei pesquisando e acho que vou de 60 litros pra garantir que nunca falte.",
          opcoes: [
            {
              texto:
                "Deixa eu entender o uso antes de confirmar: vocês bebem água mais concentrado num horário (todo mundo junto) ou é distribuído ao longo do dia? Pra 18 pessoas isso muda bastante o modelo certo.",
              adequada: true,
              pontos: 3,
              porque:
                "Qualifica o pico simultâneo antes de aceitar o modelo que o cliente escolheu sozinho — evita vender maior sem necessidade.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Perfeito, 60 litros é uma ótima escolha pra 18 pessoas, fecho já pra você.",
              adequada: false,
              pontos: 1,
              porque:
                "Aceita o palpite do cliente sem checar o pico; para 18 pessoas com uso distribuído o 60L é claramente superdimensionado.",
              risco:
                "Cliente paga por capacidade que não vai usar e, se descobrir depois, sente que foi empurrado. Perde-se confiança e indicações.",
              melhora:
                "Levantar o pico simultâneo e recomendar pela demanda real, mesmo que seja um modelo menor e mais barato.",
            },
            {
              texto:
                "Se é pra garantir mesmo, pega logo o 100 litros que aí nunca vai ter problema nenhum.",
              adequada: false,
              pontos: 0,
              porque:
                "Empurra um modelo ainda maior por reflexo de 'garantir', agravando o superdimensionamento para um escritório de 18 pessoas.",
              risco:
                "Venda inflada que o cliente não precisa; alto risco de arrependimento e de fama de vendedor que empurra.",
              melhora:
                "Dimensionar pelo pico real; para 18 distribuídos, um modelo de entrada tende a atender com folga.",
            },
          ],
        },
        {
          fala:
            "Ah, é bem distribuído mesmo. Um vai na copa, volta, depois outro. Nunca tem fila. Achei que grande fosse sempre melhor.",
          opcoes: [
            {
              texto:
                "Então sendo honesto com você: o 15 litros já atende 18 pessoas com uso distribuído tranquilamente. O 60 seria pagar por capacidade que você não vai usar. Prefiro te indicar o certo do que o maior.",
              adequada: true,
              pontos: 3,
              porque:
                "Recomenda com honestidade o modelo adequado ao pico real e explica por que o maior seria desperdício — protege o cliente do superdimensionamento.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Grande é sempre melhor sim, o 60 nunca vai te deixar na mão. Vamos nele então.",
              adequada: false,
              pontos: 1,
              porque:
                "Reforça um mito ('grande é sempre melhor') pra justificar vender mais, contrariando a demanda real de uso distribuído.",
              risco:
                "Superdimensiona conscientemente; se o cliente perceber, a relação de confiança quebra.",
              melhora:
                "Ser transparente que uso distribuído de 18 pessoas não exige 60L e indicar o modelo proporcional.",
            },
            {
              texto:
                "Melhor pegar dois bebedouros então, um de 60 e um reserva, pra nunca faltar mesmo.",
              adequada: false,
              pontos: 0,
              porque:
                "Dobra a venda sem nenhuma justificativa de demanda; um escritório de 18 com uso distribuído não precisa de dois equipamentos.",
              risco:
                "Gasto totalmente desnecessário e sensação clara de empurra-empurra.",
              melhora:
                "Um único modelo de entrada resolve; nunca criar necessidade inexistente.",
            },
          ],
        },
        {
          fala:
            "Nossa, gostei da sua honestidade. Então vou de 15 litros mesmo. Como a gente fecha?",
          opcoes: [
            {
              texto:
                "Fecho assim: emito a proposta do 15 litros hoje, com o 1º refil Acquabios Multi de brinde, e te confirmo a data de entrega. Já registro tudo no nosso sistema. Como você fechou o bebedouro, ainda consigo os 3 refis adicionais por R$159 (economia de R$48) — quer que eu inclua?",
              adequada: true,
              pontos: 3,
              porque:
                "Encerra com próximo passo concreto e registro, e só depois do aceite oferece os 3 refis por R$159 — na ordem e com os números certos.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Combinado, depois te mando a proposta do 15 quando sobrar um tempo aqui.",
              adequada: false,
              pontos: 1,
              porque:
                "Afrouxa o fechamento sem data nem registro e perde a janela natural do upsell dos refis.",
              risco:
                "Sem próximo passo firme, o negócio esfria mesmo já tendo o sim do cliente.",
              melhora:
                "Emitir a proposta na hora, cravar entrega, registrar no CRM e oferecer os 3 refis por R$159.",
            },
            {
              texto:
                "Fechado o 15! Já aproveita e leva 6 refis adiantados que é bom ter estoque.",
              adequada: false,
              pontos: 0,
              porque:
                "Extrapola a oferta oficial (1 brinde + 3 por R$159) empurrando volume aleatório logo após ganhar a confiança do cliente pela honestidade.",
              risco:
                "Contradiz a postura honesta que acabou de conquistar o cliente e soa como empurra-empurra.",
              melhora:
                "Seguir a oferta estruturada dos 3 refis por R$159 e fechar com próximo passo.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 10. OBJEÇÃO DE PREÇO (a objeção real é pagamento)
    // ========================================================================
    {
      id: 10,
      titulo: "Objeção de preço",
      obrigatorio: true,
      contexto:
        "<strong>Empresa média.</strong> O cliente foi bem qualificado, o <strong>100 litros está correto</strong> pro pico dele e ele <strong>gostou do equipamento</strong>. Na hora do valor, trava: \"está caro\". A objeção real, ainda escondida, é a <strong>forma de pagamento</strong> (o valor à vista aperta o caixa). O trabalho é <strong>investigar, isolar, negociar com contrapartida e fechar</strong> — sem rebaixar o modelo.",
      passos: [
        {
          fala:
            "Gostei do 100 litros, faz sentido pro nosso movimento. Mas ficou caro, viu.",
          opcoes: [
            {
              texto:
                "Entendo. Só pra eu te ajudar direito: quando você diz caro, é o valor total que assustou, é a forma de pagamento que não encaixou, ou está comparando com outra proposta? Cada caso tem uma saída.",
              adequada: true,
              pontos: 3,
              porque:
                "Investiga a objeção real por trás do 'caro' com opções concretas, em vez de sair dando desconto ou baixando o modelo.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Consigo dar 10% de desconto agora pra resolver esse caro. Fecha?",
              adequada: false,
              pontos: 1,
              porque:
                "Dá desconto por reflexo, sem entender a objeção e sem contrapartida — pode nem ser questão de preço absoluto.",
              risco:
                "Queima margem à toa e ensina o cliente a duvidar do preço; se a objeção era pagamento, o desconto nem resolve.",
              melhora:
                "Primeiro investigar o que significa 'caro'; desconto, se houver, só com contrapartida.",
            },
            {
              texto:
                "Se ficou caro, então melhor descer pro 60 litros que sai bem menos.",
              adequada: false,
              pontos: 0,
              porque:
                "Rebaixa o modelo por preço mesmo com o 100 sendo o correto pro pico, e sem registrar risco.",
              risco:
                "Subdimensiona o cliente e joga fora a qualificação; ele volta com o mesmo problema no pico.",
              melhora:
                "Manter o 100 e investigar a objeção real antes de qualquer mudança.",
            },
          ],
        },
        {
          fala:
            "Na verdade o valor em si tá ok pro que entrega. O problema é tirar tudo à vista do caixa esse mês.",
          opcoes: [
            {
              texto:
                "Então o ponto é a forma de pagamento, não o preço. Temos o parcelado em 7x, que dilui e não pesa no seu caixa de uma vez. Se eu te encaixar numa parcela confortável, fechamos o 100 hoje?",
              adequada: true,
              pontos: 3,
              porque:
                "Isola a objeção real (fluxo de caixa) e oferece o parcelamento como solução, com fechamento condicional claro — sem tocar no modelo nem na margem.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Ah, se é o caixa, te dou um desconto grande à vista que aí compensa o esforço.",
              adequada: false,
              pontos: 1,
              porque:
                "Insiste em desconto à vista justamente quando o problema é não ter o valor à vista; não resolve a dor real e ainda corta margem.",
              risco:
                "Solução desalinhada da objeção; o cliente continua sem conseguir pagar à vista e a margem some.",
              melhora:
                "Oferecer parcelamento (7x), que ataca diretamente a questão do caixa.",
            },
            {
              texto:
                "Sem problema, quando o caixa melhorar você me procura de novo.",
              adequada: false,
              pontos: 0,
              porque:
                "Desiste de um cliente maduro e com objeção facilmente contornável, sem oferecer o parcelamento que existe.",
              risco:
                "Perde uma venda praticamente ganha por não conduzir a condição de pagamento.",
              melhora:
                "Apresentar o parcelamento e conduzir ao fechamento agora.",
            },
          ],
        },
        {
          fala:
            "Parcelado em 7x muda tudo. Mas dá pra melhorar um pouquinho a condição pra eu fechar hoje?",
          opcoes: [
            {
              texto:
                "Consigo, com uma contrapartida: fechando hoje e no formato à vista do pix, aplico a condição pix; ou, se preferir o 7x, mantenho a parcela cheia. Qual das duas fecha pra você agora?",
              adequada: true,
              pontos: 3,
              porque:
                "Concede vantagem apenas com contrapartida (pix à vista) e dá ao cliente uma escolha objetiva, protegendo a margem — desconto nunca sai de graça.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Melhoro sim, corto mais um pouco no 7x sem exigir nada, só pra você fechar logo.",
              adequada: false,
              pontos: 1,
              porque:
                "Dá desconto sem contrapartida, contrariando a regra; e reduzir o parcelado ainda corrói mais a margem.",
              risco:
                "Cliente aprende que sempre dá pra pedir mais; margem espremida a cada negociação futura.",
              melhora:
                "Só melhorar mediante contrapartida clara (ex.: condição pix à vista).",
            },
            {
              texto:
                "Não dá pra mexer em nada, o preço é esse e ponto. Pega ou larga.",
              adequada: false,
              pontos: 0,
              porque:
                "Fecha a negociação de forma ríspida bem quando o cliente sinaliza que quer fechar; sem oferecer sequer a via pix.",
              risco:
                "Esfria um fechamento quente por rigidez e falta de jogo de cintura.",
              melhora:
                "Oferecer a condição pix com contrapartida em vez de bater o pé.",
            },
          ],
        },
        {
          fala:
            "Faço no pix então, com a condição à vista. Pode fechar o 100.",
          opcoes: [
            {
              texto:
                "Fechado! Emito a proposta do 100 no pix agora pra você confirmar hoje e já registro no CRM. O 1º refil Acquabios Multi vai de brinde e, como fechou o bebedouro, garanto os 3 adicionais por R$159 (economia de R$48). Em seguida confirmo a data de entrega.",
              adequada: true,
              pontos: 3,
              porque:
                "Fecha, registra no CRM, faz o upsell dos refis só após o aceite com números corretos e crava o próximo passo (proposta + entrega).",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Show, fechado no pix. Depois eu vejo com você essa parte de entrega e refil com calma.",
              adequada: false,
              pontos: 1,
              porque:
                "Deixa entrega e upsell em aberto, sem data e sem registro — perde a janela do refil e afrouxa o encerramento.",
              risco:
                "Sem próximo passo firme, a entrega escorrega e o refil não é ofertado.",
              melhora:
                "Emitir proposta, registrar no CRM, oferecer os 3 refis por R$159 e cravar a entrega.",
            },
            {
              texto:
                "Fechado! E já que você topou o pix, leva também uns 10 refis e um segundo bebedouro de reserva.",
              adequada: false,
              pontos: 0,
              porque:
                "Sobrecarrega o momento do sim com volume fora da oferta oficial e um equipamento sem necessidade.",
              risco:
                "Cliente recua diante do empurra-empurra e a venda já ganha trava.",
              melhora:
                "Aplicar só a oferta oficial dos 3 refis por R$159 e definir entrega.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 11. VOU PENSAR (decisor oculto — precisa falar com o sócio)
    // ========================================================================
    {
      id: 11,
      titulo: "Vou pensar",
      obrigatorio: true,
      contexto:
        "<strong>Pequena empresa, dois sócios.</strong> O contato recebeu a proposta do <strong>100 litros</strong>, gostou, mas diz que <strong>\"vai pensar\"</strong>. A objeção real não é preço nem produto: ele <strong>precisa falar com o sócio</strong> antes de decidir e não assumiu isso. O trabalho é <strong>descobrir a objeção real, identificar o decisor e agendar um retorno com data</strong> — sem pressão.",
      passos: [
        {
          fala:
            "Recebi a proposta, tá tudo certinho. Deixa eu pensar com calma e semana que vem eu te falo.",
          opcoes: [
            {
              texto:
                "Claro, faz sentido. Só pra eu não te atrapalhar: tem algum ponto da proposta que ainda gera dúvida, ou é mais uma questão de alinhar a decisão internamente antes de seguir?",
              adequada: true,
              pontos: 3,
              porque:
                "Acolhe e faz a pergunta que separa dúvida técnica de decisão interna, abrindo espaço pro cliente admitir que precisa alinhar com alguém.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Sem problema, semana que vem eu espero seu retorno então.",
              adequada: false,
              pontos: 1,
              porque:
                "Aceita o 'vou pensar' sem investigar nem descobrir se há outro decisor; encerra sem próximo passo estruturado.",
              risco:
                "'Semana que vem' vira silêncio; sem entender o real motivo, não há como avançar.",
              melhora:
                "Perguntar o que trava e sondar se a decisão depende de mais alguém.",
            },
            {
              texto:
                "Pensar demais não ajuda, essa condição é só até amanhã. Melhor fechar agora.",
              adequada: false,
              pontos: 0,
              porque:
                "Cria urgência artificial em cima de um cliente que gostou de tudo, em vez de entender o que segura a decisão.",
              risco:
                "Queima a confiança e empurra o cliente pra defensiva; pressão falsa afasta.",
              melhora:
                "Descobrir a objeção real antes de qualquer gatilho de urgência.",
            },
          ],
        },
        {
          fala:
            "É que… essa compra eu não decido sozinho. Preciso alinhar com meu sócio antes.",
          opcoes: [
            {
              texto:
                "Perfeito, decisão de dois. Pra facilitar pra vocês: quer que eu prepare um resumo da proposta com o dimensionamento e os números, num formato que você leva pronto pro seu sócio? Assim ele decide com tudo na mão.",
              adequada: true,
              pontos: 3,
              porque:
                "Identifica o decisor real e municia o interlocutor pra vender internamente, avançando em vez de pressionar — respeita o processo decisório.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Ah, mas você não consegue bater o martelo sozinho não? Se quiser eu seguro a condição só se for hoje.",
              adequada: false,
              pontos: 1,
              porque:
                "Tenta furar o processo decisório e pressiona com escassez, ignorando que o sócio precisa participar.",
              risco:
                "Constrange o contato e não resolve o gargalo real (o sócio); pode travar de vez.",
              melhora:
                "Aceitar o processo de dois e ajudar a levar o caso ao sócio com material pronto.",
            },
            {
              texto:
                "Tá bom, então quando você e seu sócio decidirem vocês me procuram.",
              adequada: false,
              pontos: 0,
              porque:
                "Encerra passivo, sem apoiar a venda interna e sem próximo passo — entrega a bola inteira ao cliente.",
              risco:
                "Proposta engavetada por falta de acompanhamento; o negócio morre no 'depois a gente vê'.",
              melhora:
                "Oferecer material pra o sócio e combinar data de retorno.",
            },
          ],
        },
        {
          fala:
            "Isso ia ajudar bastante. Ele para pra ver essas coisas geralmente nas sextas.",
          opcoes: [
            {
              texto:
                "Combinado: te mando o resumo até quinta, pra você já apresentar na sexta. E na segunda eu te ligo pra saber o que ele achou e destravar o que precisar — pode ser?",
              adequada: true,
              pontos: 3,
              porque:
                "Fecha com próximo passo datado dos dois lados (resumo até quinta, retorno na segunda), ancorado na agenda real do decisor.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Beleza, te mando o material e qualquer coisa você me chama depois da conversa com ele.",
              adequada: false,
              pontos: 1,
              porque:
                "Manda o material mas encerra sem data de retorno; devolve o acompanhamento pro cliente.",
              risco:
                "Sem gatilho de follow-up, o retorno depende só da memória do cliente e some.",
              melhora:
                "Combinar data de envio e data em que você retorna pra saber a decisão.",
            },
            {
              texto:
                "Ok, mas adianta que se ele não decidir até sexta a condição não vale mais.",
              adequada: false,
              pontos: 0,
              porque:
                "Impõe prazo artificial sobre a agenda de um terceiro, transformando apoio em pressão.",
              risco:
                "Cria atrito com o decisor que sequer participou da conversa; sabota a venda interna.",
              melhora:
                "Respeitar a agenda do sócio e combinar um retorno colaborativo, sem escassez falsa.",
            },
          ],
        },
        {
          fala:
            "Fechado assim. Manda o resumo até quinta que eu levo pra ele na sexta.",
          opcoes: [
            {
              texto:
                "Ótimo. Já registro no CRM o combinado: resumo do 100 litros até quinta, apresentação na sexta e meu retorno na segunda. Deixo o material claro e com o dimensionamento pra vocês decidirem com segurança. Falo com você segunda!",
              adequada: true,
              pontos: 3,
              porque:
                "Confirma o próximo passo, registra no CRM com datas e responsáveis e mantém a conversa viva sem pressão — condução impecável.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Perfeito, mando o resumo. E se ele topar, já deixo os refis todos inclusos de uma vez na proposta.",
              adequada: false,
              pontos: 1,
              porque:
                "Antecipa upsell antes mesmo do aceite do bebedouro (que depende do sócio) e infla a proposta que ainda vai ser avaliada.",
              risco:
                "Sobrecarrega uma decisão que nem foi tomada e pode travar a aprovação do sócio.",
              melhora:
                "Vincular os 3 refis por R$159 ao aceite do bebedouro; primeiro fechar o principal.",
            },
            {
              texto:
                "Beleza, mando quando der. Se eu esquecer, você me cobra.",
              adequada: false,
              pontos: 0,
              porque:
                "Trata um compromisso combinado como incerto e joga a responsabilidade do follow-up no cliente.",
              risco:
                "Passa desorganização e desinteresse; o cliente perde confiança e o material pode nem chegar.",
              melhora:
                "Assumir a data (até quinta), registrar no CRM e cumprir sem depender de cobrança do cliente.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 12. UPSELL (cliente já aceitou o bebedouro, recusa o refil adicional)
    // ========================================================================
    {
      id: 12,
      titulo: "Upsell",
      obrigatorio: true,
      contexto:
        "<strong>Bebedouro já fechado.</strong> O cliente aceitou o <strong>100 litros</strong> e a proposta está pronta. Você faz o upsell oficial: 1º refil Acquabios Multi de brinde + <strong>3 adicionais por R$159</strong> (economia de R$48). O cliente <strong>não quer o refil adicional</strong> agora. O trabalho é <strong>apresentar economia e praticidade uma vez, respeitar a recusa e registrar tudo no CRM</strong> — sem insistir.",
      passos: [
        {
          fala:
            "Fechei o 100 litros, tá ótimo. Mas esses refis adicionais eu não quero agora não.",
          opcoes: [
            {
              texto:
                "Sem problema. Só pra você decidir com a informação: o 1º refil já vai de brinde. Os 3 adicionais, junto com o bebedouro, saem por R$159 em vez de R$207 — economia de R$48, e te cobre por mais tempo sem precisar pedir de novo. Faz sentido aproveitar agora ou prefere deixar só o brinde?",
              adequada: true,
              pontos: 3,
              porque:
                "Apresenta economia (R$48) e praticidade uma vez, com os números certos, e já abre a porta pra uma recusa tranquila — sem empurrar.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Você precisa levar os refis sim, senão daqui a pouco fica sem e a água piora. Insisto que leve os 3.",
              adequada: false,
              pontos: 1,
              porque:
                "Pressiona e usa argumento de medo ('a água piora') em vez de apresentar valor e respeitar a decisão do cliente.",
              risco:
                "Soa como empurra-empurra logo após uma venda ganha; desgasta a relação e a confiança.",
              melhora:
                "Apresentar economia e praticidade uma vez e aceitar a resposta do cliente.",
            },
            {
              texto:
                "Beleza, então nem falo de refil. Deixa pra lá.",
              adequada: false,
              pontos: 0,
              porque:
                "Desiste do upsell sem sequer apresentar a economia oficial uma vez; deixa valor na mesa por não conduzir.",
              risco:
                "Cliente nem fica sabendo da condição dos R$159; oportunidade legítima perdida por omissão.",
              melhora:
                "Fazer a oferta oficial uma vez, com clareza, antes de aceitar a recusa.",
            },
          ],
        },
        {
          fala:
            "Entendi a economia, mas nesse mês eu só quero o bebedouro mesmo. O refil adicional fica pra depois.",
          opcoes: [
            {
              texto:
                "Perfeito, respeito totalmente. Fica combinado: você leva o 100 com o 1º refil de brinde e, quando quiser os adicionais, é só me chamar que vejo a condição da época. Registro aqui que você tem interesse futuro pra eu te lembrar na hora certa.",
              adequada: true,
              pontos: 3,
              porque:
                "Respeita a recusa sem insistir, mantém a porta aberta e registra o interesse futuro no CRM pra um follow-up no momento certo.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Tem certeza? Olha que a condição dos R$159 é só agora, depois vai sair bem mais caro, hein.",
              adequada: false,
              pontos: 1,
              porque:
                "Insiste após a recusa com escassez, transformando uma oferta legítima em pressão.",
              risco:
                "Cliente que já disse não se sente forçado; risco de azedar uma venda que estava boa.",
              melhora:
                "Aceitar o não na primeira recusa e registrar o interesse pra depois.",
            },
            {
              texto:
                "Tá, mas deixa eu já colocar os 3 refis na proposta assim mesmo, aí você decide quando chegar.",
              adequada: false,
              pontos: 0,
              porque:
                "Ignora a recusa explícita e inclui o item mesmo assim, empurrando pela via da proposta.",
              risco:
                "Quebra de confiança e sensação de que o 'não' não foi respeitado; pode derrubar a venda inteira.",
              melhora:
                "Não incluir o que o cliente recusou; registrar interesse futuro e seguir.",
            },
          ],
        },
        {
          fala:
            "Isso, só o bebedouro agora. Como fica então?",
          opcoes: [
            {
              texto:
                "Fecho a proposta do 100 litros com o 1º refil de brinde, sem os adicionais, e registro no CRM que os 3 refis por R$159 ficam como oferta em aberto pra quando você quiser. Te confirmo a data de entrega em seguida. Combinado?",
              adequada: true,
              pontos: 3,
              porque:
                "Fecha exatamente o que o cliente aceitou, registra a recusa e o interesse futuro no CRM e crava o próximo passo (entrega) — condução limpa.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Fechado só o bebedouro. Ah, mas semana que vem eu te ligo de novo insistindo nos refis, viu?",
              adequada: false,
              pontos: 1,
              porque:
                "Anuncia que vai insistir, transformando um follow-up legítimo em perseguição declarada.",
              risco:
                "Cliente já antecipa incômodo; o follow-up perde a chance de ser bem recebido.",
              melhora:
                "Registrar o interesse e retomar no momento certo (ex.: próximo ciclo de troca), sem prometer insistência.",
            },
            {
              texto:
                "Fecho o bebedouro, mas anota aí que sem os refis a garantia do equipamento não vale igual.",
              adequada: false,
              pontos: 0,
              porque:
                "Inventa condição falsa (vincular garantia à compra de refil) pra forçar o upsell — desonesto.",
              risco:
                "Informação incorreta sobre garantia; exposição e quebra grave de confiança.",
              melhora:
                "Nunca condicionar garantia ao refil; fechar o que foi aceito e registrar o resto como interesse futuro.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // 13. FOLLOW-UP (proposta enviada há 3 dias, prazo do cliente era 15 dias)
    // ========================================================================
    {
      id: 13,
      titulo: "Follow-up",
      obrigatorio: true,
      contexto:
        "<strong>Proposta enviada há 3 dias, sem resposta.</strong> O cliente é uma indústria que pediu o <strong>100 litros</strong> e disse que tinha <strong>prazo de 15 dias</strong> pra decidir (ainda faltam ~12). O dimensionamento foi bem feito. O trabalho do follow-up é <strong>reaparecer com contexto e utilidade, sem cobrar nem pressionar</strong>, reforçando o diagnóstico e deixando um próximo passo — respeitando que o prazo do cliente ainda está correndo.",
      passos: [
        {
          fala:
            "(O cliente não respondeu a proposta enviada há 3 dias. Você decide fazer o follow-up. Qual a melhor abordagem de abertura?)",
          opcoes: [
            {
              texto:
                "Oi, [nome]! Passando só pra confirmar que a proposta do 100 litros chegou certinho e me colocar à disposição pra qualquer dúvida técnica enquanto você avalia. Sei que seu prazo é até [data], sem pressa — só não quero te deixar sem suporte.",
              adequada: true,
              pontos: 3,
              porque:
                "Follow-up com contexto e utilidade: confirma recebimento, se oferece pra tirar dúvidas e respeita explicitamente o prazo do cliente — sem cobrar.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Oi, e aí? Já decidiu sobre a proposta? Preciso de uma resposta pra fechar minha meta.",
              adequada: false,
              pontos: 1,
              porque:
                "Cobra resposta e joga a própria meta como motivo, ignorando que o cliente ainda tem prazo pra decidir.",
              risco:
                "Cliente se sente pressionado dentro do prazo que combinou; passa impressão de vendedor ansioso.",
              melhora:
                "Reaparecer com utilidade e respeitar o prazo, sem cobrar decisão.",
            },
            {
              texto:
                "Oi! Aquela condição da proposta expira hoje, se não fechar agora você perde. Bora?",
              adequada: false,
              pontos: 0,
              porque:
                "Cria urgência falsa 3 dias após enviar, contrariando o prazo de 15 dias que o próprio cliente pediu.",
              risco:
                "Escassez mentirosa destrói a confiança e pode fazer o cliente descartar a proposta.",
              melhora:
                "Nunca inventar expiração; conduzir o follow-up com respeito ao prazo acordado.",
            },
          ],
        },
        {
          fala:
            "Oi! Chegou sim, obrigado. Ainda estou analisando aqui com o pessoal, dentro do prazo.",
          opcoes: [
            {
              texto:
                "Ótimo, fico tranquilo então. Se ajudar na análise, lembro que dimensionei o 100 justamente pro seu pico de intervalo concentrado — o compressor 1/5 é o que resolve aquele problema de esquentar no rush que você comentou. Qualquer comparação técnica, me chama que te ajudo.",
              adequada: true,
              pontos: 3,
              porque:
                "Reforça o diagnóstico (pico + compressor 1/5) que sustenta a proposta e se coloca como apoio na análise — agrega valor sem pressionar.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Beleza. Mas ó, se demorar muito pode faltar no estoque e aí complica pra você.",
              adequada: false,
              pontos: 1,
              porque:
                "Insere um receio de escassez não confirmado pra apressar, em vez de agregar valor à análise do cliente.",
              risco:
                "Pressão velada dentro do prazo dele; se o estoque não faltar, a credibilidade cai.",
              melhora:
                "Reforçar o diagnóstico técnico e se oferecer como apoio, sem plantar medo de estoque.",
            },
            {
              texto:
                "Tá analisando o quê ainda? A proposta tá clara, é só assinar.",
              adequada: false,
              pontos: 0,
              porque:
                "Desmerece o processo de análise do cliente e empurra a assinatura, sendo ríspido dentro do prazo combinado.",
              risco:
                "Soa arrogante e apressado; afasta um cliente que está seguindo o próprio prazo.",
              melhora:
                "Respeitar a análise, reforçar o valor técnico e oferecer ajuda.",
            },
          ],
        },
        {
          fala:
            "Faz sentido esse ponto do compressor. Vou fechar a análise nos próximos dias e te retorno.",
          opcoes: [
            {
              texto:
                "Combinado. Pra eu te acompanhar sem te incomodar: posso te dar um retorno na [data, dentro do prazo dele] só pra ver se surgiu alguma dúvida? E deixo já reservado um horário pra alinhar entrega assim que você decidir. Fico à disposição até lá.",
              adequada: true,
              pontos: 3,
              porque:
                "Fecha com próximo passo datado dentro do prazo do cliente, oferece apoio contínuo e já encaminha a entrega — sem cobrar decisão antecipada.",
              risco: "",
              melhora: "",
            },
            {
              texto:
                "Ok, mas me dá uma previsão exata de dia e hora que você vai assinar, pra eu não ficar no escuro.",
              adequada: false,
              pontos: 1,
              porque:
                "Exige compromisso rígido de assinatura em vez de combinar um retorno colaborativo dentro do prazo.",
              risco:
                "Pressiona o cliente a se comprometer antes da hora; pode gerar recuo.",
              melhora:
                "Combinar uma data de follow-up dentro do prazo, sem exigir data de assinatura.",
            },
            {
              texto:
                "Tá bom, então não te ligo mais, quando você quiser você aparece.",
              adequada: false,
              pontos: 0,
              porque:
                "Encerra passivo, abre mão do acompanhamento e joga toda a iniciativa pro cliente.",
              risco:
                "Sem próximo passo, o negócio esfria e o follow-up seguinte perde o gancho.",
              melhora:
                "Combinar um retorno com data dentro do prazo e deixar a entrega encaminhada.",
            },
          ],
        },
      ],
    },
  ],
};
