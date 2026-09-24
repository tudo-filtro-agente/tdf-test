/**
 * OMIE client — 3 empresas (Mococa, Tudo de Filtro, American).
 *
 * Modo DRY_RUN=true → retorna dados fictícios sem chamar API real.
 * Modo DRY_RUN=false → chama https://app.omie.com.br/api/v1/ pra valer.
 */

const axios = require('axios');

const EMPRESAS = {
  'Mococa': {
    key: process.env.OMIE_MOCOCA_APP_KEY,
    secret: process.env.OMIE_MOCOCA_APP_SECRET,
  },
  'Tudo de Filtro': {
    key: process.env.OMIE_TUDODEFILTRO_APP_KEY,
    secret: process.env.OMIE_TUDODEFILTRO_APP_SECRET,
  },
  'American': {
    key: process.env.OMIE_AMERICAN_APP_KEY,
    secret: process.env.OMIE_AMERICAN_APP_SECRET,
  },
};

const BASE_URL = 'https://app.omie.com.br/api/v1/';
const DRY_RUN = (process.env.DRY_RUN || 'true').toLowerCase() === 'true';

function creds(empresa) {
  const c = EMPRESAS[empresa];
  if (!c) throw new Error(`Empresa desconhecida: ${empresa}`);
  if (!c.key || !c.secret) {
    throw new Error(`Credenciais OMIE faltando pra empresa ${empresa}`);
  }
  return c;
}

// --------- MOCK DATA (usado quando DRY_RUN=true) ---------

function mockListarClientes(empresa) {
  return {
    clientes_cadastro: [
      {
        codigo_cliente_omie: 100001 + (empresa === 'Mococa' ? 0 : empresa === 'Tudo de Filtro' ? 1000 : 2000),
        razao_social: `Cliente Demo ${empresa} 1`,
        nome_fantasia: `Demo ${empresa} 1`,
        telefone1_numero: '11999990001',
        cidade: 'São Paulo',
        estado: 'SP',
        email: `cliente1@${empresa.toLowerCase().replace(/ /g, '')}.com`,
        tags: ['mock', 'teste'],
      },
      {
        codigo_cliente_omie: 100002 + (empresa === 'Mococa' ? 0 : empresa === 'Tudo de Filtro' ? 1000 : 2000),
        razao_social: `Cliente Demo ${empresa} 2`,
        nome_fantasia: `Demo ${empresa} 2`,
        telefone1_numero: '11999990002',
        cidade: 'Campinas',
        estado: 'SP',
        email: `cliente2@${empresa.toLowerCase().replace(/ /g, '')}.com`,
        tags: ['mock', 'teste'],
      },
    ],
    total_de_registros: 2,
    pagina: 1,
    registros_por_pagina: 50,
  };
}

function mockListarPedidos(empresa) {
  return {
    pedidos: [
      {
        codigo_pedido: 500001,
        numero_pedido: 'PED-001',
        codigo_cliente: 100001,
        valor_total_pedido: 350.50,
        status_pedido: 'aprovado',
        data_previsao: '2026-09-30',
        itens: [{ codigo_produto: 'FILTRO-001', quantidade: 2, valor_unitario: 175.25 }],
      },
    ],
    total_de_registros: 1,
  };
}

// --------- API REAL ---------

async function chamarOmie(empresa, endpoint, payload) {
  const c = creds(empresa);
  return axios.post(`${BASE_URL}${endpoint}`, payload, {
    headers: { 'Content-Type': 'application/json' },
    auth: { username: c.key, password: c.secret },
    timeout: 15000,
  });
}

// --------- FUNÇÕES PÚBLICAS ---------

async function listarClientes(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarClientes(${empresa})`);
    return mockListarClientes(empresa);
  }
  const payload = {
    call: 'ListarClientes',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{ pagina: 1, registros_por_pagina: 50, ...params }],
  };
  const res = await chamarOmie(empresa, 'geral/clientes/', payload);
  return res.data;
}

async function listarPedidos(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarPedidos(${empresa})`);
    return mockListarPedidos(empresa);
  }
  const payload = {
    call: 'ListarPedidos',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{ pagina: 1, registros_por_pagina: 50, ...params }],
  };
  const res = await chamarOmie(empresa, 'produtos/pedido/', payload);
  return res.data;
}

async function consultarCliente(empresa, codigoOmie) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] consultarCliente(${empresa}, ${codigoOmie})`);
    return {
      codigo_cliente_omie: codigoOmie,
      razao_social: `Cliente Mock ${codigoOmie}`,
      telefone1_numero: '11999990000',
      cidade: 'São Paulo',
    };
  }
  const payload = {
    call: 'ConsultarCliente',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: { codigo_cliente_omie: codigoOmie },
  };
  const res = await chamarOmie(empresa, 'geral/clientes/', payload);
  return res.data;
}

module.exports = {
  EMPRESAS,
  DRY_RUN,
  listarClientes,
  listarPedidos,
  consultarCliente,
};
