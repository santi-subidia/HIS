const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Reseta extends Model {
    static associate(models) {
      // Una reseta la hace a una persona (medico o enefermero)
      Reseta.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
      // Una reseta puede pertenecer a un historial médico
      Reseta.belongsTo(models.Historial_medico, { foreignKey: 'id_historial', as: 'historialMedico' });
      // Una reseta puede tener muchos renglones
      Reseta.hasMany(models.Renglon_reseta, { foreignKey: 'id_reseta', as: 'renglones' });
    }
  }

  Reseta.init({
    id_persona: {
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