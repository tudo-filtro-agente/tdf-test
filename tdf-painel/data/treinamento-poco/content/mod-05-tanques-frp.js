// ============================================================================
// MÓDULO 5 — Tanques em fibra de vidro / FRP  (academia de Poço)
// Segue o CONTRATO DE SCHEMA definido em content/mod-01-fundamentos.js.
// Blocos: texto | titulo | callout | card | cards | script | dodont |
//         checklist | tabela | perguntas | exemplo | pendente | especialista
//
// REGRA CRÍTICA: NÃO inventar valores (vazões, tamanhos, tempos, volumes,
// pressões, vida útil "garantida"). Toda especificidade numérica → `pendente`.
// Ensinar conceito, função, limitação, operação e QUANDO chamar o especialista.
// ============================================================================

module.exports = {
  resumoCurto: 'O que é um tanque FRP por dentro e por fora, para que serve cada componente — e por que o tamanho do tanque, sozinho, NÃO define a capacidade do sistema.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-05-tanques-frp-video' },

  blocos: [
    { tipo: 'callout', variante: 'alerta', titulo: 'Leia antes de qualquer número',
      html: 'Neste módulo você aprende <strong>o que cada peça do tanque faz</strong>. O que você <strong>não</strong> vai encontrar aqui são vazões, litros, polegadas ou "capacidade" prontos: esses valores dependem da mídia, do fabricante, da profundidade do leito, da qualidade da água e da hidráulica de cada caso. Sempre que precisar de um número absoluto, ele vem de <strong>fonte técnica cadastrada</strong> pela Tudo de Filtro — nunca de estimativa.' },

    { tipo: 'titulo', texto: 'O que é um tanque FRP' },
    { tipo: 'texto', html: 'FRP (<em>Fiberglass Reinforced Plastic</em>) é um vaso de pressão feito de resina reforçada com fibra de vidro. Ele é o <strong>corpo</strong> que abriga a mídia filtrante (o material que realmente trata a água). O tanque não trata nada sozinho — ele contém, distribui o fluxo e resiste à pressão. Quem faz o tratamento é a <strong>mídia lá dentro</strong>, escolhida a partir do diagnóstico.' },
    { tipo: 'cards', itens: [
      { icon: '🧱', titulo: 'Estrutura interna (liner)', html: 'Camada plástica em contato com a água, que dá estanqueidade e resistência química ao vaso.' },
      { icon: '🧵', titulo: 'Estrutura externa (fibra)', html: 'Enrolamento de fibra de vidro com resina que dá a resistência mecânica à pressão de trabalho.' },
      { icon: '🔩', titulo: 'Roscas / conexões', html: 'Bocal superior (onde entra a válvula/cabeçote) e, em muitos modelos, base para apoio.' },
    ]},

    { tipo: 'titulo', texto: 'Por dentro: o caminho da água' },
    { tipo: 'texto', html: 'O que faz o tanque "funcionar" é o conjunto de distribuição interna. Ele garante que a água atravesse a mídia de forma uniforme, sem abrir "canais preferenciais" que deixariam parte do leito sem trabalhar.' },
    { tipo: 'cards', itens: [
      { icon: '⬇️', titulo: 'Distribuidor superior', html: 'Espalha a água que entra por cima, evitando jato concentrado que revolveria a mídia de forma desigual.' },
      { icon: '🪈', titulo: 'Tubo central (riser)', html: 'Tubo que desce até o fundo e conduz a água tratada de volta para a saída no topo.' },
      { icon: '⬆️', titulo: 'Distribuidor inferior', html: 'No fundo, coleta a água já filtrada de maneira uniforme por todo o leito.' },
      { icon: '🕸️', titulo: 'Crepinas / bico coletor', html: 'Ranhuras/telas finas que deixam passar a água e retêm a mídia, para ela não escapar para a tubulação.' },
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Entrada e saída',
      html: 'A água <strong>entra</strong> pelo topo, desce atravessando a mídia, é coletada no fundo pelo distribuidor inferior e <strong>sobe pelo tubo central</strong> até a saída. Na retrolavagem, esse caminho se inverte. Entender esse fluxo é o que permite diagnosticar problema de canalização, mídia escapando ou distribuição ruim.' },

    { tipo: 'titulo', texto: 'Volume de mídia e espaço livre' },
    { tipo: 'texto', html: 'O tanque <strong>não é enchido até a boca</strong>. Uma parte do volume é preenchida com a mídia (às vezes sobre uma camada de suporte, como cascalho/underbedding) e outra parte fica como <strong>espaço livre (freeboard)</strong>, reservado para a mídia <strong>expandir durante a retrolavagem</strong>. Sem esse espaço, a retrolavagem empurra mídia para fora pelo dreno.' },
    { tipo: 'callout', variante: 'perigo', titulo: 'O erro que arruína o sistema',
      html: 'Encher o tanque com mídia demais elimina o espaço de expansão: a retrolavagem <strong>joga a mídia no dreno</strong>, o leito perde volume e a filtragem cai. Volume de mídia x espaço livre é <strong>projeto</strong>, não "quanto couber".' },
    { tipo: 'pendente', html: 'A proporção exata de mídia, camada de suporte e freeboard (em % ou litros por tamanho de tanque) depende da mídia específica e da orientação do fabricante. Esses valores só entram na proposta a partir de <strong>fonte técnica cadastrada</strong> pela Tudo de Filtro.' },

    { tipo: 'titulo', texto: 'Pressão de trabalho' },
    { tipo: 'texto', html: 'Todo tanque FRP tem uma <strong>faixa de pressão de trabalho</strong> e uma pressão máxima que não deve ser ultrapassada, além de faixa de temperatura. Poços com bomba potente, sistemas com pressurizador ou golpe de aríete podem expor o tanque a picos. Trabalhar acima da especificação é risco de segurança, não só de desempenho.' },
    { tipo: 'pendente', html: 'Os valores de pressão e temperatura de trabalho/máximas são específicos de cada modelo e fabricante. Confirmar na ficha técnica do tanque cadastrada pela Tudo de Filtro antes de dimensionar bomba, pressurizador ou instalar.' },

    { tipo: 'titulo', texto: 'Vazão de serviço x vazão de retrolavagem' },
    { tipo: 'texto', html: 'São <strong>duas vazões diferentes</strong> e é comum confundi-las. A <strong>vazão de serviço</strong> é o quanto de água por hora o sistema entrega tratando bem — se você força água demais, o tempo de contato cai e o tratamento piora. A <strong>vazão de retrolavagem</strong> é a vazão (geralmente maior) necessária para expandir e limpar o leito de baixo para cima. Se o poço/bomba não entrega a vazão de retrolavagem, a mídia não limpa direito.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'A pergunta que trava proposta',
      html: 'Antes de prometer qualquer sistema com retrolavagem, é preciso saber se a <strong>bomba entrega a vazão de retrolavagem</strong> daquele leito. Um tanque "certo" com bomba fraca não retrolava — e a mídia satura. Isso é diagnóstico hidráulico, não é catálogo.' },

    { tipo: 'titulo', texto: 'Ciclo de operação (visão geral)' },
    { tipo: 'texto', html: 'Um tanque com cabeçote automático alterna entre <strong>serviço</strong> (filtrando) e <strong>manutenção do leito</strong> (retrolavagem e enxágue). A programação de quando e por quanto tempo é feita na válvula — assunto do módulo de válvulas. Aqui interessa entender que o tanque <strong>precisa</strong> desses ciclos para não saturar.' },

    { tipo: 'titulo', texto: 'Tamanhos usuais de tanque (referência educacional)' },
    { tipo: 'texto', html: 'A tabela abaixo mostra <strong>nomenclatura usual</strong> de tanques (diâmetro × altura, em polegadas). Repare que a coluna de vazão <strong>não traz número</strong>: é assim de propósito. O mesmo tanque tem capacidades diferentes conforme a mídia e a água. Use a tabela para reconhecer os tamanhos, nunca para prometer capacidade.' },
    { tipo: 'tabela',
      head: ['Tanque (pol.)', 'Porte típico de uso', 'Vazão de serviço / retrolavagem'],
      rows: [
        ['0844 (8"×44")', 'Residencial menor', 'Referência sujeita ao tipo de mídia, fabricante, profundidade do leito, qualidade da água e condição hidráulica'],
        ['0948 (9"×48")', 'Residencial', 'Referência sujeita ao tipo de mídia, fabricante, profundidade do leito, qualidade da água e condição hidráulica'],
        ['1054 (10"×54")', 'Residencial maior', 'Referência sujeita ao tipo de mídia, fabricante, profundidade do leito, qualidade da água e condição hidráulica'],
        ['1252 (12"×52")', 'Residencial grande / comercial leve', 'Referência sujeita ao tipo de mídia, fabricante, profundidade do leito, qualidade da água e condição hidráulica'],
        ['1354 (13"×54")', 'Comercial leve', 'Referência sujeita ao tipo de mídia, fabricante, profundidade do leito, qualidade da água e condição hidráulica'],
        ['1465 (14"×65")', 'Comercial', 'Referência sujeita ao tipo de mídia, fabricante, profundidade do leito, qualidade da água e condição hidráulica'],
      ]
    },
    { tipo: 'pendente', html: 'Vazões de serviço e de retrolavagem <strong>absolutas</strong> (L/h, m³/h, gpm) por tamanho de tanque só podem ser informadas a partir de fonte técnica cadastrada pela Tudo de Filtro, cruzando a mídia escolhida com a curva do fabricante. Não estimar de cabeça nem "copiar de outro projeto".' },

    { tipo: 'callout', variante: 'perigo', titulo: 'Tamanho do tanque NÃO é capacidade',
      html: 'O tamanho do tanque sozinho <strong>não</strong> define quanta água o sistema trata nem quão bem trata. Capacidade real depende da <strong>mídia</strong>, da <strong>profundidade do leito</strong>, do <strong>tempo de contato</strong>, da <strong>qualidade da água</strong> e da <strong>hidráulica disponível</strong>. "Comprei o tanque grande, então resolve" é um raciocínio errado — e perigoso de vender.' },

    { tipo: 'titulo', texto: 'Instalação e proteção' },
    { tipo: 'checklist', itens: [
      'Base nivelada e firme — tanque cheio de mídia + água é pesado.',
      'Dreno de retrolavagem com destino adequado e sem contrapressão excessiva.',
      'Bypass previsto para manutenção sem cortar a água da casa.',
      'Tubulação dimensionada para a vazão (estrangular a tubulação estrangula o sistema).',
      'Proteção contra sol e intempéries: FRP exposto ao sol/UV e ao tempo sofre com o tempo.',
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'A tubulação faz parte do projeto',
      html: 'De nada adianta o tanque "certo" se a <strong>tubulação de entrada/saída/dreno</strong> for subdimensionada: a perda de carga derruba a vazão de serviço e pode inviabilizar a retrolavagem. Dimensionamento de tubulação é parte do dimensionamento do sistema.' },

    { tipo: 'titulo', texto: 'Vida útil' },
    { tipo: 'texto', html: 'O <strong>tanque</strong> (vaso FRP) e a <strong>mídia</strong> têm durabilidades diferentes: a mídia é consumível e satura/exige troca conforme o uso e a água; o tanque dura mais, mas sofre com pressão fora de faixa, exposição ao sol e maus-tratos. Não existe "vida útil universal" — depende do modelo, da mídia, da água e da operação.' },
    { tipo: 'pendente', html: 'Vida útil estimada do tanque e intervalo de troca da mídia dependem do modelo, da mídia e das condições de uso. Informar só com base em fonte técnica cadastrada pela Tudo de Filtro; nunca prometer prazo fechado ("dura X anos") sem essa base.' },

    { tipo: 'especialista', nome: 'mídias filtrantes', icon: '🧑‍🔬',
      html: 'Eu sou o especialista da mídia — o que realmente trata a água dentro do tanque. Quando a conversa vira "qual mídia, quanto volume, qual vazão de serviço e de retrolavagem, quanto tempo de contato", é comigo. O tanque é o corpo; eu escolho o conteúdo a partir do laudo e da hidráulica. Me chame antes de fechar tamanho e capacidade.' },

    { tipo: 'dodont',
      fazer: [
        'Explicar que o tanque contém a mídia; quem trata é a mídia certa para aquela água.',
        'Confirmar se a hidráulica (bomba/vazão) sustenta serviço E retrolavagem antes de prometer.',
        'Levar vazões, volumes e vida útil para o especialista / fonte técnica cadastrada.',
      ],
      evitar: [
        'Dizer que "tanque maior = mais capacidade" ou que resolve sozinho.',
        'Chutar vazão de serviço/retrolavagem ou litros de mídia de cabeça.',
        'Encher o tanque de mídia sem freeboard, ou deixar FRP exposto ao sol.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente pergunta: "esse tanque de 10 polegadas dá conta da minha casa?". Qual a melhor resposta técnica?',
      opcoes: [
        'Sim, 10" é padrão residencial, resolve.',
        'O tamanho ajuda a classificar o porte, mas a capacidade real depende da mídia, do leito, do tempo de contato, da qualidade da água e da hidráulica — preciso dimensionar, não dá para responder só pelo tamanho.',
        'Melhor pegar o maior para garantir.',
      ],
      correta: 1,
      explicacao: 'Tamanho do tanque não é capacidade. Vazão de serviço e capacidade saem do conjunto mídia + hidráulica + água, via fonte técnica.'
    },
    {
      pergunta: 'Por que o tanque precisa de "espaço livre" (freeboard) e não é enchido totalmente de mídia?',
      opcoes: [
        'Para economizar mídia.',
        'Porque a mídia precisa expandir durante a retrolavagem; sem esse espaço, a mídia é empurrada para o dreno e o leito se perde.',
        'Porque o tanque pode estourar se estiver cheio.',
      ],
      correta: 1,
      explicacao: 'O freeboard reserva volume para a expansão do leito na retrolavagem. Mídia demais elimina esse espaço e joga mídia no dreno.'
    },
    {
      pergunta: 'A bomba do poço entrega pouca vazão. Qual risco isso traz para um filtro com retrolavagem?',
      opcoes: [
        'Nenhum, a retrolavagem independe da bomba.',
        'A bomba pode não atingir a vazão de retrolavagem necessária para expandir e limpar o leito, fazendo a mídia saturar mesmo com o tanque "certo".',
        'Só afeta a pressão da torneira.',
      ],
      correta: 1,
      explicacao: 'Vazão de retrolavagem costuma ser maior que a de serviço. Sem ela, a mídia não limpa e satura — é diagnóstico hidráulico, não catálogo.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente manda mensagem: "quero o tanque de fibra maior que vocês tiverem, pra resolver de vez a água do meu poço". Em 3–4 frases, responda explicando por que o tamanho do tanque sozinho não garante o resultado e o que você precisa levantar antes (mídia, hidráulica/retrolavagem, análise) — sem desmerecer o cliente.',
    dica: 'Ancore em "o tanque é o corpo, a mídia é quem trata" e "capacidade = mídia + leito + água + hidráulica".'
  },

  resumo: 'O tanque FRP é o vaso de pressão que abriga a mídia: liner interno, fibra externa, distribuidores superior e inferior, tubo central e crepinas garantem o fluxo uniforme; parte do volume é mídia e parte é espaço livre para expansão na retrolavagem. Pressão, vazão de serviço e vazão de retrolavagem têm limites, e a tubulação faz parte do projeto. O tamanho do tanque NÃO define a capacidade — quem define é a mídia + leito + qualidade da água + hidráulica. Vazões, volumes e vida útil absolutos só saem de fonte técnica cadastrada; especificidade numérica é sempre pendente. Chame o especialista de mídias filtrantes antes de fechar tamanho e capacidade.'
};
