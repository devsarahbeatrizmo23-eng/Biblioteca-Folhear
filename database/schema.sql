-- =====================================================
-- Folhear Biblioteca - Supabase Schema (PostgreSQL)
-- =====================================================
-- Este script define a estrutura de banco de dados
-- para uso com Supabase ou PostgreSQL puro.
--
-- Estrutura:
-- - auth.users (gerenciado pelo Supabase Auth)
-- - profiles (vinculada aos usuários do Auth)
-- - livro (acervo da biblioteca)
-- - emprestimo (registro de empréstimos)
-- =====================================================

-- ─────────────────────────────────────────────────────
-- Extensões necessárias
-- ─────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- para UUID e funções criptográficas

-- ─────────────────────────────────────────────────────
-- Tipos ENUM
-- ─────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE role_enum AS ENUM ('admin', 'leitor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE status_emprestimo AS ENUM ('pendente', 'devolvido', 'atrasado');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─────────────────────────────────────────────────────
-- Tabela: profiles (vinculada ao auth.users do Supabase)
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            uuid              PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name          VARCHAR(100)      NOT NULL,
  role          role_enum         NOT NULL DEFAULT 'leitor',
  created_at    TIMESTAMPTZ       NOT NULL DEFAULT NOW(),

  CONSTRAINT profiles_name_len CHECK (char_length(name) > 0 AND char_length(name) <= 100)
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);

-- ─────────────────────────────────────────────────────
-- Tabela: livro
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS livro (
  id                  SERIAL        NOT NULL,
  title               VARCHAR(200)  NOT NULL,
  author              VARCHAR(100)  NOT NULL,
  publisher           VARCHAR(100)  NOT NULL,
  isbn                VARCHAR(20)   NOT NULL,
  category            VARCHAR(50)   NOT NULL,
  publication_year    SMALLINT      NOT NULL,  -- substitui o tipo YEAR do MySQL
  total_quantity      INT           NOT NULL DEFAULT 1,
  available_quantity  INT           NOT NULL DEFAULT 1,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT uq_livro_isbn UNIQUE (isbn),
  CONSTRAINT chk_publication_year CHECK (publication_year BETWEEN 1000 AND 9999),
  CONSTRAINT chk_total_quantity     CHECK (total_quantity >= 0),
  CONSTRAINT chk_available_quantity CHECK (available_quantity >= 0 AND available_quantity <= total_quantity)
);

CREATE INDEX IF NOT EXISTS idx_livro_isbn     ON livro (isbn);
CREATE INDEX IF NOT EXISTS idx_livro_category ON livro (category);
CREATE INDEX IF NOT EXISTS idx_livro_author   ON livro (author);

-- ─────────────────────────────────────────────────────
-- Tabela: emprestimo
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emprestimo (
  id                    SERIAL              NOT NULL,
  user_id               uuid                NOT NULL,
  book_id               INT                 NOT NULL,
  loan_date             DATE                NOT NULL,
  expected_return_date  DATE                NOT NULL,
  actual_return_date    DATE                NULL DEFAULT NULL,
  status                status_emprestimo   NOT NULL DEFAULT 'pendente',
  observations          TEXT                NULL,
  created_at            TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_emprestimo_profiles FOREIGN KEY (user_id)
    REFERENCES profiles (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_emprestimo_livro FOREIGN KEY (book_id)
    REFERENCES livro (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_return_after_loan CHECK (
    actual_return_date IS NULL OR actual_return_date >= loan_date
  )
);

CREATE INDEX IF NOT EXISTS idx_emprestimo_user_id ON emprestimo (user_id);
CREATE INDEX IF NOT EXISTS idx_emprestimo_book_id ON emprestimo (book_id);
CREATE INDEX IF NOT EXISTS idx_emprestimo_status  ON emprestimo (status);

-- ─────────────────────────────────────────────────────
-- Seed: Dados de demonstração
-- ─────────────────────────────────────────────────────
-- IMPORTANTE: Os usuários são gerenciados via Supabase Auth (tabela auth.users).
-- Os perfis (profiles) são criados automaticamente após o registro/login.
--
-- Credenciais de demonstração (devem ser criadas via Supabase Auth ou UI):
-- - Admin: admin@folhear.com / admin123
-- - Leitor: leitor@folhear.com / leitor123