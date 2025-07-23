const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Paciente extends Model {
    static associate(models) {
      Paciente.belongsTo(models.Localidad, { foreignKey: 'id_localidad', as: 'localidad' });
      Paciente.belongsTo(models.TipoSangre, { foreignKey: 'id_tipoSangre', as: 'tipoSangre' });
      Paciente.belongsTo(models.Persona, { foreignKey: 'id_persona', as: 'persona' });
      Paciente.hasMany(models.Turno, { foreignKey: 'id_paciente', as: 'turnos' });
      Paciente.hasMany(models.PacienteSeguro, { foreignKey: 'id_paciente', as: 'seguros' });
    }
  }

  Paciente.init({
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    },
    sexo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: {
          args: [[1, 2]],
          msg: "El sexo debe ser 1 (masculino) o 2 (femenino)"
        }
      }
    },
    domicilio: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "El domicilio no debe superar los 255 caracteres"
        }
      }
    },
    id_localidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: -1
      }
    },
    id_tipoSangre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: -1
      }
    },
    fechaNacimiento: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Debe ser una fecha válida" },
        isBefore: {
          args: new Date().toISOString().split('T')[0],
          msg: "La fecha de nacimiento debe ser anterior a hoy"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Paciente',
    tableName: 'pacientes',
    timestamps: false
  });

  return Paciente;
}
