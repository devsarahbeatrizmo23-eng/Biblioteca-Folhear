# Configuração do Banco de Dados - Folhear Biblioteca

## Descrição

Este diretório contém os scripts SQL para configurar o banco de dados Supabase da aplicação Folhear Biblioteca.

## Arquivos

### `schema.sql`
Define a estrutura do banco de dados:
- Tabela `profiles`: perfis de usuários (vinculados ao Supabase Auth)
- Tabela `livro`: catálogo de livros
- Tabela `emprestimo`: registro de empréstimos

### `rls-policies.sql`
Define as políticas de Row Level Security (RLS) para controle de acesso.

## Como Configurar

### 1. Executar o Schema

No Supabase:
1. Vá para **SQL Editor**
2. Crie uma nova query
3. Copie e cole o conteúdo de `schema.sql`
4. Execute a query

### 2. Executar as Políticas de RLS

⚠️ **IMPORTANTE**: Se você receber erros de permissão ao tentar inserir livros, execute `rls-policies.sql`:

1. Vá para **SQL Editor**
2. Crie uma nova query
3. Copie e cole o conteúdo de `rls-policies.sql`
4. Execute a query

Ou pode fazer manualmente:
1. Vá para **Authentication > Policies**
2. Selecione a tabela `livro`
3. Crie políticas para permitir INSERT/UPDATE/DELETE para usuários autenticados

## Troubleshooting

### Erro ao inserir livros: "Permission denied"

**Solução**: As políticas RLS podem estar impedindo a inserção. Execute `rls-policies.sql` ou configure manualmente as políticas no painel do Supabase.

### Tabelas não aparecem no Supabase

**Solução**: Verifique se o schema.sql foi executado corretamente. Procure por erros na execução.

### Livros não sincronizam com Supabase

**Solução**: Verifique:
1. As variáveis de ambiente `.env` estão corretas
2. A tabela `livro` existe no banco
3. As políticas RLS permitem INSERT
4. Abra o DevTools (F12) e verifique os logs do console

## Estrutura de Dados

### Tabela: livro
```sql
id                  SERIAL PRIMARY KEY
title               VARCHAR(200) NOT NULL
author              VARCHAR(100) NOT NULL
publisher           VARCHAR(100) NOT NULL
isbn                VARCHAR(20) UNIQUE NOT NULL
category            VARCHAR(50) NOT NULL
publication_year    SMALLINT NOT NULL
total_quantity      INT NOT NULL DEFAULT 1
available_quantity  INT NOT NULL DEFAULT 1
created_at          TIMESTAMPTZ DEFAULT NOW()
```

### Tabela: emprestimo
```sql
id                    SERIAL PRIMARY KEY
user_id               UUID NOT NULL (FK → profiles.id)
book_id               INT NOT NULL (FK → livro.id)
loan_date             DATE NOT NULL
expected_return_date  DATE NOT NULL
actual_return_date    DATE
status                status_emprestimo ('pendente', 'devolvido', 'atrasado')
observations          TEXT
created_at            TIMESTAMPTZ DEFAULT NOW()
```

### Tabela: profiles
```sql
id          UUID PRIMARY KEY (FK → auth.users.id)
name        VARCHAR(100) NOT NULL
role        role_enum ('admin', 'leitor') DEFAULT 'leitor'
created_at  TIMESTAMPTZ DEFAULT NOW()
```

## Variáveis de Ambiente Necessárias

No arquivo `.env`:
```
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

Essas variáveis já estão configuradas no projeto.
