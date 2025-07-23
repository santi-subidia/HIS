const z = require('zod');

const personaSchema = z.object({
      DNI: z.string()
        .regex(/^[0-9]+$/, { message: 'DNI inválido' })
        .max(9, 'DNI debe tener hasta 9 dígitos')
        .min(7, 'DNI debe tener al menos 7 dígitos')
        .refine(val => Number(val) >= 1000000, { message: 'El DNI debe ser mayor o igual a 1.000.000' }),
      apellido: z.string()
        .trim()
        .min(2, { message: 'El apellido es requerido y debe tener al menos 2 letras (no solo espacios)' })
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, { message: 'El apellido solo puede contener letras y espacios' })
        .refine(val => val.replace(/\s/g, '').length >= 2, { message: 'El apellido debe tener al menos 2 letras (no solo espacios)' }),
      nombre: z.string()
        .trim()
        .min(2, { message: 'El nombre es requerido y debe tener al menos 2 letras (no solo espacios)' })
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, { message: 'El nombre solo puede contener letras y espacios' })
        .refine(val => val.replace(/\s/g, '').length >= 2, { message: 'El nombre debe tener al menos 2 letras (no solo espacios)' }),
      telefono: z.string()
        .regex(/^\d+$/, { message: 'El teléfono solo puede contener números' })
        .min(7, 'El teléfono debe tener al menos 7 dígitos')
        .max(15, 'El teléfono debe tener hasta 15 dígitos')
})

module.exports = { personaSchema };
