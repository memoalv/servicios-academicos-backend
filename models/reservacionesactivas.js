"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReservacionesActivas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  ReservacionesActivas.init(
    {
      tramite_id: {
        type: DataTypes.INTEGER,
        field: "tramite_id",
      },
      ventanilla_id: {
        type: DataTypes.INTEGER,
        field: "ventanilla_id",
      },
      horas_atencion:{
        type: DataTypes.INTEGER,
        field: "horas_atencion",
      },
      duracion:{
        type: DataTypes.INTEGER,
        field: "duracion",
      },
      fecha_fin:{
        type: DataTypes.DATE,
        field: "fecha_fin",
      },
      fecha_inicio:{
        type: DataTypes.DATE,
        field: "fecha_inicio",
      },


    },
    {
      sequelize,
      modelName: "ReservacionesActivas",
      timestamps: false
    }
  );
  return ReservacionesActivas;
};
