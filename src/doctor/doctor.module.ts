import { Module } from '@nestjs/common';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';
import { DoctorRepository } from './repositories/doctor.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, DoctorRepository, PrismaService],
})
export class DoctorModule {}
