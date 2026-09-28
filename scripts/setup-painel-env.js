require('dotenv').config({path:'./.env.local'});
const TOKEN=process.env.RAILWAY_TOKEN;
const PANEL_ID='8fe72398-837c-43bd-972e-789143e9f278';
const DB_ID='f0e65329-ebbe-4874-82c1-3a745b374e45';
const ENV_ID='7e618602-8ed9-45f9-993e-aa1cfd4a6285';
const PROJ='9621fd1b-a31f-41c1-86ec-88df50dd3e80';
async function gql(q,v={}){const r=await fetch('https://backboard.railway.com/graphql/v2',{method:'POST',headers:{'Authorization':`Bearer ${TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(JSON.stringify(j.errors));return j.data;}
(async()=>{
  const pg=await gql(`query($p:String!,$e:String!,$s:String!){variables(projectId:$p,environmentId:$e,serviceId:$s)}`,{p:PROJ,e:ENV_ID,s:DB_ID});
  const dbUrl=pg.variables.DATABASE_URL;
  if(!dbUrl){console.error('Sem DATABASE_URL');process.exit(1);}
  console.log('DATABASE_URL:', dbUrl.slice(0,40)+'...');
  
  const vars=[
    ['DATABASE_URL',dbUrl],
    ['NODE_ENV','production'],
    ['PORT','3000'],
    ['RAILWAY_DOCKERFILE_PATH','tdf-painel/Dockerfile'],
    ['SESSION_SECRET',Math.random().toString(36).slice(2)+Date.now().toString(36)],
  ];
  for(const [n,v] of vars){
    try{
      await gql(`mutation($p:String!,$e:String!,$s:String!,$n:String!,$v:String!){variableUpsert(input:{projectId:$p,environmentId:$e,serviceId:$s,name:$n,value:$v})}`,{p:PROJ,e:ENV_ID,s:PANEL_ID,n:n,v:v});
      console.log('✓',n);
    }catch(e){console.log('✗',n,e.message);}
  }
})();
