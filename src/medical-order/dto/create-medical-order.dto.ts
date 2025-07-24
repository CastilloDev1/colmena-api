import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateMedicalOrderDto {
  @ApiProperty({
    description: 'Descripción detallada de la orden médica',
    example: 'Tomar paracetamol cada 8 horas por 3 días',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Especialidad a la que se remite o que emite la orden',
    example: 'Medicina General',
  })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({
    description: 'Fecha de caducidad de la orden médica',
    example: '2025-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expirationDate?: string;
}
