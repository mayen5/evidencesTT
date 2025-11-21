# Sistema de Gestión de Evidencias - Base de Datos

**Autor:** Carmelo Mayén  
**Fecha:** 2025-11-20

## 📋 Descripción General

Sistema completo de gestión de evidencias criminales con flujo de trabajo de aprobación:

- **Borrador** → **En Revisión** → **Aprobado/Rechazado**
- Campos forenses completos: Color, Tamaño, Peso, Ubicación
- 13 Stored Procedures para operaciones CRUD completas
- Datos de prueba: 20 usuarios, 25 expedientes, 57 evidencias

## 🗂️ Estructura de la Base de Datos

```
backend/database/
├── 01-DDL/                        # Definición de esquema (DDL)
│   ├── 01-create-tables.sql       - Todas las tablas del sistema
│   ├── 02-create-indexes.sql      - Índices para optimización
│   └── 03-create-triggers.sql     - Triggers de auditoría
│
├── 02-DML/                        # Datos iniciales y de prueba (DML)
│   ├── 01-seed-roles.sql          - 4 roles (Admin, Coordinador, Técnico, Visualizador)
│   ├── 02-seed-status.sql         - 4 estados (Borrador, En Revisión, Aprobado, Rechazado)
│   ├── 03-seed-evidence-types.sql - 13 tipos de evidencia
│   ├── 04-seed-admin-user.sql     - Usuario administrador
│   ├── 05-seed-test-users.sql     - 19 usuarios de prueba
│   ├── 06-seed-case-files.sql     - 25 expedientes de prueba
│   ├── 07-seed-evidence.sql       - 57 evidencias con datos forenses
│   ├── 08-seed-history.sql        - 47 registros de auditoría
│   └── 09-seed-participants.sql   - Participantes asignados a casos
│
├── 03-StoredProcedures/           # Lógica de negocio (13 SPs)
│   ├── auth/
│   │   ├── sp_AuthenticateUser.sql
│   │   └── sp_RegisterUser.sql
│   ├── caseFiles/
│   │   ├── sp_CreateCaseFile.sql
│   │   ├── sp_GetCaseFileById.sql
│   │   ├── sp_GetAllCaseFiles.sql
│   │   ├── sp_UpdateCaseFile.sql
│   │   ├── sp_SubmitCaseFileForReview.sql
│   │   ├── sp_ApproveCaseFile.sql
│   │   ├── sp_RejectCaseFile.sql
│   │   └── sp_DeleteCaseFile.sql
│   └── evidence/
│       ├── sp_AddEvidence.sql
│       ├── sp_GetAllEvidence.sql
│       └── sp_GetEvidenceByCaseFile.sql
│
├── init-complete.sql              # ⭐ Archivo consolidado (usado por Docker)
├── generate-init-complete.ps1     # Script para regenerar init-complete.sql
└── README.md                      # Este archivo
```

### 📝 Archivos en Raíz

- **`init-complete.sql`** - Script SQL consolidado que contiene DDL + DML + SPs. Es usado por `docker-compose.yml` para inicializar la DB automáticamente.
- **`generate-init-complete.ps1`** - Script PowerShell que genera `init-complete.sql` desde los archivos DDL/DML/SP. Ejecutar cuando se modifiquen scripts individuales.
- **`README.md`** - Documentación completa del sistema de base de datos.

## 🔄 Inicialización de Base de Datos

### ⚡ Método Automático (Recomendado)

La base de datos se inicializa **automáticamente** al ejecutar Docker Compose:

```powershell
# Iniciar todos los servicios (incluye SQL Server + inicialización automática)
docker-compose up -d

# El servicio db-init ejecutará init-complete.sql automáticamente
# Esperar ~15 segundos para que complete la inicialización
```

**¿Cómo funciona?**

1. Docker Compose levanta el contenedor `sqlserver`
2. Espera a que SQL Server esté healthy (healthcheck)
3. El contenedor `db-init` ejecuta `init-complete.sql` automáticamente
4. La base de datos queda lista con todas las tablas, datos y SPs

### 🔄 Recreación Completa (Borrar todo y empezar de cero)

```powershell
# 1. Detener servicios y eliminar volumen de datos
docker-compose down
docker volume rm mp_nov_sqlserver_data

# 2. Levantar servicios nuevamente (se recrea todo automáticamente)
docker-compose up -d

# Listo! La base de datos se recrea desde cero
```

### 🛠️ Regenerar init-complete.sql

Si modificas archivos en `01-DDL/`, `02-DML/` o `03-StoredProcedures/`, debes regenerar el archivo consolidado:

```powershell
cd backend/database
.\generate-init-complete.ps1
```

Esto consolidará todos los scripts en `init-complete.sql` para que Docker Compose lo use.

## 📊 Datos de Prueba

### Usuarios (20 total)

- **1 Admin:** `admin@evidence.com` / `Admin@123`
- **3 Coordinadores:**
  - `coord.martinez@dicri.gob` / `Test@123`
  - `coord.lopez@dicri.gob` / `Test@123`
  - `coord.rodriguez@dicri.gob` / `Test@123`
- **11 Técnicos:** `tec.garcia@dicri.gob` a `tec.mendez@dicri.gob` / `Test@123`
- **5 Visualizadores:** `view.castro@dicri.gob` a `view.mora@dicri.gob` / `Test@123`

