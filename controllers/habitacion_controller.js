const { Habitacion, Ala, Sector, Cama } = require('../models');

module.exports = {
  // Lista todas las habitaciones con sus alas, sectores y camas
  listarHabitaciones: async (req, res) => {
    try {
      const habitaciones = await Habitacion.findAll({
        include: [
          {
            model: Ala,
            include: [{ model: Sector }]
          },
          {
            model: Cama
          }
        ]
      });
      res.render('listar-habitaciones', { habitaciones, mensaje: null });
    } catch (error) {
      console.error('Error al listar habitaciones:', error);
      res.render('listar-habitaciones', { habitaciones: [], mensaje: 'Error al listar habitaciones' });
    }
  }
};