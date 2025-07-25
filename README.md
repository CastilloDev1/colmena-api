<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <h1>Colmena API</h1>
  <p><strong>Sistema de Gestión Médica con Autenticación JWT</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
  </p>
</div>

## 📋 Descripción

**Colmena API** es una API RESTful completa para gestión médica construida con **NestJS** y **Prisma ORM**. Proporciona un sistema robusto para la administración de pacientes, doctores, citas médicas, órdenes médicas y medicamentos, con **autenticación JWT** y **autorización basada en roles**.

## ✨ Características Principales

### 🔐 **Seguridad y Autenticación**
- **JWT Authentication** con Passport.js
- **Autorización basada en roles** (ADMIN, RECEPTIONIST, NURSE, VIEWER)
- **Guards personalizados** y decoradores
- **Endpoints protegidos** en todos los dominios
- **Hashing seguro** de contraseñas con bcrypt

### 🏥 **Dominios Médicos**
- **Pacientes** - Gestión completa de pacientes
- **Doctores** - Administración de profesionales médicos
- **Citas** - Sistema de agendamiento con estados
- **Órdenes Médicas** - Prescripciones y tratamientos
- **Medicamentos** - Catálogo farmacológico

### 🛠️ **Tecnologías y Arquitectura**
- **NestJS** con TypeScript
- **Prisma ORM** + PostgreSQL
- **Arquitectura vertical** por dominios
- **Validación robusta** con class-validator y Joi
- **Documentación automática** con Swagger/OpenAPI
- **Testing profesional** con Jest (80% cobertura)
- **Docker** para contenerización
- **CI/CD ready**

## 📑 Tabla de Contenidos

