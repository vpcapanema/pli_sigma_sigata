// Setup para testes
require('dotenv').config({ path: '.env.test' });

// Mock do console para testes mais limpos
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Configurações globais para testes
jest.setTimeout(30000);

// Setup de variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.LOG_LEVEL = 'error';
