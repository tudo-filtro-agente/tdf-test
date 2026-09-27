/**
 * Lead Score — Seed inicial idempotente.
 *
 * Insere/atualiza:
 *   - 50+ critérios da spec (por product_type)
 *   - Faixas de distância default por produto
 *   - Settings (thresholds de tier, regras especiais)
 *   - ~80 cidades-base com km até São José dos Campos
 *
 * Roda sempre no boot, mas só sobrescreve campos não-tocados pelo gestor
 * se NUNCA editado. Cada critério usa `code` único — se gestor editar via UI,
 * a seed NÃO re-aplica (controlado pela trilha de audit, ver applySeed()).
 *
 * Para forçar reseed, env LEAD_SCORE_FORCE_RESEED=1.
 */

const db = require('./db');

const PRODUCT_TYPES = [
  'FILTRO_ENTRADA_AGUA_TRATADA',
  'FILTRO_ENTRADA_POCO',
  'IRON_FREE',
  'SCALE_STOP',
  'BEBEDOURO_INDUSTRIAL',
  'PURIFICADOR',
  'REFIL_MANUTENCAO',
  'PECAS_ACESSORIOS',
  'OUTROS',
];

/* ============== CRITÉRIOS POR PRODUTO ============== */
// Notas:
//   - condition_json define a DSL avaliada pelo engine.
//   - group_key + group_cap: limita total de pontos por grupo (ex: água-evidência).
//   - accumulable=false: se já bateu uma regra do mesmo group_key, pula.
//   - duplicar entre IRON_FREE e FILTRO_ENTRADA_POCO mantém isolamento.

const POCO_AND_IRON = [
  ['poco_water_source', 'Usa água de poço/mina/cachoeira', 'Fonte da água é poço, mina ou cachoeira',
    { type: 'in_list', field: 'water_source', values: ['poco', 'mina', 'cachoeira'] }, 20, 'fonte_agua'],

  ['poco_visible_symptoms', 'Sintomas visíveis (amarela/ferrugem/etc.)',
    'Cliente relata água amarela, ferrugem, manchas, gosto, cheiro, barro ou manganês',
    { type: 'contains_any', field: 'symptoms',
      values: ['amarela', 'amarelada', 'ferrugem', 'manchas', 'gosto', 'cheiro', 'barro', 'turva', 'manganes', 'manganês'] },
    25, 'sintomas'],

  ['poco_has_analysis', 'Possui análise de água recente',
    'Cliente já tem análise de água recente (laudo)',
    { type: 'truthy', field: 'has_water_analysis' }, 30, 'analise'],

  ['poco_no_analysis_but_close', 'Sem análise mas até 300 km de SJC (viabilizamos)',
    'Mesmo sem análise, está ao alcance da equipe técnica TDF',
    { type: 'all_of', conditions: [
      { type: 'falsy', field: 'has_water_analysis' },
      { type: 'distance_range', max: 300 }
    ] }, 20, 'analise'],

  ['poco_flow_informed', 'Vazão da bomba informada',
    'Cliente já informou vazão (L/h ou L/min)',
    { type: 'truthy', field: 'flow_rate_known' }, 15, 'vazao'],

  ['poco_accepts_analysis_visit', 'Aceita fazer análise ou visita técnica',
    'Cliente disse sim para análise/visita',
    { type: 'truthy', field: 'accepts_analysis_or_visit' }, 20, 'engajamento'],

  ['poco_audience_high_consumption', 'Pousada / condomínio / comércio / indústria / alto consumo',
    'Perfil de alto consumo',
    { type: 'in_list', field: 'audience',
      values: ['pousada', 'condominio', 'comercio', 'industria', 'alto_consumo', 'hotel', 'fazenda'] },
    25, 'perfil'],

  ['poco_urgent_7d', 'Quer resolver em até 7 dias',
    'Prazo curto = urgência alta',
    { type: 'numeric_compare', field: 'days_to_buy', op: 'lte', value: 7 }, 25, 'prazo'],

  ['poco_short_30d', 'Quer resolver em até 30 dias',
    'Prazo médio',
    { type: 'all_of', conditions: [
      { type: 'numeric_compare', field: 'days_to_buy', op: 'lte', value: 30 },
      { type: 'numeric_compare', field: 'days_to_buy', op: 'gt', value: 7 }
    ] }, 15, 'prazo'],

  ['poco_asked_price', 'Pediu preço/orçamento',
    'Cliente pediu valor',
    { type: 'truthy', field: 'asked_price' }, 15, 'intencao'],

  ['poco_sent_media', 'Enviou foto ou vídeo da água/local',
    'Engajamento alto: enviou mídia',
    { type: 'truthy', field: 'sent_media' }, 15, 'engajamento'],

  // === PENALIDADES ===
  ['poco_far_and_no_analysis', 'Acima de 300 km e sem análise',
    'Difícil viabilizar visita técnica e sem dado de água',
    { type: 'all_of', conditions: [
      { type: 'distance_range', min: 300.01 },
      { type: 'falsy', field: 'has_water_analysis' }
    ] }, -10, 'penal_dist'],

  ['poco_no_analysis_no_accept', 'Não tem análise E não aceita fazer',
    'Bloqueio de qualificação',
    { type: 'all_of', conditions: [
      { type: 'falsy', field: 'has_water_analysis' },
      { type: 'falsy', field: 'accepts_analysis_or_visit' }
    ] }, -30, 'penal_qualif'],

  ['poco_no_flow_no_accept', 'Não sabe vazão E não aceita medir',
    'Sem dado e sem disposição',
    { type: 'all_of', conditions: [
      { type: 'falsy', field: 'flow_rate_known' },
      { type: 'falsy', field: 'accepts_flow_measure' }
    ] }, -15, 'penal_vazao'],

  ['poco_far_horizon', 'Prazo maior que 6 meses',
    'Curiosidade ou estudo',
    { type: 'numeric_compare', field: 'days_to_buy', op: 'gt', value: 180 }, -20, 'penal_prazo'],

  ['poco_invalid_phone', 'Telefone inválido',
    'Sem como contatar',
    { type: 'truthy', field: 'phone_invalid' }, -100, 'penal_tel'],
];

