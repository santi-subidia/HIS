const { Usuario, Rol, Empleado, Persona } = require('../models');

// Middleware para verificar si el usuario está autenticado
const requireAuth = async (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// Middleware para verificar credenciales de login
const authenticateUser = async (req, res, next) => {
  try {
    const { user, password } = req.body;

    // Validar que se proporcionaron credenciales
    if (!user || !password) {
      return res.render('login', { 
        error: 'Usuario y contraseña son requeridos' 
      });
    }

    // Buscar usuario por nombre de usuario
    const usuario = await Usuario.findOne({ 
        where: { usuario: user },
        include: [{ model: Rol, as: 'rol' }]
    });

    
    if (!usuario) {
      return res.render('login', { 
        error: 'Usuario o contraseña incorrectos' 
      });
    }
    
    // Verificar contraseña
    const passwordValida = await usuario.validarPassword(password);
    
    if (!passwordValida) {
      return res.render('login', { 
        error: 'DNI o contraseña incorrectos' 
      });
    }

    // Buscar empleado asociado al usuario
    const empleado = await Empleado.findOne({
        where: { id_usuario: usuario.id }
    });
    
    // Login exitoso - guardar información en la sesión
    req.session.empleadoId = empleado.id;

    // Continuar al siguiente middleware o ruta
    next();

  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.render('login', { 
      error: 'Error interno del servidor' 
    });
  }
};

// Middleware para obtener información del usuario actual
const getCurrentUser = async (req, res, next) => {
  if (req.session.empleadoId) {
    try {
      const empleado = await Empleado.findByPk(req.session.empleadoId, {
        include: [
          { model: Persona, as: 'persona' },
          { model: Usuario, as: 'usuario', include: [{ model: Rol, as: 'rol' }] }
        ]
      });
      req.currentUser = empleado;
      res.locals.currentUser = empleado;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
    }
  }
  next();
};

// Middleware para verificar si el usuario es médico
const requireMedico = (req, res, next) => {
  if (!req.session.userId || req.session.rol !== 'medico') {
    return res.status(403).send('Acceso denegado');
  }
  next();
};

// Middleware para verificar si el usuario es enfermero
const requireEnfermero = (req, res, next) => {
  if (!req.session.userId || req.session.rol !== 'enfermero') {
    return res.status(403).send('Acceso denegado');
  }
  next();
};

// Middleware para verificar si el usuario es admisión
const requireAdmision = (req, res, next) => {
  if (!req.session.userId || req.session.rol !== 'admision') {
    return res.status(403).send('Acceso denegado');
  }
  next();
};

// Función para logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid'); // Nombre por defecto de la cookie de sesión
    res.redirect('/login');
  });
};

module.exports = {
  requireAuth,
  authenticateUser,
  getCurrentUser,
  logout,
  requireMedico,
  requireEnfermero,
  requireAdmision
};
