import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';

@Injectable()
export class DoctorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDoctorDto) {
    return this.prisma.doctor.create({ data });
  }

  async findAll() {
    return this.prisma.doctor.findMany();
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findFirst({ where: { id } });
    if (!doctor) throw new Error('Doctor no encontrado');
    return doctor;
  }

  async findByIdOrEmail(id: string, email: string) {
    return this.prisma.doctor.findFirst({
      where: {
        OR: [
          { id },
          { email },
        ],
      },
    });
  }

  async update(id: string, data: UpdateDoctorDto) {
    const doctor = await this.findOne(id);
    return this.prisma.doctor.update({ where: { doctorId: doctor.doctorId }, data });
  }

  async remove(id: string) {
    const doctor = await this.findOne(id);
    await this.prisma.doctor.delete({ where: { doctorId: doctor.doctorId } });
    return {
      message: 'Doctor eliminado exitosamente',
    }
  }
}
