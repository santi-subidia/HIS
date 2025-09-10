const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Especialidad extends Model {
    static associate(models) {
      Especialidad.hasMany(models.Medico, { foreignKey: 'id_especialidad', as: 'medicos' });
    }
  }

  Especialidad.init({
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
    }
  }, {
    sequelize,
    modelName: 'Especialidad',
    tableName: 'especialidades',
    timestamps: false
  });

  return Especialidad;
}