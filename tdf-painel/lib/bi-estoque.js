// lib/bi-estoque.js — CRUD empresas/estoques/produtos + movimentações atômicas
//
// Movimentação = transação Postgres:
//   1) INSERT em bi_mov_estoque (audit append-only)
//   2) UPDATE/UPSERT em bi_saldo_estoque (cache materializado)
//   3) Se for entrada (compra/transferência destino), recalcula custo médio ponderado
//
// Padrão funcional: cada função recebe pool, retorna { ok, ... }. Erros propagam.

const db = require('./bi-estoque-db');

const uid = (prefix) => prefix + '_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

const TIPOS_ESTOQUE = ['central','loja','fabrica','tecnico','veiculo','ambulante','instalacao','manutencao','transito'];
const TIPOS_EMPRESA = ['operacao','fabrica','comercial','assistencia'];
const TIPOS_MOV = ['compra-recebida','transferencia','saida-instalacao','venda-pdv','ajuste','perda','devolucao','reserva','estorno','entrada-manual'];

// ===== EMPRESAS =====
async function listEmpresas(opts = {}) {
  const pool = db.getPool();
  if (!pool) return [];
  const r = await pool.query('SELECT * FROM bi_empresas WHERE ($1::bool IS NULL OR ativo = $1) ORDER BY nome', [opts.ativo === undefined ? null : !!opts.ativo]);
  return r.rows;
}
async function getEmpresa(id) {
  const pool = db.getPool(); if (!pool) return null;
  const r = await pool.query('SELECT * FROM bi_empresas WHERE id = $1', [id]);
  return r.rows[0] || null;
}
async function upsertEmpresa(patch, who) {
  const pool = db.getPool(); if (!pool) throw new Error('pool não inicializada');
  const id = patch.id || uid('emp');
  const cur = await getEmpresa(id);
  const nome = String(patch.nome || cur?.nome || '').trim();
  if (!nome) throw new Error('nome obrigatório');
  const tipo = TIPOS_EMPRESA.includes(patch.tipo) ? patch.tipo : (cur?.tipo || 'comercial');
  const cnpj = (patch.cnpj !== undefined ? String(patch.cnpj || '').replace(/\D/g,'') : cur?.cnpj) || null;
  const ativo = patch.ativo !== undefined ? !!patch.ativo : (cur?.ativo !== false);
  if (cur) {
    await pool.query(`UPDATE bi_empresas SET nome=$2, cnpj=$3, segmento=$4, responsavel=$5, tipo=$6, observacoes=$7, ativo=$8, updated_at=NOW() WHERE id=$1`,
      [id, nome, cnpj, patch.segmento ?? cur.segmento, patch.responsavel ?? cur.responsavel, tipo, patch.observacoes ?? cur.observacoes, ativo]);
  } else {
    await pool.query(`INSERT INTO bi_empresas (id, nome, cnpj, segmento, responsavel, tipo, observacoes, ativo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, nome, cnpj, patch.segmento || null, patch.responsavel || null, tipo, patch.observacoes || null, ativo]);
  }
  return getEmpresa(id);
}
async function removeEmpresa(id) {
  const pool = db.getPool(); if (!pool) return false;
  const r = await pool.query('DELETE FROM bi_empresas WHERE id = $1', [id]);
  return r.rowCount > 0;
}

// ===== ESTOQUES =====
async function listEstoques(opts = {}) {
  const pool = db.getPool(); if (!pool) return [];
  const conds = []; const params = [];
  if (opts.empresaId) { params.push(opts.empresaId); conds.push(`empresa_id = $${params.length}`); }
  if (opts.tipo)      { params.push(opts.tipo);      conds.push(`tipo = $${params.length}`); }
  if (opts.responsavelUsername) { params.push(opts.responsavelUsername); conds.push(`responsavel_username = $${params.length}`); }
  if (opts.ativo !== undefined) { params.push(!!opts.ativo); conds.push(`ativo = $${params.length}`); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const r = await pool.query(`SELECT * FROM bi_estoques ${where} ORDER BY nome`, params);
  return r.rows;
}
async function getEstoque(id) {
  const pool = db.getPool(); if (!pool) return null;
  const r = await pool.query('SELECT * FROM bi_estoques WHERE id = $1', [id]);
  return r.rows[0] || null;
}
async function upsertEstoque(patch, who) {
  const pool = db.getPool(); if (!pool) throw new Error('pool não inicializada');
  const id = patch.id || uid('est');
  const cur = await getEstoque(id);
  if (!patch.nome && !cur) throw new Error('nome obrigatório');
  if (!patch.tipo && !cur) throw new Error('tipo obrigatório');
  const tipo = patch.tipo || cur?.tipo;
  if (!TIPOS_ESTOQUE.includes(tipo)) throw new Error('tipo inválido (use ' + TIPOS_ESTOQUE.join('/') + ')');
  if (cur) {
    await pool.query(`UPDATE bi_estoques SET empresa_id=$2, nome=$3, tipo=$4, responsavel=$5, responsavel_username=$6, localizacao=$7, observacoes=$8, ativo=$9, updated_at=NOW() WHERE id=$1`,
      [id, patch.empresaId ?? cur.empresa_id, patch.nome ?? cur.nome, tipo, patch.responsavel ?? cur.responsavel, patch.responsavelUsername ?? cur.responsavel_username, patch.localizacao ?? cur.localizacao, patch.observacoes ?? cur.observacoes, patch.ativo !== undefined ? !!patch.ativo : cur.ativo]);
  } else {
    await pool.query(`INSERT INTO bi_estoques (id, empresa_id, nome, tipo, responsavel, responsavel_username, localizacao, observacoes, ativo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, patch.empresaId || null, patch.nome, tipo, patch.responsavel || null, patch.responsavelUsername || null, patch.localizacao || null, patch.observacoes || null, patch.ativo !== false]);
  }
  return getEstoque(id);
}
async function removeEstoque(id) {
  const pool = db.getPool(); if (!pool) return false;
  const r = await pool.query('DELETE FROM bi_estoques WHERE id = $1', [id]);
  return r.rowCount > 0;
}

