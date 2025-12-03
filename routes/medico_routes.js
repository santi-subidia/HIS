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

// GET /medicos/edit/:id - Formulario editar médico
router.get('/edit/:id', medicoController.Edit_GET);

// POST /medicos/edit/:id - Actualizar médico
router.post('/edit/:id', medicoController.Edit_POST);

module.exports = router;
