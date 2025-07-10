const path = require('path');
const fs = require('fs').promises;
const logger = require('./logger');

class ModuleLoader {
  constructor() {
    this.loadedModules = new Map();
    this.moduleConfigs = new Map();
  }

  async load(moduleName, app) {
    try {
      const moduleLogger = logger.module(moduleName);

      // Verificar se módulo já foi carregado
      if (this.loadedModules.has(moduleName)) {
        moduleLogger.warn('Módulo já carregado, pulando...');
        return;
      }

      // Carregar configuração do módulo
      const config = await this.loadModuleConfig(moduleName);
      this.moduleConfigs.set(moduleName, config);

      // Carregar rotas do módulo
      await this.loadModuleRoutes(moduleName, app);

      // Inicializar módulo
      await this.initializeModule(moduleName, config);

      this.loadedModules.set(moduleName, {
        name: moduleName,
        version: config.version,
        loadedAt: new Date(),
        status: 'active'
      });

      moduleLogger.info(`Módulo ${moduleName} v${config.version} carregado com sucesso`);
    } catch (error) {
      logger.error(`Erro ao carregar módulo ${moduleName}:`, error);
      throw error;
    }
  }

  async loadModuleConfig(moduleName) {
    const configPath = path.join(__dirname, '../../modules', moduleName, 'module.config.js');

    try {
      // Verificar se arquivo de config existe
      await fs.access(configPath);

      // Carregar configuração
      delete require.cache[require.resolve(configPath)];
      const config = require(configPath);

      return {
        name: moduleName,
        version: '1.0.0',
        dependencies: [],
        routes: [],
        middleware: [],
        ...config
      };
    } catch (error) {
      // Retornar configuração padrão se não encontrar arquivo
      return {
        name: moduleName,
        version: '1.0.0',
        dependencies: [],
        routes: [],
        middleware: []
      };
    }
  }

  async loadModuleRoutes(moduleName, app) {
    const routesPath = path.join(__dirname, '../../modules', moduleName, 'routes.js');

    try {
      // Verificar se arquivo de rotas existe
      await fs.access(routesPath);

      // Carregar rotas
      delete require.cache[require.resolve(routesPath)];
      const routes = require(routesPath);

      // Registrar rotas no express
      app.use(`/api/${moduleName}`, routes);

      logger.module(moduleName).info(`Rotas do módulo ${moduleName} registradas`);
    } catch (error) {
      logger.module(moduleName).warn(`Nenhuma rota encontrada para o módulo ${moduleName}`);
    }
  }

  async initializeModule(moduleName, config) {
    const initPath = path.join(__dirname, '../../modules', moduleName, 'init.js');

    try {
      // Verificar se arquivo de inicialização existe
      await fs.access(initPath);

      // Executar inicialização
      delete require.cache[require.resolve(initPath)];
      const init = require(initPath);

      if (typeof init === 'function') {
        await init(config);
      }

      logger.module(moduleName).info(`Módulo ${moduleName} inicializado`);
    } catch (error) {
      logger
        .module(moduleName)
        .info(`Nenhuma inicialização específica para o módulo ${moduleName}`);
    }
  }

  async unload(moduleName) {
    if (!this.loadedModules.has(moduleName)) {
      throw new Error(`Módulo ${moduleName} não está carregado`);
    }

    // Executar cleanup se existir
    await this.cleanupModule(moduleName);

    // Remover das estruturas de dados
    this.loadedModules.delete(moduleName);
    this.moduleConfigs.delete(moduleName);

    logger.module(moduleName).info(`Módulo ${moduleName} descarregado`);
  }

  async cleanupModule(moduleName) {
    const cleanupPath = path.join(__dirname, '../../modules', moduleName, 'cleanup.js');

    try {
      await fs.access(cleanupPath);

      const cleanup = require(cleanupPath);

      if (typeof cleanup === 'function') {
        await cleanup();
      }
    } catch (error) {
      // Ignorar se não houver cleanup específico
    }
  }

  getLoadedModules() {
    return Array.from(this.loadedModules.values());
  }

  getModuleConfig(moduleName) {
    return this.moduleConfigs.get(moduleName);
  }

  isModuleLoaded(moduleName) {
    return this.loadedModules.has(moduleName);
  }

  async reload(moduleName, app) {
    if (this.isModuleLoaded(moduleName)) {
      await this.unload(moduleName);
    }

    await this.load(moduleName, app);
  }
}

module.exports = ModuleLoader;
