const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Turno extends Model {
    static associate(models) {
      Turno.belongsTo(models.Paciente, { foreignKey: 'id_paciente' });
      Turno.belongsTo(models.Motivo, { foreignKey: 'id_motivo' });
    }
  }

  Turno.init({
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    id_motivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Debe ser una fecha válida" }
      }
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['pendiente', 'confirmado', 'cancelado']],
          msg: "Estado debe ser 'pendiente', 'confirmado' o 'cancelado'"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Turno',
    tableName: 'turnos',
    timestamps: false
  });

  return Turno;
}
