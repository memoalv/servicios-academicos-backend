"use strict";

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");

const user = require("../controllers/user-controller");
router.post("/signup", user.validacionSignUp, user.signUp);
router.post("/login", user.validacionLogIn, user.logIn);
router.post("/usuarios/cambiar_contrasena", [authMiddleware, user.validacionCambiarContrasena], user.cambiarContrasena);

module.exports = router;
