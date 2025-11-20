# Documentación del Proyecto

Esta carpeta contiene la documentación técnica del Sistema de Gestión de Evidencias Criminalísticas.

## 📚 Documentos Planeados

### ARCHITECTURE.md
**Estado:** 🚧 Pendiente

**Contenido:**
- Decisiones arquitectónicas
- Patrones de diseño utilizados
- Justificación de tecnologías elegidas
- Arquitectura en capas del backend
- Flujos de datos
- Diagramas de componentes

### API.md
**Estado:** 🚧 Pendiente

**Contenido:**
- Documentación completa de todos los endpoints
- Ejemplos de requests y responses
- Códigos de error
- Guía de autenticación
- Rate limiting
- Ejemplos de uso con cURL

**Nota:** Actualmente la API está documentada en Swagger UI: http://localhost:3000/api-docs

### DATABASE.md
**Estado:** 🚧 Pendiente

**Contenido:**
- Diagrama Entidad-Relación completo
- Descripción de cada tabla
- Índices y optimizaciones
- Lista completa de Stored Procedures
- Triggers y funciones
- Políticas de respaldo
- Scripts de migración

### DEPLOYMENT.md
**Estado:** 🚧 Pendiente

**Contenido:**
- Guía de despliegue en producción
- Configuración de servidores
- Variables de entorno en producción
- Configuración de SSL/HTTPS
- Configuración de Nginx
- Monitoreo y logs
- Estrategias de backup

## 🎯 Prioridad de Creación

1. **ALTA**: DATABASE.md (documentar esquema existente)
2. **MEDIA**: ARCHITECTURE.md (explicar decisiones tomadas)
3. **MEDIA**: API.md (complementar Swagger)
4. **BAJA**: DEPLOYMENT.md (para cuando se despliegue)

## 📝 Formato

Todos los documentos deben estar en Markdown (.md) y seguir esta estructura:

```markdown
# Título del Documento

## Tabla de Contenidos
- [Sección 1](#seccion-1)
- [Sección 2](#seccion-2)

## Sección 1
Contenido...

## Sección 2
Contenido...

## Referencias
- Link 1
- Link 2
```

---

**Para contribuir:** Crear los archivos según las plantillas arriba y hacer pull request.

Ver [README principal](../README.md) para más información del proyecto.
