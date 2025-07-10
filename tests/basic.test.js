// Teste básico para verificar se o sistema está funcionando
const ModuleLoader = require('../src/shared/utils/module-loader');

describe('Sistema SIGMA PLI', () => {
  describe('ModuleLoader', () => {
    test('deve ser uma classe', () => {
      expect(typeof ModuleLoader).toBe('function');
    });

    test('deve criar uma instância', () => {
      const loader = new ModuleLoader();
      expect(loader).toBeInstanceOf(ModuleLoader);
    });
  });

  describe('Configurações básicas', () => {
    test('deve ter NODE_ENV definido como test', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });

    test('deve ter porta definida', () => {
      expect(process.env.PORT).toBeDefined();
    });
  });
});
