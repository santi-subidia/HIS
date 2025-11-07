const express = require('express');
const router = express.Router();
const controller = require('../controllers/solicitud_medica_controller');

// Crear solicitud
router.get('/crear/:id', controller.Crear_GET);
router.post('/crear', controller.Crear_POST);

// Cargar resultado
router.get('/cargar-resultado/:id', controller.CargarResultado_GET);
router.post('/cargar-resultado/:id', controller.CargarResultado_POST);

// Historial de estudios
router.get('/historial/:id', controller.Historial_GET);

// Ver detalles
router.get('/details/:id', controller.Details_GET);

module.exports = router;
