import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentRepository } from '../appointment.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TestDataFactory, createMockPrismaService } from '../../../../test/test-helpers';

describe('AppointmentRepository', () => {
  let repository: AppointmentRepository;
  let mockPrismaService: jest.Mocked<ReturnType<typeof createMockPrismaService>>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<AppointmentRepository>(AppointmentRepository);
    mockPrismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.appointment.create with correct data', async () => {
      const createData = {
        patientId: 'patient-uuid',
        doctorId: 'doctor-uuid',
        date: new Date('2024-12-25T10:00:00Z'),
        reason: 'Consulta general',
        status: 'PROGRAMADA' as any,
      };
      const expectedAppointment = { appointmentId: 'uuid-123', ...createData };

      mockPrismaService.appointment.create.mockResolvedValue(expectedAppointment);

      const result = await repository.create(createData);

      expect(mockPrismaService.appointment.create).toHaveBeenCalledWith({
        data: createData,
        include: { patient: true, doctor: true },
      });
      expect(result).toEqual(expectedAppointment);
    });

    it('should handle prisma errors during creation', async () => {
      const createData = {
        patientId: 'patient-uuid',
        doctorId: 'doctor-uuid',
        date: new Date('2024-12-25T10:00:00Z'),
        reason: 'Consulta general',
        status: 'PROGRAMADA' as any,
      };

      mockPrismaService.appointment.create.mockRejectedValue(new Error('Prisma error'));

      await expect(repository.create(createData)).rejects.toThrow('Prisma error');
      expect(mockPrismaService.appointment.create).toHaveBeenCalledWith({
        data: createData,
        include: { patient: true, doctor: true },
      });
    });
  });

  describe('findAll', () => {
    it('should call prisma.appointment.findMany with correct parameters', async () => {
      const expectedAppointments = [
        {
          appointmentId: 'uuid-1',
          ...TestDataFactory.createAppointmentData(),
          patient: TestDataFactory.createPatientData(),
          doctor: TestDataFactory.createDoctorData(),
        },
      ];

      mockPrismaService.appointment.findMany.mockResolvedValue(expectedAppointments);

      const result = await repository.findAll();

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          patient: true,
          doctor: true,
        },
        orderBy: { date: 'asc' },
      });
      expect(result).toEqual(expectedAppointments);
    });

    it('should call prisma.appointment.findMany with date filter when date provided', async () => {
      const testDate = '2024-12-25';
      const expectedAppointments = [];

      mockPrismaService.appointment.findMany.mockResolvedValue(expectedAppointments);

      const result = await repository.findAll(testDate);

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
        include: {
          patient: true,
          doctor: true,
        },
        orderBy: { date: 'asc' },
      });
      expect(result).toEqual(expectedAppointments);
    });

    it('should return empty array when no appointments found', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          patient: true,
          doctor: true,
        },
        orderBy: { date: 'asc' },
      });
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should call prisma.appointment.findUnique with correct id and includes', async () => {
      const appointmentId = 'uuid-123';
      const expectedAppointment = {
        id: appointmentId,
        ...TestDataFactory.createAppointmentData(),
        patient: TestDataFactory.createPatientData(),
        doctor: TestDataFactory.createDoctorData(),
      };

      mockPrismaService.appointment.findUnique.mockResolvedValue(expectedAppointment);

      const result = await repository.findById(appointmentId);

      expect(mockPrismaService.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: appointmentId },
        include: {
          patient: true,
          doctor: true,
        },
      });
      expect(result).toEqual(expectedAppointment);
    });

    it('should return null when appointment not found', async () => {
      const appointmentId = 'non-existent-uuid';

      mockPrismaService.appointment.findUnique.mockResolvedValue(null);

      const result = await repository.findById(appointmentId);

      expect(mockPrismaService.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: appointmentId },
        include: {
          patient: true,
          doctor: true,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('findByDate', () => {
    it('should call prisma.appointment.findMany with date range filter', async () => {
      const searchDate = new Date('2024-12-25');
      const expectedAppointments = [
        {
          id: 'uuid-1',
          date: searchDate,
          patient: TestDataFactory.createPatientData(),
          doctor: TestDataFactory.createDoctorData(),
        },
      ];

      mockPrismaService.appointment.findMany.mockResolvedValue(expectedAppointments);

      const result = await repository.findAll(searchDate.toISOString().split('T')[0]);

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: expect.any(Date), // Start of day
            lt: expect.any(Date), // End of day (using 'lt' not 'lte')
          },
        },
        include: {
          patient: true,
          doctor: true,
        },
        orderBy: { date: 'asc' },
      });
      expect(result).toEqual(expectedAppointments);
    });

    it('should return empty array when no appointments found for date', async () => {
      const searchDate = new Date('2024-12-25');

      mockPrismaService.appointment.findMany.mockResolvedValue([]);

      const result = await repository.findAll(searchDate.toISOString().split('T')[0]);

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findByIdentification', () => {
    it('should call prisma.appointment.findMany with patient/doctor identification filter', async () => {
      const identification = '12345678';
      const expectedAppointments = [
        {
          id: 'uuid-1',
          patient: TestDataFactory.createPatientData({ id: identification }),
          doctor: TestDataFactory.createDoctorData(),
        },
      ];

      mockPrismaService.appointment.findMany.mockResolvedValue(expectedAppointments);

      const result = await repository.findByUserIdentification(identification);

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { patient: { id: identification } },
            { doctor: { id: identification } },
          ],
        },
        include: {
          patient: true,
          doctor: true,
        },
        orderBy: { date: 'asc' },
      });
      expect(result).toEqual(expectedAppointments);
    });

    it('should return empty array when no appointments found for identification', async () => {
      const identification = 'non-existent-id';

      mockPrismaService.appointment.findMany.mockResolvedValue([]);

      const result = await repository.findByUserIdentification(identification);

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });


  describe('update', () => {
    it('should call prisma.appointment.update with correct data', async () => {
      const appointmentId = 'uuid-123';
      const updateData = { status: 'ATTENDED' as any };
      const expectedAppointment = {
        id: appointmentId,
        ...TestDataFactory.createAppointmentData(),
        ...updateData,
      };

      mockPrismaService.appointment.update.mockResolvedValue(expectedAppointment);

      const result = await repository.update(appointmentId, updateData);

      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: appointmentId },
        data: updateData,
        include: { patient: true, doctor: true },
      });
      expect(result).toEqual(expectedAppointment);
    });

    it('should handle prisma errors during update', async () => {
      const appointmentId = 'uuid-123';
      const updateData = { status: 'ATTENDED' as any };

      mockPrismaService.appointment.update.mockRejectedValue(new Error('Update failed'));

      await expect(repository.update(appointmentId, updateData)).rejects.toThrow('Update failed');
      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: appointmentId },
        data: updateData,
        include: { patient: true, doctor: true },
      });
    });
  });

  describe('remove', () => {
    it('should call prisma.appointment.delete with correct id', async () => {
      const appointmentId = 'uuid-123';
      const expectedAppointment = {
        appointmentId,
        ...TestDataFactory.createAppointmentData(),
      };

      mockPrismaService.appointment.delete.mockResolvedValue(expectedAppointment);

      const result = await repository.remove(appointmentId);

      expect(mockPrismaService.appointment.delete).toHaveBeenCalledWith({
        where: { id: appointmentId },
      });
      expect(result).toEqual(expectedAppointment);
    });

    it('should handle prisma errors during deletion', async () => {
      const appointmentId = 'uuid-123';

      mockPrismaService.appointment.delete.mockRejectedValue(new Error('Deletion failed'));

      await expect(repository.remove(appointmentId)).rejects.toThrow('Deletion failed');
      expect(mockPrismaService.appointment.delete).toHaveBeenCalledWith({
        where: { id: appointmentId },
      });
    });
  });
});
