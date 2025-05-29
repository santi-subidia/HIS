const { Paciente } = require('../models');

module.exports = {
  up: async () => {
    const pacientes = [
      {
        DNI: '12345678',
        apellido: 'González',
        nombre: 'Juan',
        sexo: '1',
        fechaNacimiento: '1990-05-10',
        id_tipoSangre: 1,
        domicilio: 'Calle Falsa 123',
        nro_Telefono: '2664000001',
        id_localidad: 1
      },
      {
        DNI: '23456789',
        apellido: 'Pérez',
        nombre: 'María',
        sexo: '2',
        fechaNacimiento: '1985-08-22',
        id_tipoSangre: 2,
        domicilio: 'Av. Siempre Viva 742',
        nro_Telefono: '2664000002',
        id_localidad: 2
      },
      {
        DNI: '34567890',
        apellido: 'Rodríguez',
        nombre: 'Carlos',
        sexo: '1',
        fechaNacimiento: '1978-12-15',
        id_tipoSangre: 3,
        domicilio: 'San Martín 456',
        nro_Telefono: '2664000003',
        id_localidad: 3
      },
      {
        DNI: '45678901',
        apellido: 'Fernández',
        nombre: 'Lucía',
        sexo: '2',
        fechaNacimiento: '1995-03-30',
        id_tipoSangre: 4,
        domicilio: 'Belgrano 789',
        nro_Telefono: '2664000004',
        id_localidad: 1
      }
    ];

    for (const paciente of pacientes) {
      await Paciente.findOrCreate({
        where: { DNI: paciente.DNI }, // Cambia el campo según tu criterio de unicidad
        defaults: paciente
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pacientes', null, {});
  }
};