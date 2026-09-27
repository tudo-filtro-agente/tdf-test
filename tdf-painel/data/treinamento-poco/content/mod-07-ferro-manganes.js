// ============================================================================
// MÓDULO 7 — Ferro e manganês  (academia de Poço)
// Segue o CONTRATO DE SCHEMA definido em content/mod-01-fundamentos.js.
// Blocos: texto | titulo | callout | card | cards | script | dodont |
//         checklist | tabela | perguntas | exemplo | pendente | especialista
//
// REGRA CRÍTICA: NÃO inventar valores (limites, dosagens, tempos de contato,
// vazões, faixas de pH exatas, mídias específicas por marca). Limites vêm de
// parametros-agua.js / Portaria 888/2021 (hoje pendentes). Toda especificidade
// e todo "projeto" → `pendente`. NUNCA prometer remoção garantida sem análise.
// ============================================================================

module.exports = {
  resumoCurto: 'Por que ferro e manganês incomodam, a diferença entre dissolvido e oxidado, por que oxidar ANTES de filtrar — e por que um filtro de sedimentos pode não resolver metal dissolvido.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-07-ferro-manganes-video' },

  blocos: [
    { tipo: 'callout', variante: 'alerta', titulo: 'Leia antes de prometer qualquer coisa',
      html: 'Este módulo ensina <strong>como ferro e manganês se comportam</strong> e por que a estratégia de tratamento muda conforme a forma deles na água. Ele <strong>não</strong> traz limites, dosagens, tempos de contato, faixas de pH exatas nem "a mídia que resolve": esses dependem de <strong>análise laboratorial + hidráulica + especialista</strong>. Nunca prometa remoção sem laudo.' },

    { tipo: 'titulo', texto: 'Por que ferro e manganês incomodam' },
    { tipo: 'texto', html: 'São muito comuns em água de poço. Mesmo em concentrações que não necessariamente representam risco agudo à saúde, causam problemas <strong>estéticos e operacionais</strong> que o cliente sente todo dia: manchas, cor, gosto e depósitos que se acumulam.' },
    { tipo: 'cards', itens: [
      { icon: '🟠', titulo: 'Ferro', html: 'Costuma dar cor amarelada/alaranjada/marrom, sabor metálico e manchas de ferrugem. Favorece limo/ferrobactérias em reservatórios e tubulações.' },
      { icon: '⚫', titulo: 'Manganês', html: 'Dá manchas escuras (acinzentadas/pretas), depósitos e gosto ruim. Costuma ser mais teimoso de tratar que o ferro.' },
    ]},
    { tipo: 'texto', html: 'Impactos práticos: <strong>manchas</strong> em louças, pias e box; <strong>roupas</strong> manchadas na lavagem; <strong>tubulações e reservatórios</strong> com incrustação/depósito; e desgaste de <strong>equipamentos</strong> (aquecedores, máquinas, torneiras).' },

    { tipo: 'titulo', texto: 'Dissolvido x oxidado — a distinção que muda tudo' },
    { tipo: 'texto', html: 'Ferro e manganês aparecem na água em duas "formas". Entender isso é o coração do módulo, porque cada forma exige uma abordagem diferente.' },
    { tipo: 'cards', itens: [
      { icon: '💧', titulo: 'Dissolvido (solúvel)', html: 'Está "diluído", invisível, água sai transparente da torneira e escurece/mancha depois de um tempo em contato com o ar. Um filtro de partícula NÃO pega o que está dissolvido.' },
      { icon: '🟤', titulo: 'Oxidado (particulado)', html: 'Já reagiu com oxigênio/oxidante e virou partícula visível (floco/borra). Aí sim vira "sujeira" que um meio filtrante pode reter.' },
    ]},
    { tipo: 'callout', variante: 'perigo', titulo: 'Filtro de sedimentos NÃO remove metal dissolvido',
      html: 'Um filtro de sedimentos/partículas retém o que já é <strong>sólido</strong>. Ferro e manganês <strong>dissolvidos</strong> passam direto por ele — a água sai "limpa" e mancha depois. Por isso vender "um filtro de sedimentos" para água com ferro/manganês dissolvido é receita de cliente insatisfeito. Primeiro é preciso <strong>oxidar</strong> (transformar em partícula), depois filtrar.' },

    { tipo: 'titulo', texto: 'A lógica: oxidar ANTES de filtrar' },
    { tipo: 'texto', html: 'A estratégia geral é <strong>oxidação → filtração</strong>: primeiro converter o metal dissolvido em partícula (oxidação), depois reter essa partícula num meio filtrante e, periodicamente, mandá-la embora na retrolavagem. Se você filtra antes de oxidar, não há o que reter.' },
    { tipo: 'cards', itens: [
      { icon: '⚗️', titulo: '1. Oxidação', html: 'O metal dissolvido reage (com oxigênio do ar, mídia catalítica ou oxidante) e vira partícula.' },
      { icon: '⏳', titulo: '2. Tempo de contato', html: 'A reação não é instantânea: precisa de tempo/condição para acontecer de forma completa antes do filtro.' },
      { icon: '🪣', titulo: '3. Filtração', html: 'A partícula formada é retida no leito filtrante.' },
      { icon: '🔃', titulo: '4. Retrolavagem', html: 'O leito é lavado periodicamente para expulsar a borra acumulada e não saturar/incrustar.' },
    ]},

    { tipo: 'titulo', texto: 'pH e potencial de oxidação importam' },
    { tipo: 'texto', html: 'A facilidade de oxidar ferro e manganês depende muito do <strong>pH</strong> e do <strong>potencial de oxidação</strong> da água. Em geral, manganês é bem mais exigente que ferro nesse aspecto. Água "fora de faixa" pode fazer a oxidação ficar incompleta — e metal que não oxidou direito passa pelo filtro. Por isso o laudo (com pH, ferro, manganês e outros) é indispensável antes de escolher a rota.' },
    { tipo: 'callout', variante: 'info', titulo: 'Por que isso não se resolve "no olho"',
      html: 'A mesma concentração de ferro pode tratar fácil numa água e ser um problema em outra, por causa de pH, presença de matéria orgânica, ferrobactérias e outros interferentes. É por isso que o projeto nasce da <strong>análise</strong>, não da aparência.' },

    { tipo: 'titulo', texto: 'Mídias catalíticas — quando tecnicamente adequado' },
    { tipo: 'texto', html: 'Existem mídias filtrantes com ação <strong>catalítica</strong> que ajudam a oxidar e reter ferro/manganês num mesmo leito, <strong>quando as condições da água (pH, potencial de oxidação, presença de interferentes) forem adequadas</strong>. Elas não são "mágicas": têm condições de trabalho, exigem retrolavagem e, em muitos casos, uma etapa de oxidação/regeneração associada. Fora da condição certa, saturam ou não performam.' },
    { tipo: 'pendente', html: 'Qual mídia, dosagem de oxidante, faixa de pH de trabalho, tempo de contato e vazões dependem do laudo e da hidráulica do caso. Definir apenas com fonte técnica cadastrada pela Tudo de Filtro + especialista. NÃO indicar mídia "por padrão".' },

    { tipo: 'titulo', texto: 'Riscos: incrustação e saturação' },
    { tipo: 'texto', html: 'Ferro e manganês são também um risco <strong>para o próprio sistema</strong>. Sem retrolavagem adequada, a borra oxidada <strong>satura</strong> o leito e <strong>incrusta</strong> tubulações, crepinas e válvulas. Ferrobactérias podem formar limo que agrava tudo. Por isso o projeto precisa casar oxidação, filtração e uma retrolavagem que dê conta da carga de metal.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'A hidráulica volta a mandar',
      html: 'Se a bomba não entrega a vazão de retrolavagem, a borra de ferro/manganês não sai do leito — e o sistema entope. Tratar metal sem garantir retrolavagem é resolver hoje e criar problema em algumas semanas.' },

    { tipo: 'titulo', texto: 'Árvore de decisão EDUCACIONAL (não é projeto automático)' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Isto é didático',
      html: 'A árvore abaixo serve para você <strong>raciocinar</strong> e conversar com o cliente. Ela <strong>não</strong> substitui projeto: não define mídia, dosagem, tamanho nem vazão. O caminho real sai de análise + hidráulica + especialista.' },
    { tipo: 'tabela',
      head: ['O que a água mostra', 'Como raciocinar (didático)', 'Próximo passo'],
      rows: [
        ['Sai transparente e mancha/escurece depois', 'Sugere metal DISSOLVIDO — filtro de partícula sozinho tende a não resolver', 'Pedir laudo; pensar em oxidação → filtração'],
        ['Já sai com cor/borra visível', 'Parte pode estar OXIDADA (particulada)', 'Laudo mesmo assim; avaliar se há também fração dissolvida'],
        ['Manchas escuras/pretas predominam', 'Aponta para manganês, mais exigente em pH/oxidação', 'Laudo com pH + manganês; caso mais sensível, especialista'],
        ['pH baixo/água "difícil" ou muitos interferentes', 'Oxidação pode ficar incompleta; rota simples pode falhar', 'Não prometer; levar para análise + especialista'],
      ]
    },
    { tipo: 'cards', itens: [
      { icon: '🧪', titulo: 'Passo 0 sempre', html: 'Análise laboratorial: ferro, manganês, pH e demais parâmetros. Sem isso, é chute.' },
      { icon: '🧭', titulo: 'Interpretar', html: 'Dissolvido x oxidado, pH/potencial de oxidação, interferentes (orgânicos, ferrobactérias).' },
      { icon: '🛠️', titulo: 'Só então projetar', html: 'Rota de oxidação + filtração + retrolavagem dimensionada — com o especialista.' },
    ]},
    { tipo: 'pendente', html: 'O projeto real (mídia, oxidante e dosagem, tempo de contato, tamanho de tanque, vazões de serviço e retrolavagem, faixa de pH alvo) depende de <strong>análise laboratorial + diagnóstico hidráulico + especialista</strong>. Esta árvore é apenas educacional e não gera especificação. Valores só de fonte técnica cadastrada pela Tudo de Filtro.' },

    { tipo: 'titulo', texto: 'Limites de referência' },
    { tipo: 'callout', variante: 'info', titulo: 'Os números vêm da fonte oficial',
      html: 'Os valores de referência (VMP) de ferro e manganês seguem <strong>Portaria GM/MS nº 888/2021</strong>, via arquivo <em>parametros-agua.js</em>. Enquanto não validados pela Tudo de Filtro, aparecem como "pendente de validação técnica" — não cite limite de memória nem de blog.' },
    { tipo: 'pendente', html: 'VMP de ferro e de manganês: pendente de validação técnica pela Tudo de Filtro (fonte: Portaria 888/2021). Confirmar o valor vigente no arquivo de parâmetros antes de usar comercialmente.' },

    { tipo: 'especialista', nome: 'ferro e manganês', icon: '🧑‍🔬',
      html: 'Sou o especialista dessa dupla teimosa. Quando o cliente tem mancha, cor, gosto metálico ou depósito escuro, eu cruzo o laudo (ferro, manganês, pH, interferentes) com a hidráulica para definir a rota de oxidação → filtração e a retrolavagem certa. Se a água for "difícil" (pH baixo, orgânicos, ferrobactérias) ou o manganês estiver mandando, me chame antes de prometer qualquer equipamento.' },

    { tipo: 'dodont',
      fazer: [
        'Pedir análise (ferro, manganês, pH) antes de indicar qualquer rota.',
        'Explicar dissolvido x oxidado e a lógica oxidar → filtrar → retrolavar.',
        'Confirmar se a hidráulica sustenta a retrolavagem da carga de metal.',
      ],
      evitar: [
        'Prometer remoção de ferro/manganês sem análise.',
        'Dizer que "só um filtro de sedimentos" resolve metal dissolvido.',
        'Indicar mídia/dosagem/tempo de contato "de padrão", sem laudo e especialista.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'A água do cliente sai transparente da torneira, mas mancha a pia e escurece num balde depois de horas. Que forma de metal isso sugere e o que NÃO resolve sozinho?',
      opcoes: [
        'Metal oxidado; qualquer filtro resolve.',
        'Provável metal DISSOLVIDO; um filtro de sedimentos/partícula sozinho tende a não resolver, porque o que está dissolvido passa direto — precisa oxidar antes de filtrar.',
        'É só sujeira do balde; não precisa de análise.',
      ],
      correta: 1,
      explicacao: 'Transparente que mancha depois é típico de metal dissolvido. Filtro de partícula pega sólido; dissolvido passa. A rota é oxidar → filtrar, definida por laudo.'
    },
    {
      pergunta: 'Por que a estratégia geral é "oxidar ANTES de filtrar"?',
      opcoes: [
        'Porque oxidar deixa a água mais bonita.',
        'Porque o filtro só retém partícula: é preciso converter o metal dissolvido em partícula (oxidação, com tempo de contato) para então o leito filtrante conseguir reter.',
        'Porque a ordem não importa, é só custo.',
      ],
      correta: 1,
      explicacao: 'Filtro retém sólido. Sem oxidar antes, o metal dissolvido não tem o que ser retido. Oxidação (com tempo de contato) → filtração → retrolavagem.'
    },
    {
      pergunta: 'Por que manganês costuma ser mais difícil que ferro e por que o pH entra na conversa?',
      opcoes: [
        'Manganês é maior que o ferro.',
        'Porque a oxidação de manganês é mais exigente quanto a pH e potencial de oxidação; fora de faixa a oxidação fica incompleta e o metal passa pelo filtro — por isso o laudo com pH é indispensável.',
        'O pH não tem relação nenhuma.',
      ],
      correta: 1,
      explicacao: 'Manganês exige condições de pH/oxidação mais rígidas que o ferro. pH fora de faixa deixa a oxidação incompleta. Definição de rota depende do laudo + especialista.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente diz: "minha água de poço sai limpa, então é só botar um filtro de sedimentos que segura o ferro". Em 3–4 frases, explique a diferença entre ferro dissolvido e oxidado, por que o filtro de sedimentos pode não resolver, e por que você precisa da análise antes de indicar a rota — sem desmerecer o cliente.',
    dica: 'Ancore em "dissolvido x oxidado", "oxidar antes de filtrar" e "sem laudo não se promete remoção".'
  },

  resumo: 'Ferro e manganês são comuns em poço e causam manchas, cor, gosto metálico, depósitos e desgaste de equipamentos/tubulações. O ponto central é a forma: DISSOLVIDO (invisível, mancha depois) x OXIDADO (partícula visível). Filtro de sedimentos retém sólido, então NÃO resolve metal dissolvido — a lógica é oxidar antes de filtrar, com tempo de contato, e retrolavar para não saturar/incrustar. pH e potencial de oxidação mandam (manganês é mais exigente), e mídias catalíticas ajudam só quando tecnicamente adequadas. A árvore de decisão do módulo é educacional, não projeto: mídia, dosagem, tempo de contato, vazões e limites (Portaria 888/2021) são pendentes e dependem de análise + hidráulica + especialista. Nunca prometer remoção sem laudo.'
};
