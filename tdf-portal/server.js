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
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const omie = require('./lib/omie');
const sync = require('./lib/sync');
const cron = require('./lib/cron');
const bi = require('./lib/bi');
const biFinanceiro = require('./lib/bi-financeiro');
const biBancos = require('./lib/bi-financeiro-bancos');
const biPagar = require('./lib/bi-financeiro-pagar');
const biReceber = require('./lib/bi-financeiro-receber');
const biFornecedores = require('./lib/bi-financeiro-fornecedores');
const biEstoque = require('./lib/bi-financeiro-estoque');
const opsClient = require('./lib/tdf-ops-client');
const auth = require('./lib/auth');
const { initAuth } = require('./lib/seed');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'paulo/layout');

// ========== BI FINANCEIRO — router isolado (clone do Paulo) ==========
// Routers específicos PRIMEIRO (são mais específicos que o catch-all do bi-financeiro.js)
app.use('/bi-financeiro/api', biBancos({ pool: auth.pool, requireAuth: auth.requireAuth }));
app.use('/bi-financeiro/api', biPagar({ pool: auth.pool, requireAuth: auth.requireAuth }));
app.use('/bi-financeiro/api', biReceber({ pool: auth.pool, requireAuth: auth.requireAuth }));
app.use('/bi-financeiro/api', biFornecedores({ pool: auth.pool, requireAuth: auth.requireAuth }));
app.use('/bi-financeiro/api', biEstoque({ pool: auth.pool, requireAuth: auth.requireAuth }));
// Router geral DEPOIS (tem catch-all que captura endpoints não implementados)
app.use('/bi-financeiro/api', biFinanceiro({ pool: auth.pool, requireAuth: auth.requireAuth }));

// Helper: renderiza views/auth com defaults garantidos (EJS não tem typeof safety)
function renderAuth(res, data) {
  const defaults = {
    title: '', subtitle: '',
    error: '', info: '',
    action: '/login',
    showToken: false, showUsername: false,
    tokenValue: '', passwordLabel: 'Senha',
    buttonLabel: 'Entrar',
    altHref: '', altText: '',
  };
  // Tela de login é standalone — não herda o layout paulo/* (que exige `user`).
  return res.status(data.status || 200).render('auth', { ...defaults, ...data, layout: false });
}
function renderAuthErr(res, status, data) {
  return renderAuth(res, { ...data, status });
}

// ------- Páginas -------
// (a rota / está definida abaixo em TELAS — redireciona para /login ou /admin)

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
// TELAS (Parte 2) — login, primeiro-acesso, admin
// ====================================================================

// Página inicial redireciona: logado → /admin, não-logado → /login
app.get('/', (req, res) => {
  const sid = req.cookies?.[auth.SESSION_COOKIE];
  auth.getSession(sid).then((s) => {
    if (s) return res.redirect('/admin');
    res.redirect('/login');
  }).catch(() => res.redirect('/login'));
});

// Tela de primeiro acesso (com token na URL)
app.get('/primeiro-acesso', async (req, res) => {
  const token = req.query.token || '';
  // Se já tiver token válido na URL, pré-valida
  let info = 'Abra o link que você recebeu por e-mail ou cole aqui o token de 1º acesso.';
  if (token) {
    const r = await auth.consumeAccessToken(token, 'first_access').catch(() => ({ ok: false }));
    if (r.ok) {
      info = `Olá, ${r.username}! Defina sua nova senha (mínimo 8 caracteres).`;
    } else {
      return renderAuthErr(res, 400, {
        title: 'Token inválido',
        subtitle: '',
        error: `Este token não pôde ser usado: ${r.reason}. Solicite um novo ao administrador.`,
        action: '/primeiro-acesso',
        showToken: false,
        showUsername: false,
        tokenValue: '',
        passwordLabel: '',
        buttonLabel: 'Voltar',
        altHref: '',
        altText: '',
        info: '',
      });
    }
  }
  renderAuth(res, {
    title: 'Primeiro acesso',
    subtitle: 'Defina sua senha para começar a usar o portal.',
    info,
    action: '/primeiro-acesso',
    showToken: true,
    showUsername: false,
    tokenValue: token,
    buttonLabel: 'Criar senha',
    passwordLabel: 'Nova senha',
    altText: 'Já tem uma conta?',
    altHref: '/login',
  });
});

