const { Paciente, Persona, Historial_medico, Antecedente, Tipo, PacienteSeguro, Internacion, Cama, Motivo, Alta, Medico, Registro_sv, Enfermero, Plan_cuidado, Solicitud_medica, TipoEstudio, CategoriaTipoEstudio, Reseta, Renglon_reseta, Medicamento } = require('../models');

module.exports = {
  // Muestra el historial médico de un paciente
  Index: async (req, res) => {
    try {
      const { id } = req.params; // id del paciente
      
      const paciente = await Paciente.findByPk(id, {
        include: [
          { model: Persona, as: 'persona' }
        ]
      });

      if (!paciente) {
        return res.status(404).send('Paciente no encontrado');
      }

      // Buscar o crear historial médico para el paciente
      let historial = await Historial_medico.findOne({
        where: { id_paciente: id },
        include: [
          {
            model: Antecedente,
            as: 'antecedentes',
            include: [
              { model: Tipo, as: 'tipo' }
            ]
          }
        ]
      });

      // Si no existe historial, crearlo vacío
      if (!historial) {
        historial = await Historial_medico.create({
          id_paciente: id,
          id_reseta: null // null indica que no tiene receta actualmente
        });
        
        // Recargar con includes
        historial = await Historial_medico.findByPk(historial.id, {
          include: [
            {
              model: Antecedente,
              as: 'antecedentes',
              include: [
                { model: Tipo, as: 'tipo' }
              ]
            }
          ]
        });
      }

      // Agrupar antecedentes por tipo
      const antecedentesPorTipo = {
        'Alergias': [],
        'Cirugías': [],
        'Enfermedades Previas': [],
        'Antecedentes Familiares': []
      };

      if (historial.antecedentes) {
        historial.antecedentes.forEach(ant => {
          const tipoNombre = ant.tipo ? ant.tipo.nombre : 'Otros';
          if (antecedentesPorTipo[tipoNombre]) {
            antecedentesPorTipo[tipoNombre].push(ant);
          }
        });
      }

      // Obtener todos los tipos disponibles (solo para antecedentes)
      const tipos = await Tipo.findAll({
        where: {
          nombre: ['Alergias', 'Cirugías', 'Enfermedades Previas', 'Antecedentes Familiares']
        }
      });

      // Obtener internaciones previas del paciente (solo las que tienen alta o traslado)
      // Buscamos por id_paciente a través de PacienteSeguro porque el paciente es estable
      // mientras que la relación con el seguro puede cambiar
      const internaciones = await Internacion.findAll({
        where: { 
          estado: ['alta', 'traslado'] // Solo internaciones finalizadas
        },
        include: [
          {
            model: PacienteSeguro,
            as: 'PacienteSeguro',
            where: { id_paciente: id },
            required: true,
            include: [{
              model: Paciente,
              as: 'paciente',
              include: [{ model: Persona, as: 'persona' }]
            }]
          },
          {
            model: Cama,
            as: 'Cama'
          },
          {
            model: Motivo,
            as: 'Motivo'
          },
          {
            model: Alta,
            as: 'alta',
            include: [
              {
                model: Medico,
                as: 'medico',
                include: [{ model: Persona, as: 'persona' }]
              }
            ]
          }
        ],
        order: [['fecha_internacion', 'DESC']]
      });

      res.render('historial_medico/index', {
        paciente,
        historial,
        antecedentesPorTipo,
        tipos,
        internaciones
      });
    } catch (error) {
      console.error('Error en historial médico Index:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Agregar un nuevo antecedente
  AgregarAntecedente_POST: async (req, res) => {
    try {
      const { id_paciente, id_tipo, descripcion } = req.body;

      // Buscar o crear historial médico
      let historial = await Historial_medico.findOne({
        where: { id_paciente }
      });

      if (!historial) {
        historial = await Historial_medico.create({
          id_paciente,
          id_reseta: null
        });
      }

      // Crear el antecedente
      await Antecedente.create({
        id_historial: historial.id,
        id_tipo,
        descripcion
      });

      res.redirect(`/historial-medico/${id_paciente}`);
    } catch (error) {
      console.error('Error al agregar antecedente:', error);
      res.status(500).send('Error al agregar antecedente');
    }
  },

  // Eliminar un antecedente
  EliminarAntecedente_POST: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_paciente } = req.body;

      await Antecedente.destroy({ where: { id } });

      res.redirect(`/historial-medico/${id_paciente}`);
    } catch (error) {
      console.error('Error al eliminar antecedente:', error);
      res.status(500).send('Error al eliminar antecedente');
    }
  },

  // Ver detalle completo de una internación histórica (solo lectura)
  VerInternacion_GET: async (req, res) => {
    try {
      const { id_paciente, id_internacion } = req.params;

      // Cargar paciente
      const paciente = await Paciente.findByPk(id_paciente, {
        include: [{ model: Persona, as: 'persona' }]
      });

      if (!paciente) {
        return res.status(404).send('Paciente no encontrado');
      }

      // Cargar internación con todos los detalles
      const internacion = await Internacion.findByPk(id_internacion, {
        include: [
          {
            model: PacienteSeguro,
            as: 'PacienteSeguro',
            include: [{
              model: Paciente,
              as: 'paciente',
              include: [{ model: Persona, as: 'persona' }]
            }]
          },
          {
            model: Cama,
            as: 'Cama'
          },
          {
            model: Motivo,
            as: 'Motivo'
          },
          {
            model: Alta,
            as: 'alta',
            include: [
              {
                model: Medico,
                as: 'medico',
                include: [{ model: Persona, as: 'persona' }]
              },
              {
                model: Plan_cuidado,
                as: 'plan_cuidado_final',
                include: [
                  { model: Tipo, as: 'tipo' },
                  { model: Persona, as: 'persona' }
                ]
              }
            ]
          }
        ]
      });

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Verificar que la internación pertenece al paciente
      const pacienteSeguro = await PacienteSeguro.findOne({
        where: { id_paciente: id_paciente }
      });

      if (!pacienteSeguro || internacion.id_paciente_seguro !== pacienteSeguro.id) {
        return res.status(403).send('Esta internación no pertenece al paciente');
      }

      // Cargar signos vitales
      const signosVitales = await Registro_sv.findAll({
        where: { id_internacion },
        include: [
          {
            model: Persona,
            as: 'persona'
          }
        ],
        order: [['fecha', 'DESC']]
      });

      // Cargar planes de cuidado
      const planesCuidado = await Plan_cuidado.findAll({
        where: { id_internacion },
        include: [
          { model: Tipo, as: 'tipo' },
          { model: Persona, as: 'persona' },
          {
            model: Reseta,
            as: 'reseta',
            include: [
              {
                model: Renglon_reseta,
                as: 'renglones',
                include: [{ model: Medicamento, as: 'medicamento' }]
              }
            ]
          }
        ],
        order: [['fecha', 'DESC']]
      });

      // Cargar solicitudes médicas (estudios)
      const solicitudesMedicas = await Solicitud_medica.findAll({
        where: { id_internacion },
        include: [
          {
            model: Medico,
            as: 'medico',
            include: [{ model: Persona, as: 'persona' }]
          },
          {
            model: TipoEstudio,
            as: 'tipo_estudio',
            include: [{ model: CategoriaTipoEstudio, as: 'categoria' }]
          }
        ],
        order: [['fecha_solicitud', 'DESC']]
      });

      res.render('historial_medico/ver_internacion', {
        title: 'Detalle de Internación',
        paciente,
        internacion,
        signosVitales,
        planesCuidado,
        solicitudesMedicas
      });

    } catch (error) {
      console.error('Error al ver internación histórica:', error);
      res.status(500).send('Error al cargar los detalles de la internación');
    }
  }
};
