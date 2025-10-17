# HIS - Sistema de Gestión Hospitalaria

## Información del Proyecto

**Nombre:** HIS (Hospital Information System)  
**Tecnologías:** Node.js, Express, Sequelize (MySQL), Pug, Bootstrap  
**Propósito:** Sistema de gestión integral para hospitales con módulos de pacientes, internaciones, turnos y habitaciones.

## Convenciones Importantes

### Nombres de Campos en Base de Datos
⚠️ **Usar snake_case (con guiones bajos)** en los campos de base de datos:
- ✅ `fecha_nacimiento`, `id_persona`, `tipo_sangre`
- ❌ `fechaNacimiento`, `idPersona`, `tipoSangre`

### Asociaciones de Sequelize
- **Usar alias consistentes** en los includes
- Los alias suelen ser el nombre del modelo (ej: `PacienteSeguro`, no `pacienteSeguro`)
- Siempre verificar las asociaciones definidas en `models/[Modelo].js`

### Vistas Pug
- Extender desde `../layout` cuando estén en subcarpetas
- Rutas de vistas relativas (sin `/` inicial): `'internacion/create'`

## Notas de Desarrollo

- **Validación**: Usar Zod schemas antes de operaciones de base de datos
- **Manejo de errores**: Siempre incluir try/catch y logs descriptivos
- **Consistencia**: Mantener convenciones de nombres entre modelo, BD y vistas
- **Includes**: Siempre verificar que las asociaciones estén correctamente cargadas antes de acceder a propiedades

---

## Contacto y Referencias

**Desarrollador**: Santiago  
**Fecha última actualización**: Octubre 2025  
**Branch principal**: main  
**Branch de desarrollo**: Cambios

---

## Dentro de la carpeta Context
**Base de datos**: .sql de la base de datos para mejor referencias