// ============================================================================
// MÓDULO 20 — Quando o closer deve parar (água de poço)
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js
// Blocos: texto | titulo | callout | card | cards | script | dodont |
//         checklist | tabela | perguntas | exemplo | pendente | especialista
// REGRA: certos gatilhos OBRIGAM handoff imediato ao especialista. O closer não
// diagnostica, não promete potabilidade, não afirma que algo resolve tudo, não
// dá preço antes de análise + hidráulica. Sempre terminar com PRÓXIMO PASSO.
// ============================================================================

module.exports = {
  resumoCurto: 'Os gatilhos que obrigam o closer a parar de vender e escalar ao especialista — e como fazer esse handoff sem perder o cliente. Parar na hora certa protege o cliente, a empresa e a venda.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-20-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'PERIGO — saber parar é parte da competência',
      html: 'Existem situações em que continuar a venda sozinho é <strong>risco sanitário, técnico e jurídico</strong>. Quando um dos gatilhos abaixo aparece, o closer <strong>para de conduzir como venda simples</strong> e envolve o especialista <em>imediatamente</em>. Parar não é perder o cliente — é entregar o cliente para quem pode resolver com segurança. Insistir é que perde.' },

    { tipo: 'titulo', texto: 'Por que existir um "botão de parada"' },
    { tipo: 'texto', html: 'O closer educa e qualifica; ele <strong>não</strong> diagnostica risco de saúde, não dimensiona sistema crítico e não promete resultado. Alguns temas ultrapassam o papel comercial e exigem, por responsabilidade, o olhar técnico do especialista. Reconhecer esses temas rápido é o que separa um bom consultor de um vendedor imprudente.' },

    { tipo: 'titulo', texto: 'Gatilhos OBRIGATÓRIOS de encaminhamento ao especialista' },
    { tipo: 'checklist', titulo: 'Se QUALQUER item abaixo aparecer, pare e escale:', itens: [
      '<strong>Ausência de análise</strong> — não há laudo recente e confiável da água.',
      '<strong>Contaminação microbiológica</strong> — relato ou laudo com coliformes, E. coli, bactérias.',
      '<strong>Nitrato ou nitrito</strong> — parâmetros associados a risco de saúde, especialmente para bebês.',
      '<strong>Compostos orgânicos</strong> — presença ou suspeita no laudo.',
      '<strong>Metais pesados</strong> — qualquer indício de metais no laudo.',
      '<strong>Agrotóxicos</strong> — região/atividade agrícola ou suspeita de contaminação por defensivos.',
      '<strong>Parâmetros desconhecidos</strong> — o cliente cita algo que você não sabe interpretar.',
      '<strong>Aplicação industrial crítica</strong> — processo produtivo que depende da qualidade da água.',
      '<strong>Produção de alimentos</strong> — água usada em fabricação/manipulação de alimentos e bebidas.',
      '<strong>Uso hospitalar</strong> — clínicas, hospitais, hemodiálise ou qualquer uso de saúde.',
      '<strong>Vazão elevada</strong> — demanda alta que exige dimensionamento técnico cuidadoso.',
      '<strong>Sistema coletivo</strong> — condomínio, comunidade, múltiplas residências, abastecimento compartilhado.',
      '<strong>Necessidade de projeto</strong> — exigência de ART, projeto assinado, licitação ou responsável técnico.',
      '<strong>Conflito entre resultados e sintomas</strong> — o laudo diz uma coisa e o cliente relata outra.',
      '<strong>Cliente pedindo garantia de potabilidade</strong> — expectativa que o closer não pode assumir.',
      '<strong>Risco sanitário</strong> — qualquer sinal de que a água pode estar oferecendo risco à saúde.',
    ]},
    { tipo: 'callout', variante: 'alerta', titulo: 'Na dúvida, escale',
      html: 'Se você <strong>não tem certeza</strong> se um caso se encaixa nos gatilhos, trate como se encaixasse. O custo de escalar um caso simples é baixo; o custo de conduzir sozinho um caso crítico é altíssimo. Dúvida é gatilho.' },

    { tipo: 'titulo', texto: 'O que o closer NÃO faz nesses casos' },
    { tipo: 'dodont',
      fazer: [
        'Reconhecer o gatilho e comunicar que vai trazer o especialista.',
        'Manter a relação, o acolhimento e o senso de cuidado com o cliente.',
        'Organizar as informações (contexto, sintomas, laudo, hidráulica) para o handoff.',
      ],
      evitar: [
        'Diagnosticar risco de saúde ou interpretar o laudo por conta própria.',
        'Prometer potabilidade, remoção garantida ou que "resolve tudo".',
        'Dar preço, solução ou prazo antes do especialista avaliar.',
      ]
    },

    { tipo: 'titulo', texto: 'Como fazer o handoff sem perder o cliente' },
    { tipo: 'texto', html: 'Escalar bem é uma transição de <strong>confiança</strong>, não um "não sei, tchau". Você posiciona o especialista como um <strong>ganho</strong> para o cliente — acesso a quem realmente domina o assunto — e mantém a relação viva com um próximo passo claro. Use os scripts abaixo conforme o gatilho.' },

    { tipo: 'script', titulo: 'Script geral de handoff (qualquer gatilho)',
      contexto: 'Transição neutra, serve para a maioria dos casos.',
      fala: 'Olha, [nome], o que você me trouxe é importante e merece o olhar de quem dimensiona isso todos os dias. Em vez de eu te dar uma resposta pela metade, vou trazer o nosso especialista técnico pra cuidar do seu caso com a atenção certa. Você ganha um diagnóstico feito por quem entende de verdade. Deixa eu organizar as informações e já te retorno com ele, pode ser?' },

    { tipo: 'script', titulo: 'Script — contaminação microbiológica / risco sanitário',
      contexto: 'Relato ou laudo com coliformes, E. coli, ou suspeita de risco à saúde. Acolher sem alarmar e sem prometer.',
      fala: 'Obrigado por me contar isso — é justamente o tipo de informação que a gente leva a sério. Não vou te passar nada por telefone sobre isso, porque envolve saúde e precisa do olhar técnico correto. Vou acionar o nosso especialista pra avaliar o seu caso com o cuidado que ele exige e te orientar sobre os próximos passos com responsabilidade. Me confirma o melhor horário pra gente falar com ele junto?' },

    { tipo: 'script', titulo: 'Script — nitrato/nitrito, metais, orgânicos ou agrotóxicos',
      contexto: 'Parâmetros de risco no laudo ou suspeita pela região/atividade. Nunca minimizar nem interpretar números.',
      fala: 'Esse parâmetro que apareceu no seu laudo pede uma avaliação técnica específica — não é algo que eu vá interpretar por conta própria, seria irresponsável. Vou levar o seu laudo completo pro especialista, que sabe exatamente o que esse resultado significa e o que fazer a respeito. Me envia todas as páginas da análise que eu já adianto com ele, tá?' },

    { tipo: 'script', titulo: 'Script — uso coletivo, industrial, alimentício ou hospitalar',
      contexto: 'Aplicações críticas que exigem projeto e dimensionamento técnico desde o início.',
      fala: 'Pelo uso que você me descreveu, o seu caso pede um projeto técnico, não um equipamento de prateleira. Isso é responsabilidade do nosso especialista, que dimensiona esse tipo de aplicação. Vou envolvê-lo desde já pra você ter a solução certa e dentro das exigências. Me conta um pouco mais da operação enquanto eu organizo isso com ele?' },

    { tipo: 'script', titulo: 'Script — cliente pede garantia de potabilidade',
      contexto: 'Expectativa que o closer não pode assumir. Honestidade + reancoragem no processo.',
      fala: 'Entendo que você quer segurança, e é exatamente por isso que eu não vou te prometer um selo de potabilidade no telefone — ninguém sério faz isso. O que a gente faz é sério: o especialista trata o que o laudo aponta, declara as limitações e a gente comprova o resultado com uma nova análise. Vou te conectar com ele pra você ver como esse processo funciona. Combinamos?' },

    { tipo: 'especialista', nome: 'escalonamento', icon: '🧑‍🔬',
      html: 'Quando um desses gatilhos aparece, me chame sem hesitar. Prefiro receber dez casos simples do que descobrir tarde que um caso de risco foi tratado como venda de balcão. Escalar cedo é o que mantém o cliente seguro — e a venda de pé.' },

    { tipo: 'callout', variante: 'info', titulo: 'Escalar não é perder a venda',
      html: 'O handoff bem-feito costuma <strong>aumentar</strong> a confiança e a chance de fechamento: o cliente percebe que está diante de uma empresa que sabe o que faz e não empurra solução. Você continua no processo — organizando informações, acompanhando e mantendo a relação. Parar sozinho ≠ sair do jogo.' },

    { tipo: 'pendente', html: 'Fluxo interno de acionamento do especialista, SLA de retorno e canais oficiais de handoff: <strong>pendente de definição/validação pela Tudo de Filtro</strong>. Seguir o processo interno vigente.' },

    { tipo: 'callout', variante: 'sucesso', titulo: 'PRÓXIMO PASSO',
      html: 'Grave a lista de gatilhos. Ao identificar qualquer um: <strong>(1)</strong> pare de conduzir como venda simples; <strong>(2)</strong> acolha sem prometer nada; <strong>(3)</strong> organize contexto, sintomas, laudo e hidráulica; <strong>(4)</strong> use o script de handoff adequado e traga o especialista; <strong>(5)</strong> combine um retorno concreto com o cliente. Na dúvida, escale.' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente relata que um exame apontou E. coli na água. O que o closer deve fazer?',
      opcoes: [
        'Seguir a venda e oferecer um filtro qualquer.',
        'Parar, acolher sem prometer, organizar o laudo e acionar o especialista imediatamente (risco sanitário).',
        'Dizer que a água está imprópria e encerrar o contato.',
      ],
      correta: 1,
      explicacao: 'Contaminação microbiológica é gatilho obrigatório de escalonamento. O closer não diagnostica nem promete — acolhe e envolve o especialista na hora.'
    },
    {
      pergunta: 'O closer está em dúvida se um caso se encaixa nos gatilhos de escalonamento. Como agir?',
      opcoes: [
        'Seguir sozinho, já que não tem certeza.',
        'Tratar a dúvida como gatilho e escalar — o custo de escalar um caso simples é baixo; conduzir sozinho um caso crítico é altíssimo.',
        'Pedir o preço para o cliente decidir.',
      ],
      correta: 1,
      explicacao: 'Na dúvida, escale. Dúvida é gatilho — a regra existe justamente para proteger cliente, empresa e a própria venda.'
    },
    {
      pergunta: 'Por que escalar ao especialista normalmente NÃO faz perder a venda?',
      opcoes: [
        'Porque o especialista dá desconto.',
        'Porque o handoff bem-feito aumenta a confiança do cliente, que percebe uma empresa séria — e o closer continua no processo mantendo a relação.',
        'Porque o cliente fica sem alternativa.',
      ],
      correta: 1,
      explicacao: 'Parar na hora certa e envolver quem domina o tema fortalece a confiança e a chance de fechamento. Escalar não é sair do jogo.'
    },
  ],

  exercicio: {
    enunciado: 'Liste, de memória, pelo menos 8 dos gatilhos obrigatórios de escalonamento. Depois, escolha 2 deles e escreva um script curto de handoff para cada, mantendo o cliente e sem prometer potabilidade nem dar solução.',
    dica: 'Bons handoffs posicionam o especialista como um ganho para o cliente e sempre terminam com um próximo passo combinado.'
  },

  resumo: 'Saber parar é competência. Diante de gatilhos como ausência de análise, contaminação microbiológica, nitrato/nitrito, orgânicos, metais pesados, agrotóxicos, parâmetros desconhecidos, uso industrial crítico, produção de alimentos, uso hospitalar, vazão elevada, sistema coletivo, necessidade de projeto, conflito laudo×sintomas, pedido de garantia de potabilidade ou qualquer risco sanitário, o closer para de vender sozinho e escala ao especialista imediatamente. Na dúvida, escala. O handoff bem-feito acolhe sem prometer, organiza as informações, posiciona o especialista como ganho e termina com um PRÓXIMO PASSO — mantendo o cliente e a venda.'
};
