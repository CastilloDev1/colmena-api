import { Module, forwardRef } from '@nestjs/common';
import { MedicalOrderController } from './controllers/medical-order.controller';
import { MedicalOrderService } from './services/medical-order.service';
import { MedicalOrderRepository } from './repositories/medical-order.repository';
import { AppointmentModule } from '../appointment/appointment.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [forwardRef(() => AppointmentModule)],
  controllers: [MedicalOrderController],
  providers: [MedicalOrderService, MedicalOrderRepository, PrismaService],
})
export class MedicalOrderModule {}
