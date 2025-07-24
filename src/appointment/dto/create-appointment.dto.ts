import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID, Validate, IsOptional, IsEnum } from 'class-validator';
import { IsFutureDate } from '../validators/is-future-date.validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2025-08-01T10:00:00.000Z',
    description: 'Fecha y hora de la cita (debe ser futura, formato ISO 8601)',
    type: String,
    format: 'date-time',
    required: true,
  })
  @IsNotEmpty({ message: 'La fecha de la cita es obligatoria.' })
  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601.' })
  @Validate(IsFutureDate, { message: 'La fecha debe ser superior a la actual.' })
  date: string;

  @ApiProperty({
    description: 'El número de identificación del paciente',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  patientIdentification: string;

  @ApiProperty({
    description: 'El número de identificación del doctor',
    example: '987654321',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  doctorIdentification: string;

  @ApiProperty({
    description: 'El estado de la cita (opcional al crear)',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
    required: false,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}

