"use strict"

const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth-middleware")
const validateMiddleware = require("../middleware/validate-request-middleware")

/*************************************
 *
 * * Rutas referentes a USUARIOS
 *
 */
const usuario = require("../controllers/user-controller")
router.post("/signup", usuario.validacionSignUp, usuario.signUp)
router.post("/login", usuario.validacionLogIn, usuario.logIn)
router.post(
  "/usuarios/cambiar_contrasena",
  [authMiddleware, usuario.validacionCambiarContrasena],
  usuario.cambiarContrasena
)
router.post(
  "/usuarios/recuperar/contrasena",
  [usuario.validacionRecuperarContrasena, validateMiddleware()],
  usuario.recuperacionContrasena
)

router.post(
  "/usuarios/crear",
  [
    authMiddleware, 
    usuario.validacionCrearUsuario,
    validateMiddleware({
      modulo: "Usuarios",
      submodulo: "Listado de usuarios",
      accion: "C",
    })
  ],
  usuario.crearUsuario
)

router.patch(
  "/usuarios/actualizar",
  [
    authMiddleware, 
    usuario.validacionActualizarUsuario,
    validateMiddleware({
      modulo: "Usuarios",
      submodulo: "Listado de usuarios",
      accion: "U",
    })
  ],
  usuario.actualizarUsuario
)

router.delete(
  "/usuarios/eliminar",
  [
    authMiddleware, 
    usuario.validacionBorrarUsuario,
    validateMiddleware({
      modulo: "Usuarios",
      submodulo: "Listado de usuarios",
      accion: "D",
    })
  ],
  usuario.borrarUsuario
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

/*************************************
 *
 * * Rutas referentes a Ventanillas
 *
 */
const ventanillas = require("../controllers/ventanilla-controller")
router.post(
  "/ventanillas/crear",
  [
    authMiddleware, 
    ventanillas.validacionListarVentanilla,
    validateMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "C",
    })
  ],
  ventanillas.crearVentanilla
)

router.get(
  "/ventanillas/listar",
  [
    authMiddleware, 
    ventanillas.validacionListarVentanilla,
    validateMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "R",
    })
  ],
  ventanillas.listarVentanilla
)

router.patch(
  "/ventanillas/actualizar",
  [
    authMiddleware, 
    ventanillas.validacionListarVentanilla,
    validateMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "U",
    })
  ],
  ventanillas.actualizarVentanilla
)

router.delete(
  "/ventanillas/eliminar",
  [
    authMiddleware, 
    ventanillas.validacionListarVentanilla,
    validateMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "D",
    })
  ],
  ventanillas.borrarVentanilla
)


module.exports = router
