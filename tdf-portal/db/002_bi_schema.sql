-- ============================================================
-- TDF Portal — Etapa 2 / Parte 1
-- Schema BI Financeiro (8 tabelas)
-- Alimentado pelo sync OMIE → Postgres (cron 30min)
-- ============================================================

-- ---------- EMPRESAS ----------
CREATE TABLE IF NOT EXISTS empresas (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(100) UNIQUE NOT NULL,       -- 'Mococa', 'Tudo de Filtro', 'American'
    omie_app_key    VARCHAR(255),                       -- snapshot (somente leitura no portal)
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes           TEXT
);

-- ---------- SYNC LOG ----------
CREATE TABLE IF NOT EXISTS sync_log (
    id              BIGSERIAL PRIMARY KEY,
    empresa_id      INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    empresa_nome    VARCHAR(100),                       -- snapshot
    tipo            VARCHAR(32) NOT NULL,                -- 'clientes', 'contas_pagar', etc.
    status          VARCHAR(16) NOT NULL,               -- 'ok', 'error', 'partial'
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at     TIMESTAMPTZ,
    duration_ms     INTEGER,
    total_omie      INTEGER,                            -- quantos registros vieram da OMIE
    total_db        INTEGER,                            -- quantos foram persistidos
    error_msg       TEXT,
    triggered_by    VARCHAR(32) NOT NULL DEFAULT 'cron' -- 'cron' | 'manual' | 'admin'
);
CREATE INDEX IF NOT EXISTS idx_sync_log_empresa ON sync_log(empresa_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_tipo ON sync_log(tipo);
CREATE INDEX IF NOT EXISTS idx_sync_log_started ON sync_log(started_at DESC);

-- ---------- CLIENTES ----------
CREATE TABLE IF NOT EXISTS clientes (
    id                      BIGSERIAL PRIMARY KEY,
    empresa_id              INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    omie_codigo             BIGINT NOT NULL,             -- codigo_cliente_omie
    razao_social            VARCHAR(255),
    nome_fantasia           VARCHAR(255),
    cnpj_cpf                VARCHAR(20),
    email                   VARCHAR(255),
    telefone                VARCHAR(30),
    cidade                  VARCHAR(100),
    estado                  VARCHAR(2),
    tags                    JSONB DEFAULT '[]'::jsonb,
    -- snapshot completo da OMIE (caso a coluna específica falte, ainda temos o original)
    raw                     JSONB,
    synced_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empresa_id, omie_codigo)
);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa ON clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(razao_social);
CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj_cpf);

-- ---------- CONTAS A PAGAR ----------
CREATE TABLE IF NOT EXISTS contas_pagar (
    id                      BIGSERIAL PRIMARY KEY,
    empresa_id              INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    omie_codigo             BIGINT NOT NULL,
    codigo_fornecedor       BIGINT,
    nome_fornecedor         VARCHAR(255),
    numero_documento        VARCHAR(100),
    parcela                 VARCHAR(10),
    valor_documento         NUMERIC(15,2),
    valor_pago              NUMERIC(15,2),
    saldo                   NUMERIC(15,2) GENERATED ALWAYS AS (COALESCE(valor_documento,0) - COALESCE(valor_pago,0)) STORED,
    data_emissao            DATE,
    data_vencimento         DATE,
    data_pagamento          DATE,
    status                  VARCHAR(32),                -- 'em_aberto' | 'pago' | 'atrasado' | 'cancelado'
    categoria               VARCHAR(100),
    observacao              TEXT,
    raw                     JSONB,
    synced_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empresa_id, omie_codigo)
);
CREATE INDEX IF NOT EXISTS idx_pagar_empresa ON contas_pagar(empresa_id);
CREATE INDEX IF NOT EXISTS idx_pagar_status ON contas_pagar(status);
CREATE INDEX IF NOT EXISTS idx_pagar_vencimento ON contas_pagar(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_pagar_fornecedor ON contas_pagar(codigo_fornecedor);

-- ---------- CONTAS A RECEBER ----------
CREATE TABLE IF NOT EXISTS contas_receber (
    id                      BIGSERIAL PRIMARY KEY,
    empresa_id              INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    omie_codigo             BIGINT NOT NULL,
    codigo_cliente          BIGINT,
    nome_cliente            VARCHAR(255),
    numero_documento        VARCHAR(100),
    parcela                 VARCHAR(10),
    valor_documento         NUMERIC(15,2),
    valor_recebido          NUMERIC(15,2),
    saldo                   NUMERIC(15,2) GENERATED ALWAYS AS (COALESCE(valor_documento,0) - COALESCE(valor_recebido,0)) STORED,
    data_emissao            DATE,
    data_vencimento         DATE,
    data_recebimento        DATE,
    status                  VARCHAR(32),                -- 'em_aberto' | 'recebido' | 'atrasado' | 'cancelado'
    categoria               VARCHAR(100),
    observacao              TEXT,
    raw                     JSONB,
    synced_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empresa_id, omie_codigo)
);
CREATE INDEX IF NOT EXISTS idx_receber_empresa ON contas_receber(empresa_id);
CREATE INDEX IF NOT EXISTS idx_receber_status ON contas_receber(status);
CREATE INDEX IF NOT EXISTS idx_receber_vencimento ON contas_receber(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_receber_cliente ON contas_receber(codigo_cliente);

-- ---------- MOVIMENTOS (extrato/conciliação) ----------
CREATE TABLE IF NOT EXISTS movimentos (
    id                      BIGSERIAL PRIMARY KEY,
    empresa_id              INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    omie_codigo             BIGINT NOT NULL,
    conta_bancaria          VARCHAR(100),
    tipo                    VARCHAR(32),                -- 'credito' | 'debito' | 'transferencia'
    data_movimento          DATE,
    valor                   NUMERIC(15,2),
    descricao               TEXT,
    categoria               VARCHAR(100),
    conciliado              BOOLEAN DEFAULT FALSE,
    raw                     JSONB,
    synced_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empresa_id, omie_codigo)
);
CREATE INDEX IF NOT EXISTS idx_movimentos_empresa ON movimentos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_movimentos_data ON movimentos(data_movimento);
CREATE INDEX IF NOT EXISTS idx_movimentos_tipo ON movimentos(tipo);

