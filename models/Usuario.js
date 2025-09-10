const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Un usuario puede estar asociado a una persona
      Usuario.hasOne(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
      // Un usuario tiene un rol
      Usuario.belongsTo(models.Rol, { foreignKey: 'id_rol', as: 'rol' });
    }
  }

  Usuario.init({
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: {
          args: [2, 50],
          msg: "El nombre debe tener entre 2 y 50 caracteres"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La contraseña no puede estar vacía" },
        len: {
          args: [6, 100],
          msg: "La contraseña debe tener entre 6 y 100 caracteres"
        }
      }
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false
  });

  return Usuario;
}