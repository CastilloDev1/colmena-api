import { Module, forwardRef } from '@nestjs/common';
import { AppointmentController } from './controllers/appointment.controller';
import { AppointmentService } from './services/appointment.service';
import { AppointmentRepository } from './repositories/appointment.repository';
import { MedicalOrderModule } from '../medical-order/medical-order.module';
import { PrismaService } from '../../prisma/prisma.service';
import { PatientModule } from '../patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [PatientModule, DoctorModule, forwardRef(() => MedicalOrderModule)],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentRepository, PrismaService],
  exports: [AppointmentRepository],
})
export class AppointmentModule {}
