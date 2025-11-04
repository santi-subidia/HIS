const { Persona, Enfermero } = require('../models');

module.exports = {
  up: async () => {
    try {
      console.log('Iniciando seed de enfermeros...');

      // Datos de personas para enfermeros
      const personasData = [
        {
          DNI: '30111222',
          nombre: 'Laura',
          apellido: 'Martínez',
          fecha_nacimiento: '1985-03-15',
          telefono: '3515551111',
          email: 'laura.martinez@hospital.com',
          domicilio: 'Av. Colón 1234',
          id_localidad: 1
        },
        {
          DNI: '30222333',
          nombre: 'Roberto',
          apellido: 'González',
          fecha_nacimiento: '1988-07-22',
          telefono: '3515552222',
          email: 'roberto.gonzalez@hospital.com',
          domicilio: 'Bv. San Juan 567',
          id_localidad: 1
        },
        {
          DNI: '30333444',
          nombre: 'Carla',
          apellido: 'Fernández',
          fecha_nacimiento: '1990-11-08',
          telefono: '3515553333',
          email: 'carla.fernandez@hospital.com',
          domicilio: 'Calle Caseros 890',
          id_localidad: 1
        },
        {
          DNI: '30444555',
          nombre: 'Diego',
          apellido: 'Ramírez',
          fecha_nacimiento: '1987-05-30',
          telefono: '3515554444',
          email: 'diego.ramirez@hospital.com',
          domicilio: 'Av. Vélez Sarsfield 234',
          id_localidad: 1
        },
        {
          DNI: '30555666',
          nombre: 'Marta',
          apellido: 'López',
          fecha_nacimiento: '1992-09-12',
          telefono: '3515555555',
          email: 'marta.lopez@hospital.com',
          domicilio: 'Calle Independencia 456',
          id_localidad: 1
        }
      ];

      // Crear o encontrar personas (evita duplicados)
      const personas = [];
      for (const personaData of personasData) {
        const [persona, created] = await Persona.findOrCreate({
          where: { DNI: personaData.DNI },
          defaults: personaData
        });
        personas.push(persona);
        console.log(`Persona ${persona.nombre} ${persona.apellido} ${created ? 'creada' : 'ya existía'}`);
      }

      console.log(`${personas.length} personas procesadas para enfermeros`);

      // Crear enfermeros asociados a las personas (evita duplicados)
      const enfermeros = [];
      for (const persona of personas) {
        const [enfermero, created] = await Enfermero.findOrCreate({
          where: { id_persona: persona.id },
          defaults: { id_persona: persona.id }
        });
        enfermeros.push(enfermero);
        console.log(`Enfermero para ${persona.nombre} ${persona.apellido} (ID: ${enfermero.id}) ${created ? 'creado' : 'ya existía'}`);
      }

      console.log(`${enfermeros.length} enfermeros procesados exitosamente`);

      return enfermeros;
    } catch (error) {
      console.error('Error en seed de enfermeros:', error);
      throw error;
    }
  },

  down: async () => {
    try {
      console.log('Revirtiendo seed de enfermeros...');
      
      // Eliminar enfermeros
      const enfermeros = await Enfermero.findAll();
      const personaIds = enfermeros.map(e => e.id_persona);
      
      await Enfermero.destroy({ where: {} });
      console.log('Enfermeros eliminados');

      // Eliminar personas asociadas
      await Persona.destroy({ 
        where: { 
          DNI: ['30111222', '30222333', '30333444', '30444555', '30555666']
        } 
      });
      console.log('Personas de enfermeros eliminadas');

    } catch (error) {
      console.error('Error al revertir seed de enfermeros:', error);
      throw error;
    }
  }
};
