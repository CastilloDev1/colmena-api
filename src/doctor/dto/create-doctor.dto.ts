import { IsString, IsEmail, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ example: '123456789', description: 'Número de documento del doctor' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del doctor' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del doctor' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'juan.perez@hospital.com', description: 'Correo electrónico del doctor' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '3216549870', description: 'Teléfono del doctor' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección del doctor' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Bogotá', description: 'Ciudad de residencia del doctor' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'TP-987654', description: 'Tarjeta profesional del doctor' })
  @IsString()
  @IsNotEmpty()
  tarjetaProfesional: string;

  @ApiProperty({ example: '2025-07-23T00:00:00.000Z', description: 'Fecha de ingreso del doctor (ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  fechaIngreso: Date;
}
