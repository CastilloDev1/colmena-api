import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from '../patient.service';
import { PatientRepository } from '../../repositories/patient.repository';
import { CreatePatientDto } from '../../dto/create-patient.dto';
import { UpdatePatientDto } from '../../dto/update-patient.dto';
import { NotFoundException } from '@nestjs/common';

// Mock del PatientRepository
const mockPatientRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIdentification: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('PatientService', () => {
  let service: PatientService;
  let repository: PatientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: PatientRepository,
          useValue: mockPatientRepository,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    repository = module.get<PatientRepository>(PatientRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    describe('create', () => {
    it('should create a new patient', async () => {
      const createPatientDto: CreatePatientDto = {
        id: '123456789',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'Anytown',
      };
      const expectedPatient = { patientId: 'uuid-1', ...createPatientDto, createdAt: new Date(), updatedAt: new Date() };

      mockPatientRepository.create.mockResolvedValue(expectedPatient);

      const result = await service.create(createPatientDto);
      expect(result).toEqual(expectedPatient);
      expect(repository.create).toHaveBeenCalledWith(createPatientDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const expectedPatients = [{ patientId: 'uuid-1', id: '123' }];
      mockPatientRepository.findAll.mockResolvedValue(expectedPatients);

      const result = await service.findAll();
      expect(result).toEqual(expectedPatients);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single patient if found', async () => {
      const identification = '12345';
      const expectedPatient = { patientId: 'uuid-1', id: identification };
      mockPatientRepository.findByIdentification.mockResolvedValue(expectedPatient);

      const result = await service.findOne(identification);
      expect(result).toEqual(expectedPatient);
      expect(repository.findByIdentification).toHaveBeenCalledWith(identification);
    });

    it('should throw NotFoundException if patient is not found', async () => {
      const identification = 'not-found-id';
      mockPatientRepository.findByIdentification.mockResolvedValue(null);

      await expect(service.findOne(identification)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a patient successfully', async () => {
      const identification = '12345';
      const patientId = 'uuid-for-12345';
      const updatePatientDto: UpdatePatientDto = { firstName: 'Jane' };
      const foundPatient = { patientId, id: identification };
      const updatedPatient = { ...foundPatient, ...updatePatientDto };

      mockPatientRepository.findByIdentification.mockResolvedValue(foundPatient);
      mockPatientRepository.update.mockResolvedValue(updatedPatient);

      const result = await service.update(identification, updatePatientDto);
      expect(result).toEqual(updatedPatient);
      expect(repository.findByIdentification).toHaveBeenCalledWith(identification);
      expect(repository.update).toHaveBeenCalledWith(patientId, updatePatientDto);
    });

    it('should throw NotFoundException if patient to update is not found', async () => {
      const identification = 'not-found-id';
      const updatePatientDto: UpdatePatientDto = { firstName: 'Jane' };
      mockPatientRepository.findByIdentification.mockResolvedValue(null);

      await expect(service.update(identification, updatePatientDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a patient successfully', async () => {
      const identification = '12345';
      const patientId = 'uuid-for-12345';
      const foundPatient = { patientId, id: identification };
      const successMessage = { message: 'Paciente eliminado exitosamente' };

      mockPatientRepository.findByIdentification.mockResolvedValue(foundPatient);
      mockPatientRepository.remove.mockResolvedValue(successMessage);

      const result = await service.remove(identification);
      expect(result).toEqual(successMessage);
      expect(repository.findByIdentification).toHaveBeenCalledWith(identification);
      expect(repository.remove).toHaveBeenCalledWith(patientId);
    });

    it('should throw NotFoundException if patient to remove is not found', async () => {
      const identification = 'not-found-id';
      mockPatientRepository.findByIdentification.mockResolvedValue(null);

      await expect(service.remove(identification)).rejects.toThrow(NotFoundException);
    });
  });
});
