// controllers/internacionController.js
const { Paciente ,Sector, Ala, Parentesco, Seguro, Motivo } = require('../models');
const { ContactoEmergencia, PacienteSeguro, Internacion } = require('../models');
const { contactoEmergenciaSchema } = require('../schemas/contactoEmergencia_schema');
const { pacienteSeguroSchema } = require('../schemas/pacienteSeguro_schema');
const { internacionSchema } = require('../schemas/internacion_schema');

function calcularEstado(fecha_hasta) {
  if (!fecha_hasta) return 'activo';
  const ahora = new Date();
  const hasta = new Date(fecha_hasta);
  return hasta < ahora ? 'inactivo' : 'activo';
}

module.exports={
    
    mostrarFormularioRegistro: async (req, res) => {
      res.render('internacion-paciente', {
        mensaje: null,
        paciente: null,
        sectores:null,
        alas:null,
        parentescos:null,
        seguros:null,
        motivos:null
      });
    },

    buscarPacientePorDNI: async (req, res) => {
        const { dni } = req.body;

        // Busca paciente por DNI
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

        // Verifica si ya tiene una internación activa
        const internacionActiva = await Internacion.findOne({
          include: [{
            model: require('../models').PacienteSeguro,
            where: { id_paciente: paciente.id }
          }],
          where: { estado: 'activa' }
        });

        if (internacionActiva) {
          // Buscar la cama
          const camaObj = await require('../models').Cama.findByPk(internacionActiva.id_cama);
          // Buscar la habitación a la que pertenece la cama
          const habitacionObj = camaObj ? await require('../models').Habitacion.findByPk(camaObj.id_habitacion) : null;
          // Buscar el ala a la que pertenece la habitación
          const alaObj = habitacionObj ? await Ala.findByPk(habitacionObj.id_ala) : null;
          // Buscar el sector al que pertenece el ala
          const sectorObj = alaObj ? await Sector.findByPk(alaObj.id_sector) : null;

          const mensaje = `El/La paciente ${paciente.nombre} ${paciente.apellido} ya tiene una internación activa.
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

        const sectores = await Sector.findAll();
        const alas = await Ala.findAll();
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

    crearInternacion: async (req, res) => {
        try {
            // 0. Controlar si el paciente ya tiene una internación activa
            const pacienteId = Number(req.params.id);
            const internacionActiva = await Internacion.findOne({
                include: [{
                    model: PacienteSeguro,
                    where: { id_paciente: pacienteId }
                }],
                where: { estado: 'activa' }
            });

            if (internacionActiva) {
                // Buscar la cama y ubicación para el mensaje
                const camaObj = await require('../models').Cama.findByPk(internacionActiva.id_cama);
                const habitacionObj = camaObj ? await require('../models').Habitacion.findByPk(camaObj.id_habitacion) : null;
                const alaObj = habitacionObj ? await Ala.findByPk(habitacionObj.id_ala) : null;
                const sectorObj = alaObj ? await Sector.findByPk(alaObj.id_sector) : null;

                const mensaje = `El paciente ya tiene una internación activa.
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
            }

          // 1. Parsear datos de contacto y pacienteSeguro
          const contactoData = contactoEmergenciaSchema.parse({
            DNI_contacto: req.body.dniContacto,
            nombre: req.body.nombreContacto,
            apellido: req.body.apellidoContacto,
            telefono: req.body.telefonoContacto,
            id_parentesco: req.body.parentescoContacto // debe ser el ID
          });
          
          const pacienteSeguroData = pacienteSeguroSchema.parse({
            id_paciente: Number(req.params.id),
            id_seguro: Number(req.body.seguro),
            codigo_afiliado: req.body.codigo_afiliado,
            fecha_desde: req.body.fecha_desde,
            fecha_hasta: req.body.fecha_hasta,
          });
    
          // 2. Crear o actualizar contacto
          const [contacto, createdContacto] = await ContactoEmergencia.findOrCreate({
            where: { DNI_contacto: contactoData.DNI_contacto },
            defaults: contactoData
          });
    
          if (!createdContacto) {
            // Si ya existía, actualiza los datos con los nuevos valores
            await contacto.update(contactoData);
          }
          
          // 3. Crear o actualizar pacienteSeguro
          if (pacienteSeguroData.fecha_hasta === '') {
            pacienteSeguroData.fecha_hasta = null;
          }
    
          pacienteSeguroData.estado = calcularEstado(pacienteSeguroData.fecha_hasta);
    
          const [pacienteSeguro, createdSeguro] = await PacienteSeguro.findOrCreate({
            where: {
              id_paciente: pacienteSeguroData.id_paciente,
              id_seguro: pacienteSeguroData.id_seguro,
              codigo_afiliado: pacienteSeguroData.codigo_afiliado
            },
            defaults: pacienteSeguroData
          });
          
          if (!createdSeguro) {
            // Si ya existía, actualiza los datos con los nuevos valores
            await pacienteSeguro.update(pacienteSeguroData);
          }
          
          // 4. Armar internacionData with the correct names and types
          const internacionData = internacionSchema.parse({
            id_paciente_seguro: pacienteSeguro.id, // ID del pacienteSeguro creado/obtenido antes
            id_cama: Number(req.body.cama),
            id_motivo: Number(req.body.motivo),
            detalle_motivo: req.body.detalle || undefined,
            id_contactoEmergencia: contacto.id, // ID del contacto creado/obtenido antes
            fechaInternacion: new Date().toISOString(), // O la fecha que corresponda
            estado: 'activa' // Estado inicial
          });

          // 5. Crear la internación
          const nuevaInternacion = await Internacion.create(internacionData);

          // 6. Cambiar el estado de la cama a "ocupada"
          await camaObj.update({ estado: 'ocupada' });

          // 7. Restar 1 a camas_disponibles de la habitación
          if (habitacionObj.camas_disponibles > 0) {
            await habitacionObj.update({ camas_disponibles: habitacionObj.camas_disponibles - 1 });
          }

          // Buscar los datos para el mensaje
          const sectorObj = await Sector.findByPk(req.body.sector);
          const alaObj = await Ala.findByPk(req.body.ala);
          const habitacionObj = await require('../models').Habitacion.findByPk(req.body.habitacion);
          const camaObj = await require('../models').Cama.findByPk(req.body.cama);

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

      mostrarTurnosInternacion: async (req, res) => {
        try {
            // Puedes agregar filtros por query si lo deseas
            const where = {};
            if (req.query.dni) {
                where['$paciente.DNI$'] = req.query.dni;
            }
            if (req.query.nombre) {
                where['$paciente.nombre$'] = { [require('sequelize').Op.like]: `%${req.query.nombre}%` };
            }
            if (req.query.fecha) {
                where.fecha = req.query.fecha;
            }

            // Asume que tienes un modelo Turno y Paciente asociado como 'paciente'
            const turnos = await require('../models').Turno.findAll({
                where,
                include: [{
                    model: require('../models').Paciente,
                    as: 'Paciente' // <-- Corrige aquí
                }]
            });

            res.render('internacion-turnos', {
                turnos,
                filters: req.query
            });
        } catch (error) {
            console.error(error);
            res.render('internacion-turnos', {
                turnos: [],
                filters: req.query,
                mensaje: 'Error al cargar los turnos.'
            });
        }
    }
}