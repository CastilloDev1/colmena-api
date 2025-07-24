import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { MedicationService } from '../medication.service';
import { MedicationRepository } from '../../repositories/medication.repository';

describe('MedicationService', () => {
  let service: MedicationService;
  let mockMedicationRepository: jest.Mocked<MedicationRepository>;

  // Helper function to create medication mock data
  const createMedicationMock = (overrides = {}) => ({
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Paracetamol',
    description: 'Analgésico y antipirético',
    diseases: ['dolor de cabeza', 'fiebre'],
    createdAt: new Date(),
    updatedAt: new Date(),
    medicalOrders: [],
    ...overrides
  });

  const createMedicationDto = {
    name: 'Paracetamol',
    description: 'Analgésico y antipirético',
    diseases: ['dolor de cabeza', 'fiebre']
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findByDisease: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      checkIfInUse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationService,
        {
          provide: MedicationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MedicationService>(MedicationService);
    mockMedicationRepository = module.get(MedicationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new medication successfully', async () => {
      const expectedMedication = createMedicationMock({ name: createMedicationDto.name });

      mockMedicationRepository.findByName.mockResolvedValue(null);
      mockMedicationRepository.create.mockResolvedValue(expectedMedication);

      const result = await service.create(createMedicationDto);

      expect(mockMedicationRepository.findByName).toHaveBeenCalledWith(createMedicationDto.name);
      expect(mockMedicationRepository.create).toHaveBeenCalledWith(createMedicationDto);
      expect(result).toEqual(expectedMedication);
    });

    it('should throw ConflictException if medication with same name already exists', async () => {
      const existingMedication = createMedicationMock({ name: createMedicationDto.name });

      mockMedicationRepository.findByName.mockResolvedValue(existingMedication);

      await expect(service.create(createMedicationDto)).rejects.toThrow(
        new ConflictException(`Ya existe un medicamento con el nombre "${createMedicationDto.name}"`)
      );

      expect(mockMedicationRepository.findByName).toHaveBeenCalledWith(createMedicationDto.name);
      expect(mockMedicationRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of medications', async () => {
      const expectedMedications = [
        createMedicationMock({ name: 'Paracetamol' }),
        createMedicationMock({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'Ibuprofeno' })
      ];

      mockMedicationRepository.findAll.mockResolvedValue(expectedMedications);

      const result = await service.findAll();

      expect(mockMedicationRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedMedications);
    });
  });

  describe('findById', () => {
    const medicationId = '550e8400-e29b-41d4-a716-446655440002';

    it('should return a medication if found', async () => {
      const expectedMedication = createMedicationMock({ id: medicationId });

      mockMedicationRepository.findById.mockResolvedValue(expectedMedication);

      const result = await service.findById(medicationId);

      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(result).toEqual(expectedMedication);
    });

    it('should throw NotFoundException if medication is not found', async () => {
      mockMedicationRepository.findById.mockResolvedValue(null);

      await expect(service.findById(medicationId)).rejects.toThrow(
        new NotFoundException(`Medicamento con ID ${medicationId} no encontrado`)
      );

      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
    });
  });

  describe('findByDisease', () => {
    const disease = 'Dolor de cabeza';

    it('should return medications for a specific disease', async () => {
      const expectedMedications = [
        createMedicationMock({ name: 'Paracetamol', diseases: ['dolor de cabeza', 'fiebre'] }),
        createMedicationMock({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'Ibuprofeno', diseases: ['dolor de cabeza', 'inflamación'] })
      ];

      mockMedicationRepository.findByDisease.mockResolvedValue(expectedMedications);

      const result = await service.findByDisease(disease);

      expect(mockMedicationRepository.findByDisease).toHaveBeenCalledWith(disease.toLowerCase());
      expect(result).toEqual(expectedMedications);
    });

    it('should throw BadRequestException if disease parameter is empty', async () => {
      await expect(service.findByDisease('')).rejects.toThrow(
        new BadRequestException('El parámetro "disease" es requerido')
      );

      expect(mockMedicationRepository.findByDisease).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const medicationId = '550e8400-e29b-41d4-a716-446655440003';
    const updateMedicationDto = {
      name: 'Paracetamol Actualizado',
      description: 'Descripción actualizada'
    };

    it('should update a medication successfully', async () => {
      const existingMedication = createMedicationMock({ id: medicationId });
      const updatedMedication = createMedicationMock({
        id: medicationId,
        name: updateMedicationDto.name,
        description: updateMedicationDto.description
      });

      mockMedicationRepository.findById.mockResolvedValue(existingMedication);
      mockMedicationRepository.findByName.mockResolvedValue(null);
      mockMedicationRepository.update.mockResolvedValue(updatedMedication);

      const result = await service.update(medicationId, updateMedicationDto);

      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(mockMedicationRepository.findByName).toHaveBeenCalledWith(updateMedicationDto.name);
      expect(mockMedicationRepository.update).toHaveBeenCalledWith(medicationId, updateMedicationDto);
      expect(result).toEqual(updatedMedication);
    });

    it('should throw NotFoundException if medication to update is not found', async () => {
      mockMedicationRepository.findById.mockResolvedValue(null);

      await expect(service.update(medicationId, updateMedicationDto)).rejects.toThrow(
        new NotFoundException(`Medicamento con ID ${medicationId} no encontrado`)
      );

      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(mockMedicationRepository.findByName).not.toHaveBeenCalled();
      expect(mockMedicationRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const medicationId = '550e8400-e29b-41d4-a716-446655440005';

    it('should remove a medication successfully', async () => {
      const existingMedication = createMedicationMock({ id: medicationId });
      const expectedResult = createMedicationMock({ id: medicationId });

      mockMedicationRepository.findById.mockResolvedValue(existingMedication);
      mockMedicationRepository.checkIfInUse.mockResolvedValue(false);
      mockMedicationRepository.remove.mockResolvedValue(expectedResult);

      const result = await service.remove(medicationId);

      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(mockMedicationRepository.checkIfInUse).toHaveBeenCalledWith(medicationId);
      expect(mockMedicationRepository.remove).toHaveBeenCalledWith(medicationId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if medication to remove is not found', async () => {
      mockMedicationRepository.findById.mockResolvedValue(null);

      await expect(service.remove(medicationId)).rejects.toThrow(
        new NotFoundException(`Medicamento con ID ${medicationId} no encontrado`)
      );

      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(mockMedicationRepository.checkIfInUse).not.toHaveBeenCalled();
      expect(mockMedicationRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if medication is in use', async () => {
      const existingMedication = createMedicationMock({ id: medicationId });

      mockMedicationRepository.findById.mockResolvedValue(existingMedication);
      mockMedicationRepository.checkIfInUse.mockResolvedValue(true);

      await expect(service.remove(medicationId)).rejects.toThrow(
        new ConflictException('No se puede eliminar el medicamento porque está siendo usado en órdenes médicas')
      );

      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(mockMedicationRepository.checkIfInUse).toHaveBeenCalledWith(medicationId);
      expect(mockMedicationRepository.remove).not.toHaveBeenCalled();
    });
  });
});
