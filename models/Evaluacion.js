const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Evaluacion extends Model {
    static associate(models) {

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
    id_cuidados: {
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