const FILTRO_TRATADA = [
  ['ft_concessionaria', 'Recebe água de concessionária / estação',
    'Fonte = água tratada',
    { type: 'in_list', field: 'water_source', values: ['concessionaria', 'rua', 'sabesp', 'companhia', 'tratada'] },
    15, 'fonte_agua'],

  ['ft_box_dirt', 'Reclama de barro, limo, lodo, ferrugem, gosto, sujeira',
    'Sintomas típicos de caixa contaminada / rede precária',
    { type: 'contains_any', field: 'symptoms',
      values: ['barro', 'limo', 'lodo', 'ferrugem', 'gosto', 'sujeira', 'particula', 'partícula', 'cheiro'] },
    25, 'sintomas'],

  ['ft_install_request', 'Pediu instalação',
    'Quer instalar agora',
    { type: 'truthy', field: 'asked_install' }, 20, 'intencao'],

  ['ft_asked_price', 'Pediu preço/orçamento',
    'Sinal de intenção',
    { type: 'truthy', field: 'asked_price' }, 15, 'intencao'],

  ['ft_has_caixa', 'Casa com caixa d\'água',
    'Tem ponto de instalação claro',
    { type: 'truthy', field: 'has_caixa_dagua' }, 15, 'infra'],

  ['ft_sensitive_equipment', 'Tem boiler, piscina, aquecedor, purificador ou eletro sensível',
    'Justifica filtro de entrada protegendo equipamentos',
    { type: 'truthy', field: 'has_sensitive_equipment' }, 15, 'infra'],

  ['ft_urgent_7d', 'Quer resolver em até 7 dias',
    'Urgência',
    { type: 'numeric_compare', field: 'days_to_buy', op: 'lte', value: 7 }, 25, 'prazo'],

  // PENALIDADES
  ['ft_far_horizon', 'Prazo maior que 6 meses',
    'Curiosidade',
    { type: 'numeric_compare', field: 'days_to_buy', op: 'gt', value: 180 }, -20, 'penal_prazo'],

  ['ft_curioso', 'Curioso / sem intenção clara',
    'Diagnóstico do SDR',
    { type: 'truthy', field: 'curioso_sem_intencao' }, -15, 'penal_intencao'],

  ['ft_invalid_phone', 'Telefone inválido',
    'Sem como contatar',
    { type: 'truthy', field: 'phone_invalid' }, -100, 'penal_tel'],
];

