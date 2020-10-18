'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolesPermisos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RolesPermisos.init({
    rol_id: DataTypes.INTEGER,
    permiso_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RolesPermisos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return RolesPermisos;
};