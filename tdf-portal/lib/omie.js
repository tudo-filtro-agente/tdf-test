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

// ---------- MOCKS — Etapa 2 / Parte 2 (8 entidades BI) ----------

function mockContasPagar(empresa) {
  // gera valores determinísticos baseados em offset
  const base = empresa === 'Mococa' ? 1000000 : empresa === 'Tudo de Filtro' ? 2000000 : 3000000;
  return {
    contas_pagar: [
      {
        codigo_lancamento_omie: base + 1,
        codigo_cliente_fornecedor: 900001,
        nome_cliente_fornecedor: `Fornecedor Demo ${empresa} 1`,
        numero_documento: 'NF-00001',
        numero_parcela: '001/003',
        valor_documento: 1500.00,
        valor_pago: 500.00,
        data_emissao: '2026-09-15',
        data_vencimento: '2026-10-15',
        data_pagamento: null,
        status_lancamento: 'em_aberto',
        codigo_categoria: 'CAT-001',
        observacao: 'Material de escritório',
      },
      {
        codigo_lancamento_omie: base + 2,
        codigo_cliente_fornecedor: 900002,
        nome_cliente_fornecedor: `Energia Elétrica ${empresa}`,
        numero_documento: 'NF-00002',
        numero_parcela: '001/001',
        valor_documento: 850.30,
        valor_pago: 850.30,
        data_emissao: '2026-09-10',
        data_vencimento: '2026-09-20',
        data_pagamento: '2026-09-19',
        status_lancamento: 'pago',
        codigo_categoria: 'CAT-002',
        observacao: 'Conta de luz',
      },
      {
        codigo_lancamento_omie: base + 3,
        codigo_cliente_fornecedor: 900003,
        nome_cliente_fornecedor: `Fornecedor Demo ${empresa} 3`,
        numero_documento: 'NF-00003',
        numero_parcela: '001/002',
        valor_documento: 3200.00,
        valor_pago: 0,
        data_emissao: '2026-08-15',
        data_vencimento: '2026-09-15', // atrasada!
        data_pagamento: null,
        status_lancamento: 'atrasado',
        codigo_categoria: 'CAT-001',
        observacao: 'Filtros especiais',
      },
    ],
    total_de_registros: 3,
  };
}

function mockContasReceber(empresa) {
  const base = empresa === 'Mococa' ? 1500000 : empresa === 'Tudo de Filtro' ? 2500000 : 3500000;
  return {
    contas_receber: [
      {
        codigo_lancamento_omie: base + 1,
        codigo_cliente_fornecedor: 100001,
        nome_cliente_fornecedor: `Cliente Demo ${empresa} 1`,
        numero_documento: 'REC-00001',
        numero_parcela: '001/001',
        valor_documento: 2750.50,
        valor_recebido: 0,
        data_emissao: '2026-09-20',
        data_vencimento: '2026-10-05',
        data_recebimento: null,
        status_lancamento: 'em_aberto',
        codigo_categoria: 'CAT-100',
        observacao: 'Venda mensal',
      },
      {
        codigo_lancamento_omie: base + 2,
        codigo_cliente_fornecedor: 100002,
        nome_cliente_fornecedor: `Cliente Demo ${empresa} 2`,
        numero_documento: 'REC-00002',
        numero_parcela: '001/002',
        valor_documento: 1200.00,
        valor_recebido: 600.00,
        data_emissao: '2026-09-01',
        data_vencimento: '2026-10-01',
        data_recebimento: '2026-09-25',
        status_lancamento: 'em_aberto',
        codigo_categoria: 'CAT-100',
        observacao: 'Parcial',
      },
    ],
    total_de_registros: 2,
  };
}

