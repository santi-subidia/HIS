const { Provincia } = require('../models');

module.exports = {
  up: async () => {
    const provincias = [
      { id: 1, nombre: 'San Luis' },
      { id: 2, nombre: 'Buenos Aires' },
      { id: 3, nombre: 'Catamarca' },
      { id: 4, nombre: 'Chaco' },
      { id: 5, nombre: 'Chubut' },
      { id: 6, nombre: 'Córdoba' },
      { id: 7, nombre: 'Corrientes' },
      { id: 8, nombre: 'Entre Ríos' },
      { id: 9, nombre: 'Formosa' },
      { id: 10, nombre: 'Jujuy' },
      { id: 11, nombre: 'La Pampa' },
      { id: 12, nombre: 'La Rioja' },
      { id: 13, nombre: 'Mendoza' },
      { id: 14, nombre: 'Misiones' },
      { id: 15, nombre: 'Neuquén' },
      { id: 16, nombre: 'Río Negro' },
      { id: 17, nombre: 'Salta' },
      { id: 18, nombre: 'San Juan' },
      { id: 19, nombre: 'Santa Cruz' },
      { id: 20, nombre: 'Santa Fe' },
      { id: 21, nombre: 'Santiago del Estero' },
      { id: 22, nombre: 'Tierra del Fuego' },
      { id: 23, nombre: 'Tucumán' },
      { id: 24, nombre: 'Ciudad Autónoma de Buenos Aires' }
    ];

    for (const provincia of provincias) {
      await Provincia.findOrCreate({
        where: { id: provincia.id },
        defaults: provincia
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('provincias', null, {});
  }
};