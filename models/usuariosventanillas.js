"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UsuariosVentanillas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsuariosVentanillas.init(
    {
      ventanilla_id: {
        type: DataTypes.INTEGER,
        field: "ventanilla_id",
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        field: "usuario_id",
      },
    },
    {
      sequelize,
      modelName: "UsuariosVentanillas",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UsuariosVentanillas;
};
