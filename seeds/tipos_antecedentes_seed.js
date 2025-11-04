const { Tipo } = require('../models');

module.exports = {
  up: async () => {
    const tipos = [
      // Tipos para Antecedentes Médicos
      { nombre: 'Alergias' },
      { nombre: 'Cirugías' },
      { nombre: 'Enfermedades Previas' },
      { nombre: 'Antecedentes Familiares' },
      // Tipos para Planes de Cuidado
      { nombre: 'Transitorio' },
      { nombre: 'Final' }
    ];

    for (const tipo of tipos) {
      await Tipo.findOrCreate({
        where: { nombre: tipo.nombre },
        defaults: tipo
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tipos', null, {});
  }
};
