import { Module } from '@nestjs/common';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicalOrderModule } from './medical-order/medical-order.module';

@Module({
  imports: [
    PatientModule,
    DoctorModule,
    AppointmentModule,
    MedicalOrderModule,
  ],
})
export class AppModule {}
