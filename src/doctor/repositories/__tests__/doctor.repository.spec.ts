import { Test, TestingModule } from '@nestjs/testing';
import { DoctorRepository } from '../doctor.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateDoctorDto } from '../../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../../dto/update-doctor.dto';
import { TestDataFactory, createMockPrismaService } from '../../../../test/test-helpers';

describe('DoctorRepository', () => {
  let repository: DoctorRepository;
  let mockPrismaService: jest.Mocked<ReturnType<typeof createMockPrismaService>>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<DoctorRepository>(DoctorRepository);
    mockPrismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.doctor.create with correct data', async () => {
      const createDoctorDto: CreateDoctorDto = TestDataFactory.createDoctorData();
      const expectedDoctor = { doctorId: 'uuid-123', ...createDoctorDto };

      mockPrismaService.doctor.create.mockResolvedValue(expectedDoctor);

      const result = await repository.create(createDoctorDto);

      expect(mockPrismaService.doctor.create).toHaveBeenCalledWith({
        data: createDoctorDto,
      });
      expect(result).toEqual(expectedDoctor);
    });

    it('should handle prisma errors during creation', async () => {
      const createDoctorDto: CreateDoctorDto = TestDataFactory.createDoctorData();

      mockPrismaService.doctor.create.mockRejectedValue(new Error('Prisma error'));

      await expect(repository.create(createDoctorDto)).rejects.toThrow('Prisma error');
      expect(mockPrismaService.doctor.create).toHaveBeenCalledWith({
        data: createDoctorDto,
      });
    });
  });

  describe('findAll', () => {
    it('should call prisma.doctor.findMany', async () => {
      const expectedDoctors = [
        TestDataFactory.createDoctorWithTimestamps({ id: '12345678' }),
        TestDataFactory.createDoctorWithTimestamps({ id: '87654321', firstName: 'Carlos' }),
      ];

      mockPrismaService.doctor.findMany.mockResolvedValue(expectedDoctors);

      const result = await repository.findAll();

      expect(mockPrismaService.doctor.findMany).toHaveBeenCalled();
      expect(result).toEqual(expectedDoctors);
    });

    it('should return empty array when no doctors found', async () => {
      mockPrismaService.doctor.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(mockPrismaService.doctor.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should call prisma.doctor.findUnique with correct id', async () => {
      const doctorId = 'uuid-123';
      const expectedDoctor = { doctorId, ...TestDataFactory.createDoctorData() };

      mockPrismaService.doctor.findUnique.mockResolvedValue(expectedDoctor);

      const result = await repository.findById(doctorId);

      expect(mockPrismaService.doctor.findUnique).toHaveBeenCalledWith({
        where: { doctorId },
      });
      expect(result).toEqual(expectedDoctor);
    });

    it('should return null when doctor not found', async () => {
      const doctorId = 'non-existent-uuid';

      mockPrismaService.doctor.findUnique.mockResolvedValue(null);

      const result = await repository.findById(doctorId);

      expect(mockPrismaService.doctor.findUnique).toHaveBeenCalledWith({
        where: { doctorId },
      });
      expect(result).toBeNull();
    });
  });

  describe('findByIdentification', () => {
    it('should call prisma.doctor.findFirst with correct id', async () => {
      const identification = '12345678';
      const expectedDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId: 'uuid-123', id: identification });

      mockPrismaService.doctor.findFirst.mockResolvedValue(expectedDoctor);

      const result = await repository.findByIdentification(identification);

      expect(mockPrismaService.doctor.findFirst).toHaveBeenCalledWith({
        where: { id: identification },
      });
      expect(result).toEqual(expectedDoctor);
    });

    it('should return null when doctor not found by identification', async () => {
      const identification = 'non-existent-id';

      mockPrismaService.doctor.findFirst.mockResolvedValue(null);

      const result = await repository.findByIdentification(identification);

      expect(mockPrismaService.doctor.findFirst).toHaveBeenCalledWith({
        where: { id: identification },
      });
      expect(result).toBeNull();
    });

    it('should find doctor by identification (id field only)', async () => {
      const identification = 'doctor@hospital.com';
      const expectedDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId: 'uuid-123', id: identification });

      mockPrismaService.doctor.findFirst.mockResolvedValue(expectedDoctor);

      const result = await repository.findByIdentification(identification);

      expect(mockPrismaService.doctor.findFirst).toHaveBeenCalledWith({
        where: { id: identification },
      });
      expect(result).toEqual(expectedDoctor);
    });
  });

  describe('update', () => {
    it('should call prisma.doctor.update with correct data', async () => {
      const doctorId = 'uuid-123';
      const updateDoctorDto: UpdateDoctorDto = { firstName: 'Updated', city: 'Cali' };
      const expectedDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId, ...updateDoctorDto });

      mockPrismaService.doctor.update.mockResolvedValue(expectedDoctor);

      const result = await repository.update(doctorId, updateDoctorDto);

      expect(mockPrismaService.doctor.update).toHaveBeenCalledWith({
        where: { doctorId },
        data: updateDoctorDto,
      });
      expect(result).toEqual(expectedDoctor);
    });

    it('should handle prisma errors during update', async () => {
      const doctorId = 'uuid-123';
      const updateDoctorDto: UpdateDoctorDto = { firstName: 'Updated' };

      mockPrismaService.doctor.update.mockRejectedValue(new Error('Update failed'));

      await expect(repository.update(doctorId, updateDoctorDto)).rejects.toThrow('Update failed');
      expect(mockPrismaService.doctor.update).toHaveBeenCalledWith({
        where: { doctorId },
        data: updateDoctorDto,
      });
    });
  });

  describe('remove', () => {
    it('should call prisma.doctor.delete with correct id', async () => {
      const doctorId = 'uuid-123';
      const deletedDoctor = { doctorId, ...TestDataFactory.createDoctorData() };
      const expectedResult = { message: 'Doctor eliminado exitosamente' };

      mockPrismaService.doctor.delete.mockResolvedValue(deletedDoctor);

      const result = await repository.remove(doctorId);

      expect(mockPrismaService.doctor.delete).toHaveBeenCalledWith({
        where: { doctorId },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle prisma errors during deletion', async () => {
      const doctorId = 'uuid-123';

      mockPrismaService.doctor.delete.mockRejectedValue(new Error('Deletion failed'));

      await expect(repository.remove(doctorId)).rejects.toThrow('Deletion failed');
      expect(mockPrismaService.doctor.delete).toHaveBeenCalledWith({
        where: { doctorId },
      });
    });
  });
});
