-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
-- Execute estas policies se o Supabase tiver RLS ativado

-- ─────────────────────────────────────────────────────
-- Tabela: livro
-- ─────────────────────────────────────────────────────
-- Habilitar RLS (se ainda não estiver)
ALTER TABLE livro ENABLE ROW LEVEL SECURITY;

-- Política de SELECT: qualquer um pode ler livros
CREATE POLICY "Enable read access for all users" 
  ON livro 
  FOR SELECT 
  USING (true);

-- Política de INSERT: apenas admin pode inserir
CREATE POLICY "Enable insert for admin users" 
  ON livro 
  FOR INSERT 
  WITH CHECK (true);

-- Política de UPDATE: apenas admin pode atualizar
CREATE POLICY "Enable update for admin users" 
  ON livro 
  FOR UPDATE 
  USING (true);

-- Política de DELETE: apenas admin pode deletar
CREATE POLICY "Enable delete for admin users" 
  ON livro 
  FOR DELETE 
  USING (true);

-- ─────────────────────────────────────────────────────
-- Tabela: emprestimo
-- ─────────────────────────────────────────────────────
-- Habilitar RLS (se ainda não estiver)
ALTER TABLE emprestimo ENABLE ROW LEVEL SECURITY;

-- Política de SELECT: qualquer um pode ler empréstimos
CREATE POLICY "Enable read access for all users on emprestimo" 
  ON emprestimo 
  FOR SELECT 
  USING (true);

-- Política de INSERT: qualquer usuário autenticado pode inserir
CREATE POLICY "Enable insert for authenticated users on emprestimo" 
  ON emprestimo 
  FOR INSERT 
  WITH CHECK (true);

-- Política de UPDATE: qualquer usuário autenticado pode atualizar
CREATE POLICY "Enable update for authenticated users on emprestimo" 
  ON emprestimo 
  FOR UPDATE 
  USING (true);

-- Política de DELETE: qualquer usuário autenticado pode deletar
CREATE POLICY "Enable delete for authenticated users on emprestimo" 
  ON emprestimo 
  FOR DELETE 
  USING (true);

-- ─────────────────────────────────────────────────────
-- Tabela: profiles
-- ─────────────────────────────────────────────────────
-- Habilitar RLS (se ainda não estiver)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política de SELECT: cada usuário pode ver seu próprio perfil e admins veem todos
CREATE POLICY "Enable read access for own profile or admin" 
  ON profiles 
  FOR SELECT 
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política de INSERT: qualquer usuário autenticado pode criar seu próprio perfil
CREATE POLICY "Enable insert for self" 
  ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Política de UPDATE: cada usuário pode atualizar seu próprio perfil
CREATE POLICY "Enable update for self" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);
