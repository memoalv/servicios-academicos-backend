const { validationResult, body } = require("express-validator");
const { verificarPermisos } = require("../services/auth-service");
const db = require("../models");
const Programa = db.Programa;

const validacionPrograma = [body("programa").not().isEmpty().trim()];

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
    await Programa.destroy({
        where: {
          programa: req.body.programa,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  return res.status(200).json({
    mensaje: "Programa eliminado correctamente",
  });
};

module.exports = {
  validacionPrograma,
  crearPrograma,
  eliminarPrograma,
};
