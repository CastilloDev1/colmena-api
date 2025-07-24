import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePatientDto) {
    return this.prisma.patient.create({ data });
  }

  async findAll() {
    return this.prisma.patient.findMany();
  }

  async findById(patientId: string) {
    return this.prisma.patient.findUnique({ where: { patientId } });
  }

  async findByIdentification(id: string) {
    return this.prisma.patient.findFirst({ where: { id } });
  }

  async update(patientId: string, updatePatientDto: UpdatePatientDto) {
    return this.prisma.patient.update({
      where: { patientId },
      data: updatePatientDto,
    });
  }

  async remove(patientId: string) {
    await this.prisma.patient.delete({ where: { patientId } });
    return { message: 'Paciente eliminado exitosamente' };
  }
}

