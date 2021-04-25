"use strict";
const jwt = require("jsonwebtoken");
const { validationResult, body, query } = require("express-validator");
const mailer = require("../services/mail-service");
const authService = require("../services/auth-service");
const crypto = require("crypto");
const db = require("../models");
const Usuario = db.Usuario;
const Roles = db.Roles;
const RolesUsuarios = db.RolesUsuarios;

//Validaciones

const validacionLogIn = [body("correo").isEmail(), body("contrasena").not().isEmpty().not().isBoolean()];

const validacionPasswordReset = [body("correo").isEmail()];

const validacionSignUp = [
  body("tipo_usuario").isIn(["Incorporado", "Alumno"]),
  body("matricula").optional().isInt(),
  body("correo").optional().isEmail().normalizeEmail(),
  body("nombre").not().isEmpty().trim(),
  body("instituto").optional().not().isEmpty().trim(),
  body("programa").optional().not().isEmpty().trim(),
];

const validacionCambiarContrasena = [
  body("contrasena_anterior").not().isEmpty().not().isBoolean(),
  body("contrasena_nueva").not().isEmpty().not().isBoolean(),
  body("contrasena_confirmacion").not().isEmpty().not().isBoolean(),
];

const validacionCrearUsuario = [
  body("nombre").not().isEmpty().custom((value) => {
    return value.match(/([A-Za-z ])\w+/);
  }),
  body("correo").not().isEmpty().isEmail(),
  body("tipo_usuario").not().isEmpty(),
];

const validacionRecuperarContrasena = [
  body("correo").not().isEmpty().isEmail(),
];

const validacionActualizarUsuario = [
  query("id").not().isEmpty().isInt(),
  body("nombre").not().isEmpty().custom((value) => {
    return value.match(/([A-Za-z ])\w+/);
  })
];

const validacionBorrarUsuario = [
  query("id").not().isEmpty().isInt(),
  body("nombre").not().isEmpty().custom((value) => {
    return value.match(/([A-Za-z ])\w+/);
  })
];

//Métodos

