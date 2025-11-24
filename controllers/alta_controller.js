const { Alta, Internacion, PacienteSeguro, Paciente, Persona, Medico, Plan_cuidado, Tipo, Cama } = require('../models');

module.exports = {
  // GET /alta/crear/:id - Formulario para dar de alta (id = id_internacion)
  Crear_GET: async (req, res) => {
    try {
      const { id } = req.params; // id_internacion
      const { tipo_alta } = req.query; // Capturar tipo_alta del query param

      const internacion = await Internacion.findByPk(id, {
        include: [
          {
            model: PacienteSeguro,
            as: 'PacienteSeguro',
            include: [{
              model: Paciente,
              as: 'paciente',
              include: [{
                model: Persona,
                as: 'persona'
              }]
            }]
          },
          {
            model: Cama,
            as: 'Cama'
          }
        ]
      });

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Verificar que la internación esté activa
      if (internacion.estado !== 'activa') {
        return res.status(400).send('Solo se pueden dar de alta internaciones activas');
      }

      // Verificar que no tenga ya un alta
      const altaExistente = await Alta.findOne({
        where: { id_internacion: id }
      });

      if (altaExistente) {
        return res.status(400).send('Esta internación ya tiene un alta registrada');
      }

      // Obtener el plan de cuidado tipo "Final" de esta internación (el más reciente)
      const planCuidadoFinal = await Plan_cuidado.findOne({
        where: { id_internacion: id },
        include: [{
          model: Tipo,
          as: 'tipo',
          where: { nombre: 'Final' }
        }],
        order: [['fecha', 'DESC']]
      });

      res.render('alta/crear', {
        title: 'Dar de Alta a Paciente',
        internacion,
        planCuidadoFinal,
        tipoAltaPreseleccionado: tipo_alta || null
      });

    } catch (error) {
      console.error('Error al cargar formulario de alta:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /alta/crear - Crear alta
  Crear_POST: async (req, res) => {
    try {
      const { id_internacion, id_plan_cuidado_final, tipo_alta, diagnostico_final, observaciones, recomendaciones } = req.body;

      // Validaciones básicas
      if (!id_internacion || !tipo_alta || !diagnostico_final) {
        return res.status(400).send('Todos los campos obligatorios deben estar completos');
      }

      // Para altas Médica y Voluntaria, el plan de cuidado final es obligatorio
      if ((tipo_alta === 'Medica' || tipo_alta === 'Voluntaria') && !id_plan_cuidado_final) {
        return res.status(400).send('El plan de cuidado final es obligatorio para altas Médica y Voluntaria');
      }

      if (diagnostico_final.trim().length < 10 || diagnostico_final.trim().length > 1000) {
        return res.status(400).send('El diagnóstico final debe tener entre 10 y 1000 caracteres');
      }

      // Verificar que la internación existe y está activa
      const internacion = await Internacion.findByPk(id_internacion, {
        include: [
          { model: Cama, as: 'Cama' },
          { model: PacienteSeguro, as: 'PacienteSeguro' }
        ]
      });

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Para altas Médica y Voluntaria, verificar que el paciente tenga datos completos
      if ((tipo_alta === 'Medica' || tipo_alta === 'Voluntaria') && !internacion.PacienteSeguro) {
        return res.status(400).send('Para dar de alta Médica o Voluntaria, el paciente debe tener sus datos completos. Por favor, complete los datos del paciente primero.');
      }

      if (internacion.estado !== 'activa') {
        return res.status(400).send('Solo se pueden dar de alta internaciones activas');
      }

      // Verificar que no tenga ya un alta
      const altaExistente = await Alta.findOne({
        where: { id_internacion }
      });

      if (altaExistente) {
        return res.status(400).send('Esta internación ya tiene un alta registrada');
      }

      // Verificar el plan de cuidado solo si es requerido (Médica y Voluntaria)
      if (id_plan_cuidado_final) {
        const planCuidado = await Plan_cuidado.findByPk(id_plan_cuidado_final, {
          include: [{
            model: Tipo,
            as: 'tipo'
          }]
        });

        if (!planCuidado) {
          return res.status(404).send('Plan de cuidado no encontrado');
        }

        if (planCuidado.tipo.nombre !== 'Final') {
          return res.status(400).send('Solo se pueden usar planes de cuidado tipo Final para el alta');
        }
      }

      // TODO: Obtener id_medico del usuario autenticado
      const id_medico = req.session?.id_medico || null;

      if (!id_medico) {
        return res.status(400).send('No se ha autenticado un médico. Por favor, inicie sesión.');
      }

      // Verificar que existe el médico
      const medico = await Medico.findByPk(id_medico);
      if (!medico) {
        return res.status(404).send('Médico no encontrado. Por favor, contacte al administrador.');
      }

      // Crear el alta
      await Alta.create({
        id_internacion,
        id_medico,
        id_plan_cuidado_final: id_plan_cuidado_final || null,
        tipo_alta,
        diagnostico_final: diagnostico_final.trim(),
        observaciones: observaciones?.trim() || null,
        recomendaciones: recomendaciones?.trim() || null,
        fecha_alta: new Date()
      });

      // Actualizar estado de la internación a "alta"
      await Internacion.update(
        { 
          estado: 'alta',
          fecha_egreso: new Date()
        },
        { where: { id: id_internacion } }
      );

      // Liberar la cama (disponible)
      if (internacion.id_cama) {
        await Cama.update(
          { estado: 'mantenimiento' },
          { where: { id: internacion.id_cama } }
        );
      }

      console.log(`Alta registrada para internación ${id_internacion} por médico ${id_medico}`);
      res.redirect(`/alta/details/${id_internacion}?success=Alta registrada exitosamente`);

    } catch (error) {
      console.error('Error al registrar alta:', error);

      if (error.name === 'SequelizeValidationError') {
        const errores = error.errors.map(e => e.message).join(', ');
        return res.status(400).send(`Error de validación: ${errores}`);
      }

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).send('Error: Referencia inválida. Verifique que el médico, internación y plan de cuidado existan.');
      }

      res.status(500).send('Error al registrar el alta');
    }
  },

  // GET /alta/details/:id - Ver detalles del alta (id = id_internacion)
  Details_GET: async (req, res) => {
    try {
      const { id } = req.params; // id_internacion

      const alta = await Alta.findOne({
        where: { id_internacion: id },
        include: [
          {
            model: Internacion,
            as: 'internacion',
            include: [
              {
                model: PacienteSeguro,
                as: 'PacienteSeguro',
                include: [{
                  model: Paciente,
                  as: 'paciente',
                  include: [{
                    model: Persona,
                    as: 'persona'
                  }]
                }]
              },
              {
                model: Cama,
                as: 'Cama'
              }
            ]
          },
          {
            model: Medico,
            as: 'medico',
            include: [
              {
                model: Persona,
                as: 'persona'
              },
              {
                model: require('../models').Especialidad,
                as: 'especialidad'
              }
            ]
          },
          {
            model: Plan_cuidado,
            as: 'plan_cuidado_final',
            include: [{
              model: Tipo,
              as: 'tipo'
            }]
          }
        ]
      });

      if (!alta) {
        return res.status(404).send('Alta no encontrada');
      }

      res.render('alta/details', {
        title: 'Detalles del Alta',
        alta
      });

    } catch (error) {
      console.error('Error al cargar detalles del alta:', error);
      res.status(500).send('Error al cargar los detalles');
    }
  },

  // GET /alta/listado - Listado de todas las altas
  Listado_GET: async (req, res) => {
    try {
      const altas = await Alta.findAll({
        include: [
          {
            model: Internacion,
            as: 'internacion',
            include: [
              {
                model: PacienteSeguro,
                as: 'PacienteSeguro',
                include: [{
                  model: Paciente,
                  as: 'paciente',
                  include: [{
                    model: Persona,
                    as: 'persona'
                  }]
                }]
              }
            ]
          },
          {
            model: Medico,
            as: 'medico',
            include: [{
              model: Persona,
              as: 'persona'
            }]
          }
        ],
        order: [['fecha_alta', 'DESC']]
      });

      res.render('alta/listado', {
        title: 'Listado de Altas',
        altas
      });

    } catch (error) {
      console.error('Error al cargar listado de altas:', error);
      res.status(500).send('Error al cargar el listado');
    }
  }
};
