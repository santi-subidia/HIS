const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Medico extends Model {
    static associate(models) {

    }
  }

  Medico.init({
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_especialidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: -1
      }
    }
  }, {
    sequelize,
    modelName: 'Medico',
    tableName: 'Medicos',
    timestamps: false
  });

  return Medico;
}