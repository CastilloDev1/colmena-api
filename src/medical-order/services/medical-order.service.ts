import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { MedicalOrderRepository } from '../repositories/medical-order.repository';
import { CreateMedicalOrderDto } from '../dto/create-medical-order.dto';
import { AttachMedicationDto } from '../../medication/dto/attach-medication.dto';
import { AppointmentRepository } from '../../appointment/repositories/appointment.repository';
import { MedicationRepository } from '../../medication/repositories/medication.repository';

@Injectable()
export class MedicalOrderService {
  constructor(
    private readonly medicalOrderRepository: MedicalOrderRepository,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly medicationRepository: MedicationRepository,
  ) {}

  async create(appointmentId: string, createMedicalOrderDto: CreateMedicalOrderDto) {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException(`La cita con ID ${appointmentId} no fue encontrada.`);
    }

    return this.medicalOrderRepository.create(appointmentId, createMedicalOrderDto);
  }

  async findById(id: string) {
    const medicalOrder = await this.medicalOrderRepository.findById(id);
    if (!medicalOrder) {
      throw new NotFoundException(`La orden médica con ID ${id} no fue encontrada.`);
    }
    return medicalOrder;
  }

  async attachMedication(medicalOrderId: string, attachMedicationDto: AttachMedicationDto) {
    const { medicationId, ...attachData } = attachMedicationDto;

    // Verificar que la orden médica existe
    await this.findById(medicalOrderId);

    // Verificar que el medicamento existe
    const medication = await this.medicationRepository.findById(medicationId);
    if (!medication) {
      throw new NotFoundException(`El medicamento con ID ${medicationId} no fue encontrado.`);
    }

    // Verificar que el medicamento no esté ya adjunto
    const isAlreadyAttached = await this.medicalOrderRepository.checkMedicationAttached(
      medicalOrderId,
      medicationId,
    );
    if (isAlreadyAttached) {
      throw new ConflictException(
        `El medicamento "${medication.name}" ya está adjunto a esta orden médica.`,
      );
    }

    return this.medicalOrderRepository.attachMedication(medicalOrderId, medicationId, attachData);
  }

  async detachMedication(medicalOrderId: string, medicationId: string) {
    // Verificar que la orden médica existe
    await this.findById(medicalOrderId);

    // Verificar que el medicamento está adjunto
    const isAttached = await this.medicalOrderRepository.checkMedicationAttached(
      medicalOrderId,
      medicationId,
    );
    if (!isAttached) {
      throw new NotFoundException(
        `El medicamento no está adjunto a esta orden médica.`,
      );
    }

    return this.medicalOrderRepository.detachMedication(medicalOrderId, medicationId);
  }

  async getMedications(medicalOrderId: string) {
    // Verificar que la orden médica existe
    await this.findById(medicalOrderId);

    return this.medicalOrderRepository.getMedications(medicalOrderId);
  }
}
