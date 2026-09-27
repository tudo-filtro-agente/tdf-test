-- ============================================================
-- TDF Portal — Etapa 1 / Parte 1
-- Schema de autenticação + trava OMIE só leitura
-- Roda na inicialização do servidor (idempotente)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Papéis do portal
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'financeiro', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(64) UNIQUE NOT NULL,
    email           VARCHAR(255),
    full_name       VARCHAR(255),
    role            user_role NOT NULL DEFAULT 'viewer',
    password_hash   VARCHAR(255),                 -- bcrypt; NULL até redefinir
    must_reset      BOOLEAN NOT NULL DEFAULT TRUE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ,
    notes           TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ---------- ACCESS TOKENS (link de 1º acesso / reset) ----------
CREATE TABLE IF NOT EXISTS access_tokens (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,  -- SHA-256 do token cru
    purpose         VARCHAR(32) NOT NULL,          -- 'first_access' | 'reset_password'
    expires_at      TIMESTAMPTZ NOT NULL,
    used_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tokens_user ON access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_hash ON access_tokens(token_hash);

-- ---------- SESSIONS ----------
CREATE TABLE IF NOT EXISTS sessions (
    id              VARCHAR(64) PRIMARY KEY,        -- cookie session id
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    ip              VARCHAR(45),
    user_agent      TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ---------- AUDIT LOG ----------
CREATE TABLE IF NOT EXISTS audit_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    username        VARCHAR(64),                   -- snapshot (caso user seja apagado)
    action          VARCHAR(64) NOT NULL,          -- 'login', 'logout', 'login_failed', etc.
    target          VARCHAR(255),                  -- recurso afetado
    meta            JSONB,                         -- dados extras
    ip              VARCHAR(45),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- ============================================================
-- Comentários para documentar
-- ============================================================
COMMENT ON TABLE users IS 'Usuários do portal — admins e financeiro';
COMMENT ON TABLE access_tokens IS 'Tokens de 1º acesso e reset de senha (válidos 24h)';
COMMENT ON TABLE sessions IS 'Sessões ativas (cookie httpOnly)';
COMMENT ON TABLE audit_log IS 'Trilha de auditoria — login, falhas, OMIE calls, etc.';
