# 🚀 Guia de Boas-Vindas - Sistema SIGMA PLI

Bem-vindo ao **Sistema Integrado de Gestão e Monitoramento Acadêmico - PLI**!
Este guia irá te orientar sobre como usar a plataforma e explorar todos os seus
recursos.

## 🎯 O que é o SIGMA PLI?

O SIGMA PLI é uma plataforma modular desenvolvida para gestão acadêmica, com
foco em:

- **Gestão de Produtos** (recebimento, análise e avaliação)
- **Relatórios Detalhados** (resumos e análises)
- **Dashboard Administrativo** (visão geral e controle)
- **Sistema de Autenticação** (segurança e permissões)
- **Configurações Avançadas** (personalização do sistema)

## 🏗️ Arquitetura da Plataforma

### Estrutura Modular

```
SIGMA_PLI/
├── 📂 src/modules/          # Módulos da aplicação
│   ├── 🏠 core/            # Módulo principal (Dashboard)
│   ├── 📦 products/        # Gestão de produtos
│   ├── 📊 reports/         # Relatórios e análises
│   ├── 🔐 auth/            # Autenticação
│   └── ⚙️ settings/        # Configurações
├── 📂 api/                 # APIs REST (em desenvolvimento)
├── 📂 public/              # Arquivos estáticos
├── 📂 database/            # Scripts de banco de dados
├── 📂 config/              # Configurações da aplicação
└── 📂 deployment/          # Scripts de deploy
```

## 🚀 Como Executar a Aplicação

### Pré-requisitos

- Node.js v16+
- npm ou yarn
- MySQL 8.0+
- Redis (opcional, para cache)

### 1. Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd SIGMA_PLI

# Instalar dependências
npm install
```

### 2. Configuração

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações no arquivo .env
# Configurar banco de dados, JWT, etc.
```

### 3. Executar a Aplicação

#### Modo Desenvolvimento

```bash
# Servidor com hot-reload
npm run dev

# Ou usando Docker
docker-compose -f docker-compose.dev.yml up
```

#### Modo Produção

```bash
# Build da aplicação
npm run build

# Iniciar servidor
npm start

# Ou usando Docker
docker-compose up -d
```

### 4. Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **phpMyAdmin**: http://localhost:8080 (se usando Docker)

## 🗂️ Tour pelos Módulos

### 🏠 1. CORE (Dashboard Principal)

**Localização**: `src/modules/core/`

**O que está implementado:**

- ✅ Estrutura modular básica
- ✅ Templates HTML (dashboard e index)
- ✅ Estilos CSS responsivos
- ✅ JavaScript frontend
- ✅ Configuração de rotas
- ✅ Sistema de inicialização

**O que ainda precisa ser implementado:**

- ❌ Controllers (dashboard, users, events, notifications)
- ❌ Models para banco de dados
- ❌ APIs REST
- ❌ Middleware de autenticação
- ❌ Integração com banco de dados

**Funcionalidades Planejadas:**

- Dashboard com estatísticas em tempo real
- Gestão de usuários e permissões
- Calendário de eventos
- Sistema de notificações
- Logs de atividades

### 📦 2. PRODUCTS (Gestão de Produtos)

**Localização**: `src/modules/products/`

**O que está implementado:**

- ✅ Estrutura de pastas
- ✅ Templates básicos
- ✅ Estilos CSS

**O que ainda precisa ser implementado:**

- ❌ Sistema de recebimento de produtos
- ❌ Workflow de análise
- ❌ Sistema de avaliação
- ❌ Controle de qualidade
- ❌ Integração com fornecedores

**Funcionalidades Planejadas:**

- Recepção automatizada de produtos
- Análise estruturada por critérios
- Sistema de notas e avaliações
- Workflow de aprovação
- Histórico de produtos

### 📊 3. REPORTS (Relatórios)

**Localização**: `src/modules/reports/`

**O que está implementado:**

- ✅ Estrutura de pastas
- ✅ Templates básicos

**O que ainda precisa ser implementado:**

- ❌ Engine de relatórios
- ❌ Visualizações gráficas
- ❌ Exportação de dados
- ❌ Relatórios customizáveis
- ❌ Análises estatísticas

**Funcionalidades Planejadas:**

- Relatórios por período
- Gráficos interativos
- Exportação em PDF/Excel
- Análises comparativas
- Dashboards customizáveis

### 🔐 4. AUTH (Autenticação)

**Localização**: `src/modules/auth/`

**O que está implementado:**

- ✅ Estrutura de pastas
- ✅ Templates básicos

**O que ainda precisa ser implementado:**

- ❌ Sistema de login/logout
- ❌ JWT token management
- ❌ Middleware de autenticação
- ❌ Controle de permissões
- ❌ Recuperação de senha

**Funcionalidades Planejadas:**

- Login seguro com JWT
- Controle de sessões
- Níveis de permissão
- Auditoria de acesso
- Integração com LDAP/AD

