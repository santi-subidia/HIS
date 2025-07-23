const { ContactoEmergencia, Persona, Paciente, PacienteSeguro } = require('../models');

module.exports = {
  up: async () => {
    // Crear la persona 'Desconocido'
    const personaDesconocido = await Persona.findOrCreate({
      where: { DNI: '00000001' },
      defaults: {
        id: 1,
        DNI: '00000001',
        nombre: 'Desconocido',
        apellido: 'Desconocido',
        telefono: '0000000000'
      }
    });

    const personaDesconocida = await Persona.findOrCreate({
      where: { DNI: '00000002' },
      defaults: {
        id: 2,
        DNI: '00000002',
        nombre: 'Desconocida',
        apellido: 'Desconocida',
        telefono: '0000000000'
      }
    });

    const pacienteDesconocido = await Paciente.findOrCreate({
      where: { id_persona: personaDesconocido[0].id },
      defaults: {
        id: 1,
        id_persona: personaDesconocido[0].id,
        sexo: 1, // Masculino
        fechaNacimiento: new Date('1900-01-01'),
        id_tipoSangre: 1,
        domicilio: '',
        id_localidad: 1
      }
    });

    const pacienteDesconocida = await Paciente.findOrCreate({
      where: { id_persona: personaDesconocida[0].id },
      defaults: {
        id: 2,
        id_persona: personaDesconocida[0].id,
        sexo: 2, // Femenino
        fechaNacimiento: new Date('1900-01-01'),
        id_tipoSangre: 1,
        domicilio: '',
        id_localidad: 1
      }
    });

    const [pacienteSeguroDesconocido] = await PacienteSeguro.findOrCreate({
        where: {
          id_paciente: pacienteDesconocido[0].id,
          id_seguro: 1,
          codigo_afiliado: personaDesconocido[0].DNI
        },
        defaults: {
          id: 1,
          id_paciente: pacienteDesconocido[0].id,
          id_seguro: 1,
          codigo_afiliado: personaDesconocido[0].DNI,
          fecha_desde: new Date(),
          estado: 'activo'
        }
      });

        const [pacienteSeguroDesconocida] = await PacienteSeguro.findOrCreate({
          where: {
            id_paciente: pacienteDesconocida[0].id,
            id_seguro: 1,
            codigo_afiliado: personaDesconocida[0].DNI
          },
          defaults: {
            id: 2,
            id_paciente: pacienteDesconocida[0].id,
            id_seguro: 1,
            codigo_afiliado: personaDesconocida[0].DNI,
            fecha_desde: new Date(),
            estado: 'activo'
          }
        });

    // Vincular al contacto de emergencia
    await ContactoEmergencia.findOrCreate({
      where: { id_persona: personaDesconocido[0].id },
      defaults: {
        id_persona: personaDesconocido[0].id,
        id_parentesco: 1
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contactosEmergencias', null, {});
    await queryInterface.bulkDelete('personas', { DNI: '00000000' }, {});
  }
};