const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Habitacion extends Model {
    static associate(models) {
      Habitacion.belongsTo(models.Ala, { foreignKey: 'id_ala' });
      Habitacion.hasMany(models.Cama, { foreignKey: 'id_habitacion' });
    }
  }

  Habitacion.init({
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El código no puede estar vacío" },
        len: {
          args: [2, 20],
          msg: "El código debe tener entre 2 y 20 caracteres"
        }
      }
    },
    id_ala: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "La capacidad debe ser un número entero" },
        min: 1,
        max: 2
      }
    },
    camas_disponibles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: { msg: "El campo camas_disponibles debe ser un número entero" },
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Habitacion',
    tableName: 'habitaciones',
    timestamps: false,
    hooks: {
      beforeCreate: (habitacion) => {
        habitacion.camas_disponibles = habitacion.capacidad;
      }
    }
  });

  return Habitacion;
}
