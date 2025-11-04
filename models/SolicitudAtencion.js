const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SolicitudAtencion extends Model {
    static associate(models) {
      // Una solicitud pertenece a una internación
      SolicitudAtencion.belongsTo(models.Internacion, { 
        foreignKey: 'id_internacion', 
        as: 'Internacion' 
      });
      // Una solicitud es creada por un enfermero
      SolicitudAtencion.belongsTo(models.Enfermero, { 
        foreignKey: 'id_enfermero', 
        as: 'Enfermero' 
      });
      // Una solicitud puede ser atendida por un médico
      SolicitudAtencion.belongsTo(models.Medico, { 
        foreignKey: 'id_medico', 
        as: 'Medico' 
      });
    }
  }

  SolicitudAtencion.init({
    id_internacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    id_enfermero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    motivo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El motivo no puede estar vacío" },
        len: {
          args: [5, 200],
          msg: "El motivo debe tener entre 5 y 200 caracteres"
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La descripción no puede estar vacía" },
        len: {
          args: [10, 5000],
          msg: "La descripción debe tener entre 10 y 5000 caracteres"
        }
      }
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Atendida', 'Rechazada'),
      allowNull: false,
      defaultValue: 'Pendiente',
      validate: {
        isIn: {
          args: [['Pendiente', 'Atendida', 'Rechazada']],
          msg: "El estado debe ser 'Pendiente', 'Atendida' o 'Rechazada'"
        }
      }
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: "La respuesta no puede exceder los 5000 caracteres"
        }
      }
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: "Debe ser una fecha válida" }
      }
    },
    fecha_respuesta: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "Debe ser una fecha válida" }
      }
    }
  }, {
    sequelize,
    modelName: 'SolicitudAtencion',
    tableName: 'solicitudes_atencion',
    timestamps: false
  });

  return SolicitudAtencion;
};
