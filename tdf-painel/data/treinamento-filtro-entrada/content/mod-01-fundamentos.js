// Módulo 1 — O que é um filtro de entrada. Conceitual. Specs de produto -> "pendente".
module.exports = {
  resumoCurto: 'Filtro de entrada trata a água da casa toda a partir do ponto onde a rede da concessionária entra no imóvel: melhora sedimento, cloro, gosto e odor. Não é filtro de torneira, não é poço.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'fe-fundamentos-video' },
  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'A ideia central',
      html: 'Filtro de entrada = <strong>filtragem da casa inteira</strong> a partir do <strong>ponto de entrada</strong> da água da rua. Uma vez instalado, toda torneira, chuveiro e caixa d\'água recebe a água já filtrada.' },
    { tipo: 'titulo', texto: 'O que é um filtro de entrada' },
    { tipo: 'texto', html: 'O filtro de entrada é instalado logo onde a água da <strong>concessionária</strong> (SABESP, CEDAE, Sanasa e afins) entra no imóvel — antes de se dividir para a casa. Por isso ele trata a água que abastece <strong>todos os pontos</strong>: cozinha, banheiros, área de serviço e a caixa d\'água.' },
    { tipo: 'texto', html: 'O papel dele é <strong>melhorar a água que já vem da rua</strong>: reter sedimento (barro, areia, ferrugem da tubulação), reduzir cloro e melhorar gosto e odor. É o que o cliente urbano procura quando diz "não confio" ou "quero melhorar" a água da minha casa.' },
    { tipo: 'cards', itens: [
      { icon: '🏠', titulo: 'Casa toda', html: 'Protege desde a caixa d\'água até o último ponto — não só um filtro na pia.' },
      { icon: '🚰', titulo: 'Água de concessionária', html: 'É água <strong>tratada pela cidade</strong> que ainda incomoda (cloro, sedimento, cor, gosto). <strong>Não é poço.</strong>' },
      { icon: '🛡️', titulo: 'Proteção', html: 'Ao reter sedimento, ajuda a proteger encanamento, registros e eletrodomésticos que usam água.' },
    ]},
    { tipo: 'titulo', texto: 'Filtro de entrada x filtro de torneira x purificador' },
    { tipo: 'tabela', head: ['Tipo', 'Onde fica', 'O que atende'], rows: [
      ['<strong>Filtro de entrada</strong>', 'No ponto de entrada da água do imóvel', 'A casa toda — todos os pontos de água'],
      ['Filtro de torneira / purificador', 'Em um único ponto (a pia)', 'Só a água daquela torneira, geralmente para beber'],
    ]},
    { tipo: 'callout', variante: 'alerta', titulo: 'Não confunda os papéis',
      html: 'Filtro de torneira resolve <strong>um ponto</strong> (beber na cozinha). Filtro de entrada resolve a <strong>água que chega em toda a casa</strong> — chuveiro, máquina de lavar, caixa d\'água. São soluções para necessidades diferentes; um não substitui o outro.' },
    { tipo: 'especialista', nome: 'posicionamento',
      html: 'Quando o cliente reclama de gosto/cloro só na cozinha, ele pode achar que "um filtrinho de torneira resolve". O especialista mostra que a água que incomoda é a <strong>mesma que sai no chuveiro e enche a caixa</strong> — e que o filtro de entrada cuida de tudo isso de uma vez.' },
    { tipo: 'pendente', titulo: 'Specs técnicas ficam na ficha oficial',
      html: 'Vazão, estágios, tipo de mídia, capacidade e medidas de cada modelo <strong>não são improvisados aqui</strong>: consulte sempre a ficha técnica oficial da TDF antes de cravar número com o cliente.' },
    { tipo: 'dodont',
      fazer: ['Explicar que trata a casa toda a partir do ponto de entrada.', 'Deixar claro que é água de concessionária, não poço.', 'Diferenciar do filtro de torneira/purificador.'],
      evitar: ['Vender como "filtro de beber" de um ponto só.', 'Prometer potabilidade absoluta ou remoção garantida de contaminante.', 'Inventar vazão/estágios — isso vem da ficha técnica.'] },
  ],
  perguntasRapidas: [
    { pergunta: 'Onde o filtro de entrada é instalado?', opcoes: ['Só na torneira da cozinha.', 'No ponto de entrada da água do imóvel, tratando a casa toda.', 'Dentro da caixa d\'água apenas.'], correta: 1, explicacao: 'Ele fica no ponto onde a água da rua entra no imóvel, por isso trata todos os pontos de água da casa.' },
    { pergunta: 'Qual a diferença principal para um filtro de torneira?', opcoes: ['Nenhuma, é a mesma coisa.', 'O de torneira atende um ponto; o de entrada atende a casa inteira.', 'O de entrada só serve para beber.'], correta: 1, explicacao: 'Filtro de torneira resolve um ponto; o filtro de entrada trata a água que chega em toda a casa.' },
    { pergunta: 'A água que o filtro de entrada trata vem de onde, no cliente típico?', opcoes: ['De poço não tratado.', 'Da concessionária (água da rua).', 'De mina ou nascente.'], correta: 1, explicacao: 'Filtro de entrada é para água de concessionária — cliente urbano que quer melhorar a água da rua.' },
  ],
  exercicio: { enunciado: 'Um cliente diz: "quero um filtro só na pia da cozinha, é onde bebo água". Como você explica o filtro de entrada sem desmerecer a preocupação dele?', dica: 'Reconheça o ponto (beber na cozinha), mostre que a mesma água sai no chuveiro e enche a caixa, e posicione o filtro de entrada como a solução da casa toda.' },
  resumo: 'Filtro de entrada trata a água da concessionária no ponto de entrada do imóvel, melhorando sedimento, cloro, gosto e odor em toda a casa. Diferente do filtro de torneira (um ponto), ele cuida de tudo e ajuda a proteger encanamento e eletrodomésticos. Specs exatas vêm da ficha técnica oficial; nunca prometa potabilidade absoluta.'
};
