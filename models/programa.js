'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Programa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Programa.hasMany(models.Usuario, {as: 'usuarios'})
    }
  };
  Programa.init({
    // id: DataTypes.INTEGER,
    programa: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Programa',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Programa;
};