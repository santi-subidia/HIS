const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Renglon_reseta extends Model {
    static associate(models) {
      Renglon_reseta.belongsTo(models.Reseta, { foreignKey: 'id_reseta' });
      Renglon_reseta.belongsTo(models.Medicamento, { foreignKey: 'id_medicamento' });
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
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    dosis: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "La dosis no puede exceder los 255 caracteres"
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