// ============================================================================
// MÓDULO 14 — Tecnologias de tratamento (visão conceitual e honesta)
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js
// REGRA: NÃO inventar eficiências/percentuais/remoção garantida. Cada card diz o
// que PODE tratar, o que NÃO trata, pré-requisitos, limitações, operação/
// manutenção/consumíveis, rejeito e monitoramento — tudo conceitual. Escolha real
// é `pendente`: depende de análise + hidráulica + especialista.
// ============================================================================

module.exports = {
  resumoCurto: 'Um mapa honesto das tecnologias de tratamento de água de poço: para cada uma, o que ela pode atacar, o que ela NÃO resolve, o que ela exige e o que consome. Nenhuma é solução universal.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-14-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'Cada tecnologia é uma ferramenta, não uma solução',
      html: 'As descrições abaixo são <strong>conceituais</strong>. Elas te ajudam a entender para que cada tecnologia serve e quais são seus limites — mas <strong>não</strong> substituem análise laboratorial, diagnóstico hidráulico e dimensionamento. Nenhuma linha aqui promete remoção garantida ou potabilidade, e não há percentuais porque eficiência real depende do caso.' },

    { tipo: 'titulo', texto: 'As tecnologias, uma a uma' },
    { tipo: 'cards', itens: [
      { icon: '🪨', titulo: 'Filtração multimídia',
        html: '<strong>Pode tratar:</strong> material particulado/turbidez, sedimentos.<br><strong>NÃO trata:</strong> substâncias dissolvidas (dureza, nitrato, muitos compostos), microbiológico.<br><strong>Pré-requisitos:</strong> conhecer sólidos/turbidez do laudo e a vazão.<br><strong>Limitações:</strong> não resolve o que está dissolvido.<br><strong>Operação:</strong> retrolavagem periódica; mídia com vida útil.<br><strong>Rejeito:</strong> água de retrolavagem.<br><strong>Monitoramento:</strong> perda de carga/aspecto.' },
      { icon: '⚫', titulo: 'Carvão ativado',
        html: '<strong>Pode tratar:</strong> parte de certos compostos que dão cor/odor/gosto e alguns orgânicos, conforme o caso.<br><strong>NÃO trata:</strong> tudo — não é universal; dureza, nitrato e microbiológico não são o foco.<br><strong>Pré-requisitos:</strong> saber o alvo pelo laudo.<br><strong>Limitações:</strong> satura; afinidade varia por composto.<br><strong>Operação:</strong> troca/recarga do carvão.<br><strong>Rejeito:</strong> carvão saturado a descartar.<br><strong>Monitoramento:</strong> saturação/ponto de troca.' },
      { icon: '🟠', titulo: 'Mídias para ferro e manganês',
        html: '<strong>Pode tratar:</strong> ferro/manganês em condições específicas.<br><strong>NÃO trata:</strong> outros parâmetros; depende de condições (ex.: oxidação/pH).<br><strong>Pré-requisitos:</strong> laudo de ferro e manganês; condições de operação adequadas.<br><strong>Limitações:</strong> sensível às condições da água; nem toda forma responde igual.<br><strong>Operação:</strong> retrolavagem/regeneração conforme a mídia.<br><strong>Rejeito:</strong> água de lavagem.<br><strong>Monitoramento:</strong> desempenho ao longo do tempo.' },
      { icon: '🧂', titulo: 'Abrandamento',
        html: '<strong>Pode tratar:</strong> dureza (cálcio/magnésio).<br><strong>NÃO trata:</strong> microbiológico, nitrato, a maioria dos orgânicos, partículas.<br><strong>Pré-requisitos:</strong> dureza no laudo; disponibilidade de sal/regeneração.<br><strong>Limitações:</strong> foco em dureza; troca iônica tem alvo específico.<br><strong>Operação:</strong> regeneração com salmoura; reposição de sal.<br><strong>Rejeito:</strong> efluente salino da regeneração.<br><strong>Monitoramento:</strong> dureza residual/ciclos.' },
      { icon: '⚗️', titulo: 'Dosagem química',
        html: '<strong>Pode tratar:</strong> apoia outras etapas (ex.: oxidar, corrigir, coagular) conforme o objetivo.<br><strong>NÃO trata:</strong> nada sozinha — é uma etapa de apoio.<br><strong>Pré-requisitos:</strong> definição do produto/objetivo pelo diagnóstico.<br><strong>Limitações:</strong> exige dose controlada e correta.<br><strong>Operação:</strong> reposição de produto; calibração da bomba dosadora.<br><strong>Rejeito:</strong> conforme o processo.<br><strong>Monitoramento:</strong> dose e resultado da etapa seguinte.' },
      { icon: '🧴', titulo: 'Cloração',
        html: '<strong>Pode tratar:</strong> desinfecção (agir sobre microbiológico) e apoiar oxidação em certos casos.<br><strong>NÃO trata:</strong> dureza, partículas, muitos dissolvidos.<br><strong>Pré-requisitos:</strong> dose e tempo de contato adequados; controle.<br><strong>Limitações:</strong> com matéria orgânica pode gerar subprodutos; exige controle.<br><strong>Operação:</strong> reposição de produto; ajuste de dose.<br><strong>Rejeito:</strong> conforme o processo.<br><strong>Monitoramento:</strong> residual e tempo de contato.' },
      { icon: '⏱️', titulo: 'Tanque de contato',
        html: '<strong>Pode tratar:</strong> não trata sozinho — garante o <strong>tempo</strong> para uma reação (ex.: desinfecção/oxidação) acontecer antes da etapa seguinte.<br><strong>NÃO trata:</strong> nada por si só.<br><strong>Pré-requisitos:</strong> dimensionar tempo/volume conforme a reação.<br><strong>Limitações:</strong> só entrega tempo de contato; precisa de espaço.<br><strong>Operação:</strong> limpeza periódica.<br><strong>Monitoramento:</strong> tempo de retenção efetivo.' },
      { icon: '💡', titulo: 'Ultravioleta (UV)',
        html: '<strong>Pode tratar:</strong> desinfecção (agir sobre micro-organismos) sob condições adequadas.<br><strong>NÃO trata:</strong> partículas, dureza, dissolvidos; não deixa residual de proteção.<br><strong>Pré-requisitos:</strong> água com baixa turbidez/boa transmitância; energia.<br><strong>Limitações:</strong> só desinfecção no ponto; turbidez atrapalha.<br><strong>Operação:</strong> troca de lâmpada; limpeza do quartzo.<br><strong>Monitoramento:</strong> intensidade da lâmpada/pré-filtração.' },
      { icon: '🧫', titulo: 'Ultrafiltração',
        html: '<strong>Pode tratar:</strong> retenção de partículas/coloides e parte do microbiológico conforme a faixa da membrana.<br><strong>NÃO trata:</strong> dissolvidos pequenos (sais, dureza, nitrato) em geral.<br><strong>Pré-requisitos:</strong> pré-tratamento; pressão/vazão adequadas.<br><strong>Limitações:</strong> depende da faixa da membrana; incrusta/coloca.<br><strong>Operação:</strong> retrolavagem/limpeza; troca de membrana.<br><strong>Rejeito:</strong> concentrado/lavagem.<br><strong>Monitoramento:</strong> pressão/fluxo.' },
      { icon: '🌊', titulo: 'Osmose reversa',
        html: '<strong>Pode tratar:</strong> ampla gama de dissolvidos, conforme o caso.<br><strong>NÃO trata:</strong> não dispensa pré-tratamento; sensível a incrustação/entupimento.<br><strong>Pré-requisitos:</strong> pré-tratamento, pressão, energia; às vezes pós-tratamento.<br><strong>Limitações:</strong> gera rejeito significativo; consome energia; membranas sensíveis.<br><strong>Operação:</strong> troca de membranas/pré-filtros; limpeza.<br><strong>Rejeito:</strong> concentrado a destinar.<br><strong>Monitoramento:</strong> recuperação, pressão, qualidade.' },
      { icon: '🧪', titulo: 'Resinas seletivas',
        html: '<strong>Pode tratar:</strong> alvos específicos para os quais a resina foi feita (ex.: certos íons/compostos).<br><strong>NÃO trata:</strong> o que está fora do alvo da resina.<br><strong>Pré-requisitos:</strong> laudo que confirme o alvo; regeneração.<br><strong>Limitações:</strong> seletividade estreita; capacidade finita.<br><strong>Operação:</strong> regeneração/troca; insumos.<br><strong>Rejeito:</strong> efluente de regeneração.<br><strong>Monitoramento:</strong> saturação/ponto de regeneração.' },
      { icon: '⚖️', titulo: 'Correção de pH',
        html: '<strong>Pode tratar:</strong> ajustar pH para dentro de faixa adequada e viabilizar outras etapas.<br><strong>NÃO trata:</strong> contaminantes em si — é condição/ajuste.<br><strong>Pré-requisitos:</strong> pH do laudo; objetivo definido.<br><strong>Limitações:</strong> precisa de controle; pH afeta as demais etapas.<br><strong>Operação:</strong> reposição de insumo; calibração.<br><strong>Monitoramento:</strong> pH de saída.' },
      { icon: '🌀', titulo: 'Coagulação e floculação',
        html: '<strong>Pode tratar:</strong> agregar partículas finas/coloides para depois separar por filtração.<br><strong>NÃO trata:</strong> não é etapa final; sozinha não entrega água pronta.<br><strong>Pré-requisitos:</strong> dosagem controlada; etapa de separação depois.<br><strong>Limitações:</strong> exige ajuste fino e operação; gera lodo.<br><strong>Operação:</strong> dosagem/insumos; remoção de lodo.<br><strong>Rejeito:</strong> lodo.<br><strong>Monitoramento:</strong> dose/formação de flocos.' },
      { icon: '🧩', titulo: 'Sistemas combinados',
        html: '<strong>Pode tratar:</strong> problemas com múltiplos parâmetros, encadeando etapas na ordem certa.<br><strong>NÃO trata:</strong> nada "automaticamente" — a combinação errada pode falhar.<br><strong>Pré-requisitos:</strong> diagnóstico completo; ordem definida por especialista.<br><strong>Limitações:</strong> mais complexo de operar; cada etapa tem seu limite.<br><strong>Operação:</strong> soma das manutenções das etapas.<br><strong>Rejeito:</strong> conforme as etapas.<br><strong>Monitoramento:</strong> desempenho por etapa e do conjunto.' },
    ]},

    { tipo: 'callout', variante: 'alerta', titulo: 'Leia sempre nesta ordem',
      html: 'Para cada tecnologia, pense: <strong>o que ela trata → o que ela NÃO trata → o que ela exige → o que ela consome → o que ela rejeita → o que precisa monitorar</strong>. Se você só decorar "para que serve", vai vender solução incompleta.' },

    { tipo: 'especialista', nome: 'análises', icon: '🧑‍🔬',
      html: 'Ninguém escolhe tecnologia por catálogo. Eu leio o laudo, cruzo com a hidráulica (vazão, pressão, espaço, energia) e só então digo quais etapas fazem sentido e em que ordem. Tecnologia sem diagnóstico é chute caro.' },

    { tipo: 'pendente',
      html: 'A <strong>escolha real</strong> da(s) tecnologia(s), a ordem das etapas, o dimensionamento, os consumíveis e as eficiências dependem de <strong>análise laboratorial + diagnóstico hidráulico + especialista</strong> e são <strong>pendentes de validação técnica pela Tudo de Filtro</strong>. Não prometer percentuais de remoção nem potabilidade.' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Um cliente quer "só uma osmose reversa e pronto" para um poço com muito ferro e partículas. Qual alerta é correto?',
      opcoes: [
        'Osmose reversa sozinha resolve tudo, é só instalar.',
        'Osmose reversa costuma exigir pré-tratamento; ferro/partículas podem incrustar/entupir a membrana, então o arranjo depende do laudo e da hidráulica.',
        'Basta trocar a membrana toda semana.',
      ],
      correta: 1,
      explicacao: 'Osmose reversa não dispensa pré-tratamento e é sensível a incrustação. Sem diagnóstico, "só a osmose" pode falhar rápido.'
    },
    {
      pergunta: 'Por que o abrandamento não é resposta para contaminação microbiológica?',
      opcoes: [
        'Porque é caro demais.',
        'Porque o abrandamento tem como alvo a dureza (cálcio/magnésio), não a desinfecção — micro-organismos pedem outra etapa.',
        'Porque abrandador serve para qualquer problema.',
      ],
      correta: 1,
      explicacao: 'Cada tecnologia tem um alvo. Abrandamento trata dureza; microbiológico é assunto de desinfecção, não dele.'
    },
    {
      pergunta: 'O que o "tanque de contato" entrega no tratamento?',
      opcoes: [
        'Ele filtra as partículas sozinho.',
        'Ele fornece o tempo necessário para uma reação (como desinfecção/oxidação) acontecer antes da etapa seguinte — não trata sozinho.',
        'Ele substitui a análise laboratorial.',
      ],
      correta: 1,
      explicacao: 'Tanque de contato dá tempo de retenção para a reação; não é uma etapa que remove contaminante por conta própria.'
    },
  ],

  exercicio: {
    enunciado: 'Escolha duas tecnologias deste módulo e escreva, para cada uma, uma frase de "o que trata" e uma de "o que NÃO trata", sem citar percentuais. Depois explique em uma frase por que juntá-las poderia ou não fazer sentido — lembrando que a decisão final é do diagnóstico.',
    dica: 'Foque no par alvo x limite. Ex.: filtração (partícula) x algo que trate o dissolvido. Não prometa remoção.'
  },

  resumo: 'Cada tecnologia — filtração multimídia, carvão, mídias de ferro/manganês, abrandamento, dosagem, cloração, tanque de contato, UV, ultrafiltração, osmose reversa, resinas seletivas, correção de pH, coagulação/floculação e sistemas combinados — tem um alvo, um conjunto de limites, pré-requisitos, consumíveis, rejeito e pontos de monitoramento. Nenhuma é universal e não há percentuais fixos: a escolha e a ordem reais são pendentes de validação técnica da TDF, a partir de análise + hidráulica + especialista.'
};
