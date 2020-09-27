const app = require("express")();
var server = require("http").createServer(app);

/**
 * Handle uncaught errors to prevent application crash
 */
require('./services/crash-handler-service')();

/**
 * Load application middleware
 */
app.use(require("cors")());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
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

/**
 * Start application's web server
 */
const port = 3000;
server.listen(port, () => {
  console.log("Server listening on port", port);
});
