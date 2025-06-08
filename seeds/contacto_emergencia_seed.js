const { ContactoEmergencia } = require('../models');

module.exports = {
  up: async () => {
    const contacto = {
      DNI_contacto: '00000000',
      nombre: 'Desconocido',
      apellido: 'Desconocido',
      telefono: '0000000000',
      id_parentesco: 1 
    };

    await ContactoEmergencia.findOrCreate({
      where: { DNI_contacto: contacto.DNI_contacto },
      defaults: contacto
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contactosEmergencias', { DNI_contacto: '00000000' }, {});
  }
};