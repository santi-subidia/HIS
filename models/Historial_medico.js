const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Historial_medico extends Model {
    static associate(models) {
        
    }
  }

  Historial_medico.init({
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_reseta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: -1
      }
    }
  }, {
    sequelize,
    modelName: 'Historial_medico',
    tableName: 'historial_medico',
    timestamps: false
  });

  return Historial_medico;
}