const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PacienteSeguro extends Model {
    static associate(models) {
      PacienteSeguro.belongsTo(models.Paciente, { foreignKey: 'id_paciente', as: 'paciente' });
      PacienteSeguro.belongsTo(models.Seguro, { foreignKey: 'id_seguro', as: 'seguro' });
      PacienteSeguro.hasMany(models.Internacion, { foreignKey: 'id_paciente_seguro', as: 'internaciones' });
    }
  }

  PacienteSeguro.init({
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_seguro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    codigo_afiliado: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El código de afiliado no puede estar vacío" },
        len: {
          args: [4, 50],
          msg: "El código de afiliado debe tener entre 4 y 50 caracteres"
        }
      }
    },
    fecha_desde: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Debe ser una fecha válida" }
      }
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['activo', 'inactivo']],
          msg: "El estado debe ser 'activo' o 'inactivo'"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'PacienteSeguro',
    tableName: 'paciente_seguro',
    timestamps: false,
  });

  return PacienteSeguro;
}
