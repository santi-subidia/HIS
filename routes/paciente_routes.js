const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente_controller');

router.get('/', pacienteController.listarPacientes);

router.get('/registro', pacienteController.mostrarFormularioRegistro);
router.post('/registro', pacienteController.registrarPaciente);

router.get('/actualizar', pacienteController.mostrarFormularioActualizar);
router.post('/actualizar', pacienteController.buscarPacientePorDNI);
router.post('/actualizar/:id', pacienteController.actualizarPaciente);

module.exports = router;
