const { Seguro } = require('../models');

module.exports = {
  up: async () => {
    const seguros = [
      {
        nombre: 'PAMI',
        abreviatura: 'PAMI',
        telefono_contacto: '08002227264',
        direccion: 'Av. Corrientes 1453, CABA'
      },
      {
        nombre: 'OSDE',
        abreviatura: 'OSDE',
        telefono_contacto: '08108881033',
        direccion: 'Av. Leandro N. Alem 1067, CABA'
      },
      {
        nombre: 'Swiss Medical',
        abreviatura: 'SWISS',
        telefono_contacto: '08103339977',
        direccion: 'Av. Pueyrredón 1461, CABA'
      },
      {
        nombre: 'Medife',
        abreviatura: 'MEDIFE',
        telefono_contacto: '08103336343',
        direccion: 'Av. Córdoba 1720, CABA'
      },
      {
        nombre: 'OSECAC',
        abreviatura: 'OSECAC',
        telefono_contacto: '08109991000',
        direccion: 'Viamonte 783, CABA'
      },
      {
        nombre: 'Federada Salud',
        abreviatura: 'FEDERADA',
        telefono_contacto: '08107773337',
        direccion: 'San Lorenzo 1543, Rosario'
      },
      {
        nombre: 'Galeno',
        abreviatura: 'GALENO',
        telefono_contacto: '08107772525',
        direccion: 'Av. Cabildo 1535, CABA'
      },
      {
        nombre: 'Particular',
        abreviatura: 'PART',
        telefono_contacto: '0000000000',
        direccion: ''
      }
    ];

    for (const seguro of seguros) {
      await Seguro.findOrCreate({
        where: { nombre: seguro.nombre },
        defaults: seguro
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('seguros', null, {});
  }
};