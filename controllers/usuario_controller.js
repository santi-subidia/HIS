const { Usuario, Persona, Rol, Medico, Enfermero, Paciente } = require('../models');
const { Op } = require('sequelize');
const { usuarioSchema } = require('../schemas/usuario_schema');

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
      const { DNI } = req.body;
      const roles = await Rol.findAll();

      // Validar DNI
      if (!DNI || !/^\d{7,9}$/.test(DNI)) {
        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: 'DNI inválido. Debe contener entre 7 y 9 dígitos',
          exito: null,
          paso: 'buscar',
          persona: null,
          valores: { DNI }
        });
      }

      // Buscar persona por DNI
      const persona = await Persona.findOne({
        where: { DNI: DNI },
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
          valores: { DNI }
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
          valores: { DNI }
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
        valores: { DNI }
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
      const roles = await Rol.findAll();

      // Validar con Zod
      const validacion = usuarioSchema.safeParse(req.body);

      if (!validacion.success) {
        // Extraer el primer error
        const primerError = validacion.error.errors[0];
        const mensajeError = primerError.message;

        // Buscar persona si existe DNI válido
        let persona = null;
        if (req.body.DNI && /^\d{7,9}$/.test(req.body.DNI)) {
          persona = await Persona.findOne({
            where: { DNI: req.body.DNI },
            include: [{
              model: Usuario,
              as: 'usuario'
            }]
          });
        }

        return res.render('usuarios/create', {
          title: 'Crear Usuario',
          roles,
          mensaje: mensajeError,
          exito: null,
          paso: persona ? 'crear_usuario' : (req.body.nombre ? 'crear_persona' : 'buscar'),
          persona,
          valores: req.body
        });
      }

      const { DNI, usuario, password, id_rol, nombre, apellido, telefono } = validacion.data;

      // Buscar o crear persona
      let persona = await Persona.findOne({
        where: { DNI: DNI },
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      });

      if (!persona) {
        // Crear la persona
        persona = await Persona.create({
          DNI: DNI,
          nombre: nombre,
          apellido: apellido,
          telefono: telefono
        });
      } else {
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
        where: { usuario: usuario }
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
      const rolSeleccionado = roles.find(r => r.id === id_rol);
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
        usuario: usuario,
        password: password,
        id_rol: id_rol
      });

      // Redirigir con éxito
      return res.redirect('/usuarios/gestionar?success=Usuario creado exitosamente');

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

      // Obtener usuarios dados de baja (soft deleted)
      const usuariosBaja = await Usuario.findAll({
        paranoid: false,
        where: {
          deletedAt: { [Op.ne]: null }
        },
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
        usuariosBaja,
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
  },

  // POST /usuarios/reincorporar/:id - Reincorporar un usuario dado de baja
  Reincorporar_POST: async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        paranoid: false,
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

      if (!usuario.deletedAt) {
        return res.status(400).send('Este usuario no está dado de baja');
      }

      // Reincorporar al usuario
      await usuario.restore();

      // Si es médico o enfermero, reincorporar también esos registros
      if (usuario.rol.nombre === 'Medico') {
        const medico = await Medico.findOne({ where: { id_persona: usuario.id_persona } });
        if (medico && medico.fecha_eliminacion !== null) {
          await medico.update({ fecha_eliminacion: null });
        }
      } else if (usuario.rol.nombre === 'Enfermero') {
        const enfermero = await Enfermero.findOne({ where: { id_persona: usuario.id_persona } });
        if (enfermero && enfermero.fecha_eliminacion !== null) {
          await enfermero.update({ fecha_eliminacion: null });
        }
      }

      res.redirect('/usuarios/gestionar?success=Usuario reincorporado exitosamente');

    } catch (error) {
      console.error('Error al reincorporar usuario:', error);
      res.status(500).send('Error al reincorporar el usuario');
    }
  }
};
