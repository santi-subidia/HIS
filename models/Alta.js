const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Alta extends Model {
    static associate(models) {
      // Una alta pertenece a un cuidado
      Alta.belongsTo(models.Cuidado, { foreignKey: 'id_cuidado', as: 'cuidado' });
      // Una alta pertenece a una internación
      Alta.belongsTo(models.Internacion, { foreignKey: 'id_internacion', as: 'internacion' });
      // Una alta es realizada por un médico
      Alta.belongsTo(models.Medico, { foreignKey: 'id_medico', as: 'medico' });
    }
  }

  Alta.init({
    id_internacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_cuidado: {
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
        isDate: { msg: "La fecha debe ser una fecha válida" }
      }
    }
  }, {
    sequelize,
    modelName: 'Alta',
    tableName: 'altas',
    timestamps: false
  });

  return Alta;
}