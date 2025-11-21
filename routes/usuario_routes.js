const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

// Middleware para verificar que sea Admin
const requireAdmin = (req, res, next) => {
  if (!req.session.usuario || req.session.usuario.rol !== 'Admin') {
    return res.status(403).send('Acceso denegado. Solo administradores pueden acceder a esta sección.');
  }
  next();
};

router.use(requireAdmin);

router.get('/create', usuarioController.Create_GET);
router.post('/buscar-persona', usuarioController.BuscarPersona_POST);
router.post('/create', usuarioController.Create_POST);

router.get('/gestionar', usuarioController.Gestionar_GET);
router.post('/dar-baja/:id', usuarioController.DarBaja_POST);
router.post('/reincorporar/:id', usuarioController.Reincorporar_POST);

module.exports = router;
