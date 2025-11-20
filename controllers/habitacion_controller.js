const { Habitacion, Ala, Sector, Cama } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // Lista todas las habitaciones con sus alas, sectores y camas
  Index: async (req, res) => {
    try {
      // Filtros
      const id_sector = req.query.id_sector ? parseInt(req.query.id_sector) : undefined;
      const estado = req.query.estado ? req.query.estado.trim() : undefined;

      // Construir condiciones de filtrado
      const whereAla = {};
      const whereCama = {};

      if (id_sector) {
        whereAla.id_sector = id_sector;
      }

      if (estado) {
        whereCama.estado = estado;
      }

      // Obtener todos los sectores para los filtros
      const sectores = await Sector.findAll({ order: [['nombre', 'ASC']] });

      const habitaciones = await Habitacion.findAll({
        include: [
          {
            model: Ala,
            include: [{ model: Sector }],
            where: Object.keys(whereAla).length ? whereAla : undefined,
            required: Object.keys(whereAla).length > 0
          },
          {
            model: Cama,
            where: Object.keys(whereCama).length ? whereCama : undefined,
            required: false
          }
        ]
      });

      res.render('habitacion/index', { 
        habitaciones, 
        sectores,
        filters: req.query,
        mensaje: null,
        success: req.query.success || null
      });
    } catch (error) {
      console.error('Error al listar habitaciones:', error);
      
      // Obtener sectores incluso en caso de error
      const sectores = await Sector.findAll({ order: [['nombre', 'ASC']] });

      res.render('habitacion/index', { 
        habitaciones: [], 
        sectores,
        filters: req.query,
        mensaje: 'Error al listar habitaciones',
        success: null
      });
    }
  },

  // POST /habitacion/marcar-disponible/:id - Marca una cama en mantenimiento como disponible
  MarcarDisponible_POST: async (req, res) => {
    try {
      const { id } = req.params;

      const cama = await Cama.findByPk(id);

      if (!cama) {
        return res.status(404).send('Cama no encontrada');
      }

      if (cama.estado !== 'mantenimiento') {
        return res.status(400).send('Solo se pueden marcar como disponibles las camas en mantenimiento');
      }

      await cama.update({ estado: 'disponible' });

      res.redirect('/habitacion?success=Cama marcada como disponible exitosamente');

    } catch (error) {
      console.error('Error al marcar cama como disponible:', error);
      res.status(500).send('Error al actualizar el estado de la cama');
    }
  }
};