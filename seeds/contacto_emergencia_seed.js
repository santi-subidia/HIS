const { ContactoEmergencia, Persona } = require('../models');

module.exports = {
  up: async () => {
    // Crear la persona 'Desconocido'
    const personaDesconocida = await Persona.findOrCreate({
      where: { DNI: '00000000' },
      defaults: {
        DNI: '00000000',
        nombre: 'Desconocido',
        apellido: 'Desconocido',
        telefono: '0000000000'
      }
    });

    // Vincular al contacto de emergencia
    await ContactoEmergencia.findOrCreate({
      where: { id_persona: personaDesconocida[0].id },
      defaults: {
        id_persona: personaDesconocida[0].id,
        id_parentesco: 1
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contactosEmergencias', null, {});
    await queryInterface.bulkDelete('personas', { DNI: '00000000' }, {});
  }
};