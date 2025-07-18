const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cuidado extends Model {
    static associate(models) {
      // Un cuidado pertenece a una reseta
      Cuidado.belongsTo(models.Reseta, { foreignKey: 'id_reseta', as: 'reseta' });
      // Un cuidado puede tener muchas evaluaciones
      Cuidado.hasMany(models.Evaluacion, { foreignKey: 'id_cuidado', as: 'evaluaciones' });
      // Un cuidado puede tener muchas altas    
      Cuidado.hasMany(models.Alta, { foreignKey: 'id_cuidado', as: 'altas' });
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