const BEBEDOURO = [
  ['beb_audience_business', 'Empresa/comércio/escola/academia/igreja/indústria/obra',
    'Perfil B2B',
    { type: 'in_list', field: 'audience',
      values: ['empresa', 'comercio', 'escola', 'academia', 'igreja', 'industria', 'obra', 'restaurante', 'lanchonete'] },
    25, 'perfil'],

  ['beb_asked_price', 'Pediu preço/orçamento',
    'Sinal de intenção',
    { type: 'truthy', field: 'asked_price' }, 20, 'intencao'],

  ['beb_pronta_entrega', 'Precisa de pronta entrega',
    'Demanda imediata',
    { type: 'truthy', field: 'needs_pronta_entrega' }, 20, 'prazo'],

  ['beb_consumo_info', 'Informou quantidade de pessoas ou consumo',
    'Qualificação técnica',
    { type: 'any_of', conditions: [
      { type: 'truthy', field: 'people_count_informed' },
      { type: 'truthy', field: 'consumption_informed' }
    ] }, 15, 'qualif'],

  ['beb_urgent_7d', 'Quer comprar em até 7 dias',
    'Urgência',
    { type: 'numeric_compare', field: 'days_to_buy', op: 'lte', value: 7 }, 25, 'prazo'],

  ['beb_nacional', 'Pediu envio para todo Brasil',
    'Aceita receber por transportadora',
    { type: 'truthy', field: 'accepts_nationwide_ship' }, 10, 'logistica'],

  // PENALIDADES
  ['beb_pf_no_context', 'Pessoa física sem contexto comercial',
    'PF sem perfil B2B',
    { type: 'all_of', conditions: [
      { type: 'truthy', field: 'is_pessoa_fisica' },
      { type: 'falsy', field: 'has_business_context' }
    ] }, -10, 'penal_perfil'],

  ['beb_curioso', 'Curioso / sem intenção clara',
    'Curiosidade',
    { type: 'truthy', field: 'curioso_sem_intencao' }, -15, 'penal_intencao'],

  ['beb_invalid_phone', 'Telefone inválido',
    'Sem como contatar',
    { type: 'truthy', field: 'phone_invalid' }, -100, 'penal_tel'],
];

function expandCriteria() {
  const out = [];
  // POÇO e IRON_FREE compartilham regras (e SCALE_STOP herda também).
  for (const productType of ['FILTRO_ENTRADA_POCO', 'IRON_FREE', 'SCALE_STOP']) {
    for (const [code, name, description, condition, points, group_key] of POCO_AND_IRON) {
      out.push({
        code: `${productType}__${code}`,
        name, description, product_type: productType,
        condition_json: condition, points, group_key,
        accumulable: true, priority: 100, is_active: true,
      });
    }
  }
  for (const [code, name, description, condition, points, group_key] of FILTRO_TRATADA) {
    out.push({
      code: `FILTRO_ENTRADA_AGUA_TRATADA__${code}`,
      name, description, product_type: 'FILTRO_ENTRADA_AGUA_TRATADA',
      condition_json: condition, points, group_key,
      accumulable: true, priority: 100, is_active: true,
    });
  }
  for (const [code, name, description, condition, points, group_key] of BEBEDOURO) {
    out.push({
      code: `BEBEDOURO_INDUSTRIAL__${code}`,
      name, description, product_type: 'BEBEDOURO_INDUSTRIAL',
      condition_json: condition, points, group_key,
      accumulable: true, priority: 100, is_active: true,
    });
  }
  return out;
}

