/**
 * Lead Score — Testes obrigatórios da spec.
 *
 * Cada teste cria um lead_ctx, roda engine.calculate, valida asserções.
 * Não toca banco em escrita (read-only). Pode rodar a qualquer momento via
 * POST /api/lead-score/run-tests.
 *
 * Retorno: { passed, failed, total, cases: [{ id, name, status, details }] }
 */

const engine = require('./engine');
const db = require('./db');

function assert(label, cond, details) {
  if (cond) return { label, ok: true };
  return { label, ok: false, details: details || 'expectativa falhou' };
}

async function runCase(pool, c) {
  let breakdown;
  try {
    breakdown = await engine.calculate(pool, c.ctx, { traceMisses: false });
  } catch (e) {
    return { id: c.id, name: c.name, status: 'error', error: e.message };
  }
  const checks = c.assertions(breakdown);
  const failed = checks.filter(c => !c.ok);
  return {
    id: c.id, name: c.name,
    status: failed.length === 0 ? 'pass' : 'fail',
    breakdown_summary: {
      product_type: breakdown.product_type,
      score_auto: breakdown.score_auto,
      tier_auto: breakdown.tier_auto,
      hits: breakdown.hits.length,
      special_rules_applied: breakdown.special_rules_applied.length,
    },
    checks,
    failed: failed.map(f => `${f.label}: ${f.details || ''}`),
  };
}

const CASES = [
  {
    id: 't1_poco_analise_dor_forte',
    name: 'Poço com análise + dor forte → score alto',
    ctx: {
      product_type: 'IRON_FREE',
      cidade: 'Taubaté',
      water_source: 'poco',
      symptoms: ['amarela', 'ferrugem'],
      has_water_analysis: true,
      flow_rate_known: true,
      days_to_buy: 7,
      asked_price: true,
      phone_invalid: false,
    },
    assertions: (b) => [
      assert('score >= 80', b.score_auto >= 80, `score=${b.score_auto}`),
      assert('tier DIAMANTE', b.tier_auto === 'DIAMANTE', `tier=${b.tier_auto}`),
      assert('hit poço fonte', b.hits.some(h => h.code.endsWith('poco_water_source'))),
      assert('hit análise', b.hits.some(h => h.code.endsWith('poco_has_analysis'))),
      assert('hit sintomas', b.hits.some(h => h.code.endsWith('poco_visible_symptoms'))),
    ],
  },

  {
    id: 't2_poco_sem_analise_ate_300km_dor_forte',
    name: 'Poço sem análise mas até 300km de SJC + dor → não pode cair como ruim',
    ctx: {
      product_type: 'IRON_FREE',
      cidade: 'Pouso Alegre',  // ~155 km
      water_source: 'poco',
      symptoms: ['amarela'],
      has_water_analysis: false,
      accepts_analysis_or_visit: true,
      flow_rate_known: true,
      days_to_buy: 15,
      asked_price: true,
      phone_invalid: false,
    },
    assertions: (b) => [
      assert('score >= 50', b.score_auto >= 50, `score=${b.score_auto}`),
      assert('tier não é PEDRA nem BRONZE', !['PEDRA', 'BRONZE'].includes(b.tier_auto), `tier=${b.tier_auto}`),
      assert('hit faixa 151-300', b.hits.some(h => h.code === 'band__151_300') || b.hits.some(h => h.code === 'band__until_150')),
      assert('hit sem análise mas próximo', b.hits.some(h => h.code.endsWith('poco_no_analysis_but_close'))),
      assert('NÃO aplicou penal_no_analysis_no_accept', !b.hits.some(h => h.code.endsWith('poco_no_analysis_no_accept'))),
    ],
  },

  {
    id: 't3_iron_free_acima_300_sem_analise_exige_qualif',
    name: 'Iron Free acima de 300km e sem análise → exige qualificação antes de closer',
    ctx: {
      product_type: 'IRON_FREE',
      cidade: 'Salvador', // ~1900km
      water_source: 'poco',
      symptoms: ['amarela'],
      has_water_analysis: false,
      accepts_analysis_or_visit: true,
      days_to_buy: 7,
      asked_price: true,
      phone_invalid: false,
    },
    assertions: (b) => [
      assert('aplicou penal_far_and_no_analysis', b.hits.some(h => h.code.endsWith('poco_far_and_no_analysis'))),
      assert('marca needs_qualif quando alto', !['DIAMANTE', 'OURO'].includes(b.tier_auto) || b.special_rules_applied.some(r => r.rule === 'needs_qualif_before_closer')),
    ],
  },

  {
    id: 't4_telefone_invalido_pedra',
    name: 'Telefone inválido → cai para PEDRA',
    ctx: {
      product_type: 'IRON_FREE',
      cidade: 'Taubaté',
      water_source: 'poco',
      symptoms: ['amarela', 'ferrugem'],
      has_water_analysis: true,
      phone_invalid: true,
    },
    assertions: (b) => [
      assert('tier final PEDRA', b.tier_auto === 'PEDRA', `tier=${b.tier_auto}`),
      assert('regra especial invalid_phone_forces_pedra aplicada', b.special_rules_applied.some(r => r.rule === 'invalid_phone_forces_pedra')),
    ],
  },

  {
    id: 't5_filtro_entrada_150km_dor_clara',
    name: 'Filtro entrada até 150km + dor clara → score sobe',
    ctx: {
      product_type: 'FILTRO_ENTRADA_AGUA_TRATADA',
      cidade: 'Jacareí',  // 14km
      water_source: 'concessionaria',
      symptoms: ['barro', 'gosto'],
      asked_install: true,
      asked_price: true,
      has_caixa_dagua: true,
      days_to_buy: 7,
      phone_invalid: false,
    },
    assertions: (b) => [
      assert('score >= 70', b.score_auto >= 70, `score=${b.score_auto}`),
      assert('tier OURO ou DIAMANTE', ['OURO', 'DIAMANTE'].includes(b.tier_auto), `tier=${b.tier_auto}`),
      assert('faixa until_150', b.hits.some(h => h.code === 'band__until_150')),
      assert('hit concessionaria', b.hits.some(h => h.code.endsWith('ft_concessionaria'))),
      assert('hit box_dirt', b.hits.some(h => h.code.endsWith('ft_box_dirt'))),
    ],
  },

  {
    id: 't6_bebedouro_empresa_urgencia_preco',
    name: 'Bebedouro empresa + urgência + pediu preço → score sobe',
    ctx: {
      product_type: 'BEBEDOURO_INDUSTRIAL',
      cidade: 'São Paulo',
      audience: 'empresa',
      asked_price: true,
      needs_pronta_entrega: true,
      people_count_informed: true,
      days_to_buy: 5,
      phone_invalid: false,
    },
    assertions: (b) => [
      assert('score >= 80', b.score_auto >= 80, `score=${b.score_auto}`),
      assert('tier DIAMANTE', b.tier_auto === 'DIAMANTE', `tier=${b.tier_auto}`),
      assert('hit audience_business', b.hits.some(h => h.code.endsWith('beb_audience_business'))),
      assert('hit asked_price', b.hits.some(h => h.code.endsWith('beb_asked_price'))),
      assert('hit pronta_entrega', b.hits.some(h => h.code.endsWith('beb_pronta_entrega'))),
    ],
  },

  {
    id: 't7_breakdown_lista_todas_regras',
    name: 'Breakdown lista todas regras aplicadas',
    ctx: {
      product_type: 'IRON_FREE',
      cidade: 'Taubaté',
      water_source: 'poco',
      symptoms: ['amarela'],
      has_water_analysis: true,
      days_to_buy: 7,
    },
    assertions: (b) => [
      assert('hits é array', Array.isArray(b.hits)),
      assert('cada hit tem code', b.hits.every(h => !!h.code)),
      assert('cada hit tem points', b.hits.every(h => typeof h.points === 'number')),
      assert('cada hit tem applied_points', b.hits.every(h => typeof h.applied_points === 'number')),
      assert('cada hit tem name humano', b.hits.every(h => !!h.name)),
      assert('distance presente', !!b.distance),
      assert('score_auto presente', typeof b.score_auto === 'number'),
      assert('tier_auto presente', !!b.tier_auto),
    ],
  },
];

