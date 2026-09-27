// Módulo 4 — Como funciona a filtragem (água de concessionária) + a lógica do cloro na entrada.
// FATO DE PRODUTO (TDF): American Filter = SEM carvão, MANTÉM o cloro de propósito.
// Light Filter = COM carvão no elemento, TIRA o cloro. Elevar a consciência do cliente
// sobre por que nem sempre se tira o cloro logo na entrada.
// Specs (micragem, mídia, vazão, troca) -> "pendente" (ficha técnica oficial).
module.exports = {
  resumoCurto: 'A água da estação de tratamento chega clorada — e o cloro residual PROTEGE a caixa d\'água. Por isso o American Filter mantém o cloro de propósito (só filtra sedimento) e o Light Filter, com carvão, tira o cloro. Saber explicar isso eleva a consciência do cliente.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'fe-como-funciona-video' },
  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'O ponto de partida',
      html: 'A água da <strong>estação de tratamento (concessionária)</strong> chega <strong>tratada e clorada</strong>. O <strong>cloro residual</strong> não é só "gosto ruim": é ele que <strong>mantém a água protegida</strong> contra recontaminação enquanto ela fica parada na <strong>caixa d\'água</strong> e corre pela tubulação da casa.' },

    { tipo: 'titulo', texto: 'Dois mecanismos diferentes' },
    { tipo: 'cards', itens: [
      { icon: '🧱', titulo: 'Filtração física (por tamanho)', html: 'Retém partícula pelo tamanho: <strong>barro, areia, ferrugem</strong> da rede. É o que resolve a água "com sujeira/cor".' },
      { icon: '🧲', titulo: 'Carvão / adsorção', html: 'O carvão ativado <strong>adsorve o cloro</strong> (e gosto/odor). Ou seja: <strong>onde tem carvão, o cloro é retirado</strong>. Onde não tem, o cloro <strong>continua</strong> na água.' },
    ]},

    { tipo: 'titulo', texto: 'A escolha dos nossos produtos (e o porquê)' },
    { tipo: 'cards', itens: [
      { icon: '🛡️', titulo: 'American Filter — SEM carvão', html: 'Filtra <strong>sedimento</strong> (barro, ferrugem, partícula) e <strong>mantém o cloro de propósito</strong>. Instalado na entrada, ele limpa o que se vê <strong>sem tirar a proteção do cloro</strong> da casa toda e da caixa d\'água.' },
      { icon: '💧', titulo: 'Light Filter — COM carvão', html: 'Traz <strong>carvão no elemento filtrante</strong>, então <strong>reduz o cloro</strong> (gosto e cheiro). Indicado quando o cliente quer resolver também o "gosto de piscina" — assumindo o cuidado com a reservação (troca em dia, higienização da caixa).' },
    ]},
    { tipo: 'callout', variante: 'sucesso', titulo: '💡 A consciência que você eleva no cliente',
      html: 'Muita gente acha que "tirar o cloro logo na entrada" é sempre melhor. <strong>Não é.</strong> Se você tira o cloro na entrada, a água fica <strong>sem residual de proteção</strong> justamente onde ela mais fica parada — a <strong>caixa d\'água</strong> — e isso abre espaço para recontaminação e biofilme. Por isso o <strong>American Filter mantém o cloro</strong>: protege a casa toda. O descloro faz mais sentido <strong>perto do ponto de consumo</strong> (um purificador na torneira/cozinha), não na entrada. Explicar isso te posiciona como <strong>especialista</strong>, não como vendedor de filtro.' },

    { tipo: 'titulo', texto: 'Como escolher com o cliente' },
    { tipo: 'tabela',
      head: ['Se o cliente…', 'Faz sentido', 'Por quê'],
      rows: [
        ['Reclama de barro/sujeira/ferrugem e quer proteger a casa/caixa', '<strong>American Filter</strong> (sem carvão)', 'Filtra o sólido e preserva o cloro que protege a reservação'],
        ['Quer também tirar o gosto/cheiro de cloro na casa toda', '<strong>Light Filter</strong> (com carvão)', 'O carvão reduz o cloro — com o cuidado de manter a caixa higienizada e a troca em dia'],
        ['Quer água mais gostosa só para beber/cozinhar', 'Descloro no <strong>ponto de consumo</strong>', 'Mantém a proteção do cloro na casa e tira o gosto onde importa'],
      ]
    },

    { tipo: 'titulo', texto: 'Ordem e manutenção' },
    { tipo: 'texto', html: 'Onde há mais de uma etapa, o <strong>sedimento vem primeiro</strong> para proteger o restante (a sujeira grossa colmataria/entupiria o carvão). E toda mídia <strong>satura</strong>: o sedimento entope e perde vazão; o carvão esgota a adsorção (retrolavar tira partícula, mas <strong>não recarrega</strong> o carvão). Por isso existe <strong>troca periódica</strong>.' },
    { tipo: 'pendente', html: 'Micragem, tipo/volume de mídia, número de estágios, vazão de serviço e periodicidade de troca de cada modelo (American Filter, Light Filter, Filtralli) vêm da <strong>ficha técnica oficial da TDF</strong>. Explique o princípio e a lógica do cloro; confirme os números na ficha, sem cravar.' },

    { tipo: 'dodont',
      fazer: [
        'Explicar que o cloro residual PROTEGE a água na caixa d\'água.',
        'Posicionar o American Filter como "filtra o sedimento e mantém a proteção do cloro".',
        'Oferecer o Light Filter (com carvão) quando o cliente quer tirar o gosto/cheiro de cloro — com o cuidado da reservação.',
        'Sugerir descloro no ponto de consumo quando o objetivo é só a água de beber.',
      ],
      evitar: [
        'Dizer que "tirar o cloro na entrada é sempre melhor" (não é — perde o residual de proteção).',
        'Vender Light Filter/carvão sem alertar sobre manutenção da caixa e troca.',
        'Prometer potabilidade absoluta ou remoção de dureza (filtro de entrada não é abrandador).',
        'Cravar micragem/estágios sem confirmar na ficha.',
      ]
    },
    { tipo: 'especialista', nome: 'explicação simples',
      html: '"O cloro que vem da rua tem uma função: manter a água protegida até chegar na sua torneira, principalmente parada na caixa. Por isso o nosso American Filter <strong>filtra a sujeira mas mantém o cloro</strong> — protege a casa toda. Se o senhor também quer tirar o gosto de cloro, aí eu levo o Light Filter, que tem carvão; só que aí a gente cuida da caixa e da troca. E se for só pra beber mais gostoso, o ideal é o descloro na cozinha." Isso mostra que a gente pensa na água dele, não só em vender filtro.' },
  ],
  perguntasRapidas: [
    { pergunta: 'Por que o American Filter mantém o cloro de propósito?', opcoes: ['Porque carvão é caro.', 'Porque o cloro residual protege a água contra recontaminação na caixa d\'água e na tubulação — tirar na entrada removeria essa proteção.', 'Porque o cliente gosta de cloro.'], correta: 1, explicacao: 'O American filtra sedimento e mantém o cloro para preservar o residual que protege a reservação e a casa toda. É uma escolha técnica consciente.' },
    { pergunta: 'Qual produto tem carvão e reduz o cloro (gosto/cheiro)?', opcoes: ['American Filter.', 'Light Filter.', 'Nenhum dos dois.'], correta: 1, explicacao: 'O Light Filter traz carvão no elemento filtrante e reduz o cloro. O American Filter NÃO tem carvão e mantém o cloro.' },
    { pergunta: 'O cliente diz: "quero tirar o cloro logo na entrada da casa". Qual a melhor conduta consultiva?', opcoes: ['Concordar na hora, é sempre melhor.', 'Explicar que o cloro protege a caixa d\'água; oferecer American (mantém cloro) ou, se ele quer tirar o gosto, Light Filter com cuidado da caixa, ou descloro no ponto de consumo.', 'Dizer que não dá pra tirar cloro.'], correta: 1, explicacao: 'Elevar a consciência: tirar o cloro na entrada remove o residual de proteção da caixa. Há caminhos melhores conforme o objetivo do cliente.' },
  ],
  exercicio: { enunciado: 'Um cliente pede "um filtro que tire o cloro logo na entrada". Escreva como você eleva a consciência dele (papel do cloro residual na caixa) e apresenta as opções (American mantém cloro; Light Filter com carvão tira o cloro; descloro no ponto de consumo) — sem prometer potabilidade absoluta.', dica: 'Cloro residual protege a reservação; American filtra e mantém; Light tira o cloro (cuidar da caixa/troca); descloro na cozinha para a água de beber.' },
  resumo: 'A água da concessionária chega clorada e o cloro residual protege a água parada na caixa d\'água e na tubulação. Por isso o American Filter filtra sedimento e MANTÉM o cloro de propósito (protege a casa toda), enquanto o Light Filter traz carvão e TIRA o cloro (gosto/cheiro), assumindo o cuidado com a reservação. Tirar o cloro logo na entrada nem sempre é o melhor — o descloro faz mais sentido no ponto de consumo. Saber explicar isso eleva a consciência do cliente e posiciona o closer como especialista. Micragem/estágios/vazão/troca vêm da ficha técnica oficial.'
};
