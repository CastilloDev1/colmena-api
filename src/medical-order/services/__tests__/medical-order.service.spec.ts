import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MedicalOrderService } from '../medical-order.service';
import { MedicalOrderRepository } from '../../repositories/medical-order.repository';
import { AppointmentRepository } from '../../../appointment/repositories/appointment.repository';
import { MedicationRepository } from '../../../medication/repositories/medication.repository';
import { TestDataFactory } from '../../../../test/test-helpers';

describe('MedicalOrderService', () => {
  let service: MedicalOrderService;
  let mockMedicalOrderRepository: jest.Mocked<MedicalOrderRepository>;
  let mockAppointmentRepository: jest.Mocked<AppointmentRepository>;
  let mockMedicationRepository: jest.Mocked<MedicationRepository>;

  // Mock repositories
  const mockMedicalOrderRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findByAppointmentId: jest.fn(),
    attachMedication: jest.fn(),
    detachMedication: jest.fn(),
    getMedications: jest.fn(),
    checkMedicationAttached: jest.fn(),
  };

  const mockAppointmentRepo = {
    findById: jest.fn(),
  };

  const mockMedicationRepo = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalOrderService,
        {
          provide: MedicalOrderRepository,
          useValue: mockMedicalOrderRepo,
        },
        {
          provide: AppointmentRepository,
          useValue: mockAppointmentRepo,
        },
        {
          provide: MedicationRepository,
          useValue: mockMedicationRepo,
        },
      ],
    }).compile();

    service = module.get<MedicalOrderService>(MedicalOrderService);
    mockMedicalOrderRepository = module.get(MedicalOrderRepository);
    mockAppointmentRepository = module.get(AppointmentRepository);
    mockMedicationRepository = module.get(MedicationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const appointmentId = '550e8400-e29b-41d4-a716-446655440000';
    const createMedicalOrderDto = TestDataFactory.createMedicalOrderData();

    it('should create a new medical order successfully', async () => {
      const mockAppointment = TestDataFactory.createAppointmentWithTimestamps({ id: appointmentId });
      const expectedMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({ 
        appointmentId,
        id: '550e8400-e29b-41d4-a716-446655440001'
      });

      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockMedicalOrderRepository.create.mockResolvedValue(expectedMedicalOrder);

      const result = await service.create(appointmentId, createMedicalOrderDto);

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockMedicalOrderRepository.create).toHaveBeenCalledWith(appointmentId, createMedicalOrderDto);
      expect(result).toEqual(expectedMedicalOrder);
    });

    it('should throw NotFoundException if appointment is not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(service.create(appointmentId, createMedicalOrderDto)).rejects.toThrow(
        new NotFoundException(`La cita con ID ${appointmentId} no fue encontrada.`)
      );

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockMedicalOrderRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors during creation', async () => {
      const mockAppointment = TestDataFactory.createAppointmentWithTimestamps({ id: appointmentId });
      
      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockMedicalOrderRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(appointmentId, createMedicalOrderDto)).rejects.toThrow('Database error');

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockMedicalOrderRepository.create).toHaveBeenCalledWith(appointmentId, createMedicalOrderDto);
    });
  });

  describe('findById', () => {
    const medicalOrderId = '550e8400-e29b-41d4-a716-446655440002';

    it('should return a medical order if found', async () => {
      const expectedMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({
        id: medicalOrderId
      });

      mockMedicalOrderRepository.findById.mockResolvedValue(expectedMedicalOrder);

      const result = await service.findById(medicalOrderId);

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(result).toEqual(expectedMedicalOrder);
    });

    it('should throw NotFoundException if medical order is not found', async () => {
      mockMedicalOrderRepository.findById.mockResolvedValue(null);

      await expect(service.findById(medicalOrderId)).rejects.toThrow(
        new NotFoundException(`La orden médica con ID ${medicalOrderId} no fue encontrada.`)
      );

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
    });

    it('should handle repository errors', async () => {
      mockMedicalOrderRepository.findById.mockRejectedValue(new Error('Database connection error'));

      await expect(service.findById(medicalOrderId)).rejects.toThrow('Database connection error');

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
    });
  });

  describe('attachMedication', () => {
    const medicalOrderId = '550e8400-e29b-41d4-a716-446655440003';
    const medicationId = '550e8400-e29b-41d4-a716-446655440004';
    const attachMedicationDto = {
      medicationId,
      dosage: '500mg',
      frequency: 'Cada 8 horas',
      duration: '7 días',
      instructions: 'Tomar con alimentos'
    };

    it('should attach medication to medical order successfully', async () => {
      const mockMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({ id: medicalOrderId });
      const mockMedication = {
        ...TestDataFactory.createMedicationWithTimestamps({ id: medicationId, name: 'Paracetamol' }),
        medicalOrders: []
      };
      const expectedResult = {
        id: 'attachment-id',
        medicalOrderId,
        medicationId,
        dosage: '500mg',
        frequency: 'Cada 8 horas',
        duration: '7 días',
        instructions: 'Tomar con alimentos',
        createdAt: new Date(),
        updatedAt: new Date(),
        medication: TestDataFactory.createMedicationWithTimestamps({ id: medicationId })
      };

      mockMedicalOrderRepository.findById.mockResolvedValue(mockMedicalOrder);
      mockMedicationRepository.findById.mockResolvedValue(mockMedication);
      mockMedicalOrderRepository.checkMedicationAttached.mockResolvedValue(false);
      mockMedicalOrderRepository.attachMedication.mockResolvedValue(expectedResult);

      const result = await service.attachMedication(medicalOrderId, attachMedicationDto);

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(mockMedicalOrderRepository.checkMedicationAttached).toHaveBeenCalledWith(medicalOrderId, medicationId);
      expect(mockMedicalOrderRepository.attachMedication).toHaveBeenCalledWith(
        medicalOrderId, 
        medicationId, 
        {
          dosage: '500mg',
          frequency: 'Cada 8 horas',
          duration: '7 días',
          instructions: 'Tomar con alimentos'
        }
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if medical order is not found', async () => {
      mockMedicalOrderRepository.findById.mockResolvedValue(null);

      await expect(service.attachMedication(medicalOrderId, attachMedicationDto)).rejects.toThrow(
        new NotFoundException(`La orden médica con ID ${medicalOrderId} no fue encontrada.`)
      );

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicationRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if medication is not found', async () => {
      const mockMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({ id: medicalOrderId });

      mockMedicalOrderRepository.findById.mockResolvedValue(mockMedicalOrder);
      mockMedicationRepository.findById.mockResolvedValue(null);

      await expect(service.attachMedication(medicalOrderId, attachMedicationDto)).rejects.toThrow(
        new NotFoundException(`El medicamento con ID ${medicationId} no fue encontrado.`)
      );

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(mockMedicalOrderRepository.checkMedicationAttached).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if medication is already attached', async () => {
      const mockMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({ id: medicalOrderId });
      const mockMedication = {
        ...TestDataFactory.createMedicationWithTimestamps({ 
          id: medicationId,
          name: 'Paracetamol'
        }),
        medicalOrders: []
      };

      mockMedicalOrderRepository.findById.mockResolvedValue(mockMedicalOrder);
      mockMedicationRepository.findById.mockResolvedValue(mockMedication);
      mockMedicalOrderRepository.checkMedicationAttached.mockResolvedValue(true);

      await expect(service.attachMedication(medicalOrderId, attachMedicationDto)).rejects.toThrow(
        new ConflictException(`El medicamento "Paracetamol" ya está adjunto a esta orden médica.`)
      );

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicationRepository.findById).toHaveBeenCalledWith(medicationId);
      expect(mockMedicalOrderRepository.checkMedicationAttached).toHaveBeenCalledWith(medicalOrderId, medicationId);
      expect(mockMedicalOrderRepository.attachMedication).not.toHaveBeenCalled();
    });
  });

  describe('detachMedication', () => {
    const medicalOrderId = '550e8400-e29b-41d4-a716-446655440005';
    const medicationId = '550e8400-e29b-41d4-a716-446655440006';

    it('should detach medication from medical order successfully', async () => {
      const mockMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({ id: medicalOrderId });
      const expectedResult = {
        id: 'detachment-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        medicalOrderId,
        medicationId,
        dosage: null,
        frequency: null,
        duration: null,
        instructions: null
      };

      mockMedicalOrderRepository.findById.mockResolvedValue(mockMedicalOrder);
      mockMedicalOrderRepository.checkMedicationAttached.mockResolvedValue(true);
      mockMedicalOrderRepository.detachMedication.mockResolvedValue(expectedResult);

      const result = await service.detachMedication(medicalOrderId, medicationId);

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicalOrderRepository.checkMedicationAttached).toHaveBeenCalledWith(medicalOrderId, medicationId);
      expect(mockMedicalOrderRepository.detachMedication).toHaveBeenCalledWith(medicalOrderId, medicationId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if medical order is not found', async () => {
      mockMedicalOrderRepository.findById.mockResolvedValue(null);

      await expect(service.detachMedication(medicalOrderId, medicationId)).rejects.toThrow(
        new NotFoundException(`La orden médica con ID ${medicalOrderId} no fue encontrada.`)
      );

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicalOrderRepository.checkMedicationAttached).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if medication is not attached', async () => {
      const mockMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({ id: medicalOrderId });

      mockMedicalOrderRepository.findById.mockResolvedValue(mockMedicalOrder);
      mockMedicalOrderRepository.checkMedicationAttached.mockResolvedValue(false);

      await expect(service.detachMedication(medicalOrderId, medicationId)).rejects.toThrow(
        new NotFoundException(`El medicamento no está adjunto a esta orden médica.`)
      );

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicalOrderRepository.checkMedicationAttached).toHaveBeenCalledWith(medicalOrderId, medicationId);
      expect(mockMedicalOrderRepository.detachMedication).not.toHaveBeenCalled();
    });
  });

  describe('getMedications', () => {
    const medicalOrderId = '550e8400-e29b-41d4-a716-446655440007';

    it('should return medications for a medical order', async () => {
      const mockMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({ id: medicalOrderId });
      const expectedMedications = [
        { 
          id: 'med-attachment-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          medicalOrderId,
          medicationId: '550e8400-e29b-41d4-a716-446655440008',
          dosage: '500mg',
          frequency: 'Cada 8 horas',
          duration: '7 días',
          instructions: 'Tomar con alimentos',
          medication: TestDataFactory.createMedicationWithTimestamps({ 
            id: '550e8400-e29b-41d4-a716-446655440008',
            name: 'Paracetamol' 
          })
        },
        { 
          id: 'med-attachment-2',
          createdAt: new Date(),
          updatedAt: new Date(),
          medicalOrderId,
          medicationId: '550e8400-e29b-41d4-a716-446655440009',
          dosage: '400mg',
          frequency: 'Cada 12 horas',
          duration: '5 días',
          instructions: 'Tomar después de las comidas',
          medication: TestDataFactory.createMedicationWithTimestamps({ 
            id: '550e8400-e29b-41d4-a716-446655440009',
            name: 'Ibuprofeno' 
          })
        }
      ];

      mockMedicalOrderRepository.findById.mockResolvedValue(mockMedicalOrder);
      mockMedicalOrderRepository.getMedications.mockResolvedValue(expectedMedications);

      const result = await service.getMedications(medicalOrderId);

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicalOrderRepository.getMedications).toHaveBeenCalledWith(medicalOrderId);
      expect(result).toEqual(expectedMedications);
    });

    it('should throw NotFoundException if medical order is not found', async () => {
      mockMedicalOrderRepository.findById.mockResolvedValue(null);

      await expect(service.getMedications(medicalOrderId)).rejects.toThrow(
        new NotFoundException(`La orden médica con ID ${medicalOrderId} no fue encontrada.`)
      );

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicalOrderRepository.getMedications).not.toHaveBeenCalled();
    });

    it('should return empty array when medical order has no medications', async () => {
      const mockMedicalOrder = TestDataFactory.createMedicalOrderWithRelations({ id: medicalOrderId });

      mockMedicalOrderRepository.findById.mockResolvedValue(mockMedicalOrder);
      mockMedicalOrderRepository.getMedications.mockResolvedValue([]);

      const result = await service.getMedications(medicalOrderId);

      expect(mockMedicalOrderRepository.findById).toHaveBeenCalledWith(medicalOrderId);
      expect(mockMedicalOrderRepository.getMedications).toHaveBeenCalledWith(medicalOrderId);
      expect(result).toEqual([]);
    });
  });

  describe('findByAppointmentId', () => {
    const appointmentId = '550e8400-e29b-41d4-a716-446655440010';

    it('should return medical orders for a specific appointment', async () => {
      const mockAppointment = TestDataFactory.createAppointmentWithTimestamps({ id: appointmentId });
      const expectedMedicalOrders = [
        TestDataFactory.createMedicalOrderWithRelations({
          id: '550e8400-e29b-41d4-a716-446655440011',
          appointmentId
        }),
        TestDataFactory.createMedicalOrderWithRelations({
          id: '550e8400-e29b-41d4-a716-446655440012',
          appointmentId,
          description: 'Examen de laboratorio'
        })
      ];

      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockMedicalOrderRepository.findByAppointmentId.mockResolvedValue(expectedMedicalOrders);

      const result = await service.findByAppointmentId(appointmentId);

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockMedicalOrderRepository.findByAppointmentId).toHaveBeenCalledWith(appointmentId);
      expect(result).toEqual(expectedMedicalOrders);
    });

    it('should throw NotFoundException if appointment is not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(service.findByAppointmentId(appointmentId)).rejects.toThrow(
        new NotFoundException(`La cita con ID ${appointmentId} no fue encontrada.`)
      );

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockMedicalOrderRepository.findByAppointmentId).not.toHaveBeenCalled();
    });

    it('should return empty array when appointment has no medical orders', async () => {
      const mockAppointment = TestDataFactory.createAppointmentWithTimestamps({ id: appointmentId });

      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockMedicalOrderRepository.findByAppointmentId.mockResolvedValue([]);

      const result = await service.findByAppointmentId(appointmentId);

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockMedicalOrderRepository.findByAppointmentId).toHaveBeenCalledWith(appointmentId);
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      const mockAppointment = TestDataFactory.createAppointmentWithTimestamps({ id: appointmentId });

      mockAppointmentRepository.findById.mockResolvedValue(mockAppointment);
      mockMedicalOrderRepository.findByAppointmentId.mockRejectedValue(new Error('Database query failed'));

      await expect(service.findByAppointmentId(appointmentId)).rejects.toThrow('Database query failed');

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockMedicalOrderRepository.findByAppointmentId).toHaveBeenCalledWith(appointmentId);
    });
  });
});
