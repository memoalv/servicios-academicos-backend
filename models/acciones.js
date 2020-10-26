"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Acciones extends Model {
    static associate(models) {
      Acciones.hasMany(models.Permiso, {
        foreignKey: "accion_id",
      })
    }
  }
  Acciones.init(
    {
      accion: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Acciones",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Acciones;
};
