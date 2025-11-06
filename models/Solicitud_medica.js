const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Solicitud_medica extends Model {
    static associate(models) {
      Solicitud_medica.belongsTo(models.Medico, { 
        foreignKey: 'id_medico', 
        as: 'medico' 
      });
      
      Solicitud_medica.belongsTo(models.Internacion, { 
        foreignKey: 'id_internacion', 
        as: 'internacion' 
      });
      
      Solicitud_medica.belongsTo(models.TipoEstudio, { 
        foreignKey: 'id_tipo_estudio', 
        as: 'tipo_estudio' 
      });
    }
  }

  Solicitud_medica.init({
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    id_internacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    id_tipo_estudio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La descripción no puede estar vacía" },
        len: {
          args: [10, 500],
          msg: "La descripción debe tener entre 10 y 500 caracteres"
        }
      }
    },
    resultado: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "El resultado no puede superar los 1000 caracteres"
        }
      }
    },
    url_file: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fecha_completado: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Solicitud_medica',
    tableName: 'solicitudes_medicas',
    timestamps: false
  });

  return Solicitud_medica;
};