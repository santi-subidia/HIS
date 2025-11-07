const { Solicitud_medica, Medico, Internacion, PacienteSeguro, Paciente, Persona, Cama, Habitacion, Ala, Sector, TipoEstudio, CategoriaTipoEstudio } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configuración de multer para upload de archivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Obtener id_paciente desde la internación
      const { id } = req.params; // id de la solicitud
      const solicitud = await Solicitud_medica.findByPk(id, {
        include: [{
          model: Internacion,
          as: 'internacion',
          include: [{
            model: PacienteSeguro,
            as: 'PacienteSeguro'
          }]
        }]
      });

      if (!solicitud) {
        return cb(new Error('Solicitud no encontrada'));
      }

      const id_paciente = solicitud.internacion.PacienteSeguro.id_paciente;
      
      // Crear carpeta específica para el paciente
      const dir = path.join(__dirname, `../public/uploads/estudios/paciente_${id_paciente}`);
      await fs.mkdir(dir, { recursive: true });
      
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const { id } = req.params; // id de la solicitud
      const solicitud = await Solicitud_medica.findByPk(id, {
        include: [{
          model: TipoEstudio,
          as: 'tipo_estudio'
        }]
      });

      if (!solicitud) {
        return cb(new Error('Solicitud no encontrada'));
      }

      const id_internacion = solicitud.id_internacion;
      const nombreEstudio = solicitud.tipo_estudio.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
        .replace(/\s+/g, '_') // Espacios a guiones bajos
        .replace(/[^a-z0-9_]/g, ''); // Solo alfanuméricos y _

      const extension = path.extname(file.originalname);
      const timestamp = Date.now();
      
      // Formato: {timestamp}_{id_internacion}_{nombre_estudio}.ext
      const uniqueName = `${timestamp}_INT${id_internacion}_${nombreEstudio}${extension}`;
      cb(null, uniqueName);
    } catch (error) {
      cb(error);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPG, PNG) o PDFs'));
    }
  }
});

// Utilidad para eliminar archivo de forma segura
const eliminarArchivo = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
    console.log(`Archivo eliminado: ${filePath}`);
  } catch (error) {
    console.error(`Error al eliminar archivo ${filePath}:`, error.message);
  }
};

