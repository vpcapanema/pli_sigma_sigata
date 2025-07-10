# 🚀 Como Rodar a API - SIGMA PLI

## Início Rápido

### 1. Pré-requisitos

```bash
# Verificar versões
node --version    # v16+ requerido
npm --version     # v8+ requerido
```

### 2. Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de configuração
cp .env.example .env
```

### 3. Configuração Básica

Edite o arquivo `.env`:

```env
# Servidor
PORT=3000
HOST=localhost
NODE_ENV=development

# Banco de Dados (opcional para teste)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sigma_pli
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=seu-jwt-secret-aqui
JWT_EXPIRES_IN=24h
```

### 4. Executar

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Ou produção
npm start
```

### 5. Testar

```bash
# Abrir no navegador
http://localhost:3000

# Ou testar com curl
curl http://localhost:3000
```

## 🐳 Usando Docker (Recomendado)

### Desenvolvimento

```bash
# Subir todos os serviços
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Produção

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f sigma-pli
```

### Serviços Disponíveis

- **Aplicação**: http://localhost:3000
- **MySQL**: localhost:3306
- **Redis**: localhost:6379
- **phpMyAdmin**: http://localhost:8080

## 📡 Endpoints Disponíveis

### Status da Aplicação

```bash
# Verificar se a API está rodando
GET http://localhost:3000/

# Resposta esperada:
{
  "message": "SIGMA PLI API está rodando",
  "version": "1.0.0",
  "timestamp": "2025-07-07T10:00:00.000Z"
}
```

### Arquivos Estáticos

```bash
# Assets
GET http://localhost:3000/assets/

# Uploads
GET http://localhost:3000/uploads/
```

### Módulos (em desenvolvimento)

```bash
# Core (Dashboard)
GET http://localhost:3000/core/

# Products
GET http://localhost:3000/products/

# Reports
GET http://localhost:3000/reports/

# Auth
GET http://localhost:3000/auth/

# Settings
GET http://localhost:3000/settings/
```

## 🔧 Scripts Úteis

### Desenvolvimento

```bash
# Servidor com hot-reload
npm run dev

# Build para desenvolvimento
npm run build:dev

# Build com watch
npm run build:watch
```

### Produção

```bash
# Build de produção
npm run build

# Iniciar servidor
npm start
```

### Testes

```bash
# Executar testes
npm test

# Testes com watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

### Qualidade

```bash
# Verificar lint
npm run lint

# Corrigir lint
npm run lint:fix

# Formatar código
npm run format
```

### Módulos

```bash
# Listar módulos
npm run modules:list

# Status dos módulos
npm run modules:status

# Deploy módulo específico
npm run module:core
npm run module:products
npm run module:reports
npm run module:auth
npm run module:settings
```

## 🗃️ Banco de Dados

### Configuração Manual

```sql
-- Criar banco
CREATE DATABASE sigma_pli;

-- Criar usuário
CREATE USER 'sigma_user'@'%' IDENTIFIED BY 'sigma_password';

-- Dar permissões
GRANT ALL PRIVILEGES ON sigma_pli.* TO 'sigma_user'@'%';
FLUSH PRIVILEGES;
```

### Usando Docker

```bash
# O banco é criado automaticamente
docker-compose up -d mysql

# Acessar MySQL
docker-compose exec mysql mysql -u root -p
```

### Verificar Conexão

```javascript
// Teste de conexão (não implementado ainda)
// GET http://localhost:3000/api/health
```

## 📊 Monitoramento

### Logs

```bash
# Ver logs da aplicação
tail -f logs/app.log

# Logs do Docker
docker-compose logs -f
```

### Métricas

```bash
# Status do servidor
curl http://localhost:3000/

# Verificar processos
ps aux | grep node

# Verificar portas
netstat -tlnp | grep 3000
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Porta

```bash
# Verificar se a porta está em uso
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 npm run dev
```

#### 2. Erro de Dependências

```bash
# Limpar cache
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

#### 3. Erro de Banco

```bash
# Verificar se MySQL está rodando
systemctl status mysql

# Ou com Docker
docker-compose ps
```

#### 4. Erro de Permissões

```bash
# Verificar permissões
ls -la logs/
ls -la uploads/

# Corrigir permissões
chmod 755 logs/
chmod 755 uploads/
```

## 🔐 Segurança

### Configurações Importantes

```env
# Sempre usar secrets seguros em produção
JWT_SECRET=seu-jwt-secret-muito-forte-aqui
SESSION_SECRET=sua-session-secret-muito-forte-aqui

# HTTPS em produção
FORCE_HTTPS=true
```

### Rate Limiting

```javascript
// Configurado em config/app.config.js
rateLimit: {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
}
```

## 🌐 Deployment

### Desenvolvimento

```bash
# Local
npm run dev

# Docker
docker-compose -f docker-compose.dev.yml up
```

### Produção

```bash
# Build
npm run build

# Start
npm start

# Docker
docker-compose up -d
```

### Variáveis de Ambiente

```env
# Produção
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Banco de Dados
DB_HOST=seu-mysql-host
DB_PORT=3306
DB_NAME=sigma_pli
DB_USER=sigma_user
DB_PASSWORD=senha-forte

# Segurança
JWT_SECRET=jwt-secret-muito-forte
SESSION_SECRET=session-secret-muito-forte
```

## 📞 Suporte

### Logs de Debug

```bash
# Modo debug
DEBUG=* npm run dev

# Logs detalhados
LOG_LEVEL=debug npm run dev
```

### Contato

- **Issues**: GitHub Issues
- **Email**: suporte@sigma-pli.com
- **Docs**: `/docs/`

---

## ✅ Checklist de Verificação

- [ ] Node.js v16+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Servidor rodando (`npm run dev`)
- [ ] Endpoint principal acessível (http://localhost:3000)
- [ ] Logs sem erros críticos
- [ ] Banco de dados configurado (opcional)

**A API está pronta para uso! 🚀**
