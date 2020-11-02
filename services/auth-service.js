const db = require("../models");
const Usuario = db.Usuario;
const routeMap = require("./route-map");

/**
 * Contiene los datos de autenticacion y autorizacion del usuario
 * "correo":
 *  "contrasena":
 *  "sal":
 *  "inicio_sesion":
 *  "roles":
 *  @param correo - Correo del usuario del que se necesitan los datos
 */
const datosAutenticacion = async (correo) => {
  let datosAutenticacion = await Usuario.findOne({
    attributes: ["correo", "contrasena", "sal", "inicio_sesion"],
    where: {
      correo: correo,
    },
    include: [
      {
        model: db.Roles,
        as: "roles",
        attributes: ["rol"],
        include: [
          {
            model: db.Permiso,
            as: "permisos",
            attributes: ["modulo_id", "submodulo_id", "accion_id"],
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
          },
        ],
      },
    ],
  });

  return JSON.parse(JSON.stringify(datosAutenticacion));
};

const parsePermisos = (roles) => {
  const grupos = [];
  const permisos = [];
  roles.forEach((rol) => {
    grupos.push(rol.rol);
    rol.permisos.forEach((permiso) => {
      let indiceModulo = permisos.findIndex((elem) => elem.nombre == permiso.modulo.modulo);
      if (indiceModulo < 0) {
        // el push regresa el nuevo length del arreglo
        indiceModulo = permisos.push(routeMap[permiso.modulo.modulo]) - 1;
      }

      let indiceSubmodulo = permisos[indiceModulo].submodulos.findIndex(
        (elem) => elem.nombre == permiso.submodulo.submodulo
      );
      if (indiceSubmodulo < 0) {
        indiceSubmodulo = permisos[indiceModulo].submodulos.push(routeMap[permiso.submodulo.submodulo]) - 1;
      }

      let indiceAccion = permisos[indiceModulo].submodulos[indiceSubmodulo].acciones.findIndex(
        (elem) => elem == permiso.accion.accion
      );
      
      if(indiceAccion < 0) {
        permisos[indiceModulo].submodulos[indiceSubmodulo].acciones.push(permiso.accion.accion);
      }
    });
  });

  return {
    grupos: grupos,
    permisos: permisos,
  };
};

const test = require("../query-permisos.json");
parsePermisos(test.roles);

module.exports = {
  datosAutenticacion,
  parsePermisos,
};
