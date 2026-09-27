// scripts/set-password.js
// Define uma senha temporária para os usuários (marcos, paulo, financeiro)
// Marca must_reset=false para permitir login direto

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const TOKEN = process.env.RAILWAY_TOKEN;
if (!TOKEN) { console.error('ERRO: RAILWAY_TOKEN não em .env.local'); process.exit(1); }

const PROJECT_ID = '9621fd1b-a31f-41c1-86ec-88df50dd3e80';
const ENV_ID     = '7e618602-8ed9-45f9-993e-aa1cfd4a6285';
const SERVICE_ID = 'eb5dee27-1d3e-4cd7-8367-a47e7bc8a44e';

const SENHAS = {
  marcos:     'TDF@2026-Marcos',
  paulo:      'TDF@2026-Paulo',
  financeiro: 'TDF@2026-Financeiro',
};

async function gql(query, variables = {}) {
  const resp = await fetch('https://backboard.railway.com/graphql/v2', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  const j = await resp.json();
  if (j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors));
  return j.data;
}

async function main() {
  const d = await gql(`
    query($projectId: String!, $environmentId: String!, $serviceId: String!) {
      variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId)
    }
  `, { projectId: PROJECT_ID, environmentId: ENV_ID, serviceId: SERVICE_ID });

  const vars = d.variables || {};
  const DATABASE_URL = vars.DATABASE_PUBLIC_URL || vars.DATABASE_URL;
  if (!DATABASE_URL) { console.error('DATABASE_URL não encontrada'); process.exit(1); }

  const { Pool } = require('pg');
  const bcrypt = require('bcryptjs');
  const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

  console.log('\n=== Senhas temporárias definidas ===\n');
  for (const [username, senha] of Object.entries(SENHAS)) {
    const hash = await bcrypt.hash(senha, 10);
    const r = await pool.query(
      `UPDATE users SET password_hash = $1, must_reset = FALSE
         WHERE username = $2
         RETURNING id, username, role, must_reset`,
      [hash, username]
    );
    if (r.rows.length) {
      console.log(`  ✓ ${username.padEnd(12)} (${r.rows[0].role})  senha: ${senha}`);
    } else {
      console.log(`  ✗ ${username} não encontrado`);
    }
  }
  // Invalida todos os tokens pendentes (pra não confundir)
  await pool.query(
    `UPDATE access_tokens SET used_at = NOW() WHERE used_at IS NULL`
  );
  console.log('\n✓ Tokens pendentes invalidados');
  console.log('\nVocê já pode logar em: https://tdf-portal-production-25b3.up.railway.app/login');

  await pool.end();
}

main().catch((e) => { console.error('ERRO:', e.message); process.exit(1); });
