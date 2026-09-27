// scripts/get-railway-logs.js
// Lê RAILWAY_TOKEN do .env.local e mostra últimos deploys + logs do tdf-portal
// Uso: node scripts/get-railway-logs.js
//
// O token fica em .env.local (fora do git). Este script não imprime o token.

require('dotenv').config({ path: '.env.local' });

const TOKEN = process.env.RAILWAY_TOKEN;
if (!TOKEN) {
  console.error('ERRO: RAILWAY_TOKEN não encontrado em .env.local');
  console.error('Adicione a linha: RAILWAY_TOKEN=railway_pat_xxx...');
  process.exit(1);
}

const PROJECT_ID = '9621fd1b-a31f-41c1-86ec-88df50dd3e80';   // tdf-portal2
const ENV_ID     = '7e618602-8ed9-45f9-993e-aa1cfd4a6285';
const SERVICE_ID = 'eb5dee27-1d3e-4cd7-8367-a47e7bc8a44e';   // tdf-portal

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

const REDACT = (s) => (s || '').replace(/Bearer [A-Za-z0-9_-]+/g, 'Bearer [REDACTED]');

(async () => {
  try {
    // 1) Lista os 5 deploys mais recentes
    const d = await gql(`
      query($serviceId: String!, $environmentId: String!) {
        deployments(first: 5, input: {
          serviceId: $serviceId,
          environmentId: $environmentId
        }) {
          edges {
            node {
              id
              status
              createdAt
            }
          }
        }
      }
    `, { serviceId: SERVICE_ID, environmentId: ENV_ID });

    const deploys = d.deployments.edges.map(e => e.node);
    console.log(`\n=== Deploys recentes (${deploys.length}) ===\n`);
    for (const dep of deploys) {
      console.log(`  ${dep.id.slice(0, 12)}  status=${dep.status.padEnd(10)}  ${dep.createdAt}`);
    }

    if (!deploys.length) {
      console.log('\nNenhum deploy encontrado.');
      return;
    }

    const latest = deploys[0];

    // 2) Pega os logs do deploy mais recente
    console.log(`\n=== Logs do deploy ${latest.id.slice(0, 12)} (status=${latest.status}) ===\n`);
    const l = await gql(`
      query($deploymentId: String!) {
        deploymentLogs(deploymentId: $deploymentId) {
          timestamp
          message
        }
      }
    `, { deploymentId: latest.id });

    const logs = l.deploymentLogs || [];
    if (!logs.length) {
      console.log('  (sem logs — talvez o deploy ainda esteja rodando ou foi limpo)');
    } else {
      // Mostra últimas 80 linhas
      const tail = logs.slice(-80);
      for (const line of tail) {
        const ts = line.timestamp || '';
        const msg = REDACT(line.message || '').replace(/\n$/, '');
        console.log(`  ${ts}  ${msg}`);
      }
    }
  } catch (err) {
    console.error('ERRO:', err.message);
    process.exit(1);
  }
})();
