const { Sector, Ala, Habitacion, Cama } = require('../models');

module.exports = {
  up: async () => {
    // Sectores
    const sectores = [
      { nombre: 'Clínica Médica' },
      { nombre: 'Quirúrgico' }
    ];

    const sectoresDB = [];
    for (const sector of sectores) {
      const [created] = await Sector.findOrCreate({
        where: { nombre: sector.nombre },
        defaults: sector
      });
      sectoresDB.push(created);
    }

    // Más alas por sector
    const alas = [
      // Clínica Médica
      { ubicacion: 'Ala Norte', id_sector: sectoresDB[0].id },
      { ubicacion: 'Ala Sur', id_sector: sectoresDB[0].id },
      { ubicacion: 'Ala Este', id_sector: sectoresDB[0].id },
      { ubicacion: 'Ala Oeste', id_sector: sectoresDB[0].id },
      { ubicacion: 'Ala Central', id_sector: sectoresDB[0].id },
      // Quirúrgico
      { ubicacion: 'Ala Norte', id_sector: sectoresDB[1].id },
      { ubicacion: 'Ala Sur', id_sector: sectoresDB[1].id },
      { ubicacion: 'Ala Este', id_sector: sectoresDB[1].id },
      { ubicacion: 'Ala Oeste', id_sector: sectoresDB[1].id },
      { ubicacion: 'Ala Central', id_sector: sectoresDB[1].id }
    ];

    const alasDB = [];
    for (const ala of alas) {
      const [created] = await Ala.findOrCreate({
        where: { ubicacion: ala.ubicacion, id_sector: ala.id_sector },
        defaults: ala
      });
      alasDB.push(created);
    }

    // Habitaciones: 4 por ala, capacidad alternada 1 y 2
    let habId = 1;
    const habitaciones = [];
    for (const ala of alasDB) {
      for (let j = 1; j <= 4; j++) {
        const capacidad = (j % 2 === 0) ? 2 : 1; // alterna entre 1 y 2
        habitaciones.push({
          codigo: `HAB-${habId}`,
          id_ala: ala.id,
          capacidad
        });
        habId++;
      }
    }

    const habitacionesDB = [];
    for (const habitacion of habitaciones) {
      const [created] = await Habitacion.findOrCreate({
        where: { codigo: habitacion.codigo },
        defaults: habitacion
      });
      habitacionesDB.push(created);
    }

    // Camas según la capacidad de la habitación (solo 1 o 2)
    for (const habitacion of habitacionesDB) {
      for (let n = 1; n <= habitacion.capacidad; n++) {
        await Cama.findOrCreate({
          where: { id_habitacion: habitacion.id, nroCama: n },
          defaults: {
            id_habitacion: habitacion.id,
            nroCama: n,
            limpia: true
          }
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('camas', null, {});
    await queryInterface.bulkDelete('habitaciones', null, {});
    await queryInterface.bulkDelete('alas', null, {});
    await queryInterface.bulkDelete('sector', null, {});
  }
};
