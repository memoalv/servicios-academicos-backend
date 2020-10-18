require("dotenv").config(); // load env variables

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mariadb",
    logging: console.log,
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
    },
    timezone: "America/Denver", //for writing to database
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mariadb",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mariadb",
  },
};
