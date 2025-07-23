const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Renglon_reseta extends Model {
    static associate(models) {
      // Un renglón de reseta pertenece a una reseta
      // y a un medicamento
      Renglon_reseta.belongsTo(models.Reseta, { foreignKey: 'id_reseta', as: 'reseta' });
      Renglon_reseta.belongsTo(models.Medicamento, { foreignKey: 'id_medicamento', as: 'medicamento' });
    }
  }

  Renglon_reseta.init({
    id_reseta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'resetas',
        key: 'id'
      },
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_medicamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'medicamentos',
        key: 'id'
      },
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    dosis: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0, 255],
          msg: "La dosis no puede exceder los 255 caracteres"
        }
      }
    },
    duracion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0, 255],
          msg: "La duración no puede exceder los 255 caracteres"
        }
      }
    },
    indicaciones: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "Las indicaciones no pueden exceder los 255 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Renglon_reseta',
    tableName: 'renglones_reseta',
    timestamps: false
  });

  return Renglon_reseta;
}