"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NombresPermisos extends Model {
    static associate(models) {}
  }
  NombresPermisos.init(
    {
      modulo: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      submodulo: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      accion: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "NombresPermisos",
      timestamps: false,
    }
  );
  return NombresPermisos;
};
