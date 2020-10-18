'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FechasInhabiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FechasInhabiles.init({
    fecha: DataTypes.DATE,
    activo: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'FechasInhabiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return FechasInhabiles;
};