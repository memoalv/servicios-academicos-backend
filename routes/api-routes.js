"use strict";

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const validReqMiddleware = require("../middleware/validate-request-middleware");
const { CrudController } = require("../controllers/crud-controller");
const { body, query } = require("express-validator");

const usuario = require("../controllers/user-controller");
router.post("/signup", usuario.validacionSignUp, usuario.signUp);
router.post("/login", usuario.validacionLogIn, usuario.logIn);
router.post(
  "/usuarios/cambiar_contrasena",
  [authMiddleware, usuario.validacionCambiarContrasena],
  usuario.cambiarContrasena
);

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
    ventanillas.validacionListarVentanilla,
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
    ventanillas.validacionListarVentanilla,
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
    ventanillas.validacionListarVentanilla,
    validReqMiddleware({
      modulo: "Ventanillas",
      submodulo: "Listado de ventanillas",
      accion: "D",
    }),
  ],
  ventanillas.borrarVentanilla
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
const crudProgramas = new CrudController("Programa", "programa");
router.post(
  "/programas/crear",
  [
    authMiddleware,
    [body("programa").not().isEmpty().trim()],
    validReqMiddleware({
      modulo: "Programas",
      submodulo: "Listado de programas",
      accion: "C",
    }),
  ],
  crudProgramas.create.bind(crudProgramas)
);
router.get(
  "/programas/listar",
  [
    query("pagina").not().isEmpty().isInt(),
    query("resultados_por_pagina").not().isEmpty().isInt(),
    query("programa").trim(),
  ],
  crudProgramas.read.bind(crudProgramas)
);
router.delete(
  "/programas/eliminar",
  [
    authMiddleware,
    [body("id").not().isEmpty().isInt()],
    validReqMiddleware({
      modulo: "Programas",
      submodulo: "Listado de programas",
      accion: "D",
    }),
  ],
  crudProgramas.delete.bind(crudProgramas)
);

router.patch(
  "/programas/actualizar",
  [
    authMiddleware,
    [body("id").not().isEmpty().isInt(), body("programa").not().isEmpty().trim()],
    validReqMiddleware({
      modulo: "Programas",
      submodulo: "Listado de programas",
      accion: "U",
    }),
  ],
  crudProgramas.update.bind(crudProgramas)
);

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
const crudInstitutos = new CrudController("Instituto", "instituto");
router.post(
  "/institutos/crear",
  [
    authMiddleware,
    [body("instituto").not().isEmpty().trim()],
    validReqMiddleware({
      modulo: "Institutos",
      submodulo: "Listado de institutos",
      accion: "C",
    }),
  ],
  crudInstitutos.create.bind(crudInstitutos)
);
router.get(
  "/institutos/listar",
  [
    query("pagina").not().isEmpty().isInt(),
    query("resultados_por_pagina").not().isEmpty().isInt(),
    query("instituto").trim(),
  ],
  crudInstitutos.read.bind(crudInstitutos)
);
router.delete(
  "/institutos/eliminar",
  [
    authMiddleware,
    [body("id").not().isEmpty().isInt()],
    validReqMiddleware({
      modulo: "Institutos",
      submodulo: "Listado de institutos",
      accion: "D",
    }),
  ],
  crudInstitutos.delete.bind(crudInstitutos)
);
router.patch(
  "/institutos/actualizar",
  [
    authMiddleware,
    [body("id").not().isEmpty().isInt(), body("instituto").not().isEmpty().trim()],
    validReqMiddleware({
      modulo: "Institutos",
      submodulo: "Listado de institutos",
      accion: "U",
    }),
  ],
  crudInstitutos.update.bind(crudInstitutos)
);

/*************************************
 *
 * * Rutas referentes a ESCUELAS
 *
 */
