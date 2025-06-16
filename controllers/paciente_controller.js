const { pacienteSchema } = require('../schemas/paciente_schema');
const { Paciente, TipoSangre, Localidad, Provincia, ContactoEmergencia } = require('../models');


module.exports = {

  // Lista todos los pacientes con sus relaciones principales
  listarPacientes: async (req, res) => {
    try {
      const pacientes = await Paciente.findAll({
        where: { id: { [require('sequelize').Op.gt]: 0 } },
        include: [
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
      const data = pacienteSchema.parse(req.body);

      const contacto = ContactoEmergencia.findOne({ where: { DNI_contacto: data.DNI } });

      if (contacto) {
        contacto.nombre = data.nombre;
        contacto.apellido = data.apellido;
        contacto.telefono = data.nro_Telefono;

        
      }
      // Verificar que el teléfono no exista en ContactoEmergencia
      const telefonoEnContacto = await ContactoEmergencia.findOne({ where: { telefono: data.nro_Telefono } });
      if (telefonoEnContacto) {
        const tiposSangre = await TipoSangre.findAll();
        const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });
        return res.status(400).render('registro-paciente', {
          tiposSangre,
          localidades,
          valores: req.body,
          error: [{ message: 'El número de teléfono ya está registrado como contacto de emergencia.' }],
          exito: null
        });
      }

      await Paciente.create(data);

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
      const dni = req.body.dni;
      const paciente = await Paciente.findOne({ where: { DNI: dni } });
      if (!paciente) {
        return res.render('actualizar-paciente', { paciente: null, mensaje: 'No se encontró un paciente con ese DNI.' });
      }

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

  // Actualiza los datos de un paciente
  actualizarPaciente: async (req, res) => {
    try {
      const id = req.params.id;
      const data = pacienteSchema.parse(req.body);


      // Verificar que el teléfono no exista en ContactoEmergencia (excepto si es el mismo paciente)
      const telefonoEnContacto = await ContactoEmergencia.findOne({ where: { telefono: data.nro_Telefono } });
      if (telefonoEnContacto) {
        const tiposSangre = await TipoSangre.findAll();
        const localidades = await Localidad.findAll({ include: [{ model: Provincia, as: 'provincia' }] });
        return res.render('actualizar-paciente', {
          paciente: { ...req.body, id },
          tiposSangre,
          localidades,
          mensaje: 'El número de teléfono ya está registrado como contacto de emergencia.'
        });
      }

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
        // Personalizar mensaje de unicidad
        mensaje += ' ' + error.errors.map(e => {
          if (e.message && e.message.includes('must be unique')) {
            return 'El número de teléfono ya está registrado para otro paciente.';
          }
          return e.message;
        }).join(' ');
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

