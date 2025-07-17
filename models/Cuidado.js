const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cuidado extends Model {
    static associate(models) {

    }
  }

  Cuidado.init({
    id_reseta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    cuidados: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Los cuidados no pueden estar vacíos" },
        len: {
          args: [2, 50],
          msg: "Los cuidados deben tener entre 2 y 50 caracteres"
        }
      }
    },
    recomendaciones: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "Las recomendaciones no puede exceder los 255 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Cuidado',
    tableName: 'cuidados',
    timestamps: false
  });

  return Cuidado;
}