const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacion_controller');
const { requireRole } = require('../middlewares/auth');

router.use(requireRole(['Recepcionista']));

router.get('/', habitacionController.Index);

router.post('/marcar-disponible/:id', habitacionController.MarcarDisponible_POST);

module.exports = router;