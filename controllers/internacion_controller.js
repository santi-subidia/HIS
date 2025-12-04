const { Paciente, Sector, Ala, Parentesco, Seguro, Motivo, Cama, Habitacion, Turno, Internacion, PacienteSeguro, ContactoEmergencia, Persona, TipoSangre, Localidad, Provincia } = require('../models');
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

      // Verificar que el contacto de emergencia no sea el mismo paciente
      if (req.body.dniContacto === req.body.dniPaciente) {
        throw new Error('El contacto de emergencia no puede ser el mismo que el paciente.');
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
  },

  // Muestra el formulario para completar datos de paciente desconocido
  CompletarDatos_GET: async (req, res) => {
    try {
      const { id } = req.params;
      
      const internacion = await Internacion.findByPk(id, {
        include: [
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
        ]
      });

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Verificar que sea una internación de emergencia (sin paciente)
      if (internacion.id_paciente_seguro !== null) {
        return res.redirect(`/internacion/details/${id}`);
      }

      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({
        include: [{ model: Provincia, as: 'provincia' }]
      });
      const seguros = await Seguro.findAll();
      const parentescos = await Parentesco.findAll();

      res.render('internacion/completar_datos', {
        internacion,
        tiposSangre,
        localidades,
        seguros,
        parentescos,
        error: null
      });
    } catch (error) {
      console.error('Error en CompletarDatos_GET:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Procesa el formulario de completar datos de paciente desconocido
  CompletarDatos_POST: async (req, res) => {
    try {
      const { id } = req.params;
      
      const internacion = await Internacion.findByPk(id);

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Verificar que sea una internación de emergencia
      if (internacion.id_paciente_seguro !== null) {
        return res.redirect(`/internacion/details/${id}`);
      }

      const {
        DNI, nombre, apellido, telefono,
        fecha_nacimiento, id_tipo_sangre, id_localidad,
        id_seguro, codigo_afiliado,
        contacto_DNI, contacto_nombre, contacto_apellido,
        contacto_telefono, id_parentesco,
        id_paciente_existente,
        id_paciente_seguro_existente,
        id_contacto_existente
      } = req.body;

      let pacienteSeguroId;
      let contactoEmergenciaId;

      // VALIDACIÓN: Verificar que el paciente no tenga internación activa
      if (id_paciente_seguro_existente) {
        const internacionActiva = await Internacion.findOne({
          where: { 
            id_paciente_seguro: parseInt(id_paciente_seguro_existente),
            estado: 'activa'
          }
        });

        if (internacionActiva) {
          throw new Error('Este paciente ya tiene una internación activa');
        }
      }

      // PARTE 1: GESTIÓN DEL PACIENTE
      
      if (id_paciente_seguro_existente) {
        // Caso 1: Ya existe PacienteSeguro completo
        pacienteSeguroId = parseInt(id_paciente_seguro_existente);
        console.log(`Usando PacienteSeguro existente: ${pacienteSeguroId}`);
        
      } else if (id_paciente_existente) {
        // Caso 2: Existe Paciente pero falta PacienteSeguro
        const paciente = await Paciente.findByPk(parseInt(id_paciente_existente));
        
        if (!paciente) {
          throw new Error('Paciente no encontrado');
        }

        // Crear PacienteSeguro
        const pacienteSeguro = await PacienteSeguro.create({
          id_paciente: paciente.id,
          id_seguro: parseInt(id_seguro),
          codigo_afiliado
        });

        pacienteSeguroId = pacienteSeguro.id;
        console.log(`PacienteSeguro creado: ${pacienteSeguroId}`);
        
      } else {
        // Caso 3: Crear todo desde cero
        
        // Determinar el sexo desde isDesconocido
        const sexo = internacion.isDesconocido === true ? 'Masculino' : 
                     internacion.isDesconocido === false ? 'Femenino' : null;

        if (!sexo) {
          throw new Error('No se pudo determinar el sexo del paciente');
        }

        // Validar campos requeridos
        if (!nombre || !apellido || !telefono || !fecha_nacimiento || !id_tipo_sangre || !id_localidad) {
          throw new Error('Faltan datos requeridos del paciente');
        }

        // Buscar o crear Persona
        let personaPaciente = await Persona.findOne({ where: { DNI } });
        
        if (!personaPaciente) {
          personaPaciente = await Persona.create({
            DNI,
            nombre,
            apellido,
            telefono
          });
          console.log(`Persona del paciente creada: ${personaPaciente.id}`);
        } else {
          console.log(`Persona del paciente ya existía: ${personaPaciente.id}`);
        }

        // Crear Paciente
        const paciente = await Paciente.create({
          id_persona: personaPaciente.id,
          sexo,
          fecha_nacimiento,
          id_tipoSangre: parseInt(id_tipo_sangre),
          id_localidad: parseInt(id_localidad)
        });
        console.log(`Paciente creado: ${paciente.id}`);

        // Crear PacienteSeguro
        const pacienteSeguro = await PacienteSeguro.create({
          id_paciente: paciente.id,
          id_seguro: parseInt(id_seguro),
          codigo_afiliado
        });

        pacienteSeguroId = pacienteSeguro.id;
        console.log(`PacienteSeguro creado: ${pacienteSeguroId}`);
      }

      // PARTE 2: GESTIÓN DEL CONTACTO DE EMERGENCIA
      
      if (id_contacto_existente) {
        // Caso 1: Contacto ya existe
        contactoEmergenciaId = parseInt(id_contacto_existente);
        console.log(`Usando ContactoEmergencia existente: ${contactoEmergenciaId}`);
        
      } else {
        // Caso 2: Crear contacto (puede reutilizar persona existente)
        
        // Buscar o crear Persona del contacto
        let personaContacto = await Persona.findOne({ where: { DNI: contacto_DNI } });
        
        if (!personaContacto) {
          personaContacto = await Persona.create({
            DNI: contacto_DNI,
            nombre: contacto_nombre,
            apellido: contacto_apellido,
            telefono: contacto_telefono
          });
          console.log(`Persona del contacto creada: ${personaContacto.id}`);
        } else {
          console.log(`Persona del contacto ya existía: ${personaContacto.id}`);
        }

        // Crear ContactoEmergencia
        const contactoEmergencia = await ContactoEmergencia.create({
          id_persona: personaContacto.id,
          id_parentesco: parseInt(id_parentesco)
        });

        contactoEmergenciaId = contactoEmergencia.id;
        console.log(`ContactoEmergencia creado: ${contactoEmergenciaId}`);
      }

      // PARTE 3: ACTUALIZAR LA INTERNACIÓN
      
      await internacion.update({
        id_paciente_seguro: pacienteSeguroId,
        id_contactoEmergencia: contactoEmergenciaId,
        isDesconocido: null // Ya no es desconocido
      });

      console.log(`Internación ${id} actualizada con paciente y contacto`);
      res.redirect(`/internacion/details/${id}`);
      
    } catch (error) {
      console.error('Error en CompletarDatos_POST:', error);
      
      const tiposSangre = await TipoSangre.findAll();
      const localidades = await Localidad.findAll({
        include: [{ model: Provincia, as: 'provincia' }]
      });
      const seguros = await Seguro.findAll();
      const parentescos = await Parentesco.findAll();

      res.render('internacion/completar_datos', {
        internacion: await Internacion.findByPk(req.params.id, {
          include: [
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
          ]
        }),
        tiposSangre,
        localidades,
        seguros,
        parentescos,
        error: error.message || 'Error al completar los datos del paciente'
      });
    }
  }
};
