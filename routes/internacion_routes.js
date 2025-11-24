const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacion_controller');
const { requireRole } = require('../middlewares/auth');

router.get('/', internacionController.Index);
router.post('/cambiar-prioridad/:id', internacionController.CambiarPrioridad_POST);

router.get('/completar-datos/:id', internacionController.CompletarDatos_GET);
router.post('/completar-datos/:id', internacionController.CompletarDatos_POST);

router.get('/create/emergencia', internacionController.Create_emergencia_GET);
router.post('/create/emergencia', internacionController.Create_emergencia_POST);

router.get('/create', internacionController.Create_GET);
router.post('/create/buscar', internacionController.buscarPacientePorDNI);
router.post('/create/:id', internacionController.Create_POST);

router.use(requireRole(['Medico', 'Enfermero']));

router.get('/details/:id', internacionController.Details_GET);

module.exports = router;