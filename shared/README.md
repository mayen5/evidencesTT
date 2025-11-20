# Shared - Código Compartido

**Estado:** 🔄 Opcional para el futuro

Esta carpeta está reservada para código compartido entre el backend y el frontend.

## 🎯 Propósito

Centralizar código que necesitan tanto el backend como el frontend:

- **Interfaces TypeScript** compartidas
- **Enums** y constantes
- **DTOs** (Data Transfer Objects)
- **Validaciones** comunes
- **Utilidades** reutilizables

## 📦 Estructura Planeada

```
shared/
├── src/
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── caseFile.types.ts
│   │   └── evidence.types.ts
│   ├── enums/
│   │   ├── roles.enum.ts
│   │   ├── status.enum.ts
│   │   └── evidenceTypes.enum.ts
│   ├── dtos/
│   │   ├── auth.dto.ts
│   │   ├── caseFile.dto.ts
│   │   └── evidence.dto.ts
│   ├── validators/
│   │   └── schemas.ts
│   └── utils/
│       └── formatters.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 Beneficios

1. **DRY (Don't Repeat Yourself)**: Definir tipos una sola vez
2. **Consistencia**: Frontend y backend usan las mismas definiciones
3. **Type Safety**: TypeScript en ambos lados con mismos tipos
4. **Mantenibilidad**: Cambios en un solo lugar

## 🚀 Implementación Futura

### Opción 1: Symlinks

```bash
# En backend
ln -s ../shared/src backend/src/shared

# En frontend
ln -s ../shared/src frontend/src/shared
```

### Opción 2: npm Workspace

Configurar en `package.json` raíz:

```json
{
  "name": "evidence-management-system",
  "private": true,
  "workspaces": [
    "backend",
    "frontend",
    "shared"
  ]
}
```

### Opción 3: Publicar como paquete npm privado

Publicar `@evidence/shared` y usarlo como dependencia.

## 📝 Ejemplo de Uso

### shared/src/types/user.types.ts

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  isActive: boolean;
}

export type UserRole = 'Admin' | 'Coordinador' | 'Tecnico' | 'Visualizador';
```

### En Backend

```typescript
import { User } from '@shared/types/user.types';

const user: User = { /* ... */ };
```

### En Frontend

```typescript
import { User } from '@shared/types/user.types';

const user: User = { /* ... */ };
```

## ⚠️ Estado Actual

Por ahora, los tipos están duplicados en:
- `backend/src/models/`
- `frontend/src/types/` (cuando se cree)

En el futuro, se pueden migrar aquí para centralizarlos.

---

**Nota:** Esta implementación es opcional y puede hacerse en una fase posterior cuando se necesite compartir mucho código entre frontend y backend.

Ver [README principal](../README.md) para más información del proyecto.
