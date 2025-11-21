const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Un usuario puede estar asociado a una persona
      Usuario.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
      // Un usuario tiene un rol
      Usuario.belongsTo(models.Rol, { foreignKey: 'id_rol', as: 'rol' });
    }

    // Método para comparar contraseñas
    async validarPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

  Usuario.init({
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre de usuario no puede estar vacío" },
        len: {
          args: [3, 50],
          msg: "El nombre de usuario debe tener entre 3 y 50 caracteres"
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
          msg: "La contraseña debe tener al menos 6 caracteres"
        }
      }
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  return Usuario;
}