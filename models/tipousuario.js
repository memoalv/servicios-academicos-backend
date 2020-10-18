'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoUsuario extends Model {
    static associate(models) {
      TipoUsuario.hasMany(models.Usuario)
    }
  };
  TipoUsuario.init({
    tipo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TipoUsuario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return TipoUsuario;
};