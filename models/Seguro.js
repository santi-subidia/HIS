const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Seguro extends Model {
    static associate(models) {
      Seguro.hasMany(models.PacienteSeguro, { foreignKey: 'id_seguro' });
    }
  }

  Seguro.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre del seguro no puede estar vacío" },
        len: {
          args: [3, 100],
          msg: "El nombre debe tener entre 3 y 100 caracteres"
        }
      }
    },
    abreviatura: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La abreviatura no puede estar vacía" },
        len: {
          args: [2, 10],
          msg: "La abreviatura debe tener entre 2 y 10 caracteres"
        }
      }
    },
    telefono_contacto: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El teléfono de contacto es obligatorio" },
        isNumeric: { msg: "El teléfono solo puede contener números" },
        len: {
          args: [7, 15],
          msg: "El teléfono debe tener entre 7 y 15 dígitos"
        }
      }
    },
    fecha_eliminacion: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Seguro',
    tableName: 'seguros',
    timestamps: false
  });

  return Seguro;
}
