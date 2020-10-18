"use strict";
const crypto = require('crypto')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = crypto.randomBytes(32).toString('hex');
    await queryInterface.bulkInsert(
      "Usuarios",
      [
        {
          nombre: "Guillermo Alvarez",
          matricula: "157851",
          correo: "al157851@alumnos.uacj.mx",
          contrasena: crypto.pbkdf2Sync('password', salt, 10000, 64, 'sha512').toString('hex'),
          sal: salt,
          reset_token: null,
          tipo_usuario_id: 1,
          instituto_id: 1,
          programa_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "Valeria Gomez",
          matricula: "157852",
          correo: "al157852@alumnos.uacj.mx",
          contrasena: crypto.pbkdf2Sync('password', salt, 10000, 64, 'sha512').toString('hex'),
          sal: salt,
          reset_token: null,
          tipo_usuario_id: 2,
          instituto_id: 1,
          programa_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Usuarios", null, {});
  }
};
