'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          rol: "Ventanilla",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          rol: "Alumno",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          rol: "Incorporado",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          rol: "Admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
