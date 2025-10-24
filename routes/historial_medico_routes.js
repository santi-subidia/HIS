const express = require('express');
const router = express.Router();
const historialMedicoController = require('../controllers/historial_medico_controller');

router.get('/:id', historialMedicoController.Index);

router.post('/agregar-antecedente', historialMedicoController.AgregarAntecedente_POST);

router.post('/eliminar-antecedente/:id', historialMedicoController.EliminarAntecedente_POST);

module.exports = router;