/**
 * Funcion para iniciar sessión en el sistema
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
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
      mensaje: "Usuario o contraseña incorrecta",
    });
  }

  const contrasenaRecibida = String(req.body.contrasena);
  const contraHasheada = crypto.pbkdf2Sync(contrasenaRecibida, usuario.sal, 10000, 64, "sha512").toString("hex");
  if (usuario.contrasena !== contraHasheada) {
    return res.status(401).json({
      mensaje: "Usuario o contraseña incorrecta",
    });
  }

  if (!usuario.inicio_sesion) {
    const [numberOfAffectedRows, affectedRows] = await Usuario.update(
      {
        inicio_sesion: true,
      },
      {
        where: {
          correo: usuario.correo,
        },
        returning: true,
      }
    );

    if (affectedRows !== 1) {
      return res.status(500).json();
    }
  }

  const { grupos, permisos } = authService.parsePermisos(usuario.roles);
  const tokenClaims = {
    nombre: usuario.nombre,
    usuario_id: usuario.id,
    usuario: req.body.correo,
    grupos: grupos,
    permisos: permisos,
  };
  const token = jwt.sign(tokenClaims, process.env.APP_SECRET, {
    expiresIn: "12h",
    issuer: "servicios-academicos-backend",
  });

  return res.status(200).json({
    mensaje: "Correcto",
    token: token,
  });
};

/**
 * Funcion singUp. Maneja el registro de nuevos usuarios al sistema
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
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

  // creacion de contrasena, sal para el usuario
  const { contrasena, sal, contrasenaHasheada } = authService.generarPassword();
  nuevoUsuario.sal = sal;
  nuevoUsuario.contrasena = contrasenaHasheada;
  nuevoUsuario.inicio_sesion = false;
  nuevoUsuario.instituto_id = nuevoUsuario.instituto;

  clausulaWhere = {};
  if (nuevoUsuario.tipo_usuario == "Alumno") {
    clausulaWhere.rol = "Alumno";
  } else {
    clausulaWhere.rol = "Incorporado";
  }

  // asignacion de rol al usuario
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
        html: `<h1>Hola ${nuevoUsuario.nombre}, ¡te registraste correctamente!</h1><p>Tu contraseña es: ${contrasena}</p><p>Te recomendamos cambiarla inmediatamente por una propia.</p>`,
      });
    } catch (error) {
      console.error(error);
      throw new Error("correo");
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    if (error.errors) {
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

/**
 * Método utilizado para actualizar la contraseña una vez iniciado
 * sesión
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const cambiarContrasena = async (req, res) => {
  try {
    var usuario = await authService.datosAutenticacion(req.tokenParseado.usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  const contrasenaRecibida = String(req.body.contrasena_anterior);
  const contraHasheada = crypto.pbkdf2Sync(contrasenaRecibida, usuario.sal, 10000, 64, "sha512").toString("hex");
  if (usuario.contrasena !== contraHasheada) {
    return res.status(400).json({
      mensaje: "Contraseña anterior incorrecta",
    });
  }

  if (String(req.body.contrasena_nueva) !== String(req.body.contrasena_confirmacion)) {
    return res.status(400).json({
      mensaje: "Contraseñas no coinciden",
    });
  }

  const nuevaSal = crypto.randomBytes(32).toString("hex");
  const nuevaContraHasheada = crypto.pbkdf2Sync(req.body.contrasena_nueva, nuevaSal, 10000, 64, "sha512").toString("hex");

  const [numberOfAffectedRows, affectedRows] = await Usuario.update(
    {
      contrasena: nuevaContraHasheada,
      sal: nuevaSal,
    },
    {
      where: {
        correo: req.tokenParseado.usuario,
      },
      returning: true,
    }
  );

  if (affectedRows === 1) {
    return res.status(200).json({
      mensaje: "Contraseña actualizada correctamente",
    });
  }

  return res.status(500).json({
    mensaje: "Ocurrió un error al actualizar la contraseña",
  });
};

/**
 * Crea una nueva contraseña para el usuario
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const recuperacionContrasena = async (req, res) => {
  try {
    usuario = await Usuario.findOne({
      where: {
        correo: req.body.correo,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      mensaje: "Ocurrió un error al consultar el usuario",
    });
  }

  if (!usuario) {
    return res.status(500).json({
      mensaje: "Usuario inexistente, favor de verifcar",
    });
  }
  const { contrasena, sal, contrasenaHasheada } = authService.generarPassword();
  
  try {
    const [numberOfAffectedRows, affectedRows] = await Usuario.update(
      {
        contrasena: contrasenaHasheada,
        sal: sal,
      },
      {
        where: {
          correo: req.body.correoo,
        },
        returning: true,
      }
    );
    
    if (affectedRows !== 1) {
      return res.status(500).json({
        mensaje: "Ocurrió un error al actualizar la contraseña",
      });
    }

    await mailer.sendMail({
      to: usuario.correo,
      from: "noreplygreenhouse@gmail.com",
      subject: "Recuperación de la contraseña",
      html: `<h1>Hola ${usuario.nombre}, ¡se ha cambiado tu contraseña correctamente!</h1><p>Tu contraseña es: ${contrasena}</p><p>Te recomendamos cambiarla inmediatamente por una propia.</p>`,
    });
    
    return res.status(200).json({
      mensaje: "Se ha enviado un correo con la información para verificar",
    });

    
  } catch (error) {
    console.error(error);
    throw new Error("correo");
  }
};

/**
 * Edita el nombre del usuario
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
 const actualizarUsuario = async (req, res) => {
  try {
    usuario = await Usuario.findOne({
      where: {
        id: req.query.id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      mensaje: "Ocurrió un error al consultar el usuario",
    });
  }

  if (!usuario) {
    return res.status(500).json({
      mensaje: "Usuario inexistente, favor de verifcar",
    });
  }

  
  try {
    const [numberOfAffectedRows, affectedRows] = await Usuario.update(
      {
        nombre: req.body.nombre
      },
      {
        where: {
          id: req.body.id,
        },
        returning: true,
      }
    );
    
    if (affectedRows !== 1) {
      return res.status(500).json({
        mensaje: "Ocurrió un error al actualizar la información",
      });
    }
    
    return res.status(200).json({
      mensaje: "Información actualizado correctamente",
    });

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensaje: "Ocurrió un error al actualizar la información",
    });
  }
};

/**
 * Crea un usuario administrativo
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
const crearUsuario = async (req, res) => {
  const { contrasena, sal, contrasenaHasheada } = authService.generarPassword();
  const nuevoUsuario = {
    nombre: req.body.nombre,
    correo: req.body.correo,
    contrasena: contrasenaHasheada,
    sal: sal,
  };
  
  clausulaWhere = {};
  if (req.body.tipo_usuario == "Admin") {
    clausulaWhere.rol = "Admin";
  } else {
    clausulaWhere.rol = "Ventanilla";
  }

  // asignacion de rol al usuario
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
    const usuarioGuardado = await Usuario.create(
      nuevoUsuario, 
      {
        transaction: t,
      }
    );

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
        to: req.body.correo,
        from: "noreplygreenhouse@gmail.com",
        subject: "Se te ha creado tu ustu correctamente",
        html: `<h1>Hola ${nuevoUsuario.nombre}, ¡te registraste correctamente!</h1><p>Tu contraseña es: ${contrasena}</p><p>Te recomendamos cambiarla inmediatamente por una propia.</p>`,
      });
    } catch (error) {
      console.error(error);
      throw new Error("correo");
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
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

/**
 * Método para la actualización de una Ventanilla
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Express.Response}
 */
 const borrarUsuario = async (req, res) => {
  let existeUsuario = false;
  try {
    existeUsuario = await Usuario.findOne({
      where: {
        id: req.query.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json();
  }

  if (!existeUsuario) {
    return res.status(400).json({
      mensaje: "La ventanilla no existe",
    });
  }

  try {
    await Usuario.destroy({
      where: {
        id: req.query.id
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  return res.status(200).json({
    mensaje: "El usuario se ha borrado correctamente",
  });
};


/**
 * tipos de usuarios:
 Incorporado  -- se crean en signup
 Alumno       -- igual

 El admin los va a crear
 * Ventanilla - determinar que ventanilla sera
    Admin
 */

module.exports = {
  validacionLogIn,
  logIn,
  validacionSignUp,
  signUp,
  validacionCambiarContrasena,
  cambiarContrasena,
  validacionRecuperarContrasena,
  recuperacionContrasena,
  validacionActualizarUsuario,
  actualizarUsuario,
  validacionCrearUsuario,
  crearUsuario,
  validacionBorrarUsuario,
  borrarUsuario
};