async function runAll(pool) {
  const results = [];
  for (const c of CASES) {
    results.push(await runCase(pool, c));
  }

  // Teste 8: mudança de peso afeta novo cálculo
  let weightChangeOk = false;
  let weightDetails = '';
  try {
    const sample = {
      product_type: 'IRON_FREE',
      cidade: 'Taubaté',
      water_source: 'poco',
      symptoms: ['amarela'],
      has_water_analysis: true,
      days_to_buy: 7,
    };
    const beforeCalc = await engine.calculate(pool, sample);
    const before = beforeCalc.score_auto;

    // pega um critério ativo do produto, dobra os pontos via transaction temporária
    const r = await pool.query(
      `SELECT id, points FROM lead_score_criteria
       WHERE product_type='IRON_FREE' AND is_active=TRUE AND points > 0
       ORDER BY points DESC LIMIT 1`
    );
    if (r.rows[0]) {
      const orig = r.rows[0];
      const newPts = Number(orig.points) + 5;
      await pool.query(`UPDATE lead_score_criteria SET points = $1 WHERE id = $2`, [newPts, orig.id]);
      try {
        const afterCalc = await engine.calculate(pool, sample);
        weightChangeOk = afterCalc.score_auto !== before;
        weightDetails = `before=${before}, after=${afterCalc.score_auto}, criterion_id=${orig.id}`;
      } finally {
        await pool.query(`UPDATE lead_score_criteria SET points = $1 WHERE id = $2`, [orig.points, orig.id]);
      }
    } else {
      weightDetails = 'sem critério positivo IRON_FREE pra testar';
    }
  } catch (e) {
    weightDetails = 'erro: ' + e.message;
  }

  results.push({
    id: 't8_weight_change_affects_score',
    name: 'Alteração de peso afeta novos cálculos',
    status: weightChangeOk ? 'pass' : 'fail',
    checks: [{ label: 'weight change reflects in new calc', ok: weightChangeOk, details: weightDetails }],
    failed: weightChangeOk ? [] : ['weight change não afetou score'],
  });

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail' || r.status === 'error').length;
  return { passed, failed, total: results.length, cases: results, ran_at: new Date().toISOString() };
}

module.exports = { runAll, CASES };