/* ============== FAIXAS DE DISTÂNCIA ============== */
const DISTANCE_BANDS = [
  // POÇO/IRON_FREE/SCALE_STOP
  ['until_150', 'FILTRO_ENTRADA_POCO', 'Até 150 km de SJC', 0, 150, 25],
  ['151_300',   'FILTRO_ENTRADA_POCO', 'Entre 151 e 300 km', 150.01, 300, 15],
  ['above_300', 'FILTRO_ENTRADA_POCO', 'Acima de 300 km', 300.01, null, 0],
  ['nacional',  'FILTRO_ENTRADA_POCO', 'Nacional / sem cálculo', null, null, 0],

  ['until_150', 'IRON_FREE', 'Até 150 km de SJC', 0, 150, 25],
  ['151_300',   'IRON_FREE', 'Entre 151 e 300 km', 150.01, 300, 15],
  ['above_300', 'IRON_FREE', 'Acima de 300 km', 300.01, null, 0],
  ['nacional',  'IRON_FREE', 'Nacional / sem cálculo', null, null, 0],

  ['until_150', 'SCALE_STOP', 'Até 150 km de SJC', 0, 150, 25],
  ['151_300',   'SCALE_STOP', 'Entre 151 e 300 km', 150.01, 300, 15],
  ['above_300', 'SCALE_STOP', 'Acima de 300 km', 300.01, null, 0],
  ['nacional',  'SCALE_STOP', 'Nacional / sem cálculo', null, null, 0],

  // FILTRO ENTRADA TRATADA (mais sensível a distância)
  ['until_150', 'FILTRO_ENTRADA_AGUA_TRATADA', 'Até 150 km de SJC', 0, 150, 25],
  ['151_300',   'FILTRO_ENTRADA_AGUA_TRATADA', 'Entre 151 e 300 km', 150.01, 300, 10],
  ['above_300', 'FILTRO_ENTRADA_AGUA_TRATADA', 'Acima de 300 km', 300.01, null, 0],
  ['nacional',  'FILTRO_ENTRADA_AGUA_TRATADA', 'Nacional / sem cálculo', null, null, 0],

  // BEBEDOURO (envio nacional → distância impacta pouco)
  ['until_300', 'BEBEDOURO_INDUSTRIAL', 'Até 300 km de SJC', 0, 300, 5],
  ['above_300', 'BEBEDOURO_INDUSTRIAL', 'Acima de 300 km', 300.01, null, 0],
  ['nacional',  'BEBEDOURO_INDUSTRIAL', 'Nacional / sem cálculo', null, null, 0],

  // PURIFICADOR / REFIL / PEÇAS / OUTROS — sem peso forte por padrão
  ['nacional', 'PURIFICADOR', 'Nacional', null, null, 0],
  ['nacional', 'REFIL_MANUTENCAO', 'Nacional', null, null, 0],
  ['nacional', 'PECAS_ACESSORIOS', 'Nacional', null, null, 0],
  ['nacional', 'OUTROS', 'Nacional', null, null, 0],
];

/* ============== SETTINGS (tiers + regras especiais) ============== */
const DEFAULT_SETTINGS = [
  ['tier_thresholds', {
    DIAMANTE: { min: 80, max: null, icon: '💎' },
    OURO:     { min: 60, max: 79,   icon: '🥇' },
    PRATA:    { min: 40, max: 59,   icon: '🥈' },
    BRONZE:   { min: 20, max: 39,   icon: '🥉' },
    PEDRA:    { min: null, max: 19, icon: '🪨' },
  }, 'Faixas de score por tier. min/max inclusivos, null = sem limite'],

  ['special_rules', {
    invalid_phone_forces_pedra: true,
    above_300_iron_free_no_analysis_needs_qualif: true,
    diamante_min_must_have_phone_valid: true,
  }, 'Regras especiais que sobrepõem o cálculo'],

  ['recalc_triggers', {
    lead_created: true,
    whatsapp_received: true,
    info_updated: true,
    analysis_uploaded: true,
    flow_informed: true,
    city_informed: true,
    days_to_buy_changed: true,
    product_changed: true,
    phone_validated: true,
  }, 'Eventos que disparam recálculo automático'],
];

