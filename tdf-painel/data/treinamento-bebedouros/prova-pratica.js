// ============================================================================
// PROVA PRÁTICA — Bebedouros Industriais Tudo de Filtro
// ----------------------------------------------------------------------------
// Avaliação final da academia. O aluno percorre 3 ETAPAS (Qualificação →
// Apresentação → Fechamento e upsell). Cada etapa tem um cenário (contexto em
// HTML) e questões de múltipla escolha; cada opção vale 3/1/0 pontos e traz um
// feedback explicando a nota. A melhor opção sempre reflete as regras da casa.
//
// REGRAS QUE SUSTENTAM AS RESPOSTAS "MELHORES" (ver produtos.js / precos.js /
// roleplays.js):
//   - O PICO de consumo SIMULTÂNEO define o modelo, NUNCA o total de pessoas.
//     Capacidade do reservatório não é limite diário.
//   - Compressor: 15/25/60 = 1/10; 100/200 = 1/5.
//   - Refil = Acquabios Multi (1º acompanha de brinde). Upsell dos 3 refis
//     adicionais (3 por R$159, economia R$48) só DEPOIS do aceite do bebedouro.
//   - Nunca prometer potabilidade nem % de economia. Nunca pressão/urgência
//     falsa. Desconto só com contrapartida. Não descer de modelo por preço sem
//     registrar o risco de subdimensionamento.
//   - Água de poço não se resolve só com o refil do bebedouro — pede avaliação.
//   - Sempre terminar com PRÓXIMO PASSO definido e registro no CRM.
//
// notaMinima = % de acerto para aprovar. Nada de conteúdo fica preso em
// componente: edite só este arquivo.
// ============================================================================

