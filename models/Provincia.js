const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Provincia extends Model {
    static associate(models) {
      Provincia.hasMany(models.Localidad, { foreignKey: 'id_provincia' });
    }
  }

  Provincia.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Provincia',
    tableName: 'provincias',
    timestamps: false
  });

  return Provincia;
}
