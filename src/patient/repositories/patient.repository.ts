import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePatientDto) {
    return this.prisma.paciente.create({ data });
  }

  async findAll() {
    return this.prisma.paciente.findMany();
  }

  async findOne(id: string) {
    const patient = await this.prisma.paciente.findFirst({ where: { id } });
    if (!patient) throw new Error('Paciente no encontrado');
    return patient;
  }

  async findByIdOrEmail(id: string, email: string) {
    return this.prisma.paciente.findFirst({
      where: {
        OR: [
          { id },
          { email },
        ],
      },
    });
  }

  async update(id: string, data: UpdatePatientDto) {
    const patient = await this.findOne(id);
    return this.prisma.paciente.update({
      where: { patientId: patient.patientId },
      data,
    });
  }

  async remove(id: string) {
    const patient = await this.findOne(id);
    await this.prisma.paciente.delete({ where: { patientId: patient.patientId } });
    return {
      message: 'Paciente eliminado exitosamente',
    }
  }

}
