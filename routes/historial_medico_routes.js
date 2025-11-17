const express = require('express');
const router = express.Router();
const historialMedicoController = require('../controllers/historial_medico_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

router.get('/:id', historialMedicoController.Index);

router.post('/agregar-antecedente', historialMedicoController.AgregarAntecedente_POST);

router.post('/eliminar-antecedente/:id', historialMedicoController.EliminarAntecedente_POST);

// Ver detalle completo de una internación histórica
router.get('/:id_paciente/internacion/:id_internacion', historialMedicoController.VerInternacion_GET);

module.exports = router;
