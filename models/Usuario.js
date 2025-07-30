const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class Usuario extends Model {

    async validarPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    static associate(models) {
      // Un usuario puede estar asociado a un empleado
      Usuario.hasOne(models.Empleado, { foreignKey: 'id_usuario', as: 'empleado' });
      // Un usuario tiene un rol
      Usuario.belongsTo(models.Rol, { foreignKey: 'id_rol', as: 'rol' });
    }
  }

  Usuario.init({
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
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: "Debe ser una fecha válida" }
      }
    },
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        if(usuario.password) {
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