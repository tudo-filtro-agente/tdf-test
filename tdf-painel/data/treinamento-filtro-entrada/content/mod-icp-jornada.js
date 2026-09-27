// ICP, Personas e Jornada — Filtro de Entrada. Dados REAIS do Zoho CRM (06/jul/2026):
// 1.331 vendas fechadas (win 21,3% — maior linha). Nenhum número inventado.
module.exports = {
  resumoCurto: 'Quem compra filtro de entrada (dados do CRM): cliente urbano da água de concessionária, ticket R$2.700, ciclo de 3 dias. A maior linha da TDF.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'fe-icp-jornada-video' },
  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'Baseado em dados reais do CRM',
      html: '<strong>1.331 vendas fechadas</strong> (win 21,3%) — a <strong>maior linha da TDF</strong>. Tudo do Zoho CRM.' },
    { tipo: 'titulo', texto: 'O ICP — quem compra' },
    { tipo: 'cards', itens: [
      { icon: '🚰', titulo: 'Água da concessionária (89%)', html: 'Cliente <strong>urbano</strong> que desconfia / quer melhorar a água da rua. <strong>NÃO é poço.</strong>' },
      { icon: '📍', titulo: 'Região', html: '~75% SP: São José dos Campos (172), capital (135), Rio (53). Forte no <strong>Vale do Paraíba</strong>.' },
      { icon: '💰', titulo: 'Ticket', html: 'Mediano <strong>R$2.700</strong> (p25–p75 R$2.480–3.290, máx R$29.000). B2C residencial.' },
      { icon: '📦', titulo: 'O que fecha', html: 'Light Filter 1000 (603), American Filter Inox (248), Filtrali V2 (160).' },
    ]},
    { tipo: 'titulo', texto: 'A dor (persona)' },
    { tipo: 'perguntas', titulo: 'Gatilhos mais comuns no CRM', itens: [
      '"Não confio / quero melhorar" a água da rua (~54% — o maior grupo)',
      'Água com barro / sujeira (328)',
      'Água amarela / ferro (72)',
      'Excesso de cloro (36)',
    ]},
    { tipo: 'texto', html: 'A persona é o <strong>morador urbano incomodado com a qualidade da água da concessionária</strong> — não é medo de poço, é desconfiança da água da rua.' },
    { tipo: 'titulo', texto: 'A jornada do lead' },
    { tipo: 'tabela', head: ['Sinal do CRM', 'Número real', 'O que muda pra você'], rows: [
      ['Ciclo de venda', '<strong>3 dias</strong> (mediano)', 'Rápido, mas não instantâneo: cliente pesquisa e decide em poucos dias. Conduza com agilidade.'],
      ['Origem', '73% pago (Google 40% + Meta 33%)', 'Vem de anúncio querendo melhorar a água — chegue confirmando a dor.'],
      ['Indicação', '15%', 'Pós-venda e satisfação geram novas vendas — cuide da experiência.'],
    ]},
    { tipo: 'dodont',
      fazer: ['Confirmar a dor ("quero melhorar / não confio" na água da rua).', 'Conduzir com agilidade (ciclo de 3 dias).', 'Cuidar do pós-venda (indicação vale 15%).'],
      evitar: ['Tratar como água de poço (é concessionária).', 'Arrastar a venda (o ciclo é curto).', 'Prometer potabilidade/remoção absoluta sem base.'] },
  ],
  perguntasRapidas: [
    { pergunta: 'Qual a origem da água do cliente típico de filtro de entrada, segundo o CRM?', opcoes: ['Poço / água não tratada.', 'Concessionária (89%) — água da rua urbana.', 'Mina/cachoeira.'], correta: 1, explicacao: '89% é água de concessionária. O cliente é urbano e desconfia/quer melhorar a água da rua — não é poço.' },
    { pergunta: 'Qual o ciclo de venda mediano dessa linha?', opcoes: ['1 dia.', '3 dias.', '30 dias.'], correta: 1, explicacao: 'Ciclo mediano de 3 dias: o cliente pesquisa e decide em poucos dias. Agilidade importa.' },
  ],
  exercicio: { enunciado: 'Um lead chega dizendo "a água da minha casa tem gosto de cloro e às vezes sai barro". Sabendo que é a maior linha e o ciclo é de 3 dias, como você abre e conduz?', dica: 'Confirme a dor (cloro/barro), posicione a solução da linha (Light Filter/American/Filtralli) e conduza rápido.' },
  resumo: 'Dados do CRM (1.331 vendas): filtro de entrada é a maior linha, cliente urbano da concessionária (89%), dor de desconfiança/cloro/barro, ticket R$2.700, ciclo de 3 dias e 73% de tráfego pago. Confirme a dor da água da rua, conduza com agilidade e cuide do pós-venda (15% vem de indicação).'
};
