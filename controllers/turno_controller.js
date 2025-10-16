const { Op, IndexHints } = require('sequelize');
const { Paciente, Motivo, Turno, Persona } = require("../models");
const { Create_GET } = require('./paciente_controller');

module.exports = {
  // Lista todos los turnos, actualiza los vencidos a cancelado
  Index: async (req, res) => {
    try {
      // Actualiza turnos pendientes con fecha pasada a cancelado
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      await Turno.update(
        { estado: 'cancelado' },
        {
          where: {
            estado: 'pendiente',
            fecha: { [Op.lt]: hoy }
          }
        }
      );

      // Filtros
      const dni = req.query.dni ? req.query.dni.trim() : undefined;
      const nombre = req.query.nombre ? req.query.nombre.trim() : undefined;
      const fecha = req.query.fecha ? req.query.fecha.trim() : undefined;
      const whereTurno = {};

      if (fecha) {
        // Filtra por fecha exacta (solo día)
        whereTurno.fecha = {
          [Op.gte]: new Date(fecha + 'T00:00:00'),
          [Op.lt]: new Date(fecha + 'T23:59:59')
        };
      }


      // Construir filtros anidados correctamente
      let wherePersona = {};
      if (dni) {
        wherePersona.DNI = dni;
      }
      if (nombre) {
        wherePersona.nombre = { [Op.like]: `%${nombre}%` };
      }

      // Obtiene turnos actualizados con sus relaciones y filtros
      const includeOptions = [
        {
          model: Paciente,
          as: 'Paciente',
          include: [{ 
            model: Persona, 
            as: 'persona',
            where: Object.keys(wherePersona).length ? wherePersona : undefined
          }],
          required: true
        },
        { model: Motivo }
      ];

      const turnos = await Turno.findAll({
        where: whereTurno,
        include: includeOptions,
        order: [['fecha', 'DESC']]
      });

      res.render("turno/index", {
        turnos,
        filters: req.query,
        mensaje: null
      });
    } catch (error) {
      console.error("Error al cargar los turnos:", error);
      res.render("turno/index", {
        turnos: [],
        filters: req.query,
        mensaje: "Error al cargar los turnos.",
      });
    }
  },

  // Muestra el formulario para crear un turno
  Create_GET: async (req, res) => {
    try {
      const motivos = await Motivo.findAll();
      res.render("turno/create", {
        motivos,
        valores: {},
        mensaje: null,
        exito: null,
        sugerirCrearPaciente: false
      });
    } catch (error) {
      console.error("Error al cargar el formulario:", error);
      res.render("turno/create", {
        motivos: [],
        valores: {},
        mensaje: "Error al cargar el formulario.",
        exito: null,
        sugerirCrearPaciente: false
      });
    }
  },

  // Lógica para buscar paciente y crear turno
  Create_POST: async (req, res) => {
    const { dni, motivo, fecha, buscar, crear } = req.body;
    const motivos = await Motivo.findAll();
    const valores = { dni, motivo, fecha };

    // Si se presionó "Buscar paciente"
    if (buscar) {
      // Validación de DNI
      if (!dni || !/^\d{7,9}$/.test(dni)) {
        return res.render("turno/create", {
          motivos,
          valores,
          mensaje: "DNI inválido.",
          exito: null,
          paciente: null,
          sugerirCrearPaciente: false
        });
      }
      // Buscar paciente por DNI
      const paciente = await Paciente.findOne({
        include: [{ model: Persona, as: 'persona' }],
        where: { '$persona.DNI$': dni }
      });
      if (!paciente) {
        return res.render("turno/create", {
          motivos,
          valores,
          mensaje: null,
          exito: null,
          paciente: null,
          sugerirCrearPaciente: true
        });
      }
      // Paciente encontrado, mostrar campos para crear turno
      return res.render("turno/create", {
        motivos,
        valores,
        mensaje: null,
        exito: null,
        paciente,
        sugerirCrearPaciente: false
      });
    }

    // Si se presionó "Crear turno"
    if (crear) {
      const errors = [];
      // Validaciones
      if (!dni || !/^\d{7,9}$/.test(dni)) errors.push("DNI inválido.");
      if (!motivo) errors.push("Debe seleccionar un motivo.");
      if (!fecha || isNaN(Date.parse(fecha))) {
        errors.push("Fecha inválida.");
      } else {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaTurno = new Date(fecha);
        fechaTurno.setHours(0, 0, 0, 0);
        if (fechaTurno < hoy) {
          errors.push("La fecha del turno no puede ser pasada.");
        }
      }

      const paciente = await Paciente.findOne({
        include: [{ model: Persona, as: 'persona' }],
        where: { '$persona.DNI$': dni }
      });
      if (!paciente) {
        return res.render("turno/create", {
          motivos,
          valores,
          mensaje: null,
          exito: null,
          paciente: null,
          sugerirCrearPaciente: true
        });
      }

      if (errors.length > 0) {
        return res.render("turno/create", {
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

      return res.render("turno/create", {
        motivos,
        valores: {},
        mensaje: null,
        exito: "Turno creado exitosamente.",
        paciente: null,
        sugerirCrearPaciente: false
      });
    }

    // Render por defecto si no se presionó ningún botón
    res.render("turno/create", {
      motivos,
      valores: {},
      mensaje: null,
      exito: null,
      paciente: null,
      sugerirCrearPaciente: false
    });
  }
};
