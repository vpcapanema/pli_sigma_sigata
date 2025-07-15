# SIGMA PLI - DOCUMENTO DE REQUISITOS COMPLETO
**Sistema de Gestão e Análise de Atas PLI-SP**

---

## 📋 ÍNDICE

1. [INFORMAÇÕES GERAIS](#informações-gerais)
2. [ARQUITETURA DO SISTEMA](#arquitetura-do-sistema)
3. [BANCO DE DADOS](#banco-de-dados)
4. [FUNCIONALIDADES](#funcionalidades)
5. [ESPECIFICAÇÕES TÉCNICAS](#especificações-técnicas)
6. [INSTALAÇÃO E DEPLOYMENT](#instalação-e-deployment)
7. [CONFIGURAÇÃO](#configuração)
8. [TESTES](#testes)
9. [SEGURANÇA](#segurança)
10. [MANUTENÇÃO](#manutenção)
11. [DOCUMENTAÇÃO DE API](#documentação-de-api)
12. [TROUBLESHOOTING](#troubleshooting)

---

## 🎯 INFORMAÇÕES GERAIS

### Visão Geral
O SIGMA PLI é um sistema web completo para gestão, análise e processamento automatizado de atas de reunião do PLI-SP (Plano Logístico Integrado de São Paulo), oferecendo funcionalidades avançadas de NLP (Natural Language Processing) para extração de insights e geração de relatórios.

### Objetivos Principais
- **Digitalização Completa**: Upload e armazenamento seguro de documentos
- **Análise Automatizada**: Processamento NLP para extração de entidades, sentimentos e resumos
- **Transparência Total**: Sistema completo de auditoria e rastreabilidade
- **Relatórios Inteligentes**: Geração automática de relatórios com insights consolidados
- **Gestão de Usuários**: Sistema robusto de autenticação e controle de acesso

### Público-Alvo
- Gestores e analistas do PLI-SP
- Equipes técnicas de transporte e logística
- Administradores públicos
- Equipes de auditoria e compliance

---

## 🏗️ ARQUITETURA DO SISTEMA

### Stack Tecnológico

#### Backend
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js 4.18+
- **TypeScript**: 5.0+ para tipagem estática
- **Autenticação**: JWT + bcrypt
- **Upload**: Multer para gestão de arquivos
- **Validação**: Joi para validação de dados

#### Banco de Dados
- **SGBD**: PostgreSQL 15+
- **Extensões**:
  - `uuid-ossp` - Geração de UUIDs
  - `postgis` - Dados geoespaciais
  - `pg_trgm` - Busca fuzzy
  - `unaccent` - Normalização de texto

#### Frontend
- **Framework**: Vanilla JavaScript (ES6+)
- **CSS**: Framework customizado com Neumorphism
- **Build**: Webpack 5
- **Responsividade**: CSS Grid + Flexbox

#### Inteligência Artificial / NLP
- **Principais**: spaCy, NLTK
- **Modelos**: pt_core_news_sm (português)
- **Processamento**: Análise de sentimento, extração de entidades, resumos automáticos

#### DevOps
- **Containerização**: Docker + Docker Compose
- **Proxy**: Nginx para produção
- **Logs**: Winston para Node.js
- **Monitoramento**: Health checks automáticos

### Arquitetura de 3 Camadas

#### 1. Camada de Apresentação (Frontend)
```
public/
├── assets/           # Recursos estáticos
├── css/             # Estilos Neumorphic
├── js/              # JavaScript modular
├── components/      # Componentes reutilizáveis
└── pages/           # Páginas da aplicação
```

#### 2. Camada de Aplicação (Backend API)
```
src/
├── controllers/     # Controladores REST
├── services/        # Lógica de negócio
├── models/          # Modelos de dados
├── middleware/      # Middlewares Express
├── utils/           # Utilitários
└── types/           # Definições TypeScript
```

#### 3. Camada de Dados (PostgreSQL)
```
Schemas:
├── cadastro         # Pessoas físicas e jurídicas
├── usuarios         # Sistema de usuários + auditoria
└── sigata          # Documentos e análises
```

---

## 🗄️ BANCO DE DADOS

### Estrutura Completa

#### Schema: `cadastro`
| Tabela | Finalidade | Registros Esperados |
|--------|------------|-------------------|
| `pessoa_fisica` | Pessoas físicas cadastradas | 1.000+ |
| `pessoa_juridica` | Empresas e organizações | 500+ |

#### Schema: `usuarios`
| Tabela | Finalidade | Registros Esperados |
|--------|------------|-------------------|
| `usuario_sistema` | Usuários do sistema | 100+ |
| `usuario_historico_formularios` | Auditoria completa | 10.000+ |

#### Schema: `sigata`
| Tabela | Finalidade | Registros Esperados |
|--------|------------|-------------------|
| `documento_base` | Documentos principais | 5.000+ |
| `documento_arquivo` | Arquivos e metadados | 5.000+ |
| `documento_nlp_metricas` | Métricas de processamento | 5.000+ |
| `documento_nlp_dados` | Resultados NLP | 5.000+ |
| `documento_ata_dados` | Dados específicos de atas | 3.000+ |
| `documento_qualidade` | Controle de qualidade | 5.000+ |
| `documento_controle` | Controle e metadados | 5.000+ |
| `relatorio_base` | Relatórios gerados | 1.000+ |
| `relatorio_resultados` | Resultados consolidados | 1.000+ |
| `relatorio_controle` | Controle de relatórios | 1.000+ |

### Views Dinâmicas Especiais

#### `usuarios.v_usuario_sistema_completo`
- **Função**: Junção dinâmica entre usuários e pessoas (física/jurídica)
- **Diferencial**: Usa `COALESCE` para unificar campos automaticamente
- **Performance**: Otimizada com índices específicos

#### `usuarios.v_usuario_sistema_basico`
- **Função**: View simplificada para consultas rápidas
- **Uso**: Listagens, dropdowns, consultas de autenticação

### Recursos Avançados

#### Auditoria Completa
- **Versionamento**: Todas as alterações são versionadas
- **Rastreabilidade**: IP, user-agent, usuário responsável
- **Comprovantes**: Números únicos para validade jurídica
- **Integridade**: Hashes SHA-256 para verificação

#### Geolocalização
- **PostGIS**: Coordenadas geográficas completas
- **Índices Espaciais**: Consultas geográficas otimizadas
- **Formato**: GEOMETRY(POINT, 4326) - WGS84

#### Busca Avançada
- **Full-Text Search**: Vetores tsvector otimizados
- **Busca Fuzzy**: pg_trgm para similaridade
- **Normalização**: unaccent para busca sem acentos

---

## ⚙️ FUNCIONALIDADES

### 1. Gestão de Usuários

#### Cadastro de Pessoas
- **Pessoa Física**: CPF, RG, dados pessoais completos
- **Pessoa Jurídica**: CNPJ, razão social, dados empresariais
- **Endereçamento**: CEP automático via API ViaCEP
- **Geolocalização**: Coordenadas automáticas

#### Sistema de Usuários
- **Níveis de Acesso**: 5 níveis (ADMIN a VISUALIZADOR)
- **Autenticação**: JWT com refresh tokens
- **2FA**: Preparado para implementação futura
- **Bloqueio**: Sistema anti-força bruta

### 2. Gestão de Documentos

#### Upload e Processamento
- **Tipos Suportados**: PDF, DOC, DOCX, TXT
- **Validação**: Tipo MIME, tamanho, integridade
- **Armazenamento**: Sistema de arquivos + metadados
- **Backup**: Automático com versionamento

#### Análise NLP Avançada
- **Extração de Texto**: OCR quando necessário
- **Análise de Sentimento**: Positivo/Negativo/Neutro
- **Entidades**: Pessoas, organizações, locais, datas
- **Resumos**: Automáticos baseados em frequência
- **Palavras-chave**: Extração automática ponderada

### 3. Atas de Reunião

#### Dados Específicos
- **Informações da Reunião**: Data, hora, local, tipo
- **Participantes**: Presentes, ausentes, convidados
- **Estrutura**: Pauta, decisões, ações, pendências
- **Aprovação**: Workflow de aprovação digital

#### Métricas Avançadas
- **Qualidade**: Pontuação automática 0-1
- **Performance**: Tempos de processamento
- **Participação**: Estatísticas de presença
- **Geolocalização**: Mapeamento de locais

### 4. Sistema de Relatórios

#### Tipos de Relatório
- **Geral**: Visão consolidada do período
- **Por Categoria**: Análise segmentada
- **Por Usuário**: Performance individual
- **Por Tipo**: Documentos específicos

#### Conteúdo dos Relatórios
- **Resumos Consolidados**: NLP agregado
- **Métricas**: KPIs e indicadores
- **Gráficos**: Visualizações automáticas
- **Participação**: Rankings e estatísticas
- **Sentimentos**: Análise temporal

### 5. Auditoria e Transparência

#### Rastreabilidade Total
- **Versionamento**: Histórico completo de alterações
- **Comprovantes**: Numeração única oficial
- **Assinatura Digital**: Preparado para certificação
- **Logs**: Registro detalhado de operações

#### Relatórios de Auditoria
- **Atividade de Usuários**: Quem fez o quê quando
- **Integridade**: Verificação de hashes
- **Conformidade**: Relatórios regulatórios
- **Investigação**: Ferramentas forenses

---

## 💻 ESPECIFICAÇÕES TÉCNICAS

### Requisitos de Sistema

#### Servidor de Produção
- **CPU**: 4+ cores (Intel/AMD x64)
- **RAM**: 8GB+ (16GB recomendado)
- **Storage**: 100GB+ SSD (crescimento estimado 10GB/mês)
- **Network**: 100Mbps+ com baixa latência
- **OS**: Ubuntu 20.04+ LTS ou CentOS 8+

#### Desenvolvimento
- **CPU**: 2+ cores
- **RAM**: 4GB+ (8GB recomendado)
- **Storage**: 20GB+ disponível
- **Node.js**: 18.x LTS ou superior
- **PostgreSQL**: 15+ com extensões

### Performance

#### Benchmarks Esperados
- **Upload**: 50+ arquivos simultâneos
- **Processamento NLP**: 1 documento/segundo
- **Consultas DB**: < 100ms para 95% das queries
- **API Response**: < 200ms para endpoints básicos
- **Relatórios**: < 30s para relatórios complexos

#### Escalabilidade
- **Usuários Simultâneos**: 100+ sem degradação
- **Documentos**: Suporte a 100.000+ documentos
- **Storage**: Crescimento linear sem impacto
- **Backup**: Incremental automático

### Integração e APIs

#### APIs Externas
- **ViaCEP**: Consulta automática de endereços
- **IBGE**: Dados geográficos e estatísticos
- **Receita Federal**: Validação de CNPJ (futuro)
- **Geolocalização**: Google Maps API (configurável)

#### APIs Fornecidas
- **REST**: Endpoints completos CRUD
- **GraphQL**: Queries flexíveis (futuro)
- **WebHooks**: Notificações de eventos
- **Bulk Operations**: Operações em lote

---

## 🚀 INSTALAÇÃO E DEPLOYMENT

### Pré-requisitos

#### Ambiente de Desenvolvimento
```bash
# Node.js 18+ LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 15+
sudo apt-get install postgresql-15 postgresql-contrib-15
sudo apt-get install postgresql-15-postgis-3

# Python para NLP
sudo apt-get install python3 python3-pip
pip3 install spacy nltk pandas numpy
python3 -m spacy download pt_core_news_sm
```

#### Docker (Recomendado)
```bash
# Docker e Docker Compose
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

### Instalação Rápida

#### 1. Clone e Configuração
```bash
# Clone do repositório
git clone <repository-url>
cd SIGMA_PLI

# Instalação de dependências
npm install

# Configuração do ambiente
cp .env.example .env
# Editar .env com suas configurações
```

#### 2. Banco de Dados
```bash
# Executar script de instalação completa
psql -h pli-db.c6j00cu4izbw.us-east-1.rds.amazonaws.com -U postgres -d pli_db -f database/install_sigma_pli_final.sql

# Verificar instalação
npm run db:test
```

#### 3. Desenvolvimento
```bash
# Modo desenvolvimento
npm run dev

# Acesso: http://localhost:3000
# Login: admin / admin123
```

#### 4. Produção com Docker
```bash
# Build e execução
docker-compose up -d

# Logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Configuração de Ambiente

#### Variáveis de Ambiente (.env)
```env
# Servidor
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Banco de Dados
DB_HOST=pli-db.c6j00cu4izbw.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=pli_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=true

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Upload
UPLOAD_MAX_SIZE=50mb
UPLOAD_ALLOWED_TYPES=pdf,doc,docx,txt
UPLOAD_PATH=./uploads

# NLP
NLP_MODEL=pt_core_news_sm
NLP_BATCH_SIZE=10
NLP_TIMEOUT=30000

# Email (para notificações)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log
LOG_MAX_SIZE=10mb
LOG_MAX_FILES=5

# Monitoramento
HEALTH_CHECK_INTERVAL=30000
METRICS_ENABLED=true
```

---

## ⚙️ CONFIGURAÇÃO

### Estrutura de Diretórios

```
SIGMA_PLI/
├── api/                    # APIs e controllers
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── validators/
├── config/                 # Configurações
│   ├── app.config.js      # Config principal
│   ├── database.config.js # Config DB
│   └── nlp.config.js      # Config NLP
├── database/              # Scripts de banco
│   ├── install_sigma_pli_final.sql
│   └── migrations/
├── public/                # Frontend
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── pages/
├── src/                   # Backend principal
│   ├── services/
│   ├── models/
│   ├── utils/
│   └── types/
├── uploads/               # Arquivos enviados
├── logs/                  # Logs do sistema
├── tests/                 # Testes automatizados
├── deployment/            # Scripts de deploy
├── docs/                  # Documentação
├── package.json
├── docker-compose.yml
└── README.md
```

### Configurações de Segurança

#### Headers de Segurança
```javascript
// helmet.js configuration
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}
```

#### Rate Limiting
```javascript
// Rate limiting por endpoint
{
  "/api/auth/login": "5 tentativas por 15 minutos",
  "/api/upload": "20 uploads por hora",
  "/api/reports": "10 relatórios por hora",
  "default": "100 requests por 15 minutos"
}
```

---

## 🧪 TESTES

### Estratégia de Testes

#### 1. Testes Unitários
```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes específicos
npm test -- --grep "usuários"
```

#### 2. Testes de Integração
```bash
# API Tests
npm run test:api

# Database Tests
npm run test:db

# NLP Tests
npm run test:nlp
```

#### 3. Testes de Performance
```bash
# Load testing
npm run test:load

# Stress testing
npm run test:stress

# Memory profiling
npm run test:memory
```

### Casos de Teste Principais

#### Autenticação
- ✅ Login com credenciais válidas
- ✅ Login com credenciais inválidas
- ✅ Bloqueio após tentativas múltiplas
- ✅ Refresh token
- ✅ Logout

#### Upload de Documentos
- ✅ Upload arquivo válido
- ✅ Rejeição arquivo inválido
- ✅ Limite de tamanho
- ✅ Tipos MIME suportados
- ✅ Processamento NLP

#### Relatórios
- ✅ Geração relatório básico
- ✅ Relatório com filtros
- ✅ Exportação PDF/HTML
- ✅ Performance grandes volumes

#### Auditoria
- ✅ Registro de alterações
- ✅ Integridade de hashes
- ✅ Geração de comprovantes
- ✅ Consulta histórico

---

## 🔒 SEGURANÇA

### Autenticação e Autorização

#### JSON Web Tokens (JWT)
- **Access Token**: 24h de validade
- **Refresh Token**: 7 dias de validade
- **Rotação**: Automática a cada uso
- **Revogação**: Lista negra em Redis

#### Níveis de Acesso
| Nível | Tipo | Permissões |
|-------|------|------------|
| 5 | ADMIN | Acesso total ao sistema |
| 4 | GESTOR | Gestão de usuários e relatórios |
| 3 | ANALISTA | Análise e edição de documentos |
| 2 | OPERADOR | Upload e consulta |
| 1 | VISUALIZADOR | Apenas consulta |

### Proteção de Dados

#### Criptografia
- **Senhas**: bcrypt com salt aleatório
- **Dados Sensíveis**: AES-256-GCM
- **Transmissão**: TLS 1.3 obrigatório
- **Arquivos**: Hash SHA-256 para integridade

#### Sanitização
- **Input**: Joi + express-validator
- **SQL Injection**: Prepared statements
- **XSS**: Helmet + CSP headers
- **Path Traversal**: Whitelist de diretórios

### Auditoria de Segurança

#### Logs de Segurança
```javascript
// Eventos registrados
{
  "login_attempt": "Tentativa de login",
  "login_success": "Login bem-sucedido",
  "login_failure": "Falha na autenticação",
  "password_change": "Alteração de senha",
  "privilege_escalation": "Mudança de privilégios",
  "file_upload": "Upload de arquivo",
  "sensitive_data_access": "Acesso a dados sensíveis",
  "system_configuration": "Alteração de configuração"
}
```

#### Compliance
- **LGPD**: Controle total de dados pessoais
- **ISO 27001**: Controles de segurança
- **OWASP Top 10**: Mitigação completa
- **SOX**: Auditoria financeira (se aplicável)

---

## 🔧 MANUTENÇÃO

### Backup e Recuperação

#### Estratégia de Backup
```bash
# Backup completo diário
pg_dump -h host -U user -d pli_db > backup_$(date +%Y%m%d).sql

# Backup incremental (WAL)
postgresql.conf: wal_level = replica

# Arquivos (sincronização)
rsync -av /path/to/uploads/ backup_server:/backups/uploads/
```

#### Recuperação de Desastres
- **RTO**: 4 horas (Recovery Time Objective)
- **RPO**: 1 hora (Recovery Point Objective)
- **Replicação**: Master-slave automática
- **Testes**: Mensais de recuperação

### Monitoramento

#### Métricas do Sistema
```javascript
// Health Check Endpoint: /api/health
{
  "status": "healthy",
  "timestamp": "2025-07-15T10:30:00Z",
  "uptime": 86400,
  "database": "connected",
  "nlp_service": "running",
  "memory_usage": "45%",
  "disk_usage": "23%",
  "active_connections": 15
}
```

#### Alertas Configurados
- **CPU > 80%**: Alerta crítico
- **RAM > 90%**: Alerta crítico
- **Disk > 85%**: Alerta warning
- **DB Connections > 80%**: Alerta warning
- **Error Rate > 5%**: Alerta crítico

### Manutenção Preventiva

#### Tarefas Semanais
- ✅ Verificação de logs de erro
- ✅ Análise de performance
- ✅ Teste de backups
- ✅ Verificação de segurança

#### Tarefas Mensais
- ✅ Atualização de dependências
- ✅ Análise de storage
- ✅ Revisão de usuários ativos
- ✅ Teste de recuperação

#### Tarefas Trimestrais
- ✅ Auditoria de segurança
- ✅ Revisão de arquitetura
- ✅ Planejamento de capacidade
- ✅ Treinamento da equipe

---

## 📚 DOCUMENTAÇÃO DE API

### Endpoints Principais

#### Autenticação
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "tipo_usuario": "ADMIN"
  }
}
```

#### Upload de Documento
```http
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <arquivo>,
  "titulo": "Ata da Reunião 15/07/2025",
  "tipo_documento": "ATA",
  "categoria": "PLANEJAMENTO"
}

Response:
{
  "success": true,
  "documento": {
    "id": "uuid",
    "codigo_documento": "ATA-2025-001",
    "status_processamento": "PENDENTE"
  }
}
```

#### Consulta de Documentos
```http
GET /api/documents?page=1&limit=10&tipo=ATA
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "codigo_documento": "ATA-2025-001",
      "titulo_documento": "Ata da Reunião...",
      "tipo_documento": "ATA",
      "status_processamento": "CONCLUIDO",
      "data_upload": "2025-07-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

#### Geração de Relatório
```http
POST /api/reports/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo_relatorio": "Relatório Mensal - Julho 2025",
  "data_inicio_periodo": "2025-07-01",
  "data_fim_periodo": "2025-07-31",
  "escopo_relatorio": "GERAL",
  "filtros_aplicados": {
    "tipo_documento": ["ATA"],
    "categoria": ["PLANEJAMENTO", "EXECUCAO"]
  }
}

Response:
{
  "success": true,
  "relatorio": {
    "id": "uuid",
    "codigo_relatorio": "REL-2025-007",
    "status_geracao": "PROCESSANDO"
  }
}
```

### Códigos de Status

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Sucesso geral |
| 201 | Created | Recurso criado |
| 400 | Bad Request | Erro de validação |
| 401 | Unauthorized | Token inválido |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito de dados |
| 429 | Too Many Requests | Rate limit |
| 500 | Internal Server Error | Erro interno |

---

## 🔍 TROUBLESHOOTING

### Problemas Comuns

#### 1. Erro de Conexão com Banco
```bash
# Sintoma
Error: connect ECONNREFUSED

# Diagnóstico
npm run db:test
psql -h host -U user -d db -c "SELECT 1"

# Solução
# Verificar credenciais em .env
# Verificar firewall/security groups
# Verificar SSL/TLS configuração
```

#### 2. Falha no Processamento NLP
```bash
# Sintoma
NLP processing timeout

# Diagnóstico
python3 -c "import spacy; print(spacy.load('pt_core_news_sm'))"

# Solução
python3 -m spacy download pt_core_news_sm
pip3 install --upgrade spacy
```

#### 3. Upload de Arquivo Falhando
```bash
# Sintoma
File upload error 413

# Diagnóstico
# Verificar UPLOAD_MAX_SIZE em .env
# Verificar espaço em disco

# Solução
# Aumentar limite em nginx.conf
client_max_body_size 100m;
# Verificar permissões de diretório
chmod 755 uploads/
```

#### 4. Performance Lenta
```bash
# Diagnóstico
# Verificar logs de query lenta
grep "slow query" logs/app.log

# Verificar índices de banco
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

# Solução
# Adicionar índices necessários
# Otimizar queries
# Considerar cache Redis
```

### Logs e Diagnósticos

#### Localização dos Logs
```bash
# Logs da aplicação
tail -f logs/app.log

# Logs do PostgreSQL
tail -f /var/log/postgresql/postgresql-15-main.log

# Logs do Docker
docker-compose logs -f app

# Logs do sistema
journalctl -u sigma-pli
```

#### Comandos de Diagnóstico
```bash
# Status geral do sistema
npm run health-check

# Teste de conectividade
npm run test:connection

# Verificação de dependências
npm run test:dependencies

# Análise de performance
npm run analyze:performance
```

### Contatos de Suporte

#### Equipe Técnica
- **DevOps**: devops@sigma-pli.com.br
- **Backend**: backend@sigma-pli.com.br
- **Frontend**: frontend@sigma-pli.com.br
- **Database**: dba@sigma-pli.com.br

#### Níveis de Suporte
- **L1**: Suporte básico e troubleshooting
- **L2**: Problemas técnicos complexos
- **L3**: Desenvolvimento e arquitetura
- **Emergency**: Problemas críticos 24/7

---

## 📞 CONCLUSÃO

O SIGMA PLI representa uma solução completa e robusta para gestão e análise de atas do PLI-SP, combinando tecnologias modernas com requisitos rigorosos de segurança e auditoria.

### Próximos Passos
1. **Implementação Inicial**: Seguir guia de instalação
2. **Configuração**: Ajustar ambiente para necessidades específicas
3. **Treinamento**: Capacitar equipe de usuários
4. **Monitoramento**: Implementar métricas e alertas
5. **Evolução**: Feedback e melhorias contínuas

### Evolução Futura
- **Inteligência Artificial**: Modelos mais avançados
- **Mobile**: Aplicativo nativo
- **Integração**: APIs externas expandidas
- **Relatórios**: Business Intelligence avançado
- **Compliance**: Certificações adicionais

---

**Documento gerado em**: 15 de julho de 2025  
**Versão**: 1.0 Final  
**Atualização**: Conforme evolução do sistema

**© 2025 SIGMA PLI - Todos os direitos reservados**
