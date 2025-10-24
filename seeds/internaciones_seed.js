const { Internacion, PacienteSeguro, Paciente, Persona, ContactoEmergencia, Cama } = require('../models');

module.exports = {
  up: async () => {
    try {
      // Crear personas para contactos de emergencia
      const [personaContacto1] = await Persona.findOrCreate({
        where: { DNI: '11111111' },
        defaults: {
          DNI: '11111111',
          nombre: 'Roberto',
          apellido: 'González',
          telefono: '2664111111'
        }
      });

      const [personaContacto2] = await Persona.findOrCreate({
        where: { DNI: '22222222' },
        defaults: {
          DNI: '22222222',
          nombre: 'Laura',
          apellido: 'Pérez',
          telefono: '2664222222'
        }
      });

      const [personaContacto3] = await Persona.findOrCreate({
        where: { DNI: '33333333' },
        defaults: {
          DNI: '33333333',
          nombre: 'Ana',
          apellido: 'Rodríguez',
          telefono: '2664333333'
        }
      });

      // Crear contactos de emergencia
      const [contacto1] = await ContactoEmergencia.findOrCreate({
        where: { id_persona: personaContacto1.id },
        defaults: {
          id_persona: personaContacto1.id,
          id_parentesco: 3 // Hermano
        }
      });

      const [contacto2] = await ContactoEmergencia.findOrCreate({
        where: { id_persona: personaContacto2.id },
        defaults: {
          id_persona: personaContacto2.id,
          id_parentesco: 2 // Madre
        }
      });

      const [contacto3] = await ContactoEmergencia.findOrCreate({
        where: { id_persona: personaContacto3.id },
        defaults: {
          id_persona: personaContacto3.id,
          id_parentesco: 5 // Pareja
        }
      });

      // Internación 1: Juan González (Masculino) - Habitación individual
      const paciente1 = await Paciente.findOne({
        include: [{ model: Persona, as: 'persona', where: { DNI: '12345678' } }]
      });

      if (paciente1) {
        // Crear o encontrar PacienteSeguro
        const [pacienteSeguro1] = await PacienteSeguro.findOrCreate({
          where: {
            id_paciente: paciente1.id,
            id_seguro: 1, // PAMI
            codigo_afiliado: '12345678001'
          },
          defaults: {
            id_paciente: paciente1.id,
            id_seguro: 1,
            codigo_afiliado: '12345678001'
          }
        });

        // Buscar cama disponible en habitación individual de Clínica Médica
        const cama1 = await Cama.findOne({
          where: { id: 1, estado: 'disponible' } // HAB-1, Cama 1
        });

        if (cama1) {
          await Internacion.findOrCreate({
            where: { id_cama: cama1.id },
            defaults: {
              id_paciente_seguro: pacienteSeguro1.id,
              id_cama: cama1.id,
              id_motivo: 1, // Clínicos
              detalle_motivo: 'Control postoperatorio de cirugía cardiovascular. Requiere monitoreo constante de signos vitales.',
              id_contactoEmergencia: contacto1.id,
              fecha_internacion: new Date('2025-10-15 08:30:00'),
              estado: 'activa',
              prioridad: null, // Sin prioridad asignada inicialmente
              sintomas_principales: 'Dolor torácico leve, presión arterial elevada'
            }
          });

          await cama1.update({ estado: 'ocupada' });
          console.log('✅ Internación 1 creada: Juan González');
        }
      }

      // Internación 2: María Pérez (Femenino) - Habitación compartida
      const paciente2 = await Paciente.findOne({
        include: [{ model: Persona, as: 'persona', where: { DNI: '23456789' } }]
      });

      if (paciente2) {
        const [pacienteSeguro2] = await PacienteSeguro.findOrCreate({
          where: {
            id_paciente: paciente2.id,
            id_seguro: 2, // OSDE
            codigo_afiliado: '23456789002'
          },
          defaults: {
            id_paciente: paciente2.id,
            id_seguro: 2,
            codigo_afiliado: '23456789002'
          }
        });

        const cama2 = await Cama.findOne({
          where: { id: 6, estado: 'disponible' } // HAB-6, Cama 1
        });

        if (cama2) {
          await Internacion.findOrCreate({
            where: { id_cama: cama2.id },
            defaults: {
              id_paciente_seguro: pacienteSeguro2.id,
              id_cama: cama2.id,
              id_motivo: 5, // Obstétricos y Ginecológicos
              detalle_motivo: 'Embarazo de alto riesgo. Preeclampsia leve. Reposo absoluto indicado.',
              id_contactoEmergencia: contacto2.id,
              fecha_internacion: new Date('2025-10-16 14:00:00'),
              estado: 'activa',
              prioridad: null, // Sin prioridad asignada inicialmente
              sintomas_principales: 'Hipertensión gestacional, edema en extremidades'
            }
          });

          await cama2.update({ estado: 'ocupada' });
          console.log('✅ Internación 2 creada: María Pérez');
        }
      }

      // Internación 3: Carlos Rodríguez (Masculino) - Habitación compartida
      const paciente3 = await Paciente.findOne({
        include: [{ model: Persona, as: 'persona', where: { DNI: '34567890' } }]
      });

      if (paciente3) {
        const [pacienteSeguro3] = await PacienteSeguro.findOrCreate({
          where: {
            id_paciente: paciente3.id,
            id_seguro: 3, // Swiss Medical
            codigo_afiliado: '34567890003'
          },
          defaults: {
            id_paciente: paciente3.id,
            id_seguro: 3,
            codigo_afiliado: '34567890003'
          }
        });

        const cama3 = await Cama.findOne({
          where: { id: 11, estado: 'disponible' } // HAB-8, Cama 1
        });

        if (cama3) {
          await Internacion.findOrCreate({
            where: { id_cama: cama3.id },
            defaults: {
              id_paciente_seguro: pacienteSeguro3.id,
              id_cama: cama3.id,
              id_motivo: 3, // Traumatológicos y Ortopedia
              detalle_motivo: 'Fractura de fémur izquierdo por accidente de tránsito. Post cirugía de osteosíntesis.',
              id_contactoEmergencia: contacto3.id,
              fecha_internacion: new Date('2025-10-14 20:15:00'),
              estado: 'activa',
              prioridad: null, // Sin prioridad asignada inicialmente
              sintomas_principales: 'Dolor intenso en pierna izquierda, limitación de movimiento'
            }
          });

          await cama3.update({ estado: 'ocupada' });
          console.log('✅ Internación 3 creada: Carlos Rodríguez');
        }
      }

      console.log('✅ Seed de internaciones completado');

    } catch (error) {
      console.error('❌ Error al crear internaciones:', error);
      throw error;
    }
  },

  down: async () => {
    try {
      // Eliminar las internaciones creadas
      await Internacion.destroy({
        where: {
          id_cama: [1, 6, 11]
        }
      });

      // Liberar las camas
      await Cama.update(
        { estado: 'disponible' },
        { where: { id: [1, 6, 11] } }
      );

      console.log('✅ Seed de internaciones revertido');
    } catch (error) {
      console.error('❌ Error al revertir seed de internaciones:', error);
      throw error;
    }
  }
};
