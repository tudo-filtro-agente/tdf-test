// ============================================================================
// MÓDULO 6 — Válvulas Runxin  (academia de Poço)
// Segue o CONTRATO DE SCHEMA definido em content/mod-01-fundamentos.js.
// Blocos: texto | titulo | callout | card | cards | script | dodont |
//         checklist | tabela | perguntas | exemplo | pendente | especialista
//
// REGRA CRÍTICA: NÃO inventar valores de programação (minutos de ciclo,
// horários, frequência, kg de sal, litros). Todo número específico → `pendente`.
// Diagramas descritos EM TEXTO (não gerar imagem). Ensinar conceito, função,
// limitação, operação e QUANDO chamar o especialista.
// ============================================================================

module.exports = {
  resumoCurto: 'O que é uma válvula de controle Runxin, manual x automática, por tempo x por volume, os ciclos que ela executa — e por que misturar ciclo de filtro com ciclo de abrandador dá problema.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-06-valvulas-runxin-video' },

  blocos: [
    { tipo: 'callout', variante: 'alerta', titulo: 'Antes de qualquer programação',
      html: 'Este módulo ensina <strong>o que a válvula faz</strong> e como ela pensa. Ele <strong>não</strong> traz tempos de ciclo, horários, frequência de regeneração ou quantidades: esses parâmetros dependem da mídia, do volume do tanque e da qualidade da água, e só vêm de <strong>fonte técnica cadastrada</strong> pela Tudo de Filtro. Programar de cabeça é a origem da maioria dos defeitos.' },

    { tipo: 'titulo', texto: 'O que é uma válvula de controle' },
    { tipo: 'texto', html: 'A válvula (ou "cabeçote") é o <strong>cérebro do tanque</strong>. Ela fica rosqueada no topo do tanque FRP e direciona o caminho da água: manda para <strong>serviço</strong> (filtrando), ou desvia para os ciclos de <strong>manutenção do leito</strong> (retrolavagem, enxágue e, quando há resina, regeneração). A Runxin é uma marca comum desse tipo de cabeçote, com versões para filtro e versões para abrandador.' },
    { tipo: 'cards', itens: [
      { icon: '🧠', titulo: 'Direciona o fluxo', html: 'Decide por onde a água passa em cada momento (serviço ou manutenção).' },
      { icon: '⏱️', titulo: 'Controla o tempo', html: 'Executa cada ciclo pela duração programada e volta ao serviço.' },
      { icon: '🔁', titulo: 'Automatiza a manutenção', html: 'Nas versões automáticas, dispara os ciclos sozinha conforme a programação.' },
    ]},

    { tipo: 'titulo', texto: 'Manual x automática' },
    { tipo: 'cards', itens: [
      { icon: '🖐️', titulo: 'Manual', html: 'O operador gira/aciona a válvula para trocar de ciclo. Depende de alguém lembrar e fazer. Mais barata, mais sujeita a esquecimento.' },
      { icon: '🤖', titulo: 'Automática', html: 'Um controlador dispara os ciclos sozinho conforme a programação. Menos dependente do operador, mas exige programação correta e energia.' },
    ]},

    { tipo: 'titulo', texto: 'Por tempo x por volume' },
    { tipo: 'texto', html: 'As automáticas iniciam os ciclos de manutenção por um de dois critérios. Entender a diferença evita vender/programar errado.' },
    { tipo: 'cards', itens: [
      { icon: '📅', titulo: 'Por tempo (cronológica)', html: 'Dispara em intervalo fixo (ex.: a cada tantos dias, em determinado horário). Simples, mas ignora quanta água foi realmente usada.' },
      { icon: '📊', titulo: 'Por volume (volumétrica)', html: 'Um medidor conta a água tratada e dispara o ciclo ao atingir o volume programado. Acompanha o consumo real — bom para consumo variável.' },
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Qual escolher?',
      html: 'A escolha entre tempo e volume depende do <strong>perfil de consumo</strong> e do <strong>tipo de sistema</strong> — é decisão de projeto. Não existe "sempre volume" nem "sempre tempo".' },

    { tipo: 'titulo', texto: 'Os ciclos que a válvula executa' },
    { tipo: 'texto', html: 'Abaixo os ciclos possíveis. Nem todo sistema usa todos: filtros simples de leito não têm regeneração com sal; isso é só de abrandadores/resina. Cada ciclo é <strong>direção de fluxo + duração</strong>. As durações são parâmetro técnico — ver o bloco de pendência no fim.' },
    { tipo: 'cards', itens: [
      { icon: '🚰', titulo: 'Serviço (filtração)', html: 'Modo normal: a água entra, atravessa a mídia e sai tratada para a casa. É onde o sistema passa a maior parte do tempo.' },
      { icon: '🔃', titulo: 'Retrolavagem (backwash)', html: 'Inverte o fluxo (de baixo para cima) para expandir o leito, soltar sujeira retida e jogá-la no dreno.' },
      { icon: '💧', titulo: 'Enxágue (rinse / fast rinse)', html: 'Assenta a mídia de volta e "lava" o leito antes de retornar ao serviço, para não mandar sujeira/residual para a torneira.' },
      { icon: '🧂', titulo: 'Regeneração (só com resina)', html: 'Em abrandadores: a salmoura passa pela resina e recupera sua capacidade de troca. Não existe em filtro de leito comum.' },
      { icon: '🌀', titulo: 'Aspiração de salmoura (brine draw)', html: 'A válvula "puxa" a salmoura do tanque de sal para dentro da resina, via injetor. Etapa da regeneração.' },
      { icon: '🪣', titulo: 'Enchimento do tanque de sal (refill)', html: 'Repõe água no tanque de sal para preparar a salmoura do próximo ciclo. Também só em sistemas com sal.' },
    ]},

    { tipo: 'callout', variante: 'perigo', titulo: 'IMPORTANTE — não misturar filtro com abrandador',
      html: 'Válvula/ciclo de <strong>filtro</strong> (leito só filtrante) é diferente de válvula/ciclo de <strong>abrandador</strong> (resina + sal). Filtro <strong>não</strong> tem regeneração, salmoura, injetor de sal nem tanque de sal. Programar uma como se fosse a outra — ou usar cabeçote errado — faz o sistema não tratar, desperdiçar água/sal, ou nem funcionar. Confirme sempre qual é qual antes de programar.' },

    { tipo: 'titulo', texto: 'As portas e componentes do cabeçote (diagrama em texto)' },
    { tipo: 'texto', html: 'Imagine a válvula vista de cima, com bocais em volta. Cada bocal/elemento tem uma função. Guarde os nomes — eles aparecem no diagnóstico:' },
    { tipo: 'cards', itens: [
      { icon: '↪️', titulo: 'Entrada (inlet)', html: 'Recebe a água bruta da bomba/rede e a direciona para o tanque.' },
      { icon: '↩️', titulo: 'Saída (outlet)', html: 'Devolve a água tratada para a casa (vinda pelo tubo central do tanque).' },
      { icon: '🔀', titulo: 'Bypass', html: 'Desvia a água por fora do tanque para manutenção sem cortar a água da casa. Cuidado: em bypass, a água NÃO está sendo tratada.' },
      { icon: '🕳️', titulo: 'Dreno (drain)', html: 'Saída da água suja da retrolavagem/enxágue. Precisa de destino adequado e sem contrapressão excessiva.' },
      { icon: '💨', titulo: 'Injetor (venturi)', html: 'Cria sucção para aspirar a salmoura (sistemas com sal). Sensível a entupimento e a pressão baixa.' },
      { icon: '🎚️', titulo: 'Restritor de fluxo (DLFC/drain line flow control)', html: 'Peça calibrada que fixa a vazão do dreno na retrolavagem, casada com o leito. Trocar por uma errada descontrola a lavagem.' },
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Linha de salmoura e BLFC',
      html: 'Em abrandadores há ainda a <strong>linha de salmoura</strong> (liga a válvula ao tanque de sal) e um controlador de vazão de enchimento (BLFC). São peças do universo "resina + sal" — não existem em filtro de leito simples.' },

    { tipo: 'titulo', texto: 'Programação: o que a válvula precisa saber' },
    { tipo: 'texto', html: 'Numa válvula automática, o instalador informa parâmetros como <strong>relógio/hora atual</strong>, o critério (tempo ou volume), quando e por quanto tempo cada ciclo roda. O <strong>relógio certo importa</strong>: se a regeneração está marcada para a madrugada e o relógio está errado, ela pode disparar no meio do dia, deixando a casa sem água tratada na hora do uso.' },
    { tipo: 'checklist', itens: [
      'Relógio / hora atual ajustado corretamente.',
      'Critério definido: por tempo ou por volume.',
      'Ciclos e durações conforme a mídia e o tanque (fonte técnica, não de cabeça).',
      'Confirmar se é cabeçote de FILTRO ou de ABRANDADOR antes de programar.',
      'Testar um ciclo e conferir dreno, retorno ao serviço e água tratada na saída.',
    ]},
    { tipo: 'pendente', html: 'Valores de programação — durações de retrolavagem/enxágue/regeneração, horário, frequência, volume por ciclo, quantidade de sal, tamanho de injetor/restritor — são <strong>específicos</strong> de cada mídia, tanque e água. Só podem ser definidos a partir de fonte técnica cadastrada pela Tudo de Filtro. NÃO estimar, NÃO copiar de outro equipamento.' },

    { tipo: 'titulo', texto: 'Comportamento em falta de energia' },
    { tipo: 'texto', html: 'Nas válvulas automáticas por tempo, uma queda de energia pode <strong>desacertar o relógio</strong>. Muitos modelos guardam a programação (os tempos de ciclo), mas o horário pode "andar" ou zerar, fazendo os ciclos dispararem na hora errada depois. Após queda de energia, vale conferir e reajustar o relógio.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'O que checar depois de faltar luz',
      html: 'Se o cliente reclama de "água sem tratar em certas horas" ou "sistema lavando de dia", suspeite de <strong>relógio desacertado</strong> após queda de energia. Confirme o comportamento de backup do modelo específico na ficha técnica — não generalize.' },
    { tipo: 'pendente', html: 'O tempo de retenção de programação/relógio na falta de energia varia por modelo Runxin. Confirmar na documentação técnica do cabeçote específico cadastrada pela Tudo de Filtro.' },

    { tipo: 'titulo', texto: 'Riscos de programação incorreta' },
    { tipo: 'dodont',
      fazer: [
        'Confirmar se é cabeçote de filtro ou de abrandador ANTES de tocar na programação.',
        'Puxar os tempos/critérios de fonte técnica cadastrada e testar um ciclo completo.',
        'Ajustar o relógio e checar o comportamento após qualquer queda de energia.',
      ],
      evitar: [
        'Chutar minutos de ciclo, horário, volume ou quantidade de sal de cabeça.',
        'Aplicar programação de abrandador num filtro (ou vice-versa).',
        'Deixar em bypass achando que a água está sendo tratada.',
      ]
    },
    { tipo: 'texto', html: 'Programação errada não é "detalhe": pode significar água <strong>sem tratamento</strong> na hora de uso, mídia que <strong>satura</strong> por falta de retrolavagem, ou <strong>desperdício</strong> de água e sal. Quando houver dúvida sobre parâmetro, é caso de especialista.' },

    { tipo: 'especialista', nome: 'válvulas Runxin', icon: '🧑‍🔧',
      html: 'Sou o especialista de cabeçote. Quando a conversa vira "qual válvula, por tempo ou por volume, quantos minutos de retrolavagem, qual injetor/restritor, como configurar a regeneração" — é comigo, cruzando com a mídia e o tanque. Se o cliente relata ciclo na hora errada, água sem tratar ou consumo estranho de sal, me acione antes de mexer na programação.' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual a diferença central entre uma Runxin "por tempo" e uma "por volume"?',
      opcoes: [
        'Nenhuma, mudam só o preço.',
        'A por tempo dispara os ciclos em intervalo fixo; a por volume conta a água tratada por um medidor e dispara ao atingir o volume programado, acompanhando o consumo real.',
        'A por volume só serve para abrandador.',
      ],
      correta: 1,
      explicacao: 'Tempo = intervalo fixo (ignora consumo). Volume = medidor conta a água e dispara pelo uso real. A escolha é de projeto.'
    },
    {
      pergunta: 'Por que NÃO se pode aplicar a programação/cabeçote de um abrandador num filtro de leito comum?',
      opcoes: [
        'Porque o filtro é maior.',
        'Porque filtro de leito não tem regeneração, salmoura, injetor de sal nem tanque de sal — usar ciclos de abrandador faz o sistema não tratar, desperdiçar ou não funcionar.',
        'Porque muda só a cor da válvula.',
      ],
      correta: 1,
      explicacao: 'Filtro e abrandador têm ciclos e componentes diferentes. Misturar os dois é fonte clássica de defeito. Confirmar qual é qual antes de programar.'
    },
    {
      pergunta: 'O cliente diz que, depois de faltar luz, o sistema "lava no meio do dia" e a água sai sem tratar em certos horários. Primeira hipótese?',
      opcoes: [
        'A mídia acabou e precisa trocar tudo.',
        'O relógio da válvula desacertou na queda de energia e os ciclos estão disparando na hora errada — checar/reajustar o horário e confirmar o backup do modelo.',
        'O tanque está furado.',
      ],
      correta: 1,
      explicacao: 'Queda de energia pode desacertar o relógio das automáticas por tempo, disparando ciclos na hora errada. Reajustar e confirmar o comportamento do modelo específico.'
    },
  ],

  exercicio: {
    enunciado: 'Explique, em 3–4 frases e sem jargão pesado, para um cliente com filtro de poço automático: (a) o que a válvula faz, (b) por que ela precisa "parar de servir água" de vez em quando (retrolavagem/enxágue), e (c) por que você não vai chutar os minutos de cada ciclo e sim usar o parâmetro técnico do equipamento.',
    dica: 'Ancore em "válvula = cérebro que direciona o fluxo" e "programar de cabeça é a origem dos defeitos".'
  },

  resumo: 'A válvula Runxin é o cérebro do tanque: direciona a água entre serviço (filtração) e os ciclos de manutenção (retrolavagem, enxágue e — só com resina — regeneração, aspiração de salmoura e enchimento do tanque de sal). Pode ser manual ou automática, e a automática dispara por tempo ou por volume. Entradas, saída, bypass, dreno, injetor e restritor de fluxo têm cada um sua função no diagnóstico. Programação exige relógio certo e parâmetros da fonte técnica; queda de energia pode desacertar o relógio. NÃO misturar ciclo/cabeçote de filtro com o de abrandador. Todo valor específico de programação é pendente — quando surgir dúvida de parâmetro, chame o especialista de válvulas Runxin.'
};
