//Imports
const { calcularOffset } = require("../services/pagination-service");
const { Op } = require("sequelize");
const db = require("../models");
const model = db.Tramite;
const rolesTramites = db.RolesTramites;

//Validaciones

/**
 * Validacion del los requests de la ventanillas
 */

const validacionListar = [
  query("pagina").not().isEmpty().isInt(),
  query("soloActivas").optional().isBoolean(),
  query("resultados_por_pagina").not().isEmpty().isInt(),
];

const validacionCrear = [
  body("nombre").not().isEmpty().trim().isAlphanumeric(),
  body("duracion").not().isEmpty().isInt(),
  body("activo").not().isEmpty().isBoolean(),
  body("roles").exists().withMessage('missing array of roles'),
  body("roles.*").not().isEmpty().isInt(),
];

const validacionActualizar = [
  query("id").not().isEmpty().isInt(),
  body("nombre").not().isEmpty().trim().isAlphanumeric(),
  body("duracion").not().isEmpty().isInt(),
  body("activo").not().isEmpty().isBoolean(),
  body("roles").exists().withMessage('missing array of roles'),
  body("roles.*").not().isEmpty().isInt(),
];

const validacionBorrar = [
  query("id").not().isEmpty().isInt()
];

//Métodos

/**
 *
 * Método para listar tramites
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const listar = async (req, res) => {
  const pagina = req.query.pagina;
  const resultados_por_pagina = req.query.resultados_por_pagina;
  const { offset, limite } = calcularOffset(pagina, resultados_por_pagina);
  const query = {
    where: {
      activo: true,
    },
    order: [["id", "ASC"]],
    offset: offset,
    limit: limite,
  };
  try {
    if (req.query.soloActivas) {
      query.where.activo = true
    } else {
      query.where.activo = false
    }

    datos = model.findAll(query)
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "Correcto",
    datos: datos,
  });
};

/**
 * Método para la creacion de una tramites
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const crear = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const tramite = await model.create({
      nombre: req.body.nombre,
      duracion: req.body.duracion,
      activo: req.body.activo,
    },{
      transaction: t,
    });

    rowsToInsert = [];
    req.body.roles.forEach(rol_id => {
      rowsToInsert.push({
        rol_id: rol_id,
        tramite_id: tramite.id 
      });
    });
    roles = await rolesTramites.bulkCreate(rowsToInsert, {
      transaction: t,
    });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "El tramite se ha creado correctamente",
  });
};

/**
 * Método para la actualización de una tramites
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const actualizar = async (req, res) => {

  try {
    await model.findOne({
      where: {
        id: req.query.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({mensaje: "Usuario inexistente, favor de verifcar"});
  }

  const t = await db.sequelize.transaction();
  try {
    roles = await rolesTramites.findAll({
      where: {
        tramite_id: req.query.id
      }
    }, {
      transaction: t
    });
    rolesIds = [];

    roles.forEach(role => {
      rolesIds.push(role.rol_id);
    });
    
    if (rolesIds.length != req.body.roles.length) {
      toInsert = rolesIds.filter(x => !req.body.roles.includes(x));
      toRemove = req.body.roles.filter(x => !rolesIds.includes(x));
  
      if (toRemove.length != 0) {
        await rolesTramites.destroy({
          where: {
            tramite_id: req.query.id,
            rol_id: {
              [Op.in]: toRemove
            }
          }
        }, {
          transaction: t
        });
      }
    
      rowsToInsert = []
      req.body.roles.forEach(rolId => {
        rowsToInsert.push({
          rol_id: rolId,
          tramite_id: req.query.id
        })
      });
  
      roles = await rolesTramites.bulkCreate(rowsToInsert, {
        transaction: t,
      });
    }
   
    const [updateNumberOfAffectedRows] = await model.update({
      nombre: req.body.nombre,
      duracion: req.body.duracion,
      activo: req.body.activo,
    });

    if (updateNumberOfAffectedRows == 0 && rolesIds.length != req.body.roles.length) {
      throw "Error al actualizar el tramite"
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "El tramite se ha actualizado correctamente",
  });
};

/**
 * Método para la actualización de una Ventanilla
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const borrar = async (req, res) => {
  let existe = false;
  try {
    existe = await model.findOne({
      where: {
        id: req.query.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  if (!existe) {
    return res.status(400).json({
      mensaje: "La ventanilla no existe",
    });
  }

  try {
    await Ventanilla.destroy({
      where: {
        id: req.query.id
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "El tramite se ha borrado correctamente",
  });
};

//Export de los objetos
module.exports = {
  validacionCrear,
  crear,
  validacionListar,
  listar,
  validacionActualizar,
  actualizar,
  validacionBorrar,
  borrar
};
