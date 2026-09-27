// ICP, Personas e Jornada — Scale Stop. Dados REAIS do Zoho CRM (06/jul/2026):
// 51 vendas fechadas (win ~26,6% — amostra pequena). Nenhum número inventado.
module.exports = {
  resumoCurto: 'Quem compra Scale Stop (dados do CRM): o MAIOR ticket da TDF (R$10,7k), dor de dureza/mancha branca em 69%, venda de projeto/combo com ciclo de 12 dias.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-icp-jornada-video' },
  blocos: [
    { tipo: 'callout', variante: 'alerta', titulo: 'Amostra pequena (usar como direção)',
      html: '<strong>51 vendas fechadas</strong> (win ~26,6%). Amostra pequena — direção real, não estatística fechada. Dados do Zoho CRM.' },
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ A regra que não se quebra',
      html: 'Scale Stop <strong>reduz a incrustação sem remover a dureza</strong> — não é abrandador, não deixa a água mole. <strong>Nunca prometa "remover dureza" nem "água mole".</strong>' },
    { tipo: 'titulo', texto: 'O ICP — quem compra' },
    { tipo: 'cards', itens: [
      { icon: '💰', titulo: 'MAIOR ticket da TDF', html: 'Mediana <strong>R$10.700</strong> (p25–p75 R$8.900–12.925, máx R$52.204). Produto premium / projeto.' },
      { icon: '🗺️', titulo: 'Onde', html: 'Água dura de poço (26) / estação (21); SP + <strong>serra/interior</strong>: Sto Antônio do Pinhal, Caçapava, Itupeva.' },
      { icon: '🧩', titulo: 'Quase sempre COMBO', html: 'Raramente sozinho: Light Filter + Scale Stop Inox (11), Scale Stop + V2 (9), Scale Stop + Fibra 1500 (6).' },
    ]},
    { tipo: 'titulo', texto: 'A dor (persona) — a mais nítida de todas' },
    { tipo: 'texto', html: '<strong>"Mancha branca em vidros e pedras" (dureza) = 69%</strong> das vendas. É a dor mais nítida de todas as linhas da TDF: cliente com <strong>água dura</strong>, incrustação/mancha visível no dia a dia, disposto a <strong>pagar caro</strong> pela solução.' },
    { tipo: 'especialista', nome: 'mídias filtrantes', icon: '🧑‍🔬',
      html: 'Lembre da técnica (módulo de dureza da academia de Poço): Scale Stop é anti-incrustante sem sal (TAC) — mantém os minerais, mas evita a crosta. Se o cliente precisa de água mole de verdade, o caminho é o abrandador, não o Scale Stop.' },
    { tipo: 'titulo', texto: 'A jornada do lead' },
    { tipo: 'tabela', head: ['Sinal do CRM', 'Número real', 'O que muda pra você'], rows: [
      ['Ciclo de venda', '<strong>12 dias</strong> (mediano)', 'O mais longo: é venda de projeto/combo, precisa de análise e dimensionamento. Follow-up com valor.'],
      ['Origem', 'Google 49% + Meta 25% + Indicação 16%', 'Vem com a dor de dureza à mostra; ancore em incrustação/mancha.'],
      ['Formato', 'Quase sempre combo', 'Posicione junto de Light Filter / Fibra / Iron Free, não isolado.'],
    ]},
    { tipo: 'dodont',
      fazer: ['Ancorar na dor de incrustação/mancha branca (69% dos casos).', 'Posicionar como combo/projeto (raramente vende sozinho).', 'Follow-up com valor no ciclo de ~12 dias.'],
      evitar: ['Prometer "remover dureza" ou "água mole" (Scale Stop NÃO faz isso).', 'Vender isolado quando o caso pede combo.', 'Tratar como venda rápida (ciclo é o mais longo).'] },
  ],
  perguntasRapidas: [
    { pergunta: 'Qual a dor nº1 que traz o cliente de Scale Stop, segundo o CRM?', opcoes: ['Água amarela / ferro.', 'Mancha branca em vidros e pedras (dureza) — 69%.', 'Excesso de cloro.'], correta: 1, explicacao: 'Mancha branca/dureza é a dor de 69% das vendas — a mais nítida de todas as linhas.' },
    { pergunta: 'O que você NUNCA promete no Scale Stop?', opcoes: ['Que reduz a incrustação.', 'Que "remove a dureza" / deixa a água mole.', 'Que é anti-incrustante sem sal.'], correta: 1, explicacao: 'Scale Stop reduz incrustação SEM remover dureza. Prometer água mole é errado — isso é abrandador.' },
  ],
  exercicio: { enunciado: 'Cliente com água de poço na serra reclama de "mancha branca no box e nas torneiras" e tem verba. Como você posiciona o Scale Stop (e o que NÃO promete)?', dica: 'Ancore na incrustação/mancha (dureza), posicione como combo/projeto, e deixe claro que reduz a crosta sem deixar a água mole.' },
  resumo: 'Dados do CRM (51 vendas): Scale Stop é o maior ticket da TDF (R$10,7k), dor nítida de dureza/mancha branca (69%), cliente de água dura na serra/interior com verba, ciclo de 12 dias e quase sempre vendido como combo. Ancore na incrustação, posicione como projeto, e nunca prometa remover dureza/água mole (não é abrandador).'
};
