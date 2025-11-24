# HIS - Hospital Information System

Sistema integral de gestión hospitalaria que permite administrar pacientes, internaciones, turnos, personal médico, habitaciones, planes de cuidado, recetas médicas y altas hospitalarias.

## 🏥 Características Principales

- **Gestión de Pacientes**: Registro completo con datos personales, seguros médicos y contactos de emergencia
- **Sistema de Turnos**: Solicitud, confirmación y cancelación de turnos médicos
- **Internaciones**: Asignación de camas, seguimiento de internaciones activas y gestión de altas
- **Personal Médico**: Registro de médicos, enfermeros y personal administrativo
- **Habitaciones y Camas**: Control de disponibilidad y estados (disponible, ocupada, mantenimiento)
- **Planes de Cuidado**: Registro de planes transitorios y finales para seguimiento de pacientes
- **Recetas Médicas**: Prescripción de medicamentos con dosis, duración e indicaciones
- **Historial Médico**: Seguimiento completo de antecedentes y evolución de pacientes
- **Signos Vitales**: Registro periódico de temperatura, presión, frecuencia cardíaca, etc.
- **Solicitudes Médicas**: Gestión de estudios y atención médica
- **Sistema de Roles**: Admin, Médico, Enfermero y Recepcionista con permisos diferenciados

## 📋 Requisitos

- **Node.js** v16 o superior
- **MySQL** 5.7 o superior / MariaDB
- **npm** (incluido con Node.js)

## 🚀 Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/santi-subidia/HIS.git
   cd HIS
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   Copia el archivo `.env.example` a `.env` y ajusta los valores según tu entorno:

   ```bash
   cp .env.example .env
   ```

   Configuración del archivo `.env`:

   ```env
   # Base de datos
   DB_NAME=hospital_db
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_HOST=127.0.0.1
   DB_DIALECT=mysql
   DB_LOGGING=false

   # Sincronización (solo primera vez)
   SYNC_MODELS=true
   RUN_SEEDS=true

   # Servidor
   PORT=3000

   # Sesión
   SESSION_SECRET=cambia-esto-en-produccion
   ```

