const { z } = require('zod');
const { personaSchema } = require('./persona_schema');

const usuarioSchema = z.object({
  // DNI de la persona (validado por personaSchema)
  DNI: personaSchema.shape.DNI,

  // Nombre de usuario
  usuario: z.string({
    required_error: 'El nombre de usuario es obligatorio',
    invalid_type_error: 'El nombre de usuario debe ser un texto'
  })
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede exceder los 50 caracteres')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones, puntos y guiones bajos'),

  // Contraseña
  password: z.string({
    required_error: 'La contraseña es obligatoria',
    invalid_type_error: 'La contraseña debe ser un texto'
  })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder los 100 caracteres'),

  // Confirmación de contraseña
  password_confirm: z.string({
    required_error: 'Debe confirmar la contraseña',
    invalid_type_error: 'La confirmación de contraseña debe ser un texto'
  }),

  // Rol del usuario
  id_rol: z.string({
    required_error: 'Debe seleccionar un rol',
    invalid_type_error: 'El rol debe ser un texto'
  })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'El rol debe ser un número válido mayor a 0'
    }),

  // Campos opcionales para crear persona (si no existe) - reutilizan validaciones de personaSchema
  nombre: personaSchema.shape.nombre.optional(),

  apellido: personaSchema.shape.apellido.optional(),

  telefono: personaSchema.shape.telefono.optional()
}).refine(
  (data) => data.password === data.password_confirm,
  {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirm']
  }
);

module.exports = { usuarioSchema };
