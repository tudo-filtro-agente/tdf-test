// ============================================================================
// MÓDULO 8 — Personas na decisão
// ----------------------------------------------------------------------------
// Segue o CONTRATO DE SCHEMA definido em mod-01-intro.js.
// Um card por persona: o que valoriza, o que teme, como decide, argumento a
// usar, argumento a EVITAR e como chegar ao decisor. Sem inventar specs.
// ============================================================================

module.exports = {
  resumoCurto: 'Quem participa da decisão de compra de um bebedouro industrial — dono, comprador, financeiro, RH, facilities, engenheiro, servidor público e outros — o que cada um valoriza, o que teme e como conduzir cada um até o sim.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-08-video' },

  blocos: [
    { tipo: 'texto', html: 'Uma venda B2B raramente é decidida por uma pessoa só. Existe quem <strong>usa</strong>, quem <strong>pede</strong>, quem <strong>aprova o dinheiro</strong> e quem <strong>bate o martelo</strong>. Cada uma dessas <strong>personas</strong> valoriza coisas diferentes e teme coisas diferentes. Falar a mesma coisa para todas é o jeito mais rápido de travar a negociação.' },
    { tipo: 'texto', html: 'O objetivo deste módulo é você <strong>reconhecer com quem está falando</strong>, ajustar o argumento e — principalmente — <strong>chegar até quem realmente decide</strong> sem queimar o contato que te atendeu primeiro.' },

    { tipo: 'callout', variante: 'info', titulo: 'Uma pessoa pode acumular papéis',
      html: 'Em empresa pequena, o <strong>dono</strong> costuma ser usuário, comprador e financeiro ao mesmo tempo. Em empresa grande, esses papéis se separam. Descubra <strong>qual chapéu</strong> a pessoa está usando antes de escolher o argumento.' },

    { tipo: 'titulo', texto: 'As personas da decisão' },
    { tipo: 'cards', itens: [
      { icon: '👑', titulo: 'Dono da empresa',
        html: '<strong>Valoriza:</strong> resolver de vez, imagem do negócio e retorno. <strong>Teme:</strong> jogar dinheiro fora e ter que trocar de novo. <strong>Decide:</strong> rápido, no impulso do valor percebido. <strong>Usar:</strong> conforto do time, fim da logística de galão, durabilidade em inox. <strong>Evitar:</strong> excesso de jargão técnico e promessas de economia sem laudo. <strong>Chegar ao decisor:</strong> ele já é — feche enquanto o interesse está quente.' },
      { icon: '🎩', titulo: 'Diretor',
        html: '<strong>Valoriza:</strong> impacto na operação e no clima organizacional. <strong>Teme:</strong> problema que suje sua imagem interna. <strong>Decide:</strong> por prioridade estratégica, delega a execução. <strong>Usar:</strong> ganho de bem-estar e padronização entre unidades. <strong>Evitar:</strong> detalhe operacional miúdo que não é problema dele. <strong>Chegar ao decisor:</strong> alinhe o "porquê" com ele e deixe compras/facilities executarem.' },
      { icon: '🛒', titulo: 'Comprador',
        html: '<strong>Valoriza:</strong> melhor condição, prazo e cumprimento do combinado. <strong>Teme:</strong> fornecedor que atrasa ou some no pós-venda. <strong>Decide:</strong> comparando propostas e negociando. <strong>Usar:</strong> clareza de proposta, garantia de 12 meses e suporte. <strong>Evitar:</strong> "empurrar" o modelo mais caro sem justificar tecnicamente. <strong>Chegar ao decisor:</strong> pergunte quem assina e quais critérios pesam na escolha.' },
      { icon: '💰', titulo: 'Financeiro',
        html: '<strong>Valoriza:</strong> previsibilidade de custo e forma de pagamento. <strong>Teme:</strong> custo escondido e recorrência inesperada. <strong>Decide:</strong> por caixa e condição (parcelado x à vista). <strong>Usar:</strong> condições de pagamento e o custo do refil já transparente. <strong>Evitar:</strong> prometer percentual de economia de energia sem laudo. <strong>Chegar ao decisor:</strong> ele libera dinheiro, não escolhe o modelo — confirme quem define a necessidade.' },
      { icon: '🧑‍💼', titulo: 'RH',
        html: '<strong>Valoriza:</strong> bem-estar e satisfação dos colaboradores. <strong>Teme:</strong> reclamação de funcionário e clima ruim. <strong>Decide:</strong> por impacto nas pessoas, encaminha para aprovação. <strong>Usar:</strong> fim das reclamações de água quente, conforto no pico. <strong>Evitar:</strong> discurso puramente técnico de compressor. <strong>Chegar ao decisor:</strong> use o RH como aliado para levar o pleito a quem aprova.' },
      { icon: '🧰', titulo: 'Facilities',
        html: '<strong>Valoriza:</strong> baixa manutenção e um fornecedor confiável. <strong>Teme:</strong> equipamento que dá defeito e vira chamado recorrente. <strong>Decide:</strong> por confiabilidade e facilidade de instalação. <strong>Usar:</strong> estrutura em inox, pés reguláveis, suporte e refil simples. <strong>Evitar:</strong> minimizar a rotina de manutenção como se fosse "zero". <strong>Chegar ao decisor:</strong> ele especifica e influencia forte — ganhe-o como aliado técnico.' },
      { icon: '🔧', titulo: 'Manutenção',
        html: '<strong>Valoriza:</strong> peça durável, instalação simples e troca de refil sem drama. <strong>Teme:</strong> ficar refém de um equipamento problemático. <strong>Decide:</strong> não decide sozinho, mas veta o que dá trabalho. <strong>Usar:</strong> serpentina em inox 304, refil Acquabios Multi e garantia. <strong>Evitar:</strong> prometer que "nunca precisa de manutenção". <strong>Chegar ao decisor:</strong> conquiste-o para ele não vetar sua proposta lá dentro.' },
      { icon: '📐', titulo: 'Engenheiro',
        html: '<strong>Valoriza:</strong> especificação correta, voltagem, pontos de água e dimensionamento. <strong>Teme:</strong> equipamento subdimensionado ou incompatível com a instalação. <strong>Decide:</strong> tecnicamente; aprova ou reprova a spec. <strong>Usar:</strong> lógica de pico simultâneo e recuperação de temperatura, compressor por modelo. <strong>Evitar:</strong> afirmar dimensões do site como definitivas — elas estão pendentes de validação técnica. <strong>Chegar ao decisor:</strong> trate-o como par técnico; a validação dele destrava a compra.' },
      { icon: '🏗️', titulo: 'Responsável pela obra',
        html: '<strong>Valoriza:</strong> atender o efetivo do canteiro e a NR de bem-estar. <strong>Teme:</strong> falta de água nas frentes e fiscalização. <strong>Decide:</strong> por praticidade e robustez de obra. <strong>Usar:</strong> volume no pico, resistência ao uso pesado e frentes distribuídas. <strong>Evitar:</strong> soluções frágeis ou discurso de escritório. <strong>Chegar ao decisor:</strong> alinhe com ele o número de pontos e quem aprova a compra.' },
      { icon: '🏫', titulo: 'Diretor escolar',
        html: '<strong>Valoriza:</strong> segurança dos alunos, atender o recreio e o orçamento da escola. <strong>Teme:</strong> aglomeração sem água gelada e reclamação de pais. <strong>Decide:</strong> dentro do orçamento, às vezes com a mantenedora. <strong>Usar:</strong> pico curto e intenso do recreio, estrutura resistente. <strong>Evitar:</strong> jargão técnico pesado. <strong>Chegar ao decisor:</strong> confirme se a mantenedora ou secretaria também aprova.' },
      { icon: '💪', titulo: 'Dono de academia',
        html: '<strong>Valoriza:</strong> experiência do aluno e diferencial competitivo. <strong>Teme:</strong> aluno reclamando de água quente no treino. <strong>Decide:</strong> rápido, pensando em retenção de alunos. <strong>Usar:</strong> recuperação no pico dos horários de aula, conforto imediato. <strong>Evitar:</strong> dimensionar pelo total de matriculados. <strong>Chegar ao decisor:</strong> normalmente é ele mesmo — feche no valor percebido.' },
      { icon: '🏛️', titulo: 'Servidor público',
        html: '<strong>Valoriza:</strong> conformidade, especificação correta e processo dentro da regra. <strong>Teme:</strong> questionamento, glosa e problema no processo de compra. <strong>Decide:</strong> dentro de licitação / regras formais, sem margem para "jeitinho". <strong>Usar:</strong> especificação clara, garantia e conformidade da proposta. <strong>Evitar:</strong> insinuar vantagem informal ou pressa fora do rito. <strong>Chegar ao decisor:</strong> entenda o rito (pregão, dispensa) e quem redige o edital.' },
      { icon: '🛠️', titulo: 'Revendedor',
        html: '<strong>Valoriza:</strong> margem, giro e produto que não gera pós-venda difícil. <strong>Teme:</strong> encalhe e cliente insatisfeito voltando pra ele. <strong>Decide:</strong> por condição comercial e confiança na marca. <strong>Usar:</strong> confiabilidade, suporte e material de apoio para ele vender. <strong>Evitar:</strong> tratá-lo como consumidor final. <strong>Chegar ao decisor:</strong> ele é o decisor do próprio negócio — foque na parceria de longo prazo.' },
      { icon: '📋', titulo: 'Participante de licitação',
        html: '<strong>Valoriza:</strong> aderência ao edital e proposta que não seja desclassificada. <strong>Teme:</strong> especificação que não bate com o exigido. <strong>Decide:</strong> pelo que o edital pede, dentro de prazos formais. <strong>Usar:</strong> alinhamento ponto a ponto com a especificação e prazos. <strong>Evitar:</strong> prometer o que o edital não pede ou o que não pode ser comprovado. <strong>Chegar ao decisor:</strong> mapeie quem define a especificação técnica antes da publicação.' },
    ]},

    { tipo: 'callout', variante: 'alerta', titulo: 'Como identificar se a pessoa realmente decide',
      html: 'Nem todo mundo simpático é o decisor. Teste com perguntas de <strong>autoridade</strong>: "Além de você, quem mais participa dessa decisão?", "Como costuma ser a aprovação de uma compra assim aí?", "Se estiver tudo certo com a proposta, o próximo passo depende de você ou de mais alguém?". Se a pessoa desvia, fala em "vou levar para aprovação" ou não sabe do orçamento, você está com um <strong>influenciador</strong>, não com o decisor — trate-o como aliado para <strong>chegar</strong> a quem bate o martelo, sem atropelá-lo.' },

    { tipo: 'dodont',
      fazer: [
        'Descobrir qual papel a pessoa ocupa antes de escolher o argumento.',
        'Transformar RH, facilities e manutenção em aliados internos.',
        'Perguntar abertamente quem mais participa da decisão.',
      ],
      evitar: [
        'Usar o mesmo pitch técnico para dono, financeiro e engenheiro.',
        'Atropelar o contato inicial para "pular" direto ao decisor.',
        'Prometer potabilidade, economia sem laudo ou dimensão do site como definitiva.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Você está falando com o financeiro. Qual argumento se encaixa melhor?',
      opcoes: [
        'Detalhar a serpentina em inox 304 e o compressor.',
        'Condições de pagamento e o custo do refil já transparente na proposta.',
        'Prometer 30% de economia de energia.',
      ],
      correta: 1,
      explicacao: 'O financeiro decide por previsibilidade e forma de pagamento. Prometer economia sem laudo é proibido; detalhe técnico é papel do engenheiro/facilities.'
    },
    {
      pergunta: 'A pessoa diz "vou levar para aprovação e te retorno". O que isso indica?',
      opcoes: [
        'Ela é a decisora final.',
        'Provavelmente é influenciadora; trate-a como aliada para chegar ao decisor.',
        'A venda está perdida.',
      ],
      correta: 1,
      explicacao: 'Quem "leva para aprovação" normalmente não bate o martelo. Use essa pessoa como aliada e mapeie quem realmente decide, sem atropelá-la.'
    },
    {
      pergunta: 'Com um engenheiro, qual erro você deve evitar?',
      opcoes: [
        'Falar de pico simultâneo e recuperação de temperatura.',
        'Afirmar as dimensões do site como definitivas.',
        'Tratá-lo como par técnico.',
      ],
      correta: 1,
      explicacao: 'As dimensões do site estão pendentes de validação técnica. Diante de um engenheiro, afirmá-las como definitivas destrói sua credibilidade — sinalize a pendência.'
    },
  ],

  exercicio: {
    enunciado: 'Você atende o RH de uma indústria, que gostou da ideia mas diz que "a decisão passa pela diretoria e pelo financeiro". Descreva como usaria o RH como aliado e que argumento levaria a cada uma das outras duas personas.',
    dica: 'RH vende bem-estar; diretor pensa em impacto e imagem; financeiro pensa em condição de pagamento. Cada um recebe um argumento diferente.'
  },

  resumo: 'A compra B2B envolve várias personas — dono, diretor, comprador, financeiro, RH, facilities, manutenção, engenheiro, responsável pela obra, diretor escolar, dono de academia, servidor público, revendedor e participante de licitação. Cada uma valoriza e teme algo distinto e recebe um argumento sob medida. Reconheça o papel, transforme influenciadores em aliados e confirme quem realmente decide antes de tentar fechar — nunca atropelando o contato inicial.'
};
