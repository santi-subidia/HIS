const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacion_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

router.get('/', habitacionController.Index);

router.post('/marcar-disponible/:id', habitacionController.MarcarDisponible_POST);

module.exports = router;