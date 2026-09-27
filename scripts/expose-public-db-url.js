// scripts/expose-public-db-url.js
// Copia DATABASE_URL → DATABASE_PUBLIC_URL para acesso de fora do Railway
// Uso: node scripts/expose-public-db-url.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const TOKEN = process.env.RAILWAY_TOKEN;
const PROJECT_ID = '9621fd1b-a31f-41c1-86ec-88df50dd3e80';
const ENV_ID     = '7e618602-8ed9-45f9-993e-aa1cfd4a6285';
const SERVICE_ID = 'eb5dee27-1d3e-4cd7-8367-a47e7bc8a44e';

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
  const DATABASE_URL = vars.DATABASE_URL;
  if (!DATABASE_URL) { console.error('DATABASE_URL não encontrada'); process.exit(1); }

  // postgres.railway.internal → proxy.rlwy.net (resolve pra IP público)
  const PUBLIC_URL = DATABASE_URL
    .replace('postgres.railway.internal', 'proxy.rlwy.net')
    .replace('postgres.railway.com', 'proxy.rlwy.net');

  console.log(`Origem: ${DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);
  console.log(`Public: ${PUBLIC_URL.replace(/:[^:@]+@/, ':***@')}`);

  const up = await gql(`
    mutation($input: VariableCollectionUpsertInput!) {
      variableCollectionUpsert(input: $input)
    }
  `, {
    input: {
      projectId: PROJECT_ID,
      environmentId: ENV_ID,
      serviceId: SERVICE_ID,
      variables: { DATABASE_PUBLIC_URL: PUBLIC_URL },
      skipDeploys: false,
    },
  });

  console.log('OK — variável DATABASE_PUBLIC_URL adicionada. Railway vai redeployar.');
}

main().catch((e) => { console.error('ERRO:', e.message); process.exit(1); });