// POST do primeiro acesso
app.post('/primeiro-acesso', async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return renderAuthErr(res, 400, {
      title: 'Primeiro acesso',
      subtitle: '',
      error: 'Token e senha são obrigatórios.',
      action: '/primeiro-acesso',
      showToken: true,
      buttonLabel: 'Criar senha',
    });
  }
  if (password.length < 8) {
    return renderAuthErr(res, 400, {
      title: 'Primeiro acesso',
      subtitle: '',
      error: 'A senha deve ter no mínimo 8 caracteres.',
      action: '/primeiro-acesso',
      showToken: true,
      tokenValue: token,
      buttonLabel: 'Criar senha',
    });
  }
  try {
    const r = await auth.consumeAccessToken(token, 'first_access');
    if (!r.ok) {
      return renderAuthErr(res, 400, {
        title: 'Token inválido',
        subtitle: '',
        error: `Este token não pôde ser usado: ${r.reason}. Solicite um novo ao administrador.`,
        action: '/primeiro-acesso',
        showToken: false,
        showUsername: false,
        tokenValue: '',
        passwordLabel: '',
        buttonLabel: 'Voltar',
        altHref: '',
        altText: '',
        info: '',
      });
    }
    await auth.setPassword(r.user_id, password);
    await auth.markTokenUsed((await auth.pool.query(
      `SELECT id FROM access_tokens WHERE user_id = $1 AND purpose = 'first_access' AND used_at IS NULL ORDER BY id DESC LIMIT 1`,
      [r.user_id]
    )).rows[0]?.id);
    await auth.audit(r.user_id, r.username, 'first_access_done', null, null, req);
    const sid = await auth.createSession(r.user_id, req);
    res.cookie(auth.SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: (process.env.ENVIRONMENT || 'test') === 'production',
      maxAge: auth.SESSION_TTL_HOURS * 3600 * 1000,
    });
    res.redirect('/admin');
  } catch (err) {
    console.error('[auth] first-access error', err);
    renderAuthErr(res, 500, {
      title: 'Erro',
      subtitle: '',
      error: err.message,
      action: '/primeiro-acesso',
      showToken: true,
      buttonLabel: 'Tentar de novo',
    });
  }
});

// Tela de login
app.get('/login', (req, res) => {
  const sid = req.cookies?.[auth.SESSION_COOKIE];
  auth.getSession(sid).then((s) => {
    if (s) return res.redirect('/admin');
    renderAuth(res, {
      title: 'Login',
      subtitle: 'Entre com seu usuário e senha do TDF Portal.',
      action: '/login',
      showUsername: true,
      passwordLabel: 'Senha',
      buttonLabel: 'Entrar',
      altText: 'Primeiro acesso?',
      altHref: '/primeiro-acesso',
    });
  }).catch(() => {
    renderAuth(res, {
      title: 'Login',
      subtitle: 'Entre com seu usuário e senha do TDF Portal.',
      action: '/login',
      showUsername: true,
      passwordLabel: 'Senha',
      buttonLabel: 'Entrar',
      altText: 'Primeiro acesso?',
      altHref: '/primeiro-acesso',
    });
  });
});

// POST do login
app.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return renderAuthErr(res, 400, {
      title: 'Login',
      subtitle: '',
      error: 'Usuário e senha são obrigatórios.',
      action: '/login',
      showUsername: true,
      buttonLabel: 'Entrar',
    });
  }
  try {
    const user = await auth.findUserByUsername(username);
    if (!user || !user.is_active) {
      await auth.audit(null, username, 'login_failed', null, { reason: 'user_not_found' }, req);
      return renderAuthErr(res, 401, {
        title: 'Login',
        subtitle: '',
        error: 'Usuário ou senha inválidos.',
        action: '/login',
        showUsername: true,
        buttonLabel: 'Entrar',
      });
    }
    const ok = await auth.verifyPassword(user.id, password);
    if (!ok) {
      await auth.audit(user.id, username, 'login_failed', null, { reason: 'bad_password' }, req);
      return renderAuthErr(res, 401, {
        title: 'Login',
        subtitle: '',
        error: 'Usuário ou senha inválidos.',
        action: '/login',
        showUsername: true,
        buttonLabel: 'Entrar',
      });
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
    res.redirect('/admin');
  } catch (err) {
    console.error('[auth] login error', err);
    renderAuthErr(res, 500, {
      title: 'Login',
      subtitle: '',
      error: err.message,
      action: '/login',
      showUsername: true,
      buttonLabel: 'Entrar',
    });
  }
});