### ⚙️ 5. SETTINGS (Configurações)

**Localização**: `src/modules/settings/`

**O que está implementado:**

- ✅ Estrutura de pastas
- ✅ Templates básicos

**O que ainda precisa ser implementado:**

- ❌ Interface de configurações
- ❌ Gestão de parâmetros
- ❌ Backup/restore
- ❌ Logs do sistema
- ❌ Manutenção

## 🔧 Ferramentas de Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build de produção
npm run build:dev       # Build de desenvolvimento
npm run build:watch     # Build com watch mode

# Testes
npm test                # Executar testes
npm run test:watch      # Testes em watch mode
npm run test:coverage   # Cobertura de testes

# Linting e Formatação
npm run lint            # Verificar lint
npm run lint:fix        # Corrigir lint automaticamente
npm run format          # Formatar código com Prettier

# Módulos
npm run module:core     # Deploy módulo core
npm run module:products # Deploy módulo products
npm run module:reports  # Deploy módulo reports
npm run module:auth     # Deploy módulo auth
npm run module:settings # Deploy módulo settings
npm run modules:list    # Listar módulos
npm run modules:status  # Status dos módulos

# Docker
npm run docker:build    # Build imagem Docker
npm run docker:run      # Executar container
npm run docker:up       # Docker Compose up
npm run docker:down     # Docker Compose down
```

## 📁 Estrutura de Arquivos Importantes

### Configuração

- `config/app.config.js` - Configurações principais
- `.env` - Variáveis de ambiente
- `package.json` - Dependências e scripts
- `docker-compose.yml` - Configuração Docker

### Desenvolvimento

- `server.js` - Servidor Express principal
- `webpack.config.js` - Configuração Webpack
- `jest.config.json` - Configuração de testes
- `.eslintrc.json` - Regras de lint

### Deployment

- `Dockerfile` - Imagem Docker
- `deployment/deploy-module.js` - Script de deploy
- `.github/workflows/` - CI/CD GitHub Actions

## 🌐 APIs e Endpoints

### Estrutura de APIs (Planejada)

```
/api/v1/
├── /auth/           # Autenticação
├── /core/           # Dashboard e usuários
├── /products/       # Gestão de produtos
├── /reports/        # Relatórios
└── /settings/       # Configurações
```

### Endpoints Principais (Em Desenvolvimento)

```
GET  /api/v1/dashboard        # Dashboard principal
GET  /api/v1/users            # Lista usuários
POST /api/v1/auth/login       # Login
POST /api/v1/products         # Criar produto
GET  /api/v1/reports          # Lista relatórios
```

## 🔍 Como Contribuir

### 1. Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Verificar lint
npm run lint
```

### 2. Estrutura de Commits

```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
style: formatação de código
refactor: refatoração
test: adicionar testes
```

### 3. Criação de Módulos

```bash
# Usar o script de deploy para criar/atualizar módulos
npm run module:core

# Verificar status dos módulos
npm run modules:status
```

## 📊 Status de Implementação

### ✅ Implementado (100%)

- Estrutura modular completa
- Sistema de build (Webpack)
- Configuração de desenvolvimento
- Testes básicos
- Lint e formatação
- Docker e Docker Compose
- CI/CD com GitHub Actions

### 🔄 Em Desenvolvimento (30%)

- Sistema de autenticação
- APIs REST básicas
- Interface de usuário
- Integração com banco de dados

### ⏳ Planejado (0%)

- Módulos funcionais completos
- Sistema de relatórios
- Gestão de produtos
- Dashboard avançado
- Testes de integração

## 🎯 Próximos Passos

### Prioridade Alta

1. **Implementar Controllers** - Criar lógica de negócio
2. **Configurar Banco de Dados** - Models e migrações
3. **Desenvolver APIs REST** - Endpoints funcionais
4. **Sistema de Autenticação** - JWT e middleware

### Prioridade Média

1. **Interface de Usuário** - Melhorar templates
2. **Sistema de Testes** - Cobertura completa
3. **Documentação** - API docs e guias

### Prioridade Baixa

1. **Otimizações** - Performance e cache
2. **Integração Avançada** - Serviços externos
3. **Monitoring** - Logs e métricas

## 🆘 Ajuda e Suporte

### Logs

```bash
# Verificar logs da aplicação
tail -f logs/app.log

# Logs do Docker
docker-compose logs -f
```

### Debugging

```bash
# Modo debug
NODE_ENV=development DEBUG=* npm run dev

# Verificar saúde da aplicação
curl http://localhost:3000/health
```

### Contato

- **Email**: suporte@sigma-pli.com
- **Issues**: GitHub Issues
- **Documentação**: `/docs/`

---

## 🎉 Bem-vindo ao SIGMA PLI!

Este sistema está em constante evolução. Sua contribuição é fundamental para o
sucesso do projeto. Explore, experimente e contribua!

**Boa codificação! 🚀**