function mockMovimentos(empresa) {
  const base = empresa === 'Mococa' ? 1100000 : empresa === 'Tudo de Filtro' ? 2100000 : 3100000;
  return {
    movimentos: [
      { codigo_movimento: base + 1, conta_bancaria: 'Itaú CC', tipo: 'credito', data_movimento: '2026-09-25', valor: 1200.00, descricao: 'Recebimento cliente', categoria: 'vendas', conciliado: true },
      { codigo_movimento: base + 2, conta_bancaria: 'Itaú CC', tipo: 'debito',   data_movimento: '2026-09-26', valor: 850.30, descricao: 'Pagto energia',    categoria: 'despesas', conciliado: true },
      { codigo_movimento: base + 3, conta_bancaria: 'Itaú CC', tipo: 'debito',   data_movimento: '2026-09-27', valor: 500.00, descricao: 'Adiantamento',    categoria: 'fornecedores', conciliado: false },
    ],
    total_de_registros: 3,
  };
}

function mockContasBancarias(empresa) {
  const base = empresa === 'Mococa' ? 1200000 : empresa === 'Tudo de Filtro' ? 2200000 : 3200000;
  return {
    contas_bancarias: [
      { codigo_conta_corrente: base + 1, nome: 'Itaú CC Principal', banco: 'Itaú', agencia: '0001', conta: '12345-6', tipo: 'corrente', saldo_atual: 45230.50, ativa: true },
      { codigo_conta_corrente: base + 2, nome: 'Bradesco CC',        banco: 'Bradesco', agencia: '0234', conta: '98765-4', tipo: 'corrente', saldo_atual: 12380.00, ativa: true },
    ],
    total_de_registros: 2,
  };
}

function mockCategorias(empresa) {
  return {
    categorias: [
      { codigo_categoria: 'CAT-001', nome: 'Material de escritório', tipo: 'despesa' },
      { codigo_categoria: 'CAT-002', nome: 'Energia elétrica',       tipo: 'despesa' },
      { codigo_categoria: 'CAT-003', nome: 'Fornecedores',           tipo: 'despesa' },
      { codigo_categoria: 'CAT-100', nome: 'Vendas',                 tipo: 'receita' },
    ],
    total_de_registros: 4,
  };
}

function mockNfEntrada(empresa) {
  const base = empresa === 'Mococa' ? 1300000 : empresa === 'Tudo de Filtro' ? 2300000 : 3300000;
  return {
    nf_entrada: [
      { codigo_nf: base + 1, numero: '00001', serie: '1', chave_acesso: '3526...' + String(base+1).padStart(8,'0'), codigo_fornecedor: 900001, nome_fornecedor: `Fornecedor Demo ${empresa}`, data_emissao: '2026-09-15', data_entrada: '2026-09-16', valor_total: 1500.00, valor_produtos: 1300.00, valor_impostos: 200.00, status: 'processada' },
      { codigo_nf: base + 2, numero: '00002', serie: '1', chave_acesso: '3526...' + String(base+2).padStart(8,'0'), codigo_fornecedor: 900002, nome_fornecedor: `Energia Elétrica ${empresa}`, data_emissao: '2026-09-10', data_entrada: '2026-09-11', valor_total: 850.30, valor_produtos: 850.30, valor_impostos: 0, status: 'processada' },
    ],
    total_de_registros: 2,
  };
}

function mockFornecedores(empresa) {
  const base = empresa === 'Mococa' ? 1400000 : empresa === 'Tudo de Filtro' ? 2400000 : 3400000;
  return {
    fornecedores: [
      { codigo_cliente_omie: base + 1, razao_social: `Fornecedor Demo ${empresa} 1`, nome_fantasia: `Demo For ${empresa} 1`, cnpj_cpf: '11.222.333/0001-81', email: `for1@${empresa.toLowerCase().replace(/ /g,'')}.com`, telefone: '11988887777', cidade: 'São Paulo', estado: 'SP' },
      { codigo_cliente_omie: base + 2, razao_social: `Energia Elétrica ${empresa} S/A`, nome_fantasia: 'Energia S/A', cnpj_cpf: '22.333.444/0001-92', email: 'cobranca@energia.com.br', telefone: '0800000000', cidade: 'Rio de Janeiro', estado: 'RJ' },
    ],
    total_de_registros: 2,
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

// --------- ETAPA 2 — FUNÇÕES BI FINANCEIRO ---------

async function listarContasPagar(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarContasPagar(${empresa})`);
    return mockContasPagar(empresa);
  }
  const payload = {
    call: 'ListarContasPagar',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{ pagina: 1, registros_por_pagina: 200, ...params }],
  };
  const res = await chamarOmie(empresa, 'financas/contapagar/', payload);
  return res.data;
}

async function listarContasReceber(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarContasReceber(${empresa})`);
    return mockContasReceber(empresa);
  }
  const payload = {
    call: 'ListarContasReceber',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{ pagina: 1, registros_por_pagina: 200, ...params }],
  };
  const res = await chamarOmie(empresa, 'financas/contareceber/', payload);
  return res.data;
}

