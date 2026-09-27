// ============================================================================
// MÓDULO 7 — ICP: Perfil de Cliente Ideal
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// Um card por segmento: dor principal, critério de decisão, perguntas-chave e
// potencial de múltiplas unidades. Objetivo, sem inventar specs.
// ============================================================================

module.exports = {
  resumoCurto: 'O que é ICP, por que ele orienta a abordagem e como cada segmento (indústria, escola, hospital, obra, condomínio e outros) tem dor, critério de decisão e potencial de expansão diferentes.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-07-video' },

  blocos: [
    { tipo: 'texto', html: '<strong>ICP</strong> (Ideal Customer Profile, ou Perfil de Cliente Ideal) é a descrição de <strong>quem compra melhor, mais rápido e com menos objeção</strong> o bebedouro industrial. Não é sobre "quem pode comprar" — quase todo mundo pode. É sobre <strong>onde a dor é real e o consumo justifica o equipamento</strong>.' },
    { tipo: 'texto', html: 'Dominar o ICP muda a conversa: em vez de um discurso genérico, você fala a <strong>dor específica daquele segmento</strong>, faz as perguntas certas e já identifica se há <strong>potencial de múltiplas unidades</strong> — um galpão grande, uma escola com vários andares ou uma obra com frentes espalhadas raramente resolvem com um só ponto de água.' },

    { tipo: 'callout', variante: 'info', titulo: 'ICP não substitui o dimensionamento',
      html: 'O segmento diz por onde <strong>começar a conversa</strong>. Mas o modelo certo continua vindo do <strong>pico de consumo simultâneo</strong> e da recuperação de temperatura — nunca do total de pessoas nem do "tipo de empresa" isolado.' },

    { tipo: 'titulo', texto: 'Segmentos e como abordar cada um' },
    { tipo: 'cards', itens: [
      { icon: '🏭', titulo: 'Indústria',
        html: '<strong>Dor:</strong> muita gente, turnos e calor de operação; água quente derruba o conforto e a NR de bem-estar. <strong>Decisão:</strong> robustez, recuperação no pico e continuidade. <strong>Perguntas:</strong> quantos por turno? Intervalos concentrados? Voltagem e pontos de água? <strong>Múltiplas unidades:</strong> alto — vários setores e galpões.' },
      { icon: '🏗️', titulo: 'Fábrica',
        html: '<strong>Dor:</strong> linha de produção não pode parar para trocar galão. <strong>Decisão:</strong> vazão contínua e estrutura em inox que aguenta uso pesado. <strong>Perguntas:</strong> efetivo por turno? Onde ficam as pausas? Rede de água disponível? <strong>Múltiplas unidades:</strong> alto — por setor produtivo.' },
      { icon: '📦', titulo: 'Galpão',
        html: '<strong>Dor:</strong> ambiente amplo e quente, pessoal disperso longe de um ponto único. <strong>Decisão:</strong> cobertura do espaço e recuperação no pico. <strong>Perguntas:</strong> área e distância entre postos? Pico simultâneo? <strong>Múltiplas unidades:</strong> alto — distribuir pontos vale mais que um só grande.' },
      { icon: '🚚', titulo: 'Centro logístico',
        html: '<strong>Dor:</strong> turnos, alta rotatividade e picos nos intervalos de expedição. <strong>Decisão:</strong> volume no pico e baixa manutenção. <strong>Perguntas:</strong> quantos por turno e por doca? Intervalos coincidem? <strong>Múltiplas unidades:</strong> alto — por área operacional.' },
      { icon: '🏢', titulo: 'Escritório',
        html: '<strong>Dor:</strong> reclamação de água quente e logística de galão no corporativo. <strong>Decisão:</strong> praticidade, estética e conforto do time. <strong>Perguntas:</strong> quantas pessoas no andar? Um ponto por pavimento? <strong>Múltiplas unidades:</strong> médio — um por andar em prédios maiores.' },
      { icon: '💪', titulo: 'Academia',
        html: '<strong>Dor:</strong> pico intenso nos horários de aula; aluno reclama de água quente na hora do treino. <strong>Decisão:</strong> recuperação rápida no pico, não o total de matriculados. <strong>Perguntas:</strong> quantos alunos no mesmo horário? Horários de pico? <strong>Múltiplas unidades:</strong> médio — por sala/andar.' },
      { icon: '🏫', titulo: 'Escola',
        html: '<strong>Dor:</strong> recreio concentra centenas de alunos em minutos. <strong>Decisão:</strong> pico altíssimo e curto, estrutura resistente ao uso infantil. <strong>Perguntas:</strong> alunos por turno e no recreio? Quantos pátios/andares? <strong>Múltiplas unidades:</strong> alto — por pátio e por andar.' },
      { icon: '🎓', titulo: 'Universidade',
        html: '<strong>Dor:</strong> grande circulação, vários blocos e intervalos entre aulas. <strong>Decisão:</strong> cobertura de campus e volume no pico. <strong>Perguntas:</strong> quantos blocos? Fluxo entre aulas? Compras por licitação? <strong>Múltiplas unidades:</strong> muito alto — por bloco/andar.' },
      { icon: '🏥', titulo: 'Hospital',
        html: '<strong>Dor:</strong> funcionamento 24h, acompanhantes e equipes; conforto e higiene contam. <strong>Decisão:</strong> confiabilidade contínua e estrutura em inox. <strong>Perguntas:</strong> alas e andares? Público interno e visitantes? Setor de compras? <strong>Múltiplas unidades:</strong> muito alto — por ala.' },
      { icon: '🩺', titulo: 'Clínica',
        html: '<strong>Dor:</strong> sala de espera e equipe pedem conforto sem logística de galão. <strong>Decisão:</strong> praticidade e boa aparência. <strong>Perguntas:</strong> movimento no pico de atendimento? Um ponto resolve? <strong>Múltiplas unidades:</strong> baixo a médio — geralmente ponto único.' },
      { icon: '👷', titulo: 'Construção civil',
        html: '<strong>Dor:</strong> calor pesado, NR de bem-estar do trabalhador e frentes espalhadas. <strong>Decisão:</strong> robustez de obra e volume no pico. <strong>Perguntas:</strong> efetivo na obra? Frentes/andares distantes? Voltagem no canteiro? <strong>Múltiplas unidades:</strong> alto — por frente de trabalho.' },
      { icon: '🥐', titulo: 'Padaria',
        html: '<strong>Dor:</strong> calor do forno e fluxo de clientes e equipe ao longo do dia. <strong>Decisão:</strong> uso contínuo e estrutura resistente. <strong>Perguntas:</strong> pico de movimento? Equipe mais clientes? <strong>Múltiplas unidades:</strong> baixo — normalmente um ponto.' },
      { icon: '🍽️', titulo: 'Restaurante',
        html: '<strong>Dor:</strong> pico de almoço concentra clientes e equipe em pouco tempo. <strong>Decisão:</strong> recuperação rápida no pico e higiene. <strong>Perguntas:</strong> lugares e giro no almoço? Salão e cozinha separados? <strong>Múltiplas unidades:</strong> médio — salão e área interna.' },
      { icon: '🛒', titulo: 'Supermercado',
        html: '<strong>Dor:</strong> equipe grande em turnos e área extensa de loja/estoque. <strong>Decisão:</strong> volume no pico e baixa manutenção. <strong>Perguntas:</strong> colaboradores por turno? Loja e depósito? <strong>Múltiplas unidades:</strong> médio a alto — loja e retaguarda.' },
      { icon: '⛪', titulo: 'Igreja',
        html: '<strong>Dor:</strong> pico enorme e curto no fim dos cultos, com voluntários e fiéis juntos. <strong>Decisão:</strong> pico simultâneo alto em janelas específicas. <strong>Perguntas:</strong> público por culto? Quantos cultos/dia? Áreas de convivência? <strong>Múltiplas unidades:</strong> médio — templo e anexos.' },
      { icon: '🏘️', titulo: 'Condomínio',
        html: '<strong>Dor:</strong> áreas comuns, salão de festas e portaria pedem água gelada disponível. <strong>Decisão:</strong> decisão coletiva (síndico/assembleia) e custo-benefício. <strong>Perguntas:</strong> áreas comuns atendidas? Quem decide e qual o orçamento aprovado? <strong>Múltiplas unidades:</strong> médio — por área comum.' },
      { icon: '🏛️', titulo: 'Órgão público',
        html: '<strong>Dor:</strong> muitos servidores e público atendido; regras de compra específicas. <strong>Decisão:</strong> costuma passar por licitação — especificação e conformidade pesam. <strong>Perguntas:</strong> é compra direta ou licitação? Quantos pontos previstos? <strong>Múltiplas unidades:</strong> alto — por setor/andar.' },
      { icon: '🎪', titulo: 'Evento',
        html: '<strong>Dor:</strong> picos altíssimos e temporários com grande público simultâneo. <strong>Decisão:</strong> volume máximo no pico e praticidade de instalação. <strong>Perguntas:</strong> público estimado? Duração e pontos de distribuição? Compra ou locação? <strong>Múltiplas unidades:</strong> alto — por área do evento.' },
      { icon: '🛠️', titulo: 'Revendedor',
        html: '<strong>Dor:</strong> quer margem, giro e um produto que não gere dor de cabeça pós-venda. <strong>Decisão:</strong> condição comercial, confiabilidade e suporte da marca. <strong>Perguntas:</strong> volume de compra? Perfil dos clientes dele? Precisa de material de apoio? <strong>Múltiplas unidades:</strong> alto por natureza — compra recorrente para revenda.' },
    ]},

    { tipo: 'checklist', titulo: 'Leitura rápida de qualquer segmento',
      itens: [
        'Onde está o pico de consumo simultâneo (não o total de pessoas)?',
        'O ambiente é quente e exige mais do compressor?',
        'É um ponto único ou vários pontos distribuídos?',
        'Há previsão de expansão / múltiplas unidades?',
        'A compra é direta, coletiva (assembleia) ou por licitação?',
      ]
    },

    { tipo: 'dodont',
      fazer: [
        'Adaptar a dor e as perguntas ao segmento na frente.',
        'Investigar potencial de múltiplas unidades já na descoberta.',
        'Identificar cedo se a compra passa por licitação ou assembleia.',
      ],
      evitar: [
        'Usar o mesmo discurso genérico para todos os segmentos.',
        'Recomendar modelo pelo total de pessoas do segmento.',
        'Prometer potabilidade ou economia de energia para fechar mais rápido.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual segmento costuma ter o pico mais concentrado e curto, exigindo forte recuperação de temperatura?',
      opcoes: [
        'Clínica pequena.',
        'Escola no recreio.',
        'Escritório distribuído ao longo do dia.',
      ],
      correta: 1,
      explicacao: 'O recreio junta centenas de alunos em poucos minutos: pico altíssimo e curto, onde a recuperação de temperatura é decisiva.'
    },
    {
      pergunta: 'Ao atender um órgão público, o que você identifica logo cedo?',
      opcoes: [
        'A cor preferida do equipamento.',
        'Se a compra é direta ou por licitação, porque muda todo o processo.',
        'Se eles já têm galão.',
      ],
      correta: 1,
      explicacao: 'Órgãos públicos costumam comprar por licitação. Saber isso cedo define especificação, prazos e a forma de conduzir a negociação.'
    },
    {
      pergunta: 'Um galpão grande com pessoal disperso pede o quê?',
      opcoes: [
        'Sempre um único bebedouro de 200 litros no centro.',
        'Avaliar múltiplos pontos distribuídos conforme o pico em cada área.',
        'O menor modelo, para economizar.',
      ],
      correta: 1,
      explicacao: 'Em áreas amplas, distribuir pontos costuma servir melhor que forçar um único equipamento grande — e há potencial de múltiplas unidades.'
    },
  ],

  exercicio: {
    enunciado: 'Escolha dois segmentos bem diferentes (por exemplo, academia e hospital) e escreva, para cada um, a dor principal, uma pergunta-chave que você faria e por que há (ou não) potencial de múltiplas unidades.',
    dica: 'Lembre que o segmento define por onde começar a conversa, mas o modelo vem sempre do pico simultâneo e da recuperação de temperatura.'
  },

  resumo: 'ICP é o perfil de cliente onde a dor é real e o consumo justifica o equipamento. Cada segmento tem dor, critério de decisão e potencial de múltiplas unidades diferentes — indústria, galpão, escola, universidade, hospital, obra e órgão público tendem a várias unidades; clínica e padaria costumam ser ponto único. O segmento orienta a abordagem, mas o modelo continua vindo do pico simultâneo e da recuperação de temperatura.'
};
