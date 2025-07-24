import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMedicationDto } from '../dto/create-medication.dto';
import { UpdateMedicationDto } from '../dto/update-medication.dto';

@Injectable()
export class MedicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicationDto: CreateMedicationDto) {
    return this.prisma.medication.create({
      data: createMedicationDto,
    });
  }

  async findAll() {
    return this.prisma.medication.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.medication.findUnique({
      where: { id },
      include: {
        medicalOrders: {
          include: {
            medicalOrder: {
              include: {
                appointment: {
                  include: {
                    patient: true,
                    doctor: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByName(name: string) {
    return this.prisma.medication.findUnique({
      where: { name },
    });
  }

  async findByDisease(disease: string) {
    return this.prisma.medication.findMany({
      where: {
        diseases: {
          has: disease,
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto) {
    return this.prisma.medication.update({
      where: { id },
      data: updateMedicationDto,
    });
  }

  async remove(id: string) {
    return this.prisma.medication.delete({
      where: { id },
    });
  }

  async checkIfInUse(id: string): Promise<boolean> {
    const count = await this.prisma.medicalOrderMedication.count({
      where: { medicationId: id },
    });
    return count > 0;
  }
}
