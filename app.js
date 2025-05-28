require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const path = require('path');
const app = express();
const { sequelize } = require('./models');

// Configuración de Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('index', { title: 'Bienvenido a mi aplicación' });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    await sequelize.sync({ alter: true });
    console.log('📦 Modelos sincronizados');

    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Error al conectar la base de datos:', error);
  }
});
