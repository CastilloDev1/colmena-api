import { Module } from '@nestjs/common';
import { MedicalOrderController } from './controllers/medical-order.controller';
import { MedicalOrderService } from './services/medical-order.service';
import { MedicalOrderRepository } from './repositories/medical-order.repository';
import { AppointmentRepository } from '../appointment/repositories/appointment.repository';
import { MedicationModule } from '../medication/medication.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    MedicationModule,
  ],
  controllers: [MedicalOrderController],
  providers: [
    PrismaService,
    MedicalOrderService,
    MedicalOrderRepository,
    AppointmentRepository,
  ],
  exports: [
    MedicalOrderService,
    MedicalOrderRepository,
  ],
})
export class MedicalOrderModule {}
