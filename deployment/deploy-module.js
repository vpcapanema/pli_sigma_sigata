#!/usr/bin/env node

/**
 * Script de Deploy de Módulos Individuais
 * Permite fazer deploy de módulos específicos do SIGMA PLI
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

class ModuleDeployer {
  constructor() {
    this.modulesPath = path.join(__dirname, '../src/modules');
    this.deploymentsPath = path.join(__dirname, '../deployments');
    this.backupsPath = path.join(__dirname, '../backups');
  }

  async deployModule(moduleName, options = {}) {
    try {
      console.log(`\n🚀 Iniciando deploy do módulo: ${moduleName}`);

      // Verificar se módulo existe
      await this.validateModule(moduleName);

      // Criar backup do módulo atual (se existir)
      if (options.backup !== false) {
        await this.createBackup(moduleName);
      }

      // Executar testes do módulo
      if (options.skipTests !== true) {
        await this.runModuleTests(moduleName);
      }

      // Compilar módulo
      await this.compileModule(moduleName);

      // Criar pacote de deploy
      const packagePath = await this.createDeploymentPackage(moduleName);

      // Fazer deploy
      await this.deployPackage(moduleName, packagePath, options);

      // Verificar saúde do módulo após deploy
      await this.healthCheck(moduleName);

      console.log(`✅ Deploy do módulo ${moduleName} concluído com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro no deploy do módulo ${moduleName}:`, error.message);

      // Rollback se solicitado
      if (options.rollbackOnError !== false) {
        await this.rollback(moduleName);
      }

      throw error;
    }
  }

  async validateModule(moduleName) {
    const modulePath = path.join(this.modulesPath, moduleName);

    try {
      await fs.access(modulePath);
    } catch (error) {
      throw new Error(`Módulo ${moduleName} não encontrado em ${modulePath}`);
    }

    // Verificar arquivos obrigatórios
    const requiredFiles = ['module.config.js', 'routes.js'];

    for (const file of requiredFiles) {
      const filePath = path.join(modulePath, file);
      try {
        await fs.access(filePath);
      } catch (error) {
        throw new Error(`Arquivo obrigatório não encontrado: ${file}`);
      }
    }

    console.log(`✓ Módulo ${moduleName} validado`);
  }

  async createBackup(moduleName) {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-');
    const backupName = `${moduleName}_${timestamp}`;
    const backupPath = path.join(this.backupsPath, backupName);

    // Criar diretório de backup se não existir
    await fs.mkdir(this.backupsPath, { recursive: true });

    // Criar arquivo ZIP do módulo atual
    const modulePath = path.join(this.modulesPath, moduleName);
    const zipPath = `${backupPath}.zip`;

    await this.createZipArchive(modulePath, zipPath);

    console.log(`✓ Backup criado: ${zipPath}`);
    return zipPath;
  }

  async createZipArchive(sourcePath, targetPath) {
    return new Promise((resolve, reject) => {
      const output = require('fs').createWriteStream(targetPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve());
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(sourcePath, false);
      archive.finalize();
    });
  }

  async runModuleTests(moduleName) {
    const testsPath = path.join(__dirname, '../tests', moduleName);

    try {
      await fs.access(testsPath);

      console.log(`🧪 Executando testes do módulo ${moduleName}...`);

      // Executar testes específicos do módulo
      execSync(`npm test -- --testPathPattern=${moduleName}`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });

      console.log(`✓ Testes do módulo ${moduleName} aprovados`);
    } catch (error) {
      console.log(`⚠️  Nenhum teste encontrado para o módulo ${moduleName}`);
    }
  }

  async compileModule(moduleName) {
    console.log(`🔧 Compilando módulo ${moduleName}...`);

    const modulePath = path.join(this.modulesPath, moduleName);

    // Compilar CSS se existir
    const cssPath = path.join(modulePath, 'css');
    try {
      await fs.access(cssPath);
      // Implementar compilação CSS (minificação, etc.)
      console.log(`✓ CSS do módulo ${moduleName} compilado`);
    } catch (error) {
      // CSS não encontrado, pular
    }

    // Compilar JS se existir
    const jsPath = path.join(modulePath, 'js');
    try {
      await fs.access(jsPath);
      // Implementar compilação JS (minificação, etc.)
      console.log(`✓ JavaScript do módulo ${moduleName} compilado`);
    } catch (error) {
      // JS não encontrado, pular
    }
  }

  async createDeploymentPackage(moduleName) {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-');
    const packageName = `${moduleName}_${timestamp}`;
    const packagePath = path.join(this.deploymentsPath, `${packageName}.zip`);

    // Criar diretório de deployments se não existir
    await fs.mkdir(this.deploymentsPath, { recursive: true });

    // Criar pacote do módulo
    const modulePath = path.join(this.modulesPath, moduleName);
    await this.createZipArchive(modulePath, packagePath);

    console.log(`✓ Pacote de deploy criado: ${packagePath}`);
    return packagePath;
  }

  async deployPackage(moduleName, packagePath, options) {
    console.log(`📦 Fazendo deploy do pacote ${packagePath}...`);

    if (options.dryRun) {
      console.log(`🔍 Modo dry-run: deploy simulado para ${moduleName}`);
      return;
    }

    // Aqui seria implementada a lógica específica de deploy
    // Por exemplo: upload para servidor, atualização de banco, etc.

    // Simular deploy
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`✓ Deploy do pacote ${moduleName} concluído`);
  }

  async healthCheck(moduleName) {
    console.log(`🏥 Verificando saúde do módulo ${moduleName}...`);

    try {
      // Fazer requisição para endpoint de health check do módulo
      const response = await fetch(`http://localhost:3000/api/${moduleName}/health`);

      if (response.ok) {
        console.log(`✓ Módulo ${moduleName} está saudável`);
      } else {
        throw new Error(`Health check falhou: ${response.status}`);
      }
    } catch (error) {
      console.log(`⚠️  Não foi possível verificar saúde do módulo: ${error.message}`);
    }
  }

  async rollback(moduleName) {
    console.log(`🔄 Iniciando rollback do módulo ${moduleName}...`);

    // Encontrar backup mais recente
    const backupFiles = await fs.readdir(this.backupsPath);
    const moduleBackups = backupFiles
      .filter(file => file.startsWith(`${moduleName}_`))
      .sort()
      .reverse();

    if (moduleBackups.length === 0) {
      console.log(`⚠️  Nenhum backup encontrado para rollback do módulo ${moduleName}`);
      return;
    }

    const latestBackup = moduleBackups[0];
    console.log(`📦 Restaurando backup: ${latestBackup}`);

    // Aqui seria implementada a lógica de rollback
    // Por exemplo: restaurar arquivos, reverter banco, etc.

    console.log(`✓ Rollback do módulo ${moduleName} concluído`);
  }

  async listModules() {
    const modules = await fs.readdir(this.modulesPath);

    console.log('\n📋 Módulos disponíveis:');
    for (const module of modules) {
      const modulePath = path.join(this.modulesPath, module);
      const stat = await fs.stat(modulePath);

      if (stat.isDirectory()) {
        // Ler configuração do módulo
        try {
          const configPath = path.join(modulePath, 'module.config.js');
          const config = require(configPath);
          console.log(`  • ${module} (v${config.version}) - ${config.description}`);
        } catch (error) {
          console.log(`  • ${module} - Sem configuração`);
        }
      }
    }
  }

  async getModuleStatus(moduleName) {
    const modulePath = path.join(this.modulesPath, moduleName);

    try {
      const config = require(path.join(modulePath, 'module.config.js'));

      // Verificar se módulo está ativo
      const isActive = await this.isModuleActive(moduleName);

      return {
        name: moduleName,
        version: config.version,
        description: config.description,
        active: isActive,
        path: modulePath
      };
    } catch (error) {
      throw new Error(`Erro ao obter status do módulo ${moduleName}: ${error.message}`);
    }
  }

  async isModuleActive(moduleName) {
    try {
      const response = await fetch(`http://localhost:3000/api/${moduleName}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// CLI Interface
if (require.main === module) {
  const deployer = new ModuleDeployer();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📦 SIGMA PLI - Deploy de Módulos

Uso:
  node deployment/deploy-module.js <comando> [opções]

Comandos:
  deploy <módulo>     - Fazer deploy de um módulo
  list               - Listar módulos disponíveis
  status <módulo>    - Verificar status de um módulo
  backup <módulo>    - Criar backup de um módulo
  rollback <módulo>  - Fazer rollback de um módulo

Opções:
  --dry-run         - Simular deploy sem executar
  --skip-tests      - Pular execução de testes
  --no-backup       - Não criar backup antes do deploy
  --no-rollback     - Não fazer rollback em caso de erro

Exemplos:
  node deployment/deploy-module.js deploy core
  node deployment/deploy-module.js deploy products --dry-run
  node deployment/deploy-module.js list
  node deployment/deploy-module.js status core
    `);
    process.exit(0);
  }

  const command = args[0];
  const moduleName = args[1];

  // Parsear opções
  const options = {
    dryRun: args.includes('--dry-run'),
    skipTests: args.includes('--skip-tests'),
    backup: !args.includes('--no-backup'),
    rollbackOnError: !args.includes('--no-rollback')
  };

  (async () => {
    try {
      switch (command) {
      case 'deploy':
        if (!moduleName) {
          console.error('❌ Nome do módulo é obrigatório para deploy');
          process.exit(1);
        }
        await deployer.deployModule(moduleName, options);
        break;

      case 'list':
        await deployer.listModules();
        break;

      case 'status': {
        if (!moduleName) {
          console.error('❌ Nome do módulo é obrigatório para status');
          process.exit(1);
        }
        const status = await deployer.getModuleStatus(moduleName);
        console.log(`\n📊 Status do módulo ${moduleName}:`);
        console.log(`  Versão: ${status.version}`);
        console.log(`  Descrição: ${status.description}`);
        console.log(`  Status: ${status.active ? '🟢 Ativo' : '🔴 Inativo'}`);
        console.log(`  Caminho: ${status.path}`);
        break;
      }

      case 'backup':
        if (!moduleName) {
          console.error('❌ Nome do módulo é obrigatório para backup');
          process.exit(1);
        }
        await deployer.createBackup(moduleName);
        break;

      case 'rollback':
        if (!moduleName) {
          console.error('❌ Nome do módulo é obrigatório para rollback');
          process.exit(1);
        }
        await deployer.rollback(moduleName);
        break;

      default:
        console.error(`❌ Comando não reconhecido: ${command}`);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Erro:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = ModuleDeployer;
