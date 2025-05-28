const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sector extends Model {
    static associate(models) {
      Sector.hasMany(models.Ala, { foreignKey: 'id_sector' });
    }
  }

  Sector.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre del sector no puede estar vacío" },
        len: {
          args: [3, 100],
          msg: "El nombre debe tener entre 3 y 100 caracteres"
        },
        is: {
          args: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/i,
          msg: "El nombre solo puede contener letras y espacios"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Sector',
    tableName: 'sector',
    timestamps: false
  });

  return Sector;
}
