import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash para la contraseña por defecto "admin123"
  const defaultPassword = await bcrypt.hash('admin123', 10);

  // Crear usuario Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@colmena.com' },
    update: {},
    create: {
      email: 'admin@colmena.com',
      password: defaultPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  // Crear usuario Recepcionista
  const receptionist = await prisma.user.upsert({
    where: { email: 'recepcion@colmena.com' },
    update: {},
    create: {
      email: 'recepcion@colmena.com',
      password: defaultPassword,
      role: UserRole.RECEPTIONIST,
      isActive: true,
    },
  });

  console.log('✅ Usuarios creados:');
  console.log(`- Admin: ${admin.email}`);
  console.log(`- Recepcionista: ${receptionist.email}`);
  console.log('📝 Contraseña por defecto para todos: admin123');
  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
