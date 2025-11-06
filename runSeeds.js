const { sequelize } = require('./models');

const provinciasSeed = require('./seeds/provincias_seed');
const localidadesSeed = require('./seeds/localidades_seed');
const tipoSangreSeed = require('./seeds/tipoSangre_seed');
const pacientesSeed = require('./seeds/pacientes_seed');
const motivosSeed = require('./seeds/motivos_seed');
const infraestructuraSeed = require('./seeds/infraestructura_seed');
const parentescoSeed = require('./seeds/parentescos_seed');
const segurosSeed = require('./seeds/seguros_seed');
const turnosSeed = require('./seeds/turnos_seed');
const personas = require('./seeds/personas_seed');
const anonimosSeed = require('./seeds/anonimo_seed');
const tiposAntecedentesSeed = require('./seeds/tipos_antecedentes_seed');
const internacionesSeed = require('./seeds/internaciones_seed');
const enfermerosSeed = require('./seeds/enfermeros_seed');
const categoriasTiposEstudiosSeed = require('./seeds/categorias_tipos_estudios_seed');
const tiposEstudiosSeed = require('./seeds/tipos_estudios_seed');

async function runSeeds() {
  try {
    // Sembrar provincias
    await provinciasSeed.up();
    console.log('Seed de provincias ejecutado correctamente.');

    // Sembrar localidades
    await localidadesSeed.up();
    console.log('Seed de localidades ejecutado correctamente.');
    
    // Sembrar tipos de sangre
    await tipoSangreSeed.up();
    console.log('Seed de tipos de sangre ejecutado correctamente.');
    
    // Sembrar parentescos
    await parentescoSeed.up();
    console.log('Seed de parentescos ejecutado correctamente.');

    // Sembrar seguros
    await segurosSeed.up();
    console.log('Seed de seguros ejecutado correctamente.');

    // Sembrar anónimos
    await anonimosSeed.up();
    console.log('Seed de anónimos ejecutado correctamente.');

    // Sembrar personas
    await personas.up();
    console.log('Seed de personas ejecutado correctamente.');

    // Sembrar pacientes
    await pacientesSeed.up();
    console.log('Seed de pacientes ejecutado correctamente.');

    // Sembrar enfermeros
    await enfermerosSeed.up();
    console.log('Seed de enfermeros ejecutado correctamente.');

    // Sembrar motivos
    await motivosSeed.up();
    console.log('Seed de motivos ejecutado correctamente.');

    // Sembrar infraestructura (sectores, alas, habitaciones, camas)
    await infraestructuraSeed.up();
    console.log('Seed de infraestructura ejecutado correctamente.');

    // Sembrar turnos
    await turnosSeed.up();
    console.log('Seed de turnos ejecutado correctamente.');

    // Sembrar tipos de antecedentes
    await tiposAntecedentesSeed.up();
    console.log('Seed de tipos de antecedentes ejecutado correctamente.');

    // Sembrar categorías de tipos de estudios
    await categoriasTiposEstudiosSeed();
    console.log('Seed de categorías de tipos de estudios ejecutado correctamente.');

    // Sembrar tipos de estudios
    await tiposEstudiosSeed();
    console.log('Seed de tipos de estudios ejecutado correctamente.');

    // Sembrar internaciones
    await internacionesSeed.up();
    console.log('Seed de internaciones ejecutado correctamente.');


  } catch (error) {
    console.error('Error al ejecutar las seeds:', error);
  } finally {
    await sequelize.close();
  }
}

runSeeds();