"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Usuarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      matricula: {
        type: Sequelize.STRING,
      },
      correo: {
        type: Sequelize.STRING,
        isEmail: true,
        unique: true,
        allowNull: false,
      },
      contrasena: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      sal: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      reset_token: {
        type: Sequelize.STRING(64),
      },
      tipo_usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: "TipoUsuarios",
          key: "id",
        }
      },
      instituto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: "Institutos",
          key: "id",
        }
      },
      programa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: "Programas",
          key: "id",
        }
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Usuarios");
  },
};
