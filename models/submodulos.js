"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Submodulos extends Model {
    static associate(models) {
      Submodulos.hasMany(models.Permiso, {
        foreignKey: "submodulo_id",
      });
    }
  }
  Submodulos.init(
    {
      submodulo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Submodulos",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Submodulos;
};
