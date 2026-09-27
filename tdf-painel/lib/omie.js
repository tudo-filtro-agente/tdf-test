// lib/omie.js — cliente HTTP do Omie com roteamento por empresa.
//
// O Omie usa um formato único: POST no endpoint com
// {call, app_key, app_secret, param:[{...}]}. Erro NÃO vem por status HTTP —
// vem 200 com faultstring no corpo. Por isso a checagem é do corpo, não do status.

const BASE = 'https://app.omie.com.br/api/v1/';

const EMPRESAS = ['Tudo de Filtro', 'Mococa'];

const CRED = {
  'Tudo de Filtro': { key: 'OMIE_TDF_APP_KEY', secret: 'OMIE_TDF_APP_SECRET',
                      conta: 'OMIE_TDF_CONTA_CORRENTE' },
  'Mococa':         { key: 'OMIE_MOCOCA_APP_KEY', secret: 'OMIE_MOCOCA_APP_SECRET',
                      conta: 'OMIE_MOCOCA_CONTA_CORRENTE' },
};

function truncar(valor, max) {
  const s = String(valor == null ? '' : valor);
  return s.length > max ? s.slice(0, max) : s;
}

// O Omie devolve a cidade de um cliente já cadastrado como
// "SAO JOSE DOS CAMPOS (SP)" — nome com a UF colada entre parênteses no fim.
// Ao GRAVAR (IncluirCliente) só o nome da cidade pode ir; ao LER um cliente
// existente (ListarClientes/ConsultarCliente), este sufixo tem que sair antes
// de qualquer exibição ou uso — senão "(SP)" vaza pro Negócio, pro Contato ou
// pra tela. Não existe cidade brasileira cujo nome termine com "(XX)"
// legitimamente, então o padrão é seguro de aplicar sempre.
function limparCidade(valor) {
  return String(valor == null ? '' : valor).replace(/\s*\([A-Za-z]{2}\)\s*$/, '').trim();
}

// O Omie guarda telefone em DOIS campos — DDD e número separados (ficha real
// medida: telefone1_ddd: "12", telefone1_numero: "988480749") — nunca o
// telefone inteiro num campo só. Aceita o mesmo leque de formatos que o
// resto do PDV usa pro celular (E.164 com/sem código de país "55") e
// qualquer DDD+número de 10 (fixo, 8 dígitos) ou 11 (celular, 9 dígitos)
// dígitos pro telefone fixo, opcional. Devolve null quando não dá pra
// separar com confiança — o chamador decide o que fazer (nunca inventa DDD
// nem corta o número no meio pra forçar um formato).
function separarDdd(bruto) {
  const d = String(bruto == null ? '' : bruto).replace(/\D/g, '');
  const semPais = ((d.length === 12 || d.length === 13) && d.startsWith('55')) ? d.slice(2) : d;
  if (semPais.length !== 10 && semPais.length !== 11) return null;
  return { ddd: semPais.slice(0, 2), numero: semPais.slice(2) };
}

function credenciais(empresa) {
  const c = CRED[empresa];
  if (!c) throw new Error('omie: empresa desconhecida — ' + empresa);
  return c;
}

function contaCorrente(empresa) {
  const c = credenciais(empresa);
  const valor = process.env[c.conta];
  if (!valor) throw new Error('omie: conta corrente ausente para ' + empresa);
  return valor;
}

async function chamar(empresa, endpoint, call, param) {
  const c = credenciais(empresa);
  const app_key = process.env[c.key];
  const app_secret = process.env[c.secret];
  if (!app_key || !app_secret) throw new Error('omie: credencial ausente para ' + empresa);

  const r = await fetch(BASE + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ call, app_key, app_secret, param: [param || {}] }),
  });
  let body;
  try {
    body = await r.json();
  } catch (e) {
    throw new Error('omie ' + call + ': resposta inválida (não é JSON)');
  }
  if (body && body.faultstring) {
    throw new Error('omie ' + call + ': ' + body.faultstring);
  }
  if (!r.ok) throw new Error('omie ' + call + ': HTTP ' + r.status);
  return body;
}

module.exports = { chamar, truncar, limparCidade, separarDdd, contaCorrente, EMPRESAS };
