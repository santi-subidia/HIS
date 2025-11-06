const { TipoEstudio, CategoriaTipoEstudio } = require('../models');

async function seed() {
  try {
    console.log('Insertando tipos de estudios...');
    
    // Obtener categorías
    const imagenologia = await CategoriaTipoEstudio.findOne({ where: { nombre: 'Imagenología' } });
    const laboratorio = await CategoriaTipoEstudio.findOne({ where: { nombre: 'Laboratorio' } });
    const cardiologia = await CategoriaTipoEstudio.findOne({ where: { nombre: 'Cardiología' } });
    const endoscopia = await CategoriaTipoEstudio.findOne({ where: { nombre: 'Endoscopía' } });
    const otros = await CategoriaTipoEstudio.findOne({ where: { nombre: 'Otros' } });
    
    const tipos = [
      // Imagenología
      { nombre: 'Radiografía de Tórax', id_categoria: imagenologia.id },
      { nombre: 'Radiografía de Abdomen', id_categoria: imagenologia.id },
      { nombre: 'Tomografía Computada', id_categoria: imagenologia.id },
      { nombre: 'Resonancia Magnética', id_categoria: imagenologia.id },
      { nombre: 'Ecografía', id_categoria: imagenologia.id },
      
      // Laboratorio
      { nombre: 'Hemograma Completo', id_categoria: laboratorio.id },
      { nombre: 'Análisis de Orina', id_categoria: laboratorio.id },
      { nombre: 'Glucemia', id_categoria: laboratorio.id },
      { nombre: 'Perfil Lipídico', id_categoria: laboratorio.id },
      { nombre: 'Hepatograma', id_categoria: laboratorio.id },
      { nombre: 'Urea y Creatinina', id_categoria: laboratorio.id },
      
      // Cardiología
      { nombre: 'Electrocardiograma (ECG)', id_categoria: cardiologia.id },
      { nombre: 'Ecocardiograma', id_categoria: cardiologia.id },
      { nombre: 'Holter', id_categoria: cardiologia.id },
      { nombre: 'Prueba de Esfuerzo', id_categoria: cardiologia.id },
      
      // Endoscopía
      { nombre: 'Endoscopía Digestiva', id_categoria: endoscopia.id },
      { nombre: 'Colonoscopía', id_categoria: endoscopia.id },
      
      // Otros
      { nombre: 'Biopsia', id_categoria: otros.id },
      { nombre: 'Espirometría', id_categoria: otros.id },
      { nombre: 'Punción Lumbar', id_categoria: otros.id }
    ];
    
    for (const tipo of tipos) {
      await TipoEstudio.findOrCreate({
        where: { nombre: tipo.nombre },
        defaults: tipo
      });
    }
    
    console.log('✅ Tipos de estudios insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar tipos de estudios:', error);
    throw error;
  }
}

module.exports = seed;