// ===== PRODUTOS =====
async function listProdutos(opts = {}) {
  const pool = db.getPool(); if (!pool) return [];
  const conds = []; const params = [];
  if (opts.empresaDonaId) { params.push(opts.empresaDonaId); conds.push(`empresa_dona_id = $${params.length}`); }
  if (opts.categoria)     { params.push(opts.categoria);     conds.push(`categoria = $${params.length}`); }
  if (opts.ativo !== undefined) { params.push(!!opts.ativo); conds.push(`ativo = $${params.length}`); }
  if (opts.search)        { params.push('%' + opts.search + '%'); conds.push(`(nome ILIKE $${params.length} OR sku ILIKE $${params.length})`); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const r = await pool.query(`SELECT * FROM bi_produtos ${where} ORDER BY nome LIMIT 1000`, params);
  return r.rows;
}
async function getProduto(id) {
  const pool = db.getPool(); if (!pool) return null;
  const r = await pool.query('SELECT * FROM bi_produtos WHERE id = $1', [id]);
  return r.rows[0] || null;
}
async function upsertProduto(patch, who) {
  const pool = db.getPool(); if (!pool) throw new Error('pool não inicializada');
  const id = patch.id || uid('prd');
  const cur = await getProduto(id);
  if (!patch.nome && !cur) throw new Error('nome obrigatório');
  if (cur) {
    await pool.query(`UPDATE bi_produtos SET sku=$2, nome=$3, categoria=$4, unidade=$5, custo_medio=$6, preco_venda=$7, fornecedor_principal=$8, estoque_minimo=$9, estoque_maximo=$10, empresa_dona_id=$11, controla_lote=$12, controla_serie=$13, zoho_product_id=$14, ativo=$15, updated_at=NOW() WHERE id=$1`,
      [id, patch.sku ?? cur.sku, patch.nome ?? cur.nome, patch.categoria ?? cur.categoria, patch.unidade ?? cur.unidade, +(patch.custoMedio ?? cur.custo_medio) || 0, +(patch.precoVenda ?? cur.preco_venda) || 0, patch.fornecedorPrincipal ?? cur.fornecedor_principal, +(patch.estoqueMinimo ?? cur.estoque_minimo) || 0, +(patch.estoqueMaximo ?? cur.estoque_maximo) || 0, patch.empresaDonaId ?? cur.empresa_dona_id, !!(patch.controlaLote ?? cur.controla_lote), !!(patch.controlaSerie ?? cur.controla_serie), patch.zohoProductId ?? cur.zoho_product_id, patch.ativo !== undefined ? !!patch.ativo : cur.ativo]);
  } else {
    await pool.query(`INSERT INTO bi_produtos (id, sku, nome, categoria, unidade, custo_medio, preco_venda, fornecedor_principal, estoque_minimo, estoque_maximo, empresa_dona_id, controla_lote, controla_serie, zoho_product_id, ativo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [id, patch.sku || null, patch.nome, patch.categoria || null, patch.unidade || 'UN', +(patch.custoMedio || 0), +(patch.precoVenda || 0), patch.fornecedorPrincipal || null, +(patch.estoqueMinimo || 0), +(patch.estoqueMaximo || 0), patch.empresaDonaId || null, !!patch.controlaLote, !!patch.controlaSerie, patch.zohoProductId || null, patch.ativo !== false]);
  }
  return getProduto(id);
}
async function removeProduto(id) {
  const pool = db.getPool(); if (!pool) return false;
  const r = await pool.query('DELETE FROM bi_produtos WHERE id = $1', [id]);
  return r.rowCount > 0;
}

// ===== SALDO + MOVIMENTAÇÃO =====

// Lista saldos de um estoque (com nome do produto pra UI)
async function saldosByEstoque(estoqueId) {
  const pool = db.getPool(); if (!pool) return [];
  const r = await pool.query(`
    SELECT s.produto_id, s.estoque_id, s.qtd, s.custo_medio, s.qtd_reservada, s.updated_at,
           p.nome AS produto_nome, p.sku, p.unidade, p.categoria, p.estoque_minimo, p.preco_venda
      FROM bi_saldo_estoque s
      JOIN bi_produtos p ON p.id = s.produto_id
     WHERE s.estoque_id = $1
     ORDER BY p.nome
  `, [estoqueId]);
  return r.rows;
}

async function saldoByProduto(produtoId) {
  const pool = db.getPool(); if (!pool) return [];
  const r = await pool.query(`
    SELECT s.produto_id, s.estoque_id, s.qtd, s.custo_medio, s.qtd_reservada,
           e.nome AS estoque_nome, e.tipo AS estoque_tipo, e.responsavel_username, e.empresa_id
      FROM bi_saldo_estoque s
      JOIN bi_estoques e ON e.id = s.estoque_id
     WHERE s.produto_id = $1
     ORDER BY e.nome
  `, [produtoId]);
  return r.rows;
}

// Saldo total de um produto (soma todos estoques)
async function saldoTotalProduto(produtoId) {
  const pool = db.getPool(); if (!pool) return 0;
  const r = await pool.query('SELECT COALESCE(SUM(qtd),0) AS tot FROM bi_saldo_estoque WHERE produto_id = $1', [produtoId]);
  return Number(r.rows[0].tot) || 0;
}

// Lista movimentações (filtros)
async function listMovimentacoes(opts = {}) {
  const pool = db.getPool(); if (!pool) return [];
  const conds = []; const params = [];
  if (opts.produtoId) { params.push(opts.produtoId); conds.push(`produto_id = $${params.length}`); }
  if (opts.estoqueId) { params.push(opts.estoqueId); conds.push(`(estoque_origem_id = $${params.length} OR estoque_destino_id = $${params.length})`); }
  if (opts.tipo)      { params.push(opts.tipo);      conds.push(`tipo = $${params.length}`); }
  if (opts.dateFrom)  { params.push(opts.dateFrom);  conds.push(`ts >= $${params.length}`); }
  if (opts.dateTo)    { params.push(opts.dateTo);    conds.push(`ts <= $${params.length}`); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const limit = Math.min(parseInt(opts.limit, 10) || 200, 2000);
  params.push(limit);
  const r = await pool.query(`SELECT * FROM bi_mov_estoque ${where} ORDER BY ts DESC LIMIT $${params.length}`, params);
  return r.rows;
}

// === Movimentar (TRANSAÇÃO atômica) ===
//
// args: { tipo, produtoId, qtd, estoqueOrigemId?, estoqueDestinoId?, custoUnit?,
//          refTipo?, refId?, usuario?, obs?, metadata? }
//
// Tipos:
//   compra-recebida    → +destino (atualiza custo médio ponderado)
//   transferencia      → -origem +destino (mantém custo)
//   saida-instalacao   → -origem (custoUnit usado pra calc CMV venda)
//   venda-pdv          → -origem
//   ajuste             → +/- conforme sinal de qtd (positivo entra, negativo sai)
//   perda              → -origem
//   devolucao          → +destino
//   reserva            → marca qtd_reservada (sem mover qtd)
//   estorno            → reverte (caller informa origem/destino invertidos)
//   entrada-manual     → +destino sem origem (estoque inicial)
async function movimentar(args, who) {
  const pool = db.getPool(); if (!pool) throw new Error('pool não inicializada');
  const tipo = args.tipo;
  if (!TIPOS_MOV.includes(tipo)) throw new Error('tipo de mov inválido: ' + tipo);
  const produtoId = args.produtoId;
  if (!produtoId) throw new Error('produtoId obrigatório');
  const qtd = Number(args.qtd) || 0;
  if (qtd <= 0 && tipo !== 'ajuste') throw new Error('qtd inválida (> 0). Pra ajuste use qtd com sinal');

  // Determina origem/destino baseado no tipo
  const origem = args.estoqueOrigemId || null;
  const destino = args.estoqueDestinoId || null;
  if (['compra-recebida','devolucao','entrada-manual'].includes(tipo) && !destino) throw new Error('estoqueDestinoId obrigatório pra ' + tipo);
  if (['saida-instalacao','venda-pdv','perda'].includes(tipo) && !origem) throw new Error('estoqueOrigemId obrigatório pra ' + tipo);
  if (tipo === 'transferencia' && (!origem || !destino)) throw new Error('transferencia precisa de origem e destino');

  const movId = uid('mov');
  const custoUnit = args.custoUnit !== undefined ? Number(args.custoUnit) : null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) Insere mov (audit)
    await client.query(
      `INSERT INTO bi_mov_estoque (id, produto_id, estoque_origem_id, estoque_destino_id, tipo, qtd, custo_unit, ref_tipo, ref_id, usuario, obs, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [movId, produtoId, origem, destino, tipo, qtd, custoUnit, args.refTipo || null, args.refId || null, who || null, args.obs || null, args.metadata ? JSON.stringify(args.metadata) : null]
    );

    // 2) Subtrai do origem (com checagem de saldo)
    if (origem && tipo !== 'reserva' && tipo !== 'ajuste') {
      const r = await client.query('SELECT qtd, custo_medio FROM bi_saldo_estoque WHERE produto_id = $1 AND estoque_id = $2 FOR UPDATE', [produtoId, origem]);
      const saldoAt = r.rows[0]?.qtd || 0;
      if (Number(saldoAt) < qtd) throw new Error(`saldo insuficiente em origem: tem ${saldoAt}, precisa ${qtd}`);
      await client.query(
        `UPDATE bi_saldo_estoque SET qtd = qtd - $3, updated_at = NOW() WHERE produto_id = $1 AND estoque_id = $2`,
        [produtoId, origem, qtd]
      );
    }

    // 3) Soma no destino + atualiza custo médio (entradas)
    if (destino) {
      const r = await client.query('SELECT qtd, custo_medio FROM bi_saldo_estoque WHERE produto_id = $1 AND estoque_id = $2 FOR UPDATE', [produtoId, destino]);
      const saldoAtual = Number(r.rows[0]?.qtd || 0);
      const custoAtual = Number(r.rows[0]?.custo_medio || 0);

      // Custo médio ponderado: só recalcula em ENTRADAS com custo informado
      let novoCusto = custoAtual;
      if (['compra-recebida','transferencia','devolucao','entrada-manual'].includes(tipo) && custoUnit !== null) {
        const novaQtd = saldoAtual + qtd;
        if (novaQtd > 0) {
          novoCusto = ((saldoAtual * custoAtual) + (qtd * custoUnit)) / novaQtd;
        }
      }

      if (r.rowCount === 0) {
        await client.query(
          `INSERT INTO bi_saldo_estoque (produto_id, estoque_id, qtd, custo_medio) VALUES ($1, $2, $3, $4)`,
          [produtoId, destino, qtd, custoUnit !== null ? custoUnit : 0]
        );
      } else {
        await client.query(
          `UPDATE bi_saldo_estoque SET qtd = qtd + $3, custo_medio = $4, updated_at = NOW() WHERE produto_id = $1 AND estoque_id = $2`,
          [produtoId, destino, qtd, novoCusto]
        );
      }

      // Atualiza custo médio do produto (média global) — só em compras
      if (tipo === 'compra-recebida' && custoUnit !== null) {
        await client.query(
          `UPDATE bi_produtos SET custo_ultima_compra = $2, custo_medio = (
             SELECT COALESCE(SUM(qtd * custo_medio) / NULLIF(SUM(qtd), 0), 0) FROM bi_saldo_estoque WHERE produto_id = $1
           ), updated_at = NOW() WHERE id = $1`,
          [produtoId, custoUnit]
        );
      }
    }

    // 4) Tipo 'ajuste' (qtd com sinal — vai pro destino se >0, debita origem se <0)
    if (tipo === 'ajuste') {
      const target = qtd >= 0 ? destino : origem;
      if (!target) throw new Error('ajuste precisa de destino (entrada) ou origem (saída)');
      const absQtd = Math.abs(qtd);
      const r = await client.query('SELECT qtd FROM bi_saldo_estoque WHERE produto_id = $1 AND estoque_id = $2 FOR UPDATE', [produtoId, target]);
      const saldoAtual = Number(r.rows[0]?.qtd || 0);
      if (qtd < 0 && saldoAtual < absQtd) throw new Error(`saldo insuficiente: tem ${saldoAtual}, precisa ${absQtd}`);
      const delta = qtd; // já tem sinal
      if (r.rowCount === 0) {
        await client.query(`INSERT INTO bi_saldo_estoque (produto_id, estoque_id, qtd) VALUES ($1, $2, $3)`, [produtoId, target, delta]);
      } else {
        await client.query(`UPDATE bi_saldo_estoque SET qtd = qtd + $3, updated_at = NOW() WHERE produto_id = $1 AND estoque_id = $2`, [produtoId, target, delta]);
      }
    }

    // 5) Reserva: só atualiza qtd_reservada
    if (tipo === 'reserva' && destino) {
      await client.query(
        `INSERT INTO bi_saldo_estoque (produto_id, estoque_id, qtd_reservada) VALUES ($1, $2, $3)
         ON CONFLICT (produto_id, estoque_id) DO UPDATE SET qtd_reservada = bi_saldo_estoque.qtd_reservada + $3, updated_at = NOW()`,
        [produtoId, destino, qtd]
      );
    }

    await client.query('COMMIT');
    return { ok:true, movimentacaoId: movId };
  } catch(e) {
    await client.query('ROLLBACK').catch(()=>{});
    throw e;
  } finally {
    client.release();
  }
}

// === KPIs / Dashboard ===
async function dashboardEstoque(empresaId) {
  const pool = db.getPool(); if (!pool) return null;
  const conds = []; const params = [];
  if (empresaId) { params.push(empresaId); conds.push(`e.empresa_id = $${params.length}`); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';

  // Valor total em estoque
  const valorRes = await pool.query(`
    SELECT COALESCE(SUM(s.qtd * s.custo_medio), 0) AS valor_total,
           COUNT(DISTINCT s.produto_id) AS produtos_distintos
      FROM bi_saldo_estoque s
      JOIN bi_estoques e ON e.id = s.estoque_id
      ${where}
  `, params);

  // Produtos abaixo do mínimo
  const abaixoMin = await pool.query(`
    SELECT p.id, p.nome, p.sku, p.estoque_minimo, COALESCE(SUM(s.qtd), 0) AS saldo_total
      FROM bi_produtos p
      LEFT JOIN bi_saldo_estoque s ON s.produto_id = p.id
      LEFT JOIN bi_estoques e ON e.id = s.estoque_id
      WHERE p.ativo = TRUE AND p.estoque_minimo > 0
      ${empresaId ? `AND (s.estoque_id IS NULL OR e.empresa_id = '${empresaId.replace(/'/g, "''")}')` : ''}
      GROUP BY p.id, p.nome, p.sku, p.estoque_minimo
      HAVING COALESCE(SUM(s.qtd), 0) < p.estoque_minimo
      ORDER BY (p.estoque_minimo - COALESCE(SUM(s.qtd), 0)) DESC
      LIMIT 50
  `);

  return {
    valorTotal: Number(valorRes.rows[0].valor_total) || 0,
    produtosDistintos: Number(valorRes.rows[0].produtos_distintos) || 0,
    abaixoMinimo: abaixoMin.rows,
    abaixoMinimoCount: abaixoMin.rows.length,
  };
}

module.exports = {
  TIPOS_ESTOQUE, TIPOS_EMPRESA, TIPOS_MOV,
  // Empresas
  listEmpresas, getEmpresa, upsertEmpresa, removeEmpresa,
  // Estoques
  listEstoques, getEstoque, upsertEstoque, removeEstoque,
  // Produtos
  listProdutos, getProduto, upsertProduto, removeProduto,
  // Saldo + Mov
  saldosByEstoque, saldoByProduto, saldoTotalProduto, listMovimentacoes, movimentar,
  // Dashboard
  dashboardEstoque,
};
