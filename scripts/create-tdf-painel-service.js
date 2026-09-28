// scripts/create-tdf-painel-service.js
// Cria 3º serviço no Railway apontando pra subpasta tdf-painel/ do monorepo
// Usa a API GraphQL do Railway

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const TOKEN = process.env.RAILWAY_TOKEN;
if (!TOKEN) { console.error('ERRO: RAILWAY_TOKEN não encontrado'); process.exit(1); }

const PROJECT_ID = '9621fd1b-a31f-41c1-86ec-88df50dd3e80';
const ENV_ID     = '7e618602-8ed9-45f9-993e-aa1cfd4a6285';

async function gql(query, variables = {}) {
  const resp = await fetch('https://backboard.railway.com/graphql/v2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const j = await resp.json();
  if (j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors));
  return j.data;
}

async function main() {
  // 1. Listar serviços existentes
  console.log('1. Listando serviços no projeto...');
  const proj = await gql(`
    query($projectId: String!) {
      project(id: $projectId) {
        services {
          edges { node { id name } }
        }
      }
    }
  `, { projectId: PROJECT_ID });

  const existing = proj.project.services.edges.map(e => e.node);
  console.log('   Serviços existentes:', existing.map(s => `${s.name}(${s.id})`).join(', '));

  // 2. Verifica se tdf-painel já existe
  let painel = existing.find(s => s.name === 'tdf-painel');
  if (painel) {
    console.log('2. tdf-painel já existe:', painel.id);
  } else {
    // 3. Criar serviço tdf-painel
    console.log('2. Criando tdf-painel...');
    const created = await gql(`
      mutation($projectId: String!, $name: String!) {
        serviceCreate(input: { projectId: $projectId, name: $name }) {
          id
          name
        }
      }
    `, { projectId: PROJECT_ID, name: 'tdf-painel' });
    painel = created.serviceCreate;
    console.log('   Criado:', painel.id, painel.name);
  }

  // 4. Conectar ao GitHub repo
  console.log('3. Conectando ao GitHub...');
  // Pega o repo do tdf-portal
  const portal = existing.find(s => s.name === 'tdf-portal') || existing[0];
  if (!portal) throw new Error('tdf-portal não encontrado pra copiar config');

  // Pega config do tdf-portal (source)
  const sourceConfig = await gql(`
    query($serviceId: String!) {
      service(id: $serviceId) {
        repo
        branch
      }
    }
  `, { serviceId: portal.id });

  console.log('   Repo atual do tdf-portal:', sourceConfig.service.repo, 'branch:', sourceConfig.service.branch);

  // 5. Atualiza source do tdf-painel
  if (sourceConfig.service.repo) {
    console.log('4. Configurando repo/branch no tdf-painel...');
    try {
      await gql(`
        mutation($serviceId: String!, $repo: String, $branch: String) {
          serviceUpdate(input: { serviceId: $serviceId, repo: $repo, branch: $branch }) {
            id
          }
        }
      `, { serviceId: painel.id, repo: sourceConfig.service.repo, branch: 'main' });
      console.log('   OK');
    } catch (e) {
      console.log('   Erro:', e.message);
    }
  }

  // 6. Set root directory via variável RAILWAY_DOCKERFILE_PATH
  console.log('5. Configurando rootDir = tdf-painel...');
  try {
    await gql(`
      mutation($serviceId: String!, $name: String!, $value: String!) {
        variableUpsert(input: { serviceId: $serviceId, name: $name, value: $value })
      }
    `, { serviceId: painel.id, name: 'RAILWAY_DOCKERFILE_PATH', value: 'tdf-painel/Dockerfile' });
    console.log('   OK');
  } catch (e) {
    console.log('   Erro:', e.message);
  }

  // 7. Listar variáveis
  console.log('6. Variáveis atuais do tdf-painel:');
  try {
    const vars = await gql(`
      query($serviceId: String!, $environmentId: String!) {
        variables(serviceId: $serviceId, environmentId: $environmentId)
      }
    `, { serviceId: painel.id, environmentId: ENV_ID });
    console.log('  ', JSON.stringify(vars.variables, null, 2));
  } catch(e) {
    console.log('   Erro:', e.message);
  }

  console.log('\n✅ Service ID:', painel.id);
  console.log('Configure as variáveis no painel do Railway e faça redeploy.');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
