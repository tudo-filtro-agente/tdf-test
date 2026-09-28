/**
 * TDF Portal — BI Financeiro: Contas a Receber
 * Router: /bi-financeiro/api/contas-receber
 *
 * READ-ONLY. POST/PUT/DELETE retornam 405.
 */

const express = require('express');
const router = express.Router();

module.exports = function ({ pool, requireAuth }) {

  // ---- helpers -------------------------------------------------------
  function parseEmpresas(req) {
    const raw = req.query.empresaBI || req.query.empresa || '';
    if (!raw || raw === 'consolidado' || raw === '') return null;
    return String(raw).split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n));
  }

  function empresaFilter(empresaIds) {
    if (!empresaIds) return { sql: '', params: [] };
    const placeholders = empresaIds.map((_, i) => `$${i + 1}`).join(',');
    return { sql: ` AND cr.empresa_id IN (${placeholders})`, params: empresaIds };
  }

  // ---- READ-ONLY guard (405) -----------------------------------------
  function readOnly(req, res) {
    res.status(405).json({ ok: false, error: 'readonly', message: 'Este endpoint é somente leitura' });
  }

  // ========== GET /bi-financeiro/api/contas-receber ====================
  router.get('/contas-receber', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const status = req.query.status || null;               // em_aberto | atrasado
      const dateFrom = req.query.dateFrom || null;
      const dateTo = req.query.dateTo || null;
      const search = (req.query.search || '').trim();
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
      const offset = (page - 1) * limit;

      const ef = empresaFilter(empresaIds);
      const params = [...ef.params];
      let paramIdx = ef.params.length + 1;

      const conditions = [ef.sql];

      // status
      if (status === 'em_aberto') {
        conditions.push(` AND cr.status = 'em_aberto'`);
      } else if (status === 'atrasado') {
        conditions.push(` AND cr.status = 'atrasado'`);
      }

      // dateFrom / dateTo — filtro em data_vencimento
      if (dateFrom) {
        conditions.push(` AND cr.data_vencimento >= $${paramIdx}`);
        params.push(dateFrom);
        paramIdx++;
      }
      if (dateTo) {
        conditions.push(` AND cr.data_vencimento <= $${paramIdx}`);
        params.push(dateTo);
        paramIdx++;
      }

      // search: nome_cliente OU numero_documento (LIKE %termo%)
      if (search) {
        conditions.push(` AND (cr.nome_cliente ILIKE $${paramIdx} OR cr.numero_documento ILIKE $${paramIdx})`);
        params.push(`%${search}%`);
        paramIdx++;
      }

      const whereSql = conditions.join('');

      // count
      const countSql = `
        SELECT COUNT(*) AS total
        FROM contas_receber cr
        WHERE 1=1 ${whereSql}
      `;
      const countResult = await pool.query(countSql, params);
      const total = parseInt(countResult.rows[0].total, 10);

      // data
      const dataSql = `
        SELECT
            cr.id,
            cr.empresa_id,
            e.nome                                      AS empresa_nome,
            cr.omie_codigo,
            cr.codigo_cliente,
            cr.nome_cliente,
            cr.numero_documento,
            cr.parcela,
            cr.valor_documento,
            cr.valor_recebido,
            cr.saldo,
            cr.data_emissao,
            cr.data_vencimento,
            cr.data_recebimento,
            cr.status,
            cr.categoria,
            cr.observacao,
            cr.raw,
            cr.synced_at
        FROM contas_receber cr
        LEFT JOIN empresas e ON e.id = cr.empresa_id
        WHERE 1=1 ${whereSql}
        ORDER BY cr.data_vencimento ASC NULLS LAST, cr.id ASC
        LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
      `;
      const dataParams = [...params, limit, offset];
      const dataResult = await pool.query(dataSql, dataParams);

      res.json({
        ok: true,
        total,
        page,
        limit,
        rows: dataResult.rows
      });
    } catch (e) {
      console.error('[contas-receber list]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ========== GET /bi-financeiro/api/contas-receber/:id ===============
  router.get('/contas-receber/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: 'id_invalido' });
      }

      const result = await pool.query(
        `SELECT
            cr.id,
            cr.empresa_id,
            e.nome                                      AS empresa_nome,
            cr.omie_codigo,
            cr.codigo_cliente,
            cr.nome_cliente,
            cr.numero_documento,
            cr.parcela,
            cr.valor_documento,
            cr.valor_recebido,
            cr.saldo,
            cr.data_emissao,
            cr.data_vencimento,
            cr.data_recebimento,
            cr.status,
            cr.categoria,
            cr.observacao,
            cr.raw,
            cr.synced_at
        FROM contas_receber cr
        LEFT JOIN empresas e ON e.id = cr.empresa_id
        WHERE cr.id = $1
        LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ ok: false, error: 'nao_encontrado' });
      }

      res.json({ ok: true, conta: result.rows[0] });
    } catch (e) {
      console.error('[contas-receber detail]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ========== POST /bi-financeiro/api/contas-receber ==================
  router.post('/contas-receber', requireAuth, readOnly);

  // ========== PUT /bi-financeiro/api/contas-receber/:id ==============
  router.put('/contas-receber/:id', requireAuth, readOnly);

  // ========== DELETE /bi-financeiro/api/contas-receber/:id ===========
  router.delete('/contas-receber/:id', requireAuth, readOnly);

  // ========== GET /bi-financeiro/api/recebimentos/from-zoho ==========
  // Lista contas_receber onde raw->>'origem' = 'zoho'
  // Se a coluna não existir, retorna erro estruturado em vez de SQL falhar
  router.get('/recebimentos/from-zoho', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const ef = empresaFilter(empresaIds);

      // Verifica se a chave 'origem' existe no JSONB raw com LIMIT 0
      const colCheck = await pool.query(
        `SELECT 1 FROM contas_receber WHERE raw->>'origem' = 'zoho' LIMIT 1`
      ).catch((err) => {
        // Se o erro indica que a chave não existe, retornamos erro estruturado
        if (err.code === '42703' || err.message.includes('origem') || err.message.includes('undefined')) {
          return { rows: [], error: 'campo_origem_nao_existe' };
        }
        throw err;
      });

      if (colCheck.error === 'campo_origem_nao_existe') {
        return res.json({ ok: false, error: 'campo_origem_nao_existe' });
      }

      const sql = `
        SELECT
            cr.id,
            cr.empresa_id,
            e.nome                                      AS empresa_nome,
            cr.omie_codigo,
            cr.codigo_cliente,
            cr.nome_cliente,
            cr.numero_documento,
            cr.parcela,
            cr.valor_documento,
            cr.valor_recebido,
            cr.saldo,
            cr.data_emissao,
            cr.data_vencimento,
            cr.data_recebimento,
            cr.status,
            cr.categoria,
            cr.observacao,
            cr.raw,
            cr.synced_at
        FROM contas_receber cr
        LEFT JOIN empresas e ON e.id = cr.empresa_id
        WHERE cr.raw->>'origem' = 'zoho' ${ef.sql}
        ORDER BY cr.data_vencimento ASC NULLS LAST, cr.id ASC
      `;

      const result = await pool.query(sql, ef.params);

      res.json({ ok: true, total: result.rows.length, rows: result.rows });
    } catch (e) {
      // Se o erro indica que a chave JSONB não existe
      if (e.code === '42703' || e.message.includes('origem') || e.message.includes('undefined')) {
        return res.json({ ok: false, error: 'campo_origem_nao_existe' });
      }
      console.error('[recebimentos/from-zoho]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  return router;
};
