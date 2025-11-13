const express = require('express');
const router = express.Router();
const signosVitalesController = require('../controllers/signos_vitales_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

// Ruta para ver el historial de signos vitales de una internación
router.get('/:id', signosVitalesController.Index_GET);

// Ruta para mostrar el formulario de registro de signos vitales
router.get('/registrar/:id', signosVitalesController.Registrar_GET);

// Ruta para procesar el registro de signos vitales
router.post('/registrar/:id', signosVitalesController.Registrar_POST);

module.exports = router;
