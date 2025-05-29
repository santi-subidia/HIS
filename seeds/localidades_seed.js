const { Localidad } = require('../models');

module.exports = {
  up: async () => {
    const localidades = [
      { nombre: 'San Luis', id_provincia: 1 },
      { nombre: 'Villa Mercedes', id_provincia: 1 },
      { nombre: 'La Punta', id_provincia: 1 },
      { nombre: 'Justo Daract', id_provincia: 1 },
      { nombre: 'Concarán', id_provincia: 1 },
      { nombre: 'Quines', id_provincia: 1 },
      { nombre: 'Santa Rosa del Conlara', id_provincia: 1 },
      { nombre: 'Tilisarao', id_provincia: 1 },
      { nombre: 'Naschel', id_provincia: 1 },
      { nombre: 'Buena Esperanza', id_provincia: 1 },
      { nombre: 'Candelaria', id_provincia: 1 },
      { nombre: 'Luján', id_provincia: 1 },
      { nombre: 'La Toma', id_provincia: 1 },
      { nombre: 'Anchorena', id_provincia: 1 },
      { nombre: 'Arizona', id_provincia: 1 },
      { nombre: 'Balde', id_provincia: 1 },
      { nombre: 'Carolina', id_provincia: 1 },
      { nombre: 'El Trapiche', id_provincia: 1 },
      { nombre: 'Fraga', id_provincia: 1 },
      { nombre: 'La Calera', id_provincia: 1 }
    ];

    for (const localidad of localidades) {
      await Localidad.findOrCreate({
        where: { nombre: localidad.nombre, id_provincia: localidad.id_provincia },
        defaults: localidad
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('localidades', null, {});
  }
};