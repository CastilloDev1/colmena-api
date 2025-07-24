import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AppointmentService } from '../appointment.service';
import { AppointmentRepository } from '../../repositories/appointment.repository';
import { PatientRepository } from '../../../patient/repositories/patient.repository';
import { DoctorRepository } from '../../../doctor/repositories/doctor.repository';
import { CreateAppointmentDto } from '../../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../../dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from '../../dto/update-appointment-status.dto';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentStatus as LocalAppointmentStatus } from '../../types/appointment-status.enum';
import { TestDataFactory } from '../../../test/test-helpers';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let mockAppointmentRepository: jest.Mocked<AppointmentRepository>;
  let mockPatientRepository: jest.Mocked<PatientRepository>;
  let mockDoctorRepository: jest.Mocked<DoctorRepository>;

  // Mocks de los repositorios
  const mockAppointmentRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByDate: jest.fn(),
    findByUserIdentification: jest.fn(),
    findDoctorAppointmentAtDate: jest.fn(),
    findDuplicate: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  const mockPatientRepo = {
    findByIdentification: jest.fn(),
  };

  const mockDoctorRepo = {
    findByIdentification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: AppointmentRepository,
          useValue: mockAppointmentRepo,
        },
        {
          provide: PatientRepository,
          useValue: mockPatientRepo,
        },
        {
          provide: DoctorRepository,
          useValue: mockDoctorRepo,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    mockAppointmentRepository = module.get(AppointmentRepository);
    mockPatientRepository = module.get(PatientRepository);
    mockDoctorRepository = module.get(DoctorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createAppointmentDto: CreateAppointmentDto = TestDataFactory.createAppointmentData();

    it('should create a new appointment successfully', async () => {
      const mockPatient = TestDataFactory.createPatientWithTimestamps({ id: createAppointmentDto.patientIdentification });
      const mockDoctor = TestDataFactory.createDoctorWithTimestamps({ id: createAppointmentDto.doctorIdentification });
      const expectedAppointment = TestDataFactory.createAppointmentWithTimestamps({
        id: 'uuid-appointment-123',
        patientId: 'patient-uuid',
        doctorId: 'doctor-uuid',
        status: AppointmentStatus.SCHEDULED,
      });

      mockPatientRepository.findByIdentification.mockResolvedValue(mockPatient);
      mockDoctorRepository.findByIdentification.mockResolvedValue(mockDoctor);
      mockAppointmentRepository.findDoctorAppointmentAtDate.mockResolvedValue(null); // Doctor disponible
      mockAppointmentRepository.findDuplicate.mockResolvedValue(null); // No hay duplicados
      mockAppointmentRepository.create.mockResolvedValue(expectedAppointment);

      const result = await service.create(createAppointmentDto);

      expect(mockPatientRepository.findByIdentification).toHaveBeenCalledWith(createAppointmentDto.patientIdentification);
      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(createAppointmentDto.doctorIdentification);
      expect(mockAppointmentRepository.findDoctorAppointmentAtDate).toHaveBeenCalled();
      expect(mockAppointmentRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedAppointment);
    });

    it('should throw NotFoundException if patient is not found', async () => {
      mockPatientRepository.findByIdentification.mockResolvedValue(null);

      await expect(service.create(createAppointmentDto)).rejects.toThrow(
        new NotFoundException(`Paciente con identificación ${createAppointmentDto.patientIdentification} no encontrado.`)
      );

      expect(mockPatientRepository.findByIdentification).toHaveBeenCalledWith(createAppointmentDto.patientIdentification);
      expect(mockDoctorRepository.findByIdentification).not.toHaveBeenCalled();
      expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if doctor is not found', async () => {
      const mockPatient = TestDataFactory.createPatientWithTimestamps({ id: createAppointmentDto.patientIdentification });
      
      mockPatientRepository.findByIdentification.mockResolvedValue(mockPatient);
      mockDoctorRepository.findByIdentification.mockResolvedValue(null);

      await expect(service.create(createAppointmentDto)).rejects.toThrow(
        new NotFoundException(`Doctor con identificación ${createAppointmentDto.doctorIdentification} no encontrado.`)
      );

      expect(mockPatientRepository.findByIdentification).toHaveBeenCalledWith(createAppointmentDto.patientIdentification);
      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(createAppointmentDto.doctorIdentification);
      expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if doctor is not available', async () => {
      const mockPatient = TestDataFactory.createPatientWithTimestamps({ id: createAppointmentDto.patientIdentification });
      const mockDoctor = TestDataFactory.createDoctorWithTimestamps({ id: createAppointmentDto.doctorIdentification });
      const existingAppointment = TestDataFactory.createAppointmentWithTimestamps();

      mockPatientRepository.findByIdentification.mockResolvedValue(mockPatient);
      mockDoctorRepository.findByIdentification.mockResolvedValue(mockDoctor);
      mockAppointmentRepository.findDoctorAppointmentAtDate.mockResolvedValue(existingAppointment); // Doctor ocupado
      mockAppointmentRepository.findDuplicate.mockResolvedValue(null); // No hay duplicados

      await expect(service.create(createAppointmentDto)).rejects.toThrow(ConflictException);

      expect(mockPatientRepository.findByIdentification).toHaveBeenCalledWith(createAppointmentDto.patientIdentification);
      expect(mockDoctorRepository.findByIdentification).toHaveBeenCalledWith(createAppointmentDto.doctorIdentification);
      expect(mockAppointmentRepository.findDoctorAppointmentAtDate).toHaveBeenCalled();
      expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      const expectedAppointments = [
        {
          ...TestDataFactory.createAppointmentWithTimestamps(),
          status: AppointmentStatus.SCHEDULED,
        },
        {
          ...TestDataFactory.createAppointmentWithTimestamps({ patientIdentification: '87654321' }),
          status: AppointmentStatus.ATTENDED,
        },
      ];

      mockAppointmentRepository.findAll.mockResolvedValue(expectedAppointments);

      const result = await service.findAll();

      expect(mockAppointmentRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedAppointments);
    });

    it('should return empty array when no appointments exist', async () => {
      mockAppointmentRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockAppointmentRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const appointmentId = 'uuid-appointment-123';

    it('should return a single appointment if found', async () => {
      const expectedAppointment = {
        ...TestDataFactory.createAppointmentWithTimestamps(),
        status: AppointmentStatus.SCHEDULED,
      };

      mockAppointmentRepository.findById.mockResolvedValue(expectedAppointment);

      const result = await service.findById(appointmentId);

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(result).toEqual(expectedAppointment);
    });

    it('should throw NotFoundException if appointment is not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(service.findById(appointmentId)).rejects.toThrow(
        new NotFoundException(`Cita no encontrada.`)
      );

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
    });
  });

  describe('findByIdentification', () => {
    const identification = '12345678';

    it('should return appointments for a specific identification', async () => {
      const expectedAppointments = [
        {
          ...TestDataFactory.createAppointmentWithTimestamps({ patientIdentification: identification }),
          status: AppointmentStatus.SCHEDULED,
        },
      ];

      mockAppointmentRepository.findByUserIdentification.mockResolvedValue(expectedAppointments);

      const result = await service.findByUserIdentification(identification);

      expect(mockAppointmentRepository.findByUserIdentification).toHaveBeenCalledWith(identification);
      expect(result).toEqual(expectedAppointments);
    });
  });

  describe('update', () => {
    const appointmentId = 'uuid-appointment-123';
    const updateAppointmentDto: UpdateAppointmentDto = { status: 'ATTENDED' as AppointmentStatus };

    it('should update an appointment successfully', async () => {
      const existingAppointment = TestDataFactory.createAppointmentWithTimestamps({
        status: 'SCHEDULED' as AppointmentStatus,
      });
      const updatedAppointment = TestDataFactory.createAppointmentWithTimestamps({
        status: 'ATTENDED' as AppointmentStatus,
      });

      mockAppointmentRepository.findById.mockResolvedValue(existingAppointment);
      mockAppointmentRepository.update.mockResolvedValue(updatedAppointment);

      const result = await service.update(appointmentId, updateAppointmentDto);

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockAppointmentRepository.update).toHaveBeenCalledWith(appointmentId, expect.objectContaining(updateAppointmentDto));
      expect(result).toEqual(updatedAppointment);
    });

    it('should throw NotFoundException if appointment to update is not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(service.update(appointmentId, updateAppointmentDto)).rejects.toThrow(
        new NotFoundException('Cita no encontrada.')
      );

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    const appointmentId = 'uuid-appointment-123';
    const updateStatusDto: UpdateAppointmentStatusDto = { status: LocalAppointmentStatus.ATTENDED };

    it('should update appointment status successfully', async () => {
      const existingAppointment = TestDataFactory.createAppointmentWithTimestamps({
        status: 'SCHEDULED' as AppointmentStatus,
      });
      const updatedAppointment = TestDataFactory.createAppointmentWithTimestamps({
        status: 'ATTENDED' as AppointmentStatus,
      });

      mockAppointmentRepository.findById.mockResolvedValue(existingAppointment);
      mockAppointmentRepository.updateStatus.mockResolvedValue(updatedAppointment);

      const result = await service.updateStatus(appointmentId, updateStatusDto);

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockAppointmentRepository.updateStatus).toHaveBeenCalledWith(appointmentId, LocalAppointmentStatus.ATTENDED);
      expect(result).toEqual(updatedAppointment);
    });

    it('should throw NotFoundException if appointment to update status is not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(service.updateStatus(appointmentId, updateStatusDto)).rejects.toThrow(
        new NotFoundException('Cita no encontrada.')
      );

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockAppointmentRepository.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const appointmentId = 'uuid-appointment-123';

    it('should remove an appointment successfully', async () => {
      const existingAppointment = {
        ...TestDataFactory.createAppointmentWithTimestamps(),
        status: AppointmentStatus.SCHEDULED,
      };

      mockAppointmentRepository.findById.mockResolvedValue(existingAppointment);
      mockAppointmentRepository.remove.mockResolvedValue(existingAppointment);

      const result = await service.remove(appointmentId);

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockAppointmentRepository.remove).toHaveBeenCalledWith(appointmentId);
      expect(result).toEqual(existingAppointment);
    });

    it('should throw NotFoundException if appointment to remove is not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);

      await expect(service.remove(appointmentId)).rejects.toThrow(
        new NotFoundException('Cita no encontrada.')
      );

      expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentId);
      expect(mockAppointmentRepository.remove).not.toHaveBeenCalled();
    });
  });
});
