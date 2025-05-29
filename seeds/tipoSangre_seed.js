const { TipoSangre } = require('../models');

module.exports = {
  up: async () => {
    const tipos = [
      { tipo: 'A', Rh: true },
      { tipo: 'A', Rh: false },
      { tipo: 'B', Rh: true },
      { tipo: 'B', Rh: false },
      { tipo: 'AB', Rh: true },
      { tipo: 'AB', Rh: false },
      { tipo: 'O', Rh: true },
      { tipo: 'O', Rh: false }
    ];

    for (const tipo of tipos) {
      await TipoSangre.findOrCreate({
        where: { tipo: tipo.tipo, Rh: tipo.Rh },
        defaults: tipo
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tipos_sangre', null, {});
  }
};