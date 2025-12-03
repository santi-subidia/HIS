const { Enfermero, Persona, Usuario, Rol } = require('../models');
const { personaSchema } = require('../schemas/persona_schema');
const { Op } = require('sequelize');

module.exports = {
  // GET /enfermeros - Listar enfermeros
  Index_GET: async (req, res) => {
    try {
      const { nombre, dni } = req.query;

      // Construir filtros
      const wherePersona = {};

      if (nombre) {
        wherePersona[Op.or] = [
          { nombre: { [Op.like]: `%${nombre}%` } },
          { apellido: { [Op.like]: `%${nombre}%` } }
        ];
      }

      if (dni) {
        wherePersona.DNI = { [Op.like]: `%${dni}%` };
      }

      // Obtener enfermeros activos
      const enfermeros = await Enfermero.findAll({
        where: { fecha_eliminacion: null },
        include: [
          {
            model: Persona,
            as: 'persona',
            where: Object.keys(wherePersona).length ? wherePersona : undefined,
            required: true
          }
        ],
        order: [[{ model: Persona, as: 'persona' }, 'apellido', 'ASC']]
      });

      res.render('enfermeros/index', {
        title: 'Gestión de Enfermeros',
        enfermeros,
        filters: req.query,
        success: req.query.success || null
      });

    } catch (error) {
      console.error('Error al listar enfermeros:', error);
      res.status(500).send('Error al cargar los enfermeros');
    }
  },

  // GET /enfermeros/create - Formulario para crear enfermero
  Create_GET: async (req, res) => {
    try {
      res.render('enfermeros/create', {
        title: 'Registrar Enfermero',
        mensaje: null,
        paso: 'buscar',
        persona: null,
        valores: {}
      });

    } catch (error) {
      console.error('Error al cargar formulario de enfermero:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /enfermeros/buscar-persona - Buscar persona por DNI
  BuscarPersona_POST: async (req, res) => {
    try {
      const { DNI } = req.body;

      // Validar DNI con Zod
      const validacion = personaSchema.pick({ DNI: true }).safeParse({ DNI });

      if (!validacion.success) {
        const primerError = validacion.error.errors[0];
        return res.render('enfermeros/create', {
          title: 'Registrar Enfermero',
          mensaje: primerError.message,
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
        return res.render('enfermeros/create', {
          title: 'Registrar Enfermero',
          mensaje: null,
          paso: 'crear_persona',
          persona: null,
          valores: { DNI }
        });
      }

      // Verificar si ya es enfermero
      const enfermeroExistente = await Enfermero.findOne({
        where: { 
          id_persona: persona.id,
          fecha_eliminacion: null
        }
      });

      if (enfermeroExistente) {
        return res.render('enfermeros/create', {
          title: 'Registrar Enfermero',
          mensaje: `Esta persona ya está registrada como enfermero`,
          paso: 'buscar',
          persona: null,
          valores: { DNI }
        });
      }

      // Persona existe, mostrar formulario para registrar como enfermero
      return res.render('enfermeros/create', {
        title: 'Registrar Enfermero',
        mensaje: null,
        paso: 'crear_enfermero',
        persona,
        valores: { DNI }
      });

    } catch (error) {
      console.error('Error al buscar persona:', error);
      res.render('enfermeros/create', {
        title: 'Registrar Enfermero',
        mensaje: 'Error al buscar la persona',
        paso: 'buscar',
        persona: null,
        valores: req.body
      });
    }
  },

  // POST /enfermeros/create - Crear enfermero
  Create_POST: async (req, res) => {
    try {
      const { DNI, nombre, apellido, telefono } = req.body;

      // Buscar o crear persona
      let persona = await Persona.findOne({ where: { DNI: DNI } });

      if (!persona) {
        // Validar datos de persona con Zod
        const validacion = personaSchema.safeParse({ 
          DNI, 
          nombre, 
          apellido, 
          telefono: telefono || '' 
        });

        if (!validacion.success) {
          // Extraer el primer error
          const primerError = validacion.error.errors[0];
          const mensajeError = primerError.message;

          return res.render('enfermeros/create', {
            title: 'Registrar Enfermero',
            mensaje: mensajeError,
            paso: 'crear_persona',
            persona: null,
            valores: req.body
          });
        }

        // Crear la persona con datos validados
        persona = await Persona.create({
          DNI: validacion.data.DNI,
          nombre: validacion.data.nombre,
          apellido: validacion.data.apellido,
          telefono: validacion.data.telefono || null
        });
      }

      // Verificar que no sea enfermero ya
      const enfermeroExistente = await Enfermero.findOne({
        where: { 
          id_persona: persona.id,
          fecha_eliminacion: null
        }
      });

      if (enfermeroExistente) {
        return res.render('enfermeros/create', {
          title: 'Registrar Enfermero',
          mensaje: 'Esta persona ya está registrada como enfermero',
          paso: 'buscar',
          persona: null,
          valores: req.body
        });
      }

      // Crear el enfermero
      await Enfermero.create({
        id_persona: persona.id,
        fecha_eliminacion: null
      });

      return res.redirect('/enfermeros?success=Enfermero registrado exitosamente');

    } catch (error) {
      console.error('Error al crear enfermero:', error);
      res.render('enfermeros/create', {
        title: 'Registrar Enfermero',
        mensaje: 'Error al registrar el enfermero: ' + error.message,
        paso: 'buscar',
        persona: null,
        valores: req.body
      });
    }
  },

  // GET /enfermeros/edit/:id - Formulario para editar enfermero
  Edit_GET: async (req, res) => {
    try {
      const { id } = req.params;

      const enfermero = await Enfermero.findByPk(id, {
        include: [{ model: Persona, as: 'persona' }]
      });

      if (!enfermero || enfermero.fecha_eliminacion) {
        return res.status(404).send('Enfermero no encontrado');
      }

      res.render('enfermeros/edit', {
        title: 'Editar Enfermero',
        enfermero,
        mensaje: null,
        valores: {
          nombre: enfermero.persona.nombre,
          apellido: enfermero.persona.apellido,
          telefono: enfermero.persona.telefono
        }
      });

    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /enfermeros/edit/:id - Actualizar enfermero
  Edit_POST: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, telefono } = req.body;

      const enfermero = await Enfermero.findByPk(id, {
        include: [{ model: Persona, as: 'persona' }]
      });

      if (!enfermero || enfermero.fecha_eliminacion) {
        return res.status(404).send('Enfermero no encontrado');
      }

      // Validar datos con Zod (omitir DNI que no se puede editar)
      const validacion = personaSchema.omit({ DNI: true }).safeParse({ 
        nombre, 
        apellido, 
        telefono: telefono || '' 
      });

      if (!validacion.success) {
        const primerError = validacion.error.errors[0];
        return res.render('enfermeros/edit', {
          title: 'Editar Enfermero',
          enfermero,
          mensaje: primerError.message,
          valores: req.body
        });
      }

      // Actualizar persona (excepto DNI) con datos validados
      await enfermero.persona.update({
        nombre: validacion.data.nombre,
        apellido: validacion.data.apellido,
        telefono: validacion.data.telefono || null
      });

      res.redirect('/enfermeros?success=Enfermero actualizado exitosamente');

    } catch (error) {
      console.error('Error al actualizar enfermero:', error);
      res.status(500).send('Error al actualizar el enfermero');
    }
  }
};