### Expedientes (25 total)

- **10 Borradores** (StatusId = 1)
- **8 En Revisión** (StatusId = 2)
- **4 Aprobados** (StatusId = 3, con ReviewedById, ApprovedAt)
- **3 Rechazados** (StatusId = 4, con ReviewedById, RejectionReason, ReviewedAt)

### Evidencias (57 total)

Todos con campos forenses:

- `EvidenceNumber`: Código único (EVD-001-A, EVD-002-B, etc.)
- `Color`: Negro, Blanco, Plateado, Transparente, etc.
- `Size`: Dimensiones o descripción
- `Weight`: Peso en kg (DECIMAL(10,2))
- `Location`: Ubicación donde se encontró
- `StorageLocation`: Ubicación actual de almacenamiento

### Otros Datos

- **CaseFileHistory:** 47 registros (auditoría completa de cambios de estado)
- **CaseFileParticipants:** 75 asignaciones (roles: Investigador, Forense, Técnico, Perito)
- **Roles:** 4 (Administrador, Coordinador, Técnico, Visualizador)
- **CaseFileStatus:** 4 (Borrador, En Revisión, Aprobado, Rechazado)
- **EvidenceTypes:** 13 tipos de evidencia

## 🔍 Verificación

### Verificar Tablas y Conteos

```sql
USE EvidenceManagementDB;

SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL SELECT 'CaseFiles', COUNT(*) FROM CaseFiles
UNION ALL SELECT 'Evidence', COUNT(*) FROM Evidence
UNION ALL SELECT 'CaseFileHistory', COUNT(*) FROM CaseFileHistory
UNION ALL SELECT 'CaseFileParticipants', COUNT(*) FROM CaseFileParticipants
UNION ALL SELECT 'Roles', COUNT(*) FROM Roles
UNION ALL SELECT 'CaseFileStatus', COUNT(*) FROM CaseFileStatus
UNION ALL SELECT 'EvidenceTypes', COUNT(*) FROM EvidenceTypes
UNION ALL SELECT 'StoredProcedures', COUNT(*) FROM sys.procedures
ORDER BY TableName;
```

**Resultado Esperado:**

```
TableName              RecordCount
CaseFileHistory        47
CaseFileParticipants   75
CaseFiles              25
CaseFileStatus         4
Evidence               57
EvidenceTypes          13
Roles                  4
StoredProcedures       13
Users                  20
```

### Verificar Campos de Workflow

```sql
SELECT TOP 3
    cf.CaseNumber,
    cf.Title,
    s.Name AS Status,
    cf.ReviewedById,
    u.FirstName + ' ' + u.LastName AS ReviewedBy,
    cf.RejectionReason,
    cf.ReviewedAt,
    cf.ApprovedAt
FROM CaseFiles cf
INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
LEFT JOIN Users u ON cf.ReviewedById = u.Id
WHERE cf.StatusId IN (3,4)
ORDER BY cf.Id;
```

### Verificar Campos Forenses en Evidencias

```sql
SELECT TOP 3
    e.EvidenceNumber,
    e.Description,
    e.Color,
    e.Size,
    e.Weight,
    e.Location
FROM Evidence e
ORDER BY e.Id;
```

### Verificar Stored Procedures

```sql
SELECT name FROM sys.procedures ORDER BY name;
```

**Debe mostrar:**

```
sp_AddEvidence
sp_ApproveCaseFile
sp_AuthenticateUser
sp_CreateCaseFile
sp_DeleteCaseFile
sp_GetAllCaseFiles
sp_GetAllEvidence
sp_GetCaseFileById
sp_GetEvidenceByCaseFile
sp_RegisterUser
sp_RejectCaseFile
sp_SubmitCaseFileForReview
sp_UpdateCaseFile
```

## 📝 Requisitos Funcionales Cumplidos

✅ **REQ-1:** Registro de expedientes criminales  
✅ **REQ-2:** Indicios con Color, Tamaño, Peso  
✅ **REQ-3:** Revisión por Coordinador (ReviewedById)  
✅ **REQ-4:** Justificación de rechazo (RejectionReason)  
✅ **REQ-5:** Proceso finaliza al aprobar (ApprovedAt)

## 🛠️ Tecnologías

- **SQL Server 2022** (Docker)
- **TypeScript/Node.js** (Backend)
- **React/Material-UI** (Frontend)
- **Docker Compose** (Orquestación)

## 📌 Notas Importantes

1. **NO** existe archivo `init-complete.sql` - Se eliminó por estar desactualizado
2. **SÍ** usar estructura DDL → DML → SP para recreación
3. **SIEMPRE** ejecutar scripts en orden numérico
4. **Si falla 09-seed-participants.sql:** Limpiar tabla y re-ejecutar (ver comando arriba)
5. **Todos los archivos SQL** tienen Author: Carmelo Mayén

## 🔗 Conexión

```
Server: localhost,1433
Database: EvidenceManagementDB
User: sa
Password: Db@dm1n2025
```

## 🎯 Estado del Proyecto

**✅ PRODUCCIÓN READY**

- Sistema completamente funcional
- Base de datos se recrea sin scripts adicionales
- Todos los 5 requisitos validados
- Datos de prueba completos
- Backend respondiendo en puerto 3000
