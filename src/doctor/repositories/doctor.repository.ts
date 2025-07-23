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

  async findOne(doctorId: string) {
    return this.prisma.doctor.findUnique({ where: { doctorId } });
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

  async update(doctorId: string, data: UpdateDoctorDto) {
    return this.prisma.doctor.update({ where: { doctorId }, data });
  }

  async remove(doctorId: string) {
    return this.prisma.doctor.delete({ where: { doctorId } });
  }
}
