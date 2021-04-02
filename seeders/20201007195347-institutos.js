"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let institutes = [
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
      }
    ];

    for (let i = 0; i < 100; i++) {
      institutes.push({
        instituto: `test-${i}`,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert(
      "Institutos",
      institutes,
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Institutos", null, {});
  },
};
