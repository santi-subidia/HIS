const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacion_controller');

router.get('/', habitacionController.Index);

module.exports = router;