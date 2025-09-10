const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Antecedente extends Model {
    static associate(models) {
      // Un antecedente pertenece a un historial médico
      Antecedente.belongsTo(models.Historial_medico, { foreignKey: 'id_historial', as: 'historialMedico' });
      // Un antecedente pertenece a un tipo
      Antecedente.belongsTo(models.Tipo, { foreignKey: 'id_tipo', as: 'tipo' });
    }
  }

  Antecedente.init({
    id_historial: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_tipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: -1
      }
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "La descripción no puede exceder los 255 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Antecedente',
    tableName: 'antecedentes',
    timestamps: false
  });

  return Antecedente;
}