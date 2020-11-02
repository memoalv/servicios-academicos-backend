"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolesPermisos extends Model {
    static associate(models) {}
  }
  RolesPermisos.init(
    {
      rol_id: DataTypes.INTEGER,
      permiso_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RolesPermisos",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return RolesPermisos;
};
