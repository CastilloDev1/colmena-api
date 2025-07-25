import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Decorator para especificar qué roles pueden acceder a un endpoint
 * 
 * @example
 * ```typescript
 * @Get()
 * @Roles(UserRole.ADMIN, UserRole.DOCTOR)
 * async findAll() {
 *   // Solo ADMIN y DOCTOR pueden acceder
 * }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
