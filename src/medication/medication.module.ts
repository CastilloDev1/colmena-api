import { Module } from '@nestjs/common';
import { MedicationController } from './controllers/medication.controller';
import { MedicationService } from './services/medication.service';
import { MedicationRepository } from './repositories/medication.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MedicationController],
  providers: [MedicationService, MedicationRepository, PrismaService],
  exports: [MedicationService, MedicationRepository],
})
export class MedicationModule {}
