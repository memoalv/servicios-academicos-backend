"use strict";

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const validReqMiddleware = require("../middleware/validate-request-middleware");
const { CrudController } = require("../controllers/crud-controller");
const { body, query } = require("express-validator");

const crudEscuelas = new CrudController("Escuela", "escuela");
router.post(
  "/escuelas/crear",
  [
    authMiddleware,
    [body("escuela").isAlphanumeric().not().isEmpty().trim()],
    validReqMiddleware({
      modulo: "Escuelas",
      submodulo: "Listado de escuelas",
      accion: "C",
    }),
  ],
  crudEscuelas.create.bind(crudEscuelas)
);
router.patch(
  "/escuelas/actualizar",
  [
    authMiddleware,
    [body("id").not().isEmpty().isInt(), body("escuela").not().isEmpty().trim()],
    validReqMiddleware({
      modulo: "Escuelas",
      submodulo: "Listado de escuelas",
      accion: "U",
    }),
  ],
  crudEscuelas.update.bind(crudEscuelas)
);
router.delete(
  "/escuelas/eliminar",
  [
    authMiddleware,
    [body("id").not().isEmpty().isInt()],
    validReqMiddleware({
      modulo: "Escuelas",
      submodulo: "Listado de escuelas",
      accion: "D",
    }),
  ],
  crudEscuelas.delete.bind(crudEscuelas)
);


const crudDiasInhabiles = new CrudController("DiasInhabiles", "dia");
router.post(
  "/dias_inhabiles/crear",
  [
    authMiddleware,
    [body("dia").not().isEmpty().isInt(), body("activo").not().isEmpty().isInt().isIn([1])],
    validReqMiddleware(null, "Admin"),
  ],
  crudDiasInhabiles.create.bind(crudDiasInhabiles)
);
/*************************************
 *
 * * Rutas referentes a USUARIOS
 *
 */
const usuario = require("../controllers/user-controller");
router.post("/signup", usuario.validacionSignUp, usuario.signUp);
router.post("/login", usuario.validacionLogIn, usuario.logIn);
router.post(
  "/usuarios/cambiar_contrasena",
  [authMiddleware, usuario.validacionCambiarContrasena],
  usuario.cambiarContrasena
);
router.post(
  "/usuarios/recuperar/contrasena",
  [usuario.validacionRecuperarContrasena, validReqMiddleware()],
  usuario.recuperacionContrasena
);

router.post(
  "/usuarios/crear",
  [
    authMiddleware, 
    usuario.validacionCrearUsuario,
    validReqMiddleware({
      modulo: "Usuarios",
      submodulo: "Listado de usuarios",
      accion: "C",
    })
  ],
  usuario.crearUsuario
);

router.patch(
  "/usuarios/actualizar",
  [
    authMiddleware, 
    usuario.validacionActualizarUsuario,
    validReqMiddleware({
      modulo: "Usuarios",
      submodulo: "Listado de usuarios",
      accion: "U",
    })
  ],
  usuario.actualizarUsuario
);

router.delete(
  "/usuarios/eliminar",
  [
    authMiddleware, 
    usuario.validacionBorrarUsuario,
    validReqMiddleware({
      modulo: "Usuarios",
      submodulo: "Listado de usuarios",
      accion: "D",
    })
  ],
  usuario.borrarUsuario
);


/*************************************
 *
 * * Rutas referentes a PROGRAMAS
 *
 */
const programas = require("../controllers/programs-controller");
router.post(
  "/programas/crear", 
  [
    authMiddleware, 
    programas.validacionCrearPrograma, 
    validReqMiddleware({
      modulo: "Programas",
      submodulo: "Listado de programas",
      accion: "C",
    })
  ],
  programas.crearPrograma
);

router.delete(
  "/programas/eliminar",
  [
    authMiddleware, 
    programas.validacionEliminarPrograma, 
    validReqMiddleware({
      modulo: "Programas",
      submodulo: "Listado de programas",
      accion: "D",
    })
  ],
  programas.eliminarPrograma
);

router.patch(
  "/programas/actualizar",
  [
    authMiddleware,
    programas.validacionActualizarPrograma, 
    validReqMiddleware({
      modulo: "Programas",
      submodulo: "Listado de programas",
      accion: "C",
    })
  ],
  programas.actualizarPrograma
);

router.get("/programas/listar", [programas.validacionListarProgramas], programas.listarProgramas);

/*************************************
 *
 * * Rutas referentes a TRAMITES
 *
 */
const tramites = require("../controllers/tramites-controller")
router.post(
  "/tramites/crear",
  [
    authMiddleware,
    tramites.validacionCrear, 
    validReqMiddleware({
    modulo: "Trámites",
    submodulo: "Listado de trámites",
    accion: "C",
   })
  ],
  tramites.crear
);

router.delete(
  "/tramites/eliminar",
  [
    authMiddleware, 
    tramites.validacionEliminar,
    validReqMiddleware({
      modulo: "Trámites",
      submodulo: "Listado de trámites",
      accion: "D",
    })
  ],
  tramites.eliminar
);

router.patch(
  "/tramites/actualizar",
  [
    authMiddleware, 
    tramites.validacionActualizar,
    validReqMiddleware({
      modulo: "Trámites",
      submodulo: "Listado de trámites",
      accion: "U",
    })
  ],
  tramites.actualizar
);

router.get("/tramites/listar", [tramites.validacionListar, validReqMiddleware()], tramites.listar);

/*************************************
 *
 * * Rutas referentes a INSTITUTOS
 *
 */
const institutos = require("../controllers/campus-controller");
router.post("/institutos/crear", [authMiddleware, institutos.validacionCrearInstituto], institutos.crearInstituto);
router.delete(
  "/institutos/eliminar",
  [authMiddleware, institutos.validacionEliminarInstituto],
  institutos.eliminarInstituto
);
router.patch(
  "/institutos/actualizar",
  [authMiddleware, institutos.validacionActualizarInstituto],
  institutos.actualizarInstituto
);
router.get("/institutos/listar", [institutos.validacionListarInstitutos], institutos.listarInstitutos);

/*************************************
 *
 * * Rutas referentes a Ventanillas
 *
 */
const ventanillas = require("../controllers/ventanilla-controller");
router.post(
  "/ventanillas/crear",
  [
    authMiddleware,
    ventanillas.validacionCrearVentanilla,
    validReqMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "C",
    }),
  ],
  ventanillas.crearVentanilla
);

router.get(
  "/ventanillas/listar",
  [
    authMiddleware,
    ventanillas.validacionListarVentanilla,
    validReqMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "R",
    }),
  ],
  ventanillas.listarVentanilla
);

router.patch(
  "/ventanillas/actualizar",
  [
    authMiddleware,
    ventanillas.validacionActualizarVentanilla,
    validReqMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "U",
    }),
  ],
  ventanillas.actualizarVentanilla
);

router.delete(
  "/ventanillas/eliminar",
  [
    authMiddleware,
    ventanillas.validacionBorrarVentanilla,
    validReqMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "D",
    }),
  ],
  ventanillas.borrarVentanilla
);

const reseravaciones = require('../controllers/reservaciones-controller');
router.get(
  "/reservaciones/listar",
  [
    authMiddleware,
    reseravaciones.listar,
    validReqMiddleware(),
  ],
)

module.exports = router;
