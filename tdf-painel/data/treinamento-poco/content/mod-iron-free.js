// ============================================================================
// MÓDULO — Iron Free: remover ferro e manganês (oxidação, cloro, pH e barrilha)
// Base científica de tratamento (oxidação + filtração). Específicos do produto
// "Iron Free" da TDF (mídia exata, catalítica ou não, vazões, dosagens) → `pendente`.
// SAÚDE: framing responsável — ferro é majoritariamente estético/operacional;
// manganês tem consideração de saúde reconhecida (OMS/Portaria 888) citada como
// fonte oficial, com limites/valores PENDENTES (não inventar número).
// ============================================================================

module.exports = {
  resumoCurto: 'Ferro e manganês dissolvidos são invisíveis: para remover, primeiro OXIDA (cloro), com o pH certo (alcalino), e depois FILTRA. Onde entra a barrilha, e quais são os estragos reais que eles causam.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-iron-free-video' },

  blocos: [
    { tipo: 'titulo', texto: 'O problema: ferro e manganês DISSOLVIDOS são invisíveis' },
    { tipo: 'texto', html: 'Na água de poço, o ferro (Fe²⁺) e o manganês (Mn²⁺) costumam vir <strong>dissolvidos</strong> — a água sai <strong>transparente na torneira</strong> e só depois "tinge" (fica amarelada/avermelhada no ferro, escura/preta no manganês) quando entra em contato com o ar. Como estão dissolvidos, <strong>um filtro de partícula (sedimentos) não pega</strong>. É preciso primeiro <strong>transformá-los em sólido</strong>.' },

    { tipo: 'titulo', texto: 'Como funciona um sistema tipo Iron Free (o princípio)' },
    { tipo: 'texto', html: 'O princípio é <strong>oxidar → filtrar</strong>. A oxidação transforma o metal dissolvido em partícula insolúvel; a filtração retém essa partícula. Em etapas:' },
    { tipo: 'cards', itens: [
      { icon: '1️⃣', titulo: 'Oxidação', html: 'Fe²⁺ vira Fe³⁺ (óxido/hidróxido, insolúvel). Mn²⁺ vira MnO₂ (insolúvel). Sai do "dissolvido" para o "sólido".' },
      { icon: '2️⃣', titulo: 'Tempo de contato', html: 'A reação precisa de tempo/condição adequada (pH, oxidante) para acontecer de verdade antes de filtrar.' },
      { icon: '3️⃣', titulo: 'Filtração', html: 'O leito filtrante / mídia retém o precipitado. A retrolavagem periódica descarta o que ficou retido.' },
    ]},
    { tipo: 'pendente', html: 'A <strong>mídia exata do Iron Free</strong> (se é catalítica, o tipo, a vazão de serviço e de retrolavagem, a necessidade ou não de oxidante contínuo) segue a <strong>ficha técnica oficial da Tudo de Filtro</strong> — confirmar antes de detalhar ao cliente. Aqui ensinamos o princípio, não os números.' },

    { tipo: 'titulo', texto: 'O papel do cloro (oxidação)' },
    { tipo: 'texto', html: 'O <strong>cloro</strong> é um <strong>oxidante</strong> prático e comum: ele "empurra" a reação que transforma ferro e manganês em partícula. Aqui o cloro trabalha <strong>oxidando</strong> (além do papel de desinfecção que você viu no módulo de coliformes). O <strong>manganês é mais difícil</strong> de oxidar que o ferro: pede <strong>mais oxidante</strong>, <strong>pH mais alto</strong> e costuma ser mais lento.' },
    { tipo: 'callout', variante: 'info', titulo: 'Ferro é "fácil", manganês é "chato"',
      html: 'Regra de leitura: ferro oxida com relativa facilidade; manganês exige condições mais fortes (pH mais alto, mais oxidante, às vezes mídia catalítica). Por isso um sistema que tira ferro nem sempre tira manganês — confirmar no projeto.' },

    { tipo: 'titulo', texto: 'Por que o pH precisa estar alcalino (acima de 7)' },
    { tipo: 'texto', html: 'A <strong>velocidade da oxidação depende do pH</strong>. Em água <strong>ácida (pH baixo)</strong> a oxidação de ferro e (principalmente) manganês fica <strong>lenta e incompleta</strong> — o metal "passa" pelo filtro ainda dissolvido e volta a aparecer na casa do cliente. Elevando o pH para a <strong>faixa alcalina (acima de 7)</strong>, a reação acontece de forma <strong>mais rápida e completa</strong>, e aí a filtração consegue reter.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Quando o pH está baixo, corrige-se PRIMEIRO',
      html: 'Se a análise mostra pH ácido, tentar remover ferro/manganês sem corrigir o pH é receita de sistema que "não resolve". A correção de pH é <strong>pré-condição</strong> do tratamento, não um extra.' },

    { tipo: 'titulo', texto: 'A dosadora de barrilha (correção de pH)' },
    { tipo: 'texto', html: 'A <strong>barrilha</strong> é o <strong>carbonato de sódio (Na₂CO₃)</strong>. Uma <strong>bomba dosadora</strong> injeta uma solução de barrilha na água para <strong>elevar o pH</strong> (deixar alcalino) e dar <strong>alcalinidade</strong> — criando a condição para o cloro oxidar ferro e manganês de forma eficiente. A dosadora entra <strong>antes</strong> da etapa de oxidação/filtração.' },
    { tipo: 'cards', itens: [
      { icon: '🎯', titulo: 'O que resolve', html: 'Sobe o pH ácido para a faixa alcalina, viabilizando a oxidação e a remoção de ferro/manganês.' },
      { icon: '📍', titulo: 'Quando indicar', html: 'Quando a análise aponta pH baixo/ácido junto com ferro e/ou manganês.' },
      { icon: '⚠️', titulo: 'Atenção', html: 'Precisa de dosagem e vazão corretas (proporcional ao fluxo). Sub/superdosar desregula o sistema.' },
    ]},
    { tipo: 'pendente', html: 'Dosagem de barrilha, concentração da solução, pH-alvo e vazão da bomba dependem de <strong>análise + vazão</strong> e do <strong>projeto do especialista</strong>. Não prescrever dose de cabeça.' },

    { tipo: 'titulo', texto: 'Os estragos reais do FERRO (na casa e na operação)' },
    { tipo: 'texto', html: 'O ferro na água é, na maior parte dos casos, um problema <strong>estético e operacional</strong> — e isso já é uma dor enorme e concreta para o cliente:' },
    { tipo: 'cards', itens: [
      { icon: '🟠', titulo: 'Manchas', html: 'Amareladas/avermelhadas em louças, pias, roupas, azulejos e pisos.' },
      { icon: '👅', titulo: 'Gosto e cor', html: 'Sabor metálico/adstringente; água que "tinge" ao contato com o ar.' },
      { icon: '🚿', titulo: 'Depósitos e entupimento', html: 'Incrustação e borra em tubulação, registros, chuveiro, aquecedor e eletrodomésticos.' },
      { icon: '🦠', titulo: 'Bactérias do ferro', html: 'Favorecem limo/lodo alaranjado e odor em caixas e tubulações (não é patógeno, mas suja e cheira).' },
    ]},
    { tipo: 'callout', variante: 'info', titulo: 'Honestidade sobre saúde (ferro)',
      html: 'O ferro é um <strong>nutriente essencial</strong> e, na água, costuma ser tratado como parâmetro <strong>de aceitação/organoléptico</strong> (gosto, cor, mancha) — não como risco agudo. <strong>Não venda medo.</strong> A dor real e suficiente é estética/operacional. Qualquer afirmação sobre limite/saúde vem da <strong>fonte oficial (Portaria 888/2021)</strong>, cadastrada em <code>parametros-agua.js</code> — pendente.' },

    { tipo: 'titulo', texto: 'Manganês: mesma lógica, com um cuidado a mais' },
    { tipo: 'cards', itens: [
      { icon: '⚫', titulo: 'Manchas escuras', html: 'Depósitos e manchas pretas/marrons em louças, roupas e tubulação.' },
      { icon: '👅', titulo: 'Sabor e água escura', html: 'Gosto desagradável; a água escurece ao contato com o ar/oxidante.' },
      { icon: '🚿', titulo: 'Depósitos', html: 'Acúmulo em tubulação e equipamentos, favorece incrustação e bactérias.' },
    ]},
    { tipo: 'callout', variante: 'alerta', titulo: 'Saúde (manganês) — falar com responsabilidade',
      html: 'Diferente do ferro, o <strong>manganês</strong> tem <strong>consideração de saúde reconhecida</strong>: a literatura (OMS) associa <strong>exposição crônica a manganês elevado</strong> a possíveis efeitos <strong>neurológicos</strong>, com atenção especial a <strong>bebês/crianças</strong>. Isso reforça a conduta da casa: <strong>análise + especialista</strong>, e nada de prometer. Os <strong>limites e valores</strong> vêm de <strong>fonte oficial (Portaria 888/2021 / OMS)</strong> — pendentes de validação, nunca de memória.' },
    { tipo: 'especialista', nome: 'ferro e manganês', icon: '🧑‍🔬',
      html: 'Meu resumo: dissolvido = invisível; oxida (cloro) com pH alcalino (barrilha se estiver ácido) e filtra. Ferro é estético; manganês pede mais cuidado técnico e de saúde. Sempre análise antes.' },

    { tipo: 'dodont',
      fazer: [
        'Explicar a sequência: corrigir pH (barrilha) → oxidar (cloro) → filtrar.',
        'Tratar ferro como dor estética/operacional concreta (mancha, gosto, depósito).',
        'Levar manganês e qualquer questão de saúde para análise + especialista + fonte oficial.',
      ],
      evitar: [
        'Vender "males do ferro no organismo" com medo inventado.',
        'Prometer remover ferro/manganês sem corrigir o pH quando ele está ácido.',
        'Cravar dosagem de cloro/barrilha ou limite de manganês de cabeça.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'A água sai transparente na torneira mas fica amarelada num balde depois de um tempo. O que isso indica e por que um filtro de sedimentos não resolve?',
      opcoes: [
        'É sujeira; um filtro de sedimentos resolve.',
        'É ferro DISSOLVIDO que oxida ao contato com o ar; como está dissolvido, precisa oxidar primeiro para virar partícula e então filtrar.',
        'É bactéria; precisa só de UV.',
      ],
      correta: 1,
      explicacao: 'Ferro dissolvido é invisível e não é retido por filtro de partícula. O tratamento é oxidar (ex.: cloro) no pH certo e depois filtrar.'
    },
    {
      pergunta: 'A análise mostra pH ácido junto com ferro e manganês. Qual a conduta correta?',
      opcoes: [
        'Ignorar o pH e instalar o filtro de ferro.',
        'Corrigir o pH para a faixa alcalina primeiro (ex.: dosadora de barrilha), porque a oxidação de ferro/manganês depende disso.',
        'Aumentar só a vazão da bomba.',
      ],
      correta: 1,
      explicacao: 'Em pH ácido a oxidação é lenta/incompleta. A correção de pH (barrilha = carbonato de sódio) é pré-condição para o sistema funcionar.'
    },
    {
      pergunta: 'Sobre saúde, qual afirmação é a mais correta e responsável?',
      opcoes: [
        'Ferro na água causa graves danos ao organismo e deve dar medo ao cliente.',
        'Ferro é majoritariamente estético/de aceitação; o manganês tem consideração de saúde reconhecida (OMS) — e todo limite vem de fonte oficial, não de memória.',
        'Nenhum dos dois tem qualquer relevância.',
      ],
      correta: 1,
      explicacao: 'Ferro é dor estética/operacional; manganês tem risco de saúde reconhecido em exposição crônica elevada. Limites/valores sempre da fonte oficial (Portaria 888/OMS), pendentes.'
    },
  ],

  exercicio: {
    enunciado: 'Explique para um cliente, sem meias palavras técnicas demais, por que a água dele "sai limpa mas mancha tudo" e qual a sequência do tratamento (pH → oxidação → filtração). Depois, escreva como você falaria de manganês com responsabilidade, sem prometer nada.',
    dica: 'Sequência: dissolvido→invisível; barrilha se o pH estiver ácido; cloro oxida; filtro retém. Manganês = análise + especialista + fonte oficial.'
  },

  resumo: 'Ferro e manganês dissolvidos são invisíveis e não saem em filtro de partícula: o princípio (tipo Iron Free) é OXIDAR e depois FILTRAR. O cloro oxida; a oxidação depende do pH, e por isso ele precisa estar alcalino (acima de 7) — quando está ácido, corrige-se com a dosadora de barrilha (carbonato de sódio). Ferro é dor estética/operacional (mancha, gosto, depósito, bactéria do ferro); manganês segue a mesma lógica técnica mas com consideração de saúde reconhecida (OMS). Mídia do Iron Free, dosagens e limites ficam pendentes de ficha oficial/Portaria 888.'
};
