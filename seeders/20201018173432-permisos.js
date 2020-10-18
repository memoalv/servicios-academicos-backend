"use strict";
const db = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Acciones = db.Acciones;
    const Submodulos = db.Submodulos;
    const Modulos = db.Modulos;

    const acciones = await Acciones.findAll();
    const submodulos = await Submodulos.findAll();
    const modulos = await Modulos.findAll();

    const permisos = [];
    modulos.forEach((modulo) => {
      submodulos.forEach((submodulo) => {
        const submoduloSeparado = submodulo.submodulo.split(" ");
        const submoduloModulo = submoduloSeparado[submoduloSeparado.length - 1];

        if (modulo.modulo.toLowerCase() == submoduloModulo.toLowerCase()) {
          acciones.forEach((accion) => {
            permisos.push({
              modulo_id: modulo.id,
              submodulo_id: submodulo.id,
              accion_id: accion.id,
              created_at: new Date(),
              updated_at: new Date(),
            });
          });
        }
      });
    });

    await queryInterface.bulkInsert("Permisos", permisos, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Permisos", null, {});
  },
};
