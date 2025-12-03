const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medico_controller');
const { requireAuth, requireRole } = require('../middlewares/auth');

// Todas las rutas requieren autenticación y rol Admin
router.use(requireAuth);
router.use(requireRole(['Admin']));

// GET /medicos - Listar médicos
router.get('/', medicoController.Index_GET);

// GET /medicos/create - Formulario crear médico
router.get('/create', medicoController.Create_GET);

// POST /medicos/buscar-persona - Buscar persona por DNI
router.post('/buscar-persona', medicoController.BuscarPersona_POST);

// POST /medicos/create - Crear médico
router.post('/create', medicoController.Create_POST);

// POST /medicos/dar-baja/:id - Dar de baja médico
router.post('/dar-baja/:id', medicoController.DarBaja_POST);

module.exports = router;
