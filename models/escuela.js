'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Escuela extends Model {
    static associate(models) {
      Escuela.hasMany(models.Usuario, {
        foreignKey: "programa_id"
      })
    }
  };
  Escuela.init({
    escuela: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Escuela',
    imestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Escuela;
};