# Folhear - Biblioteca

Um sistema completo de gerenciamento de biblioteca com autenticação de usuários, controle de empréstimos e histórico de transações.

## Recursos

- 📚 **Catálogo de Livros**: Browse e busca de livros disponíveis
- 👥 **Autenticação**: Login e registro de usuários com Supabase
- 📋 **Gerenciamento de Empréstimos**: Controle de livros emprestados
- 📊 **Dashboard**: Visualização de estatísticas e informações do usuário
- 📜 **Histórico**: Rastreamento de todas as transações
- 🎨 **Interface Moderna**: Design responsivo com componentes customizados

## Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend/Autenticação**: Supabase
- **Banco de Dados**: PostgreSQL (via Supabase)
- **HTTP Client**: Axios

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── pages/           # Páginas da aplicação
├── contexts/        # React Contexts
├── services/        # Serviços (API, Supabase)
├── types/           # Tipos TypeScript
├── utils/           # Funções utilitárias
└── App.tsx          # Componente principal
```

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/pedrosilvasilva807/Folhear_Biblioteca.git
cd folhear-biblioteca-full-stack-development
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com suas credenciais do Supabase:
```
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## Uso

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse a aplicação em `http://localhost:5173`

## Build

Para criar um build de produção:
```bash
npm run build
```

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

Pedro Silva
