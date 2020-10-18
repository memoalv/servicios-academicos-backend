"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Submodulos",
      [
        {
          submodulo: "Listado de trámites",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          submodulo: "Listado de ventanillas",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          submodulo: "Listado de usuarios",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          submodulo: "Listado de escuelas",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          submodulo: "Listado de institutos",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          submodulo: "Listado de programas",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Submodulos", null, {});
  },
};
