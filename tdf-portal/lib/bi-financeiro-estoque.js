/**
 * TDF Portal — BI Financeiro / Estoque
 * Router: /bi-financeiro/api/estoque/*
 *
 * Endpoints de estoque (dashboard, empresas, locais, produtos, movimentar, saldo).
 * A tabela de estoque ainda nao existe no banco — a maioria retorna vazio estruturado.
 * Quando a tabela for criada, os endpoints estao prontos para receber os dados reais.
 */

const express = require('express');
const router = express.Router();

module.exports = function ({ pool, requireAuth }) {

  // ============ HELPERS ============

  /**
   * Parseia empresaBI da query string.
   * Retorna null para consolidado, ou array de inteiros.
   */
  function parseEmpresas(req) {
    const raw = req.query.empresaBI || req.query.empresa || '';
    if (!raw || raw === 'consolidado' || raw === '') return null;
    return String(raw).split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n));
  }

  /**
   * Monta filtro SQL para lista de empresa_ids.
   */
  function empresaFilter(empresaIds, col = 'empresa_id') {
    if (!empresaIds) return { sql: '', params: [] };
    const placeholders = empresaIds.map((_, i) => `$${i + 1}`).join(',');
    return { sql: ` AND ${col} IN (${placeholders})`, params: empresaIds };
  }

  // ============ DASHBOARD ============
  // GET /bi-financeiro/api/estoque/dashboard
  // Query: ?empresaBI=1,2,3
  // Retorna: { ok: true, total_produtos, valor_estoque, produtos_baixo_estoque: [], resumo_por_categoria: [] }

  router.get('/dashboard', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const ef = empresaFilter(empresaIds);

      // Tenta consultar tabela estoque (ainda nao existe — retorna vazio)
      //，明知 tabela nao existe, retorna zeros
      let total_produtos = 0;
      let valor_estoque = 0;
      const produtos_baixo_estoque = [];
      const resumo_por_categoria = [];

      try {
        const q = await pool.query(`
          SELECT
            COUNT(*) AS total_produtos,
            COALESCE(SUM(quantidade * COALESCE(valor_unitario, 0)), 0) AS valor_estoque
          FROM estoque
          WHERE 1=1 ${ef.sql}
        `, ef.params);

        if (q.rows.length > 0) {
          total_produtos = Number(q.rows[0].total_produtos || 0);
          valor_estoque = Number(q.rows[0].valor_estoque || 0);
        }

        // Produtos com estoque baixo
        const baixoQ = await pool.query(`
          SELECT id, nome, quantidade, valor_unitario, local_id
          FROM estoque
          WHERE quantidade < COALESCE(estoque_minimo, 0)
            AND 1=1 ${ef.sql}
          ORDER BY quantidade ASC
          LIMIT 20
        `, ef.params);

        produtos_baixo_estoque.push(...baixoQ.rows);

        // Resumo por categoria
        const catQ = await pool.query(`
          SELECT
            COALESCE(categoria, 'Sem categoria') AS categoria,
            COUNT(*) AS total,
            COALESCE(SUM(quantidade * COALESCE(valor_unitario, 0)), 0) AS valor
          FROM estoque
          WHERE 1=1 ${ef.sql}
          GROUP BY categoria
          ORDER BY valor DESC
        `, ef.params);

        resumo_por_categoria.push(...catQ.rows);
      } catch (tblErr) {
        // Tabela estoque ainda nao existe — retorna zeros
        console.warn('[estoque/dashboard] Tabela estoque nao existe:', tblErr.message);
      }

      res.json({
        ok: true,
        total_produtos,
        valor_estoque,
        produtos_baixo_estoque,
        resumo_por_categoria
      });
    } catch (e) {
      console.error('[estoque/dashboard]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ EMPRESAS ============
  // GET /bi-financeiro/api/estoque/empresas
  // Retorna: { ok: true, empresas: [{id, nome}] }

  router.get('/empresas', requireAuth, async (req, res) => {
    try {
      const r = await pool.query(
        `SELECT id, nome FROM empresas WHERE ativo = true ORDER BY id`
      );
      res.json({ ok: true, empresas: r.rows });
    } catch (e) {
      console.error('[estoque/empresas]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ LOCAIS ============
  // GET /bi-financeiro/api/estoque/locais
  // Retorna: { ok: true, locais: [{id, nome, empresa_id}] }
  //          ou { ok: true, locais: [] } se tabela nao existir/vazia

  router.get('/locais', requireAuth, async (req, res) => {
    try {
      const r = await pool.query(
        `SELECT id, nome, empresa_id FROM locais_estoque WHERE ativo = true ORDER BY empresa_id, nome`
      );
      res.json({ ok: true, locais: r.rows });
    } catch (tblErr) {
      // Tabela locais_estoque ainda nao existe
      console.warn('[estoque/locais] Tabela locais_estoque nao existe:', tblErr.message);
      res.json({ ok: true, locais: [] });
    }
  });

  // ============ PRODUTOS ============
  // GET /bi-financeiro/api/estoque/produtos
  // Query: ?empresaBI=X ?search=texto ?page=1&limit=50
  // Retorna: { ok: true, total, page, limit, rows: [] }
  // Placeholder estruturado — tabela produtos ainda nao existe

  router.get('/produtos', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const ef = empresaFilter(empresaIds);
      const search = (req.query.search || '').trim();
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
      const offset = (page - 1) * limit;

      let rows = [];
      let total = 0;

      try {
        // WHERE dinâmico com search
        let whereSql = ` WHERE 1=1 ${ef.sql}`;
        const params = [...ef.params];
        let paramIdx = params.length + 1;

        if (search) {
          whereSql += ` AND (nome ILIKE $${paramIdx} OR codigo ILIKE $${paramIdx})`;
          params.push(`%${search}%`);
          paramIdx++;
        }

        // Count
        const countQ = await pool.query(
          `SELECT COUNT(*) FROM estoque ${whereSql}`,
          params
        );
        total = Number(countQ.rows[0]?.count || 0);

        // Dados paginados
        const dataQ = await pool.query(`
          SELECT
            id, nome, codigo, quantidade, valor_unitario,
            estoque_minimo, local_id, categoria, updated_at
          FROM estoque
          ${whereSql}
          ORDER BY nome ASC
          LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
        `, [...params, limit, offset]);

        rows = dataQ.rows;
      } catch (tblErr) {
        // Tabela estoque ainda nao existe
        console.warn('[estoque/produtos] Tabela estoque nao existe:', tblErr.message);
      }

      res.json({ ok: true, total, page, limit, rows });
    } catch (e) {
      console.error('[estoque/produtos]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ MOVIMENTAR ============
  // POST /bi-financeiro/api/estoque/movimentar
  // Body: { produto_id, tipo: 'entrada'|'saida', quantidade, observacao }
  // Retorna: { ok: false, error: 'em_breve' }

  router.post('/movimentar', requireAuth, async (req, res) => {
    // Funcionalidade de movimentacao ainda nao implementada
    res.json({ ok: false, error: 'em_breve' });
  });

  // ============ SALDO ============
  // GET /bi-financeiro/api/estoque/saldo
  // Query: ?empresaBI=X ?produto_id=Y
  // Retorna: { ok: true, saldos: [] }
  // Placeholder estruturado

  router.get('/saldo', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const produtoId = req.query.produto_id ? parseInt(req.query.produto_id, 10) : null;
      const ef = empresaFilter(empresaIds);

      let saldos = [];

      try {
        let whereSql = ` WHERE 1=1 ${ef.sql}`;
        const params = [...ef.params];

        if (produtoId) {
          whereSql += ` AND id = $${params.length + 1}`;
          params.push(produtoId);
        }

        const q = await pool.query(`
          SELECT
            id AS produto_id,
            nome,
            quantidade,
            valor_unitario,
            (quantidade * COALESCE(valor_unitario, 0)) AS valor_total,
            local_id,
            empresa_id
          FROM estoque
          ${whereSql}
          ORDER BY nome ASC
        `, params);

        saldos = q.rows;
      } catch (tblErr) {
        // Tabela estoque ainda nao existe
        console.warn('[estoque/saldo] Tabela estoque nao existe:', tblErr.message);
      }

      res.json({ ok: true, saldos });
    } catch (e) {
      console.error('[estoque/saldo]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  return router;
};
