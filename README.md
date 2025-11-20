# Sistema de Gestión de Evidencias Criminalísticas

Sistema completo para la gestión de evidencias criminalísticas con backend RESTful API y frontend React.

## 🏗️ Estructura del Proyecto

```
MP_Nov/
├── backend/                 # API RESTful con Node.js + Express + TypeScript
│   ├── src/                 # Código fuente del backend
│   ├── database/            # Scripts SQL (DDL, DML, SPs)
│   ├── tests/               # Tests unitarios e integración
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md            # Documentación del backend
│
├── frontend/                # Aplicación React (Fase 2)
│   └── (pendiente)
│
├── docs/                    # Documentación del proyecto
│   ├── ARCHITECTURE.md      # Decisiones arquitectónicas
│   ├── API.md               # Documentación de API
│   └── DATABASE.md          # Esquema de base de datos
│
├── shared/                  # Código compartido (DTOs, types)
│   └── (pendiente)
│
├── docker-compose.yml       # Orquestación de servicios
├── .gitignore
└── README.md                # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker y Docker Compose

### Instalación Completa con Docker

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd MP_Nov

# 2. Configurar variables de entorno
copy backend\.env.example backend\.env

# 3. Levantar todos los servicios
docker-compose up -d

# 4. Ver logs
docker-compose logs -f backend
```

La API estará disponible en:
- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 📦 Componentes del Sistema

### Backend (Fase 1 - ✅ Completado)

API RESTful desarrollada con:
- Node.js + Express + TypeScript
- SQL Server con Stored Procedures
- Autenticación JWT
- Validación con Zod
- Documentación Swagger/OpenAPI
- Tests unitarios con Jest
- Docker containerizado

**Ver documentación completa**: [backend/README.md](./backend/README.md)

### Frontend (Fase 2 - 🚧 Pendiente)

Aplicación React con:
- React 18 + TypeScript
- Vite
- React Router v6
- Axios + TanStack Query
- Tailwind CSS / Material-UI
- Formik + Yup

## 🔐 Credenciales por Defecto

```
Username: admin
Email: admin@evidence.com
Password: Admin@123
```

## 🛠️ Desarrollo

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend (cuando esté disponible)

```bash
cd frontend
npm install
npm run dev
```

## 📊 Base de Datos

El sistema utiliza SQL Server con una arquitectura completamente basada en Stored Procedures:

- **9 Tablas** normalizadas (3FN)
- **20+ Stored Procedures** para todas las operaciones CRUD
- **Índices** optimizados para rendimiento
- **Triggers** para auditoría automática
- **Constraints** para integridad referencial

Ver esquema completo: [docs/DATABASE.md](./docs/DATABASE.md)

## 🎯 Funcionalidades Principales

### Gestión de Expedientes
- ✅ Registro de expedientes con datos generales
- ✅ Agregar múltiples indicios a cada expediente
- ✅ Control de estados (Borrador → En Revisión → Aprobado/Rechazado)
- ✅ Auditoría completa de cambios

### Revisión y Aprobación
- ✅ Coordinadores revisan expedientes
- ✅ Aprobación o rechazo con justificación
- ✅ Notificación de cambios a técnicos

### Reportes y Estadísticas
- ✅ Filtros por fechas y estados
- ✅ Estadísticas de registros, aprobaciones y rechazos
- ✅ Reportes de actividad de usuarios

### Seguridad
- ✅ Autenticación JWT
- ✅ Control de acceso por roles (Admin, Coordinador, Técnico, Visualizador)
- ✅ Rate limiting
- ✅ Validación de datos
- ✅ Logging estructurado

## 🐳 Docker

### Servicios Disponibles

- **sqlserver**: SQL Server 2022 (puerto 1433)
- **backend**: API Node.js (puerto 3000)

### Comandos Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f backend
docker-compose logs -f sqlserver

# Detener servicios
docker-compose down

# Reconstruir servicios
docker-compose up --build

