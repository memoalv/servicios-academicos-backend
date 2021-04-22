//Imports
const { body, query } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../models");
const { ActiveReservations } = require('../helpers/ActiveReservations');
const model = db.Reservacion;
const tramites = db.Tramite;

//Validaciones

/**
 * Validacion del los requests de la Tramites
 */

const validacionListar = [
  query("fechaInicio").notEmpty().isISO8601(),
  query("fechaFin").notEmpty().isISO8601(),
  query("tramiteId").notEmpty().isInt()
];

const validacionCrear = [
    body("fecha").notEmpty().isISO8601(),
    body("tramiteId").notEmpty().isInt()
];

const validacionEliminar = [
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
    try{
        tramite = await tramites.findOne({
            where: {
                id: req.query.tramiteId,
                activo: true
            },
        })
    }catch(error){
        console.log(error);
        return res.status(422).json({mensaje: "tramite no existente"});
    }

    try {
        instancia = new ActiveReservations(tramite.duracion, req.query.fechaInicio, req.query.fechaFin);
        datos = await instancia.availableDates();
    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
    
    return res.status(200).json({
       mensaje : "correcto",
       datos : datos
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
        "tramite_id": req.query.id
      },
      attributes: ["rol_id"]
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
    },{
      where: {
        id: req.query.id
      }
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
 * Método para la actualización de un Tramite
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
 const eliminar = async (req, res) => {
  let existe = false;
  try {
    existe = await model.findOne({
      where: {
        id: req.query.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensaje: "error general"
    });
  }

  if (!existe) {
    return res.status(400).json({
      mensaje: "El Tramite no existe",
    });
  }

  try {
    await model.destroy({
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
//   validacionActualizar,
//   actualizar,
//   validacionEliminar,
//   eliminar
};
