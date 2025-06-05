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
      },
      {
        DNI: '56789012',
        apellido: 'Sosa',
        nombre: 'Martín',
        sexo: '1',
        fechaNacimiento: '1982-07-19',
        id_tipoSangre: 2,
        domicilio: 'Mitre 321',
        nro_Telefono: '2664000005',
        id_localidad: 2
      },
      {
        DNI: '67890123',
        apellido: 'López',
        nombre: 'Ana',
        sexo: '2',
        fechaNacimiento: '2000-11-05',
        id_tipoSangre: 1,
        domicilio: 'Rivadavia 654',
        nro_Telefono: '2664000006',
        id_localidad: 3
      },
      {
        DNI: '78901234',
        apellido: 'Ramírez',
        nombre: 'Javier',
        sexo: '1',
        fechaNacimiento: '1975-02-28',
        id_tipoSangre: 4,
        domicilio: 'Las Heras 987',
        nro_Telefono: '2664000007',
        id_localidad: 1
      },
      {
        DNI: '89012345',
        apellido: 'Torres',
        nombre: 'Valeria',
        sexo: '2',
        fechaNacimiento: '1992-09-13',
        id_tipoSangre: 3,
        domicilio: 'Sarmiento 159',
        nro_Telefono: '2664000008',
        id_localidad: 2
      },
      {
        DNI: '90123456',
        apellido: 'Molina',
        nombre: 'Federico',
        sexo: '1',
        fechaNacimiento: '1988-04-22',
        id_tipoSangre: 2,
        domicilio: 'Urquiza 753',
        nro_Telefono: '2664000009',
        id_localidad: 3
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