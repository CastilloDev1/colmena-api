import { Injectable, NotFoundException } from '@nestjs/common';
import { MedicalOrderRepository } from '../repositories/medical-order.repository';
import { CreateMedicalOrderDto } from '../dto/create-medical-order.dto';
import { AppointmentRepository } from '../../appointment/repositories/appointment.repository';

@Injectable()
export class MedicalOrderService {
  constructor(
    private readonly medicalOrderRepository: MedicalOrderRepository,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async create(appointmentId: string, createMedicalOrderDto: CreateMedicalOrderDto) {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException(`La cita con ID ${appointmentId} no fue encontrada.`);
    }

    return this.medicalOrderRepository.create(appointmentId, createMedicalOrderDto);
  }
}
