// ============================================================================
// MÓDULO 4 — Sondagem hidráulica  (segue o CONTRATO DE SCHEMA do mod-01)
// Blocos suportados por views/treinamento/poco/_blocos.ejs:
//   texto | titulo | callout(variante:info|alerta|sucesso|perigo) | card | cards |
//   script | dodont(fazer[],evitar[]) | checklist | tabela | perguntas | exemplo |
//   pendente(html?)  → "Pendente de validação técnica pela Tudo de Filtro" |
//   especialista(nome, icon?, html)  → personagem educacional
//
// Os PRINCÍPIOS hidráulicos abaixo são conceituais (do briefing TDF) e podem ser
// afirmados. Qualquer NÚMERO de vazão de serviço/dimensionamento é `pendente`.
// ============================================================================

module.exports = {
  resumoCurto: 'Depois da análise vem a hidráulica: sem entender vazão do poço, da bomba, da necessidade e da retrolavagem, não há dimensionamento honesto. Aqui está o roteiro obrigatório de sondagem e os princípios que sustentam a proposta.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-04-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'Análise diz O QUE tratar; a hidráulica diz COMO dimensionar',
      html: 'Um tratamento certo para a água errada de vazão vira problema. A sondagem hidráulica é obrigatória <strong>antes de dimensionar qualquer equipamento</strong>. Coletar esses dados não é opcional — é o que permite ao especialista técnico calcular sem chutar.' },

    { tipo: 'titulo', texto: 'Roteiro obrigatório de sondagem' },
    { tipo: 'texto', html: 'Levante <strong>todos</strong> os itens abaixo em campo/conversa. Faltou item, faltou base para dimensionar. O objetivo aqui é <strong>coletar dado</strong>, não calcular — o cálculo é do especialista técnico.' },
    { tipo: 'perguntas', itens: [
      'Vazão nominal da bomba (o que a bomba promete em catálogo/placa)?',
      'Vazão medida (o que a bomba realmente entrega, medida no local)?',
      'Vazão do poço (o quanto o poço consegue fornecer de forma sustentável)?',
      'Profundidade do poço?',
      'Potência da bomba (CV/kW)?',
      'Altura manométrica (desnível/pressão que a bomba precisa vencer)?',
      'Diâmetro da tubulação (recalque e distribuição)?',
      'Pressão disponível no sistema?',
      'Tempo de funcionamento da bomba (quanto tempo por dia ela opera)?',
      'Tipo e lógica da boia / acionamento (como liga e desliga)?',
      'Existe caixa/reservatório de água bruta (antes do tratamento)?',
      'Existe caixa/reservatório de água tratada (depois do tratamento)?',
      'Volume de cada reservatório (bruta e tratada)?',
      'Consumo diário estimado (litros/dia)?',
      'Vazão máxima simultânea (pico de uso ao mesmo tempo)?',
      'Número de usuários atendidos?',
      'Número de pontos de consumo (torneiras, chuveiros, etc.)?',
      'Há irrigação? Qual demanda?',
      'Há piscina? Qual volume/reposição?',
      'Há animais / dessedentação? Qual demanda?',
      'Uso do sistema: residencial, industrial ou coletivo?',
      'Espaço físico disponível para instalar o tratamento?',
      'Há ponto de dreno/descarte para a retrolavagem?',
      'Há energia elétrica adequada no local do tratamento?',
      'O local do tratamento é coberto/protegido de intempéries?',
      'Distâncias entre poço ↔ tratamento ↔ reservação?',
    ]},
    { tipo: 'callout', variante: 'alerta', titulo: 'Dado que falta vira suposição',
      html: 'Cada item em branco no roteiro é uma suposição que alguém vai ter que "chutar" depois — e chute em hidráulica custa caro (equipamento subdimensionado que não lava a mídia, ou superdimensionado que não opera direito). Traga o roteiro completo ao especialista técnico.' },

    { tipo: 'titulo', texto: 'Os princípios que sustentam a proposta' },
    { tipo: 'texto', html: 'Estes conceitos podem — e devem — ser afirmados com segurança. Eles explicam por que os dados acima importam e por que "colocar um tanque grande" não é sinônimo de acertar.' },
    { tipo: 'cards', itens: [
      { icon: '⚖️', titulo: 'Vazão do poço ≠ vazão da bomba', html: 'A bomba pode "puxar" mais do que o poço sustenta. Dimensionar pela bomba, ignorando o poço, leva a um sistema que o poço não alimenta.' },
      { icon: '🎯', titulo: 'Vazão da bomba ≠ vazão necessária', html: 'O que a bomba entrega não é, por si, o que a casa/uso precisa. Necessidade se levanta pelo consumo e pelo pico simultâneo, não pela placa da bomba.' },
      { icon: '🛠️', titulo: 'O tratamento respeita a vazão de serviço dos equipamentos', html: 'Cada equipamento tem uma faixa de vazão em que trabalha bem. O projeto se ajusta a essa faixa — não o contrário.' },
      { icon: '🔄', titulo: 'A retrolavagem pode exigir vazão MAIOR que o consumo normal', html: 'Lavar o meio filtrante (backwash) costuma pedir mais vazão instantânea do que o uso do dia a dia. O sistema precisa conseguir entregar isso.' },
      { icon: '🚱', titulo: 'Sem vazão suficiente, o meio filtrante pode não ser lavado', html: 'Se falta vazão na retrolavagem, a mídia não se expande/limpa como deveria — o equipamento perde desempenho e vida útil.' },
      { icon: '📉', titulo: 'Superdimensionar também gera problema', html: 'Grande demais não é "margem de segurança": pode operar fora da faixa ideal, gerar baixa velocidade, canalização e mau funcionamento. O certo é o adequado, não o maior.' },
    ]},

    { tipo: 'callout', variante: 'info', titulo: 'Pendente — todo número de vazão de serviço',
      html: 'Qualquer <strong>valor específico</strong> de vazão de serviço, vazão de retrolavagem, tempo de contato, tamanho de tanque ou volume de mídia depende do <strong>equipamento e da mídia escolhidos</strong> e do <strong>documento-mestre da Tudo de Filtro</strong>. Esses números estão <strong>pendentes de validação técnica</strong> — não os informe de memória. O papel do vendedor é trazer o roteiro completo; o cálculo é do especialista técnico.' },

    { tipo: 'especialista', nome: 'hidráulica', icon: '🧑‍🔧',
      html: 'Eu sou o especialista de hidráulica. Antes de qualquer tanque, eu quero três vazões na mão: a que o <strong>poço</strong> dá, a que a <strong>bomba</strong> entrega e a que o <strong>uso</strong> exige — e ainda a da <strong>retrolavagem</strong>, que costuma ser a mais exigente. Se você me trouxer o roteiro completo, eu dimensiono. Se vier faltando dado, eu não invento: eu peço de volta.' },

    { tipo: 'dodont',
      fazer: [
        'Levantar o roteiro completo antes de falar em equipamento.',
        'Medir vazões reais no local (não só a placa da bomba).',
        'Registrar espaço, dreno, energia, cobertura e distâncias.',
        'Levar tudo ao especialista técnico para o dimensionamento.',
      ],
      evitar: [
        'Dimensionar pela vazão da bomba ignorando o poço e a retrolavagem.',
        'Achar que "quanto maior o tanque, melhor".',
        'Informar número de vazão de serviço/mídia de memória.',
        'Fechar proposta com itens do roteiro em branco.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Por que a vazão de retrolavagem é um dado tão crítico na sondagem?',
      opcoes: [
        'Porque ela é sempre menor que o consumo, então não preocupa.',
        'Porque lavar o meio filtrante costuma exigir vazão MAIOR que o uso normal; sem essa vazão, a mídia pode não ser lavada e o equipamento perde desempenho.',
        'Porque só importa em uso industrial.',
      ],
      correta: 1,
      explicacao: 'O backwash tende a ser o momento de maior exigência de vazão instantânea. Se o sistema não entrega isso, a mídia não se limpa e o desempenho cai.'
    },
    {
      pergunta: 'O cliente sugere "colocar logo o maior tanque para garantir". Qual a resposta tecnicamente correta?',
      opcoes: [
        'Concordar: maior é sempre mais seguro.',
        'Explicar que superdimensionar também gera problema de operação (fora da faixa ideal, canalização); o correto é o tamanho adequado, calculado pelo especialista com os dados da sondagem.',
        'Escolher pela vazão nominal da bomba e pronto.',
      ],
      correta: 1,
      explicacao: 'Nem grande demais nem pequeno demais: o equipamento tem uma faixa de vazão de serviço. O dimensionamento certo vem dos dados do roteiro, não do "maior por garantia".'
    },
  ],

  exercicio: {
    enunciado: 'Você foi a campo e conseguiu: profundidade do poço, potência da bomba e número de usuários — mas não mediu a vazão real da bomba, não sabe a vazão do poço e não viu se há ponto de dreno. Liste, em tópicos, o que ainda precisa levantar antes de mandar ao especialista e explique em uma frase por que cada lacuna trava o dimensionamento.',
    dica: 'Pense nas três vazões (poço, bomba, necessidade) + retrolavagem, e nos itens de infraestrutura (dreno, energia, espaço, distâncias).'
  },

  resumo: 'A sondagem hidráulica é obrigatória antes de dimensionar. O roteiro cobre as três vazões (poço, bomba, necessidade), pico simultâneo, reservação, consumo, usos especiais (irrigação, piscina, animais), tipo de uso e a infraestrutura (espaço, dreno, energia, cobertura, distâncias). Princípios afirmáveis: vazão do poço ≠ da bomba ≠ da necessidade; o tratamento respeita a vazão de serviço; a retrolavagem pode exigir mais vazão que o consumo; sem vazão a mídia não é lavada; e superdimensionar também é problema. Todo número específico de vazão de serviço/mídia é pendente e fica com o especialista de hidráulica.'
};
