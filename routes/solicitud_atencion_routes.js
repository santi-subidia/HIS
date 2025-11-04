const express = require('express');
const router = express.Router();
const solicitudAtencionController = require('../controllers/solicitud_atencion_controller');

// Rutas para enfermeros
router.get('/crear/:id_internacion', solicitudAtencionController.Crear_GET);
router.post('/crear/:id_internacion', solicitudAtencionController.Crear_POST);

// Rutas para médicos
router.get('/pendientes', solicitudAtencionController.Pendientes_GET);
router.get('/atender/:id', solicitudAtencionController.Atender_GET);
router.post('/atender/:id', solicitudAtencionController.Atender_POST);

module.exports = router;
