/**
 * TDF Portal — BI Financeiro / Contas a Pagar
 * Router: /bi-financeiro/api/contas-pagar
 *
 * Endpoints REST para listagem e detalhe de contas a pagar.
 * Tabela contas_pagar é READ-ONLY — POST/PUT/DELETE retornam error: 'read_only'.
 *
 * GET  /bi-financeiro/api/contas-pagar       — listagem com filtros e paginação
 * GET  /bi-financeiro/api/contas-pagar/:id   — detalhe por id
 * POST /bi-financeiro/api/contas-pagar       — reject (read_only)
 * PUT  /bi-financeiro/api/contas-pagar/:id   — reject (read_only)
 * DELETE /bi-financeiro/api/contas-pagar/:id  — reject (read_only)
 */

const express = require('express');
const router = express.Router();

module.exports = function ({ pool, requireAuth }) {

  // ---------- helpers ----------

  /**
   * Parseia ?empresaBI=1,2,3 ou ?empresa=consolidado
   * Retorna null para consolidado/todas, ou array de inteiros.
   */
  function parseEmpresas(req) {
    const raw = req.query.empresaBI || req.query.empresa || '';
    if (!raw || raw === 'consolidado' || raw === '') return null;
    return String(raw).split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n));
  }

  /**
   * Build filtro empresa_id para SQL.
   * Retorna { sql: '', params: [] } ou { sql: ' AND empresa_id IN ($1,$2)', params: [1,2] }
   */
  function empresaFilter(empresaIds) {
    if (!empresaIds) return { sql: '', params: [] };
    const placeholders = empresaIds.map((_, i) => `$${i + 1}`).join(',');
    return { sql: ` AND empresa_id IN (${placeholders})`, params: empresaIds };
  }

  /**
   * Parseia status da query (?status=em_aberto,atrasado)
   * Retorna array de status ou null.
   */
  function parseStatus(req) {
    const raw = req.query.status || '';
    if (!raw) return null;
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  }

  // ---------- GET /contas-pagar — listagem ----------

  router.get('/', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const statusList = parseStatus(req);
      const dateFrom = req.query.dateFrom || null;
      const dateTo = req.query.dateTo || null;
      const search = req.query.search || '';
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
      const offset = (page - 1) * limit;

      const params = [];
      const conditions = ['1=1'];

      // filtro empresa
      if (empresaIds) {
        const placeholders = empresaIds.map((_, i) => `$${i + 1}`).join(',');
        conditions.push(`empresa_id IN (${placeholders})`);
        params.push(...empresaIds);
      }

      // filtro status
      if (statusList && statusList.length > 0) {
        const placeholders = statusList.map((_, i) => `$${params.length + i + 1}`).join(',');
        conditions.push(`status IN (${placeholders})`);
        params.push(...statusList);
      }

      // filtro dateFrom / dateTo (aplicado a data_vencimento)
      if (dateFrom) {
        params.push(dateFrom);
        conditions.push(`data_vencimento >= $${params.length}`);
      }
      if (dateTo) {
        params.push(dateTo);
        conditions.push(`data_vencimento <= $${params.length}`);
      }

      // filtro search (LIKE %texto%)
      if (search) {
        params.push(`%${search}%`);
        conditions.push(`(nome_fornecedor ILIKE $${params.length} OR numero_documento ILIKE $${params.length})`);
      }

      const whereClause = 'WHERE ' + conditions.join(' AND ');

      // total sem paginação (para o front)
      const countRes = await pool.query(
        `SELECT COUNT(*) AS total FROM contas_pagar ${whereClause}`,
        params
      );
      const total = parseInt(countRes.rows[0].total, 10);

      // dados paginados
      const dataParams = [...params, limit, offset];
      const dataRes = await pool.query(
        `SELECT
            id, empresa_id, omie_codigo, codigo_fornecedor, nome_fornecedor,
            numero_documento, parcela,
            valor_documento, valor_pago, saldo,
            data_emissao, data_vencimento, data_pagamento,
            status, categoria, observacao, synced_at
         FROM contas_pagar
         ${whereClause}
         ORDER BY data_vencimento ASC, id ASC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        dataParams
      );

      res.json({
        ok: true,
        total,
        page,
        limit,
        rows: dataRes.rows
      });
    } catch (e) {
      console.error('[contas-pagar list]', e);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // ---------- GET /contas-pagar/:id — detalhe ----------

  router.get('/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: 'id_invalido' });
      }

      const { rows } = await pool.query(
        `SELECT
            id, empresa_id, omie_codigo, codigo_fornecedor, nome_fornecedor,
            numero_documento, parcela,
            valor_documento, valor_pago, saldo,
            data_emissao, data_vencimento, data_pagamento,
            status, categoria, observacao, raw, synced_at
         FROM contas_pagar
         WHERE id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.json({ ok: false, error: 'nao_encontrado' });
      }

      res.json({ ok: true, conta: rows[0] });
    } catch (e) {
      console.error('[contas-pagar detail]', e);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // ---------- POST /contas-pagar — reject (read_only) ----------

  router.post('/', requireAuth, (req, res) => {
    res.status(405).json({ ok: false, error: 'read_only' });
  });

  // ---------- PUT /contas-pagar/:id — reject (read_only) ----------

  router.put('/:id', requireAuth, (req, res) => {
    res.status(405).json({ ok: false, error: 'read_only' });
  });

  // ---------- DELETE /contas-pagar/:id — reject (read_only) ----------

  router.delete('/:id', requireAuth, (req, res) => {
    res.status(405).json({ ok: false, error: 'read_only' });
  });

  return router;
};
