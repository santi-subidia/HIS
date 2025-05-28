const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TipoSangre extends Model {
    static associate(models) {
      TipoSangre.hasMany(models.Paciente, { foreignKey: 'id_tipoSangre' });
    }
  }

  TipoSangre.init({
    tipo: {
      type: DataTypes.ENUM('A', 'B', 'AB', 'O'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['A', 'B', 'AB', 'O']],
          msg: "El tipo debe ser A, B, AB u O"
        }
      }
    },
    Rh: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TipoSangre',
    tableName: 'tipos_sangre',
    timestamps: false
  });

  return TipoSangre;
}
