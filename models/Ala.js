const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Ala extends Model {
    static associate(models) {
      Ala.belongsTo(models.Sector, { foreignKey: 'id_sector' });
      Ala.hasMany(models.Habitacion, { foreignKey: 'id_ala' });
    }
  }

  Ala.init({
    id_sector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "El ID de sector debe ser un número entero" },
        min: 1
      }
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La ubicación no puede estar vacía" },
        len: {
          args: [3, 100],
          msg: "La ubicación debe tener entre 3 y 100 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Ala',
    tableName: 'alas',
    timestamps: false
  });

  return Ala;
}
