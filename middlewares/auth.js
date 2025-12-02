/**
 * Middleware para verificar que el usuario esté autenticado
 */
const requireAuth = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/login?error=debes-iniciar-sesion');
  }
  next();
};

/**
 * Middleware para verificar roles específicos
 * @param {Array} rolesPermitidos - Array de roles permitidos
 */
const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.session.usuario) {
      return res.redirect('/login?error=debes-iniciar-sesion');
    }

    const rolUsuario = req.session.usuario.rol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).render('error403', {
        usuario: req.session.usuario,
        rolesPermitidos
      });
    }

    next();
  };
};

/**
 * Middleware para pasar datos del usuario a las vistas
 */
const userLocals = (req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.isAuthenticated = !!req.session.usuario;
  next();
};

module.exports = {
  requireAuth,
  requireRole,
  userLocals
};
