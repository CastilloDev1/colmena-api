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

  async findOne(patientId: string) {
    return this.prisma.paciente.findUnique({ where: { patientId } });
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

  async update(patientId: string, data: UpdatePatientDto) {
    return this.prisma.paciente.update({ where: { patientId }, data });
  }

  async remove(patientId: string) {
    return this.prisma.paciente.delete({ where: { patientId } });
  }

}
