/**
 * tdf-portal — versão TESTE
 *
 * Etapa 1 / Parte 1: Login + trava OMIE só leitura
 *   - schema users/sessions/access_tokens/audit_log
 *   - bcrypt + cookie session
 *   - endpoints /api/auth/*
 *   - middleware omieReadOnlyGuard bloqueia POST/PUT/DELETE em /api/omie/*
 *   - login libera /admin/* e /api/bi/*
 *
 * Endpoints públicos existentes (compat):
 *   GET  /, /health, /env, /api/test/omie*, /api/test/ops
 *   POST /api/pedido
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const omie = require('./lib/omie');
const opsClient = require('./lib/tdf-ops-client');
const auth = require('./lib/auth');
const { initAuth } = require('./lib/seed');

const app = express();
app.use(express.json());
app.use(cookieParser());
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
  const keys = Object.keys(process.env).filter(k =>
    k.startsWith('OMIE_') || k.startsWith('TDF_') ||
    k === 'DATABASE_URL' || k === 'ENVIRONMENT' || k === 'DRY_RUN'
  );
  res.json({ variables_presentes: keys, total: keys.length });
});

// ====================================================================
// AUTH — Etapa 1 / Parte 1
// ====================================================================

// Diagnóstico: mostra se o schema/seed rodaram (sem vazar segredos)
app.get('/api/auth/test-seed', async (req, res) => {
  try {
    const { rows: users } = await auth.pool.query(
      `SELECT id, username, email, full_name, role, must_reset, is_active, created_at
         FROM users ORDER BY id`
    );
    const { rows: tokens } = await auth.pool.query(
      `SELECT at.id, at.user_id, u.username, at.purpose, at.expires_at, at.used_at
         FROM access_tokens at JOIN users u ON u.id = at.user_id
        ORDER BY at.id DESC LIMIT 20`
    );
    const { rows: sess } = await auth.pool.query(
      `SELECT COUNT(*)::int AS total FROM sessions WHERE expires_at > NOW()`
    );
    res.json({
      ok: true,
      users_total: users.length,
      users,
      tokens_recentes: tokens,
      sessions_ativas: sess[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ ok: false, erro: err.message });
  }
});

// 1º acesso / reset — valida token e cria/autoriza troca de senha
app.post('/api/auth/redeem-token', async (req, res) => {
  const { token, new_password } = req.body || {};
  if (!token || !new_password) {
    return res.status(400).json({ ok: false, erro: 'token e new_password são obrigatórios' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ ok: false, erro: 'senha deve ter no mínimo 8 caracteres' });
  }
  try {
    const r = await auth.consumeAccessToken(token, 'first_access');
    if (!r.ok) {
      return res.status(400).json({ ok: false, erro: `token inválido (${r.reason})` });
    }
    await auth.setPassword(r.user_id, new_password);
    await auth.markTokenUsed(/* token id */ (await auth.pool.query(
      'SELECT id FROM access_tokens WHERE token_hash = encode(digest($1, $2), $2) AND purpose = $3 LIMIT 1',
      [token, 'hex', 'first_access']
    )).rows[0]?.id);
    await auth.audit(r.user_id, r.username, 'first_access_done', null, null, req);
    const sid = await auth.createSession(r.user_id, req);
    res.cookie(auth.SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: (process.env.ENVIRONMENT || 'test') === 'production',
      maxAge: auth.SESSION_TTL_HOURS * 3600 * 1000,
    });
    res.json({ ok: true, username: r.username, must_reset: false });
  } catch (err) {
    console.error('[auth] redeem-token error', err);
    res.status(500).json({ ok: false, erro: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, erro: 'username e password são obrigatórios' });
  }
  try {
    const user = await auth.findUserByUsername(username);
    if (!user || !user.is_active) {
      await auth.audit(null, username, 'login_failed', null, { reason: 'user_not_found' }, req);
      return res.status(401).json({ ok: false, erro: 'usuário ou senha inválidos' });
    }
    const ok = await auth.verifyPassword(user.id, password);
    if (!ok) {
      await auth.audit(user.id, username, 'login_failed', null, { reason: 'bad_password' }, req);
      return res.status(401).json({ ok: false, erro: 'usuário ou senha inválidos' });
    }
    const sid = await auth.createSession(user.id, req);
    res.cookie(auth.SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: (process.env.ENVIRONMENT || 'test') === 'production',
      maxAge: auth.SESSION_TTL_HOURS * 3600 * 1000,
    });
    await auth.pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    await auth.audit(user.id, username, 'login', null, null, req);
    res.json({
      ok: true,
      user: { id: user.id, username: user.username, role: user.role, must_reset: user.must_reset },
    });
  } catch (err) {
    console.error('[auth] login error', err);
    res.status(500).json({ ok: false, erro: err.message });
  }
});

