const { Registro_sv, Plan_cuidado, Solicitud_medica, Antecedente, Historial_medico, Internacion, Medico, Enfermero, Persona, Paciente, PacienteSeguro, Tipo, TipoEstudio, Reseta, Renglon_reseta, Medicamento } = require('../models');

module.exports = {
  up: async () => {
    try {
      console.log('🔄 Iniciando seed de datos de internaciones...');

      // Obtener usuarios (médicos y enfermeros)
      const medico1Persona = await Persona.findOne({
        include: [{ model: Medico, as: 'medico', required: true }]
      });
      const medico1 = medico1Persona?.medico;

      const enfermero1Persona = await Persona.findOne({
        include: [{ model: Enfermero, as: 'enfermero', required: true }]
      });
      const enfermero1 = enfermero1Persona?.enfermero;

      if (!medico1 || !enfermero1) {
        console.error('❌ No se encontraron médicos o enfermeros. Ejecuta primero medicos_seed y enfermeros_seed');
        return;
      }

      // Obtener internaciones activas
      const internaciones = await Internacion.findAll({
        where: { estado: 'activa' },
        include: [
          {
            model: PacienteSeguro,
            as: 'PacienteSeguro',
            include: [{
              model: Paciente,
              as: 'paciente',
              include: [{ model: Persona, as: 'persona' }]
            }]
          }
        ],
        limit: 3
      });

      if (internaciones.length === 0) {
        console.error('❌ No se encontraron internaciones activas. Ejecuta primero internaciones_seed');
        return;
      }

      // Obtener tipos necesarios
      const tipoTransitorio = await Tipo.findOne({ where: { nombre: 'Transitorio' } });
      const tipoFinal = await Tipo.findOne({ where: { nombre: 'Final' } });
      
      // Obtener tipos de estudios
      const tipoEstudioSangre = await TipoEstudio.findOne({ where: { nombre: 'Hemograma Completo' } });
      const tipoEstudioRayos = await TipoEstudio.findOne({ where: { nombre: 'Radiografía de Tórax' } });
      const tipoEstudioECG = await TipoEstudio.findOne({ where: { nombre: 'Electrocardiograma (ECG)' } });

      // Obtener medicamentos para recetas
      const medicamentos = await Medicamento.findAll({ limit: 5 });

      // ==========================================
      // INTERNACIÓN 1: Juan González
      // ==========================================
      const internacion1 = internaciones[0];
      const paciente1 = internacion1.PacienteSeguro?.paciente;

      if (paciente1) {
        console.log(`\n📋 Procesando internación de ${internacion1.PacienteSeguro.paciente.persona.nombre}...`);

        // 1. Antecedentes Médicos
        let historial1 = await Historial_medico.findOne({ where: { id_paciente: paciente1.id } });
        if (!historial1) {
          historial1 = await Historial_medico.create({
            id_paciente: paciente1.id,
            id_reseta: null
          });
        }

        const tipoAlergias = await Tipo.findOne({ where: { nombre: 'Alergias' } });
        const tipoCirugias = await Tipo.findOne({ where: { nombre: 'Cirugías' } });
        const tipoEnfermedades = await Tipo.findOne({ where: { nombre: 'Enfermedades Previas' } });

        if (tipoAlergias) {
          await Antecedente.findOrCreate({
            where: { id_historial: historial1.id, descripcion: 'Alergia a la penicilina' },
            defaults: {
              id_historial: historial1.id,
              id_tipo: tipoAlergias.id,
              descripcion: 'Alergia a la penicilina'
            }
          });
        }

        if (tipoCirugias) {
          await Antecedente.findOrCreate({
            where: { id_historial: historial1.id, descripcion: 'Bypass coronario (2020)' },
            defaults: {
              id_historial: historial1.id,
              id_tipo: tipoCirugias.id,
              descripcion: 'Bypass coronario (2020)'
            }
          });
        }

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

        // 2. Signos Vitales (varios registros)
        const signosVitales1 = [
          {
            fecha: new Date('2025-10-15 09:00:00'),
            presion_arterial_sistolica: 145,
            presion_arterial_diastolica: 90,
            frecuencia_cardiaca: 82,
            frecuencia_respiratoria: 18,
            temperatura: 36.8,
            color_piel: 'Normal',
            respuesta_estimulos: 'Alerta',
            observaciones: 'Ingreso del paciente, signos estables'
          },
          {
            fecha: new Date('2025-10-15 15:00:00'),
            presion_arterial_sistolica: 138,
            presion_arterial_diastolica: 85,
            frecuencia_cardiaca: 78,
            frecuencia_respiratoria: 16,
            temperatura: 36.7,
            color_piel: 'Normal',
            respuesta_estimulos: 'Alerta',
            observaciones: 'Control vespertino, mejoría en presión arterial'
          },
          {
            fecha: new Date('2025-10-16 08:00:00'),
            presion_arterial_sistolica: 130,
            presion_arterial_diastolica: 80,
            frecuencia_cardiaca: 75,
            frecuencia_respiratoria: 16,
            temperatura: 36.5,
            color_piel: 'Normal',
            respuesta_estimulos: 'Alerta',
            observaciones: 'Control matutino, signos vitales normalizados'
          }
        ];

        for (const sv of signosVitales1) {
          await Registro_sv.findOrCreate({
            where: { 
              id_internacion: internacion1.id,
              fecha: sv.fecha
            },
            defaults: {
              id_internacion: internacion1.id,
              id_persona: enfermero1Persona.id,
              ...sv
            }
          });
        }

        // 3. Plan de Cuidado Transitorio
        if (tipoTransitorio) {
          const [planTransitorio1] = await Plan_cuidado.findOrCreate({
            where: { 
              id_internacion: internacion1.id,
              id_tipo: tipoTransitorio.id
            },
            defaults: {
              id_persona: medico1Persona.id,
              id_internacion: internacion1.id,
              id_reseta: null,
              id_tipo: tipoTransitorio.id,
              diagnostico: 'Post-operatorio de cirugía cardiovascular. Hipertensión arterial',
              tratamiento: 'Reposo relativo, monitoreo continuo de signos vitales, dieta hiposódica',
              fecha: new Date('2025-10-15 10:00:00')
            }
          });

          // Crear receta asociada al plan
          if (medicamentos.length > 0) {
            const [receta1] = await Reseta.findOrCreate({
              where: { id: planTransitorio1.id_reseta || 0 },
              defaults: {
                id_persona: medico1Persona.id,
                fecha: new Date('2025-10-15 10:00:00')
              }
            });

            await planTransitorio1.update({ id_reseta: receta1.id });

            // Agregar medicamentos
            await Renglon_reseta.findOrCreate({
              where: { id_reseta: receta1.id, id_medicamento: medicamentos[0].id },
              defaults: {
                id_reseta: receta1.id,
                id_medicamento: medicamentos[0].id,
                dosis: '50mg',
                frecuencia: 'Cada 12 horas',
                via: 'Oral',
                duracion: '7 días'
              }
            });
          }
        }

        // 4. Segundo Plan Transitorio (evolución)
        if (tipoTransitorio) {
          await Plan_cuidado.findOrCreate({
            where: { 
              id_internacion: internacion1.id,
              id_tipo: tipoTransitorio.id,
              fecha: new Date('2025-10-16 09:00:00')
            },
            defaults: {
              id_persona: medico1Persona.id,
              id_internacion: internacion1.id,
              id_reseta: null,
              id_tipo: tipoTransitorio.id,
              diagnostico: 'Evolución favorable del cuadro cardiovascular',
              tratamiento: 'Continuar con medicación actual, iniciar deambulación asistida',
              fecha: new Date('2025-10-16 09:00:00')
            }
          });
        }

        // 5. Solicitudes Médicas
        if (tipoEstudioSangre) {
          await Solicitud_medica.findOrCreate({
            where: { 
              id_internacion: internacion1.id,
              id_tipo_estudio: tipoEstudioSangre.id
            },
            defaults: {
              id_medico: medico1.id,
              id_internacion: internacion1.id,
              id_tipo_estudio: tipoEstudioSangre.id,
              descripcion: 'Control de hemograma post-operatorio. Evaluar anemia y leucocitosis.',
              resultado: 'Hb: 12.5 g/dL, Leucocitos: 8500/mm³, Plaquetas: 220000/mm³. Valores dentro de parámetros normales.',
              fecha_solicitud: new Date('2025-10-15 11:00:00'),
              fecha_completado: new Date('2025-10-15 18:00:00'),
              url_file: null
            }
          });
        }

        if (tipoEstudioECG) {
          await Solicitud_medica.findOrCreate({
            where: { 
              id_internacion: internacion1.id,
              id_tipo_estudio: tipoEstudioECG.id
            },
            defaults: {
              id_medico: medico1.id,
              id_internacion: internacion1.id,
              id_tipo_estudio: tipoEstudioECG.id,
              descripcion: 'ECG de control post-cirugía cardiovascular',
              resultado: 'Ritmo sinusal normal. FC: 75 lpm. No se observan alteraciones isquémicas agudas.',
              fecha_solicitud: new Date('2025-10-16 08:00:00'),
              fecha_completado: new Date('2025-10-16 10:30:00'),
              url_file: null
            }
          });
        }

        console.log('  ✅ Antecedentes creados');
        console.log('  ✅ Signos vitales registrados (3 controles)');
        console.log('  ✅ Planes de cuidado creados');
        console.log('  ✅ Solicitudes médicas creadas');
      }

      // ==========================================
      // INTERNACIÓN 2: María Pérez
      // ==========================================
      if (internaciones.length > 1) {
        const internacion2 = internaciones[1];
        const paciente2 = internacion2.PacienteSeguro?.paciente;

        if (paciente2) {
          console.log(`\n📋 Procesando internación de ${internacion2.PacienteSeguro.paciente.persona.nombre}...`);

          // Antecedentes
          let historial2 = await Historial_medico.findOne({ where: { id_paciente: paciente2.id } });
          if (!historial2) {
            historial2 = await Historial_medico.create({
              id_paciente: paciente2.id,
              id_reseta: null
            });
          }

          const tipoEnfermedades = await Tipo.findOne({ where: { nombre: 'Enfermedades Previas' } });
          if (tipoEnfermedades) {
            await Antecedente.findOrCreate({
              where: { id_historial: historial2.id, descripcion: 'Diabetes gestacional en embarazo anterior' },
              defaults: {
                id_historial: historial2.id,
                id_tipo: tipoEnfermedades.id,
                descripcion: 'Diabetes gestacional en embarazo anterior'
              }
            });
          }

          // Signos Vitales
          const signosVitales2 = [
            {
              fecha: new Date('2025-10-16 14:30:00'),
              presion_arterial_sistolica: 150,
              presion_arterial_diastolica: 95,
              frecuencia_cardiaca: 88,
              frecuencia_respiratoria: 20,
              temperatura: 36.9,
              color_piel: 'Normal',
              respuesta_estimulos: 'Alerta',
              observaciones: 'Ingreso por preeclampsia leve, TA elevada'
            },
            {
              fecha: new Date('2025-10-17 08:00:00'),
              presion_arterial_sistolica: 145,
              presion_arterial_diastolica: 92,
              frecuencia_cardiaca: 85,
              frecuencia_respiratoria: 18,
              temperatura: 36.7,
              color_piel: 'Normal',
              respuesta_estimulos: 'Alerta',
              observaciones: 'Leve mejoría en TA con tratamiento'
            }
          ];

          for (const sv of signosVitales2) {
            await Registro_sv.findOrCreate({
              where: { 
                id_internacion: internacion2.id,
                fecha: sv.fecha
              },
              defaults: {
                id_internacion: internacion2.id,
                id_persona: enfermero1Persona.id,
                ...sv
              }
            });
          }

          // Plan de Cuidado Transitorio
          if (tipoTransitorio) {
            await Plan_cuidado.findOrCreate({
              where: { 
                id_internacion: internacion2.id,
                id_tipo: tipoTransitorio.id
              },
              defaults: {
                id_persona: medico1Persona.id,
                id_internacion: internacion2.id,
                id_reseta: null,
                id_tipo: tipoTransitorio.id,
                diagnostico: 'Embarazo de alto riesgo. Preeclampsia leve. 32 semanas de gestación',
                tratamiento: 'Reposo absoluto, monitoreo fetal continuo, antihipertensivos',
                fecha: new Date('2025-10-16 15:00:00')
              }
            });
          }

          // Solicitud Médica
          if (tipoEstudioSangre) {
            await Solicitud_medica.findOrCreate({
              where: { 
                id_internacion: internacion2.id,
                id_tipo_estudio: tipoEstudioSangre.id
              },
              defaults: {
                id_medico: medico1.id,
                id_internacion: internacion2.id,
                id_tipo_estudio: tipoEstudioSangre.id,
                descripcion: 'Panel metabólico completo. Evaluar función renal y hepática.',
                resultado: null,
                fecha_solicitud: new Date('2025-10-17 09:00:00'),
                fecha_completado: null,
                url_file: null
              }
            });
          }

          console.log('  ✅ Antecedentes creados');
          console.log('  ✅ Signos vitales registrados (2 controles)');
          console.log('  ✅ Plan de cuidado inicial creado');
          console.log('  ✅ Solicitud médica pendiente creada');
        }
      }

      // ==========================================
      // INTERNACIÓN 3: Carlos Rodríguez
      // ==========================================
      if (internaciones.length > 2) {
        const internacion3 = internaciones[2];
        const paciente3 = internacion3.PacienteSeguro?.paciente;

        if (paciente3) {
          console.log(`\n📋 Procesando internación de ${internacion3.PacienteSeguro.paciente.persona.nombre}...`);

          // Antecedentes
          let historial3 = await Historial_medico.findOne({ where: { id_paciente: paciente3.id } });
          if (!historial3) {
            historial3 = await Historial_medico.create({
              id_paciente: paciente3.id,
              id_reseta: null
            });
          }

          const tipoAlergias = await Tipo.findOne({ where: { nombre: 'Alergias' } });
          if (tipoAlergias) {
            await Antecedente.findOrCreate({
              where: { id_historial: historial3.id, descripcion: 'Alergia al yodo' },
              defaults: {
                id_historial: historial3.id,
                id_tipo: tipoAlergias.id,
                descripcion: 'Alergia al yodo'
              }
            });
          }

          // Signos Vitales
          const signosVitales3 = [
            {
              fecha: new Date('2025-10-14 21:00:00'),
              presion_arterial_sistolica: 135,
              presion_arterial_diastolica: 85,
              frecuencia_cardiaca: 95,
              frecuencia_respiratoria: 22,
              temperatura: 37.2,
              color_piel: 'Pálido',
              respuesta_estimulos: 'Alerta, refiere dolor',
              observaciones: 'Post-cirugía inmediato, dolor controlado con analgesia'
            },
            {
              fecha: new Date('2025-10-15 08:00:00'),
              presion_arterial_sistolica: 128,
              presion_arterial_diastolica: 82,
              frecuencia_cardiaca: 88,
              frecuencia_respiratoria: 18,
              temperatura: 36.8,
              color_piel: 'Normal',
              respuesta_estimulos: 'Alerta',
              observaciones: 'Evolución favorable post-quirúrgica'
            },
            {
              fecha: new Date('2025-10-16 08:00:00'),
              presion_arterial_sistolica: 125,
              presion_arterial_diastolica: 80,
              frecuencia_cardiaca: 82,
              frecuencia_respiratoria: 16,
              temperatura: 36.6,
              color_piel: 'Normal',
              respuesta_estimulos: 'Alerta',
              observaciones: 'Continúa evolución favorable, inicia movilización'
            }
          ];

          for (const sv of signosVitales3) {
            await Registro_sv.findOrCreate({
              where: { 
                id_internacion: internacion3.id,
                fecha: sv.fecha
              },
              defaults: {
                id_internacion: internacion3.id,
                id_persona: enfermero1Persona.id,
                ...sv
              }
            });
          }

          // Planes de Cuidado
          if (tipoTransitorio) {
            await Plan_cuidado.findOrCreate({
              where: { 
                id_internacion: internacion3.id,
                id_tipo: tipoTransitorio.id
              },
              defaults: {
                id_persona: medico1Persona.id,
                id_internacion: internacion3.id,
                id_reseta: null,
                id_tipo: tipoTransitorio.id,
                diagnostico: 'Fractura de fémur izquierdo. Post osteosíntesis con placa y tornillos',
                tratamiento: 'Analgesia multimodal, profilaxis antitrombótica, fisioterapia temprana',
                fecha: new Date('2025-10-14 22:00:00')
              }
            });
          }

          if (tipoTransitorio) {
            await Plan_cuidado.findOrCreate({
              where: { 
                id_internacion: internacion3.id,
                id_tipo: tipoTransitorio.id,
                fecha: new Date('2025-10-16 10:00:00')
              },
              defaults: {
                id_persona: medico1Persona.id,
                id_internacion: internacion3.id,
                id_reseta: null,
                id_tipo: tipoTransitorio.id,
                diagnostico: 'Evolución post-quirúrgica favorable. Sin complicaciones',
                tratamiento: 'Continuar analgesia, iniciar carga progresiva con asistencia',
                fecha: new Date('2025-10-16 10:00:00')
              }
            });
          }

          // Solicitudes Médicas
          if (tipoEstudioRayos) {
            await Solicitud_medica.findOrCreate({
              where: { 
                id_internacion: internacion3.id,
                id_tipo_estudio: tipoEstudioRayos.id
              },
              defaults: {
                id_medico: medico1.id,
                id_internacion: internacion3.id,
                id_tipo_estudio: tipoEstudioRayos.id,
                descripcion: 'Radiografía de fémur izquierdo post-osteosíntesis. Control de material de osteosíntesis.',
                resultado: 'Osteosíntesis con placa y tornillos en posición correcta. Alineación ósea adecuada. Sin signos de complicaciones.',
                fecha_solicitud: new Date('2025-10-15 09:00:00'),
                fecha_completado: new Date('2025-10-15 14:00:00'),
                url_file: null
              }
            });
          }

          console.log('  ✅ Antecedentes creados');
          console.log('  ✅ Signos vitales registrados (3 controles)');
          console.log('  ✅ Planes de cuidado creados');
          console.log('  ✅ Solicitud médica completada');
        }
      }

      console.log('\n✅ Seed de datos de internaciones completado exitosamente');
      console.log('📊 Resumen:');
      console.log('   - Antecedentes médicos agregados');
      console.log('   - Múltiples registros de signos vitales');
      console.log('   - Planes de cuidado iniciales y de evolución');
      console.log('   - Solicitudes médicas (completadas y pendientes)');

    } catch (error) {
      console.error('❌ Error al crear datos de internaciones:', error);
      throw error;
    }
  },

  down: async () => {
    try {
      // Obtener internaciones de prueba
      const internaciones = await Internacion.findAll({
        where: { estado: 'activa' },
        limit: 3
      });

      const ids = internaciones.map(i => i.id);

      // Eliminar en orden inverso por las foreign keys
      await Renglon_reseta.destroy({
        include: [{
          model: Reseta,
          as: 'reseta',
          include: [{
            model: Plan_cuidado,
            as: 'planes_cuidado',
            where: { id_internacion: ids }
          }]
        }]
      });

      await Solicitud_medica.destroy({ where: { id_internacion: ids } });
      await Registro_sv.destroy({ where: { id_internacion: ids } });
      
      const planes = await Plan_cuidado.findAll({ where: { id_internacion: ids } });
      const recetaIds = planes.map(p => p.id_reseta).filter(id => id);
      
      await Plan_cuidado.destroy({ where: { id_internacion: ids } });
      if (recetaIds.length > 0) {
        await Reseta.destroy({ where: { id: recetaIds } });
      }

      // No eliminamos antecedentes porque están asociados al paciente, no a la internación

      console.log('✅ Seed de datos de internaciones revertido');
    } catch (error) {
      console.error('❌ Error al revertir seed:', error);
      throw error;
    }
  }
};
