"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolesUsuarios extends Model {
    static associate(models) {}
  }
  RolesUsuarios.init(
    {
      rol_id: {
        type: DataTypes.INTEGER,
        field: "rol_id",
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        field: "usuario_id",
      },
    },
    {
      sequelize,
      modelName: "RolesUsuarios",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return RolesUsuarios;
};