async function listarMovimentos(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarMovimentos(${empresa})`);
    return mockMovimentos(empresa);
  }
  // Extrato por conta corrente. EXIGE nCodCC + dPeriodoInicial + dPeriodoFinal.
  // Default: últimos 60 dias até hoje.
  const hoje = new Date();
  const sessentaDias = new Date(hoje.getTime() - 60 * 24 * 60 * 60 * 1000);
  const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const payload = {
    call: 'ListarExtrato',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{
      nCodCC: params.nCodCC || 0,
      dPeriodoInicial: params.dPeriodoInicial || fmt(sessentaDias),
      dPeriodoFinal: params.dPeriodoFinal || fmt(hoje),
    }],
  };
  const res = await chamarOmie(empresa, 'financas/extrato/', payload);
  return res.data;
}

async function listarContasBancarias(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarContasBancarias(${empresa})`);
    return mockContasBancarias(empresa);
  }
  // ListarContasCorrentes aceita {codigo} como filtro opcional.
  // Sem codigo → retorna todas.
  const payload = {
    call: 'ListarContasCorrentes',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{ codigo: 0, ...params }],
  };
  const res = await chamarOmie(empresa, 'geral/contacorrente/', payload);
  return res.data;
}

async function listarCategorias(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarCategorias(${empresa})`);
    return mockCategorias(empresa);
  }
  const payload = {
    call: 'ListarCategorias',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{ pagina: 1, registros_por_pagina: 200, ...params }],
  };
  const res = await chamarOmie(empresa, 'geral/categorias/', payload);
  return res.data;
}

async function listarNfEntrada(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarNfEntrada(${empresa})`);
    return mockNfEntrada(empresa);
  }
  // OMIE não tem endpoint dedicado de NF-entrada. Usamos Movimentos Financeiros
  // (financas/mf) que retorna pagamentos/baixas/lançamentos no Conta Corrente,
  // incluindo NF de fornecedores quando aplicável.
  const payload = {
    call: 'ListarMovimentos',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{ nPagina: 1, nRegPorPagina: 200, ...params }],
  };
  const res = await chamarOmie(empresa, 'financas/mf/', payload);
  return res.data;
}

async function listarFornecedores(empresa, params = {}) {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] listarFornecedores(${empresa})`);
    return mockFornecedores(empresa);
  }
  // OMIE não tem endpoint dedicado de fornecedores — usa geral/clientes/
  // com filtro por tag (cliente_ou_fornecedor = 'F' = fornecedor).
  // NOTA: A tag exata pode variar. Aqui listamos TODOS e filtramos client-side.
  const payload = {
    call: 'ListarClientes',
    app_key: creds(empresa).key,
    app_secret: creds(empresa).secret,
    param: [{ pagina: 1, registros_por_pagina: 200, apenas_importado_api: 'N', ...params }],
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
  // Etapa 2 — BI Financeiro
  listarContasPagar,
  listarContasReceber,
  listarMovimentos,
  listarContasBancarias,
  listarCategorias,
  listarNfEntrada,
  listarFornecedores,
  // Mocks (usados quando sync-dry é chamado mesmo com DRY_RUN=false)
  mockContasPagar,
  mockContasReceber,
  mockMovimentos,
  mockContasBancarias,
  mockCategorias,
  mockNfEntrada,
  mockFornecedores,
};
