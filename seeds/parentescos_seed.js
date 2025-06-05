const { Parentesco } = require('../models');

module.exports = {
  up: async () => {
    const parentescos = [
      { id: 1, nombre: 'Padre' },
      { id: 2, nombre: 'Madre' },
      { id: 3, nombre: 'Hermano o Hermana' },
      { id: 4, nombre: 'Amigo o Amiga' },
      { id: 5, nombre: 'Pareja' },
      { id: 6, nombre: 'Tio o Tia' },
      { id: 7, nombre: 'Abuelo o Abuela' },
      { id: 8, nombre: 'Primo o Prima' },
      { id: 9, nombre: 'Otro' }
    ];

    for (const parentesco of parentescos) {
      await Parentesco.findOrCreate({
        where: { id: parentesco.id },
        defaults: parentesco
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('parentescos', null, {});
  }
};