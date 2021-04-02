"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const programas =  [
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
    ];

    for (let i = 0; i < 100; i++) {
      programas.push({
        programa: `test-${i}`,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert(
      "Programas",
      programas,
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Programas", null, {});
  },
};
