const winston = require('winston');
const path = require('path');
const config = require('../../../config/app.config');

// Criar diretório de logs se não existir
const fs = require('fs');
const logDir = path.dirname(config.logging.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configurar formatos de log
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Criar logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [
    // Arquivo de log
    new winston.transports.File({
      filename: config.logging.file,
      maxsize: config.logging.maxSize,
      maxFiles: config.logging.maxFiles,
      tailable: true
    }),

    // Console (apenas em desenvolvimento)
    ...(config.server.env === 'development'
      ? [
          new winston.transports.Console({
            format: consoleFormat
          })
        ]
      : [])
  ]
});

// Adicionar métodos personalizados
logger.module = moduleName => {
  return {
    info: (message, meta) => logger.info(`[${moduleName}] ${message}`, meta),
    error: (message, meta) => logger.error(`[${moduleName}] ${message}`, meta),
    warn: (message, meta) => logger.warn(`[${moduleName}] ${message}`, meta),
    debug: (message, meta) => logger.debug(`[${moduleName}] ${message}`, meta)
  };
};

module.exports = logger;
