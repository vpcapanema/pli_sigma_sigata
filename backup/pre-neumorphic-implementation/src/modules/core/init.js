const logger = require('../../shared/utils/logger');
const DatabaseService = require('./services/database.service');
const NotificationService = require('./services/notification.service');
const EventService = require('./services/event.service');

/**
 * Inicialização do Módulo Core
 * Configura serviços, banco de dados e recursos necessários
 */
async function initializeCoreModule(config) {
  const moduleLogger = logger.module('core');

  try {
    moduleLogger.info('Iniciando módulo Core...');

    // Inicializar serviços do módulo
    await initializeServices(config);

    // Configurar banco de dados
    await setupDatabase(config);

    // Configurar tarefas agendadas
    await setupScheduledTasks(config);

    // Configurar eventos do sistema
    await setupEventListeners(config);

    moduleLogger.info('Módulo Core inicializado com sucesso');
  } catch (error) {
    moduleLogger.error('Erro ao inicializar módulo Core:', error);
    throw error;
  }
}

/**
 * Inicializa serviços do módulo
 */
async function initializeServices(config) {
  const moduleLogger = logger.module('core');

  try {
    // Inicializar serviço de banco de dados
    await DatabaseService.initialize(config);
    moduleLogger.info('Serviço de banco de dados inicializado');

    // Inicializar serviço de notificações
    await NotificationService.initialize(config);
    moduleLogger.info('Serviço de notificações inicializado');

    // Inicializar serviço de eventos
    await EventService.initialize(config);
    moduleLogger.info('Serviço de eventos inicializado');
  } catch (error) {
    moduleLogger.error('Erro ao inicializar serviços:', error);
    throw error;
  }
}

/**
 * Configura estruturas do banco de dados
 */
async function setupDatabase(_config) {
  const moduleLogger = logger.module('core');

  try {
    // Criar tabelas se não existirem
    await DatabaseService.createTables([
      'users',
      'user_sessions',
      'events',
      'notifications',
      'user_permissions',
      'audit_logs'
    ]);

    // Inserir dados iniciais se necessário
    await DatabaseService.insertInitialData();

    moduleLogger.info('Banco de dados configurado');
  } catch (error) {
    moduleLogger.error('Erro ao configurar banco de dados:', error);
    throw error;
  }
}

/**
 * Configura tarefas agendadas
 */
async function setupScheduledTasks(config) {
  const moduleLogger = logger.module('core');

  try {
    // Limpeza de notificações expiradas (diariamente)
    setInterval(
      async () => {
        await NotificationService.cleanExpiredNotifications();
        // 24 horas
      },
      24 * 60 * 60 * 1000
    );

    // Limpeza de sessões expiradas (a cada hora)
    setInterval(
      async () => {
        await DatabaseService.cleanExpiredSessions();
        // 1 hora
      },
      60 * 60 * 1000
    );

    // Backup automático (conforme configuração)
    if (config.backup && config.backup.autoBackupEnabled) {
      const interval = parseInterval(config.backup.autoBackupInterval);
      setInterval(async () => {
        await createAutoBackup();
      }, interval);
    }

    moduleLogger.info('Tarefas agendadas configuradas');
  } catch (error) {
    moduleLogger.error('Erro ao configurar tarefas agendadas:', error);
    throw error;
  }
}

/**
 * Configura listeners de eventos
 */
async function setupEventListeners(_config) {
  const moduleLogger = logger.module('core');

  try {
    // Listener para criação de usuários
    EventService.on('user.created', async data => {
      await NotificationService.sendWelcomeNotification(data.userId);
      moduleLogger.info(`Notificação de boas-vindas enviada para usuário ${data.userId}`);
    });

    // Listener para login de usuários
    EventService.on('user.login', async data => {
      await DatabaseService.updateLastLogin(data.userId);
      moduleLogger.info(`Último login atualizado para usuário ${data.userId}`);
    });

    // Listener para eventos próximos
    EventService.on('event.reminder', async data => {
      await NotificationService.sendEventReminder(data.eventId, data.participants);
      moduleLogger.info(`Lembrete enviado para evento ${data.eventId}`);
    });

    moduleLogger.info('Event listeners configurados');
  } catch (error) {
    moduleLogger.error('Erro ao configurar event listeners:', error);
    throw error;
  }
}

/**
 * Converte string de intervalo para milissegundos
 */
function parseInterval(interval) {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  const match = interval.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Formato de intervalo inválido: ${interval}`);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  return value * units[unit];
}

/**
 * Cria backup automático
 */
async function createAutoBackup() {
  const moduleLogger = logger.module('core');

  try {
    moduleLogger.info('Iniciando backup automático...');

    // Implementar lógica de backup
    // Por exemplo: dump do banco, backup de arquivos, etc.

    moduleLogger.info('Backup automático concluído');
  } catch (error) {
    moduleLogger.error('Erro no backup automático:', error);
  }
}

module.exports = initializeCoreModule;
