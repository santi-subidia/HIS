const { Paciente, Sector, Ala, Parentesco, Seguro, Motivo, Cama, Habitacion, Turno, Internacion, PacienteSeguro, ContactoEmergencia, Persona } = require('../models');
const { contactoEmergenciaSchema } = require('../schemas/contactoEmergencia_schema');
const { pacienteSeguroSchema } = require('../schemas/pacienteSeguro_schema');
const { personaSchema } = require('../schemas/persona_schema');
const { internacionSchema } = require('../schemas/internacion_schema');
const { Op } = require('sequelize');

// Utilidad: genera un id negativo único para paciente desconocido
async function generarIdPacienteDesconocido() {
  const minPaciente = await Paciente.min('id', { where: { id: { [Op.lt]: 0 } } });
  return minPaciente ? minPaciente - 1 : -1;
}

// Utilidad: genera un DNI anónimo pequeño y único
async function generarDNIAnonimoPequeno() {
  const maxDNI = await Persona.max('DNI', { where: { DNI: { [Op.lt]: '1000000' } } });
  let nuevoDNI = 1;
  if (maxDNI && !isNaN(Number(maxDNI))) {
    nuevoDNI = Number(maxDNI) + 1;
    if (nuevoDNI >= 1000000) nuevoDNI = 1;
  }
  return nuevoDNI.toString().padStart(7, '0');
}

