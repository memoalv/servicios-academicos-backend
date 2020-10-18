"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Modulos",
      [
        {
          modulo: "Trámites",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          modulo: "Ventanillas",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          modulo: "Usuarios",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          modulo: "Escuelas",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          modulo: "Institutos",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          modulo: "Programas",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Modulos", null, {});
  },
};
