const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/receta_controller');
const { requireRole } = require('../middlewares/auth');

router.use(requireRole(['Medico', 'Enfermero']));


// Formulario para crear receta
router.get('/crear', recetaController.Crear_GET);
// Crear receta
router.post('/crear', recetaController.Crear_POST);

// Ver todas las recetas de un historial médico
router.get('/:id_historial', recetaController.Index_GET);


module.exports = router;