module.exports = {

  // Lista todas las internaciones activas con sus relaciones
  Index: async (req, res) => {
    try {
      const internaciones = await Internacion.findAll({
        include: [
          {
            model: PacienteSeguro,
            include: [
              { 
                model: Paciente, as: 'paciente',
                include: [
                  { model: Persona, as: 'persona' }
                ]
              }]
          },
          {
            model: Cama,
            include: [
              {
                model: Habitacion,
                include: [
                  {
                    model: Ala,
                    include: [{ model: Sector }]
                  }
                ]
              }
            ]
          }
        ],
        where: { estado: 'activa' }
      });
      res.render('internacion/index', { internaciones, mensaje: null });
    } catch (error) {
      console.error('Error al listar internaciones:', error);
      res.render('internacion/index', { internaciones: [], mensaje: 'Error al listar internaciones.' });
    }
  },

  // Muestra el formulario de registro de internación
  Create_GET: async (req, res) => {
    res.render('internacion/create', {
      mensaje: null,
      paciente: null,
      sectores: null,
      alas: null,
      parentescos: null,
      seguros: null,
      motivos: null
    });
  },

  // Busca paciente por DNI y verifica si ya tiene internación activa
  buscarPacientePorDNI: async (req, res) => {
    const { dni } = req.body;
    const paciente = await Paciente.findOne({
      include: [{ model: Persona, as: 'persona' }],
      where: { '$persona.DNI$': dni }
    });

    if (!paciente) {
      return res.render('internacion/create', {
        mensaje: 'Paciente no encontrado.',
        paciente: null,
        sectores: null,
        alas: null,
        parentescos: null,
        seguros: null,
        motivos: null
      });
    }

    if (paciente.fecha_eliminacion) {
      return res.render('internacion/create', {
        mensaje: 'Paciente eliminado.',
        paciente: null,
        sectores: null,
        alas: null,
        parentescos: null,
        seguros: null,
        motivos: null
      });
    }

    // Verifica internación activa
    const internacionActiva = await Internacion.findOne({
      include: [{ model: PacienteSeguro, where: { id_paciente: paciente.id } }],
      where: { estado: 'activa' }
    });

    if (internacionActiva) {
      // Busca ubicación para el mensaje
      const camaObj = await Cama.findByPk(internacionActiva.id_cama);
      const habitacionObj = camaObj ? await Habitacion.findByPk(camaObj.id_habitacion) : null;
      const alaObj = habitacionObj ? await Ala.findByPk(habitacionObj.id_ala) : null;
      const sectorObj = alaObj ? await Sector.findByPk(alaObj.id_sector) : null;

      const mensaje = `${paciente.persona.nombre} ${paciente.persona.apellido} ya tiene una internación activa.
      Sector: ${sectorObj ? sectorObj.nombre : '-'},
      Ala: ${alaObj ? alaObj.ubicacion : '-'},
      Habitación: ${habitacionObj ? habitacionObj.codigo : '-'},
      Cama: ${camaObj ? camaObj.nroCama : '-'}`;

      return res.render('internacion/create', {
        mensaje,
        paciente: null,
        sectores: null,
        alas: null,
        parentescos: null,
        seguros: null,
        motivos: null
      });
    }

    // Si no tiene internación activa, carga datos para el formulario
    const sectores = await Sector.findAll();
    const parentescos = await Parentesco.findAll();
    const seguros = await Seguro.findAll();
    const motivos = await Motivo.findAll();

    res.render('internacion/create', {
      mensaje: null,
      paciente,
      sectores,
      parentescos,
      seguros,
      motivos
    });
  },

  // Crea una nueva internación
  Create_POST: async (req, res) => {
    try {
      const pacienteId = Number(req.params.id);

      // Verifica internación activa
      const internacionActiva = await Internacion.findOne({
        include: [{ model: PacienteSeguro, where: { id_paciente: pacienteId } }],
        where: { estado: 'activa' }
      });
      
      if (internacionActiva) {
        const paciente = await Paciente.findByPk(pacienteId);
        const camaObj = await Cama.findByPk(internacionActiva.id_cama);
        const habitacionObj = camaObj ? await Habitacion.findByPk(camaObj.id_habitacion) : null;
        const alaObj = habitacionObj ? await Ala.findByPk(habitacionObj.id_ala) : null;
        const sectorObj = alaObj ? await Sector.findByPk(alaObj.id_sector) : null;

        const mensaje = `${paciente.nombre} ${paciente.apellido} ya tiene una internación activa.
        Sector: ${sectorObj ? sectorObj.nombre : '-'},
        Ala: ${alaObj ? alaObj.ubicacion : '-'},
        Habitación: ${habitacionObj ? habitacionObj.codigo : '-'},
        Cama: ${camaObj ? camaObj.nroCama : '-'}`;

        return res.render('internacion/create', {
          mensaje,
          paciente: null,
          sectores: null,
          alas: null,
          parentescos: null,
          seguros: null,
          motivos: null
        });
      }

      // 1. Parsear y crear/actualizar contacto de emergencia
      const personaData = personaSchema.parse({
        DNI: req.body.dniContacto,
        nombre: req.body.nombreContacto,
        apellido: req.body.apellidoContacto,
        telefono: req.body.telefonoContacto
      });

      const [persona] = await Persona.findOrCreate({
        where: { DNI: personaData.DNI },
        defaults: personaData
      });

      await persona.update(personaData);

      const [contacto] = await ContactoEmergencia.findOrCreate({
        where: {
          id_persona: persona.id,
          id_parentesco: req.body.parentescoContacto
        },
        defaults: {
          id_persona: persona.id,
          id_parentesco: req.body.parentescoContacto
        }
      });

      // 2. Parsear y crear/actualizar pacienteSeguro
      const pacienteSeguroData = pacienteSeguroSchema.parse({
        id_paciente: pacienteId,
        id_seguro: Number(req.body.seguro),
        codigo_afiliado: req.body.codigo_afiliado,
        fecha_desde: req.body.fecha_desde,
        estado: 'activo'
      });
      const [pacienteSeguro] = await PacienteSeguro.findOrCreate({
        where: {
          id_paciente: pacienteSeguroData.id_paciente,
          id_seguro: pacienteSeguroData.id_seguro,
          codigo_afiliado: pacienteSeguroData.codigo_afiliado
        },
        defaults: pacienteSeguroData
      });
      await pacienteSeguro.update({
        ...pacienteSeguroData,
        estado: pacienteSeguroData.estado || pacienteSeguro.estado || 'activo'
      });

      // 3. Crear la internación
      const internacionData = internacionSchema.parse({
        id_paciente_seguro: pacienteSeguro.id,
        id_cama: Number(req.body.cama),
        id_motivo: Number(req.body.motivo),
        detalle_motivo: req.body.detalle || undefined,
        id_contactoEmergencia: contacto.id,
        fecha_internacion: new Date().toISOString(),
        estado: 'activa'
      });
      const nuevaInternacion = await Internacion.create(internacionData);

      // 4. Si el paciente tenía un turno para hoy, cambiar el estado a "confirmado"
      const hoy = new Date();
      const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0);
      const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
      await Turno.update(
        { estado: 'confirmado' },
        {
          where: {
            id_paciente: pacienteId,
            fecha: { [Op.between]: [inicioDia, finDia] },
            estado: { [Op.ne]: 'confirmado' }
          }
        }
      );

      // 5. Cambiar estado de la cama y descontar cama disponible
      const camaObj = await Cama.findByPk(req.body.cama);
      const habitacionObj = await Habitacion.findByPk(req.body.habitacion);
      if (camaObj) await camaObj.update({ estado: 'ocupada' });
      if (habitacionObj && habitacionObj.camas_disponibles > 0) {
        await habitacionObj.update({ camas_disponibles: habitacionObj.camas_disponibles - 1 });
      }

      // 6. Mensaje de éxito con ubicación
      const sectorObj = await Sector.findByPk(req.body.sector);
      const alaObj = await Ala.findByPk(req.body.ala);
      const mensaje = `¡Internación creada exitosamente! 
        Sector: ${sectorObj ? sectorObj.nombre : '-'}, 
        Ala: ${alaObj ? alaObj.ubicacion : '-'}, 
        Habitación: ${habitacionObj ? habitacionObj.codigo : '-'}, 
        Cama: ${camaObj ? camaObj.numero_cama : '-'}`;

      res.render('internacion/create', {
        mensaje,
        paciente: null,
        sectores: null,
        parentescos: null,
        seguros: null,
        motivos: null,
      });
    } catch (error) {
      console.error("Error al crear internación: " + error);
      let mensaje = 'Error al crear internación.';

      // Mensaje personalizado para código de afiliado duplicado
      if (error.name === 'SequelizeUniqueConstraintError' && error.errors) {
        const uniqueField = error.errors.find(e => e.path === 'codigo_afiliado');
        if (uniqueField) {
          mensaje = 'El código de afiliado ya está registrado para otro paciente o seguro.';
        }
      }

      if (error.issues) {
        mensaje += ' ' + error.issues.map(e => `${e.path}: ${e.message}`).join(' ');
      }

      const sectores = await Sector.findAll();
      const parentescos = await Parentesco.findAll();
      const seguros = await Seguro.findAll();
      const motivos = await Motivo.findAll();
      const paciente = await Paciente.findByPk(req.params.id, {
        include: [{ model: Persona, as: 'persona' }]
      });

      res.render('internacion/create', {
        mensaje,
        paciente,
        sectores,
        parentescos,
        seguros,
        motivos
      });
    }
  },

  // Muestra el formulario de internación por emergencia
  Create_emergencia_GET: async (req, res) => {
    try {
      const sectores = await Sector.findAll();
      res.render('internacion/create_emergencia', { sectores, mensaje: null });
    } catch (error) {
      res.render('internacion/create_emergencia', { sectores: [], mensaje: 'Error al cargar sectores.' });
    }
  },

  // Interna un paciente de emergencia (anónimo)
  Create_emergencia_POST: async (req, res) => {
    try {
      const { sexo, cama, detalle_motivo } = req.body;

      const motivoEmergencia = await Motivo.findOne({ where: { nombre: 'Emergencias y Urgencias' } });

      await Internacion.create({
        id_paciente_seguro: null,
        id_cama: cama,
        fecha_internacion: new Date(),
        estado: 'activa',
        id_motivo: motivoEmergencia ? motivoEmergencia.id : null,
        detalle_motivo: detalle_motivo || 'Sin detalles especificados',
        id_contactoEmergencia: null,
        isDesconocido: sexo === 'Masculino' ? true : false
      });

      // 5. Cambiar estado de la cama
      const camaObj = await Cama.findByPk(cama);
      if (camaObj) await camaObj.update({ estado: 'ocupada' });

      const sectores = await Sector.findAll();
      res.render('internacion/create_emergencia', {
        sectores,
        mensaje: '¡Paciente internado de emergencia exitosamente!'
      });
    } catch (error) {
      console.error(error);
      const sectores = await Sector.findAll();
      res.render('internacion/create_emergencia', {
        sectores,
        mensaje: 'Error al internar paciente de emergencia.'
      });
    }
  },

  // Muestra los detalles completos de una internación
  Details_GET: async (req, res) => {
    try {
      const { id } = req.params;
      const { SolicitudAtencion, Enfermero, Medico } = require('../models');
      
      const internacion = await Internacion.findByPk(id, {
        include: [
          {
            model: PacienteSeguro,
            include: [
              { 
                model: Paciente, as: 'paciente',
                include: [{ model: Persona, as: 'persona' }]
              },
              { model: Seguro, as: 'seguro' }
            ]
          },
          {
            model: Cama,
            include: [
              {
                model: Habitacion,
                include: [
                  {
                    model: Ala,
                    include: [{ model: Sector }]
                  }
                ]
              }
            ]
          },
          { model: Motivo },
          { 
            model: ContactoEmergencia,
            as: 'ContactoEmergencia',
            include: [
              { model: Persona, as: 'persona' },
              { model: Parentesco }
            ]
          }
        ]
      });

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Cargar solicitudes de atención
      const solicitudes = await SolicitudAtencion.findAll({
        where: { id_internacion: id },
        include: [
          {
            model: Enfermero,
            as: 'Enfermero',
            include: [{ model: Persona, as: 'persona' }]
          },
          {
            model: Medico,
            as: 'Medico',
            include: [{ model: Persona, as: 'persona' }]
          }
        ],
        order: [['fecha_solicitud', 'DESC']]
      });
      
      res.render('internacion/details', { internacion, solicitudes });
    } catch (error) {
      console.error('Error en Details_GET:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Cambiar prioridad de una internación
  CambiarPrioridad_POST: async (req, res) => {
    try {
      const { id } = req.params;
      const { prioridad } = req.body;

      // Validar que la prioridad sea válida
      if (!['baja', 'media', 'alta'].includes(prioridad)) {
        return res.status(400).send('Prioridad no válida');
      }

      const internacion = await Internacion.findByPk(id);

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Actualizar la prioridad
      await internacion.update({ prioridad });

      // Redirigir de vuelta a los detalles
      res.redirect(`/internacion/details/${id}`);
    } catch (error) {
      console.error('Error al cambiar prioridad:', error);
      res.status(500).send('Error al cambiar la prioridad');
    }
  }
};
