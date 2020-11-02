"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolesTramites extends Model {
    static associate(models) {}
  }
  RolesTramites.init(
    {
      rol_id: DataTypes.INTEGER,
      tramite_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RolesTramites",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return RolesTramites;
};
