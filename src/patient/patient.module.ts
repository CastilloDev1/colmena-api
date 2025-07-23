import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PatientRepository } from './repositories/patient.repository';

@Module({
  controllers: [PatientController],
  providers: [PatientService, PatientRepository, PrismaService],
})
export class PatientModule {}
