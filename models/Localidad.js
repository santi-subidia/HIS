const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Localidad extends Model {
    static associate(models) {
      Localidad.belongsTo(models.Provincia, { foreignKey: 'id_provincia', as: 'provincia' });
      Localidad.hasMany(models.Paciente, { foreignKey: 'id_localidad' });
    }
  }

  Localidad.init({
    id_provincia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "La provincia debe ser un número entero" },
        min: 1
      }
    },
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
    modelName: 'Localidad',
    tableName: 'localidades',
    timestamps: false
  });

  return Localidad;
}

