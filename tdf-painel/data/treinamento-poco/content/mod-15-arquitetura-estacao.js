// ============================================================================
// MÓDULO 15 — Arquitetura de uma estação de tratamento
// Segue o CONTRATO DE SCHEMA definido em mod-01-fundamentos.js
// REGRA: os arranjos abaixo são EXEMPLOS DIDÁTICOS, não projetos universais. A
// ordem real das etapas sai do diagnóstico (análise + hidráulica + especialista).
// NÃO inventar dimensionamentos/eficiências. Especificidade → `pendente`.
// ============================================================================

module.exports = {
  resumoCurto: 'Uma estação não é uma lista de equipamentos empilhados — é uma sequência de etapas na ordem certa. E a ordem certa depende do laudo, não de um "kit padrão". Os arranjos aqui são exemplos para ensinar a lógica, nunca receitas para copiar.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'poco-mod-15-video' },

  blocos: [
    { tipo: 'callout', variante: 'perigo', titulo: 'A ordem das etapas depende da análise',
      html: 'Trocar a ordem de duas etapas pode fazer o sistema funcionar ou falhar. Uma etapa costuma <strong>proteger</strong> ou <strong>preparar</strong> a seguinte (por exemplo, tirar partícula antes de uma etapa sensível a entupimento). Por isso a arquitetura de uma estação <strong>nasce do diagnóstico</strong> — nunca de um arranjo fixo aplicado a todo poço.' },

    { tipo: 'titulo', texto: 'A lógica do encadeamento' },
    { tipo: 'texto', html: 'Pense em três papéis que as etapas assumem: <strong>pré-tratamento</strong> (prepara/protege), <strong>tratamento principal</strong> (ataca o alvo central) e <strong>pós-tratamento/reservação</strong> (ajusta e guarda). Uma boa estação organiza as tecnologias nesses papéis, na ordem que faça a água chegar em condições adequadas a cada etapa seguinte.' },
    { tipo: 'cards', itens: [
      { icon: '🛡️', titulo: 'Pré-tratamento', html: 'Prepara a água e protege etapas sensíveis (ex.: remover partículas antes de algo que entope). O que entra aqui depende do laudo.' },
      { icon: '🎯', titulo: 'Tratamento principal', html: 'Ataca o(s) parâmetro(s) central(is) do caso — definido pelo diagnóstico, não por padrão.' },
      { icon: '🎚️', titulo: 'Pós-tratamento / reservação', html: 'Ajustes finais e armazenamento adequado, quando aplicável ao objetivo.' },
    ]},

    { tipo: 'callout', variante: 'alerta', titulo: 'Os cinco arranjos abaixo são DIDÁTICOS',
      html: 'Cada exemplo a seguir existe <strong>só para ensinar a lógica de sequência</strong>. Nenhum é projeto universal, nenhum serve "para qualquer poço", e nenhum substitui análise, hidráulica e dimensionamento. Trate-os como ilustração, jamais como proposta pronta.' },

    { tipo: 'titulo', texto: 'Exemplos didáticos de sequência' },
    { tipo: 'tabela',
      head: ['Exemplo didático (NÃO é projeto)', 'Lógica que ilustra'],
      rows: [
        ['Oxidação → tempo de contato → filtração', 'Preparar uma reação, dar tempo para ela ocorrer e só então separar o que se formou.'],
        ['Filtração → abrandamento → desinfecção', 'Tirar partícula, tratar um alvo dissolvido e, por fim, desinfetar.'],
        ['Pré-filtração → carvão → membrana', 'Proteger etapas seguintes removendo partícula antes de uma etapa sensível a entupimento.'],
        ['Dosagem → tanque de contato → filtração → reservação', 'Dosar, garantir tempo de reação, separar e então reservar.'],
        ['Pré-tratamento → osmose reversa → pós-tratamento', 'Preparar a água, tratar o dissolvido e ajustar depois.'],
      ]
    },
    { tipo: 'cards', itens: [
      { icon: '📘', titulo: 'Exemplo A (didático)', html: '<strong>Oxidação → tempo de contato → filtração.</strong> Ilustra: às vezes é preciso transformar algo primeiro, esperar a reação e só depois filtrar. Não é receita.' },
      { icon: '📘', titulo: 'Exemplo B (didático)', html: '<strong>Filtração → abrandamento → desinfecção.</strong> Ilustra papéis diferentes em sequência (partícula, dissolvido, micro). Não é receita.' },
      { icon: '📘', titulo: 'Exemplo C (didático)', html: '<strong>Pré-filtração → carvão → membrana.</strong> Ilustra proteção de etapa sensível com pré-filtração. Não é receita.' },
      { icon: '📘', titulo: 'Exemplo D (didático)', html: '<strong>Dosagem → tanque de contato → filtração → reservação.</strong> Ilustra dosar, dar tempo, separar e reservar. Não é receita.' },
      { icon: '📘', titulo: 'Exemplo E (didático)', html: '<strong>Pré-tratamento → osmose reversa → pós-tratamento.</strong> Ilustra preparar, tratar dissolvido e ajustar depois. Não é receita.' },
    ]},

    { tipo: 'titulo', texto: 'O que muda de um poço para outro' },
    { tipo: 'texto', html: 'Dois poços na mesma rua podem exigir arquiteturas diferentes. O que define a sequência é o conjunto: <strong>parâmetros do laudo</strong>, <strong>hidráulica</strong> (vazão, pressão, energia, espaço) e o <strong>objetivo de uso</strong>. Copiar o arranjo do vizinho é assumir que a água dele é igual à sua — e ela quase nunca é.' },
    { tipo: 'dodont',
      fazer: [
        'Partir do laudo + hidráulica + objetivo para desenhar a sequência.',
        'Pensar em cada etapa como preparo/proteção da próxima.',
        'Deixar a arquitetura final com o especialista.',
      ],
      evitar: [
        'Vender um "arranjo padrão" para qualquer poço.',
        'Copiar a estação de outro cliente.',
        'Fixar ordem, tamanhos ou eficiências sem diagnóstico.',
      ]
    },

    { tipo: 'especialista', nome: 'análises', icon: '🧑‍🔬',
      html: 'Eu não começo desenhando a estação — começo lendo o laudo e medindo a hidráulica. A ordem das caixas no desenho é consequência disso. Quando alguém já chega com o arranjo pronto antes da análise, é aí que o projeto costuma dar errado.' },

    { tipo: 'pendente',
      html: 'O <strong>arranjo real</strong> de uma estação (quais etapas, em que ordem, com que dimensionamento e consumíveis) sai do <strong>diagnóstico + especialista</strong> e é <strong>pendente de validação técnica pela Tudo de Filtro</strong>. Os exemplos deste módulo são didáticos e não devem ser propostos como projeto.' },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Por que os cinco arranjos deste módulo NÃO devem ser propostos a um cliente como projeto?',
      opcoes: [
        'Porque são caros.',
        'Porque são exemplos didáticos para ensinar a lógica de sequência; o projeto real depende de laudo, hidráulica e especialista.',
        'Porque só funcionam em poços rasos.',
      ],
      correta: 1,
      explicacao: 'Os arranjos ilustram a lógica de encadeamento. Nenhum é universal; a arquitetura real nasce do diagnóstico.'
    },
    {
      pergunta: 'Qual é a principal razão de uma etapa vir ANTES de outra numa estação?',
      opcoes: [
        'Para deixar o sistema mais bonito.',
        'Porque uma etapa costuma preparar ou proteger a seguinte (ex.: remover partícula antes de uma etapa sensível a entupimento).',
        'Porque a ordem não faz diferença.',
      ],
      correta: 1,
      explicacao: 'O encadeamento existe para que a água chegue em condição adequada a cada etapa. A ordem é técnica, não estética.'
    },
  ],

  exercicio: {
    enunciado: 'Pegue um dos exemplos didáticos (ex.: "pré-filtração → carvão → membrana") e explique, em 2–3 frases, por que a etapa inicial vem antes — sem afirmar eficiências e deixando claro que a sequência final depende do diagnóstico.',
    dica: 'Fale em "proteger/preparar a etapa seguinte" e feche lembrando que o arranjo real sai do laudo + hidráulica + especialista.'
  },

  resumo: 'Uma estação é uma sequência de etapas com papéis (pré-tratamento, tratamento principal, pós-tratamento/reservação), e a ordem existe para preparar/proteger cada etapa seguinte. Os cinco arranjos apresentados são exemplos didáticos, não projetos universais: poços diferentes pedem arquiteturas diferentes conforme laudo, hidráulica e objetivo. O arranjo real é pendente de validação técnica da TDF, definido pelo diagnóstico e pelo especialista.'
};