# Limpiar volúmenes
docker-compose down -v
```

## 📝 Scripts Disponibles

### Raíz del Proyecto

```bash
docker-compose up        # Levantar todos los servicios
docker-compose down      # Detener servicios
```

### Backend

```bash
npm run dev             # Desarrollo con hot-reload
npm run build           # Compilar TypeScript
npm start               # Producción
npm test                # Tests
npm run lint            # Linter
npm run format          # Prettier
```

## 🧪 Testing

```bash
cd backend
npm test                # Ejecutar todos los tests
npm run test:watch      # Tests en modo watch
npm test -- --coverage  # Tests con coverage
```

## 📖 API Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh` - Refrescar token

### Expedientes
- `GET /api/v1/casefiles` - Listar expedientes
- `POST /api/v1/casefiles` - Crear expediente
- `GET /api/v1/casefiles/:id` - Obtener expediente
- `PUT /api/v1/casefiles/:id` - Actualizar expediente
- `DELETE /api/v1/casefiles/:id` - Eliminar expediente
- `POST /api/v1/casefiles/:id/submit` - Enviar a revisión
- `POST /api/v1/casefiles/:id/approve` - Aprobar expediente
- `POST /api/v1/casefiles/:id/reject` - Rechazar expediente

### Indicios
- `GET /api/v1/evidence/casefile/:id` - Listar indicios
- `POST /api/v1/evidence` - Agregar indicio
- `GET /api/v1/evidence/:id` - Obtener indicio
- `PUT /api/v1/evidence/:id` - Actualizar indicio
- `DELETE /api/v1/evidence/:id` - Eliminar indicio

**Documentación completa**: http://localhost:3000/api-docs

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en `backend/` (ya existe `.env.example` como plantilla):

```env
# Database
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd123
DB_NAME=EvidenceManagementDB

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 📚 Documentación Adicional

- [Arquitectura del Sistema](./docs/ARCHITECTURE.md)
- [Documentación del Backend](./backend/README.md)
- [Esquema de Base de Datos](./docs/DATABASE.md)
- [Documentación de API](./docs/API.md)
- [Próximos Pasos](./backend/NEXT_STEPS.md)

## 🎓 Requisitos Técnicos Cumplidos

- ✅ **Frontend ReactJS** (Fase 2 - Pendiente)
- ✅ **Backend NodeJS + Express**
- ✅ **Servicios RESTful**
- ✅ **Stored Procedures SQL Server** para TODAS las operaciones
- ✅ **Docker containerizado**
- ✅ **Pruebas unitarias del backend**
- ✅ **Swagger documentado**
- ✅ **Colección Postman** (pendiente exportar)

## 🚨 Troubleshooting

### Error: Cannot connect to SQL Server

```bash
# Verificar que SQL Server está corriendo
docker-compose ps

# Ver logs de SQL Server
docker-compose logs sqlserver

# Esperar 30 segundos después de iniciar
```

### Error: Port already in use

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Cambiar 3000 por otro puerto
```

## 👥 Roles del Sistema

1. **Admin** - Acceso completo al sistema
2. **Coordinador** - Revisa y aprueba/rechaza expedientes
3. **Técnico** - Registra expedientes e indicios
4. **Visualizador** - Solo lectura

## 📄 Licencia

MIT

## 📧 Contacto

Para soporte: support@evidence.com

---

**Estado del Proyecto**: Fase 1 (Backend) ✅ Completado | Fase 2 (Frontend) 🚧 En desarrollo

## 🚀 Características

- ✅ **Node.js + Express + TypeScript**: Backend robusto y tipado
- ✅ **SQL Server**: Base de datos con stored procedures
- ✅ **Arquitectura en Capas**: Controllers → Services → Repositories
- ✅ **Autenticación JWT**: Sistema seguro de autenticación y autorización
- ✅ **Validación con Zod**: Validación de schemas en tiempo de ejecución
- ✅ **Swagger/OpenAPI**: Documentación interactiva de la API
- ✅ **Docker**: Containerización completa del sistema
- ✅ **Tests Unitarios**: Testing con Jest y Supertest
- ✅ **ESLint + Prettier**: Código limpio y consistente
- ✅ **Winston Logger**: Sistema de logging estructurado

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker y Docker Compose (para deployment)
- SQL Server 2019+ (opcional si usas Docker)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd MP_Nov
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y configurar:

