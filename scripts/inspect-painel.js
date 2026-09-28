require('dotenv').config({path:'./.env.local'});
const TOKEN=process.env.RAILWAY_TOKEN;
const PANEL_ID='8fe72398-837c-43bd-972e-789143e9f278';
const PORTAL_ID='eb5dee27-1d3e-4cd7-8367-a47e7bc8a44e';
async function gql(q,v={}){const r=await fetch('https://backboard.railway.com/graphql/v2',{method:'POST',headers:{'Authorization':`Bearer ${TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({query:q,variables:v})});const j=await r.json();if(j.errors)throw new Error(JSON.stringify(j.errors));return j.data;}
(async()=>{
  const p = await gql(`query($s:String!){service(id:$s){id name createdAt }}`,{s:PANEL_ID});
  console.log('Painel:', JSON.stringify(p));
  const pf = await gql(`query($s:String!){service(id:$s){id name }}`,{s:PORTAL_ID});
  console.log('Portal:', JSON.stringify(pf));
})();
