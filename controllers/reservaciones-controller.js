//Imports
const { body, query } = require("express-validator");
const { Op, where } = require("sequelize");
const db = require("../models");
const { ActiveReservations } = require('../helpers/ActiveReservations');
const { DateTime } = require("luxon");
const model = db.Reservacion;
const Usuario = db.Usuario;
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
    body("fechaInicio").notEmpty().isISO8601(),
    body("usuarioId").optional().isInt(),
    body("tramiteId").notEmpty().isInt()
];

const validacionActualizar = [
    body("fechaInicio").notEmpty().isISO8601(),
    body("usuarioId").optional().isInt(),
    body("tramiteId").notEmpty().isInt(),
    query("id").not().isEmpty().isInt()
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
        return res.status(400).json({mensaje: "tramite no existente"});
    }

    try {
        let instancia = new ActiveReservations(tramite.duracion, req.query.fechaInicio, req.query.fechaFin);
        var datos = await instancia.availableDates();
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
  try{
    var tramite = await tramites.findOne({
      where: {
        id: req.body.tramiteId,
        activo: true
      },
    })
  }catch(error){
    console.log(error);
    return res.status(400).json({mensaje: "tramite no existente"});
  }

  try {
    let fechaInicio = DateTime.fromISO(req.body.fechaInicio, {zone: "America/Denver"}).setZone("UTC");
    let instancia = new ActiveReservations(tramite.duracion, req.body.fechaInicio, req.body.fechaInicio);
    let fechaFin = DateTime.fromISO(req.body.fechaInicio, {zone: "America/Denver"}).plus({minutes: tramite.duracion}).setZone("UTC");
    var ventanillaId = await instancia.validateReservationDate(fechaInicio, fechaFin); 

    if (ventanillaId == -1) {
      return res.status(400).json({
        mensaje: "La fecha selecciona no disponible para este tramite"
      })
    }

    const usuario = await Usuario.findOne({
      where: {
        correo: req.tokenParseado.usuario
      }
    });

    let usuarioId = usuario.id;
    if (req.body.usuarioId) {
      if (req.tokenParseado.grupos.includes("Admin")) {
        usuarioId = req.body.usuarioId;
      }else{
        return res.status(403).json({mensaje: "No tiene permiso de ejecutar este request"})
      }
    }

    const reservacion = await model.create({
      usuario_id: usuarioId,
      ventanilla_id: ventanillaId,
      tramite_id: tramite.id,
      fecha_inicio: fechaInicio.setZone("UTC").toSQL(),
      fecha_fin: fechaFin.setZone("UTC").toSQL(),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "La reservacion se ha creado correctamente",
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
    return res.status(400).json({mensaje: "Reservacion inexistente, favor de verifcar"});
  }

  try{
    var tramite = await tramites.findOne({
      where: {
        id: req.query.tramiteId,
        activo: true
      },
    })
  }catch(error){
    console.log(error);
    return res.status(400).json({mensaje: "tramite no existente"});
  }

  try {
    let fechaInicio = DateTime.fromISO(req.body.fechaInicio, {zone: "America/Denver"}).setZone("UTC");
    let instancia = new ActiveReservations(tramite.duracion, req.body.fechaInicio, req.body.fechaInicio);
    let fechaFin = DateTime.fromISO(req.body.fechaInicio, {zone: "America/Denver"}).plus({minutes: tramite.duracion}).setZone("UTC");
    var ventanillaId = await instancia.validateReservationDate(fechaInicio, fechaFin); 

    if (ventanillaId == -1) {
      return res.status(400).json({
        mensaje: "La fecha selecciona no disponible para este tramite"
      })
    }

    const usuario = await Usuario.findOne({
      where: {
        correo: req.tokenParseado.usuario
      }
    });

    let usuarioId = usuario.id;
    if (req.body.usuarioId) {
      if (req.tokenParseado.grupos.includes("Admin")) {
        usuarioId = req.body.usuarioId;
      }else{
        return res.status(403).json({mensaje: "No tiene permiso de ejecutar este request"})
      }
    }

    const [updateNumberOfAffectedRows] = await model.update({
      usuario_id: usuarioId,
      ventanilla_id: ventanillaId,
      tramite_id: tramite.id,
      fecha_inicio: fechaInicio.setZone("UTC").toSQL(),
      fecha_fin: fechaFin.setZone("UTC").toSQL(),
    },{
      where: {
        id: req.query.id
      }
    });

    if (updateNumberOfAffectedRows == 0) {
      throw "Error al actualizar la reservacion";
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "La reservacion se ha creado correctamente",
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
      mensaje: "La reservacion no existe no existe",
    });
  }

  try {
    Query = {
      id: req.query.id
    };

    const usuario = await Usuario.findOne({
      where: {
        correo: req.tokenParseado.usuario
      }
    });

    if (!req.tokenParseado.grupos.includes("Admin")) {
      Query.usuario_id = usuario.id
    }

    await model.destroy({
      where: Query
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "La reservacion se ha borrado correctamente",
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
  validacionEliminar,
  eliminar
};
