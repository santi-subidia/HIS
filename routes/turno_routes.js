const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turno_controller');

router.post('/crear', turnoController.crearTurno);

router.get('/listar', turnoController.listarTurnos);
router.get('/registrar', turnoController.mostrarFormularioCrearTurno);

module.exports = router;