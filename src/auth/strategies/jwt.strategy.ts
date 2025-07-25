import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Valida el payload del JWT y devuelve el usuario completo
   * Este método se ejecuta automáticamente cuando se usa JwtAuthGuard
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { userId } = payload;

    // Buscar el usuario en la base de datos
    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        doctor: true,
        patient: true,
      },
    });

    // Si el usuario no existe o está inactivo, rechazar
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido o usuario inactivo');
    }

    // El usuario se adjuntará automáticamente al request como request.user
    return user;
  }
}
