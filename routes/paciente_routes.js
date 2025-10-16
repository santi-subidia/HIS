const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente_controller');

router.get('/', pacienteController.index);

router.get('/create', pacienteController.Create_GET);
router.post('/create', pacienteController.Create_POST);

router.get('/update/:id', pacienteController.Update_GET);
router.post('/update/:id', pacienteController.Update_POST);

module.exports = router;
