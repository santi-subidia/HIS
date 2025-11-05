const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Tipo extends Model {
    static associate(models) {
      Tipo.hasMany(models.Plan_cuidado, { foreignKey: 'id_tipo', as: 'planes_cuidado' });
      Tipo.hasMany(models.Antecedente, { foreignKey: 'id_tipo', as: 'antecedentes' });
    }
  }

  Tipo.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: {
          args: [2, 50],
          msg: "El nombre debe tener entre 2 y 50 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Tipo',
    tableName: 'tipos',
    timestamps: false
  });

  return Tipo;
}