module.exports = {
  // GET /estudios/crear/:id - Formulario para solicitar estudio
  Crear_GET: async (req, res) => {
    try {
      const { id } = req.params; // id_internacion
      
      const internacion = await Internacion.findByPk(id, {
        include: [
          {
            model: PacienteSeguro,
            as: 'PacienteSeguro',
            include: [{
              model: Paciente,
              as: 'paciente',
              include: [{
                model: Persona,
                as: 'persona'
              }]
            }]
          },
          {
            model: Cama,
            as: 'Cama',
            include: [{
              model: Habitacion,
              as: 'Habitacion',
              include: [{
                model: Ala,
                as: 'Ala',
                include: [{
                  model: Sector,
                  as: 'Sector'
                }]
              }]
            }]
          }
        ]
      });

      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Obtener tipos de estudios con categorías
      const tipos_estudios = await TipoEstudio.findAll({
        include: [{
          model: CategoriaTipoEstudio,
          as: 'categoria'
        }],
        order: [['id_categoria', 'ASC'], ['nombre', 'ASC']]
      });

      res.render('solicitud_medica/crear', {
        title: 'Solicitar Estudio Médico',
        internacion,
        tipos_estudios
      });

    } catch (error) {
      console.error('Error al cargar formulario de solicitud:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /estudios/crear - Crear solicitud
  Crear_POST: async (req, res) => {
    try {
      const { id_internacion, id_tipo_estudio, descripcion } = req.body;

      // Validaciones
      if (!id_internacion || !id_tipo_estudio || !descripcion) {
        return res.status(400).send('Todos los campos son obligatorios');
      }

      if (descripcion.trim().length < 10 || descripcion.trim().length > 500) {
        return res.status(400).send('La descripción debe tener entre 10 y 500 caracteres');
      }

      // Verificar que existe la internación
      const internacion = await Internacion.findByPk(id_internacion);
      if (!internacion) {
        return res.status(404).send('Internación no encontrada');
      }

      // Verificar que la internación está activa
      if (internacion.estado !== 'activa') {
        return res.status(400).send('No se pueden solicitar estudios para internaciones no activas');
      }

      // Verificar que existe el tipo de estudio
      const tipoEstudio = await TipoEstudio.findByPk(id_tipo_estudio);
      if (!tipoEstudio) {
        return res.status(404).send('Tipo de estudio no encontrado');
      }

      // TODO: Obtener id_medico del usuario autenticado
      const id_medico = req.session?.id_medico || 1;

      // Verificar que existe el médico
      const medico = await Medico.findByPk(id_medico);
      if (!medico) {
        return res.status(404).send('Médico no encontrado. Por favor, contacte al administrador.');
      }

      await Solicitud_medica.create({
        id_medico,
        id_internacion,
        id_tipo_estudio,
        descripcion: descripcion.trim(),
        fecha_solicitud: new Date()
      });

      console.log(`Estudio solicitado para internación ${id_internacion} por médico ${id_medico}`);
      res.redirect(`/internacion/details/${id_internacion}?success=Estudio solicitado exitosamente`);

    } catch (error) {
      console.error('Error al crear solicitud:', error);
      
      // Manejar errores de validación de Sequelize
      if (error.name === 'SequelizeValidationError') {
        const errores = error.errors.map(e => e.message).join(', ');
        return res.status(400).send(`Error de validación: ${errores}`);
      }
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).send('Error: Referencia inválida. Verifique que el médico, internación y tipo de estudio existan.');
      }
      
      res.status(500).send('Error al solicitar el estudio');
    }
  },

  // GET /estudios/cargar-resultado/:id - Formulario para cargar resultado
  CargarResultado_GET: async (req, res) => {
    try {
      const { id } = req.params;
      
      const solicitud = await Solicitud_medica.findByPk(id, {
        include: [
          {
            model: Internacion,
            as: 'internacion',
            include: [
              {
                model: PacienteSeguro,
                as: 'PacienteSeguro',
                include: [{
                  model: Paciente,
                  as: 'paciente',
                  include: [{
                    model: Persona,
                    as: 'persona'
                  }]
                }]
              }
            ]
          },
          {
            model: TipoEstudio,
            as: 'tipo_estudio',
            include: [{
              model: CategoriaTipoEstudio,
              as: 'categoria'
            }]
          }
        ]
      });

      if (!solicitud) {
        return res.status(404).send('Solicitud no encontrada');
      }

      res.render('solicitud_medica/cargar_resultado', {
        title: 'Cargar Resultado de Estudio',
        solicitud
      });

    } catch (error) {
      console.error('Error al cargar formulario de resultado:', error);
      res.status(500).send('Error al cargar el formulario');
    }
  },

  // POST /estudios/cargar-resultado/:id - Cargar resultado con archivo
  CargarResultado_POST: [
    upload.single('archivo'),
    async (req, res) => {
      let archivoSubido = null;
      
      try {
        const { id } = req.params;
        const { resultado } = req.body;

        // Guardar referencia del archivo subido para limpieza si falla
        archivoSubido = req.file ? req.file.path : null;

        // Validar que existe el resultado
        if (!resultado || resultado.trim().length < 10) {
          await eliminarArchivo(archivoSubido);
          return res.status(400).send('El resultado debe tener al menos 10 caracteres');
        }

        if (resultado.trim().length > 1000) {
          await eliminarArchivo(archivoSubido);
          return res.status(400).send('El resultado no puede superar los 1000 caracteres');
        }

        // Verificar que la solicitud existe 
        const solicitud = await Solicitud_medica.findByPk(id, {
          include: [{
            model: Internacion,
            as: 'internacion',
            include: [{
              model: PacienteSeguro,
              as: 'PacienteSeguro'
            }]
          }]
        });

        if (!solicitud) {
          await eliminarArchivo(archivoSubido);
          return res.status(404).send('Solicitud no encontrada');
        }

        // Verificar que no esté ya completada
        if (solicitud.fecha_completado) {
          await eliminarArchivo(archivoSubido);
          return res.status(400).send('Esta solicitud ya tiene resultado cargado');
        }

        // Construir URL del archivo con la estructura de carpetas correcta
        let url_file = null;
        if (req.file) {
          const id_paciente = solicitud.internacion.PacienteSeguro.id_paciente;
          url_file = `/uploads/estudios/paciente_${id_paciente}/${req.file.filename}`;
        }

        await Solicitud_medica.update(
          {
            resultado: resultado.trim(),
            url_file,
            fecha_completado: new Date()
          },
          { where: { id } }
        );

        console.log(`Resultado cargado para solicitud ${id}${req.file ? ' con archivo' : ''}`);
        res.redirect(`/internacion/details/${solicitud.id_internacion}?success=Resultado cargado exitosamente`);

      } catch (error) {
        // Limpiar archivo en caso de cualquier error
        await eliminarArchivo(archivoSubido);

        console.error('Error al cargar resultado:', error);
        
        // Manejar errores específicos de Multer
        if (error instanceof multer.MulterError) {
          if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send('El archivo excede el tamaño máximo permitido (10MB)');
          }
          if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).send('Campo de archivo no esperado');
          }
          return res.status(400).send(`Error al subir archivo: ${error.message}`);
        }
        
        // Error personalizado del fileFilter
        if (error.message.includes('Solo se permiten')) {
          return res.status(400).send(error.message);
        }
        
        res.status(500).send('Error al cargar el resultado');
      }
    }
  ],

  // GET /estudios/historial/:id - Ver historial de estudios de una internación
  Historial_GET: async (req, res) => {
    try {
      const { id } = req.params; // id_internacion

      const internacion = await Internacion.findByPk(id, {
        include: [
          {
            model: PacienteSeguro,
            as: 'PacienteSeguro',
            include: [{
              model: Paciente,
              as: 'paciente',
              include: [{
                model: Persona,
                as: 'persona'
              }]
            }]
          }
        ]
      });

      const solicitudes = await Solicitud_medica.findAll({
        where: { id_internacion: id },
        include: [
          {
            model: Medico,
            as: 'medico',
            include: [{
              model: Persona,
              as: 'persona'
            }]
          },
          {
            model: TipoEstudio,
            as: 'tipo_estudio',
            include: [{
              model: CategoriaTipoEstudio,
              as: 'categoria'
            }]
          }
        ],
        order: [['fecha_solicitud', 'DESC']]
      });

      res.render('solicitud_medica/historial', {
        title: 'Historial de Estudios',
        internacion,
        solicitudes
      });

    } catch (error) {
      console.error('Error al cargar historial de estudios:', error);
      res.status(500).send('Error al cargar el historial');
    }
  },

  // GET /estudios/details/:id - Ver detalles de un estudio
  Details_GET: async (req, res) => {
    try {
      const { id } = req.params;

      const solicitud = await Solicitud_medica.findByPk(id, {
        include: [
          {
            model: Medico,
            as: 'medico',
            include: [{
              model: Persona,
              as: 'persona'
            }]
          },
          {
            model: Internacion,
            as: 'internacion',
            include: [
              {
                model: PacienteSeguro,
                as: 'PacienteSeguro',
                include: [{
                  model: Paciente,
                  as: 'paciente',
                  include: [{
                    model: Persona,
                    as: 'persona'
                  }]
                }]
              }
            ]
          },
          {
            model: TipoEstudio,
            as: 'tipo_estudio',
            include: [{
              model: CategoriaTipoEstudio,
              as: 'categoria'
            }]
          }
        ]
      });

      if (!solicitud) {
        return res.status(404).send('Estudio no encontrado');
      }

      res.render('solicitud_medica/details', {
        title: 'Detalles del Estudio',
        solicitud
      });

    } catch (error) {
      console.error('Error al cargar detalles del estudio:', error);
      res.status(500).send('Error al cargar los detalles');
    }
  }
};
