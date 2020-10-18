'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permiso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Permiso.init({
    modulo_id: DataTypes.INTEGER,
    submodulo_id: DataTypes.INTEGER,
    accion_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Permiso',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Permiso;
};