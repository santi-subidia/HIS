const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Historial_medico extends Model {
    static associate(models) {
      // Un historial médico pertenece a un paciente
      Historial_medico.belongsTo(models.Paciente, { foreignKey: 'id_paciente', as: 'paciente' });
      // Un historial médico pertenece a una reseta
      Historial_medico.belongsTo(models.Reseta, { foreignKey: 'id_reseta', as: 'reseta' });
      // Un historial médico puede tener muchos antecedentes
      Historial_medico.hasMany(models.Antecedente, { foreignKey: 'id_historial', as: 'antecedentes' });
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