const crudEscuelas = new CrudController("Escuela", "escuela");
router.post(
  "/escuelas/crear",
  [
    authMiddleware,
    ventanillas.validacionCrearVentanilla,
    validReqMiddleware({
      modulo: "Escuelas",
      submodulo: "Listado de escuelas",
      accion: "C",
    }),
  ],
  crudEscuelas.create.bind(crudEscuelas)
);
router.get(
  "/escuelas/listar",
  [
    [
      [
        query("pagina").not().isEmpty().isInt(),
        query("resultados_por_pagina").not().isEmpty().isInt(),
        query("escuela").trim(),
      ],
    ],
  ],
  crudEscuelas.read.bind(crudEscuelas)
);
router.patch(
  "/escuelas/actualizar",
  [
    authMiddleware,
    ventanillas.validacionActualizarVentanilla,
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
    ventanillas.validacionBorrarVentanilla,
    validReqMiddleware({
      modulo: "Escuelas",
      submodulo: "Listado de escuelas",
      accion: "D",
    }),
  ],
  crudEscuelas.delete.bind(crudEscuelas)
);

/*************************************
 *
 * * Rutas referentes a DIAS INHABILES
 *
 * Aqui no se actualizarán registros. Solo se listarán, crearán y borrarán.
 */
const crudDiasInhabiles = new CrudController("DiasInhabiles", "dia");
router.post(
  "/dias_inhabiles/crear",
  [
    authMiddleware,
    [body("dia").not().isEmpty().isInt().isIn([1, 2, 3, 4, 5, 6, 7])],
    validReqMiddleware(null, "Admin"),
  ],
  crudDiasInhabiles.create.bind(crudDiasInhabiles)
);
router.get(
  "/dias_inhabiles/listar",
  [
    authMiddleware,
    [[query("pagina").not().isEmpty().isInt(), query("resultados_por_pagina").not().isEmpty().isInt()]],
    validReqMiddleware(null, "Admin"),
  ],
  crudDiasInhabiles.read.bind(crudDiasInhabiles)
);
router.delete(
  "/dias_inhabiles/eliminar",
  [authMiddleware, [body("id").not().isEmpty().isInt()], validReqMiddleware(null, "Admin")],
  crudDiasInhabiles.delete.bind(crudDiasInhabiles)
);

/*************************************
 *
 * * Rutas referentes a FECHAS INHABILES
 *
 *  Aqui no se actualizarán registros. Solo se listarán, crearán y borrarán.
 */
const crudFechasInhabiles = new CrudController("FechasInhabiles", "fecha");
router.post(
  "/fechas_inhabiles/crear",
  [authMiddleware, [body("fecha").not().isEmpty().isDate()], validReqMiddleware(null, "Admin")],
  crudFechasInhabiles.create.bind(crudFechasInhabiles)
);
router.get(
  "/fechas_inhabiles/listar",
  [
    authMiddleware,
    [[query("pagina").not().isEmpty().isInt(), query("resultados_por_pagina").not().isEmpty().isInt()]],
    validReqMiddleware(null, "Admin"),
  ],
  crudFechasInhabiles.read.bind(crudFechasInhabiles)
);
router.delete(
  "/fechas_inhabiles/eliminar",
  [authMiddleware, [body("id").not().isEmpty().isInt()], validReqMiddleware(null, "Admin")],
  crudFechasInhabiles.delete.bind(crudFechasInhabiles)
);

const reseravaciones = require('../controllers/reservaciones-controller');
router.get(
  "/reservaciones/listar",
  [
    authMiddleware,
    reseravaciones.validacionListar,
    validReqMiddleware(),
  ],
  reseravaciones.listar,
);

router.post(
  "/reservaciones/crear",
  [
    authMiddleware,
    reseravaciones.validacionCrear,
    validReqMiddleware(),
  ],
  reseravaciones.crear,
);

router.patch(
  "/reservaciones/actualizar",
  [
    authMiddleware,
    reseravaciones.validacionActualizar,
    validReqMiddleware(),
  ],
  reseravaciones.actualizar,
);

router.delete(
  "/reservaciones/eliminar",
  [
    authMiddleware,
    reseravaciones.validacionEliminar,
    validReqMiddleware(),
  ],
  reseravaciones.eliminar,
);

module.exports = router;
