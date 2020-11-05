"use strict";

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");

const usuario = require("../controllers/user-controller");
router.post("/signup", usuario.validacionSignUp, usuario.signUp);
router.post("/login", usuario.validacionLogIn, usuario.logIn);
router.post(
  "/usuarios/cambiar_contrasena",
  [authMiddleware, usuario.validacionCambiarContrasena],
  usuario.cambiarContrasena
);

const programas = require("../controllers/programs-controller");
router.post("/programas/crear", [authMiddleware, programas.validacionCrearPrograma], programas.crearPrograma);
router.delete(
  "/programas/eliminar",
  [authMiddleware, programas.validacionEliminarPrograma],
  programas.eliminarPrograma
);
router.patch(
  "/programas/actualizar",
  [authMiddleware, programas.validacionActualizarPrograma],
  programas.actualizarPrograma
);

module.exports = router;
