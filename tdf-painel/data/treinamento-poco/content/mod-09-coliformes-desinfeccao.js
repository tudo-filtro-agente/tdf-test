// ============================================================================
// MÓDULO 9 — Coliformes e desinfecção  (academia de Poço — CONTRATO DE SCHEMA)
// REGRA: NÃO inventar dosagem de cloro, tempo de contato, residual ou "garantia
//   de desinfecção". Onde precisa de cálculo/valor, usar bloco `pendente`.
// ============================================================================

module.exports = {
  resumoCurto: 'Coliformes indicam risco microbiológico; E. coli aponta contaminação fecal. Filtro mecânico não desinfeta. Cloração e UV têm processo e limitações — dosagem depende de análise, nunca do volume da caixa.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-09-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'Desinfecção não se promete no olho',
      html: 'Presença de coliformes é sinal de risco microbiológico e <strong>exige tratamento e nova análise</strong> para confirmar. Nunca diga que a água "está desinfetada" porque passou por um filtro, nem defina dosagem de cloro de cabeça. Filtro mecânico retém partícula — <strong>não garante desinfecção</strong>.' },

    { tipo: 'titulo', texto: 'Coliformes totais x Escherichia coli' },
    { tipo: 'texto', html: 'No laudo microbiológico, dois resultados costumam aparecer juntos e significam coisas diferentes:' },
    { tipo: 'cards', itens: [
      { icon: '🦠', titulo: 'Coliformes totais', html: 'Grupo amplo de bactérias. Sua presença é um <strong>indicador de risco / integridade</strong>: algo pode ter aberto caminho para contaminação.' },
      { icon: '🚽', titulo: 'Escherichia coli (E. coli)', html: 'Indicador mais específico de <strong>contaminação de origem fecal</strong>. Presença é sinal de alerta sanitário.' },
      { icon: '🔎', titulo: 'O que pode indicar', html: 'Infiltração, vedação/estrutura do poço comprometida, proximidade de fossa, contaminação do entorno.' },
      { icon: '🧪', titulo: 'Resposta = análise', html: 'A leitura é presença/ausência em 100 mL (ver parametros-agua.js). Quem confirma é o laboratório.' },
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Indicador, não diagnóstico completo',
      html: 'Coliformes/E. coli sinalizam que há risco microbiológico. O que exatamente está entrando, por onde e o quanto — isso o laudo e a inspeção ajudam a investigar. O papel do closer é levar a sério e conduzir para tratamento + reanálise, não minimizar.' },

    { tipo: 'titulo', texto: 'Por que filtro mecânico não desinfeta' },
    { tipo: 'texto', html: 'Filtro de sedimentos e afins <strong>retêm partícula</strong> (areia, barro, matéria em suspensão). Microrganismos são muito pequenos e/ou passam com a água. Reduzir turbidez ajuda o processo de desinfecção, mas <strong>reter partícula não é desinfetar</strong>. Desinfecção é uma etapa própria.' },

    { tipo: 'titulo', texto: 'Cloração — o processo (sem números de cabeça)' },
    { tipo: 'texto', html: 'A cloração é uma forma clássica de desinfecção química. O conceito envolve alguns elementos que trabalham juntos:' },
    { tipo: 'tabela',
      head: ['Elemento', 'O que significa'],
      rows: [
        ['Dosagem', 'Quanto de produto é aplicado — resultado de cálculo, não valor fixo.'],
        ['Demanda de cloro', 'Parte do cloro é consumida ao reagir com substâncias da água antes de sobrar residual.'],
        ['Tempo de contato', 'A água precisa ficar em contato com o cloro por um período para a desinfecção ocorrer.'],
        ['Cloro residual', 'O cloro que "sobra" e segue protegendo a água depois do contato.'],
        ['Tanque de contato', 'Reservatório que garante o tempo de contato antes do consumo/distribuição.'],
      ]
    },
    { tipo: 'callout', variante: 'alerta', titulo: 'CRÍTICO — não dosar cloro "pelo tamanho da caixa"',
      html: 'A dosagem de cloro <strong>NÃO</strong> se define só pelo volume do reservatório. Ela depende de <strong>demanda de cloro, concentração do produto usado, vazão, tempo de contato e residual desejado</strong>. Chutar dose pela caixa d\'água é erro técnico e risco sanitário. Isso é cálculo do especialista + validação por análise.' },
    { tipo: 'pendente', html: 'Qualquer <strong>dosagem de cloro</strong>, <strong>tempo de contato mínimo</strong> e <strong>cloro residual alvo</strong> dependem de análise + cálculo do especialista e validação por nova análise. Não informar valores de cabeça.' },

    { tipo: 'titulo', texto: 'Proteger a rede depois do tratamento' },
    { tipo: 'texto', html: 'Desinfetar uma vez não basta se a água voltar a ser contaminada na reservação/distribuição. Por isso a lógica de <strong>manter uma proteção residual</strong> ao longo da rede — para que o sistema não fique desprotegido entre o tratamento e a torneira. (Este é o tema aprofundado no Módulo 10.)' },

    { tipo: 'titulo', texto: 'UV — desinfecção física e suas limitações' },
    { tipo: 'texto', html: 'A radiação <strong>ultravioleta (UV)</strong> é uma forma física de desinfecção: a água passa por uma câmara com lâmpada UV. É eficaz dentro de condições — e tem limitações importantes que o closer precisa conhecer para não prometer demais.' },
    { tipo: 'cards', itens: [
      { icon: '💡', titulo: 'Como atua', html: 'A radiação inativa microrganismos ao passar pela câmara UV.' },
      { icon: '🌫️', titulo: 'Precisa baixa turbidez', html: 'Água turva/com partícula "sombreia" os microrganismos e reduz a eficácia. Pré-tratamento costuma ser necessário.' },
      { icon: '⚠️', titulo: 'Não deixa residual', html: 'UV atua só ali, na câmara. Não deixa proteção na água — há <strong>risco de recontaminação depois do UV</strong>, na rede/reservatório.' },
      { icon: '🧰', titulo: 'Manutenção importa', html: 'Lâmpada e limpeza da câmara afetam o desempenho ao longo do tempo.' },
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'UV não substitui proteção na rede',
      html: 'Como o UV não deixa residual, ele desinfeta no ponto — mas não protege o que vem depois. Se houver reservatório/rede sujeitos a recontaminação, isso precisa entrar no projeto (pré-tratamento para turbidez + estratégia de proteção). Nunca apresentar UV como "resolve tudo sozinho".' },

    { tipo: 'titulo', texto: 'Higienização e nova análise' },
    { tipo: 'texto', html: 'Tratamento anda junto de <strong>higienização de reservatórios e tubulações</strong> — de nada adianta desinfetar a água e devolvê-la a uma caixa contaminada. E o fechamento de qualquer ação microbiológica é sempre uma <strong>nova análise laboratorial</strong> para verificar o resultado. Sem reanálise, não se afirma que resolveu.' },
    { tipo: 'checklist', titulo: 'Fluxo responsável em caso microbiológico', itens: [
      'Laudo microbiológico recente e legível (coliformes / E. coli).',
      'Investigar possíveis origens (vedação do poço, fossa, infiltração, entorno).',
      'Definir tratamento com especialista (cloração e/ou UV, com pré-tratamento se preciso).',
      'Higienizar reservatórios e tubulações.',
      'Considerar proteção residual na rede após o tratamento.',
      'NOVA análise laboratorial para verificar o resultado.',
    ]},
    { tipo: 'especialista', nome: 'desinfecção', icon: '🧑‍🔬',
      html: 'Meu trabalho aqui é te impedir de prometer o impossível. Coliforme deu presença? A gente investiga a origem, trata com o processo certo, higieniza a reservação e — obrigatoriamente — pede nova análise. Dose de cloro, tempo de contato e residual são conta minha, com base no laudo. Você conduz o cliente com seriedade; eu entrego o número validado.' },

    { tipo: 'dodont',
      fazer: [
        'Diferenciar coliformes totais (indicador) de E. coli (contaminação fecal).',
        'Explicar que filtro mecânico não desinfeta.',
        'Apresentar cloração e UV como processos com etapas e limitações.',
        'Fechar todo caso microbiológico com higienização + nova análise.',
      ],
      evitar: [
        'Definir dose de cloro pelo volume da caixa d\'água.',
        'Prometer "água desinfetada/potável garantida".',
        'Vender UV sem falar de turbidez e de recontaminação após o UV.',
        'Afirmar que resolveu sem nova análise laboratorial.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O laudo aponta presença de E. coli. O que isso indica e como conduzir?',
      opcoes: [
        'Nada grave; um filtro de sedimentos resolve.',
        'Indicador de contaminação de origem fecal: investigar origem, tratar com especialista, higienizar reservação e pedir NOVA análise.',
        'Basta ferver quando lembrar e seguir usando.',
      ],
      correta: 1,
      explicacao: 'E. coli sinaliza contaminação fecal e risco sanitário. O caminho é investigar, tratar com processo adequado e confirmar por nova análise — nunca minimizar.'
    },
    {
      pergunta: 'Como se define a dosagem de cloro para desinfecção?',
      opcoes: [
        'Pelo volume do reservatório: um tanto por mil litros.',
        'Por cálculo do especialista, considerando demanda de cloro, concentração do produto, vazão, tempo de contato e residual desejado — validado por análise.',
        'Sempre a mesma dose para qualquer poço.',
      ],
      correta: 1,
      explicacao: 'Dosagem não sai do tamanho da caixa. Depende de demanda, concentração, vazão, tempo de contato e residual — é conta técnica, não regra fixa.'
    },
    {
      pergunta: 'Sobre desinfecção por UV, qual limitação é essencial comunicar?',
      opcoes: [
        'Nenhuma; UV resolve tudo sozinho e protege toda a rede.',
        'UV precisa de baixa turbidez para funcionar e NÃO deixa residual, havendo risco de recontaminação após o UV na rede/reservatório.',
        'UV só funciona em água já potável.',
      ],
      correta: 1,
      explicacao: 'UV atua na câmara, exige água com baixa turbidez e não deixa proteção residual — por isso não cobre recontaminação posterior sozinho.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente com poço recebeu laudo com "coliformes totais presentes" e pediu "o filtro que mata bactéria". Escreva, em 3–4 frases, como você explica que filtro mecânico não desinfeta, apresenta cloração/UV como processos com limitações, e por que dose e residual dependem de análise + nova análise no fim.',
    dica: 'Ancore em "filtro retém partícula, não desinfeta", "dose não sai do tamanho da caixa" e "fecha com higienização + nova análise".'
  },

  resumo: 'Coliformes totais são indicador de risco microbiológico; E. coli aponta contaminação fecal. Filtro mecânico retém partícula e não garante desinfecção. Cloração envolve dosagem, demanda de cloro, tempo de contato, residual e tanque de contato — e a dose NÃO se define pelo volume da caixa (depende de demanda, concentração, vazão, contato e residual, via cálculo do especialista). UV desinfeta na câmara, mas precisa de baixa turbidez e não deixa residual (risco de recontaminação após o UV). Todo caso fecha com higienização de reservatórios/tubulações e NOVA análise laboratorial.'
};
