const { sequelize } = require('./models');
const provinciasSeed = require('./seeds/provincias_seed');
const localidadesSeed = require('./seeds/localidades_seed');
const tipoSangreSeed = require('./seeds/tipoSangre_seed');
const pacientesSeed = require('./seeds/pacientes_seed');

async function runSeeds() {
  try {
    // Sembrar provincias (sin borrar, solo inserta si no existe)
    await provinciasSeed.up();
    console.log('Seed de provincias ejecutado correctamente.');

    // Sembrar localidades
    await localidadesSeed.up();
    console.log('Seed de localidades ejecutado correctamente.');

    // Sembrar tipos de sangre
    await tipoSangreSeed.up();
    console.log('Seed de tipos de sangre ejecutado correctamente.');

    // Sembrar pacientes
    await pacientesSeed.up();
    console.log('Seed de pacientes ejecutado correctamente.');

  } catch (error) {
    console.error('Error al ejecutar las seeds:', error);
  } finally {
    await sequelize.close();
  }
}

runSeeds();