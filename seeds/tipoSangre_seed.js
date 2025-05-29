const { TipoSangre } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tipos_sangre', [
      { tipo: 'A', Rh: true },
      { tipo: 'A', Rh: false },
      { tipo: 'B', Rh: true },
      { tipo: 'B', Rh: false },
      { tipo: 'AB', Rh: true },
      { tipo: 'AB', Rh: false },
      { tipo: 'O', Rh: true },
      { tipo: 'O', Rh: false },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tipos_sangre', null, {});
  }
};