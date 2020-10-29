"use strict";

/**
 * Se agrega la columna de inicio_sesion. Esta columna va a ser para
 * identificar a un usuario que no haya iniciado sesion a un día de  -- tiempo por definirse
 * su registro a través de un cron.
 *
 * Esto se necesita identificar porque puede darse el caso de que un
 * usuario se equivoque de matricula o correo y inhabilite ese usuario
 * para alguien mas para siempre.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Usuarios", "inicio_sesion", {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Usuarios", "inicio_sesion");
  },
};
