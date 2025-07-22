const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api_controller');

router.get('/alas', apiController.mostrarAlas);
router.get('/habitaciones', apiController.mostrarHabitaciones);

router.get('/persona/:dni', apiController.buscarPersona);
router.get('/contactoEmergencia/:dni', apiController.buscarContactoEmergencia);
router.get('/paciente/:id', apiController.buscarPaciente);

module.exports = router;

