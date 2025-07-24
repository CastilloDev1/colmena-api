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

  async findById(id: string) {
    return this.prisma.medicalOrder.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            patient: true,
            doctor: true,
          },
        },
        medications: {
          include: {
            medication: true,
          },
        },
      },
    });
  }

  async attachMedication(
    medicalOrderId: string,
    medicationId: string,
    attachData: {
      dosage?: string;
      frequency?: string;
      duration?: string;
      instructions?: string;
    },
  ) {
    return this.prisma.medicalOrderMedication.create({
      data: {
        medicalOrderId,
        medicationId,
        ...attachData,
      },
      include: {
        medication: true,
      },
    });
  }

  async detachMedication(medicalOrderId: string, medicationId: string) {
    return this.prisma.medicalOrderMedication.delete({
      where: {
        medicalOrderId_medicationId: {
          medicalOrderId,
          medicationId,
        },
      },
    });
  }

  async getMedications(medicalOrderId: string) {
    return this.prisma.medicalOrderMedication.findMany({
      where: { medicalOrderId },
      include: {
        medication: true,
      },
      orderBy: {
        medication: {
          name: 'asc',
        },
      },
    });
  }

  async checkMedicationAttached(medicalOrderId: string, medicationId: string): Promise<boolean> {
    const count = await this.prisma.medicalOrderMedication.count({
      where: {
        medicalOrderId,
        medicationId,
      },
    });
    return count > 0;
  }
}
