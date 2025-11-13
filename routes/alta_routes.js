const express = require('express');
const router = express.Router();
const altaController = require('../controllers/alta_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

// Crear alta
router.get('/crear/:id', altaController.Crear_GET);
router.post('/crear', altaController.Crear_POST);

// Ver detalles del alta
router.get('/details/:id', altaController.Details_GET);

// Listado de altas
router.get('/listado', altaController.Listado_GET);

module.exports = router;
