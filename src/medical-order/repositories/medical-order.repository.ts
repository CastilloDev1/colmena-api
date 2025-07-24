import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateMedicalOrderDto } from '../dto/create-medical-order.dto';

@Injectable()
export class MedicalOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(appointmentId: string, createMedicalOrderDto: CreateMedicalOrderDto) {
    const { description, specialty, expirationDate } = createMedicalOrderDto;

    const data: Prisma.MedicalOrderCreateInput = {
      description,
      specialty,
      appointment: {
        connect: { id: appointmentId },
      },
    };

    if (expirationDate) {
      data.expirationDate = new Date(expirationDate);
    }

    return this.prisma.medicalOrder.create({ data });
  }
}
