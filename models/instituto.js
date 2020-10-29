'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instituto extends Model {
    static associate(models) {
      Instituto.hasMany(models.Usuario, {
        foreignKey: "instituto_id",
      })
    }
  };
  Instituto.init({
    instituto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Instituto',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Instituto;
};