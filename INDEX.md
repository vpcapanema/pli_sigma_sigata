# 📚 Documentação SIGMA PLI - Índice Principal

Bem-vindo à documentação completa do **Sistema Integrado de Gestão e
Monitoramento Acadêmico - PLI**!

## 📖 Guias Disponíveis

### 🚀 **[Guia de Boas-Vindas](./GUIA_BOAS_VINDAS.md)**

**Para**: Novos desenvolvedores e usuários  
**Conteúdo**: Tour completo da plataforma, arquitetura e funcionalidades  
**Tempo de leitura**: 15 minutos

### 🏃‍♂️ **[Como Rodar a API](./COMO_RODAR_API.md)**

**Para**: Desenvolvedores que querem executar o projeto  
**Conteúdo**: Instruções passo-a-passo para rodar local e Docker  
**Tempo de leitura**: 5 minutos

### 📊 **[Status de Implementação](./STATUS_IMPLEMENTACAO.md)**

**Para**: Gerentes de projeto e desenvolvedores  
**Conteúdo**: Estado atual detalhado de cada funcionalidade  
**Tempo de leitura**: 10 minutos

### 🗺️ **[Roadmap](./ROADMAP.md)**

**Para**: Equipe de desenvolvimento e stakeholders  
**Conteúdo**: Cronograma, sprints e próximos passos  
**Tempo de leitura**: 12 minutos

---

## 🎯 Acesso Rápido

### 🔥 **Começar Agora**

```bash
# Clonar e executar
git clone <repositorio>
cd SIGMA_PLI
npm install
npm run dev
```

👉 **[Instruções Completas](./COMO_RODAR_API.md)**

### 📊 **Status Atual**

- **Infraestrutura**: ✅ 90% Completo
- **Backend**: 🔄 30% Completo
- **Frontend**: ⏳ 20% Completo
- **APIs**: ⏳ 15% Completo

👉 **[Detalhes Completos](./STATUS_IMPLEMENTACAO.md)**

### 🎯 **Próximos Passos**

1. Configurar banco de dados
2. Implementar autenticação JWT
3. Criar controllers básicos
4. Desenvolver APIs REST

👉 **[Roadmap Completo](./ROADMAP.md)**

---

## 🏗️ Arquitetura do Sistema

### Estrutura Modular

```
SIGMA_PLI/
├── 🏠 core/        # Dashboard e usuários
├── 📦 products/    # Gestão de produtos
├── 📊 reports/     # Relatórios
├── 🔐 auth/        # Autenticação
└── ⚙️ settings/    # Configurações
```

### Tecnologias

- **Backend**: Node.js, Express, MySQL
- **Frontend**: Vanilla JS, HTML5, CSS3
- **Build**: Webpack, Babel
- **Quality**: ESLint, Prettier, Jest
- **DevOps**: Docker, GitHub Actions

---

## 🚀 Estados da Aplicação

### ✅ **Funcionando**

- Servidor Express rodando
- Sistema de módulos carregando
- Build e testes passando
- Docker funcionando
- Lint e formatação OK

### 🔄 **Em Desenvolvimento**

- Banco de dados (configurado, não conectado)
- Autenticação (estruturado, não funcional)
- Controllers (definidos, não implementados)
- APIs REST (rotas criadas, não funcionais)

### ⏳ **Planejado**

- Interface de usuário completa
- Funcionalidades de negócio
- Testes de integração
- Deploy em produção

---

## 📁 Documentação Técnica

### 📋 **Arquitetura**

- **[Architecture.md](./docs/architecture.md)** - Visão geral da arquitetura
- **[README.md](./README.md)** - Documentação principal do projeto

### 🔧 **Configuração**

- **[.env.example](./.env.example)** - Variáveis de ambiente
- **[package.json](./package.json)** - Dependências e scripts
- **[docker-compose.yml](./docker-compose.yml)** - Configuração Docker

