const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Empleado extends Model {
    static associate(models) {
        
    }
  }

  Empleado.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: -1
      }
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: -1
      }
    }
  }, {
    sequelize,
    modelName: 'Empleado',
    tableName: 'empleados',
    timestamps: false
  });

  return Empleado;
}