const { Ala, Habitacion, Cama, Internacion, PacienteSeguro, Paciente, ContactoEmergencia } = require('../models');


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
      // 1. Buscar habitaciones dobles con una sola cama disponible
      const habitacionesFiltradas = await Habitacion.findAll({
        where: { id_ala: ala, capacidad: 2, camas_disponibles: 1 },
        include: [{ model: Cama, required: true }]
      });

      // 2. Identificar habitaciones donde la cama ocupada tiene un paciente de sexo distinto
      const habitacionesNoVanIds = [];
      for (const habitacion of habitacionesFiltradas) {
        const camaOcupada = habitacion.Camas.find(c => c.estado === 'ocupada');
        if (!camaOcupada) continue;

        const internacion = await Internacion.findOne({
          where: { id_cama: camaOcupada.id, estado: 'activa' },
          include: [{
            model: PacienteSeguro,
            include: [{ model: Paciente, as: 'paciente' }]
          }]
        });

        const paciente = internacion?.PacienteSeguro?.paciente;
        if (paciente && String(paciente.sexo) !== String(sexo)) {
          habitacionesNoVanIds.push(habitacion.id);
        }
      }

      // 3. Obtener todas las habitaciones del ala con sus camas
      const todasHabitaciones = await Habitacion.findAll({
        where: { id_ala: ala },
        include: [{ model: Cama }]
      });

      // 4. Filtrar habitaciones que sí van y tengan al menos una cama disponible
      const habitacionesDisponibles = todasHabitaciones.filter(
        h => !habitacionesNoVanIds.includes(h.id) && h.camas_disponibles > 0
      );

      res.json({ habitacionesDisponibles });
    } catch (error) {
      console.error('Error al obtener habitaciones:', error);
      res.status(500).json({ error: 'Error al obtener habitaciones' });
    }
  },

  buscarPaciente: async (req, res ) => {
    const { dni } = req.params;
    try {
      const paciente = await Paciente.findOne({ where: { DNI: dni } });
      if (!paciente) {
        return res.json({ existe: false });
      }
      res.json({
        existe: true,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        sexo: paciente.sexo,
        fechaNacimiento: paciente.fechaNacimiento,
        tipoSangre: paciente.tipoSangre,
        domicilio: paciente.domicilio,
        localidad: paciente.id_localidad,
        nro_Telefono: paciente.nro_Telefono,

      });
    } catch (error) {
      console.error('Error al verificar paciente:', error);
      res.status(500).json({ error: 'Error al verificar paciente' });
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
