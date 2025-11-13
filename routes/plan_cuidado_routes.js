const express = require('express');
const router = express.Router();
const planCuidadoController = require('../controllers/plan_cuidado_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

// Ver detalles de un plan de cuidado específico
router.get('/details/:id', planCuidadoController.Details_GET);

// Ver historial de planes de cuidado de una internación
router.get('/:id', planCuidadoController.Index_GET);

// Formulario para crear plan de cuidado
router.get('/crear/:id', planCuidadoController.Crear_GET);

// Crear plan de cuidado
router.post('/crear/:id', planCuidadoController.Crear_POST);

module.exports = router;
