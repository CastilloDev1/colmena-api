import { Module, forwardRef } from '@nestjs/common';
import { MedicalOrderController } from './controllers/medical-order.controller';
import { MedicalOrderService } from './services/medical-order.service';
import { MedicalOrderRepository } from './repositories/medical-order.repository';
import { AppointmentModule } from '../appointment/appointment.module';
import { MedicationModule } from '../medication/medication.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    forwardRef(() => AppointmentModule),
    MedicationModule,
  ],
  controllers: [MedicalOrderController],
  providers: [MedicalOrderService, MedicalOrderRepository, PrismaService],
})
export class MedicalOrderModule {}
