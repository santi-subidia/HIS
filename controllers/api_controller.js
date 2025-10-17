const { Ala, Habitacion, Cama, Internacion, PacienteSeguro, Paciente, ContactoEmergencia, Persona } = require('../models');


module.exports = {

  // Devuelve todas las alas de un sector
  mostrarAlas: async (req, res) => {
    const sector = req.query.sector;
    try {
      const alas = await Ala.findAll({ where: { id_sector: sector } });
      res.json({ alas });
    } catch (error) {
      console.error('Error al obtener alas:', error);
      res.status(500).json({ error: 'Error al obtener alas' });
    }
  },

  // Devuelve habitaciones disponibles en un ala, filtrando por sexo del paciente
  mostrarHabitaciones: async (req, res) => {
    const { ala, sexo } = req.query;
    try {
      // 1. Obtener todas las habitaciones del ala con sus camas
      const todasHabitaciones = await Habitacion.findAll({
        where: { id_ala: ala },
        include: [{ model: Cama }]
      });

      const habitacionesDisponibles = [];

      // 2. Evaluar cada habitación
      for (const habitacion of todasHabitaciones) {
        const camasDisponibles = habitacion.Camas.filter(c => c.estado === 'disponible');
        const camasOcupadas = habitacion.Camas.filter(c => c.estado === 'ocupada');

        // Si no hay camas disponibles, saltar esta habitación
        if (camasDisponibles.length === 0) continue;

        // Si todas las camas están disponibles, la habitación está libre
        if (camasOcupadas.length === 0) {
          habitacionesDisponibles.push(habitacion);
          continue;
        }

        // Si hay camas ocupadas, verificar compatibilidad de sexo
        let sexoCompatible = true;
        for (const camaOcupada of camasOcupadas) {
          const internacion = await Internacion.findOne({
            where: { id_cama: camaOcupada.id, estado: 'activa' },
            include: [{
              model: PacienteSeguro,
              include: [{ 
                model: Paciente, 
                as: 'paciente'
              }]
            }]
          });

          const paciente = internacion?.PacienteSeguro?.paciente;
          // Si el sexo del paciente internado es diferente al nuevo paciente, no es compatible
          if (paciente && String(paciente.sexo) !== String(sexo)) {
            sexoCompatible = false;
            break;
          }
        }

        // Solo agregar si hay compatibilidad de sexo
        if (sexoCompatible) {
          habitacionesDisponibles.push(habitacion);
        }
      }

      res.json({ habitacionesDisponibles });
    } catch (error) {
      console.error('Error al obtener habitaciones:', error);
      res.status(500).json({ error: 'Error al obtener habitaciones' });
    }
  },

  buscarPersona: async (req, res) => {
    const dni = req.params.dni.replace(/\D/g, ''); // Eliminar caracteres no numéricos
    if (!/^\d{7,9}$/.test(dni)) {
      return res.status(400).json({ error: 'DNI inválido' });
    }

    try {
      const persona = await Persona.findOne({ where: { DNI: dni } });
      if (!persona) {
        return res.json({ existe: false });
      }
      res.json({
        existe: true,
        id_persona: persona.id,
        nombre: persona.nombre,
        apellido: persona.apellido,
        telefono: persona.telefono,
      });
    } catch (error) {
      console.error('Error al buscar persona:', error);
      res.status(500).json({ error: 'Error al buscar persona' });
    }
  },

  buscarPaciente: async (req, res ) => {
    const id_persona = req.params.id;
    try {
      const paciente = await Paciente.findOne({ where: { id: id_persona } });
      if (!paciente) {
        return res.json({ existe: false });
      }
      res.json({
        existe: true,
        id: paciente.id,
        fecha_nacimiento: paciente.fecha_nacimiento,
        sexo: paciente.sexo,
        tipoSangre: paciente.tipoSangre,
        domicilio: paciente.domicilio,
        localidad: paciente.id_localidad,
        fecha_eliminacion: paciente.fecha_eliminacion
      });
    } catch (error) {
      console.error('Error al verificar paciente:', error);
      res.status(500).json({ error: 'Error al verificar paciente' });
    }
  },

  reactivarPaciente: async (req, res) => {
    const id = req.params.id;
    try {
      const paciente = await Paciente.findOne({ where: { id } });
      if (!paciente) {
        return res.json({ existe: false });
      }

      // Reactivar paciente
      paciente.fecha_eliminacion = null;
      await paciente.save();

      res.json({ existe: true, exito: true });
    } catch (error) {
      console.error('Error al reactivar paciente:', error);
      res.status(500).json({ error: 'Error al reactivar paciente' });
    }
  },

  buscarContactoEmergencia: async (req, res) => {
    const { dni } = req.params;
    try {
      const contacto = await ContactoEmergencia.findOne({ where: { DNI_contacto: dni } });
      if (!contacto) {
        return res.json({ existe: false });
      }
      res.json({
        existe: true,
        nombre: contacto.nombre,
        apellido: contacto.apellido,
        telefono: contacto.telefono,
      });
    } catch (error) {
      console.error('Error al verificar contacto de emergencia:', error);
      res.status(500).json({ error: 'Error al verificar contacto de emergencia' });
    }
  }
};
