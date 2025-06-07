const { pacienteSchema } = require('../schemas/paciente_schema');
const { Paciente, TipoSangre, Localidad, Provincia } = require('../models');


module.exports = {

  listarPacientes: async (req, res) => {
    try {
      const pacientes = await Paciente.findAll({
        where: { id: { [require('sequelize').Op.gt]: 0 } }, // Solo pacientes con id positivo
        include: [
          { model: TipoSangre, as: 'tipoSangre' },
          { model: Localidad, as: 'localidad', include: [{ model: Provincia, as: 'provincia' }] }
        ]
      });

      res.render('listar-pacientes', { pacientes, mensaje: null });

    } catch (error) {
      console.error('Error al listar pacientes:', error);
      res.render('listar-pacientes', { pacientes: [], mensaje: 'Error al listar pacientes.' });
    }},

  mostrarFormularioRegistro: async (req, res) => {
    try {
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({
        include: [{ model: Provincia, as: 'provincia' }]
      });

      res.render('registro-paciente', { localidades, tiposSangre, valores: {}, error: null, exito: null });
    } catch (error) {
      console.error('Error cargando formulario:', error);
      res.status(500).send('Error interno');
    }
  },

  registrarPaciente: async (req, res) => {
    try {
      const data = pacienteSchema.parse(req.body);

      await Paciente.create(data);

      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({
        include: [{ model: Provincia, as: 'provincia' }]
      });

      res.render('registro-paciente', {
        tiposSangre,
        localidades,
        valores: {},
        error: null,
        exito: 'Paciente registrado exitosamente.'
      });

    } catch (error) {
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({
        include: [{ model: Provincia, as: 'provincia' }]
      });

      if (error.name === 'ZodError') {
        return res.status(400).render('registro-paciente', {
          tiposSangre,
          localidades,
          valores: req.body,
          error: error.errors,
          exito: null
        });
      }

      console.error('Error al registrar paciente:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  mostrarFormularioActualizar: async (req, res) => {
    res.render('actualizar-paciente', { paciente: null, mensaje: null });
  },

  buscarPacientePorDNI: async (req, res) => {
    try {
      const dni = req.body.dni;
      const paciente = await Paciente.findOne({ where: { DNI: dni } });
      if (!paciente) {
        return res.render('actualizar-paciente', { paciente: null, mensaje: 'No se encontró un paciente con ese DNI.' });
      }
      
      // Traer selects
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });   

      res.render('actualizar-paciente', {
        paciente,
        tiposSangre,
        localidades,
        mensaje: null
      });
    } catch (error) {
      res.render('actualizar-paciente', { paciente: null, mensaje: 'Error al buscar paciente.' });
    }
  },

  actualizarPaciente: async (req, res) => {
    try {
      const id = req.params.id;
      const data = pacienteSchema.parse(req.body);


      await Paciente.update(data, { where: { id } });

      // Traer selects para volver a mostrar el formulario actualizado
      const paciente = await Paciente.findByPk(id);
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      res.render('actualizar-paciente', {
        paciente,
        tiposSangre,
        localidades,
        mensaje: 'Paciente actualizado correctamente.'
      });
    } catch (error) {
      // Si hay error de validación, vuelve a mostrar el formulario con los datos ingresados
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });

      let mensaje = 'Error al actualizar paciente.';
      if (error.issues) { // Zod
        mensaje += ' ' + error.issues.map(e => `${e.path}: ${e.message}`).join(' ');
      } else if (error.errors) {
        mensaje += ' ' + error.errors.map(e => e.message).join(' ');
      }

      res.render('actualizar-paciente', {
        paciente: { ...req.body, id: req.params.id },
        tiposSangre,
        localidades,
        mensaje
      });
    }
  }

};

