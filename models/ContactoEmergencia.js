const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContactoEmergencia extends Model {
    static associate(models) {
      // Un contacto de emergencia pertenece a un parentesco
      ContactoEmergencia.belongsTo(models.Parentesco, { foreignKey: 'id_parentesco' });
      // Un contacto de emergencia pertenece a una persona
      ContactoEmergencia.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
      // Un contacto de emergencia puede tener muchas internaciones
      ContactoEmergencia.hasMany(models.Internacion, { foreignKey: 'id_contactoEmergencia' });
    }
  }

  ContactoEmergencia.init({
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "El ID de persona debe ser un número entero" },
        min: 1
      }
    },
    id_parentesco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "El ID de parentesco debe ser un número entero" },
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'ContactoEmergencia',
    tableName: 'contactosEmergencias',
    timestamps: false,
  });

  return ContactoEmergencia;
}
