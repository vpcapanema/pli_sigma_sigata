module.exports = {
  name: 'core',
  version: '1.0.0',
  description: 'Módulo principal do sistema SIGMA PLI',

  // Dependências do módulo
  dependencies: [],

  // Rotas do módulo
  routes: ['/dashboard', '/users', '/events', '/notifications'],

  // Middleware específico do módulo
  middleware: [],

  // Configurações específicas
  settings: {
    // Dashboard
    dashboard: {
      // 30 segundos
      refreshInterval: 30000,
      maxRecentItems: 10,
      enableRealTimeUpdates: true
    },

    // Usuários
    users: {
      maxLoginAttempts: 5,
      // 15 minutos
      lockoutDuration: 900000,
      passwordMinLength: 8,
      requirePasswordChange: true,
      // 90 dias
      passwordChangeInterval: 7776000000
    },

    // Eventos
    events: {
      maxEventsPerDay: 10,
      // 1 hora
      defaultEventDuration: 3600000,
      // 24h, 1h, 15min
      reminderTimes: [86400000, 3600000, 900000],
      allowPublicEvents: false
    },

    // Notificações
    notifications: {
      maxNotificationsPerUser: 100,
      // 30 dias
      defaultExpirationTime: 2592000000,
      enableEmailNotifications: true,
      enablePushNotifications: false
    }
  },

  // Permissões do módulo
  permissions: [
    'core.dashboard.view',
    'core.users.view',
    'core.users.create',
    'core.users.edit',
    'core.users.delete',
    'core.events.view',
    'core.events.create',
    'core.events.edit',
    'core.events.delete',
    'core.notifications.view',
    'core.notifications.create',
    'core.notifications.delete',
    'core.admin.settings'
  ],

  // Tabelas do banco de dados
  database: {
    tables: ['users', 'user_sessions', 'events', 'notifications', 'user_permissions', 'audit_logs']
  }
};
