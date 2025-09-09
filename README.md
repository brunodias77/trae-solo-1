# BetsApp - Sistema de Apostas de Futebol

Sistema completo de apostas de futebol desenvolvido com .NET 8 (backend) e Angular 20 (frontend).

## 🏗️ Arquitetura

### Backend (.NET 8)
- **Clean Architecture** com 4 camadas:
  - `Domain`: Entidades e regras de negócio
  - `Application`: Casos de uso e interfaces
  - `Infrastructure`: Implementações e acesso a dados
  - `API`: Controllers e configurações
- **PostgreSQL** com Entity Framework Core
- **JWT Authentication** com refresh tokens
- **Swagger/OpenAPI** para documentação

### Frontend (Angular 20)
- **Standalone Components**
- **TypeScript 5**
- **TailwindCSS v4**
- **Páginas**: Login, Registro, Dashboard, Perfil, Apostas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 22+
- .NET 8 SDK
- Docker e Docker Compose

### 1. Configuração Inicial
```bash
# Copiar arquivo de ambiente
cp .env.example .env

# Editar variáveis de ambiente conforme necessário
# Especialmente: POSTGRES_PASSWORD, JWT_SECRET_KEY
```

### 2. Executar PostgreSQL com Docker

#### Scripts Automatizados
```bash
# Windows
.\start-containers.bat    # Iniciar PostgreSQL
.\stop-containers.bat     # Parar PostgreSQL

# Linux/Mac
./start-containers.sh     # Iniciar PostgreSQL
./stop-containers.sh      # Parar PostgreSQL
```

#### Comandos Docker Manuais
```bash
# Subir PostgreSQL
docker-compose up -d

# Parar PostgreSQL
docker-compose down
```

### 3. Executar Backend e Frontend Localmente

#### Após iniciar o PostgreSQL (passo 2):
```bash
# Terminal 1 - Backend
cd backend/src/BetsAPI
dotnet run

# Terminal 2 - Frontend
cd frontend
ng serve
```

#### Scripts NPM (Alternativa)
```bash
# Instalar dependências
npm run setup

# Executar backend e frontend simultaneamente
npm run dev

# Ou separadamente:
npm run backend:dev    # Backend apenas
npm run frontend:dev   # Frontend apenas
```

### 4. Build para Produção
```bash
# Build completo
npm run build

# Build individual:
npm run backend:build
npm run frontend:build
```

## 📊 Banco de Dados

### Estrutura
- **users**: Usuários do sistema
- **bets**: Apostas realizadas
- **transactions**: Histórico de transações

### Migrations
```bash
# Aplicar migrations
npm run backend:migrate

# Ou diretamente:
cd backend && dotnet ef database update
```

## 🔧 Scripts Disponíveis

```bash
# Frontend
npm run frontend:install  # Instalar dependências
npm run frontend:dev      # Servidor de desenvolvimento
npm run frontend:build    # Build para produção

# Backend
npm run backend:restore   # Restaurar pacotes
npm run backend:dev       # Executar em desenvolvimento
npm run backend:build     # Build para produção
npm run backend:migrate   # Aplicar migrations

# Docker
npm run docker:up         # Subir containers
npm run docker:down       # Parar containers
npm run docker:build      # Build das imagens

# Geral
npm run setup            # Setup completo do projeto
npm run dev              # Executar backend + frontend
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5062
- **Swagger**: http://localhost:5062/swagger
- **PostgreSQL**: localhost:5432

## 🐳 Scripts Docker

### Abordagem de Desenvolvimento
- **PostgreSQL**: Roda via Docker (isolado e consistente)
- **Backend**: Roda localmente com `dotnet run` (desenvolvimento ágil)
- **Frontend**: Roda localmente com `ng serve` (hot reload)

### Inicialização Automática
Os scripts `start-containers` verificam automaticamente:
- ✅ Se Docker está instalado e rodando
- ✅ Se arquivo `.env` existe (cria a partir do `.env.example`)
- ✅ Se PostgreSQL está saudável (healthcheck)
- ✅ Fornece instruções para iniciar backend e frontend

### Recursos dos Scripts
- **Verificação de dependências**: Docker, Docker Compose
- **Healthcheck automático**: PostgreSQL
- **Logs coloridos**: Melhor visualização do status
- **Instruções claras**: Como iniciar backend e frontend
- **Cross-platform**: Scripts para Windows (.bat) e Linux/Mac (.sh)

### Troubleshooting
```bash
# Ver logs do PostgreSQL
docker-compose logs -f

# Ver status do contêiner
docker-compose ps

# Reiniciar PostgreSQL
docker-compose restart postgres

# Parar e remover volumes (reset completo)
docker-compose down -v
```

## 📁 Estrutura do Projeto

```
├── backend/
│   ├── src/
│   │   ├── BetsDomain/        # Camada de domínio
│   │   ├── BetsApplication/   # Camada de aplicação
│   │   ├── BetsInfrastructure/# Camada de infraestrutura
│   │   └── BetsAPI/           # Camada de API
│   └── tests/                 # Testes unitários
├── frontend/
│   ├── src/
│   │   ├── app/               # Componentes Angular
│   │   └── ...
├── scripts/
│   └── init.sql               # Script de inicialização do DB
├── docker-compose.yml         # Configuração Docker
├── .env                       # Variáveis de ambiente
└── package.json               # Scripts e dependências
```

## 🔐 Segurança

- Todas as senhas e chaves estão no arquivo `.env`
- JWT com refresh tokens
- Hash de senhas com bcrypt
- Validação de entrada em todas as APIs

## 📝 Próximos Passos

1. Implementar entidades do domínio
2. Configurar Entity Framework e migrations
3. Implementar autenticação JWT
4. Criar controllers da API
5. Desenvolver componentes Angular
6. Integrar frontend com backend
7. Implementar testes unitários
8. Configurar CI/CD

---

**Desenvolvido com Clean Architecture e boas práticas de desenvolvimento.**
