const { validationResult, body, query } = require("express-validator");
const { verificarPermisos } = require("../services/auth-service");
const { calcularOffset } = require("../services/pagination-service");
const db = require("../models");
const Programa = db.Programa;

// tal vez pueda crear una clase para mezclar los cruds 
// simples y facilitar el mantenimiento. (Programas e Institutos)

const validacionCrearPrograma = [body("programa").not().isEmpty().trim()];
const crearPrograma = async (req, res) => {
  if (
    !verificarPermisos(
      {
        modulo: "Programas",
        submodulo: "Listado de programas",
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

  let existePrograma = false;
  try {
    existePrograma = await Programa.findOne({
      where: {
        programa: req.body.programa,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  if (!!existePrograma) {
    return res.status(400).json({
      mensaje: "Programa ya existe",
    });
  }

  try {
    await Programa.create({ programa: req.body.programa });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "Programa creado correctamente",
  });
};

const validacionEliminarPrograma = [body("programa_id").not().isEmpty().isInt()];
const eliminarPrograma = async (req, res) => {
  if (
    !verificarPermisos(
      {
        modulo: "Programas",
        submodulo: "Listado de programas",
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
    var numBorrados = await Programa.destroy({
      where: {
        id: req.body.programa_id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  if (numBorrados < 1) {
    return res.status(400).json({ mensaje: "El programa a borrar no existe" });
  }

  return res.status(200).json({
    mensaje: "Programa eliminado correctamente",
  });
};

const validacionActualizarPrograma = [
  body("programa_id").not().isEmpty().isInt(),
  body("programa").not().isEmpty().trim(),
];
const actualizarPrograma = async (req, res) => {
  if (
    !verificarPermisos(
      {
        modulo: "Programas",
        submodulo: "Listado de programas",
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
    var [numActualizados] = await Programa.update(
      {
        programa: req.body.programa,
      },
      {
        where: {
          id: req.body.programa_id,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  if (numActualizados < 1) {
    return res.status(400).json({ mensaje: "El programa a actualizar no existe" });
  }

  return res.status(200).json({
    mensaje: "Programa actualizado correctamente",
  });
};

const validacionListarProgramas = [
  query("pagina").not().isEmpty().isInt(),
  query("resultados_por_pagina").not().isEmpty().isInt(),
];

const listarProgramas = async (req, res) => {
  if (
    !verificarPermisos(
      {
        modulo: "Programas",
        submodulo: "Listado de programas",
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
    var programas = await Programa.findAll({ order: [['id', "DESC"]], offset: offset, limit: limite });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "Correcto",
    datos: programas
  });
};

module.exports = {
  validacionCrearPrograma,
  crearPrograma,
  validacionEliminarPrograma,
  eliminarPrograma,
  validacionActualizarPrograma,
  actualizarPrograma,
  validacionListarProgramas,
  listarProgramas,
};
