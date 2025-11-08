const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

// Login
router.get('/login', authController.Login_GET);
router.post('/login', authController.Login_POST);

// Logout
router.get('/logout', authController.Logout_GET);

// Dashboard principal (redirige según rol)
router.get('/dashboard', authController.Dashboard_GET);

module.exports = router;
