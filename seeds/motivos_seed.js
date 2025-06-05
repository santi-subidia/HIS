const { Motivo } = require('../models');

module.exports = {
  up: async () => {
    const motivos = [
      {
        nombre: 'Clínicos',
        descripcion: 'Internaciones por enfermedades médicas agudas o crónicas, infecciosas o no infecciosas, descompensaciones o deshidratación, sin requerimiento quirúrgico inmediato.'
      },
      {
        nombre: 'Quirúrgicos',
        descripcion: 'Internaciones por cirugías programadas, así como para seguimiento y recuperación postquirúrgica.'
      },
      {
        nombre: 'Traumatológicos y Ortopedia',
        descripcion: 'Internaciones por fracturas, lesiones articulares, politraumatismos, caídas o accidentes, manejo ortopédico o postquirúrgico traumatológico.'
      },
      {
        nombre: 'Emergencias y Urgencias',
        descripcion: 'Internaciones derivadas de situaciones agudas que requieren atención inmediata, como accidentes graves, paro cardiorrespiratorio, shock, etc.'
      },
      {
        nombre: 'Obstétricos y Ginecológicos',
        descripcion: 'Internaciones relacionadas con embarazo, parto, complicaciones obstétricas, cirugías ginecológicas o control postparto.'
      },
      {
        nombre: 'Pediátricos/Neonatales',
        descripcion: 'Internaciones de pacientes pediátricos o neonatales por enfermedades, complicaciones perinatales, observación o tratamientos específicos.'
      },
      {
        nombre: 'Psiquiátricos',
        descripcion: 'Internaciones para manejo de crisis psiquiátricas agudas, intentos de suicidio, trastornos del comportamiento o desintoxicaciones.'
      },
      {
        nombre: 'Cuidados Paliativos',
        descripcion: 'Internaciones destinadas a manejo de síntomas en pacientes con enfermedades avanzadas o terminales, enfocados en el bienestar y el control del dolor.'
      }
    ];

    for (const motivo of motivos) {
      await Motivo.findOrCreate({
        where: { nombre: motivo.nombre },
        defaults: motivo
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('motivos', null, {});
  }
};
