<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Colmena API

API RESTful construida con [NestJS](https://nestjs.com/) y [Prisma ORM](https://www.prisma.io/) para la gestión de pacientes y doctores.

Incluye:
- CRUD completo para los dominios **Patient** y **Doctor**
- Validación robusta de variables de entorno con Joi
- Validación exhaustiva de DTOs con class-validator y documentación Swagger
- Arquitectura verticalizada por dominio (controllers, services, repositories, dto)
- Lógica de unicidad implementada a nivel de servicio para campos clave (id y email)
- Manejo global de errores con filtros personalizados
- Integración con PostgreSQL y Prisma
- Contenerización con Docker y docker-compose
- Pruebas unitarias básicas

---

## Tabla de Contenidos
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Comandos Útiles](#comandos-útiles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso de la API](#uso-de-la-api)
- [Swagger](#swagger)
- [Prisma y Base de Datos](#prisma-y-base-de-datos)
- [Docker](#docker)
- [Testing](#testing)
- [Licencia](#licencia)

---

## Instalación

```bash
npm install
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/colmena_db
```

La validación de variables se realiza con Joi antes de levantar la app.

## Project setup

```bash
$ npm install
```

## Comandos Útiles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Compilar
npm run build

# Ejecutar migraciones Prisma
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate
```

## Estructura del Proyecto

```
colmena-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── common/
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── patient/
│   │   ├── controllers/
│   │   │   └── patient.controller.ts
│   │   ├── dto/
│   │   │   ├── create-patient.dto.ts
│   │   │   └── update-patient.dto.ts
│   │   ├── repositories/
│   │   │   └── patient.repository.ts
│   │   ├── services/
│   │   │   └── patient.service.ts
│   │   └── patient.module.ts
│   ├── doctor/
│   │   ├── controllers/
│   │   │   └── doctor.controller.ts
│   │   ├── dto/
│   │   │   ├── create-doctor.dto.ts
│   │   │   └── update-doctor.dto.ts
│   │   ├── repositories/
│   │   │   └── doctor.repository.ts
│   │   ├── services/
│   │   │   └── doctor.service.ts
│   │   └── doctor.module.ts
├── prisma/
│   ├── schema.prisma
│   ├── prisma.service.ts
│   └── migrations/
├── docker-compose.yml
├── Dockerfile
├── .env
└── README.md
```

## Uso de la API

La API expone endpoints RESTful para los dominios **Patient** y **Doctor**. Ejemplo de endpoints:

### Pacientes (`/patient`)
- `POST /patient` — Crear paciente
- `GET /patient` — Listar pacientes
- `GET /patient/:id` — Obtener paciente por ID (documento)
- `PATCH /patient/:id` — Actualizar paciente por ID (documento)
- `DELETE /patient/:id` — Eliminar paciente por ID (documento)

### Doctores (`/doctors`)
- `POST /doctors` — Crear doctor
- `GET /doctors` — Listar doctores
- `GET /doctors/identificacion/:id` — Obtener doctor por ID (documento)
- `PATCH /doctors/:id` — Actualizar doctor por ID (documento)
- `DELETE /doctors/:id` — Eliminar doctor por ID (documento)

Ambos dominios aplican validación estricta de DTOs y lógica de unicidad para `id` y `email` en la capa de servicio.


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Swagger

La documentación interactiva y pruebas de la API están disponibles en:

```
http://localhost:3000/api
```

Incluye ejemplos, descripciones y validaciones automáticas de los DTOs para ambos dominios. Puedes probar todos los endpoints, ver los modelos y los posibles errores que puede devolver la API.

## Prisma y Base de Datos

- Los modelos principales son `Paciente` y `Doctor`, definidos en `prisma/schema.prisma`.
- Usa PostgreSQL como base de datos.
- Migraciones y generación de cliente Prisma:
  ```bash
  npx prisma migrate dev
  npx prisma generate
  ```
- El servicio Prisma se encuentra en `prisma/prisma.service.ts` y es inyectado en los módulos necesarios.
- La unicidad de `id` y `email` se valida en la capa de servicio, no por constraints en la base de datos.


```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

Puedes levantar la app y la base de datos con Docker Compose:

```bash
docker-compose up --build
```

Esto crea los contenedores de la API y PostgreSQL, y expone los puertos definidos en `.env` y `docker-compose.yml`.

## Testing

```bash
# Pruebas unitarias
npm run test

# Cobertura
npm run test:cov
```

Actualmente existen pruebas básicas para los controladores y servicios. Se recomienda ampliar la cobertura y mockear PrismaService para pruebas unitarias.

## Licencia

MIT



