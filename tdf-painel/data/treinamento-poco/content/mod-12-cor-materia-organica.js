// ============================================================================
// MÓDULO 12 — Cor aparente e matéria orgânica
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js
// REGRA: NÃO inventar valores/dosagens/vazões/remoções garantidas. Onde faltar
// base oficial ou dimensionamento, usar bloco `pendente`. Limites vêm de
// data/treinamento-poco/parametros-agua.js (Portaria GM/MS nº 888/2021).
// ============================================================================

module.exports = {
  resumoCurto: 'Cor não é a mesma coisa que turbidez — e tratar a aparência sem descobrir a causa é o erro mais comum. Aqui você aprende as origens possíveis da cor e por que o laudo vem antes do equipamento.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-12-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'A cor é um sintoma, não um diagnóstico',
      html: 'Água amarelada, amarronzada ou esverdeada indica que <strong>algo está fora do padrão</strong> — mas não diz o quê. A mesma cor pode vir de ferro, manganês, matéria orgânica natural, taninos ou partículas em suspensão, e <strong>cada causa pede um tratamento diferente</strong>. Nunca prometa "deixar a água cristalina" sem identificar a causa por análise.' },

    { tipo: 'titulo', texto: 'Cor não é turbidez' },
    { tipo: 'texto', html: 'São dois parâmetros físicos distintos e é comum confundir. <strong>Turbidez</strong> é a água "embaçada" por partículas em suspensão que espalham a luz. <strong>Cor</strong> é a tonalidade, que pode existir mesmo em água limpa e sem partículas visíveis, quando há substâncias dissolvidas.' },
    { tipo: 'tabela',
      head: ['Parâmetro', 'O que é', 'Causa típica'],
      rows: [
        ['Turbidez', 'Aspecto embaçado/leitoso por material em suspensão', 'Partículas, argila, sedimentos, precipitados'],
        ['Cor aparente', 'Tonalidade medida na água sem filtrar (inclui partículas)', 'Partículas coloridas + substâncias dissolvidas'],
        ['Cor verdadeira', 'Tonalidade medida após remover partículas (só o dissolvido)', 'Substâncias dissolvidas, como matéria orgânica'],
      ]
    },
    { tipo: 'callout', variante: 'info', titulo: 'Por que o laudo separa "aparente" e "verdadeira"',
      html: 'Se a cor <strong>some ao filtrar</strong> a amostra, ela vinha de partículas (cor aparente). Se <strong>permanece</strong> mesmo sem partículas, vem de algo dissolvido (cor verdadeira). Essa distinção do laudo é uma das primeiras pistas sobre a causa — e sobre qual caminho de tratamento faz sentido investigar.' },

    { tipo: 'titulo', texto: 'Causas possíveis da cor' },
    { tipo: 'cards', itens: [
      { icon: '🟠', titulo: 'Ferro', html: 'Pode dar tons amarelados/amarronzados, muitas vezes aparecendo depois que a água entra em contato com o ar. É uma <strong>hipótese</strong> comum em poço — confirmar sempre no laudo.' },
      { icon: '🟤', titulo: 'Manganês', html: 'Pode contribuir com tons escuros/amarronzados e manchas. Costuma andar junto com ferro, mas nem sempre — cada um tem comportamento próprio.' },
      { icon: '🍂', titulo: 'Matéria orgânica natural', html: 'Substâncias de origem vegetal/solo que dissolvem na água e dão cor. Não são "sujeira visível", e sim material dissolvido.' },
      { icon: '🌱', titulo: 'Taninos e substâncias húmicas', html: 'Compostos orgânicos naturais (folhas, raízes, solo) que podem dar cor amarelada/chá. Tendem a ser cor verdadeira (dissolvida).' },
      { icon: '💧', titulo: 'Compostos dissolvidos', html: 'Outras substâncias dissolvidas podem alterar a tonalidade sem deixar a água turva.' },
      { icon: '🌫️', titulo: 'Partículas em suspensão', html: 'Material particulado colorido pode gerar cor aparente — nesse caso a cor tende a sumir ao filtrar a amostra.' },
    ]},
    { tipo: 'texto', html: 'Repare que várias causas <strong>coexistem</strong> no mesmo poço. Por isso a leitura correta do laudo (cor aparente vs. verdadeira, ferro, manganês, matéria orgânica) é o que orienta a hipótese — nunca a foto do copo.' },

    { tipo: 'titulo', texto: 'Por que identificar a causa ANTES de tratar' },
    { tipo: 'dodont',
      fazer: [
        'Pedir análise que separe cor aparente de cor verdadeira e inclua ferro, manganês e matéria orgânica.',
        'Investigar a origem (contato com ar, sazonalidade, entorno do poço) junto com o laudo.',
        'Explicar ao cliente que o tratamento depende do que o laudo mostrar.',
      ],
      evitar: [
        'Escolher equipamento pela cor do copo ou por foto.',
        'Assumir que "água amarela = ferro" sem confirmar no laudo.',
        'Prometer "água cristalina" ou remoção garantida antes do diagnóstico.',
      ]
    },

    { tipo: 'titulo', texto: 'Caminhos de tratamento — quando cada um se aplica' },
    { tipo: 'texto', html: 'Os caminhos abaixo são <strong>conceituais e condicionais</strong>: só fazem sentido depois que o laudo aponta a causa. Nenhum deles é solução universal, e a combinação e o dimensionamento saem do diagnóstico técnico.' },
    { tipo: 'cards', itens: [
      { icon: '⚗️', titulo: 'Coagulação / floculação', html: 'Pode ajudar quando há partículas finas/coloides difíceis de filtrar direto, agregando-os para depois separar. Exige dosagem controlada, ajuste e operação — não é "ligar e esquecer". Aplicável só em cenários específicos.' },
      { icon: '💨', titulo: 'Oxidação', html: 'Pode ser usada quando a causa está ligada a formas que precisam ser oxidadas antes de filtrar (ex.: certos casos de ferro/manganês). Requer controle e etapa de filtração depois. Depende do laudo.' },
      { icon: '🪨', titulo: 'Filtração', html: 'Remove material particulado / precipitado. Trata a parte em suspensão, mas <strong>não</strong> resolve, sozinha, cor verdadeira dissolvida.' },
      { icon: '⚫', titulo: 'Carvão ativado', html: 'Pode atuar sobre parte da matéria orgânica dissolvida e alguns compostos, dependendo do tipo e da condição. Tem <strong>limitações</strong>, satura e precisa de manutenção/troca. Não trata tudo.' },
      { icon: '🧪', titulo: 'Resinas específicas', html: 'Existem resinas voltadas a certos alvos (ex.: alguns tipos de matéria orgânica/taninos). São seletivas ao que foram feitas, exigem regeneração/manutenção e não servem para qualquer causa.' },
      { icon: '🧫', titulo: 'Membranas', html: 'Podem reter material dissolvido/partículas conforme a faixa da membrana. Envolvem pré-tratamento, rejeito e manutenção. Escolha e viabilidade dependem do laudo e da hidráulica.' },
    ]},

    { tipo: 'callout', variante: 'alerta', titulo: 'O risco de tratar só a aparência',
      html: 'Deixar a água <strong>visualmente limpa</strong> não garante que o problema de fundo foi resolvido. Uma etapa que clareia a cor pode não tratar o contaminante real, pode saturar rápido se mal dimensionada, ou pode mascarar um parâmetro que continua fora do padrão. Aparência corrigida ≠ água tratada.' },

    { tipo: 'especialista', nome: 'análises', icon: '🧑‍🔬',
      html: 'Quando o cliente falar da cor, minha primeira pergunta é sempre a mesma: a cor some quando a amostra é filtrada? Isso já separa "partícula" de "dissolvido". Mas a resposta oficial vem do laudo — e é ele que decide o caminho, não o meu palpite.' },

    { tipo: 'pendente',
      html: 'Qualquer <strong>dimensionamento, escolha de tecnologia específica, dosagem, mídia, tipo de resina/membrana ou produto</strong> para tratar cor/matéria orgânica depende de análise laboratorial + diagnóstico hidráulico e é <strong>pendente de validação técnica pela Tudo de Filtro</strong>. Não informar percentuais de remoção nem "solução definitiva".' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'No laudo, a cor aparente é alta mas a cor verdadeira é baixa. O que isso sugere?',
      opcoes: [
        'A cor vem principalmente de substâncias dissolvidas, como taninos.',
        'A cor vem principalmente de partículas em suspensão, que somem ao filtrar a amostra.',
        'A água está potável e não precisa de nada.',
      ],
      correta: 1,
      explicacao: 'Cor aparente alta e verdadeira baixa indica que a tonalidade some ao remover as partículas — ou seja, é material em suspensão, não dissolvido. Isso muda o caminho de tratamento a investigar.'
    },
    {
      pergunta: 'Cliente manda foto de água amarelada e pede "o filtro que tira ferro". Melhor conduta?',
      opcoes: [
        'Confirmar: amarelo é ferro, então vende o filtro de ferro.',
        'Explicar que amarelo pode vir de ferro, manganês, matéria orgânica ou taninos, e que só o laudo (com cor aparente/verdadeira, ferro e manganês) define a causa e o tratamento.',
        'Oferecer o maior equipamento para garantir.',
      ],
      correta: 1,
      explicacao: 'A cor é um sintoma com várias causas possíveis. Assumir "amarelo = ferro" sem laudo é o erro clássico de tratar a aparência.'
    },
    {
      pergunta: 'Por que "deixar a água cristalina" não pode ser prometido como resultado do tratamento?',
      opcoes: [
        'Porque encarece a proposta.',
        'Porque corrigir a aparência não garante ter tratado o contaminante real, e remoção depende de causa, tecnologia compatível e dimensionamento validados.',
        'Porque o cliente não liga para a aparência.',
      ],
      correta: 1,
      explicacao: 'Aparência corrigida não é sinônimo de água tratada. Prometer resultado visual sem diagnóstico mascara o problema de fundo.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente descreve água que "sai limpa da torneira e vai ficando amarelada no balde depois de um tempo". Escreva, em 3–4 frases, quais informações do laudo você pediria (sem citar valores) e por que ainda não dá para dizer qual tecnologia usar.',
    dica: 'Ancore em cor aparente vs. verdadeira, ferro/manganês que reagem com o ar, e "a causa vem antes do equipamento".'
  },

  resumo: 'Cor e turbidez são parâmetros diferentes; cor pode vir de ferro, manganês, matéria orgânica natural, taninos, compostos dissolvidos ou partículas. A distinção cor aparente vs. verdadeira é a primeira pista, mas a causa só sai do laudo. Coagulação, oxidação, filtração, carvão, resinas e membranas são caminhos conceituais e condicionais — nenhum resolve tudo. Tratar só a aparência mascara o problema. Todo dimensionamento é pendente de validação técnica da TDF.'
};
