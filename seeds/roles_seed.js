const { Rol } = require('../models');

module.exports = {
  up: async () => {
    const roles = [
      { nombre: 'medico' },
      { nombre: 'enfermero' },
      { nombre: 'admision' }
    ];
    
    for (const rol of roles) {
      await Rol.findOrCreate({
        where: { nombre: rol.nombre },
        defaults: rol
      });
    }
  },
  down: async () => {
    await Rol.destroy({
      where: {
        nombre: ['admin', 'medico', 'enfermero', 'admision']
      }
    });
  }
};