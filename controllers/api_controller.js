// routes/api.js o donde manejes tus rutas API
const { where } = require('sequelize');
const { Ala ,Habitacion, Cama, Internacion, PacienteSeguro, Paciente } = require('../models');
const { id } = require('zod/v4/locales');


module.exports = {

    mostrarAlas: async (req, res) => {

        const sector = req.query.sector;

        try {
            const alas = await Ala.findAll({
                where: { id_sector: sector }
            });

            res.json({ alas });
        } catch (error) {
            console.error('Error al obtener alas:', error);
            res.status(500).json({ error: 'Error al obtener alas' });
        }

    },

    mostrarHabitaciones: async (req, res) => {
        const { ala, sexo } = req.query;

        try {
            // 1. Habitaciones con capacidad 2 y camas_disponibles 1
            const habitacionesFiltradas = await Habitacion.findAll({
                where: {
                    id_ala: ala,
                    capacidad: 2,
                    camas_disponibles: 1
                },
                include: [{ model: Cama, required: true }]
            });

            // 2. Obtener IDs de habitaciones que NO van
            const habitacionesNoVanIds = [];
            for (const habitacion of habitacionesFiltradas) {
                const camaOcupada = habitacion.Camas.find(c => c.estado === 'ocupada');
                if (!camaOcupada) continue;

                const internacion = await Internacion.findOne({
                    where: { id_cama: camaOcupada.id, estado: 'activa' },
                    include: [{
                        model: PacienteSeguro,
                        include: [{ model: Paciente, as: 'paciente' }]
                    }]
                });

                let paciente = null;
                if (internacion && internacion.PacienteSeguro && internacion.PacienteSeguro.paciente) {
                    paciente = internacion.PacienteSeguro.paciente;
                }

                if (paciente && paciente.sexo && paciente.sexo !== sexo) {
                    habitacionesNoVanIds.push(habitacion.id);
                }
            }

            // 3. Obtener todas las habitaciones del ala
            const todasHabitaciones = await Habitacion.findAll({
                where: { id_ala: ala },
                include: [{ model: Cama }]
            });

            // 4. Filtrar solo las habitaciones que SÍ van (no están en habitacionesNoVanIds)
            //    y que tengan al menos 1 cama disponible
            const habitacionesDisponibles = todasHabitaciones.filter(
                h => !habitacionesNoVanIds.includes(h.id) && h.camas_disponibles > 0
            );

            res.json({
                habitacionesDisponibles
            });
        } catch (error) {
            console.error('Error al obtener habitaciones:', error);
            res.status(500).json({ error: 'Error al obtener habitaciones' });
        }
    }
}
