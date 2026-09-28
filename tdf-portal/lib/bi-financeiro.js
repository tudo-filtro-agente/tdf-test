/**
 * TDF Portal — BI Financeiro (clone do Paulo)
 * Router: /bi-financeiro/api/*
 *
 * Implementa o mínimo necessário para o bi-financeiro.ejs do Paulo renderizar
 * dados reais da OMIE (via cache local Postgres).
 *
 * Aba CEO: /bi-financeiro/api/ceo-dashboard
 * State:   /bi-financeiro/api/state (GET/PUT)
 * Empresas: drop-down sincronizado com Postgres
 *
 * Demais endpoints retornam { ok:false, error:'em_breve' } — a UI trata graceful.
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

  // ============ EMPRESAS ============
  router.get('/empresas', requireAuth, async (req, res) => {
    try {
      const r = await pool.query(`SELECT id, nome FROM empresas WHERE ativo = true ORDER BY id`);
      res.json({ ok: true, empresas: r.rows });
    } catch (e) {
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ STATE (colaborativo — kv_store) ============
  async function ensureKvTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS kv_store (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
    } catch (e) {
      console.warn('[bi-financeiro] ensureKvTable:', e.message);
    }
  }

  router.get('/state', requireAuth, async (req, res) => {
    try {
      await ensureKvTable();
      const r = await pool.query(
        `SELECT value FROM kv_store WHERE key = 'bi_financeiro_state' LIMIT 1`
      );
      if (r.rows.length === 0) return res.json({ ok: true, state: null, version: 0 });
      const value = typeof r.rows[0].value === 'string' ? JSON.parse(r.rows[0].value) : r.rows[0].value;
      res.json({ ok: true, state: value, version: 1 });
    } catch (e) {
      res.json({ ok: false, error: e.message });
    }
  });

  router.put('/state', requireAuth, async (req, res) => {
    try {
      await ensureKvTable();
      const state = req.body || {};
      const value = JSON.stringify(state);
      await pool.query(
        `INSERT INTO kv_store (key, value, updated_at)
         VALUES ('bi_financeiro_state', $1::jsonb, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [value]
      );
      res.json({ ok: true, version: 1 });
    } catch (e) {
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ SYNC ============
  router.post('/sync', requireAuth, async (req, res) => {
    // Placeholder — UI mostra mensagem amigável
    res.json({ ok: true, message: 'Sincronização executada via cron a cada 30min.' });
  });

  // ============ CEO DASHBOARD ============
  router.get('/ceo-dashboard', requireAuth, async (req, res) => {
    try {
      const empresaIds = parseEmpresas(req);
      const dateFrom = req.query.dateFrom || null;
      const dateTo = req.query.dateTo || null;
      const comparePrev = String(req.query.comparePrev || 'true') === 'true';

      const ef = empresaFilter(empresaIds);

      // Bancos — saldo total + lista
      const bancosQ = await pool.query(
        `SELECT omie_codigo, nome, banco, saldo_atual
         FROM contas_bancarias
         WHERE ativa = true ${ef.sql}
         ORDER BY nome`,
        ef.params
      );
      const saldoTotal = bancosQ.rows.reduce((acc, r) => acc + Number(r.saldo_atual || 0), 0);

      // Pagamentos — em aberto
      const pagQ = await pool.query(
        `SELECT
            COUNT(*) FILTER (WHERE status = 'em_aberto') AS aguardando,
            COUNT(*) FILTER (WHERE status = 'atrasado') AS vencido,
            COALESCE(SUM(saldo) FILTER (WHERE status = 'em_aberto'), 0) AS valorAguardando,
            COALESCE(SUM(saldo) FILTER (WHERE status = 'atrasado'), 0) AS valorVencido,
            COALESCE(SUM(saldo) FILTER (WHERE data_vencimento BETWEEN $1::date AND $2::date), 0) AS noMes,
            COALESCE(SUM(saldo) FILTER (WHERE data_vencimento = CURRENT_DATE), 0) AS vencendoHoje,
            COALESCE(SUM(saldo) FILTER (WHERE data_vencimento BETWEEN CURRENT_DATE AND (CURRENT_DATE + 7)), 0) AS proxSemana
         FROM contas_pagar
         WHERE status IN ('em_aberto', 'atrasado') ${ef.sql}`,
        [...ef.params, dateFrom || '1900-01-01', dateTo || '2999-12-31']
      );
      const p = pagQ.rows[0] || {};
      const pagamentos = {
        aguardando: Number(p.aguardando || 0),
        aprovado: 0, // workflow ainda não implementado no nosso portal
        vencidos: Number(p.vencido || 0),
        valorAguardando: Number(p.valorAguardando || 0),
        valorAprovado: 0,
        vencendoHoje: Number(p.vencendoHoje || 0),
        proxSemana: Number(p.proxSemana || 0),
        noMes: Number(p.noMes || 0)
      };

      // Recebimentos — em aberto
      const recQ = await pool.query(
        `SELECT
            COUNT(*) FILTER (WHERE status = 'em_aberto') AS aberto,
            COALESCE(SUM(saldo) FILTER (WHERE status = 'em_aberto'), 0) AS valorAberto
         FROM contas_receber
         WHERE status IN ('em_aberto', 'atrasado') ${ef.sql}`,
        ef.params
      );
      const r = recQ.rows[0] || {};
      const recebimentos = {
        aberto: Number(r.aberto || 0),
        valorAberto: Number(r.valorAberto || 0)
      };

      // Caixa projetado: saldo bancos - a pagar + a receber
      const caixaProjetado = saldoTotal - pagamentos.valorAguardando + recebimentos.valorAberto;

      // Período para response (caso o front não envie, usar mês atual)
      const periodo = {
        from: dateFrom || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
        to: dateTo || new Date().toISOString().slice(0, 10),
        prevFrom: '',
        prevTo: '',
        compararPeriodoAnterior: comparePrev
      };

      // Alertas simples
      const alertas = [];
      if (pagamentos.vencidos > 0) {
        alertas.push({
          kind: 'bad',
          txt: `🔴 R$ ${pagamentos.vencidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} vencidos a pagar`
        });
      }
      if (recebimentos.valorAberto > 100000) {
        alertas.push({
          kind: 'warn',
          txt: `📥 R$ ${recebimentos.valorAberto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a receber — pressão de caixa`
        });
      }
      if (caixaProjetado < 0) {
        alertas.push({
          kind: 'bad',
          txt: `⚠️ Caixa projetado NEGATIVO: R$ ${caixaProjetado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        });
      }

      res.json({
        ok: true,
        ts: new Date().toISOString(),
        periodo,
        bancos: {
          saldoTotal,
          total: bancosQ.rows.length,
          limiteTotal: 0,
          lista: bancosQ.rows.map(b => ({
            apelido: b.nome || `${b.banco || 'Conta'} ${b.omie_codigo}`,
            saldo: Number(b.saldo_atual || 0)
          }))
        },
        caixaProjetado,
        pagamentos,
        recebimentos,
        zoho: { atual: { receita: 0, lucro: 0, count: 0, semFicha: 0 }, anterior: null, top5Lucro: [] },
        alertas
      });
    } catch (e) {
      console.error('[ceo-dashboard]', e);
      res.json({ ok: false, error: e.message });
    }
  });

  // ============ STUB para endpoints não implementados ============
  // O front do BI é resiliente — todos os outros endpoints recebem { ok:false, error:'em_breve' }
  // e a UI mostra "Em breve" sem quebrar.
  const stubEndpoints = [
    'bancos', 'bancos/', 'aprovadores', 'aprovadores/',
    'pagamentos', 'pagamentos/', 'recebimentos', 'recebimentos/',
    'compras', 'compras/', 'fornecedores', 'fornecedores/', 'fornecedores/search',
    'estoque/dashboard', 'estoque/empresas', 'estoque/locais', 'estoque/movimentar', 'estoque/produtos', 'estoque/saldo',
    'auditoria', 'pagamentos-dashboard', 'recebimentos-dashboard',
    'nf/listar', 'nf/upload', 'nf/imap/status', 'nf/imap/trigger',
    'rotas/listar', 'rotas/historico', 'rotas/finalizar',
    'veiculos', 'os-materiais/listar',
    'recorrencia/last-run', 'recorrencia/preview', 'recorrencia/rodar-agora',
    'vendas-zoho', 'recebimentos/from-zoho',
    'bulk-delete', 'owners', 'zapi-config', 'zapi-config/',
    'zapi-config-global', 'zapi-config-global/teste',
    'focusnfe/config', 'focusnfe/config/', 'focusnfe/emitir',
    'conciliacao/confirmar', 'conciliacao/importar', 'conciliacao/preview', 'conciliacao/quebrar'
  ];

  for (const ep of stubEndpoints) {
    const handler = (req, res) => res.json({ ok: false, error: 'em_breve', endpoint: ep });
    router.get(`/${ep}`, requireAuth, handler);
    router.post(`/${ep}`, requireAuth, handler);
    router.put(`/${ep}`, requireAuth, handler);
    router.delete(`/${ep}`, requireAuth, handler);
  }

  // Catch-all
  router.all('*', requireAuth, (req, res) => {
    res.json({ ok: false, error: 'em_breve', endpoint: req.path });
  });

  return router;
};
