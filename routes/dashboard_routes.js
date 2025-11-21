const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard_controller');
const { requireRole } = require('../middlewares/auth');

// Dashboard Médico
router.get('/medico', requireRole(['Medico']), dashboardController.Medico_GET);

// Dashboard Enfermero
router.get('/enfermero', requireRole(['Enfermero']), dashboardController.Enfermero_GET);

// Dashboard Recepcionista
router.get('/recepcionista', requireRole(['Recepcionista']), dashboardController.Recepcionista_GET);

// Dashboard Admin
router.get('/admin', requireRole(['Admin']), dashboardController.Admin_GET);

module.exports = router;
