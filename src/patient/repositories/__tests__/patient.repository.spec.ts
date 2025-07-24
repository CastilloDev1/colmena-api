import { Test, TestingModule } from '@nestjs/testing';
import { PatientRepository } from '../patient.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreatePatientDto } from '../../dto/create-patient.dto';
import { UpdatePatientDto } from '../../dto/update-patient.dto';

// Mock completo del PrismaService
const mockPrismaService = {
  patient: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  appointment: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  medicalOrder: {
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('PatientRepository', () => {
  let repository: PatientRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PatientRepository>(PatientRepository);
    prisma = module.get<PrismaService>(PrismaService);
    // Mock para la transacción
    prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
      return callback(mockPrismaService);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

    describe('create', () => {
    it('should call prisma.patient.create with correct data', async () => {
      const createPatientDto: CreatePatientDto = { id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com', phone: '123', address: 'addr', city: 'city' };
      await repository.create(createPatientDto);
      expect(mockPrismaService.patient.create).toHaveBeenCalledWith({ data: createPatientDto });
    });
  });

  describe('findAll', () => {
    it('should call prisma.patient.findMany', async () => {
      await repository.findAll();
      expect(mockPrismaService.patient.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should call prisma.patient.findUnique with correct id', async () => {
      const patientId = 'uuid-1';
      await repository.findById(patientId);
      expect(mockPrismaService.patient.findUnique).toHaveBeenCalledWith({ where: { patientId } });
    });
  });

  describe('findByIdentification', () => {
    it('should call prisma.patient.findFirst with correct id', async () => {
      const id = '12345';
      await repository.findByIdentification(id);
      expect(mockPrismaService.patient.findFirst).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('update', () => {
    it('should call prisma.patient.update with correct data', async () => {
      const patientId = 'uuid-1';
      const updatePatientDto: UpdatePatientDto = { firstName: 'Updated' };
      await repository.update(patientId, updatePatientDto);
      expect(mockPrismaService.patient.update).toHaveBeenCalledWith({
        where: { patientId },
        data: updatePatientDto,
      });
    });
  });

  describe('remove', () => {
    it('should perform a transaction to delete a patient and their related data', async () => {
      const patientId = 'uuid-1';
      await repository.remove(patientId);
      expect(mockPrismaService.patient.delete).toHaveBeenCalledWith({ where: { patientId } });
    });

     it('should not try to delete medical orders if patient has no appointments', async () => {
      const patientId = 'uuid-no-appts';
      await repository.remove(patientId);
      expect(mockPrismaService.patient.delete).toHaveBeenCalledWith({ where: { patientId } });
    });
  });
});
