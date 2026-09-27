// ============================================================================
// MÓDULO 09 — Registro no CRM
// Checklist: dor (mancha/dureza), origem da água, combo recomendado, ticket,
// cidade, próximo passo + data, motivo de perda.
// ============================================================================

module.exports = {
  resumoCurto: 'CRM bem preenchido no Scale Stop = dor certa (mancha/dureza), origem da água, combo recomendado, ticket, cidade, próximo passo com data e — se perder — o motivo real. É o que sustenta o follow-up do ciclo de 12 dias e a inteligência da linha.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'ss-crm-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: '⛔ Registre a verdade técnica',
      html: 'No CRM, descreva a dor como <strong>dureza/incrustação</strong> e a solução como <strong>anti-incrustante que reduz a crosta</strong> — nunca como "remove dureza/água mole". Registro errado vira promessa errada no próximo contato.' },

    { tipo: 'titulo', texto: 'O checklist do card de Scale Stop' },
    { tipo: 'checklist', itens: [
      'Dor registrada: mancha branca / crosta (dureza) — e onde incrusta (box, torneira, boiler, louça).',
      'Origem da água: poço / estação / mina / concessionária + se é serra/interior.',
      'Combo recomendado: Scale Stop + [Light Filter / V2 / Fibra] (o sistema, não só a peça).',
      'Ticket / valor do projeto proposto.',
      'Cidade / localização do imóvel (logística e visita).',
      'Decisor identificado (quem decide e paga).',
      'Próximo passo com DATA (análise/visita, envio do projeto, retorno).',
      'Objetivo confirmado: parar a crosta (Scale Stop) — e NÃO "água mole" (seria abrandador).',
    ]},

    { tipo: 'titulo', texto: 'Por que cada campo importa' },
    { tipo: 'tabela', head: ['Campo', 'Para que serve'], rows: [
      ['Dor (mancha/dureza)', 'Ancora o follow-up e evita retomar a conversa pelo lugar errado.'],
      ['Origem da água', 'Sustenta o dimensionamento e confirma o quadro de água dura.'],
      ['Combo recomendado', 'Registra o escopo do projeto e permite retomar sem recomeçar do zero.'],
      ['Ticket', 'Maior ticket da TDF — alimenta forecast e prioridade.'],
      ['Cidade', 'Organiza visita/análise e logística.'],
      ['Próximo passo + data', 'Sustenta o ciclo de ~12 dias; sem data, o lead esfria.'],
      ['Motivo de perda', 'Inteligência da linha — por que Scale Stop perde (preço, foi de abrandador, sumiu…).'],
    ]},

    { tipo: 'especialista', nome: 'operação TDF', icon: '🧑‍🔬',
      html: 'A amostra do Scale Stop é pequena (51 vendas). Cada card bem preenchido melhora a leitura da linha: dor, combo que fecha, ticket real, motivo de perda. CRM sujo aqui custa caro porque a base é pequena.' },

    { tipo: 'titulo', texto: 'Motivo de perda: registre o real' },
    { tipo: 'cards', itens: [
      { icon: '💸', titulo: 'Preço / sem verba', html: 'Achou caro ou não tinha verba pro projeto. Registre — é o maior ticket, faz parte.' },
      { icon: '🧂', titulo: 'Foi de abrandador', html: 'Cliente optou por abrandador (queria água mole). Motivo legítimo — anote pra entender a linha.' },
      { icon: '👻', titulo: 'Sumiu / sem retorno', html: 'Parou de responder no ciclo. Registre e mantenha o follow-up conforme a cadência.' },
      { icon: '⏳', titulo: 'Adiou', html: 'Vai resolver depois. Registre a data prevista pra retomar.' },
    ]},

    { tipo: 'pendente', html: 'Os <strong>nomes exatos de campos, picklists e estágios</strong> do Zoho para a linha Scale Stop seguem o padrão oficial da TDF — use os campos corretos do CRM, não crie rótulo por conta própria.' },

    { tipo: 'dodont',
      fazer: [
        'Preencher dor, origem, combo, ticket, cidade e próximo passo com data.',
        'Registrar o motivo de perda real (preço, foi de abrandador, sumiu, adiou).',
        'Descrever a solução como anti-incrustante que reduz a crosta.',
      ],
      evitar: [
        'Registrar "remove dureza / água mole" (errado tecnicamente).',
        'Deixar próximo passo sem data (o lead esfria no ciclo de 12 dias).',
        'Fechar o card sem motivo de perda quando perde.',
      ] },
  ],

  perguntasRapidas: [
    { pergunta: 'O que não pode faltar no card de Scale Stop?',
      opcoes: ['Só o telefone do cliente.', 'Dor (mancha/dureza), origem, combo, ticket, cidade e próximo passo com data.', 'Apenas o valor.'],
      correta: 1, explicacao: 'O card sustenta o follow-up do ciclo de 12 dias e a inteligência da linha — precisa do quadro completo.' },
    { pergunta: 'Como descrever a solução no CRM?',
      opcoes: ['"Remove a dureza / deixa a água mole."', '"Anti-incrustante que reduz a crosta/mancha (Scale Stop, sem sal)."', '"Abrandador."'],
      correta: 1, explicacao: 'Registro tecnicamente correto evita promessa errada no próximo contato. Água mole seria abrandador.' },
    { pergunta: 'Por que registrar o motivo de perda real?',
      opcoes: ['Não precisa.', 'Porque a amostra é pequena e o motivo (preço, foi de abrandador, sumiu) é inteligência da linha.', 'Só pra cumprir tabela.'],
      correta: 1, explicacao: 'Com 51 vendas, cada motivo de perda bem registrado ajuda a entender e melhorar a linha.' },
  ],

  exercicio: {
    enunciado: 'Preencha (em texto) o card de um lead de Scale Stop: água dura de poço na serra, mancha no box e na torneira, combo Scale Stop + Fibra, ticket na faixa alta, cidade do interior, próximo passo = análise agendada. Liste os campos e o que você escreveria em cada um.',
    dica: 'Siga o checklist: dor, origem, combo, ticket, cidade, decisor, próximo passo com data, objetivo confirmado (parar crosta, não água mole).'
  },

  resumo: 'No CRM do Scale Stop registre: dor (mancha/dureza + onde incrusta), origem da água, combo recomendado, ticket, cidade, decisor, próximo passo com data e — se perder — o motivo real (preço, foi de abrandador, sumiu, adiou). Descreva a solução como anti-incrustante que reduz a crosta, nunca "remove dureza/água mole". Com amostra pequena (51 vendas), CRM limpo é o que sustenta o follow-up de 12 dias e a inteligência da linha.'
};
