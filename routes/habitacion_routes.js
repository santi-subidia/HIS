const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacion_controller');

router.get('/listar', habitacionController.listarHabitaciones);

module.exports = router;