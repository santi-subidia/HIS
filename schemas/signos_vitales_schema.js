const { z } = require('zod');

const signosVitalesSchema = z.object({
  presion_arterial_sistolica: z.string()
    .transform((val) => val === '' ? null : parseFloat(val))
    .refine(
      (val) => val === null || (!isNaN(val) && val >= 0 && val <= 300),
      { message: 'La presión sistólica debe estar entre 0 y 300 mmHg' }
    ),
  
  presion_arterial_diastolica: z.string()
    .transform((val) => val === '' ? null : parseFloat(val))
    .refine(
      (val) => val === null || (!isNaN(val) && val >= 0 && val <= 200),
      { message: 'La presión diastólica debe estar entre 0 y 200 mmHg' }
    ),
  
  frecuencia_cardiaca: z.string()
    .transform((val) => val === '' ? null : parseFloat(val))
    .refine(
      (val) => val === null || (!isNaN(val) && val >= 0 && val <= 300),
      { message: 'La frecuencia cardíaca debe estar entre 0 y 300 lpm' }
    ),
  
  frecuencia_respiratoria: z.string()
    .transform((val) => val === '' ? null : parseFloat(val))
    .refine(
      (val) => val === null || (!isNaN(val) && val >= 0 && val <= 100),
      { message: 'La frecuencia respiratoria debe estar entre 0 y 100 rpm' }
    ),
  
  temperatura: z.string()
    .transform((val) => val === '' ? null : parseFloat(val))
    .refine(
      (val) => val === null || (!isNaN(val) && val >= 30 && val <= 45),
      { message: 'La temperatura debe estar entre 30 y 45 °C' }
    ),
  
  color_piel: z.string({
    required_error: 'El color de piel es obligatorio',
    invalid_type_error: 'El color de piel debe ser un texto'
  })
    .max(50, 'El color de piel no puede exceder los 50 caracteres')
    .transform((val) => val === '' ? null : val),
  
  respuesta_estimulos: z.string({
    required_error: 'La respuesta a estímulos es obligatoria',
    invalid_type_error: 'La respuesta a estímulos debe ser un texto'
  })
    .max(255, 'La respuesta a estímulos no puede exceder los 255 caracteres')
    .transform((val) => val === '' ? null : val),
  
  observaciones: z.string()
    .max(255, 'Las observaciones no pueden exceder los 255 caracteres')
    .optional()
    .transform((val) => !val || val === '' ? null : val)
}).refine(
  (data) => {
    // Al menos un campo de signos vitales debe estar presente
    return data.presion_arterial_sistolica !== null ||
           data.presion_arterial_diastolica !== null ||
           data.frecuencia_cardiaca !== null ||
           data.frecuencia_respiratoria !== null ||
           data.temperatura !== null;
  },
  { 
    message: 'Debe registrar al menos un signo vital',
    path: ['presion_arterial_sistolica']
  }
).refine(
  (data) => {
    // Si hay presión sistólica, debe haber diastólica y viceversa
    const tieneSistolica = data.presion_arterial_sistolica !== null;
    const tieneDiastolica = data.presion_arterial_diastolica !== null;
    
    if (tieneSistolica && !tieneDiastolica) return false;
    if (tieneDiastolica && !tieneSistolica) return false;
    
    return true;
  },
  {
    message: 'Debe registrar tanto la presión sistólica como la diastólica',
    path: ['presion_arterial_diastolica']
  }
).refine(
  (data) => {
    // Si ambas presiones están presentes, la sistólica debe ser mayor que la diastólica
    if (data.presion_arterial_sistolica !== null && data.presion_arterial_diastolica !== null) {
      return data.presion_arterial_sistolica > data.presion_arterial_diastolica;
    }
    return true;
  },
  {
    message: 'La presión sistólica debe ser mayor que la diastólica',
    path: ['presion_arterial_sistolica']
  }
);

module.exports = { signosVitalesSchema };
