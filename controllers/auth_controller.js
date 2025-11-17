const { Usuario, Rol, Persona, Medico, Enfermero, Paciente, PacienteSeguro, Internacion } = require('../models');

module.exports = {
  // GET /login - Mostrar formulario de login
  Login_GET: async (req, res) => {
    // Si ya está logueado, redirigir al dashboard
    if (req.session.usuario) {
      return res.redirect('/dashboard');
    }

    res.render('auth/login', {
      title: 'Iniciar Sesión',
      error: req.query.error
    });
  },

  // POST /login - Procesar login
  Login_POST: async (req, res) => {
    try {
      const { usuario, password } = req.body;

      // Validar que los campos no estén vacíos
      if (!usuario || !password) {
        return res.redirect('/login?error=complete-todos-los-campos');
      }

      // Buscar usuario con rol y persona
      const user = await Usuario.findOne({
        where: { usuario },
        include: [
          {
            model: Rol,
            as: 'rol'
          },
          {
            model: Persona,
            as: 'persona'
          }
        ]
      });

      if (!user) {
        return res.redirect('/login?error=credenciales-invalidas');
      }

      // Validar contraseña
      const passwordValida = await user.validarPassword(password);
      if (!passwordValida) {
        return res.redirect('/login?error=credenciales-invalidas');
      }

      // Verificar si el usuario (médico o enfermero) está internado
      const paciente = await Paciente.findOne({
        where: { id_persona: user.id_persona }
      });

      if (paciente) {
        // Buscar si tiene PacienteSeguro
        const pacienteSeguro = await PacienteSeguro.findOne({
          where: { id_paciente: paciente.id }
        });

        if (pacienteSeguro) {
          // Verificar si tiene internación activa
          const internacionActiva = await Internacion.findOne({
            where: { 
              id_paciente_seguro: pacienteSeguro.id,
              estado: 'activa'
            }
          });

          if (internacionActiva) {
            console.log(`Intento de login bloqueado: ${user.usuario} tiene una internación activa`);
            return res.redirect('/login?error=usuario-internado');
          }
        }
      }

      // Crear sesión básica
      req.session.usuario = {
        id: user.id,
        usuario: user.usuario,
        id_persona: user.id_persona,
        nombre_completo: `${user.persona.nombre} ${user.persona.apellido}`,
        rol: user.rol.nombre
      };

      // Buscar id específico según el rol
      if (user.rol.nombre === 'Medico') {
        const medico = await Medico.findOne({
          where: { id_persona: user.id_persona }
        });

        if (!medico) {
          return res.redirect('/login?error=usuario-sin-perfil-medico');
        }

        req.session.id_medico = medico.id;
      } 
      else if (user.rol.nombre === 'Enfermero') {
        const enfermero = await Enfermero.findOne({
          where: { id_persona: user.id_persona }
        });

        if (!enfermero) {
          return res.redirect('/login?error=usuario-sin-perfil-enfermero');
        }

        req.session.id_enfermero = enfermero.id;
      }

      console.log(`Usuario ${user.usuario} (${user.rol.nombre}) inició sesión`);
      
      // Redirigir al dashboard correspondiente
      res.redirect('/dashboard');

    } catch (error) {
      console.error('Error en login:', error);
      res.redirect('/login?error=error-del-servidor');
    }
  },

  // GET /logout - Cerrar sesión
  Logout_GET: async (req, res) => {
    const nombreUsuario = req.session.usuario?.usuario;
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.redirect('/dashboard');
      }
      
      console.log(`Usuario ${nombreUsuario} cerró sesión`);
      res.redirect('/login?error=sesion-cerrada');
    });
  },

  // GET /dashboard - Dashboard principal (redirige según rol)
  Dashboard_GET: async (req, res) => {
    if (!req.session.usuario) {
      return res.redirect('/login');
    }

    const rol = req.session.usuario.rol;

    // Redirigir según el rol
    switch(rol) {
      case 'Medico':
        return res.redirect('/dashboard/medico');
      case 'Enfermero':
        return res.redirect('/dashboard/enfermero');
      case 'Recepcionista':
        return res.redirect('/dashboard/recepcionista');
      case 'Admin':
        return res.redirect('/dashboard/admin');
      default:
        return res.redirect('/login?error=rol-no-valido');
    }
  }
};
