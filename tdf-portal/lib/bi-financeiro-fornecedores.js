/**
 * TDF Portal — BI Financeiro Fornecedores
 * Router: /bi-financeiro/api/fornecedores/*
 *
 * Endpoints CRUD + import CSV para a tabela fornecedores (Postgres).
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

  function empresaFilter(empresaIds, col = 'empresa_id') {
    if (!empresaIds) return { sql: '', params: [] };
    const placeholders = empresaIds.map((_, i) => `$${i + 1}`).join(',');
    return { sql: ` AND ${col} IN (${placeholders})`, params: empresaIds };
  }

  // ============ GET /bi-financeiro/api/fornecedores ============
  // Query: ?empresaBI=1,2,3 &search=texto &page=1 &limit=50
  router.get('/', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const search = (req.query.search || '').trim();
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
      const offset = (page - 1) * limit;

      const ef = empresaFilter(empresaIds);

      let searchSql = '';
      let searchParams = [...ef.params];
      if (search.length >= 2) {
        const like = `%${search}%`;
        searchSql = ` AND (
          razao_social  ILIKE $${ef.params.length + 1}
          OR nome_fantasia ILIKE $${ef.params.length + 1}
          OR cnpj_cpf    ILIKE $${ef.params.length + 1}
          OR email       ILIKE $${ef.params.length + 1}
          OR cidade      ILIKE $${ef.params.length + 1}
        )`;
        searchParams.push(like);
      }

      const countQ = await pool.query(
        `SELECT COUNT(*) AS total FROM fornecedores WHERE 1=1 ${ef.sql}${searchSql}`,
        ef.params
      );
      const total = parseInt(countQ.rows[0].total, 10);

      const dataQ = await pool.query(
        `SELECT
            id, empresa_id, omie_codigo, razao_social, nome_fantasia,
            cnpj_cpf, email, telefone, cidade, estado,
            synced_at
         FROM fornecedores
         WHERE 1=1 ${ef.sql}${searchSql}
         ORDER BY razao_social ASC
         LIMIT $${searchParams.length + 1} OFFSET $${searchParams.length + 2}`,
        [...searchParams, limit, offset]
      );

      res.json({ ok: true, total, page, limit, rows: dataQ.rows });
    } catch (e) {
      console.error('[fornecedores list]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ GET /bi-financeiro/api/fornecedores/search ============
  // Query: ?q=texto (mínimo 2 chars, retorna até 20)
  router.get('/search', requireAuth, async (req, res) => {
    try {
      const q = (req.query.q || '').trim();
      if (q.length < 2) {
        return res.json({ ok: false, error: 'q deve ter pelo menos 2 caracteres' });
      }

      const like = `%${q}%`;
      const r = await pool.query(
        `SELECT id, razao_social, nome_fantasia, cnpj_cpf, cidade, estado
           FROM fornecedores
          WHERE razao_social ILIKE $1
             OR nome_fantasia ILIKE $1
             OR cnpj_cpf      ILIKE $1
          ORDER BY razao_social ASC
          LIMIT 20`,
        [like]
      );

      res.json({ ok: true, total: r.rows.length, fornecedores: r.rows });
    } catch (e) {
      console.error('[fornecedores search]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ GET /bi-financeiro/api/fornecedores/:id ============
  router.get('/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.json({ ok: false, error: 'id_invalido' });

      const r = await pool.query(
        `SELECT id, empresa_id, omie_codigo, razao_social, nome_fantasia,
                cnpj_cpf, email, telefone, cidade, estado,
                synced_at
           FROM fornecedores WHERE id = $1`,
        [id]
      );

      if (r.rows.length === 0) {
        return res.json({ ok: false, error: 'nao_encontrado' });
      }

      res.json({ ok: true, fornecedor: r.rows[0] });
    } catch (e) {
      console.error('[fornecedores get]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ POST /bi-financeiro/api/fornecedores ============
  // Body: { empresa_id, razao_social, nome_fantasia, cnpj_cpf, email, telefone, cidade, estado }
  router.post('/', requireAuth, async (req, res) => {
    try {
      const { empresa_id, razao_social, nome_fantasia, cnpj_cpf, email, telefone, cidade, estado } = req.body || {};

      if (!empresa_id || !razao_social) {
        return res.json({ ok: false, error: 'empresa_id e razao_social sao obrigatorios' });
      }

      // omie_codigo = 0 indica cadastro manual (não veio da OMIE)
      // synced_at = NOW()
      const r = await pool.query(
        `INSERT INTO fornecedores
           (empresa_id, omie_codigo, razao_social, nome_fantasia, cnpj_cpf, email, telefone, cidade, estado, synced_at)
         VALUES ($1, 0, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING id`,
        [empresa_id, razao_social, nome_fantasia || null, cnpj_cpf || null,
         email || null, telefone || null, cidade || null, estado || null]
      );

      res.json({ ok: true, id: r.rows[0].id });
    } catch (e) {
      console.error('[fornecedores create]', e);
      if (e.code === '23505') {
        return res.json({ ok: false, error: 'duplicado' });
      }
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ PUT /bi-financeiro/api/fornecedores/:id ============
  // Body: campos opcionais — atualiza apenas os fornecidos
  router.put('/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.json({ ok: false, error: 'id_invalido' });

      const allowed = ['razao_social', 'nome_fantasia', 'cnpj_cpf', 'email', 'telefone', 'cidade', 'estado'];
      const updates = [];
      const values = [];
      let idx = 1;

      for (const field of allowed) {
        if (req.body[field] !== undefined) {
          updates.push(`${field} = $${idx}`);
          values.push(req.body[field] || null);
          idx++;
        }
      }

      if (updates.length === 0) {
        return res.json({ ok: false, error: 'nenhum_campo_para_atualizar' });
      }

      values.push(id);
      const r = await pool.query(
        `UPDATE fornecedores SET ${updates.join(', ')} WHERE id = $${idx}`,
        values
      );

      if (r.rowCount === 0) {
        return res.json({ ok: false, error: 'nao_encontrado' });
      }

      res.json({ ok: true });
    } catch (e) {
      console.error('[fornecedores update]', e);
      if (e.code === '23505') {
        return res.json({ ok: false, error: 'duplicado' });
      }
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ DELETE /bi-financeiro/api/fornecedores/:id ============
  router.delete('/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.json({ ok: false, error: 'id_invalido' });

      const r = await pool.query(
        `DELETE FROM fornecedores WHERE id = $1 RETURNING id`,
        [id]
      );

      if (r.rowCount === 0) {
        return res.json({ ok: false, error: 'nao_encontrado' });
      }

      res.json({ ok: true });
    } catch (e) {
      console.error('[fornecedores delete]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ POST /bi-financeiro/api/fornecedores/import-csv ============
  // Body: JSON { csv: "empresa_id,razao_social,..." }
  // CSV columns: empresa_id, razao_social, nome_fantasia, cnpj_cpf, email, telefone, cidade, estado
  // Ignora duplicatas por (empresa_id, cnpj_cpf)
  router.post('/import-csv', requireAuth, async (req, res) => {
    try {
      const csvText = req.body?.csv;
      if (!csvText || typeof csvText !== 'string') {
        return res.json({ ok: false, error: 'csv e obrigatorio (envie JSON: {csv: "..."})' });
      }

      const lines = csvText.trim().split('\n').filter(l => l.trim());
      if (lines.length === 0) {
        return res.json({ ok: false, error: 'csv_vazio' });
      }

      // Skip header if present
      let startIdx = 0;
      const firstLine = lines[0].toLowerCase();
      if (firstLine.includes('empresa_id') || firstLine.includes('razao_social')) {
        startIdx = 1;
      }

      let importados = 0;
      let duplicados = 0;
      let erros = 0;
      const errorList = [];

      for (let i = startIdx; i < lines.length; i++) {
        const cols = lines[i].split(';').map(c => c.trim());
        if (cols.length < 2) {
          erros++;
          errorList.push(`linha ${i + 1}: colunas insuficientes`);
          continue;
        }

        const empresa_id = parseInt(cols[0], 10);
        const razao_social = cols[1];
        const nome_fantasia = cols[2] || null;
        const cnpj_cpf = cols[3] || null;
        const email = cols[4] || null;
        const telefone = cols[5] || null;
        const cidade = cols[6] || null;
        const estado = cols[7] || null;

        if (isNaN(empresa_id) || !razao_social) {
          erros++;
          errorList.push(`linha ${i + 1}: empresa_id ou razao_social invalidos`);
          continue;
        }

        try {
          const r = await pool.query(
            `INSERT INTO fornecedores
               (empresa_id, omie_codigo, razao_social, nome_fantasia, cnpj_cpf, email, telefone, cidade, estado, synced_at)
             VALUES ($1, 0, $2, $3, $4, $5, $6, $7, $8, NOW())
             ON CONFLICT (empresa_id, omie_codigo) DO NOTHING
             RETURNING id`,
            [empresa_id, razao_social, nome_fantasia, cnpj_cpf, email, telefone, cidade, estado]
          );

          if (r.rowCount > 0) {
            importados++;
          } else {
            duplicados++;
          }
        } catch (innerErr) {
          erros++;
          if (errorList.length < 10) {
            errorList.push(`linha ${i + 1}: ${innerErr.message}`);
          }
        }
      }

      res.json({
        ok: true,
        importados,
        duplicados,
        erros,
        errorList: errorList.slice(0, 10)
      });
    } catch (e) {
      console.error('[fornecedores import-csv]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  return router;
};
