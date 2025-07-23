const { z } = require('zod');

const contactoEmergenciaSchema = z.object({
  id_persona: z.coerce.number({ required_error: 'ID de persona requerido' }).int().min(1, 'ID de persona requerido'),
  id_parentesco: z.coerce.number({ required_error: 'Parentesco requerido' }).int().min(1, 'Parentesco requerido')
});

module.exports = { contactoEmergenciaSchema };