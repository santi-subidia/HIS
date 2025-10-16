require('dotenv').config(); // Carga variables de entorno desde .env

const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// Configuración de Express
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas principales
app.get('/', (req, res) => res.render('index'));
app.use('/paciente', require('./routes/paciente_routes'));
app.use('/internacion', require('./routes/internacion_routes'));
app.use('/turno', require('./routes/turno_routes'));
app.use('/habitacion', require('./routes/habitacion_routes'));
app.use('/api', require('./routes/api_routes'));

const PORT = process.env.PORT || 3000;

// Inicio del servidor y sincronización/seeds si corresponde
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    if (process.env.SYNC_MODELS === 'true') {
      await sequelize.sync({ alter: true });
      console.log('📦 Modelos sincronizados');
    }

    if (process.env.RUN_SEEDS === 'true') {
      require('./runSeeds');
    }

    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Error al conectar la base de datos:', error);
  }
});
