// ============================================================================
// MÓDULO 2 — Como interpretar uma análise  (segue o CONTRATO DE SCHEMA do mod-01)
// Blocos suportados por views/treinamento/poco/_blocos.ejs:
//   texto | titulo | callout(variante:info|alerta|sucesso|perigo) | card | cards |
//   script | dodont(fazer[],evitar[]) | checklist | tabela | perguntas | exemplo |
//   pendente(html?)  → "Pendente de validação técnica pela Tudo de Filtro" |
//   especialista(nome, icon?, html)  → personagem educacional
//
// REGRA: NÃO inventar valores/limites/soluções técnicas. Os VMP vêm de
// data/treinamento-poco/parametros-agua.js (Portaria GM/MS nº 888/2021).
// Aqui ensinamos a LER cada grupo de parâmetro — sem citar número de limite.
// ============================================================================

module.exports = {
  resumoCurto: 'Ler um laudo em três grupos — físicos, químicos e microbiológicos — sabendo o que cada parâmetro representa, o que pode causar e o que aquilo NÃO resolve sozinho. Sem decorar limite: o VMP vem sempre da fonte oficial.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-02-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'Confirme o parâmetro E a unidade antes de concluir qualquer coisa',
      html: 'O mesmo parâmetro pode aparecer em <strong>unidades diferentes</strong> (ex.: nitrato "como N" ou "como NO₃"; dureza em mg/L de CaCO₃). Um número sem a unidade certa induz a conclusão errada. Antes de comparar com qualquer referência: leia o <strong>nome exato do parâmetro</strong>, a <strong>unidade</strong> e só então o resultado. Na dúvida, é caso de encaminhar ao especialista técnico — não chute.' },

    { tipo: 'titulo', texto: 'Como o laudo se organiza' },
    { tipo: 'texto', html: 'Um laudo de potabilidade costuma separar os parâmetros em três grandes grupos. Interpretar bem é entender <strong>o que cada grupo avalia</strong> e por que nenhum deles, sozinho, "aprova" a água. A leitura é sempre: o que representa → possíveis origens → efeito visível/operacional → possível risco sanitário → o que aquilo normalmente <strong>não</strong> resolve por si só.' },
    { tipo: 'cards', itens: [
      { icon: '👁️', titulo: 'Físicos', html: 'O que se percebe: cor, turbidez, odor, aspecto. Bom ponto de partida, péssimo ponto de chegada.' },
      { icon: '🧪', titulo: 'Químicos', html: 'O que está dissolvido: pH, dureza, ferro, manganês, nitrato e outros. Quase nada disso se vê a olho nu.' },
      { icon: '🦠', titulo: 'Microbiológicos', html: 'Presença de indicadores de contaminação (coliformes, E. coli). Não têm cor, cheiro nem gosto.' },
    ]},

    { tipo: 'titulo', texto: 'Grupo 1 — Parâmetros físicos' },
    { tipo: 'texto', html: 'São os parâmetros de percepção. Ajudam a levantar hipóteses e a explicar queixas do cliente ("está amarelada", "tem cheiro"), mas <strong>não medem potabilidade</strong>.' },
    { tipo: 'tabela',
      head: ['Parâmetro', 'O que representa', 'Possíveis origens', 'Efeito visível/operacional', 'Possível risco sanitário', 'O que normalmente NÃO resolve'],
      rows: [
        ['Cor (aparente / verdadeira)', 'Coloração da água; aparente inclui partículas em suspensão, verdadeira é a cor após remover partículas.', 'Matéria orgânica, ferro/manganês dissolvidos, sólidos em suspensão.', 'Água amarelada/amarronzada; mancha em louça e roupa.', 'Depende da causa — cor é indício, não diagnóstico; investigar a origem.', 'Reduzir a cor não garante remover microbiológico nem dissolvidos; tratar a causa, não só a aparência.'],
        ['Turbidez', 'Grau de "névoa" causado por partículas em suspensão.', 'Sólidos suspensos, argila, entrada de superfície, oxidação de metais.', 'Água turva; pode entupir/desgastar equipamentos a jusante.', 'Turbidez alta pode abrigar/proteger micro-organismos e prejudicar desinfecção.', 'Baixar turbidez não desinfeta a água nem trata o que está dissolvido.'],
        ['Odor', 'Cheiro perceptível (ex.: "ovo podre", terroso).', 'Gases dissolvidos, matéria orgânica, atividade microbiológica.', 'Rejeição de uso; incômodo.', 'Odor pode ser sinal de processo indesejado; exige investigar, não mascarar.', 'Tirar o cheiro não significa remover o agente que o causou.'],
        ['Aspecto / Sólidos', 'Impressão geral e presença de material particulado/sedimentável.', 'Areia, sedimento do poço, incrustação da tubulação.', 'Depósito no fundo, desgaste de bombas e válvulas.', 'Indício de arraste do poço; avaliar junto do restante.', 'Reter partícula não trata dureza, metais dissolvidos nem microbiológico.'],
      ]
    },
    { tipo: 'callout', variante: 'alerta', titulo: 'Físico "bom" não libera venda',
      html: 'Água pode passar bem nos físicos e reprovar em químico ou microbiológico. Nunca conclua potabilidade pela aparência — isso é a regra do Módulo 1.' },

    { tipo: 'titulo', texto: 'Grupo 2 — Parâmetros químicos' },
    { tipo: 'texto', html: 'É onde mora a maior parte das decisões técnicas em água de poço. A maioria destes parâmetros <strong>não se enxerga</strong> e exige tecnologia compatível — cada um com sua etapa própria.' },
    { tipo: 'tabela',
      head: ['Parâmetro', 'O que representa', 'Possíveis origens', 'Efeito visível/operacional', 'Possível risco sanitário', 'O que normalmente NÃO resolve'],
      rows: [
        ['pH / Alcalinidade', 'Acidez/basicidade da água e sua capacidade de tamponamento.', 'Composição geológica do aquífero, gases dissolvidos.', 'Água agressiva ou incrustante; interfere no desempenho de outras etapas.', 'Isoladamente é mais operacional; influencia como outros parâmetros se comportam.', 'Ajustar pH não remove dureza, metais nem contaminação por si só.'],
        ['Dureza total', 'Concentração de cálcio e magnésio dissolvidos.', 'Rochas calcárias; característica natural de muitos poços.', 'Incrustação em tubulação, aquecedor e louças; sabão "não rende".', 'Parâmetro de qualidade/operacional; avaliar contra a fonte oficial.', 'Reter partícula não trata dureza (que é dissolvida); é outra tecnologia.'],
        ['Ferro / Manganês', 'Metais dissolvidos que oxidam em contato com o ar.', 'Muito comuns em água de poço, conforme geologia.', 'Manchas amareladas/escuras, cor e sabor metálico ao oxidar.', 'Parâmetros de qualidade/estética; avaliar contra a fonte oficial.', 'Um filtro de partícula pode não segurar o metal ainda dissolvido.'],
        ['Nitrato / Nitrito / Amônia', 'Formas de nitrogênio; indicam possível influência externa.', 'Fossas, adubação/agrotóxicos, efluentes, atividade agrícola.', 'Normalmente sem cor, cheiro ou gosto.', 'Nitrato é preocupação sanitária relevante (especialmente lactentes) — comparar com o VMP oficial.', 'Filtro comum de partícula/carvão não é solução assumida para nitrato; exige tecnologia específica.'],
        ['Cloretos / Sulfatos / SDT / Condutividade', 'Sais dissolvidos e carga iônica total da água.', 'Geologia, intrusão salina, contaminação.', 'Sabor salobro/amargo; agressividade e incrustação.', 'Parâmetros de qualidade; avaliar contra a fonte oficial.', 'Retenção de sólidos suspensos não reduz o que está dissolvido.'],
        ['Fluoreto / Metais diversos / Orgânicos / Agrotóxicos', 'Substâncias específicas que exigem análise dedicada.', 'Geologia local, atividade industrial/agrícola do entorno.', 'Geralmente imperceptíveis.', 'Cada substância tem risco e VMP próprios — comparar individualmente com a fonte oficial.', 'Não existe "um filtro para tudo"; cada substância pede a etapa compatível.'],
      ]
    },
    { tipo: 'especialista', nome: 'análises', icon: '🧑‍🔬',
      html: 'Regra de leitura que eu repito sempre: veja o <strong>nome do parâmetro</strong>, confira a <strong>unidade</strong>, e só então olhe o resultado. Dureza dissolvida, metal dissolvido e nitrato são coisas diferentes, com tratamentos diferentes. Quando o laudo tiver metal, orgânico ou agrotóxico específico, cada um se compara com o próprio limite — nunca com "um número geral".' },

    { tipo: 'titulo', texto: 'Grupo 3 — Parâmetros microbiológicos' },
    { tipo: 'texto', html: 'É o grupo mais silencioso e um dos mais críticos para consumo humano. <strong>Não tem cor, cheiro nem gosto</strong> — só a análise revela.' },
    { tipo: 'tabela',
      head: ['Parâmetro', 'O que representa', 'Possíveis origens', 'Efeito visível/operacional', 'Possível risco sanitário', 'O que normalmente NÃO resolve'],
      rows: [
        ['Coliformes totais', 'Grupo de bactérias usado como indicador de qualidade e de possível contaminação.', 'Infiltração, poço mal vedado, entrada de superfície.', 'Invisível.', 'Sinaliza que a barreira sanitária pode estar comprometida — comparar com o padrão oficial.', 'Filtrar partícula ou tratar dureza não desinfeta a água.'],
        ['Escherichia coli (E. coli)', 'Indicador de contaminação de origem fecal.', 'Fossa, esgoto, dejetos de animais.', 'Invisível.', 'Alerta sanitário forte; consumo pode representar risco — tratar como prioridade e comparar com o padrão oficial.', 'Nenhum tratamento estético (cor, sabor, partícula) resolve contaminação microbiológica.'],
        ['Bactérias heterotróficas', 'Contagem geral que ajuda a avaliar a condição microbiológica do sistema.', 'Biofilme, estagnação, reservatório mal higienizado.', 'Invisível.', 'Complementa a leitura microbiológica; avaliar no conjunto.', 'Números "ok" aqui não substituem os indicadores de contaminação acima.'],
      ]
    },
    { tipo: 'callout', variante: 'perigo', titulo: 'Microbiológico é caso de especialista',
      html: 'Presença de coliformes ou E. coli não é assunto para improviso comercial. Registre, não prometa nada e <strong>encaminhe ao especialista técnico</strong> para a conduta correta.' },

    { tipo: 'pendente',
      html: 'Os <strong>Valores Máximos Permitidos (VMP)</strong> de cada parâmetro deste módulo vêm de <code>data/treinamento-poco/parametros-agua.js</code>, associado à <strong>Portaria GM/MS nº 888/2021</strong>. Enquanto a Tudo de Filtro não validar cada valor no documento oficial (Anexo e vigência), eles permanecem <strong>pendentes de validação técnica</strong> e não devem ser citados de memória, blog ou "experiência". Comparar resultado com limite só depois do valor validado — e sempre conferindo a unidade.' },

    { tipo: 'dodont',
      fazer: [
        'Ler nome do parâmetro + unidade antes do resultado.',
        'Interpretar por grupo (físico, químico, microbiológico) e no conjunto.',
        'Buscar o VMP na fonte oficial validada, não na memória.',
        'Encaminhar ao especialista quando houver microbiológico ou dúvida real.',
      ],
      evitar: [
        'Comparar um resultado com um limite "de cabeça".',
        'Concluir potabilidade por parâmetro físico bom.',
        'Tratar dissolvido (dureza, metal, nitrato) como se fosse partícula.',
        'Prometer que "um" equipamento cobre todos os grupos.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O laudo mostra "nitrato" com um número. Qual o primeiro cuidado antes de comparar com qualquer referência?',
      opcoes: [
        'Comparar direto com o valor que você lembra de ter visto.',
        'Confirmar o parâmetro E a unidade (ex.: "como N" vs "como NO₃") e só buscar o VMP na fonte oficial.',
        'Concluir que está tudo bem porque a água é transparente.',
      ],
      correta: 1,
      explicacao: 'Unidade errada leva a conclusão errada. Confirma-se nome + unidade e compara-se com o VMP oficial validado (parametros-agua.js / Portaria 888/2021), nunca de memória.'
    },
    {
      pergunta: 'A água passou bem nos parâmetros físicos (cor, turbidez, odor). Isso permite afirmar que é potável?',
      opcoes: [
        'Sim, se está limpa e sem cheiro, está potável.',
        'Não — físico bom não avalia químicos dissolvidos nem microbiológico; potabilidade depende dos três grupos e da fonte oficial.',
        'Sim, desde que o cliente sempre tenha bebido dela.',
      ],
      correta: 1,
      explicacao: 'Físicos são percepção. Nitrato, metais e contaminação microbiológica não aparecem na aparência. A leitura é sempre no conjunto dos três grupos.'
    },
    {
      pergunta: 'O laudo indica presença de E. coli. Qual é a conduta correta do time comercial?',
      opcoes: [
        'Oferecer um filtro de partícula que "resolve".',
        'Mascarar cor e odor para melhorar a percepção do cliente.',
        'Registrar, não prometer nada e encaminhar ao especialista técnico para a conduta adequada.',
      ],
      correta: 2,
      explicacao: 'Microbiológico é assunto sanitário sério. Nenhum tratamento estético desinfeta água; a conduta é encaminhar ao especialista técnico.'
    },
  ],

  exercicio: {
    enunciado: 'Você recebeu um laudo com três achados: cor levemente elevada, dureza alta e coliformes presentes. Em 3–4 frases, explique como você organizaria a leitura por grupos e por que NÃO daria para propor "um filtro" que resolva os três de uma vez — sem citar nenhum número de limite.',
    dica: 'Separe físico (cor) × químico dissolvido (dureza) × microbiológico (coliformes); lembre que cada grupo pede tecnologia própria e que o VMP vem da fonte oficial.'
  },

  resumo: 'Interpretar análise é ler em três grupos — físicos (percepção), químicos (dissolvidos) e microbiológicos (invisíveis) — sempre conferindo parâmetro e unidade antes do resultado. Cada grupo tem origem, efeito e risco próprios, e nenhum sozinho aprova a água. Os VMP vêm de parametros-agua.js (Portaria 888/2021) e ficam pendentes até validação da TDF. Na dúvida ou com microbiológico presente, encaminhe ao especialista técnico.'
};
