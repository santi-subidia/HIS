const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CategoriaTipoEstudio extends Model {
    static associate(models) {
      CategoriaTipoEstudio.hasMany(models.TipoEstudio, { 
        foreignKey: 'id_categoria', 
        as: 'tipos_estudios' 
      });
    }
  }

  CategoriaTipoEstudio.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'CategoriaTipoEstudio',
    tableName: 'categorias_tipos_estudios',
    timestamps: false
  });

  return CategoriaTipoEstudio;
}
