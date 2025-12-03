const express = require('express');
const router = express.Router();
const enfermeroController = require('../controllers/enfermero_controller');
const { requireAuth, requireRole } = require('../middlewares/auth');

// Todas las rutas requieren autenticación y rol Admin
router.use(requireAuth);
router.use(requireRole(['Admin']));

// GET /enfermeros - Listar enfermeros
router.get('/', enfermeroController.Index_GET);

// GET /enfermeros/create - Formulario crear enfermero
router.get('/create', enfermeroController.Create_GET);

// POST /enfermeros/buscar-persona - Buscar persona por DNI
router.post('/buscar-persona', enfermeroController.BuscarPersona_POST);

// POST /enfermeros/create - Crear enfermero
router.post('/create', enfermeroController.Create_POST);

// GET /enfermeros/edit/:id - Formulario editar enfermero
router.get('/edit/:id', enfermeroController.Edit_GET);

// POST /enfermeros/edit/:id - Actualizar enfermero
router.post('/edit/:id', enfermeroController.Edit_POST);

module.exports = router;
