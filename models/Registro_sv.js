const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Registro_sv extends Model {
    static associate(models) {
      // Un registro de signos vitales pertenece a una internación
      Registro_sv.belongsTo(models.Internacion, { foreignKey: 'id_internacion', as: 'internacion' });
      // Un registro de signos vitales es realizado por un empleado
      Registro_sv.belongsTo(models.Empleado, { foreignKey: 'id_empleado', as: 'empleado' });
    }
  }

  Registro_sv.init({
    id_internacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_empleado: {
      type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Debe ser un número entero" },
          min: -1
        }
    },
    p_arterial_sistolica: {
      type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: { msg: "Debe ser un número decimal" },
          min: 0
        }
    },
    p_arterial_diastolica: {
      type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: { msg: "Debe ser un número decimal" },
          min: 0
        }
    },
    f_cardiaca: {
      type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: { msg: "Debe ser un número decimal" },
          min: 0
        }
    },
    f_respiratoria: {
      type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: { msg: "Debe ser un número decimal" },
          min: 0
        }
    },
    temperatura: {
      type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: { msg: "Debe ser un número decimal" },
          min: 0
        }
    },
    color_piel: {
      type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 50],
            msg: "El color de piel no puede exceder los 50 caracteres"
          }
        }
    },
    respuesta_estimulos: {
      type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 255],
            msg: "La respuesta a estímulos no puede exceder los 255 caracteres"
          }
        }
    },
    observaciones: {
      type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 255],
            msg: "Las observaciones no pueden exceder los 255 caracteres"
          }
        }
    },
    fecha: {
      type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: { msg: "Debe ser una fecha válida" }
        }
    }
  }, {
    sequelize,
    modelName: 'Registro_sv',
    tableName: 'registros_sv',
    timestamps: false
  });

  return Registro_sv;
}