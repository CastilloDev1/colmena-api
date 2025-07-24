import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateMedicationDto {
  @ApiProperty({
    description: 'Nombre del medicamento',
    example: 'Paracetamol 500mg',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del medicamento',
    example: 'Analgésico y antipirético de venta libre',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Lista de enfermedades para las que se prescribe este medicamento',
    example: ['dolor de cabeza', 'fiebre', 'dolor muscular'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  diseases: string[];
}
