const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const config = require('./config/app.config');
const ModuleLoader = require('./src/shared/utils/module-loader');
const logger = require('./src/shared/utils/logger');
const errorHandler = require('./src/shared/utils/error-handler');
const rateLimiter = require('./src/shared/utils/rate-limiter');

class SigmaPliServer {
  constructor() {
    this.app = express();
    this.moduleLoader = new ModuleLoader();
    this.init();
  }

  async init() {
    try {
      // Configurar middlewares de segurança
      this.setupSecurity();

      // Configurar middlewares básicos
      this.setupMiddlewares();

      // Configurar arquivos estáticos
      this.setupStaticFiles();

      // Carregar módulos
      await this.loadModules();

      // Configurar tratamento de erros
      this.setupErrorHandling();

      // Iniciar servidor
      this.startServer();
    } catch (error) {
      logger.error('Erro ao inicializar servidor:', error);
      process.exit(1);
    }
  }

  setupSecurity() {
    // Helmet para segurança com CSP mais flexível
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ['\'self\''],
            styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
            scriptSrc: ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\''],
            imgSrc: ['\'self\'', 'data:', 'https:'],
            connectSrc: ['\'self\''],
            fontSrc: ['\'self\'', 'https://fonts.gstatic.com'],
            objectSrc: ['\'none\''],
            mediaSrc: ['\'self\''],
            frameSrc: ['\'none\'']
          }
        }
      })
    );

    // CORS
    this.app.use(
      cors({
        origin: config.urls.frontend,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      })
    );

    // Rate limiting
    this.app.use(rateLimiter);
  }

  setupMiddlewares() {
    // Compressão
    this.app.use(compression());

    // Parsing de dados
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging de requisições
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  setupStaticFiles() {
    // Servir arquivos estáticos do src
    this.app.use('/static', express.static(path.join(__dirname, 'src')));
    
    // Servir arquivos estáticos dos mockups
    this.app.use('/mockups', express.static(path.join(__dirname, 'mockups')));
    this.app.use('/demo-assets', express.static(path.join(__dirname, '09_DEMO_APP/static')));

    // Rota para visualizar os mockups
    this.app.get('/view/:visual', (req, res) => {
      const visual = req.params.visual;
      res.sendFile(path.join(__dirname, 'mockups', visual, 'index.html'));
    });

    // Servir arquivos estáticos dos módulos
    this.app.use('/modules', express.static(path.join(__dirname, 'src/modules')));
  }

  async loadModules() {
    logger.info('Carregando módulos...');

    const modules = config.modules.enabled;

    for (const moduleName of modules) {
      try {
        await this.moduleLoader.load(moduleName, this.app);
        logger.info(`Módulo ${moduleName} carregado com sucesso`);
      } catch (error) {
        logger.error(`Erro ao carregar módulo ${moduleName}:`, error);
        throw error;
      }
    }
  }

  setupErrorHandling() {
    // Rota principal - servir página inicial
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'src/modules/core/templates/index-simple.html'));
    });

    // Rota para template original
    this.app.get('/original', (req, res) => {
      res.sendFile(path.join(__dirname, 'src/modules/core/templates/index.html'));
    });

    // Rota de teste
    this.app.get('/test', (req, res) => {
      res.sendFile(path.join(__dirname, 'src/modules/core/templates/test.html'));
    });

    // Rota dashboard
    this.app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'src/modules/core/templates/dashboard.html'));
    });

    // Rotas para servir templates HTML
    this.app.get('/products', (req, res) => {
      res.sendFile(path.join(__dirname, 'src/modules/products/templates/products.html'));
    });

    this.app.get('/reports', (req, res) => {
      res.sendFile(path.join(__dirname, 'src/modules/reports/templates/reports.html'));
    });

    this.app.get('/settings', (req, res) => {
      res.sendFile(path.join(__dirname, 'src/modules/settings/templates/settings.html'));
    });

    this.app.get('/auth/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'src/modules/auth/templates/login.html'));
    });

    // Rota específica para favicon
    this.app.get('/favicon.ico', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/assets/favicon.svg'));
    });

    // API health check
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'SIGMA PLI API está rodando',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        modules: config.modules.enabled,
        environment: config.server.env
      });
    });

    this.app.get('/api/health', (req, res) => {
      const uptime = Math.floor(process.uptime());
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime
      });
    });

    // API de Produtos
    this.app.get('/api/products', (req, res) => {
      // Dados de exemplo para desenvolvimento
      const products = [
        { id: 1, name: 'Smartphone Galaxy', category: 'electronics', price: 1299.99, stock: 25, description: 'Smartphone Android com 128GB' },
        { id: 2, name: 'Notebook Dell', category: 'electronics', price: 2499.99, stock: 10, description: 'Notebook Dell Inspiron 15' },
        { id: 3, name: 'Camiseta Polo', category: 'clothing', price: 79.99, stock: 50, description: 'Camiseta polo masculina' },
        { id: 4, name: 'Livro JavaScript', category: 'books', price: 45.99, stock: 30, description: 'Livro sobre JavaScript' },
        { id: 5, name: 'Mesa de Escritório', category: 'home', price: 299.99, stock: 8, description: 'Mesa de escritório em madeira' }
      ];
      res.json({ success: true, data: products });
    });

    // API de Relatórios
    this.app.get('/api/reports/financial', (req, res) => {
      const data = {
        totalRevenue: 125000.50,
        netProfit: 35000.25,
        profitMargin: 28.0
      };
      res.json({ success: true, data });
    });

    this.app.get('/api/reports/sales', (req, res) => {
      const data = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        values: [12000, 19000, 15000, 22000, 18000, 25000]
      };
      res.json({ success: true, data });
    });

    this.app.get('/api/reports/products', (req, res) => {
      const data = {
        labels: ['Eletrônicos', 'Roupas', 'Livros', 'Casa'],
        values: [300, 150, 100, 80]
      };
      res.json({ success: true, data });
    });

    this.app.get('/api/reports/stock', (req, res) => {
      const data = [
        { name: 'Smartphone Galaxy', category: 'Eletrônicos', stock: 5 },
        { name: 'Notebook Dell', category: 'Eletrônicos', stock: 2 },
        { name: 'Mesa de Escritório', category: 'Casa', stock: 8 },
        { name: 'Camiseta Polo', category: 'Roupas', stock: 15 }
      ];
      res.json({ success: true, data });
    });

    // API de Configurações
    this.app.get('/api/settings', (req, res) => {
      const settings = {
        companyName: 'SIGMA PLI',
        companyEmail: 'contato@sigmapli.com',
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        requireStrongPassword: true,
        enableTwoFactor: false,
        sessionTimeout: 30,
        maxLoginAttempts: 3,
        enableAutoBackup: true,
        backupFrequency: 'daily',
        backupTime: '02:00'
      };
      res.json({ success: true, data: settings });
    });

    // API de Usuários
    this.app.get('/api/users', (req, res) => {
      const users = [
        { id: 1, name: 'Admin', email: 'admin@sigmapli.com', role: 'admin', status: 'active' },
        { id: 2, name: 'João Silva', email: 'joao@sigmapli.com', role: 'manager', status: 'active' },
        { id: 3, name: 'Maria Santos', email: 'maria@sigmapli.com', role: 'user', status: 'inactive' }
      ];
      res.json({ success: true, data: users });
    });

    // API de Estatísticas para Dashboard
    this.app.get('/api/stats', (req, res) => {
      const stats = {
        totalProducts: 150,
        totalUsers: 25,
        totalSales: 1250,
        monthlyRevenue: 45000.75,
        lowStockCount: 8,
        pendingOrders: 12
      };
      res.json({ success: true, data: stats });
    });

    // API de Autenticação
    this.app.get('/api/auth/me', (req, res) => {
      // Simular usuário logado
      res.json({
        success: true,
        data: {
          id: 1,
          name: 'Admin',
          email: 'admin@sigmapli.com',
          role: 'admin'
        }
      });
    });

    this.app.post('/api/auth/logout', (req, res) => {
      res.json({ success: true, message: 'Logout realizado com sucesso' });
    });

    // API de Notificações
    this.app.get('/api/core/notifications/unread', (req, res) => {
      const notifications = [
        { id: 1, message: 'Bem-vindo ao SIGMA PLI!', type: 'info', read: false },
        { id: 2, message: 'Sistema atualizado com sucesso', type: 'success', read: false }
      ];
      res.json({ success: true, data: notifications });
    });

    // Rota de login redirect
    this.app.get('/login', (req, res) => {
      res.redirect('/auth/login');
    });

    // Middleware de tratamento de erros
    this.app.use(errorHandler);

    // Rota 404
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
      });
    });
  }

  startServer() {
    this.app.listen(config.server.port, config.server.host, () => {
      logger.info(
        `Servidor SIGMA PLI rodando em http://${config.server.host}:${config.server.port}`
      );
      logger.info(`Ambiente: ${config.server.env}`);
      logger.info(`Módulos carregados: ${config.modules.enabled.join(', ')}`);
    });
  }
}

// Tratamento de erros não capturados
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Inicializar servidor
new SigmaPliServer();
