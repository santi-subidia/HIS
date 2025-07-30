const {Usuario, Rol, Empleado, Persona} = require('../models');

module.exports = {
    up: async () => {
        const roles = await Rol.findAll();
        const personas = await Persona.findAll({
            where: {
                DNI: ['192456744', '194267897', '198456123']
            }
        });
        const usuarios = [
            {
                id: 1,
                usuario: 'admision1',
                password: 'admision123',
                id_rol: roles.find(rol => rol.nombre === 'admision').id
            },
            {
                id: 2,
                usuario: 'medico1',
                password: 'medico123',
                id_rol: roles.find(rol => rol.nombre === 'medico').id
            },
            {
                id: 3,
                usuario: 'enfermero1',
                password: 'enfermero123',
                id_rol: roles.find(rol => rol.nombre === 'enfermero').id
            }
        ];

        for (const usuario of usuarios) {
            await Usuario.findOrCreate({
                where: { usuario: usuario.usuario },
                defaults: usuario
            });
        }
        
        const asociaciones = [
            { usuario: 'admision1', dni: '192456744' },
            { usuario: 'medico1', dni: '194267897' },
            { usuario: 'enfermero1', dni: '198456123' }
          ];
          
          for (const a of asociaciones) {
            const persona = personas.find(p => p.DNI === a.dni);
            const usuario = await Usuario.findOne({ where: { usuario: a.usuario } });
            if (persona && usuario) {
              await Empleado.findOrCreate({
                where: { id_persona: persona.id },
                defaults: { id_persona: persona.id, id_usuario: usuario.id }
              });
            }
          }
    },  
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('usuarios', null, {});
    }
};