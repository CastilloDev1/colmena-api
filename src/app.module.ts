import { Module } from '@nestjs/common';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicalOrderModule } from './medical-order/medical-order.module';
import { MedicationModule } from './medication/medication.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
    MedicalOrderModule,
    MedicationModule,
  ],
})
export class AppModule {}
