"use strict"

const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth-middleware")

const usuario = require("../controllers/user-controller")
router.post("/signup", usuario.validacionSignUp, usuario.signUp)
router.post("/login", usuario.validacionLogIn, usuario.logIn)
router.post(
  "/usuarios/cambiar_contrasena",
  [authMiddleware, usuario.validacionCambiarContrasena],
  usuario.cambiarContrasena
)

/*************************************
 *
 * * Rutas referentes a PROGRAMAS
 *
 */
const programas = require("../controllers/programs-controller")
router.post(
  "/programas/crear",
  [authMiddleware, programas.validacionCrearPrograma],
  programas.crearPrograma
)
router.delete(
  "/programas/eliminar",
  [authMiddleware, programas.validacionEliminarPrograma],
  programas.eliminarPrograma
)
router.patch(
  "/programas/actualizar",
  [authMiddleware, programas.validacionActualizarPrograma],
  programas.actualizarPrograma
)
router.get("/programas/listar", [programas.validacionListarProgramas], programas.listarProgramas)

/*************************************
 *
 * * Rutas referentes a INSTITUTOS
 *
 */
const institutos = require("../controllers/campus-controller")
router.post(
  "/institutos/crear",
  [authMiddleware, institutos.validacionCrearInstituto],
  institutos.crearInstituto
)
router.delete(
  "/institutos/eliminar",
  [authMiddleware, institutos.validacionEliminarInstituto],
  institutos.eliminarInstituto
)
router.patch(
  "/institutos/actualizar",
  [authMiddleware, institutos.validacionActualizarInstituto],
  institutos.actualizarInstituto
)
router.get(
  "/institutos/listar",
  [institutos.validacionListarInstitutos],
  institutos.listarInstitutos
)

module.exports = router
