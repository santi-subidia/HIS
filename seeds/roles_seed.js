const { Rol } = require('../models');

module.exports = {
  up: async () => {
    const roles = [
      { nombre: 'Admin' },
      { nombre: 'Medico' },
      { nombre: 'Enfermero' },
      { nombre: 'Recepcionista' }
    ];

    for (const rol of roles) {
      await Rol.findOrCreate({
        where: { nombre: rol.nombre },
        defaults: rol
      });
    }

    console.log('✅ Roles creados correctamente');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
