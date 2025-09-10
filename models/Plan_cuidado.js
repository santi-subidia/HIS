const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Plan_cuidado extends Model {
    static associate(models) {
        // Un plan de cuidado lo hace una persona (medico o enfermero)
        Plan_cuidado.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
        // Un plan de cuidado pertenece a una internacion
        Plan_cuidado.belongsTo(models.Internacion, { foreignKey: 'id_internacion', as: 'internacion' });
        // Un plan de cuidado puede pertenecer a una reseta
        Plan_cuidado.belongsTo(models.Reseta, { foreignKey: 'id_reseta', as: 'reseta' });
        // Un plan de cuidado pertenece a un tipo
        Plan_cuidado.belongsTo(models.Tipo, { foreignKey: 'id_tipo', as: 'tipo' });
    }
  }

  Plan_cuidado.init(
    {
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Debe ser un número entero" },
          min: -1,
        },
      },
      id_internacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Debe ser un número entero" },
          min: -1,
        },
      },
      id_reseta: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "Debe ser un número entero" },
          min: -1,
        },
      },
      id_tipo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Debe ser un número entero" },
          min: -1,
        },
      },
      devolucion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "La devolución no puede estar vacía" },
          len: {
            args: [2, 100],
            msg: "La devolución debe tener entre 2 y 100 caracteres",
          },
        },
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Plan_cuidado",
      tableName: "planes_cuidado",
      timestamps: false,
    }
  );

  return Plan_cuidado;
};
