const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Medicamento extends Model {
    static associate(models) {

    }
  }

  Medicamento.init({
    id_tipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: {
          args: [2, 50],
          msg: "El nombre debe tener entre 2 y 50 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Medicamento',
    tableName: 'medicamentos',
    timestamps: false
  });

  return Medicamento;
}