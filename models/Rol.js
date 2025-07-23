const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Rol extends Model {
    static associate(models) {
        // Un rol puede tener muchos usuarios
        Rol.hasMany(models.Usuario, { foreignKey: 'id_rol', as: 'usuarios' });
    }
  }

  Rol.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre del rol no puede estar vacío" },
        len: {
          args: [3, 100],
          msg: "El nombre del rol debe tener entre 3 y 100 caracteres"
        },
        is: {
          args: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/i,
          msg: "El nombre del rol solo puede contener letras y espacios"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Rol',
    tableName: 'roles',
    timestamps: false
  });

  return Rol;
}