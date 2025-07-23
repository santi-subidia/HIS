const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Categoria extends Model {
    static associate(models) {
        // Una categoría puede tener muchos tipos
        Categoria.hasMany(models.Tipo, { foreignKey: 'id_categoria', as: 'tipos' });
        // Una categoría puede tener muchos antecedentes
        Categoria.hasMany(models.Antecedente, { foreignKey: 'id_categoria', as: 'antecedentes' });
    }
  }

  Categoria.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre de la categoría no puede estar vacío" },
        len: {
          args: [3, 100],
          msg: "El nombre debe tener entre 3 y 100 caracteres"
        },
        is: {
          args: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/i,
          msg: "El nombre solo puede contener letras y espacios"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'categorias',
    timestamps: false
  });

  return Categoria;
}