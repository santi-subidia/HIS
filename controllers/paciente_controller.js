const { pacienteSchema } = require('../schemas/paciente.schema');
const { Paciente, TipoSangre, Localidad, Provincia } = require('../models');

module.exports = {
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
  }
};