// Logout (POST no /admin)
app.post('/logout', async (req, res) => {
  const sid = req.cookies?.[auth.SESSION_COOKIE];
  await auth.destroySession(sid).catch(() => {});
  res.clearCookie(auth.SESSION_COOKIE);
  if (req.user) {
    await auth.audit(req.user.id, req.user.username, 'logout', null, null, req).catch(() => {});
  }
  res.redirect('/login');
});

// Admin (protegido)
app.get('/admin', auth.requireAuth, (req, res) => {
  res.render('admin', {
    user: req.user,
    env: process.env.ENVIRONMENT || 'test',
  });
});

// ====================================================================
// PORTAL DO PAULO — visual idêntico, integrado no Portal 2
// ====================================================================

// Redirect /paulo -> /paulo/home
app.get('/paulo', auth.requireAuth, (req, res) => res.redirect('/paulo/home'));

// Home do Paulo
app.get('/paulo/home', auth.requireAuth, (req, res) => {
  res.render('paulo/home', {
    user: req.user,
    activePage: 'home',
    pageTitle: 'Home',
  });
});

// Cockpit / Painel
app.get('/paulo/cockpit', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'cockpit',
    pageTitle: 'Painel',
    emBreve: true,
    descricao: 'Acompanhe suas métricas de vendas e Conversões em tempo real.',
  });
});

// Minhas Metas
app.get('/paulo/minhas-metas', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'minhas-metas',
    pageTitle: 'Minhas Metas',
    emBreve: true,
    descricao: 'Suas metas pessoais de vendas e faturamento.',
  });
});

// CRM / Manutenção
app.get('/paulo/manutencao', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'manutencao',
    pageTitle: 'CRM',
    emBreve: true,
    descricao: 'Gestão de clientes e deals — em breve com integração Zoho/Closy.',
  });
});

// Funis Closy
app.get('/paulo/closy', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'closy',
    pageTitle: 'Funis Closy',
    emBreve: true,
    descricao: 'Pipeline de vendas Closy — em breve.',
  });
});

// Gestão
app.get('/paulo/gestao', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'gestao',
    pageTitle: 'Gestor (geral)',
    emBreve: true,
    descricao: 'KPIs e gestão de resultados — em breve.',
  });
});

// Gestão Closy KPIs
app.get('/paulo/gestao-closy', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'gestao-closy',
    pageTitle: 'Gestão Closy (KPIs)',
    emBreve: true,
    descricao: 'Indicadores de performance do time — em breve.',
  });
});

// Onboarding
app.get('/paulo/onboarding', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'onboarding',
    pageTitle: 'Onboarding',
    emBreve: true,
    descricao: 'Primeiros passos na TDF — bem-vindo!',
  });
});

// Playbook
app.get('/paulo/playbook', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'playbook',
    pageTitle: 'Playbook',
    emBreve: true,
    descricao: 'Melhores práticas de vendas e atendimento.',
  });
});

// Treinamento
app.get('/paulo/treinamento', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'treinamento',
    pageTitle: 'Treinamento',
    emBreve: true,
    descricao: 'Cursos e treinamentos da Escola TDF.',
  });
});

// Produtos
app.get('/paulo/produtos', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'produtos',
    pageTitle: 'Produtos',
    emBreve: true,
    descricao: 'Catálogo completo de produtos TDF.',
  });
});

// Ferramentas
app.get('/paulo/ferramentas', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'ferramentas',
    pageTitle: 'Ferramentas',
    emBreve: true,
    descricao: 'Gerador de propostas, calculadoras e mais.',
  });
});

// IA
app.get('/paulo/ia', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'ia',
    pageTitle: 'IA Consulta',
    emBreve: true,
    descricao: 'Consultas inteligentes com IA.',
  });
});

// Conquistas
app.get('/paulo/conquistas', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'conquistas',
    pageTitle: 'Conquistas',
    emBreve: true,
    descricao: 'Suas conquistas e medalhas.',
  });
});

// Corrida
app.get('/paulo/corrida', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'corrida',
    pageTitle: 'Corrida',
    emBreve: true,
    descricao: 'Ranking de vendas — corrida do mês.',
  });
});

// Meu Perfil
app.get('/paulo/meu-perfil', auth.requireAuth, (req, res) => {
  res.render('paulo/page', {
    user: req.user,
    activePage: 'meu-perfil',
    pageTitle: 'Meu Perfil',
    emBreve: true,
    descricao: 'Suas informações e preferências.',
  });
});

