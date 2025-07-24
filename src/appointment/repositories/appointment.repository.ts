import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getStartAndEndOfDay(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return { startOfDay, endOfDay };
  }

  async create(data: Prisma.AppointmentUncheckedCreateInput) {
    return this.prisma.appointment.create({
      data,
      include: { patient: true, doctor: true },
    });
  }

  async findAll(date?: string) {
    const where: Prisma.AppointmentWhereInput = {};
    if (date) {
      const { startOfDay, endOfDay } = this.getStartAndEndOfDay(new Date(date));
      where.date = { gte: startOfDay, lt: endOfDay };
    }
    return this.prisma.appointment.findMany({
      where,
      include: { patient: true, doctor: true },
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });
  }

  async findByUserIdentification(identification: string) {
    return this.prisma.appointment.findMany({
      where: {
        OR: [
          { patient: { id: identification } },
          { doctor: { id: identification } },
        ],
      },
      include: { patient: true, doctor: true },
      orderBy: { date: 'asc' },
    });
  }

  async findDuplicate(patientId: string, doctorId: string, date: Date) {
    return this.prisma.appointment.findFirst({
      where: {
        patientId,
        doctorId,
        date,
        status: AppointmentStatus.SCHEDULED,
      },
    });
  }

  async findDoctorAppointmentAtDate(doctorId: string, date: Date) {
    return this.prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
        status: AppointmentStatus.SCHEDULED,
      },
    });
  }

  async findAvailableDoctorsByDate(date: Date) {
    const { startOfDay, endOfDay } = this.getStartAndEndOfDay(date);
    const busyDoctorIds = (
      await this.prisma.appointment.findMany({
        where: {
          date: { gte: startOfDay, lte: endOfDay },
          status: AppointmentStatus.SCHEDULED,
        },
        select: { doctorId: true },
      })
    ).map((d) => d.doctorId);

    return this.prisma.doctor.findMany({
      where: { doctorId: { notIn: busyDoctorIds } },
    });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput) {
    return this.prisma.appointment.update({
      where: { id },
      data,
      include: { patient: true, doctor: true },
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.appointment.delete({ where: { id } });
  }
}
