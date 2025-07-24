import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AttachMedicationDto {
  @ApiProperty({
    description: 'ID del medicamento a adjuntar',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  medicationId: string;

  @ApiProperty({
    description: 'Dosis específica para esta prescripción',
    example: '500mg',
    required: false,
  })
  @IsString()
  @IsOptional()
  dosage?: string;

  @ApiProperty({
    description: 'Frecuencia de administración',
    example: 'cada 8 horas',
    required: false,
  })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiProperty({
    description: 'Duración del tratamiento',
    example: 'por 7 días',
    required: false,
  })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({
    description: 'Instrucciones adicionales',
    example: 'tomar con alimentos',
    required: false,
  })
  @IsString()
  @IsOptional()
  instructions?: string;
}
