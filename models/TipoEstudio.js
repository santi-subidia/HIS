const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TipoEstudio extends Model {
    static associate(models) {
      TipoEstudio.belongsTo(models.CategoriaTipoEstudio, { 
        foreignKey: 'id_categoria', 
        as: 'categoria' 
      });
      
      TipoEstudio.hasMany(models.Solicitud_medica, { 
        foreignKey: 'id_tipo_estudio', 
        as: 'solicitudes_medicas' 
      });
    }
  }

  TipoEstudio.init({
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
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Debe ser un número entero" },
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'TipoEstudio',
    tableName: 'tipos_estudios',
    timestamps: false
  });

  return TipoEstudio;
}
