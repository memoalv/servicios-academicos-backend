'use strict';

/**
 * Migracion para permitir nulos en la columna 'instituto_id'
 * Las escuelas incorporadas no tendran un programa relacionado
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Usuarios", "instituto_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    },)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Usuarios", "instituto_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    },)
  }
};
