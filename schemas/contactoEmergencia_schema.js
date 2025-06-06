const { z } = require('zod');

const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

const contactoEmergenciaSchema = z.object({
  DNI_contacto: z.string()
    .regex(/^\d{7,9}$/, 'El DNI debe contener entre 7 y 9 dígitos numéricos'),
  nombre: z.string()
    .min(2, 'El nombre debe tener entre 2 y 50 caracteres')
    .max(50, 'El nombre debe tener entre 2 y 50 caracteres')
    .regex(soloLetras, 'El nombre solo puede contener letras y espacios'),
  apellido: z.string()
    .min(2, 'El apellido debe tener entre 2 y 50 caracteres')
    .max(50, 'El apellido debe tener entre 2 y 50 caracteres')
    .regex(soloLetras, 'El apellido solo puede contener letras y espacios'),
  telefono: z.string()
    .regex(/^\d{7,15}$/, 'El teléfono debe tener entre 7 y 15 dígitos numéricos'),
  id_parentesco: z.coerce.number({ required_error: 'Parentesco requerido' }).int().min(1, 'Parentesco requerido')
});

module.exports = { contactoEmergenciaSchema };