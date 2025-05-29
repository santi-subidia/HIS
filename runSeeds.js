const { sequelize } = require('./models');
const provinciasSeed = require('./seeds/provincias_seed');
const localidadesSeed = require('./seeds/localidades_seed');
const tipoSangreSeed = require('./seeds/tipoSangre_seed');

async function runSeeds() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const Sequelize = sequelize.constructor;

    // Limpiar y sembrar provincias
    await provinciasSeed.down(queryInterface, Sequelize);
    await provinciasSeed.up(queryInterface, Sequelize);
    console.log('Seed de provincias ejecutado correctamente.');

    // Limpiar y sembrar localidades
    await localidadesSeed.down(queryInterface, Sequelize);
    await localidadesSeed.up(queryInterface, Sequelize);
    console.log('Seed de localidades ejecutado correctamente.');

    // Limpiar y sembrar tipos de sangre
    await tipoSangreSeed.down(queryInterface, Sequelize);
    await tipoSangreSeed.up(queryInterface, Sequelize);
    console.log('Seed de tipos de sangre ejecutado correctamente.');

  } catch (error) {
    console.error('Error al ejecutar las seeds:', error);
  } finally {
    await sequelize.close();
  }
}

runSeeds();