- [🚀 Inicio Rápido](#-inicio-rápido)
- [⚙️ Configuración](#️-configuración)
- [🔐 Autenticación y Autorización](#-autenticación-y-autorización)
- [📖 Documentación de la API](#-documentación-de-la-api)
- [🗄️ Base de Datos](#️-base-de-datos)
- [🧪 Testing](#-testing)
- [🐳 Docker](#-docker)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🤝 Contribución](#-contribución)

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- npm o yarn

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd colmena-api

# 2. Configurar variables de entorno
cp .env.example .env (Configurar JWT_SECRET)

# 3. Ejecutar el script de inicio rápido
docker compose up --build -d

# 4. Alimentar base de datos usuarios de prueba
docker compose exec api npm run db:seed
```

✅ **¡Listo!** La API estará disponible en `http://localhost:3000`  
📚 **Swagger UI** en `http://localhost:3000/api`

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Application
PORT=3000

# Database Configuration (para Docker)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=colmena_db
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# JWT Configuration
JWT_SECRET=
JWT_EXPIRES_IN=1d
```

| Variable | Descripción | Ejemplo |
|----------|-------------|----------|
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | URL de PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Clave secreta JWT | `mi_clave_super_secreta_123` |
| `JWT_EXPIRES_IN` | Expiración del token | `1d`, `24h`, `3600s` |

> ⚠️ **Importante**: Todas las variables son validadas con Joi al iniciar la aplicación.

### Comandos Disponibles

```bash
# Desarrollo
npm run start:dev          # Modo desarrollo con hot-reload
npm run start:debug        # Modo debug

# Producción
npm run build              # Compilar TypeScript
npm run start:prod         # Iniciar en producción

# Base de datos
npx prisma migrate dev     # Ejecutar migraciones
npx prisma generate        # Generar cliente Prisma
npm run db:seed            # Poblar con datos iniciales

# Testing
npm run test               # Tests unitarios
npm run test:e2e           # Tests end-to-end
npm run test:cov           # Reporte de cobertura

# Utilidades
npm run lint               # Linter ESLint
npm run format             # Formatear con Prettier
```

## 🔐 Autenticación y Autorización

### Arquitectura de Seguridad

El sistema implementa **JWT (JSON Web Tokens)** con **Passport.js** para proporcionar:

- 🛡️ **Autenticación stateless** con tokens JWT
- 🔐 **Autorización granular** basada en roles
- 🚪 **Guards personalizados** (JwtAuthGuard, RolesGuard)
- 🎯 **Decoradores** (@Roles, @CurrentUser)
- 🔒 **Hashing seguro** con bcrypt

### Endpoints de Autenticación

#### `POST /auth/login` - Iniciar Sesión
```json
// Request
{
  "email": "admin@colmena.com",
  "password": "admin123"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "1d",
  "user": {
    "userId": "uuid",
    "email": "admin@colmena.com",
    "role": "ADMIN"
  }
}
```

#### `GET /auth/profile` - Perfil del Usuario
```bash
Authorization: Bearer <token>
```

#### `GET /auth/verify` - Verificar Token
```bash
Authorization: Bearer <token>
```

### Roles y Permisos

| Rol | Descripción | Permisos Principales |
|-----|-------------|---------------------|
| 🔴 **ADMIN** | Administrador del sistema | Acceso completo (CRUD) a todos los dominios |
| 🟡 **RECEPTIONIST** | Gestión operativa | Gestión de pacientes, doctores, citas y órdenes |
| 🟢 **NURSE** | Gestión clínica | Actualización de estados, gestión de medicamentos |
| 🔵 **VIEWER** | Supervisión/Auditoría | Solo lectura en todos los dominios |

#### Matriz de Permisos Detallada

| Dominio | ADMIN | RECEPTIONIST | NURSE | VIEWER |
|---------|-------|--------------|-------|---------|
| **Patient** | CRUD | CRU | RU | R |
| **Doctor** | CRUD | CRU | R | R |
| **Appointment** | CRUD | CRU | R+Status | R |
| **MedicalOrder** | CRUD | CR | R+Medications | R |
| **Medication** | CRUD | R | R | R |

> **Leyenda**: C=Create, R=Read, U=Update, D=Delete

### Usuarios de Prueba

| Email | Rol | Contraseña |
|-------|-----|------------|
| `admin@colmena.com` | ADMIN | `admin123` |
| `recepcion@colmena.com` | RECEPTIONIST | `admin123` |
| `enfermera@colmena.com` | NURSE | `admin123` |
| `supervisor@colmena.com` | VIEWER | `admin123` |

```bash
# Crear usuarios de prueba
npm run db:seed
```

### Ejemplo de Uso

```bash
# 1. Login para obtener token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@colmena.com","password":"admin123"}'

# 2. Usar token en requests protegidos
curl -X GET http://localhost:3000/patient \
  -H "Authorization: Bearer <tu_token_jwt>"
```

---

## 📖 Documentación de la API

### Swagger UI

La documentación interactiva está disponible en:

```
http://localhost:3000/api
```

**Características de la documentación:**
- 📋 **Endpoints completos** con ejemplos
- 🔐 **Autenticación JWT** integrada
- ✅ **Validaciones** y esquemas de datos
- 🚨 **Códigos de error** documentados
- 🧪 **Testing interactivo** de endpoints

### Endpoints Principales

#### 🔐 Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Iniciar sesión |
| `GET` | `/auth/profile` | Perfil del usuario |
| `GET` | `/auth/verify` | Verificar token |

#### 👤 Pacientes
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `/patient` | Listar pacientes | ADMIN, RECEPTIONIST, NURSE, VIEWER |
| `POST` | `/patient` | Crear paciente | ADMIN, RECEPTIONIST |
| `GET` | `/patient/:id` | Obtener paciente | ADMIN, RECEPTIONIST, NURSE, VIEWER |
| `PATCH` | `/patient/:id` | Actualizar paciente | ADMIN, RECEPTIONIST, NURSE |
| `DELETE` | `/patient/:id` | Eliminar paciente | ADMIN |

#### 👨‍⚕️ Doctores
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `/doctors` | Listar doctores | ADMIN, RECEPTIONIST, NURSE, VIEWER |
| `POST` | `/doctors` | Crear doctor | ADMIN, RECEPTIONIST |
| `GET` | `/doctors/:id` | Obtener doctor | ADMIN, RECEPTIONIST, NURSE, VIEWER |
| `PATCH` | `/doctors/:id` | Actualizar doctor | ADMIN, RECEPTIONIST |
| `DELETE` | `/doctors/:id` | Eliminar doctor | ADMIN |

#### 📅 Citas
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `/appointments` | Listar citas | ADMIN, RECEPTIONIST, NURSE, VIEWER |
| `POST` | `/appointments` | Crear cita | ADMIN, RECEPTIONIST |
| `PATCH` | `/appointments/:id/status` | Actualizar estado | ADMIN, RECEPTIONIST, NURSE |
| `GET` | `/appointments/available-doctors` | Doctores disponibles | Todos |

#### 📋 Órdenes Médicas
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `POST` | `/medical-orders` | Crear orden | ADMIN, RECEPTIONIST |
| `GET` | `/medical-orders/:id` | Obtener orden | Todos |
| `POST` | `/medical-orders/:id/medications/:medId` | Adjuntar medicamento | ADMIN, NURSE |
| `DELETE` | `/medical-orders/:id/medications/:medId` | Quitar medicamento | ADMIN |

#### 💊 Medicamentos
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `/medications` | Listar medicamentos | Todos |
| `POST` | `/medications` | Crear medicamento | ADMIN |
| `PATCH` | `/medications/:id` | Actualizar medicamento | ADMIN |
| `DELETE` | `/medications/:id` | Eliminar medicamento | ADMIN |

## 🗄️ Base de Datos

### Arquitectura de Datos

La aplicación utiliza **PostgreSQL** con **Prisma ORM** para gestionar:

- 🏥 **6 entidades principales** interconectadas
- 🔗 **Relaciones complejas** (1:N, N:N)
- 🆔 **UUIDs** como claves primarias
- ⏰ **Timestamps automáticos**
- 🔄 **Migraciones versionadas**

### Modelos Principales

#### 👤 **Patient** - Pacientes
```typescript
{
  patientId: string;       // UUID único
  id: string;             // ID personalizado (20 chars)
  firstName: string;      // Nombre
  lastName: string;       // Apellido
  email: string;          // Email único
  phone: string;          // Teléfono
  address: string;        // Dirección
  city: string;           // Ciudad
  appointments: Appointment[]; // Relación 1:N
}
```

#### 👨‍⚕️ **Doctor** - Profesionales Médicos
```typescript
{
  doctorId: string;       // UUID único
  id: string;            // ID personalizado (20 chars)
  firstName: string;     // Nombre
  lastName: string;      // Apellido
  email: string;         // Email único
  businessCard: string;  // Tarjeta profesional
  dateOfAdmission: DateTime; // Fecha de ingreso
  appointments: Appointment[]; // Relación 1:N
}
```

#### 📅 **Appointment** - Citas Médicas
```typescript
{
  id: string;            // UUID único
  date: DateTime;        // Fecha y hora
  status: 'SCHEDULED' | 'ATTENDED' | 'MISSED';
  patientId: string;     // FK → Patient
  doctorId: string;      // FK → Doctor
  medicalOrders: MedicalOrder[]; // Relación 1:N
}
```

#### 📋 **MedicalOrder** - Órdenes Médicas
```typescript
{
  id: string;            // UUID único
  description: string;   // Descripción
  specialty: string;     // Especialidad médica
  expirationDate?: DateTime; // Fecha de expiración
  appointmentId: string; // FK → Appointment
  medications: MedicalOrderMedication[]; // Relación N:N
}
```

#### 💊 **Medication** - Medicamentos
```typescript
{
  id: string;            // UUID único
  name: string;          // Nombre único
  description: string;   // Descripción
  diseases: string[];    // Enfermedades tratadas
  medicalOrders: MedicalOrderMedication[]; // Relación N:N
}
```

### Comandos de Base de Datos

```bash
# Migraciones
npx prisma migrate dev     # Crear y aplicar migración
npx prisma migrate deploy  # Aplicar en producción
npx prisma migrate reset   # Resetear BD (desarrollo)

# Cliente Prisma
npx prisma generate        # Generar cliente
npx prisma db push         # Sincronizar esquema

# Datos
npm run db:seed           # Poblar con datos iniciales
npx prisma studio         # Interfaz visual de BD
```



## 🧪 Testing

### Suite de Pruebas Profesional

Sistema de testing completo con **Jest** y cobertura del **80%**:

```bash
# Testing básico
npm run test               # Tests unitarios
npm run test:e2e           # Tests end-to-end
npm run test:cov           # Reporte de cobertura

# Testing avanzado
npm run test:verbose       # Tests con detalles
npm run test:unit          # Solo servicios/repositorios
npm run test:integration   # Solo controladores
npm run test:watch         # Modo watch
npm run test:ci            # Para CI/CD
```

### Estado de Cobertura

| Módulo | Servicios | Repositorios | Controladores | Estado |
|--------|-----------|--------------|---------------|---------|
| **Patient** | ✅ 100% | ✅ 100% | ✅ 100% | **COMPLETO** |
| **Doctor** | ✅ 100% | ✅ 100% | ✅ 100% | **COMPLETO** |
| **Auth** | ✅ 100% | ✅ 100% | ✅ 100% | **COMPLETO** |
| **Appointment** | 🔧 Funcional | 🔧 Funcional | 🔧 Funcional | **FUNCIONAL** |
| **MedicalOrder** | ✅ Completo | ⏳ Básico | ⏳ Básico | **PARCIAL** |
| **Medication** | ✅ Completo | ⏳ Básico | ⏳ Básico | **PARCIAL** |

**Características:**
- 🎯 **80% threshold** de cobertura mínima
- 🏭 **Test factories** para datos de prueba
- 🔄 **Mocks de Prisma** configurados
- 📊 **Reportes automáticos** para CI/CD

## 🐳 Docker

### Contenerización Completa

La aplicación incluye configuración completa de **Docker** y **Docker Compose**:

```bash
# Levantar toda la infraestructura
docker-compose up --build

# Solo la base de datos
docker-compose up postgres

# En modo detached
docker-compose up -d

# Ver logs
docker-compose logs -f

# Limpiar
docker-compose down -v
```

**Servicios incluidos:**
- 🚀 **API NestJS** (puerto 3000)
- 🗄️ **PostgreSQL** (puerto 5432)
- 🔧 **Variables de entorno** automáticas
- 📦 **Volúmenes persistentes** para datos

---

## 📁 Estructura del Proyecto

```
colmena-api/
├── src/
│   ├── auth/                    # 🔐 Autenticación JWT
│   ├── patient/                 # 👤 Gestión de pacientes
│   ├── doctor/                  # 👨‍⚕️ Gestión de doctores
│   ├── appointment/             # 📅 Sistema de citas
│   ├── medical-order/           # 📋 Órdenes médicas
│   ├── medication/              # 💊 Catálogo de medicamentos
│   ├── common/                  # 🛠️ Utilidades compartidas
│   └── config/                  # ⚙️ Configuración
├── prisma/
│   ├── schema.prisma           # 🗄️ Esquema de BD
│   ├── migrations/             # 🔄 Migraciones
│   └── seed.ts                 # 🌱 Datos iniciales
├── test/                       # 🧪 Configuración de tests
├── docker-compose.yml          # 🐳 Orquestación
└── README.md                   # 📚 Documentación
```

---

## 🤝 Contribución

### Flujo de Desarrollo

1. **Fork** el repositorio
2. **Crear** rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** Pull Request

### Estándares de Código

- ✅ **ESLint** y **Prettier** configurados
- 🧪 **Tests** requeridos para nuevas funcionalidades
- 📝 **Documentación** actualizada
- 🔒 **Seguridad** validada

### Comandos de Desarrollo

```bash
npm run lint              # Verificar código
npm run format            # Formatear código
npm run test:cov          # Verificar cobertura
npm run build             # Compilar TypeScript
```

---

## 📄 Licencia

MIT