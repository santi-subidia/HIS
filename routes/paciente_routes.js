const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente_controller');

router.get('/', pacienteController.index);

router.get('/registro', pacienteController.Create_GET);
router.post('/registro', pacienteController.Create_POST);

router.get('/actualizar', pacienteController.Update_GET);
router.get('/actualizar/:id', pacienteController.Update_GET);
router.post('/actualizar/:id', pacienteController.Update_POST);

module.exports = router;
