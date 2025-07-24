import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../types/appointment-status.enum';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de la cita',
    enum: AppointmentStatus,
    example: AppointmentStatus.ATTENDED,
  })
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status: AppointmentStatus;
}
