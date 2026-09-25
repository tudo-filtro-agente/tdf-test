/**
 * tdf-portal — versão TESTE
 *
 * Endpoints:
 * - GET  /                    → dashboard
 * - GET  /health              → healthcheck Railway
 * - GET  /env                 → mostra variáveis (debug)
 * - GET  /api/test/omie       → testa OMIE (3 empresas, lista clientes)
 * - GET  /api/test/ops        → testa comunicação com tdf-ops
 * - POST /api/pedido          → cria pedido (passa pelo tdf-ops)
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

const omie = require('./lib/omie');
const opsClient = require('./lib/tdf-ops-client');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ------- Páginas -------

app.get('/', async (req, res) => {
  const env = process.env.ENVIRONMENT || 'test';
  const dryRun = (process.env.DRY_RUN || 'true').toLowerCase() === 'true';
  res.render('index', { env, dryRun, empresas: Object.keys(omie.EMPRESAS) });
});

// ------- Health -------

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'tdf-portal',
    env: process.env.ENVIRONMENT || 'test',
    dry_run: (process.env.DRY_RUN || 'true').toLowerCase() === 'true',
    timestamp: new Date().toISOString(),
  });
});

app.get('/env', (req, res) => {
  // Mostra quais vars existem (sem mostrar valores!)
  const keys = Object.keys(process.env).filter(k =>
    k.startsWith('OMIE_') || k.startsWith('TDF_') ||
    k === 'DATABASE_URL' || k === 'ENVIRONMENT' || k === 'DRY_RUN'
  );
  res.json({ variables_presentes: keys, total: keys.length });
});

// ------- Teste OMIE -------

app.get('/api/test/omie', async (req, res) => {
  const empresa = req.query.empresa || 'Tudo de Filtro';
  try {
    const data = await omie.listarClientes(empresa);
    res.json({ empresa, dry_run: omie.DRY_RUN, total: data.total_de_registros, dados: data });
  } catch (err) {
    res.status(500).json({ erro: err.message, empresa });
  }
});

app.get('/api/test/omie/pedidos', async (req, res) => {
  const empresa = req.query.empresa || 'Tudo de Filtro';
  try {
    const data = await omie.listarPedidos(empresa);
    res.json({ empresa, dry_run: omie.DRY_RUN, dados: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ------- Teste comunicação com tdf-ops -------

app.get('/api/test/ops', async (req, res) => {
  const health = await opsClient.health();
  const clientes = await opsClient.listClientes();
  const pedidos = await opsClient.listPedidos();
  const kanban = await opsClient.listKanban();
  res.json({
    tdf_ops_health: health,
    tdf_ops_clientes: clientes,
    tdf_ops_pedidos: pedidos,
    tdf_ops_kanban: kanban,
  });
});

// ------- POST pedido (passa por tdf-ops) -------

app.post('/api/pedido', async (req, res) => {
  const payload = req.body;
  console.log('[pedido] recebido:', JSON.stringify(payload));
  // Envia pro tdf-ops criar (vai logar e retornar dry_run=true)
  const result = await opsClient.createPedido(payload);
  res.json(result);
});

// ------- Start -------

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[tdf-portal] listening on port ${PORT}`);
  console.log(`[tdf-portal] ENVIRONMENT=${process.env.ENVIRONMENT || 'test'}`);
  console.log(`[tdf-portal] DRY_RUN=${omie.DRY_RUN}`);
  console.log(`[tdf-portal] TDF_OPS_URL=${process.env.TDF_OPS_URL}`);
  console.log(`[tdf-portal] empresas OMIE: ${Object.keys(omie.EMPRESAS).join(', ')}`);
});
