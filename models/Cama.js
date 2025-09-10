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
    numero_cama: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "El número de cama debe ser un entero" },
        min: 1
      }
    },
    estado: {
      type: DataTypes.ENUM('ocupada', 'disponible', 'mantenimiento'),
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
