const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Evaluacion extends Model {
    static associate(models) {
      // Una evaluación pertenece a un empleado
      Evaluacion.belongsTo(models.Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
      // Una evaluación pertenece a una internación
      Evaluacion.belongsTo(models.Internacion, { foreignKey: 'id_internacion', as: 'internacion' });
      // Una evaluación pertenece a unos cuidados
      Evaluacion.belongsTo(models.Cuidado, { foreignKey: 'id_cuidado', as: 'cuidado' });
    }
  }

  Evaluacion.init({
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_internacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_cuidado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    solicita: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 50],
          msg: "La solicitud debe tener entre 2 y 50 caracteres"
        }
      }
    },
    devolucion: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "La devolución no puede exceder los 255 caracteres"
        }
      }
    },
    prioridad: {
      type: DataTypes.ENUM,
      values: ['alta', 'media', 'baja'],
      allowNull: true,
      validate: {
        isIn: {
          args: [['alta', 'media', 'baja']],
          msg: "La prioridad debe ser 'alta', 'media' o 'baja'"
        }
      }
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "La fecha debe ser una fecha válida" }
      }
    }
  }, {
    sequelize,
    modelName: 'Evaluacion',
    tableName: 'evaluaciones',
    timestamps: false
  });

  return Evaluacion;
}