"use strict";

/**
 * Se hace esta modificacion a la db pq el 'tipo de usuario' en realidad
 * es un grupo, por lo que estara especificado en la tabla RolesUsuarios
 * en la que se asocia un cierto usuario a un rol
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // drop de columna tipo usuario en tabla usuarios
    await queryInterface.removeColumn("Usuarios", "tipo_usuario_id");
    // drop de tabla tipo usuarios
    await queryInterface.dropTable("TipoUsuarios");
    
  },
  down: async (queryInterface, Sequelize) => {
    // creacion de tabla tipo usuarios
    await queryInterface.createTable("TipoUsuarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tipo: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // relacion a tabla usuarios
    await queryInterface.addColumn("Usuarios", "tipo_usuario_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      onUpdate: "CASCADE",
      references: {
        model: "TipoUsuarios",
        key: "id",
      },
    });
  },
};
