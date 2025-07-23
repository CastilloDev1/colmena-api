import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la creación de un paciente.
 * 
 * Este DTO se utiliza para crear un nuevo paciente en el sistema.
 * 
 * @example
 * {
 *   "id": "1234567890",
 *   "firstName": "Juan",
 *   "lastName": "Pérez",
 *   "email": "juan.perez@example.com",
 *   "phone": "3001234567",
 *   "address": "Calle 123 #45-67",
 *   "city": "Bogotá"
 * }
 */
export class CreatePatientDto {
  /**
   * Identificación del paciente. Solo números, máximo 20 caracteres.
   */
  @ApiProperty({ description: 'Identificación del paciente. Solo números.', maxLength: 20, example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'id only numbers' })
  @MaxLength(20)
  id: string;

  /**
   * Nombre del paciente.
   */
  @ApiProperty({ description: 'Nombre del paciente', maxLength: 90, example: 'Juan' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(90)
  firstName: string;

  /**
   * Apellido del paciente.
   */
  @ApiProperty({ description: 'Apellido del paciente', maxLength: 90, example: 'Pérez' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(90)
  lastName: string;

  /**
   * Correo electrónico de contacto.
   */
  @ApiProperty({ description: 'Correo electrónico de contacto', maxLength: 200, example: 'juan.perez@email.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email: string;

  /**
   * Teléfono de contacto.
   */
  @ApiProperty({ description: 'Teléfono de contacto', maxLength: 20, example: '3001234567' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;

  /**
   * Dirección del paciente.
   */
  @ApiProperty({ description: 'Dirección del paciente', maxLength: 200, example: 'Calle 123 #45-67' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  address: string;

  /**
   * Ciudad de residencia.
   */
  @ApiProperty({ description: 'Ciudad de residencia', maxLength: 90, example: 'Bogotá' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(90)
  city: string;
}
