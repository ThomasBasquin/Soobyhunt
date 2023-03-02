const config = require("../controllers/config");

module.exports = (app) => {
  app.get("/config", config.get);
};
