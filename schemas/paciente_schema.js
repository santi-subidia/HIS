const { z } = require('zod');

const pacienteSchema = z.object({
  DNI: z.string()
    .regex(/^\d+$/, { message: 'DNI inválido' })
    .max(9, 'DNI debe tener hasta 9 dígitos')
    .min(7, 'DNI debe tener al menos 7 dígitos'),
  apellido: z.string()
    .min(1, 'Apellido requerido')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, { message: 'El apellido solo puede contener letras y espacios' }),
  nombre: z.string()
    .min(1, 'Nombre requerido')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' }),
  sexo: z.enum(['0', '1', '2'], { message: 'Sexo inválido' }),
  fechaNacimiento: z.string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Fecha inválida' }
    )
    .refine(
      (val) => new Date(val) <= new Date(),
      { message: 'La fecha de nacimiento no puede ser del futuro' }
    ),
  id_tipoSangre: z.string().regex(/^\d+$/, { message: 'Tipo de sangre inválido' }).transform(Number),
  domicilio: z.string().min(1, 'Domicilio requerido'),
  nro_Telefono: z.string()
    .regex(/^\d+$/, { message: 'El teléfono solo puede contener números' })
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(15, 'El teléfono debe tener hasta 15 dígitos'),
  id_localidad: z.string().regex(/^\d+$/, { message: 'Localidad inválida' }).transform(Number),
});

module.exports = { pacienteSchema };
