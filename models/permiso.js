"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permiso extends Model {
    static associate(models) {
      Permiso.belongsTo(models.Acciones, {
        as: "accion",
        foreignKey: "accion_id",
      });
      Permiso.belongsTo(models.Submodulos, {
        as: "submodulo",
        foreignKey: "submodulo_id",
      });
      Permiso.belongsTo(models.Modulos, {
        as: "modulo",
        foreignKey: "modulo_id",
      });
      Permiso.belongsToMany(models.Roles, {
        through: models.RolesPermisos,
        as: "permisos",
        foreignKey: "permiso_id",
        otherKey: "rol_id",
      });
    }
  }
  Permiso.init(
    {
      modulo_id: DataTypes.INTEGER,
      submodulo_id: DataTypes.INTEGER,
      accion_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Permiso",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Permiso;
};
