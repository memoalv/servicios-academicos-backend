'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Programa extends Model {
    static associate(models) {
      Programa.hasMany(models.Usuario, {
        foreignKey: "programa_id"
      })
    }
  };
  Programa.init({
    programa: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Programa',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Programa;
};