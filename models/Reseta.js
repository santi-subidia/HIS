const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Reseta extends Model {
    static associate(models) {

    }
  }

  Reseta.init({
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
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
    modelName: 'Reseta',
    tableName: 'resetas',
    timestamps: false
  });

  return Reseta;
}