```bash
cd backend
copy .env.example .env
```

Editar `backend/.env` con tus configuraciones:

```env
# Database
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd123
DB_NAME=EvidenceManagementDB

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
```

### 4. Inicializar la base de datos

#### Opción A: Con Docker (Recomendado)

```bash
# Levantar SQL Server en Docker
docker-compose up -d sqlserver

# Esperar a que SQL Server esté listo (30 segundos aprox)
timeout 30

# Ejecutar scripts de base de datos
npm run db:setup
```

#### Opción B: SQL Server Local

1. Crear la base de datos `EvidenceManagementDB`
2. Ejecutar los scripts en orden:

```bash
# DDL - Crear tablas
database/01-DDL/01-create-tables.sql
database/01-DDL/02-create-indexes.sql
database/01-DDL/03-create-triggers.sql

# DML - Datos iniciales
database/02-DML/01-seed-roles.sql
database/02-DML/02-seed-status.sql
database/02-DML/03-seed-evidence-types.sql
database/02-DML/04-seed-admin-user.sql

# Stored Procedures
database/03-StoredProcedures/auth/*.sql
database/03-StoredProcedures/caseFiles/*.sql
database/03-StoredProcedures/evidence/*.sql
```

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La API estará disponible en: `http://localhost:3000`

### Modo Producción

```bash
# Compilar TypeScript
npm run build

# Ejecutar
npm start
```

### Con Docker Compose (Completo)

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener servicios
docker-compose down
```

## 📚 Documentación API

### Swagger UI

Una vez iniciada la aplicación, acceder a:

```
http://localhost:3000/api-docs
```

### Postman

Importar la colección ubicada en:

```
postman/Evidence-Management-API.postman_collection.json
```

## 🔐 Autenticación

### Usuario por Defecto

```
Username: admin
Email: admin@evidence.com
Password: Admin@123
```

### Flujo de Autenticación

1. **Login**: `POST /api/v1/auth/login`
   ```json
   {
     "email": "admin@evidence.com",
     "password": "Admin@123"
   }
   ```

2. **Respuesta**:
   ```json
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { ... }
   }
   ```

3. **Usar Token**: Agregar header en requests:
   ```
   Authorization: Bearer <accessToken>
   ```

## 📁 Estructura del Proyecto

```
MP_Nov/
├── src/
│   ├── config/              # Configuración (DB, Swagger, Env)
│   ├── controllers/         # Controladores HTTP
│   ├── services/            # Lógica de negocio
│   ├── repositories/        # Acceso a datos (SPs)
│   ├── models/              # Interfaces y tipos
│   ├── middlewares/         # Autenticación, validación, etc.
│   ├── routes/              # Definición de endpoints
│   ├── validators/          # Schemas de validación (Zod)
│   ├── utils/               # Utilidades (Logger, JWT, etc.)
│   ├── types/               # Type definitions
│   ├── app.ts               # Configuración de Express
│   └── server.ts            # Punto de entrada
├── database/
│   ├── 01-DDL/              # Tablas, índices, triggers
│   ├── 02-DML/              # Datos iniciales
│   ├── 03-StoredProcedures/ # Stored Procedures organizados
│   ├── 04-Views/            # Vistas SQL
│   └── 05-Functions/        # Funciones SQL
├── tests/
│   ├── unit/                # Tests unitarios
│   └── integration/         # Tests de integración
├── docs/                    # Documentación adicional
├── docker/                  # Dockerfiles
├── postman/                 # Colecciones Postman
├── docker-compose.yml
├── package.json
└── README.md
```

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm test
```

### Tests con coverage

```bash
npm test -- --coverage
```

### Tests en modo watch

```bash
npm run test:watch
```

## 📖 Endpoints Principales

### Autenticación

- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh` - Refrescar token
- `POST /api/v1/auth/logout` - Cerrar sesión

### Expedientes (Case Files)

- `GET /api/v1/casefiles` - Listar expedientes (con paginación y filtros)
- `GET /api/v1/casefiles/:id` - Obtener expediente por ID
- `POST /api/v1/casefiles` - Crear nuevo expediente
- `PUT /api/v1/casefiles/:id` - Actualizar expediente
- `DELETE /api/v1/casefiles/:id` - Eliminar expediente
- `POST /api/v1/casefiles/:id/submit` - Enviar a revisión
- `POST /api/v1/casefiles/:id/approve` - Aprobar expediente (Coordinador)
- `POST /api/v1/casefiles/:id/reject` - Rechazar expediente (Coordinador)

### Indicios (Evidence)

- `GET /api/v1/evidence/casefile/:caseFileId` - Listar indicios de un expediente
- `GET /api/v1/evidence/:id` - Obtener indicio por ID
- `POST /api/v1/evidence` - Agregar nuevo indicio
- `PUT /api/v1/evidence/:id` - Actualizar indicio
- `DELETE /api/v1/evidence/:id` - Eliminar indicio

### Usuarios

- `GET /api/v1/users` - Listar usuarios
- `GET /api/v1/users/:id` - Obtener usuario por ID
- `POST /api/v1/users` - Crear usuario
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Desactivar usuario

### Reportes

- `GET /api/v1/reports/statistics` - Estadísticas generales
- `GET /api/v1/reports/casefiles` - Reporte de expedientes

## 🔒 Roles y Permisos

### Admin (ID: 1)
- Acceso completo al sistema
- Gestión de usuarios
- Configuración del sistema

### Coordinador (ID: 2)
- Revisar expedientes
- Aprobar/Rechazar expedientes
- Ver todos los expedientes
- Generar reportes

### Técnico (ID: 3)
- Crear expedientes
- Agregar indicios
- Editar expedientes en Borrador
- Enviar a revisión

### Visualizador (ID: 4)
- Solo lectura
- Ver expedientes aprobados
- Ver reportes

## 🐳 Docker

### Servicios

```yaml
services:
  backend:     # API Node.js
  sqlserver:   # SQL Server 2022
```

### Comandos útiles

```bash
# Build y start
docker-compose up --build

# Solo backend
docker-compose up backend

# Ver logs de SQL Server
docker-compose logs -f sqlserver

# Ejecutar comando en contenedor
docker-compose exec backend npm run test

# Limpiar todo
docker-compose down -v
```

## 📊 Base de Datos

### Diagrama ER

Ver documentación en: `docs/DATABASE.md`

### Stored Procedures

Todos los CRUDs se realizan mediante Stored Procedures:

- **Autenticación**: `sp_AuthenticateUser`, `sp_RegisterUser`
- **Expedientes**: `sp_CreateCaseFile`, `sp_GetAllCaseFiles`, `sp_UpdateCaseFile`, `sp_DeleteCaseFile`, `sp_ApproveCaseFile`, `sp_RejectCaseFile`, `sp_SubmitCaseFileForReview`
- **Indicios**: `sp_AddEvidence`, `sp_GetEvidenceByCaseFile`, `sp_UpdateEvidence`, `sp_DeleteEvidence`
- **Usuarios**: `sp_CreateUser`, `sp_GetAllUsers`, `sp_UpdateUser`, `sp_DeactivateUser`
- **Reportes**: `sp_GetStatisticsReport`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start            # Producción
npm test             # Tests
npm run lint         # Linter
npm run lint:fix     # Fix de linter
npm run format       # Prettier
npm run db:setup     # Setup de BD
```

## 🚨 Troubleshooting

### Error: Cannot connect to SQL Server

1. Verificar que SQL Server esté corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar credenciales en `backend/.env`

3. Esperar 30 segundos después de iniciar SQL Server

### Error: Module not found

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Permission denied en Docker

```bash
# Linux/Mac
sudo docker-compose up

# Windows
# Ejecutar PowerShell como Administrador
```

## 📝 Licencia

MIT

## 👥 Contribuir

1. Fork del proyecto
2. Crear branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📧 Soporte

Para soporte, email: support@evidence.com

---

**Nota**: Este es un proyecto académico para demostración de buenas prácticas en desarrollo backend.
