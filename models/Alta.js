const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Alta extends Model {
    static associate(models) {
      Alta.belongsTo(models.Internacion, {
        foreignKey: 'id_internacion',
        as: 'internacion'
      });
      
      Alta.belongsTo(models.Medico, {
        foreignKey: 'id_medico',
        as: 'medico'
      });
      
      Alta.belongsTo(models.Plan_cuidado, {
        foreignKey: 'id_plan_cuidado_final',
        as: 'plan_cuidado_final'
      });
    }
  }

  Alta.init({
    id_internacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Una internación solo puede tener un alta
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    id_plan_cuidado_final: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    tipo_alta: {
      type: DataTypes.ENUM('Medica', 'Voluntaria', 'Defuncion', 'Traslado'),
      allowNull: false,
      defaultValue: 'Medica'
    },
    diagnostico_final: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El diagnóstico final no puede estar vacío" },
        len: {
          args: [10, 1000],
          msg: "El diagnóstico final debe tener entre 10 y 1000 caracteres"
        }
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Las observaciones no pueden superar los 1000 caracteres"
        }
      }
    },
    recomendaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Las recomendaciones no pueden superar los 1000 caracteres"
        }
      }
    },
    fecha_alta: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Alta',
    tableName: 'altas',
    timestamps: false
  });

  return Alta;
}
