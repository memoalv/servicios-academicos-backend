"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Instituto, {
        as: "instituto",
        foreignKey: "instituto_id",
      });
      Usuario.belongsTo(models.Programa, {
        as: "programa",
        foreignKey: "programa_id",
      });
      Usuario.hasMany(models.Reservacion, {
        as: "reservaciones",
        foreignKey: "usuario_id",
      });
      Usuario.belongsToMany(models.Roles, {
        through: models.RolesUsuarios,
        as: "roles",
        foreignKey: "usuario_id",
        otherKey: "rol_id",
      });
    }
  }
  Usuario.init(
    {
      nombre: DataTypes.STRING,
      matricula: DataTypes.STRING,
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notNull: true,
          notEmpty: true,
        },
      },
      contrasena: {
        type: DataTypes.STRING(128),
        is: /^[0-9a-f]{128}$/i,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      sal: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      reset_token: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{128}$/i,
      },
      instituto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          notNull: true,
          notEmpty: true,
        },
        field: "instituto_id",
      },
      programa_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        validate: {
          notEmpty: true,
        },
        field: "programa_id",
      },
      inicio_sesion: {
        type: DataTypes.BOOLEAN,
        field: "inicio_sesion",
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      // underscored: true
    }
  );
  return Usuario;
};
