const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Parentesco extends Model {
    static associate(models) {
      Parentesco.hasMany(models.ContactoEmergencia, { foreignKey: 'id_parentesco', as: 'contactosEmergencia' });
    }
  }

  Parentesco.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre del parentesco no puede estar vacío" },
        len: {
          args: [3, 50],
          msg: "El nombre debe tener entre 3 y 50 caracteres"
        },
        is: {
          args: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/i,
          msg: "El nombre solo puede contener letras y espacios"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Parentesco',
    tableName: 'parentescos',
    timestamps: false
  });

  return Parentesco;
}
