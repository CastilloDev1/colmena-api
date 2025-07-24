import 'jest-extended';

/**
 * Configuración global para tests de Jest
 * 
 * Este archivo se ejecuta antes de cada test suite y configura:
 * - Extensiones de Jest para matchers adicionales
 * - Configuraciones globales de timeout
 * - Mocks globales si son necesarios
 * - Variables de entorno para testing
 */

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Configurar timezone para tests consistentes
process.env.TZ = 'UTC';

// Mock global para console.log en tests (opcional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Configurar timeout global para tests lentos
jest.setTimeout(10000);

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
