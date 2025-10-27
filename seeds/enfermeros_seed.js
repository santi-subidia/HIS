const { Persona, Enfermero } = require('../models');

module.exports = {
  up: async () => {
    try {
      console.log('Iniciando seed de enfermeros...');

      // Crear personas para los enfermeros
      const personas = await Persona.bulkCreate([
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
      ]);

      console.log(`${personas.length} personas creadas para enfermeros`);

      // Crear enfermeros asociados a las personas
      const enfermeros = await Enfermero.bulkCreate([
        { id_persona: personas[0].id },
        { id_persona: personas[1].id },
        { id_persona: personas[2].id },
        { id_persona: personas[3].id },
        { id_persona: personas[4].id }
      ]);

      console.log(`${enfermeros.length} enfermeros creados exitosamente`);
      console.log('Enfermeros:', enfermeros.map(e => ({ id: e.id, id_persona: e.id_persona })));

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
