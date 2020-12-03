const { validationResult, body, query } = require("express-validator");
const { verificarPermisos } = require("../services/auth-service");
const { calcularOffset } = require("../services/pagination-service");
const db = require("../models");
const Instituto = db.Instituto;

const validacionCrearInstituto = [body("instituto").not().isEmpty().trim()];
const crearInstituto = async (req, res) => {
  if (
    !verificarPermisos(
      {
        modulo: "Institutos",
        submodulo: "Listado de institutos",
        accion: "C",
      },
      req.tokenParseado.permisos
    )
  ) {
    return res.status(401).send();
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let existeInstituto = false;
  try {
    existeInstituto = await Instituto.findOne({
      where: {
        instituto: req.body.instituto,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  if (!!existeInstituto) {
    return res.status(400).json({
      mensaje: "Instituto ya existe",
    });
  }

  try {
    await Instituto.create({ instituto: req.body.instituto });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "Instituto creado correctamente",
  });
};

const validacionEliminarInstituto = [body("instituto_id").not().isEmpty().isInt()];
const eliminarInstituto = async (req, res) => {
  if (
    !verificarPermisos(
      {
        modulo: "Institutos",
        submodulo: "Listado de institutos",
        accion: "D",
      },
      req.tokenParseado.permisos
    )
  ) {
    return res.status(401).send();
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    var numBorrados = await Instituto.destroy({
      where: {
        id: req.body.instituto_id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  if (numBorrados < 1) {
    return res.status(400).json({ mensaje: "El instituto a borrar no existe" });
  }

  return res.status(200).json({
    mensaje: "Instituto eliminado correctamente",
  });
};

const validacionActualizarInstituto = [
  body("instituto_id").not().isEmpty().isInt(),
  body("instituto").not().isEmpty().trim(),
];
const actualizarInstituto = async (req, res) => {
  if (
    !verificarPermisos(
      {
        modulo: "Institutos",
        submodulo: "Listado de institutos",
        accion: "U",
      },
      req.tokenParseado.permisos
    )
  ) {
    return res.status(401).send();
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    var [numActualizados] = await Instituto.update(
      {
        instituto: req.body.instituto,
      },
      {
        where: {
          id: req.body.instituto_id,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  if (numActualizados < 1) {
    return res.status(400).json({ mensaje: "El instituto a actualizar no existe" });
  }

  return res.status(200).json({
    mensaje: "Instituto actualizado correctamente",
  });
};

const validacionListarInstitutos = [
  query("pagina").not().isEmpty().isInt(),
  query("resultados_por_pagina").not().isEmpty().isInt(),
];

const listarInstitutos = async (req, res) => {
  if (
    !verificarPermisos(
      {
        modulo: "Institutos",
        submodulo: "Listado de institutos",
        accion: "R",
      },
      req.tokenParseado.permisos
    )
  ) {
    return res.status(401).send();
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const pagina = req.query.pagina;
  const resultados_por_pagina = req.query.resultados_por_pagina;
  const { offset, limite } = calcularOffset(pagina, resultados_por_pagina);

  try {
    var instituos = await Instituto.findAll({ order: [['instituto', "ASC"]], offset: offset, limit: limite });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "Correcto",
    datos: instituos
  });
};

module.exports = {
  validacionCrearInstituto,
  crearInstituto,
  validacionEliminarInstituto,
  eliminarInstituto,
  validacionActualizarInstituto,
  actualizarInstituto,
  validacionListarInstitutos,
  listarInstitutos,
};
