import { Module } from '@nestjs/common';
import { AppointmentController } from './controllers/appointment.controller';
import { AppointmentService } from './services/appointment.service';
import { AppointmentRepository } from './repositories/appointment.repository';
import { PatientModule } from '../patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    PatientModule,
    DoctorModule,
  ],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    AppointmentRepository,
    PrismaService,
  ],
  exports: [
    AppointmentRepository,
  ],
})
export class AppointmentModule {}

