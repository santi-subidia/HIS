const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacion_controller');

router.get('/', internacionController.listarInternaciones);

router.get('/registro', internacionController.mostrarFormularioRegistro);
router.post('/registro/buscar', internacionController.buscarPacientePorDNI);
router.post('/registro/:id', internacionController.crearInternacion);


router.get('/turnos', internacionController.mostrarTurnosInternacion);

router.get('/emergencias', internacionController.mostrarFormularioEmergencia);
router.post('/emergencias', internacionController.internarEmergencia);

module.exports = router;