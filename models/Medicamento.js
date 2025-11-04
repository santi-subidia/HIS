const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Medicamento extends Model {
    static associate(models) {
      // Un medicamento puede tener muchos renglones de reseta
      Medicamento.hasMany(models.Renglon_reseta, { foreignKey: 'id_medicamento', as: 'renglonesReseta' });
    }
  }

  Medicamento.init({
    marca_comercial: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La marca comercial no puede estar vacía" },
        len: {
          args: [2, 50],
          msg: "La marca comercial debe tener entre 2 y 50 caracteres"
        }
      }
    },
    presentacion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La presentación no puede estar vacía" },
        len: {
          args: [2, 100],
          msg: "La presentación debe tener entre 2 y 100 caracteres"
        }
      }
    },
    laboratorio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El laboratorio no puede estar vacío" },
        len: {
          args: [2, 100],
          msg: "El laboratorio debe tener entre 2 y 100 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Medicamento',
    tableName: 'medicamentos',
    timestamps: false
  });

  return Medicamento;
}