// Módulo 3 — A linha de filtro de entrada. Diferenciador PRINCIPAL: estratégia do cloro.
// FATO TDF: American Filter = SEM carvão (mantém o cloro de propósito) · Light Filter = COM
// carvão (tira o cloro). Filtralli = linha de entrada (carvão/spec -> confirmar na ficha).
// Vender pelo PERFIL + estratégia de cloro, não decorando spec. CRM: Light 1000 (603),
// American Inox (248), Filtrali V2 (160).
module.exports = {
  resumoCurto: 'Três famílias — e o diferenciador nº1 não é preço, é a estratégia do cloro: American Filter (sem carvão, MANTÉM o cloro/protege a caixa), Light Filter (com carvão, TIRA o cloro/gosto), Filtralli (entrada). Você vende pelo perfil e pelo objetivo, não decorando spec.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'fe-linha-produtos-video' },
  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'O diferenciador que muda a conversa',
      html: 'Antes de "premium vs econômico", a primeira pergunta é: <strong>o cliente quer manter ou tirar o cloro?</strong> O <strong>American Filter não tem carvão</strong> e <strong>mantém o cloro de propósito</strong> (protege a caixa d\'água). O <strong>Light Filter tem carvão</strong> e <strong>tira o cloro</strong> (gosto/cheiro). Veja o módulo "Como funciona" para o porquê.' },

    { tipo: 'titulo', texto: 'As três famílias' },
    { tipo: 'cards', itens: [
      { icon: '🛡️', titulo: 'American Filter (Inox) — SEM carvão', html: 'Filtra <strong>sedimento</strong> (barro, ferrugem) e <strong>mantém o cloro</strong> para proteger a casa/caixa. Acabamento inox, premium/durável. 2ª mais vendida (248 no CRM). Para quem quer limpar a água <strong>sem perder a proteção do cloro</strong> — e valoriza acabamento.' },
      { icon: '💧', titulo: 'Light Filter — COM carvão', html: '<strong>Carvão no elemento</strong> → <strong>reduz o cloro</strong> (gosto/cheiro de piscina) além do sedimento. Carro-chefe de volume (Light Filter 1000 = 603 vendas). Para quem também quer resolver o <strong>gosto/cheiro de cloro</strong> na casa toda (com o cuidado de manter a caixa higienizada e a troca em dia).' },
      { icon: '🧩', titulo: 'Filtralli (V2–V8)', html: 'Linha de <strong>entrada</strong>, boa porta para começar. Filtrali V2 é a 3ª mais vendida (160). Presença/ausência de carvão e specs por versão → <strong>confirmar na ficha técnica</strong>.' },
    ]},

    { tipo: 'titulo', texto: 'Como recomendar (pelo objetivo do cliente)' },
    { tipo: 'tabela',
      head: ['Objetivo do cliente', 'Família', 'Por quê'],
      rows: [
        ['Limpar sedimento e <strong>manter</strong> a proteção do cloro na casa/caixa', '<strong>American Filter</strong> (sem carvão)', 'Filtra o sólido e preserva o cloro residual — indicado para quem tem caixa d\'água e quer proteção'],
        ['Também <strong>tirar</strong> o gosto/cheiro de cloro na casa toda', '<strong>Light Filter</strong> (com carvão)', 'O carvão reduz o cloro; alertar sobre higienização da caixa e troca em dia'],
        ['Começar com investimento menor', '<strong>Filtralli</strong>', 'Porta de entrada; confirmar versão e se tem carvão na ficha'],
      ]
    },
    { tipo: 'callout', variante: 'sucesso', titulo: 'Prova social (dados do CRM)',
      html: 'Light Filter 1000 (603 vendas), American Filter Inox (248) e Filtrali V2 (160) são os <strong>mais fechados no CRM</strong>. Você pode dizer com segurança que são as escolhas mais comuns dos clientes.' },
    { tipo: 'pendente', html: 'Vazão, número de estágios, tipo/volume de mídia, capacidade por porte de imóvel e periodicidade de troca de <strong>cada modelo</strong> (e se a versão de Filtralli tem carvão) vêm da <strong>ficha técnica oficial da TDF</strong>. Confirme antes de cravar; não decore número.' },

    { tipo: 'dodont',
      fazer: [
        'Perguntar primeiro se o objetivo inclui tirar o gosto/cheiro de cloro.',
        'American Filter = mantém cloro (protege a caixa); Light Filter = tira cloro (com cuidado da reservação).',
        'Usar Light Filter 1000 como prova social e ponto de partida de volume.',
        'Confirmar o modelo certo (porte do imóvel) na ficha técnica.',
      ],
      evitar: [
        'Vender o Light Filter/carvão como "sempre melhor" (tirar cloro na entrada tem trade-off).',
        'Descrever o American só como "premium" esquecendo que ele MANTÉM o cloro de propósito.',
        'Cravar vazão/estágios/capacidade sem a ficha.',
      ]
    },
  ],
  perguntasRapidas: [
    { pergunta: 'Qual a diferença central entre American Filter e Light Filter?', opcoes: ['Só o preço.', 'American NÃO tem carvão e MANTÉM o cloro (protege a caixa); Light TEM carvão e TIRA o cloro (gosto/cheiro).', 'São iguais, muda a cor.'], correta: 1, explicacao: 'O diferenciador nº1 é a estratégia do cloro: American mantém (sem carvão), Light tira (com carvão). Acabamento/inox é secundário.' },
    { pergunta: 'Cliente quer limpar a água mas manter a proteção do cloro na caixa d\'água. Qual família?', opcoes: ['Light Filter.', 'American Filter (sem carvão).', 'Nenhuma serve.'], correta: 1, explicacao: 'American Filter filtra o sedimento e mantém o cloro de propósito — preserva o residual que protege a reservação.' },
    { pergunta: 'Qual é o campeão de volume no CRM?', opcoes: ['Filtralli.', 'Light Filter 1000 (603 vendas).', 'American Filter Inox.'], correta: 1, explicacao: 'Light Filter 1000 lidera (603). American Inox (248) e Filtrali V2 (160) vêm na sequência.' },
  ],
  exercicio: { enunciado: 'Um cliente com caixa d\'água diz que quer "melhorar a água da casa toda" mas não citou cloro. Como você usa a estratégia do cloro para escolher entre American e Light — e o que confirma na ficha?', dica: 'Pergunte se incomoda o gosto/cheiro de cloro: se não, American (mantém cloro, protege a caixa); se sim, Light (com carvão), alertando sobre a caixa. Confirme o modelo pelo porte na ficha.' },
  resumo: 'A linha tem American Filter (sem carvão, mantém o cloro de propósito, inox/premium), Light Filter (com carvão, tira o cloro; carro-chefe — 1000 é o mais vendido) e Filtralli (entrada, V2–V8). O diferenciador nº1 é a ESTRATÉGIA DO CLORO, não o preço: pergunte se o cliente quer manter (proteção da caixa) ou tirar (gosto/cheiro) o cloro. Use os campeões do CRM como prova social e confirme vazão/estágios/capacidade na ficha técnica oficial.'
};