// Admin Sistema
app.get('/paulo/admin', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('paulo/page', {
    user: req.user,
    activePage: 'admin',
    pageTitle: 'Admin Sistema',
    emBreve: true,
    descricao: 'Configurações avançadas do sistema.',
  });
});

// ====================================================================
// VIEWS IMPORTADAS DO PORTAL DO PAULO (views copiadas)
// ====================================================================

// Cockpit — painel de métricas (requer Zoho/Closy para dados reais)
app.get('/cockpit', auth.requireAuth, (req, res) => {
  res.render('cockpit', {
    user: req.user,
    isAdmin: req.user.role === 'admin',
    closers: [],   // preenchido via API Zoho/Closy
    metas: {},     // preenchido via API
  });
});

// Playbook — scripts e processos de venda
app.get('/playbook', auth.requireAuth, (req, res) => {
  res.render('playbook', { user: req.user, isAdmin: req.user.role === 'admin' });
});

// Operacional — mapa de OS, GIR, POS
app.get('/operacional', auth.requireAuth, (req, res) => {
  res.render('operacional', { user: req.user, isAdmin: req.user.role === 'admin' });
});

// Treinamento — Escola TDF
app.get('/treinamento', auth.requireAuth, (req, res) => {
  res.render('treinamento-index', { user: req.user, isAdmin: req.user.role === 'admin' });
});
app.get('/treinamento/:page', auth.requireAuth, (req, res) => {
  res.render('treinamento/' + req.params.page, { user: req.user, isAdmin: req.user.role === 'admin' });
});

// Produtos — catálogo
app.get('/produtos', auth.requireAuth, (req, res) => {
  res.render('produtos', { user: req.user, isAdmin: req.user.role === 'admin' });
});

// Admin — área técnica / conectores / acessos
app.get('/admin/conectores', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-conectores', { user: req.user, isAdmin: true });
});
app.get('/admin/acessos', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-acessos', { user: req.user, isAdmin: true });
});
app.get('/admin/cidades', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-cidades', { user: req.user, isAdmin: true });
});
app.get('/admin/goto', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-goto', { user: req.user, isAdmin: true });
});

// Admin — Metas
app.get('/admin/metas-closer', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-metas-closer', { user: req.user, isAdmin: true });
});
app.get('/admin/metas-time', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-metas-time-produto', { user: req.user, isAdmin: true });
});

// Admin — Score Leads
app.get('/admin/score-leads', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads', { user: req.user, isAdmin: true });
});
app.get('/admin/score-leads/auditoria', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads-auditoria', { user: req.user, isAdmin: true });
});
app.get('/admin/score-leads/distribuicao', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads-distribuicao', { user: req.user, isAdmin: true });
});
app.get('/admin/score-leads/redistribuir', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads-redistribuir', { user: req.user, isAdmin: true });
});
app.get('/admin/score-leads/atrasos', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads-atrasos', { user: req.user, isAdmin: true });
});
app.get('/admin/score-leads/overrides', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads-overrides', { user: req.user, isAdmin: true });
});
app.get('/admin/score-leads/cadencia', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads-cadencia', { user: req.user, isAdmin: true });
});
app.get('/admin/score-leads/distancia', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads-distancia', { user: req.user, isAdmin: true });
});
app.get('/admin/score-leads/teste', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-score-leads-teste', { user: req.user, isAdmin: true });
});

// Admin — Squads, WhatsApp, Score geral
app.get('/admin/squads', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-squads', { user: req.user, isAdmin: true });
});
app.get('/admin/whatsapp', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin-whatsapp', { user: req.user, isAdmin: true });
});
app.get('/admin/score', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('admin', { user: req.user, isAdmin: true });
});

// Auditoria CRM
app.get('/auditoria', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('auditoria-crm', { user: req.user, isAdmin: true });
});
app.get('/auditoria/distribuicao', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('auditoria-crm-distribuicao', { user: req.user, isAdmin: true });
});
app.get('/auditoria/influencia-ia', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('auditoria-crm-influencia-ia', { user: req.user, isAdmin: true });
});
app.get('/auditoria/sistemica', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('auditoria-crm-sistemica', { user: req.user, isAdmin: true });
});
app.get('/auditoria/vendedores', auth.requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Acesso negado');
  res.render('auditoria-crm-vendedores', { user: req.user, isAdmin: true });
});

// Analytics SDR
app.get('/analytics/sdr', auth.requireAuth, (req, res) => {
  res.render('analytics-sdr', { user: req.user, isAdmin: req.user.role === 'admin' });
});

