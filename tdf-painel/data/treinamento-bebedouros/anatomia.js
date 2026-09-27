// ============================================================================
// ANATOMIA INTERATIVA — componentes do bebedouro industrial
// Cada componente vira um "hotspot" clicável no Módulo 2.
// x/y = posição percentual sobre a imagem /img/treinamento-bebedouros/bebedouro-04.webp
// Campos: oque / serve / beneficio / comoExplicar / naoPrometer  (regra do briefing)
// Fonte dos dados técnicos: site oficial + informações da empresa. Nada inventado.
// ============================================================================

const ANATOMIA = {
  imagem: '/img/treinamento-bebedouros/bebedouro-04.webp',
  componentes: [
    { id: 'estrutura', nome: 'Estrutura em inox', icon: '🪞', x: 50, y: 45,
      oque: 'A carcaça e o corpo do equipamento são feitos em aço inox.',
      serve: 'Sustentação, higiene e resistência à corrosão em ambiente de uso pesado.',
      beneficio: 'Durabilidade e aparência de qualidade — aguenta empresa, indústria, obra.',
      comoExplicar: '"A estrutura é toda em inox, feita para uso intenso e fácil de higienizar."',
      naoPrometer: 'Não prometer que "inox nunca mancha" nem grau específico da carcaça sem confirmar.' },

    { id: 'reservatorio', nome: 'Reservatório interno', icon: '🛢️', x: 50, y: 30,
      oque: 'Reservatório em polietileno rotomoldado atóxico onde a água fica armazenada e gelada.',
      serve: 'Armazenar a água resfriada pronta para consumo.',
      beneficio: 'Material atóxico e volume dimensionado para a demanda do ambiente.',
      comoExplicar: '"O reservatório é atóxico e mantém a água pronta. Mas o que importa não é só o volume — é a capacidade de repor água gelada no pico."',
      naoPrometer: 'Não tratar a capacidade do reservatório como "litros por dia". Não prometer potabilidade.' },

    { id: 'compressor', nome: 'Compressor', icon: '⚙️', x: 50, y: 78,
      oque: 'O motor da refrigeração. Modelos 15/25/60 L usam 1/10; 100/200 L usam 1/5.',
      serve: 'Resfriar a água e recuperar a temperatura após o consumo.',
      beneficio: 'Nos modelos maiores, o 1/5 recupera mais rápido — melhor no horário de pico.',
      comoExplicar: '"Além do reservatório, olhamos a capacidade de recuperação. Nos maiores usamos compressor 1/5, preparado para demanda intensa."',
      naoPrometer: 'Não prometer percentual de economia de energia sem laudo.' },

    { id: 'ventoinha', nome: 'Ventoinha', icon: '🌀', x: 68, y: 72,
      oque: 'Ventilador que auxilia na dissipação do calor gerado pela refrigeração.',
      serve: 'Tirar o calor do sistema para o compressor trabalhar melhor.',
      beneficio: 'Ajuda na recuperação da temperatura e no desempenho em pico.',
      comoExplicar: '"A ventoinha ajuda a dissipar o calor. Por isso não pode encostar o equipamento na parede nem bloquear a ventilação."',
      naoPrometer: 'Não prometer nível de ruído específico sem confirmar.' },

    { id: 'serpentina', nome: 'Serpentina inox 304', icon: '🌡️', x: 40, y: 60,
      oque: 'Serpentina interna em aço inox 304 por onde a água é resfriada.',
      serve: 'Trocar calor e gelar a água com material de qualidade alimentar.',
      beneficio: 'Inox 304 (padrão sanitário) — melhor percepção de qualidade e higiene.',
      comoExplicar: '"A serpentina é em inox 304, o mesmo padrão usado em equipamentos de qualidade alimentar."',
      naoPrometer: 'Não citar certificações/normas que não estejam confirmadas.' },

    { id: 'termostato', nome: 'Termostato regulável', icon: '🎚️', x: 32, y: 40,
      oque: 'Controle que regula a temperatura da água.',
      serve: 'Ajustar o quão gelada a água sai.',
      beneficio: 'Adapta ao gosto do cliente e à estação.',
      comoExplicar: '"O termostato é regulável — dá para ajustar a temperatura conforme a preferência."',
      naoPrometer: 'Não prometer temperatura exata em graus sem medição.' },

    { id: 'pes', nome: 'Pés reguláveis', icon: '🦶', x: 50, y: 92,
      oque: 'Pés que regulam a altura/nivelamento do equipamento.',
      serve: 'Nivelar em piso irregular e estabilizar.',
      beneficio: 'Instalação firme mesmo em piso de obra/indústria.',
      comoExplicar: '"Os pés são reguláveis, então nivela bem mesmo em piso irregular."',
      naoPrometer: 'Nada a prometer além do que é.' },

    { id: 'torneiras', nome: 'Torneiras metálicas', icon: '🚰', x: 50, y: 55,
      oque: 'Torneiras de metal — modelo Copo (rosca) ou Jato (pressão).',
      serve: 'Ponto de saída da água para o usuário.',
      beneficio: 'Metal resiste ao uso intenso; menos quebra que plástico simples; fácil reposição.',
      comoExplicar: '"As torneiras são metálicas, feitas para dezenas ou centenas de usos por dia."',
      naoPrometer: 'Regra interna: torneira jato tem custo adicional e não vem com copo — confirmar na proposta.' },

    { id: 'refil', nome: 'Refil Acquabios Multi', icon: '💧', x: 32, y: 55,
      oque: 'Elemento filtrante Acquabios Multi. Responsável pela FILTRAGEM (diferente da refrigeração).',
      serve: 'Filtrar a água antes de ser gelada. O 1º refil acompanha como brinde.',
      beneficio: 'Filtragem + primeiro refil incluso. Trocas seguem orientação e condição da água.',
      comoExplicar: '"O refil cuida da filtragem, que é diferente da refrigeração. O primeiro já vem de brinde."',
      naoPrometer: 'Não prometer que "só o refil resolve" água de poço ou água com problema aparente — encaminhar avaliação técnica.' },

    { id: 'entrada', nome: 'Entrada de água / ligação', icon: '🔌', x: 68, y: 88,
      oque: 'Conexão de entrada de água da rede + ligação elétrica.',
      serve: 'Alimentar o equipamento com água e energia.',
      beneficio: 'Ligado direto na rede — sem logística de galão.',
      comoExplicar: '"Ele liga no ponto de água e na tomada. Por isso precisamos confirmar voltagem e se há ponto hidráulico."',
      naoPrometer: 'Não confirmar voltagem sem perguntar (110/220). Não prometer instalação inclusa sem confirmar.' },
  ],
};

module.exports = { ANATOMIA };
