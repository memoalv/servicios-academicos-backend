//Imports
const { validationResult, body, query } = require("express-validator");
const { verificarPermisos } = require("../services/auth-service");
const { calcularOffset } = require("../services/pagination-service");
const db = require("../models");
const Ventanilla = db.Ventanilla;

//Validaciones

/**
 * Validacion del los requests de la ventanillas
 */

const validacionListarVentanilla = [
  query("pagina").not().isEmpty().isInt(),
  query("soloActivas").optional().isBoolean(),
  query("resultados_por_pagina").not().isEmpty().isInt(),
];

const validacionCrearVentanilla = [
  body("nombre").not().isEmpty().trim().custom((value) => {
    return value.match(/([A-Za-z ])\w+/);
  }),
  body("horas_atencion").not().isEmpty().isInt(),
  body("activo").not().isEmpty().isBoolean(),
];

const validacionActualizarVentanilla = [
  query("id").not().isEmpty().isInt(),
  body("nombre").not().isEmpty().trim().custom((value) => {
    return value.match(/([A-Za-z ])\w+/);
  }),
  body("horas_atencion").not().isEmpty().isInt(),
  body("activo").not().isEmpty().isBoolean(),
];

const validacionBorrarVentanilla = [
  query("id").not().isEmpty().isInt()
];

//Métodos

/**
 *
 * Método para listar ventanillas
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const listarVentanilla = async (req, res) => {
  const pagina = req.query.pagina;
  const resultados_por_pagina = req.query.resultados_por_pagina;
  const { offset, limite } = calcularOffset(pagina, resultados_por_pagina);

  try {
    if (req.query.soloActivas) {
      var ventanillasDisponibles = await Ventanilla.findAll({
        where: {
          activo: true,
        },
        order: [["id", "ASC"]],
        offset: offset,
        limit: limite,
      });
    } else {
      var ventanillasDisponibles = await Ventanilla.findAll({
        order: [["id", "ASC"]],
        offset: offset,
        limit: limite,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "Correcto",
    datos: ventanillasDisponibles,
  });
};

/**
 * Método para la creacion de una Ventanilla
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const crearVentanilla = async (req, res) => {
  try {
    data = {
      nombre: req.body.nombre,
      horas_atencion: req.body.horas_atencion,
      activo: req.body.activo,
    };
    await Ventanilla.create(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "La ventanilla se ha creado correctamente",
  });
};

/**
 * Método para la actualización de una Ventanilla
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const actualizarVentanilla = async (req, res) => {
  let existeVentanilla = false;
  try {
    existeVentanilla = await Ventanilla.findOne({
      where: {
        id: req.query.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
  console.log("entra");
  if (!existeVentanilla) {
    return res.status(400).json({
      mensaje: "La ventanilla ya existe",
    });
  }

  try {
    await Ventanilla.update({
      nombre: req.body.nombre,
      horas_atencion: req.body.horas_atencion,
      activo: req.body.activo,
    },{
      where: {
        id: req.query.id
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "La ventanilla se ha actualizado correctamente",
  });
};

/**
 * Método para la actualización de una Ventanilla
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const borrarVentanilla = async (req, res) => {
  let existeVentanilla = false;
  try {
    existeVentanilla = await Ventanilla.findOne({
      where: {
        id: req.query.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }
  console.log("entra");
  if (!existeVentanilla) {
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
    mensaje: "La ventanilla se ha borrado correctamente",
  });
};

//Export de los objetos
module.exports = {
  validacionCrearVentanilla,
  crearVentanilla,
  validacionListarVentanilla,
  listarVentanilla,
  validacionActualizarVentanilla,
  actualizarVentanilla,
  validacionBorrarVentanilla,
  borrarVentanilla
};
