const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Reseta extends Model {
    static associate(models) {
      // Una reseta pertenece a un médico
      Reseta.belongsTo(models.Medico, { foreignKey: 'id_medico', as: 'medico' });
      // Una reseta puede pertenecer a un historial médico
      Reseta.belongsTo(models.Historial_medico, { foreignKey: 'id_historial', as: 'historialMedico' });
      // Una reseta puede tener muchos renglones
      Reseta.hasMany(models.Renglon_reseta, { foreignKey: 'id_reseta', as: 'renglones' });
      // Una reseta puede tener muchos cuidados
      Reseta.hasMany(models.Cuidado, { foreignKey: 'id_reseta', as: 'cuidados' });
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