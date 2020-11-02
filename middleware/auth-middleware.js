"use strict";
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // verificacion de que el token este presente
  if (!req.headers.authorization) 
    return res.status(401).send()

  const token = req.headers.authorization;
  
  // verificacion de que el token no este alterado o expirado
  // ambas las hace automaticamente la libreria
  try {
    var tokenParseado = jwt.verify(token, process.env.APP_SECRET)
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido"
    })
  }
  req.tokenParseado = tokenParseado;
  next()
}




