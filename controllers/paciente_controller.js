const { pacienteSchema } = require('../schemas/paciente_schema'), { personaSchema } = require('../schemas/persona_schema');
const { Paciente, TipoSangre, Localidad, Provincia, ContactoEmergencia, Persona } = require('../models');


module.exports = {
  // GET
  index: async (req, res) => {
    try {
      const pacientes = await Paciente.findAll({
        where: { id: { [require('sequelize').Op.gt]: 0 } },
        include: [
          { model: Persona, as: 'persona'},
          { model: TipoSangre, as: 'tipoSangre' },
          { model: Localidad, as: 'localidad', include: [{ model: Provincia, as: 'provincia' }] }
        ]
      });
      res.render('Paciente/index', { pacientes, mensaje: req.query.mensaje || null });
    } catch (error) {
      console.error('Error al listar pacientes:', error);
      res.render('Paciente/index', { pacientes: [], mensaje: 'Error al listar pacientes.' });
    }
  },

  // Muestra el formulario de registro de paciente
  Create_GET: async (req, res) => {
    try {
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });
      res.render('Paciente/Create', { localidades, tiposSangre, valores: {}, error: null, exito: null });
    } catch (error) {
      console.error('Error cargando formulario:', error);
      res.status(500).send('Error interno');
    }
  },

  // Registra un nuevo paciente
  Create_POST: async (req, res) => {
    try {
      // Separar datos de persona y paciente desde req.body
      const personaData = {
        DNI: req.body.DNI,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono
      };
      const pacienteData = {
        sexo: req.body.sexo,
        fecha_nacimiento: req.body.fecha_nacimiento,
        id_tipoSangre: req.body.id_tipoSangre,
        domicilio: req.body.domicilio,
        id_localidad: req.body.id_localidad,
        id_persona: undefined // se asigna luego
      };

      // Validar datos de persona y paciente por separado
      const personaValida = personaSchema.parse(personaData);
      const pacienteValido = pacienteSchema.omit({ id_persona: true }).parse(pacienteData);

      // Verificar si la persona ya existe
      const personaExistente = await Persona.findOne({ where: { DNI: personaValida.DNI } });
      const persona = personaExistente || await Persona.create(personaValida);

      // Verificar si el paciente ya existe para esa persona
      const pacienteExistente = await Paciente.findOne({ where: { id_persona: persona.id } });
      if (pacienteExistente) {
        const tiposSangre = await TipoSangre.findAll();
        const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });
        return res.status(400).render('registro-paciente', {
          tiposSangre,
          localidades,
          valores: req.body,
          error: [{ message: 'El DNI ya está registrado para otro paciente.' }],
          exito: null
        });
      }

      // Crear el paciente vinculado a la persona
      await Paciente.create({ ...pacienteValido, id_persona: persona.id });

      res.redirect('/pacientes?mensaje=Paciente registrado correctamente');

    } catch (error) {
      console.error('Error al registrar paciente:', error);

      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      // Manejo de errores de Zod
      if (error.name === 'ZodError') {
        return res.status(400).render('Paciente/Create', {
          tiposSangre,
          localidades,
          valores: req.body,
          error: error.errors,
          exito: null
        });
      }
      // Manejo de errores de Sequelize
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
        const errores = error.errors ? error.errors.map(e => ({ message: e.message })) : [{ message: 'Error de validación en la base de datos.' }];
        return res.status(400).render('Paciente/Create', {
          tiposSangre,
          localidades,
          valores: req.body,
          error: errores,
          exito: null
        });
      }
      
      res.status(500).send('Error interno del servidor');
    }
  },

  // Muestra el formulario de actualización de paciente
  Update_GET: async (req, res) => {
    const id = req.params.id || req.query.id;
    
    if (!id) {
      return res.render('Paciente/Update', { 
        paciente: null, 
        tiposSangre: [],
        localidades: [],
        fecha: null,
        mensaje: 'ID de paciente requerido.' 
      });
    }

    try {
      const paciente = await Paciente.findOne({ 
        where: { id },
        include: [
          { model: Persona, as: 'persona' }
        ]
      });
      
      if (!paciente) {
        return res.render('Paciente/Update', { 
          paciente: null, 
          tiposSangre: [],
          localidades: [],
          fecha: null,
          mensaje: 'No se encontró el paciente.' 
        });
      }

      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });
      
      let fecha = new Date(paciente.fecha_nacimiento);
      fecha = fecha.toISOString().split('T')[0]; // Formatear a YYYY-MM-DD

      res.render('Paciente/Update', { 
        paciente, 
        tiposSangre,
        localidades,
        fecha,
        mensaje: null 
      });
    } catch (error) {
      console.error('Error al buscar paciente:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Actualiza los datos de un paciente
  Update_POST: async (req, res) => {
    try {
      const id = req.params.id;

      // Separar datos de persona y paciente desde req.body
      const personaData = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono
      };
      const pacienteData = {
        sexo: req.body.sexo,
        fecha_nacimiento: req.body.fecha_nacimiento,
        id_tipoSangre: req.body.id_tipoSangre,
        domicilio: req.body.domicilio,
        id_localidad: req.body.id_localidad,
      };

      // Validar datos de persona y paciente por separado
      const personaValida = personaSchema.omit({ DNI: true }).parse(personaData);
      const pacienteValido = pacienteSchema.omit({ id_persona: true }).parse(pacienteData);

      console.log('Valor del sexo recibido:', req.body.sexo);
      console.log('Datos a actualizar en Paciente:', pacienteValido);
      console.log('ID del paciente:', id);
      
      const [numRowsUpdated] = await Paciente.update(pacienteValido, { where: { id } });
      console.log('Filas actualizadas:', numRowsUpdated);
      
      let paciente = await Paciente.findByPk(id);
      await Persona.update(personaValida, { where: { id: paciente.id_persona } });

      paciente = await Paciente.findOne({
        where: { id },
        include: [
          { model: Persona, as: 'persona' }
        ]
      });
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      let fecha = '';
      if (paciente.fecha_nacimiento) {
        fecha = new Date(paciente.fecha_nacimiento).toISOString().split('T')[0];
      }

      res.render('Paciente/Update', {
        paciente,
        tiposSangre,
        localidades,
        fecha,
        mensaje: 'Paciente actualizado correctamente.'
      });
    } catch (error) {
      console.error('Error completo en Update_POST:', error);
      console.error('Nombre del error:', error.name);
      console.error('Mensaje del error:', error.message);
      console.error('Stack del error:', error.stack);
      
      if (error.original) {
        console.error('Error original de Sequelize:', error.original);
      }
      
      // Si hay error de validación, vuelve a mostrar el formulario con los datos ingresados
      const id = req.params.id;
      const paciente = await Paciente.findOne({
        where: { id },
        include: [
          { model: Persona, as: 'persona' }
        ]
      });

      let fecha = '';
      if (paciente && paciente.fecha_nacimiento) {
        fecha = new Date(paciente.fecha_nacimiento).toISOString().split('T')[0];
      }

      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      let mensaje = 'Error al actualizar paciente: ' + error.message;
      if (error.issues) { // Zod
        mensaje += ' Detalles: ' + error.issues.map(e => `${e.path}: ${e.message}`).join(', ');
      }
      if (error.name === 'SequelizeValidationError') {
        mensaje += ' Errores de validación: ' + error.errors.map(e => e.message).join(', ');
      }

      res.render('Paciente/Update', {
        paciente,
        tiposSangre,
        localidades,
        fecha,
        mensaje
      });
    }
  }
};

