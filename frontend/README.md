# Frontend - Sistema de Gestión de Evidencias

Aplicación web desarrollada con React, TypeScript y Vite para la gestión de evidencias criminalísticas.

## 🚀 Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación (por instalar)
- **Axios** - Cliente HTTP (por instalar)
- **TanStack Query** - Gestión de estado del servidor (por instalar)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔧 Desarrollo

El servidor de desarrollo corre en **http://localhost:3001**

```bash
npm run dev
```

## 🐳 Docker

### Build y ejecución

```bash
# Desde la raíz del proyecto
docker-compose up --build frontend

# O build individual
docker build -t evidence-frontend .
docker run -p 3001:80 evidence-frontend
```

### Acceso en Docker

- **Aplicación**: http://localhost:3001

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas/vistas
│   ├── services/       # Servicios API
│   ├── hooks/          # Custom hooks
│   ├── context/        # Context providers
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Utilidades
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Entry point
├── public/             # Assets estáticos
├── Dockerfile          # Configuración Docker
├── nginx.conf          # Configuración Nginx para producción
└── vite.config.ts      # Configuración Vite
```

## 🔗 Integración con Backend

La aplicación se conecta con el backend API en:
- **Desarrollo**: http://localhost:3000/api/v1
- **Docker**: http://backend:3000/api/v1

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run lint` - Ejecutar ESLint

## 🚧 Estado Actual

**Versión**: 0.0.0 (Inicial)

Este es el scaffold inicial del proyecto. Próximos pasos:
- [ ] Configurar React Router
- [ ] Configurar Axios y TanStack Query
- [ ] Implementar autenticación
- [ ] Crear componentes base
- [ ] Implementar vistas principales

---

Ver [README principal](../README.md) para más información del proyecto completo
