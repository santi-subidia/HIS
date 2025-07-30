const express = require('express');
const router = express.Router();
const {authenticateUser, logout} = require('../middleware/auth');
const { Rol } = require('../models');

// Rutas para la página de inicio
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  if(req.session.userId) {
    return res.redirect('/'); // Redirigir si ya está autenticado
  }
  res.render('login');
});

router.post('/login', authenticateUser, (req, res) => {
    return res.redirect('/');
});

router.get('/login/nuevo', async (req, res) => {
    const roles = await Rol.findAll();
  res.render('login',{registrar: true, roles});
});

router.get('/logout', logout);

module.exports = router;
