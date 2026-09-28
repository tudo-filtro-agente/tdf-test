require('dotenv').config({path:'./.env.local'});
const TOKEN=process.env.RAILWAY_TOKEN;
const PANEL_ID='8fe72398-837c-43bd-972e-789143e9f278';
async function gql(q,v={}){const r=await fetch('https://backboard.railway.com/graphql/v2',{method:'POST',headers:{'Authorization':`Bearer ${TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(JSON.stringify(j.errors));return j.data;}
(async()=>{
  const d=await gql(`mutation($s:String!){serviceDeploy(input:{serviceId:$s})}`,{s:PANEL_ID});
  console.log('Deploy:', JSON.stringify(d));
})();
