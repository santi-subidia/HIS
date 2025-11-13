const { Internacion, PacienteSeguro, Paciente, Persona, Cama, Habitacion, Ala, Sector, Motivo, Turno, SolicitudAtencion, Enfermero } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // Dashboard Médico - Todas las internaciones activas
  Medico_GET: async (req, res) => {
    try {
      const internaciones = await Internacion.findAll({
        where: { estado: 'activa' },
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
            as: 'Cama',
            include: [{
              model: Habitacion,
              as: 'Habitacion',
              include: [{
                model: Ala,
                as: 'Ala',
                include: [{
                  model: Sector,
                  as: 'Sector'
                }]
              }]
            }]
          },
          {
            model: Motivo,
            as: 'Motivo'
          }
        ],
        order: [['prioridad', 'DESC'], ['fecha_internacion', 'ASC']]
      });

      // Obtener solicitudes de atención pendientes
      const solicitudesPendientes = await SolicitudAtencion.findAll({
        where: { estado: 'Pendiente' },
        include: [
          {
            model: Internacion,
            as: 'Internacion',
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
                as: 'Cama',
                include: [{
                  model: Habitacion,
                  as: 'Habitacion'
                }]
              }
            ]
          },
          {
            model: Enfermero,
            as: 'Enfermero',
            include: [{
              model: Persona,
              as: 'persona'
            }]
          }
        ],
        order: [['fecha_solicitud', 'ASC']]
      });

      // Debug: ver qué campos tiene la solicitud
      if (solicitudesPendientes.length > 0) {
        console.log('Primera solicitud keys:', Object.keys(solicitudesPendientes[0].dataValues));
      }

      res.render('dashboard/medico', {
        title: 'Dashboard Médico',
        internaciones,
        solicitudesPendientes,
        totalInternaciones: internaciones.length,
        prioridadAlta: internaciones.filter(i => i.prioridad === 'alta').length,
        prioridadMedia: internaciones.filter(i => i.prioridad === 'media').length,
        prioridadBaja: internaciones.filter(i => i.prioridad === 'baja').length
      });

    } catch (error) {
      console.error('Error en dashboard médico:', error);
      res.status(500).send('Error al cargar el dashboard');
    }
  },

  // Dashboard Enfermero - Todas las internaciones activas
  Enfermero_GET: async (req, res) => {
    try {
      const internaciones = await Internacion.findAll({
        where: { estado: 'activa' },
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
            as: 'Cama',
            include: [{
              model: Habitacion,
              as: 'Habitacion',
              include: [{
                model: Ala,
                as: 'Ala',
                include: [{
                  model: Sector,
                  as: 'Sector'
                }]
              }]
            }]
          },
          {
            model: Motivo,
            as: 'Motivo'
          }
        ],
        order: [['prioridad', 'DESC'], ['fecha_internacion', 'ASC']]
      });

      res.render('dashboard/enfermero', {
        title: 'Dashboard Enfermero',
        internaciones,
        totalInternaciones: internaciones.length,
        prioridadAlta: internaciones.filter(i => i.prioridad === 'alta').length,
        prioridadMedia: internaciones.filter(i => i.prioridad === 'media').length,
        prioridadBaja: internaciones.filter(i => i.prioridad === 'baja').length
      });

    } catch (error) {
      console.error('Error en dashboard enfermero:', error);
      res.status(500).send('Error al cargar el dashboard');
    }
  },

  // Dashboard Recepcionista - Turnos del día
  Recepcionista_GET: async (req, res) => {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const mañana = new Date(hoy);
      mañana.setDate(mañana.getDate() + 1);

      const turnosHoy = await Turno.findAll({
        where: {
          fecha: {
            [Op.gte]: hoy,
            [Op.lt]: mañana
          }
        },
        include: [
          {
            model: Paciente,
            as: 'Paciente',
            include: [{
              model: Persona,
              as: 'persona'
            }]
          },
          {
            model: Motivo
          }
        ],
        order: [['fecha', 'ASC']]
      });

      const totalTurnos = await Turno.count();
      const turnosPendientes = turnosHoy.filter(t => t.estado === 'Pendiente').length;
      const turnosAtendidos = turnosHoy.filter(t => t.estado === 'Atendido').length;

      res.render('dashboard/recepcionista', {
        title: 'Dashboard Recepcionista',
        turnosHoy,
        totalTurnos,
        turnosPendientes,
        turnosAtendidos,
        fechaHoy: hoy.toLocaleDateString('es-AR')
      });

    } catch (error) {
      console.error('Error en dashboard recepcionista:', error);
      res.status(500).send('Error al cargar el dashboard');
    }
  },

  // Dashboard Admin - Estadísticas generales
  Admin_GET: async (req, res) => {
    try {
      const { Paciente, Medico, Enfermero, Usuario, Alta, Solicitud_medica } = require('../models');

      // Estadísticas generales
      const totalPacientes = await Paciente.count();
      const totalMedicos = await Medico.count();
      const totalEnfermeros = await Enfermero.count();
      const totalUsuarios = await Usuario.count();

      // Internaciones
      const internacionesActivas = await Internacion.count({ where: { estado: 'activa' } });
      const totalInternaciones = await Internacion.count();
      
      // Altas
      const totalAltas = await Alta.count();
      const altasHoy = await Alta.count({
        where: {
          fecha_alta: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });

      // Estudios médicos
      const estudiosPendientes = await Solicitud_medica.count({
        where: { fecha_completado: null }
      });

      // Turnos
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const mañana = new Date(hoy);
      mañana.setDate(mañana.getDate() + 1);
      
      const turnosHoy = await Turno.count({
        where: {
          fecha_turno: {
            [Op.gte]: hoy,
            [Op.lt]: mañana
          }
        }
      });

      res.render('dashboard/admin', {
        title: 'Dashboard Administrador',
        stats: {
          totalPacientes,
          totalMedicos,
          totalEnfermeros,
          totalUsuarios,
          internacionesActivas,
          totalInternaciones,
          totalAltas,
          altasHoy,
          estudiosPendientes,
          turnosHoy
        }
      });

    } catch (error) {
      console.error('Error en dashboard admin:', error);
      res.status(500).send('Error al cargar el dashboard');
    }
  }
};
