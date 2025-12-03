const { Medico, Persona, Especialidad, Usuario, Rol } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // GET /medicos - Listar médicos
  Index_GET: async (req, res) => {
    try {
      const { nombre, dni, especialidad } = req.query;

      // Construir filtros
      const wherePersona = {};
      const whereEspecialidad = {};

      if (nombre) {
        wherePersona[Op.or] = [
          { nombre: { [Op.like]: `%${nombre}%` } },
          { apellido: { [Op.like]: `%${nombre}%` } }
        ];
      }

      if (dni) {
        wherePersona.DNI = { [Op.like]: `%${dni}%` };
      }

      if (especialidad) {
        whereEspecialidad.id = especialidad;
      }

      // Obtener médicos activos
      const medicos = await Medico.findAll({
        where: { fecha_eliminacion: null },
        include: [
          {
            model: Persona,
            as: 'persona',
            where: Object.keys(wherePersona).length ? wherePersona : undefined,
            required: true
          },
          {
            model: Especialidad,
            as: 'especialidad',
            where: Object.keys(whereEspecialidad).length ? whereEspecialidad : undefined
          }
        ],
        order: [[{ model: Persona, as: 'persona' }, 'apellido', 'ASC']]
      });

      // Obtener especialidades para el filtro
      const especialidades = await Especialidad.findAll({
        order: [['nombre', 'ASC']]
      });

      res.render('medicos/index', {
        title: 'Gestión de Médicos',
        medicos,
        especialidades,
        filters: req.query,
        success: req.query.success || null
      });

    } catch (error) {
      console.error('Error al listar médicos:', error);
      res.status(500).send('Error al cargar los médicos');
    }
  },

  // GET /medicos/create - Formulario para crear médico
  Create_GET: async (req, res) => {
    try {
      const especialidades = await Especialidad.findAll({
        order: [['nombre', 'ASC']]
      });

      res.render('medicos/create', {
        title: 'Registrar Médico',
        especialidades,
        mensaje: null,
        paso: 'buscar',
        persona: null,
        valores: {}
      });

    } catch (error) {
      console.error('Error al cargar formulario de médico:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /medicos/buscar-persona - Buscar persona por DNI
  BuscarPersona_POST: async (req, res) => {
    try {
      const { DNI } = req.body;
      const especialidades = await Especialidad.findAll({ order: [['nombre', 'ASC']] });

      // Validar DNI
      if (!DNI || !/^\d{7,9}$/.test(DNI)) {
        return res.render('medicos/create', {
          title: 'Registrar Médico',
          especialidades,
          mensaje: 'DNI inválido. Debe contener entre 7 y 9 dígitos',
          paso: 'buscar',
          persona: null,
          valores: { DNI }
        });
      }

      // Buscar persona por DNI
      const persona = await Persona.findOne({
        where: { DNI: DNI }
      });

      if (!persona) {
        // Persona no existe, mostrar formulario para crearla
        return res.render('medicos/create', {
          title: 'Registrar Médico',
          especialidades,
          mensaje: null,
          paso: 'crear_persona',
          persona: null,
          valores: { DNI }
        });
      }

      // Verificar si ya es médico
      const medicoExistente = await Medico.findOne({
        where: { 
          id_persona: persona.id,
          fecha_eliminacion: null
        }
      });

      if (medicoExistente) {
        return res.render('medicos/create', {
          title: 'Registrar Médico',
          especialidades,
          mensaje: `Esta persona ya está registrada como médico`,
          paso: 'buscar',
          persona: null,
          valores: { DNI }
        });
      }

      // Persona existe, mostrar formulario para registrar como médico
      return res.render('medicos/create', {
        title: 'Registrar Médico',
        especialidades,
        mensaje: null,
        paso: 'crear_medico',
        persona,
        valores: { DNI }
      });

    } catch (error) {
      console.error('Error al buscar persona:', error);
      const especialidades = await Especialidad.findAll();
      res.render('medicos/create', {
        title: 'Registrar Médico',
        especialidades,
        mensaje: 'Error al buscar la persona',
        paso: 'buscar',
        persona: null,
        valores: req.body
      });
    }
  },

  // POST /medicos/create - Crear médico
  Create_POST: async (req, res) => {
    try {
      const { DNI, id_especialidad, nombre, apellido, telefono } = req.body;
      const especialidades = await Especialidad.findAll({ order: [['nombre', 'ASC']] });

      // Validar especialidad
      if (!id_especialidad || parseInt(id_especialidad) <= 0) {
        return res.render('medicos/create', {
          title: 'Registrar Médico',
          especialidades,
          mensaje: 'Debe seleccionar una especialidad',
          paso: nombre ? 'crear_persona' : 'crear_medico',
          persona: null,
          valores: req.body
        });
      }

      // Buscar o crear persona
      let persona = await Persona.findOne({ where: { DNI: DNI } });

      if (!persona) {
        // Validar datos de persona
        if (!nombre || !apellido) {
          return res.render('medicos/create', {
            title: 'Registrar Médico',
            especialidades,
            mensaje: 'Debe proporcionar nombre y apellido',
            paso: 'crear_persona',
            persona: null,
            valores: req.body
          });
        }

        // Crear la persona
        persona = await Persona.create({
          DNI: DNI,
          nombre: nombre,
          apellido: apellido,
          telefono: telefono || null
        });
      }

      // Verificar que no sea médico ya
      const medicoExistente = await Medico.findOne({
        where: { 
          id_persona: persona.id,
          fecha_eliminacion: null
        }
      });

      if (medicoExistente) {
        return res.render('medicos/create', {
          title: 'Registrar Médico',
          especialidades,
          mensaje: 'Esta persona ya está registrada como médico',
          paso: 'buscar',
          persona: null,
          valores: req.body
        });
      }

      // Crear el médico
      await Medico.create({
        id_persona: persona.id,
        id_especialidad: parseInt(id_especialidad),
        fecha_eliminacion: null
      });

      // Si la persona tiene usuario con rol Medico, no hacer nada adicional
      // Si no tiene usuario, se podrá crear después desde gestión de usuarios

      return res.redirect('/medicos?success=Médico registrado exitosamente');

    } catch (error) {
      console.error('Error al crear médico:', error);
      const especialidades = await Especialidad.findAll();
      res.render('medicos/create', {
        title: 'Registrar Médico',
        especialidades,
        mensaje: 'Error al registrar el médico: ' + error.message,
        paso: 'buscar',
        persona: null,
        valores: req.body
      });
    }
  },

  // POST /medicos/dar-baja/:id - Dar de baja un médico
  DarBaja_POST: async (req, res) => {
    try {
      const { id } = req.params;

      const medico = await Medico.findByPk(id, {
        include: [{ model: Persona, as: 'persona' }]
      });

      if (!medico || medico.fecha_eliminacion) {
        return res.status(404).send('Médico no encontrado o ya dado de baja');
      }

      // Dar de baja al médico
      await medico.update({ fecha_eliminacion: new Date() });

      // Si tiene usuario con rol Medico, darlo de baja también
      const usuario = await Usuario.findOne({
        where: { id_persona: medico.id_persona },
        include: [{ model: Rol, as: 'rol' }]
      });

      if (usuario && usuario.rol.nombre === 'Medico') {
        await usuario.destroy();
      }

      res.redirect('/medicos?success=Médico dado de baja exitosamente');

    } catch (error) {
      console.error('Error al dar de baja médico:', error);
      res.status(500).send('Error al dar de baja el médico');
    }
  }
};
