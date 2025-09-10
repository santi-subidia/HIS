const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Enfermero extends Model {
        static associate(models) {
            Enfermero.belongsTo(models.Persona, {foreignKey: 'id_persona', as: 'persona'});
        }
    }

    Enfermero.init(
        {
            id_persona: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: { msg: "Debe ser un número entero" },
                    min: -1,
                },
            },
            fecha_eliminacion: {
                type: DataTypes.DATE,  
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "Enfermero",
            tableName: "enfermeros",
            timestamps: false,
        }
    );

    return Enfermero;
};