### 📚 **Códigos**

- **[server.js](./server.js)** - Servidor principal
- **[config/app.config.js](./config/app.config.js)** - Configurações
- **[src/modules/](./src/modules/)** - Módulos da aplicação

---

## 🔗 Links Úteis

### 🌐 **Aplicação** (quando rodando)

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

### 🐳 **Docker** (quando usando Docker)

- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

### 📊 **Desenvolvimento**

- **Bundle Analyzer**: `dist/bundle-report.html`
- **Logs**: `logs/app.log`
- **Coverage**: `coverage/lcov-report/index.html`

---

## 🎯 Workflows por Persona

### 👨‍💻 **Desenvolvedor Backend**

1. **[Como Rodar a API](./COMO_RODAR_API.md)** - Setup inicial
2. **[Status de Implementação](./STATUS_IMPLEMENTACAO.md)** - O que implementar
3. **[Roadmap](./ROADMAP.md)** - Prioridades e cronograma
4. **[Architecture.md](./docs/architecture.md)** - Decisões técnicas

### 👩‍💻 **Desenvolvedora Frontend**

1. **[Guia de Boas-Vindas](./GUIA_BOAS_VINDAS.md)** - Entender o projeto
2. **[Como Rodar a API](./COMO_RODAR_API.md)** - Rodar local
3. **[Status de Implementação](./STATUS_IMPLEMENTACAO.md)** - Estado do frontend
4. **Templates**: `src/modules/*/templates/`

### 🏗️ **DevOps**

1. **[Como Rodar a API](./COMO_RODAR_API.md)** - Setup e Docker
2. **[docker-compose.yml](./docker-compose.yml)** - Configuração
3. **[.github/workflows/](./.github/workflows/)** - CI/CD
4. **[Dockerfile](./Dockerfile)** - Build da aplicação

### 📊 **Gerente de Projeto**

1. **[Status de Implementação](./STATUS_IMPLEMENTACAO.md)** - Estado atual
2. **[Roadmap](./ROADMAP.md)** - Cronograma e entregas
3. **[Guia de Boas-Vindas](./GUIA_BOAS_VINDAS.md)** - Visão geral
4. **[README.md](./README.md)** - Documentação oficial

---

## 🆘 Suporte e Contato

### 📞 **Canais de Suporte**

- **Issues**: GitHub Issues
- **Email**: suporte@sigma-pli.com
- **Docs**: Esta documentação

### 🐛 **Problemas Comuns**

- **Porta em uso**: `lsof -i :3000` e `kill -9 <PID>`
- **Dependências**: `rm -rf node_modules && npm install`
- **Docker**: `docker-compose down && docker-compose up -d`

### 📚 **Recursos Adicionais**

- **Node.js**: https://nodejs.org/docs
- **Express**: https://expressjs.com/
- **Docker**: https://docs.docker.com/

---

## 🔄 Atualizações

### 📅 **Histórico**

- **2025-07-07**: Criação da documentação completa
- **2025-07-07**: Correção de todos os problemas de lint
- **2025-07-07**: Servidor funcionando corretamente

### 🔮 **Próximas Atualizações**

- **2025-07-14**: Status após implementação do backend
- **2025-07-21**: Status após implementação do frontend
- **2025-07-28**: Status após primeiro módulo completo

---

## 🏆 **Começar Agora!**

Escolha seu guia baseado no seu objetivo:

- **🚀 Quero executar o projeto**: [Como Rodar a API](./COMO_RODAR_API.md)
- **📖 Quero entender o projeto**: [Guia de Boas-Vindas](./GUIA_BOAS_VINDAS.md)
- **📊 Quero saber o que falta**:
  [Status de Implementação](./STATUS_IMPLEMENTACAO.md)
- **🗺️ Quero ver o cronograma**: [Roadmap](./ROADMAP.md)

**Bem-vindo ao SIGMA PLI! 🎉**
