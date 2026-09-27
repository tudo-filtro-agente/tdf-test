// Módulo 2 — O que tem na água da concessionária. Conceitual. Limites/padrões oficiais -> "pendente".
module.exports = {
  resumoCurto: 'A água da concessionária é tratada, mas ainda pode incomodar: cloro, sedimento/barro, gosto e odor, e variação da rede. É isso que o cliente de filtro de entrada sente na prática.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'fe-agua-concessionaria-video' },
  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'Ponto de partida honesto',
      html: 'A água da rua <strong>já vem tratada</strong> pela concessionária. Nosso papel não é dizer que ela é "ruim" — é reconhecer o que <strong>incomoda o cliente no dia a dia</strong> e melhorar a experiência dele com a água em casa.' },
    { tipo: 'titulo', texto: 'O que costuma incomodar na água da rua' },
    { tipo: 'cards', itens: [
      { icon: '💧', titulo: 'Cloro', html: 'Usado no tratamento para desinfetar. Pode deixar <strong>cheiro e gosto de "piscina"</strong> — reclamação comum (excesso de cloro apareceu em dezenas de casos no CRM).' },
      { icon: '🟤', titulo: 'Sedimento / barro', html: 'Areia, barro e ferrugem que soltam da <strong>rede e da tubulação</strong>, principalmente após manutenção ou falta d\'água. "Água com barro/sujeira" é a 2ª maior dor (328 casos).' },
      { icon: '👃', titulo: 'Gosto e odor', html: 'Sabor e cheiro que fazem o cliente <strong>desconfiar</strong> ("não confio / quero melhorar" é ~54% dos casos).' },
      { icon: '📉', titulo: 'Variação da rede', html: 'A qualidade oscila: obra na rua, troca de reservatório, chuva forte. O cliente percebe a água <strong>mudar de um dia pro outro</strong>.' },
    ]},
    { tipo: 'titulo', texto: 'Por que isso acontece' },
    { tipo: 'texto', html: 'A água sai tratada da estação, mas percorre um caminho longo até a torneira: adutoras, reservatórios, a rede da rua e o encanamento do próprio imóvel. Nesse trajeto ela pode <strong>recolher sedimento</strong> da tubulação e o cliente sentir <strong>cloro residual</strong>. Por isso a mesma água "boa no papel" pode chegar com cor, gosto ou sujeira ocasional na casa dele.' },
    { tipo: 'callout', variante: 'sucesso', titulo: 'A dor é real e cotidiana',
      html: 'O cliente não está sendo exagerado. Ele vê o barro no fundo do copo, sente o cheiro de cloro no banho, nota a roupa e a louça. O filtro de entrada endereça exatamente essa <strong>experiência do dia a dia</strong>.' },
    { tipo: 'titulo', texto: 'Água amarela / ferro' },
    { tipo: 'texto', html: 'Água "amarelada" ou com ferro aparece também na concessionária (72 casos no CRM), muitas vezes ligada a <strong>ferrugem da tubulação</strong> ou sedimento da rede. Vale confirmar a origem: em filtro de entrada estamos falando de água da <strong>rua</strong> — quando é poço, a conversa é outra linha (água não tratada).' },
    { tipo: 'pendente', titulo: 'Limites e padrões oficiais',
      html: 'Valores de referência (cloro residual, turbidez, potabilidade etc.) são definidos por <strong>fonte regulatória oficial</strong> (portaria do Ministério da Saúde / normas vigentes). <strong>Não crave número de limite com o cliente</strong>: se precisar citar padrão, remeta à fonte oficial e à ficha técnica da TDF.' },
    { tipo: 'dodont',
      fazer: ['Reconhecer que a água já vem tratada e mesmo assim pode incomodar.', 'Ancorar na dor real: cloro, barro, gosto/odor, variação.', 'Confirmar a origem (concessionária) antes de recomendar filtro de entrada.'],
      evitar: ['Dizer que a água da rua é "contaminada" ou "imprópria".', 'Cravar limites/padrões de cabeça — isso é fonte regulatória.', 'Prometer que o filtro deixa a água "100% pura".'] },
  ],
  perguntasRapidas: [
    { pergunta: 'Qual costuma ser a reclamação ligada ao cheiro/gosto de "piscina"?', opcoes: ['Sedimento.', 'Cloro.', 'Dureza.'], correta: 1, explicacao: 'O cloro, usado na desinfecção, é o que deixa o gosto e o cheiro de piscina que o cliente reclama.' },
    { pergunta: 'De onde costuma vir o barro/sedimento na água da concessionária?', opcoes: ['Do próprio cliente.', 'Da rede e da tubulação, sobretudo após manutenção/falta d\'água.', 'Sempre de poço.'], correta: 1, explicacao: 'Sedimento e ferrugem soltam da rede e do encanamento no caminho até a torneira, principalmente após manutenção.' },
    { pergunta: 'Pode citar um limite oficial de cloro de cabeça para o cliente?', opcoes: ['Sim, é bom mostrar domínio.', 'Não — valores oficiais vêm de fonte regulatória; remeta à fonte.', 'Só se for número redondo.'], correta: 1, explicacao: 'Padrões e limites são definidos por norma regulatória. Não improvise número: remeta à fonte oficial e à ficha técnica.' },
  ],
  exercicio: { enunciado: 'O cliente diz "mas a água já vem tratada da SABESP, pra que filtrar?". Como você valida a fala dele e ainda assim mostra o valor?', dica: 'Concorde que já vem tratada, e traga o que ele sente no dia a dia: cloro no banho, barro ocasional, gosto, variação da rede. A dor é a experiência, não a legalidade da água.' },
  resumo: 'A água da concessionária é tratada, mas ainda pode chegar com cloro (gosto/cheiro), sedimento/barro da rede, gosto/odor e variação de qualidade. Essas são as dores reais do cliente de filtro de entrada. Reconheça que a água já vem tratada, ancore na experiência do dia a dia e nunca crave limites oficiais de cabeça — isso é fonte regulatória.'
};
