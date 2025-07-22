const { Turno, Paciente, Persona } = require('../models');

module.exports = {
  up: async () => {
    // Relacionar cada turno con el paciente correcto usando el DNI
    const turnos = [
      {
        id: 1,
        fecha: '2025-06-12T09:00:00',
        estado: 'pendiente',
        pacienteDNI: '56789012', // Martín Sosa
        id_motivo: 1
      },
      {
        id: 2,
        fecha: '2025-06-15T10:00:00',
        estado: 'pendiente',
        pacienteDNI: '67890123', // Ana López
        id_motivo: 2
      },
      {
        id: 3,
        fecha: '2025-06-20T11:00:00',
        estado: 'pendiente',
        pacienteDNI: '78901234', // Javier Ramírez
        id_motivo: 2
      }
    ];

    for (const turno of turnos) {
      // Buscar la persona por DNI
      const persona = await Persona.findOne({ where: { DNI: turno.pacienteDNI } });
      if (!persona) continue;
      // Buscar el paciente por id_persona
      const paciente = await Paciente.findOne({ where: { id_persona: persona.id } });
      if (!paciente) continue;

      await Turno.findOrCreate({
        where: { id: turno.id },
        defaults: {
          id: turno.id,
          fecha: turno.fecha,
          estado: turno.estado,
          id_paciente: paciente.id,
          id_motivo: turno.id_motivo
        }
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('turnos', null, {});
  }
};