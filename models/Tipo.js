const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Tipo extends Model {
    static associate(models) {
      Tipo.belongsTo(models.Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
      Tipo.hasMany(models.Antecedente, { foreignKey: 'id_tipo', as: 'antecedentes' });
    }
  }

  Tipo.init({
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
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
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "La descripción no puede exceder los 255 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Tipo',
    tableName: 'tipos',
    timestamps: false
  });

  return Tipo;
}