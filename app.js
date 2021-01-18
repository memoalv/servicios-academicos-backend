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
app.use(bodyParser.json());

/**
 * Load application routes
 */
const routes = require("./routes/index");
app.use("/", routes);

module.exports = {
  app
}