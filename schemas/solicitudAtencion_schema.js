const { z } = require('zod');

const solicitudAtencionSchema = z.object({
    motivo: z.string()
        .min(5, 'El motivo debe tener al menos 5 caracteres')
        .max(200, 'El motivo no puede exceder 200 caracteres'),
    descripcion: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
});

const respuestaSolicitudSchema = z.object({
    estado: z.enum(['Atendida', 'Rechazada'], {
        errorMap: () => ({ message: 'Debe seleccionar Atender o Rechazar' })
    }),
    respuesta: z.string()
        .min(10, 'La respuesta debe tener al menos 10 caracteres')
});

module.exports = {
    solicitudAtencionSchema,
    respuestaSolicitudSchema
};
