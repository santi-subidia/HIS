const { Persona } = require('../models');

module.exports = {
  up: async () => {
    const personas = [
      {
        DNI: '12345678',
        nombre: 'Juan',
        apellido: 'González',
        telefono: '2664000001'
      },
      {
        DNI: '23456789',
        nombre: 'María',
        apellido: 'Pérez',
        telefono: '2664000002'
      },
      {
        DNI: '34567890',
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        telefono: '2664000003'
      },
      {
        DNI: '45678901',
        nombre: 'Lucía',
        apellido: 'Fernández',
        telefono: '2664000004'
      },
      {
        DNI: '56789012',
        nombre: 'Martín',
        apellido: 'Sosa',
        telefono: '2664000005'
      },
      {
        DNI: '67890123',
        nombre: 'Ana',
        apellido: 'López',
        telefono: '2664000006'
      },
      {
        DNI: '78901234',
        nombre: 'Javier',
        apellido: 'Ramírez',
        telefono: '2664000007'
      },
      {
        DNI: '89012345',
        nombre: 'Valeria',
        apellido: 'Torres',
        telefono: '2664000008'
      },
      {
        DNI: '90123456',
        nombre: 'Federico',
        apellido: 'Molina',
        telefono: '2664000009'
      }
    ];

    for (const persona of personas) {
      await Persona.findOrCreate({
        where: { DNI: persona.DNI },
        defaults: persona
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('personas', null, {});
  }
};
