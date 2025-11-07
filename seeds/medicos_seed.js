const { Medico, Persona, Especialidad } = require('../models');

const medicos = [
  {
    nombre: 'Carlos',
    apellido: 'Fernández',
    DNI: '20123456',
    especialidad: 'Medicina General'
  },
  {
    nombre: 'María',
    apellido: 'González',
    DNI: '21234567',
    especialidad: 'Cardiología'
  },
  {
    nombre: 'Roberto',
    apellido: 'Pérez',
    DNI: '22345678',
    especialidad: 'Traumatología'
  }
];

async function up() {
  try {
    console.log('Insertando médicos...');

    for (const medicoData of medicos) {
      // Verificar si la especialidad existe
      let especialidad = await Especialidad.findOne({ where: { nombre: medicoData.especialidad } });
      
      // Si no existe, crearla
      if (!especialidad) {
        especialidad = await Especialidad.create({ nombre: medicoData.especialidad });
        console.log(`Especialidad "${medicoData.especialidad}" creada`);
      }

      // Buscar o crear persona
      const [persona] = await Persona.findOrCreate({
        where: { DNI: medicoData.DNI },
        defaults: {
          nombre: medicoData.nombre,
          apellido: medicoData.apellido,
          DNI: medicoData.DNI,
          telefono: '1234567890',
          email: `${medicoData.nombre.toLowerCase()}.${medicoData.apellido.toLowerCase()}@hospital.com`,
          fecha_nacimiento: '1980-01-01',
          id_localidad: 1
        }
      });

      // Crear médico si no existe
      await Medico.findOrCreate({
        where: { id_persona: persona.id },
        defaults: {
          id_persona: persona.id,
          id_especialidad: especialidad.id
        }
      });
    }

    console.log('✅ Médicos insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar médicos:', error);
    throw error;
  }
}

module.exports = { up };
