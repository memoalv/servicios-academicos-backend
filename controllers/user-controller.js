"use strict";
const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const mailer = require("../services/mail-service");
const authService = require("../services/auth-service");
const crypto = require("crypto");
const db = require("../models");
const Usuario = db.Usuario;
const Roles = db.Roles;
const RolesUsuarios = db.RolesUsuarios;

const validacionLogIn = [body("correo").isEmail(), body("contrasena").not().isEmpty().not().isBoolean()];
const logIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let usuario = null;
  try {
    usuario = await authService.datosAutenticacion(req.body.correo);
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  // si no existe el usuario se regresa mensaje criptico
  // para engañar al enemigo
  if (!usuario) {
    return res.status(401).json({
      mensaje: "Contraseña incorrecta",
    });
  }

  const contrasenaRecibida = String(req.body.contrasena);
  const contraHasheada = crypto.pbkdf2Sync(contrasenaRecibida, usuario.sal, 10000, 64, "sha512").toString("hex");
  if (usuario.contrasena !== contraHasheada) {
    return res.status(401).json({
      mensaje: "Contraseña incorrecta",
    });
  }

  const tokenClaims = authService.parsePermisos(usuario.roles);
  const token = jwt.sign(tokenClaims, process.env.APP_SECRET, {
    expiresIn: "12h",
    issuer: "servicios-academicos-backend"
  });

  return res.status(200).json({
    mensaje: "Correcto",
    token: token,
  });
};

const validacionSignUp = [
  body("tipo_usuario").isIn(["Incorporado", "Alumno"]),
  body("matricula").optional().isInt(),
  body("correo").optional().isEmail().normalizeEmail(),
  body("nombre").not().isEmpty().trim(),
  body("instituto").optional().not().isEmpty().trim(),
  body("programa").optional().not().isEmpty().trim(),
];
/**
 * Funcion singUp. Maneja el registro de nuevos usuarios al sistema
 *
 * @param {*} req
 * @param {*} res
 */
const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const nuevoUsuario = req.body;

  // extraccion de campos para el creado del usuario
  let clausulaWhere = {};
  let correoUsuario = "";
  if (nuevoUsuario.tipo_usuario == "Alumno") {
    clausulaWhere.matricula = nuevoUsuario.matricula;
    correoUsuario = `al${nuevoUsuario.matricula}@alumnos.uacj.mx`;
    nuevoUsuario.correo = correoUsuario;
  } else {
    clausulaWhere.correo = nuevoUsuario.correo;
    correoUsuario = nuevoUsuario.correo;
  }

  // validacion de que el usuario no exista
  let existeUsuario = false;
  try {
    existeUsuario = await Usuario.findOne({
      where: clausulaWhere,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  // si existe se regresa error
  if (!!existeUsuario) {
    return res.status(400).json({
      mensaje: "Usuario ya existe",
    });
  }

  // falta crear contrasena, sal y asociar a su rol correspondiente
  // enviar la contraseña al correo
  const contrasenaTemporal = Math.random().toString(36).slice(-11);
  nuevoUsuario.sal = crypto.randomBytes(32).toString("hex");
  nuevoUsuario.contrasena = crypto
    .pbkdf2Sync(contrasenaTemporal, nuevoUsuario.sal, 10000, 64, "sha512")
    .toString("hex");
  nuevoUsuario.inicio_sesion = false;
  nuevoUsuario.instituto_id = nuevoUsuario.instituto;

  clausulaWhere = {};
  if (nuevoUsuario.tipo_usuario == "Alumno") {
    clausulaWhere.rol = "Alumno";
  } else {
    clausulaWhere.rol = "Incorporado";
  }

  let rolUsuario = null;
  try {
    rolUsuario = await Roles.findOne({
      attributes: ["id"],
      where: clausulaWhere,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  // * Si falla el correo no se creara el usuario
  const t = await db.sequelize.transaction();
  try {
    // guardado de usuario
    const usuarioGuardado = await Usuario.create(nuevoUsuario, {
      transaction: t,
    });

    // asignacion de rol
    await RolesUsuarios.create(
      {
        rol_id: rolUsuario.id,
        usuario_id: usuarioGuardado.id,
      },
      {
        transaction: t,
      }
    );

    // envio de correo con contraseña temporal
    try {
      await mailer.sendMail({
        to: correoUsuario,
        from: "noreplygreenhouse@gmail.com",
        subject: "Te registraste correctamente",
        html: `<h1>Hola ${nuevoUsuario.nombre}, ¡te registraste correctamente!</h1><p>Tu contraseña es: ${contrasenaTemporal}</p><p>Te recomendamos cambiarla inmediatamente por una propia.</p>`,
      });
    } catch (error) {
      throw new Error("correo");
    }

    await t.commit();
  } catch (error) {
    if (error.errors) {
      await t.rollback();
      // si el correo no es valido se regresa error correspondiente
      const notValidEmailError = error.errors.filter((error) => {
        return error.validatorName == "isEmail" ? true : false;
      });
      if (!!notValidEmailError) {
        return res.status(400).json({
          mensaje: "Correo no válido",
        });
      }
    }
    if (error.message == "correo") {
      return res.status(500).json({
        mensaje: "Ocurrió un error al enviar el correo",
        msj: "correo",
      });
    }

    console.error(error);
    return res.status(500).json();
  }

  return res.status(200).json({
    mensaje: "Usuario creado correctamente",
  });
};

const validacionCambiarContrasena = [
  body("contrasena_anterior").not().isEmpty().not().isBoolean(),
  body("contrasena").not().isEmpty().not().isBoolean(),
  body("contrasena_confirmacion").not().isEmpty().not().isBoolean(),
];
const cambiarContrasena = (req, res) => {
  console.log(req.body);
  console.log(req.tokenParseado);

  return res.status(200).json();
};

module.exports = {
  validacionLogIn,
  logIn,
  validacionSignUp,
  signUp,
  validacionCambiarContrasena,
  cambiarContrasena,
};
