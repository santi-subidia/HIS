const { pacienteSchema } = require('../schemas/paciente_schema'), { personaSchema } = require('../schemas/persona_schema');
const { Paciente, TipoSangre, Localidad, Provincia, ContactoEmergencia, Persona } = require('../models');


module.exports = {

  // Lista todos los pacientes con sus relaciones principales
  listarPacientes: async (req, res) => {
    try {
      const pacientes = await Paciente.findAll({
        where: { id: { [require('sequelize').Op.gt]: 0 } },
        include: [
          { model: Persona, as: 'persona'},
          { model: TipoSangre, as: 'tipoSangre' },
          { model: Localidad, as: 'localidad', include: [{ model: Provincia, as: 'provincia' }] }
        ]
      });
      res.render('listar-pacientes', { pacientes, mensaje: null });
    } catch (error) {
      console.error('Error al listar pacientes:', error);
      res.render('listar-pacientes', { pacientes: [], mensaje: 'Error al listar pacientes.' });
    }
  },

  // Muestra el formulario de registro de paciente
  mostrarFormularioRegistro: async (req, res) => {
    try {
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });
      res.render('registro-paciente', { localidades, tiposSangre, valores: {}, error: null, exito: null });
    } catch (error) {
      console.error('Error cargando formulario:', error);
      res.status(500).send('Error interno');
    }
  },

  // Registra un nuevo paciente
  registrarPaciente: async (req, res) => {
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
        fechaNacimiento: req.body.fechaNacimiento,
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

      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      res.render('registro-paciente', {
        tiposSangre,
        localidades,
        valores: {},
        error: null,
        exito: 'Paciente registrado exitosamente.'
      });

    } catch (error) {
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      // Manejo de errores de Zod
      if (error.name === 'ZodError') {
        return res.status(400).render('registro-paciente', {
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
        return res.status(400).render('registro-paciente', {
          tiposSangre,
          localidades,
          valores: req.body,
          error: errores,
          exito: null
        });
      }

      console.error('Error al registrar paciente:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Muestra el formulario de actualización de paciente vacío
  mostrarFormularioActualizar: async (req, res) => {
    res.render('actualizar-paciente', { paciente: null, mensaje: null });
  },

  // Busca un paciente por DNI y muestra el formulario de actualización
  buscarPacientePorDNI: async (req, res) => {
    try {
      let dni = req.body.dni.trim();

      const persona = await Persona.findOne({ where: { DNI: dni } });
      if (!persona) {
        return res.render('actualizar-paciente', { paciente: null, mensaje: 'No se encontró una persona con ese DNI.' });
      }
      const paciente = await Paciente.findOne({
        where: { id_persona: persona.id },
        include: [
          { model: Persona, as: 'persona' },
        ]

      });
      if (!paciente) {
        return res.render('actualizar-paciente', { paciente: null, mensaje: 'No se encontró un paciente asociado a esa persona.' });
      }

      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      let fecha = new Date(paciente.fechaNacimiento);
      fecha = fecha.toISOString().split('T')[0]; // Formatear a YYYY-MM-DD

      res.render('actualizar-paciente', {
        paciente,
        fecha,
        tiposSangre,
        localidades,
        mensaje: null
      });
    } catch (error) {
      res.render('actualizar-paciente', { paciente: null, mensaje: 'Error al buscar paciente.' });
    }
  },

  // Actualiza los datos de un paciente
  actualizarPaciente: async (req, res) => {
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
        fechaNacimiento: req.body.fechaNacimiento,
        id_tipoSangre: req.body.id_tipoSangre,
        domicilio: req.body.domicilio,
        id_localidad: req.body.id_localidad,
      };

      // Validar datos de persona y paciente por separado
      const personaValida = personaSchema.omit({ DNI: true }).parse(personaData);
      const pacienteValido = pacienteSchema.omit({ id_persona: true }).parse(pacienteData);

      await Paciente.update(pacienteValido, { where: { id } });
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

      let fecha = new Date(paciente.fechaNacimiento);
      fecha = fecha.toISOString().split('T')[0]; // Formatear a YYYY-MM-DD

      res.render('actualizar-paciente', {
        paciente,
        tiposSangre,
        localidades,
        fecha,
        mensaje: 'Paciente actualizado correctamente.'
      });
    } catch (error) {
      // Si hay error de validación, vuelve a mostrar el formulario con los datos ingresados
      const id = req.params.id;
      const paciente = await Paciente.findOne({
        where: { id },
        include: [
          { model: Persona, as: 'persona' }
        ]
      });

      let fecha = new Date(paciente.fechaNacimiento);
      fecha = fecha.toISOString().split('T')[0]; // Formatear a YYYY-MM-DD

      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      let mensaje = 'Error al actualizar paciente.';
      if (error.issues) { // Zod
        mensaje += ' ' + error.issues.map(e => `${e.path}: ${e.message}`).join(' ');
      }

      res.render('actualizar-paciente', {
        paciente,
        tiposSangre,
        localidades,
        fecha,
        mensaje
      });
    }
  }
};

