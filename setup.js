#!/usr/bin/env node

/**
 * Script de Setup do SIGMA PLI
 * Configura o ambiente inicial para desenvolvimento e produção
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class SigmaPliSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                      SIGMA PLI - Setup Inicial                              ║
║                                                                              ║
║  Sistema Integrado de Gestão e Monitoramento Acadêmico                      ║
║  Versão de Produção Modularizada                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `);

    try {
      // Verificar pré-requisitos
      await this.checkPrerequisites();

      // Configurar ambiente
      const environment = await this.selectEnvironment();

      // Configurar variáveis de ambiente
      await this.setupEnvironment(environment);

      // Instalar dependências
      await this.installDependencies();

      // Configurar banco de dados
      await this.setupDatabase();

      // Configurar módulos
      await this.setupModules();

      // Configurar serviços externos
      await this.setupExternalServices();

      // Executar testes
      await this.runTests();

      // Finalizar setup
      await this.finalizeSetup();

      console.log('\n✅ Setup concluído com sucesso!');
    } catch (error) {
      console.error('\n❌ Erro durante o setup:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async checkPrerequisites() {
    console.log('\n🔍 Verificando pré-requisitos...');

    const requirements = [
      { name: 'Node.js', command: 'node --version', minVersion: '16.0.0' },
      { name: 'npm', command: 'npm --version', minVersion: '8.0.0' },
      { name: 'Git', command: 'git --version', minVersion: '2.0.0' }
    ];

    for (const req of requirements) {
      try {
        const version = execSync(req.command, { encoding: 'utf8' }).trim();
        console.log(`✓ ${req.name}: ${version}`);
      } catch (error) {
        throw new Error(`${req.name} não está instalado ou não está no PATH`);
      }
    }
  }

  async selectEnvironment() {
    console.log('\n🌍 Selecione o ambiente:');
    console.log('1. Desenvolvimento');
    console.log('2. Produção');
    console.log('3. Teste');

    const choice = await this.question('Escolha uma opção (1-3): ');

    const environments = {
      1: 'development',
      2: 'production',
      3: 'test'
    };

    const env = environments[choice];
    if (!env) {
      throw new Error('Opção inválida');
    }

    console.log(`✓ Ambiente selecionado: ${env}`);
    return env;
  }

  async setupEnvironment(environment) {
    console.log('\n⚙️  Configurando variáveis de ambiente...');

    const envFile = `.env.${environment}`;
    const envExamplePath = '.env.example';

    // Verificar se arquivo de exemplo existe
    try {
      await fs.access(envExamplePath);
    } catch (error) {
      throw new Error('Arquivo .env.example não encontrado');
    }

    // Copiar arquivo de exemplo
    const envExample = await fs.readFile(envExamplePath, 'utf8');

    // Configurar variáveis específicas do ambiente
    let envContent = envExample;

    if (environment === 'development') {
      envContent = envContent.replace('NODE_ENV=production', 'NODE_ENV=development');
      envContent = envContent.replace('PORT=3000', 'PORT=3000');
    } else if (environment === 'production') {
      // Solicitar configurações de produção
      const dbPassword = await this.question('Digite a senha do banco de dados: ');
      const jwtSecret = await this.question('Digite a chave secreta JWT: ');

      envContent = envContent.replace('your_secure_password', dbPassword);
      envContent = envContent.replace('your_jwt_secret_key_here', jwtSecret);
    }

    await fs.writeFile(envFile, envContent);

    // Criar .env principal
    await fs.writeFile('.env', envContent);

    console.log(`✓ Arquivo ${envFile} criado`);
  }

  async installDependencies() {
    console.log('\n📦 Instalando dependências...');

    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✓ Dependências instaladas');
    } catch (error) {
      throw new Error('Falha ao instalar dependências');
    }
  }

  async setupDatabase() {
    console.log('\n🗄️  Configurando banco de dados...');

    const useDocker = await this.question('Usar Docker para o banco de dados? (s/n): ');

    if (useDocker.toLowerCase() === 's') {
      await this.setupDockerDatabase();
    } else {
      await this.setupLocalDatabase();
    }
  }

  async setupDockerDatabase() {
    console.log('Configurando banco de dados com Docker...');

    try {
      // Verificar se Docker está instalado
      execSync('docker --version', { stdio: 'ignore' });

      // Iniciar apenas o banco de dados
      execSync('docker-compose up -d mysql redis', { stdio: 'inherit' });

      // Aguardar banco inicializar
      console.log('Aguardando banco de dados inicializar...');
      await this.sleep(30000);

      console.log('✓ Banco de dados Docker configurado');
    } catch (error) {
      throw new Error('Falha ao configurar banco de dados Docker');
    }
  }

  async setupLocalDatabase() {
    console.log('Configurando banco de dados local...');

    const dbHost = (await this.question('Host do banco de dados (localhost): ')) || 'localhost';
    const dbPort = (await this.question('Porta do banco de dados (3306): ')) || '3306';
    const dbName = (await this.question('Nome do banco de dados (sigma_pli): ')) || 'sigma_pli';
    const dbUser = (await this.question('Usuário do banco de dados (root): ')) || 'root';
    const dbPassword = await this.question('Senha do banco de dados: ');

    // Atualizar arquivo .env
    const envContent = await fs.readFile('.env', 'utf8');
    const updatedEnv = envContent
      .replace(/DB_HOST=.*/, `DB_HOST=${dbHost}`)
      .replace(/DB_PORT=.*/, `DB_PORT=${dbPort}`)
      .replace(/DB_NAME=.*/, `DB_NAME=${dbName}`)
      .replace(/DB_USER=.*/, `DB_USER=${dbUser}`)
      .replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${dbPassword}`);

    await fs.writeFile('.env', updatedEnv);

    console.log('✓ Configuração do banco de dados local salva');
  }

  async setupModules() {
    console.log('\n🧩 Configurando módulos...');

    const modules = ['core', 'auth', 'products', 'reports', 'settings'];

    for (const module of modules) {
      console.log(`Configurando módulo ${module}...`);

      // Verificar se módulo tem configuração específica
      const moduleSetupPath = path.join(__dirname, 'src', 'modules', module, 'setup.js');

      try {
        await fs.access(moduleSetupPath);
        const moduleSetup = require(moduleSetupPath);
        await moduleSetup();
        console.log(`✓ Módulo ${module} configurado`);
      } catch (error) {
        console.log(`ℹ️  Módulo ${module} não requer configuração específica`);
      }
    }
  }

  async setupExternalServices() {
    console.log('\n🔌 Configurando serviços externos...');

    const enableEmail = await this.question('Configurar envio de email? (s/n): ');

    if (enableEmail.toLowerCase() === 's') {
      const smtpHost = await this.question('Host SMTP: ');
      const smtpPort = (await this.question('Porta SMTP (587): ')) || '587';
      const smtpUser = await this.question('Usuário SMTP: ');
      const smtpPassword = await this.question('Senha SMTP: ');

      // Atualizar arquivo .env
      const envContent = await fs.readFile('.env', 'utf8');
      const updatedEnv = envContent
        .replace(/SMTP_HOST=.*/, `SMTP_HOST=${smtpHost}`)
        .replace(/SMTP_PORT=.*/, `SMTP_PORT=${smtpPort}`)
        .replace(/SMTP_USER=.*/, `SMTP_USER=${smtpUser}`)
        .replace(/SMTP_PASSWORD=.*/, `SMTP_PASSWORD=${smtpPassword}`);

      await fs.writeFile('.env', updatedEnv);

      console.log('✓ Configuração de email salva');
    }
  }

  async runTests() {
    console.log('\n🧪 Executando testes...');

    const runTests = await this.question('Executar testes? (s/n): ');

    if (runTests.toLowerCase() === 's') {
      try {
        execSync('npm test', { stdio: 'inherit' });
        console.log('✓ Testes executados com sucesso');
      } catch (error) {
        console.log('⚠️  Alguns testes falharam, mas o setup pode continuar');
      }
    }
  }

  async finalizeSetup() {
    console.log('\n🎯 Finalizando setup...');

    // Criar diretórios necessários
    const directories = ['logs', 'uploads', 'backups', 'deployments', 'temp'];

    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
    }

    // Criar arquivo de configuração local
    const setupInfo = {
      setupDate: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      modules: ['core', 'auth', 'products', 'reports', 'settings']
    };

    await fs.writeFile('setup.json', JSON.stringify(setupInfo, null, 2));

    console.log('✓ Setup finalizado');

    // Mostrar informações de próximos passos
    console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRÓXIMOS PASSOS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Iniciar o servidor:                                                     │
│     npm start                                                               │
│                                                                             │
│  2. Ou para desenvolvimento:                                                │
│     npm run dev                                                             │
│                                                                             │
│  3. Acessar o sistema:                                                      │
│     http://localhost:3000                                                   │
│                                                                             │
│  4. Para fazer deploy de um módulo:                                         │
│     npm run module:core                                                     │
│                                                                             │
│  5. Para ver logs:                                                          │
│     tail -f logs/app.log                                                    │
│                                                                             │
│  6. Para executar testes:                                                   │
│     npm test                                                                │
│                                                                             │
│  7. Para build de produção:                                                 │
│     npm run build                                                           │
│                                                                             │
│  8. Para usar Docker:                                                       │
│     docker-compose up -d                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
    `);
  }

  async question(query) {
    return new Promise(resolve => {
      this.rl.question(query, resolve);
    });
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Executar setup se chamado diretamente
if (require.main === module) {
  const setup = new SigmaPliSetup();
  setup.run();
}

module.exports = SigmaPliSetup;
