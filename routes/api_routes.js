const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api_controller');

router.get('/alas', apiController.mostrarAlas);
router.get('/habitaciones', apiController.mostrarHabitaciones);

router.get('/contactoEmergencia/:dni', apiController.buscarContactoEmergencia);
router.get('/paciente/:dni', apiController.buscarPaciente);

module.exports = router;

