import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from '../patient.controller';
import { PatientService } from '../../services/patient.service';
import { CreatePatientDto } from '../../dto/create-patient.dto';
import { UpdatePatientDto } from '../../dto/update-patient.dto';

// Mock del PatientService
const mockPatientService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('PatientController', () => {
  let controller: PatientController;
  let service: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
      ],
    }).compile();

    controller = module.get<PatientController>(PatientController);
    service = module.get<PatientService>(PatientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

    describe('create', () => {
    it('should call patientService.create with the correct dto', async () => {
      const createPatientDto: CreatePatientDto = { id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com', phone: '123', address: 'addr', city: 'city' };
      await controller.create(createPatientDto);
      expect(mockPatientService.create).toHaveBeenCalledWith(createPatientDto);
    });
  });

  describe('findAll', () => {
    it('should call patientService.findAll', async () => {
      await controller.findAll();
      expect(mockPatientService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call patientService.findOne with the correct id', async () => {
      const id = '12345';
      await controller.findOne(id);
      expect(mockPatientService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call patientService.update with correct id and dto', async () => {
      const id = '12345';
      const updatePatientDto: UpdatePatientDto = { firstName: 'Updated' };
      await controller.update(id, updatePatientDto);
      expect(mockPatientService.update).toHaveBeenCalledWith(id, updatePatientDto);
    });
  });

  describe('remove', () => {
    it('should call patientService.remove with the correct id', async () => {
      const id = '12345';
      await controller.remove(id);
      expect(mockPatientService.remove).toHaveBeenCalledWith(id);
    });
  });
});
