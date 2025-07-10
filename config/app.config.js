module.exports = {
  // Configuração do servidor
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },

  // Configuração do banco de dados
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'sigma_pli',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000
  },

  // Configuração de segurança
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'session-secret',
    sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000
  },

  // Configuração de upload
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || '50MB',
    allowedExtensions: process.env.ALLOWED_EXTENSIONS?.split(',') || [
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'jpg',
      'jpeg',
      'png',
      'gif'
    ]
  },

  // Configuração de email
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || ''
      }
    },
    from: process.env.FROM_EMAIL || 'noreply@sigma-pli.com'
  },

  // Configuração de logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '10MB',
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5
  },

  // Configuração de rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Configuração de módulos
  modules: {
    path: process.env.MODULES_PATH || './src/modules',
    enabled: process.env.MODULES_ENABLED?.split(',') || [
      'core',
      'products',
      'reports',
      'auth',
      'settings'
    ]
  },

  // URLs da aplicação
  urls: {
    apiBase: process.env.API_BASE_URL || 'http://localhost:3000/api',
    frontend: process.env.FRONTEND_URL || 'http://localhost:3000'
  },

  // Configuração de backup
  backup: {
    dir: process.env.BACKUP_DIR || './backups',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
    autoBackupEnabled: process.env.AUTO_BACKUP_ENABLED === 'true',
    autoBackupInterval: process.env.AUTO_BACKUP_INTERVAL || '24h'
  }
};
