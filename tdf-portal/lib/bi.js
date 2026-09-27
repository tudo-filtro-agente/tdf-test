// lib/bi.js — Endpoints de leitura do BI Financeiro (Etapa 3)
// TODAS as funções são SOMENTE LEITURA no Postgres (SELECT puro).

const { pool } = require('./auth');

// Helper: filtra por empresa_ids (array) ou todas
function empresaFilter(empresaIds) {
  if (!empresaIds || empresaIds.length === 0) return { clause: '', params: [] };
  return {
    clause: ` AND empresa_id = ANY($1::int[])`,
    params: [empresaIds.map(Number)],
  };
}

// Helper: parse de ?empresa=1,2,3 (CSV) ou ?empresa=1 ou vazio=todas
function parseEmpresas(req) {
  const raw = req.query.empresa;
  if (!raw) return [];
  return String(raw).split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
}

// ---------- DASHBOARD PRINCIPAL ----------

async function dashboardKpis(empresaIds = []) {
  const { clause, params } = empresaFilter(empresaIds);

  const pagar = await pool.query(
    `SELECT
       COUNT(*)::int AS qtd_total,
       COALESCE(SUM(CASE WHEN status = 'em_aberto' THEN saldo ELSE 0 END), 0)::float AS em_aberto,
       COALESCE(SUM(CASE WHEN status = 'atrasado' THEN saldo ELSE 0 END), 0)::float AS atrasado,
       COALESCE(SUM(CASE WHEN status = 'pago' THEN valor_pago ELSE 0 END), 0)::float AS pago_mes
     FROM contas_pagar WHERE 1=1${clause}`,
    params
  );

  const receber = await pool.query(
    `SELECT
       COUNT(*)::int AS qtd_total,
       COALESCE(SUM(CASE WHEN status = 'em_aberto' THEN saldo ELSE 0 END), 0)::float AS em_aberto,
       COALESCE(SUM(CASE WHEN status = 'atrasado' THEN saldo ELSE 0 END), 0)::float AS atrasado,
       COALESCE(SUM(CASE WHEN status = 'recebido' THEN valor_recebido ELSE 0 END), 0)::float AS recebido_mes
     FROM contas_receber WHERE 1=1${clause}`,
    params
  );

  const bancos = await pool.query(
    `SELECT
       COUNT(*)::int AS qtd_contas,
       COALESCE(SUM(saldo_atual), 0)::float AS saldo_total
     FROM contas_bancarias WHERE ativa = true${clause}`,
    params
  );

  const movimentos = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN tipo = 'credito' THEN valor ELSE 0 END), 0)::float AS creditos,
       COALESCE(SUM(CASE WHEN tipo = 'debito' THEN valor ELSE 0 END), 0)::float AS debitos
     FROM movimentos
     WHERE date_trunc('month', data_movimento) = date_trunc('month', CURRENT_DATE)${clause}`,
    params
  );

  return {
    contas_pagar: pagar.rows[0],
    contas_receber: receber.rows[0],
    contas_bancarias: bancos.rows[0],
    movimentos_mes: {
      ...movimentos.rows[0],
      saldo_mes: (movimentos.rows[0].creditos || 0) - (movimentos.rows[0].debitos || 0),
    },
  };
}

// Top N categorias por valor (despesa ou receita)
async function topCategorias(tipo = 'despesa', empresaIds = [], limit = 5) {
  const { clause, params } = empresaFilter(empresaIds);
  if (params.length === 0) {
    const r = await pool.query(
      `SELECT categoria, COUNT(*)::int AS qtd, COALESCE(SUM(valor_documento), 0)::float AS total
       FROM ${tipo === 'receita' ? 'contas_receber' : 'contas_pagar'}
       WHERE categoria IS NOT NULL${clause}
       GROUP BY categoria ORDER BY total DESC LIMIT $${params.length + 1}`,
      [...params, limit]
    );
    return r.rows;
  } else {
    const r = await pool.query(
      `SELECT categoria, COUNT(*)::int AS qtd, COALESCE(SUM(valor_documento), 0)::float AS total
       FROM ${tipo === 'receita' ? 'contas_receber' : 'contas_pagar'}
       WHERE categoria IS NOT NULL AND empresa_id = ANY($1::int[])
       GROUP BY categoria ORDER BY total DESC LIMIT $2`,
      [params[0], limit]
    );
    return r.rows;
  }
}

// Distribuição por empresa (para gráfico de pizza)
async function porEmpresa() {
  const pagar = await pool.query(
    `SELECT e.nome, COALESCE(SUM(cp.saldo), 0)::float AS total_pagar
       FROM empresas e LEFT JOIN contas_pagar cp ON cp.empresa_id = e.id AND cp.status IN ('em_aberto', 'atrasado')
       WHERE e.ativo = true GROUP BY e.id, e.nome ORDER BY e.id`
  );
  const receber = await pool.query(
    `SELECT e.nome, COALESCE(SUM(cr.saldo), 0)::float AS total_receber
       FROM empresas e LEFT JOIN contas_receber cr ON cr.empresa_id = e.id AND cr.status IN ('em_aberto', 'atrasado')
       WHERE e.ativo = true GROUP BY e.id, e.nome ORDER BY e.id`
  );
  return {
    pagar: pagar.rows,
    receber: receber.rows,
  };
}

// ---------- LISTAGENS ----------

async function listContasPagar(filtros = {}) {
  const { status, limit = 100, empresa_ids = [] } = filtros;
  let where = ['1=1'];
  let params = [];
  let idx = 1;
  if (empresa_ids.length) {
    where.push(`empresa_id = ANY($${idx}::int[])`);
    params.push(empresa_ids);
    idx++;
  }
  if (status && status !== 'todos') {
    where.push(`status = $${idx}`);
    params.push(status);
    idx++;
  }
  const r = await pool.query(
    `SELECT cp.*, e.nome AS empresa
       FROM contas_pagar cp JOIN empresas e ON e.id = cp.empresa_id
      WHERE ${where.join(' AND ')}
      ORDER BY cp.data_vencimento ASC NULLS LAST, cp.id DESC
      LIMIT $${idx}`,
    [...params, limit]
  );
  return r.rows;
}

async function listContasReceber(filtros = {}) {
  const { status, limit = 100, empresa_ids = [] } = filtros;
  let where = ['1=1'];
  let params = [];
  let idx = 1;
  if (empresa_ids.length) {
    where.push(`empresa_id = ANY($${idx}::int[])`);
    params.push(empresa_ids);
    idx++;
  }
  if (status && status !== 'todos') {
    where.push(`status = $${idx}`);
    params.push(status);
    idx++;
  }
  const r = await pool.query(
    `SELECT cr.*, e.nome AS empresa
       FROM contas_receber cr JOIN empresas e ON e.id = cr.empresa_id
      WHERE ${where.join(' AND ')}
      ORDER BY cr.data_vencimento ASC NULLS LAST, cr.id DESC
      LIMIT $${idx}`,
    [...params, limit]
  );
  return r.rows;
}

async function listMovimentos(filtros = {}) {
  const { limit = 100, empresa_ids = [] } = filtros;
  let where = ['1=1'];
  let params = [];
  let idx = 1;
  if (empresa_ids.length) {
    where.push(`empresa_id = ANY($${idx}::int[])`);
    params.push(empresa_ids);
    idx++;
  }
  const r = await pool.query(
    `SELECT m.*, e.nome AS empresa
       FROM movimentos m JOIN empresas e ON e.id = m.empresa_id
      WHERE ${where.join(' AND ')}
      ORDER BY m.data_movimento DESC NULLS LAST, m.id DESC
      LIMIT $${idx}`,
    [...params, limit]
  );
  return r.rows;
}

async function listContasBancarias(empresa_ids = []) {
  let where = 'ativa = true';
  let params = [];
  if (empresa_ids.length) {
    where += ' AND empresa_id = ANY($1::int[])';
    params.push(empresa_ids);
  }
  const r = await pool.query(
    `SELECT cb.*, e.nome AS empresa
       FROM contas_bancarias cb JOIN empresas e ON e.id = cb.empresa_id
      WHERE ${where}
      ORDER BY cb.saldo_atual DESC NULLS LAST`
  );
  return r.rows;
}

async function listNfEntrada(filtros = {}) {
  const { limit = 100, empresa_ids = [] } = filtros;
  let where = ['1=1'];
  let params = [];
  let idx = 1;
  if (empresa_ids.length) {
    where.push(`empresa_id = ANY($${idx}::int[])`);
    params.push(empresa_ids);
    idx++;
  }
  const r = await pool.query(
    `SELECT nf.*, e.nome AS empresa
       FROM nf_entrada nf JOIN empresas e ON e.id = nf.empresa_id
      WHERE ${where.join(' AND ')}
      ORDER BY nf.data_emissao DESC NULLS LAST, nf.id DESC
      LIMIT $${idx}`,
    [...params, limit]
  );
  return r.rows;
}

async function listFornecedores(empresa_ids = []) {
  let where = '1=1';
  let params = [];
  if (empresa_ids.length) {
    where += ' AND f.empresa_id = ANY($1::int[])';
    params.push(empresa_ids);
  }
  const r = await pool.query(
    `SELECT f.*, e.nome AS empresa
       FROM fornecedores f JOIN empresas e ON e.id = f.empresa_id
      WHERE ${where}
      ORDER BY f.razao_social`
  );
  return r.rows;
}

async function listCategorias(empresa_ids = []) {
  let where = '1=1';
  let params = [];
  if (empresa_ids.length) {
    where += ' AND c.empresa_id = ANY($1::int[])';
    params.push(empresa_ids);
  }
  const r = await pool.query(
    `SELECT c.*, e.nome AS empresa
       FROM categorias c JOIN empresas e ON e.id = c.empresa_id
      WHERE ${where}
      ORDER BY c.tipo, c.nome`
  );
  return r.rows;
}

module.exports = {
  parseEmpresas,
  dashboardKpis,
  topCategorias,
  porEmpresa,
  listContasPagar,
  listContasReceber,
  listMovimentos,
  listContasBancarias,
  listNfEntrada,
  listFornecedores,
  listCategorias,
};
