'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ventanilla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ventanilla.hasMany(models.Reservacion)

      Ventanilla.belongsToMany(models.Usuario, {
        through: models.UsuariosVentanillas,
        as: "ventanillas",
        foreignKey: "ventanilla_id",
        otherKey: "usuario_id",
      });
    }
  };
  Ventanilla.init({
    nombre: DataTypes.STRING,
    horas_atencion: DataTypes.INTEGER,
    activo: DataTypes.BOOLEAN,
    horarios_atencion: DataTypes.JSON                        
  }, {
    sequelize,
    modelName: 'Ventanilla',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Ventanilla;
};