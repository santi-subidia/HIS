const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cama extends Model {
    static associate(models) {
      Cama.belongsTo(models.Habitacion, { foreignKey: 'id_habitacion' });
      Cama.hasMany(models.Internacion, { foreignKey: 'id_cama' });
    }
  }

  Cama.init({
    id_habitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    nroCama: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "El número de cama debe ser un entero" },
        min: 1
      }
    },
    limpia: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    estado: {
      type: DataTypes.ENUM('ocupada', 'disponible'),
      allowNull: false,
      defaultValue: 'disponible'
    }
  }, {
    sequelize,
    modelName: 'Cama',
    tableName: 'camas',
    timestamps: false
  });

  return Cama;
}
