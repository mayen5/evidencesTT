# Estructura del Proyecto - Sistema de Gestión de Evidencias

## 📁 Organización de Carpetas

Este proyecto está organizado en un **monorepo** con las siguientes carpetas principales:

```
MP_Nov/
├── backend/              ✅ COMPLETADO - API RESTful
├── frontend/             🚧 PENDIENTE - Aplicación React
├── docs/                 📚 Documentación general
├── shared/               🔄 Código compartido (futuro)
└── docker-compose.yml    🐳 Orquestación de servicios
```

## 📦 Contenido de Cada Carpeta

### `/backend` - API RESTful (Fase 1)

Backend completo con Node.js, Express, TypeScript y SQL Server.

**Contenido:**
- `src/` - Código fuente TypeScript
- `database/` - Scripts SQL (DDL, DML, Stored Procedures)
- `tests/` - Tests unitarios e integración
- `package.json` - Dependencias del backend
- `Dockerfile` - Imagen Docker del backend
- `README.md` - Documentación específica del backend
- `NEXT_STEPS.md` - Guía para completar implementación

**Estado:** ✅ Base completa, pendiente validators/repositories/services/controllers/routes

**Para trabajar:**
```bash
cd backend
npm install
npm run dev
```

### `/frontend` - Aplicación React (Fase 2)

Interfaz de usuario con React, TypeScript y Vite.

**Contenido planeado:**
- `src/` - Componentes React
- `public/` - Assets estáticos
- `package.json` - Dependencias del frontend
- `Dockerfile` - Imagen Docker del frontend

**Estado:** 🚧 Pendiente de implementación

**Tecnologías:**
- React 18 + TypeScript
- Vite
- React Router v6
- Axios + TanStack Query
- Tailwind CSS / Material-UI
- Formik + Yup

### `/docs` - Documentación General

Documentación técnica del proyecto completo.

**Contenido planeado:**
- `ARCHITECTURE.md` - Decisiones arquitectónicas
- `API.md` - Documentación completa de API
- `DATABASE.md` - Esquema y diagrama ER
- `DEPLOYMENT.md` - Guía de despliegue

**Estado:** 📝 Pendiente de crear

### `/shared` - Código Compartido (Opcional)

Código compartido entre backend y frontend (DTOs, tipos, constantes).

**Contenido futuro:**
- Interfaces TypeScript compartidas
- Enums y constantes
- Validaciones comunes
- Utilidades

**Estado:** 🔄 Opcional para el futuro

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

Desde la raíz del proyecto:

```bash
# 1. Configurar entorno
copy backend\.env.example backend\.env

# 2. Levantar servicios
docker-compose up -d

# 3. Verificar
docker-compose ps
```

Acceder a:
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs

### Opción 2: Desarrollo Local

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend (cuando esté disponible)

```bash
cd frontend
npm install
npm run dev
```

## 🔄 Flujo de Trabajo

### Para Desarrollo del Backend

1. **Ubicación**: `cd backend`
2. **Instalar**: `npm install`
3. **Desarrollo**: `npm run dev`
4. **Tests**: `npm test`
5. **Build**: `npm run build`

Ver [backend/NEXT_STEPS.md](./backend/NEXT_STEPS.md) para guía detallada.

### Para Desarrollo del Frontend (Fase 2)

1. **Ubicación**: `cd frontend`
2. **Crear proyecto**: `npm create vite@latest . -- --template react-ts`
3. **Instalar**: `npm install`
4. **Desarrollo**: `npm run dev`

## 🐳 Docker Compose

El archivo `docker-compose.yml` en la raíz orquesta todos los servicios:

```yaml
services:
  sqlserver:    # Base de datos SQL Server
  backend:      # API Node.js (build desde ./backend)
  # frontend:   # React App (futuro)
```

**Comandos útiles:**

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs de un servicio
docker-compose logs -f backend

# Reconstruir imágenes
docker-compose up --build

# Detener todo
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

## 📊 Estado del Proyecto

| Componente | Estado | Progreso |
|------------|--------|----------|
| **Backend Base** | ✅ Completo | 70% |
| - Configuración | ✅ | 100% |
| - Base de Datos | ✅ | 100% |
| - Middlewares | ✅ | 100% |
| - Models/Types | ✅ | 100% |
| - Validators | 🚧 | 0% |
| - Repositories | 🚧 | 0% |
| - Services | 🚧 | 0% |
| - Controllers | 🚧 | 0% |
| - Routes | 🚧 | 0% |
| - Tests | 🚧 | 0% |
| **Frontend** | 🚧 Pendiente | 0% |
| **Documentación** | 🚧 Parcial | 40% |
| **Docker** | ✅ Completo | 100% |

## 📝 Próximos Pasos

1. **Backend** - Completar capas faltantes (ver `backend/NEXT_STEPS.md`)
   - [ ] Validators
   - [ ] Repositories
   - [ ] Services
   - [ ] Controllers
   - [ ] Routes

2. **Frontend** - Crear aplicación React (Fase 2)
   - [ ] Setup inicial con Vite
   - [ ] Componentes UI
   - [ ] Integración con API
   - [ ] Autenticación
   - [ ] Dockerizar

3. **Documentación** - Completar docs/
   - [ ] ARCHITECTURE.md
   - [ ] API.md
   - [ ] DATABASE.md

4. **Tests** - Ampliar cobertura
   - [ ] Tests unitarios backend
   - [ ] Tests integración
   - [ ] Tests E2E frontend

## 💡 Convenciones

### Rutas Relativas

Cuando trabajes en:
- **Backend**: Las rutas son relativas a `backend/`
- **Frontend**: Las rutas serán relativas a `frontend/`
- **Docker**: Las rutas en docker-compose son relativas a la raíz

### Imports entre Proyectos

Por ahora, backend y frontend son independientes. En el futuro, se puede usar:
- Carpeta `shared/` para código común
- Symlinks o workspace de npm
- Monorepo con Nx o Turborepo

### Variables de Entorno

- `backend/.env` - Configuración del backend (API, base de datos, JWT)
- `frontend/.env` - Configuración del frontend (cuando se implemente en Fase 2)
- El archivo `docker-compose.yml` usa `backend/.env` automáticamente

## 🔗 Enlaces Útiles

- [README Principal](./README.md)
- [Backend README](./backend/README.md)
- [Backend NEXT_STEPS](./backend/NEXT_STEPS.md)
- [Swagger UI](http://localhost:3000/api-docs) (cuando backend esté corriendo)

---

**Versión:** 1.0.0  
**Última actualización:** 18 Nov 2025  
**Fase actual:** Backend (70% completo)
