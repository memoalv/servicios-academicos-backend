'use strict';

/**
 * Migracion para permitir nullos en la columna 'programa_id'
 * Las escuelas incorporadas no tendran un programa relacionado
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Usuarios", "programa_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    },)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Usuarios", "programa_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    },)
  }
};
