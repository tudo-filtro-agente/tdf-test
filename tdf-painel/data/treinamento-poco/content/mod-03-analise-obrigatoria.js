// ============================================================================
// MÓDULO 3 — Análise obrigatória antes da venda  (segue o CONTRATO DE SCHEMA do mod-01)
// Blocos suportados por views/treinamento/poco/_blocos.ejs:
//   texto | titulo | callout(variante:info|alerta|sucesso|perigo) | card | cards |
//   script | dodont(fazer[],evitar[]) | checklist | tabela | perguntas | exemplo |
//   pendente(html?)  → "Pendente de validação técnica pela Tudo de Filtro" |
//   especialista(nome, icon?, html)  → personagem educacional
//
// Conteúdo COMERCIAL SEGURO: como exigir e triar um laudo recente e legível.
// NÃO citar limites numéricos — os VMP vêm de parametros-agua.js (Portaria 888/2021).
// ============================================================================

module.exports = {
  resumoCurto: 'Sem laudo recente e legível, não há proposta. Como pedir a análise com educação, o que o laudo precisa permitir identificar e quais sinais de alerta invalidam uma análise.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-03-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'A análise é pré-requisito, não formalidade',
      html: 'Na Tudo de Filtro, propor tratamento de água de poço <strong>sem laudo laboratorial recente e legível</strong> não é permitido. O laudo é o que transforma "achismo" em diagnóstico. Antes dele, você ainda não sabe o que a água tem — e não pode prometer nada.' },

    { tipo: 'titulo', texto: 'Por que exigir o laudo antes de qualquer proposta' },
    { tipo: 'texto', html: 'Água de poço varia com a geologia, a estação, a profundidade e o entorno. O que resolve o vizinho pode não resolver o cliente. O laudo protege as duas partes: protege o cliente de comprar a solução errada e protege você de <strong>prometer o que não pode cumprir</strong>. Pedir a análise não é burocracia — é a parte mais profissional da conversa.' },

    { tipo: 'titulo', texto: 'O que um laudo precisa permitir identificar' },
    { tipo: 'texto', html: 'Um laudo utilizável não é só "um papel com números". Ele precisa deixar claro <strong>quando</strong>, <strong>onde</strong>, <strong>como</strong> e <strong>por quem</strong> a análise foi feita. Use este checklist para triar antes de levar ao especialista técnico:' },
    { tipo: 'checklist', itens: [
      'Data da coleta da amostra (quando a água foi coletada).',
      'Data da análise no laboratório (quando foi analisada).',
      'Local/ponto de coleta identificado (poço, caixa bruta, torneira etc.).',
      'Laboratório responsável identificado (nome/identificação).',
      'Métodos/técnicas de análise informados para os parâmetros.',
      'Unidade de cada parâmetro explícita (ex.: mg/L, "como N", presença/ausência).',
      'Resultado de cada parâmetro (o valor medido).',
      'Limite/valor de referência ao lado de cada parâmetro (quando o laudo traz).',
      'Conclusão ou parecer do laboratório sobre a amostra.',
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Legível de verdade',
      html: 'Legível significa: dá para ler <strong>cada parâmetro, cada unidade e cada resultado</strong> sem adivinhar. Foto tremida, cortada, com reflexo ou com colunas ilegíveis <strong>não</strong> é laudo — é uma foto de laudo. Peça o arquivo original (PDF) sempre que possível.' },

    { tipo: 'titulo', texto: 'Sinais de alerta que invalidam (ou derrubam a confiança na) análise' },
    { tipo: 'cards', itens: [
      { icon: '📅', titulo: 'Laudo antigo', html: 'Análise defasada pode não representar a água de hoje. Trate como candidato a nova coleta e confirme com o especialista técnico o prazo aceitável.' },
      { icon: '🧩', titulo: 'Laudo incompleto', html: 'Faltam parâmetros, unidade, data ou ponto de coleta. Sem esses campos, a leitura fica insegura.' },
      { icon: '📷', titulo: 'Foto ilegível', html: 'Imagem cortada, borrada ou com reflexo. Não dá para ler = não serve. Peça o PDF original.' },
      { icon: '🔢', titulo: 'Resultado sem unidade', html: 'Número solto não se compara com nada. Sem unidade, não há conclusão — é o alerta do Módulo 2.' },
      { icon: '🔧', titulo: 'Análise antes de alteração no poço', html: 'Se houve limpeza, aprofundamento, troca de bomba ou intervenção depois da coleta, a análise pode não valer mais.' },
      { icon: '🧫', titulo: 'Coleta sem procedimento adequado', html: 'Coleta mal feita contamina ou distorce a amostra — principalmente no microbiológico. O "como coletou" importa.' },
      { icon: '👁️', titulo: 'Só "teste visual"', html: 'Cliente que avaliou a água "no olho" não tem análise. Aparência não é laudo (regra do Módulo 1).' },
      { icon: '💬', titulo: '"A água é boa porque sempre bebemos"', html: 'Hábito não é potabilidade. Contaminantes como nitrato e microbiológico não têm cor, cheiro ou gosto.' },
    ]},

    { tipo: 'pendente',
      html: 'O <strong>prazo máximo aceitável</strong> para considerar um laudo "recente", a <strong>lista mínima de parâmetros exigidos</strong> por tipo de caso e quaisquer <strong>limites numéricos</strong> dependem do documento-mestre da Tudo de Filtro e da <strong>Portaria GM/MS nº 888/2021</strong> (ver <code>parametros-agua.js</code> e <code>fontes.js</code>). Esses valores estão <strong>pendentes de validação técnica</strong> — não afirme prazo ou limite de cor própria; confirme com o especialista técnico.' },

    { tipo: 'especialista', nome: 'análises', icon: '🧑‍🔬',
      html: 'Meu filtro mental para triar um laudo: (1) consigo ler tudo? (2) sei quando e onde foi coletado? (3) cada parâmetro tem unidade? (4) houve mexida no poço depois? Se qualquer resposta for "não", eu não sigo para proposta — eu peço complemento ou nova coleta e trago para o especialista técnico.' },

    { tipo: 'titulo', texto: 'Scripts para pedir o laudo com educação' },
    { tipo: 'script', titulo: 'Cliente ainda não tem análise',
      linhas: [
        'Vendedor: "Para eu te indicar a solução certa — e não te empurrar algo que não resolve — o primeiro passo é uma análise laboratorial da sua água. É o que mostra o que realmente tem nela."',
        'Cliente: "Mas a água é limpinha, precisa mesmo?"',
        'Vendedor: "Precisa. Vários pontos importantes não têm cor, cheiro nem gosto — só a análise revela. Assim eu te protejo de comprar o equipamento errado. Posso te orientar sobre como conseguir esse laudo?"',
      ]
    },
    { tipo: 'script', titulo: 'Cliente mandou foto ilegível',
      linhas: [
        'Vendedor: "Recebi a foto, obrigado! Só que ela ficou difícil de ler em alguns parâmetros e eu não quero concluir nada errado sobre a sua água."',
        'Vendedor: "Consegue me enviar o arquivo original em PDF, ou uma foto reta e sem reflexo de cada página? Preciso ler parâmetro, unidade e resultado com clareza para te dar uma resposta correta."',
      ]
    },
    { tipo: 'script', titulo: 'Laudo antigo ou poço alterado depois da coleta',
      linhas: [
        'Vendedor: "Esse laudo ajuda como histórico, mas ele é de um tempo atrás / é anterior à mexida que você fez no poço."',
        'Vendedor: "Como a água de poço muda com o tempo e com intervenções, o mais seguro é confirmarmos com uma análise atual antes de eu propor qualquer coisa. Assim a solução reflete a água de hoje."',
      ]
    },

    { tipo: 'dodont',
      fazer: [
        'Pedir laudo recente e legível como primeiro passo, com educação.',
        'Triar o laudo pelo checklist (data, local, unidade, método, resultado, conclusão).',
        'Solicitar PDF original quando a foto estiver ruim.',
        'Encaminhar ao especialista técnico em caso de dúvida, microbiológico ou laudo insuficiente.',
      ],
      evitar: [
        'Propor solução com base em foto da água, relato ou "teste visual".',
        'Aceitar resultado sem unidade ou laudo com campos faltando.',
        'Confiar em laudo antigo ou anterior a alteração no poço sem revalidar.',
        'Dizer ao cliente que "sempre bebeu, então é boa" resolve a exigência.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'O cliente diz: "não tenho análise, mas a água é boa, sempre bebemos dela". Como conduzir?',
      opcoes: [
        'Aceitar o histórico do cliente como prova de potabilidade e propor um equipamento.',
        'Explicar com educação que hábito não é potabilidade, que vários contaminantes são invisíveis, e orientar a obter um laudo antes de qualquer proposta.',
        'Sugerir o maior equipamento "por garantia".',
      ],
      correta: 1,
      explicacao: 'Hábito de consumo não avalia nitrato nem microbiológico. A análise é pré-requisito; o papel do vendedor é conduzir o cliente a obtê-la, sem desmerecê-lo.'
    },
    {
      pergunta: 'Qual destes já é motivo suficiente para NÃO seguir para proposta com o laudo em mãos?',
      opcoes: [
        'O laudo tem data de coleta, unidades e conclusão do laboratório.',
        'Um resultado aparece sem unidade e a foto está cortada em parte dos parâmetros.',
        'O laudo é um PDF original e legível.',
      ],
      correta: 1,
      explicacao: 'Resultado sem unidade não se compara com nada e foto ilegível não é laudo. Peça complemento/PDF ou nova coleta antes de avançar.'
    },
  ],

  exercicio: {
    enunciado: 'Um cliente envia por WhatsApp uma foto de um laudo de 2 anos atrás, sem dá para ler a unidade de vários parâmetros, e menciona que trocou a bomba do poço mês passado. Escreva a mensagem que você enviaria pedindo o que falta — mantendo o cliente do seu lado e explicando o porquê.',
    dica: 'Combine três pontos: (1) laudo antigo, (2) foto ilegível/sem unidade, (3) alteração no poço depois da coleta. Peça PDF/nova coleta sem culpar o cliente.'
  },

  resumo: 'Nenhuma proposta sem laudo recente e legível. O laudo precisa permitir identificar data de coleta e de análise, local, laboratório, métodos, unidade, resultado, referência e conclusão. Sinais de alerta — laudo antigo, incompleto, foto ilegível, resultado sem unidade, coleta após mexida no poço, só "teste visual" ou "sempre bebemos" — travam a venda até revalidar. Prazos e limites vêm da fonte oficial (pendentes); scripts pedem a análise com educação e casos duvidosos vão ao especialista técnico.'
};
