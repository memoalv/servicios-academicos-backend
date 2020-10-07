'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RolesUsuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rol_id: {
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        references: {
          model: "Roles",
          key: "id",
        }
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        references: {
          model: "Usuarios",
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
    await queryInterface.dropTable('RolesUsuarios');
  }
};