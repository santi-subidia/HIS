const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Empleado extends Model {
    static associate(models) {
      Empleado.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
      Empleado.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
      Empleado.hasOne(models.Medico, { foreignKey: 'id_empleado', as: 'medico' });
      // Un empleado puede tener muchas evaluaciones
      Empleado.hasMany(models.Evaluacion, { foreignKey: 'id_empleado', as: 'evaluaciones' });
      // Un empleado puede tener muchas altas
      Empleado.hasMany(models.Alta, { foreignKey: 'id_medico', as: 'altas' });
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
    }
  }, {
    sequelize,
    modelName: 'Empleado',
    tableName: 'empleados',
    timestamps: false
  });

  return Empleado;
}