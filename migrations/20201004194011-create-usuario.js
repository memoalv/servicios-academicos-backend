'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      matricula: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      contrasena: {
        type: "binary(64)"
      },
      sal: {
        type: "binary(64)"
      },
      reset_token: {
        type: Sequelize.STRING
      },
      tipo_usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // User belongsTo Company 1:1
          model: 'TipoUsuarios',
          key: 'id'
        }
      },
      instituto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // User belongsTo Company 1:1
          model: 'Institutos',
          key: 'id'
        }
      },
      programa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // User belongsTo Company 1:1
          model: 'Programas',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Usuarios');
  }
};