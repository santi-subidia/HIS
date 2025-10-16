const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turno_controller');

router.get('/', turnoController.Index);

router.get('/create', turnoController.Create_GET);
router.post('/create', turnoController.Create_POST);

module.exports = router;