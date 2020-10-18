"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.belongsTo(models.Instituto)
      Usuario.belongsTo(models.Programa)
      Usuario.belongsTo(models.TipoUsuario)
      Usuario.hasMany(models.Reservacion)
      Usuario.belongsToMany(models.Roles, { through: models.RolesUsuarios })
    }
  }
  Usuario.init(
    {
      nombre: DataTypes.STRING,
      matricula: DataTypes.STRING,
      correo: DataTypes.STRING,
      contrasena: {
        type: DataTypes.STRING(128),
        is: /^[0-9a-f]{64}$/i,
      },
      sal: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i,
      },
      reset_token: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i,
      },
      tipo_usuario_id: DataTypes.INTEGER,
      instituto_id: DataTypes.INTEGER,
      programa_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Usuario",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Usuario;
};
