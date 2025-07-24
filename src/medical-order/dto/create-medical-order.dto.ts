import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateMedicalOrderDto {
  @ApiProperty({
    description: 'ID de la cita a la que pertenece la orden médica',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'appointmentId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'appointmentId es obligatorio' })
  appointmentId: string;
  @ApiProperty({
    description: 'Descripción detallada de la orden médica',
    example: 'Realizar exámenes de sangre completos y radiografía de tórax',
    minLength: 10,
    maxLength: 500,
  })
  @IsString({ message: 'description debe ser un texto' })
  @IsNotEmpty({ message: 'description no puede estar vacío' })
  description: string;

  @ApiProperty({
    description: 'Especialidad médica relacionada con la orden',
    example: 'Cardiología',
    enum: ['Medicina General', 'Cardiología', 'Neurología', 'Pediatría', 'Ginecología', 'Dermatología'],
  })
  @IsString({ message: 'specialty debe ser un texto' })
  @IsNotEmpty({ message: 'specialty no puede estar vacío' })
  specialty: string;

  @ApiProperty({
    description: 'Fecha de expiración de la orden médica (opcional)',
    example: '2024-12-31',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'expirationDate debe ser una fecha válida en formato ISO (YYYY-MM-DD)' })
  expirationDate?: string;
}
