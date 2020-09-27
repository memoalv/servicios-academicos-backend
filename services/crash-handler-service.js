/**
 * Registers uncaught errors that may crash application.
 * 
 * Register any other uncaught errors thay may crash the app here
 */
const crashHandler = () => {
  process.on("uncaughtException", (error) => {
    console.error(error);
  });

  process.on("unhandledRejection", (error, promise) => {
    console.error("Unhandled promise rejection: ", promise);
    console.error("Error: ", error);
  });
};

module.exports = crashHandler;
