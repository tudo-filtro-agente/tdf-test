// ============================================================================
// MÓDULO 13 — Compostos orgânicos (explicação breve e segura)
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js
// REGRA CRÍTICA: NÃO afirmar que carvão ativado remove todos os compostos
// orgânicos. Identificar o composto exige análise específica. Onde faltar base,
// usar `pendente`. Limites vêm de data/treinamento-poco/parametros-agua.js.
// Módulo curto e cauteloso — na dúvida, encaminhar ao especialista + nova análise.
// ============================================================================

module.exports = {
  resumoCurto: 'Compostos orgânicos são um grupo enorme e heterogêneo. Muitos não têm cor, cheiro nem gosto. Este módulo é curto e cauteloso de propósito: o objetivo é saber a hora de parar e encaminhar para análise específica.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-13-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'Assunto sensível — cautela obrigatória',
      html: '"Compostos orgânicos" abrange desde substâncias naturais até contaminantes sintéticos ligados à saúde. <strong>Não</strong> se resolve por observação, nem se promete remoção. Quando houver suspeita, a conduta é <strong>encaminhar ao especialista e pedir análise laboratorial específica</strong> — nunca improvisar uma solução.' },

    { tipo: 'titulo', texto: 'O que são (de forma simples)' },
    { tipo: 'texto', html: 'É um grupo muito amplo de substâncias que contêm carbono. Ele vai de material natural até compostos fabricados pelo ser humano. Como o grupo é enorme e variado, <strong>não existe um único tratamento</strong> que dê conta de todos — cada composto se comporta de um jeito.' },
    { tipo: 'cards', itens: [
      { icon: '🍂', titulo: 'Matéria orgânica natural', html: 'De origem vegetal/solo (folhas, raízes, húmus). Pode dar cor/gosto e é assunto do módulo de cor e matéria orgânica.' },
      { icon: '🧴', titulo: 'Compostos orgânicos sintéticos', html: 'Substâncias produzidas industrialmente que podem chegar à água por contaminação. Exigem análise específica para serem identificadas.' },
      { icon: '🧪', titulo: 'Solventes', html: 'Podem surgir de contaminação industrial/descarte. Não se identificam por observação — só por laboratório.' },
      { icon: '⛽', titulo: 'Combustíveis', html: 'Contaminação por vazamentos/infiltração (ex.: proximidade de tanques). Suspeita pelo histórico do local, confirmação por análise.' },
      { icon: '🌾', titulo: 'Agrotóxicos', html: 'Podem ocorrer em regiões de atividade agrícola. Cada substância tem análise e referência própria — depende da região e do uso do solo.' },
      { icon: '💨', titulo: 'Compostos voláteis', html: 'Alguns compostos orgânicos evaporam com facilidade, o que muda como precisam ser amostrados e analisados.' },
    ]},

    { tipo: 'callout', variante: 'alerta', titulo: 'O mais perigoso: podem não ter cor, cheiro nem gosto',
      html: 'Vários compostos orgânicos são <strong>indetectáveis pelos sentidos</strong>. A água pode estar limpa, sem odor e com bom sabor e ainda assim conter esse tipo de contaminante. Ausência de sinais <strong>não</strong> é ausência de contaminação — por isso o histórico do local e a análise pesam mais do que a impressão do cliente.' },

    { tipo: 'titulo', texto: 'Carvão ativado: útil, mas com limites' },
    { tipo: 'callout', variante: 'perigo', titulo: 'NÃO diga que carvão ativado remove todos os compostos orgânicos',
      html: 'O carvão ativado pode atuar sobre <strong>parte</strong> de certos compostos orgânicos, dependendo do composto, do tipo de carvão e das condições de operação. Ele <strong>não</strong> é solução universal: satura, tem afinidade diferente por cada substância, pode não reter alguns compostos e precisa de manutenção/troca. Afirmar remoção garantida é erro grave — na dúvida, <strong>encaminhe ao especialista e peça nova análise</strong>.' },

    { tipo: 'titulo', texto: 'Por que identificar o composto é indispensável' },
    { tipo: 'texto', html: 'Sem saber <strong>qual</strong> é o composto, não dá para dizer se algum tratamento se aplica, nem em que arranjo. Tratar "compostos orgânicos" genericamente é como receitar remédio sem diagnóstico. A identificação vem de <strong>análise laboratorial específica</strong> — muitas vezes diferente da análise físico-química básica.' },
    { tipo: 'dodont',
      fazer: [
        'Levantar o histórico do local (indústria, posto/combustível, agricultura, descarte por perto).',
        'Encaminhar ao especialista quando houver qualquer suspeita.',
        'Pedir análise laboratorial específica para o composto/família suspeita.',
      ],
      evitar: [
        'Dizer que carvão ativado "resolve compostos orgânicos".',
        'Concluir que a água está limpa porque não tem cor/cheiro/gosto.',
        'Propor equipamento sem identificar o composto por laboratório.',
      ]
    },

    { tipo: 'titulo', texto: 'Um cuidado extra: subprodutos da desinfecção' },
    { tipo: 'texto', html: 'A própria desinfecção, quando há matéria orgânica presente, pode gerar <strong>subprodutos</strong>. Isso reforça duas coisas: a desinfecção precisa ser bem conduzida, e a presença de matéria orgânica muda o quadro. Detalhes de controle e limites são <strong>pendentes de validação técnica</strong> e assunto de especialista.' },

    { tipo: 'especialista', nome: 'análises', icon: '🧑‍🔬',
      html: 'Nesse tema eu prefiro que você diga "não sei ainda, vou encaminhar" do que arriscar. Compostos orgânicos são muitos, invisíveis e sérios. Meu papel aqui é te lembrar: histórico do local + análise específica + especialista. Fora disso, nada de promessa.' },

    { tipo: 'pendente',
      html: 'Identificação do composto, escolha de tecnologia, tipo/quantidade de carvão, arranjo de tratamento e qualquer referência de limite são <strong>pendentes de validação técnica pela Tudo de Filtro</strong> e exigem análise laboratorial específica. Não informar eficiências de remoção nem prometer potabilidade.' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Cliente diz que a água "não tem cheiro nem gosto, então está livre de contaminação orgânica". Certo?',
      opcoes: [
        'Sim, se não tem cheiro nem gosto, está limpa.',
        'Não. Vários compostos orgânicos não têm cor, cheiro ou gosto; só a análise específica confirma.',
        'Sim, desde que a água seja transparente.',
      ],
      correta: 1,
      explicacao: 'Ausência de sinais sensoriais não prova ausência de contaminação. Esse é justamente o risco dos compostos orgânicos invisíveis.'
    },
    {
      pergunta: 'Qual afirmação sobre carvão ativado é segura?',
      opcoes: [
        'Carvão ativado remove todos os compostos orgânicos.',
        'Carvão ativado pode atuar sobre parte de certos compostos, com limitações, saturação e manutenção — e a aplicação depende de identificar o composto.',
        'Carvão ativado dispensa análise porque serve para tudo.',
      ],
      correta: 1,
      explicacao: 'Carvão tem afinidade variável, satura e não retém tudo. Afirmar remoção total é erro; identificar o composto vem primeiro.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente com poço próximo a área agrícola pergunta se "um filtro de carvão resolve agrotóxico". Escreva, em 2–3 frases, uma resposta responsável que não prometa remoção, cite a necessidade de análise específica e encaminhe ao especialista.',
    dica: 'Não afirme eficiência. Ancore em "identificar o composto por laboratório" e "encaminhar ao especialista".'
  },

  resumo: 'Compostos orgânicos são um grupo amplo — de matéria orgânica natural a sintéticos, solventes, combustíveis e agrotóxicos — e muitos não têm cor, cheiro ou gosto. Carvão ativado ajuda em parte de alguns casos, com limitações, e nunca remove tudo. Identificar o composto exige análise laboratorial específica; a desinfecção com matéria orgânica presente pode gerar subprodutos. Na dúvida: encaminhar ao especialista e pedir nova análise. Tudo o mais é pendente de validação técnica da TDF.'
};
