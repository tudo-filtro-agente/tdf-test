-- ============================================================
-- TDF Portal — Etapa 3 / Parte 2
-- Schema de administração: portal_users + portal_metas
-- (estende a tabela users existente com campos de gestão)
-- ============================================================

-- Adiciona colunas na tabela users existente (idempotente)
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS portal_team     VARCHAR(32)  DEFAULT 'filtro';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS crm_owner      VARCHAR(255) DEFAULT '';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS meta_vendas     INTEGER      DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS meta_faturamento NUMERIC(15,2) DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS meta_loja       NUMERIC(15,2) DEFAULT 80000;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS meta_refil      NUMERIC(15,2) DEFAULT 15000;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Índice para busca por team
CREATE INDEX IF NOT EXISTS idx_users_team ON users(portal_team);

-- ---------- SEED: usuários do portal original ----------
-- Migrados do USERS{} em memória do portal original do Paulo
INSERT INTO users (username, email, full_name, role, password_hash, portal_team, crm_owner, is_active, must_reset, notes)
VALUES
    -- Admin principal
    ('marcos',    'marcosm_oliveira@hotmail.com',  'Marcos',           'admin',     NULL, 'admin',   'Marcos',              TRUE,  FALSE, 'Admin principal — redefinir senha'),
    ('financeiro','financeiro@tudodefiltro.com.br','Financeiro TDF',   'financeiro','$2a$10$qDClnl5UTqfOsN1KI5ilNeA9QsCkQJ9dq.Ja3sNcB0HA8NQP0eJ/u', 'financeiro','Financeiro TDF',     TRUE,  FALSE, 'Acesso restrito ao BI'),
    -- Equipe Filtro
    ('tiago',     NULL,                            'Tiago',            'viewer',    NULL, 'filtro',  'Tiago Souza',         TRUE,  TRUE,  'Closer'),
    ('julia',     NULL,                            'Júlia',            'viewer',    NULL, 'filtro',  'Júlia Souza',         TRUE,  TRUE,  'Closer'),
    ('italo',     NULL,                            'Italo',            'viewer',    NULL, 'poco',    'Italo Alexandre',     TRUE,  TRUE,  'Closer'),
    ('catia',     NULL,                            'Catia',            'viewer',    NULL, 'bebedouro','Catia Americo',      TRUE,  TRUE,  'Closer'),
    ('fabiana',   NULL,                            'Fabiana',          'viewer',    NULL, 'bebedouro','Fabiana Terra',      TRUE,  TRUE,  'Closer'),
    ('danubia',   'danubiaribeiro@tudodefiltro.com.br','Danúbia',   'viewer',    NULL, 'filtro',  'Danúbia Ribeiro',     TRUE,  TRUE,  'Closer'),
    ('daniela',   'daniela@tudodefiltro.com.br',   'Daniela',          'viewer',    NULL, 'filtro',  'Daniela',             TRUE,  TRUE,  'Gestor refil'),
    ('thais',     NULL,                            'Thais',            'admin',     NULL, 'posvenda','Thais',               TRUE,  FALSE, 'Admin pós-venda'),
    ('christopher',NULL,                           'Christopher',      'viewer',    NULL, 'filtro',  'Christopher',         TRUE,  TRUE,  'Closer'),
    ('manoel',    NULL,                            'Manoel',           'viewer',    NULL, 'filtro',  'Manoel',              TRUE,  TRUE,  'Closer'),
    ('morgana',   NULL,                            'Morgana',          'viewer',    NULL, 'posvenda','Morgana',             TRUE,  TRUE,  'Pós-venda'),
    -- Loja física
    ('edson',     NULL,                            'Edson',            'viewer',    NULL, 'loja',    'Edson',               TRUE,  TRUE,  'Loja física'),
    ('taina',     NULL,                            'Tainá',           'viewer',    NULL, 'loja',    'Tainá',               TRUE,  TRUE,  'Loja física'),
    ('gabrielly', NULL,                            'Gabrielly',        'viewer',    NULL, 'loja',    'Gabrielly',           TRUE,  TRUE,  'Loja física')
ON CONFLICT (username) DO NOTHING;

-- Atualiza senha do financeiro (que veio NULL do primeiro seed)
UPDATE users SET password_hash = '$2a$10$qDClnl5UTqfOsN1KI5ilNeA9QsCkQJ9dq.Ja3sNcB0HA8NQP0eJ/u'
WHERE username = 'financeiro' AND password_hash IS NULL;
