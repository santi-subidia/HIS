const { z } = require('zod');

const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

const contactoEmergenciaSchema = z.object({
  DNI_contacto: z.string()
    .regex(/^[0-9]+$/, { message: 'DNI inválido' })
    .max(9, 'DNI debe tener hasta 9 dígitos')
    .min(7, 'DNI debe tener al menos 7 dígitos')
    .refine(val => Number(val) >= 1000000, { message: 'El DNI debe ser mayor o igual a 1.000.000' }),
  nombre: z.string()
    .trim()
    .min(2, 'Nombre requerido (mínimo 2 letras)')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    .refine(val => val.replace(/\s/g, '').length >= 2, { message: 'El nombre debe tener al menos 2 letras' }),
  apellido: z.string()
    .trim()
    .min(2, 'Apellido requerido (mínimo 2 letras)')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, { message: 'El apellido solo puede contener letras y espacios' })
    .refine(val => val.replace(/\s/g, '').length >= 2, { message: 'El apellido debe tener al menos 2 letras' }),
  telefono: z.string()
    .regex(/^\d{7,15}$/, 'El teléfono debe tener entre 7 y 15 dígitos numéricos'),
  id_parentesco: z.coerce.number({ required_error: 'Parentesco requerido' }).int().min(1, 'Parentesco requerido')
});

module.exports = { contactoEmergenciaSchema };