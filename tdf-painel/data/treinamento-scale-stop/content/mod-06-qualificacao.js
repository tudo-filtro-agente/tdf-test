// ============================================================================
// MÓDULO 06 — Qualificação do cliente
// Roteiro: confirmar água dura/mancha, origem (poço/serra), onde incrusta,
// verba/porte, cidade, prazo. Bloco 'perguntas'.
// ============================================================================

module.exports = {
  resumoCurto: 'Qualificar Scale Stop = confirmar a dor certa (mancha branca/crosta = dureza), a origem da água (poço/serra), onde incrusta, o porte/verba, a cidade e o prazo. Sem esse mapa você não dimensiona o projeto nem sabe se é combo.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-qualificacao-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ Antes de qualificar, lembre',
      html: 'Scale Stop <strong>reduz a incrustação sem remover a dureza</strong>. Qualificar é confirmar que a dor é de <strong>crosta/mancha</strong> — não prometer "água mole". Se o cliente quer água mole de verdade, o caminho pode ser abrandador.' },

    { tipo: 'titulo', texto: 'O que você precisa sair sabendo' },
    { tipo: 'cards', itens: [
      { icon: '🎯', titulo: 'A dor é dureza?', html: 'Mancha branca em box/vidro/torneira, crosta em boiler/resistência. É a dor nº1 (69%). Confirme que é isso.' },
      { icon: '🗺️', titulo: 'Origem da água', html: 'Poço, estação/mina ou concessionária? Serra/interior? Água dura é típica de poço e serra.' },
      { icon: '🏠', titulo: 'Porte e verba', html: 'Casa/porte, número de pontos, se há verba. É o maior ticket da TDF — projeto, não peça.' },
      { icon: '📍', titulo: 'Cidade e prazo', html: 'Localização (logística/visita) e prazo de decisão. Ciclo médio é de ~12 dias.' },
    ]},

    { tipo: 'perguntas', titulo: 'Roteiro de qualificação', itens: [
      'Onde você vê o problema hoje? (box, vidros, torneiras, chuveiro, boiler, louça)',
      'Essa mancha branca / crosta é o que mais te incomoda?',
      'De onde vem a sua água — poço, mina/estação ou da rua (concessionária)?',
      'Você está numa região de serra / interior?',
      'É pra uma casa, sítio, condomínio? Quantos pontos/banheiros?',
      'Já fez alguma análise da água ou sabe se ela é "dura"?',
      'Seu objetivo é parar a mancha/crosta — ou você precisa da água "mole" mesmo? (define Scale Stop × abrandador)',
      'Em que cidade fica o imóvel?',
      'Você pretende resolver isso em quanto tempo?',
      'Você é quem decide a compra ou tem mais alguém envolvido?',
    ]},

    { tipo: 'especialista', nome: 'operação TDF', icon: '🧑‍🔬',
      html: 'O ICP do CRM: água dura de poço/estação, SP + serra/interior (Sto Antônio do Pinhal, Caçapava, Itupeva), maior ticket, quase sempre combo. Se as respostas baterem com esse quadro, você está diante de um lead quente de Scale Stop.' },

    { tipo: 'callout', variante: 'alerta', titulo: 'A pergunta que evita o erro clássico',
      html: '"Você quer <strong>parar a mancha/crosta</strong> ou precisa da água <strong>mole de verdade</strong>?" Essa pergunta separa Scale Stop de abrandador. Não pule — ela evita você prometer o que o Scale Stop não faz.' },

    { tipo: 'pendente', html: 'A partir da qualificação, o <strong>dimensionamento</strong> (vazão, mídia, capacidade, estágios do combo) é do <strong>especialista/análise</strong>. A qualificação levanta o cenário; a spec não sai daqui de cabeça.' },

    { tipo: 'dodont',
      fazer: [
        'Confirmar que a dor é dureza (mancha/crosta) antes de tudo.',
        'Levantar origem (poço/serra), porte, cidade, prazo e decisor.',
        'Fazer a pergunta "parar a crosta × água mole" para separar Scale Stop de abrandador.',
      ],
      evitar: [
        'Assumir que é Scale Stop sem confirmar a dor e a origem.',
        'Prometer água mole/remoção de dureza durante a qualificação.',
        'Fechar dimensionamento sem passar pelo especialista.',
      ] },
  ],

  perguntasRapidas: [
    { pergunta: 'Qual dor confirma que é caso de Scale Stop?',
      opcoes: ['Água amarela / ferro.', 'Mancha branca / crosta (dureza).', 'Água com cheiro de cloro.'],
      correta: 1, explicacao: 'Mancha branca/crosta = dureza, a dor central (69%) do Scale Stop. Ferro é caso de Iron Free/Fibra.' },
    { pergunta: 'Qual pergunta separa Scale Stop de abrandador na qualificação?',
      opcoes: ['"Você prefere inox ou plástico?"', '"Você quer parar a mancha/crosta ou precisa da água mole de verdade?"', '"Você quer parcelar?"'],
      correta: 1, explicacao: 'Parar a crosta = Scale Stop. Água mole = abrandador. Essa pergunta evita prometer o que o Scale Stop não faz.' },
    { pergunta: 'Por que levantar origem, porte, cidade e prazo?',
      opcoes: ['Só pra preencher o CRM.', 'Porque é venda de projeto/combo: definem dimensionamento, logística e ritmo do follow-up.', 'Porque o preço é fixo.'],
      correta: 1, explicacao: 'Scale Stop é projeto (maior ticket, ciclo ~12 dias). Esses dados orientam o combo, a visita e o follow-up.' },
  ],

  exercicio: {
    enunciado: 'Escreva as 5 perguntas que você faria primeiro num lead de Scale Stop, em ordem, e diga o que cada resposta te ajuda a decidir (dor, origem, produto certo, porte, prazo).',
    dica: 'Comece pela dor (mancha/crosta), depois origem (poço/serra), depois "parar crosta × água mole", porte/verba e prazo/cidade.'
  },

  resumo: 'Qualificar Scale Stop = confirmar a dor de dureza (mancha branca/crosta), a origem (poço/serra/estação), onde incrusta, o porte/verba, a cidade e o prazo, e SEMPRE perguntar "parar a crosta × água mole" para separar Scale Stop de abrandador. É venda de projeto/combo (maior ticket, ciclo ~12 dias); o dimensionamento fica com o especialista.'
};
