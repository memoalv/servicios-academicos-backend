const app = require("express")();

/**
 * Handle uncaught errors to prevent application crash
 */
require('./services/crash-handler-service')();

/**
 * Load application middleware
 */
app.use(require("cors")());

const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * This middleware will serve to only authenticate API routes
 * examples found in /middleware/keycloak.js 
 */
// const { keycloak } = require('./middleware/keycloak');
// app.use(keycloak.middleware());

/**
 * Load application routes
 */
const routes = require("./routes/index");
app.use("/", routes);

module.exports = {
  app
}