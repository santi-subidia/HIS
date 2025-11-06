const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Medico extends Model {
    static associate(models) {
      Medico.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
      Medico.belongsTo(models.Especialidad, { foreignKey: 'id_especialidad', as: 'especialidad' });
      
      // Relación con Altas
      Medico.hasMany(models.Alta, { foreignKey: 'id_medico', as: 'altas' });
      
      // Relación con Solicitudes Médicas
      Medico.hasMany(models.Solicitud_medica, { foreignKey: 'id_medico', as: 'solicitudes_medicas' });
    }
  }

  Medico.init({
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_especialidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: -1
      }
    },
    fecha_eliminacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Medico',
    tableName: 'Medicos',
    timestamps: false
  });

  return Medico;
}