// ============================================================================
// MÓDULO 16 — Roteiro de qualificação comercial (água de poço)
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js
// Blocos: texto | titulo | callout | card | cards | script | dodont |
//         checklist | tabela | perguntas | exemplo | pendente | especialista
// REGRA: NÃO prometer potabilidade nem remoção garantida. NÃO dar preço/solução
// antes de análise + sondagem hidráulica. Especificidade técnica → `pendente`
// ou "envolver o especialista". Sempre terminar com PRÓXIMO PASSO.
// ============================================================================

module.exports = {
  resumoCurto: 'O roteiro de perguntas que qualifica um poço antes de qualquer proposta: contexto, problema, análise, hidráulica e processo de compra. Sem análise + hidráulica, não há proposta.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-16-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'A trava que abre este módulo',
      html: 'Qualificar não é "adivinhar a solução". É <strong>coletar contexto, problema, análise e hidráulica</strong> para o especialista dimensionar. Enquanto faltar <strong>análise laboratorial recente</strong> E <strong>sondagem hidráulica</strong>, você <strong>não apresenta proposta, não dá preço e não promete remoção de nada</strong>. Seu papel aqui é educar e organizar a informação.' },

    { tipo: 'titulo', texto: 'Como usar este roteiro' },
    { tipo: 'texto', html: 'As perguntas estão agrupadas em 5 blocos: <strong>Contexto → Problema → Análise → Hidráulica → Processo de compra</strong>. Não precisa disparar tudo de uma vez nem parecer interrogatório — puxe conversa, anote no CRM e volte ao que ficou em aberto. Cada resposta é um dado que o especialista vai precisar. O que você <strong>não</strong> souber preencher vira pendência, não chute.' },
    { tipo: 'cards', itens: [
      { icon: '🧭', titulo: 'Contexto', html: 'Onde fica o poço, quem usa e para quê.' },
      { icon: '🚩', titulo: 'Problema', html: 'O que incomoda, desde quando, com que frequência.' },
      { icon: '🧪', titulo: 'Análise', html: 'Existe laudo? Quais parâmetros fora? Quem coletou?' },
      { icon: '🔧', titulo: 'Hidráulica', html: 'Vazão, pressão, reservação, consumo, retrolavagem.' },
      { icon: '🤝', titulo: 'Processo de compra', html: 'Quem decide, prazo, obra, pagamento, projeto/ART.' },
    ]},

    // ---------------------------------------------------------------- CONTEXTO
    { tipo: 'titulo', texto: '1. CONTEXTO — entender o cenário' },
    { tipo: 'texto', html: 'Antes de qualquer coisa técnica, entenda <strong>onde</strong> essa água nasce e <strong>como</strong> ela é usada. Isso muda todo o resto.' },
    { tipo: 'perguntas', titulo: 'Perguntas de contexto', itens: [
      'Onde fica o poço — zona rural, urbana, chácara, indústria, condomínio? Em que cidade/região?',
      'Que tipo de captação é? Poço artesiano, semiartesiano, cisterna/escavado, mina ou nascente?',
      'Para que a água é usada? Consumo humano (beber/cozinhar), banho, irrigação, animais, processo industrial, produção de alimentos?',
      'Quem utiliza essa água? Quantas pessoas/famílias, ou é uso comercial/coletivo?',
      'Existe outra fonte de água no local? Rede pública como alternativa, caixa compartilhada, mais de um poço?',
      'Há quanto tempo usam esse poço? É poço novo, antigo, recém-perfurado ou reativado?',
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Por que isso importa',
      html: 'Uso para consumo humano exige o cuidado máximo com potabilidade — que <strong>só a análise</strong> responde. Uso coletivo, industrial ou em produção de alimentos costuma pedir <strong>o especialista desde o começo</strong>. Anote o uso com clareza: ele define o nível de responsabilidade da conversa.' },

    // ---------------------------------------------------------------- PROBLEMA
    { tipo: 'titulo', texto: '2. PROBLEMA — o que levou o cliente até aqui' },
    { tipo: 'texto', html: 'Ninguém procura tratamento à toa. Descubra a <strong>dor real</strong> e desde quando ela aparece. Sintoma é pista — não é diagnóstico.' },
    { tipo: 'perguntas', titulo: 'Perguntas de problema', itens: [
      'O que exatamente levou você a procurar tratamento agora? Qual foi o gatilho?',
      'A água tem alguma cor? (amarelada, avermelhada, esverdeada, esbranquiçada, escura)',
      'Sente algum cheiro? (ovo podre/enxofre, cloro, terra/mofo, metálico, químico)',
      'Tem algum gosto diferente? (metálico, salgado, amargo, adstringente)',
      'Aparecem manchas? Onde — em roupas, louças, pisos, box, metais, vaso sanitário?',
      'Há incrustação/crosta em torneiras, chuveiro, resistência, canos ou aparelhos?',
      'Existe lodo, borra ou material que decanta quando a água fica parada?',
      'Já teve resultado microbiológico apontado (coliformes, E. coli) em algum exame?',
      'Alguém reclamou de sintoma associado à água? (mal-estar, pele, sabor no café/comida)',
      'Esse problema é constante ou aparece só em certas épocas — chuva, seca, uso intenso?',
    ]},
    { tipo: 'dodont',
      fazer: [
        'Anotar o sintoma com as palavras do cliente (ex.: "mancha laranja na roupa").',
        'Perguntar "desde quando" e "com que frequência" — sazonal muda a hipótese.',
        'Tratar sintoma como pista que a análise vai confirmar.',
      ],
      evitar: [
        'Cravar a causa pelo sintoma ("mancha laranja é ferro, resolvo com X").',
        'Prometer que o tratamento acaba com o sintoma antes de análise + hidráulica.',
        'Minimizar relato microbiológico — isso escala direto para o especialista.',
      ]
    },
    { tipo: 'callout', variante: 'alerta', titulo: 'Sinais que interrompem a venda',
      html: 'Se aparecer <strong>relato microbiológico</strong>, suspeita de <strong>nitrato/nitrito</strong>, contexto de <strong>agrotóxico</strong>, ou uso <strong>industrial/alimentício/hospitalar</strong>, pare de qualificar como venda simples e <strong>envolva o especialista</strong> (ver Módulo 20). Sintoma de saúde não é objeção comercial — é risco sanitário.' },

    // ---------------------------------------------------------------- ANÁLISE
    { tipo: 'titulo', texto: '3. ANÁLISE — a base de tudo' },
    { tipo: 'texto', html: 'A análise laboratorial é o coração do processo. Sem ela, <strong>ninguém</strong> — nem o melhor especialista — sabe o que a água tem. Seu trabalho é descobrir se existe laudo, se está recente e se é confiável.' },
    { tipo: 'perguntas', titulo: 'Perguntas de análise', itens: [
      'Você já possui alguma análise laboratorial recente da água desse poço?',
      'De quando é o laudo? (análises antigas podem não representar a água de hoje)',
      'Você consegue me enviar o laudo completo, com todas as páginas e parâmetros?',
      'Quais parâmetros vieram fora do padrão, se você já sabe? (não precisa acertar — só o que consta)',
      'Quem coletou a amostra — você mesmo, um técnico, o laboratório? Como foi coletada?',
      'O laboratório é identificado/idôneo? Consta nome, responsável técnico e método no laudo?',
      'A análise cobre físico, químico e microbiológico, ou só uma parte?',
    ]},
    { tipo: 'script', titulo: 'Script — solicitando o laudo sem desqualificar o cliente',
      fala: 'Perfeito, isso ajuda muito. Pra eu te orientar com responsabilidade e não te vender nada errado, o ponto de partida é a análise da sua água. Se você já tem um laudo recente, me manda ele completo, com todas as páginas. Se não tiver, ou se for antigo, a gente organiza uma coleta. É a análise que diz o que realmente precisa ser tratado — e é ela que protege você de comprar equipamento que não resolve.' },
    { tipo: 'callout', variante: 'info', titulo: 'Interpretação de valores é do especialista',
      html: 'Você identifica <strong>se existe</strong> laudo e <strong>quais parâmetros o cliente diz</strong> estarem fora. Você <strong>não</strong> interpreta números, não diz se está "muito" ou "pouco" acima, e não converte isso em solução. Limites (VMP) vêm da fonte oficial e a leitura técnica é do especialista.' },
    { tipo: 'pendente', html: 'Faixas de referência, laboratórios parceiros e prazo de validade de um laudo para fins comerciais: <strong>pendente de validação técnica pela Tudo de Filtro</strong>. Não informar de memória.' },

    // ---------------------------------------------------------------- HIDRÁULICA
    { tipo: 'titulo', texto: '4. HIDRÁULICA — a sondagem que dimensiona' },
    { tipo: 'texto', html: 'A análise diz <em>o que</em> tratar. A hidráulica diz <em>como</em> tratar sem estrangular a água da casa. Vazão, pressão e reservação definem o porte do sistema — e um sistema mal dimensionado falha mesmo com a tecnologia certa.' },
    { tipo: 'perguntas', titulo: 'Perguntas de hidráulica', itens: [
      'Qual a vazão da bomba? (modelo/potência/dados de placa, se tiver)',
      'Alguém já mediu a vazão real na saída, em litros por minuto ou m³/h?',
      'Sabe a vazão do poço em si — quanto ele entrega sem baixar demais o nível?',
      'Como está a pressão da água? Fraca, forte, varia ao longo do dia?',
      'Qual o diâmetro e o material da tubulação principal?',
      'Como é a reservação? Tem caixa d\'água, cisterna, quantos litros, quantas caixas?',
      'Qual o consumo diário estimado? Quantos pontos de água, quantas pessoas?',
      'Existe horário de pico — todo mundo usando ao mesmo tempo?',
      'O sistema atual (se houver) faz retrolavagem? Como e com que frequência?',
      'Tem ponto de dreno/descarte disponível para retrolavagem e onde ele deságua?',
    ]},
    { tipo: 'checklist', titulo: 'Antes de encaminhar ao especialista, você tem:', itens: [
      'Vazão da bomba (dado de placa ou informado)',
      'Vazão medida na saída (se disponível)',
      'Pressão e comportamento ao longo do dia',
      'Reservação (tipo e capacidade)',
      'Consumo diário e horário de pico',
      'Situação de retrolavagem e ponto de dreno',
    ]},
    { tipo: 'callout', variante: 'alerta', titulo: 'Dimensionamento não é você',
      html: 'Você <strong>coleta</strong> os dados hidráulicos. Você <strong>não</strong> calcula porte de tanque, vazão de serviço, back-wash nem perda de carga. Qualquer número de dimensionamento sai do especialista. "Muita vazão" ou "bomba forte" não vira solução na conversa comercial.' },
    { tipo: 'pendente', html: 'Faixas de vazão por porte de equipamento, exigência mínima de dreno e critérios de reservação: <strong>pendente de validação técnica pela Tudo de Filtro</strong> / envolver o especialista.' },

    // ---------------------------------------------------------- PROCESSO DE COMPRA
    { tipo: 'titulo', texto: '5. PROCESSO DE COMPRA — como a decisão acontece' },
    { tipo: 'texto', html: 'Qualificação comercial também é entender <strong>quem decide, com que prazo e sob quais exigências</strong>. Isso evita proposta parada e alinha a expectativa desde o início.' },
    { tipo: 'perguntas', titulo: 'Perguntas de processo de compra', itens: [
      'A água é para uso próprio ou você pretende revender/instalar para terceiros?',
      'Se for para um cliente final, quem é ele e qual o uso dele?',
      'Existe um responsável técnico envolvido — engenheiro, projetista, empresa de obra?',
      'Quem decide a compra? É você, um sócio, síndico, condomínio, setor de compras?',
      'Já existe um orçamento/verba previsto para esse investimento?',
      'Qual o prazo desejado para resolver? Tem urgência ou é planejamento?',
      'Está atrelado a uma obra ou reforma? Em que etapa ela está?',
      'É via licitação ou processo formal de compras?',
      'O projeto exige ART, projeto assinado ou aprovação técnica formal?',
      'Como seria a instalação — vocês têm equipe, ou precisam da nossa indicação?',
      'Qual condição de pagamento costuma funcionar melhor para vocês?',
    ]},
    { tipo: 'dodont',
      fazer: [
        'Confirmar quem é o decisor antes de investir tempo em proposta.',
        'Registrar prazo, obra e exigências formais (ART, licitação) no CRM.',
        'Alinhar que proposta só sai após análise + hidráulica.',
      ],
      evitar: [
        'Dar faixa de preço para "adiantar" antes da análise e da sondagem.',
        'Assumir que quem ligou é quem decide.',
        'Prometer prazo de entrega/instalação sem passar pelo especialista.',
      ]
    },
    { tipo: 'pendente', html: 'Condições de pagamento, política de instalação, ART/projeto e prazos: <strong>pendente de validação técnica/comercial pela Tudo de Filtro</strong>. Não improvisar valores nem prazos.' },

    { tipo: 'especialista', nome: 'qualificação', icon: '🧑‍🔬',
      html: 'Boa qualificação é você chegar até mim com contexto, sintoma, laudo e hidráulica organizados. Com isso eu dimensiono. Sem laudo e sem hidráulica, eu não tenho o que projetar — e você não tem o que propor.' },

    { tipo: 'callout', variante: 'sucesso', titulo: 'PRÓXIMO PASSO',
      html: 'Feche a conversa de qualificação assim: <strong>(1)</strong> confirme uso e sintomas anotados; <strong>(2)</strong> solicite o laudo completo (ou agende a coleta); <strong>(3)</strong> levante os dados hidráulicos que faltam; <strong>(4)</strong> registre decisor, prazo e exigências no CRM; <strong>(5)</strong> combine o retorno já com o especialista para o diagnóstico. Nunca encerre sem um próximo passo marcado.' },
  
    // ------------------------------------------------- DOUTRINA OFICIAL (Paulo, 09/07/2026)
    { tipo: 'titulo', texto: 'Budget por SINAIS (doutrina oficial — nunca pergunta seca de dinheiro)' },
    { tipo: 'texto', html: 'Budget se descobre por <strong>sinais</strong>, não perguntando "quanto você pode gastar". Os sinais oficiais: <strong>profundidade do poço</strong> (poço mais fundo custou MAIS caro pra furar — quem investiu alto furando tem capacidade e motivo pra investir no tratamento), <strong>quantos banheiros</strong> tem a casa (dimensiona E revela padrão), <strong>piscina e boiler</strong> (padrão + dor de proteção) e se é <strong>condomínio</strong> (outro porte de projeto).' },
    { tipo: 'perguntas', titulo: 'Perguntas-sinal de budget', itens: [
      'Qual a profundidade do poço? Lembra quanto custou pra furar?',
      'Quantos banheiros tem na casa?',
      'Tem piscina? Boiler ou aquecedor?',
      'É casa, chácara ou condomínio?',
    ]},
    { tipo: 'callout', variante: 'sucesso', titulo: 'A pergunta que muda a urgência',
      html: '<strong>"Você tem OUTRA água além do poço?"</strong> Se a resposta for NÃO — ele <strong>TEM que tratar</strong> aquela água. Não existe plano B. Isso muda toda a conversa de prazo e prioridade.' },
    { tipo: 'script', titulo: 'A apresentação-contrato (abertura oficial)',
      fala: 'Eu sou o(a) [nome], especialista em tratamento de água da Tudo de Filtro. Te ligo porque [motivo]. Vou te fazer algumas perguntas e, no final, se entendermos que conseguimos te ajudar com a sua água, a gente prossegue — se não, eu te falo nessa mesma ligação.' },
    { tipo: 'callout', variante: 'info', titulo: 'Regra mestra', html: '<strong>VENDE MELHOR QUEM PERGUNTA MAIS.</strong> E implicação certa de poço: saúde (ferro é cumulativo no fígado), piscina amarelada, a casa toda — <strong>NUNCA galão</strong> (galão não é implicação de nenhum produto).' },
],

  perguntasRapidas: [
    {
      pergunta: 'O cliente descreve mancha laranja na roupa e pede logo o preço do equipamento. O que você faz?',
      opcoes: [
        'Digo que é ferro e passo o preço do filtro de ferro.',
        'Anoto o sintoma como pista, explico que só análise + hidráulica confirmam a causa, e conduzo para o laudo antes de qualquer proposta.',
        'Mando o maior tanque para garantir.',
      ],
      correta: 1,
      explicacao: 'Sintoma é pista, não diagnóstico. Sem análise laboratorial e sondagem hidráulica não há proposta nem preço — e nada de prometer que o problema some.'
    },
    {
      pergunta: 'Quais dois blocos precisam estar completos antes de qualquer proposta de poço?',
      opcoes: [
        'Contexto e Processo de compra.',
        'Problema e Preço.',
        'Análise (laudo recente) e Hidráulica (sondagem).',
      ],
      correta: 2,
      explicacao: 'Análise diz o que tratar; hidráulica diz como tratar sem estrangular a água. Sem os dois, o especialista não dimensiona e o closer não propõe.'
    },
    {
      pergunta: 'Durante a qualificação o cliente cita um exame com E. coli. Qual a atitude correta?',
      opcoes: [
        'Seguir a venda normal, é só um filtro a mais.',
        'Reconhecer como risco sanitário e envolver o especialista imediatamente, sem prometer potabilidade.',
        'Dizer que a água está imprópria e encerrar o contato.',
      ],
      correta: 1,
      explicacao: 'Relato microbiológico é gatilho de escalonamento (Módulo 20). O closer não trata isso como objeção comercial nem promete resolver — encaminha ao especialista.'
    },
  ],

  exercicio: {
    enunciado: 'Monte, em tópicos, o roteiro que você usaria em uma primeira ligação de poço para um sítio que usa a água para beber e cozinhar. Liste ao menos 2 perguntas de cada bloco (Contexto, Problema, Análise, Hidráulica, Processo de compra) e termine com o PRÓXIMO PASSO que você combinaria.',
    dica: 'Não tente resolver na ligação. O objetivo é sair com o laudo solicitado, a hidráulica mapeada e o decisor/prazo registrados.'
  },

  resumo: 'Qualificar poço é coletar Contexto, Problema, Análise, Hidráulica e Processo de compra — não adivinhar a solução. Sintoma é pista; a análise diz o que tratar e a hidráulica diz como. Sem análise recente + sondagem hidráulica não há proposta, preço ou promessa. Valores e dimensionamento ficam com o especialista, e toda conversa termina com um PRÓXIMO PASSO marcado.'
};
