'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Usuarios", "escuela_id", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
        references: {
          model: "Escuelas",
          key: "id",
        }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Usuarios", "escuela_id");
  }
};
