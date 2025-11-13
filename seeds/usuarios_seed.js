const { Usuario, Rol, Medico, Enfermero } = require('../models');

module.exports = {
  up: async () => {
    try {
      // Obtener roles
      const rolMedico = await Rol.findOne({ where: { nombre: 'Medico' } });
      const rolEnfermero = await Rol.findOne({ where: { nombre: 'Enfermero' } });
      const rolRecepcionista = await Rol.findOne({ where: { nombre: 'Recepcionista' } });
      const rolAdmin = await Rol.findOne({ where: { nombre: 'Admin' } });

      if (!rolMedico || !rolEnfermero || !rolRecepcionista || !rolAdmin) {
        console.error('❌ Error: Asegúrate de ejecutar el seed de roles primero');
        return;
      }

      // Buscar médicos y enfermeros existentes
      const medicos = await Medico.findAll({ limit: 2 });
      const enfermeros = await Enfermero.findAll({ limit: 2 });

      const usuarios = [];

      // Crear usuario médico (solo si existe al menos un médico)
      if (medicos.length > 0) {
        usuarios.push({
          id_persona: medicos[0].id_persona,
          usuario: 'medico1',
          password: '123456', // Se hasheará automáticamente por el hook
          id_rol: rolMedico.id
        });
        console.log('✅ Usuario médico preparado (usuario: medico1, password: 123456)');
      }

      // Crear segundo usuario médico si existe
      if (medicos.length > 1) {
        usuarios.push({
          id_persona: medicos[1].id_persona,
          usuario: 'medico2',
          password: '123456',
          id_rol: rolMedico.id
        });
        console.log('✅ Usuario médico 2 preparado (usuario: medico2, password: 123456)');
      }

      // Crear usuario enfermero (solo si existe al menos un enfermero)
      if (enfermeros.length > 0) {
        usuarios.push({
          id_persona: enfermeros[0].id_persona,
          usuario: 'enfermero1',
          password: '123456',
          id_rol: rolEnfermero.id
        });
        console.log('✅ Usuario enfermero preparado (usuario: enfermero1, password: 123456)');
      }

      // Crear segundo usuario enfermero si existe
      if (enfermeros.length > 1) {
        usuarios.push({
          id_persona: enfermeros[1].id_persona,
          usuario: 'enfermero2',
          password: '123456',
          id_rol: rolEnfermero.id
        });
        console.log('✅ Usuario enfermero 2 preparado (usuario: enfermero2, password: 123456)');
      }

      // Crear usuario admin (usar la primera persona disponible o crear una genérica)
      usuarios.push({
        id_persona: 10, // Ajusta esto según tu BD
        usuario: 'admin',
        password: 'admin123',
        id_rol: rolAdmin.id
      });
      console.log('✅ Usuario admin preparado (usuario: admin, password: admin123)');

      // Crear usuario recepcionista (usar la segunda persona disponible o crear una genérica)
      usuarios.push({
        id_persona: 11, // Ajusta esto según tu BD
        usuario: 'recepcionista',
        password: 'recepcionista123',
        id_rol: rolRecepcionista.id
      });

      // Insertar usuarios
      for (const usuario of usuarios) {
        await Usuario.findOrCreate({
          where: { usuario: usuario.usuario },
          defaults: usuario
        });
      }

      console.log('✅ Usuarios de prueba creados correctamente');
      console.log('\n📝 Credenciales de prueba:');
      console.log('   Médico:     medico1 / 123456');
      console.log('   Enfermero:  enfermero1 / 123456');
      console.log('   Recepcionista: recepcionista / recepcionista123');
      console.log('   Admin:      admin / admin123');

    } catch (error) {
      console.error('❌ Error al crear usuarios:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
