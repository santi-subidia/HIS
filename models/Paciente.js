const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Paciente extends Model {
    static associate(models) {
      Paciente.belongsTo(models.Localidad, { foreignKey: 'id_localidad', as: 'localidad' });
      Paciente.belongsTo(models.TipoSangre, { foreignKey: 'id_tipoSangre', as: 'tipoSangre' });
      Paciente.hasMany(models.Turno, { foreignKey: 'id_paciente', as: 'turnos' });
      Paciente.hasMany(models.PacienteSeguro, { foreignKey: 'id_paciente', as: 'seguros' });
    }
  }

  Paciente.init({
    DNI: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El DNI no puede estar vacío" },
        is: {
          args: /^[0-9]{7,9}$/,
          msg: "El DNI debe contener entre 7 y 9 dígitos numéricos"
        }
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
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El apellido no puede estar vacío" },
        len: {
          args: [2, 50],
          msg: "El apellido debe tener entre 2 y 50 caracteres"
        }
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
    nro_Telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isNumeric: { msg: "El número de teléfono solo debe contener números" },
        len: {
          args: [7, 15],
          msg: "El teléfono debe tener entre 7 y 15 dígitos"
        }
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
