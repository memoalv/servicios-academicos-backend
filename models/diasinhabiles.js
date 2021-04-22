'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiasInhabiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DiasInhabiles.init({
    dia: DataTypes.NUMBER,
  }, {
    sequelize,
    modelName: 'DiasInhabiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return DiasInhabiles;
};