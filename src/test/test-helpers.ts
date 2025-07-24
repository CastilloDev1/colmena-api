import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppointmentStatus } from '@prisma/client';

/**
 * Test Helpers Optimizados - API Colmena
 * Factory methods mínimos para cada dominio y utilidades de testing
 */

// ==================== FACTORY DE DATOS DE PRUEBA ====================

export const TestDataFactory = {
  // Patient Domain
  createPatientData: (overrides: Partial<any> = {}) => ({
    id: '12345678',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@test.com',
    phone: '3001234567',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    ...overrides,
  }),

  createPatientWithTimestamps: (overrides: Partial<any> = {}) => ({
    patientId: 'uuid-patient-123',
    ...TestDataFactory.createPatientData(),
    createdAt: new Date('2023-01-15T10:00:00.000Z'),
    updatedAt: new Date('2023-01-15T10:00:00.000Z'),
    ...overrides,
  }),

  // Doctor Domain
  createDoctorData: (overrides: Partial<any> = {}) => ({
    id: '87654321',
    firstName: 'María',
    lastName: 'García',
    email: 'maria.garcia@hospital.com',
    phone: '3007654321',
    address: 'Calle 456 #78-90',
    city: 'Medellín',
    businessCard: 'TP-987654',
    dateOfAdmission: new Date('2023-01-15T00:00:00.000Z'),
    ...overrides,
  }),

  createDoctorWithTimestamps: (overrides: Partial<any> = {}) => ({
    doctorId: 'uuid-doctor-123',
    ...TestDataFactory.createDoctorData(),
    createdAt: new Date('2023-01-15T10:00:00.000Z'),
    updatedAt: new Date('2023-01-15T10:00:00.000Z'),
    ...overrides,
  }),

  // Appointment Domain
  createAppointmentData: (overrides: Partial<any> = {}) => ({
    patientIdentification: '12345678',
    doctorIdentification: '87654321',
    date: '2025-12-25T10:00:00.000Z', // Fecha futura para pasar validación
    status: AppointmentStatus.SCHEDULED,
    ...overrides,
  }),

  createAppointmentWithTimestamps: (overrides: Partial<any> = {}) => ({
    id: 'uuid-appointment-123',
    appointmentId: 'uuid-appointment-123',
    patientId: 'uuid-patient-123',
    doctorId: 'uuid-doctor-123',
    date: new Date('2025-12-25T10:00:00.000Z'), // Fecha futura consistente
    status: AppointmentStatus.SCHEDULED,
    createdAt: new Date('2023-01-15T10:00:00.000Z'),
    updatedAt: new Date('2023-01-15T10:00:00.000Z'),
    patient: TestDataFactory.createPatientWithTimestamps(),
    doctor: TestDataFactory.createDoctorWithTimestamps(),
    ...overrides,
  }),

  // MedicalOrder Domain
  createMedicalOrderData: (overrides: Partial<any> = {}) => ({
    description: 'Examen de laboratorio',
    specialty: 'Medicina General',
    expirationDate: '2024-12-31',
    ...overrides,
  }),

  createMedicalOrderWithTimestamps: (overrides: Partial<any> = {}) => ({
    id: 'uuid-medical-order-123',
    appointmentId: 'uuid-appointment-123',
    ...TestDataFactory.createMedicalOrderData(),
    expirationDate: new Date('2024-12-31T00:00:00.000Z'),
    createdAt: new Date('2023-01-15T10:00:00.000Z'),
    updatedAt: new Date('2023-01-15T10:00:00.000Z'),
    ...overrides,
  }),

  createMedicalOrderWithRelations: (overrides: Partial<any> = {}) => ({
    ...TestDataFactory.createMedicalOrderWithTimestamps(),
    appointment: TestDataFactory.createAppointmentWithTimestamps(),
    medications: [],
    ...overrides,
  }),

  // Medication Domain
  createMedicationData: (overrides: Partial<any> = {}) => ({
    name: 'Acetaminofén',
    description: 'Analgésico y antipirético',
    diseases: ['dolor', 'fiebre'],
    ...overrides,
  }),

  createMedicationWithTimestamps: (overrides: Partial<any> = {}) => ({
    id: 'uuid-medication-123',
    ...TestDataFactory.createMedicationData(),
    createdAt: new Date('2023-01-15T10:00:00.000Z'),
    updatedAt: new Date('2023-01-15T10:00:00.000Z'),
    ...overrides,
  }),

  /**
   * Serializa datos para comparación con respuestas HTTP (convierte Date a string)
   */
  serializeForHttp: (data: any) => {
    return JSON.parse(JSON.stringify(data));
  },
};

// ==================== MOCKS DE PRISMA ====================

export const createMockPrismaService = () => ({
  patient: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  doctor: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  appointment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  medicalOrder: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  medication: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  medicalOrderMedication: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
});

// ==================== UTILIDADES DE TESTING ====================

/**
 * Crea una aplicación de prueba completa para tests de integración
 */
export const createTestApp = async (moduleMetadata: any): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule(moduleMetadata).compile();

  const app = moduleFixture.createNestApplication();
  
  // Configurar pipes de validación como en producción
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.init();
  return app;
};

/**
 * Ejecuta una request HTTP y valida respuesta básica
 */
export const makeRequest = (app: INestApplication) => ({
  get: (url: string) => request(app.getHttpServer()).get(url),
  post: (url: string, data?: any) => request(app.getHttpServer()).post(url).send(data),
  put: (url: string, data?: any) => request(app.getHttpServer()).put(url).send(data),
  patch: (url: string, data?: any) => request(app.getHttpServer()).patch(url).send(data),
  delete: (url: string) => request(app.getHttpServer()).delete(url),
});

/**
 * Valida estructura de respuesta de error estándar
 */
export const expectErrorResponse = (response: any, statusCode: number, message?: string) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('statusCode', statusCode);
  expect(response.body).toHaveProperty('message');
  
  if (message) {
    expect(response.body.message).toContain(message);
  }
};

/**
 * Valida estructura de respuesta exitosa
 */
export const expectSuccessResponse = (response: any, statusCode: number = 200) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toBeDefined();
};

// ==================== MATCHERS PERSONALIZADOS ====================

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R;
      toBeValidDate(): R;
    }
  }
}

expect.extend({
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },
  
  toBeValidDate(received: string) {
    const date = new Date(received);
    const pass = !isNaN(date.getTime());
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  },
});
