'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reservacion.belongsTo(models.Usuario)
      Reservacion.belongsTo(models.Ventanilla)
      Reservacion.belongsTo(models.Tramite)
    }
  };
  Reservacion.init({
    usuario_id: DataTypes.INTEGER,
    tramite_id: DataTypes.INTEGER,
    ventanilla_id: DataTypes.INTEGER,
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Reservacion',
    freezeTableName: true,
    tableName: 'Reservaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Reservacion;
};