const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente_controller');

router.get('/registro', pacienteController.mostrarFormularioRegistro);
router.post('/registro', pacienteController.registrarPaciente);

module.exports = router;
