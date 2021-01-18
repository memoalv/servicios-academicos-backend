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
    seederStorage: "sequelize"
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_TEST_HOST,
    dialect: "mariadb",
    logging: console.log,
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
    },
    timezone: "America/Denver", //for writing to database
    seederStorage: "sequelize"
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mariadb",
  },
};
