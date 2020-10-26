"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Modulos extends Model {
    static associate(models) {
      Modulos.hasMany(models.Permiso, {
        foreignKey: "modulo_id",
      })
    }
  }
  Modulos.init(
    {
      modulo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Modulos",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Modulos;
};
