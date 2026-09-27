// ============================================================================
// MÓDULO 18 — Fechamento
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// Tipos de bloco usados aqui: texto, titulo, callout, cards, script, exemplo,
// dodont, checklist.
// ============================================================================

module.exports = {
  resumoCurto: "Fechar não é pressionar — é ajudar o cliente a decidir depois que o problema foi entendido, o modelo recomendado, o valor apresentado, as dúvidas respondidas e o processo mapeado. Este módulo reúne as sete técnicas de fechamento com as falas prontas para bebedouros industriais.",
  video: { url: "", thumb: "", duracaoSeg: 0, transcricao: "", legenda: "", assistidoTrackId: "mod-18-video" },

  blocos: [
    { tipo: "texto", html: "Existe um mito de que fechar é \"apertar\" o cliente. É o contrário. Quando você fez o trabalho consultivo direito, o fechamento é apenas o passo natural: <strong>você ajuda alguém que já quer resolver o problema a dar o próximo passo com segurança</strong>. Pressão só aparece quando faltou etapa antes." },

    { tipo: "titulo", texto: "Fechamento só é natural depois destas 5 etapas" },
    { tipo: "cards", itens: [
      { icon: "🔍", titulo: "Problema entendido", html: "Você mapeou pico, efetivo, voltagem, cidade e uso. O cliente sente que foi ouvido." },
      { icon: "📐", titulo: "Modelo recomendado", html: "Você indicou o modelo certo pelo pico — não pelo total de pessoas nem pelo preço." },
      { icon: "💰", titulo: "Valor apresentado", html: "Preço e condição ficaram claros, com o que está incluso (torneiras, primeiro refil, garantia)." },
      { icon: "💬", titulo: "Dúvidas respondidas", html: "As objeções foram tratadas com a estrutura de 7 passos. Nada ficou no ar." },
      { icon: "🗺️", titulo: "Processo mapeado", html: "Você sabe quem decide, qual a voltagem, o prazo e o que falta para emitir o pedido." },
    ]},

    { tipo: "callout", variante: "info", titulo: "Se o cliente trava no fechamento, volte uma etapa",
      html: "Resistência no fechamento quase sempre é sinal de que uma das cinco etapas ficou incompleta. Não empurre — <strong>identifique o que faltou</strong> (dúvida não resolvida? decisor ausente? valor não ancorado?) e resolva antes de tentar de novo." },

    { tipo: "titulo", texto: "Técnica 1 — Fechamento por confirmação" },
    { tipo: "texto", html: "Você confirma a escolha como se a decisão já estivesse encaminhada. Funciona quando o cliente já demonstrou preferência clara pelo modelo." },
    { tipo: "script", contexto: "Cliente já sinalizou o modelo e a voltagem",
      fala: "Podemos seguir com o modelo de 60 litros em 220 V?" },
    { tipo: "exemplo",
      cliente: "É, o de 60 atende bem o meu caso.",
      closer: "Perfeito. Então podemos seguir com o modelo de 60 litros em 220 V? Se estiver de acordo, eu já começo a preparar o pedido." },

    { tipo: "titulo", texto: "Técnica 2 — Fechamento por alternativa" },
    { tipo: "texto", html: "Em vez de perguntar \"sim ou não\", você oferece <strong>duas opções que ambas fecham a venda</strong>. Tira o cliente da dúvida do \"se\" e leva para o \"como\"." },
    { tipo: "script", contexto: "Modelo já definido, faltam as condições de pagamento",
      fala: "Você prefere o pagamento no Pix ou parcelado?" },
    { tipo: "exemplo",
      cliente: "Vou fechar o de 100 mesmo.",
      closer: "Ótima escolha. Você prefere o pagamento no Pix ou parcelado? No Pix eu consigo trabalhar uma condição melhor; no parcelado a gente divide em até 7 vezes." },

    { tipo: "titulo", texto: "Técnica 3 — Fechamento por resumo" },
    { tipo: "texto", html: "Você recapitula tudo o que foi combinado num bloco só. O resumo <strong>reforça o valor</strong> (o cliente ouve tudo que está levando) e conduz naturalmente para o \"posso formalizar?\"." },
    { tipo: "script", contexto: "Fechando após alinhar modelo, configuração e entrega",
      fala: "Então teremos o modelo de 100 litros, compressor 1/5, torneiras metálicas, primeiro refil incluso e entrega para [cidade]. Posso formalizar?" },
    { tipo: "exemplo",
      cliente: "Acho que é isso mesmo que eu preciso.",
      closer: "Deixa eu recapitular pra não faltar nada: teremos o modelo de 100 litros, compressor 1/5, torneiras metálicas, o primeiro refil já incluso e entrega para Campinas. Posso formalizar?" },

    { tipo: "titulo", texto: "Técnica 4 — Fechamento por próximo passo" },
    { tipo: "texto", html: "Você não pergunta \"quer fechar?\". Você pede o que é necessário para <strong>executar</strong> o fechamento. Pedir os dados do pedido move a conversa da decisão para a ação." },
    { tipo: "script", contexto: "Cliente decidido — avançando para emissão",
      fala: "Para emitir o pedido, preciso do CNPJ, endereço e voltagem." },
    { tipo: "exemplo",
      cliente: "Beleza, pode seguir.",
      closer: "Perfeito. Para emitir o pedido, preciso do CNPJ, endereço de entrega e a voltagem do local. Pode me passar que eu já dou entrada." },

    { tipo: "titulo", texto: "Técnica 5 — Fechamento condicional" },
    { tipo: "texto", html: "Amarra uma concessão que você buscou a um compromisso do cliente. É a ponte entre o módulo de negociação e o fechamento: <strong>a condição só se justifica se o cliente avança</strong>." },
    { tipo: "script", contexto: "Cliente pediu uma condição de pagamento específica",
      fala: "Se eu conseguir confirmar essa condição de pagamento, conseguimos avançar hoje?" },
    { tipo: "exemplo",
      cliente: "Se conseguir parcelar do jeito que pedi, eu fecho.",
      closer: "Combinado. Se eu conseguir confirmar essa condição de pagamento, conseguimos avançar hoje? Assim eu já checo com a operação sabendo que a gente fecha na sequência." },

    { tipo: "titulo", texto: "Técnica 6 — Fechamento com decisor" },
    { tipo: "texto", html: "Quando existe um aprovador acima do contato, o fechamento é <strong>conseguir a conversa com quem decide</strong>. Você se oferece para explicar o dimensionamento diretamente, tirando o peso do seu contato." },
    { tipo: "script", contexto: "Existe um responsável pela aprovação que ainda não participou",
      fala: "Faz sentido marcarmos uma conversa rápida com o responsável pela aprovação para eu explicar o dimensionamento?" },
    { tipo: "exemplo",
      cliente: "Eu preciso que meu gestor aprove antes.",
      closer: "Faz total sentido. Faz sentido marcarmos uma conversa rápida com o responsável pela aprovação para eu explicar o dimensionamento? Assim ele tira as dúvidas na fonte e você não precisa carregar a parte técnica sozinho." },

    { tipo: "titulo", texto: "Técnica 7 — Fechamento de licitação ganha" },
    { tipo: "texto", html: "Em compra pública ou licitação já vencida, quantidade e prazo estão definidos em edital. O fechamento é <strong>validar estoque e condição</strong> para formalizar — objetivo e sem pressão comercial." },
    { tipo: "script", contexto: "Licitação/pregão já ganho, confirmando execução",
      fala: "Com a quantidade e o prazo confirmados, posso validar estoque e condição para formalizarmos o pedido?" },
    { tipo: "exemplo",
      cliente: "A gente ganhou o pregão, são as unidades do edital.",
      closer: "Excelente. Com a quantidade e o prazo confirmados, posso validar estoque e condição para formalizarmos o pedido? Eu checo a disponibilidade e já te retorno com tudo pronto pra emissão." },

    { tipo: "dodont",
      fazer: [
        "Fechar só depois das 5 etapas (problema, modelo, valor, dúvidas, processo).",
        "Escolher a técnica conforme o momento do cliente.",
        "Pedir os dados do pedido para transformar decisão em ação.",
        "Voltar uma etapa quando o cliente trava, em vez de empurrar.",
      ],
      evitar: [
        "Confundir fechar com pressionar.",
        "Criar urgência falsa para acelerar a assinatura.",
        "Fechar com modelo subdimensionado sem registrar o risco.",
        "Prometer prazo de entrega ou faturamento sem confirmar antes.",
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: "O cliente resiste na hora de fechar. Qual é a melhor atitude?",
      opcoes: [
        "Aumentar a pressão e criar urgência (\"é só hoje\").",
        "Voltar uma etapa e identificar o que faltou — dúvida aberta, decisor ausente ou valor não ancorado.",
        "Encerrar a conversa e partir para o próximo lead.",
      ],
      correta: 1,
      explicacao: "Resistência no fechamento sinaliza etapa incompleta. Fechar é ajudar a decidir, não empurrar — identifique a lacuna e resolva antes de tentar de novo."
    },
    {
      pergunta: "Qual fala é um exemplo de fechamento por alternativa?",
      opcoes: [
        "\"Podemos seguir com o modelo de 60 litros em 220 V?\"",
        "\"Você prefere o pagamento no Pix ou parcelado?\"",
        "\"Para emitir o pedido, preciso do CNPJ, endereço e voltagem.\"",
      ],
      correta: 1,
      explicacao: "A alternativa oferece duas opções que ambas fecham a venda. A primeira é confirmação; a terceira é próximo passo."
    },
    {
      pergunta: "Numa licitação já ganha, qual é o objetivo do fechamento?",
      opcoes: [
        "Renegociar o preço para melhorar a margem.",
        "Validar estoque e condição com a quantidade e o prazo do edital para formalizar o pedido.",
        "Convencer o cliente de que precisa de um modelo maior.",
      ],
      correta: 1,
      explicacao: "Quantidade e prazo já vêm do edital. O fechamento é operacional: confirmar disponibilidade e condição para emitir, sem pressão comercial."
    },
  ],

  exercicio: {
    enunciado: "Escolha um cenário de cliente (empresa média, licitação ou compra com decisor acima) e escreva qual das 7 técnicas de fechamento você usaria e por quê, com a fala adaptada ao caso.",
    dica: "Antes de escolher a técnica, confirme mentalmente as 5 etapas: problema entendido, modelo recomendado, valor apresentado, dúvidas respondidas e processo mapeado."
  },

  resumo: "Fechar é ajudar a decidir, não pressionar — e só é natural depois de entender o problema, recomendar o modelo, apresentar o valor, responder as dúvidas e mapear o processo. São 7 técnicas: confirmação, alternativa, resumo, próximo passo, condicional, com decisor e de licitação ganha. Se o cliente trava, volte uma etapa em vez de empurrar. Nunca crie urgência falsa, nunca feche modelo subdimensionado sem registrar o risco e nunca prometa prazo ou faturamento sem confirmar."
};
