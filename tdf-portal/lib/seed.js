// lib/seed.js — Etapa 1 / Parte 1: cria usuários iniciais se não existirem
// Roda automaticamente na inicialização do servidor (idempotente)

const { pool, createUser, findUserByUsername, issueAccessToken } = require('./auth');

const PLACEHOLDER_USERS = [
  {
    username: 'marcos',
    email: 'marcos@tdf.local',           // PLACEHOLDER — substituir depois
    full_name: 'Marcos (admin)',
    role: 'admin',
    notes: 'Dono/admin — placeholder de e-mail até Marcos confirmar',
  },
  {
    username: 'paulo',
    email: 'paulo@tdf.local',            // PLACEHOLDER — substituir depois
    full_name: 'Paulo (admin)',
    role: 'admin',
    notes: 'Dono/admin — placeholder de e-mail até Paulo confirmar',
  },
  {
    username: 'financeiro',
    email: 'financeiro@tdf.local',       // PLACEHOLDER — substituir depois
    full_name: 'Equipe Financeira',
    role: 'financeiro',
    notes: 'Acesso somente ao BI Financeiro. PLACEHOLDER genérico — criar 1 por pessoa depois.',
  },
];

async function seedUsers() {
  const tokens = [];
  for (const u of PLACEHOLDER_USERS) {
    const existing = await findUserByUsername(u.username);
    if (existing) {
      tokens.push({
        username: existing.username,
        email: existing.email,
        skipped: true,
        reason: 'já existe — não recriado',
      });
      continue;
    }
    const user = await createUser(u);
    const t = await issueAccessToken(user.id, 'first_access');
    tokens.push({
      username: user.username,
      email: user.email,
      role: user.role,
      must_reset: true,
      first_access_token: t.token,
      first_access_url: `/primeiro-acesso?token=${t.token}`,
      expires_at: t.expires_at,
      skipped: false,
    });
  }
  return tokens;
}

async function applyMigrations() {
  const fs = require('fs');
  const path = require('path');
  const dbDir = path.join(__dirname, '..', 'db');
  const files = fs.readdirSync(dbDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dbDir, f), 'utf8');
    await pool.query(sql);
    console.log(`[migrations] ✓ ${f}`);
  }
}

// Compat: legado
async function ensureSchema() {
  const fs = require('fs');
  const path = require('path');
  const sql = fs.readFileSync(path.join(__dirname, '..', 'db', '001_login.sql'), 'utf8');
  await pool.query(sql);
}

async function initAuth() {
  console.log('[init] aplicando migrations...');
  await applyMigrations();
  console.log('[init] migrations OK');

  console.log('[init] seed de usuários...');
  const tokens = await seedUsers();
  console.log('[init] seed OK — tokens de 1º acesso gerados:');
  for (const t of tokens) {
    if (t.skipped) {
      console.log(`  - ${t.username}: (já existia)`);
    } else {
      console.log(`  - ${t.username} (${t.role}): ${t.first_access_url}`);
      console.log(`    token=${t.first_access_token}  expira em ${t.expires_at.toISOString()}`);
    }
  }
  return tokens;
}

module.exports = { initAuth, seedUsers, applyMigrations, ensureSchema, PLACEHOLDER_USERS };

// CLI: `node lib/seed.js` (re-roda idempotentemente)
if (require.main === module) {
  initAuth()
    .then(() => { console.log('OK'); process.exit(0); })
    .catch((e) => { console.error('ERRO', e); process.exit(1); });
}
