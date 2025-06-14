const { Paciente, Sector, Ala, Parentesco, Seguro, Motivo, Cama, Habitacion, Turno, Internacion, PacienteSeguro, ContactoEmergencia } = require('../models');
const { contactoEmergenciaSchema } = require('../schemas/contactoEmergencia_schema');
const { pacienteSeguroSchema } = require('../schemas/pacienteSeguro_schema');
const { internacionSchema } = require('../schemas/internacion_schema');
const { Op } = require('sequelize');

// Utilidad: genera un id negativo único para paciente desconocido
async function generarIdPacienteDesconocido() {
  const minPaciente = await Paciente.min('id', { where: { id: { [Op.lt]: 0 } } });
  return minPaciente ? minPaciente - 1 : -1;
}

// Utilidad: genera un DNI anónimo pequeño y único
async function generarDNIAnonimoPequeno() {
  const maxDNI = await Paciente.max('DNI', { where: { DNI: { [Op.lt]: '1000000' } } });
  let nuevoDNI = 1;
  if (maxDNI && !isNaN(Number(maxDNI))) {
    nuevoDNI = Number(maxDNI) + 1;
    if (nuevoDNI >= 1000000) nuevoDNI = 1;
  }
  return nuevoDNI.toString().padStart(7, '0');
}

module.exports = {

  // Lista todas las internaciones activas con sus relaciones
  listarInternaciones: async (req, res) => {
    try {
      const internaciones = await Internacion.findAll({
        include: [
          {
            model: PacienteSeguro,
            include: [{ model: Paciente, as: 'paciente' }]
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
      res.render('listar-internaciones', { internaciones, mensaje: null });
    } catch (error) {
      console.error('Error al listar internaciones:', error);
      res.render('listar-internaciones', { internaciones: [], mensaje: 'Error al listar internaciones.' });
    }
  },

  // Muestra el formulario de registro de internación
  mostrarFormularioRegistro: async (req, res) => {
    res.render('internacion-paciente', {
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
    const paciente = await Paciente.findOne({ where: { DNI: dni } });

    if (!paciente) {
      return res.render('internacion-paciente', {
        mensaje: 'Paciente no encontrado.',
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

      const mensaje = `${paciente.nombre} ${paciente.apellido} ya tiene una internación activa.
      Sector: ${sectorObj ? sectorObj.nombre : '-'},
      Ala: ${alaObj ? alaObj.ubicacion : '-'},
      Habitación: ${habitacionObj ? habitacionObj.codigo : '-'},
      Cama: ${camaObj ? camaObj.nroCama : '-'}`;

      return res.render('internacion-paciente', {
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

    res.render('internacion-paciente', {
      mensaje: null,
      paciente,
      sectores,
      parentescos,
      seguros,
      motivos
    });
  },

  // Crea una nueva internación
  crearInternacion: async (req, res) => {
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

        return res.render('internacion-paciente', {
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
      const contactoData = contactoEmergenciaSchema.parse({
        DNI_contacto: req.body.dniContacto,
        nombre: req.body.nombreContacto,
        apellido: req.body.apellidoContacto,
        telefono: req.body.telefonoContacto,
        id_parentesco: req.body.parentescoContacto
      });
      const [contacto] = await ContactoEmergencia.findOrCreate({
        where: { DNI_contacto: contactoData.DNI_contacto },
        defaults: contactoData
      });
      await contacto.update(contactoData);

      const paciente = await Paciente.findOne({
        where: { DNI: req.body.dniContacto }
      });
      if (paciente) {
        await paciente.update({
          nombre: req.body.nombreContacto,
          apellido: req.body.apellidoContacto,
          nro_Telefono: req.body.telefonoContacto
        });
      }

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
        fechaInternacion: new Date().toISOString(),
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
        Cama: ${camaObj ? camaObj.nroCama : '-'}`;

      res.render('internacion-paciente', {
        mensaje,
        paciente: null,
        sectores: null,
        parentescos: null,
        seguros: null,
        motivos: null,
      });
    } catch (error) {
      console.error(error);
      let mensaje = 'Error al crear internación.';
      if (error.issues) {
        mensaje += ' ' + error.issues.map(e => `${e.path}: ${e.message}`).join(' ');
      }
      const sectores = await Sector.findAll();
      const parentescos = await Parentesco.findAll();
      const seguros = await Seguro.findAll();
      const motivos = await Motivo.findAll();
      const paciente = await Paciente.findByPk(req.params.id);
      res.render('internacion-paciente', {
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
  mostrarFormularioEmergencia: async (req, res) => {
    try {
      const sectores = await Sector.findAll();
      res.render('internacion-emergencia', { sectores, mensaje: null });
    } catch (error) {
      res.render('internacion-emergencia', { sectores: [], mensaje: 'Error al cargar sectores.' });
    }
  },

  // Interna un paciente de emergencia (anónimo)
  internarEmergencia: async (req, res) => {
    try {
      const { sexo, habitacion, cama } = req.body;
      // 1. Generar id negativo y DNI anónimo pequeño
      const nuevoId = await generarIdPacienteDesconocido();
      const anonDNI = await generarDNIAnonimoPequeno();

      // 2. Crear paciente anónimo
      const [paciente] = await Paciente.findOrCreate({
        where: { DNI: anonDNI },
        defaults: {
          id: nuevoId,
          nombre: 'Desconocido',
          apellido: 'Desconocido',
          sexo,
          fechaNacimiento: new Date('1900-01-01'),
          id_tipoSangre: 1,
          domicilio: '',
          nro_Telefono: '0000000',
          id_localidad: 1
        }
      });

      // 3. Crear o buscar PacienteSeguro anónimo
      const [pacienteSeguro] = await PacienteSeguro.findOrCreate({
        where: {
          id_paciente: paciente.id,
          id_seguro: 1,
          codigo_afiliado: paciente.DNI
        },
        defaults: {
          id: nuevoId,
          id_paciente: paciente.id,
          id_seguro: 1,
          codigo_afiliado: paciente.DNI,
          fecha_desde: new Date(),
          estado: 'activo'
        }
      });

      // 4. Crear la internación usando el id de PacienteSeguro
      await Internacion.create({
        id_paciente_seguro: pacienteSeguro.id,
        id_cama: cama,
        fechaInternacion: new Date(),
        estado: 'activa',
        id_motivo: 1,
        id_contactoEmergencia: 1
      });

      // 5. Cambiar estado de la cama y restar 1 a camas_disponibles
      const camaObj = await Cama.findByPk(cama);
      if (camaObj) await camaObj.update({ estado: 'ocupada' });
      const habitacionObj = await Habitacion.findByPk(habitacion);
      if (habitacionObj && habitacionObj.camas_disponibles > 0) {
        await habitacionObj.update({ camas_disponibles: habitacionObj.camas_disponibles - 1 });
      }

      const sectores = await Sector.findAll();
      res.render('internacion-emergencia', {
        sectores,
        mensaje: '¡Paciente internado de emergencia exitosamente!'
      });
    } catch (error) {
      console.error(error);
      const sectores = await Sector.findAll();
      res.render('internacion-emergencia', {
        sectores,
        mensaje: 'Error al internar paciente de emergencia.'
      });
    }
  }
};