// ============================================================================
// MÓDULO 05 — Posicionamento: combo e projeto
// Scale Stop quase nunca vende sozinho. Maior ticket da TDF (mediana R$10,7k).
// Posicionar como projeto/combo (Light Filter + Scale Stop Inox, Scale Stop + V2,
// Scale Stop + Fibra). Como apresentar junto de outros produtos.
// ============================================================================

module.exports = {
  resumoCurto: 'Scale Stop é o maior ticket da TDF (mediana R$10.700) e quase nunca vende sozinho: é venda de PROJETO/COMBO. Posicione junto de Light Filter, V2 ou Fibra, tratando o Scale Stop como o "cérebro anti-crosta" do sistema.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-posicionamento-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ A regra que não se quebra',
      html: 'Mesmo dentro do combo, o Scale Stop <strong>reduz a incrustação sem remover a dureza</strong> — não deixa a água mole. Não deixe o combo virar promessa de "água mole".' },

    { tipo: 'titulo', texto: 'Por que Scale Stop é venda de projeto' },
    { tipo: 'cards', itens: [
      { icon: '💰', titulo: 'Maior ticket da TDF', html: 'Mediana <strong>R$10.700</strong> (dados do CRM). Cliente com <strong>verba</strong>, que decide por valor entregue e não por preço de item.' },
      { icon: '🧩', titulo: 'Raramente sozinho', html: 'No CRM, quase toda venda é <strong>combo</strong>. O Scale Stop resolve a crosta, mas o cliente costuma precisar de outra frente (partículas, ferro, sabor).' },
      { icon: '🗺️', titulo: 'Água dura de poço/serra', html: 'O contexto (poço/estação, serra/interior) quase sempre pede mais de um estágio — daí o combo/projeto.' },
    ]},

    { tipo: 'titulo', texto: 'Os combos que mais aparecem no CRM' },
    { tipo: 'tabela', head: ['Combo', 'O que cada parte resolve', 'Quando'], rows: [
      ['Light Filter + Scale Stop Inox', 'Light Filter cuida de partículas/qualidade geral; Scale Stop cuida da crosta/mancha', 'O combo mais comum — água dura com necessidade de filtragem geral'],
      ['Scale Stop + V2 (Filtrali)', 'V2 na linha de filtro de entrada; Scale Stop anti-incrustação', 'Cliente que já quer filtro de entrada e tem dureza forte'],
      ['Scale Stop + Fibra 1500', 'Fibra trata água não tratada/poço; Scale Stop reduz crosta', 'Poço com carga de partículas + dureza'],
    ]},
    { tipo: 'pendente', html: 'A <strong>configuração técnica de cada combo</strong> (ordem dos estágios, vazão, mídia, capacidade, dimensionamento) sai do <strong>especialista/ficha oficial</strong> após a análise. Não monte projeto com specs de cabeça.' },

    { tipo: 'especialista', nome: 'operação TDF', icon: '🧑‍🔬',
      html: 'No CRM: Light Filter + Scale Stop Inox (11 vendas), Scale Stop + V2 (9), Scale Stop + Fibra 1500 (6). O padrão é claro — Scale Stop é o componente anti-crosta dentro de um sistema maior, não um produto avulso.' },

    { tipo: 'titulo', texto: 'Como apresentar o combo (sem parecer "empurrar")' },
    { tipo: 'script', titulo: 'Ancoragem por dor → sistema',
      passos: [
        '"Pela sua água (dura, de poço/serra) e pela dor que você descreveu (mancha branca/crosta), a gente não resolve com uma peça só — a gente monta um sistema."',
        '"O Scale Stop é a parte que ataca a crosta e a mancha: ele muda a forma do cálcio pra não grudar, sem sal."',
        '"E junto dele entra o [Light Filter / V2 / Fibra], que cuida de [partículas / filtragem geral / água não tratada]. As duas partes se completam."',
        '"Fica um projeto único, dimensionado pra sua casa. Faz sentido eu te trazer o desenho completo?"',
      ] },

    { tipo: 'callout', variante: 'sucesso', titulo: 'Venda valor, não item',
      html: 'Como é o maior ticket da TDF, não caia na conversa de "quanto custa a peça X". Suba o nível: <strong>projeto que protege a casa inteira</strong> (boiler, metais, box, louça) e <strong>resolve a dor visível</strong> de vez. O preço faz sentido dentro do valor do sistema.' },

    { tipo: 'dodont',
      fazer: [
        'Posicionar Scale Stop como parte de um projeto/combo, não avulso.',
        'Ligar cada componente a uma dor específica do cliente.',
        'Ancorar o preço no valor do sistema completo (maior ticket = cliente com verba).',
      ],
      evitar: [
        'Vender Scale Stop sozinho quando o caso pede combo.',
        'Deixar o combo virar promessa de "água mole".',
        'Prometer configuração/spec de combo sem passar pelo especialista.',
      ] },
  ],

  perguntasRapidas: [
    { pergunta: 'Como o Scale Stop quase sempre é vendido, segundo o CRM?',
      opcoes: ['Sozinho, produto avulso.', 'Como combo/projeto, junto de Light Filter, V2 ou Fibra.', 'Só em locação.'],
      correta: 1, explicacao: 'No CRM é quase sempre combo (Light Filter + Scale Stop Inox, +V2, +Fibra). Posicione como projeto.' },
    { pergunta: 'Por que ancorar o preço no valor do sistema, e não na peça?',
      opcoes: ['Porque a peça é barata.', 'Porque é o maior ticket da TDF e o cliente decide por valor entregue, não por item.', 'Porque não existe preço da peça.'],
      correta: 1, explicacao: 'Scale Stop é o maior ticket (mediana R$10,7k); a venda é de projeto — venda o valor do sistema completo.' },
  ],

  exercicio: {
    enunciado: 'Cliente de poço na serra com verba reclama de mancha branca e também de "água que às vezes vem com um barro fino". Monte a lógica do combo (qual componente resolve o quê) e o próximo passo — sem prometer água mole nem citar specs.',
    dica: 'Scale Stop = crosta/mancha; Fibra = água não tratada/partículas. Próximo passo: análise/desenho do projeto pelo especialista.'
  },

  resumo: 'Scale Stop é o maior ticket da TDF (mediana R$10.700) e quase nunca vende sozinho — é venda de projeto/combo. Combos do CRM: Light Filter + Scale Stop Inox, Scale Stop + V2, Scale Stop + Fibra 1500. Apresente ligando cada componente a uma dor, ancore o preço no valor do sistema, e nunca deixe o combo virar promessa de água mole. Configuração/specs vêm do especialista.'
};
