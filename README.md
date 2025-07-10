# Sistema SIGMA PLI - Versão de Produção

## Arquitetura Modular

Este projeto foi desenvolvido com uma arquitetura modular que permite:

- Deployment independente de módulos
- Escalabilidade horizontal
- Manutenção facilitada
- Versionamento por módulo

## Estrutura dos Módulos

### 1. Core (Módulo Principal)

- **Responsabilidade**: Dashboard, gestão de usuários, eventos (calendário)
- **Localização**: `src/modules/core/`
- **Componentes**:
  - Dashboard principal com resumos
  - Sistema de usuários e permissões
  - Calendário de eventos
  - Notificações

### 2. Products (Produtos)

- **Responsabilidade**: Recebimento, análise e avaliação de produtos
- **Localização**: `src/modules/products/`
- **Componentes**:
  - Recepção de produtos
  - Sistema de análise estruturada
  - Avaliação objetiva
  - Workflow de aprovação

### 3. Reports (Relatórios)

- **Responsabilidade**: Resumos detalhados e expandidos
- **Localização**: `src/modules/reports/`
- **Componentes**:
  - Relatórios por tópicos
  - Visualizações gráficas
  - Exportação de dados
  - Análises estatísticas

### 4. Auth (Autenticação)

- **Responsabilidade**: Sistema de login e segurança
- **Localização**: `src/modules/auth/`
- **Componentes**:
  - Login/logout
  - Controle de sessões
  - Recuperação de senha
  - Auditoria de acesso

### 5. Settings (Configurações)

- **Responsabilidade**: Administração do sistema
- **Localização**: `src/modules/settings/`
- **Componentes**:
  - Configurações gerais
  - Parâmetros do sistema
  - Backup/restore
  - Logs do sistema

## Estrutura de Arquivos

```
SIGMA_PLI/
├── src/
│   ├── modules/
│   │   ├── core/
│   │   │   ├── templates/
│   │   │   ├── js/
│   │   │   └── css/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── auth/
│   │   └── settings/
│   └── shared/
│       ├── components/
│       ├── utils/
│       └── css/
├── config/
├── api/
├── database/
├── public/
├── tests/
└── deployment/
```

## Deployment de Módulos

Cada módulo pode ser deployado individualmente usando:

```bash
npm run module:core
npm run module:products
npm run module:reports
npm run module:auth
npm run module:settings
```

## Versionamento

- Cada módulo possui seu próprio número de versão
- Compatibilidade mantida através de APIs versionadas
- Rollback independente por módulo

## Desenvolvimento

1. **Instalação**:

   ```bash
   npm install
   ```

2. **Desenvolvimento**:

   ```bash
   npm run dev
   ```

3. **Build**:

   ```bash
   npm run build
   ```

4. **Testes**:
   ```bash
   npm test
   ```

## Configuração

- Variáveis de ambiente em `.env`
- Configurações específicas em `config/`
- Parâmetros de módulo em cada `module.config.js`
