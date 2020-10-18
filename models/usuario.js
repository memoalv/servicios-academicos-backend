'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuario.belongsTo(models.Programa, {foreignKey: 'programa_id', as: 'programa'})
      Usuario.belongsTo(models.Instituto, {foreignKey: 'instituto_id', as: 'instituto'})
      Usuario.belongsTo(models.TipoUsuario, {foreignKey: 'tipo_usuario_id_id', as: 'tipo_usuario'})
    }
  };
  Usuario.init({
    // id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    matricula: DataTypes.STRING,
    correo: DataTypes.STRING,
    contrasena: DataTypes.STRING,
    sal: DataTypes.STRING,
    reset_token: DataTypes.STRING,
    tipo_usuario_id: DataTypes.INTEGER,
    instituto_id: DataTypes.INTEGER,
    programa_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Usuario',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Usuario;
};