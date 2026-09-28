/**
 * TDF Portal — BI Financeiro / Bancos
 * Router: /bi-financeiro/api/bancos*
 *
 * Endpoints REST para consulta de contas bancárias.
 */

const express = require('express');
const router = express.Router();

module.exports = function ({ pool, requireAuth }) {

  // Helper: parse empresas da query (consolidado ou lista de ids)
  function parseEmpresas(req) {
    const raw = req.query.empresaBI || req.query.empresa || '';
    if (!raw || raw === 'consolidado' || raw === '') return null;
    return String(raw).split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n));
  }

  function empresaFilter(empresaIds, col = 'cb.empresa_id') {
    if (!empresaIds) return { sql: '', params: [] };
    const placeholders = empresaIds.map((_, i) => `$${i + 1}`).join(',');
    return { sql: ` AND ${col} IN (${placeholders})`, params: empresaIds };
  }

  // ============ GET /bi-financeiro/api/bancos ============
  router.get('/bancos', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const ef = empresaFilter(empresaIds, 'cb.empresa_id');

      const r = await pool.query(
        `SELECT cb.id, cb.omie_codigo, cb.nome, cb.banco, cb.agencia, cb.conta,
                cb.tipo, cb.saldo_atual, cb.empresa_id, e.nome AS empresa_nome, cb.ativa
         FROM contas_bancarias cb
         JOIN empresas e ON e.id = cb.empresa_id
         WHERE cb.ativa = true ${ef.sql}
         ORDER BY e.nome, cb.nome`,
        ef.params
      );

      const contas = r.rows.map(row => ({
        id: row.id,
        omie_codigo: row.omie_codigo,
        nome: row.nome,
        banco: row.banco,
        agencia: row.agencia,
        conta: row.conta,
        tipo: row.tipo,
        saldo_atual: Number(row.saldo_atual || 0),
        empresa_id: row.empresa_id,
        empresa_nome: row.empresa_nome,
        ativa: row.ativa
      }));

      const saldoTotal = contas.reduce((acc, c) => acc + c.saldo_atual, 0);

      res.json({
        ok: true,
        total: contas.length,
        saldo_total: saldoTotal,
        contas
      });
    } catch (e) {
      console.error('[bancos]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ GET /bi-financeiro/api/bancos/:id ============
  router.get('/bancos/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.json({ ok: false, error: 'id_invalido' });
      }

      const r = await pool.query(
        `SELECT cb.*, e.nome AS empresa_nome
         FROM contas_bancarias cb
         JOIN empresas e ON e.id = cb.empresa_id
         WHERE cb.id = $1`,
        [id]
      );

      if (r.rows.length === 0) {
        return res.json({ ok: false, error: 'nao_encontrado' });
      }

      const row = r.rows[0];
      const conta = {
        id: row.id,
        omie_codigo: row.omie_codigo,
        nome: row.nome,
        banco: row.banco,
        agencia: row.agencia,
        conta: row.conta,
        tipo: row.tipo,
        saldo_atual: Number(row.saldo_atual || 0),
        empresa_id: row.empresa_id,
        empresa_nome: row.empresa_nome,
        ativa: row.ativa,
        synced_at: row.synced_at,
        raw: row.raw
      };

      res.json({ ok: true, conta });
    } catch (e) {
      console.error('[bancos/:id]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ GET /bi-financeiro/api/bancos-dashboard ============
  router.get('/bancos-dashboard', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const ef = empresaFilter(empresaIds, 'cb.empresa_id');

      // Total de contas e saldo total
      const totalR = await pool.query(
        `SELECT COUNT(*) AS total, COALESCE(SUM(cb.saldo_atual), 0) AS saldo_total
         FROM contas_bancarias cb
         WHERE cb.ativa = true ${ef.sql}`,
        ef.params
      );

      const total_contas = parseInt(totalR.rows[0].total || 0, 10);
      const saldo_total = Number(totalR.rows[0].saldo_total || 0);

      // Saldo por empresa
      const porEmpresaR = await pool.query(
        `SELECT cb.empresa_id, e.nome AS empresa_nome,
                COUNT(*) AS total_contas,
                COALESCE(SUM(cb.saldo_atual), 0) AS saldo
         FROM contas_bancarias cb
         JOIN empresas e ON e.id = cb.empresa_id
         WHERE cb.ativa = true ${ef.sql}
         GROUP BY cb.empresa_id, e.nome
         ORDER BY e.nome`,
        ef.params
      );

      const saldo_por_empresa = porEmpresaR.rows.map(row => ({
        empresa_id: row.empresa_id,
        empresa_nome: row.empresa_nome,
        total_contas: parseInt(row.total_contas || 0, 10),
        saldo: Number(row.saldo || 0)
      }));

      // Saldo por tipo de conta
      const porTipoR = await pool.query(
        `SELECT cb.tipo, COUNT(*) AS total_contas, COALESCE(SUM(cb.saldo_atual), 0) AS saldo
         FROM contas_bancarias cb
         WHERE cb.ativa = true ${ef.sql}
         GROUP BY cb.tipo
         ORDER BY saldo DESC`,
        ef.params
      );

      const saldo_por_tipo = porTipoR.rows.map(row => ({
        tipo: row.tipo || 'outro',
        total_contas: parseInt(row.total_contas || 0, 10),
        saldo: Number(row.saldo || 0)
      }));

      res.json({
        ok: true,
        total_contas,
        saldo_total,
        saldo_por_empresa,
        saldo_por_tipo
      });
    } catch (e) {
      console.error('[bancos-dashboard]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  return router;
};
