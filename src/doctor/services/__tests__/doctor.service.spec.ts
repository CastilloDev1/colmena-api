import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DoctorService } from '../doctor.service';
import { DoctorRepository } from '../../repositories/doctor.repository';
import { CreateDoctorDto } from '../../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../../dto/update-doctor.dto';
import { TestDataFactory } from '../../../test/test-helpers';

describe('DoctorService', () => {
  let service: DoctorService;
  let mockDoctorRepository: jest.Mocked<DoctorRepository>;

  // Mock del repositorio con todos los métodos necesarios
  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByIdentification: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: DoctorRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    mockDoctorRepository = module.get(DoctorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDoctorDto: CreateDoctorDto = TestDataFactory.createDoctorData();

    it('should create a new doctor successfully', async () => {
      const expectedDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId: 'uuid-123' });
      
      mockDoctorRepository.findByIdentification.mockResolvedValue(null);
      mockDoctorRepository.create.mockResolvedValue(expectedDoctor);

      const result = await service.create(createDoctorDto);

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(createDoctorDto.id);
      expect(mockDoctorRepository.create).toHaveBeenCalledWith(createDoctorDto);
      expect(result).toEqual(expectedDoctor);
    });

    it('should throw InternalServerErrorException if doctor with same id already exists', async () => {
      const existingDoctor = TestDataFactory.createDoctorWithTimestamps({ 
        doctorId: 'uuid-456', 
        id: createDoctorDto.id, 
        email: 'other@email.com' 
      });
      
      mockDoctorRepository.findByIdentification.mockResolvedValue(existingDoctor);

      await expect(service.create(createDoctorDto)).rejects.toThrow(
        new InternalServerErrorException('Ya existe un doctor con este id')
      );

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(createDoctorDto.id);
      expect(mockDoctorRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if doctor with same email already exists', async () => {
      const existingDoctor = TestDataFactory.createDoctorWithTimestamps({ 
        doctorId: 'uuid-456', 
        id: 'different-id', 
        email: createDoctorDto.email 
      });
      
      mockDoctorRepository.findByIdentification.mockResolvedValue(existingDoctor);

      await expect(service.create(createDoctorDto)).rejects.toThrow(
        new InternalServerErrorException('Ya existe un doctor con este email')
      );

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(createDoctorDto.id);
      expect(mockDoctorRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors during creation', async () => {
      mockDoctorRepository.findByIdentification.mockResolvedValue(null);
      mockDoctorRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDoctorDto)).rejects.toThrow('Database error');

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(createDoctorDto.id);
      expect(mockDoctorRepository.create).toHaveBeenCalledWith(createDoctorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of doctors', async () => {
      const expectedDoctors = [
        TestDataFactory.createDoctorWithTimestamps({ id: '12345678' }),
        TestDataFactory.createDoctorWithTimestamps({ id: '87654321', firstName: 'Carlos' }),
      ];

      mockDoctorRepository.findAll.mockResolvedValue(expectedDoctors);

      const result = await service.findAll();

      expect(mockDoctorRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedDoctors);
    });

    it('should return empty array when no doctors exist', async () => {
      mockDoctorRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockDoctorRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      mockDoctorRepository.findAll.mockRejectedValue(new Error('Database connection error'));

      await expect(service.findAll()).rejects.toThrow('Database connection error');
      expect(mockDoctorRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const doctorId = 'uuid-123';

    it('should return a single doctor if found', async () => {
      const expectedDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId });
      
      mockDoctorRepository.findByIdentification.mockResolvedValue(expectedDoctor);

      const result = await service.findOne(doctorId);

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
      expect(result).toEqual(expectedDoctor);
    });

    it('should throw NotFoundException if doctor is not found', async () => {
      mockDoctorRepository.findByIdentification.mockResolvedValue(null);

      await expect(service.findOne(doctorId)).rejects.toThrow(
        new NotFoundException('Doctor no encontrado')
      );

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
    });

    it('should handle repository errors', async () => {
      mockDoctorRepository.findByIdentification.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(doctorId)).rejects.toThrow('Database error');
      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
    });
  });

  describe('update', () => {
    const doctorId = 'uuid-123';
    const updateDoctorDto: UpdateDoctorDto = { firstName: 'Updated Name', city: 'Cali' };

    it('should update a doctor successfully', async () => {
      const existingDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId });
      const updatedDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId, ...updateDoctorDto });

      mockDoctorRepository.findByIdentification.mockResolvedValue(existingDoctor);
      mockDoctorRepository.update.mockResolvedValue(updatedDoctor);

      const result = await service.update(doctorId, updateDoctorDto);

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
      expect(mockDoctorRepository.update).toHaveBeenCalledWith(doctorId, updateDoctorDto);
      expect(result).toEqual(updatedDoctor);
    });

    it('should throw NotFoundException if doctor to update is not found', async () => {
      mockDoctorRepository.findByIdentification.mockResolvedValue(null);

      await expect(service.update(doctorId, updateDoctorDto)).rejects.toThrow(
        new NotFoundException('Doctor no encontrado')
      );

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
      expect(mockDoctorRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors during update', async () => {
      const existingDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId });
      mockDoctorRepository.findByIdentification.mockResolvedValue(existingDoctor);
      mockDoctorRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.update(doctorId, updateDoctorDto)).rejects.toThrow('Update failed');

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
      expect(mockDoctorRepository.update).toHaveBeenCalledWith(doctorId, updateDoctorDto);
    });
  });

  describe('remove', () => {
    const doctorId = 'uuid-123';

    it('should remove a doctor successfully', async () => {
      const existingDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId });

      mockDoctorRepository.findByIdentification.mockResolvedValue(existingDoctor);
      mockDoctorRepository.remove.mockResolvedValue({ message: 'Doctor eliminado exitosamente' });

      const result = await service.remove(doctorId);

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
      expect(mockDoctorRepository.remove).toHaveBeenCalledWith(doctorId);
      expect(result).toEqual({ message: 'Doctor eliminado exitosamente' });
    });

    it('should throw NotFoundException if doctor to remove is not found', async () => {
      mockDoctorRepository.findByIdentification.mockResolvedValue(null);

      await expect(service.remove(doctorId)).rejects.toThrow(
        new NotFoundException('Doctor no encontrado')
      );

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
      expect(mockDoctorRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle repository errors during removal', async () => {
      const existingDoctor = TestDataFactory.createDoctorWithTimestamps({ doctorId });
      mockDoctorRepository.findByIdentification.mockResolvedValue(existingDoctor);
      mockDoctorRepository.remove.mockRejectedValue(new Error('Deletion failed'));

      await expect(service.remove(doctorId)).rejects.toThrow('Deletion failed');

      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(doctorId);
      expect(mockDoctorRepository.remove).toHaveBeenCalledWith(doctorId);
    });
  });
});
