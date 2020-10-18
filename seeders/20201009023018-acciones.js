"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Acciones",
      [
        {
          accion: "C",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          accion: "R",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          accion: "U",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          accion: "D",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Acciones", null, {});
  },
};
