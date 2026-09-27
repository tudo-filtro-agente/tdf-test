// ============================================================================
// MÓDULO — Filtro de carvão ativado: tipos e aplicação
// Ciência de adsorção (didático + técnico). Sem cravar valores específicos
// (número de iodo, EBCT, vazões) → conceito + `pendente` para specs oficiais.
// Mantém a regra: carvão NÃO desinfeta, NÃO remove dureza/sais/nitrato/metais dissolvidos.
// ============================================================================

module.exports = {
  resumoCurto: 'Como o carvão ativado limpa a água por ADSORÇÃO, o que ele tira (cloro, gosto, odor, orgânicos) e o que NÃO tira (dureza, sais, nitrato, micro-organismos) — e a diferença entre carvão mineral, vegetal e os demais.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-carvao-ativado-video' },

  blocos: [
    { tipo: 'titulo', texto: 'O que é carvão ativado e como funciona (adsorção)' },
    { tipo: 'texto', html: 'Carvão ativado é um carvão tratado para ter uma <strong>área superficial gigante</strong>, cheia de <strong>poros microscópicos</strong>. Ele limpa a água por <strong>adsorção</strong>: as moléculas de certas substâncias <strong>grudam</strong> na superfície dos poros (é diferente de "filtrar partícula" — é uma atração físico-química). Um grama de carvão ativado tem centenas de metros quadrados de área interna.' },
    { tipo: 'callout', variante: 'info', titulo: 'Adsorção ≠ filtração mecânica',
      html: '<strong>Filtrar</strong> = barrar partícula pelo tamanho. <strong>Adsorver</strong> = a molécula dissolvida adere ao poro do carvão. Por isso o carvão pega coisas que "passam" por um filtro de sedimentos — como cloro e compostos que dão gosto/cheiro.' },

    { tipo: 'titulo', texto: 'O que o carvão ativado FAZ e o que NÃO faz' },
    { tipo: 'dodont',
      fazer: [
        'Remover cloro livre e reduzir gosto e odor da água.',
        'Adsorver muitos compostos orgânicos dissolvidos, alguns subprodutos da cloração e certos pesticidas.',
        'Melhorar sabor, cheiro e "sensação" da água (polimento final).',
      ],
      evitar: [
        'Prometer que remove dureza, sais dissolvidos, nitrato ou metais dissolvidos — NÃO remove.',
        'Achar que desinfeta: carvão NÃO mata micro-organismos (saturado, pode até virar leito de bactéria).',
        'Dizer que "carvão remove tudo" (você viu isso no módulo de compostos orgânicos).',
      ]
    },
    { tipo: 'callout', variante: 'perigo', titulo: 'Limites que não se quebram',
      html: 'Carvão ativado <strong>não</strong> remove dureza, <strong>não</strong> dessaliniza, <strong>não</strong> tira nitrato e <strong>não</strong> desinfeta. Ele adsorve orgânicos, cloro, gosto e odor. Para o resto, é outra tecnologia (abrandador, osmose, resina seletiva, desinfecção…).' },

    { tipo: 'titulo', texto: 'Os tipos de carvão (pela matéria-prima)' },
    { tipo: 'cards', itens: [
      { icon: '🪨', titulo: 'Mineral / betuminoso (hulha)', html: 'Feito de carvão mineral. Grão duro e resistente, boa distribuição de poros para <strong>orgânicos maiores</strong>. Base comum de carvão <strong>catalítico</strong> (para cloramina/H₂S). Bom custo-benefício em leito granular.' },
      { icon: '🥥', titulo: 'Vegetal / casca de coco', html: 'Muito <strong>microporoso</strong> e com <strong>alto número de iodo</strong> — excelente para <strong>cloro</strong> e orgânicos <strong>leves/pequenos</strong>, gosto e odor. Duro, gera pouco pó, é <strong>renovável</strong>. Muito usado em polimento de água de beber.' },
      { icon: '🌳', titulo: 'Madeira', html: 'Bastante poroso; aparece mais em forma de <strong>pó (PAC)</strong> e em descoloração/tratamentos específicos. Menos comum em leito de casa.' },
      { icon: '⚙️', titulo: 'Catalítico', html: 'Carvão (geralmente mineral) modificado para <strong>acelerar reações</strong> — indicado para <strong>cloramina</strong> e <strong>sulfeto de hidrogênio (H₂S, cheiro de ovo podre)</strong>, que o carvão comum trata mal.' },
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Regra prática de escolha',
      html: 'Gosto/cloro/orgânico leve → <strong>coco</strong> costuma brilhar (microporoso). Orgânico maior / uso robusto / catalítico → <strong>mineral/betuminoso</strong>. Cheiro de ovo podre ou cloramina → <strong>catalítico</strong>. A escolha final depende do que a <strong>análise</strong> aponta.' },

    { tipo: 'titulo', texto: 'Conceitos técnicos que valem conhecer' },
    { tipo: 'cards', itens: [
      { icon: '🔢', titulo: 'Número de iodo', html: 'Indicador de área superficial/microporosidade — quanto maior, mais "sede" de moléculas pequenas (como cloro). Coco costuma ter número de iodo alto.' },
      { icon: '⏱️', titulo: 'Tempo de contato (EBCT)', html: 'A água precisa ficar tempo suficiente no leito para o carvão adsorver. Vazão alta demais = pouco contato = pior desempenho.' },
      { icon: '📦', titulo: 'Formatos', html: 'GAC (granular, leito retrolavável), bloco (block, alta filtração+adsorção), pó (PAC, dosado).' },
      { icon: '♻️', titulo: 'Saturação', html: 'O carvão "enche" e satura — aí para de adsorver e precisa ser trocado. Retrolavagem tira partícula, mas NÃO "recarrega" a adsorção.' },
    ]},
    { tipo: 'pendente', html: 'Número de iodo, densidade, granulometria, tempo de contato, vazão de serviço e frequência de troca do carvão usado pela Tudo de Filtro seguem a <strong>ficha técnica oficial</strong> — confirmar antes de citar valores. Aqui é o conceito.' },

    { tipo: 'especialista', nome: 'mídias filtrantes', icon: '🧑‍🔬',
      html: 'Pensa assim: carvão é "polimento" — tira o que dá gosto/cheiro e cloro/orgânico. Não é abrandador, não é osmose, não é desinfecção. E carvão satura: tem hora de trocar.' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente quer usar só um filtro de carvão para "resolver a água de poço". Qual a resposta correta?',
      opcoes: [
        'Perfeito, carvão remove tudo.',
        'Carvão adsorve cloro, gosto, odor e orgânicos — mas NÃO remove dureza, sais, nitrato nem desinfeta. Depende da análise definir o conjunto certo.',
        'Só trocar por osmose que resolve tudo.',
      ],
      correta: 1,
      explicacao: 'Carvão é polimento por adsorção. Não trata dureza, nitrato, sais ou micro-organismos. A solução real sai da análise.'
    },
    {
      pergunta: 'Para gosto, cloro e orgânicos leves em água de beber, qual carvão costuma se destacar e por quê?',
      opcoes: [
        'Madeira, por ser barato.',
        'Coco (vegetal), por ser muito microporoso e ter alto número de iodo.',
        'Nenhum, carvão não serve para isso.',
      ],
      correta: 1,
      explicacao: 'O carvão de casca de coco é microporoso e com alto número de iodo — ótimo para cloro e moléculas pequenas de gosto/odor.'
    },
    {
      pergunta: 'O que a retrolavagem faz num leito de carvão saturado?',
      opcoes: [
        'Recarrega totalmente a capacidade de adsorção.',
        'Remove partículas retidas e descompacta o leito, mas NÃO recupera a adsorção — carvão saturado precisa ser trocado.',
        'Desinfeta o carvão.',
      ],
      correta: 1,
      explicacao: 'Retrolavagem é higiene física do leito; a adsorção se esgota com o uso e exige troca do carvão.'
    },
  ],

  exercicio: {
    enunciado: 'Liste 3 coisas que o carvão ativado tira e 3 que ele NÃO tira. Depois, explique a um cliente por que você indicaria carvão de coco para melhorar o gosto/cheiro, mas não como "solução única" da água de poço.',
    dica: 'Tira: cloro, gosto, odor, muitos orgânicos. NÃO tira: dureza, nitrato, sais, micro-organismos. Coco = microporoso/alto iodo.'
  },

  resumo: 'Carvão ativado limpa por ADSORÇÃO (moléculas grudam nos poros), não por filtragem mecânica: tira cloro, gosto, odor e muitos orgânicos, mas NÃO remove dureza, sais, nitrato nem desinfeta. Tipos: mineral/betuminoso (robusto, base de catalítico), vegetal/coco (microporoso, alto iodo, ótimo p/ cloro e orgânicos leves), madeira (mais em pó) e catalítico (cloramina, H₂S). Conceitos: número de iodo, tempo de contato, formatos (GAC/bloco/pó) e saturação (satura e troca; retrolavagem não recarrega). Valores específicos ficam pendentes de ficha oficial.'
};
