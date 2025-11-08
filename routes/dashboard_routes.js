const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard_controller');
const { requireAuth, requireRole } = require('../middlewares/auth');

// Dashboard Médico
router.get('/medico', requireAuth, requireRole(['Medico']), dashboardController.Medico_GET);

// Dashboard Enfermero
router.get('/enfermero', requireAuth, requireRole(['Enfermero']), dashboardController.Enfermero_GET);

// Dashboard Recepcionista
router.get('/recepcionista', requireAuth, requireRole(['Recepcionista']), dashboardController.Recepcionista_GET);

// Dashboard Admin
router.get('/admin', requireAuth, requireRole(['Admin']), dashboardController.Admin_GET);

module.exports = router;
