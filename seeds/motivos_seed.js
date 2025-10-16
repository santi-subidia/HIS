const { Motivo } = require('../models');

module.exports = {
  up: async () => {
    const motivos = [
      {
        nombre: 'Clínicos'
      },
      {
        nombre: 'Quirúrgicos',
      },
      {
        nombre: 'Traumatológicos y Ortopedia'
      },
      {
        nombre: 'Emergencias y Urgencias'
      },
      {
        nombre: 'Obstétricos y Ginecológicos',
      },
      {
        nombre: 'Pediátricos/Neonatales',
      },
      {
        nombre: 'Psiquiátricos',
      },
      {
        nombre: 'Cuidados Paliativos',
      }
    ];

    for (const motivo of motivos) {
      await Motivo.findOrCreate({
        where: { nombre: motivo.nombre },
        defaults: motivo
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('motivos', null, {});
  }
};