4. **Crea la base de datos:**

   ```sql
   CREATE DATABASE hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   O usa el archivo SQL incluido en `context/hospital_db.sql` para importar la estructura completa.

5. **Primera ejecución (con sincronización y seeds):**

   Con `SYNC_MODELS=true` y `RUN_SEEDS=true` en el `.env`:

   ```bash
   npm run dev
   ```

   Esto creará las tablas, relaciones y cargará datos de prueba (provincias, localidades, roles, medicamentos, etc.).

6. **Ejecuciones posteriores:**

   Cambia en `.env`:
   ```env
   SYNC_MODELS=false
   RUN_SEEDS=false
   ```

   Y ejecuta:
   ```bash
   npm start
   ```

7. **Accede a la aplicación:**

   Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## 👤 Usuarios de Prueba

Después de ejecutar los seeds, puedes usar estos usuarios para probar el sistema:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `admin123` | Administrador |
| `medico1` | `medico123` | Médico |
| `enfermero1` | `enfermero123` | Enfermero |
| `recepcion1` | `recepcion123` | Recepcionista |

> **Nota**: Estos usuarios son solo para pruebas. En producción, crea usuarios con contraseñas seguras.

## 📁 Estructura del Proyecto

```
HIS/
├── app.js                 # Punto de entrada de la aplicación
├── config/                # Configuración de Sequelize y base de datos
├── controllers/           # Lógica de negocio y controladores
│   ├── paciente_controller.js
│   ├── internacion_controller.js
│   ├── turno_controller.js
│   ├── alta_controller.js
│   └── ...
├── models/                # Modelos de Sequelize (ORM)
│   ├── Paciente.js
│   ├── Internacion.js
│   ├── Usuario.js
│   └── ...
├── routes/                # Definición de rutas Express
│   ├── paciente_routes.js
│   ├── internacion_routes.js
│   └── ...
├── views/                 # Vistas Pug (templates)
│   ├── layout.pug
│   ├── auth/
│   ├── paciente/
│   ├── internacion/
│   └── ...
├── middlewares/           # Middlewares personalizados (autenticación, roles)
├── schemas/               # Esquemas de validación Zod
├── seeds/                 # Scripts para datos iniciales
├── public/                # Archivos estáticos (CSS, JS, imágenes)
├── context/               # Documentación y SQL de referencia
└── data/                  # Archivos CSV con datos (medicamentos, etc.)
```

## 🔧 Tecnologías Utilizadas

### Backend
- **Express.js 5.1**: Framework web para Node.js
- **Sequelize 6.37**: ORM para base de datos SQL
- **MySQL2 3.14**: Driver MySQL para Node.js
- **Express Session 1.18**: Manejo de sesiones de usuario
- **Bcrypt 6.0**: Hash seguro de contraseñas

### Frontend
- **Pug 3.0**: Motor de plantillas HTML
- **Bootstrap 5.3**: Framework CSS
- **Font Awesome 6**: Iconos
- **Bootstrap Icons**: Iconos adicionales

### Validación y Utilidades
- **Zod 3.25**: Validación de esquemas y datos
- **Multer 2.0**: Manejo de archivos subidos
- **CSV-Parser 3.2**: Lectura de archivos CSV
- **Dotenv 16.5**: Gestión de variables de entorno

### Desarrollo
- **Nodemon 3.1**: Reinicio automático del servidor en desarrollo

## 🎯 Scripts Disponibles

```bash
npm start          # Inicia el servidor en producción
npm run dev        # Inicia el servidor con nodemon (desarrollo)
```

## 🔐 Sistema de Autenticación

El sistema implementa autenticación basada en sesiones con 4 roles:

- **Admin**: Gestión de usuarios del sistema, estadísticas generales
- **Médico**: Acceso a historiales médicos, diagnósticos, recetas, altas
- **Enfermero**: Planes de cuidado, signos vitales, administración de medicamentos
- **Recepcionista**: Gestión de pacientes, turnos, internaciones (sin acceso a datos médicos sensibles)

## ⚠️ Notas Importantes

- **Primera ejecución**: Ejecuta con `SYNC_MODELS=true` y `RUN_SEEDS=true` para crear la estructura y datos iniciales.
- **Producción**: Cambia `SYNC_MODELS=false` y `RUN_SEEDS=false` después de la primera ejecución.
- **Seguridad**: Cambia `SESSION_SECRET` en producción por un valor seguro y único.
- **Logging**: `DB_LOGGING=false` desactiva los logs de SQL en consola. Ponlo en `true` para debug.
- **Backups**: Realiza backups regulares de la base de datos en producción.

## 🗄️ Base de Datos

El proyecto incluye un archivo SQL de referencia en `context/hospital_db.sql` con la estructura completa de la base de datos. Las tablas principales incluyen:

- `personas`, `pacientes`, `medicos`, `enfermeros`
- `internaciones`, `camas`, `habitaciones`, `sectores`
- `turnos`, `altas`, `planes_cuidado`
- `recetas`, `medicamentos`, `signos_vitales`
- `usuarios`, `roles`, `seguros_medicos`

## 📝 Documentación Adicional

El archivo `agents.md` en la raíz del proyecto contiene:
- Convenciones de código y nomenclatura
- Guías de desarrollo
- Información sobre la estructura de la base de datos
- Notas técnicas del proyecto

## 🐛 Solución de Problemas

**Error de conexión a MySQL:**
- Verifica que MySQL esté corriendo
- Comprueba las credenciales en `.env`
- Asegúrate de que la base de datos existe

**Los seeds no se ejecutan:**
- Verifica `RUN_SEEDS=true` en `.env`
- Revisa la consola por errores específicos
- Asegúrate de tener los archivos CSV en la carpeta `data/`

**Error de puerto en uso:**
- Cambia el `PORT` en `.env`
- O libera el puerto 3000: `npx kill-port 3000`

## 👨‍💻 Autor

**Santiago Subidia**
- GitHub: [@santi-subidia](https://github.com/santi-subidia)
- Repositorio: [HIS](https://github.com/santi-subidia/HIS)

## 📄 Licencia

ISC

---

**Proyecto desarrollado como Trabajo Práctico Integrador de Web 2**