/* ============== CIDADES (subset Vale/SP/Sul-MG) ============== */
// distância aproximada por rodovia até São José dos Campos/SP.
// Gestor pode editar via UI.
const CITIES = [
  // VALE DO PARAÍBA / SERRA DA MANTIQUEIRA
  ['sao jose dos campos', 'São José dos Campos', 'SP', 0],
  ['jacarei', 'Jacareí', 'SP', 14],
  ['caçapava', 'Caçapava', 'SP', 16],
  ['cacapava', 'Caçapava', 'SP', 16],
  ['taubate', 'Taubaté', 'SP', 40],
  ['taubaté', 'Taubaté', 'SP', 40],
  ['tremembe', 'Tremembé', 'SP', 39],
  ['tremembé', 'Tremembé', 'SP', 39],
  ['pindamonhangaba', 'Pindamonhangaba', 'SP', 55],
  ['roseira', 'Roseira', 'SP', 62],
  ['aparecida', 'Aparecida', 'SP', 70],
  ['guaratingueta', 'Guaratinguetá', 'SP', 80],
  ['guaratinguetá', 'Guaratinguetá', 'SP', 80],
  ['lorena', 'Lorena', 'SP', 95],
  ['cachoeira paulista', 'Cachoeira Paulista', 'SP', 105],
  ['cruzeiro', 'Cruzeiro', 'SP', 125],
  ['queluz', 'Queluz', 'SP', 145],
  ['campos do jordao', 'Campos do Jordão', 'SP', 60],
  ['campos do jordão', 'Campos do Jordão', 'SP', 60],
  ['santo antonio do pinhal', 'Santo Antônio do Pinhal', 'SP', 70],
  ['sao bento do sapucai', 'São Bento do Sapucaí', 'SP', 90],
  ['ubatuba', 'Ubatuba', 'SP', 80],
  ['caraguatatuba', 'Caraguatatuba', 'SP', 60],
  ['sao sebastiao', 'São Sebastião', 'SP', 95],
  ['são sebastião', 'São Sebastião', 'SP', 95],
  ['ilhabela', 'Ilhabela', 'SP', 100],
  ['paraibuna', 'Paraibuna', 'SP', 35],
  ['natividade da serra', 'Natividade da Serra', 'SP', 70],
  ['redencao da serra', 'Redenção da Serra', 'SP', 55],
  ['monteiro lobato', 'Monteiro Lobato', 'SP', 45],
  ['jambeiro', 'Jambeiro', 'SP', 25],
  ['santa branca', 'Santa Branca', 'SP', 30],
  ['paraibuna', 'Paraibuna', 'SP', 35],
  ['piquete', 'Piquete', 'SP', 95],
  ['silveiras', 'Silveiras', 'SP', 130],
  ['bananal', 'Bananal', 'SP', 165],
  ['areias', 'Areias', 'SP', 150],
  ['arapei', 'Arapeí', 'SP', 155],
  ['sao luiz do paraitinga', 'São Luiz do Paraitinga', 'SP', 80],

  // RMSP / GRANDE SP
  ['sao paulo', 'São Paulo', 'SP', 100],
  ['são paulo', 'São Paulo', 'SP', 100],
  ['guarulhos', 'Guarulhos', 'SP', 70],
  ['osasco', 'Osasco', 'SP', 115],
  ['santo andre', 'Santo André', 'SP', 115],
  ['santo andré', 'Santo André', 'SP', 115],
  ['sao bernardo do campo', 'São Bernardo do Campo', 'SP', 115],
  ['são bernardo do campo', 'São Bernardo do Campo', 'SP', 115],
  ['sao caetano do sul', 'São Caetano do Sul', 'SP', 110],
  ['diadema', 'Diadema', 'SP', 120],
  ['maua', 'Mauá', 'SP', 105],
  ['ribeirao pires', 'Ribeirão Pires', 'SP', 110],
  ['mogi das cruzes', 'Mogi das Cruzes', 'SP', 50],
  ['suzano', 'Suzano', 'SP', 60],
  ['itaquaquecetuba', 'Itaquaquecetuba', 'SP', 65],
  ['ferraz de vasconcelos', 'Ferraz de Vasconcelos', 'SP', 75],
  ['poá', 'Poá', 'SP', 70],
  ['poa', 'Poá', 'SP', 70],
  ['aruja', 'Arujá', 'SP', 60],
  ['arujá', 'Arujá', 'SP', 60],
  ['santa isabel', 'Santa Isabel', 'SP', 50],
  ['igarata', 'Igaratá', 'SP', 25],
  ['igaratá', 'Igaratá', 'SP', 25],

  // CAMPINAS / INTERIOR SP
  ['campinas', 'Campinas', 'SP', 200],
  ['jundiai', 'Jundiaí', 'SP', 150],
  ['jundiaí', 'Jundiaí', 'SP', 150],
  ['atibaia', 'Atibaia', 'SP', 90],
  ['braganca paulista', 'Bragança Paulista', 'SP', 100],
  ['nazare paulista', 'Nazaré Paulista', 'SP', 70],
  ['piracaia', 'Piracaia', 'SP', 80],
  ['sao roque', 'São Roque', 'SP', 160],
  ['sorocaba', 'Sorocaba', 'SP', 195],
  ['itu', 'Itu', 'SP', 175],
  ['ribeirao preto', 'Ribeirão Preto', 'SP', 410],
  ['araraquara', 'Araraquara', 'SP', 360],
  ['sao jose do rio preto', 'São José do Rio Preto', 'SP', 520],
  ['bauru', 'Bauru', 'SP', 430],
  ['piracicaba', 'Piracicaba', 'SP', 250],

  // LITORAL SUL
  ['santos', 'Santos', 'SP', 175],
  ['sao vicente', 'São Vicente', 'SP', 180],
  ['praia grande', 'Praia Grande', 'SP', 195],
  ['guaruja', 'Guarujá', 'SP', 175],
  ['cubatao', 'Cubatão', 'SP', 165],

  // SUL DE MG
  ['itajuba', 'Itajubá', 'MG', 105],
  ['itajubá', 'Itajubá', 'MG', 105],
  ['pouso alegre', 'Pouso Alegre', 'MG', 155],
  ['santa rita do sapucai', 'Santa Rita do Sapucaí', 'MG', 130],
  ['extrema', 'Extrema', 'MG', 130],
  ['camanducaia', 'Camanducaia', 'MG', 120],
  ['tres coracoes', 'Três Corações', 'MG', 235],
  ['varginha', 'Varginha', 'MG', 250],
  ['lavras', 'Lavras', 'MG', 320],
  ['sao lourenco', 'São Lourenço', 'MG', 200],
  ['caxambu', 'Caxambu', 'MG', 215],

  // SUL FLUMINENSE
  ['resende', 'Resende', 'RJ', 175],
  ['volta redonda', 'Volta Redonda', 'RJ', 240],
  ['barra mansa', 'Barra Mansa', 'RJ', 225],
  ['itatiaia', 'Itatiaia', 'RJ', 165],
  ['penedo', 'Penedo (Itatiaia)', 'RJ', 165],
  ['angra dos reis', 'Angra dos Reis', 'RJ', 230],
  ['parati', 'Paraty', 'RJ', 200],
  ['paraty', 'Paraty', 'RJ', 200],
  ['rio de janeiro', 'Rio de Janeiro', 'RJ', 360],

  // OUTRAS CAPITAIS (>300km, nacional)
  ['belo horizonte', 'Belo Horizonte', 'MG', 500],
  ['curitiba', 'Curitiba', 'PR', 530],
  ['florianopolis', 'Florianópolis', 'SC', 800],
  ['brasilia', 'Brasília', 'DF', 1010],
  ['salvador', 'Salvador', 'BA', 1900],
  ['recife', 'Recife', 'PE', 2700],
  ['fortaleza', 'Fortaleza', 'CE', 2900],
  ['manaus', 'Manaus', 'AM', 3950],
  ['porto alegre', 'Porto Alegre', 'RS', 1200],
  ['vitoria', 'Vitória', 'ES', 800],
];

