
require('dotenv').config({path:'C:/Users/User/OneDrive/Área de Trabalho/Repositório Git - TDF/.env.local'});
const TOKEN=process.env.RAILWAY_TOKEN;
async function gql(q,v={}){const r=await fetch('https://backboard.railway.com/graphql/v2',{method:'POST',headers:{'Authorization':`Bearer ${TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({query:q,variables:v})});const j=await r.json();return j;}
(async()=>{
  const d = await gql(`query($projectId: String!, $environmentId: String!, $serviceId: String!) { variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId) }`, {projectId:'9621fd1b-a31f-41c1-86ec-88df50dd3e80',environmentId:'7e618602-8ed9-45f9-993e-aa1cfd4a6285',serviceId:'f0e65329-ebbe-4874-82c1-3a745b374e45'});
  console.log(JSON.stringify(d).slice(0, 2000));
})();
