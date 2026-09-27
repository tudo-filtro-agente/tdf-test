// ============================================================================
// MÓDULO 17 — Roteiro de venda (água de poço)
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js
// Blocos: texto | titulo | callout | card | cards | script | dodont |
//         checklist | tabela | perguntas | exemplo | pendente | especialista
// REGRA: NÃO prometer potabilidade nem remoção garantida. NÃO dar preço/solução
// antes de análise + sondagem hidráulica. Especificidade técnica → `pendente`
// ou "envolver o especialista". Sempre terminar com PRÓXIMO PASSO.
// ============================================================================

module.exports = {
  resumoCurto: 'A jornada de venda de poço em 19 passos — da abertura ao pós-venda. O closer educa e qualifica; o especialista dimensiona. Proposta só depois de análise + sondagem hidráulica.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-17-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'A jornada tem ordem — e a ordem protege todo mundo',
      html: 'A venda de poço é um <strong>processo técnico-comercial</strong>, não um pitch de produto. Cada passo prepara o próximo. Você <strong>não pula</strong> da dor para a proposta: entre eles existem a <strong>análise</strong>, a <strong>sondagem hidráulica</strong> e o <strong>especialista</strong>. Quem inverte a ordem vende errado e entrega frustração.' },

    { tipo: 'titulo', texto: 'Visão geral da jornada' },
    { tipo: 'texto', html: 'São 19 passos, do primeiro "olá" ao acompanhamento pós-instalação. Os passos <strong>1 a 6</strong> são do closer (abrir, criar relação, entender e coletar). O <strong>7</strong> é a ponte para o especialista. Os <strong>8 a 13</strong> constroem e apresentam a solução (com o especialista). Os <strong>14 a 19</strong> fecham, instalam e acompanham.' },
    { tipo: 'tabela',
      head: ['Fase', 'Passos', 'Quem lidera'],
      rows: [
        ['Relacionamento e descoberta', '1–6', 'Closer'],
        ['Ponte técnica', '7', 'Closer → Especialista'],
        ['Solução e diagnóstico', '8–13', 'Especialista (com o closer)'],
        ['Fechamento e execução', '14–17', 'Closer / Equipe técnica'],
        ['Estabilização e relação', '18–19', 'Especialista / Closer'],
      ]
    },

    // ---------------------------------------------------------------- 1
    { tipo: 'titulo', texto: '1. Abertura' },
    { tipo: 'texto', html: 'Estabeleça presença, cortesia e o motivo do contato. Nada de despejar solução — o objetivo é abrir espaço para o cliente falar.' },
    { tipo: 'script', titulo: 'Script de abertura',
      fala: 'Oi, [nome], aqui é [seu nome], da Tudo de Filtro. Vi que você procurou a gente por causa da água do seu poço. Posso te fazer algumas perguntas rápidas pra entender direitinho a sua situação? Assim eu te oriento com responsabilidade, sem te empurrar nada antes da hora.' },

    // ---------------------------------------------------------------- 2
    { tipo: 'titulo', texto: '2. Rapport' },
    { tipo: 'texto', html: 'Crie relação genuína. Poço é assunto pessoal — muita gente convive com aquela água há anos. Reconheça o contexto e escute mais do que fala.' },
    { tipo: 'dodont',
      fazer: [
        'Usar o nome do cliente e o vocabulário dele.',
        'Validar a preocupação ("faz sentido você querer resolver isso").',
        'Demonstrar que entende a rotina de quem depende de poço.',
      ],
      evitar: [
        'Assustar com termos técnicos logo de cara.',
        'Julgar ("como você bebe essa água?").',
        'Falar mais que o cliente na fase de relação.',
      ]
    },

    // ---------------------------------------------------------------- 3
    { tipo: 'titulo', texto: '3. Entendimento do problema' },
    { tipo: 'texto', html: 'Aprofunde a dor com as perguntas do bloco PROBLEMA do Módulo 16: cor, cheiro, gosto, manchas, incrustação, lodo, relato microbiológico, sazonalidade. Anote com as palavras do cliente.' },
    { tipo: 'perguntas', titulo: 'Reforce aqui', itens: [
      'O que te fez procurar tratamento agora?',
      'Tem cor, cheiro, gosto, mancha, incrustação ou lodo?',
      'É constante ou aparece em certas épocas?',
      'Alguém já relatou sintoma associado à água?',
    ]},
    { tipo: 'callout', variante: 'alerta', titulo: 'Sintoma é pista, não diagnóstico',
      html: 'Não converta sintoma em solução aqui ("isso é ferro, resolvo com X"). Registre e leve para a análise confirmar. E se surgir relato microbiológico, nitrato, agrotóxico ou uso crítico, prepare o handoff para o especialista (Módulo 20).' },

    // ---------------------------------------------------------------- 4
    { tipo: 'titulo', texto: '4. Solicitação da análise' },
    { tipo: 'texto', html: 'Este é o passo que trava o resto: <strong>sem laudo, não há solução</strong>. Peça a análise completa ou agende a coleta. Posicione isso como proteção ao cliente, não como burocracia.' },
    { tipo: 'script', titulo: 'Script de solicitação da análise',
      fala: 'Pra eu te orientar certo, o ponto de partida é a análise da sua água. Se você já tem um laudo recente, me manda ele completo, com todas as páginas. Se não tiver, ou for antigo, a gente organiza uma coleta. É a análise que mostra o que realmente precisa ser tratado — sem ela, qualquer equipamento é chute, e eu não vou te vender chute.' },
    { tipo: 'checklist', titulo: 'O laudo precisa vir:', itens: [
      'Recente (representa a água de hoje)',
      'Completo (todas as páginas e parâmetros)',
      'Com laboratório identificado',
      'Cobrindo físico, químico e microbiológico quando aplicável',
    ]},
    { tipo: 'pendente', html: 'Laboratórios parceiros, kit de coleta e prazo de validade do laudo: <strong>pendente de validação técnica pela Tudo de Filtro</strong>.' },

    // ---------------------------------------------------------------- 5
    { tipo: 'titulo', texto: '5. Sondagem hidráulica' },
    { tipo: 'texto', html: 'Em paralelo à análise, levante a hidráulica (bloco HIDRÁULICA do Módulo 16): vazão da bomba e do poço, pressão, tubulação, reservação, consumo, pico, retrolavagem e dreno. É o que permite dimensionar sem estrangular a água da casa.' },
    { tipo: 'callout', variante: 'perigo', titulo: 'A trava dupla',
      html: 'Análise <strong>e</strong> sondagem hidráulica são pré-requisito. Faltando qualquer uma, <strong>não existe proposta, preço ou promessa</strong>. Você coleta; o especialista dimensiona.' },

    // ---------------------------------------------------------------- 6
    { tipo: 'titulo', texto: '6. Identificação do objetivo' },
    { tipo: 'texto', html: 'Alinhe o que é sucesso para o cliente: parar de manchar roupa? Ter água segura para beber? Proteger equipamentos? Atender uma exigência de obra/licitação? O objetivo orienta a prioridade da solução — e a expectativa realista.' },
    { tipo: 'perguntas', titulo: 'Perguntas de objetivo', itens: [
      'Se a gente resolver isso do jeito certo, o que muda pra você no dia a dia?',
      'Qual é a prioridade número um: consumo humano, proteção de equipamento, estética da água?',
      'Existe alguma exigência formal a cumprir (obra, licitação, responsável técnico)?',
    ]},

    // ---------------------------------------------------------------- 7
    { tipo: 'titulo', texto: '7. Envolvimento do especialista técnico' },
    { tipo: 'texto', html: 'Com contexto, sintomas, laudo e hidráulica em mãos, faça a ponte para o especialista. Ele é quem interpreta o laudo, dimensiona e define a solução. Apresente isso como um ganho para o cliente — acesso a quem realmente projeta.' },
    { tipo: 'script', titulo: 'Script de ponte para o especialista',
      fala: 'Com a sua análise e os dados da sua instalação, o próximo passo é o nosso especialista técnico montar o diagnóstico. É ele quem lê o laudo e dimensiona a solução certa pro seu caso — nem a mais, nem a menos. Vou organizar tudo e trazer ele pra essa conversa. Assim você recebe um projeto pensado, não um equipamento genérico.' },
    { tipo: 'especialista', nome: 'diagnóstico', icon: '🧑‍🔬',
      html: 'É aqui que eu entro. Me traga o laudo completo e a hidráulica organizada, e eu monto o diagnóstico. Sem esses dois, eu não projeto nada — e você não deve prometer nada.' },

    // ---------------------------------------------------------------- 8
    { tipo: 'titulo', texto: '8. Desenvolvimento da solução' },
    { tipo: 'texto', html: 'O especialista cruza os parâmetros fora do padrão com a hidráulica e define as <strong>etapas de tratamento compatíveis</strong>. O closer acompanha, aprende e traduz — mas não inventa etapas nem produtos.' },
    { tipo: 'pendente', html: 'Combinação de etapas, tecnologias, mídias e dimensionamento: <strong>definido pelo especialista</strong> caso a caso. Nada de tabela pronta de solução por sintoma.' },

    // ---------------------------------------------------------------- 9
    { tipo: 'titulo', texto: '9. Apresentação do diagnóstico' },
    { tipo: 'texto', html: 'Traduza o diagnóstico do especialista em linguagem do cliente: o que a análise mostrou, por que aqueles parâmetros pedem tratamento e como a hidráulica influenciou o porte. Diagnóstico primeiro — solução depois.' },
    { tipo: 'dodont',
      fazer: [
        'Explicar o "porquê" antes do "o quê".',
        'Conectar cada etapa a um parâmetro/objetivo real.',
        'Manter o especialista disponível para as perguntas técnicas.',
      ],
      evitar: [
        'Prometer potabilidade ou remoção garantida.',
        'Dizer que "uma tecnologia resolve tudo".',
        'Improvisar números que não vieram do especialista.',
      ]
    },

    // ---------------------------------------------------------------- 10
    { tipo: 'titulo', texto: '10. Explicação das etapas' },
    { tipo: 'texto', html: 'Mostre o sistema como uma sequência lógica de etapas, cada uma com uma função. O cliente precisa entender que está comprando um <strong>processo</strong>, não uma caixa. Isso sustenta valor e reduz objeção de preço.' },

    // ---------------------------------------------------------------- 11
    { tipo: 'titulo', texto: '11. Apresentação da proposta' },
    { tipo: 'texto', html: 'Só agora — com diagnóstico feito — entra a proposta formal, construída pelo especialista. Apresente escopo, etapas, o que está incluso e as condições. A proposta é a materialização do diagnóstico, não um preço solto.' },
    { tipo: 'pendente', html: 'Valores, escopo comercial e condições de pagamento: <strong>pendente de validação comercial pela Tudo de Filtro</strong> / conforme proposta do especialista. Nunca antecipar preço.' },

    // ---------------------------------------------------------------- 12
    { tipo: 'titulo', texto: '12. Limitações e responsabilidades' },
    { tipo: 'callout', variante: 'perigo', titulo: 'PASSO OBRIGATÓRIO — sempre declare limitações',
      html: 'Toda proposta de poço deve deixar explícito o que o sistema <strong>faz</strong> e o que ele <strong>não garante</strong>. Nunca prometa potabilidade absoluta nem remoção 100% garantida de qualquer contaminante. Explique que o desempenho depende da manutenção, da variação da água e do uso correto, e que <strong>reanálises periódicas</strong> confirmam o resultado. Registrar limitações protege o cliente e a empresa — e é parte da venda, não uma ressalva escondida.' },
    { tipo: 'dodont',
      fazer: [
        'Declarar por escrito o escopo e as limitações do sistema.',
        'Explicar que a água pode variar (sazonal) e exige acompanhamento.',
        'Deixar claro que resultado depende de manutenção correta.',
      ],
      evitar: [
        'Prometer "água 100% pura/potável para sempre".',
        'Omitir que reanálise é necessária para confirmar.',
        'Garantir remoção total de um contaminante específico.',
      ]
    },

    // ---------------------------------------------------------------- 13
    { tipo: 'titulo', texto: '13. Plano de manutenção' },
    { tipo: 'texto', html: 'Apresente a manutenção como parte inseparável da solução: retrolavagens, reposição de mídias/insumos, verificações e reanálises. Um sistema de poço sem manutenção perde eficiência — o cliente precisa saber disso desde a proposta.' },
    { tipo: 'pendente', html: 'Periodicidade de manutenção, troca de mídias e insumos por tipo de sistema: <strong>pendente de validação técnica pela Tudo de Filtro</strong> / definir com o especialista.' },

    // ---------------------------------------------------------------- 14
    { tipo: 'titulo', texto: '14. Tratamento das objeções' },
    { tipo: 'texto', html: 'Objeções são naturais e, em poço, quase sempre nascem de informação incompleta. Conduza cada uma pela estrutura <strong>ouvir → confirmar → investigar → responder com responsabilidade → próximo passo</strong>. O catálogo completo de objeções está no Módulo 18.' },
    { tipo: 'callout', variante: 'info', titulo: 'Regra de ouro nas objeções',
      html: 'Nunca "ganhe" uma objeção prometendo potabilidade ou dizendo que uma tecnologia resolve tudo. Reconheça, eduque e reconduza para análise/hidráulica/especialista. Ver <strong>Módulo 18</strong>.' },

    // ---------------------------------------------------------------- 15
    { tipo: 'titulo', texto: '15. Fechamento' },
    { tipo: 'texto', html: 'Com diagnóstico aceito, limitações declaradas e manutenção alinhada, conduza a decisão. Recapitule o valor (o processo, não a caixa) e confirme escopo, condições e próximos passos combinados.' },
    { tipo: 'checklist', titulo: 'Antes de fechar, confirme:', itens: [
      'Diagnóstico compreendido e aceito pelo cliente',
      'Limitações e responsabilidades declaradas e registradas',
      'Plano de manutenção apresentado',
      'Decisor de acordo e condições alinhadas',
    ]},

    // ---------------------------------------------------------------- 16
    { tipo: 'titulo', texto: '16. Agendamento da instalação' },
    { tipo: 'texto', html: 'Combine data, pré-requisitos de obra/local, ponto de dreno e responsabilidades de cada lado. Alinhe expectativa de tempo e do que muda no local. Prazos e escopo de instalação seguem a definição técnica.' },
    { tipo: 'pendente', html: 'Prazos de instalação, requisitos de local e responsabilidades de obra: <strong>conforme definição do especialista/equipe técnica</strong>. Não prometer prazo sem confirmação.' },

    // ---------------------------------------------------------------- 17
    { tipo: 'titulo', texto: '17. Comissionamento' },
    { tipo: 'texto', html: 'É a colocação em operação: ajuste, verificação inicial, orientação de uso e retrolavagem. Momento de reforçar como o cliente opera e mantém o sistema no dia a dia.' },

    // ---------------------------------------------------------------- 18
    { tipo: 'titulo', texto: '18. Nova análise' },
    { tipo: 'callout', variante: 'perigo', titulo: 'PASSO OBRIGATÓRIO — reanálise após estabilização',
      html: 'Depois de o sistema estabilizar, uma <strong>nova análise</strong> confirma o resultado do tratamento. Isso <strong>não é opcional</strong>: é parte do processo, é o que transforma promessa em evidência e protege cliente e empresa. Nunca declare sucesso pela aparência da água — declare pela reanálise. O prazo e o escopo dessa reanálise seguem a orientação do especialista.' },
    { tipo: 'pendente', html: 'Janela ideal para a reanálise pós-instalação e parâmetros a reavaliar: <strong>definir com o especialista</strong>.' },

    // ---------------------------------------------------------------- 19
    { tipo: 'titulo', texto: '19. Pós-venda' },
    { tipo: 'texto', html: 'A relação continua: acompanhamento da manutenção, lembretes de reanálise, suporte e revisão de necessidades ao longo do tempo. Poço é cliente de longo prazo — bom pós-venda gera indicação, recompra de insumos e confiança.' },
    { tipo: 'dodont',
      fazer: [
        'Registrar o ciclo de manutenção e reanálise no CRM.',
        'Acompanhar sazonalidade (a água muda ao longo do ano).',
        'Tratar o cliente como relação contínua, não venda única.',
      ],
      evitar: [
        'Sumir depois da instalação.',
        'Deixar o cliente sem lembrete de reanálise/manutenção.',
        'Prometer que "agora está resolvido para sempre".',
      ]
    },

    { tipo: 'especialista', nome: 'processo', icon: '🧑‍🔬',
      html: 'A venda de poço bem-feita é uma sequência: você abre e qualifica, eu diagnostico e dimensiono, a proposta declara limitações, e a reanálise comprova. Cada passo no lugar certo — é assim que a gente entrega resultado de verdade.' },

    { tipo: 'callout', variante: 'sucesso', titulo: 'PRÓXIMO PASSO',
      html: 'Domine a jornada na ordem: nunca ofereça solução ou preço antes de <strong>análise + sondagem hidráulica</strong>; sempre envolva o <strong>especialista</strong> para diagnosticar e dimensionar; <strong>declare limitações</strong> na proposta; e trate a <strong>reanálise</strong> como parte obrigatória. Em seguida, estude o Módulo 18 (objeções) e o Módulo 20 (quando parar e escalar).' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Em qual passo o closer pode, pela primeira vez, apresentar preço/proposta?',
      opcoes: [
        'Logo na abertura, para qualificar interesse.',
        'Só no passo 11, depois de análise, sondagem hidráulica e diagnóstico do especialista.',
        'No rapport, para criar urgência.',
      ],
      correta: 1,
      explicacao: 'Proposta é a materialização do diagnóstico. Sem análise + hidráulica + especialista, não há preço — a ordem da jornada existe para proteger cliente e empresa.'
    },
    {
      pergunta: 'Por que o passo 12 (limitações e responsabilidades) é obrigatório?',
      opcoes: [
        'Para deixar a proposta mais longa.',
        'Porque toda proposta de poço deve declarar o que o sistema faz e o que não garante — nunca prometer potabilidade absoluta nem remoção 100%.',
        'Porque o cliente exige garantia total.',
      ],
      correta: 1,
      explicacao: 'Declarar limitações protege cliente e empresa e faz parte da venda. Prometer potabilidade absoluta ou remoção garantida é proibido.'
    },
    {
      pergunta: 'Depois da instalação e estabilização, qual é o passo obrigatório antes de declarar sucesso?',
      opcoes: [
        'Olhar se a água ficou transparente.',
        'Fazer uma nova análise (reanálise) para confirmar o resultado, conforme orientação do especialista.',
        'Perguntar ao cliente se ele gostou.',
      ],
      correta: 1,
      explicacao: 'A reanálise após estabilização é parte do processo. Sucesso se comprova por laudo, não por aparência.'
    },
  ],

  exercicio: {
    enunciado: 'Escreva o roteiro de uma conversa de venda de poço cobrindo os passos 1 a 7 (abertura até envolver o especialista) para um cliente que quer água segura para beber. Inclua o script de abertura e o de solicitação da análise, e mostre onde você trava a proposta até ter laudo + hidráulica.',
    dica: 'Use os scripts prontos como base e adapte ao objetivo "consumo humano". Não avance para solução/preço — pare no handoff ao especialista.'
  },

  resumo: 'A venda de poço é uma jornada de 19 passos com ordem inegociável: o closer abre, cria relação, entende o problema, solicita a análise, faz a sondagem hidráulica e identifica o objetivo; o especialista é envolvido para diagnosticar, dimensionar e propor. Proposta e preço só depois de análise + hidráulica. Os passos 12 (limitações e responsabilidades) e 18 (nova análise) são obrigatórios: nunca se promete potabilidade ou remoção garantida, e o sucesso se comprova por reanálise, não por aparência. Sempre encerrar com PRÓXIMO PASSO.'
};