/* ============================== APPLY ============================== */

async function applySeed(pool, { force = false } = {}) {
  const force_ = force || process.env.LEAD_SCORE_FORCE_RESEED === '1';

  // critérios
  let critUpserted = 0;
  for (const c of expandCriteria()) {
    if (!force_) {
      // Se já existe e foi editado por humano, pula
      const existing = await pool.query(
        `SELECT id, updated_by FROM lead_score_criteria WHERE code = $1`, [c.code]
      );
      if (existing.rows[0] && existing.rows[0].updated_by && existing.rows[0].updated_by !== 'seed') continue;
    }
    await db.upsertCriterion(pool, c, 'seed');
    critUpserted++;
  }

  // faixas de distância
  let bandUpserted = 0;
  for (const [code, productType, label, minKm, maxKm, points] of DISTANCE_BANDS) {
    if (!force_) {
      const existing = await pool.query(
        `SELECT id, updated_by FROM lead_score_distance_bands WHERE code = $1 AND product_type = $2`,
        [code, productType]
      );
      if (existing.rows[0] && existing.rows[0].updated_by && existing.rows[0].updated_by !== 'seed') continue;
    }
    await db.upsertDistanceBand(pool, {
      code, product_type: productType, label,
      min_km: minKm, max_km: maxKm, points,
      is_active: true, priority: 100,
    }, 'seed');
    bandUpserted++;
  }

  // settings — só insere se não existe
  let settingsUpserted = 0;
  for (const [key, value, description] of DEFAULT_SETTINGS) {
    const existing = await db.getSetting(pool, key);
    if (existing == null || force_) {
      await db.setSetting(pool, key, value, description, 'seed');
      settingsUpserted++;
    }
  }

  // cidades
  let citiesUpserted = 0;
  for (const [norm, display, uf, km] of CITIES) {
    await db.upsertCity(pool, {
      cidade_normalizada: norm,
      cidade_display: display,
      uf,
      distance_km_sjc: km,
      aliases: [],
    });
    citiesUpserted++;
  }

  return { critUpserted, bandUpserted, settingsUpserted, citiesUpserted, forced: force_ };
}

module.exports = {
  applySeed,
  PRODUCT_TYPES,
  // exports pra inspeção/testes:
  _internal: { expandCriteria, DISTANCE_BANDS, DEFAULT_SETTINGS, CITIES }
};
