const { Op } = require('sequelize');
const { Paciente, Motivo, Turno } = require("../models");

module.exports = {
  // Lista todos los turnos, actualiza los vencidos a cancelado
  listarTurnos: async (req, res) => {
    try {
      // Actualiza turnos pendientes con fecha pasada a cancelado
      await Turno.update(
        { estado: 'cancelado' },
        {
          where: {
            estado: 'pendiente',
            fecha: { [Op.lt]: new Date() }
          }
        }
      );

      // Obtiene turnos actualizados con sus relaciones
      const turnos = await Turno.findAll({
        include: [
          { model: Paciente, as: 'Paciente' },
          { model: Motivo }
        ],
        order: [['fecha', 'DESC']]
      });

      res.render("listar-turnos", {
        turnos,
        filters: req.query,
        mensaje: null
      });
    } catch (error) {
      console.error(error);
      res.render("listar-turnos", {
        turnos: [],
        filters: req.query,
        mensaje: "Error al cargar los turnos.",
      });
    }
  },

  // Muestra el formulario para crear un turno
  mostrarFormularioCrearTurno: async (req, res) => {
    try {
      const motivos = await Motivo.findAll();
      res.render("crear-turno", {
        motivos,
        valores: {},
        mensaje: null,
        exito: null,
        sugerirCrearPaciente: false
      });
    } catch (error) {
      res.render("crear-turno", {
        motivos: [],
        valores: {},
        mensaje: "Error al cargar el formulario.",
        exito: null,
        sugerirCrearPaciente: false
      });
    }
  },

  // Lógica para buscar paciente y crear turno
  crearTurno: async (req, res) => {
    const { dni, motivo, fecha, buscar, crear } = req.body;
    const motivos = await Motivo.findAll();
    const valores = { dni, motivo, fecha };

    // Si se presionó "Buscar paciente"
    if (buscar) {
      // Validación de DNI
      if (!dni || !/^\d{7,9}$/.test(dni)) {
        return res.render("crear-turno", {
          motivos,
          valores,
          mensaje: "DNI inválido.",
          exito: null,
          paciente: null,
          sugerirCrearPaciente: false
        });
      }
      // Buscar paciente por DNI
      const paciente = await Paciente.findOne({ where: { DNI: dni } });
      if (!paciente) {
        return res.render("crear-turno", {
          motivos,
          valores,
          mensaje: null,
          exito: null,
          paciente: null,
          sugerirCrearPaciente: true
        });
      }
      // Paciente encontrado, mostrar campos para crear turno
      return res.render("crear-turno", {
        motivos,
        valores,
        mensaje: null,
        exito: null,
        paciente,
        sugerirCrearPaciente: false
      });
    }

    // Si se presionó "Crear Turno"
    if (crear) {
      const errors = [];
      // Validaciones
      if (!dni || !/^\d{7,9}$/.test(dni)) errors.push("DNI inválido.");
      if (!motivo) errors.push("Debe seleccionar un motivo.");
      if (!fecha || isNaN(Date.parse(fecha))) {
        errors.push("Fecha inválida.");
      } else if (new Date(fecha) < new Date()) {
        errors.push("La fecha del turno debe ser futura.");
      }

      const paciente = await Paciente.findOne({ where: { DNI: dni } });
      if (!paciente) {
        return res.render("crear-turno", {
          motivos,
          valores,
          mensaje: null,
          exito: null,
          paciente: null,
          sugerirCrearPaciente: true
        });
      }

      if (errors.length > 0) {
        return res.render("crear-turno", {
          motivos,
          valores,
          mensaje: errors.join(" "),
          exito: null,
          paciente,
          sugerirCrearPaciente: false
        });
      }

      // Crear el turno
      await Turno.create({
        fecha,
        id_paciente: paciente.id,
        id_motivo: motivo,
        estado: "pendiente"
      });

      return res.render("crear-turno", {
        motivos,
        valores: {},
        mensaje: null,
        exito: "Turno creado exitosamente.",
        paciente: null,
        sugerirCrearPaciente: false
      });
    }

    // Render por defecto si no se presionó ningún botón
    res.render("crear-turno", {
      motivos,
      valores: {},
      mensaje: null,
      exito: null,
      paciente: null,
      sugerirCrearPaciente: false
    });
  }
};
