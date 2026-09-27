// ============================================================================
// MÓDULO 02 — Dureza e incrustação: a dor
// Dureza = cálcio + magnésio. Incrustação/crosta e "mancha branca" (dor nº1, 69%).
// Potável NÃO significa sem incrustação (dureza é organoléptica/de aceitação).
// Valores/limites (Portaria 888) -> pendente. Nada de VMP de cabeça.
// ============================================================================

module.exports = {
  resumoCurto: 'A dor do Scale Stop é a mais nítida da TDF: água dura (cálcio/magnésio) que forma crosta e mancha branca em box, vidros, torneira, louça e boiler. Mancha branca é a dor nº1 (69% das vendas). Potável não quer dizer "sem incrustação".',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-dureza-incrustacao-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ A regra que não se quebra',
      html: 'Você vende contra a <strong>incrustação/mancha</strong>. O Scale Stop <strong>reduz a crosta sem remover a dureza</strong> — não é abrandador e não deixa a água mole. Nunca prometa "remover dureza" nem "água mole".' },

    { tipo: 'titulo', texto: 'O que é dureza' },
    { tipo: 'texto', html: 'Dureza é a quantidade de <strong>cálcio (Ca²⁺) e magnésio (Mg²⁺)</strong> dissolvidos na água. Quanto mais desses minerais, mais "dura" é a água — e mais ela tende a <strong>formar crosta</strong> ao aquecer ou secar. É típica de <strong>água de poço</strong> e de regiões de <strong>serra/interior</strong>, onde a água passa por rocha calcária.' },

    { tipo: 'titulo', texto: 'Onde a incrustação aparece (a dor que o cliente vive)' },
    { tipo: 'cards', itens: [
      { icon: '🚿', titulo: 'Box e vidros', html: 'A famosa <strong>mancha branca</strong> no box, no espelho e nos vidros — não sai com pano, volta sempre. É a dor nº1.' },
      { icon: '🔥', titulo: 'Boiler e resistência', html: 'Crosta na resistência do chuveiro/aquecedor e no boiler: gasta mais energia e reduz a vida útil.' },
      { icon: '🚰', titulo: 'Torneira e metais', html: 'Crosta esbranquiçada em torneiras, chuveiros e metais; aerador entope.' },
      { icon: '🍽️', titulo: 'Louça e pedras', html: 'Mancha branca em copos, louça e pedras/bancadas; sabão e detergente rendem menos.' },
    ]},

    { tipo: 'especialista', nome: 'operação TDF', icon: '🧑‍🔬',
      html: 'No CRM, "mancha branca em vidros e pedras" (dureza) é a dor de <strong>69% das vendas de Scale Stop</strong> — a mais nítida de todas as linhas da TDF. O cliente enxerga o problema todo dia e está disposto a pagar caro pra resolver. Ancore aí.' },

    { tipo: 'titulo', texto: 'Potável NÃO significa "sem incrustação"' },
    { tipo: 'texto', html: 'A dureza é um parâmetro <strong>organoléptico / de aceitação</strong> — ligado a <strong>conforto, aparência e operação</strong>, não a risco agudo à saúde. Consequência prática: a água pode estar <strong>dentro do limite de potabilidade</strong> ("é potável") e <strong>mesmo assim incrustar tudo</strong>. Por isso não decidimos pelo "passou/não passou" na potabilidade — decidimos pela <strong>dor real</strong> do cliente.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Não confunda os dois eixos',
      html: '"Potável?" responde <strong>risco à saúde</strong>. "Incrusta / dá mancha?" responde <strong>dureza / conforto</strong>. O cliente pode estar tranquilo no primeiro e sofrendo no segundo — e é nesse segundo eixo que sua venda vive.' },

    { tipo: 'pendente', html: 'O <strong>VMP oficial da dureza</strong> e os limites da <strong>Portaria GM/MS nº 888/2021</strong> ficam no arquivo de parâmetros oficial da TDF — <strong>a confirmar na fonte oficial</strong>. Não cite valor de dureza de cabeça; puxe o número validado.' },

    { tipo: 'exemplo', titulo: 'Como o cliente descreve a dor',
      html: 'Ouça as pistas: <em>"fica uma mancha branca no box que não sai"</em>, <em>"minha torneira vive esbranquiçada"</em>, <em>"o vidro do chuveiro parece manchado"</em>, <em>"a água é de poço aqui na serra"</em>. Tudo isso é <strong>dureza/incrustação</strong> — território do Scale Stop.' },

    { tipo: 'dodont',
      fazer: [
        'Ancorar na dor visível: mancha branca, crosta no box/torneira/boiler.',
        'Explicar que potável não quer dizer "sem incrustação" (dureza é de aceitação).',
        'Confirmar a origem (poço/serra) — reforça o quadro de água dura.',
      ],
      evitar: [
        'Prometer "remover dureza" ou "água mole" (isso é abrandador).',
        'Cravar o limite/VMP de dureza de cabeça.',
        'Tratar como problema de saúde/risco — dureza é conforto/operação.',
      ] },
  ],

  perguntasRapidas: [
    { pergunta: 'O que causa a incrustação e a mancha branca?',
      opcoes: ['Excesso de cloro.', 'Dureza — cálcio e magnésio na água.', 'Ferro dissolvido.'],
      correta: 1, explicacao: 'Dureza (cálcio + magnésio) forma a crosta e a mancha branca. É a dor central do Scale Stop.' },
    { pergunta: '"Minha água é potável, então não tenho problema de incrustação." Certo?',
      opcoes: ['Certo, potável resolve tudo.', 'Errado: dureza é organoléptica/de aceitação — pode estar potável e mesmo assim incrustar.', 'Certo, se for de concessionária.'],
      correta: 1, explicacao: 'Potabilidade responde risco à saúde; dureza responde conforto/incrustação. Dá pra estar potável e ainda incrustar tudo.' },
    { pergunta: 'Cliente pergunta o valor-limite de dureza da norma. O que você faz?',
      opcoes: ['Fala um número de cabeça.', 'Puxa o VMP da fonte oficial (Portaria 888), sem inventar.', 'Diz que não existe limite.'],
      correta: 1, explicacao: 'VMP e limites vêm da fonte oficial validada, nunca de memória.' },
  ],

  exercicio: {
    enunciado: 'Um cliente de poço na serra diz "a água aqui é boa, mas fica uma mancha branca no box e nas torneiras que não sai". Explique de onde vem essa dor e por que "água boa/potável" não elimina o problema.',
    dica: 'Ligue a mancha à dureza (cálcio/magnésio) e explique que dureza é de aceitação/conforto — potável não significa sem incrustação.'
  },

  resumo: 'Dureza é cálcio + magnésio na água; quando aquece/seca, forma crosta e mancha branca em box, vidros, torneira, boiler e louça. Mancha branca é a dor nº1 do Scale Stop (69% das vendas). Dureza é parâmetro organoléptico/de aceitação: potável não quer dizer sem incrustação. Ancore na dor visível, confirme origem (poço/serra), e nunca prometa remover dureza/água mole. Limites/VMP (Portaria 888) sempre da fonte oficial.'
};
