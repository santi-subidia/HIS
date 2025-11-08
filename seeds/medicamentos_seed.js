const { Medicamento } = require('../models');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

module.exports = {
  up: async () => {
    return new Promise((resolve, reject) => {
      const medicamentos = [];
      const csvPath = path.join(__dirname, '../data/Medicamentos.csv');

      // Verificar que existe el archivo
      if (!fs.existsSync(csvPath)) {
        console.error('❌ Error: Archivo Medicamentos.csv no encontrado en data/');
        return reject(new Error('Archivo CSV no encontrado'));
      }

      console.log('📖 Leyendo archivo de medicamentos...');

      fs.createReadStream(csvPath)
        .pipe(csv({
          headers: ['marca_comercial', 'presentacion', 'laboratorio'], // Definir headers manualmente
          skipLines: 0 // No saltar líneas
        }))
        .on('data', (row) => {
          // Validar que los campos no estén vacíos
          if (row.marca_comercial && row.presentacion && row.laboratorio) {
            medicamentos.push({
              marca_comercial: row.marca_comercial.trim(),
              presentacion: row.presentacion.trim(),
              laboratorio: row.laboratorio.trim()
            });
          }
        })
        .on('end', async () => {
          try {
            console.log(`📦 ${medicamentos.length} medicamentos leídos del CSV`);
            console.log('💾 Insertando en la base de datos...');

            // Insertar en lotes de 500 para mejor rendimiento
            const batchSize = 500;
            let insertados = 0;

            for (let i = 0; i < medicamentos.length; i += batchSize) {
              const batch = medicamentos.slice(i, i + batchSize);
              
              // Usar bulkCreate con ignoreDuplicates para evitar errores por duplicados
              await Medicamento.bulkCreate(batch, {
                ignoreDuplicates: true,
                validate: true
              });

              insertados += batch.length;
              console.log(`   ✓ Procesados ${insertados}/${medicamentos.length} medicamentos`);
            }

            console.log(`✅ ${medicamentos.length} medicamentos cargados correctamente`);
            resolve();
          } catch (error) {
            console.error('❌ Error al insertar medicamentos:', error.message);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('❌ Error al leer CSV:', error.message);
          reject(error);
        });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('medicamentos', null, {});
  }
};
