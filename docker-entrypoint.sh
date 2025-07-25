#!/bin/sh
set -e

# Ejecutar migraciones de Prisma
npx prisma generate
npx prisma migrate deploy

# Ejecutar el comando principal (desde CMD)
exec "$@"