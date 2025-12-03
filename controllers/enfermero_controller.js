const { Enfermero, Persona, Usuario, Rol } = require('../models');
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

      // Validar DNI
      if (!DNI || !/^\d{7,9}$/.test(DNI)) {
        return res.render('enfermeros/create', {
          title: 'Registrar Enfermero',
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
        // Validar datos de persona
        if (!nombre || !apellido) {
          return res.render('enfermeros/create', {
            title: 'Registrar Enfermero',
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

  // POST /enfermeros/dar-baja/:id - Dar de baja un enfermero
  DarBaja_POST: async (req, res) => {
    try {
      const { id } = req.params;

      const enfermero = await Enfermero.findByPk(id, {
        include: [{ model: Persona, as: 'persona' }]
      });

      if (!enfermero || enfermero.fecha_eliminacion) {
        return res.status(404).send('Enfermero no encontrado o ya dado de baja');
      }

      // Dar de baja al enfermero
      await enfermero.update({ fecha_eliminacion: new Date() });

      // Si tiene usuario con rol Enfermero, darlo de baja también
      const usuario = await Usuario.findOne({
        where: { id_persona: enfermero.id_persona },
        include: [{ model: Rol, as: 'rol' }]
      });

      if (usuario && usuario.rol.nombre === 'Enfermero') {
        await usuario.destroy();
      }

      res.redirect('/enfermeros?success=Enfermero dado de baja exitosamente');

    } catch (error) {
      console.error('Error al dar de baja enfermero:', error);
      res.status(500).send('Error al dar de baja el enfermero');
    }
  }
};
