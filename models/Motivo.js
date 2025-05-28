const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Motivo extends Model {
    static associate(models) {
      Motivo.hasMany(models.Turno, { foreignKey: 'id_motivo' });
      Motivo.hasMany(models.Internacion, { foreignKey: 'id_motivo' });
    }
  }

  Motivo.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre del motivo no puede estar vacío" },
        len: {
          args: [3, 100],
          msg: "El nombre debe tener entre 3 y 100 caracteres"
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "La descripción no debe superar los 1000 caracteres"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Motivo',
    tableName: 'motivos',
    timestamps: false
  });

  return Motivo;
}
