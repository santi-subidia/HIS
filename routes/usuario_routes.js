const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario_controller');
const { requireRole } = require('../middlewares/auth');

// Solo administradores pueden acceder a estas rutas
router.use(requireRole(['Admin']));

router.get('/create', usuarioController.Create_GET);
router.post('/buscar-persona', usuarioController.BuscarPersona_POST);
router.post('/create', usuarioController.Create_POST);

router.get('/gestionar', usuarioController.Gestionar_GET);
router.post('/dar-baja/:id', usuarioController.DarBaja_POST);
router.post('/reincorporar/:id', usuarioController.Reincorporar_POST);

module.exports = router;
