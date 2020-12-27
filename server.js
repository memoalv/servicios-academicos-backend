const { app } = require("./app")

/**
 * Start application's web server
 */
const port = 3000
const server = require("http")
  .createServer(app)
  .listen(port, () => {
    console.log("Server listening on port", port)
  })
