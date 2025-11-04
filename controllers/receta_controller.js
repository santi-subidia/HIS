const { Reseta, Renglon_reseta, Medicamento, Internacion, PacienteSeguro, Paciente, Persona, Historial_medico } = require('../models');

module.exports = {
  // GET /recetas/crear - Formulario para crear receta
  Crear_GET: async (req, res) => {
    try {
      const { id_internacion, return: returnUrl } = req.query;

      let internacion = null;
      if (id_internacion) {
        // Buscar la internación con datos del paciente
        internacion = await Internacion.findByPk(id_internacion, {
          include: [
            {
              model: PacienteSeguro,
              as: 'PacienteSeguro',
              include: [
                {
                  model: Paciente,
                  as: 'paciente',
                  include: [
                    {
                      model: Persona,
                      as: 'persona'
                    },
                    {
                        model: Historial_medico,
                        as: 'historialMedico'
                    }
                  ]
                }
              ]
            }
          ]
        });
      }

      res.render('receta/crear', {
        internacion,
        returnUrl: returnUrl || null,
        title: 'Crear Receta Médica'
      });
    } catch (error) {
      console.error('Error al cargar formulario de receta:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /recetas/crear - Crear receta con renglones
  Crear_POST: async (req, res) => {
    try {
      const { id_historial, medicamentos, dosis, duracion, indicaciones } = req.body;
      const { return: returnUrl } = req.query;

      console.log('Redirigiendo a:', returnUrl);
      // TODO: Obtener id_persona del usuario autenticado
      // Por ahora usamos id_persona = 1 como placeholder
      const id_persona = req.session?.id_persona || 1;

      // Crear la receta
      const receta = await Reseta.create({
        id_persona,
        id_historial: id_historial || null,
        fecha: new Date()
      });

      console.log(`Receta creada con ID: ${receta.id}`);

      // Crear los renglones de la receta
      // Los campos vienen como arrays desde el formulario
      const medicamentosArray = Array.isArray(medicamentos) ? medicamentos : [medicamentos];
      const dosisArray = Array.isArray(dosis) ? dosis : [dosis];
      const duracionArray = Array.isArray(duracion) ? duracion : [duracion];
      const indicacionesArray = Array.isArray(indicaciones) ? indicaciones : [indicaciones];

      for (let i = 0; i < medicamentosArray.length; i++) {
        if (medicamentosArray[i]) { // Solo si se seleccionó un medicamento
          await Renglon_reseta.create({
            id_reseta: receta.id,
            id_medicamento: medicamentosArray[i],
            dosis: dosisArray[i] || '',
            duracion: duracionArray[i] || '',
            indicaciones: indicacionesArray[i] || null
          });
        }
      }

      console.log(`Renglones de receta creados para receta ${receta.id}`);

      // Redirigir según el parámetro return o a una página por defecto
      if (returnUrl) {
        // Agregar el ID de la receta como parámetro en la URL de retorno
        const separator = returnUrl.includes('?') ? '&' : '?';
        res.redirect(`${returnUrl}${separator}id_receta=${receta.id}`);
      } else {
        res.redirect('/recetas');
      }
    } catch (error) {
      console.error('Error al crear receta:', error);
      res.status(500).send('Error al crear la receta');
    }
  },

  // GET /recetas/:id_historial - Ver todas las recetas de un historial médico
  Index_GET: async (req, res) => {
    try {
      const { id_historial } = req.params;

      // Buscar el historial médico con datos del paciente
      const historial = await Historial_medico.findByPk(id_historial, {
        include: [
          {
            model: Paciente,
            as: 'paciente',
            include: [
              {
                model: Persona,
                as: 'persona'
              }
            ]
          }
        ]
      });

      if (!historial) {
        return res.status(404).send('Historial médico no encontrado');
      }

      // Obtener todas las recetas del historial
      const recetas = await Reseta.findAll({
        where: { id_historial },
        include: [
          {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'apellido']
          },
          {
            model: Renglon_reseta,
            as: 'renglones',
            include: [
              {
                model: Medicamento,
                as: 'medicamento'
              }
            ]
          }
        ],
        order: [['fecha', 'DESC']]
      });

      res.render('receta/index', {
        historial,
        recetas,
        title: 'Recetas Médicas'
      });
    } catch (error) {
      console.error('Error al obtener recetas:', error);
      res.status(500).send('Error al cargar las recetas');
    }
  }
};
