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
    [body("escuela").isAlphanumeric().not().isEmpty().trim()],
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
    authMiddleware,
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

module.exports = router;
