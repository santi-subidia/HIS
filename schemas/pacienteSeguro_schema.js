const { z } = require('zod');

const pacienteSeguroSchema = z.object({
  id_paciente: z.number({ required_error: 'Paciente requerido' }),
  id_seguro: z.number({ required_error: 'Seguro requerido' }),
  codigo_afiliado: z.string()
    .min(1, 'Código de afiliado requerido')
    .regex(/^\d+$/, 'El código de afiliado debe contener solo números'),
  fecha_desde: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: 'Fecha desde inválida' })
    .refine(val => new Date(val) <= new Date(), { message: 'La fecha desde no puede ser futura' }),
  });

module.exports = { pacienteSeguroSchema };