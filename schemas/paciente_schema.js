const { z } = require('zod');

const pacienteSchema = z.object({
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
  sexo: z.enum(['0', '1', '2'], { message: 'Sexo inválido' }),
  fechaNacimiento: z.string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Fecha inválida' }
    )
    .refine(
      (val) => new Date(val) <= new Date(),
      { message: 'La fecha de nacimiento no puede ser del futuro' }
    )
    .refine(
      (val) => {
        const fecha = new Date(val);
        const hoy = new Date();
        const hace126 = new Date();
        hace126.setFullYear(hoy.getFullYear() - 125);
        return fecha >= hace126;
      },
      { message: 'La fecha de nacimiento no puede ser mayor a 125 años atrás' }
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
