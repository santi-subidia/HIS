const { Turno } = require('../models');

module.exports = {
  up: async () => {
    const turnos = [
      {
        id: 1,
        fecha: '2025-06-12T09:00:00',
        estado: 'pendiente',
        id_paciente: 5,
        id_motivo: 1
      },
      {
        id: 2,
        fecha: '2025-06-15T10:00:00',
        estado: 'pendiente',
        id_paciente: 6,
        id_motivo: 2
      },
      {
        id: 3,
        fecha: '2025-06-20T11:00:00',
        estado: 'pendiente',
        id_paciente: 7,
        id_motivo: 2
      }
    ];

    for (const turno of turnos) {
      await Turno.findOrCreate({
        where: { id: turno.id },
        defaults: turno
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('turnos', null, {});
  }
};