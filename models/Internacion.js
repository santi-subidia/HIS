const { Model, DataTypes } = require('sequelize');
const { tr } = require('zod/v4/locales');

module.exports = (sequelize) => {
  class Internacion extends Model {
    static associate(models) {
      Internacion.belongsTo(models.PacienteSeguro, { foreignKey: 'id_paciente_seguro' });
      Internacion.belongsTo(models.Cama, { foreignKey: 'id_cama' });
      Internacion.belongsTo(models.Motivo, { foreignKey: 'id_motivo' });
      Internacion.belongsTo(models.ContactoEmergencia, { foreignKey: 'id_contactoEmergencia', as: 'ContactoEmergencia' });
      
      // Relación con Alta (una internación puede tener un alta)
      Internacion.hasOne(models.Alta, { foreignKey: 'id_internacion', as: 'alta' });
      
      // Relación con Solicitudes Médicas
      Internacion.hasMany(models.Solicitud_medica, { foreignKey: 'id_internacion', as: 'solicitudes_medicas' });
      
      // Relación con Planes de Cuidado
      Internacion.hasMany(models.Plan_cuidado, { foreignKey: 'id_internacion', as: 'planes_cuidado' });
    }
  }

  Internacion.init({
    id_paciente_seguro: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_cama: {
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
    detalle_motivo: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [0, 1000],
          msg: "El detalle del motivo no debe superar los 1000 caracteres"
        }
      }
    },
    id_contactoEmergencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    fecha_internacion: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Debe ser una fecha válida" }
      }
    },
    estado: {
      type: DataTypes.ENUM('activa', 'alta', 'traslado'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['activa', 'alta', 'traslado']],
          msg: "El estado debe ser 'activa', 'alta' o 'traslado'"
        }
      }
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      allowNull: true,
      validate: {
        isIn: {
          args: [['baja', 'media', 'alta']],
          msg: "La prioridad debe ser 'baja', 'media' o 'alta'"
        }
      }
    },
    sintomas_principales:{
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "Los síntomas principales no deben superar los 255 caracteres"
        }
      }
    },
    isDesconocido: { // True Masculino, False Femenino, Null sexo en paciente
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'Internacion',
    tableName: 'internaciones',
    timestamps: false
  });

  return Internacion;
}
