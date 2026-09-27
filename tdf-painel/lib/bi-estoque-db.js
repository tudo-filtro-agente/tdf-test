// lib/bi-estoque-db.js — Schema Postgres pra Compras/Estoque/Multi-empresa
//
// Reusa pool de conexão do server.js (passada via setPool).
// ensureTables cria todas as tabelas idempotentemente.
// Tabelas:
//   bi_empresas, bi_estoques, bi_produtos, bi_saldo_estoque (cache materializado),
//   bi_mov_estoque (append-only — fonte da verdade),
//   bi_pedidos_compra, bi_itens_pedido_compra, bi_pedidos_entre_empresas,
//   bi_transferencias, bi_os_materiais
//
// Convenção: IDs textuais com prefixo (emp_, est_, prd_, ped_, mov_, etc) gerados no JS.

let _pool = null;
function setPool(pool) { _pool = pool; }
function getPool() { return _pool; }

// === Schema completo (idempotente) ===
async function ensureTables() {
  if (!_pool) throw new Error('pool não inicializado — chame setPool primeiro');
  const sqls = [
    // 1) Empresas
    `CREATE TABLE IF NOT EXISTS bi_empresas (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      cnpj TEXT,
      segmento TEXT,
      responsavel TEXT,
      tipo TEXT,                       -- operacao | fabrica | comercial | assistencia
      observacoes TEXT,
      ativo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )`,
    `CREATE INDEX IF NOT EXISTS idx_empresas_ativo ON bi_empresas (ativo)`,

    // 2) Estoques (multi-tipo)
    `CREATE TABLE IF NOT EXISTS bi_estoques (
      id TEXT PRIMARY KEY,
      empresa_id TEXT REFERENCES bi_empresas(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,              -- central | loja | fabrica | tecnico | veiculo | ambulante | instalacao | manutencao | transito
      responsavel TEXT,
      responsavel_username TEXT,        -- ref USERS[username] pra estoque de técnico
      localizacao TEXT,
      observacoes TEXT,
      ativo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )`,
    `CREATE INDEX IF NOT EXISTS idx_estoques_empresa ON bi_estoques (empresa_id, ativo)`,
    `CREATE INDEX IF NOT EXISTS idx_estoques_tipo ON bi_estoques (tipo)`,
    `CREATE INDEX IF NOT EXISTS idx_estoques_resp ON bi_estoques (responsavel_username) WHERE responsavel_username IS NOT NULL`,

    // 3) Produtos
    `CREATE TABLE IF NOT EXISTS bi_produtos (
      id TEXT PRIMARY KEY,
      sku TEXT,
      nome TEXT NOT NULL,
      categoria TEXT,
      unidade TEXT DEFAULT 'UN',
      custo_medio NUMERIC(14,4) DEFAULT 0,
      custo_ultima_compra NUMERIC(14,4) DEFAULT 0,
      preco_venda NUMERIC(14,2) DEFAULT 0,
      fornecedor_principal TEXT,
      estoque_minimo NUMERIC(14,3) DEFAULT 0,
      estoque_maximo NUMERIC(14,3) DEFAULT 0,
      empresa_dona_id TEXT REFERENCES bi_empresas(id) ON DELETE SET NULL,
      controla_lote BOOLEAN DEFAULT FALSE,
      controla_serie BOOLEAN DEFAULT FALSE,
      zoho_product_id TEXT,             -- link com Zoho Products
      ativo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_produtos_sku ON bi_produtos (sku) WHERE sku IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_produtos_empresa ON bi_produtos (empresa_dona_id, ativo)`,
    `CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON bi_produtos (categoria)`,
    `CREATE INDEX IF NOT EXISTS idx_produtos_zoho ON bi_produtos (zoho_product_id) WHERE zoho_product_id IS NOT NULL`,

    // 4) Saldo (cache materializado: 1 linha por par produto+estoque)
    `CREATE TABLE IF NOT EXISTS bi_saldo_estoque (
      produto_id TEXT REFERENCES bi_produtos(id) ON DELETE CASCADE,
      estoque_id TEXT REFERENCES bi_estoques(id) ON DELETE CASCADE,
      qtd NUMERIC(14,3) DEFAULT 0,
      custo_medio NUMERIC(14,4) DEFAULT 0,
      qtd_reservada NUMERIC(14,3) DEFAULT 0,    -- reservada por OS/instalação
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (produto_id, estoque_id)
    )`,

    // 5) Movimentações (append-only — fonte da verdade)
    `CREATE TABLE IF NOT EXISTS bi_mov_estoque (
      id TEXT PRIMARY KEY,
      ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      produto_id TEXT REFERENCES bi_produtos(id),
      estoque_origem_id TEXT REFERENCES bi_estoques(id),
      estoque_destino_id TEXT REFERENCES bi_estoques(id),
      tipo TEXT NOT NULL,              -- compra-recebida | transferencia | saida-instalacao | venda-pdv | ajuste | perda | devolucao | reserva | estorno
      qtd NUMERIC(14,3) NOT NULL,
      custo_unit NUMERIC(14,4),
      ref_tipo TEXT,                    -- pedido_compra | transferencia | os | venda | ajuste-manual | reserva
      ref_id TEXT,
      usuario TEXT,
      obs TEXT,
      metadata JSONB
    )`,
    `CREATE INDEX IF NOT EXISTS idx_mov_produto_ts ON bi_mov_estoque (produto_id, ts DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_mov_origem_ts ON bi_mov_estoque (estoque_origem_id, ts DESC) WHERE estoque_origem_id IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_mov_destino_ts ON bi_mov_estoque (estoque_destino_id, ts DESC) WHERE estoque_destino_id IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_mov_ref ON bi_mov_estoque (ref_tipo, ref_id) WHERE ref_id IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_mov_tipo_ts ON bi_mov_estoque (tipo, ts DESC)`,

    // 6) Pedidos de compra (workflow)
    `CREATE TABLE IF NOT EXISTS bi_pedidos_compra (
      id TEXT PRIMARY KEY,
      empresa_id TEXT REFERENCES bi_empresas(id),
      fornecedor TEXT NOT NULL,
      fornecedor_cnpj TEXT,
      categoria TEXT,
      centro_custo TEXT,
      valor_total NUMERIC(14,2) NOT NULL DEFAULT 0,
      prazo_entrega DATE,
      urgencia TEXT DEFAULT 'normal',  -- normal | alta | critica
      justificativa TEXT,
      anexo_url TEXT,
      status TEXT DEFAULT 'rascunho',   -- rascunho | aguardando-aprovacao | aprovado | reprovado | ajuste-solicitado | pedido-realizado | recebido-parcial | recebido-total | cancelado
      solicitado_por TEXT,
      aprovado_por TEXT,
      reprovado_por TEXT,
      motivo TEXT,
      data_aprovacao TIMESTAMPTZ,
      data_pedido_realizado TIMESTAMPTZ,
      token_aprovacao TEXT,
      token_expira_em TIMESTAMPTZ,
      conta_pagar_id TEXT,              -- link bi_pagamentos.id
      historico JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )`,
    `CREATE INDEX IF NOT EXISTS idx_pc_status ON bi_pedidos_compra (status)`,
    `CREATE INDEX IF NOT EXISTS idx_pc_empresa ON bi_pedidos_compra (empresa_id)`,
    `CREATE INDEX IF NOT EXISTS idx_pc_token ON bi_pedidos_compra (token_aprovacao) WHERE token_aprovacao IS NOT NULL`,

    // 7) Itens de pedido de compra
    `CREATE TABLE IF NOT EXISTS bi_itens_pedido_compra (
      id TEXT PRIMARY KEY,
      pedido_id TEXT REFERENCES bi_pedidos_compra(id) ON DELETE CASCADE,
      produto_id TEXT REFERENCES bi_produtos(id),
      descricao TEXT NOT NULL,
      qtd NUMERIC(14,3) NOT NULL,
      qtd_recebida NUMERIC(14,3) DEFAULT 0,
      custo_unit NUMERIC(14,4) NOT NULL,
      custo_total NUMERIC(14,2) GENERATED ALWAYS AS (qtd * custo_unit) STORED,
      estoque_destino_id TEXT REFERENCES bi_estoques(id), -- onde vai entrar quando receber
      observacoes TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS idx_itens_pc_pedido ON bi_itens_pedido_compra (pedido_id)`,
    `CREATE INDEX IF NOT EXISTS idx_itens_pc_produto ON bi_itens_pedido_compra (produto_id)`,

    // 8) Pedido entre empresas (B2B interno)
    `CREATE TABLE IF NOT EXISTS bi_pedidos_entre_empresas (
      id TEXT PRIMARY KEY,
      empresa_compradora_id TEXT REFERENCES bi_empresas(id),
      empresa_fornecedora_id TEXT REFERENCES bi_empresas(id),
      estoque_origem_id TEXT REFERENCES bi_estoques(id),
      estoque_destino_id TEXT REFERENCES bi_estoques(id),
      valor_total NUMERIC(14,2) DEFAULT 0,
      prazo DATE,
      observacoes TEXT,
      status TEXT DEFAULT 'solicitado', -- solicitado | aprovado | separado | em-transito | recebido | divergente | cancelado
      itens JSONB DEFAULT '[]',          -- [{produto_id, qtd, preco_unit}]
      gera_conta_pagar BOOLEAN DEFAULT TRUE,
      conta_pagar_id TEXT,
      conta_receber_id TEXT,
      historico JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      data_envio TIMESTAMPTZ,
      data_recebimento TIMESTAMPTZ
    )`,
    `CREATE INDEX IF NOT EXISTS idx_pee_status ON bi_pedidos_entre_empresas (status)`,
    `CREATE INDEX IF NOT EXISTS idx_pee_compradora ON bi_pedidos_entre_empresas (empresa_compradora_id)`,
    `CREATE INDEX IF NOT EXISTS idx_pee_fornecedora ON bi_pedidos_entre_empresas (empresa_fornecedora_id)`,

    // 9) Transferências de estoque (qualquer→qualquer)
    `CREATE TABLE IF NOT EXISTS bi_transferencias (
      id TEXT PRIMARY KEY,
      estoque_origem_id TEXT REFERENCES bi_estoques(id),
      estoque_destino_id TEXT REFERENCES bi_estoques(id),
      itens JSONB DEFAULT '[]',          -- [{produto_id, qtd}]
      responsavel_origem TEXT,
      responsavel_destino TEXT,
      motivo TEXT,
      status TEXT DEFAULT 'solicitada',  -- solicitada | aprovada | separada | em-transito | recebida | divergente | cancelada
      data_envio TIMESTAMPTZ,
      data_recebimento TIMESTAMPTZ,
      historico JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )`,
    `CREATE INDEX IF NOT EXISTS idx_tr_status ON bi_transferencias (status)`,
    `CREATE INDEX IF NOT EXISTS idx_tr_origem ON bi_transferencias (estoque_origem_id)`,
    `CREATE INDEX IF NOT EXISTS idx_tr_destino ON bi_transferencias (estoque_destino_id)`,

    // 10) OS Materiais (integração com AUVO/instalações Zoho)
    `CREATE TABLE IF NOT EXISTS bi_os_materiais (
      id TEXT PRIMARY KEY,
      os_externo_id TEXT,               -- ID da OS no AUVO ou link Zoho
      origem TEXT,                       -- auvo | zoho | manual
      tecnico_username TEXT,
      tecnico_estoque_id TEXT REFERENCES bi_estoques(id),
      cliente TEXT,
      endereco TEXT,
      tipo_servico TEXT,
      previstos JSONB DEFAULT '[]',     -- [{produto_id, qtd}] reservados
      usados JSONB DEFAULT '[]',         -- [{produto_id, qtd_usada, qtd_devolvida, qtd_perdida}]
      fotos JSONB DEFAULT '[]',
      assinatura_url TEXT,
      status TEXT DEFAULT 'pendente',    -- pendente | reservado | em-execucao | finalizada | cancelada
      historico JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      finalizada_em TIMESTAMPTZ
    )`,
    `CREATE INDEX IF NOT EXISTS idx_os_status ON bi_os_materiais (status)`,
    `CREATE INDEX IF NOT EXISTS idx_os_tecnico ON bi_os_materiais (tecnico_username)`,
    `CREATE INDEX IF NOT EXISTS idx_os_externo ON bi_os_materiais (origem, os_externo_id) WHERE os_externo_id IS NOT NULL`,
  ];

  for (const sql of sqls) {
    try { await _pool.query(sql); }
    catch(e) { console.error('[bi-estoque-db ensureTables]', sql.slice(0,80), '|', e.message); throw e; }
  }
  console.log('[bi-estoque-db] tabelas criadas/verificadas (10 tabelas)');
}

module.exports = { setPool, getPool, ensureTables };
