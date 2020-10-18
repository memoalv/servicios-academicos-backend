'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolesTramites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RolesTramites.init({
    rol_id: DataTypes.INTEGER,
    tramite_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RolesTramites',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return RolesTramites;
};