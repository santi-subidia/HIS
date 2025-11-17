const { Internacion, PacienteSeguro, Paciente, Persona, Cama, Habitacion, Ala, Sector, Registro_sv, Enfermero } = require('../models');

const Index_GET = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la internación con información del paciente
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
              as: 'Habitacion'
            }
          ]
        }
      ]
    });

    if (!internacion) {
      return res.status(404).send('Internación no encontrada');
    }

    // Obtener todos los registros de signos vitales de esta internación
    const registros = await Registro_sv.findAll({
      where: { id_internacion: id },
      include: [
        {
          model: Persona,
          as: 'persona'
        }
      ],
      order: [['fecha', 'DESC']]
    });

    res.render('signos_vitales/index', {
      title: 'Historial de Signos Vitales',
      internacion,
      registros
    });

  } catch (error) {
    console.error('Error al cargar historial de signos vitales:', error);
    res.status(500).send('Error al cargar el historial');
  }
};

const Registrar_GET = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la internación con toda la información necesaria
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

    // Verificar que la internación esté activa
    if (internacion.estado !== 'activa') {
      return res.status(400).send('Solo se pueden registrar signos vitales para internaciones activas');
    }

    res.render('signos_vitales/registrar', { 
      title: 'Registrar Signos Vitales',
      internacion 
    });

  } catch (error) {
    console.error('Error al cargar la vista de registro de signos vitales:', error);
    res.status(500).send('Error al cargar la página');
  }
};

const Registrar_POST = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      presion_arterial_sistolica,
      presion_arterial_diastolica,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      temperatura,
      color_piel,
      respuesta_estimulos,
      observaciones
    } = req.body;

    // Obtener id_persona del usuario autenticado (puede ser médico o enfermero)
    const id_persona = req.session.usuario ? req.session.usuario.id_persona : null;
    
    if (!id_persona) {
      return res.status(401).send('No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.');
    }

    // Verificar que la internación existe y está activa
    const internacion = await Internacion.findByPk(id);
    
    if (!internacion) {
      return res.status(404).send('Internación no encontrada');
    }

    if (internacion.estado !== 'activa') {
      return res.status(400).send('Solo se pueden registrar signos vitales para internaciones activas');
    }

    // Crear el registro de signos vitales
    const nuevoRegistro = await Registro_sv.create({
      id_internacion: id,
      id_persona: id_persona,
      presion_arterial_sistolica: presion_arterial_sistolica || null,
      presion_arterial_diastolica: presion_arterial_diastolica || null,
      frecuencia_cardiaca: frecuencia_cardiaca || null,
      frecuencia_respiratoria: frecuencia_respiratoria || null,
      temperatura: temperatura || null,
      color_piel: color_piel || null,
      respuesta_estimulos: respuesta_estimulos || null,
      observaciones: observaciones || null,
      fecha: new Date()
    });

    console.log('Registro de signos vitales creado:', nuevoRegistro.id);

    // Redirigir de vuelta a los detalles de la internación
    res.redirect(`/internacion/details/${id}`);

  } catch (error) {
    console.error('Error al registrar signos vitales:', error);
    res.status(500).send('Error al registrar signos vitales: ' + error.message);
  }
};

module.exports = {
  Index_GET,
  Registrar_GET,
  Registrar_POST
};
