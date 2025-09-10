const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Medicamento extends Model {
    static associate(models) {
      // Un medicamento puede tener muchos renglones de reseta
      Medicamento.hasMany(models.Renglon_reseta, { foreignKey: 'id_medicamento', as: 'renglonesReseta' });
    }
  }

  Medicamento.init({
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
    modelName: 'Medicamento',
    tableName: 'medicamentos',
    timestamps: false
  });

  return Medicamento;
}