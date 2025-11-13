const { Internacion, SolicitudAtencion, Enfermero, Medico, Persona, Paciente, PacienteSeguro, Habitacion, Cama } = require('../models');
const { solicitudAtencionSchema, respuestaSolicitudSchema } = require('../schemas/solicitudAtencion_schema');

// GET - Formulario para crear solicitud (enfermero)
const Crear_GET = async (req, res) => {
    try {
        const { id_internacion } = req.params;

        const internacion = await Internacion.findByPk(id_internacion, {
            include: [
                {
                    model: PacienteSeguro,
                    include: [
                        {
                            model: Paciente,
                            as: 'paciente',
                            include: [
                                {
                                    model: Persona,
                                    as: 'persona'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Cama,
                    include: [
                        {
                            model: Habitacion
                        }
                    ]
                }
            ]
        });

        if (!internacion) {
            return res.status(404).send('Internación no encontrada');
        }

        res.render('solicitud_atencion/crear', {
            title: 'Solicitar Atención Médica',
            internacion
        });
    } catch (error) {
        console.error('Error al cargar formulario de solicitud:', error);
        res.status(500).send('Error al cargar el formulario');
    }
};

// POST - Crear solicitud
const Crear_POST = async (req, res) => {
    try {
        const { id_internacion } = req.params;
        const { motivo, descripcion } = req.body;

        // Validar datos
        const validacion = solicitudAtencionSchema.safeParse({ motivo, descripcion });
        if (!validacion.success) {
            return res.status(400).json({
                error: validacion.error.errors[0].message
            });
        }

        // Obtener id_enfermero de la sesión
        const id_enfermero = req.session.id_enfermero;
        
        if (!id_enfermero) {
            return res.status(403).send('Debe ser enfermero para crear solicitudes de atención');
        }

        await SolicitudAtencion.create({
            id_internacion: parseInt(id_internacion),
            id_enfermero: parseInt(id_enfermero),
            motivo,
            descripcion,
            estado: 'Pendiente'
        });

        res.redirect(`/internacion/details/${id_internacion}?success=solicitud`);
    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).send('Error al crear la solicitud');
    }
};

// GET - Lista de solicitudes pendientes (médicos)
const Pendientes_GET = async (req, res) => {
    try {
        const solicitudes = await SolicitudAtencion.findAll({
            where: { estado: 'Pendiente' },
            include: [
                {
                    model: Internacion,
                    as: 'Internacion',
                    include: [
                        {
                            model: PacienteSeguro,
                            include: [
                                {
                                    model: Paciente,
                                    as: 'paciente',
                                    include: [
                                        {
                                            model: Persona,
                                            as: 'persona'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: Cama,
                            include: [
                                {
                                    model: Habitacion
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Enfermero,
                    as: 'Enfermero',
                    include: [
                        {
                            model: Persona,
                            as: 'persona'
                        }
                    ]
                }
            ],
            order: [['fecha_solicitud', 'DESC']]
        });

        res.render('solicitud_atencion/pendientes', {
            title: 'Solicitudes Pendientes',
            solicitudes
        });
    } catch (error) {
        console.error('Error al cargar solicitudes pendientes:', error);
        res.status(500).send('Error al cargar solicitudes');
    }
};

// GET - Formulario para atender solicitud (médico)
const Atender_GET = async (req, res) => {
    try {
        const { id } = req.params;

        const solicitud = await SolicitudAtencion.findByPk(id, {
            include: [
                {
                    model: Internacion,
                    as: 'Internacion',
                    include: [
                        {
                            model: PacienteSeguro,
                            include: [
                                {
                                    model: Paciente,
                                    as: 'paciente',
                                    include: [
                                        {
                                            model: Persona,
                                            as: 'persona'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: Cama,
                            include: [
                                {
                                    model: Habitacion
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Enfermero,
                    as: 'Enfermero',
                    include: [
                        {
                            model: Persona,
                            as: 'persona'
                        }
                    ]
                }
            ]
        });

        if (!solicitud) {
            return res.status(404).send('Solicitud no encontrada');
        }

        if (solicitud.estado !== 'Pendiente') {
            return res.redirect('/solicitudes-atencion/pendientes');
        }

        res.render('solicitud_atencion/atender', {
            title: 'Atender Solicitud',
            solicitud
        });
    } catch (error) {
        console.error('Error al cargar solicitud:', error);
        res.status(500).send('Error al cargar la solicitud');
    }
};

// POST - Responder solicitud (médico)
const Atender_POST = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, respuesta } = req.body;

        // Validar datos
        const validacion = respuestaSolicitudSchema.safeParse({ estado, respuesta });
        if (!validacion.success) {
            return res.status(400).json({
                error: validacion.error.errors[0].message
            });
        }

        // Obtener id_medico de la sesión
        const id_medico = req.session.id_medico;
        
        if (!id_medico) {
            return res.status(403).send('Debe ser médico para responder solicitudes de atención');
        }

        const solicitud = await SolicitudAtencion.findByPk(id);
        if (!solicitud) {
            return res.status(404).send('Solicitud no encontrada');
        }

        await solicitud.update({
            id_medico: parseInt(id_medico),
            estado,
            respuesta,
            fecha_respuesta: new Date()
        });

        res.redirect('/dashboard?success=solicitud_respondida');
    } catch (error) {
        console.error('Error al responder solicitud:', error);
        res.status(500).send('Error al responder la solicitud');
    }
};

module.exports = {
    Crear_GET,
    Crear_POST,
    Pendientes_GET,
    Atender_GET,
    Atender_POST
};
