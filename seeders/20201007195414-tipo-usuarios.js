"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "TipoUsuarios",
      [
        {
          tipo: "UACJ",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          tipo: "Incorporado",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          tipo: "Ventanilla",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("TipoUsuarios", null, {});
  },
};
