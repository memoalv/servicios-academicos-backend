"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Instituto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Instituto.hasMany(models.Usuario, { as: "usuarios" });
    }
  }
  Instituto.init(
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   primaryKey: true,
      //   allowNull: false,
      //   autoIncrement: true,
      // },
      instituto: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Instituto",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Instituto;
};