module.exports = {
  notaMinima: 85,
  ETAPAS: [
    // ========================================================================
    // ETAPA 1 — QUALIFICAÇÃO
    // ========================================================================
    {
      num: 1,
      titulo: "Qualificação",
      contexto:
        "<strong>Lead novo pelo WhatsApp.</strong> Uma empresa de médio porte em Sorocaba/SP escreve: <em>\"Oi, queria um bebedouro industrial pra empresa. Somos 120 funcionários. Quanto custa?\"</em> O lead ainda não informou pico, voltagem nem a origem da água, e já começou perguntando preço. Seu trabalho aqui é <strong>qualificar antes de indicar ou precificar</strong>.",
      questoes: [
        {
          pergunta:
            "O lead abre com \"somos 120 funcionários, quanto custa?\". Qual a MELHOR primeira resposta?",
          opcoes: [
            {
              texto:
                "Posso te ajudar a acertar o modelo. Só uma coisa antes do preço: 120 é o total. No horário de maior movimento, quantas pessoas bebem água mais ou menos ao mesmo tempo? É esse pico que define o bebedouro certo.",
              pontos: 3,
              feedback:
                "Melhor: não joga preço no total de pessoas, ancora no pico simultâneo — que é o que realmente dimensiona — e faz a pergunta que qualifica antes de precificar.",
            },
            {
              texto:
                "Pra 120 funcionários o ideal é o 100 litros. O parcelado sai 7x de R$350. Quer que eu já emita a proposta?",
              pontos: 1,
              feedback:
                "Dimensiona pelo total e joga preço sem qualificar pico, voltagem ou origem da água. Pode superdimensionar e queima a chance de entender a real necessidade.",
            },
            {
              texto:
                "O reservatório maior atende 120 pessoas por dia numa boa. Fecha o 100 litros que resolve.",
              pontos: 0,
              feedback:
                "Errado tecnicamente: trata a capacidade do reservatório como limite diário de pessoas. Reservatório não é limite diário; o que conta é o consumo simultâneo no pico.",
            },
          ],
        },
        {
          pergunta:
            "Entre as informações abaixo, qual conjunto é o MAIS importante levantar para dimensionar e cotar corretamente?",
          opcoes: [
            {
              texto:
                "Pico simultâneo no horário de maior movimento, voltagem do ponto de instalação e origem da água (rede pública ou poço).",
              pontos: 3,
              feedback:
                "Melhor: pico define o modelo, voltagem é pendente e precisa ser confirmada no ponto do cliente, e a origem da água muda o encaminhamento (poço pede avaliação, não só refil).",
            },
            {
              texto:
                "Só o número total de funcionários e a cidade, o resto a gente resolve depois da venda.",
              pontos: 1,
              feedback:
                "Total e cidade sozinhos não dimensionam nada. Deixar voltagem e origem da água pra depois da venda gera erro de instalação e frustração pós-venda.",
            },
            {
              texto:
                "A cor do equipamento, se ele combina com o refeitório e a marca do compressor preferida do cliente.",
              pontos: 0,
              feedback:
                "Nada disso qualifica a venda. É perder o lead em detalhe estético enquanto o essencial (pico, voltagem, água) fica em aberto.",
            },
          ],
        },
        {
          pergunta:
            "O lead responde: \"No almoço quase todo mundo vai junto, uns 80 ao mesmo tempo. E a água aqui é de poço artesiano.\" Como conduzir?",
          opcoes: [
            {
              texto:
                "Anoto os 80 no pico pra indicar o modelo certo. E ó, um alerta importante: água de poço não se resolve só com o refil do bebedouro — o refil é para o ponto de consumo. O poço pede uma avaliação à parte. Quem fala com você é o responsável pela compra?",
              pontos: 3,
              feedback:
                "Melhor: registra o pico correto (80), é honesto que poço não se resolve só com o refil do bebedouro e ainda confirma o decisor. Tudo o que qualifica de verdade.",
            },
            {
              texto:
                "Show, 80 pessoas. Como é poço, é só trocar o refil do bebedouro com mais frequência que fica tudo certo com a água.",
              pontos: 1,
              feedback:
                "Reconhece o pico, mas passa a ideia errada de que o refil do bebedouro resolve a água de poço. Poço exige avaliação específica, não só refil mais frequente.",
            },
            {
              texto:
                "Água de poço é sempre potável, pode ficar tranquilo. Fecho o bebedouro que já vai resolver tudo.",
              pontos: 0,
              feedback:
                "Promete potabilidade (proibido) e ignora que poço demanda avaliação técnica. Duas falhas graves numa frase só.",
            },
          ],
        },
        {
          pergunta:
            "Antes de indicar o modelo, você ainda precisa confirmar a voltagem do local. Qual é a conduta correta?",
          opcoes: [
            {
              texto:
                "Perguntar qual a voltagem disponível no ponto de instalação (110 ou 220) e tratar a voltagem do equipamento como algo a confirmar com a fábrica antes de fechar.",
              pontos: 3,
              feedback:
                "Melhor: voltagem é pendente de confirmação; o certo é levantar a do ponto do cliente e alinhar com a fábrica, sem inventar especificação.",
            },
            {
              texto:
                "Afirmar que é bivolt automático e serve em qualquer tomada, pra não travar a conversa com detalhe técnico.",
              pontos: 1,
              feedback:
                "Afirma como fato algo que é pendente. Se estiver errado, dá queima de equipamento na instalação e problema logo de cara.",
            },
            {
              texto:
                "Ignorar a voltagem: isso é problema do eletricista do cliente resolver depois.",
              pontos: 0,
              feedback:
                "Empurrar a voltagem pra depois é receita de instalação errada. É parte da qualificação, não detalhe dispensável.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // ETAPA 2 — APRESENTAÇÃO
    // ========================================================================
    {
      num: 2,
      titulo: "Apresentação",
      contexto:
        "<strong>Qualificação concluída.</strong> A empresa tem 120 funcionários, mas o pico simultâneo do almoço é de <strong>~80 pessoas ao mesmo tempo</strong>, em um único refeitório com ponto de água central e voltagem já confirmada. O cliente reclama que o bebedouro atual <em>\"esquenta na hora do rush\"</em>. Agora você vai <strong>apresentar o modelo certo e o valor dele</strong> — sem recomendar pelo total de pessoas.",
      questoes: [
        {
          pergunta:
            "Com pico de ~80 pessoas concentradas no almoço, qual modelo apresentar e com qual argumento?",
          opcoes: [
            {
              texto:
                "O 100 litros. Ele tem compressor 1/5, que recupera a temperatura mais rápido — exatamente o que resolve o \"esquenta no rush\" que você tem hoje, quando 80 pessoas bebem quase juntas.",
              pontos: 3,
              feedback:
                "Melhor: 80 concentrados pedem boa recuperação; o 100L (compressor 1/5) é o modelo certo e o argumento liga a característica técnica (1/5) ao problema real do cliente.",
            },
            {
              texto:
                "O 60 litros. O nome já diz que é bem dimensionado, e como são 80 pessoas rápidas ele dá conta no limite.",
              pontos: 1,
              feedback:
                "Associa litragem a número de pessoas ('60 litros = 60 pessoas') e coloca o cliente no limite. O 60L é compressor 1/10 e ficaria justo para 80 concentrados no pico.",
            },
            {
              texto:
                "O 200 litros, o maior, porque quanto maior o reservatório menos esquenta e não tem erro.",
              pontos: 0,
              feedback:
                "Confunde volume de reservatório com capacidade de refrigeração e superdimensiona por reflexo. Recuperação vem do compressor, não de litro a mais.",
            },
          ],
        },
        {
          pergunta:
            "O cliente pergunta: \"Mas por que não o 200, já que são 120 no total?\" Qual a melhor resposta?",
          opcoes: [
            {
              texto:
                "Porque não é o total que dimensiona, é o pico. Seus 120 nunca bebem todos no mesmo segundo — no auge são ~80. O 100 com compressor 1/5 atende esse pico com folga de recuperação; o 200 seria pagar por capacidade que você não usa.",
              pontos: 3,
              feedback:
                "Melhor: reafirma a regra de ouro (pico, não total), justifica tecnicamente o 100L e evita o superdimensionamento sem desmerecer o cliente.",
            },
            {
              texto:
                "Pode ser o 200 sim, se você prefere. Mais litro nunca é demais, e assim fica garantido pro futuro.",
              pontos: 1,
              feedback:
                "Cede ao superdimensionamento pra não contrariar o cliente. Vender mais do que ele precisa encarece sem entregar valor real e mina a confiança técnica.",
            },
            {
              texto:
                "O 200 aguenta 350 pessoas por hora, então com 120 sobra muito. Leva o 200 e nunca mais pensa nisso.",
              pontos: 0,
              feedback:
                "Usa número de vitrine pra empurrar o topo de linha e ignora o pico real. Dimensionar por 'sobra' é o oposto de dimensionar pela demanda.",
            },
          ],
        },
        {
          pergunta:
            "Qual a melhor forma de apresentar o VALOR do 100 litros (não só a ficha técnica)?",
          opcoes: [
            {
              texto:
                "Ligar característica → benefício → impacto: \"compressor 1/5 (característica) recupera o frio mais rápido (benefício), então no rush do almoço todo mundo pega água gelada sem fila nem reclamação (impacto no seu dia a dia)\".",
              pontos: 3,
              feedback:
                "Melhor: traduz a spec em benefício concreto e impacto no problema do cliente. É assim que se apresenta valor, não recitando ficha técnica.",
            },
            {
              texto:
                "Listar todas as specs de uma vez (litragem, peso, dimensões, material) e deixar o cliente concluir sozinho por que é bom.",
              pontos: 1,
              feedback:
                "Despejar ficha técnica sem traduzir em benefício faz o cliente decidir só por preço. Falta o elo com o problema dele.",
            },
            {
              texto:
                "Dizer que com o 100 litros a água fica 100% pura e a empresa vai economizar garantido todo mês.",
              pontos: 0,
              feedback:
                "Promete potabilidade e percentual de economia — ambos proibidos. Valor se constrói com benefício real, nunca com promessa indevida.",
            },
          ],
        },
        {
          pergunta:
            "Ao apresentar, você deve mencionar as dimensões do 100 litros. O site traz a altura como \"1,27 cm\", que parece inconsistente. Como agir?",
          opcoes: [
            {
              texto:
                "Passar as medidas informando que a dimensão exata está em validação técnica e que confirmo o valor certo antes de fechar, para o cliente conferir o espaço de instalação com segurança.",
              pontos: 3,
              feedback:
                "Melhor: dimensão é pendente de validação; o certo é sinalizar isso e confirmar, nunca 'consertar' a medida por conta própria.",
            },
            {
              texto:
                "Corrigir na hora para \"1,27 m\" porque obviamente é metro, e passar como se fosse dado oficial.",
              pontos: 1,
              feedback:
                "Mesmo que a suposição faça sentido, corrigir a medida por conta própria e passar como oficial contraria a regra de não alterar dimensões pendentes.",
            },
            {
              texto:
                "Dizer que as dimensões não importam, é só encostar em qualquer parede que cabe.",
              pontos: 0,
              feedback:
                "Ignora um dado que o cliente precisa pra planejar o espaço e transmite descuido técnico. Dimensão importa, ainda mais em ponto fixo.",
            },
          ],
        },
      ],
    },

    // ========================================================================
    // ETAPA 3 — FECHAMENTO E UPSELL
    // ========================================================================
    {
      num: 3,
      titulo: "Fechamento e upsell",
      contexto:
        "<strong>Reta final.</strong> O cliente entendeu o dimensionamento e gostou do 100 litros, mas travou: primeiro disse que <em>\"está caro\"</em>, depois que <em>\"vai pensar\"</em>. O equipamento está corretamente dimensionado para o pico dele. Cabe a você <strong>tratar a objeção, conduzir ao fechamento sem pressão falsa e oferecer os refis no momento certo</strong>.",
      questoes: [
        {
          pergunta:
            "O cliente diz: \"Gostei, mas está caro. Vou pensar e depois te falo.\" Qual a melhor conduta?",
          opcoes: [
            {
              texto:
                "Claro, decisão importante. Só pra eu te ajudar melhor: o que pesa mais — é o valor em si, a forma de pagamento, ou falta o ok de mais alguém? Assim vejo como resolver junto com você.",
              pontos: 3,
              feedback:
                "Melhor: acolhe e investiga a objeção real por trás do 'vou pensar' vago, oferecendo caminhos concretos em vez de aceitar o adiamento ou pressionar.",
            },
            {
              texto:
                "Sem problema, quando decidir é só me chamar. Fico à disposição.",
              pontos: 1,
              feedback:
                "Aceita o adiamento sem descobrir o que trava e sem próximo passo. 'Vou pensar' costuma virar sumiço quando não se investiga a objeção.",
            },
            {
              texto:
                "Olha, se pensar demais o preço sobe semana que vem. Melhor fechar agora enquanto está nessa condição.",
              pontos: 0,
              feedback:
                "Pressão de escassez artificial. Cria urgência falsa e afasta um cliente que já gostou de tudo — o oposto de conduzir com confiança.",
            },
          ],
        },
        {
          pergunta:
            "Investigando, o cliente revela: \"Na verdade o valor à vista pesa no caixa desse mês.\" Como conduzir o fechamento?",
          opcoes: [
            {
              texto:
                "Então o ponto é a forma de pagamento, não o equipamento. Temos o parcelado em 7x, que dilui bem e não mexe no seu caixa de uma vez. Se eu encaixar numa parcela confortável, a gente fecha o 100 hoje?",
              pontos: 3,
              feedback:
                "Melhor: isola a objeção real (fluxo de caixa, não preço em si), oferece o parcelamento como solução legítima e faz um fechamento condicional claro.",
            },
            {
              texto:
                "Se o caixa aperta, então desce pro 60 litros que é mais barato à vista e resolve igual.",
              pontos: 1,
              feedback:
                "Rebaixa o modelo por preço mesmo com o pico exigindo o 100 — e sem registrar risco. A objeção era pagamento, não capacidade; a saída é parcelar, não subdimensionar.",
            },
            {
              texto:
                "Posso dar 15% de desconto à vista agora, sem contrapartida nenhuma, só pra fechar logo.",
              pontos: 0,
              feedback:
                "Desconto sem contrapartida queima margem e ensina o cliente a duvidar do preço. Desconto só com contrapartida; aqui a solução certa é o parcelamento.",
            },
          ],
        },
        {
          pergunta:
            "O cliente aceita o parcelamento: \"Nessa condição em 7x eu consigo. Pode fechar o 100.\" Qual o melhor próximo passo?",
          opcoes: [
            {
              texto:
                "Fechado! Emito agora a proposta do 100 em 7x pra você assinar hoje e já registro no CRM. Em seguida confirmo a data de entrega. E aproveitando que você fechou o bebedouro, deixa eu te mostrar uma condição dos refis.",
              pontos: 3,
              feedback:
                "Melhor: confirma o aceite, define próximo passo concreto (proposta hoje + entrega), registra no CRM e só então abre o upsell — na ordem certa.",
            },
            {
              texto:
                "Ótimo! Antes de emitir a proposta do bebedouro, deixa eu já incluir o pacote de refis pra fechar tudo de uma vez.",
              pontos: 1,
              feedback:
                "Antecipa o upsell antes de consolidar o aceite do equipamento e sobrecarrega o momento do sim. Fecha o principal primeiro, depois oferece o refil.",
            },
            {
              texto:
                "Boa! Te mando os detalhes qualquer dia desses e a gente acerta a entrega quando der.",
              pontos: 0,
              feedback:
                "Afrouxa o encerramento sem data e sem registro no CRM. Depois do sim, o certo é cravar proposta, entrega e registro — não deixar escorregar.",
            },
          ],
        },
        {
          pergunta:
            "Momento do upsell, já com o bebedouro fechado. Como oferecer os refis Acquabios Multi corretamente?",
          opcoes: [
            {
              texto:
                "O 1º refil Acquabios Multi já vai de brinde com o bebedouro. E como você fechou o equipamento, consigo os 3 adicionais por R$159 em vez de R$207 — uma economia de R$48. Fecho assim junto com a proposta?",
              pontos: 3,
              feedback:
                "Melhor: 1º refil de brinde, upsell dos 3 adicionais só após o aceite, com os números certos (R$159, economia R$48) e amarrado ao próximo passo.",
            },
            {
              texto:
                "Aproveita e leva logo uns 8 refis de estoque, que é melhor comprar tudo de uma vez e não faltar.",
              pontos: 1,
              feedback:
                "Extrapola a oferta oficial (1 brinde + 3 por R$159) empurrando volume aleatório. Passa sensação de 'empurra-empurra' logo depois de uma decisão positiva.",
            },
            {
              texto:
                "Com esses refis sua água fica 100% potável e garantida por anos, pode comprar vários sem medo.",
              pontos: 0,
              feedback:
                "Promete potabilidade — vedado — e ignora a oferta estruturada. O upsell se faz com a condição oficial, nunca com promessa de qualidade de água.",
            },
          ],
        },
      ],
    },
  ],
};
