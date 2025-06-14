const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContactoEmergencia extends Model {
    static associate(models) {
      ContactoEmergencia.belongsTo(models.Parentesco, { foreignKey: 'id_parentesco' });
      ContactoEmergencia.hasMany(models.Internacion, { foreignKey: 'id_contactoEmergencia' });
    }
  }

  ContactoEmergencia.init({
    DNI_contacto: {
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
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El teléfono es obligatorio" },
        isNumeric: { msg: "El teléfono solo puede contener números" },
        len: {
          args: [7, 15],
          msg: "El teléfono debe tener entre 7 y 15 dígitos"
        }
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
    timestamps: false
  });

  return ContactoEmergencia;
}
