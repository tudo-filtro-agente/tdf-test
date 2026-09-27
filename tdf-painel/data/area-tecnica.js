// ============================================================================
// ÁREA TÉCNICA — dados para o dimensionamento e a base de válvulas.
// TANQUES FRP: volumes de mídia de REFERÊNCIA DE ENGENHARIA (padrão Structural/Pentair;
//   já consideram o freeboard de retrolavagem, ~50% do tanque). O estoque pode CALIBRAR
//   os valores conforme o tanque/fornecedor real da TDF (campos editáveis no app).
// DENSIDADES: valores típicos de mercado (kg/L) — ajustáveis. HyperScaleX = 0,77 (ficha oficial).
// VÁLVULAS: base de problemas/soluções compilada de manuais Runxin (fontes no rodapé do app).
// NÃO cravar como spec fechada: é ferramenta de apoio; confirmar com a ficha do produto.
// ============================================================================

const FT3_L = 28.3168; // 1 ft³ = 28,3168 L

// tanque: code, diâmetro", altura", volume de mídia de referência (ft³)
const TANQUES = [
  { code: '0817', d: 8,  h: 17, mediaFt3: 0.25 },
  { code: '0835', d: 8,  h: 35, mediaFt3: 0.5 },
  { code: '0844', d: 8,  h: 44, mediaFt3: 0.75 },
  { code: '0948', d: 9,  h: 48, mediaFt3: 0.9 },
  { code: '1044', d: 10, h: 44, mediaFt3: 0.75 },
  { code: '1054', d: 10, h: 54, mediaFt3: 1.0 },
  { code: '1252', d: 12, h: 52, mediaFt3: 1.5 },
  { code: '1354', d: 13, h: 54, mediaFt3: 1.75 },
  { code: '1465', d: 14, h: 65, mediaFt3: 2.0 },
  { code: '1665', d: 16, h: 65, mediaFt3: 3.0 },
  { code: '1865', d: 18, h: 65, mediaFt3: 4.0 },
  { code: '2162', d: 21, h: 62, mediaFt3: 5.0 },
  { code: '2472', d: 24, h: 72, mediaFt3: 7.0 },
  { code: '3072', d: 30, h: 72, mediaFt3: 10.0 },
].map(t => ({ ...t, mediaL: +(t.mediaFt3 * FT3_L).toFixed(1) }));

// mídias: densidade (kg/L, referência), papel e observações
const MIDIAS = [
  { id: 'quartzo',      nome: 'Quartzo / Seixo (suporte)',   densidade: 1.6,  papel: 'Underbed de suporte no fundo — sustenta o distribuidor e evita perda de mídia.', tipo: 'suporte' },
  { id: 'areia-grossa', nome: 'Areia grossa',                densidade: 1.55, papel: 'Camada baixa do leito graduado — transição do suporte para a filtragem.', tipo: 'filtrante' },
  { id: 'areia-media',  nome: 'Areia média',                 densidade: 1.5,  papel: 'Camada intermediária do leito graduado.', tipo: 'filtrante' },
  { id: 'areia-fina',   nome: 'Areia fina',                  densidade: 1.45, papel: 'Camada de topo (mais fina) — faz o polimento da filtragem de partículas.', tipo: 'filtrante' },
  { id: 'zeolita',      nome: 'Zeólita (opcional)',          densidade: 0.85, papel: 'Opcional no topo — alta área superficial, boa para turbidez fina.', tipo: 'filtrante' },
  { id: 'antracito',    nome: 'Antracito (opcional)',        densidade: 0.8,  papel: 'Opcional no topo do leito multimídia (grão maior/leve).', tipo: 'filtrante' },
  { id: 'carvao',       nome: 'Carvão ativado',              densidade: 0.5,  papel: 'Adsorção de cloro, gosto e odor. Não é filtro de partícula nem remove dureza.', tipo: 'carvao' },
  { id: 'resina',       nome: 'Resina catiônica (abrandador)', densidade: 0.8, papel: 'Troca iônica: remove dureza (Ca/Mg → Na), regenera com sal. Dimensionar TAMBÉM pela dureza/vazão.', tipo: 'resina' },
  { id: 'hyperscale',   nome: 'HyperScaleX (anti-incrustante)', densidade: 0.77, papel: 'Salt-free (TAC/DAC). Reduz incrustação sem remover dureza. Dimensiona por VAZÃO (ver ficha).', tipo: 'condicionador' },
];

// RECEITA do filtro de partículas — leito graduado (% do volume de mídia do tanque).
// Ordem de baixo p/ cima: suporte -> grossa -> média -> fina -> (zeólita topo).
// Percentuais e densidades são de REFERÊNCIA — o estoque calibra pela receita real da TDF.
const RECEITA_PARTICULAS = {
  camadas: [
    { id: 'quartzo',      pct: 20 },
    { id: 'areia-grossa', pct: 15 },
    { id: 'areia-media',  pct: 20 },
    { id: 'areia-fina',   pct: 30 },
    { id: 'zeolita',      pct: 15 },
  ],
  nota: 'Leito graduado de referência (soma 100%). Ajuste as % conforme a receita da TDF, a altura do distribuidor e o freeboard.',
};

