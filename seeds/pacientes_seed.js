const { Paciente, Persona } = require('../models');

module.exports = {
  up: async () => {
    const pacientes = [
      {
        DNI: '12345678',
        sexo: 'Masculino',
        fecha_nacimiento: '1990-05-10',
        id_tipoSangre: 1,
        domicilio: 'Calle Falsa 123',
        id_localidad: 1
      },
      {
        DNI: '23456789',
        sexo: 'Femenino',
        fecha_nacimiento: '1985-08-22',
        id_tipoSangre: 2,
        domicilio: 'Av. Siempre Viva 742',
        id_localidad: 2
      },
      {
        DNI: '34567890',
        sexo: 'Masculino',
        fecha_nacimiento: '1978-12-15',
        id_tipoSangre: 3,
        domicilio: 'San Martín 456',
        id_localidad: 3
      },
      {
        DNI: '45678901',
        sexo: 'Femenino',
        fecha_nacimiento: '1995-03-30',
        id_tipoSangre: 4,
        domicilio: 'Belgrano 789',
        id_localidad: 1
      },
      {
        DNI: '56789012',
        sexo: 'Masculino',
        fecha_nacimiento: '1982-07-19',
        id_tipoSangre: 2,
        domicilio: 'Mitre 321',
        id_localidad: 2
      },
      {
        DNI: '67890123',
        sexo: 'Femenino',
        fecha_nacimiento: '2000-11-05',
        id_tipoSangre: 1,
        domicilio: 'Rivadavia 654',
        id_localidad: 3
      },
      {
        DNI: '78901234',
        sexo: 'Masculino',
        fecha_nacimiento: '1975-02-28',
        id_tipoSangre: 4,
        domicilio: 'Las Heras 987',
        id_localidad: 1
      },
      {
        DNI: '89012345',
        sexo: 'Femenino',
        fecha_nacimiento: '1992-09-13',
        id_tipoSangre: 3,
        domicilio: 'Sarmiento 159',
        id_localidad: 2
      },
      {
        DNI: '90123456',
        sexo: 'Masculino',
        fecha_nacimiento: '1988-04-22',
        id_tipoSangre: 2,
        domicilio: 'Urquiza 753',
        id_localidad: 3
      }
    ];

    for (const paciente of pacientes) {
      // Buscar la persona por DNI
      const persona = await Persona.findOne({ where: { DNI: paciente.DNI } });
      if (!persona) continue; // Si no existe la persona, salta

      // Crear el paciente vinculado a la persona
      await Paciente.findOrCreate({
        where: { id_persona: persona.id },
        defaults: {
          id_persona: persona.id,
          sexo: paciente.sexo,
          fecha_nacimiento: paciente.fecha_nacimiento,
          id_tipoSangre: paciente.id_tipoSangre,
          domicilio: paciente.domicilio,
          id_localidad: paciente.id_localidad
        }
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pacientes', null, {});
  }
};