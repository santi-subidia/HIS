const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turno_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

router.get('/', turnoController.Index);

router.get('/create', turnoController.Create_GET);
router.post('/create', turnoController.Create_POST);

router.get('/details/:id', turnoController.Details_GET);

router.post('/confirmar/:id', turnoController.Confirmar_POST);
router.post('/cancelar/:id', turnoController.Cancelar_POST);

module.exports = router;