const { z } = require('zod');

const internacionSchema = z.object({
  id_paciente_seguro: z.number({ required_error: 'Paciente/Seguro requerido' }),
  id_cama: z.number({ required_error: 'Cama requerida' }),
  id_motivo: z.number({ required_error: 'Motivo de internación requerido' }),
  detalle_motivo: z.string({ required_error: 'Detalle del motivo requerido' })
  .max(1000, 'El detalle no debe superar los 1000 caracteres').optional(),
  id_contactoEmergencia: z.number({ required_error: 'Contacto de emergencia requerido' }),
  fecha_internacion: z.string({ required_error: 'Fecha de internación requerida' })
    .refine(val => !isNaN(Date.parse(val)), { message: 'Fecha de internación inválida' }),
  estado: z.enum(['activa', 'alta', 'traslado'], { required_error: 'Estado requerido' }),
});

module.exports = { internacionSchema };