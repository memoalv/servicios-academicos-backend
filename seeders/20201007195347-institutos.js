"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Institutos",
      [
        {
          instituto: "IIT",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          instituto: "IADA",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          instituto: "ICSA",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Institutos", null, {});
  },
};
