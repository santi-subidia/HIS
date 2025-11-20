const { Usuario, Persona, Rol, Medico, Enfermero, Paciente } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // GET /usuarios/create - Formulario para crear usuario (búsqueda por DNI)
  Create_GET: async (req, res) => {
    try {
      const roles = await Rol.findAll();

      res.render('usuarios/create', {
        title: 'Crear Usuario',
        roles,
        mensaje: null,
        exito: null,
        paso: 'buscar', // buscar | crear_persona | crear_usuario
        persona: null,
        valores: {}
      });

    } catch (error) {
      console.error('Error al cargar formulario de usuario:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /usuarios/buscar-persona - Buscar persona por DNI
  BuscarPersona_POST: async (req, res) => {
    try {
      const { dni } = req.body;
      const roles = await Rol.findAll();

      // Validar DNI
      if (!dni || !/^\d{7,9}$/.test(dni)) {
        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: 'DNI inválido. Debe contener entre 7 y 9 dígitos',
          exito: null,
          paso: 'buscar',
          persona: null,
          valores: { dni }
        });
      }

      // Buscar persona por DNI
      const persona = await Persona.findOne({
        where: { DNI: dni },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            include: [{
              model: Rol,
              as: 'rol'
            }]
          }
        ]
      });

      if (!persona) {
        // Persona no existe, mostrar formulario para crearla
        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: null,
          exito: null,
          paso: 'crear_persona',
          persona: null,
          valores: { dni }
        });
      }

      // Verificar si ya tiene usuario
      if (persona.usuario) {
        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: `Esta persona ya tiene un usuario: ${persona.usuario.usuario} (${persona.usuario.rol.nombre})`,
          exito: null,
          paso: 'buscar',
          persona: null,
          valores: { dni }
        });
      }

      // Verificar roles existentes de la persona
      const medico = await Medico.findOne({ where: { id_persona: persona.id } });
      const enfermero = await Enfermero.findOne({ where: { id_persona: persona.id } });
      const paciente = await Paciente.findOne({ where: { id_persona: persona.id } });

      // Determinar roles compatibles según las reglas
      let rolesCompatibles = [];
      let roleActual = null;

      if (medico && !medico.fecha_eliminacion) {
        roleActual = 'Medico';
        rolesCompatibles = ['Admin', 'Medico']; // Médico solo puede ser Admin o mantener Médico
      } else if (enfermero && !enfermero.fecha_eliminacion) {
        roleActual = 'Enfermero';
        rolesCompatibles = ['Admin', 'Enfermero']; // Enfermero solo puede ser Admin o mantener Enfermero
      } else if (paciente) {
        roleActual = 'Paciente';
        rolesCompatibles = []; // Pacientes no pueden ser usuarios del sistema
      } else {
        // Sin rol definido, puede ser cualquiera excepto paciente
        rolesCompatibles = ['Admin', 'Recepcionista', 'Medico', 'Enfermero'];
      }

      if (rolesCompatibles.length === 0) {
        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: 'Los pacientes no pueden tener usuarios en el sistema',
          exito: null,
          paso: 'buscar',
          persona: null,
          valores: { dni }
        });
      }

      // Filtrar roles disponibles según compatibilidad
      const rolesDisponibles = roles.filter(rol => rolesCompatibles.includes(rol.nombre));

      // Persona existe, mostrar formulario para crear usuario
      return res.render('usuarios/create', {
        title: 'Crear Usuario',
        roles: rolesDisponibles,
        mensaje: null,
        exito: null,
        paso: 'crear_usuario',
        persona,
        roleActual,
        valores: { dni }
      });

    } catch (error) {
      console.error('Error al buscar persona:', error);
      const roles = await Rol.findAll();
      res.render('usuarios/create', {
        title: 'Crear Usuario',
        roles,
        mensaje: 'Error al buscar la persona',
        exito: null,
        paso: 'buscar',
        persona: null,
        valores: req.body
      });
    }
  },

  // POST /usuarios/create - Crear usuario
  Create_POST: async (req, res) => {
    try {
      const { dni, usuario, password, password_confirm, id_rol, nombre, apellido, telefono } = req.body;
      const roles = await Rol.findAll();

      // Validaciones básicas
      const errores = [];

      if (!dni || !/^\d{7,9}$/.test(dni)) errores.push('DNI inválido');
      if (!usuario || usuario.trim().length < 3) errores.push('El nombre de usuario debe tener al menos 3 caracteres');
      if (!password || password.length < 6) errores.push('La contraseña debe tener al menos 6 caracteres');
      if (password !== password_confirm) errores.push('Las contraseñas no coinciden');
      if (!id_rol) errores.push('Debe seleccionar un rol');

      // Buscar o crear persona
      let persona = await Persona.findOne({
        where: { DNI: dni },
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      });

      // Si no existe la persona, crearla (requiere datos adicionales)
      if (!persona) {
        if (!nombre || !apellido) {
          errores.push('Debe proporcionar nombre y apellido para crear la persona');
        }

        if (errores.length > 0) {
          return res.render('usuarios/create', {
            title: 'Crear Usuario',
            roles,
            mensaje: errores.join('. '),
            exito: null,
            paso: 'crear_persona',
            persona: null,
            valores: req.body
          });
        }

        // Crear la persona
        persona = await Persona.create({
          DNI: dni,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: telefono ? telefono.trim() : null
        });
      } else {
        // Si la persona existe pero tiene errores de validación
        if (errores.length > 0) {
          const rolesDisponibles = roles;
          return res.render('usuarios/create', {
            title: 'Crear Usuario',
            roles: rolesDisponibles,
            mensaje: errores.join('. '),
            exito: null,
            paso: 'crear_usuario',
            persona,
            valores: req.body
          });
        }

        // Verificar que no tenga usuario ya
        if (persona.usuario) {
          return res.render('usuarios/create', {
            title: 'Crear Usuario',
            roles,
            mensaje: 'Esta persona ya tiene un usuario asignado',
            exito: null,
            paso: 'buscar',
            persona: null,
            valores: req.body
          });
        }
      }

      // Verificar que el nombre de usuario no exista
      const usuarioExistente = await Usuario.findOne({
        where: { usuario: usuario.trim() }
      });

      if (usuarioExistente) {
        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: 'El nombre de usuario ya está en uso',
          exito: null,
          paso: persona ? 'crear_usuario' : 'crear_persona',
          persona,
          valores: req.body
        });
      }

      // Verificar compatibilidad de roles
      const rolSeleccionado = roles.find(r => r.id === parseInt(id_rol));
      const medico = await Medico.findOne({ where: { id_persona: persona.id } });
      const enfermero = await Enfermero.findOne({ where: { id_persona: persona.id } });

      // Validar reglas de compatibilidad
      if (medico && !medico.fecha_eliminacion) {
        // Es médico: solo puede ser Admin o Medico
        if (!['Admin', 'Medico'].includes(rolSeleccionado.nombre)) {
          return res.render('usuarios/create', {
            title: 'Crear Usuario',
            roles: roles.filter(r => ['Admin', 'Medico'].includes(r.nombre)),
            mensaje: 'Un médico solo puede tener rol de Admin o Medico',
            exito: null,
            paso: 'crear_usuario',
            persona,
            valores: req.body
          });
        }
      } else if (enfermero && !enfermero.fecha_eliminacion) {
        // Es enfermero: solo puede ser Admin o Enfermero
        if (!['Admin', 'Enfermero'].includes(rolSeleccionado.nombre)) {
          return res.render('usuarios/create', {
            title: 'Crear Usuario',
            roles: roles.filter(r => ['Admin', 'Enfermero'].includes(r.nombre)),
            mensaje: 'Un enfermero solo puede tener rol de Admin o Enfermero',
            exito: null,
            paso: 'crear_usuario',
            persona,
            valores: req.body
          });
        }
      }

      // Si se selecciona rol Medico, crear registro de médico si no existe
      if (rolSeleccionado.nombre === 'Medico' && !medico) {
        // Necesitamos especialidad para crear médico
        // Por ahora, asignamos una especialidad por defecto o requerimos ese dato
        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: 'Para crear un usuario Médico, primero debe registrarse como médico con su especialidad en el sistema',
          exito: null,
          paso: 'crear_usuario',
          persona,
          valores: req.body
        });
      }

      // Si se selecciona rol Enfermero, crear registro de enfermero si no existe
      if (rolSeleccionado.nombre === 'Enfermero' && !enfermero) {
        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: 'Para crear un usuario Enfermero, primero debe registrarse como enfermero en el sistema',
          exito: null,
          paso: 'crear_usuario',
          persona,
          valores: req.body
        });
      }

      // Crear el usuario
      await Usuario.create({
        id_persona: persona.id,
        usuario: usuario.trim(),
        password: password,
        id_rol: parseInt(id_rol)
      });

      // Redirigir con éxito
      return res.redirect('/usuarios/create?exito=Usuario creado exitosamente');

    } catch (error) {
      console.error('Error al crear usuario:', error);
      const roles = await Rol.findAll();
      res.render('usuarios/create', {
        title: 'Crear Usuario',
        roles,
        mensaje: 'Error al crear el usuario: ' + error.message,
        exito: null,
        paso: 'buscar',
        persona: null,
        valores: req.body
      });
    }
  },

  // GET /usuarios/gestionar - Listado de usuarios para dar de baja
  Gestionar_GET: async (req, res) => {
    try {
      // Filtros
      const nombre = req.query.nombre ? req.query.nombre.trim() : undefined;
      const dni = req.query.dni ? req.query.dni.trim() : undefined;
      const rol = req.query.rol ? req.query.rol : undefined;

      // Construir filtros
      const wherePersona = {};
      const whereRol = {};

      if (nombre) {
        wherePersona[Op.or] = [
          { nombre: { [Op.like]: `%${nombre}%` } },
          { apellido: { [Op.like]: `%${nombre}%` } }
        ];
      }

      if (dni) {
        wherePersona.DNI = dni;
      }

      if (rol) {
        whereRol.id = parseInt(rol);
      }

      // Obtener usuarios activos
      const usuarios = await Usuario.findAll({
        include: [
          {
            model: Persona,
            as: 'persona',
            where: Object.keys(wherePersona).length ? wherePersona : undefined,
            required: true
          },
          {
            model: Rol,
            as: 'rol',
            where: Object.keys(whereRol).length ? whereRol : undefined
          }
        ],
        order: [[{ model: Persona, as: 'persona' }, 'apellido', 'ASC']]
      });

      // Obtener todos los roles para el filtro
      const roles = await Rol.findAll();

      res.render('usuarios/gestionar', {
        title: 'Gestionar Usuarios',
        usuarios,
        roles,
        filters: req.query,
        mensaje: null,
        success: req.query.success || null
      });

    } catch (error) {
      console.error('Error al listar usuarios:', error);
      res.status(500).send('Error al cargar los usuarios');
    }
  },

  // POST /usuarios/dar-baja/:id - Dar de baja un usuario (eliminación lógica)
  DarBaja_POST: async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        include: [
          {
            model: Persona,
            as: 'persona'
          },
          {
            model: Rol,
            as: 'rol'
          }
        ]
      });

      if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
      }

      // Verificar si es Admin (no permitir dar de baja al último admin)
      if (usuario.rol.nombre === 'Admin') {
        const totalAdmins = await Usuario.count({
          include: [
            {
              model: Persona,
              as: 'persona',
              required: true
            },
            {
              model: Rol,
              as: 'rol',
              where: { nombre: 'Admin' },
              required: true
            }
          ]
        });

        if (totalAdmins <= 1) {
          return res.status(400).send('No se puede dar de baja al único administrador del sistema');
        }
      }

      // Dar de baja al usuario (eliminación del registro)
      await usuario.destroy();

      // Si es médico o enfermero, dar de baja también esos registros
      if (usuario.rol.nombre === 'Medico') {
        const medico = await Medico.findOne({ where: { id_persona: usuario.id_persona } });
        if (medico && medico.fecha_eliminacion === null) {
          await medico.update({ fecha_eliminacion: new Date() });
        }
      } else if (usuario.rol.nombre === 'Enfermero') {
        const enfermero = await Enfermero.findOne({ where: { id_persona: usuario.id_persona } });
        if (enfermero && enfermero.fecha_eliminacion === null) {
          await enfermero.update({ fecha_eliminacion: new Date() });
        }
      }

      res.redirect('/usuarios/gestionar?success=Usuario dado de baja exitosamente');

    } catch (error) {
      console.error('Error al dar de baja usuario:', error);
      res.status(500).send('Error al dar de baja el usuario');
    }
  }
};
