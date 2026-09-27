// Módulo 10 — Registro no CRM. Checklist de higiene + "nenhuma oportunidade sem próximo passo".
module.exports = {
  resumoCurto: 'CRM bem preenchido é o que salva a venda no ciclo curto: origem da água, dor, produto recomendado, cidade/CEP, próximo passo + data e motivo de perda. Nenhuma oportunidade sem próximo passo.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'fe-crm-video' },
  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'Por que o CRM importa aqui',
      html: 'Com ciclo de <strong>3 dias</strong> e 73% de leads de anúncio, quem não registra <strong>perde o fio</strong> da conversa. O CRM é a memória da venda: o que a dor era, o que você recomendou e qual o próximo passo combinado.' },
    { tipo: 'titulo', texto: 'O que registrar em toda oportunidade' },
    { tipo: 'checklist', titulo: 'Checklist de registro', itens: [
      '<strong>Origem da água</strong>: concessionária confirmada (se for poço, é outra linha).',
      '<strong>Dor principal</strong>: cloro, barro/sedimento, cor/ferro, ou desconfiança ("não confio/quero melhorar").',
      '<strong>Produto recomendado</strong>: família e modelo (Light Filter / American Filter Inox / Filtralli), confirmado na ficha.',
      '<strong>Cidade / CEP</strong>: para instalação, logística e frete.',
      '<strong>Próximo passo + data</strong>: ação concreta e quando (ex.: "enviar proposta hoje", "retornar amanhã 10h").',
      '<strong>Motivo de perda</strong> (se perdeu): registrar o porquê real para aprender e reativar depois.',
    ]},
    { tipo: 'callout', variante: 'perigo', titulo: 'Nenhuma oportunidade sem próximo passo',
      html: 'Toda oportunidade aberta precisa ter um <strong>próximo passo com data</strong> no CRM. Oportunidade sem próximo passo é oportunidade esquecida — e no ciclo de 3 dias, esquecida é perdida.' },
    { tipo: 'titulo', texto: 'Por que cada campo importa' },
    { tipo: 'tabela', head: ['Campo', 'Para que serve depois'], rows: [
      ['Origem da água', 'Garante que a linha está certa e alimenta análise de ICP (89% concessionária).'],
      ['Dor principal', 'Permite reativar com a mensagem certa e entender o que converte.'],
      ['Produto recomendado', 'Dá rastreabilidade do que foi oferecido e ajuda no follow-up.'],
      ['Cidade / CEP', 'Viabiliza instalação e logística; mede concentração regional (SP ~75%).'],
      ['Próximo passo + data', 'Mantém a venda viva e organiza a cadência no ciclo curto.'],
      ['Motivo de perda', 'Base para reativação e para melhorar a abordagem.'],
    ]},
    { tipo: 'especialista', nome: 'higiene de CRM',
      html: 'O especialista <strong>preenche na hora</strong>, não "depois". Ele registra a dor com as palavras do cliente, marca o próximo passo com data toda vez e, quando perde, anota o motivo real — não um genérico. Um CRM limpo hoje é a venda (ou a reativação) de amanhã.' },
    { tipo: 'dodont',
      fazer: ['Registrar origem, dor, produto, cidade/CEP e próximo passo em toda oportunidade.', 'Definir sempre próximo passo com data.', 'Anotar o motivo de perda real quando perder.'],
      evitar: ['Deixar oportunidade aberta sem próximo passo.', 'Preencher dor de forma genérica ou deixar em branco.', 'Registrar poço como filtro de entrada.'] },
  ],
  perguntasRapidas: [
    { pergunta: 'Qual a regra de ouro do registro no CRM?', opcoes: ['Preencher só o telefone.', 'Nenhuma oportunidade sem próximo passo (com data).', 'Registrar só quando fechar.'], correta: 1, explicacao: 'Toda oportunidade aberta precisa de próximo passo com data — no ciclo de 3 dias, sem isso ela se perde.' },
    { pergunta: 'Por que registrar o motivo de perda real?', opcoes: ['Burocracia.', 'Serve de base para reativação e para melhorar a abordagem.', 'Não precisa registrar perda.'], correta: 1, explicacao: 'O motivo real de perda alimenta a reativação futura e o aprendizado do time.' },
    { pergunta: 'O cliente é de poço. Como registrar em filtro de entrada?', opcoes: ['Registro normal como filtro de entrada.', 'Não é filtro de entrada — é outra linha (água não tratada); corrijo a origem.', 'Deixo a origem em branco.'], correta: 1, explicacao: 'Origem da água define a linha. Poço não é filtro de entrada; registrar certo mantém o CRM confiável.' },
  ],
  exercicio: { enunciado: 'Você acabou de atender um lead de anúncio: água da rua, reclamou de cloro e barro, mora em SJC, recomendou Light Filter 1000 e vai enviar proposta. Liste exatamente o que você preenche no CRM antes de encerrar.', dica: 'Origem = concessionária; dor = cloro + sedimento; produto = Light Filter 1000; cidade/CEP = SJC; próximo passo = "enviar proposta hoje, retornar amanhã" com data. Sem próximo passo, não encerra.' },
  resumo: 'No CRM registre sempre: origem da água (concessionária), dor principal, produto recomendado, cidade/CEP, próximo passo com data e motivo de perda quando houver. Preencha na hora e com as palavras do cliente. A regra inegociável: nenhuma oportunidade sem próximo passo — no ciclo de 3 dias, é o que separa venda de esquecimento.'
};
