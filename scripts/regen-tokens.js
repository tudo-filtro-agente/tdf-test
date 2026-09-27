// scripts/regen-tokens.js
// Regenera tokens de 1º acesso para os 3 usuários (marcos, paulo, financeiro)
// Marca os antigos como usados e cria novos válidos por 24h
// Uso: node scripts/regen-tokens.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const TOKEN = process.env.RAILWAY_TOKEN;
if (!TOKEN) {
  console.error('ERRO: RAILWAY_TOKEN não encontrado em .env.local');
  process.exit(1);
}

const PROJECT_ID = '9621fd1b-a31f-41c1-86ec-88df50dd3e80';
const ENV_ID     = '7e618602-8ed9-45f9-993e-aa1cfd4a6285';
const SERVICE_ID = 'eb5dee27-1d3e-4cd7-8367-a47e7bc8a44e';

async function gql(query, variables = {}) {
  const resp = await fetch('https://backboard.railway.com/graphql/v2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${t.slice(0, 300)}`);
  }
  const j = await resp.json();
  if (j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors));
  return j.data;
}

async function main() {
  // Variáveis do serviço tdf-portal — pega DATABASE_URL
  const d = await gql(`
    query($projectId: String!, $environmentId: String!, $serviceId: String!) {
      variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId)
    }
  `, { projectId: PROJECT_ID, environmentId: ENV_ID, serviceId: SERVICE_ID });

  const vars = d.variables || {};
  // Prefere URL pública (acessível de fora do Railway); fallback pra interna
  const DATABASE_URL = vars.DATABASE_PUBLIC_URL || vars.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('ERRO: DATABASE_URL/DATABASE_PUBLIC_URL não estão nas variáveis do serviço');
    process.exit(1);
  }

  // Conecta no Postgres
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

  async function regen(username) {
    await pool.query(
      `UPDATE access_tokens SET used_at = NOW()
         WHERE user_id = (SELECT id FROM users WHERE username = $1)
           AND used_at IS NULL`,
      [username]
    );
    const raw = Array.from({ length: 64 }, () =>
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
    const sha = await pool.query(`SELECT encode(digest($1, 'sha256'), 'hex') AS h`, [raw]);
    const tokenHash = sha.rows[0].h;
    const ins = await pool.query(
      `INSERT INTO access_tokens (user_id, token_hash, purpose, expires_at)
       VALUES (
         (SELECT id FROM users WHERE username = $1),
         $2, 'first_access', NOW() + INTERVAL '24 hours'
       )
       RETURNING id, expires_at`,
      [username, tokenHash]
    );
    return { token: raw, expires_at: ins.rows[0].expires_at };
  }

  console.log('Tokens de 1º acesso (válidos por 24h):\n');
  console.log('IMPORTANTE: guarde esses tokens em local seguro. Eles serão exibidos APENAS agora.\n');
  for (const u of ['marcos', 'paulo', 'financeiro']) {
    const t = await regen(u);
    console.log(`  ${u.padEnd(12)}  expira em ${t.expires_at.toISOString()}`);
    console.log(`  ${u.padEnd(12)}  token:   ${t.token}`);
    console.log(`  ${u.padEnd(12)}  URL:     https://tdf-portal-production-25b3.up.railway.app/primeiro-acesso?token=${t.token}`);
    console.log('');
  }

  await pool.end();
}

main().catch((err) => { console.error('ERRO:', err.message); process.exit(1); });
