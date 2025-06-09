# Sistema HIS - Hospital Information System

Este proyecto es una aplicación web para la gestión hospitalaria: pacientes, internaciones, habitaciones y más.

## Requisitos

- Node.js (v16 o superior recomendado)
- MySQL (o la base de datos que configures en `.env`)
- npm

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tuusuario/HIS.git
   cd HIS
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido (ajusta según tu entorno):

   ```
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=nombre_base_de_datos
   DB_DIALECT=mysql
   PORT=3000
   SYNC_MODELS=true
   RUN_SEEDS=true
   ```

4. **Sincroniza los modelos y ejecuta los seeds:**

   La primera vez que ejecutes la app, asegúrate de que las variables `SYNC_MODELS` y `RUN_SEEDS` estén en `true` en tu `.env`.  
   Esto creará las tablas y cargará los datos iniciales automáticamente.

5. **Inicia la aplicación:**

   ```bash
   npm start
   ```

   O si usas nodemon para desarrollo:

   ```bash
   npx nodemon app.js
   ```

6. **Accede a la aplicación:**

   Abre tu navegador en [http://localhost:3000](http://localhost:3000)

---

## Notas importantes

- **¡Ejecuta la sincronización y los seeds solo la primera vez!**  
  Luego puedes poner `SYNC_MODELS=false` y `RUN_SEEDS=false` en tu `.env` para evitar sobrescribir datos.
- Si cambias los modelos o los seeds, puedes volver a ponerlos en `true` temporalmente.

---

## Estructura principal

- `/models` - Definición de modelos Sequelize
- `/controllers` - Lógica de negocio y endpoints
- `/routes` - Rutas Express
- `/views` - Vistas Pug
- `/seeds` - Seeds de datos iniciales

---

## Dependencias utilizadas

- **express**: Framework principal para crear el servidor web y manejar rutas HTTP.
- **sequelize**: ORM para interactuar con la base de datos de forma sencilla y segura.
- **mysql2**: Driver para conectar Sequelize con bases de datos MySQL/MariaDB.
- **dotenv**: Permite cargar variables de entorno desde un archivo `.env`.
- **pug**: Motor de plantillas para renderizar vistas HTML de forma dinámica.
- **zod**: Librería para validación y parsing de datos (usada en los schemas).
- **nodemon** (dev): Herramienta para desarrollo que reinicia el servidor automáticamente al detectar cambios en los archivos.

---

¡Gracias por usar el Sistema HIS!
