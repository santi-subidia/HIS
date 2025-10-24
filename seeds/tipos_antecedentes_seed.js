const { Tipo } = require('../models');

module.exports = {
  up: async () => {
    const tipos = [
      { nombre: 'Alergias' },
      { nombre: 'Cirugías' },
      { nombre: 'Enfermedades Previas' },
      { nombre: 'Antecedentes Familiares' }
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
