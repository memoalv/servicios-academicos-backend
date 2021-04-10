"use strict";
const { validationResult } = require("express-validator");
const { verificarPermisos } = require("../services/auth-service");

module.exports = (permisos = null, grupo = null) => {
  return (req, res, next) => {
    if (permisos) {
      if (!verificarPermisos(permisos, req.tokenParseado.permisos)) {
        return res.status(401).send();
      }
    }

    if (grupo) {
      if(!req.tokenParseado.grupos.includes(grupo)) {
        return res.status(401).send();
      }
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  };
};
