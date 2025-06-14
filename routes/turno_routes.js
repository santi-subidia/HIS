const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turno_controller');

router.get('/listar', turnoController.listarTurnos);
router.get('/registrar', turnoController.mostrarFormularioCrearTurno);
router.post('/crear', turnoController.crearTurno);

module.exports = router;