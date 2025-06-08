const { ca } = require('zod/v4/locales');
const {Habitacion, Ala, Sector, Cama} = require('../models');

module.exports = {
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
        }catch (error) {
            console.error('Error al listar habitaciones:', error);
            res.render('listar-habitaciones', { habitaciones: [], mensaje: 'Error al listar habitaciones' });
        }
    }
}