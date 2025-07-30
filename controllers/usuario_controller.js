const { error } = require('zod/v4/locales/ar.js');
const { Usuario, Persona, Empleado } = require('../models');
const personaSchema = require('../schemas/persona_schema');

module.exports = {
    nuevoUsuario: async (req, res) => {
        try {
            const { user, password, rol, DNI, nombre, apellido, telefono } = req.body;

            // Verifica si el usuario ya existe
            const existingUser = await Usuario.findOne({ where: { user } });
            if (existingUser) {
                return res.render('/login' , { mensaje: 'El usuario ya existe.' });
            }

            // Crea el nuevo usuario
            const newUser = await Usuario.create({
                user,
                password,
                rol
            });

            const personaData = personaSchema.parse({
                DNI,
                nombre,
                apellido,
                telefono
            });

            // Crea la persona asociada al usuario
            const [persona] = await Persona.findOrCreate({
                where: { DNI: personaData.DNI },
                defaults: personaData 
            });

            // Crear el empleado
            await Empleado.create({
                id_usuario: newUser.id,
                id_persona: persona.id
            });

            res.render('/');
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
}