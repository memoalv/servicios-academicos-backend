const models = require("./models");
const usuario = require("./models/usuario");
const Usuario = models.Usuario;
const Instituto = models.Instituto;
const Programa = models.Programa;
const TipoUsuario = models.TipoUsuario;
const crypto = require('crypto')

Instituto.create({
  instituto: "IIT",
})
  .then((newCompany) => {
    // The get() function allows you to recover only the DataValues of the object
    console.log(newCompany.get());
  })
  .catch((err) => {
    console.log("Error while company creation : ", err);
  });

Programa.create({
  programa: "Ingenieria en sistemas computacionales",
})
  .then((newCompany) => {
    // The get() function allows you to recover only the DataValues of the object
    console.log(newCompany.get());
  })
  .catch((err) => {
    console.log("Error while programa creation : ", err);
  });

TipoUsuario.create({
  tipo: "UACJ",
})
  .then((newCompany) => {
    // The get() function allows you to recover only the DataValues of the object
    console.log(newCompany.get());
  })
  .catch((err) => {
    console.log("Error while tipo creation : ", err);
  });

  const salt = crypto.randomBytes(32).toString('hex'); 
  const contrasena = crypto.pbkdf2Sync('secret', salt, 10000, 64, 'sha512').toString('hex');


Usuario.create({
  nombre: "memo",
  matricula: null,
  correo: "test@test.com",
  contrasena: contrasena,
  sal: salt,
  tipo_usuario_id: 1,
  instituto_id: 1,
  programa_id: 1,
})
.then(newUser => {
  console.log(newUser.get());
})
.catch((err) => {
  console.log("Error while user creation : ", err);
});