-- ---------- CONTAS BANCÁRIAS ----------
CREATE TABLE IF NOT EXISTS contas_bancarias (
    id                      BIGSERIAL PRIMARY KEY,
    empresa_id              INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    omie_codigo             BIGINT NOT NULL,
    nome                    VARCHAR(100),
    banco                   VARCHAR(100),
    agencia                 VARCHAR(20),
    conta                   VARCHAR(30),
    tipo                    VARCHAR(32),                -- 'corrente' | 'poupanca' | 'caixa'
    saldo_atual             NUMERIC(15,2),
    ativa                   BOOLEAN DEFAULT TRUE,
    raw                     JSONB,
    synced_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empresa_id, omie_codigo)
);

-- ---------- CATEGORIAS ----------
CREATE TABLE IF NOT EXISTS categorias (
    id                      BIGSERIAL PRIMARY KEY,
    empresa_id              INTEGER REFERENCES empresas(id) ON DELETE CASCADE, -- null = global
    omie_codigo             VARCHAR(50) NOT NULL,
    nome                    VARCHAR(100) NOT NULL,
    tipo                    VARCHAR(32),                -- 'receita' | 'despesa'
    raw                     JSONB,
    synced_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empresa_id, omie_codigo)
);

-- ---------- NOTAS FISCAIS DE ENTRADA ----------
CREATE TABLE IF NOT EXISTS nf_entrada (
    id                      BIGSERIAL PRIMARY KEY,
    empresa_id              INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    omie_codigo             BIGINT NOT NULL,
    numero                  VARCHAR(50),
    serie                   VARCHAR(10),
    chave_acesso            VARCHAR(50),
    codigo_fornecedor       BIGINT,
    nome_fornecedor         VARCHAR(255),
    data_emissao            DATE,
    data_entrada            DATE,
    valor_total             NUMERIC(15,2),
    valor_produtos          NUMERIC(15,2),
    valor_impostos          NUMERIC(15,2),
    status                  VARCHAR(32),
    raw                     JSONB,
    synced_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empresa_id, omie_codigo)
);
CREATE INDEX IF NOT EXISTS idx_nf_empresa ON nf_entrada(empresa_id);
CREATE INDEX IF NOT EXISTS idx_nf_data ON nf_entrada(data_emissao);
CREATE INDEX IF NOT EXISTS idx_nf_fornecedor ON nf_entrada(codigo_fornecedor);

-- ---------- FORNECEDORES ----------
CREATE TABLE IF NOT EXISTS fornecedores (
    id                      BIGSERIAL PRIMARY KEY,
    empresa_id              INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    omie_codigo             BIGINT NOT NULL,
    razao_social            VARCHAR(255),
    nome_fantasia           VARCHAR(255),
    cnpj_cpf                VARCHAR(20),
    email                   VARCHAR(255),
    telefone                VARCHAR(30),
    cidade                  VARCHAR(100),
    estado                  VARCHAR(2),
    raw                     JSONB,
    synced_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (empresa_id, omie_codigo)
);
CREATE INDEX IF NOT EXISTS idx_fornecedores_empresa ON fornecedores(empresa_id);
CREATE INDEX IF NOT EXISTS idx_fornecedores_nome ON fornecedores(razao_social);

-- ---------- SEED das 3 empresas ----------
INSERT INTO empresas (nome, omie_app_key, notes) VALUES
    ('Mococa',          (SELECT omie_app_key FROM empresas WHERE nome='Mococa'),          'Placeholder — OMIE Mococa'),
    ('Tudo de Filtro',  (SELECT omie_app_key FROM empresas WHERE nome='Tudo de Filtro'),  'Placeholder — OMIE TDF'),
    ('American',        (SELECT omie_app_key FROM empresas WHERE nome='American'),        'Placeholder — OMIE American')
ON CONFLICT (nome) DO NOTHING;

-- Comentários pra documentação
COMMENT ON TABLE empresas       IS 'Empresas do grupo TDF (uma por OMIE)';
COMMENT ON TABLE sync_log       IS 'Histórico de cada sync OMIE → Postgres';
COMMENT ON TABLE clientes       IS 'Cadastro de clientes (snapshot OMIE)';
COMMENT ON TABLE contas_pagar   IS 'Contas a pagar — alimenta Fluxo de Caixa, DRE';
COMMENT ON TABLE contas_receber IS 'Contas a receber — alimenta Fluxo de Caixa, DRE';
COMMENT ON TABLE movimentos     IS 'Movimentações bancárias (extrato)';
COMMENT ON TABLE contas_bancarias IS 'Cadastro de contas bancárias + saldo';
COMMENT ON TABLE categorias     IS 'Plano de categorias (receitas/despesas)';
COMMENT ON TABLE nf_entrada     IS 'Notas fiscais de entrada (compras)';
COMMENT ON TABLE fornecedores   IS 'Cadastro de fornecedores';