// Closy e Auvo (requer integração API)
app.get('/closy', auth.requireAuth, (req, res) => {
  res.render('closy', { user: req.user, isAdmin: req.user.role === 'admin' });
});
app.get('/closy/custom-fields', auth.requireAuth, (req, res) => {
  res.render('closy-custom-fields', { user: req.user, isAdmin: req.user.role === 'admin' });
});
app.get('/auvo', auth.requireAuth, (req, res) => {
  res.render('auvo', { user: req.user, isAdmin: req.user.role === 'admin' });
});

// Área técnica
app.get('/area-tecnica', auth.requireAuth, (req, res) => {
  res.render('area-tecnica', { user: req.user, isAdmin: req.user.role === 'admin' });
});

// BI Financeiro
app.get('/bi/financeiro', auth.requireAuth, (req, res) => {
  // bi-financeiro.ejs declara layout próprio via <% const layout = 'paulo/layout' %>
  res.render('bi-financeiro', { user: req.user, isAdmin: req.user.role === 'admin' });
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

    // ====================================================================
    // BI — Etapa 2 / Parte 1 (diagnóstico)
    // ====================================================================

    // Diagnóstico do schema BI: mostra tabelas e contagem de registros
    app.get('/api/bi/status', auth.requireAuth, async (req, res) => {
      try {
        const tabelas = [
          'empresas', 'clientes', 'contas_pagar', 'contas_receber',
          'movimentos', 'contas_bancarias', 'categorias',
          'nf_entrada', 'fornecedores', 'sync_log'
        ];
        const out = {};
        for (const t of tabelas) {
          try {
            const r = await auth.pool.query(`SELECT COUNT(*)::int AS total FROM ${t}`);
            out[t] = r.rows[0].total;
          } catch (e) {
            out[t] = `ERRO: ${e.message.slice(0, 100)}`;
          }
        }
        const emp = await auth.pool.query(`SELECT id, nome, ativo, created_at FROM empresas ORDER BY id`);
        const lastSync = await auth.pool.query(
          `SELECT sl.id, e.nome AS empresa, sl.started_at, sl.finished_at, sl.status,
                  sl.total_db AS registros_processados, sl.duration_ms, sl.triggered_by, sl.error_msg AS error_message
             FROM sync_log sl
             JOIN empresas e ON e.id = sl.empresa_id
             ORDER BY sl.started_at DESC LIMIT 10`
        );
        res.json({
          ok: true,
          user: req.user.username,
          tabelas: out,
          empresas: emp.rows,
          ultimos_syncs: lastSync.rows,
        });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    // Dispara sync manual (autenticado). Se empresa_id fornecido, sincroniza só ela.
    // Aceita ?empresa_id=N. Default: todas.
    // Aceita ?dry=1 para forçar uso de mocks (validação visual sem tocar OMIE real).
    app.post('/api/bi/admin/sync', auth.requireAuth, async (req, res) => {
      try {
        const empresaId = req.query.empresa_id ? parseInt(req.query.empresa_id, 10) : null;
        const forceDry = req.query.dry === '1' || req.query.dry === 'true';
        const flag = forceDry ? ' [DRY FORÇADO]' : '';
        console.log(`[sync] manual solicitado por ${req.user.username}${empresaId ? ` (empresa=${empresaId})` : ' (todas)'}${flag}`);
        const results = empresaId
          ? [await sync.syncOne(empresaId, 'manual:' + req.user.username, forceDry)]
          : await sync.syncAll('manual:' + req.user.username, forceDry);
        const status = await sync.getStatus();
        res.json({ ok: true, results, status });
      } catch (err) {
        console.error('[sync] erro:', err);
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    // Lista os últimos N syncs (autenticado)
    app.get('/api/bi/admin/sync/log', auth.requireAuth, async (req, res) => {
      try {
        const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
        const { rows } = await auth.pool.query(
          `SELECT sl.id, sl.empresa_id, e.nome AS empresa, sl.started_at, sl.finished_at, sl.status,
                  sl.total_db AS registros_processados, sl.duration_ms, sl.triggered_by, sl.error_msg AS error_message
             FROM sync_log sl
             JOIN empresas e ON e.id = sl.empresa_id
             ORDER BY sl.started_at DESC
             LIMIT $1`,
          [limit]
        );
        res.json({ ok: true, total: rows.length, syncs: rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    // Status do cron (autenticado)
    app.get('/api/bi/admin/cron/status', auth.requireAuth, async (req, res) => {
      try {
        const c = cron.status();
        // Pega também o último sync automático do log
        const { rows } = await auth.pool.query(
          `SELECT sl.id, e.nome AS empresa, sl.started_at, sl.finished_at, sl.status, sl.total_db, sl.duration_ms
             FROM sync_log sl JOIN empresas e ON e.id = sl.empresa_id
            WHERE sl.triggered_by LIKE 'cron:%'
            ORDER BY sl.started_at DESC LIMIT 10`
        );
        res.json({ ok: true, cron: c, ultimos_cron_syncs: rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    // Disparo manual do cron (força uma execução imediata)
    app.post('/api/bi/admin/cron/trigger', auth.requireAuth, async (req, res) => {
      try {
        console.log(`[cron] trigger manual solicitado por ${req.user.username}`);
        // Roda em background pra não segurar a request; retorna ack imediato
        cron.tick('manual-trigger').catch(err => console.error('[cron] erro no trigger:', err));
        res.json({ ok: true, mensagem: 'Cron disparado em background. Aguarde ~30s e veja o status.' });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    // Liga/desliga o cron (autenticado)
    app.post('/api/bi/admin/cron/toggle', auth.requireAuth, async (req, res) => {
      try {
        const acao = req.query.acao; // 'start' ou 'stop'
        if (acao === 'start') {
          const r = cron.start();
          res.json({ ok: true, acao: 'start', resultado: r });
        } else if (acao === 'stop') {
          const r = cron.stop();
          res.json({ ok: true, acao: 'stop', resultado: r });
        } else {
          res.status(400).json({ ok: false, erro: 'acao deve ser "start" ou "stop"' });
        }
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    // ========== ETAPA 3 — BI FINANCEIRO ==========
    // Dashboard principal (autenticado). Lê do Postgres (cache local).
    app.get('/bi/dashboard', auth.requireAuth, async (req, res) => {
      try {
        const empresas = (await auth.pool.query(`SELECT id, nome FROM empresas WHERE ativo = true ORDER BY id`)).rows;
        res.render('bi/dashboard', { user: req.user, empresas });
      } catch (err) {
        res.status(500).send('Erro ao carregar BI: ' + err.message);
      }
    });

    // Listagens BI — 7 abas interativas
    app.get('/bi/lista', auth.requireAuth, async (req, res) => {
      try {
        const empresas = (await auth.pool.query(`SELECT id, nome FROM empresas WHERE ativo = true ORDER BY id`)).rows;
        res.render('bi/lista', { user: req.user, empresas });
      } catch (err) {
        res.status(500).send('Erro ao carregar listagens: ' + err.message);
      }
    });

    // API: KPIs do dashboard (autenticado). Filtro: ?empresa=1,2,3
    app.get('/api/bi/dashboard/kpis', auth.requireAuth, async (req, res) => {
      try {
        const empresaIds = bi.parseEmpresas(req);
        const kpis = await bi.dashboardKpis(empresaIds);
        const topDespesas = await bi.topCategorias('despesa', empresaIds, 5);
        const topReceitas = await bi.topCategorias('receita', empresaIds, 5);
        const porEmp = await bi.porEmpresa();
        res.json({ ok: true, kpis, top_despesas: topDespesas, top_receitas: topReceitas, por_empresa: porEmp });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    // API: listagens (autenticadas)
    app.get('/api/bi/contas-pagar', auth.requireAuth, async (req, res) => {
      try {
        const empresaIds = bi.parseEmpresas(req);
        const status = req.query.status || 'todos';
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 1000);
        const rows = await bi.listContasPagar({ status, limit, empresa_ids: empresaIds });
        res.json({ ok: true, total: rows.length, rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    app.get('/api/bi/contas-receber', auth.requireAuth, async (req, res) => {
      try {
        const empresaIds = bi.parseEmpresas(req);
        const status = req.query.status || 'todos';
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 1000);
        const rows = await bi.listContasReceber({ status, limit, empresa_ids: empresaIds });
        res.json({ ok: true, total: rows.length, rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    app.get('/api/bi/movimentos', auth.requireAuth, async (req, res) => {
      try {
        const empresaIds = bi.parseEmpresas(req);
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 1000);
        const rows = await bi.listMovimentos({ limit, empresa_ids: empresaIds });
        res.json({ ok: true, total: rows.length, rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    app.get('/api/bi/contas-bancarias', auth.requireAuth, async (req, res) => {
      try {
        const empresaIds = bi.parseEmpresas(req);
        const rows = await bi.listContasBancarias(empresaIds);
        res.json({ ok: true, total: rows.length, rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    app.get('/api/bi/nf-entrada', auth.requireAuth, async (req, res) => {
      try {
        const empresaIds = bi.parseEmpresas(req);
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 1000);
        const rows = await bi.listNfEntrada({ limit, empresa_ids: empresaIds });
        res.json({ ok: true, total: rows.length, rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    app.get('/api/bi/fornecedores', auth.requireAuth, async (req, res) => {
      try {
        const empresaIds = bi.parseEmpresas(req);
        const rows = await bi.listFornecedores(empresaIds);
        res.json({ ok: true, total: rows.length, rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    app.get('/api/bi/categorias', auth.requireAuth, async (req, res) => {
      try {
        const empresaIds = bi.parseEmpresas(req);
        const rows = await bi.listCategorias(empresaIds);
        res.json({ ok: true, total: rows.length, rows });
      } catch (err) {
        res.status(500).json({ ok: false, erro: err.message });
      }
    });

    // ========== ADMIN — Gestão de Usuários e Metas ==========
    const isAdmin = req => req.user && (req.user.role === 'admin');

    // GET /gestao/usuarios — lista todos (visualizar: qualquer auth; editar: admin)
    app.get('/gestao/usuarios', auth.requireAuth, async (req, res) => {
      if (!isAdmin(req)) return res.status(403).json({ error: 'admin only' });
      try {
        const { rows } = await auth.pool.query(
          `SELECT id, username, email, full_name, role, portal_team, crm_owner,
                  meta_vendas, meta_faturamento, is_active, created_at
             FROM users ORDER BY username`
        );
        res.json({ ok: true, usuarios: rows });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // POST /gestao/usuarios — criar novo
    app.post('/gestao/usuarios', auth.requireAuth, async (req, res) => {
      if (!isAdmin(req)) return res.status(403).json({ error: 'admin only' });
      const { username, password, name, email, role, crmOwner, team } = req.body || {};
      if (!username || !name) return res.status(400).json({ error: 'username e nome são obrigatórios' });
      if (!['admin','financeiro','viewer'].includes(role)) return res.status(400).json({ error: 'role inválido' });
      try {
        // cria com must_reset=TRUE (força troca de senha)
        const { rows } = await auth.pool.query(
          `INSERT INTO users (username, full_name, email, role, portal_team, crm_owner,
                              password_hash, must_reset, is_active)
           VALUES ($1,$2,$3,$4,$5,$6, NULL, true, true)
           ON CONFLICT (username) DO UPDATE SET full_name=EXCLUDED.full_name,
               email=EXCLUDED.email, role=EXCLUDED.role, portal_team=EXCLUDED.portal_team,
               crm_owner=EXCLUDED.crm_owner RETURNING id, username`,
          [username, name, email || '', role, team || 'filtro', crmOwner || name]
        );
        // emite token de 1º acesso
        const { rows: tk } = await auth.pool.query(
          `INSERT INTO access_tokens (user_id, token_hash, purpose, expires_at)
           VALUES ($1, encode(sha256(random()::bytea),'hex'), 'first_access',
                   NOW() + INTERVAL '7 days') RETURNING id`,
          [rows[0].id]
        );
        res.json({ ok: true, username, needs_password: true,
                   reset_url: `/primeiro-acesso?token=${tk[0].id}` });
      } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'username já existe' });
        res.status(500).json({ error: err.message });
      }
    });

    // PUT /gestao/usuarios/:username — editar
    app.put('/gestao/usuarios/:username', auth.requireAuth, async (req, res) => {
      if (!isAdmin(req)) return res.status(403).json({ error: 'admin only' });
      const u = req.params.username;
      const { name, email, role, team, crmOwner, active, metaVendas, metaFaturamento } = req.body || {};
      try {
        const sets = [], vals = [], idx = [];
        let p = 1;
        if (name !== undefined)        { sets.push(`full_name = $${p++}`); vals.push(name); }
        if (email !== undefined)        { sets.push(`email = $${p++}`); vals.push(email); }
        if (role && ['admin','financeiro','viewer'].includes(role)) { sets.push(`role = $${p++}`); vals.push(role); }
        if (team !== undefined)        { sets.push(`portal_team = $${p++}`); vals.push(team); }
        if (crmOwner !== undefined)   { sets.push(`crm_owner = $${p++}`); vals.push(crmOwner); }
        if (active !== undefined)      { sets.push(`is_active = $${p++}`); vals.push(active); }
        if (metaVendas !== undefined)  { sets.push(`meta_vendas = $${p++}`); vals.push(metaVendas); }
        if (metaFaturamento !== undefined) { sets.push(`meta_faturamento = $${p++}`); vals.push(metaFaturamento); }
        if (!sets.length) return res.status(400).json({ error: 'nenhum campo para atualizar' });
        vals.push(u);
        await auth.pool.query(
          `UPDATE users SET ${sets.join(', ')} WHERE username = $${p}`, vals
        );
        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // DELETE /gestao/usuarios/:username
    app.delete('/gestao/usuarios/:username', auth.requireAuth, async (req, res) => {
      if (!isAdmin(req)) return res.status(403).json({ error: 'admin only' });
      if (req.params.username === req.user.username) return res.status(400).json({ error: 'não deletar você mesmo' });
      try {
        await auth.pool.query(`DELETE FROM users WHERE username = $1`, [req.params.username]);
        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET /gestao/metas
    app.get('/gestao/metas', auth.requireAuth, async (req, res) => {
      if (!isAdmin(req)) return res.status(403).json({ error: 'admin only' });
      try {
        const { rows } = await auth.pool.query(
          `SELECT username, full_name AS name, role, portal_team, crm_owner,
                  meta_vendas, meta_faturamento
             FROM users
            WHERE role IN ('viewer','admin','financeiro')
            ORDER BY portal_team, username`
        );
        const lojaRow = await auth.pool.query(
          `SELECT meta_loja FROM users WHERE username = 'marcos' LIMIT 1`
        );
        const refilRow = await auth.pool.query(
          `SELECT meta_refil FROM users WHERE username = 'marcos' LIMIT 1`
        );
        res.json({
          ok: true,
          closers: rows,
          metaLoja: { faturamento: lojaRow.rows[0]?.meta_loja || 80000 },
          metaRefil: { faturamento: refilRow.rows[0]?.meta_refil || 15000 },
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // POST /gestao/metas
    app.post('/gestao/metas', auth.requireAuth, async (req, res) => {
      if (!isAdmin(req)) return res.status(403).json({ error: 'admin only' });
      const { crmOwner, vendas, faturamento, _loja, _refil } = req.body || {};
      try {
        if (_loja !== undefined) {
          await auth.pool.query(`UPDATE users SET meta_loja = $1 WHERE username = 'marcos'`, [_loja]);
          return res.json({ ok: true, target: 'loja' });
        }
        if (_refil !== undefined) {
          await auth.pool.query(`UPDATE users SET meta_refil = $1 WHERE username = 'marcos'`, [_refil]);
          return res.json({ ok: true, target: 'refil' });
        }
        if (!crmOwner) return res.status(400).json({ error: 'crmOwner obrigatório' });
        await auth.pool.query(
          `UPDATE users SET meta_vendas = $1, meta_faturamento = $2 WHERE crm_owner = $3`,
          [parseInt(vendas)||0, parseFloat(faturamento)||0, crmOwner]
        );
        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
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

// Admin: define senha direta (sem token) — usado pra bootstrap inicial
app.post('/api/auth/admin/set-password', async (req, res) => {
  const internalKey = req.headers['x-internal-key'];
  if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ ok: false, erro: 'unauthorized' });
  }
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, erro: 'username e password são obrigatórios' });
  }
  if (password.length < 8) {
    return res.status(400).json({ ok: false, erro: 'senha deve ter no mínimo 8 caracteres' });
  }
  try {
    const user = await auth.findUserByUsername(username);
    if (!user) return res.status(404).json({ ok: false, erro: `usuário ${username} não existe` });
    await auth.setPassword(user.id, password);
    await auth.audit(null, username, 'admin_set_password', null, { by: 'internal_key' }, req).catch(() => {});
    // também invalida tokens pendentes do user (pra não confundir)
    await auth.pool.query(
      `UPDATE access_tokens SET used_at = NOW()
         WHERE user_id = $1 AND used_at IS NULL`,
      [user.id]
    );
    res.json({ ok: true, username, must_reset: false });
  } catch (err) {
    console.error('[auth] admin/set-password error', err);
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
    // Inicia o cron de sync OMIE → Postgres
    cron.start();
  });
}
bootstrap();
