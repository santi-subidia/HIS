const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api_controller');

router.get('/alas', apiController.mostrarAlas);
router.get('/habitaciones', apiController.mostrarHabitaciones);

module.exports = router;

