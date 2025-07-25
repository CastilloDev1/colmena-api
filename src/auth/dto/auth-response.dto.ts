import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserInfoDto {
  @ApiProperty({
    example: 'uuid-123-456',
    description: 'ID único del usuario',
  })
  userId: string;

  @ApiProperty({
    example: 'admin@colmena.com',
    description: 'Email del usuario',
  })
  email: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN,
    description: 'Rol del usuario en el sistema',
  })
  role: UserRole;

  @ApiProperty({
    example: true,
    description: 'Estado activo del usuario',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Fecha de creación de la cuenta',
  })
  createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de acceso',
  })
  access_token: string;

  @ApiProperty({
    example: 'Bearer',
    description: 'Tipo de token',
  })
  token_type: string;

  @ApiProperty({
    example: '86400',
    description: 'Tiempo de expiración en segundos',
  })
  expires_in: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
  })
  user: UserInfoDto;
}
