const { Internacion, Alta, Plan_cuidado, Medico, Persona, PacienteSeguro, Paciente, Cama, Motivo, Tipo, Registro_sv, Antecedente, Historial_medico, Reseta, Renglon_reseta, Medicamento } = require('../models');

module.exports = {
  up: async () => {
    try {
      console.log('🔄 Iniciando seed de internaciones con alta...');

      // Obtener médico
      const medico1Persona = await Persona.findOne({
        include: [{ model: Medico, as: 'medico', required: true }]
      });
      const medico1 = medico1Persona?.medico;

      if (!medico1) {
        console.error('❌ No se encontró médico');
        return;
      }

      // Obtener pacientes
      const pacientes = await Paciente.findAll({
        include: [{ model: Persona, as: 'persona' }],
        limit: 3
      });

      if (pacientes.length < 3) {
        console.error('❌ No hay suficientes pacientes');
        return;
      }

      // Obtener tipos y motivos
      const tipoTransitorio = await Tipo.findOne({ where: { nombre: 'Transitorio' } });
      const tipoFinal = await Tipo.findOne({ where: { nombre: 'Final' } });
      const motivoCardio = await Motivo.findOne({ where: { nombre: 'Clínicos' } });
      const motivoRespi = await Motivo.findOne({ where: { nombre: 'Emergencias y Urgencias' } });
      const motivoTrauma = await Motivo.findOne({ where: { nombre: 'Traumatológicos y Ortopedia' } });

      if (!tipoTransitorio || !tipoFinal) {
        console.error('❌ No se encontraron tipos de plan de cuidado necesarios');
        return;
      }

      if (!motivoCardio || !motivoRespi || !motivoTrauma) {
        console.error('❌ No se encontraron motivos necesarios');
        console.log('Motivos disponibles:', await Motivo.findAll({ attributes: ['nombre'] }));
        return;
      }

      // Obtener camas disponibles
      const camas = await Cama.findAll({ limit: 5 });
      const medicamentos = await Medicamento.findAll({ limit: 3 });

      if (camas.length < 3) {
        console.error('❌ No hay suficientes camas disponibles');
        return;
      }

      // ==========================================
      // INTERNACIÓN 1: Alta Médica (ya finalizada hace 2 meses)
      // ==========================================
      const paciente1 = pacientes[0];
      const [pacienteSeguro1] = await PacienteSeguro.findOrCreate({
        where: { id_paciente: paciente1.id },
        defaults: {
          id_paciente: paciente1.id,
          id_seguro: 1,
          codigo_afiliado: `PS-${paciente1.id}-001`
        }
      });

      const [internacion1] = await Internacion.findOrCreate({
        where: { 
          id_paciente_seguro: pacienteSeguro1.id,
          fecha_internacion: new Date('2024-09-10 08:00:00')
        },
        defaults: {
          id_paciente_seguro: pacienteSeguro1.id,
          id_cama: camas[0].id,
          id_motivo: motivoCardio.id,
          fecha_internacion: new Date('2024-09-10 08:00:00'),
          detalle_motivo: 'Infarto agudo de miocardio. Dolor precordial intenso con irradiación a brazo izquierdo.',
          prioridad: 'alta',
          estado: 'alta',
          isDesconocido: null,
          id_contactoEmergencia: null
        }
      });

      // Historial médico
      let [historial1] = await Historial_medico.findOrCreate({
        where: { id_paciente: paciente1.id },
        defaults: { id_paciente: paciente1.id, id_reseta: null }
      });

      // Antecedentes
      const tipoEnfermedades = await Tipo.findOne({ where: { nombre: 'Enfermedades Previas' } });
      if (tipoEnfermedades) {
        await Antecedente.findOrCreate({
          where: { id_historial: historial1.id, descripcion: 'Hipertensión arterial crónica' },
          defaults: {
            id_historial: historial1.id,
            id_tipo: tipoEnfermedades.id,
            descripcion: 'Hipertensión arterial crónica'
          }
        });
      }

      // Signos vitales durante internación
      await Registro_sv.findOrCreate({
        where: { 
          id_internacion: internacion1.id,
          fecha: new Date('2024-09-10 09:00:00')
        },
        defaults: {
          id_internacion: internacion1.id,
          id_persona: medico1Persona.id,
          fecha: new Date('2024-09-10 09:00:00'),
          presion_arterial_sistolica: 160,
          presion_arterial_diastolica: 100,
          frecuencia_cardiaca: 105,
          frecuencia_respiratoria: 22,
          temperatura: 37.1,
          color_piel: 'Pálido',
          respuesta_estimulos: 'Alerta, refiere dolor intenso',
          observaciones: 'Ingreso urgente por IAM. ECG muestra elevación ST.'
        }
      });

      // Plan transitorio
      const [planTrans1] = await Plan_cuidado.findOrCreate({
        where: { 
          id_internacion: internacion1.id,
          id_tipo: tipoTransitorio.id
        },
        defaults: {
          id_persona: medico1Persona.id,
          id_internacion: internacion1.id,
          id_tipo: tipoTransitorio.id,
          diagnostico: 'Infarto agudo de miocardio STEMI. Síndrome coronario agudo.',
          tratamiento: 'Reposo absoluto. Angioplastia coronaria. Antiagregación dual. Monitoreo continuo.',
          fecha: new Date('2024-09-10 10:00:00'),
          id_reseta: null
        }
      });

      // Receta para plan transitorio
      if (medicamentos.length > 0) {
        const [receta1] = await Reseta.findOrCreate({
          where: { id: planTrans1.id_reseta || 0 },
          defaults: {
            id_persona: medico1Persona.id,
            fecha: new Date('2024-09-10 11:00:00'),
            id_historial: historial1.id
          }
        });

        await planTrans1.update({ id_reseta: receta1.id });

        await Renglon_reseta.findOrCreate({
          where: { id_reseta: receta1.id, id_medicamento: medicamentos[0].id },
          defaults: {
            id_reseta: receta1.id,
            id_medicamento: medicamentos[0].id,
            dosis: '100mg cada 24 horas',
            duracion: '30 días',
            indicaciones: 'Antiagregante plaquetario'
          }
        });
      }

      // Plan final
      const [planFinal1] = await Plan_cuidado.findOrCreate({
        where: { 
          id_internacion: internacion1.id,
          id_tipo: tipoFinal.id
        },
        defaults: {
          id_persona: medico1Persona.id,
          id_internacion: internacion1.id,
          id_tipo: tipoFinal.id,
          diagnostico: 'Post-angioplastia coronaria exitosa. IAM resuelto.',
          tratamiento: 'Continuar antiagregación dual. Control ambulatorio en 7 días. Rehabilitación cardíaca.',
          fecha: new Date('2024-09-17 16:00:00'),
          id_reseta: null
        }
      });

      // Receta para plan final
      if (medicamentos.length > 1) {
        const [receta2] = await Reseta.findOrCreate({
          where: { id: planFinal1.id_reseta || 0 },
          defaults: {
            id_persona: medico1Persona.id,
            fecha: new Date('2024-09-17 16:30:00'),
            id_historial: historial1.id
          }
        });

        await planFinal1.update({ id_reseta: receta2.id });

        await Renglon_reseta.findOrCreate({
          where: { id_reseta: receta2.id, id_medicamento: medicamentos[1].id },
          defaults: {
            id_reseta: receta2.id,
            id_medicamento: medicamentos[1].id,
            dosis: '75mg cada 12 horas',
            duracion: '90 días',
            indicaciones: 'Tomar con alimentos'
          }
        });
      }

      // Alta médica
      await Alta.findOrCreate({
        where: { id_internacion: internacion1.id },
        defaults: {
          id_internacion: internacion1.id,
          id_medico: medico1.id,
          id_plan_cuidado_final: planFinal1.id,
          tipo_alta: 'Medica',
          diagnostico_final: 'Infarto agudo de miocardio STEMI resuelto satisfactoriamente mediante angioplastia coronaria. Función cardíaca preservada. Sin complicaciones.',
          fecha_alta: new Date('2024-09-18 10:00:00'),
          observaciones: 'Evolución favorable. Paciente estable hemodinámicamente. Se otorga alta con controles ambulatorios.',
          recomendaciones: 'Control ambulatorio en 7 días. Rehabilitación cardíaca. Dieta hiposódica. Evitar esfuerzos físicos intensos por 30 días.'
        }
      });

      console.log('  ✅ Internación 1 con alta médica creada');

      // ==========================================
      // INTERNACIÓN 2: Alta Voluntaria (hace 1 mes)
      // ==========================================
      const paciente2 = pacientes[1];
      const [pacienteSeguro2] = await PacienteSeguro.findOrCreate({
        where: { id_paciente: paciente2.id },
        defaults: {
          id_paciente: paciente2.id,
          id_seguro: 1,
          codigo_afiliado: `PS-${paciente2.id}-002`
        }
      });

      const [internacion2] = await Internacion.findOrCreate({
        where: { 
          id_paciente_seguro: pacienteSeguro2.id,
          fecha_internacion: new Date('2024-10-20 14:00:00')
        },
        defaults: {
          id_paciente_seguro: pacienteSeguro2.id,
          id_cama: camas[1].id,
          id_motivo: motivoRespi.id,
          fecha_internacion: new Date('2024-10-20 14:00:00'),
          detalle_motivo: 'Neumonía bilateral. Fiebre alta y dificultad respiratoria moderada.',
          prioridad: 'media',
          estado: 'alta',
          isDesconocido: null,
          id_contactoEmergencia: null
        }
      });

      // Historial
      let [historial2] = await Historial_medico.findOrCreate({
        where: { id_paciente: paciente2.id },
        defaults: { id_paciente: paciente2.id, id_reseta: null }
      });

      // Signos vitales
      await Registro_sv.findOrCreate({
        where: { 
          id_internacion: internacion2.id,
          fecha: new Date('2024-10-20 15:00:00')
        },
        defaults: {
          id_internacion: internacion2.id,
          id_persona: medico1Persona.id,
          fecha: new Date('2024-10-20 15:00:00'),
          presion_arterial_sistolica: 125,
          presion_arterial_diastolica: 80,
          frecuencia_cardiaca: 92,
          frecuencia_respiratoria: 24,
          temperatura: 38.5,
          color_piel: 'Normal',
          respuesta_estimulos: 'Alerta',
          observaciones: 'Fiebre alta. Saturación O2 89%. Rx compatible con neumonía.'
        }
      });

      // Plan transitorio
      const [planTrans2] = await Plan_cuidado.findOrCreate({
        where: { 
          id_internacion: internacion2.id,
          id_tipo: tipoTransitorio.id
        },
        defaults: {
          id_persona: medico1Persona.id,
          id_internacion: internacion2.id,
          id_tipo: tipoTransitorio.id,
          diagnostico: 'Neumonía adquirida en comunidad bilateral.',
          tratamiento: 'Antibioticoterapia EV. Oxigenoterapia. Hidratación.',
          fecha: new Date('2024-10-20 16:00:00'),
          id_reseta: null
        }
      });

      // Plan final (incompleto - paciente decidió irse)
      const [planFinal2] = await Plan_cuidado.findOrCreate({
        where: { 
          id_internacion: internacion2.id,
          id_tipo: tipoFinal.id
        },
        defaults: {
          id_persona: medico1Persona.id,
          id_internacion: internacion2.id,
          id_tipo: tipoFinal.id,
          diagnostico: 'Neumonía en tratamiento. Mejoría clínica parcial.',
          tratamiento: 'Completar antibioticoterapia vía oral. Controles en 3 días.',
          fecha: new Date('2024-10-23 09:00:00'),
          id_reseta: null
        }
      });

      // Alta voluntaria
      await Alta.findOrCreate({
        where: { id_internacion: internacion2.id },
        defaults: {
          id_internacion: internacion2.id,
          id_medico: medico1.id,
          id_plan_cuidado_final: planFinal2.id,
          tipo_alta: 'Voluntaria',
          diagnostico_final: 'Neumonía adquirida en comunidad bilateral en tratamiento. Mejoría clínica parcial. Saturación de oxígeno estable en aire ambiente.',
          fecha_alta: new Date('2024-10-23 10:30:00'),
          observaciones: 'Paciente solicita alta voluntaria contra indicación médica. Se informa de riesgos. Firma consentimiento informado. Se otorga plan de tratamiento ambulatorio.',
          recomendaciones: 'Completar antibioticoterapia oral por 7 días. Control en 3 días. Acudir inmediatamente ante empeoramiento de síntomas.'
        }
      });

      console.log('  ✅ Internación 2 con alta voluntaria creada');

      // ==========================================
      // INTERNACIÓN 3: Alta por Traslado (hace 3 semanas)
      // ==========================================
      const paciente3 = pacientes[2];
      const [pacienteSeguro3] = await PacienteSeguro.findOrCreate({
        where: { id_paciente: paciente3.id },
        defaults: {
          id_paciente: paciente3.id,
          id_seguro: 1,
          codigo_afiliado: `PS-${paciente3.id}-003`
        }
      });

      const [internacion3] = await Internacion.findOrCreate({
        where: { 
          id_paciente_seguro: pacienteSeguro3.id,
          fecha_internacion: new Date('2024-11-01 22:00:00')
        },
        defaults: {
          id_paciente_seguro: pacienteSeguro3.id,
          id_cama: camas[2].id,
          id_motivo: motivoTrauma.id,
          fecha_internacion: new Date('2024-11-01 22:00:00'),
          detalle_motivo: 'Politraumatismo severo por accidente de tránsito. TEC moderado, fractura de fémur.',
          prioridad: 'alta',
          estado: 'traslado',
          isDesconocido: null,
          id_contactoEmergencia: null
        }
      });

      // Historial
      let [historial3] = await Historial_medico.findOrCreate({
        where: { id_paciente: paciente3.id },
        defaults: { id_paciente: paciente3.id, id_reseta: null }
      });

      // Signos vitales
      await Registro_sv.findOrCreate({
        where: { 
          id_internacion: internacion3.id,
          fecha: new Date('2024-11-01 22:30:00')
        },
        defaults: {
          id_internacion: internacion3.id,
          id_persona: medico1Persona.id,
          fecha: new Date('2024-11-01 22:30:00'),
          presion_arterial_sistolica: 90,
          presion_arterial_diastolica: 60,
          frecuencia_cardiaca: 115,
          frecuencia_respiratoria: 26,
          temperatura: 36.2,
          color_piel: 'Pálido',
          respuesta_estimulos: 'Somnoliento',
          observaciones: 'Estado crítico. Hipotensión. Glasgow 12. Requiere atención en centro de mayor complejidad.'
        }
      });

      // Plan transitorio (estabilización)
      const [planTrans3] = await Plan_cuidado.findOrCreate({
        where: { 
          id_internacion: internacion3.id,
          id_tipo: tipoTransitorio.id
        },
        defaults: {
          id_persona: medico1Persona.id,
          id_internacion: internacion3.id,
          id_tipo: tipoTransitorio.id,
          diagnostico: 'Politraumatismo severo. TEC moderado. Fractura femoral derecha.',
          tratamiento: 'Estabilización hemodinámica. Protección cervical. Preparación para traslado urgente.',
          fecha: new Date('2024-11-02 00:00:00'),
          id_reseta: null
        }
      });

      // Plan final (traslado)
      const [planFinal3] = await Plan_cuidado.findOrCreate({
        where: { 
          id_internacion: internacion3.id,
          id_tipo: tipoFinal.id
        },
        defaults: {
          id_persona: medico1Persona.id,
          id_internacion: internacion3.id,
          id_tipo: tipoFinal.id,
          diagnostico: 'Politraumatismo estabilizado para traslado.',
          tratamiento: 'Traslado a Hospital Central para cirugía especializada y cuidados intensivos.',
          fecha: new Date('2024-11-02 04:00:00'),
          id_reseta: null
        }
      });

      // Alta por traslado
      await Alta.findOrCreate({
        where: { id_internacion: internacion3.id },
        defaults: {
          id_internacion: internacion3.id,
          id_medico: medico1.id,
          id_plan_cuidado_final: planFinal3.id,
          tipo_alta: 'Traslado',
          diagnostico_final: 'Politraumatismo severo estabilizado. TEC moderado (Glasgow 14 pre-traslado). Fractura de fémur derecho. Hemodinámicamente estable para traslado.',
          fecha_alta: new Date('2024-11-02 05:00:00'),
          observaciones: 'Paciente estabilizado y trasladado en ambulancia medicalizada a Hospital Central. Requiere atención neuroquirúrgica y traumatológica especializada. Acompañado por médico de guardia.',
          recomendaciones: 'Requiere evaluación neuroquirúrgica urgente. Cirugía ortopédica diferida. Continuar analgesia y protección cervical.'
        }
      });

      console.log('  ✅ Internación 3 con alta por traslado creada');

      console.log('\n✅ Seed de internaciones con alta completado exitosamente');
      console.log('📊 Resumen:');
      console.log('   - 3 internaciones finalizadas con diferentes tipos de alta');
      console.log('   - Alta Médica (IAM tratado)');
      console.log('   - Alta Voluntaria (neumonía)');
      console.log('   - Alta por Traslado (politraumatismo)');
      console.log('   - Cada una con historial completo: antecedentes, signos vitales, planes de cuidado');

    } catch (error) {
      console.error('❌ Error al crear internaciones con alta:', error);
      throw error;
    }
  },

  down: async () => {
    try {
      // Las internaciones se pueden eliminar manualmente si es necesario
      console.log('✅ Revertir seed de internaciones con alta');
    } catch (error) {
      console.error('❌ Error al revertir seed:', error);
      throw error;
    }
  }
};