// Quem está logado
app.get('/api/auth/me', auth.requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// Admin: regenera tokens de 1º acesso (protegido por INTERNAL_API_KEY do tdf-ops)
app.post('/api/auth/admin/regen-tokens', async (req, res) => {
  const internalKey = req.headers['x-internal-key'];
  if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ ok: false, erro: 'unauthorized' });
  }
  try {
    const usernames = (req.body?.usernames || ['marcos', 'paulo', 'financeiro']);
    const crypto = require('crypto');
    const out = [];
    for (const username of usernames) {
      // invalida tokens anteriores
      await auth.pool.query(
        `UPDATE access_tokens SET used_at = NOW()
           WHERE user_id = (SELECT id FROM users WHERE username = $1)
             AND used_at IS NULL AND purpose = 'first_access'`,
        [username]
      );
      // gera novo
      const raw = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(raw).digest('hex');
      const ins = await auth.pool.query(
        `INSERT INTO access_tokens (user_id, token_hash, purpose, expires_at)
         VALUES (
           (SELECT id FROM users WHERE username = $1),
           $2, 'first_access', NOW() + INTERVAL '24 hours'
         )
         RETURNING expires_at`,
        [username, tokenHash]
      );
      out.push({
        username,
        token: raw,
        url: `/primeiro-acesso?token=${raw}`,
        expires_at: ins.rows[0].expires_at,
      });
      await auth.audit(null, username, 'admin_regen_token', null, { by: 'internal_key' }, req).catch(() => {});
    }
    res.json({ ok: true, tokens: out });
  } catch (err) {
    console.error('[auth] admin/regen-tokens error', err);
    res.status(500).json({ ok: false, erro: err.message });
  }
});

// Logout
app.post('/api/auth/logout', async (req, res) => {
  const sid = req.cookies?.[auth.SESSION_COOKIE];
  await auth.destroySession(sid).catch(() => {});
  res.clearCookie(auth.SESSION_COOKIE);
  if (req.user) {
    await auth.audit(req.user.id, req.user.username, 'logout', null, null, req).catch(() => {});
  }
  res.json({ ok: true });
});

// ====================================================================
// OMIE — wrapper com trava read-only (Etapa 1 / Parte 1)
// ====================================================================
// Qualquer método != GET é rejeitado pelo omieReadOnlyGuard.

app.get('/api/omie/clientes', auth.requireAuth, omieReadOnlyGuard, async (req, res) => {
  const empresa = req.query.empresa || 'Tudo de Filtro';
  try {
    const data = await omie.listarClientes(empresa);
    await auth.audit(req.user.id, req.user.username, 'omie_read', 'clientes', { empresa }, req).catch(() => {});
    res.json({ empresa, total: data.total_de_registros, dados: data });
  } catch (err) {
    res.status(500).json({ erro: err.message, empresa });
  }
});

// ====================================================================
// Compat — rotas de teste antigas (públicas por enquanto, viram /api/bi/* na Parte 2)
// ====================================================================

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

app.post('/api/pedido', async (req, res) => {
  const payload = req.body;
  console.log('[pedido] recebido:', JSON.stringify(payload));
  const result = await opsClient.createPedido(payload);
  res.json(result);
});

// helper declarado depois de usado (não atrapalha o boot)
function omieReadOnlyGuard(req, res, next) {
  const m = (req.method || 'GET').toUpperCase();
  if (m !== 'GET') {
    auth.audit(req.user?.id, req.user?.username, 'omie_write_blocked', req.originalUrl, { method: m }, req).catch(() => {});
    return res.status(405).json({ error: 'omie_readonly', message: 'OMIE é somente leitura neste portal' });
  }
  next();
}

// ------- Start -------

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  try {
    await initAuth();
  } catch (err) {
    console.error('[boot] falha ao inicializar auth/schema:', err.message);
    // não mata o processo — healthcheck ainda responde e Railway mostra o erro nos logs
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[tdf-portal] listening on port ${PORT}`);
    console.log(`[tdf-portal] ENVIRONMENT=${process.env.ENVIRONMENT || 'test'}`);
    console.log(`[tdf-portal] DRY_RUN=${omie.DRY_RUN}`);
    console.log(`[tdf-portal] TDF_OPS_URL=${process.env.TDF_OPS_URL}`);
    console.log(`[tdf-portal] empresas OMIE: ${Object.keys(omie.EMPRESAS).join(', ')}`);
  });
}
bootstrap();
