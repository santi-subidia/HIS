const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacion_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

router.get('/', internacionController.Index);

router.get('/details/:id', internacionController.Details_GET);

router.post('/cambiar-prioridad/:id', internacionController.CambiarPrioridad_POST);

router.get('/create/emergencia', internacionController.Create_emergencia_GET);
router.post('/create/emergencia', internacionController.Create_emergencia_POST);

router.get('/create', internacionController.Create_GET);
router.post('/create/buscar', internacionController.buscarPacientePorDNI);
router.post('/create/:id', internacionController.Create_POST);

module.exports = router;