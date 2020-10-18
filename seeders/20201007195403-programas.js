"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Programas",
      [
        {
          programa: "Ingenieria en sistemas computacionales",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          programa: "Ingenieria fisica",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Programas", null, {});
  },
};
