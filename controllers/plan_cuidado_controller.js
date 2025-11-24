const { Internacion, PacienteSeguro, Paciente, Persona, Cama, Habitacion, Ala, Sector, Plan_cuidado, Tipo, Enfermero } = require('../models');

module.exports = {
  // GET /enfermeria/planes-cuidado/crear/:id - Formulario para crear plan de cuidado
  Crear_GET: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_receta, desde_alta, return: returnUrl } = req.query;
      
      // Buscar la internación con todos sus datos relacionados
      const internacion = await Internacion.findByPk(id, {
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
                  }
                ]
              }
            ]
          },
          {
            model: Cama,
            as: 'Cama',
            include: [
              {
                model: Habitacion,
                as: 'Habitacion',
                include: [
                  {
                    model: Ala,
                    as: 'Ala',
                    include: [
                      {
                        model: Sector,
                        as: 'Sector'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Determinar el tipo de plan automáticamente
      const esFinal = desde_alta === 'true';
      const nombreTipo = esFinal ? 'Final' : 'Transitorio';
      
      // Buscar el tipo correspondiente
      const tipo = await Tipo.findOne({
        where: { nombre: nombreTipo }
      });

      res.render('plan_cuidado/crear', { 
        internacion,
        tipoAutomatico: tipo.id,
        esFinal: esFinal,
        id_receta: id_receta || null,
        returnUrl: returnUrl || null,
        title: 'Crear Plan de Cuidado'
      });
    } catch (error) {
      console.error('Error al cargar formulario de plan de cuidado:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /enfermeria/planes-cuidado/crear/:id - Crear plan de cuidado
  Crear_POST: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_tipo, diagnostico, tratamiento, id_reseta, returnUrl } = req.body;

      // Validar que la internación existe
      const internacion = await Internacion.findByPk(id);
      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      if(internacion.estado !== 'activa'){
        return res.status(400).send('No se pueden agregar planes de cuidado a una internación que no está activa');
      }

      // TODO: Obtener id_persona del usuario autenticado
      const id_persona = req.session.usuario ? req.session.usuario.id_persona : null;

      if (!id_persona) {
        return res.status(401).send('Usuario no autenticado');
      }

      // Crear el plan de cuidado
      await Plan_cuidado.create({
        id_persona,
        id_internacion: id,
        id_tipo,
        diagnostico,
        tratamiento,
        id_reseta: id_reseta || null,
        fecha: new Date()
      });

      console.log(`Plan de cuidado creado para internación ${id}`);
      
      // Redirigir según el parámetro returnUrl o por defecto a detalles de internación
      if (returnUrl) {
        res.redirect(returnUrl);
      } else {
        res.redirect(`/internacion/details/${id}`);
      }
    } catch (error) {
      console.error('Error al crear plan de cuidado:', error);
      res.status(500).send('Error al crear el plan de cuidado');
    }
  },

  // GET /enfermeria/planes-cuidado/:id - Ver historial de planes de cuidado
  Index_GET: async (req, res) => {
    try {
      const { id } = req.params;

      // Buscar la internación
      const internacion = await Internacion.findByPk(id, {
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
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Obtener todos los planes de cuidado de la internación
      const planes = await Plan_cuidado.findAll({
        where: { id_internacion: id },
        include: [
          {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'apellido']
          },
          {
            model: Tipo,
            as: 'tipo',
            attributes: ['nombre']
          }
        ],
        order: [['fecha', 'DESC']]
      });

      res.render('plan_cuidado/index', {
        internacion,
        planes,
        title: 'Historial de Planes de Cuidado'
      });
    } catch (error) {
      console.error('Error al obtener planes de cuidado:', error);
      res.status(500).send('Error al cargar el historial');
    }
  },

  // GET /enfermeria/planes-cuidado/details/:id - Ver detalles de un plan de cuidado
  Details_GET: async (req, res) => {
    try {
      const { id } = req.params;
      const { Reseta, Renglon_reseta, Medicamento } = require('../models');

      // Buscar el plan de cuidado con todos sus datos
      const plan = await Plan_cuidado.findByPk(id, {
        include: [
          {
            model: Persona,
            as: 'persona'
          },
          {
            model: Tipo,
            as: 'tipo'
          },
          {
            model: Internacion,
            as: 'internacion',
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
                      }
                    ]
                  }
                ]
              },
              {
                model: Cama,
                as: 'Cama',
                include: [
                  {
                    model: Habitacion,
                    as: 'Habitacion',
                    include: [
                      {
                        model: Ala,
                        as: 'Ala',
                        include: [
                          {
                            model: Sector,
                            as: 'Sector'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: Reseta,
            as: 'reseta',
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
            ]
          }
        ]
      });

      if (!plan) {
        return res.status(404).send('Plan de cuidado no encontrado');
      }

      res.render('plan_cuidado/details', {
        plan,
        title: 'Detalles del Plan de Cuidado'
      });
    } catch (error) {
      console.error('Error al obtener detalles del plan:', error);
      res.status(500).send('Error al cargar los detalles');
    }
  }
};
