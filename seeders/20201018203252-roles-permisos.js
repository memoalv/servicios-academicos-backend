"use strict";
const db = require("../models");

const rolesPermisos = {
  up: async (queryInterface, Sequelize) => {
    let permisos = await db.Permiso.findAll({
      raw: true,
      attributes: ["id"],
      include: [
        {
          attributes: ["modulo"],
          model: db.Modulos,
          as: "modulo",
        },
        {
          attributes: ["submodulo"],
          model: db.Submodulos,
          as: "submodulo",
        },
        {
          attributes: ["accion"],
          model: db.Acciones,
          as: "accion",
        },
      ],
    });

    permisos = permisos.map((permiso) => {
      return {
        id: permiso.id,
        modulo: permiso["modulo.modulo"],
        submodulo: permiso["submodulo.submodulo"],
        accion: permiso["accion.accion"],
      };
    });

    const roles = await db.Roles.findAll({
      raw: true,
      attributes: ["id", "rol"],
    });

    const rolesPermisos = [
      {
        rol: "Ventanilla",
        permisos: ["trámites"],
        acciones: ["R"],
      },
      {
        rol: "Alumno",
        permisos: ["trámites"],
        acciones: ["C", "R", "U"],
      },
      {
        rol: "Incorporado",
        permisos: ["trámites"],
        acciones: ["C", "R", "U"],
      },
      {
        rol: "Admin",
        permisos: [
          "trámites",
          "ventanillas",
          "usuarios",
          "escuelas",
          "institutos",
          "programas",
        ],
        acciones: ["C", "R", "U", "D"],
      },
    ];

    const rolesPermisosDefinidos = [];
    rolesPermisos.forEach((permisosDefinidos) => {
      let rolId = null;
      roles.forEach((rol) => {
        if (rol.rol == permisosDefinidos.rol) {
          rolId = rol.id;
        }
      });

      permisosDefinidos.permisos.forEach((permisoDefinido) => {
        permisos.forEach((permiso) => {
          if (
            permiso.submodulo.includes(permisoDefinido) &&
            permisosDefinidos.acciones.includes(permiso.accion)
          ) {
            rolesPermisosDefinidos.push({
              rol_id: rolId,
              permiso_id: permiso.id,
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        });
      });

    });

    await queryInterface.bulkInsert("RolesPermisos", rolesPermisosDefinidos, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("RolesPermisos", null, {});
  },
};

module.exports = rolesPermisos;
