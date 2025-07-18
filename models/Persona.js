const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Persona extends Model {
    static associate(models) {
      // Una persona puede ser un paciente
      Persona.hasOne(models.Paciente, { foreignKey: 'id_persona', as: 'paciente' });
      // Una persona puede ser un empleado
      Persona.hasOne(models.Empleado, { foreignKey: 'id_persona', as: 'empleado' });
      // Una persona puede ser un contacto de emergencia (puede haber varios contactos de emergencia con la misma persona)
      Persona.hasMany(models.ContactoEmergencia, { foreignKey: 'id_persona', as: 'contactosEmergencia' });
    }
  }

  Persona.init({
    DNI: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El DNI no puede estar vacío" },
        is: {
          args: /^[0-9]{7,9}$/,
          msg: "El DNI debe contener entre 7 y 9 dígitos numéricos"
        }
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: {
          args: [2, 50],
          msg: "El nombre debe tener entre 2 y 50 caracteres"
        }
      }
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El apellido no puede estar vacío" },
        len: {
          args: [2, 50],
          msg: "El apellido debe tener entre 2 y 50 caracteres"
        }
      }
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: { msg: "El número de teléfono solo debe contener números" },
        len: {
          args: [7, 15],
          msg: "El teléfono debe tener entre 7 y 15 dígitos"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Persona',
    tableName: 'personas',
    timestamps: false
  });

  return Persona;
}