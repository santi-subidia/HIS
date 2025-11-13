const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente_controller');
const { requireAuth } = require('../middlewares/auth');

// Proteger todas las rutas con autenticación
router.use(requireAuth);

router.get('/', pacienteController.index);

router.get('/create', pacienteController.Create_GET);
router.post('/create', pacienteController.Create_POST);

router.get('/update/:id', pacienteController.Update_GET);
router.post('/update/:id', pacienteController.Update_POST);

router.get('/delete/:id', pacienteController.Delete_GET);
router.post('/delete/:id', pacienteController.Delete_POST);

module.exports = router;
