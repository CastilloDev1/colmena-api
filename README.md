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

API RESTful para gestión médica construida con [NestJS](https://nestjs.com/) y [Prisma ORM](https://www.prisma.io/). Sistema completo para la administración de pacientes, doctores, citas médicas, órdenes médicas y medicamentos.

## 🚀 **Características Principales**

### **Dominios Implementados:**
- ✅ **Patient** - Gestión completa de pacientes
- ✅ **Doctor** - Administración de doctores y especialistas
- ✅ **Appointment** - Sistema de citas médicas con estados
- ✅ **MedicalOrder** - Órdenes médicas vinculadas a citas
- ✅ **Medication** - Catálogo de medicamentos y prescripciones

### **Arquitectura y Tecnologías:**
- 🏗️ **Arquitectura verticalizada** por dominio (controllers, services, repositories, DTOs)
- 🔒 **Validación robusta** con Joi para variables de entorno y class-validator para DTOs
- 📚 **Documentación automática** con Swagger/OpenAPI
- 🗄️ **Base de datos PostgreSQL** con Prisma ORM
- 🐳 **Contenerización** completa con Docker y docker-compose
- 🧪 **Suite de pruebas profesional** con Jest (unitarias e integración)
- 🔄 **Manejo global de errores** con filtros personalizados
- 📊 **Cobertura de código** configurada con thresholds del 80%

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

## 📁 **Estructura del Proyecto**

```
src/
├── app.module.ts                    # Módulo principal de la aplicación
├── main.ts                          # Punto de entrada con configuración Swagger
├── config/
│   └── env.validation.ts            # Validación de variables de entorno con Joi
├── common/
│   └── filters/
│       └── http-exception.filter.ts # Filtro global de excepciones
├── test/
│   ├── test-data.factory.ts         # Factory para datos de prueba
│   └── test-setup.ts                # Configuración global de tests
├── patient/                         # 👤 Dominio de Pacientes
│   ├── controllers/
│   │   └── patient.controller.ts
│   ├── dto/
│   │   ├── create-patient.dto.ts
│   │   └── update-patient.dto.ts
│   ├── repositories/
│   │   └── patient.repository.ts
│   ├── services/
│   │   └── patient.service.ts
│   └── patient.module.ts
├── doctor/                          # 👨‍⚕️ Dominio de Doctores
│   ├── controllers/
│   │   └── doctor.controller.ts
│   ├── dto/
│   │   ├── create-doctor.dto.ts
│   │   └── update-doctor.dto.ts
│   ├── repositories/
│   │   └── doctor.repository.ts
│   ├── services/
│   │   └── doctor.service.ts
│   └── doctor.module.ts
├── appointment/                     # 📅 Dominio de Citas Médicas
│   ├── controllers/
│   │   └── appointment.controller.ts
│   ├── dto/
│   │   ├── create-appointment.dto.ts
│   │   ├── update-appointment.dto.ts
│   │   └── update-status.dto.ts
│   ├── repositories/
│   │   └── appointment.repository.ts
│   ├── services/
│   │   └── appointment.service.ts
│   ├── types/
│   │   └── appointment.types.ts
│   ├── validators/
│   │   └── appointment.validator.ts
│   └── appointment.module.ts
├── medical-order/                   # 📋 Dominio de Órdenes Médicas
│   ├── controllers/
│   │   └── medical-order.controller.ts
│   ├── dto/
│   │   └── create-medical-order.dto.ts
│   ├── repositories/
│   │   └── medical-order.repository.ts
│   ├── services/
│   │   └── medical-order.service.ts
│   └── medical-order.module.ts
└── medication/                      # 💊 Dominio de Medicamentos
    ├── controllers/
    │   └── medication.controller.ts
    ├── dto/
    │   ├── create-medication.dto.ts
    │   ├── update-medication.dto.ts
    │   └── search-medication.dto.ts
    ├── repositories/
    │   └── medication.repository.ts
    ├── services/
    │   └── medication.service.ts
    └── medication.module.ts
└── README.md
```

## 🗄️ **Modelos de Datos**

La aplicación utiliza **PostgreSQL** con **Prisma ORM** y define los siguientes modelos:

### **Patient (Paciente)**
```typescript
{
  patientId: string;    // UUID único
  id: string;          // ID personalizado único (20 chars)
  firstName: string;   // Nombre (90 chars)
  lastName: string;    // Apellido (90 chars)
  email: string;       // Email (200 chars)
  phone: string;       // Teléfono (20 chars)
  address: string;     // Dirección (200 chars)
  city: string;        // Ciudad (90 chars)
  createdAt: DateTime;
  updatedAt: DateTime;
  appointments: Appointment[]; // Relación 1:N
}
```

### **Doctor (Doctor)**
```typescript
{
  doctorId: string;         // UUID único
  id: string;              // ID personalizado único (20 chars)
  firstName: string;       // Nombre (90 chars)
  lastName: string;        // Apellido (90 chars)
  email: string;           // Email (200 chars)
  phone: string;           // Teléfono (20 chars)
  address: string;         // Dirección (200 chars)
  city: string;            // Ciudad (90 chars)
  businessCard: string;    // Tarjeta profesional (50 chars)
  dateOfAdmission: DateTime; // Fecha de ingreso
  createdAt: DateTime;
  updatedAt: DateTime;
  appointments: Appointment[]; // Relación 1:N
}
```

### **Appointment (Cita Médica)**
```typescript
{
  id: string;              // UUID único
  date: DateTime;          // Fecha y hora de la cita
  status: AppointmentStatus; // SCHEDULED | ATTENDED | MISSED
  patientId: string;       // FK a Patient
  doctorId: string;        // FK a Doctor
  patient: Patient;        // Relación N:1
  doctor: Doctor;          // Relación N:1
  medicalOrders: MedicalOrder[]; // Relación 1:N
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### **MedicalOrder (Orden Médica)**
```typescript
{
  id: string;              // UUID único
  description: string;     // Descripción de la orden
  specialty: string;       // Especialidad médica
  expirationDate?: DateTime; // Fecha de expiración (opcional)
  appointmentId: string;   // FK a Appointment
  appointment: Appointment; // Relación N:1
  medications: MedicalOrderMedication[]; // Relación N:N
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### **Medication (Medicamento)**
```typescript
{
  id: string;              // UUID único
  name: string;            // Nombre único del medicamento
  description: string;     // Descripción del medicamento
  diseases: string[];      // Array de enfermedades tratadas
  medicalOrders: MedicalOrderMedication[]; // Relación N:N
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### **MedicalOrderMedication (Tabla Pivot)**
```typescript
{
  id: string;              // UUID único
  medicalOrderId: string;  // FK a MedicalOrder
  medicationId: string;    // FK a Medication
  dosage?: string;         // Dosis específica (ej: "500mg")
  frequency?: string;      // Frecuencia (ej: "cada 8 horas")
  duration?: string;       // Duración (ej: "por 7 días")
  instructions?: string;   // Instrucciones adicionales
  medicalOrder: MedicalOrder; // Relación N:1
  medication: Medication;  // Relación N:1
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

## 🔗 **Uso de la API**

### 👤 **Endpoints de Pacientes**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/patients` | Obtener todos los pacientes |
| GET | `/patients/:id` | Obtener un paciente por ID único |
| POST | `/patients` | Crear un nuevo paciente |
| PATCH | `/patients/:id` | Actualizar un paciente |
| DELETE | `/patients/:id` | Eliminar un paciente |

### 👨‍⚕️ **Endpoints de Doctores**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/doctors` | Obtener todos los doctores |
| GET | `/doctors/:id` | Obtener un doctor por ID único |
| POST | `/doctors` | Crear un nuevo doctor |
| PATCH | `/doctors/:id` | Actualizar un doctor |
| DELETE | `/doctors/:id` | Eliminar un doctor |

### 📅 **Endpoints de Citas Médicas**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/appointments` | Obtener todas las citas |
| GET | `/appointments/:id` | Obtener una cita por ID |
| GET | `/appointments/user/:identification` | Obtener citas por identificación de usuario |
| POST | `/appointments` | Crear una nueva cita |
| PATCH | `/appointments/:id` | Actualizar una cita |
| PATCH | `/appointments/:id/status` | Actualizar solo el estado de una cita |
| DELETE | `/appointments/:id` | Eliminar una cita |

### 📋 **Endpoints de Órdenes Médicas**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/medical-orders/:id` | Obtener una orden médica por ID |
| POST | `/medical-orders` | Crear una nueva orden médica |
| POST | `/medical-orders/:id/medications/:medicationId` | Adjuntar medicamento a orden |
| DELETE | `/medical-orders/:id/medications/:medicationId` | Desadjuntar medicamento de orden |
| GET | `/medical-orders/:id/medications` | Obtener medicamentos de una orden |

### 💊 **Endpoints de Medicamentos**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/medications` | Obtener todos los medicamentos |
| GET | `/medications/:id` | Obtener un medicamento por ID |
| GET | `/medications/disease/:disease` | Buscar medicamentos por enfermedad |
| POST | `/medications` | Crear un nuevo medicamento |
| PATCH | `/medications/:id` | Actualizar un medicamento |
| DELETE | `/medications/:id` | Eliminar un medicamento |

Ambos dominios aplican validación estricta de DTOs y lógica de unicidad para `id` y `email` en la capa de servicio.

## 🧪 **Testing**

La aplicación cuenta con una **suite de pruebas profesional** que incluye pruebas unitarias, de integración y configuración para CI/CD.

### **Comandos de Testing:**

```bash
# Ejecutar todos los tests con detalles
npm run test:verbose

# Ejecutar solo tests unitarios (servicios y repositorios)
npm run test:unit

# Ejecutar solo tests de integración (controladores)
npm run test:integration

# Generar reporte de cobertura completo
npm run test:coverage

# Tests en modo watch para desarrollo
npm run test:watch

# Tests para CI/CD con reportes
npm run test:ci
```

### **Estado de Cobertura por Módulo:**

| Módulo | Servicios | Repositorios | Controladores | Estado |
|--------|-----------|--------------|---------------|---------|
| **Patient** | ✅ 100% | ✅ 100% | ✅ 100% | **COMPLETO** |
| **Doctor** | ✅ 100% | ✅ 100% | ✅ 100% | **COMPLETO** |
| **Appointment** | 🔧 Funcional | 🔧 Funcional | 🔧 Funcional | **FUNCIONAL** |
| **MedicalOrder** | ✅ Completo | ⏳ Básico | ⏳ Básico | **PARCIAL** |
| **Medication** | ✅ Completo | ⏳ Básico | ⏳ Básico | **PARCIAL** |

### **Configuración Jest:**
- **Threshold de cobertura**: 80%
- **Test helpers** reutilizables con factories
- **Mocks de Prisma** configurados
- **Reportes automáticos** para CI/CD

> 📖 **Documentación completa**: Ver [TESTING.md](./TESTING.md) para guías detalladas de testing.

## Docker

Puedes levantar la app y la base de datos con Docker Compose:

```bash
docker-compose up --build
```

Esto crea los contenedores de la API y PostgreSQL, y expone los puertos definidos en `.env` y `docker-compose.yml`.

## Licencia

MIT

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

## Licencia

MIT

