const { z } = require('zod');

const pacienteSchema = z.object({
  id_persona: z.string()
    .regex(/^\d+$/, { message: 'ID de persona inválido' })
    .transform(Number),
  fecha_nacimiento: z.string()
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
  id_tipoSangre: z.string()
    .regex(/^\d+$/, { message: 'Tipo de sangre inválido' })
    .transform(Number),
  domicilio: z.string()
    .min(1, 'Domicilio requerido'),
  id_localidad: z.string()
    .regex(/^\d+$/, { message: 'Localidad inválida' })
    .transform(Number),
  sexo: z.enum(['Masculino', 'Femenino'], { message: "El sexo debe ser 'Masculino' o 'Femenino'" })
});

module.exports = { pacienteSchema };