// ------------------------- VÁLVULAS: automática × manual -------------------
const VALVULAS = {
  comparativo: [
    { criterio: 'Como aciona', manual: 'O operador gira a válvula para cada posição (serviço, retrolavagem, enxágue…).', automatica: 'A válvula executa os ciclos sozinha, por TEMPO (relógio) ou por VOLUME (hidrômetro).' },
    { criterio: 'Regeneração/retrolavagem', manual: 'Depende de alguém lembrar e fazer manualmente.', automatica: 'Programada — acontece no horário/volume definido, sem depender de pessoa.' },
    { criterio: 'Custo', manual: 'Mais barata.', automatica: 'Mais cara, mas evita esquecimento e mantém a mídia trabalhando bem.' },
    { criterio: 'Indicação', manual: 'Uso simples, baixa vazão, cliente disciplinado.', automatica: 'Uso intenso, comercial/industrial, quando não se pode depender de operação manual.' },
    { criterio: 'Energia', manual: 'Não precisa de energia elétrica.', automatica: 'Precisa de energia; em falta de luz, retoma a programação (verificar bateria/memória).' },
  ],
  faixaPressao: '0,15–0,6 MPa (≈ 1,5–6 bar). Fora dessa faixa, a válvula não opera bem.',
  // problema -> possíveis causas -> soluções (compilado de manuais Runxin)
  troubleshooting: [
    { problema: 'Não regenera / não inicia o ciclo', causas: ['Programação/relógio errados ou resetados', 'Fiação do sinal solta ou rompida', 'Controlador com defeito', 'Sujeira travando a engrenagem de acionamento', 'Falta de energia'], solucoes: ['Conferir e reprogramar horário/volume', 'Refazer/checar a fiação do sinal', 'Limpar material estranho na engrenagem', 'Trocar o controlador se defeituoso', 'Verificar energia/bateria'] },
    { problema: 'Vazando continuamente para o dreno', causas: ['Vazamento interno na válvula (pistão/vedações)', 'Sujeira no pistão/selo', 'Ciclo travado'], solucoes: ['Inspecionar/limpar pistão e vedações', 'Reparar ou trocar o corpo da válvula se houver vazamento interno', 'Rodar os ciclos manualmente para destravar'] },
    { problema: 'Baixa pressão / pouca vazão na saída', causas: ['Pressão de linha baixa (< 0,15 MPa)', 'Injetor entupido', 'Linha de dreno entupida/restrita', 'Mídia colmatada/suja (retrolavagem insuficiente)'], solucoes: ['Aumentar a pressão de linha', 'Limpar ou trocar o injetor', 'Limpar a linha de dreno', 'Revisar/retrolavar a mídia'] },
    { problema: 'Não aspira salmoura (abrandador não regenera)', causas: ['Injetor entupido', 'Pressão de linha baixa', 'Linha de salmoura entupida ou com vazamento de ar', 'Ponte de sal (salt bridge) no tanque de sal', 'Sem sal'], solucoes: ['Limpar o injetor', 'Corrigir a pressão de linha', 'Limpar/vedar a linha de salmoura', 'Quebrar a ponte de sal', 'Repor o sal'] },
    { problema: 'Água dura mesmo após regenerar (abrandador)', causas: ['Falta de sal / ponte de sal', 'Bypass aberto', 'Dureza/consumo acima da capacidade da resina', 'Resina saturada ou suja (ferro)', 'Programação de dureza/regeneração incorreta'], solucoes: ['Repor sal e quebrar ponte de sal', 'Fechar o bypass', 'Redimensionar (mais resina) ou aumentar frequência de regeneração', 'Limpar/regenerar a resina (ferro exige pré-tratamento)', 'Ajustar a programação'] },
    { problema: 'Água salgada na saída após regeneração', causas: ['Enxágue insuficiente', 'Pressão baixa', 'Dreno restrito', 'Excesso de salmoura'], solucoes: ['Aumentar o tempo de enxágue rápido', 'Corrigir pressão/dreno', 'Revisar a programação de salmoura'] },
    { problema: 'Perda de mídia pelo dreno', causas: ['Tubo central (riser) / crepina do distribuidor quebrado', 'Retrolavagem forte demais (restritor DLFC incorreto)', 'Freeboard insuficiente (tanque cheio demais de mídia)'], solucoes: ['Verificar/trocar o distribuidor e o tubo central', 'Ajustar o restritor de fluxo de retrolavagem', 'Reduzir a carga de mídia (respeitar o freeboard)'] },
    { problema: 'Erro no display / não conta tempo ou volume', causas: ['Falta de energia / bateria', 'Hidrômetro (medidor) travado ou desconectado', 'Controlador com defeito'], solucoes: ['Restaurar energia e verificar bateria/memória', 'Limpar/reconectar o medidor de volume', 'Trocar o controlador'] },
    { problema: 'Consumo de sal muito alto', causas: ['Programação de salmoura/regeneração errada', 'Regeneração frequente demais', 'Vazamento na linha de salmoura'], solucoes: ['Ajustar a programação pela dureza real', 'Rever a frequência de regeneração', 'Corrigir vazamentos'] },
  ],
};

module.exports = { FT3_L, TANQUES, MIDIAS, RECEITA_PARTICULAS, VALVULAS };
