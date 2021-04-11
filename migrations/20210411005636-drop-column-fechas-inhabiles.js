"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("FechasInhabiles", "activo");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("FechasInhabiles", "activo", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
  },
};
