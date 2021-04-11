"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("DiasInhabiles", "activo");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("DiasInhabiles", "activo", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
  },
};
