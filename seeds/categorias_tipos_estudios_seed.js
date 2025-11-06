const { CategoriaTipoEstudio } = require('../models');

const categorias = [
  { nombre: 'Imagenología' },
  { nombre: 'Laboratorio' },
  { nombre: 'Cardiología' },
  { nombre: 'Endoscopía' },
  { nombre: 'Otros' }
];

async function seed() {
  try {
    console.log('Insertando categorías de tipos de estudios...');
    
    for (const categoria of categorias) {
      await CategoriaTipoEstudio.findOrCreate({
        where: { nombre: categoria.nombre },
        defaults: categoria
      });
    }
    
    console.log('✅ Categorías de tipos de estudios insertadas correctamente');
  } catch (error) {
    console.error('❌ Error al insertar categorías de tipos de estudios:', error);
    throw error;
  }
}

module.exports = seed;
