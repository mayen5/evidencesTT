# Backend - Sistema de Gestión de Evidencias Criminalísticas

API RESTful para la gestión de evidencias criminalísticas desarrollada con Node.js, Express, TypeScript y SQL Server.

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

### 1. Clonar el repositorio (si no lo has hecho)

```bash
git clone <repository-url>
cd MP_Nov/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo desde la raíz:

```bash
# Desde la carpeta backend
copy .env.example .env
```

Editar `.env` con tus configuraciones:

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
# Desde la raíz del proyecto
docker-compose up -d sqlserver

# Esperar a que SQL Server esté listo (30 segundos aprox)
timeout 30

# Ejecutar scripts de base de datos manualmente
# (usar Azure Data Studio o SQL Server Management Studio)
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

### Con Docker (desde raíz del proyecto)

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
../postman/Evidence-Management-API.postman_collection.json
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
backend/
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
├── Dockerfile
├── package.json
├── tsconfig.json
├── NEXT_STEPS.md            # Guía para completar
└── README.md                # Este archivo
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

## 📊 Base de Datos

### Stored Procedures

Todos los CRUDs se realizan mediante Stored Procedures:

- **Autenticación**: `sp_AuthenticateUser`, `sp_RegisterUser`
- **Expedientes**: `sp_CreateCaseFile`, `sp_GetAllCaseFiles`, `sp_UpdateCaseFile`, `sp_DeleteCaseFile`, `sp_ApproveCaseFile`, `sp_RejectCaseFile`, `sp_SubmitCaseFileForReview`
- **Indicios**: `sp_AddEvidence`, `sp_GetEvidenceByCaseFile`, `sp_UpdateEvidence`, `sp_DeleteEvidence`
- **Usuarios**: `sp_CreateUser`, `sp_GetAllUsers`, `sp_UpdateUser`, `sp_DeactivateUser`
- **Reportes**: `sp_GetStatisticsReport`

Ver esquema completo: `../docs/DATABASE.md`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start            # Producción
npm test             # Tests
npm run lint         # Linter
npm run lint:fix     # Fix de linter
npm run format       # Prettier
```

## 🚨 Troubleshooting

### Error: Cannot connect to SQL Server

1. Verificar que SQL Server esté corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar credenciales en `backend/.env` (o `.env` en esta carpeta)

3. Esperar 30 segundos después de iniciar SQL Server

### Error: Module not found

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📝 Próximos Pasos

Ver archivo [NEXT_STEPS.md](./NEXT_STEPS.md) para guía detallada de implementación de las capas faltantes (validators, repositories, services, controllers, routes).

## 📄 Licencia

MIT

---

**Para más información, ver la documentación principal del proyecto en la raíz.**
