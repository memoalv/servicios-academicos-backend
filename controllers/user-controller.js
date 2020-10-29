"use strict";
const db = require("../models");
const Usuario = db.Usuario;
const Roles = db.Roles;
const RolesUsuarios = db.RolesUsuarios;
const crypto = require("crypto");
const mailer = require("../services/mail-service");

const signUp = async (req, res) => {
  const nuevoUsuario = req.body;

  // extraccion de campos para el creado del usuario
  let clausulaWhere = {};
  let correoUsuario = "";
  if (nuevoUsuario.tipo_usuario == "Alumno") {
    clausulaWhere.matricula = nuevoUsuario.matricula;
    correoUsuario = `${nuevoUsuario.matricula}@alumnos.uacj.mx`;
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

module.exports = {
  signUp,
};
