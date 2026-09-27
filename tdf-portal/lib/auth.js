// lib/auth.js — Etapa 1: autenticação com bcrypt + sessão em cookie
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
});

const SESSION_COOKIE = 'tdf_sid';
const SESSION_TTL_HOURS = 12;
const RESET_TOKEN_TTL_HOURS = 24;

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function genToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ----- USERS -----
async function findUserByUsername(username) {
  const { rows } = await pool.query(
    'SELECT id, username, email, full_name, role, password_hash, must_reset, is_active FROM users WHERE username = $1',
    [username]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const { rows } = await pool.query(
    'SELECT id, username, email, full_name, role, password_hash, must_reset, is_active FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function createUser({ username, email, full_name, role, notes }) {
  const { rows } = await pool.query(
    `INSERT INTO users (username, email, full_name, role, must_reset, notes)
     VALUES ($1, $2, $3, $4, TRUE, $5)
     RETURNING id, username, email, full_name, role, must_reset`,
    [username, email || null, full_name || null, role, notes || null]
  );
  return rows[0];
}

// ----- TOKENS DE 1º ACESSO / RESET -----
async function issueAccessToken(userId, purpose = 'first_access') {
  const raw = genToken();
  const tokenHash = sha256(raw);
  const ttl = `${RESET_TOKEN_TTL_HOURS} hours`;
  const { rows } = await pool.query(
    `INSERT INTO access_tokens (user_id, token_hash, purpose, expires_at)
     VALUES ($1, $2, $3, NOW() + $4::interval)
     RETURNING id, expires_at`,
    [userId, tokenHash, purpose, ttl]
  );
  return { token: raw, id: rows[0].id, expires_at: rows[0].expires_at };
}

async function consumeAccessToken(rawToken, purpose) {
  const tokenHash = sha256(rawToken);
  const { rows } = await pool.query(
    `SELECT at.id, at.user_id, at.expires_at, at.used_at,
            u.username, u.must_reset, u.is_active
       FROM access_tokens at
       JOIN users u ON u.id = at.user_id
      WHERE at.token_hash = $1
        AND at.purpose = $2`,
    [tokenHash, purpose]
  );
  if (!rows[0]) return { ok: false, reason: 'invalid' };
  const t = rows[0];
  if (t.used_at) return { ok: false, reason: 'already_used' };
  if (new Date(t.expires_at) < new Date()) return { ok: false, reason: 'expired' };
  if (!t.is_active) return { ok: false, reason: 'user_disabled' };
  return { ok: true, user_id: t.user_id, username: t.username };
}

async function markTokenUsed(tokenId) {
  await pool.query('UPDATE access_tokens SET used_at = NOW() WHERE id = $1', [tokenId]);
}

// ----- PASSWORD -----
async function setPassword(userId, newPassword) {
  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query(
    'UPDATE users SET password_hash = $1, must_reset = FALSE WHERE id = $2',
    [hash, userId]
  );
}

async function verifyPassword(userId, plain) {
  const u = await findUserById(userId);
  if (!u || !u.password_hash) return false;
  return bcrypt.compare(plain, u.password_hash);
}

// ----- SESSIONS -----
async function createSession(userId, req) {
  const sid = genToken();
  const ttlHours = SESSION_TTL_HOURS;
  const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().slice(0, 45);
  const ua = (req.headers['user-agent'] || '').slice(0, 500);
  await pool.query(
    `INSERT INTO sessions (id, user_id, expires_at, ip, user_agent)
     VALUES ($1, $2, NOW() + ($3 || ' hours')::interval, $4, $5)`,
    [sid, userId, String(ttlHours), ip, ua]
  );
  return sid;
}

async function getSession(sid) {
  if (!sid) return null;
  const { rows } = await pool.query(
    `SELECT s.id, s.user_id, s.expires_at,
            u.username, u.role, u.must_reset, u.is_active
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.id = $1`,
    [sid]
  );
  if (!rows[0]) return null;
  const s = rows[0];
  if (new Date(s.expires_at) < new Date()) return null;
  if (!s.is_active) return null;
  // touch last_seen_at (best-effort, não bloqueia)
  pool.query('UPDATE sessions SET last_seen_at = NOW() WHERE id = $1', [sid]).catch(() => {});
  return s;
}

async function destroySession(sid) {
  if (!sid) return;
  await pool.query('DELETE FROM sessions WHERE id = $1', [sid]);
}

// ----- AUDIT -----
async function audit(userId, username, action, target, meta, req) {
  const ip = (req?.headers?.['x-forwarded-for'] || req?.ip || '').toString().slice(0, 45);
  await pool.query(
    `INSERT INTO audit_log (user_id, username, action, target, meta, ip)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
    [userId || null, username || null, action, target || null, JSON.stringify(meta || {}), ip]
  );
}

// ----- EXPRESS MIDDLEWARES -----
function requireAuth(req, res, next) {
  const sid = req.cookies?.[SESSION_COOKIE] || req.signedCookies?.[SESSION_COOKIE];
  getSession(sid).then((session) => {
    if (!session) {
      return res.status(401).json({ error: 'auth_required' });
    }
    req.session = session;
    req.user = {
      id: session.user_id,
      username: session.username,
      role: session.role,
      must_reset: session.must_reset,
    };
    next();
  }).catch((err) => {
    console.error('[auth] session lookup error', err);
    res.status(500).json({ error: 'auth_error' });
  });
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'auth_required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden', required_roles: roles });
    }
    next();
  };
}

// Bloqueia escrita na OMIE — exige GET e valida método no wrapper OMIE
function omieReadOnlyGuard(req, res, next) {
  const m = (req.method || 'GET').toUpperCase();
  if (m !== 'GET') {
    audit(req.user?.id, req.user?.username, 'omie_write_blocked', req.originalUrl, { method: m }, req).catch(() => {});
    return res.status(405).json({ error: 'omie_readonly', message: 'OMIE é somente leitura neste portal' });
  }
  next();
}

module.exports = {
  pool,
  SESSION_COOKIE,
  SESSION_TTL_HOURS,
  RESET_TOKEN_TTL_HOURS,
  findUserByUsername,
  findUserById,
  createUser,
  issueAccessToken,
  consumeAccessToken,
  markTokenUsed,
  setPassword,
  verifyPassword,
  createSession,
  getSession,
  destroySession,
  audit,
  requireAuth,
  requireRole,
  omieReadOnlyGuard,
};
