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

  async findById(doctorId: string) {
    return this.prisma.doctor.findUnique({ where: { doctorId } });
  }

  async findByIdentification(id: string) {
    return this.prisma.doctor.findFirst({ where: { id } });
  }

  async update(doctorId: string, updateDoctorDto: UpdateDoctorDto) {
    return this.prisma.doctor.update({
      where: { doctorId },
      data: updateDoctorDto,
    });
  }

  async remove(doctorId: string) {
    await this.prisma.doctor.delete({ where: { doctorId } });
    return { message: 'Doctor eliminado exitosamente' };
  }
}
